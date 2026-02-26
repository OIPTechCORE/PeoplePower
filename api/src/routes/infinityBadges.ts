import { Router, Request, Response } from 'express';
import { Pool } from 'pg';

export function createInfinityBadgesRoutes(pool: Pool): Router {
  const router = Router();

  // ==================== INFINITY BADGES CORE SYSTEM ====================
  
  // Get all badge categories
  router.get('/infinity-badges/categories', async (req: Request, res: Response) => {
    try {
      const query = `
        SELECT 
          badge_category,
          COUNT(*) as total_badges,
          JSON_AGG(DISTINCT badge_rarity) as rarity_distribution,
          AVG(economic_multiplier) as avg_multiplier,
          AVG(governance_power) as avg_governance_power
        FROM infinity_badges
        WHERE is_active = true
        GROUP BY badge_category
        ORDER BY badge_category
      `;
      const result = await pool.query(query);
      
      res.json({ 
        success: true, 
        data: result.rows
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get badges by category
  router.get('/infinity-badges/category/:category', async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      
      const query = `
        SELECT 
          badge_id,
          badge_name,
          badge_rarity,
          economic_multiplier,
          governance_power,
          requirements,
          visual_effects,
          created_at
        FROM infinity_badges
        WHERE badge_category = $1 AND is_active = true
        ORDER BY badge_rarity DESC, badge_name ASC
      `;
      const result = await pool.query(query, [category]);
      
      res.json({ 
        success: true, 
        data: result.rows
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get user's badge ownership
  router.get('/infinity-badges/user/:userId/badges', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      
      const query = `
        SELECT 
          pbo.*,
          ib.badge_id,
          ib.badge_name,
          ib.badge_rarity,
          ib.economic_multiplier,
          ib.governance_power,
          pbo.progress_percentage,
          pbo.earned_date,
          pbo.last_used,
          bve.visual_state
        FROM player_badge_ownership pbo
        JOIN infinity_badges ib ON pbo.badge_id = ib.badge_id
        LEFT JOIN badge_visual_evolution bve ON pbo.user_id = bve.user_id AND pbo.badge_id = bve.badge_id
        WHERE pbo.user_id = $1
        ORDER BY ib.economic_multiplier DESC, pbo.earned_date DESC
      `;
      const result = await pool.query(query, [userId]);
      
      res.json({ 
        success: true, 
        data: result.rows
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get user's badge economic power
  router.get('/infinity-badges/user/:userId/economic-power', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      
      const query = `
        SELECT 
          SUM(bep.economic_power) as total_economic_power,
          COUNT(*) as total_badges,
          AVG(bep.economic_power) as avg_economic_power,
          MAX(bep.economic_power) as max_economic_power,
          COUNT(CASE WHEN bep.economic_power >= 1000 THEN 1 END) as high_power_badges
        FROM player_badge_ownership pbo
        LEFT JOIN badge_economic_power bep ON pbo.badge_id = bep.badge_id AND pbo.user_id = bep.user_id
        WHERE pbo.user_id = $1
        GROUP BY pbo.user_id
      `;
      const result = await pool.query(query, [userId]);
      
      res.json({ 
        success: true, 
        data: result.rows[0] || {
          total_economic_power: 0,
          total_badges: 0,
          avg_economic_power: 0,
          max_economic_power: 0,
          high_power_badges: 0
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get user's governance power
  router.get('/infinity-badges/user/:userId/governance-power', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      
      const query = `
        SELECT 
          SUM(ib.governance_power) as total_governance_power,
          COUNT(*) as total_badges,
          AVG(ib.governance_power) as avg_governance_power,
          MAX(ib.governance_power) as max_governance_power,
          COUNT(CASE WHEN ib.governance_power >= 100 THEN 1 END) as high_power_badges
        FROM player_badge_ownership pbo
        JOIN infinity_badges ib ON pbo.badge_id = ib.badge_id
        WHERE pbo.user_id = $1
        GROUP BY pbo.user_id
      `;
      const result = await pool.query(query, [userId]);
      
      res.json({ 
        success: true, 
        data: result.rows[0] || {
          total_governance_power: 0,
          total_badges: 0,
          avg_governance_power: 0,
          max_governance_power: 0,
          high_power_badges: 0
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Upgrade badge level
  router.post('/infinity-badges/user/:userId/badges/:badgeId/upgrade', async (req: Request, res: Response) => {
    try {
      const { userId, badgeId } = req.params;
      const { requirements } = req.body;
      
      // Check if user has the badge
      const checkQuery = `
        SELECT * FROM player_badge_ownership pbo
        WHERE pbo.user_id = $1 AND pbo.badge_id = $2
      `;
      const checkResult = await pool.query(checkQuery, [userId, badgeId]);
      
      if (checkResult.rows.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Badge not found or not owned'
        });
      }
      
      // Check if user meets requirements
      const requirementsQuery = `
        SELECT * FROM infinity_badges WHERE badge_id = $1
      `;
      const requirementsResult = await pool.query(requirementsQuery, [badgeId]);
      
      const badgeRequirements = requirementsResult.rows[0];
      
      // Validate requirements
      const userStatsQuery = `
        SELECT 
          COUNT(*) as total_badges,
          SUM(pbo.progress_percentage) as total_progress,
          AVG(pbo.economic_power) as avg_economic_power,
          AVG(pbo.governance_power) as avg_governance_power
        FROM player_badge_ownership pbo
        WHERE pbo.user_id = $1
      `;
      const userStats = await pool.query(userStatsQuery, [userId]);
      
      const userStatsData = userStats.rows[0];
      
      // Check if user meets badge requirements
      const meetsRequirements = 
        userStatsData.total_badges >= badgeRequirements.minimum_badges &&
        userStatsData.total_progress >= badgeRequirements.minimum_progress &&
        userStatsData.avg_economic_power >= badgeRequirements.minimum_economic_power &&
        userStatsData.avg_governance_power >= badgeRequirements.minimum_governance_power;
      
      if (!meetsRequirements) {
        return res.status(400).json({ 
          success: false, 
          error: 'Requirements not met',
          requirements: badgeRequirements,
          currentStats: userStatsData
        });
      }
      
      // Helper function to calculate upgrade cost
      function calculateUpgradeCost(currentLevel: number, badge: any): number {
        const baseCost = 1000;
        const levelMultiplier = Math.pow(1.5, currentLevel);
        const rarityMultiplier = badge.badge_rarity === 'legendary' ? 2 : badge.badge_rarity === 'mythic' ? 3 : 1;
        return Math.floor(baseCost * levelMultiplier * rarityMultiplier);
      }

      // Calculate upgrade cost
      const upgradeCost = calculateUpgradeCost(checkResult.rows[0].badge_level, requirementsResult.rows[0]);
      
      // Process upgrade
      const upgradeQuery = `
        UPDATE player_badge_ownership 
        SET 
          badge_level = badge_level + 1,
          progress_percentage = 100,
          last_used = NOW(),
          updated_at = NOW()
        WHERE user_id = $1 AND badge_id = $2
        RETURNING *
      `;
      const upgradeResult = await pool.query(upgradeQuery, [userId, badgeId]);
      
      // Update economic power
      const economicPowerQuery = `
        INSERT INTO badge_economic_power (user_id, badge_id, economic_power, governance_power, daily_earnings, total_earnings, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        ON CONFLICT (user_id, badge_id) 
        DO UPDATE SET 
          economic_power = economic_power * 1.2,
          governance_power = governance_power * 1.15,
          updated_at = NOW()
        RETURNING *
      `;
      const economicPowerResult = await pool.query(economicPowerQuery, [
        userId, badgeId, 
        Math.floor(checkResult.rows[0].badge_level * 100 * 1.2),
        Math.floor(checkResult.rows[0].badge_level * 50 * 1.15),
        Math.floor(checkResult.rows[0].badge_level * 1000),
        Math.floor(checkResult.rows[0].badge_level * 10000)
      ]);
      
      // Update governance power (handled in economic power query above)
      const governancePowerResult = economicPowerResult;
      
      res.json({ 
        success: true, 
        data: {
          upgradeResult: upgradeResult.rows[0],
          economicPowerResult: economicPowerResult.rows[0],
          governancePowerResult: governancePowerResult.rows[0],
          upgradeCost,
          newBadgeLevel: upgradeResult.rows[0].badge_level,
          requirementsMet: true
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Create new badge (admin only)
  router.post('/infinity-badges/create', async (req: Request, res: Response) => {
    try {
      const { 
        badgeName, badgeCategory, badgeRarity, economicMultiplier, governancePower,
        requirements, visualEffects
      } = req.body;
      
      // Create new badge
      const createQuery = `
        INSERT INTO infinity_badges 
        (badge_id, badge_name, badge_category, badge_rarity, economic_multiplier, governance_power, requirements, visual_effects, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      const result = await pool.query(createQuery, [
        badgeName, badgeCategory, badgeRarity, economicMultiplier, governancePower, 
        JSON.stringify(requirements), JSON.stringify(visualEffects)
      ]);
      
      res.json({ 
        success: true, 
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get badge evolution history
  router.get('/infinity-badges/user/:userId/evolution/:badgeId', async (req: Request, res: Response) => {
    try {
      const { userId, badgeId } = req.params;
      
      const query = `
        SELECT * FROM badge_visual_evolution 
        WHERE user_id = $1 AND badge_id = $2
        ORDER BY evolution_count DESC, last_evolution DESC
      `;
      const result = await pool.query(query, [userId, badgeId]);
      
      res.json({ 
        success: true, 
        data: result.rows
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get badge economic analytics
  router.get('/infinity-badges/analytics/economic', async (req: Request, res: Response) => {
    try {
      const { days = 30 } = req.query;
      
      const query = `
        SELECT 
          DATE_TRUNC('day', created_at) as date,
          COUNT(*) as badges_issued,
          SUM(be.economic_power) as total_economic_power,
          AVG(be.economic_power) as avg_economic_power,
          COUNT(CASE WHEN be.economic_power >= 1000 THEN 1 END) as high_power_badges,
          COUNT(CASE WHEN be.economic_power >= 500 THEN 1 END) mid_power_badges,
          COUNT(CASE WHEN be.economic_power >= 100 THEN 1 END) low_power_badges
        FROM player_badge_ownership pbo
        JOIN infinity_badges ib ON pbo.badge_id = ib.badge_id
        WHERE pbo.user_id = ANY(SELECT user_id FROM player_badge_ownership WHERE user_id = ANY(SELECT user_id FROM global_user_index WHERE status = 'active')
          AND created_at >= CURRENT_DATE - INTERVAL '${days} days'
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY date DESC
      `;
      const result = await pool.query(query);
      
      res.json({ 
        success: true, 
        data: result.rows
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get governance analytics
  router.get('/infinity-badges/analytics/governance', async (req: Request, res: Response) => {
    try {
      const { days = 30 } = req.query;
      
      const query = `
        SELECT 
          DATE_TRUNC('day', created_at) as date,
          COUNT(*) as badges_issued,
          SUM(bg.governance_power) as total_governance_power,
          AVG(bg.governance_power) as avg_governance_power,
          COUNT(CASE WHEN bg.governance_power >= 1000 THEN 1 END) as high_power_badges,
          COUNT(CASE WHEN bg.governance_power >= 500 THEN 1 END) mid_power_badges,
          COUNT(CASE WHEN bg.governance_power >= 100 THEN 1 END) low_power_badges
        FROM player_badge_ownership pbo
        JOIN infinity_badges ib ON pbo.badge_id = ib.badge_id
        WHERE pbo.user_id = ANY(SELECT user_id FROM global_user_index WHERE status = 'active')
          AND created_at >= CURRENT_DATE - INTERVAL '${days} days'
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY date DESC
      `;
      const result = await pool.query(query);
      
      res.json({ 
        success: true, 
        data: result.rows
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get social validation analytics
  router.get('/infinity-badges/analytics/social', async (req: Request, res: Response) => {
    try {
      const { days = 30 } = req.query;
      
      const query = `
        SELECT 
          DATE_TRUNC('day', created_at) as date,
          COUNT(*) as badges_issued,
          COUNT(DISTINCT user_id) as active_users_with_badges,
          COUNT(DISTINCT user_id) as total_users_with_badges,
          AVG(social_validation_weight) as avg_validation_weight,
          COUNT(CASE WHEN social_validation_weight >= 0.8 THEN 1 END) high_validation_users,
          COUNT(DISTINCT user_id) as social_validated_users
        FROM player_badge_ownership pbo
        JOIN infinity_badges ib ON pbo.badge_id = ib.badge_id
        WHERE pbo.user_id = ANY(SELECT user_id FROM global_user_index WHERE status = 'active')
          AND created_at >= CURRENT_DATE - INTERVAL '${days} days'
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY date DESC
      `;
      const result = await pool.query(query);
      
      res.json({ 
        success: true, 
        data: result.rows
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get anti-exploit analytics
  router.get('/infinity-badges/analytics/anti-exploit', async (req: Request, res: Response) => {
    try {
      const { days = 30 } = req.query;
      
      const query = `
        SELECT 
          DATE_TRUNC('day', created_at) as date,
          COUNT(*) as suspicious_activities_detected,
          COUNT(DISTINCT user_id) as suspicious_users,
          COUNT(DISTINCT user_id) as potential_collusion_rings,
          COUNT(DISTINCT user_id) as bot_accounts_detected,
          COUNT(DISTINCT user_id) as fake_accounts_detected,
          COUNT(DISTINCT user_id) as rapid_growth_users,
          COUNT(DISTINCT user_id) as network_anomalies_detected,
          COUNT(DISTINCT user_id) as social_manipulation_detected
        FROM player_badge_ownership pbo
        JOIN infinity_badges ib ON pbo.badge_id = ib.badge_id
        WHERE pbo.user_id = ANY(SELECT user_id FROM global_user_index WHERE status = 'active')
          AND created_at >= CURRENT_DATE - INTERVAL '${days} days'
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY date DESC
      `;
      const result = await pool.query(query);
      
      res.json({ 
        success: true, 
        data: result.rows
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get capacity planning
  router.get('/infinity-badges/capacity-planning', async (req: Request, res: Response) => {
    try {
      const { urgencyLevel } = req.query;
      
      const query = `
        SELECT 
          service_name,
          current_capacity,
          projected_capacity,
          required_capacity,
          urgency_level,
          estimated_cost,
          timeline_months,
          action_required,
          created_at
        FROM global_capacity_planning
        WHERE urgency_level = $1
        ORDER BY urgency_level DESC, required_capacity DESC
      `;
      const result = await pool.query(query, [urgencyLevel]);
      
      res.json({ 
        success: true, 
        data: result.rows
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get dashboard summary
  router.get('/infinity-badges/dashboard', async (req: Request, res: Response) => {
    try {
      // Get global badge statistics
      const globalStatsQuery = `
        SELECT 
          COUNT(*) as total_badges_issued,
          COUNT(DISTINCT user_id) as users_with_badges,
          COUNT(DISTINCT badge_category) as badge_categories,
          SUM(CASE WHEN badge_rarity = 'legendary' THEN 1 END) as legendary_badges,
          COUNT(CASE WHEN badge_rarity = 'transcendent' THEN 1 END) as transcendent_badges,
          AVG(be.economic_multiplier) as avg_multiplier,
          AVG(bg.governance_power) as avg_governance_power
        FROM player_badge_ownership pbo
        JOIN infinity_badges ib ON pbo.badge_id = ib.badge_id
        WHERE pbo.user_id = ANY(SELECT user_id FROM global_user_index WHERE status = 'active')
      `;
      const globalStatsResult = await pool.query(globalStatsQuery);
      
      // Get economic analytics
      const economicQuery = `
        SELECT 
          DATE_TRUNC('day', created_at) as date,
          COUNT(*) as badges_issued,
          SUM(be.economic_power) as total_economic_power,
          AVG(be.economic_power) as avg_economic_power,
          COUNT(CASE WHEN be.economic_power >= 1000 THEN 1 END) as high_power_badges,
          COUNT(CASE WHEN be.economic_power >= 500 THEN 1 END) mid_power_badges,
          COUNT(CASE WHEN be.economic_power >= 100 THEN 1 END) low_power_badges
        FROM player_badge_ownership pbo
        JOIN infinity_badges ib ON pbo.badge_id = ib.badge_id
        WHERE pbo.user_id = ANY(SELECT user_id FROM global_user_index WHERE status = 'active')
          AND created_at >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY date DESC
      `;
      const economicResult = await pool.query(economicQuery);
      
      // Get governance analytics
      const governanceQuery = `
        SELECT 
          DATE_TRUNC('day', created_at) as date,
          COUNT(*) as governance_participants,
          SUM(bg.governance_power) as total_governance_power,
          AVG(bg.governance_power) as avg_governance_power,
          COUNT(CASE WHEN bg.governance_power >= 1000 THEN 1 END) as high_power_users,
          COUNT(CASE WHEN bg.governance_power >= 500 THEN 1 END) mid_power_users,
          COUNT(CASE WHEN bg.governance_power >= 100 THEN 1 END) low_power_users
        FROM player_badge_ownership pbo
        JOIN infinity_badges ib ON pbo.badge_id = ib.badge_id
        WHERE pbo.user_id = ANY(SELECT user_id FROM global_user_index WHERE status = 'active')
          AND created_at >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY date DESC
      `;
      const governanceResult = await pool.query(governanceQuery);
      
      // Get social validation analytics
      const socialQuery = `
        SELECT 
          DATE_TRUNC('day', created_at) as date,
          COUNT(DISTINCT user_id) as active_users_with_badges,
          COUNT(DISTINCT user_id) as social_validated_users,
          COUNT(DISTINCT user_id) as high_validation_users,
          COUNT(DISTINCT user_id) as suspicious_users,
          COUNT(DISTINCT user_id) as bot_accounts_detected,
          COUNT(DISTINCT user_id) as fake_accounts_detected,
          COUNT(DISTINCT user_id) as network_anomalies_detected,
          COUNT(DISTINCT user_id) as social_manipulation_detected
        FROM player_badge_ownership pbo
        JOIN infinity_badges ib ON pbo.badge_id = ib.badge_id
        WHERE pbo.user_id = ANY(SELECT user_id FROM global_user_index WHERE status = 'active')
          AND created_at >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY date DESC
      `;
      const socialResult = await pool.query(socialQuery);
      
      res.json({ 
        success: true, 
        data: {
          globalStats: globalStatsResult.rows[0] || {
            total_badges_issued: 0,
            users_with_badges: 0,
            badge_categories: 0,
            legendary_badges: 0,
            transcendent_badges: 0,
            avg_multiplier: 0,
            avg_governance_power: 0
          },
          economicMetrics: economicResult.rows[0] || {
            badges_issued: 0,
            total_economic_power: 0,
            avg_economic_power: 0,
            high_power_badges: 0,
            mid_power_badges: 0,
            low_power_badges: 0
          },
          governanceMetrics: governanceResult.rows[0] || {
            governance_participants: 0,
            total_governance_power: 0,
            avg_governance_power: 0,
            high_power_users: 0,
            mid_power_users: 0,
            low_power_users: 0
          },
          socialMetrics: socialResult.rows[0] || {
            active_users_with_badges: 0,
            social_validated_users: 0,
            high_validation_users: 0,
            suspicious_users: 0,
            bot_accounts_detected: 0,
            fake_accounts_detected: 0,
            network_anomalies_detected: 0,
            social_manipulation_detected: 0
          }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  return router;
}
