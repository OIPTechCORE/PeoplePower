import { Request, Response } from 'express';
import { pool } from '../database/connection';
import { logger } from '../utils/logger';
import { TONPaymentService } from '../services/tonPaymentService';

/**
 * Super Admin Dashboard Controller
 * Handles all admin dashboard analytics and management functions
 */
export class SuperAdminController {
  private tonService: TONPaymentService;

  constructor() {
    this.tonService = new TONPaymentService(
      process.env.TON_CONTRACT_ADDRESS || '',
      process.env.TON_PRIVATE_KEY || '',
      process.env.TON_RPC_URL || ''
    );
  }

  /**
   * Get dashboard metrics
   */
  async getDashboardMetrics(req: Request, res: Response): Promise<void> {
    try {
      const query = `
        SELECT 
          COUNT(*) as active_users,
          COUNT(CASE WHEN last_active_at > NOW() - INTERVAL '24 hours' THEN 1 END) as daily_active_users,
          COUNT(CASE WHEN last_active_at > NOW() - INTERVAL '7 days' THEN 1 END) as weekly_active_users,
          COUNT(CASE WHEN last_active_at > NOW() - INTERVAL '30 days' THEN 1 END) as monthly_active_users,
          COALESCE(SUM(power_tokens), 0) as total_power_tokens,
          COALESCE(SUM(total_earned), 0) as total_earned
        FROM players
        WHERE is_active = true
      `;

      const playerStats = await pool.query(query);

      // Get transaction metrics
      const transactionQuery = `
        SELECT 
          COUNT(*) as total_transactions,
          COALESCE(SUM(amount), 0) as total_amount,
          COALESCE(SUM(fee), 0) as total_fees,
          COALESCE(AVG(amount), 0) as avg_transaction_value
        FROM ton_transactions
        WHERE status = 'completed'
        AND created_at > NOW() - INTERVAL '30 days'
      `;

      const transactionStats = await pool.query(transactionQuery);

      // Get staking metrics
      const stakingQuery = `
        SELECT 
          COUNT(*) as total_stakers,
          COALESCE(SUM(amount), 0) as total_staked,
          COALESCE(AVG(amount), 0) as avg_stake_amount
        FROM ton_stakes
        WHERE is_active = true
      `;

      const stakingStats = await pool.query(stakingQuery);

      // Get badge metrics
      const badgeQuery = `
        SELECT 
          COUNT(*) as total_badges_unlocked,
          COUNT(DISTINCT player_id) as players_with_badges
        FROM player_badges
        WHERE unlocked_at > NOW() - INTERVAL '30 days'
      `;

      const badgeStats = await pool.query(badgeQuery);

      // Get diamond tier metrics
      const tierQuery = `
        SELECT 
          diamond_tier,
          COUNT(*) as count
        FROM players
        WHERE diamond_tier > 0
        GROUP BY diamond_tier
        ORDER BY diamond_tier
      `;

      const tierStats = await pool.query(tierQuery);

      // Calculate total revenue (fees + other revenue streams)
      const totalRevenue = Number(transactionStats.rows[0]?.total_fees || 0) + 
                          Number(badgeStats.rows[0]?.total_badges_unlocked * 10 || 0); // Badge unlock fees

      const metrics = {
        totalRevenue,
        activeUsers: Number(playerStats.rows[0]?.active_users || 0),
        totalTransactions: Number(transactionStats.rows[0]?.total_transactions || 0),
        averageTransactionValue: Number(transactionStats.rows[0]?.avg_transaction_value || 0),
        dailyActiveUsers: Number(playerStats.rows[0]?.daily_active_users || 0),
        weeklyActiveUsers: Number(playerStats.rows[0]?.weekly_active_users || 0),
        monthlyActiveUsers: Number(playerStats.rows[0]?.monthly_active_users || 0),
        totalStaked: Number(stakingStats.rows[0]?.total_staked || 0),
        platformFees: Number(transactionStats.rows[0]?.total_fees || 0),
        badgeUnlocks: Number(badgeStats.rows[0]?.total_badges_unlocked || 0),
        diamondTierUpgrades: tierStats.rows.reduce((sum, row) => sum + Number(row.count), 0),
        totalPowerTokens: Number(playerStats.rows[0]?.total_power_tokens || 0),
        totalEarned: Number(playerStats.rows[0]?.total_earned || 0)
      };

      res.json({
        success: true,
        data: metrics
      });
    } catch (error) {
      logger.error('Failed to get dashboard metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get user analytics
   */
  async getUserAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 50, search, status, tier } = req.query;

      let whereClause = 'WHERE p.is_active = true';
      const params: any[] = [];
      let paramIndex = 1;

      if (search) {
        whereClause += ` AND (p.username ILIKE $${paramIndex} OR p.display_name ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      if (status) {
        whereClause += ` AND p.status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
      }

      if (tier) {
        whereClause += ` AND p.diamond_tier = $${paramIndex}`;
        params.push(tier);
        paramIndex++;
      }

      const offset = (Number(page) - 1) * Number(limit);

      const query = `
        SELECT 
          p.id,
          p.telegram_id,
          p.username,
          p.display_name,
          p.level,
          p.power_tokens,
          p.total_earned,
          p.diamond_tier,
          p.status,
          p.last_active_at,
          p.created_at,
          COALESCE(SUM(t.amount), 0) as total_spent,
          COALESCE(SUM(s.amount), 0) as total_staked,
          COUNT(DISTINCT pb.badge_id) as badges_unlocked
        FROM players p
        LEFT JOIN ton_transactions t ON p.id = t.player_id AND t.status = 'completed'
        LEFT JOIN ton_stakes s ON p.id = s.player_id AND s.is_active = true
        LEFT JOIN player_badges pb ON p.id = pb.player_id
        ${whereClause}
        GROUP BY p.id, p.telegram_id, p.username, p.display_name, p.level, p.power_tokens, p.total_earned, p.diamond_tier, p.status, p.last_active_at, p.created_at
        ORDER BY p.last_active_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      params.push(Number(limit), offset);

      const result = await pool.query(query, params);

      // Get total count for pagination
      const countQuery = `
        SELECT COUNT(*) as total
        FROM players p
        ${whereClause}
      `;

      const countResult = await pool.query(countQuery, params.slice(0, -2));

      const users = result.rows.map(row => ({
        id: row.id,
        telegramId: row.telegram_id,
        username: row.username,
        displayName: row.display_name,
        level: row.level,
        totalSpent: Number(row.total_spent || 0),
        totalStaked: Number(row.total_staked || 0),
        diamondTier: row.diamond_tier,
        badgesUnlocked: Number(row.badges_unlocked || 0),
        status: row.status,
        lastActive: row.last_active_at,
        registrationDate: row.created_at
      }));

      res.json({
        success: true,
        data: users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(countResult.rows[0].total),
          totalPages: Math.ceil(Number(countResult.rows[0].total) / Number(limit))
        }
      });
    } catch (error) {
      logger.error('Failed to get user analytics:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get transaction analytics
   */
  async getTransactionAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 50, status, type, startDate, endDate } = req.query;

      let whereClause = 'WHERE 1=1';
      const params: any[] = [];
      let paramIndex = 1;

      if (status) {
        whereClause += ` AND status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
      }

      if (type) {
        whereClause += ` AND payment_type = $${paramIndex}`;
        params.push(type);
        paramIndex++;
      }

      if (startDate) {
        whereClause += ` AND created_at >= $${paramIndex}`;
        params.push(startDate);
        paramIndex++;
      }

      if (endDate) {
        whereClause += ` AND created_at <= $${paramIndex}`;
        params.push(endDate);
        paramIndex++;
      }

      const offset = (Number(page) - 1) * Number(limit);

      const query = `
        SELECT 
          id,
          player_id,
          amount,
          fee,
          payment_type,
          status,
          payment_id,
          created_at,
          p.username,
          p.display_name
        FROM ton_transactions t
        JOIN players p ON t.player_id = p.id
        ${whereClause}
        ORDER BY t.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      params.push(Number(limit), offset);

      const result = await pool.query(query, params);

      const transactions = result.rows.map(row => ({
        id: row.id,
        userId: row.player_id,
        username: row.username,
        displayName: row.display_name,
        amount: Number(row.amount),
        fee: Number(row.fee),
        type: row.payment_type,
        status: row.status,
        paymentId: row.payment_id,
        timestamp: row.created_at
      }));

      res.json({
        success: true,
        data: transactions
      });
    } catch (error) {
      logger.error('Failed to get transaction analytics:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get revenue analytics
   */
  async getRevenueAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate, groupBy = 'day' } = req.query;

      let whereClause = 'WHERE status = \'completed\'';
      const params: any[] = [];
      let paramIndex = 1;

      if (startDate) {
        whereClause += ` AND created_at >= $${paramIndex}`;
        params.push(startDate);
        paramIndex++;
      }

      if (endDate) {
        whereClause += ` AND created_at <= $${paramIndex}`;
        params.push(endDate);
        paramIndex++;
      }

      let dateFormat;
      switch (groupBy) {
        case 'hour':
          dateFormat = 'YYYY-MM-DD HH';
          break;
        case 'day':
          dateFormat = 'YYYY-MM-DD';
          break;
        case 'week':
          dateFormat = 'YYYY-"W"WW';
          break;
        case 'month':
          dateFormat = 'YYYY-MM';
          break;
        default:
          dateFormat = 'YYYY-MM-DD';
      }

      const query = `
        SELECT 
          TO_CHAR(created_at, '${dateFormat}') as date,
          COUNT(*) as transactions,
          COALESCE(SUM(amount), 0) as revenue,
          COALESCE(SUM(fee), 0) as fees,
          COUNT(DISTINCT player_id) as users
        FROM ton_transactions
        ${whereClause}
        GROUP BY TO_CHAR(created_at, '${dateFormat}')
        ORDER BY date DESC
        LIMIT 30
      `;

      const result = await pool.query(query, params);

      const revenueData = result.rows.map(row => ({
        date: row.date,
        revenue: Number(row.revenue),
        fees: Number(row.fees),
        transactions: Number(row.transactions),
        users: Number(row.users)
      }));

      res.json({
        success: true,
        data: revenueData
      });
    } catch (error) {
      logger.error('Failed to get revenue analytics:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Update user status
   */
  async updateUserStatus(req: Request, res: Response): Promise<void> {
    try {
      const { userId, status, reason } = req.body;

      if (!userId || !status) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: userId, status'
        });
        return;
      }

      const query = `
        UPDATE players 
        SET status = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `;

      const result = await pool.query(query, [status, userId]);

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      // Log the action
      await pool.query(`
        INSERT INTO admin_logs (admin_id, action, target_id, details, created_at)
        VALUES ($1, $2, $3, $4, NOW())
      `, [req.user?.id, 'update_user_status', userId, JSON.stringify({ status, reason })]);

      logger.info('User status updated', {
        adminId: req.user?.id,
        userId,
        status,
        reason
      });

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Failed to update user status:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Process super admin payout
   */
  async processPayout(req: Request, res: Response): Promise<void> {
    try {
      // Get total fees collected
      const feesQuery = `
        SELECT COALESCE(SUM(fee), 0) as total_fees
        FROM ton_transactions
        WHERE status = 'completed'
        AND payout_processed = false
      `;

      const feesResult = await pool.query(feesQuery);
      const totalFees = Number(feesResult.rows[0].total_fees);

      if (totalFees === 0) {
        res.json({
          success: true,
          message: 'No fees to payout',
          amount: 0
        });
        return;
      }

      // Process payout through TON contract
      const payoutResult = await this.tonService.processSuperAdminPayout();

      if (payoutResult.success) {
        // Mark fees as processed
        await pool.query(`
          UPDATE ton_transactions 
          SET payout_processed = true, payout_at = NOW()
          WHERE status = 'completed'
          AND payout_processed = false
        `);

        // Log the payout
        await pool.query(`
          INSERT INTO admin_logs (admin_id, action, details, created_at)
          VALUES ($1, $2, $3, NOW())
        `, [req.user?.id, 'super_admin_payout', JSON.stringify({ amount: totalFees, transactionHash: payoutResult.transactionHash })]);

        logger.info('Super admin payout processed', {
          adminId: req.user?.id,
          amount: totalFees,
          transactionHash: payoutResult.transactionHash
        });

        res.json({
          success: true,
          amount: totalFees,
          transactionHash: payoutResult.transactionHash,
          message: 'Payout processed successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          error: payoutResult.error || 'Payout failed'
        });
      }
    } catch (error) {
      logger.error('Failed to process payout:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get system health
   */
  async getSystemHealth(req: Request, res: Response): Promise<void> {
    try {
      // Check database connection
      const dbCheck = await pool.query('SELECT 1 as health');

      // Check TON contract connection
      const contractBalance = await this.tonService.getContractBalance();

      // Get system metrics
      const systemQuery = `
        SELECT 
          COUNT(*) as total_players,
          COUNT(CASE WHEN last_active_at > NOW() - INTERVAL '1 hour' THEN 1 END) as hourly_active,
          COUNT(CASE WHEN last_active_at > NOW() - INTERVAL '24 hours' THEN 1 END) as daily_active,
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as daily_new
        FROM players
      `;

      const systemStats = await pool.query(systemQuery);

      const health = {
        database: dbCheck.rows[0].health === 1 ? 'healthy' : 'unhealthy',
        contract: contractBalance ? 'healthy' : 'unhealthy',
        contractBalance,
        totalPlayers: Number(systemStats.rows[0].total_players),
        hourlyActive: Number(systemStats.rows[0].hourly_active),
        dailyActive: Number(systemStats.rows[0].daily_active),
        dailyNew: Number(systemStats.rows[0].daily_new),
        timestamp: new Date().toISOString()
      };

      res.json({
        success: true,
        data: health
      });
    } catch (error) {
      logger.error('Failed to get system health:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}
