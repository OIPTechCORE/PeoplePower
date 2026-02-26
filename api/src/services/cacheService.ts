import Redis from 'ioredis';
import { Pool } from 'pg';
import { cacheHits, cacheMisses } from './metrics';

export class CacheService {
  private redis: Redis | null = null;
  private pool: Pool;
  private isEnabled: boolean;

  constructor(redisUrl: string | undefined, pool: Pool) {
    this.pool = pool;
    this.isEnabled = !!redisUrl;
    
    if (this.isEnabled) {
      try {
        this.redis = new Redis(redisUrl, {
          retryDelayOnFailover: 100,
          maxRetriesPerRequest: 3,
          lazyConnect: true,
          keepAlive: 30000,
          family: 4,
          keyPrefix: 'people_power:',
        });

        this.redis.on('error', (error) => {
          console.error('Redis connection error:', error);
        });

        this.redis.on('connect', () => {
          console.log('Redis connected successfully');
        });
      } catch (error) {
        console.error('Failed to initialize Redis:', error);
        this.isEnabled = false;
      }
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isEnabled || !this.redis) {
      return null;
    }

    try {
      const cached = await this.redis.get(key);
      if (cached) {
        cacheHits.inc({ cache_type: 'redis' });
        return JSON.parse(cached);
      }
      cacheMisses.inc({ cache_type: 'redis' });
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      cacheMisses.inc({ cache_type: 'redis' });
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    if (!this.isEnabled || !this.redis) {
      return;
    }

    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isEnabled || !this.redis) {
      return;
    }

    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async invalidate(pattern: string): Promise<void> {
    if (!this.isEnabled || !this.redis) {
      return;
    }

    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache invalidate error:', error);
    }
  }

  async getCachedPlayerStats(playerId: string): Promise<any> {
    const cacheKey = `player:stats:${playerId}`;
    let stats = await this.get(cacheKey);
    
    if (!stats) {
      const result = await this.pool.query(
        'SELECT * FROM player_stats WHERE player_id = $1',
        [playerId]
      );
      stats = result.rows[0];
      if (stats) {
        await this.set(cacheKey, stats, 300); // 5 minutes
      }
    }
    
    return stats;
  }

  async cachePlayerStats(playerId: string, stats: any): Promise<void> {
    const cacheKey = `player:stats:${playerId}`;
    await this.set(cacheKey, stats, 300); // 5 minutes
  }

  async getCachedLeaderboard(type: string, period: string): Promise<any[]> {
    const cacheKey = `leaderboard:${type}:${period}`;
    let leaderboard = await this.get(cacheKey);
    
    if (!leaderboard) {
      const result = await this.pool.query(`
        SELECT 
          le.*,
          p.display_name,
          p.avatar_url
        FROM leaderboard_entries le
        JOIN players p ON le.player_id = p.id
        JOIN leaderboards l ON le.leaderboard_id = l.id
        WHERE l.type = $1 AND l.period = $2 AND l.is_active = true
        ORDER BY le.rank ASC
        LIMIT 100
      `, [type, period]);
      
      leaderboard = result.rows;
      await this.set(cacheKey, leaderboard, 60); // 1 minute
    }
    
    return leaderboard;
  }

  async invalidatePlayerCache(playerId: string): Promise<void> {
    await this.invalidate(`player:stats:${playerId}`);
    await this.invalidate(`player:${playerId}:*`);
  }

  async getCachedGameData(gameType: string): Promise<any> {
    const cacheKey = `game:data:${gameType}`;
    let gameData = await this.get(cacheKey);
    
    if (!gameData) {
      // Fetch game data based on type
      switch (gameType) {
        case 'missions':
          gameData = await this.getMissionsData();
          break;
        case 'habits':
          gameData = await this.getHabitsData();
          break;
        case 'competitions':
          gameData = await this.getCompetitionsData();
          break;
        default:
          gameData = null;
      }
      
      if (gameData) {
        await this.set(cacheKey, gameData, 600); // 10 minutes
      }
    }
    
    return gameData;
  }

  private async getMissionsData(): Promise<any[]> {
    const result = await this.pool.query(`
      SELECT * FROM missions 
      WHERE is_active = true 
        AND (expires_at IS NULL OR expires_at > NOW())
      ORDER BY category, order_index
    `);
    return result.rows;
  }

  private async getHabitsData(): Promise<any[]> {
    const result = await this.pool.query(`
      SELECT * FROM daily_habits 
      WHERE is_active = true
      ORDER BY category, name
    `);
    return result.rows;
  }

  private async getCompetitionsData(): Promise<any[]> {
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
    `);
    return result.rows;
  }

  async getCacheStats(): Promise<any> {
    if (!this.isEnabled || !this.redis) {
      return { enabled: false };
    }

    try {
      const info = await this.redis.info('memory');
      const keyspace = await this.redis.info('keyspace');
      
      return {
        enabled: true,
        memory: info,
        keyspace: keyspace
      };
    } catch (error) {
      return { enabled: false, error: error.message };
    }
  }

  async disconnect(): Promise<void> {
    if (this.redis) {
      await this.redis.disconnect();
    }
  }
}
