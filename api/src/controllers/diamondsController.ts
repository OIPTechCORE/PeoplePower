import { Request, Response } from 'express';
import { pool } from '../database/connection';
import { logger } from '../utils/logger';
import { TONPaymentService } from '../services/tonPaymentService';

/**
 * Diamonds Controller
 * Handles all diamond-related operations
 */
export class DiamondsController {
  private tonService: TONPaymentService;

  constructor() {
    this.tonService = new TONPaymentService(
      process.env.TON_CONTRACT_ADDRESS || '',
      process.env.TON_PRIVATE_KEY || '',
      process.env.TON_RPC_URL || ''
    );
  }

  /**
   * Get user diamond balance
   */
  async getDiamondBalance(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const balanceQuery = `
        SELECT 
          balance,
          tier,
          total_earned,
          total_spent
        FROM user_diamonds
        WHERE user_id = $1
      `;

      const balanceResult = await pool.query(balanceQuery, [userId]);

      if (balanceResult.rows.length === 0) {
        // Create diamond account for user
        const createQuery = `
          INSERT INTO user_diamonds (user_id, balance, tier, total_earned, total_spent)
          VALUES ($1, 0, 0, 0, 0)
          RETURNING *
        `;
        const createResult = await pool.query(createQuery, [userId]);
        
        res.json({
          success: true,
          data: createResult.rows[0]
        });
      } else {
        res.json({
          success: true,
          data: balanceResult.rows[0]
        });
      }
    } catch (error) {
      logger.error('Failed to get diamond balance:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get diamond tiers
   */
  async getDiamondTiers(req: Request, res: Response): Promise<void> {
    try {
      const tiersQuery = `
        SELECT 
          tier,
          name,
          icon,
          required_balance,
          benefits,
          cashback_percent,
          reward_multiplier
        FROM diamond_tiers
        ORDER BY tier
      `;

      const tiersResult = await pool.query(tiersQuery);

      res.json({
        success: true,
        data: tiersResult.rows
      });
    } catch (error) {
      logger.error('Failed to get diamond tiers:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Purchase diamonds
   */
  async purchaseDiamonds(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { amount } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid amount'
        });
        return;
      }

      const purchaseAmount = Number(amount);
      const diamondRate = 100; // 1 TON = 100 Diamonds
      const diamondsEarned = purchaseAmount * diamondRate;

      // Process payment
      const paymentResult = await this.tonService.processPayment(
        userId,
        purchaseAmount.toString(),
        'diamond_purchase'
      );

      if (paymentResult.success) {
        // Update diamond balance
        const updateQuery = `
          UPDATE user_diamonds 
          SET balance = balance + $1,
              total_earned = total_earned + $1,
              updated_at = NOW()
          WHERE user_id = $2
          RETURNING *
        `;
        const updateResult = await pool.query(updateQuery, [diamondsEarned, userId]);

        // Check for tier upgrade
        await this.checkTierUpgrade(userId);

        // Record transaction
        const transactionQuery = `
          INSERT INTO diamond_transactions (user_id, type, amount, diamonds, transaction_hash, created_at)
          VALUES ($1, 'purchase', $2, $3, $4, NOW())
          RETURNING *
        `;
        const transactionResult = await pool.query(transactionQuery, [
          userId,
          purchaseAmount,
          diamondsEarned,
          paymentResult.transactionHash
        ]);

        // Process super admin payout (3% commission)
        const commission = purchaseAmount * 0.03;
        if (commission > 0) {
          await this.tonService.processSuperAdminPayout();
        }

        logger.info('Diamonds purchased', {
          userId,
          amount: purchaseAmount,
          diamonds: diamondsEarned,
          transactionHash: paymentResult.transactionHash
        });

        res.json({
          success: true,
          data: {
            transaction: transactionResult.rows[0],
            balance: updateResult.rows[0]
          },
          message: `Successfully purchased ${diamondsEarned} diamonds`
        });
      } else {
        res.status(500).json({
          success: false,
          error: paymentResult.error || 'Payment failed'
        });
      }
    } catch (error) {
      logger.error('Failed to purchase diamonds:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Spend diamonds
   */
  async spendDiamonds(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { amount, reason } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid amount'
        });
        return;
      }

      const spendAmount = Number(amount);

      // Check balance
      const balanceQuery = `
        SELECT balance FROM user_diamonds WHERE user_id = $1
      `;
      const balanceResult = await pool.query(balanceQuery, [userId]);

      if (balanceResult.rows.length === 0 || Number(balanceResult.rows[0].balance) < spendAmount) {
        res.status(400).json({
          success: false,
          error: 'Insufficient diamond balance'
        });
        return;
      }

      // Update balance
      const updateQuery = `
        UPDATE user_diamonds 
        SET balance = balance - $1,
            total_spent = total_spent + $1,
            updated_at = NOW()
        WHERE user_id = $2
        RETURNING *
      `;
      const updateResult = await pool.query(updateQuery, [spendAmount, userId]);

      // Record transaction
      const transactionQuery = `
        INSERT INTO diamond_transactions (user_id, type, amount, diamonds, reason, created_at)
        VALUES ($1, 'spend', $2, $3, $4, NOW())
        RETURNING *
      `;
      const transactionResult = await pool.query(transactionQuery, [
        userId,
        spendAmount,
        spendAmount,
        reason || 'Diamond spending'
      ]);

      logger.info('Diamonds spent', {
        userId,
        amount: spendAmount,
        reason
      });

      res.json({
        success: true,
        data: {
          transaction: transactionResult.rows[0],
          balance: updateResult.rows[0]
        },
        message: `Successfully spent ${spendAmount} diamonds`
      });
    } catch (error) {
      logger.error('Failed to spend diamonds:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get diamond transaction history
   */
  async getDiamondTransactions(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const transactionsQuery = `
        SELECT 
          id,
          type,
          amount,
          diamonds,
          reason,
          transaction_hash,
          created_at
        FROM diamond_transactions
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 50
      `;

      const transactionsResult = await pool.query(transactionsQuery, [userId]);

      res.json({
        success: true,
        data: transactionsResult.rows
      });
    } catch (error) {
      logger.error('Failed to get diamond transactions:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Check and upgrade diamond tier
   */
  private async checkTierUpgrade(userId: string): Promise<void> {
    try {
      // Get current balance and tier
      const balanceQuery = `
        SELECT balance, tier FROM user_diamonds WHERE user_id = $1
      `;
      const balanceResult = await pool.query(balanceQuery, [userId]);

      if (balanceResult.rows.length === 0) return;

      const currentBalance = Number(balanceResult.rows[0].balance);
      const currentTier = balanceResult.rows[0].tier;

      // Get highest eligible tier
      const tierQuery = `
        SELECT tier FROM diamond_tiers 
        WHERE required_balance <= $1 
        ORDER BY tier DESC 
        LIMIT 1
      `;
      const tierResult = await pool.query(tierQuery, [currentBalance]);

      if (tierResult.rows.length > 0) {
        const newTier = tierResult.rows[0].tier;
        
        if (newTier > currentTier) {
          // Upgrade tier
          await pool.query(`
            UPDATE user_diamonds 
            SET tier = $1, updated_at = NOW()
            WHERE user_id = $2
          `, [newTier, userId]);

          logger.info('Diamond tier upgraded', {
            userId,
            oldTier: currentTier,
            newTier,
            balance: currentBalance
          });
        }
      }
    } catch (error) {
      logger.error('Failed to check tier upgrade:', error);
    }
  }
}
