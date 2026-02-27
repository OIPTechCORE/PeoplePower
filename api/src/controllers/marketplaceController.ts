import { Request, Response } from 'express';
import { pool } from '../database/connection';
import { logger } from '../utils/logger';
import { TONPaymentService } from '../services/tonPaymentService';

/**
 * Marketplace Controller
 * Handles all marketplace operations
 */
export class MarketplaceController {
  private tonService: TONPaymentService;

  constructor() {
    this.tonService = new TONPaymentService(
      process.env.TON_CONTRACT_ADDRESS || '',
      process.env.TON_PRIVATE_KEY || '',
      process.env.TON_RPC_URL || ''
    );
  }

  /**
   * Get marketplace items
   */
  async getMarketplaceItems(req: Request, res: Response): Promise<void> {
    try {
      const {
        category,
        rarity,
        minPrice,
        maxPrice,
        search,
        sortBy = 'newest',
        sortOrder = 'desc',
        page = 1,
        limit = 50
      } = req.query;

      let query = `
        SELECT 
          mi.id,
          mi.name,
          mi.description,
          mi.price,
          mi.category,
          mi.rarity,
          mi.icon,
          mi.image,
          mi.is_available,
          mi.is_limited,
          mi.stock,
          mi.max_stock,
          mi.seller_id,
          mi.rating,
          mi.reviews,
          mi.tags,
          mi.created_at,
          mi.expires_at,
          p.username as seller_username,
          p.display_name as seller_display_name
        FROM marketplace_items mi
        JOIN players p ON mi.seller_id = p.id
        WHERE mi.is_available = true
      `;

      const params: any[] = [];
      let paramIndex = 1;

      // Add filters
      if (category && category !== 'all') {
        query += ` AND mi.category = $${paramIndex++}`;
        params.push(category);
      }

      if (rarity && rarity !== 'all') {
        query += ` AND mi.rarity = $${paramIndex++}`;
        params.push(rarity);
      }

      if (minPrice) {
        query += ` AND mi.price >= $${paramIndex++}`;
        params.push(Number(minPrice));
      }

      if (maxPrice) {
        query += ` AND mi.price <= $${paramIndex++}`;
        params.push(Number(maxPrice));
      }

      if (search) {
        query += ` AND (
          mi.name ILIKE $${paramIndex++} OR 
          mi.description ILIKE $${paramIndex++} OR
          mi.tags::text ILIKE $${paramIndex++}
        )`;
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      // Add sorting
      const validSortFields = ['price', 'rating', 'created_at', 'popularity'];
      const sortField = validSortFields.includes(sortBy as string) ? sortBy : 'created_at';
      const sortDirection = sortOrder === 'asc' ? 'ASC' : 'DESC';

      if (sortField === 'popularity') {
        query += ` ORDER BY (mi.reviews * mi.rating) ${sortDirection}`;
      } else {
        query += ` ORDER BY mi.${sortField} ${sortDirection}`;
      }

      // Add pagination
      const offset = (Number(page) - 1) * Number(limit);
      query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
      params.push(Number(limit), offset);

      const itemsResult = await pool.query(query, params);

      // Get total count for pagination
      let countQuery = `
        SELECT COUNT(*) as total
        FROM marketplace_items mi
        WHERE mi.is_available = true
      `;

      const countParams: any[] = [];
      let countParamIndex = 1;

      if (category && category !== 'all') {
        countQuery += ` AND mi.category = $${countParamIndex++}`;
        countParams.push(category);
      }

      if (rarity && rarity !== 'all') {
        countQuery += ` AND mi.rarity = $${countParamIndex++}`;
        countParams.push(rarity);
      }

      if (minPrice) {
        countQuery += ` AND mi.price >= $${countParamIndex++}`;
        countParams.push(Number(minPrice));
      }

      if (maxPrice) {
        countQuery += ` AND mi.price <= $${countParamIndex++}`;
        countParams.push(Number(maxPrice));
      }

      if (search) {
        countQuery += ` AND (
          mi.name ILIKE $${countParamIndex++} OR 
          mi.description ILIKE $${countParamIndex++} OR
          mi.tags::text ILIKE $${countParamIndex++}
        )`;
        const searchTerm = `%${search}%`;
        countParams.push(searchTerm, searchTerm, searchTerm);
      }

      const countResult = await pool.query(countQuery, countParams);
      const total = Number(countResult.rows[0].total);

      res.json({
        success: true,
        data: itemsResult.rows,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      logger.error('Failed to get marketplace items:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Purchase marketplace item
   */
  async purchaseMarketplaceItem(req: Request, res: Response): Promise<void> {
    try {
      const buyerId = req.user?.id;
      const { itemId } = req.body;

      if (!buyerId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      if (!itemId) {
        res.status(400).json({
          success: false,
          error: 'Item ID is required'
        });
        return;
      }

      // Get item details
      const itemQuery = `
        SELECT 
          mi.*,
          p.username as seller_username,
          p.display_name as seller_display_name
        FROM marketplace_items mi
        JOIN players p ON mi.seller_id = p.id
        WHERE mi.id = $1 AND mi.is_available = true
      `;
      const itemResult = await pool.query(itemQuery, [itemId]);

      if (itemResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: 'Item not found or unavailable'
        });
        return;
      }

      const item = itemResult.rows[0];

      if (item.stock <= 0) {
        res.status(400).json({
          success: false,
          error: 'Item out of stock'
        });
        return;
      }

      if (item.seller_id === buyerId) {
        res.status(400).json({
          success: false,
          error: 'Cannot purchase your own item'
        });
        return;
      }

      const price = Number(item.price);
      const platformFee = price * 0.03;
      const sellerAmount = price - platformFee;

      // Process payment
      const paymentResult = await this.tonService.processPayment(
        buyerId,
        price.toString(),
        'marketplace_purchase'
      );

      if (paymentResult.success) {
        // Create purchase record
        const purchaseQuery = `
          INSERT INTO marketplace_purchases (
            buyer_id, seller_id, item_id, price, platform_fee, 
            seller_amount, transaction_hash, status, created_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, 'completed', NOW())
          RETURNING *
        `;
        const purchaseResult = await pool.query(purchaseQuery, [
          buyerId,
          item.seller_id,
          itemId,
          price,
          platformFee,
          sellerAmount,
          paymentResult.transactionHash
        ]);

        // Update item stock
        const newStock = item.stock - 1;
        const updateStockQuery = `
          UPDATE marketplace_items 
          SET stock = $1, 
              is_available = CASE WHEN $1 <= 0 THEN false ELSE is_available END,
              updated_at = NOW()
          WHERE id = $2
          RETURNING *
        `;
        await pool.query(updateStockQuery, [newStock, itemId]);

        // Update seller's balance
        await pool.query(`
          UPDATE players 
          SET balance = balance + $1, 
              total_earnings = total_earnings + $1,
              updated_at = NOW()
          WHERE id = $2
        `, [sellerAmount, item.seller_id]);

        // Create notifications
        await pool.query(`
          INSERT INTO notifications (user_id, type, title, message, data, created_at)
          VALUES 
            ($1, 'purchase_completed', 'Purchase Successful!', $2, $3, NOW()),
            ($4, 'item_sold', 'Item Sold!', $5, $6, NOW())
        `, [
          buyerId,
          `You successfully purchased ${item.name} for ${price} TON`,
          JSON.stringify({ itemId, price, transactionHash: paymentResult.transactionHash }),
          item.seller_id,
          `Your item ${item.name} was sold for ${sellerAmount.toFixed(2)} TON`,
          JSON.stringify({ itemId, price, sellerAmount, buyerId })
        ]);

        // Process super admin payout (3% commission)
        if (platformFee > 0) {
          await this.tonService.processSuperAdminPayout();
        }

        logger.info('Marketplace purchase completed', {
          buyerId,
          sellerId: item.seller_id,
          itemId,
          price,
          platformFee,
          sellerAmount,
          transactionHash: paymentResult.transactionHash
        });

        res.json({
          success: true,
          data: purchaseResult.rows[0],
          message: 'Purchase completed successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          error: paymentResult.error || 'Payment failed'
        });
      }
    } catch (error) {
      logger.error('Failed to purchase marketplace item:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Create marketplace listing
   */
  async createMarketplaceListing(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user?.id;
      const {
        name,
        description,
        price,
        category,
        rarity,
        icon,
        image,
        isLimited,
        maxStock,
        tags
      } = req.body;

      if (!sellerId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      if (!name || !description || !price || !category || !rarity) {
        res.status(400).json({
          success: false,
          error: 'Required fields missing'
        });
        return;
      }

      const createQuery = `
        INSERT INTO marketplace_items (
          seller_id, name, description, price, category, rarity, 
          icon, image, is_limited, max_stock, stock, tags, created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
        RETURNING *
      `;
      const createResult = await pool.query(createQuery, [
        sellerId,
        name,
        description,
        Number(price),
        category,
        rarity,
        icon || '📦',
        image || '',
        isLimited || false,
        maxStock || 1,
        maxStock || 1,
        tags || []
      ]);

      logger.info('Marketplace listing created', {
        sellerId,
        itemId: createResult.rows[0].id,
        name,
        price
      });

      res.json({
        success: true,
        data: createResult.rows[0],
        message: 'Listing created successfully'
      });
    } catch (error) {
      logger.error('Failed to create marketplace listing:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get user's marketplace listings
   */
  async getUserListings(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const listingsQuery = `
        SELECT 
          mi.*,
          COALESCE(SUM(mp.price), 0) as total_revenue,
          COUNT(mp.id) as total_sales
        FROM marketplace_items mi
        LEFT JOIN marketplace_purchases mp ON mi.id = mp.item_id AND mp.status = 'completed'
        WHERE mi.seller_id = $1
        GROUP BY mi.id
        ORDER BY mi.created_at DESC
      `;
      const listingsResult = await pool.query(listingsQuery, [userId]);

      res.json({
        success: true,
        data: listingsResult.rows
      });
    } catch (error) {
      logger.error('Failed to get user listings:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get user's purchase history
   */
  async getUserPurchases(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const purchasesQuery = `
        SELECT 
          mp.*,
          mi.name as item_name,
          mi.icon as item_icon,
          mi.image as item_image,
          p.username as seller_username,
          p.display_name as seller_display_name
        FROM marketplace_purchases mp
        JOIN marketplace_items mi ON mp.item_id = mi.id
        JOIN players p ON mp.seller_id = p.id
        WHERE mp.buyer_id = $1 AND mp.status = 'completed'
        ORDER BY mp.created_at DESC
        LIMIT 50
      `;
      const purchasesResult = await pool.query(purchasesQuery, [userId]);

      res.json({
        success: true,
        data: purchasesResult.rows
      });
    } catch (error) {
      logger.error('Failed to get user purchases:', error);
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
          COUNT(*) as total_items,
          COUNT(CASE WHEN is_available = true THEN 1 END) as available_items,
          COUNT(CASE WHEN is_limited = true THEN 1 END) as limited_items,
          COALESCE(SUM(price), 0) as total_value,
          COALESCE(AVG(price), 0) as average_price,
          COALESCE(SUM(stock), 0) as total_stock,
          COUNT(DISTINCT seller_id) as total_sellers
        FROM marketplace_items
      `;
      const statsResult = await pool.query(statsQuery);

      const salesQuery = `
        SELECT 
          COUNT(*) as total_sales,
          COALESCE(SUM(price), 0) as total_revenue,
          COALESCE(SUM(platform_fee), 0) as total_fees,
          COALESCE(AVG(price), 0) as average_sale_price,
          COUNT(DISTINCT buyer_id) as unique_buyers,
          COUNT(DISTINCT seller_id) as unique_sellers
        FROM marketplace_purchases
        WHERE status = 'completed'
      `;
      const salesResult = await pool.query(salesQuery);

      const categoryQuery = `
        SELECT 
          category,
          COUNT(*) as item_count,
          COALESCE(SUM(price), 0) as total_value,
          COALESCE(AVG(price), 0) as average_price
        FROM marketplace_items
        WHERE is_available = true
        GROUP BY category
        ORDER BY item_count DESC
      `;
      const categoryResult = await pool.query(categoryQuery);

      const stats = {
        items: statsResult.rows[0],
        sales: salesResult.rows[0],
        categories: categoryResult.rows
      };

      res.json({
        success: true,
        data: stats
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
