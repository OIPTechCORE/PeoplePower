import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { validateRequest, schemas } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { metricsMiddleware } from '../utils/metrics';

export function createSocialRoutes(pool: Pool): Router {
  const router = Router();

  // Apply metrics middleware
  router.use(metricsMiddleware);

  // Get player's communities
  router.get('/communities',
    authenticateToken,
    validateRequest(schemas.pagination),
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const offset = (page - 1) * limit;

        const result = await pool.query(`
          SELECT c.*, cm.role, cm.contribution
          FROM communities c
          JOIN community_members cm ON c.id = cm.community_id
          WHERE cm.player_id = $1
          ORDER BY cm.contribution DESC
          LIMIT $2 OFFSET $3
        `, [userId, limit, offset]);

        res.json({
          success: true,
          data: result.rows,
          pagination: {
            page,
            limit,
            total: result.rowCount
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'COMMUNITIES_FETCH_ERROR',
          message: 'Failed to fetch communities'
        });
      }
    }
  );

  // Create community
  router.post('/communities',
    authenticateToken,
    validateRequest(schemas.communityCreate),
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const { name, description, type } = req.body;

        const result = await pool.query(`
          INSERT INTO communities (name, description, type, leader_id, member_count)
          VALUES ($1, $2, $3, $4, 1)
          RETURNING *
        `, [name, description, type, userId]);

        const communityId = result.rows[0].id;

        // Add creator as leader
        await pool.query(`
          INSERT INTO community_members (community_id, player_id, role, contribution)
          VALUES ($1, $2, 'leader', 0)
        `, [communityId, userId]);

        res.status(201).json({
          success: true,
          data: result.rows[0]
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'COMMUNITY_CREATE_ERROR',
          message: 'Failed to create community'
        });
      }
    }
  );

  // Join community
  router.post('/communities/:communityId/join',
    authenticateToken,
    validateRequest(schemas.uuidParam('communityId')),
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const { communityId } = req.params;

        // Check if already a member
        const existingMember = await pool.query(
          'SELECT * FROM community_members WHERE community_id = $1 AND player_id = $2',
          [communityId, userId]
        );

        if (existingMember.rows.length > 0) {
          return res.status(400).json({
            success: false,
            error: 'ALREADY_MEMBER',
            message: 'Already a member of this community'
          });
        }

        // Add as member
        await pool.query(`
          INSERT INTO community_members (community_id, player_id, role, contribution)
          VALUES ($1, $2, 'member', 0)
        `, [communityId, userId]);

        // Update member count
        await pool.query(
          'UPDATE communities SET member_count = member_count + 1 WHERE id = $1',
          [communityId]
        );

        res.json({
          success: true,
          message: 'Successfully joined community'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'COMMUNITY_JOIN_ERROR',
          message: 'Failed to join community'
        });
      }
    }
  );

  // Get community members
  router.get('/communities/:communityId/members',
    authenticateToken,
    validateRequest([...schemas.uuidParam('communityId'), ...schemas.pagination]),
    async (req: Request, res: Response) => {
      try {
        const { communityId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const offset = (page - 1) * limit;

        const result = await pool.query(`
          SELECT 
            cm.role, 
            cm.contribution,
            p.id, 
            p.display_name, 
            p.username, 
            p.avatar_url,
            p.level,
            p.rank
          FROM community_members cm
          JOIN players p ON cm.player_id = p.id
          WHERE cm.community_id = $1
          ORDER BY cm.contribution DESC, p.level DESC
          LIMIT $2 OFFSET $3
        `, [communityId, limit, offset]);

        res.json({
          success: true,
          data: result.rows,
          pagination: {
            page,
            limit,
            total: result.rowCount
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'MEMBERS_FETCH_ERROR',
          message: 'Failed to fetch community members'
        });
      }
    }
  );

  // Get competitions
  router.get('/competitions',
    authenticateToken,
    validateRequest(schemas.pagination),
    async (req: Request, res: Response) => {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const offset = (page - 1) * limit;

        const result = await pool.query(`
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
          LIMIT $1 OFFSET $2
        `, [limit, offset]);

        res.json({
          success: true,
          data: result.rows,
          pagination: {
            page,
            limit,
            total: result.rowCount
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'COMPETITIONS_FETCH_ERROR',
          message: 'Failed to fetch competitions'
        });
      }
    }
  );

  // Join competition
  router.post('/competitions/:competitionId/join',
    authenticateToken,
    validateRequest(schemas.competitionJoin),
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const { competitionId } = req.params;

        // Check if already participating
        const existing = await pool.query(
          'SELECT * FROM player_competitions WHERE competition_id = $1 AND player_id = $2 AND completed_at IS NULL',
          [competitionId, userId]
        );

        if (existing.rows.length > 0) {
          return res.status(400).json({
            success: false,
            error: 'ALREADY_PARTICIPATING',
            message: 'Already participating in this competition'
          });
        }

        // Add to competition
        await pool.query(`
          INSERT INTO player_competitions (competition_id, player_id, joined_at)
          VALUES ($1, $2, NOW())
        `, [competitionId, userId]);

        res.json({
          success: true,
          message: 'Successfully joined competition'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'COMPETITION_JOIN_ERROR',
          message: 'Failed to join competition'
        });
      }
    }
  );

  // Get player's competition history
  router.get('/competitions/history',
    authenticateToken,
    validateRequest(schemas.pagination),
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const offset = (page - 1) * limit;

        const result = await pool.query(`
          SELECT 
            pc.*,
            c.name,
            c.description,
            c.type,
            c.reward_type,
            c.reward_amount
          FROM player_competitions pc
          JOIN competitions c ON pc.competition_id = c.id
          WHERE pc.player_id = $1
          ORDER BY pc.joined_at DESC
          LIMIT $2 OFFSET $3
        `, [userId, limit, offset]);

        res.json({
          success: true,
          data: result.rows,
          pagination: {
            page,
            limit,
            total: result.rowCount
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'COMPETITION_HISTORY_ERROR',
          message: 'Failed to fetch competition history'
        });
      }
    }
  );

  // Get referrals
  router.get('/referrals',
    authenticateToken,
    validateRequest(schemas.pagination),
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const offset = (page - 1) * limit;

        const result = await pool.query(`
          SELECT 
            r.*,
            p.display_name,
            p.username,
            p.avatar_url,
            p.level,
            p.joined_at
          FROM referrals r
          JOIN players p ON r.referred_id = p.id
          WHERE r.referrer_id = $1
          ORDER BY r.created_at DESC
          LIMIT $2 OFFSET $3
        `, [userId, limit, offset]);

        res.json({
          success: true,
          data: result.rows,
          pagination: {
            page,
            limit,
            total: result.rowCount
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'REFERRALS_FETCH_ERROR',
          message: 'Failed to fetch referrals'
        });
      }
    }
  );

  // Share to social media
  router.post('/share',
    authenticateToken,
    validateRequest(schemas.sendMessage),
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const { shareType, platform, message } = req.body;

        const result = await pool.query(`
          INSERT INTO social_shares (player_id, share_type, platform, message, shared_at)
          VALUES ($1, $2, $3, $4, NOW())
          RETURNING *
        `, [userId, shareType, platform, message]);

        // Award tokens for sharing (if configured)
        if (shareType === 'achievement' || shareType === 'milestone') {
          await pool.query(`
            INSERT INTO token_transactions (player_id, type, amount, source, created_at)
            VALUES ($1, 'earn', 10, 'social_share', NOW())
          `, [userId]);

          await pool.query(
            'UPDATE players SET power_tokens = power_tokens + 10, total_earned = total_earned + 10 WHERE id = $1',
            [userId]
          );
        }

        res.json({
          success: true,
          data: result.rows[0]
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'SOCIAL_SHARE_ERROR',
          message: 'Failed to record social share'
        });
      }
    }
  );

  return router;
}
