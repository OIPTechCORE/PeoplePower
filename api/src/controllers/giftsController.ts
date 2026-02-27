import { Request, Response } from 'express';
import { pool } from '../database/connection';
import { logger } from '../utils/logger';
import { TONPaymentService } from '../services/tonPaymentService';

/**
 * Gifts Controller
 * Handles all gift-related operations
 */
export class GiftsController {
  private tonService: TONPaymentService;

  constructor() {
    this.tonService = new TONPaymentService(
      process.env.TON_CONTRACT_ADDRESS || '',
      process.env.TON_PRIVATE_KEY || '',
      process.env.TON_RPC_URL || ''
    );
  }

  /**
   * Get gift catalog
   */
  async getGiftCatalog(req: Request, res: Response): Promise<void> {
    try {
      const catalogQuery = `
        SELECT 
          id,
          name,
          icon,
          price,
          category,
          rarity,
          description,
          effects,
          is_available,
          popularity
        FROM gift_catalog
        WHERE is_available = true
        ORDER BY popularity DESC, price ASC
      `;

      const catalogResult = await pool.query(catalogQuery);

      res.json({
        success: true,
        data: catalogResult.rows
      });
    } catch (error) {
      logger.error('Failed to get gift catalog:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Send a gift
   */
  async sendGift(req: Request, res: Response): Promise<void> {
    try {
      const senderId = req.user?.id;
      const { giftId, recipient, message } = req.body;

      if (!senderId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      // Get gift details
      const giftQuery = `
        SELECT price, name FROM gift_catalog WHERE id = $1 AND is_available = true
      `;
      const giftResult = await pool.query(giftQuery, [giftId]);

      if (giftResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: 'Gift not found or unavailable'
        });
        return;
      }

      const gift = giftResult.rows[0];
      const price = Number(gift.price);

      // Find recipient by username
      const recipientQuery = `
        SELECT id, username FROM players WHERE username = $1 OR id = $1
      `;
      const recipientResult = await pool.query(recipientQuery, [recipient]);

      if (recipientResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: 'Recipient not found'
        });
        return;
      }

      const recipientId = recipientResult.rows[0].id;

      // Process payment
      const paymentResult = await this.tonService.processPayment(
        senderId,
        price.toString(),
        'gift_payment'
      );

      if (paymentResult.success) {
        // Record the gift
        const sendGiftQuery = `
          INSERT INTO sent_gifts (sender_id, recipient_id, gift_id, message, transaction_hash, sent_at)
          VALUES ($1, $2, $3, $4, $5, NOW())
          RETURNING *
        `;
        const sendGiftResult = await pool.query(sendGiftQuery, [
          senderId,
          recipientId,
          giftId,
          message,
          paymentResult.transactionHash
        ]);

        // Update gift popularity
        await pool.query(`
          UPDATE gift_catalog 
          SET popularity = popularity + 1 
          WHERE id = $1
        `, [giftId]);

        // Process super admin payout (3% commission)
        const commission = price * 0.03;
        if (commission > 0) {
          await this.tonService.processSuperAdminPayout();
        }

        logger.info('Gift sent', {
          senderId,
          recipientId,
          giftId,
          price,
          transactionHash: paymentResult.transactionHash
        });

        res.json({
          success: true,
          data: sendGiftResult.rows[0],
          message: 'Gift sent successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          error: paymentResult.error || 'Payment failed'
        });
      }
    } catch (error) {
      logger.error('Failed to send gift:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get received gifts
   */
  async getReceivedGifts(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const giftsQuery = `
        SELECT 
          sg.id,
          sg.message,
          sg.sent_at,
          gc.name as gift_name,
          gc.icon as gift_icon,
          gc.category,
          gc.rarity,
          p.username as sender_username,
          p.display_name as sender_display_name
        FROM sent_gifts sg
        JOIN gift_catalog gc ON sg.gift_id = gc.id
        JOIN players p ON sg.sender_id = p.id
        WHERE sg.recipient_id = $1
        ORDER BY sg.sent_at DESC
        LIMIT 50
      `;

      const giftsResult = await pool.query(giftsQuery, [userId]);

      res.json({
        success: true,
        data: giftsResult.rows
      });
    } catch (error) {
      logger.error('Failed to get received gifts:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get sent gifts
   */
  async getSentGifts(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const giftsQuery = `
        SELECT 
          sg.id,
          sg.message,
          sg.sent_at,
          gc.name as gift_name,
          gc.icon as gift_icon,
          gc.category,
          gc.rarity,
          p.username as recipient_username,
          p.display_name as recipient_display_name
        FROM sent_gifts sg
        JOIN gift_catalog gc ON sg.gift_id = gc.id
        JOIN players p ON sg.recipient_id = p.id
        WHERE sg.sender_id = $1
        ORDER BY sg.sent_at DESC
        LIMIT 50
      `;

      const giftsResult = await pool.query(giftsQuery, [userId]);

      res.json({
        success: true,
        data: giftsResult.rows
      });
    } catch (error) {
      logger.error('Failed to get sent gifts:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}
