import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import { Player } from '@people-power/shared';

export interface RealtimeEvent {
  type: string;
  data: any;
  timestamp: Date;
  playerId?: string;
  channelId?: string;
}

export interface ChannelSubscription {
  playerId: string;
  channelId: string;
  socketId: string;
  joinedAt: Date;
}

export interface LiveLeaderboard {
  type: string;
  period: string;
  entries: Array<{
    playerId: string;
    displayName: string;
    score: number;
    rank: number;
    change: number;
  }>;
  lastUpdated: Date;
}

export interface LiveCompetition {
  id: string;
  name: string;
  participants: number;
  timeRemaining: number;
  topPlayers: Array<{
    playerId: string;
    displayName: string;
    score: number;
  }>;
}

export class RealtimeService {
  private io: SocketIOServer;
  private pool: Pool;
  private jwtSecret: string;
  private connectedPlayers: Map<string, Set<string>> = new Map(); // playerId -> Set of socketIds
  private channelSubscriptions: Map<string, Set<string>> = new Map(); // channelId -> Set of socketIds
  private playerSockets: Map<string, string> = new Map(); // socketId -> playerId

  constructor(httpServer: HTTPServer, pool: Pool) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.pool = pool;
    this.jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
    
    this.setupSocketHandlers();
    this.startPeriodicUpdates();
  }

  private setupSocketHandlers(): void {
    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication token required'));
        }

        const decoded = jwt.verify(token, this.jwtSecret) as any;
        const player = await this.getPlayerById(decoded.playerId);
        
        if (!player) {
          return next(new Error('Player not found'));
        }

        socket.data.player = player;
        socket.data.playerId = player.id;
        next();
      } catch (error) {
        next(new Error('Invalid authentication token'));
      }
    });

    // Connection handler
    this.io.on('connection', (socket) => {
      const player = socket.data.player as Player;
      const playerId = player.id;
      
      console.log(`🔌 Player connected: ${player.displayName} (${socket.id})`);

      // Track connection
      if (!this.connectedPlayers.has(playerId)) {
        this.connectedPlayers.set(playerId, new Set());
      }
      this.connectedPlayers.get(playerId)!.add(socket.id);
      this.playerSockets.set(socket.id, playerId);

      // Join player to their personal channel
      socket.join(`player:${playerId}`);
      
      // Join to generation channel
      socket.join(`generation:${player.generation}`);
      
      // Join to rank channel
      socket.join(`rank:${player.rank}`);

      // Send initial data
      this.sendInitialData(socket, player);

      // Handle subscriptions
      socket.on('subscribe', async (data) => {
        await this.handleSubscription(socket, data);
      });

      socket.on('unsubscribe', (data) => {
        this.handleUnsubscription(socket, data);
      });

      // Handle game actions
      socket.on('game_action', async (data) => {
        await this.handleGameAction(socket, data);
      });

      // Handle chat messages
      socket.on('chat_message', async (data) => {
        await this.handleChatMessage(socket, data);
      });

      // Handle live events
      socket.on('join_competition', async (data) => {
        await this.handleJoinCompetition(socket, data);
      });

      socket.on('leave_competition', async (data) => {
        await this.handleLeaveCompetition(socket, data);
      });

      // Handle disconnection
      socket.on('disconnect', (reason) => {
        this.handleDisconnection(socket, reason);
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error(`Socket error for ${player.displayName}:`, error);
      });
    });
  }

  private async sendInitialData(socket: any, player: Player): Promise<void> {
    try {
      // Send player stats
      const stats = await this.getPlayerStats(player.id);
      socket.emit('player_stats', stats);

      // Send available missions
      const missions = await this.getAvailableMissions(player.id);
      socket.emit('missions_update', missions);

      // Send daily habits
      const habits = await this.getDailyHabits(player.id);
      socket.emit('habits_update', habits);

      // Send active competitions
      const competitions = await this.getActiveCompetitions();
      socket.emit('competitions_update', competitions);

      // Send leaderboard updates
      const leaderboards = await this.getLeaderboardUpdates();
      socket.emit('leaderboard_update', leaderboards);

      // Send online friends count
      const onlineFriends = await this.getOnlineFriends(player.id);
      socket.emit('friends_online', { count: onlineFriends.length });

    } catch (error) {
      console.error('Error sending initial data:', error);
      socket.emit('error', { message: 'Failed to load initial data' });
    }
  }

  private async handleSubscription(socket: any, data: any): Promise<void> {
    const { channelId, type } = data;
    const playerId = socket.data.playerId;

    try {
      // Validate subscription
      if (!this.canSubscribeToChannel(playerId, channelId, type)) {
        socket.emit('subscription_error', { 
          channelId, 
          error: 'Not authorized to subscribe to this channel' 
        });
        return;
      }

      // Add to channel
      socket.join(channelId);
      
      // Track subscription
      if (!this.channelSubscriptions.has(channelId)) {
        this.channelSubscriptions.set(channelId, new Set());
      }
      this.channelSubscriptions.get(channelId)!.add(socket.id);

      // Store subscription in database
      await this.pool.query(`
        INSERT INTO channel_subscriptions (player_id, channel_id, socket_id, joined_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (player_id, channel_id) 
        DO UPDATE SET socket_id = $3, joined_at = NOW()
      `, [playerId, channelId, socket.id]);

      socket.emit('subscription_success', { channelId });

      // Send channel-specific data
      await this.sendChannelData(channelId, socket);

      console.log(`📢 Player ${socket.data.player.displayName} subscribed to ${channelId}`);

    } catch (error) {
      console.error('Subscription error:', error);
      socket.emit('subscription_error', { 
        channelId, 
        error: 'Failed to subscribe to channel' 
      });
    }
  }

  private async handleUnsubscription(socket: any, data: any): Promise<void> {
    const { channelId } = data;
    const playerId = socket.data.playerId;

    try {
      // Remove from channel
      socket.leave(channelId);
      
      // Remove from tracking
      const channelSockets = this.channelSubscriptions.get(channelId);
      if (channelSockets) {
        channelSockets.delete(socket.id);
        if (channelSockets.size === 0) {
          this.channelSubscriptions.delete(channelId);
        }
      }

      // Remove from database
      await this.pool.query(`
        DELETE FROM channel_subscriptions 
        WHERE player_id = $1 AND channel_id = $2
      `, [playerId, channelId]);

      socket.emit('unsubscription_success', { channelId });

      console.log(`🔕 Player ${socket.data.player.displayName} unsubscribed from ${channelId}`);

    } catch (error) {
      console.error('Unsubscription error:', error);
      socket.emit('unsubscription_error', { 
        channelId, 
        error: 'Failed to unsubscribe from channel' 
      });
    }
  }

  private async handleGameAction(socket: any, data: any): Promise<void> {
    const playerId = socket.data.playerId;
    
    try {
      // Process game action through game service
      // This would integrate with the existing game service
      const result = await this.processGameAction(playerId, data);
      
      // Broadcast relevant updates
      if (result.success) {
        // Update player stats
        this.broadcastToPlayer(playerId, 'player_stats', result.data);
        
        // Update leaderboards if score changed
        if (this.affectsLeaderboard(data.type)) {
          await this.broadcastLeaderboardUpdate();
        }
        
        // Update community if applicable
        if (data.type === 'social_action') {
          await this.broadcastCommunityUpdate(playerId);
        }
      }

      socket.emit('game_action_result', result);

    } catch (error) {
      console.error('Game action error:', error);
      socket.emit('game_action_error', { 
        action: data.type, 
        error: 'Failed to process game action' 
      });
    }
  }

  private async handleChatMessage(socket: any, data: any): Promise<void> {
    const { channelId, message } = data;
    const playerId = socket.data.playerId;
    const player = socket.data.player as Player;

    try {
      // Validate chat permissions
      if (!this.canSendChatMessage(playerId, channelId)) {
        socket.emit('chat_error', { 
          channelId, 
          error: 'Not authorized to send messages in this channel' 
        });
        return;
      }

      // Create message object
      const chatMessage = {
        id: require('crypto').randomUUID(),
        playerId,
        displayName: player.displayName,
        avatar: player.avatar,
        message: message.trim(),
        timestamp: new Date(),
        channelId
      };

      // Store message in database
      await this.pool.query(`
        INSERT INTO chat_messages (id, player_id, channel_id, message, created_at)
        VALUES ($1, $2, $3, $4, NOW())
      `, [chatMessage.id, playerId, channelId, chatMessage.message]);

      // Broadcast to channel
      this.io.to(channelId).emit('chat_message', chatMessage);

      // Update last activity
      await this.pool.query(`
        UPDATE players SET last_active_at = NOW() WHERE id = $1
      `, [playerId]);

    } catch (error) {
      console.error('Chat message error:', error);
      socket.emit('chat_error', { 
        channelId, 
        error: 'Failed to send message' 
      });
    }
  }

  private async handleJoinCompetition(socket: any, data: any): Promise<void> {
    const { competitionId } = data;
    const playerId = socket.data.playerId;

    try {
      // Add player to competition
      await this.pool.query(`
        INSERT INTO player_competitions (player_id, competition_id, joined_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (player_id, competition_id) DO NOTHING
      `, [playerId, competitionIdId]);

      // Join competition channel
      socket.join(`competition:${competitionId}`);

      // Send competition data
      const competitionData = await this.getCompetitionData(competitionId);
      socket.emit('competition_joined', competitionData);

      // Broadcast participant count update
      await this.broadcastCompetitionUpdate(competitionId);

    } catch (error) {
      console.error('Join competition error:', error);
      socket.emit('competition_error', { 
        competitionId, 
        error: 'Failed to join competition' 
      });
    }
  }

  private async handleLeaveCompetition(socket: any, data: any): Promise<void> {
    const { competitionId } = data;
    const playerId = socket.data.playerId;

    try {
      // Remove player from competition channel
      socket.leave(`competition:${competitionId}`);

      // Update competition status
      await this.pool.query(`
        UPDATE player_competitions 
        SET completed_at = NOW() 
        WHERE player_id = $1 AND competition_id = $2 AND completed_at IS NULL
      `, [playerId, competitionId]);

      socket.emit('competition_left', { competitionId });

      // Broadcast participant count update
      await this.broadcastCompetitionUpdate(competitionId);

    } catch (error) {
      console.error('Leave competition error:', error);
      socket.emit('competition_error', { 
        competitionId, 
        error: 'Failed to leave competition' 
      });
    }
  }

  private handleDisconnection(socket: any, reason: string): void {
    const player = socket.data.player as Player;
    const playerId = player.id;
    
    console.log(`🔌 Player disconnected: ${player.displayName} (${reason})`);

    // Remove from tracking
    const playerSockets = this.connectedPlayers.get(playerId);
    if (playerSockets) {
      playerSockets.delete(socket.id);
      if (playerSockets.size === 0) {
        this.connectedPlayers.delete(playerId);
      }
    }

    this.playerSockets.delete(socket.id);

    // Remove from all channel subscriptions
    for (const [channelId, sockets] of this.channelSubscriptions.entries()) {
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        this.channelSubscriptions.delete(channelId);
      }
    }

    // Update database
    this.pool.query(`
      DELETE FROM channel_subscriptions WHERE socket_id = $1
    `, [socket.id]).catch(console.error);

    // Broadcast friend offline status
    this.broadcastToFriends(playerId, 'friend_offline', {
      playerId,
      displayName: player.displayName
    });
  }

  // Broadcasting methods
  private broadcastToPlayer(playerId: string, event: string, data: any): void {
    this.io.to(`player:${playerId}`).emit(event, data);
  }

  private broadcastToFriends(playerId: string, event: string, data: any): void {
    // This would get player's friends and broadcast to them
    // For now, broadcast to all connected players
    this.io.emit(event, data);
  }

  private broadcastToChannel(channelId: string, event: string, data: any): void {
    this.io.to(channelId).emit(event, data);
  }

  private broadcastToGeneration(generation: string, event: string, data: any): void {
    this.io.to(`generation:${generation}`).emit(event, data);
  }

  private broadcastToRank(rank: string, event: string, data: any): void {
    this.io.to(`rank:${rank}`).emit(event, data);
  }

  // Periodic updates
  private startPeriodicUpdates(): void {
    // Update leaderboards every 30 seconds
    setInterval(async () => {
      await this.broadcastLeaderboardUpdate();
    }, 30000);

    // Update competitions every 10 seconds
    setInterval(async () => {
      await this.broadcastCompetitionUpdates();
    }, 10000);

    // Update online friends every 60 seconds
    setInterval(async () => {
      await this.broadcastOnlineFriends();
    }, 60000);

    // Clean up old subscriptions every 5 minutes
    setInterval(async () => {
      await this.cleanupOldSubscriptions();
    }, 300000);
  }

  private async broadcastLeaderboardUpdate(): Promise<void> {
    try {
      const leaderboards = await this.getLeaderboardUpdates();
      this.io.emit('leaderboard_update', leaderboards);
    } catch (error) {
      console.error('Error broadcasting leaderboard update:', error);
    }
  }

  private async broadcastCompetitionUpdates(): Promise<void> {
    try {
      const competitions = await this.getActiveCompetitions();
      this.io.emit('competitions_update', competitions);
    } catch (error) {
      console.error('Error broadcasting competition updates:', error);
    }
  }

  private async broadcastOnlineFriends(): Promise<void> {
    try {
      for (const [playerId, sockets] of this.connectedPlayers.entries()) {
        if (sockets.size > 0) {
          const onlineFriends = await this.getOnlineFriends(playerId);
          this.broadcastToPlayer(playerId, 'friends_online', { 
            count: onlineFriends.length,
            friends: onlineFriends 
          });
        }
      }
    } catch (error) {
      console.error('Error broadcasting online friends:', error);
    }
  }

  private async broadcastCommunityUpdate(playerId: string): Promise<void> {
    try {
      // Get player's community
      const result = await this.pool.query(`
        SELECT community_id FROM community_members WHERE player_id = $1
      `, [playerId]);

      if (result.rows.length > 0) {
        const communityId = result.rows[0].community_id;
        const communityData = await this.getCommunityData(communityId);
        
        this.broadcastToChannel(`community:${communityId}`, 'community_update', communityData);
      }
    } catch (error) {
      console.error('Error broadcasting community update:', error);
    }
  }

  private async broadcastCompetitionUpdate(competitionId: string): Promise<void> {
    try {
      const competitionData = await this.getCompetitionData(competitionId);
      this.broadcastToChannel(`competition:${competitionId}`, 'competition_update', competitionData);
    } catch (error) {
      console.error('Error broadcasting competition update:', error);
    }
  }

  // Data fetching methods
  private async getPlayerById(playerId: string): Promise<Player | null> {
    const result = await this.pool.query(`
      SELECT * FROM players WHERE id = $1
    `, [playerId]);

    return result.rows.length > 0 ? this.mapRowToPlayer(result.rows[0]) : null;
  }

  private async getPlayerStats(playerId: string): Promise<any> {
    const result = await this.pool.query(`
      SELECT 
        level, experience, influence, supporters, power_tokens,
        rank, generation, referral_code, referrals_count,
        last_active_at, joined_at
      FROM players WHERE id = $1
    `, [playerId]);

    return result.rows[0];
  }

  private async getAvailableMissions(playerId: string): Promise<any[]> {
    const result = await this.pool.query(`
      SELECT m.*, 
             COALESCE(pmp.progress, 0) as current_progress,
             COALESCE(pmp.is_completed, false) as is_completed
      FROM missions m
      LEFT JOIN player_missions pmp ON m.id = pmp.mission_id AND pmp.player_id = $1
      WHERE m.is_active = true 
        AND (pmp.id IS NULL OR pmp.is_completed = false)
        AND (m.expires_at IS NULL OR m.expires_at > NOW())
      ORDER BY m.category, m.order_index
      LIMIT 10
    `, [playerId]);

    return result.rows;
  }

  private async getDailyHabits(playerId: string): Promise<any[]> {
    const result = await this.pool.query(`
      SELECT 
        dh.*,
        COALESCE(php.current_streak, 0) as current_streak,
        COALESCE(php.total_completed, 0) as total_completed,
        COALESCE(php.last_completed_at, NULL) as last_completed_at
      FROM daily_habits dh
      LEFT JOIN player_habit_progress php ON dh.id = php.habit_id AND php.player_id = $1
      WHERE dh.is_active = true
      ORDER BY dh.category, dh.name
      LIMIT 5
    `, [playerId]);

    return result.rows;
  }

  private async getActiveCompetitions(): Promise<any[]> {
    const result = await this.pool.query(`
      SELECT 
        c.*,
        COUNT(pc.player_id) as participant_count
      FROM competitions c
      LEFT JOIN player_competitions pc ON c.id = pc.competition_id AND pc.completed_at IS NULL
      WHERE c.is_active = true 
        AND (c.starts_at IS NULL OR c.starts_at <= NOW())
        AND (c.ends_at IS NULL OR c.ends_at > NOW())
      GROUP BY c.id
      ORDER BY c.created_at DESC
      LIMIT 5
    `, []);

    return result.rows;
  }

  private async getLeaderboardUpdates(): Promise<any[]> {
    const result = await this.pool.query(`
      SELECT 
        le.*,
        p.display_name,
        p.avatar_url,
        l.name as leaderboard_name,
        l.type as leaderboard_type,
        l.period as leaderboard_period
      FROM leaderboard_entries le
      JOIN players p ON le.player_id = p.id
      JOIN leaderboards l ON le.leaderboard_id = l.id
      WHERE l.is_active = true
      ORDER BY l.type, l.period, le.rank ASC
      LIMIT 100
    `, []);

    return result.rows;
  }

  private async getOnlineFriends(playerId: string): Promise<any[]> {
    // This would get actual friends from the database
    // For now, return empty array
    return [];
  }

  private async getCommunityData(communityId: string): Promise<any> {
    const result = await this.pool.query(`
      SELECT 
        c.*,
        COUNT(cm.player_id) as member_count,
        COUNT(CASE WHEN cm.last_activity_at > NOW() - INTERVAL '1 hour' THEN 1 END) as active_members
      FROM communities c
      LEFT JOIN community_members cm ON c.id = cm.community_id
      WHERE c.id = $1
      GROUP BY c.id
    `, [communityId]);

    return result.rows[0];
  }

  private async getCompetitionData(competitionId: string): Promise<any> {
    const result = await this.pool.query(`
      SELECT 
        c.*,
        COUNT(pc.player_id) as participant_count,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'player_id', pc.player_id,
            'score', pc.score,
            'rank', pc.rank
          ) ORDER BY pc.score DESC
        ) FILTER (WHERE pc.player_id IS NOT NULL) as top_players
      FROM competitions c
      LEFT JOIN player_competitions pc ON c.id = pc.competition_id AND pc.completed_at IS NULL
      WHERE c.id = $1
      GROUP BY c.id
    `, [competitionId]);

    return result.rows[0];
  }

  private async sendChannelData(channelId: string, socket: any): Promise<void> {
    try {
      let data: any = null;

      if (channelId.startsWith('competition:')) {
        const competitionId = channelId.replace('competition:', '');
        data = await this.getCompetitionData(competitionId);
      } else if (channelId.startsWith('community:')) {
        const communityId = channelId.replace('community:', '');
        data = await this.getCommunityData(communityId);
      }

      if (data) {
        socket.emit('channel_data', { channelId, data });
      }
    } catch (error) {
      console.error('Error sending channel data:', error);
    }
  }

  // Validation methods
  private canSubscribeToChannel(playerId: string, channelId: string, type: string): boolean {
    // Implement channel subscription logic
    // For now, allow all subscriptions
    return true;
  }

  private canSendChatMessage(playerId: string, channelId: string): boolean {
    // Implement chat permission logic
    // For now, allow all messages
    return true;
  }

  private affectsLeaderboard(actionType: string): boolean {
    // Determine if action affects leaderboard
    return ['tap', 'mission_complete', 'mini_game'].includes(actionType);
  }

  private async processGameAction(playerId: string, data: any): Promise<any> {
    // This would integrate with the game service
    // For now, return mock result
    return {
      success: true,
      data: {
        level: 1,
        experience: 100,
        influence: 50,
        supporters: 0,
        powerTokens: 10
      }
    };
  }

  private async cleanupOldSubscriptions(): Promise<void> {
    try {
      await this.pool.query(`
        DELETE FROM channel_subscriptions 
        WHERE joined_at < NOW() - INTERVAL '24 hours'
      `);
    } catch (error) {
      console.error('Error cleaning up old subscriptions:', error);
    }
  }

  private mapRowToPlayer(row: any): Player {
    return {
      id: row.id,
      telegramId: row.telegram_id,
      username: row.username,
      displayName: row.display_name,
      avatar: row.avatar_url,
      level: row.level,
      rank: row.rank,
      experience: row.experience,
      influence: row.influence,
      supporters: row.supporters,
      powerTokens: row.power_tokens,
      totalEarned: row.total_earned,
      referralCode: row.referral_code,
      referredBy: row.referred_by,
      referralsCount: row.referrals_count,
      communityId: row.community_id,
      isActive: row.is_active,
      lastActiveAt: row.last_active_at,
      joinedAt: row.joined_at,
      generation: row.generation,
      permanentBonus: parseFloat(row.permanent_bonus),
      titles: [],
      badges: [],
      seasonalAchievements: []
    };
  }

  // Public methods for external use
  public broadcastGlobalEvent(event: string, data: any): void {
    this.io.emit(event, data);
  }

  public broadcastToPlayers(playerIds: string[], event: string, data: any): void {
    playerIds.forEach(playerId => {
      this.broadcastToPlayer(playerId, event, data);
    });
  }

  public getConnectedPlayersCount(): number {
    return this.connectedPlayers.size;
  }

  public getChannelSubscriptionsCount(): number {
    return this.channelSubscriptions.size;
  }

  public async shutdown(): Promise<void> {
    console.log('🔌 Shutting down realtime service...');
    
    // Disconnect all clients
    this.io.close();
    
    console.log('✅ Realtime service shut down complete');
  }
}
