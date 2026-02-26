import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { validateRequest, schemas } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { metricsMiddleware } from '../utils/metrics';

export function createEconomyRoutes(pool: Pool): Router {
  const router = Router();

  // Apply metrics middleware
  router.use(metricsMiddleware);

  // Get player balance
  router.get('/balance',
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;

        const result = await pool.query(
          'SELECT power_tokens, total_earned FROM players WHERE id = $1',
          [userId]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({
            success: false,
            error: 'PLAYER_NOT_FOUND',
            message: 'Player not found'
          });
        }

        res.json({
          success: true,
          data: {
            balance: result.rows[0].power_tokens,
            totalEarned: result.rows[0].total_earned
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'BALANCE_FETCH_ERROR',
          message: 'Failed to fetch balance'
        });
      }
    }
  );

  // Get transaction history
  router.get('/transactions',
    authenticateToken,
    validateRequest(schemas.pagination),
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const offset = (page - 1) * limit;

        const result = await pool.query(`
          SELECT * FROM token_transactions 
          WHERE player_id = $1 
          ORDER BY created_at DESC 
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
          error: 'TRANSACTIONS_FETCH_ERROR',
          message: 'Failed to fetch transaction history'
        });
      }
    }
  );

  // Process transaction
  router.post('/transaction',
    authenticateToken,
    validateRequest(schemas.transaction),
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const { type, amount, source, description } = req.body;

        // Start transaction
        await pool.query('BEGIN');

        try {
          let newBalance: number;

          if (type === 'earn') {
            const result = await pool.query(
              'UPDATE players SET power_tokens = power_tokens + $1, total_earned = total_earned + $1 WHERE id = $2 RETURNING power_tokens',
              [amount, userId]
            );
            newBalance = result.rows[0].power_tokens;
          } else if (type === 'spend') {
            // Check if user has enough balance
            const balanceCheck = await pool.query(
              'SELECT power_tokens FROM players WHERE id = $1',
              [userId]
            );

            if (balanceCheck.rows[0].power_tokens < amount) {
              await pool.query('ROLLBACK');
              return res.status(400).json({
                success: false,
                error: 'INSUFFICIENT_BALANCE',
                message: 'Insufficient balance for this transaction'
              });
            }

            const result = await pool.query(
              'UPDATE players SET power_tokens = power_tokens - $1 WHERE id = $2 RETURNING power_tokens',
              [amount, userId]
            );
            newBalance = result.rows[0].power_tokens;
          } else if (type === 'transfer') {
            const { recipientId } = req.body;

            if (!recipientId) {
              await pool.query('ROLLBACK');
              return res.status(400).json({
                success: false,
                error: 'RECIPIENT_REQUIRED',
                message: 'Recipient ID is required for transfers'
              });
            }

            // Check sender balance
            const balanceCheck = await pool.query(
              'SELECT power_tokens FROM players WHERE id = $1',
              [userId]
            );

            if (balanceCheck.rows[0].power_tokens < amount) {
              await pool.query('ROLLBACK');
              return res.status(400).json({
                success: false,
                error: 'INSUFFICIENT_BALANCE',
                message: 'Insufficient balance for this transfer'
              });
            }

            // Deduct from sender
            await pool.query(
              'UPDATE players SET power_tokens = power_tokens - $1 WHERE id = $2',
              [amount, userId]
            );

            // Add to recipient
            await pool.query(
              'UPDATE players SET power_tokens = power_tokens + $1 WHERE id = $2',
              [amount, recipientId]
            );

            newBalance = balanceCheck.rows[0].power_tokens - amount;

            // Record transfer for recipient
            await pool.query(`
              INSERT INTO token_transactions (player_id, type, amount, source, description, created_at)
              VALUES ($1, 'earn', $2, 'transfer', $3, NOW())
            `, [recipientId, amount, `Transfer from ${userId}`]);
          } else {
            await pool.query('ROLLBACK');
            return res.status(400).json({
              success: false,
              error: 'INVALID_TRANSACTION_TYPE',
              message: 'Invalid transaction type'
            });
          }

          // Record transaction
          await pool.query(`
            INSERT INTO token_transactions (player_id, type, amount, source, description, created_at)
            VALUES ($1, $2, $3, $4, $5, NOW())
          `, [userId, type, amount, source, description]);

          await pool.query('COMMIT');

          res.json({
            success: true,
            data: {
              type,
              amount,
              source,
              newBalance,
              transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            }
          });
        } catch (innerError) {
          await pool.query('ROLLBACK');
          throw innerError;
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'TRANSACTION_ERROR',
          message: 'Failed to process transaction'
        });
      }
    }
  );

  // Get shop items
  router.get('/shop',
    authenticateToken,
    validateRequest(schemas.pagination),
    async (req: Request, res: Response) => {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const offset = (page - 1) * limit;

        const result = await pool.query(`
          SELECT * FROM shop_items 
          WHERE is_active = true 
          ORDER BY category, price
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
          error: 'SHOP_FETCH_ERROR',
          message: 'Failed to fetch shop items'
        });
      }
    }
  );

  // Purchase item
  router.post('/shop/:itemId/purchase',
    authenticateToken,
    validateRequest(schemas.uuidParam('itemId')),
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const { itemId } = req.params;

        // Get item details
        const itemResult = await pool.query(
          'SELECT * FROM shop_items WHERE id = $1 AND is_active = true',
          [itemId]
        );

        if (itemResult.rows.length === 0) {
          return res.status(404).json({
            success: false,
            error: 'ITEM_NOT_FOUND',
            message: 'Shop item not found'
          });
        }

        const item = itemResult.rows[0];

        // Check user balance
        const balanceResult = await pool.query(
          'SELECT power_tokens FROM players WHERE id = $1',
          [userId]
        );

        if (balanceResult.rows[0].power_tokens < item.price) {
          return res.status(400).json({
            success: false,
            error: 'INSUFFICIENT_BALANCE',
            message: 'Insufficient balance to purchase this item'
          });
        }

        // Start transaction
        await pool.query('BEGIN');

        try {
          // Deduct tokens
          await pool.query(
            'UPDATE players SET power_tokens = power_tokens - $1 WHERE id = $2',
            [item.price, userId]
          );

          // Record purchase
          await pool.query(`
            INSERT INTO player_purchases (player_id, item_id, price, purchased_at)
            VALUES ($1, $2, $3, NOW())
          `, [userId, itemId, item.price]);

          // Record transaction
          await pool.query(`
            INSERT INTO token_transactions (player_id, type, amount, source, description, created_at)
            VALUES ($1, 'spend', $2, 'shop_purchase', $3, NOW())
          `, [userId, item.price, `Purchased ${item.name}`]);

          await pool.query('COMMIT');

          res.json({
            success: true,
            data: {
              item,
              price: item.price,
              newBalance: balanceResult.rows[0].power_tokens - item.price
            }
          });
        } catch (innerError) {
          await pool.query('ROLLBACK');
          throw innerError;
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'PURCHASE_ERROR',
          message: 'Failed to complete purchase'
        });
      }
    }
  );

  // Get player purchases
  router.get('/purchases',
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
            pp.*,
            si.name,
            si.description,
            si.category,
            si.image_url
          FROM player_purchases pp
          JOIN shop_items si ON pp.item_id = si.id
          WHERE pp.player_id = $1
          ORDER BY pp.purchased_at DESC
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
          error: 'PURCHASES_FETCH_ERROR',
          message: 'Failed to fetch purchase history'
        });
      }
    }
  );

  // Get economy statistics
  router.get('/stats',
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;

        const result = await pool.query(`
          SELECT 
            COUNT(*) as total_transactions,
            COUNT(CASE WHEN type = 'earn' THEN 1 END) as earnings_count,
            COUNT(CASE WHEN type = 'spend' THEN 1 END) as spendings_count,
            SUM(CASE WHEN type = 'earn' THEN amount ELSE 0 END) as total_earned,
            SUM(CASE WHEN type = 'spend' THEN amount ELSE 0 END) as total_spent,
            COUNT(CASE WHEN source = 'shop_purchase' THEN 1 END) as purchases_count
          FROM token_transactions 
          WHERE player_id = $1
        `, [userId]);

        res.json({
          success: true,
          data: result.rows[0]
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'ECONOMY_STATS_ERROR',
          message: 'Failed to fetch economy statistics'
        });
      }
    }
  );

  return router;
}
