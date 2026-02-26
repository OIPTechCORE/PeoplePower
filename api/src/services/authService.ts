import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { TelegramUser, Player } from '@people-power/shared';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResult {
  success: boolean;
  player?: Player;
  tokens?: AuthTokens;
  error?: string;
}

export class AuthService {
  private pool: Pool;
  private jwtSecret: string;
  private jwtRefreshSecret: string;
  private jwtExpiresIn: string;
  private jwtRefreshExpiresIn: string;

  constructor(pool: Pool) {
    this.pool = pool;
    this.jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '15m';
    this.jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  async authenticateTelegramUser(telegramUser: TelegramUser): Promise<AuthResult> {
    try {
      // Find or create player
      let player = await this.findPlayerByTelegramId(telegramUser.id);
      
      if (!player) {
        player = await this.createPlayerFromTelegram(telegramUser);
      }

      // Update last activity
      await this.updatePlayerActivity(player.id);

      // Generate tokens
      const tokens = this.generateTokens(player);

      return {
        success: true,
        player,
        tokens
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  }

  async findPlayerByTelegramId(telegramId: number): Promise<Player | null> {
    const result = await this.pool.query(`
      SELECT 
        p.*,
        COALESCE(badges.badge_count, 0) as badge_count,
        COALESCE(titles.title_count, 0) as title_count,
        cm.community_id,
        cm.role as community_role
      FROM players p
      LEFT JOIN (
        SELECT player_id, COUNT(*) as badge_count
        FROM player_badges
        GROUP BY player_id
      ) badges ON p.id = badges.player_id
      LEFT JOIN (
        SELECT player_id, COUNT(*) as title_count
        FROM player_titles
        GROUP BY player_id
      ) titles ON p.id = titles.player_id
      LEFT JOIN community_members cm ON p.id = cm.player_id
      WHERE p.telegram_id = $1
    `, [telegramId]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToPlayer(result.rows[0]);
  }

  async createPlayerFromTelegram(telegramUser: TelegramUser): Promise<Player> {
    const referralCode = this.generateReferralCode();
    
    // Determine generation based on current player count
    const generation = await this.determinePlayerGeneration();
    
    const result = await this.pool.query(`
      INSERT INTO players (
        telegram_id, username, display_name, avatar_url,
        referral_code, generation, permanent_bonus
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      telegramUser.id,
      telegramUser.username,
      `${telegramUser.first_name}${telegramUser.last_name ? ' ' + telegramUser.last_name : ''}`,
      telegramUser.photo_url,
      referralCode,
      generation,
      this.getGenerationBonus(generation)
    ]);

    return this.mapRowToPlayer(result.rows[0]);
  }

  async updatePlayerActivity(playerId: string): Promise<void> {
    await this.pool.query(`
      UPDATE players 
      SET last_active_at = NOW(), is_active = true 
      WHERE id = $1
    `, [playerId]);
  }

  async refreshToken(refreshToken: string): Promise<AuthResult> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, this.jwtRefreshSecret) as any;
      
      // Get player from database
      const player = await this.findPlayerById(decoded.playerId);
      
      if (!player) {
        return {
          success: false,
          error: 'Player not found'
        };
      }

      // Generate new tokens
      const tokens = this.generateTokens(player);

      return {
        success: true,
        player,
        tokens
      };
    } catch (error) {
      return {
        success: false,
        error: 'Invalid refresh token'
      };
    }
  }

  async verifyAccessToken(token: string): Promise<Player | null> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      return await this.findPlayerById(decoded.playerId);
    } catch (error) {
      return null;
    }
  }

  private async findPlayerById(playerId: string): Promise<Player | null> {
    const result = await this.pool.query(`
      SELECT 
        p.*,
        COALESCE(badges.badge_count, 0) as badge_count,
        COALESCE(titles.title_count, 0) as title_count,
        cm.community_id,
        cm.role as community_role
      FROM players p
      LEFT JOIN (
        SELECT player_id, COUNT(*) as badge_count
        FROM player_badges
        GROUP BY player_id
      ) badges ON p.id = badges.player_id
      LEFT JOIN (
        SELECT player_id, COUNT(*) as title_count
        FROM player_titles
        GROUP BY player_id
      ) titles ON p.id = titles.player_id
      LEFT JOIN community_members cm ON p.id = cm.player_id
      WHERE p.id = $1
    `, [playerId]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToPlayer(result.rows[0]);
  }

  private generateTokens(player: Player): AuthTokens {
    const accessToken = jwt.sign(
      { 
        playerId: player.id,
        telegramId: player.telegramId,
        level: player.level
      },
      this.jwtSecret,
      { expiresIn: this.jwtExpiresIn }
    );

    const refreshToken = jwt.sign(
      { 
        playerId: player.id,
        tokenVersion: Date.now() // For token invalidation
      },
      this.jwtRefreshSecret,
      { expiresIn: this.jwtRefreshExpiresIn }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: this.parseExpirationTime(this.jwtExpiresIn)
    };
  }

  private parseExpirationTime(timeString: string): number {
    // Parse time strings like '15m', '7d', '1h' into seconds
    const match = timeString.match(/^(\d+)([smhd])$/);
    if (!match) return 900; // Default 15 minutes

    const [, amount, unit] = match;
    const value = parseInt(amount);

    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 3600;
      case 'd': return value * 86400;
      default: return 900;
    }
  }

  private generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  private async determinePlayerGeneration(): Promise<string> {
    const result = await this.pool.query('SELECT COUNT(*) as total_players FROM players');
    const totalPlayers = parseInt(result.rows[0].total_players);

    if (totalPlayers < 1000) return 'FOUNDERS';
    if (totalPlayers < 10000) return 'BUILDERS';
    if (totalPlayers < 100000) return 'SUPPORTERS';
    return 'MASS_MOVEMENT';
  }

  private getGenerationBonus(generation: string): number {
    switch (generation) {
      case 'FOUNDERS': return 1.5;
      case 'BUILDERS': return 1.2;
      case 'SUPPORTERS': return 1.1;
      default: return 1.0;
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
      titles: [], // Would need separate query
      badges: [], // Would need separate query
      seasonalAchievements: [] // Would need separate query
    };
  }

  // Security methods
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Session management
  async createSession(playerId: string, deviceInfo?: any): Promise<string> {
    const sessionId = this.generateSessionId();
    
    await this.pool.query(`
      INSERT INTO player_sessions (id, player_id, device_info, created_at, last_activity_at)
      VALUES ($1, $2, $3, NOW(), NOW())
    `, [sessionId, playerId, JSON.stringify(deviceInfo)]);

    return sessionId;
  }

  async validateSession(sessionId: string): Promise<Player | null> {
    const result = await this.pool.query(`
      SELECT ps.*, p.* FROM player_sessions ps
      JOIN players p ON ps.player_id = p.id
      WHERE ps.id = $1 AND ps.last_activity_at > NOW() - INTERVAL '7 days'
    `, [sessionId]);

    if (result.rows.length === 0) {
      return null;
    }

    // Update last activity
    await this.pool.query(`
      UPDATE player_sessions 
      SET last_activity_at = NOW() 
      WHERE id = $1
    `, [sessionId]);

    return this.mapRowToPlayer(result.rows[0]);
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.pool.query('DELETE FROM player_sessions WHERE id = $1', [sessionId]);
  }

  async revokeAllPlayerSessions(playerId: string): Promise<void> {
    await this.pool.query('DELETE FROM player_sessions WHERE player_id = $1', [playerId]);
  }

  private generateSessionId(): string {
    return require('crypto').randomBytes(32).toString('hex');
  }

  // Rate limiting
  async checkRateLimit(playerId: string, action: string, limit: number, windowMinutes: number): Promise<boolean> {
    const result = await this.pool.query(`
      SELECT COUNT(*) as count 
      FROM rate_limit_logs 
      WHERE player_id = $1 AND action = $2 AND created_at > NOW() - INTERVAL '${windowMinutes} minutes'
    `, [playerId, action]);

    const count = parseInt(result.rows[0].count);
    
    if (count >= limit) {
      return false;
    }

    // Log this action
    await this.pool.query(`
      INSERT INTO rate_limit_logs (player_id, action, created_at)
      VALUES ($1, $2, NOW())
    `, [playerId, action]);

    return true;
  }

  // Security monitoring
  async logSecurityEvent(event: {
    playerId?: string;
    type: string;
    description: string;
    ipAddress?: string;
    userAgent?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }): Promise<void> {
    await this.pool.query(`
      INSERT INTO security_logs (player_id, event_type, description, ip_address, user_agent, severity, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
    `, [
      event.playerId,
      event.type,
      event.description,
      event.ipAddress,
      event.userAgent,
      event.severity
    ]);
  }

  // Account recovery
  async initiateAccountRecovery(telegramId: number): Promise<{ success: boolean; recoveryToken?: string; error?: string }> {
    const player = await this.findPlayerByTelegramId(telegramId);
    
    if (!player) {
      return {
        success: false,
        error: 'Player not found'
      };
    }

    const recoveryToken = this.generateRecoveryToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await this.pool.query(`
      INSERT INTO account_recovery (player_id, token, expires_at, created_at)
      VALUES ($1, $2, $3, NOW())
    `, [player.id, recoveryToken, expiresAt]);

    // In production, send this via Telegram bot
    console.log(`Recovery token for ${player.displayName}: ${recoveryToken}`);

    return {
      success: true,
      recoveryToken
    };
  }

  async completeAccountRecovery(token: string, newTelegramId: number): Promise<{ success: boolean; error?: string }> {
    const result = await this.pool.query(`
      SELECT player_id, expires_at 
      FROM account_recovery 
      WHERE token = $1 AND expires_at > NOW()
    `, [token]);

    if (result.rows.length === 0) {
      return {
        success: false,
        error: 'Invalid or expired recovery token'
      };
    }

    const playerId = result.rows[0].player_id;

    // Update telegram ID
    await this.pool.query(`
      UPDATE players 
      SET telegram_id = $1 
      WHERE id = $2
    `, [newTelegramId, playerId]);

    // Invalidate recovery token
    await this.pool.query('DELETE FROM account_recovery WHERE token = $1', [token]);

    // Revoke all sessions
    await this.revokeAllPlayerSessions(playerId);

    return {
      success: true
    };
  }

  private generateRecoveryToken(): string {
    return require('crypto').randomBytes(32).toString('hex');
  }
}
