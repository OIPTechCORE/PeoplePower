import { Request, Response } from 'express';
import { pool } from '../database/connection';
import { logger } from '../utils/logger';
import { TONPaymentService } from '../services/tonPaymentService';

/**
 * People Power Token Controller
 * Handles movement token operations and ecosystem management
 */
export class PeoplePowerTokenController {
  private tonService: TONPaymentService;

  constructor() {
    this.tonService = new TONPaymentService(
      process.env.TON_CONTRACT_ADDRESS || '',
      process.env.TON_PRIVATE_KEY || '',
      process.env.TON_RPC_URL || ''
    );
  }

  /**
   * Get user profile for People Power ecosystem
   */
  async getUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const profileQuery = `
        SELECT 
          p.id,
          p.username,
          p.display_name,
          p.avatar,
          COALESCE(ppc.balance, 0) as balance,
          COALESCE(ppc.reputation, 0) as reputation,
          COALESCE(ppc.impact_score, 0) as impact_score,
          COALESCE(ppc.is_premium, false) as is_premium,
          COALESCE(token_counts.tokens_created, 0) as tokens_created,
          COALESCE(token_counts.tokens_owned, 0) as tokens_owned
        FROM players p
        LEFT JOIN people_power_credits ppc ON p.id = ppc.user_id
        LEFT JOIN (
          SELECT 
            user_id,
            COUNT(CASE WHEN is_creator = true THEN 1 END) as tokens_created,
            COUNT(CASE WHEN is_creator = false THEN 1 END) as tokens_owned
          FROM movement_token_holders
          WHERE user_id = $1
          GROUP BY user_id
        ) token_counts ON p.id = token_counts.user_id
        WHERE p.id = $1
      `;

      const profileResult = await pool.query(profileQuery, [userId]);

