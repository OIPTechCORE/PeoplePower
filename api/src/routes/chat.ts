import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { validateRequest, schemas } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { metricsMiddleware } from '../utils/metrics';

export function createChatRoutes(pool: Pool): Router {
  const router = Router();

  // Apply metrics middleware
  router.use(metricsMiddleware);

  // Get chat channels
  router.get('/channels',
    authenticateToken,
    validateRequest(schemas.pagination),
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const offset = (page - 1) * limit;

        const result = await pool.query(`
          SELECT DISTINCT
            c.*,
            cm.last_read_at,
            COUNT(m.id) as unread_count
          FROM chat_channels c
          JOIN chat_channel_members ccm ON c.id = ccm.channel_id
          LEFT JOIN chat_channel_members cm ON c.id = cm.channel_id AND cm.player_id = $1
          LEFT JOIN chat_messages m ON c.id = m.channel_id AND m.created_at > COALESCE(cm.last_read_at, '1970-01-01')
          WHERE ccm.player_id = $1
          GROUP BY c.id, cm.last_read_at
          ORDER BY c.updated_at DESC
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
          error: 'CHANNELS_FETCH_ERROR',
          message: 'Failed to fetch chat channels'
        });
      }
    }
  );

  // Get channel messages
  router.get('/channels/:channelId/messages',
    authenticateToken,
    validateRequest([...schemas.uuidParam('channelId'), ...schemas.pagination]),
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const { channelId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const offset = (page - 1) * limit;

        // Check if user is member of the channel
        const membership = await pool.query(
          'SELECT * FROM chat_channel_members WHERE channel_id = $1 AND player_id = $2',
          [channelId, userId]
        );

        if (membership.rows.length === 0) {
          return res.status(403).json({
            success: false,
            error: 'NOT_CHANNEL_MEMBER',
            message: 'You are not a member of this channel'
          });
        }

        const result = await pool.query(`
          SELECT 
            m.*,
            p.display_name,
            p.username,
            p.avatar_url,
            p.rank
          FROM chat_messages m
          JOIN players p ON m.player_id = p.id
          WHERE m.channel_id = $1
          ORDER BY m.created_at DESC
          LIMIT $2 OFFSET $3
        `, [channelId, limit, offset]);

        // Update last read timestamp
        await pool.query(
          'UPDATE chat_channel_members SET last_read_at = NOW() WHERE channel_id = $1 AND player_id = $2',
          [channelId, userId]
        );

        res.json({
          success: true,
          data: result.rows.reverse(), // Return in chronological order
          pagination: {
            page,
            limit,
            total: result.rowCount
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'MESSAGES_FETCH_ERROR',
          message: 'Failed to fetch messages'
        });
      }
    }
  );

  // Send message
  router.post('/channels/:channelId/messages',
    authenticateToken,
    validateRequest([...schemas.uuidParam('channelId'), schemas.sendMessage[1]]),
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const { channelId } = req.params;
        const { message, type = 'text' } = req.body;

        // Check if user is member of the channel
        const membership = await pool.query(
          'SELECT * FROM chat_channel_members WHERE channel_id = $1 AND player_id = $2',
          [channelId, userId]
        );

        if (membership.rows.length === 0) {
          return res.status(403).json({
            success: false,
            error: 'NOT_CHANNEL_MEMBER',
            message: 'You are not a member of this channel'
          });
        }

        // Insert message
        const result = await pool.query(`
          INSERT INTO chat_messages (channel_id, player_id, message, type, created_at)
          VALUES ($1, $2, $3, $4, NOW())
          RETURNING *
        `, [channelId, userId, message, type]);

        // Update channel activity
        await pool.query(
          'UPDATE chat_channels SET updated_at = NOW() WHERE id = $1',
          [channelId]
        );

        // Get message with player details
        const messageWithPlayer = await pool.query(`
          SELECT 
            m.*,
            p.display_name,
            p.username,
            p.avatar_url,
            p.rank
          FROM chat_messages m
          JOIN players p ON m.player_id = p.id
          WHERE m.id = $1
        `, [result.rows[0].id]);

        res.status(201).json({
          success: true,
          data: messageWithPlayer.rows[0]
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'MESSAGE_SEND_ERROR',
          message: 'Failed to send message'
        });
      }
    }
  );

  // Create channel
  router.post('/channels',
    authenticateToken,
    validateRequest([
      body('name').isLength({ min: 3, max: 100 }).withMessage('Channel name must be between 3 and 100 characters'),
      body('type').isIn(['public', 'private', 'community']).withMessage('Invalid channel type'),
      body('description').optional().isLength({ max: 500 }).withMessage('Description must not exceed 500 characters')
    ]),
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const { name, type, description, communityId } = req.body;

        // Start transaction
        await pool.query('BEGIN');

        try {
          // Create channel
          const channelResult = await pool.query(`
            INSERT INTO chat_channels (name, type, description, community_id, created_by, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
            RETURNING *
          `, [name, type, description, communityId, userId]);

          const channelId = channelResult.rows[0].id;

          // Add creator as member and admin
          await pool.query(`
            INSERT INTO chat_channel_members (channel_id, player_id, role, joined_at)
            VALUES ($1, $2, 'admin', NOW())
          `, [channelId, userId]);

          await pool.query('COMMIT');

          res.status(201).json({
            success: true,
            data: channelResult.rows[0]
          });
        } catch (innerError) {
          await pool.query('ROLLBACK');
          throw innerError;
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'CHANNEL_CREATE_ERROR',
          message: 'Failed to create channel'
        });
      }
    }
  );

  // Join channel
  router.post('/channels/:channelId/join',
    authenticateToken,
    validateRequest(schemas.uuidParam('channelId')),
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const { channelId } = req.params;

        // Check if channel exists and is joinable
        const channel = await pool.query(
          'SELECT * FROM chat_channels WHERE id = $1',
          [channelId]
        );

        if (channel.rows.length === 0) {
          return res.status(404).json({
            success: false,
            error: 'CHANNEL_NOT_FOUND',
            message: 'Channel not found'
          });
        }

        const channelData = channel.rows[0];

        if (channelData.type === 'private') {
          return res.status(403).json({
            success: false,
            error: 'PRIVATE_CHANNEL',
            message: 'Cannot join private channel directly'
          });
        }

        // Check if already a member
        const existingMember = await pool.query(
          'SELECT * FROM chat_channel_members WHERE channel_id = $1 AND player_id = $2',
          [channelId, userId]
        );

        if (existingMember.rows.length > 0) {
          return res.status(400).json({
            success: false,
            error: 'ALREADY_MEMBER',
            message: 'Already a member of this channel'
          });
        }

        // Add as member
        await pool.query(`
          INSERT INTO chat_channel_members (channel_id, player_id, role, joined_at)
          VALUES ($1, $2, 'member', NOW())
        `, [channelId, userId]);

        res.json({
          success: true,
          message: 'Successfully joined channel'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'CHANNEL_JOIN_ERROR',
          message: 'Failed to join channel'
        });
      }
    }
  );

  // Leave channel
  router.post('/channels/:channelId/leave',
    authenticateToken,
    validateRequest(schemas.uuidParam('channelId')),
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const { channelId } = req.params;

        // Check if member
        const membership = await pool.query(
          'SELECT * FROM chat_channel_members WHERE channel_id = $1 AND player_id = $2',
          [channelId, userId]
        );

        if (membership.rows.length === 0) {
          return res.status(400).json({
            success: false,
            error: 'NOT_MEMBER',
            message: 'You are not a member of this channel'
          });
        }

        // Remove from channel
        await pool.query(
          'DELETE FROM chat_channel_members WHERE channel_id = $1 AND player_id = $2',
          [channelId, userId]
        );

        res.json({
          success: true,
          message: 'Successfully left channel'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'CHANNEL_LEAVE_ERROR',
          message: 'Failed to leave channel'
        });
      }
    }
  );

  // Get channel members
  router.get('/channels/:channelId/members',
    authenticateToken,
    validateRequest([...schemas.uuidParam('channelId'), ...schemas.pagination]),
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const { channelId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const offset = (page - 1) * limit;

        // Check if user is member
        const membership = await pool.query(
          'SELECT * FROM chat_channel_members WHERE channel_id = $1 AND player_id = $2',
          [channelId, userId]
        );

        if (membership.rows.length === 0) {
          return res.status(403).json({
            success: false,
            error: 'NOT_CHANNEL_MEMBER',
            message: 'You are not a member of this channel'
          });
        }

        const result = await pool.query(`
          SELECT 
            ccm.role,
            ccm.joined_at,
            p.id,
            p.display_name,
            p.username,
            p.avatar_url,
            p.rank,
            p.level,
            p.is_active,
            p.last_active_at
          FROM chat_channel_members ccm
          JOIN players p ON ccm.player_id = p.id
          WHERE ccm.channel_id = $1
          ORDER BY ccm.role DESC, p.last_active_at DESC
          LIMIT $2 OFFSET $3
        `, [channelId, limit, offset]);

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
          message: 'Failed to fetch channel members'
        });
      }
    }
  );

  return router;
}
