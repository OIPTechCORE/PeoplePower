import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { validateRequest, schemas } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { GameService } from '../services/gameService';
import { CacheService } from '../services/cacheService';
import { metricsMiddleware, playerActions } from '../utils/metrics';

export function createGameRoutes(pool: Pool, cacheService: CacheService): Router {
  const router = Router();
  const gameService = new GameService(pool);

  // Apply metrics middleware
  router.use(metricsMiddleware);

  // Get player profile
  router.get('/profile', authenticateToken, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const profile = await cacheService.getCachedPlayerStats(userId);
      
      if (!profile) {
        const result = await pool.query(
          'SELECT * FROM players WHERE id = $1',
          [userId]
        );
        
        if (result.rows.length === 0) {
          return res.status(404).json({
            success: false,
            error: 'PLAYER_NOT_FOUND',
            message: 'Player profile not found'
          });
        }

        await cacheService.cachePlayerStats(userId, result.rows[0]);
        return res.json({
          success: true,
          data: result.rows[0]
        });
      }

      res.json({
        success: true,
        data: profile
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'PROFILE_FETCH_ERROR',
        message: 'Failed to fetch player profile'
      });
    }
  });

  // Update player profile
  router.put('/profile', 
    authenticateToken,
    validateRequest(schemas.playerUpdate),
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const { displayName, avatar, bio } = req.body;

        const result = await pool.query(
          'UPDATE players SET display_name = COALESCE($1, display_name), avatar_url = COALESCE($2, avatar_url), updated_at = NOW() WHERE id = $3 RETURNING *',
          [displayName, avatar, userId]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({
            success: false,
            error: 'PLAYER_NOT_FOUND',
            message: 'Player not found'
          });
        }

        // Invalidate cache
        await cacheService.invalidatePlayerCache(userId);

        res.json({
          success: true,
          data: result.rows[0]
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'PROFILE_UPDATE_ERROR',
          message: 'Failed to update player profile'
        });
      }
    }
  );

  // Process game action
  router.post('/action',
    authenticateToken,
    validateRequest(schemas.gameAction),
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const { type, data, timestamp } = req.body;

        // Record player action metric
        playerActions.inc({ action_type: type, player_id: userId });

        const result = await gameService.processGameAction(userId, {
          type,
          data,
          timestamp: timestamp || new Date().toISOString()
        });

        // Invalidate relevant caches
        await cacheService.invalidatePlayerCache(userId);

        res.json({
          success: true,
          data: result
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'GAME_ACTION_ERROR',
          message: 'Failed to process game action'
        });
      }
    }
  );

  // Get available missions
  router.get('/missions',
    authenticateToken,
    validateRequest([schemas.pagination[0], schemas.pagination[1]]),
    async (req: Request, res: Response) => {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const offset = (page - 1) * limit;

        const missions = await cacheService.getCachedGameData('missions');
        
        if (missions) {
          const paginatedMissions = missions.slice(offset, offset + limit);
          return res.json({
            success: true,
            data: paginatedMissions,
            pagination: {
              page,
              limit,
              total: missions.length,
              totalPages: Math.ceil(missions.length / limit)
            }
          });
        }

        const result = await pool.query(
          'SELECT * FROM missions WHERE is_active = true ORDER BY order_index LIMIT $1 OFFSET $2',
          [limit, offset]
        );

        res.json({
          success: true,
          data: result.rows,
          pagination: {
            page,
            limit,
            total: result.rowCount,
            totalPages: Math.ceil((result.rowCount || 0) / limit)
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'MISSIONS_FETCH_ERROR',
          message: 'Failed to fetch missions'
        });
      }
    }
  );

  // Complete mission
  router.post('/missions/:missionId/complete',
    authenticateToken,
    validateRequest([...schemas.uuidParam('missionId'), schemas.missionComplete[1]]),
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const { missionId } = req.params;
        const { completionData } = req.body;

        const result = await gameService.completeMission(userId, missionId, completionData);

        // Invalidate caches
        await cacheService.invalidatePlayerCache(userId);
        await cacheService.invalidate('game:data:missions');

        res.json({
          success: true,
          data: result
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'MISSION_COMPLETE_ERROR',
          message: 'Failed to complete mission'
        });
      }
    }
  );

  // Get leaderboards
  router.get('/leaderboards',
    authenticateToken,
    validateRequest(schemas.leaderboardQuery),
    async (req: Request, res: Response) => {
      try {
        const { type = 'global', period = 'daily', limit = 50, offset = 0 } = req.query;

        const leaderboard = await cacheService.getCachedLeaderboard(
          type as string,
          period as string
        );

        const paginatedLeaderboard = leaderboard.slice(
          offset as number,
          (offset as number) + (limit as number)
        );

        res.json({
          success: true,
          data: paginatedLeaderboard,
          meta: {
            type,
            period,
            total: leaderboard.length,
            limit,
            offset
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'LEADERBOARD_FETCH_ERROR',
          message: 'Failed to fetch leaderboard'
        });
      }
    }
  );

  // Get player statistics
  router.get('/stats',
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const { period = 'day' } = req.query;

        const stats = await pool.query(`
          SELECT 
            COUNT(*) as total_actions,
            COUNT(CASE WHEN type = 'mission_complete' THEN 1 END) as missions_completed,
            COUNT(CASE WHEN type = 'tap' THEN 1 END) as total_taps,
            SUM(CASE WHEN type = 'earn' THEN amount ELSE 0 END) as tokens_earned,
            SUM(CASE WHEN type = 'spend' THEN amount ELSE 0 END) as tokens_spent
          FROM game_sessions gs
          LEFT JOIN token_transactions tt ON gs.player_id = tt.player_id
          WHERE gs.player_id = $1
            AND gs.created_at >= CASE 
              WHEN $2 = 'day' THEN NOW() - INTERVAL '24 hours'
              WHEN $2 = 'week' THEN NOW() - INTERVAL '7 days'
              WHEN $2 = 'month' THEN NOW() - INTERVAL '30 days'
              WHEN $2 = 'year' THEN NOW() - INTERVAL '365 days'
              ELSE '1970-01-01'::timestamp
            END
        `, [userId, period]);

        res.json({
          success: true,
          data: {
            period,
            stats: stats.rows[0]
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'STATS_FETCH_ERROR',
          message: 'Failed to fetch player statistics'
        });
      }
    }
  );

  // Get daily habits
  router.get('/habits',
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;

        const habits = await cacheService.getCachedGameData('habits');
        
        if (!habits) {
          const result = await pool.query(
            'SELECT * FROM daily_habits WHERE is_active = true ORDER BY category, name'
          );
          return res.json({
            success: true,
            data: result.rows
          });
        }

        // Get user's progress for each habit
        const progressResult = await pool.query(
          'SELECT * FROM player_habit_progress WHERE player_id = $1',
          [userId]
        );

        const habitsWithProgress = habits.map(habit => {
          const progress = progressResult.rows.find(p => p.habit_id === habit.id);
          return {
            ...habit,
            userProgress: progress || null
          };
        });

        res.json({
          success: true,
          data: habitsWithProgress
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'HABITS_FETCH_ERROR',
          message: 'Failed to fetch daily habits'
        });
      }
    }
  );

  // Update habit progress
  router.put('/habits/:habitId/progress',
    authenticateToken,
    validateRequest(schemas.uuidParam('habitId')),
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const { habitId } = req.params;
        const { progress, completed } = req.body;

        const result = await pool.query(`
          INSERT INTO player_habit_progress (player_id, habit_id, progress, completed, last_completed_at)
          VALUES ($1, $2, $3, $4, NOW())
          ON CONFLICT (player_id, habit_id)
          DO UPDATE SET
            progress = EXCLUDED.progress,
            completed = EXCLUDED.completed,
            last_completed_at = CASE 
              WHEN EXCLUDED.completed = true THEN NOW()
              ELSE player_habit_progress.last_completed_at
            END,
            updated_at = NOW()
          RETURNING *
        `, [userId, habitId, progress || 0, completed || false]);

        res.json({
          success: true,
          data: result.rows[0]
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'HABIT_PROGRESS_ERROR',
          message: 'Failed to update habit progress'
        });
      }
    }
  );

  return router;
}
