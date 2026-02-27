import { Request, Response } from 'express';
import { pool } from '../database/connection';
import { logger } from '../utils/logger';
import { TONPaymentService } from '../services/tonPaymentService';

/**
 * Tipping Controller
 * Handles all tipping-related operations
 */
export class TippingController {
  private tonService: TONPaymentService;

  constructor() {
    this.tonService = new TONPaymentService(
      process.env.TON_CONTRACT_ADDRESS || '',
      process.env.TON_PRIVATE_KEY || '',
      process.env.TON_RPC_URL || ''
    );
  }

  /**
   * Get tipping targets
   */
  async getTippingTargets(req: Request, res: Response): Promise<void> {
    try {
      const targetsQuery = `
        SELECT 
          id,
          username,
          display_name,
          avatar,
          bio,
          category,
          is_online,
          COALESCE(tt.total_tips, 0) as total_tips,
          COALESCE(tt.tip_count, 0) as tip_count
        FROM players p
        LEFT JOIN (
          SELECT 
            recipient_id,
            COALESCE(SUM(amount), 0) as total_tips,
            COUNT(*) as tip_count
          FROM tips
          WHERE status = 'completed'
          GROUP BY recipient_id
        ) tt ON p.id = tt.recipient_id
        WHERE p.is_active = true
        ORDER BY tt.total_tips DESC NULLS LAST, p.display_name
        LIMIT 100
      `;

      const targetsResult = await pool.query(targetsQuery);

      res.json({
        success: true,
        data: targetsResult.rows
      });
    } catch (error) {
      logger.error('Failed to get tipping targets:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Send a tip
   */
  async sendTip(req: Request, res: Response): Promise<void> {
    try {
      const senderId = req.user?.id;
      const { targetId, amount, message } = req.body;

      if (!senderId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      if (!targetId || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid target or amount'
        });
        return;
      }

      const tipAmount = Number(amount);

      // Check if target exists
      const targetQuery = `
        SELECT id, username, display_name FROM players 
        WHERE id = $1 AND is_active = true
      `;
      const targetResult = await pool.query(targetQuery, [targetId]);

      if (targetResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: 'Target not found'
        });
        return;
      }

      // Calculate platform fee (3%)
      const platformFee = tipAmount * 0.03;
      const netAmount = tipAmount - platformFee;

      // Process payment
      const paymentResult = await this.tonService.processPayment(
        senderId,
        tipAmount.toString(),
        'tip_payment'
      );

      if (paymentResult.success) {
        // Record the tip
        const tipQuery = `
          INSERT INTO tips (sender_id, recipient_id, amount, platform_fee, net_amount, message, transaction_hash, status, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, 'completed', NOW())
          RETURNING *
        `;
        const tipResult = await pool.query(tipQuery, [
          senderId,
          targetId,
          tipAmount,
          platformFee,
          netAmount,
          message,
          paymentResult.transactionHash
        ]);

        // Update recipient's total tips
        await pool.query(`
          INSERT INTO user_tip_stats (user_id, total_tips, tip_count, last_tip_at)
          VALUES ($1, $2, 1, NOW())
          ON CONFLICT (user_id) 
          DO UPDATE SET 
            total_tips = user_tip_stats.total_tips + $2,
            tip_count = user_tip_stats.tip_count + 1,
            last_tip_at = NOW()
        `, [targetId, netAmount]);

        // Process super admin payout (3% commission)
        if (platformFee > 0) {
          await this.tonService.processSuperAdminPayout();
        }

        // Create notification for recipient
        await pool.query(`
          INSERT INTO notifications (user_id, type, title, message, data, created_at)
          VALUES ($1, 'tip_received', 'You received a tip!', $2, $3, NOW())
        `, [
          targetId,
          `You received ${netAmount.toFixed(2)} TON from ${senderId}`,
          JSON.stringify({
            amount: netAmount,
            senderId,
            message,
            transactionHash: paymentResult.transactionHash
          })
        ]);

        logger.info('Tip sent', {
          senderId,
          targetId,
          amount: tipAmount,
          platformFee,
          netAmount,
          transactionHash: paymentResult.transactionHash
        });

        res.json({
          success: true,
          data: tipResult.rows[0],
          message: `Tip of ${netAmount.toFixed(2)} TON sent successfully`
        });
      } else {
        res.status(500).json({
          success: false,
          error: paymentResult.error || 'Payment failed'
        });
      }
    } catch (error) {
      logger.error('Failed to send tip:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get received tips
   */
  async getReceivedTips(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const tipsQuery = `
        SELECT 
          t.id,
          t.amount,
          t.platform_fee,
          t.net_amount,
          t.message,
          t.created_at,
          p.username as sender_username,
          p.display_name as sender_display_name,
          p.avatar as sender_avatar
        FROM tips t
        JOIN players p ON t.sender_id = p.id
        WHERE t.recipient_id = $1 AND t.status = 'completed'
        ORDER BY t.created_at DESC
        LIMIT 50
      `;

      const tipsResult = await pool.query(tipsQuery, [userId]);

      res.json({
        success: true,
        data: tipsResult.rows
      });
    } catch (error) {
      logger.error('Failed to get received tips:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get sent tips
   */
  async getSentTips(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const tipsQuery = `
        SELECT 
          t.id,
          t.amount,
          t.platform_fee,
          t.net_amount,
          t.message,
          t.created_at,
          p.username as recipient_username,
          p.display_name as recipient_display_name,
          p.avatar as recipient_avatar
        FROM tips t
        JOIN players p ON t.recipient_id = p.id
        WHERE t.sender_id = $1 AND t.status = 'completed'
        ORDER BY t.created_at DESC
        LIMIT 50
      `;

      const tipsResult = await pool.query(tipsQuery, [userId]);

      res.json({
        success: true,
        data: tipsResult.rows
      });
    } catch (error) {
      logger.error('Failed to get sent tips:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get tipping statistics
   */
  async getTippingStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const statsQuery = `
        SELECT 
          COALESCE(SUM(CASE WHEN sender_id = $1 THEN amount ELSE 0 END), 0) as total_sent,
          COALESCE(SUM(CASE WHEN recipient_id = $1 THEN net_amount ELSE 0 END), 0) as total_received,
          COALESCE(COUNT(CASE WHEN sender_id = $1 THEN 1 END), 0) as sent_count,
          COALESCE(COUNT(CASE WHEN recipient_id = $1 THEN 1 END), 0) as received_count
        FROM tips
        WHERE status = 'completed'
      `;

      const statsResult = await pool.query(statsQuery, [userId]);

      const stats = {
        totalSent: Number(statsResult.rows[0].total_sent),
        totalReceived: Number(statsResult.rows[0].total_received),
        sentCount: Number(statsResult.rows[0].sent_count),
        receivedCount: Number(statsResult.rows[0].received_count)
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error('Failed to get tipping stats:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get trending tippers
   */
  async getTrendingTippers(req: Request, res: Response): Promise<void> {
    try {
      const tippersQuery = `
        SELECT 
          p.id,
          p.username,
          p.display_name,
          p.avatar,
          COALESCE(tt.total_tipped, 0) as total_tipped,
          COALESCE(tt.tip_count, 0) as tip_count
        FROM players p
        LEFT JOIN (
          SELECT 
            sender_id,
            COALESCE(SUM(amount), 0) as total_tipped,
            COUNT(*) as tip_count
          FROM tips
          WHERE status = 'completed'
          AND created_at > NOW() - INTERVAL '7 days'
          GROUP BY sender_id
        ) tt ON p.id = tt.sender_id
        WHERE p.is_active = true
        ORDER BY tt.total_tipped DESC NULLS LAST
        LIMIT 10
      `;

      const tippersResult = await pool.query(tippersQuery);

      res.json({
        success: true,
        data: tippersResult.rows
      });
    } catch (error) {
      logger.error('Failed to get trending tippers:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get top recipients
   */
  async getTopRecipients(req: Request, res: Response): Promise<void> {
    try {
      const recipientsQuery = `
        SELECT 
          p.id,
          p.username,
          p.display_name,
          p.avatar,
          p.category,
          COALESCE(tr.total_received, 0) as total_received,
          COALESCE(tr.tip_count, 0) as tip_count
        FROM players p
        LEFT JOIN (
          SELECT 
            recipient_id,
            COALESCE(SUM(net_amount), 0) as total_received,
            COUNT(*) as tip_count
          FROM tips
          WHERE status = 'completed'
          AND created_at > NOW() - INTERVAL '7 days'
          GROUP BY recipient_id
        ) tr ON p.id = tr.recipient_id
        WHERE p.is_active = true
        ORDER BY tr.total_received DESC NULLS LAST
        LIMIT 10
      `;

      const recipientsResult = await pool.query(recipientsQuery);

      res.json({
        success: true,
        data: recipientsResult.rows
      });
    } catch (error) {
      logger.error('Failed to get top recipients:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}
