import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { 
  SuperAdminDashboard, 
  AdminAccessLevel,
  AdminModule,
  AdminAction,
  UserStatus,
  RiskLevel,
  FlagType,
  ContentStatus,
  ModerationStatus,
  ModerationPriority,
  ProjectStatus
} from '../../../shared/types/ecosystems-final';

export function createAdminRoutes(pool: Pool): Router {
  const router = Router();

  // ==================== AUTHENTICATION & ACCESS CONTROL ====================
  
  // Admin authentication middleware
  const requireAdminAccess = (requiredLevel: AdminAccessLevel) => {
    return async (req: Request, res: Response, next: Function) => {
      try {
        const { adminId } = req.headers;
        
        if (!adminId) {
          return res.status(401).json({ success: false, error: 'Admin ID required' });
        }

        // Get admin dashboard to verify access level
        const adminResult = await pool.query(
          'SELECT * FROM super_admin_dashboard WHERE admin_id = $1',
          [adminId]
        );

        if (adminResult.rows.length === 0) {
          return res.status(403).json({ success: false, error: 'Admin not found' });
        }

        const admin = adminResult.rows[0];
        
        // Check access level hierarchy
        if (!hasRequiredAccess(admin.access_level, requiredLevel)) {
          return res.status(403).json({ success: false, error: 'Insufficient access level' });
        }

        // Update last login
        await pool.query(
          'UPDATE super_admin_dashboard SET last_login_at = NOW() WHERE admin_id = $1',
          [adminId]
        );

        req.admin = admin;
        next();
      } catch (error) {
        res.status(500).json({ success: false, error: (error as Error).message });
      }
    };
  };

  // ==================== SYSTEM OVERVIEW ====================
  
  // Get system statistics
  router.get('/system/stats', requireAdminAccess(AdminAccessLevel.READ_ONLY), async (req: Request, res: Response) => {
    try {
      // Get user statistics
      const userStats = await pool.query(
        `SELECT 
          COUNT(*) as total_users,
          COUNT(CASE WHEN last_active_at > NOW() - INTERVAL '24 hours' THEN 1 END) as active_users,
          COUNT(CASE WHEN last_active_at > NOW() - INTERVAL '1 hour' THEN 1 END) as online_users,
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as new_users
        FROM players`
      );

      // Get transaction statistics
      const transactionStats = await pool.query(
        `SELECT 
          COUNT(*) as total_transactions,
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as daily_transactions
        FROM transactions`
      );

      // Get system performance
      const systemStats = await pool.query(
        `SELECT 
          pg_stat_database.datname as database_name,
          pg_stat_database.numbackends as active_connections,
          pg_stat_database.xact_commit as transactions,
          pg_stat_database.blks_read as blocks_read,
          pg_stat_database.blks_hit as blocks_hit
        FROM pg_stat_database WHERE datname = current_database()`
      );

      // Get ecosystem statistics
      const ecosystemStats = await pool.query(
        `SELECT 
          'stars' as ecosystem, COUNT(*) as count FROM stars_ecosystems
        UNION ALL
        SELECT 'diamonds' as ecosystem, COUNT(*) as count FROM diamonds_ecosystems
        UNION ALL
        SELECT 'gifts' as ecosystem, COUNT(*) as count FROM gifts_ecosystems
        UNION ALL
        SELECT 'marketplace' as ecosystem, COUNT(*) as count FROM marketplace_ecosystems
        UNION ALL
        SELECT 'charity' as ecosystem, COUNT(*) as count FROM charity_ecosystems
        UNION ALL
        SELECT 'leaderboard' as ecosystem, COUNT(*) as count FROM leaderboard_ecosystems
        UNION ALL
        SELECT 'tasksboard' as ecosystem, COUNT(*) as count FROM tasksboard_ecosystems`
      );

      res.json({ 
        success: true, 
        data: {
          userStats: userStats.rows[0],
          transactionStats: transactionStats.rows[0],
          systemStats: systemStats.rows[0],
          ecosystemStats: ecosystemStats.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== USER MANAGEMENT ====================
  
  // Get users with filters
  router.get('/users', requireAdminAccess(AdminAccessLevel.MODERATOR), async (req: Request, res: Response) => {
    try {
      const { 
        status, riskLevel, search, limit = 50, offset = 0 
      } = req.query;
      
      let query = `
        SELECT 
          p.*,
          pe.power_tokens,
          pe.total_earned,
          CASE 
            WHEN p.last_active_at > NOW() - INTERVAL '24 hours' THEN 'active'
            WHEN p.last_active_at > NOW() - INTERVAL '7 days' THEN 'recent'
            ELSE 'inactive'
          END as activity_status
        FROM players p
        LEFT JOIN player_economy pe ON p.id = pe.player_id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (status) {
        query += ' AND p.is_active = $' + (params.length + 1);
        params.push(status === 'true');
      }

      if (riskLevel) {
        query += ' AND p.risk_level = $' + (params.length + 1);
        params.push(riskLevel);
      }

      if (search) {
        query += ' AND (p.username ILIKE $' + (params.length + 1) + ' OR p.email ILIKE $' + (params.length + 1) + ')';
        params.push(`%${search}%`);
      }

      query += ' ORDER BY p.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
      params.push(limit, offset);

      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Update user status
  router.patch('/users/:userId/status', requireAdminAccess(AdminAccessLevel.ADMINISTRATOR), async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { status, reason } = req.body;

      const result = await pool.query(
        `UPDATE players SET 
          is_active = $1, 
          status_updated_at = NOW(),
          status_reason = $2
        WHERE id = $3 RETURNING *`,
        [status === 'active', reason, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      // Log the action
      await pool.query(
        `INSERT INTO admin_action_log (
          admin_id, action, target_type, target_id, reason, timestamp
        ) VALUES ($1, $2, $3, $4, $5, NOW())`,
        [(req as any).admin.admin_id, 'update_user_status', 'user', userId, reason]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Flag user
  router.post('/users/:userId/flag', requireAdminAccess(AdminAccessLevel.MODERATOR), async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { type, reason } = req.body;

      const result = await pool.query(
        `INSERT INTO user_flags (
          player_id, type, reason, flagged_by, flagged_at, is_active
        ) VALUES ($1, $2, $3, $4, NOW(), true) 
        RETURNING *`,
        [userId, type, reason, (req as any).admin.admin_id]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== CONTENT MODERATION ====================
  
  // Get content moderation queue
  router.get('/content/moderation', requireAdminAccess(AdminAccessLevel.MODERATOR), async (req: Request, res: Response) => {
    try {
      const { status, priority, limit = 50 } = req.query;
      
      let query = `
        SELECT 
          cm.*,
          p.username as reporter_name,
          CASE 
            WHEN cm.content_type = 'story' THEN s.title
            WHEN cm.content_type = 'mission' THEN m.title
            WHEN cm.content_type = 'education' THEN e.title
            ELSE 'Unknown'
          END as content_title
        FROM content_moderation cm
        LEFT JOIN players p ON cm.reported_by = p.id
        LEFT JOIN stories s ON cm.content_id = s.id AND cm.content_type = 'story'
        LEFT JOIN missions m ON cm.content_id = m.id AND cm.content_type = 'mission'
        LEFT JOIN education_content e ON cm.content_id = e.id AND cm.content_type = 'education'
        WHERE 1=1
      `;
      const params: any[] = [];

      if (status) {
        query += ' AND cm.status = $' + (params.length + 1);
        params.push(status);
      }

      if (priority) {
        query += ' AND cm.priority = $' + (params.length + 1);
        params.push(priority);
      }

      query += ' ORDER BY cm.priority DESC, cm.created_at ASC LIMIT $' + (params.length + 1);
      params.push(limit);

      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Moderate content
  router.patch('/content/:id/moderate', requireAdminAccess(AdminAccessLevel.MODERATOR), async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { action, reason } = req.body;

      let newStatus: ModerationStatus;
      switch (action) {
        case 'approve':
          newStatus = ModerationStatus.APPROVED;
          break;
        case 'reject':
          newStatus = ModerationStatus.REJECTED;
          break;
        case 'escalate':
          newStatus = ModerationStatus.ESCALATED;
          break;
        default:
          return res.status(400).json({ success: false, error: 'Invalid action' });
      }

      const result = await pool.query(
        `UPDATE content_moderation SET 
          status = $1, 
          reviewed_by = $2, 
          reviewed_at = NOW(),
          review_reason = $3
        WHERE id = $4 RETURNING *`,
        [newStatus, (req as any).admin.admin_id, reason, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Content moderation item not found' });
      }

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== ECONOMY MANAGEMENT ====================
  
  // Get economy statistics
  router.get('/economy/stats', requireAdminAccess(AdminAccessLevel.ADMINISTRATOR), async (req: Request, res: Response) => {
    try {
      // Token supply statistics
      const tokenSupply = await pool.query(
        `SELECT 
          SUM(power_tokens) as total_supply,
          SUM(total_earned) as total_earned,
          COUNT(*) as holder_count
        FROM player_economy`
      );

      // Transaction volume
      const transactionVolume = await pool.query(
        `SELECT 
          DATE_TRUNC('day', created_at) as date,
          COUNT(*) as transaction_count,
          SUM(amount) as total_volume
        FROM transactions 
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY date DESC`
      );

      // Ecosystem activity
      const ecosystemActivity = await pool.query(
        `SELECT 
          'stars' as ecosystem, COUNT(*) as active_users FROM stars_ecosystems WHERE updated_at > NOW() - INTERVAL '7 days'
        UNION ALL
        SELECT 'diamonds' as ecosystem, COUNT(*) as active_users FROM diamonds_ecosystems WHERE updated_at > NOW() - INTERVAL '7 days'
        UNION ALL
        SELECT 'gifts' as ecosystem, COUNT(*) as active_users FROM gifts_ecosystems WHERE updated_at > NOW() - INTERVAL '7 days'
        UNION ALL
        SELECT 'marketplace' as ecosystem, COUNT(*) as active_users FROM marketplace_ecosystems WHERE updated_at > NOW() - INTERVAL '7 days'
        UNION ALL
        SELECT 'charity' as ecosystem, COUNT(*) as active_users FROM charity_ecosystems WHERE updated_at > NOW() - INTERVAL '7 days'`
      );

      res.json({ 
        success: true, 
        data: {
          tokenSupply: tokenSupply.rows[0],
          transactionVolume: transactionVolume.rows,
          ecosystemActivity: ecosystemActivity.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Adjust user tokens
  router.post('/economy/adjust-tokens', requireAdminAccess(AdminAccessLevel.SYSTEM_OWNER), async (req: Request, res: Response) => {
    try {
      const { userId, amount, reason } = req.body;

      // Get current tokens
      const currentTokens = await pool.query(
        'SELECT power_tokens FROM player_economy WHERE player_id = $1',
        [userId]
      );

      if (currentTokens.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'User economy not found' });
      }

      const newAmount = Math.max(0, currentTokens.rows[0].power_tokens + amount);

      // Update tokens
      await pool.query(
        'UPDATE player_economy SET power_tokens = $1 WHERE player_id = $2',
        [newAmount, userId]
      );

      // Create transaction record
      await pool.query(
        `INSERT INTO transactions (
          player_id, type, amount, reason, created_by, created_at
        ) VALUES ($1, $2, $3, $4, $5, NOW())`,
        [userId, amount > 0 ? 'admin_grant' : 'admin_deduct', Math.abs(amount), reason, (req as any).admin.admin_id]
      );

      res.json({ 
        success: true, 
        data: { 
          previousAmount: currentTokens.rows[0].power_tokens,
          newAmount,
          adjustment: amount
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== SYSTEM MANAGEMENT ====================
  
  // Get system logs
  router.get('/system/logs', requireAdminAccess(AdminAccessLevel.ADMINISTRATOR), async (req: Request, res: Response) => {
    try {
      const { level, limit = 100 } = req.query;
      
      let query = 'SELECT * FROM system_logs WHERE 1=1';
      const params: any[] = [];

      if (level) {
        query += ' AND level = $' + (params.length + 1);
        params.push(level);
      }

      query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1);
      params.push(limit);

      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // System maintenance mode
  router.post('/system/maintenance', requireAdminAccess(AdminAccessLevel.SYSTEM_OWNER), async (req: Request, res: Response) => {
    try {
      const { enabled, message, duration } = req.body;

      await pool.query(
        `INSERT INTO system_settings (key, value, updated_by, updated_at)
         VALUES ('maintenance_mode', $1, $2, NOW())
         ON CONFLICT (key) DO UPDATE SET
           value = EXCLUDED.value,
           updated_by = EXCLUDED.updated_by,
           updated_at = NOW()`,
        [JSON.stringify({ enabled, message, duration }), (req as any).admin.admin_id]
      );

      res.json({ success: true, message: 'Maintenance mode updated' });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== ANALYTICS & REPORTING ====================
  
  // Get comprehensive analytics
  router.get('/analytics', requireAdminAccess(AdminAccessLevel.ADMINISTRATOR), async (req: Request, res: Response) => {
    try {
      const { period = '30d' } = req.query;
      
      // User growth analytics
      const userGrowth = await pool.query(
        `SELECT 
          DATE_TRUNC('day', created_at) as date,
          COUNT(*) as new_users
        FROM players 
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY date DESC`
      );

      // Engagement analytics
      const engagement = await pool.query(
        `SELECT 
          DATE_TRUNC('day', last_active_at) as date,
          COUNT(*) as active_users
        FROM players 
        WHERE last_active_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE_TRUNC('day', last_active_at)
        ORDER BY date DESC`
      );

      // Revenue analytics
      const revenue = await pool.query(
        `SELECT 
          DATE_TRUNC('day', created_at) as date,
          SUM(amount) as daily_revenue,
          COUNT(*) as transaction_count
        FROM transactions 
        WHERE created_at >= NOW() - INTERVAL '30 days' AND type = 'purchase'
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY date DESC`
      );

      // Ecosystem performance
      const ecosystemPerformance = await pool.query(
        `SELECT 
          ecosystem_name,
          user_count,
          daily_active_users,
          total_transactions,
          revenue_generated
        FROM ecosystem_analytics
        WHERE date >= NOW() - INTERVAL '30 days'
        ORDER BY revenue_generated DESC`
      );

      res.json({ 
        success: true, 
        data: {
          userGrowth: userGrowth.rows,
          engagement: engagement.rows,
          revenue: revenue.rows,
          ecosystemPerformance: ecosystemPerformance.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Export reports
  router.post('/reports/export', requireAdminAccess(AdminAccessLevel.ADMINISTRATOR), async (req: Request, res: Response) => {
    try {
      const { reportType, format, filters } = req.body;

      let query = '';
      let filename = '';

      switch (reportType) {
        case 'users':
          query = 'SELECT * FROM users_export_view WHERE 1=1';
          filename = 'users_export';
          break;
        case 'transactions':
          query = 'SELECT * FROM transactions_export_view WHERE 1=1';
          filename = 'transactions_export';
          break;
        case 'ecosystems':
          query = 'SELECT * FROM ecosystems_export_view WHERE 1=1';
          filename = 'ecosystems_export';
          break;
        default:
          return res.status(400).json({ success: false, error: 'Invalid report type' });
      }

      // Apply filters if provided
      if (filters) {
        // Add filter logic here
      }

      const result = await pool.query(query);

      // Generate export based on format
      if (format === 'csv') {
        // Convert to CSV and send
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
        return res.send(convertToCSV(result.rows));
      } else if (format === 'json') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}.json"`);
        return res.json({ success: true, data: result.rows });
      }

      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  return router;
}

// Helper functions
function hasRequiredAccess(currentLevel: AdminAccessLevel, requiredLevel: AdminAccessLevel): boolean {
  const hierarchy = [
    AdminAccessLevel.READ_ONLY,
    AdminAccessLevel.MODERATOR,
    AdminAccessLevel.ADMINISTRATOR,
    AdminAccessLevel.SUPER_ADMIN,
    AdminAccessLevel.SYSTEM_OWNER
  ];

  const currentIndex = hierarchy.indexOf(currentLevel);
  const requiredIndex = hierarchy.indexOf(requiredLevel);

  return currentIndex >= requiredIndex;
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}
