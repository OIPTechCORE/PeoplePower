import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { 
  GiftsEcosystem, 
  GiftRank, 
  GiftType, 
  GiftRarity,
  GiftHistory,
  WishlistItem,
  LimitedEditionGift,
  SeasonalGift,
  GiftReaction,
  GiftComment
} from '../../../shared/types/ecosystems';

export function createGiftsRoutes(pool: Pool): Router {
  const router = Router();

  // ==================== GIFTS ECOSYSTEM ====================
  
  // Get or create gifts ecosystem for a player
  router.get('/ecosystem/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      
      let result = await pool.query(
        'SELECT * FROM gifts_ecosystems WHERE player_id = $1',
        [playerId]
      );

      if (result.rows.length === 0) {
        // Create new gifts ecosystem
        result = await pool.query(
          `INSERT INTO gifts_ecosystems (
            player_id, gifts_received, gifts_sent, gift_rank,
            gift_power, gift_multiplier, total_stars_earned, created_at, updated_at
          ) VALUES ($1, 0, 0, $2, 0, 1.0, 0, NOW(), NOW()) 
          RETURNING *`,
          [playerId, GiftRank.GIVER]
        );
      }

      // Get gift inventory
      const inventoryResult = await pool.query(
        'SELECT * FROM gift_inventory WHERE player_id = $1 ORDER BY received_at DESC',
        [playerId]
      );

      // Get gift history
      const historyResult = await pool.query(
        `SELECT gh.*, p.username as from_username, p2.username as to_username
         FROM gift_history gh
         LEFT JOIN players p ON gh.from_player_id = p.id
         LEFT JOIN players p2 ON gh.to_player_id = p2.id
         WHERE gh.from_player_id = $1 OR gh.to_player_id = $1
         ORDER BY gh.timestamp DESC`,
        [playerId]
      );

      // Get wishlist
      const wishlistResult = await pool.query(
        'SELECT * FROM wishlist_items WHERE player_id = $1 AND is_fulfilled = false ORDER BY priority DESC',
        [playerId]
      );

      res.json({ 
        success: true, 
        data: {
          ecosystem: result.rows[0],
          inventory: inventoryResult.rows,
          history: historyResult.rows,
          wishlist: wishlistResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Send gift
  router.post('/send', async (req: Request, res: Response) => {
    try {
      const { fromPlayerId, toPlayerId, giftType, rarity, message, isPublic = true } = req.body;

      // Generate gift
      const gift = generateGift(giftType, rarity);

      // Add to recipient's inventory
      const inventoryResult = await pool.query(
        `INSERT INTO gift_inventory (
          player_id, gift_id, gift_type, quantity, rarity, 
          received_from, received_at, is_wrapped, personal_message
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), true, $7) 
        RETURNING *`,
        [toPlayerId, gift.id, giftType, 1, rarity, fromPlayerId, message]
      );

      // Update sender's ecosystem
      await pool.query(
        `UPDATE gifts_ecosystems SET 
          gifts_sent = gifts_sent + 1,
          gift_power = gift_power + $1,
          last_gift_sent_at = NOW(),
          updated_at = NOW()
        WHERE player_id = $2`,
        [gift.power, fromPlayerId]
      );

      // Update recipient's ecosystem
      await pool.query(
        `UPDATE gifts_ecosystems SET 
          gifts_received = gifts_received + 1,
          gift_power = gift_power + $1,
          last_gift_received_at = NOW(),
          updated_at = NOW()
        WHERE player_id = $2`,
        [gift.power, toPlayerId]
      );

      // Create gift history record
      await pool.query(
        `INSERT INTO gift_history (
          gift_id, gift_type, from_player_id, to_player_id, 
          message, timestamp, is_public
        ) VALUES ($1, $2, $3, $4, $5, NOW(), $6)`,
        [gift.id, giftType, fromPlayerId, toPlayerId, message, isPublic]
      );

      // Check for rank up
      const senderEcosystem = await pool.query(
        'SELECT gifts_sent FROM gifts_ecosystems WHERE player_id = $1',
        [fromPlayerId]
      );

      const newSenderRank = calculateGiftRank(senderEcosystem.rows[0].gifts_sent);
      await pool.query(
        'UPDATE gifts_ecosystems SET gift_rank = $1 WHERE player_id = $2',
        [newSenderRank, fromPlayerId]
      );

      res.json({ 
        success: true, 
        data: {
          gift: inventoryResult.rows[0],
          giftDetails: gift
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Open gift
  router.post('/open/:giftId', async (req: Request, res: Response) => {
    try {
      const { giftId } = req.params;
      const { playerId } = req.body;

      // Get gift details
      const giftResult = await pool.query(
        'SELECT * FROM gift_inventory WHERE id = $1 AND player_id = $2',
        [giftId, playerId]
      );

      if (giftResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Gift not found' });
      }

      const gift = giftResult.rows[0];

      if (!gift.is_wrapped) {
        return res.status(400).json({ success: false, error: 'Gift already opened' });
      }

      // Unwrap gift
      await pool.query(
        'UPDATE gift_inventory SET is_wrapped = false WHERE id = $1',
        [giftId]
      );

      // Generate gift content
      const content = generateGiftContent(gift.gift_type, gift.rarity);

      res.json({ 
        success: true, 
        data: {
          gift: { ...gift, is_wrapped: false },
          content
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== WISHLIST ====================
  
  // Add item to wishlist
  router.post('/wishlist', async (req: Request, res: Response) => {
    try {
      const { playerId, itemName, description, category, priority, price, isPublic = true } = req.body;

      const result = await pool.query(
        `INSERT INTO wishlist_items (
          player_id, item_name, description, category, priority, 
          price, is_public, added_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
        RETURNING *`,
        [playerId, itemName, description, category, priority, price, isPublic]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get public wishlists
  router.get('/wishlist/public', async (req: Request, res: Response) => {
    try {
      const { category, priority } = req.query;
      
      let query = `
        SELECT wi.*, p.username as player_name 
        FROM wishlist_items wi
        JOIN players p ON wi.player_id = p.id
        WHERE wi.is_public = true AND wi.is_fulfilled = false
      `;
      const params: any[] = [];

      if (category) {
        query += ' AND wi.category = $' + (params.length + 1);
        params.push(category);
      }

      if (priority) {
        query += ' AND wi.priority = $' + (params.length + 1);
        params.push(priority);
      }

      query += ' ORDER BY wi.priority DESC, wi.added_at DESC';

      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Fulfill wishlist item
  router.post('/wishlist/:itemId/fulfill', async (req: Request, res: Response) => {
    try {
      const { itemId } = req.params;
      const { playerId } = req.body;

      // Get wishlist item
      const itemResult = await pool.query(
        'SELECT * FROM wishlist_items WHERE id = $1',
        [itemId]
      );

      if (itemResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Wishlist item not found' });
      }

      const item = itemResult.rows[0];

      if (item.is_fulfilled) {
        return res.status(400).json({ success: false, error: 'Item already fulfilled' });
      }

      // Mark as fulfilled
      await pool.query(
        `UPDATE wishlist_items SET 
          is_fulfilled = true, 
          fulfilled_by = $1, 
          fulfilled_at = NOW() 
        WHERE id = $2`,
        [playerId, itemId]
      );

      // Create gift for the wishlist owner
      const gift = generateGift(GiftType.SURPRISE, GiftRarity.RARE);

      await pool.query(
        `INSERT INTO gift_inventory (
          player_id, gift_id, gift_type, quantity, rarity, 
          received_from, received_at, is_wrapped, personal_message
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), true, $7)`,
        [item.player_id, gift.id, GiftType.SURPRISE, 1, GiftRarity.RARE, playerId, `Wishlist item fulfilled: ${item.item_name}`]
      );

      res.json({ success: true, message: 'Wishlist item fulfilled successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== LIMITED EDITION GIFTS ====================
  
  // Get available limited edition gifts
  router.get('/limited-edition', async (req: Request, res: Response) => {
    try {
      const result = await pool.query(
        'SELECT * FROM limited_edition_gifts WHERE available_until > NOW() AND current_supply > 0 ORDER BY exclusivity_level DESC',
      );
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Purchase limited edition gift
  router.post('/limited-edition/:giftId/purchase', async (req: Request, res: Response) => {
    try {
      const { giftId } = req.params;
      const { playerId } = req.body;

      // Get gift details
      const giftResult = await pool.query(
        'SELECT * FROM limited_edition_gifts WHERE id = $1',
        [giftId]
      );

      if (giftResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Limited edition gift not found' });
      }

      const gift = giftResult.rows[0];

      if (gift.current_supply <= 0) {
        return res.status(400).json({ success: false, error: 'Gift out of stock' });
      }

      if (new Date(gift.available_until) < new Date()) {
        return res.status(400).json({ success: false, error: 'Gift no longer available' });
      }

      // Check if player has enough currency (this would integrate with main economy)
      // For now, we'll assume the purchase is successful

      // Update supply
      await pool.query(
        'UPDATE limited_edition_gifts SET current_supply = current_supply - 1 WHERE id = $1',
        [giftId]
      );

      // Add to player's inventory
      await pool.query(
        `INSERT INTO gift_inventory (
          player_id, gift_id, gift_type, quantity, rarity, 
          received_from, received_at, is_wrapped
        ) VALUES ($1, $2, $3, $4, $5, 'SYSTEM', NOW(), false)`,
        [playerId, giftId, GiftType.LIMITED_EDITION, 1, 'legendary']
      );

      res.json({ success: true, message: 'Limited edition gift purchased successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== SEASONAL GIFTS ====================
  
  // Get available seasonal gifts
  router.get('/seasonal', async (req: Request, res: Response) => {
    try {
      const { season, year } = req.query;
      
      let query = 'SELECT * FROM seasonal_gifts WHERE 1=1';
      const params: any[] = [];

      if (season) {
        query += ' AND season = $' + (params.length + 1);
        params.push(season);
      }

      if (year) {
        query += ' AND year = $' + (params.length + 1);
        params.push(year);
      }

      query += ' ORDER BY year DESC, season DESC';

      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== GIFT REACTIONS & COMMENTS ====================
  
  // Add reaction to gift
  router.post('/reactions', async (req: Request, res: Response) => {
    try {
      const { giftId, playerId, reaction } = req.body;

      // Check if player already reacted
      const existingReaction = await pool.query(
        'SELECT * FROM gift_reactions WHERE gift_id = $1 AND player_id = $2',
        [giftId, playerId]
      );

      if (existingReaction.rows.length > 0) {
        // Update existing reaction
        await pool.query(
          'UPDATE gift_reactions SET reaction = $1, timestamp = NOW() WHERE gift_id = $2 AND player_id = $3',
          [reaction, giftId, playerId]
        );
      } else {
        // Add new reaction
        await pool.query(
          'INSERT INTO gift_reactions (gift_id, player_id, reaction, timestamp) VALUES ($1, $2, $3, NOW())',
          [giftId, playerId, reaction]
        );
      }

      res.json({ success: true, message: 'Reaction added successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Add comment to gift
  router.post('/comments', async (req: Request, res: Response) => {
    try {
      const { giftId, playerId, comment } = req.body;

      const result = await pool.query(
        'INSERT INTO gift_comments (gift_id, player_id, comment, timestamp, is_edited) VALUES ($1, $2, $3, NOW(), false) RETURNING *',
        [giftId, playerId, comment]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get gift comments
  router.get('/comments/:giftId', async (req: Request, res: Response) => {
    try {
      const { giftId } = req.params;
      
      const result = await pool.query(
        `SELECT gc.*, p.username as player_name 
         FROM gift_comments gc
         JOIN players p ON gc.player_id = p.id
         WHERE gc.gift_id = $1
         ORDER BY gc.timestamp DESC`,
        [giftId]
      );

      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== ANALYTICS ====================
  
  // Get gifts analytics
  router.get('/analytics/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      
      // Get ecosystem stats
      const ecosystemResult = await pool.query(
        'SELECT * FROM gifts_ecosystems WHERE player_id = $1',
        [playerId]
      );

      // Get gift statistics
      const giftStats = await pool.query(
        `SELECT 
          gift_type,
          rarity,
          COUNT(*) as count
        FROM gift_inventory 
        WHERE player_id = $1
        GROUP BY gift_type, rarity
        ORDER BY count DESC`,
        [playerId]
      );

      // Get giving/receiving trends
      const trends = await pool.query(
        `SELECT 
          DATE_TRUNC('week', timestamp) as week,
          COUNT(CASE WHEN from_player_id = $1 THEN 1 END) as gifts_sent,
          COUNT(CASE WHEN to_player_id = $1 THEN 1 END) as gifts_received
        FROM gift_history 
        WHERE from_player_id = $1 OR to_player_id = $1
          AND timestamp >= NOW() - INTERVAL '12 weeks'
        GROUP BY DATE_TRUNC('week', timestamp)
        ORDER BY week DESC`,
        [playerId]
      );

      // Get wishlist fulfillment rate
      const wishlistStats = await pool.query(
        `SELECT 
          COUNT(*) as total_items,
          COUNT(CASE WHEN is_fulfilled = true THEN 1 END) as fulfilled_items
        FROM wishlist_items 
        WHERE player_id = $1`,
        [playerId]
      );

      res.json({ 
        success: true, 
        data: {
          ecosystem: ecosystemResult.rows[0],
          giftStats: giftStats.rows,
          trends: trends.rows,
          wishlistStats: wishlistStats.rows[0]
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  return router;
}

// Helper functions
function generateGift(giftType: GiftType, rarity: GiftRarity) {
  const id = `gift_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const power = calculateGiftPower(giftType, rarity);
  
  return {
    id,
    type: giftType,
    rarity,
    power,
    value: calculateGiftValue(giftType, rarity)
  };
}

function calculateGiftPower(giftType: GiftType, rarity: GiftRarity): number {
  const typeMultiplier = {
    [GiftType.VIRTUAL]: 1,
    [GiftType.PHYSICAL]: 2,
    [GiftType.EXPERIENCE]: 3,
    [GiftType.DIGITAL]: 1.5,
    [GiftType.CUSTOM]: 2.5,
    [GiftType.SURPRISE]: 4,
    [GiftType.MYSTERY]: 5
  };

  const rarityMultiplier = {
    [GiftRarity.COMMON]: 1,
    [GiftRarity.UNCOMMON]: 1.5,
    [GiftRarity.RARE]: 2,
    [GiftRarity.EPIC]: 3,
    [GiftRarity.LEGENDARY]: 5,
    [GiftRarity.MYTHICAL]: 8,
    [GiftRarity.DIVINE]: 12
  };

  return typeMultiplier[giftType] * rarityMultiplier[rarity];
}

function calculateGiftValue(giftType: GiftType, rarity: GiftRarity): number {
  const baseValues = {
    [GiftType.VIRTUAL]: 10,
    [GiftType.PHYSICAL]: 50,
    [GiftType.EXPERIENCE]: 100,
    [GiftType.DIGITAL]: 25,
    [GiftType.CUSTOM]: 75,
    [GiftType.SURPRISE]: 150,
    [GiftType.MYSTERY]: 200
  };

  const rarityMultipliers = {
    [GiftRarity.COMMON]: 1,
    [GiftRarity.UNCOMMON]: 1.5,
    [GiftRarity.RARE]: 2,
    [GiftRarity.EPIC]: 3,
    [GiftRarity.LEGENDARY]: 5,
    [GiftRarity.MYTHICAL]: 8,
    [GiftRarity.DIVINE]: 12
  };

  return baseValues[giftType] * rarityMultipliers[rarity];
}

function generateGiftContent(giftType: GiftType, rarity: GiftRarity) {
  const contents = {
    [GiftType.VIRTUAL]: ['Virtual Badge', 'Digital Trophy', 'Online Certificate'],
    [GiftType.PHYSICAL]: ['Custom Merchandise', 'Collectible Item', 'Premium Product'],
    [GiftType.EXPERIENCE]: ['VIP Access', 'Special Event', 'Exclusive Content'],
    [GiftType.DIGITAL]: ['E-book', 'Software License', 'Digital Art'],
    [GiftType.CUSTOM]: ['Personalized Item', 'Custom Creation', 'Unique Design'],
    [GiftType.SURPRISE]: ['Mystery Box', 'Random Reward', 'Surprise Package'],
    [GiftType.MYSTERY]: ['Ancient Artifact', 'Rare Find', 'Hidden Treasure']
  };

  const typeContents = contents[giftType] || contents[GiftType.SURPRISE];
  const content = typeContents[Math.floor(Math.random() * typeContents.length)];
  
  return {
    name: content,
    description: `A ${rarity.toLowerCase()} ${giftType.toLowerCase()} gift containing ${content.toLowerCase()}`,
    value: calculateGiftValue(giftType, rarity)
  };
}

function calculateGiftRank(giftsSent: number): GiftRank {
  if (giftsSent >= 1000) return GiftRank.SANTA_CLAUSE;
  if (giftsSent >= 500) return GiftRank.LEGENDARY_GIVER;
  if (giftsSent >= 200) return GiftRank.GIFT_MASTER;
  if (giftsSent >= 100) return GiftRank.BENEFACTOR;
  if (giftsSent >= 50) return GiftRank.PHILANTHROPIST;
  if (giftsSent >= 10) return GiftRank.GENEROUS;
  return GiftRank.GIVER;
}