      if (profileResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: 'User profile not found'
        });
        return;
      }

      res.json({
        success: true,
        data: profileResult.rows[0]
      });
    } catch (error) {
      logger.error('Failed to get user profile:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get all movement tokens
   */
  async getMovementTokens(req: Request, res: Response): Promise<void> {
    try {
      const { 
        category, 
        purpose, 
        verified, 
        trending, 
        limit = 100, 
        offset = 0 
      } = req.query;

      let query = `
        SELECT 
          mt.*,
          p.username as creator_username,
          p.display_name as creator_display_name,
          p.avatar as creator_avatar,
          COALESCE(mth.holders_count, 0) as holders,
          COALESCE(mth.total_supply, 0) as total_supply,
          COALESCE(price_data.price, 0) as price,
          COALESCE(price_data.market_cap, 0) as market_cap,
          COALESCE(price_data.volume_24h, 0) as volume_24h,
          COALESCE(price_data.change_24h, 0) as change_24h,
          COALESCE(impact_data.education, 0) as education,
          COALESCE(impact_data.community, 0) as community,
          COALESCE(impact_data.governance, 0) as governance
        FROM movement_tokens mt
        JOIN players p ON mt.creator_id = p.id
        LEFT JOIN (
          SELECT 
            token_id,
            COUNT(*) as holders_count,
            SUM(amount) as total_supply
          FROM movement_token_holders
          GROUP BY token_id
        ) mth ON mt.id = mth.token_id
        LEFT JOIN movement_token_prices price_data ON mt.id = price_data.token_id
        LEFT JOIN movement_token_impact impact_data ON mt.id = impact_data.token_id
        WHERE mt.is_active = true
      `;

      const params: any[] = [];

      if (category && category !== 'all') {
        query += ` AND mt.category = $${params.length + 1}`;
        params.push(category);
      }

      if (purpose && purpose !== 'all') {
        query += ` AND mt.purpose = $${params.length + 1}`;
        params.push(purpose);
      }

      if (verified !== undefined) {
        query += ` AND mt.is_verified = $${params.length + 1}`;
        params.push(verified === 'true');
      }

      if (trending !== undefined) {
        query += ` AND mt.is_trending = $${params.length + 1}`;
        params.push(trending === 'true');
      }

      query += ` ORDER BY mt.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(Number(limit), Number(offset));

      const tokensResult = await pool.query(query, params);

      res.json({
        success: true,
        data: tokensResult.rows
      });
    } catch (error) {
      logger.error('Failed to get movement tokens:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Create new movement token
   */
  async createMovementToken(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const {
        name,
        symbol,
        purpose,
        description,
        totalSupply,
        tags,
        launchType = 'basic'
      } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      // Validate required fields
      if (!name || !symbol || !purpose || !description) {
        res.status(400).json({
          success: false,
          error: 'Required fields missing'
        });
        return;
      }

      // Check if user has sufficient balance
      const balanceQuery = `
        SELECT COALESCE(balance, 0) as balance FROM people_power_credits WHERE user_id = $1
      `;
      const balanceResult = await pool.query(balanceQuery, [userId]);
      const userBalance = Number(balanceResult.rows[0]?.balance || 0);

      const creationFee = launchType === 'premium' ? 100 : 25; // PPC tokens

      if (userBalance < creationFee) {
        res.status(400).json({
          success: false,
          error: `Insufficient balance. Required: ${creationFee} PPC`
        });
        return;
      }

      // Process creation fee
      const feeResult = await this.tonService.processPayment(
        userId,
        (creationFee * 0.01).toString(), // Convert to TON
        'token_creation'
      );

      if (!feeResult.success) {
        res.status(500).json({
          success: false,
          error: 'Payment failed'
        });
        return;
      }

      // Create the token
      const createTokenQuery = `
        INSERT INTO movement_tokens (
          creator_id, name, symbol, purpose, description, total_supply,
          tags, launch_type, is_verified, is_active, created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, NOW())
        RETURNING *
      `;

      const tokenResult = await pool.query(createTokenQuery, [
        userId,
        name,
        symbol.toUpperCase(),
        purpose,
        description,
        Number(totalSupply),
        tags || [],
        launchType,
        launchType === 'premium'
      ]);

      const newToken = tokenResult.rows[0];

      // Add creator as initial holder
      await pool.query(`
        INSERT INTO movement_token_holders (token_id, user_id, amount, is_creator, acquired_at)
        VALUES ($1, $2, $3, true, NOW())
      `, [newToken.id, userId, Number(totalSupply)]);

      // Initialize price data
      await pool.query(`
        INSERT INTO movement_token_prices (token_id, price, market_cap, volume_24h, change_24h, updated_at)
        VALUES ($1, 0.01, $2, 0, 0, NOW())
      `, [newToken.id, Number(totalSupply) * 0.01]);

      // Initialize impact scores
      await pool.query(`
        INSERT INTO movement_token_impact (token_id, education, community, governance, updated_at)
        VALUES ($1, 0, 0, 0, NOW())
      `, [newToken.id]);

      // Update user balance
      await pool.query(`
        UPDATE people_power_credits 
        SET balance = balance - $1, updated_at = NOW()
        WHERE user_id = $2
      `, [creationFee, userId]);

      // Process super admin payout (3% commission)
      const commission = creationFee * 0.03;
      if (commission > 0) {
        await this.tonService.processSuperAdminPayout();
      }

      logger.info('Movement token created', {
        userId,
        tokenId: newToken.id,
        name,
        symbol,
        purpose,
        creationFee,
        transactionHash: feeResult.transactionHash
      });

      res.json({
        success: true,
        data: newToken,
        message: 'Movement token created successfully'
      });
    } catch (error) {
      logger.error('Failed to create movement token:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Buy movement token
   */
  async buyMovementToken(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { tokenId, amount, paymentType = 'ton' } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      if (!tokenId || !amount || Number(amount) <= 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid token ID or amount'
        });
        return;
      }

      // Get token details
      const tokenQuery = `
        SELECT mt.*, mtp.price, mth.total_supply
        FROM movement_tokens mt
        JOIN movement_token_prices mtp ON mt.id = mtp.token_id
        LEFT JOIN movement_token_holders mth ON mt.id = mth.token_id AND mth.user_id = $1
        WHERE mt.id = $2 AND mt.is_active = true
      `;
      const tokenResult = await pool.query(tokenQuery, [userId, tokenId]);

      if (tokenResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: 'Token not found'
        });
        return;
      }

      const token = tokenResult.rows[0];
      const purchaseAmount = Number(amount);
      const totalCost = purchaseAmount * Number(token.price);

      // Process payment
      let paymentResult;
      if (paymentType === 'ton') {
        paymentResult = await this.tonService.processPayment(
          userId,
          totalCost.toString(),
          'token_purchase'
        );
      } else {
        // PPC token payment
        const balanceQuery = `
          SELECT COALESCE(balance, 0) as balance FROM people_power_credits WHERE user_id = $1
        `;
        const balanceResult = await pool.query(balanceQuery, [userId]);
        const userBalance = Number(balanceResult.rows[0]?.balance || 0);

        if (userBalance < totalCost) {
          res.status(400).json({
            success: false,
            error: 'Insufficient balance'
          });
          return;
        }

        await pool.query(`
          UPDATE people_power_credits 
          SET balance = balance - $1, updated_at = NOW()
          WHERE user_id = $2
        `, [totalCost, userId]);

        paymentResult = { success: true, transactionHash: 'ppc-' + Date.now() };
      }

      if (paymentResult.success) {
        // Update or create holder record
        await pool.query(`
          INSERT INTO movement_token_holders (token_id, user_id, amount, is_creator, acquired_at)
          VALUES ($1, $2, $3, false, NOW())
          ON CONFLICT (token_id, user_id) 
          DO UPDATE SET 
            amount = movement_token_holders.amount + $3,
            acquired_at = NOW()
        `, [tokenId, userId, purchaseAmount]);

        // Update token price (simplified price impact)
        const newPrice = Number(token.price) * (1 + (purchaseAmount / Number(token.total_supply)) * 0.1);
        const newMarketCap = newPrice * (Number(token.total_supply) + purchaseAmount);

        await pool.query(`
          UPDATE movement_token_prices 
          SET price = $1, market_cap = $2, volume_24h = volume_24h + $3, updated_at = NOW()
          WHERE token_id = $4
        `, [newPrice, newMarketCap, totalCost, tokenId]);

        // Create transaction record
        await pool.query(`
          INSERT INTO movement_token_transactions (
            token_id, buyer_id, amount, price, total_cost, payment_type, transaction_hash, status, created_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, 'completed', NOW())
        `, [tokenId, userId, purchaseAmount, newPrice, totalCost, paymentType, paymentResult.transactionHash]);

        // Process super admin payout (3% commission)
        const commission = totalCost * 0.03;
        if (commission > 0 && paymentType === 'ton') {
          await this.tonService.processSuperAdminPayout();
        }

        logger.info('Movement token purchased', {
          userId,
          tokenId,
          amount: purchaseAmount,
          totalCost,
          paymentType,
          transactionHash: paymentResult.transactionHash
        });

        res.json({
          success: true,
          data: {
            amount: purchaseAmount,
            totalCost,
            newPrice,
            transactionHash: paymentResult.transactionHash
          },
          message: 'Token purchased successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          error: paymentResult.error || 'Payment failed'
        });
      }
    } catch (error) {
      logger.error('Failed to buy movement token:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get token details
   */
  async getTokenDetails(req: Request, res: Response): Promise<void> {
    try {
      const { tokenId } = req.params;

      const tokenQuery = `
        SELECT 
          mt.*,
          p.username as creator_username,
          p.display_name as creator_display_name,
          p.avatar as creator_avatar,
          COALESCE(mth.holders_count, 0) as holders,
          COALESCE(mth.total_supply, 0) as total_supply,
          COALESCE(price_data.price, 0) as price,
          COALESCE(price_data.market_cap, 0) as market_cap,
          COALESCE(price_data.volume_24h, 0) as volume_24h,
          COALESCE(price_data.change_24h, 0) as change_24h,
          COALESCE(impact_data.education, 0) as education,
          COALESCE(impact_data.community, 0) as community,
          COALESCE(impact_data.governance, 0) as governance
        FROM movement_tokens mt
        JOIN players p ON mt.creator_id = p.id
        LEFT JOIN (
          SELECT 
            token_id,
            COUNT(*) as holders_count,
            SUM(amount) as total_supply
          FROM movement_token_holders
          GROUP BY token_id
        ) mth ON mt.id = mth.token_id
        LEFT JOIN movement_token_prices price_data ON mt.id = price_data.token_id
        LEFT JOIN movement_token_impact impact_data ON mt.id = impact_data.token_id
        WHERE mt.id = $1 AND mt.is_active = true
      `;

      const tokenResult = await pool.query(tokenQuery, [tokenId]);

      if (tokenResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: 'Token not found'
        });
        return;
      }

      res.json({
        success: true,
        data: tokenResult.rows[0]
      });
    } catch (error) {
      logger.error('Failed to get token details:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get user's token holdings
   */
  async getUserTokenHoldings(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const holdingsQuery = `
        SELECT 
          mth.token_id,
          mth.amount,
          mth.is_creator,
          mth.acquired_at,
          mt.name,
          mt.symbol,
          mt.purpose,
          mt.description,
          mt.is_verified,
          mt.is_trending,
          mtp.price,
          mtp.market_cap,
          mtp.change_24h,
          COALESCE(impact_data.education, 0) as education,
          COALESCE(impact_data.community, 0) as community,
          COALESCE(impact_data.governance, 0) as governance
        FROM movement_token_holders mth
        JOIN movement_tokens mt ON mth.token_id = mt.id
        JOIN movement_token_prices mtp ON mt.id = mtp.token_id
        LEFT JOIN movement_token_impact impact_data ON mt.id = impact_data.token_id
        WHERE mth.user_id = $1 AND mt.is_active = true
        ORDER BY mth.amount DESC
      `;

      const holdingsResult = await pool.query(holdingsQuery, [userId]);

      res.json({
        success: true,
        data: holdingsResult.rows
      });
    } catch (error) {
      logger.error('Failed to get user token holdings:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get marketplace statistics
   */
  async getMarketplaceStats(req: Request, res: Response): Promise<void> {
    try {
      const statsQuery = `
        SELECT 
          COUNT(*) as total_tokens,
          COUNT(CASE WHEN is_verified = true THEN 1 END) as verified_tokens,
          COUNT(CASE WHEN is_trending = true THEN 1 END) as trending_tokens,
          COALESCE(SUM(mtp.market_cap), 0) as total_market_cap,
          COALESCE(SUM(mtp.volume_24h), 0) as total_volume_24h,
          COALESCE(AVG(mtp.price), 0) as average_price,
          COUNT(DISTINCT mt.creator_id) as total_creators,
          COALESCE(SUM(mth.holders_count), 0) as total_holders
        FROM movement_tokens mt
        JOIN movement_token_prices mtp ON mt.id = mtp.token_id
        LEFT JOIN (
          SELECT 
            token_id,
            COUNT(*) as holders_count
          FROM movement_token_holders
          GROUP BY token_id
        ) mth ON mt.id = mth.token_id
        WHERE mt.is_active = true
      `;

      const statsResult = await pool.query(statsQuery);

      res.json({
        success: true,
        data: statsResult.rows[0]
      });
    } catch (error) {
      logger.error('Failed to get marketplace stats:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}
