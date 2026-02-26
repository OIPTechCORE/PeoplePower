import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { 
  StarsEcosystem, 
  StarRank, 
  StarType, 
  StarRarity,
  StarAchievement,
  StarMilestone,
  StarTransaction
} from '../../../shared/types/ecosystems';

export function createStarsRoutes(pool: Pool): Router {
  const router = Router();

  // ==================== STARS ECOSYSTEM ====================
  
  // Get or create stars ecosystem for a player
  router.get('/ecosystem/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      
      let result = await pool.query(
        'SELECT * FROM stars_ecosystems WHERE player_id = $1',
        [playerId]
      );

      if (result.rows.length === 0) {
        // Create new stars ecosystem
        result = await pool.query(
          `INSERT INTO stars_ecosystems (
            player_id, stars_collected, star_rank, star_level,
            star_power, star_multiplier, star_gifts_sent, star_gifts_received,
            total_stars_earned, created_at, updated_at
          ) VALUES ($1, 0, $2, 1, 0, 1.0, 0, 0, 0, NOW(), NOW()) 
          RETURNING *`,
          [playerId, StarRank.NOVICE]
        );
      }

      // Get star inventory
      const inventoryResult = await pool.query(
        'SELECT * FROM star_inventory WHERE player_id = $1 ORDER BY collected_at DESC',
        [playerId]
      );

      // Get achievements
      const achievementsResult = await pool.query(
        'SELECT * FROM star_achievements WHERE player_id = $1 ORDER BY earned_at DESC',
        [playerId]
      );

      // Get milestones
      const milestonesResult = await pool.query(
        'SELECT * FROM star_milestones WHERE player_id = $1 ORDER BY level ASC',
        [playerId]
      );

      res.json({ 
        success: true, 
        data: {
          ecosystem: result.rows[0],
          inventory: inventoryResult.rows,
          achievements: achievementsResult.rows,
          milestones: milestonesResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Collect stars
  router.post('/collect', async (req: Request, res: Response) => {
    try {
      const { playerId, starType, rarity, quantity = 1 } = req.body;

      // Calculate star power based on type and rarity
      const starPower = calculateStarPower(starType, rarity);

      // Add to inventory
      const inventoryResult = await pool.query(
        `INSERT INTO star_inventory (
          player_id, star_type, quantity, rarity, power, collected_at
        ) VALUES ($1, $2, $3, $4, $5, NOW()) 
        ON CONFLICT (player_id, star_type, rarity) DO UPDATE SET
          quantity = star_inventory.quantity + EXCLUDED.quantity,
          power = star_inventory.power + EXCLUDED.power,
          collected_at = NOW()
        RETURNING *`,
        [playerId, starType, quantity, rarity, starPower]
      );

      // Update ecosystem
      const ecosystemResult = await pool.query(
        `UPDATE stars_ecosystems SET 
          stars_collected = stars_collected + $1,
          star_power = star_power + $2,
          total_stars_earned = total_stars_earned + $1,
          last_star_collected_at = NOW(),
          updated_at = NOW()
        WHERE player_id = $3 RETURNING *`,
        [quantity, starPower, playerId]
      );

      // Check for rank up
      const newRank = calculateStarRank(ecosystemResult.rows[0].stars_collected);
      if (newRank !== ecosystemResult.rows[0].star_rank) {
        await pool.query(
          'UPDATE stars_ecosystems SET star_rank = $1 WHERE player_id = $2',
          [newRank, playerId]
        );
      }

      // Create transaction record
      await pool.query(
        `INSERT INTO star_transactions (
          player_id, type, amount, star_type, reason, timestamp
        ) VALUES ($1, 'earned', $2, $3, 'Collected stars', NOW())`,
        [playerId, quantity, starType]
      );

      res.json({ 
        success: true, 
        data: {
          inventory: inventoryResult.rows[0],
          ecosystem: { ...ecosystemResult.rows[0], star_rank: newRank }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Trade stars
  router.post('/trade', async (req: Request, res: Response) => {
    try {
      const { fromPlayerId, toPlayerId, starType, quantity, price } = req.body;

      // Check if sender has enough stars
      const senderInventory = await pool.query(
        'SELECT quantity FROM star_inventory WHERE player_id = $1 AND star_type = $2',
        [fromPlayerId, starType]
      );

      if (senderInventory.rows.length === 0 || senderInventory.rows[0].quantity < quantity) {
        return res.status(400).json({ success: false, error: 'Insufficient stars' });
      }

      // Transfer stars
      await pool.query(
        `UPDATE star_inventory SET quantity = quantity - $1 
         WHERE player_id = $2 AND star_type = $3`,
        [quantity, fromPlayerId, starType]
      );

      await pool.query(
        `INSERT INTO star_inventory (
          player_id, star_type, quantity, rarity, power, collected_at
        ) VALUES ($1, $2, $3, 'common', 0, NOW()) 
        ON CONFLICT (player_id, star_type, rarity) DO UPDATE SET
          quantity = star_inventory.quantity + EXCLUDED.quantity`,
        [toPlayerId, starType, quantity]
      );

      // Create transaction records
      await pool.query(
        `INSERT INTO star_transactions (
          player_id, type, amount, star_type, from_player_id, to_player_id, reason, timestamp
        ) VALUES 
          ($1, 'spent', $2, $3, $1, $4, 'Trade', NOW()),
          ($4, 'received', $2, $3, $1, $4, 'Trade', NOW())`,
        [fromPlayerId, quantity, starType, toPlayerId]
      );

      res.json({ success: true, message: 'Stars traded successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Gift stars
  router.post('/gift', async (req: Request, res: Response) => {
    try {
      const { fromPlayerId, toPlayerId, starType, quantity, message } = req.body;

      // Check if sender has enough stars
      const senderInventory = await pool.query(
        'SELECT quantity FROM star_inventory WHERE player_id = $1 AND star_type = $2',
        [fromPlayerId, starType]
      );

      if (senderInventory.rows.length === 0 || senderInventory.rows[0].quantity < quantity) {
        return res.status(400).json({ success: false, error: 'Insufficient stars' });
      }

      // Transfer stars
      await pool.query(
        `UPDATE star_inventory SET quantity = quantity - $1 
         WHERE player_id = $2 AND star_type = $3`,
        [quantity, fromPlayerId, starType]
      );

      await pool.query(
        `INSERT INTO star_inventory (
          player_id, star_type, quantity, rarity, power, collected_at, received_from
        ) VALUES ($1, $2, $3, 'common', 0, NOW(), $4) 
        ON CONFLICT (player_id, star_type, rarity) DO UPDATE SET
          quantity = star_inventory.quantity + EXCLUDED.quantity`,
        [toPlayerId, starType, quantity, fromPlayerId]
      );

      // Update gift counters
      await pool.query(
        `UPDATE stars_ecosystems SET 
          star_gifts_sent = star_gifts_sent + $1,
          updated_at = NOW()
        WHERE player_id = $2`,
        [quantity, fromPlayerId]
      );

      await pool.query(
        `UPDATE stars_ecosystems SET 
          star_gifts_received = star_gifts_received + $1,
          updated_at = NOW()
        WHERE player_id = $2`,
        [quantity, toPlayerId]
      );

      // Create transaction records
      await pool.query(
        `INSERT INTO star_transactions (
          player_id, type, amount, star_type, from_player_id, to_player_id, reason, timestamp
        ) VALUES 
          ($1, 'gifted', $2, $3, $1, $4, $5, NOW()),
          ($4, 'received', $2, $3, $1, $4, $5, NOW())`,
        [fromPlayerId, quantity, starType, toPlayerId, message || 'Gift']
      );

      res.json({ success: true, message: 'Stars gifted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ==================== ACHIEVEMENTS ====================
  
  // Get available achievements
  router.get('/achievements', async (req: Request, res: Response) => {
    try {
      const result = await pool.query(
        'SELECT * FROM star_achievement_definitions ORDER BY requirement ASC'
      );
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get player achievements
  router.get('/achievements/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      const result = await pool.query(
        'SELECT * FROM star_achievements WHERE player_id = $1 ORDER BY earned_at DESC',
        [playerId]
      );
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Check and award achievements
  router.post('/achievements/check/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      
      // Get player's current stats
      const ecosystemResult = await pool.query(
        'SELECT * FROM stars_ecosystems WHERE player_id = $1',
        [playerId]
      );

      if (ecosystemResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Stars ecosystem not found' });
      }

      const ecosystem = ecosystemResult.rows[0];
      const newAchievements = [];

      // Get all available achievements
      const achievementsResult = await pool.query(
        'SELECT * FROM star_achievement_definitions'
      );

      for (const achievement of achievementsResult.rows) {
        // Check if player already has this achievement
        const hasAchievement = await pool.query(
          'SELECT * FROM star_achievements WHERE player_id = $1 AND achievement_id = $2',
          [playerId, achievement.id]
        );

        if (hasAchievement.rows.length > 0) continue;

        // Check if player meets requirements
        let meetsRequirement = false;
        switch (achievement.requirement_type) {
          case 'stars_collected':
            meetsRequirement = ecosystem.stars_collected >= achievement.requirement;
            break;
          case 'star_rank':
            meetsRequirement = ecosystem.star_rank === achievement.requirement;
            break;
          case 'star_power':
            meetsRequirement = ecosystem.star_power >= achievement.requirement;
            break;
          case 'gifts_sent':
            meetsRequirement = ecosystem.star_gifts_sent >= achievement.requirement;
            break;
        }

        if (meetsRequirement) {
          // Award achievement
          await pool.query(
            `INSERT INTO star_achievements (
              player_id, achievement_id, name, description, requirement, reward, earned_at
            ) VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
            [
              playerId, achievement.id, achievement.name, achievement.description,
              achievement.requirement, JSON.stringify(achievement.reward)
            ]
          );
          newAchievements.push(achievement);
        }
      }

      res.json({ success: true, data: newAchievements });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ==================== MILESTONES ====================
  
  // Get available milestones
  router.get('/milestones', async (req: Request, res: Response) => {
    try {
      const result = await pool.query(
        'SELECT * FROM star_milestone_definitions ORDER BY level ASC'
      );
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get player milestones
  router.get('/milestones/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      const result = await pool.query(
        'SELECT * FROM star_milestones WHERE player_id = $1 ORDER BY level ASC',
        [playerId]
      );
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ==================== TRANSACTIONS ====================
  
  // Get transaction history
  router.get('/transactions/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      const { limit = 50, offset = 0, type } = req.query;
      
      let query = 'SELECT * FROM star_transactions WHERE player_id = $1';
      const params = [playerId];
      
      if (type) {
        query += ' AND type = $2';
        params.push(type);
      }
      
      query += ' ORDER BY timestamp DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
      params.push(limit, offset);
      
      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ==================== ANALYTICS ====================
  
  // Get stars analytics
  router.get('/analytics/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      const { period = '30d' } = req.query;
      
      // Get ecosystem stats
      const ecosystemResult = await pool.query(
        'SELECT * FROM stars_ecosystems WHERE player_id = $1',
        [playerId]
      );

      // Get transaction stats
      const transactionStats = await pool.query(
        `SELECT 
          type,
          COUNT(*) as count,
          SUM(amount) as total_amount
        FROM star_transactions 
        WHERE player_id = $1 AND timestamp >= NOW() - INTERVAL '30 days'
        GROUP BY type`,
        [playerId]
      );

      // Get inventory breakdown
      const inventoryBreakdown = await pool.query(
        `SELECT 
          star_type,
          rarity,
          SUM(quantity) as total_quantity,
          SUM(power) as total_power
        FROM star_inventory 
        WHERE player_id = $1
        GROUP BY star_type, rarity
        ORDER BY total_quantity DESC`,
        [playerId]
      );

      res.json({ 
        success: true, 
        data: {
          ecosystem: ecosystemResult.rows[0],
          transactionStats: transactionStats.rows,
          inventoryBreakdown: inventoryBreakdown.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  return router;
}

// Helper functions
function calculateStarPower(starType: StarType, rarity: StarRarity): number {
  const typeMultiplier = {
    [StarType.BRONZE]: 1,
    [StarType.SILVER]: 2,
    [StarType.GOLD]: 3,
    [StarType.PLATINUM]: 5,
    [StarType.DIAMOND]: 8,
    [StarType.RAINBOW]: 12,
    [StarType.COSMIC]: 20,
    [StarType.QUANTUM]: 50
  };

  const rarityMultiplier = {
    [StarRarity.COMMON]: 1,
    [StarRarity.UNCOMMON]: 1.5,
    [StarRarity.RARE]: 2,
    [StarRarity.EPIC]: 3,
    [StarRarity.LEGENDARY]: 5,
    [StarRarity.MYTHIC]: 10
  };

  return typeMultiplier[starType] * rarityMultiplier[rarity];
}

function calculateStarRank(starsCollected: number): StarRank {
  if (starsCollected >= 10000) return StarRank.CELESTIAL;
  if (starsCollected >= 5000) return StarRank.LEGEND;
  if (starsCollected >= 2000) return StarRank.GRANDMASTER;
  if (starsCollected >= 1000) return StarRank.MASTER;
  if (starsCollected >= 500) return StarRank.JOURNEYMAN;
  if (starsCollected >= 100) return StarRank.APPRENTICE;
  return StarRank.NOVICE;
}
