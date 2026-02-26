import { Pool } from 'pg';
import { 
  Player, 
  Mission, 
  MiniGameSession, 
  GameSession, 
  TokenTransaction,
  ApiResponse,
  MissionType,
  MiniGameType,
  transaction_type
} from '@people-power/shared';
import { DAILY_HABITS, COMPETITIONS, STORY_CHAPTERS, MINIGAMES } from '@people-power/shared/content';

export interface GameAction {
  type: 'tap' | 'mission_complete' | 'story_progress' | 'social_action' | 'mini_game';
  data: any;
  timestamp: Date;
}

export interface GameProgress {
  level: number;
  experience: number;
  influence: number;
  supporters: number;
  powerTokens: number;
  missionsCompleted: number;
  currentStreak: number;
}

export interface LeaderboardEntry {
  playerId: string;
  displayName: string;
  rank: number;
  score: number;
  avatar?: string;
  badges: string[];
  change: number;
}

export class GameService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // Core Game Loop
  async processGameAction(playerId: string, action: GameAction): Promise<ApiResponse<GameProgress>> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get current player state
      const player = await this.getPlayerById(playerId, client);
      if (!player) {
        throw new Error('Player not found');
      }

      // Process action based on type
      let progress: GameProgress;
      
      switch (action.type) {
        case 'tap':
          progress = await this.processTapAction(player, action.data, client);
          break;
        case 'mission_complete':
          progress = await this.processMissionComplete(player, action.data, client);
          break;
        case 'story_progress':
          progress = await this.processStoryProgress(player, action.data, client);
          break;
        case 'mini_game':
          progress = await this.processMiniGame(player, action.data, client);
          break;
        case 'social_action':
          progress = await this.processSocialAction(player, action.data, client);
          break;
        default:
          throw new Error('Unknown action type');
      }

      // Update session
      await this.updateGameSession(playerId, action, client);

      await client.query('COMMIT');

      return {
        success: true,
        data: progress,
        timestamp: new Date()
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Game action error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Game action failed',
        timestamp: new Date()
      };
    } finally {
      client.release();
    }
  }

  private async processTapAction(player: Player, data: any, client: any): Promise<GameProgress> {
    const tapCount = data.tapCount || 1;
    const baseReward = 1;
    const levelMultiplier = 1 + (player.level * 0.1);
    const generationBonus = player.permanentBonus;
    
    const influenceGain = Math.round(tapCount * baseReward * levelMultiplier * generationBonus);
    const experienceGain = Math.round(tapCount * 0.5 * generationBonus);

    // Update player stats
    await client.query(`
      UPDATE players 
      SET influence = influence + $1, experience = experience + $2
      WHERE id = $3
    `, [influenceGain, experienceGain, player.id]);

    // Record transaction
    await this.createTokenTransaction(
      player.id, 
      'earned', 
      influenceGain, 
      'tap_action', 
      `Tap rewards: ${tapCount} taps`,
      client
    );

    // Check for level up
    const newLevel = await this.checkLevelUp(player.id, player.experience + experienceGain, client);

    return {
      level: newLevel,
      experience: player.experience + experienceGain,
      influence: player.influence + influenceGain,
      supporters: player.supporters,
      powerTokens: player.powerTokens,
      missionsCompleted: 0, // Would need to query
      currentStreak: 0 // Would need to query
    };
  }

  private async processMissionComplete(player: Player, data: any, client: any): Promise<GameProgress> {
    const missionId = data.missionId;
    
    // Get mission details
    const missionResult = await client.query(`
      SELECT * FROM missions WHERE mission_id = $1 AND is_active = true
    `, [missionId]);

    if (missionResult.rows.length === 0) {
      throw new Error('Mission not found');
    }

    const mission = missionResult.rows[0];

    // Check if already completed
    const progressResult = await client.query(`
      SELECT * FROM player_missions 
      WHERE player_id = $1 AND mission_id = $2
    `, [player.id, mission.id]);

    if (progressResult.rows.length > 0 && progressResult.rows[0].is_completed) {
      throw new Error('Mission already completed');
    }

    // Update or create mission progress
    if (progressResult.rows.length === 0) {
      await client.query(`
        INSERT INTO player_missions (player_id, mission_id, progress, is_completed, completed_at)
        VALUES ($1, $2, $3, true, NOW())
      `, [player.id, mission.id, mission.max_progress]);
    } else {
      await client.query(`
        UPDATE player_missions 
        SET progress = $1, is_completed = true, completed_at = NOW()
        WHERE player_id = $2 AND mission_id = $3
      `, [mission.max_progress, player.id, mission.id]);
    }

    // Process rewards
    const rewards = JSON.parse(mission.rewards);
    let totalInfluence = 0;
    let totalExperience = 0;
    let totalTokens = 0;
    let totalSupporters = 0;

    for (const reward of rewards) {
      switch (reward.type) {
        case 'influence':
          totalInfluence += reward.value;
          break;
        case 'experience':
          totalExperience += reward.value;
          break;
        case 'power_tokens':
          totalTokens += reward.value;
          break;
        case 'supporters':
          totalSupporters += reward.value;
          break;
      }
    }

    // Update player stats
    await client.query(`
      UPDATE players 
      SET 
        influence = influence + $1,
        experience = experience + $2,
        power_tokens = power_tokens + $3,
        supporters = supporters + $4
      WHERE id = $5
    `, [totalInfluence, totalExperience, totalTokens, totalSupporters, player.id]);

    // Record transactions
    if (totalInfluence > 0) {
      await this.createTokenTransaction(
        player.id, 
        'earned', 
        totalInfluence, 
        'mission_complete', 
        `Mission: ${mission.title}`,
        client
      );
    }

    if (totalTokens > 0) {
      await this.createTokenTransaction(
        player.id, 
        'earned', 
        totalTokens, 
        'mission_reward', 
        `Mission reward: ${mission.title}`,
        client
      );
    }

    // Check for level up
    const newLevel = await this.checkLevelUp(player.id, player.experience + totalExperience, client);

    return {
      level: newLevel,
      experience: player.experience + totalExperience,
      influence: player.influence + totalInfluence,
      supporters: player.supporters + totalSupporters,
      powerTokens: player.powerTokens + totalTokens,
      missionsCompleted: 1,
      currentStreak: 0
    };
  }

  private async processStoryProgress(player: Player, data: any, client: any): Promise<GameProgress> {
    const chapterId = data.chapterId;
    const sceneId = data.sceneId;
    const choiceId = data.choiceId;

    // Get chapter and scene
    const sceneResult = await client.query(`
      SELECT sc.*, c.order_index as chapter_order
      FROM story_scenes sc
      JOIN story_chapters c ON sc.chapter_id = c.id
      WHERE sc.scene_id = $1 AND c.is_unlocked = true
    `, [sceneId]);

    if (sceneResult.rows.length === 0) {
      throw new Error('Scene not found or chapter not unlocked');
    }

    const scene = sceneResult.rows[0];

    // Update chapter progress
    await client.query(`
      INSERT INTO player_chapter_progress (player_id, chapter_id, current_scene_index, is_completed)
      VALUES ($1, $2, $3, false)
      ON CONFLICT (player_id, chapter_id) 
      DO UPDATE SET 
        current_scene_index = GREATEST(player_chapter_progress.current_scene_index, $3)
    `, [player.id, scene.chapter_id, scene.order_index]);

    // Process choice rewards if applicable
    let totalExperience = 0;
    if (choiceId) {
      const choiceResult = await client.query(`
        SELECT * FROM story_choices WHERE choice_id = $1 AND scene_id = $2
      `, [choiceId, scene.id]);

      if (choiceResult.rows.length > 0) {
        const choice = choiceResult.rows[0];
        // Process choice rewards (would be in JSON format)
        // For now, give base experience
        totalExperience = 25;
      }
    }

    // Update player experience
    await client.query(`
      UPDATE players 
      SET experience = experience + $1
      WHERE id = $2
    `, [totalExperience, player.id]);

    // Check for level up
    const newLevel = await this.checkLevelUp(player.id, player.experience + totalExperience, client);

    return {
      level: newLevel,
      experience: player.experience + totalExperience,
      influence: player.influence,
      supporters: player.supporters,
      powerTokens: player.powerTokens,
      missionsCompleted: 0,
      currentStreak: 0
    };
  }

  private async processMiniGame(player: Player, data: any, client: any): Promise<GameProgress> {
    const gameType = data.gameType as MiniGameType;
    const score = data.score || 0;
    const sessionData = data.sessionData || {};

    // Create mini-game session
    const sessionResult = await client.query(`
      INSERT INTO mini_game_sessions (player_id, type, session_data, score, is_completed)
      VALUES ($1, $2, $3, $4, true)
      RETURNING id
    `, [player.id, gameType, JSON.stringify(sessionData), score]);

    // Calculate rewards based on score and game type
    const rewards = this.calculateMiniGameRewards(gameType, score);
    
    let totalInfluence = 0;
    let totalExperience = 0;
    let totalTokens = 0;

    for (const reward of rewards) {
      switch (reward.type) {
        case 'influence':
          totalInfluence += reward.value;
          break;
        case 'experience':
          totalExperience += reward.value;
          break;
        case 'power_tokens':
          totalTokens += reward.value;
          break;
      }
    }

    // Update player stats
    await client.query(`
      UPDATE players 
      SET 
        influence = influence + $1,
        experience = experience + $2,
        power_tokens = power_tokens + $3
      WHERE id = $4
    `, [totalInfluence, totalExperience, totalTokens, player.id]);

    // Record transactions
    if (totalInfluence > 0) {
      await this.createTokenTransaction(
        player.id, 
        'earned', 
        totalInfluence, 
        'mini_game', 
        `Mini-game: ${gameType}`,
        client
      );
    }

    // Check for level up
    const newLevel = await this.checkLevelUp(player.id, player.experience + totalExperience, client);

    return {
      level: newLevel,
      experience: player.experience + totalExperience,
      influence: player.influence + totalInfluence,
      supporters: player.supporters,
      powerTokens: player.powerTokens + totalTokens,
      missionsCompleted: 0,
      currentStreak: 0
    };
  }

  private async processSocialAction(player: Player, data: any, client: any): Promise<GameProgress> {
    const actionType = data.actionType; // 'share', 'invite', 'community_join'
    
    let totalInfluence = 0;
    let totalExperience = 0;

    switch (actionType) {
      case 'share':
        totalInfluence = 10;
        totalExperience = 5;
        break;
      case 'invite':
        totalInfluence = 50;
        totalExperience = 25;
        break;
      case 'community_join':
        totalInfluence = 25;
        totalExperience = 15;
        break;
    }

    // Update player stats
    await client.query(`
      UPDATE players 
      SET 
        influence = influence + $1,
        experience = experience + $2
      WHERE id = $3
    `, [totalInfluence, totalExperience, player.id]);

    // Record transaction
    await this.createTokenTransaction(
      player.id, 
      'earned', 
      totalInfluence, 
      'social_action', 
      `Social action: ${actionType}`,
      client
    );

    // Check for level up
    const newLevel = await this.checkLevelUp(player.id, player.experience + totalExperience, client);

    return {
      level: newLevel,
      experience: player.experience + totalExperience,
      influence: player.influence + totalInfluence,
      supporters: player.supporters,
      powerTokens: player.powerTokens,
      missionsCompleted: 0,
      currentStreak: 0
    };
  }

  private calculateMiniGameRewards(gameType: MiniGameType, score: number): any[] {
    const rewards = [];
    const baseMultiplier = score / 100; // Normalize score to multiplier

    switch (gameType) {
      case MiniGameType.TAP_RHYTHM:
        rewards.push(
          { type: 'influence', value: Math.round(20 * baseMultiplier) },
          { type: 'experience', value: Math.round(10 * baseMultiplier) }
        );
        break;
      case MiniGameType.LYRICS_PUZZLE:
        rewards.push(
          { type: 'influence', value: Math.round(15 * baseMultiplier) },
          { type: 'experience', value: Math.round(15 * baseMultiplier) }
        );
        break;
      case MiniGameType.RESOURCE_STRATEGY:
        rewards.push(
          { type: 'influence', value: Math.round(25 * baseMultiplier) },
          { type: 'power_tokens', value: Math.round(5 * baseMultiplier) }
        );
        break;
      case MiniGameType.DECISION_MAKING:
        rewards.push(
          { type: 'influence', value: Math.round(30 * baseMultiplier) },
          { type: 'experience', value: Math.round(20 * baseMultiplier) }
        );
        break;
      case MiniGameType.TEAM_MANAGEMENT:
        rewards.push(
          { type: 'influence', value: Math.round(35 * baseMultiplier) },
          { type: 'supporters', value: Math.round(1 * baseMultiplier) }
        );
        break;
    }

    return rewards;
  }

  private async checkLevelUp(playerId: string, newExperience: number, client: any): Promise<number> {
    // Calculate new level based on experience
    const newLevel = this.calculateLevel(newExperience);
    
    // Get current level
    const currentResult = await client.query('SELECT level FROM players WHERE id = $1', [playerId]);
    const currentLevel = currentResult.rows[0].level;

    if (newLevel > currentLevel) {
      // Update player level
      await client.query('UPDATE players SET level = $1 WHERE id = $2', [newLevel, playerId]);
      
      // Award level-up bonus
      const bonusTokens = newLevel * 10;
      await client.query(`
        UPDATE players 
        SET power_tokens = power_tokens + $1 
        WHERE id = $2
      `, [bonusTokens, playerId]);

      // Record transaction
      await this.createTokenTransaction(
        playerId, 
        'bonus', 
        bonusTokens, 
        'level_up', 
        `Level ${newLevel} bonus`,
        client
      );
    }

    return newLevel;
  }

  private calculateLevel(experience: number): number {
    // Level formula: 100 * level^2 experience required
    return Math.floor(Math.sqrt(experience / 100)) + 1;
  }

  private async createTokenTransaction(
    playerId: string, 
    type: transaction_type, 
    amount: number, 
    source: string, 
    description: string,
    client: any
  ): Promise<void> {
    await client.query(`
      INSERT INTO token_transactions (player_id, type, amount, source, description)
      VALUES ($1, $2, $3, $4, $5)
    `, [playerId, type, amount, source, description]);
  }

  private async updateGameSession(playerId: string, action: GameAction, client: any): Promise<void> {
    // Get or create current session
    const sessionResult = await client.query(`
      SELECT id FROM game_sessions 
      WHERE player_id = $1 AND ended_at IS NULL 
      ORDER BY started_at DESC LIMIT 1
    `, [playerId]);

    let sessionId: string;
    
    if (sessionResult.rows.length === 0) {
      // Create new session
      const newSessionResult = await client.query(`
        INSERT INTO game_sessions (player_id, started_at, last_activity_at)
        VALUES ($1, NOW(), NOW())
        RETURNING id
      `, [playerId]);
      sessionId = newSessionResult.rows[0].id;
    } else {
      sessionId = sessionResult.rows[0].id;
    }

    // Update session activity and add action
    await client.query(`
      UPDATE game_sessions 
      SET last_activity_at = NOW(),
          actions = actions || $1
      WHERE id = $2
    `, [JSON.stringify(action), sessionId]);
  }

  // Mission Management
  async getAvailableMissions(playerId: string): Promise<ApiResponse<Mission[]>> {
    const client = await this.pool.connect();
    
    try {
      const player = await this.getPlayerById(playerId, client);
      if (!player) {
        return {
          success: false,
          error: 'Player not found',
          timestamp: new Date()
        };
      }

      // Get available missions
      const result = await client.query(`
        SELECT m.*, 
               COALESCE(pmp.progress, 0) as current_progress,
               COALESCE(pmp.is_completed, false) as is_completed
        FROM missions m
        LEFT JOIN player_missions pmp ON m.id = pmp.mission_id AND pmp.player_id = $1
        WHERE m.is_active = true 
          AND (pmp.id IS NULL OR pmp.is_completed = false)
          AND (m.expires_at IS NULL OR m.expires_at > NOW())
        ORDER BY m.category, m.order_index
      `, [playerId]);

      const missions = result.rows.map(row => ({
        id: row.id,
        missionId: row.mission_id,
        title: row.title,
        description: row.description,
        type: row.type as MissionType,
        category: row.category,
        requirements: JSON.parse(row.requirements),
        rewards: JSON.parse(row.rewards),
        isAvailable: true,
        isCompleted: row.is_completed,
        progress: row.current_progress,
        maxProgress: row.max_progress,
        expiresAt: row.expires_at,
        resetAt: row.reset_at
      }));

      return {
        success: true,
        data: missions,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Get missions error:', error);
      return {
        success: false,
        error: 'Failed to get missions',
        timestamp: new Date()
      };
    } finally {
      client.release();
    }
  }

  // Leaderboard Management
  async getLeaderboard(
    type: string, 
    period: string, 
    limit: number = 50,
    playerId?: string
  ): Promise<ApiResponse<LeaderboardEntry[]>> {
    try {
      let query = `
        SELECT 
          le.*,
          p.display_name,
          p.username,
          p.avatar_url as avatar,
          COALESCE(badges.badges, '[]') as badges
        FROM leaderboard_entries le
        JOIN players p ON le.player_id = p.id
        LEFT JOIN (
          SELECT 
            pm.player_id,
            JSON_AGG(pm.badge_id) as badges
          FROM player_badges pm
          GROUP BY pm.player_id
        ) badges ON le.player_id = badges.player_id
        JOIN leaderboards l ON le.leaderboard_id = l.id
        WHERE l.type = $1 AND l.period = $2 AND l.is_active = true
        ORDER BY le.rank ASC
        LIMIT $3
      `;

      const result = await this.pool.query(query, [type, period, limit]);

      const entries: LeaderboardEntry[] = result.rows.map(row => ({
        playerId: row.player_id,
        displayName: row.display_name,
        rank: row.rank,
        score: row.score,
        avatar: row.avatar,
        badges: JSON.parse(row.badges || '[]'),
        change: row.previous_rank ? row.previous_rank - row.rank : 0
      }));

      return {
        success: true,
        data: entries,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Get leaderboard error:', error);
      return {
        success: false,
        error: 'Failed to get leaderboard',
        timestamp: new Date()
      };
    }
  }

  // Player Stats
  async getPlayerStats(playerId: string): Promise<ApiResponse<any>> {
    try {
      const player = await this.getPlayerById(playerId);
      if (!player) {
        return {
          success: false,
          error: 'Player not found',
          timestamp: new Date()
        };
      }

      // Get additional stats
      const [missionStats, sessionStats, habitStats] = await Promise.all([
        this.pool.query(`
          SELECT 
            COUNT(*) as total_completed,
            COUNT(CASE WHEN completed_at > NOW() - INTERVAL '7 days' THEN 1 END) as weekly_completed,
            COUNT(CASE WHEN completed_at > NOW() - INTERVAL '1 day' THEN 1 END) as daily_completed
          FROM player_missions 
          WHERE player_id = $1 AND is_completed = true
        `, [playerId]),
        
        this.pool.query(`
          SELECT 
            COUNT(*) as total_sessions,
            SUM(session_duration) as total_time,
            AVG(session_duration) as avg_session_time,
            MAX(started_at) as last_session
          FROM game_sessions 
          WHERE player_id = $1
        `, [playerId]),
        
        this.pool.query(`
          SELECT 
            COUNT(*) as active_habits,
            MAX(current_streak) as longest_streak,
            SUM(total_completed) as total_habit_completions
          FROM player_habit_progress 
          WHERE player_id = $1
        `, [playerId])
      ]);

      const stats = {
        player,
        missions: missionStats.rows[0],
        sessions: sessionStats.rows[0],
        habits: habitStats.rows[0]
      };

      return {
        success: true,
        data: stats,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Get player stats error:', error);
      return {
        success: false,
        error: 'Failed to get player stats',
        timestamp: new Date()
      };
    }
  }

  // Helper methods
  private async getPlayerById(playerId: string, client?: any): Promise<Player | null> {
    const queryClient = client || this.pool;
    
    const result = await queryClient.query(`
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

  // Daily Habits Integration
  async getDailyHabits(playerId: string): Promise<ApiResponse<any[]>> {
    try {
      const result = await this.pool.query(`
        SELECT 
          dh.*,
          COALESCE(php.current_streak, 0) as current_streak,
          COALESCE(php.longest_streak, 0) as longest_streak,
          COALESCE(php.total_completed, 0) as total_completed,
          COALESCE(php.last_completed_at, NULL) as last_completed_at
        FROM daily_habits dh
        LEFT JOIN player_habit_progress php ON dh.id = php.habit_id AND php.player_id = $1
        WHERE dh.is_active = true
        ORDER BY dh.category, dh.name
      `, [playerId]);

      return {
        success: true,
        data: result.rows,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Get daily habits error:', error);
      return {
        success: false,
        error: 'Failed to get daily habits',
        timestamp: new Date()
      };
    }
  }

  async completeHabit(playerId: string, habitId: string): Promise<ApiResponse<any>> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get habit details
      const habitResult = await client.query(`
        SELECT * FROM daily_habits WHERE habit_id = $1 AND is_active = true
      `, [habitId]);

      if (habitResult.rows.length === 0) {
        throw new Error('Habit not found');
      }

      const habit = habitResult.rows[0];

      // Check if already completed today
      const today = new Date().toISOString().split('T')[0];
      const progressResult = await client.query(`
        SELECT * FROM player_habit_progress 
        WHERE player_id = $1 AND habit_id = $2
      `, [playerId, habit.id]);

      let progress;
      if (progressResult.rows.length === 0) {
        // Create new progress
        progress = await client.query(`
          INSERT INTO player_habit_progress (player_id, habit_id, current_streak, longest_streak, total_completed, last_completed_at, streak_started_at)
          VALUES ($1, $2, 1, 1, 1, NOW(), NOW())
          RETURNING *
        `, [playerId, habit.id]);
      } else {
        const existing = progressResult.rows[0];
        const lastCompleted = existing.last_completed_at;
        const todayDate = new Date(today);
        const lastDate = new Date(lastCompleted).toISOString().split('T')[0];
        
        let newStreak = existing.current_streak;
        let newLongest = existing.longest_streak;
        
        if (lastDate === todayDate) {
          throw new Error('Habit already completed today');
        } else if (new Date(lastCompleted).getTime() === todayDate.getTime() - 24 * 60 * 60 * 1000) {
          // Consecutive day
          newStreak = existing.current_streak + 1;
          newLongest = Math.max(newLongest, newStreak);
        } else {
          // Streak broken
          newStreak = 1;
        }

        progress = await client.query(`
          UPDATE player_habit_progress 
          SET 
            current_streak = $1,
            longest_streak = $2,
            total_completed = total_completed + 1,
            last_completed_at = NOW(),
            streak_started_at = CASE WHEN $1 = 1 THEN NOW() ELSE streak_started_at END
          WHERE player_id = $3 AND habit_id = $4
          RETURNING *
        `, [newStreak, newLongest, playerId, habit.id]);
      }

      // Process rewards based on streak
      const rewards = JSON.parse(habit.rewards);
      const streakBonus = JSON.parse(habit.streak_bonus || '{}');
      
      let totalInfluence = 0;
      let totalExperience = 0;
      let totalTokens = 0;

      // Base rewards
      for (const reward of rewards) {
        switch (reward.type) {
          case 'influence':
            totalInfluence += reward.value;
            break;
          case 'experience':
            totalExperience += reward.value;
            break;
          case 'power_tokens':
            totalTokens += reward.value;
            break;
        }
      }

      // Streak bonuses
      const currentStreak = progress.rows[0].current_streak;
      if (streakBonus.thresholds) {
        for (const threshold of streakBonus.thresholds) {
          if (currentStreak >= threshold.days) {
            for (const bonus of threshold.rewards) {
              switch (bonus.type) {
                case 'influence':
                  totalInfluence += bonus.value;
                  break;
                case 'experience':
                  totalExperience += bonus.value;
                  break;
                case 'power_tokens':
                  totalTokens += bonus.value;
                  break;
              }
            }
          }
        }
      }

      // Update player stats
      await client.query(`
        UPDATE players 
        SET 
          influence = influence + $1,
          experience = experience + $2,
          power_tokens = power_tokens + $3
        WHERE id = $4
      `, [totalInfluence, totalExperience, totalTokens, playerId]);

      // Record transactions
      if (totalInfluence > 0) {
        await this.createTokenTransaction(
          playerId, 
          'earned', 
          totalInfluence, 
          'habit_complete', 
          `Habit: ${habit.name}`,
          client
        );
      }

      await client.query('COMMIT');

      return {
        success: true,
        data: {
          habit: habit,
          progress: progress.rows[0],
          rewards: {
            influence: totalInfluence,
            experience: totalExperience,
            powerTokens: totalTokens
          }
        },
        timestamp: new Date()
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Complete habit error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to complete habit',
        timestamp: new Date()
      };
    } finally {
      client.release();
    }
  }
}
