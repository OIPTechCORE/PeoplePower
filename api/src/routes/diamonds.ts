import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { 
  DiamondsEcosystem, 
  DiamondRank, 
  DiamondType, 
  DiamondClarity,
  DiamondCut,
  PremiumStatus,
  DiamondTransaction
} from '../../../shared/types/ecosystems';

export function createDiamondsRoutes(pool: Pool): Router {
  const router = Router();

  // ==================== DIAMONDS ECOSYSTEM ====================
  
  // Get or create diamonds ecosystem for a player
  router.get('/ecosystem/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      
      let result = await pool.query(
        'SELECT * FROM diamonds_ecosystems WHERE player_id = $1',
        [playerId]
      );

      if (result.rows.length === 0) {
        // Create new diamonds ecosystem
        result = await pool.query(
          `INSERT INTO diamonds_ecosystems (
            player_id, diamonds_collected, diamond_rank, diamond_level,
            mining_level, crafting_level, diamond_power, diamond_multiplier,
            premium_status, total_diamonds_earned, created_at, updated_at
          ) VALUES ($1, 0, $2, 1, 1, 1, 0, 1.0, $3, 0, NOW(), NOW()) 
          RETURNING *`,
          [playerId, DiamondRank.PROSPECTOR, PremiumStatus.NONE]
        );
      }

      // Get diamond inventory
      const inventoryResult = await pool.query(
        'SELECT * FROM diamond_inventory WHERE player_id = $1 ORDER BY mined_at DESC',
        [playerId]
      );

      // Get crafting recipes
      const recipesResult = await pool.query(
        `SELECT cr.* FROM crafting_recipes cr
         JOIN player_unlocked_recipes pur ON cr.id = pur.recipe_id
         WHERE pur.player_id = $1`,
        [playerId]
      );

      // Get premium benefits
      const benefitsResult = await pool.query(
        `SELECT pb.* FROM premium_benefits pb
         JOIN player_premium_benefits ppb ON pb.id = ppb.benefit_id
         WHERE ppb.player_id = $1 AND ppb.is_active = true`,
        [playerId]
      );

      res.json({ 
        success: true, 
        data: {
          ecosystem: result.rows[0],
          inventory: inventoryResult.rows,
          recipes: recipesResult.rows,
          benefits: benefitsResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Mine diamonds
  router.post('/mine', async (req: Request, res: Response) => {
    try {
      const { playerId, miningLevel } = req.body;

      // Calculate mining results based on level
      const miningResults = calculateMiningResults(miningLevel);

      // Add to inventory
      const inventoryResult = await pool.query(
        `INSERT INTO diamond_inventory (
          player_id, diamond_type, quantity, clarity, cut, carat, value, mined_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
        RETURNING *`,
        [
          playerId, 
          miningResults.type, 
          miningResults.quantity, 
          miningResults.clarity, 
          miningResults.cut,
          miningResults.carat,
          miningResults.value
        ]
      );

      // Update ecosystem
      const ecosystemResult = await pool.query(
        `UPDATE diamonds_ecosystems SET 
          diamonds_collected = diamonds_collected + $1,
          diamond_power = diamond_power + $2,
          total_diamonds_earned = total_diamonds_earned + $1,
          last_diamond_mined_at = NOW(),
          updated_at = NOW()
        WHERE player_id = $3 RETURNING *`,
        [miningResults.quantity, miningResults.value, playerId]
      );

      // Check for rank up
      const newRank = calculateDiamondRank(ecosystemResult.rows[0].diamonds_collected);
      if (newRank !== ecosystemResult.rows[0].diamond_rank) {
        await pool.query(
          'UPDATE diamonds_ecosystems SET diamond_rank = $1 WHERE player_id = $2',
          [newRank, playerId]
        );
      }

      // Create transaction record
      await pool.query(
        `INSERT INTO diamond_transactions (
          player_id, type, amount, diamond_type, reason, timestamp
        ) VALUES ($1, 'mined', $2, $3, 'Mining', NOW())`,
        [playerId, miningResults.quantity, miningResults.type]
      );

      res.json({ 
        success: true, 
        data: {
          inventory: inventoryResult.rows[0],
          ecosystem: { ...ecosystemResult.rows[0], diamond_rank: newRank },
          miningResults
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Craft diamonds
  router.post('/craft', async (req: Request, res: Response) => {
    try {
      const { playerId, recipeId, quantity = 1 } = req.body;

      // Get recipe details
      const recipeResult = await pool.query(
        'SELECT * FROM crafting_recipes WHERE id = $1',
        [recipeId]
      );

      if (recipeResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Recipe not found' });
      }

      const recipe = recipeResult.rows[0];

      // Check if player has unlocked this recipe
      const hasRecipe = await pool.query(
        'SELECT * FROM player_unlocked_recipes WHERE player_id = $1 AND recipe_id = $2',
        [playerId, recipeId]
      );

      if (hasRecipe.rows.length === 0) {
        return res.status(400).json({ success: false, error: 'Recipe not unlocked' });
      }

      // Check if player has required materials
      const requirements = JSON.parse(recipe.requirements);
      for (const requirement of requirements) {
        if (requirement.itemType === 'diamond') {
          const materialResult = await pool.query(
            'SELECT quantity FROM diamond_inventory WHERE player_id = $1 AND diamond_type = $2',
            [playerId, requirement.itemId]
          );

          if (materialResult.rows.length === 0 || materialResult.rows[0].quantity < requirement.quantity * quantity) {
            return res.status(400).json({ 
              success: false, 
              error: `Insufficient ${requirement.itemId} diamonds` 
            });
          }
        }
      }

      // Calculate crafting success
      const success = Math.random() < (recipe.success_rate / 100);
      
      if (!success) {
        // Still consume materials on failure
        for (const requirement of requirements) {
          if (requirement.itemType === 'diamond') {
            await pool.query(
              'UPDATE diamond_inventory SET quantity = quantity - $1 WHERE player_id = $2 AND diamond_type = $3',
              [requirement.quantity * quantity, playerId, requirement.itemId]
            );
          }
        }
        return res.json({ success: true, message: 'Crafting failed', result: null });
      }

      // Consume materials
      for (const requirement of requirements) {
        if (requirement.itemType === 'diamond') {
          await pool.query(
            'UPDATE diamond_inventory SET quantity = quantity - $1 WHERE player_id = $2 AND diamond_type = $3',
            [requirement.quantity * quantity, playerId, requirement.itemId]
          );
        }
      }

      // Create crafted diamond
      const result = JSON.parse(recipe.result);
      const craftedDiamond = await pool.query(
        `INSERT INTO diamond_inventory (
          player_id, diamond_type, quantity, clarity, cut, carat, value, mined_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
        RETURNING *`,
        [
          playerId, 
          result.itemId, 
          result.quantity * quantity, 
          'flawless', 
          'excellent',
          2.0,
          result.value * quantity
        ]
      );

      // Update crafting level
      await pool.query(
        'UPDATE diamonds_ecosystems SET crafting_level = crafting_level + 1, updated_at = NOW() WHERE player_id = $1',
        [playerId]
      );

      // Create transaction record
      await pool.query(
        `INSERT INTO diamond_transactions (
          player_id, type, amount, diamond_type, reason, timestamp
        ) VALUES ($1, 'crafted', $2, $3, 'Crafting', NOW())`,
        [playerId, result.quantity * quantity, result.itemId]
      );

      res.json({ 
        success: true, 
        data: {
          crafted: craftedDiamond.rows[0],
          quality: result.quality
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Upgrade premium status
  router.post('/premium/upgrade', async (req: Request, res: Response) => {
    try {
      const { playerId, newStatus } = req.body;

      // Get current ecosystem
      const ecosystemResult = await pool.query(
        'SELECT * FROM diamonds_ecosystems WHERE player_id = $1',
        [playerId]
      );

      if (ecosystemResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Diamonds ecosystem not found' });
      }

      const currentStatus = ecosystemResult.rows[0].premium_status;
      
      // Check if upgrade is valid
      if (!isValidUpgrade(currentStatus, newStatus)) {
        return res.status(400).json({ success: false, error: 'Invalid upgrade path' });
      }

      // Calculate cost
      const cost = calculatePremiumUpgradeCost(newStatus);

      // Check if player has enough power tokens (assuming this is integrated with main economy)
      // This would need to be connected to the main player economy system

      // Update premium status
      const updateResult = await pool.query(
        'UPDATE diamonds_ecosystems SET premium_status = $1, updated_at = NOW() WHERE player_id = $2 RETURNING *',
        [newStatus, playerId]
      );

      // Grant premium benefits
      const benefits = await pool.query(
        'SELECT * FROM premium_benefits WHERE required_status <= $1',
        [newStatus]
      );

      for (const benefit of benefits.rows) {
        await pool.query(
          `INSERT INTO player_premium_benefits (
            player_id, benefit_id, is_active, granted_at
          ) VALUES ($1, $2, true, NOW()) 
          ON CONFLICT (player_id, benefit_id) DO UPDATE SET
            is_active = true`,
          [playerId, benefit.id]
        );
      }

      res.json({ 
        success: true, 
        data: {
          ecosystem: updateResult.rows[0],
          benefits: benefits.rows,
          cost
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== CRAFTING RECIPES ====================
  
  // Get available recipes
  router.get('/recipes', async (req: Request, res: Response) => {
    try {
      const { craftingLevel } = req.query;
      
      let query = 'SELECT * FROM crafting_recipes';
      const params: any[] = [];
      
      if (craftingLevel) {
        query += ' WHERE skill_level <= $1';
        params.push(craftingLevel);
      }
      
      query += ' ORDER BY skill_level ASC';
      
      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Unlock recipe
  router.post('/recipes/unlock', async (req: Request, res: Response) => {
    try {
      const { playerId, recipeId } = req.body;

      // Check if recipe exists and player meets requirements
      const recipeResult = await pool.query(
        'SELECT * FROM crafting_recipes WHERE id = $1',
        [recipeId]
      );

      if (recipeResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Recipe not found' });
      }

      const recipe = recipeResult.rows[0];

      // Check player's crafting level
      const ecosystemResult = await pool.query(
        'SELECT crafting_level FROM diamonds_ecosystems WHERE player_id = $1',
        [playerId]
      );

      if (ecosystemResult.rows.length === 0 || ecosystemResult.rows[0].crafting_level < recipe.skill_level) {
        return res.status(400).json({ success: false, error: 'Insufficient crafting level' });
      }

      // Check if already unlocked
      const hasRecipe = await pool.query(
        'SELECT * FROM player_unlocked_recipes WHERE player_id = $1 AND recipe_id = $2',
        [playerId, recipeId]
      );

      if (hasRecipe.rows.length > 0) {
        return res.status(400).json({ success: false, error: 'Recipe already unlocked' });
      }

      // Unlock recipe
      await pool.query(
        'INSERT INTO player_unlocked_recipes (player_id, recipe_id, unlocked_at) VALUES ($1, $2, NOW())',
        [playerId, recipeId]
      );

      res.json({ success: true, message: 'Recipe unlocked successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== TRANSACTIONS ====================
  
  // Get transaction history
  router.get('/transactions/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      const { limit = 50, offset = 0, type } = req.query;
      
      let query = 'SELECT * FROM diamond_transactions WHERE player_id = $1';
      const params: any[] = [playerId];
      
      if (type) {
        query += ' AND type = $2';
        params.push(type);
      }
      
      query += ' ORDER BY timestamp DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
      params.push(limit, offset);
      
      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== ANALYTICS ====================
  
  // Get diamonds analytics
  router.get('/analytics/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      
      // Get ecosystem stats
      const ecosystemResult = await pool.query(
        'SELECT * FROM diamonds_ecosystems WHERE player_id = $1',
        [playerId]
      );

      // Get transaction stats
      const transactionStats = await pool.query(
        `SELECT 
          type,
          COUNT(*) as count,
          SUM(amount) as total_amount
        FROM diamond_transactions 
        WHERE player_id = $1 AND timestamp >= NOW() - INTERVAL '30 days'
        GROUP BY type`,
        [playerId]
      );

      // Get inventory breakdown
      const inventoryBreakdown = await pool.query(
        `SELECT 
          diamond_type,
          clarity,
          cut,
          SUM(quantity) as total_quantity,
          SUM(value) as total_value,
          AVG(carat) as avg_carat
        FROM diamond_inventory 
        WHERE player_id = $1
        GROUP BY diamond_type, clarity, cut
        ORDER BY total_value DESC`,
        [playerId]
      );

      // Get mining efficiency
      const miningStats = await pool.query(
        `SELECT 
          DATE_TRUNC('day', mined_at) as date,
          COUNT(*) as mining_sessions,
          SUM(quantity) as total_mined,
          SUM(value) as total_value
        FROM diamond_inventory 
        WHERE player_id = $1 AND mined_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE_TRUNC('day', mined_at)
        ORDER BY date DESC`,
        [playerId]
      );

      res.json({ 
        success: true, 
        data: {
          ecosystem: ecosystemResult.rows[0],
          transactionStats: transactionStats.rows,
          inventoryBreakdown: inventoryBreakdown.rows,
          miningStats: miningStats.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  return router;
}

// Helper functions
function calculateMiningResults(miningLevel: number) {
  const baseChance = {
    [DiamondType.COAL]: 0.4,
    [DiamondType.ROUGH_DIAMOND]: 0.3,
    [DiamondType.BRILLIANT]: 0.15,
    [DiamondType.PRINCESS]: 0.08,
    [DiamondType.EMERALD]: 0.04,
    [DiamondType.ASSCHER]: 0.02,
    [DiamondType.MARQUISE]: 0.008,
    [DiamondType.RADIANT]: 0.002
  };

  const random = Math.random();
  let cumulative = 0;
  let diamondType = DiamondType.COAL;

  for (const [type, chance] of Object.entries(baseChance)) {
    cumulative += chance * (1 + miningLevel * 0.1);
    if (random <= cumulative) {
      diamondType = type as DiamondType;
      break;
    }
  }

  const clarities = [DiamondClarity.INCLUDED, DiamondClarity.SLIGHTLY_INCLUDED, DiamondClarity.VERY_SLIGHTLY_INCLUDED];
  const cuts = [DiamondCut.POOR, DiamondCut.FAIR, DiamondCut.GOOD];

  return {
    type: diamondType,
    quantity: Math.floor(Math.random() * 3) + 1,
    clarity: clarities[Math.floor(Math.random() * clarities.length)],
    cut: cuts[Math.floor(Math.random() * cuts.length)],
    carat: Math.round((Math.random() * 2 + 0.5) * 10) / 10,
    value: Math.floor(Math.random() * 100) + 10
  };
}

function calculateDiamondRank(diamondsCollected: number): DiamondRank {
  if (diamondsCollected >= 5000) return DiamondRank.DIAMOND_LEGEND;
  if (diamondsCollected >= 2000) return DiamondRank.DIAMOND_BARON;
  if (diamondsCollected >= 1000) return DiamondRank.MASTER_CRAFTER;
  if (diamondsCollected >= 500) return DiamondRank.JEWELER;
  if (diamondsCollected >= 200) return DiamondRank.GEMOLOGIST;
  if (diamondsCollected >= 50) return DiamondRank.MINER;
  return DiamondRank.PROSPECTOR;
}

function isValidUpgrade(current: PremiumStatus, newStatus: PremiumStatus): boolean {
  const hierarchy = [
    PremiumStatus.NONE,
    PremiumStatus.BRONZE,
    PremiumStatus.SILVER,
    PremiumStatus.GOLD,
    PremiumStatus.PLATINUM,
    PremiumStatus.DIAMOND,
    PremiumStatus.VIP
  ];

  const currentIndex = hierarchy.indexOf(current);
  const newIndex = hierarchy.indexOf(newStatus);

  return newIndex === currentIndex + 1;
}

function calculatePremiumUpgradeCost(status: PremiumStatus): number {
  const costs = {
    [PremiumStatus.BRONZE]: 100,
    [PremiumStatus.SILVER]: 250,
    [PremiumStatus.GOLD]: 500,
    [PremiumStatus.PLATINUM]: 1000,
    [PremiumStatus.DIAMOND]: 2500,
    [PremiumStatus.VIP]: 5000
  };

  return costs[status] || 0;
}
