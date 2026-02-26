import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { 
  InfinityBadgeSystem,
  BadgeCategory,
  EvolutionLevel,
  BadgeEvolutionEngine,
  LivingBadgeSystem,
  InfinityItemSystem,
  InfinityLeadershipBadge,
  InfinityOrganizerBadge,
  InfinityRankBadge,
  InfinityProfileBadge,
  InfinityUniversalBadge,
  InfinityItem,
  BadgeType,
  BadgeRarity,
  UpgradeType,
  AnimationType,
  ParticleType,
  GlowType,
  EvolutionStageType,
  ItemType,
  ItemRarity,
  PlayerBehavior,
  RequirementType,
  EffectType,
  DesignStyle
} from '../../../shared/types/infinity-badge-system';

export function createInfinityBadgeRoutes(pool: Pool): Router {
  const router = Router();

  // ==================== INFINITY BADGE SYSTEM OVERVIEW ====================
  
  // Get complete badge system overview
  router.get('/system', async (req: Request, res: Response) => {
    try {
      const result = await pool.query(
        'SELECT * FROM infinity_badge_system WHERE id = $1',
        ['main-system']
      );

      // Get badge categories
      const categoriesResult = await pool.query(
        'SELECT * FROM badge_categories WHERE system_id = $1 ORDER BY type, name',
        ['main-system']
      );

      // Get evolution engine
      const evolutionResult = await pool.query(
        'SELECT * FROM badge_evolution_engine WHERE system_id = $1',
        ['main-system']
      );

      // Get living badge system
      const livingResult = await pool.query(
        'SELECT * FROM living_badge_system WHERE system_id = $1',
        ['main-system']
      );

      res.json({ 
        success: true, 
        data: {
          system: result.rows[0],
          categories: categoriesResult.rows,
          evolutionEngine: evolutionResult.rows[0],
          livingBadgeSystem: livingResult.rows[0]
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== LEADERSHIP BADGES ====================
  
  // Get leadership badges
  router.get('/leadership', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.query;
      
      // Get leadership badge category
      const categoryResult = await pool.query(
        'SELECT * FROM badge_categories WHERE type = $1 AND system_id = $2',
        [BadgeType.LEADERSHIP, 'main-system']
      );

      // Get player's leadership badges
      const playerBadgesResult = await pool.query(
        `SELECT 
          pb.*,
          el.name as level_name,
          el.description as level_description,
          el.prestige_value
        FROM player_badges pb
        JOIN evolution_levels el ON pb.current_level = el.id
        WHERE pb.player_id = $1 AND pb.category_id = $2
        ORDER BY el.prestige_value DESC`,
        [playerId, categoryResult.rows[0]?.id]
      );

      // Get available evolution levels
      const levelsResult = await pool.query(
        'SELECT * FROM evolution_levels WHERE category_id = $1 ORDER BY level ASC',
        [categoryResult.rows[0]?.id]
      );

      res.json({ 
        success: true, 
        data: {
          category: categoryResult.rows[0],
          playerBadges: playerBadgesResult.rows,
          availableLevels: levelsResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Unlock leadership badge
  router.post('/leadership/unlock', async (req: Request, res: Response) => {
    try {
      const { playerId, levelId, requirements } = req.body;

      // Verify requirements
      const requirementsMet = await verifyBadgeRequirements(playerId, requirements, pool);

      if (!requirementsMet.met) {
        return res.status(400).json({ 
          success: false, 
          error: 'Requirements not met',
          missing: requirementsMet.missing
        });
      }

      // Get level details
      const levelResult = await pool.query(
        'SELECT * FROM evolution_levels WHERE id = $1',
        [levelId]
      );

      if (levelResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Level not found' });
      }

      const level = levelResult.rows[0];

      // Create player badge
      const badgeResult = await pool.query(
        `INSERT INTO player_badges (
          player_id, category_id, current_level, unlocked_at, visual_upgrades, animation_upgrades, particle_upgrades, glow_upgrades
        ) VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7) 
        RETURNING *`,
        [
          playerId,
          level.category_id,
          levelId,
          JSON.stringify(level.visual_upgrades),
          JSON.stringify(level.animation_upgrades),
          JSON.stringify(level.particle_upgrades),
          JSON.stringify(level.glow_upgrades)
        ]
      );

      // Update player prestige
      await updatePlayerPrestige(playerId, level.prestige_value, pool);

      res.json({ success: true, data: badgeResult.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== ORGANIZER BADGES ====================
  
  // Get organizer badges
  router.get('/organizer', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.query;
      
      const result = await pool.query(
        `SELECT 
          pb.*,
          el.name as level_name,
          el.description as level_description,
          el.prestige_value
        FROM player_badges pb
        JOIN evolution_levels el ON pb.current_level = el.id
        JOIN badge_categories bc ON pb.category_id = bc.id
        WHERE pb.player_id = $1 AND bc.type = $2
        ORDER BY el.prestige_value DESC`,
        [playerId, BadgeType.ORGANIZER]
      );

      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== RANK BADGES ====================
  
  // Get rank badges
  router.get('/ranks', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.query;
      
      // Get player's current rank
      const rankResult = await pool.query(
        `SELECT 
          pb.*,
          el.name as rank_name,
          el.description as rank_description,
          el.prestige_value,
          el.level as rank_level
        FROM player_badges pb
        JOIN evolution_levels el ON pb.current_level = el.id
        JOIN badge_categories bc ON pb.category_id = bc.id
        WHERE pb.player_id = $1 AND bc.type = $2
        ORDER BY el.level DESC
        LIMIT 1`,
        [playerId, BadgeType.RANK]
      );

      // Get next rank requirements
      const nextRankResult = await pool.query(
        `SELECT 
          el.*
        FROM evolution_levels el
        JOIN badge_categories bc ON el.category_id = bc.id
        WHERE bc.type = $1 AND el.level = (
          SELECT COALESCE(MAX(el2.level), 0) + 1
          FROM player_badges pb
          JOIN evolution_levels el2 ON pb.current_level = el2.id
          JOIN badge_categories bc2 ON el2.category_id = bc2.id
          WHERE pb.player_id = $2 AND bc2.type = $1
        )
        LIMIT 1`,
        [BadgeType.RANK, playerId]
      );

      // Get rank progress
      const progressResult = await pool.query(
        'SELECT * FROM rank_progress WHERE player_id = $1',
        [playerId]
      );

      res.json({ 
        success: true, 
        data: {
          currentRank: rankResult.rows[0],
          nextRank: nextRankResult.rows[0],
          progress: progressResult.rows[0]
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Update rank progress
  router.post('/ranks/progress', async (req: Request, res: Response) => {
    try {
      const { playerId, activityType, amount } = req.body;

      // Get current rank progress
      const progressResult = await pool.query(
        'SELECT * FROM rank_progress WHERE player_id = $1',
        [playerId]
      );

      let progress = progressResult.rows[0] || {
        player_id: playerId,
        experience: 0,
        contributions: 0,
        social_impact: 0,
        leadership_points: 0,
        economic_activity: 0
      };

      // Update progress based on activity type
      switch (activityType) {
        case 'experience':
          progress.experience += amount;
          break;
        case 'contributions':
          progress.contributions += amount;
          break;
        case 'social_impact':
          progress.social_impact += amount;
          break;
        case 'leadership':
          progress.leadership_points += amount;
          break;
        case 'economic':
          progress.economic_activity += amount;
          break;
      }

      // Save progress
      await pool.query(
        `INSERT INTO rank_progress (
          player_id, experience, contributions, social_impact, leadership_points, economic_activity, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
        ON CONFLICT (player_id) DO UPDATE SET
          experience = EXCLUDED.experience,
          contributions = EXCLUDED.contributions,
          social_impact = EXCLUDED.social_impact,
          leadership_points = EXCLUDED.leadership_points,
          economic_activity = EXCLUDED.economic_activity,
          updated_at = NOW()`,
        [
          playerId,
          progress.experience,
          progress.contributions,
          progress.social_impact,
          progress.leadership_points,
          progress.economic_activity
        ]
      );

      // Check for rank upgrade
      const upgradeCheck = await checkRankUpgrade(playerId, pool);

      res.json({ 
        success: true, 
        data: {
          progress,
          rankUpgrade: upgradeCheck
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== PROFILE BADGES ====================
  
  // Get profile badges
  router.get('/profile', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.query;
      
      const result = await pool.query(
        `SELECT 
          pb.*,
          bc.name as category_name,
          bc.description as category_description
        FROM player_badges pb
        JOIN badge_categories bc ON pb.category_id = bc.id
        WHERE pb.player_id = $1 AND bc.type = $2
        ORDER BY pb.unlocked_at DESC`,
        [playerId, BadgeType.PROFILE]
      );

      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Award profile badge
  router.post('/profile/award', async (req: Request, res: Response) => {
    try {
      const { playerId, badgeType, reason } = req.body;

      // Get profile badge category
      const categoryResult = await pool.query(
        'SELECT * FROM badge_categories WHERE type = $1 AND system_id = $2',
        [BadgeType.PROFILE, 'main-system']
      );

      // Create profile badge
      const result = await pool.query(
        `INSERT INTO player_badges (
          player_id, category_id, current_level, unlocked_at, metadata
        ) VALUES ($1, $2, $3, NOW(), $4) 
        RETURNING *`,
        [playerId, categoryResult.rows[0]?.id, 'profile_badge', JSON.stringify({ reason, badgeType })]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== UNIVERSAL BADGES ====================
  
  // Get universal badges
  router.get('/universal', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.query;
      
      // Get player's universal badges
      const result = await pool.query(
        `SELECT 
          pb.*,
          bc.name as category_name,
          el.name as achievement_name,
          el.description as achievement_description
        FROM player_badges pb
        JOIN badge_categories bc ON pb.category_id = bc.id
        LEFT JOIN evolution_levels el ON pb.current_level = el.id
        WHERE pb.player_id = $1 AND bc.type = $2
        ORDER BY pb.unlocked_at DESC`,
        [playerId, BadgeType.UNIVERSAL]
      );

      // Get available universal achievements
      const availableResult = await pool.query(
        `SELECT 
          el.*,
          bc.name as category_name
        FROM evolution_levels el
        JOIN badge_categories bc ON el.category_id = bc.id
        WHERE bc.type = $1
        ORDER BY el.level ASC`,
        [BadgeType.UNIVERSAL]
      );

      res.json({ 
        success: true, 
        data: {
          playerBadges: result.rows,
          availableAchievements: availableResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== INFINITY ITEMS ====================
  
  // Get infinity items
  router.get('/items', async (req: Request, res: Response) => {
    try {
      const { playerId, category } = req.query;
      
      let query = `
        SELECT 
          pi.*,
          ii.name as item_name,
          ii.description as item_description,
          ii.type as item_type,
          ii.rarity as item_rarity,
          ii.effects as item_effects
        FROM player_items pi
        JOIN infinity_items ii ON pi.item_id = ii.id
        WHERE pi.player_id = $1
      `;
      const params: any[] = [playerId];

      if (category) {
        query += ' AND ii.type = $' + (params.length + 1);
        params.push(category);
      }

      query += ' ORDER BY pi.acquired_at DESC';

      const result = await pool.query(query, params);

      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Craft infinity item
  router.post('/items/craft', async (req: Request, res: Response) => {
    try {
      const { playerId, itemId, materials } = req.body;

      // Verify crafting requirements
      const canCraft = await verifyCraftingRequirements(playerId, itemId, materials, pool);

      if (!canCraft.canCraft) {
        return res.status(400).json({ 
          success: false, 
          error: 'Crafting requirements not met',
          missing: canCraft.missing
        });
      }

      // Get item details
      const itemResult = await pool.query(
        'SELECT * FROM infinity_items WHERE id = $1',
        [itemId]
      );

      if (itemResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Item not found' });
      }

      const item = itemResult.rows[0];

      // Consume materials
      await consumeCraftingMaterials(playerId, materials, pool);

      // Create player item
      const result = await pool.query(
        `INSERT INTO player_items (
          player_id, item_id, acquired_at, metadata, active
        ) VALUES ($1, $2, NOW(), $3, true) 
        RETURNING *`,
        [playerId, itemId, JSON.stringify({ crafted: true, materials })]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== LIVING BADGE SYSTEM ====================
  
  // Get living badge status
  router.get('/living-status', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.query;
      
      // Get player's behavior tracking
      const behaviorResult = await pool.query(
        'SELECT * FROM player_behavior_tracking WHERE player_id = $1 ORDER BY tracked_at DESC LIMIT 50',
        [playerId]
      );

      // Get badge adaptations
      const adaptationResult = await pool.query(
        'SELECT * FROM badge_adaptations WHERE player_id = $1 ORDER BY adapted_at DESC LIMIT 20',
        [playerId]
      );

      // Get visual feedback
      const feedbackResult = await pool.query(
        'SELECT * FROM badge_visual_feedback WHERE player_id = $1 ORDER BY feedback_at DESC LIMIT 30',
        [playerId]
      );

      res.json({ 
        success: true, 
        data: {
          behaviorTracking: behaviorResult.rows,
          adaptations: adaptationResult.rows,
          visualFeedback: feedbackResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Track player behavior for living badges
  router.post('/living/track-behavior', async (req: Request, res: Response) => {
    try {
      const { playerId, behavior, intensity, context } = req.body;

      // Record behavior
      const result = await pool.query(
        `INSERT INTO player_behavior_tracking (
          player_id, behavior, intensity, context, tracked_at
        ) VALUES ($1, $2, $3, $4, NOW()) 
        RETURNING *`,
        [playerId, behavior, intensity, JSON.stringify(context)]
      );

      // Check for badge adaptations
      const adaptations = await checkBadgeAdaptations(playerId, behavior, intensity, pool);

      res.json({ 
        success: true, 
        data: {
          behaviorTracking: result.rows[0],
          adaptations
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== BADGE EVOLUTION ====================
  
  // Get badge evolution status
  router.get('/evolution', async (req: Request, res: Response) => {
    try {
      const { playerId, badgeId } = req.query;
      
      // Get badge evolution progress
      const progressResult = await pool.query(
        'SELECT * FROM badge_evolution_progress WHERE player_id = $1 AND badge_id = $2',
        [playerId, badgeId]
      );

      // Get available evolution stages
      const stagesResult = await pool.query(
        'SELECT * FROM evolution_stages WHERE badge_id = $1 ORDER BY stage ASC',
        [badgeId]
      );

      res.json({ 
        success: true, 
        data: {
          progress: progressResult.rows[0],
          availableStages: stagesResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Evolve badge
  router.post('/evolution/evolve', async (req: Request, res: Response) => {
    try {
      const { playerId, badgeId, stageId } = req.body;

      // Get evolution stage details
      const stageResult = await pool.query(
        'SELECT * FROM evolution_stages WHERE id = $1',
        [stageId]
      );

      if (stageResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Evolution stage not found' });
      }

      const stage = stageResult.rows[0];

      // Verify evolution requirements
      const canEvolve = await verifyEvolutionRequirements(playerId, badgeId, stage, pool);

      if (!canEvolve.canEvolve) {
        return res.status(400).json({ 
          success: false, 
          error: 'Evolution requirements not met',
          missing: canEvolve.missing
        });
      }

      // Evolve badge
      const result = await pool.query(
        `UPDATE player_badges SET 
          current_evolution_stage = $1,
          visual_upgrades = visual_upgrades || $2,
          animation_upgrades = animation_upgrades || $3,
          particle_upgrades = particle_upgrades || $4,
          glow_upgrades = glow_upgrades || $5,
          evolved_at = NOW()
        WHERE player_id = $6 AND id = $7
        RETURNING *`,
        [
          stageId,
          JSON.stringify(stage.visual_transformation),
          JSON.stringify(stage.animation_transformation),
          JSON.stringify(stage.particle_transformation),
          JSON.stringify(stage.glow_transformation),
          playerId,
          badgeId
        ]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== ANALYTICS & INSIGHTS ====================
  
  // Get badge system analytics
  router.get('/analytics', async (req: Request, res: Response) => {
    try {
      const { period = '30d' } = req.query;
      
      // Get badge acquisition trends
      const acquisitionResult = await pool.query(
        `SELECT 
          DATE_TRUNC('day', unlocked_at) as date,
          COUNT(*) as badges_unlocked,
          bc.type as badge_type
        FROM player_badges pb
        JOIN badge_categories bc ON pb.category_id = bc.id
        WHERE pb.unlocked_at > NOW() - INTERVAL $1
        GROUP BY DATE_TRUNC('day', unlocked_at), bc.type
        ORDER BY date DESC`,
        [period]
      );

      // Get evolution trends
      const evolutionResult = await pool.query(
        `SELECT 
          DATE_TRUNC('day', evolved_at) as date,
          COUNT(*) as evolutions,
          bc.type as badge_type
        FROM player_badges pb
        JOIN badge_categories bc ON pb.category_id = bc.id
        WHERE pb.evolved_at > NOW() - INTERVAL $1
        GROUP BY DATE_TRUNC('day', evolved_at), bc.type
        ORDER BY date DESC`,
        [period]
      );

      // Get behavior tracking trends
      const behaviorResult = await pool.query(
        `SELECT 
          behavior,
          COUNT(*) as occurrences,
          AVG(intensity) as avg_intensity
        FROM player_behavior_tracking
        WHERE tracked_at > NOW() - INTERVAL $1
        GROUP BY behavior
        ORDER BY occurrences DESC`,
        [period]
      );

      // Get item crafting trends
      const craftingResult = await pool.query(
        `SELECT 
          DATE_TRUNC('day', acquired_at) as date,
          COUNT(*) as items_crafted,
          ii.type as item_type
        FROM player_items pi
        JOIN infinity_items ii ON pi.item_id = ii.id
        WHERE pi.acquired_at > NOW() - INTERVAL $1
        GROUP BY DATE_TRUNC('day', acquired_at), ii.type
        ORDER BY date DESC`,
        [period]
      );

      res.json({ 
        success: true, 
        data: {
          badgeAcquisitions: acquisitionResult.rows,
          badgeEvolutions: evolutionResult.rows,
          behaviorTrends: behaviorResult.rows,
          itemCrafting: craftingResult.rows,
          period
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  return router;
}

// Helper functions
async function verifyBadgeRequirements(playerId: string, requirements: any[], pool: Pool): Promise<{ met: boolean; missing: string[] }> {
  try {
    const missing: string[] = [];

    for (const req of requirements) {
      switch (req.type) {
        case RequirementType.LEVEL:
          const playerLevel = await getPlayerLevel(playerId, pool);
          if (playerLevel < req.value) {
            missing.push(`Level ${req.value} required`);
          }
          break;
        case RequirementType.REPUTATION:
          const reputation = await getPlayerReputation(playerId, pool);
          if (reputation < req.value) {
            missing.push(`Reputation ${req.value} required`);
          }
          break;
        case RequirementType.CONTRIBUTION:
          const contributions = await getPlayerContributions(playerId, pool);
          if (contributions < req.value) {
            missing.push(`Contributions ${req.value} required`);
          }
          break;
        case RequirementType.TIME:
          const timeInSystem = await getTimeInSystem(playerId, pool);
          if (timeInSystem < req.value) {
            missing.push(`Time in system ${req.value} days required`);
          }
          break;
      }
    }

    return { met: missing.length === 0, missing };
  } catch (error) {
    console.error('Error verifying badge requirements:', error);
    return { met: false, missing: ['Error verifying requirements'] };
  }
}

async function updatePlayerPrestige(playerId: string, prestigeValue: number, pool: Pool): Promise<void> {
  try {
    await pool.query(
      `UPDATE player_prestige SET 
        total_prestige = total_prestige + $1,
        updated_at = NOW()
      WHERE player_id = $1`,
      [playerId, prestigeValue]
    );
  } catch (error) {
    console.error('Error updating player prestige:', error);
  }
}

async function checkRankUpgrade(playerId: string, pool: Pool): Promise<any> {
  try {
    // Get current rank progress
    const progressResult = await pool.query(
      'SELECT * FROM rank_progress WHERE player_id = $1',
      [playerId]
    );

    const progress = progressResult.rows[0];
    if (!progress) return null;

    // Get next rank requirements
    const nextRankResult = await pool.query(
      `SELECT 
        el.*
      FROM evolution_levels el
      JOIN badge_categories bc ON el.category_id = bc.id
      WHERE bc.type = $1 AND el.level = (
        SELECT COALESCE(MAX(el2.level), 0) + 1
        FROM player_badges pb
        JOIN evolution_levels el2 ON pb.current_level = el2.id
        JOIN badge_categories bc2 ON el2.category_id = bc2.id
        WHERE pb.player_id = $2 AND bc2.type = $1
      )
      LIMIT 1`,
      [BadgeType.RANK, playerId]
    );

    if (nextRankResult.rows.length === 0) return null;

    const nextRank = nextRankResult.rows[0];
    const requirements = nextRank.unlock_requirements;

    // Check if requirements are met
    const requirementsMet = await verifyBadgeRequirements(playerId, requirements, pool);

    if (requirementsMet.met) {
      // Auto-upgrade rank
      await pool.query(
        `INSERT INTO player_badges (
          player_id, category_id, current_level, unlocked_at, visual_upgrades, animation_upgrades, particle_upgrades, glow_upgrades
        ) VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7)`,
        [
          playerId,
          nextRank.category_id,
          nextRank.id,
          JSON.stringify(nextRank.visual_upgrades),
          JSON.stringify(nextRank.animation_upgrades),
          JSON.stringify(nextRank.particle_upgrades),
          JSON.stringify(nextRank.glow_upgrades)
        ]
      );

      return { upgraded: true, newRank: nextRank };
    }

    return { upgraded: false, nextRank, missing: requirementsMet.missing };
  } catch (error) {
    console.error('Error checking rank upgrade:', error);
    return null;
  }
}

async function verifyCraftingRequirements(playerId: string, itemId: string, materials: any[], pool: Pool): Promise<{ canCraft: boolean; missing: string[] }> {
  try {
    const missing: string[] = [];

    // Check if player has required materials
    for (const material of materials) {
      const hasMaterial = await checkPlayerMaterial(playerId, material.id, material.quantity, pool);
      if (!hasMaterial) {
        missing.push(`Material ${material.id} x${material.quantity} required`);
      }
    }

    return { canCraft: missing.length === 0, missing };
  } catch (error) {
    console.error('Error verifying crafting requirements:', error);
    return { canCraft: false, missing: ['Error verifying requirements'] };
  }
}

async function consumeCraftingMaterials(playerId: string, materials: any[], pool: Pool): Promise<void> {
  try {
    for (const material of materials) {
      await pool.query(
        `UPDATE player_materials SET 
          quantity = quantity - $1
        WHERE player_id = $2 AND material_id = $3`,
        [material.quantity, playerId, material.id]
      );
    }
  } catch (error) {
    console.error('Error consuming crafting materials:', error);
  }
}

async function checkBadgeAdaptations(playerId: string, behavior: PlayerBehavior, intensity: number, pool: Pool): Promise<any[]> {
  try {
    // Get adaptation rules for this behavior
    const rulesResult = await pool.query(
      'SELECT * FROM badge_adaptation_rules WHERE behavior = $1',
      [behavior]
    );

    const adaptations = [];

    for (const rule of rulesResult.rows) {
      if (intensity >= rule.threshold) {
        // Apply adaptation
        await pool.query(
          `INSERT INTO badge_adaptations (
            player_id, rule_id, adaptation_type, adaptation_value, adapted_at
          ) VALUES ($1, $2, $3, $4, NOW())`,
          [playerId, rule.id, rule.adaptation_type, rule.adaptation_value]
        );

        adaptations.push({
          ruleId: rule.id,
          adaptationType: rule.adaptation_type,
          adaptationValue: rule.adaptation_value
        });
      }
    }

    return adaptations;
  } catch (error) {
    console.error('Error checking badge adaptations:', error);
    return [];
  }
}

async function verifyEvolutionRequirements(playerId: string, badgeId: string, stage: any, pool: Pool): Promise<{ canEvolve: boolean; missing: string[] }> {
  try {
    const missing: string[] = [];

    for (const req of stage.requirements) {
      switch (req.type) {
        case RequirementType.LEVEL:
          const playerLevel = await getPlayerLevel(playerId, pool);
          if (playerLevel < req.value) {
            missing.push(`Level ${req.value} required`);
          }
          break;
        case RequirementType.ACHIEVEMENT:
          const hasAchievement = await checkPlayerAchievement(playerId, req.value, pool);
          if (!hasAchievement) {
            missing.push(`Achievement ${req.value} required`);
          }
          break;
        case RequirementType.TIME:
          const timeSinceEvolution = await getTimeSinceLastEvolution(playerId, badgeId, pool);
          if (timeSinceEvolution < req.value) {
            missing.push(`Time since last evolution ${req.value} days required`);
          }
          break;
      }
    }

    return { canEvolve: missing.length === 0, missing };
  } catch (error) {
    console.error('Error verifying evolution requirements:', error);
    return { canEvolve: false, missing: ['Error verifying requirements'] };
  }
}

// Additional helper functions
async function getPlayerLevel(playerId: string, pool: Pool): Promise<number> {
  const result = await pool.query('SELECT level FROM players WHERE id = $1', [playerId]);
  return result.rows[0]?.level || 0;
}

async function getPlayerReputation(playerId: string, pool: Pool): Promise<number> {
  const result = await pool.query('SELECT reputation_score FROM reputation_dna WHERE player_id = $1', [playerId]);
  return result.rows[0]?.reputation_score || 0;
}

async function getPlayerContributions(playerId: string, pool: Pool): Promise<number> {
  const result = await pool.query('SELECT COUNT(*) as count FROM contributions WHERE player_id = $1', [playerId]);
  return result.rows[0]?.count || 0;
}

async function getTimeInSystem(playerId: string, pool: Pool): Promise<number> {
  const result = await pool.query('SELECT EXTRACT(DAY FROM NOW() - created_at) as days FROM players WHERE id = $1', [playerId]);
  return result.rows[0]?.days || 0;
}

async function checkPlayerMaterial(playerId: string, materialId: string, quantity: number, pool: Pool): Promise<boolean> {
  const result = await pool.query(
    'SELECT quantity FROM player_materials WHERE player_id = $1 AND material_id = $2',
    [playerId, materialId]
  );
  return (result.rows[0]?.quantity || 0) >= quantity;
}

async function checkPlayerAchievement(playerId: string, achievementId: string, pool: Pool): Promise<boolean> {
  const result = await pool.query(
    'SELECT 1 FROM player_achievements WHERE player_id = $1 AND achievement_id = $2',
    [playerId, achievementId]
  );
  return result.rows.length > 0;
}

async function getTimeSinceLastEvolution(playerId: string, badgeId: string, pool: Pool): Promise<number> {
  const result = await pool.query(
    'SELECT EXTRACT(DAY FROM NOW() - evolved_at) as days FROM player_badges WHERE player_id = $1 AND id = $2',
    [playerId, badgeId]
  );
  return result.rows[0]?.days || 0;
}
