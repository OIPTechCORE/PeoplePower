import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { 
  MarketplaceEcosystem, 
  TraderRank, 
  ItemType, 
  MarketplaceCategory,
  Currency,
  ItemCondition,
  ItemQuality,
  ListingStatus,
  Storefront,
  ShippingType,
  PaymentMethod,
  TradeStatus
} from '../../../shared/types/ecosystems-extended';

export function createMarketplaceRoutes(pool: Pool): Router {
  const router = Router();

  // ==================== MARKETPLACE ECOSYSTEM ====================
  
  // Get or create marketplace ecosystem for a player
  router.get('/ecosystem/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      
      let result = await pool.query(
        'SELECT * FROM marketplace_ecosystems WHERE player_id = $1',
        [playerId]
      );

      if (result.rows.length === 0) {
        // Create new marketplace ecosystem
        result = await pool.query(
          `INSERT INTO marketplace_ecosystems (
            player_id, trader_rank, reputation_score, verification_level,
            has_storefront, joined_at, last_active_at
          ) VALUES ($1, $2, 0, $3, false, NOW(), NOW()) 
          RETURNING *`,
          [playerId, TraderRank.NEWCOMER, 'basic']
        );
      }

      // Get active listings
      const listingsResult = await pool.query(
        'SELECT * FROM marketplace_listings WHERE seller_id = $1 AND status = $2 ORDER BY created_at DESC',
        [playerId, ListingStatus.ACTIVE]
      );

      // Get sold items
      const soldResult = await pool.query(
        'SELECT * FROM sold_items WHERE seller_id = $1 ORDER BY sold_at DESC',
        [playerId]
      );

      // Get purchased items
      const purchasedResult = await pool.query(
        'SELECT * FROM purchased_items WHERE buyer_id = $1 ORDER BY purchased_at DESC',
        [playerId]
      );

      // Get storefront if exists
      const storefrontResult = await pool.query(
        'SELECT * FROM storefronts WHERE owner_id = $1',
        [playerId]
      );

      res.json({ 
        success: true, 
        data: {
          ecosystem: result.rows[0],
          activeListings: listingsResult.rows,
          soldItems: soldResult.rows,
          purchasedItems: purchasedResult.rows,
          storefront: storefrontResult.rows[0] || null
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== LISTINGS ====================
  
  // Create new listing
  router.post('/listings', async (req: Request, res: Response) => {
    try {
      const { 
        sellerId, itemName, description, category, price, currency,
        negotiable, minimumOffer, images, video, condition, quality,
        shippingOptions, estimatedDeliveryTime, featured, promoted
      } = req.body;

      const result = await pool.query(
        `INSERT INTO marketplace_listings (
          seller_id, item_name, description, category, price, currency,
          negotiable, minimum_offer, images, video, condition, quality,
          shipping_options, estimated_delivery_time, featured, promoted,
          status, views, likes, inquiries, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 0, 0, 0, NOW()) 
        RETURNING *`,
        [
          sellerId, itemName, description, category, price, currency,
          negotiable, minimumOffer, JSON.stringify(images), video, condition, quality,
          JSON.stringify(shippingOptions), estimatedDeliveryTime, featured || false, promoted || false,
          ListingStatus.ACTIVE
        ]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get listings with filters
  router.get('/listings', async (req: Request, res: Response) => {
    try {
      const { 
        category, itemType, condition, quality, minPrice, maxPrice, 
        currency, negotiable, featured, promoted, limit = 50, offset = 0 
      } = req.query;
      
      let query = `
        SELECT ml.*, p.username as seller_name, p.rating as seller_rating
        FROM marketplace_listings ml
        JOIN players p ON ml.seller_id = p.id
        WHERE ml.status = $1
      `;
      const params: any[] = [ListingStatus.ACTIVE];

      if (category) {
        query += ' AND ml.category = $' + (params.length + 1);
        params.push(category);
      }

      if (itemType) {
        query += ' AND ml.item_type = $' + (params.length + 1);
        params.push(itemType);
      }

      if (condition) {
        query += ' AND ml.condition = $' + (params.length + 1);
        params.push(condition);
      }

      if (quality) {
        query += ' AND ml.quality = $' + (params.length + 1);
        params.push(quality);
      }

      if (minPrice) {
        query += ' AND ml.price >= $' + (params.length + 1);
        params.push(minPrice);
      }

      if (maxPrice) {
        query += ' AND ml.price <= $' + (params.length + 1);
        params.push(maxPrice);
      }

      if (currency) {
        query += ' AND ml.currency = $' + (params.length + 1);
        params.push(currency);
      }

      if (negotiable !== undefined) {
        query += ' AND ml.negotiable = $' + (params.length + 1);
        params.push(negotiable === 'true');
      }

      if (featured !== undefined) {
        query += ' AND ml.featured = $' + (params.length + 1);
        params.push(featured === 'true');
      }

      if (promoted !== undefined) {
        query += ' AND ml.promoted = $' + (params.length + 1);
        params.push(promoted === 'true');
      }

      query += ' ORDER BY ml.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
      params.push(limit, offset);

      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get listing details
  router.get('/listings/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Increment view count
      await pool.query(
        'UPDATE marketplace_listings SET views = views + 1 WHERE id = $1',
        [id]
      );

      const result = await pool.query(
        `SELECT ml.*, p.username as seller_name, p.rating as seller_rating,
                s.name as storefront_name, s.verified as storefront_verified
         FROM marketplace_listings ml
         JOIN players p ON ml.seller_id = p.id
         LEFT JOIN storefronts s ON ml.seller_id = s.owner_id
         WHERE ml.id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Listing not found' });
      }

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Update listing
  router.patch('/listings/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { sellerId } = req.body;
      
      // Verify ownership
      const listingResult = await pool.query(
        'SELECT * FROM marketplace_listings WHERE id = $1 AND seller_id = $2',
        [id, sellerId]
      );

      if (listingResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Listing not found or unauthorized' });
      }

      const updateFields = [];
      const updateValues = [];
      let paramIndex = 1;

      // Dynamic field updates
      const allowedFields = ['item_name', 'description', 'price', 'negotiable', 'minimum_offer', 'condition', 'quality'];
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updateFields.push(`${field} = $${paramIndex++}`);
          updateValues.push(req.body[field]);
        }
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ success: false, error: 'No valid fields to update' });
      }

      updateFields.push(`updated_at = NOW()`);
      updateValues.push(id);

      const updateQuery = `
        UPDATE marketplace_listings 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await pool.query(updateQuery, updateValues);
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Delete listing
  router.delete('/listings/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { sellerId } = req.body;
      
      const result = await pool.query(
        'DELETE FROM marketplace_listings WHERE id = $1 AND seller_id = $2 RETURNING *',
        [id, sellerId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Listing not found or unauthorized' });
      }

      res.json({ success: true, message: 'Listing deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== TRANSACTIONS ====================
  
  // Make offer/purchase
  router.post('/transactions', async (req: Request, res: Response) => {
    try {
      const { 
        listingId, buyerId, offerPrice, message, shippingOption 
      } = req.body;

      // Get listing details
      const listingResult = await pool.query(
        'SELECT * FROM marketplace_listings WHERE id = $1 AND status = $2',
        [listingId, ListingStatus.ACTIVE]
      );

      if (listingResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Listing not found or not active' });
      }

      const listing = listingResult.rows[0];

      // Validate offer
      if (!listing.negotiable && offerPrice !== listing.price) {
        return res.status(400).json({ success: false, error: 'Price is not negotiable' });
      }

      if (listing.negotiable && listing.minimum_offer && offerPrice < listing.minimum_offer) {
        return res.status(400).json({ success: false, error: 'Offer below minimum price' });
      }

      // Create transaction
      const transactionResult = await pool.query(
        `INSERT INTO marketplace_transactions (
          listing_id, buyer_id, seller_id, offer_price, currency,
          message, shipping_option, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) 
        RETURNING *`,
        [
          listingId, buyerId, listing.seller_id, offerPrice, listing.currency,
          message, shippingOption, TradeStatus.PENDING
        ]
      );

      res.json({ success: true, data: transactionResult.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Respond to transaction
  router.patch('/transactions/:id/respond', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { sellerId, action, counterPrice } = req.body;

      // Get transaction details
      const transactionResult = await pool.query(
        'SELECT * FROM marketplace_transactions WHERE id = $1',
        [id]
      );

      if (transactionResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Transaction not found' });
      }

      const transaction = transactionResult.rows[0];

      if (transaction.seller_id !== sellerId) {
        return res.status(403).json({ success: false, error: 'Unauthorized' });
      }

      if (transaction.status !== TradeStatus.PENDING) {
        return res.status(400).json({ success: false, error: 'Transaction already processed' });
      }

      let newStatus;
      let finalPrice = transaction.offer_price;

      if (action === 'accept') {
        newStatus = TradeStatus.CONFIRMED;
        
        // Update listing status
        await pool.query(
          'UPDATE marketplace_listings SET status = $1 WHERE id = $2',
          [ListingStatus.SOLD, transaction.listing_id]
        );

        // Create sold item record
        await pool.query(
          `INSERT INTO sold_items (
            listing_id, buyer_id, seller_id, price, currency, commission, 
            net_earnings, sold_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
          [
            transaction.listing_id, transaction.buyer_id, transaction.seller_id,
            finalPrice, transaction.currency, finalPrice * 0.05, finalPrice * 0.95
          ]
        );

        // Create purchased item record
        await pool.query(
          `INSERT INTO purchased_items (
            listing_id, seller_id, buyer_id, price, currency, purchased_at, delivery_status
          ) VALUES ($1, $2, $3, $4, $5, NOW(), $6)`,
          [
            transaction.listing_id, transaction.seller_id, transaction.buyer_id,
            finalPrice, transaction.currency, 'pending'
          ]
        );

      } else if (action === 'counter') {
        newStatus = TradeStatus.PENDING;
        finalPrice = counterPrice;
        
        await pool.query(
          'UPDATE marketplace_transactions SET offer_price = $1, status = $2 WHERE id = $3',
          [counterPrice, newStatus, id]
        );

      } else if (action === 'reject') {
        newStatus = TradeStatus.CANCELLED;
      }

      if (action !== 'counter') {
        await pool.query(
          'UPDATE marketplace_transactions SET status = $1 WHERE id = $2',
          [newStatus, id]
        );
      }

      res.json({ 
        success: true, 
        data: { 
          status: newStatus, 
          finalPrice,
          action 
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get transaction history
  router.get('/transactions/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      const { limit = 50, offset = 0, status } = req.query;
      
      let query = `
        SELECT mt.*, ml.item_name, p.username as counterparty_name
        FROM marketplace_transactions mt
        JOIN marketplace_listings ml ON mt.listing_id = ml.id
        JOIN players p ON (CASE 
          WHEN mt.buyer_id = $1 THEN mt.seller_id 
          ELSE mt.buyer_id 
        END = p.id)
        WHERE (mt.buyer_id = $1 OR mt.seller_id = $1)
      `;
      const params: any[] = [playerId];

      if (status) {
        query += ' AND mt.status = $' + (params.length + 1);
        params.push(status);
      }

      query += ' ORDER BY mt.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
      params.push(limit, offset);

      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== STOREFRONTS ====================
  
  // Create storefront
  router.post('/storefronts', async (req: Request, res: Response) => {
    try {
      const { 
        ownerId, name, description, category, tags, logo, banner,
        returnPolicy, shippingPolicy, paymentMethods, features
      } = req.body;

      // Check if user already has a storefront
      const existingStorefront = await pool.query(
        'SELECT * FROM storefronts WHERE owner_id = $1',
        [ownerId]
      );

      if (existingStorefront.rows.length > 0) {
        return res.status(400).json({ success: false, error: 'Storefront already exists' });
      }

      const result = await pool.query(
        `INSERT INTO storefronts (
          owner_id, name, description, category, tags, logo, banner,
          return_policy, shipping_policy, payment_methods, features,
          is_active, is_verified, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true, false, NOW(), NOW()) 
        RETURNING *`,
        [
          ownerId, name, description, category, JSON.stringify(tags), logo, banner,
          JSON.stringify(returnPolicy), JSON.stringify(shippingPolicy), 
          JSON.stringify(paymentMethods), JSON.stringify(features)
        ]
      );

      // Update ecosystem
      await pool.query(
        'UPDATE marketplace_ecosystems SET has_storefront = true WHERE player_id = $1',
        [ownerId]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get storefront
  router.get('/storefronts/:ownerId', async (req: Request, res: Response) => {
    try {
      const { ownerId } = req.params;
      
      const result = await pool.query(
        `SELECT s.*, p.username as owner_name, p.rating as owner_rating
         FROM storefronts s
         JOIN players p ON s.owner_id = p.id
         WHERE s.owner_id = $1`,
        [ownerId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Storefront not found' });
      }

      // Get storefront listings
      const listingsResult = await pool.query(
        'SELECT * FROM marketplace_listings WHERE seller_id = $1 AND status = $2 ORDER BY created_at DESC',
        [ownerId, ListingStatus.ACTIVE]
      );

      res.json({ 
        success: true, 
        data: {
          storefront: result.rows[0],
          listings: listingsResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== ANALYTICS ====================
  
  // Get marketplace analytics
  router.get('/analytics/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      
      // Get ecosystem stats
      const ecosystemResult = await pool.query(
        'SELECT * FROM marketplace_ecosystems WHERE player_id = $1',
        [playerId]
      );

      // Get seller stats
      const sellerStats = await pool.query(
        `SELECT 
          COUNT(*) as total_listings,
          COUNT(CASE WHEN status = 'sold' THEN 1 END) as sold_listings,
          AVG(price) as average_price,
          SUM(CASE WHEN status = 'sold' THEN price ELSE 0 END) as total_revenue
        FROM marketplace_listings 
        WHERE seller_id = $1`,
        [playerId]
      );

      // Get buyer stats
      const buyerStats = await pool.query(
        `SELECT 
          COUNT(*) as total_purchases,
          SUM(price) as total_spent,
          AVG(price) as average_purchase_price
        FROM purchased_items 
        WHERE buyer_id = $1`,
        [playerId]
      );

      // Get monthly trends
      const monthlyTrends = await pool.query(
        `SELECT 
          DATE_TRUNC('month', created_at) as month,
          COUNT(*) as listings,
          SUM(CASE WHEN status = 'sold' THEN price ELSE 0 END) as revenue
        FROM marketplace_listings 
        WHERE seller_id = $1 AND created_at >= NOW() - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY month DESC`,
        [playerId]
      );

      res.json({ 
        success: true, 
        data: {
          ecosystem: ecosystemResult.rows[0],
          sellerStats: sellerStats.rows[0],
          buyerStats: buyerStats.rows[0],
          monthlyTrends: monthlyTrends.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  return router;
}
