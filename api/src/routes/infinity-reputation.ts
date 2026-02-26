import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { 
  InfinityReputationEngine,
  ReputationLayer,
  ReputationPhysicsLayer,
  ReputationAIBrain,
  BadgeEconomicPower,
  GovernancePower,
  ReputationMarket,
  SoulboundCivilizationId,
  AntiExploitArchitecture,
  ReputationType,
  MeasurementMethod,
  DecayFunction,
  SocialValidation,
  BadgeCategory,
  MechanismType,
  Sustainability,
  LawPurpose,
  SimulationType,
  CrisisSeverity,
  AISubsystem,
  InterventionType,
  MarketType,
  ContributionType,
  TrustType,
  GovernanceType,
  SocialType,
  EconomicType,
  PowerType,
  RevenueType,
  AccessLevel,
  HealthTrend,
  TransactionType,
  SensorType,
  ModelType,
  OutputFormat
} from '../../../shared/types/infinity-reputation-engine';

export function createInfinityReputationRoutes(pool: Pool): Router {
  const router = Router();

  // ==================== INFINITY REPUTATION ENGINE OVERVIEW ====================
  
  // Get complete reputation engine overview
  router.get('/engine', async (req: Request, res: Response) => {
    try {
      const result = await pool.query(
        'SELECT * FROM infinity_reputation_engine WHERE id = $1',
        ['main-engine']
      );

      // Get reputation layers
      const layersResult = await pool.query(
        'SELECT * FROM reputation_layers WHERE engine_id = $1 ORDER BY weight DESC',
        ['main-engine']
      );

      // Get physics layer
      const physicsResult = await pool.query(
        'SELECT * FROM reputation_physics_layer WHERE engine_id = $1',
        ['main-engine']
      );

      // Get AI brain
      const aiBrainResult = await pool.query(
        'SELECT * FROM reputation_ai_brain WHERE engine_id = $1',
        ['main-engine']
      );

      res.json({ 
        success: true, 
        data: {
          engine: result.rows[0],
          reputationLayers: layersResult.rows,
          physicsLayer: physicsResult.rows[0],
          aiBrain: aiBrainResult.rows[0]
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== REPUTATION LAYERS ====================
  
  // Get player's multi-dimensional reputation
  router.get('/reputation/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      
      // Get player's reputation scores across all dimensions
      const reputationResult = await pool.query(
        `SELECT 
          pr.*,
          rl.name as layer_name,
          rl.type as layer_type,
          rl.description as layer_description
        FROM player_reputation pr
        JOIN reputation_layers rl ON pr.layer_id = rl.id
        WHERE pr.player_id = $1
        ORDER BY rl.weight DESC`,
        [playerId]
      );

      // Calculate effective reputation
      const effectiveRep = await calculateEffectiveReputation(playerId, pool);

      // Get reputation transactions
      const transactionsResult = await pool.query(
        'SELECT * FROM reputation_transactions WHERE player_id = $1 ORDER BY timestamp DESC LIMIT 50',
        [playerId]
      );

      // Get reputation stakes
      const stakesResult = await pool.query(
        'SELECT * FROM reputation_stakes WHERE staker_id = $1 OR stakee_id = $1',
        [playerId, playerId]
      );

      res.json({ 
        success: true, 
        data: {
          reputationScores: reputationResult.rows,
          effectiveReputation,
          recentTransactions: transactionsResult.rows,
          activeStakes: stakesResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Update reputation score
  router.post('/reputation/:playerId/update', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      const { layerType, amount, reason, metadata } = req.body;

      // Get layer details
      const layerResult = await pool.query(
        'SELECT * FROM reputation_layers WHERE type = $1',
        [layerType]
      );

      if (layerResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Reputation layer not found' });
      }

      const layer = layerResult.rows[0];

      // Apply reputation physics
      const physicsResult = await applyReputationPhysics(playerId, layer, amount, pool);

      if (!physicsResult.allowed) {
        return res.status(400).json({ 
          success: false, 
          error: 'Reputation physics violation',
          reason: physicsResult.reason
        });
      }

      // Create reputation transaction
      const transactionResult = await pool.query(
        `INSERT INTO reputation_transactions (
          player_id, type, amount, reason, timestamp, metadata, decay_rate, layer_id
        ) VALUES ($1, $2, $3, $4, NOW(), $5, $6, $7) 
        RETURNING *`,
        [
          playerId,
          TransactionType.EARNED,
          amount,
          reason,
          JSON.stringify(metadata),
          layer.decay_function === 'exponential' ? 0.01 : 0,
          layer.id
        ]
      );

      // Update player reputation
      await pool.query(
        `INSERT INTO player_reputation (
          player_id, layer_id, score, updated_at
        ) VALUES ($1, $2, $3, NOW())
        ON CONFLICT (player_id, layer_id) DO UPDATE SET
          score = player_reputation.score + $3,
          updated_at = NOW()`,
        [playerId, layer.id, amount]
      );

      // Check for badge upgrades
      const badgeUpgrades = await checkBadgeReputationUpgrades(playerId, pool);

      res.json({ 
        success: true, 
        data: {
          transaction: transactionResult.rows[0],
          badgeUpgrades
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== BADGE ECONOMIC POWER ====================
  
  // Get badge economic power for player
  router.get('/economic-power/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      
      // Get player's badges and their economic powers
      const result = await pool.query(
        `SELECT 
          pb.*,
          bep.unlocked_powers,
          bep.economic_multipliers,
          bep.earning_mechanics,
          bep.authority_levels
        FROM player_badges pb
        JOIN badge_economic_power bep ON pb.category_id = bep.id
        WHERE pb.player_id = $1 AND pb.active = true`,
        [playerId]
      );

      // Calculate total economic multiplier
      const totalMultiplier = await calculateTotalEconomicMultiplier(playerId, pool);

      // Get earning mechanics available
      const earningMechanics = await getAvailableEarningMechanics(playerId, pool);

      res.json({ 
        success: true, 
        data: {
          badgeEconomicPowers: result.rows,
          totalMultiplier,
          availableEarningMechanics: earningMechanics
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Calculate final earnings with multipliers
  router.post('/calculate-earnings', async (req: Request, res: Response) => {
    try {
      const { playerId, baseReward, activityType } = req.body;

      // Get player's reputation-based multiplier
      const multiplierResult = await pool.query(
        `SELECT 
          em.multiplier_formula,
          em.reputation_threshold,
          em.civilization_health_index
        FROM economic_multipliers em
        JOIN player_reputation pr ON em.reputation_threshold <= pr.score
        WHERE pr.player_id = $1
        ORDER BY em.reputation_threshold DESC
        LIMIT 1`,
        [playerId]
      );

      // Get civilization health index
      const healthResult = await pool.query(
        'SELECT * FROM civilization_health_index ORDER BY calculated_at DESC LIMIT 1',
        []
      );

      const civilizationHealth = healthResult.rows[0]?.overall || 1.0;
      const multiplier = multiplierResult.rows[0] || { multiplier_formula: '1.0', reputation_threshold: 0, civilization_health_index: 1.0 };

      // Calculate final reward
      const finalReward = calculateFinalReward(baseReward, multiplier, civilizationHealth);

      res.json({ 
        success: true, 
        data: {
          baseReward,
          multiplier: multiplier.multiplier_formula,
          civilizationHealth,
          finalReward
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== GOVERNANCE POWER ====================
  
  // Get governance power for player
  router.get('/governance-power/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      
      // Get player's governance reputation
      const governanceRepResult = await pool.query(
        `SELECT 
          pr.score,
          rl.weight
        FROM player_reputation pr
        JOIN reputation_layers rl ON pr.layer_id = rl.id
        WHERE pr.player_id = $1 AND rl.type = $2`,
        [playerId, ReputationType.GOVERNANCE]
      );

      // Calculate voting power
      const votingPower = await calculateVotingPower(playerId, pool);

      // Get governance rights
      const rightsResult = await pool.query(
        `SELECT 
          gr.*,
          al.required_reputation
        FROM governance_rights gr
        JOIN authority_levels al ON gr.authority_level_id = al.id
        WHERE al.required_reputation <= (
          SELECT COALESCE(pr.score, 0)
          FROM player_reputation pr
          JOIN reputation_layers rl ON pr.layer_id = rl.id
          WHERE pr.player_id = $1 AND rl.type = $2
        )`,
        [playerId, ReputationType.GOVERNANCE]
      );

      res.json({ 
        success: true, 
        data: {
          governanceReputation: governanceRepResult.rows[0],
          votingPower,
          governanceRights: rightsResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Submit governance vote with reputation weighting
  router.post('/governance/vote', async (req: Request, res: Response) => {
    try {
      const { playerId, proposalId, vote, reasoning } = req.body;

      // Calculate voting power
      const votingPower = await calculateVotingPower(playerId, pool);

      // Check anti-manipulation measures
      const antiManipulationCheck = await checkAntiManipulation(playerId, proposalId, pool);

      if (!antiManipulationCheck.allowed) {
        return res.status(400).json({ 
          success: false, 
          error: 'Anti-manipulation check failed',
          reason: antiManipulationCheck.reason
        });
      }

      // Record vote
      const result = await pool.query(
        `INSERT INTO governance_votes (
          player_id, proposal_id, vote, voting_power, reasoning, timestamp, metadata
        ) VALUES ($1, $2, $3, $4, $5, NOW(), $6) 
        RETURNING *`,
        [
          playerId,
          proposalId,
          vote,
          votingPower,
          reasoning,
          JSON.stringify({ antiManipulationCheck })
        ]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== REPUTATION MARKETS ====================
  
  // Get reputation market overview
  router.get('/markets', async (req: Request, res: Response) => {
    try {
      const { marketType } = req.query;
      
      let query = 'SELECT * FROM reputation_markets WHERE 1=1';
      const params: any[] = [];

      if (marketType) {
        query += ' AND market_type = $' + (params.length + 1);
        params.push(marketType);
      }

      query += ' ORDER BY created_at DESC';

      const result = await pool.query(query, params);

      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Create reputation stake
  router.post('/markets/stake', async (req: Request, res: Response) => {
    try {
      const { stakerId, stakeeId, amount, duration, conditions } = req.body;

      // Verify reputation availability
      const stakerRep = await getPlayerReputation(stakerId, ReputationType.ALL, pool);
      if (stakerRep < amount) {
        return res.status(400).json({ 
          success: false, 
          error: 'Insufficient reputation to stake' 
        });
      }

      // Lock reputation for staking
      await pool.query(
        `UPDATE player_reputation SET 
          score = score - $1,
          updated_at = NOW()
        WHERE player_id = $2 AND layer_id = (
          SELECT id FROM reputation_layers WHERE type = $3
        )`,
        [amount, stakerId, ReputationType.ALL]
      );

      // Create stake
      const result = await pool.query(
        `INSERT INTO reputation_stakes (
          staker_id, stakee_id, amount, duration, conditions, created_at, expires_at
        ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW() + INTERVAL '$6 days') 
        RETURNING *`,
        [stakerId, stakeeId, amount, duration, JSON.stringify(conditions), duration]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== SOULBOUND CIVILIZATION ID ====================
  
  // Get player's civilization ID
  router.get('/civilization-id/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      
      // Get civilization ID
      const result = await pool.query(
        `SELECT 
          sci.*,
          sc.name as civilization_name
        FROM soulbound_civilization_id sci
        JOIN soulbound_civilizations sc ON sci.civilization_id = sc.id
        WHERE sci.player_id = $1`,
        [playerId]
      );

      // Get identity components
      const identityResult = await pool.query(
        `SELECT 
          ic.*,
          ic.verified_at,
          ic.verification_method
        FROM identity_components ic
        WHERE ic.civilization_id = $1`,
        [result.rows[0]?.civilization_id]
      );

      // Get historical record
      const historyResult = await pool.query(
        `SELECT 
          hr.*,
          hr.importance,
          hr.verified
        FROM historical_records hr
        WHERE hr.civilization_id = $1
        ORDER BY hr.timestamp DESC LIMIT 50`,
        [result.rows[0]?.civilization_id]
      );

      res.json({ 
        success: true, 
        data: {
          civilizationId: result.rows[0],
          identityComponents: identityResult.rows,
          historicalRecord: historyResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== ANTI-EXPLOIT ARCHITECTURE ====================
  
  // Get anti-exploit status
  router.get('/anti-exploit', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.query;
      
      // Get behavior proof analysis
      const behaviorResult = await pool.query(
        `SELECT 
          bp.*,
          bp.risk_score,
          bp.confidence
        FROM behavior_proof bp
        WHERE bp.player_id = $1
        ORDER BY bp.analyzed_at DESC LIMIT 20`,
        [playerId]
      );

      // Get reputation cost analysis
      const costResult = await pool.query(
        `SELECT 
          rc.*,
          rc.current_cost,
          rc.risk_multiplier
        FROM reputation_costs rc
        WHERE rc.player_id = $1
        ORDER BY rc.calculated_at DESC LIMIT 10`,
        [playerId]
      );

      // Get anti-collusion analysis
      const collusionResult = await pool.query(
        `SELECT 
          ac.*,
          ac.cluster_risk,
          ac.anomaly_score
        FROM anti_collusion ac
        WHERE ac.player_id = $1
        ORDER BY ac.detected_at DESC LIMIT 10`,
        [playerId]
      );

      res.json({ 
        success: true, 
        data: {
          behaviorProof: behaviorResult.rows,
          reputationCosts: costResult.rows,
          antiCollusion: collusionResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== REPUTATION AI BRAIN ====================
  
  // Get AI brain status
  router.get('/ai-brain', async (req: Request, res: Response) => {
    try {
      const result = await pool.query(
        'SELECT * FROM reputation_ai_brain WHERE id = $1',
        ['main-ai-brain']
      );

      // Get current observations
      const observationsResult = await pool.query(
        'SELECT * FROM ai_observations WHERE brain_id = $1 ORDER BY observed_at DESC LIMIT 100',
        ['main-ai-brain']
      );

      // Get current predictions
      const predictionsResult = await pool.query(
        'SELECT * FROM ai_predictions WHERE brain_id = $1 ORDER BY predicted_at DESC LIMIT 50',
        ['main-ai-brain']
      );

      // Get recent interventions
      const interventionsResult = await pool.query(
        'SELECT * FROM ai_interventions WHERE brain_id = $1 ORDER BY intervened_at DESC LIMIT 20',
        ['main-ai-brain']
      );

      res.json({ 
        success: true, 
        data: {
          aiBrain: result.rows[0],
          observations: observationsResult.rows,
          predictions: predictionsResult.rows,
          interventions: interventionsResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Trigger AI intervention
  router.post('/ai-brain/intervene', async (req: Request, res: Response) => {
    try {
      const { interventionType, parameters, reasoning } = req.body;

      // Get AI brain configuration
      const brainResult = await pool.query(
        'SELECT * FROM reputation_ai_brain WHERE id = $1',
        ['main-ai-brain']
      );

      // Validate intervention against ethical constraints
      const ethicalCheck = await validateEthicalConstraints(interventionType, parameters, brainResult.rows[0], pool);

      if (!ethicalCheck.allowed) {
        return res.status(400).json({ 
          success: false, 
          error: 'Intervention violates ethical constraints',
          reason: ethicalCheck.reason
        });
      }

      // Execute intervention
      const result = await pool.query(
        `INSERT INTO ai_interventions (
          brain_id, intervention_type, parameters, reasoning, intervened_at, effectiveness
        ) VALUES ($1, $2, $3, $4, NOW(), NULL) 
        RETURNING *`,
        ['main-ai-brain', interventionType, JSON.stringify(parameters), reasoning]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== ANALYTICS & INSIGHTS ====================
  
  // Get reputation engine analytics
  router.get('/analytics', async (req: Request, res: Response) => {
    try {
      const { period = '30d', playerId } = req.query;
      
      // Get reputation trends
      const trendsResult = await pool.query(
        `SELECT 
          DATE_TRUNC('day', pr.updated_at) as date,
          rl.type as layer_type,
          AVG(pr.score) as avg_score,
          COUNT(*) as updates
        FROM player_reputation pr
        JOIN reputation_layers rl ON pr.layer_id = rl.id
        WHERE pr.updated_at > NOW() - INTERVAL $1
        GROUP BY DATE_TRUNC('day', pr.updated_at), rl.type
        ORDER BY date DESC`,
        [period]
      );

      // Get physics layer performance
      const physicsResult = await pool.query(
        `SELECT 
          DATE_TRUNC('day', applied_at) as date,
          law_name,
          effectiveness,
          violations_prevented
        FROM physics_applications
        WHERE applied_at > NOW() - INTERVAL $1
        ORDER BY date DESC`,
        [period]
      );

      // Get AI brain performance
      const aiResult = await pool.query(
        `SELECT 
          DATE_TRUNC('day', predicted_at) as date,
          model_type,
          AVG(accuracy) as avg_accuracy,
          COUNT(*) as predictions
        FROM ai_predictions
        WHERE predicted_at > NOW() - INTERVAL $1
        GROUP BY DATE_TRUNC('day', predicted_at), model_type
        ORDER BY date DESC`,
        [period]
      );

      res.json({ 
        success: true, 
        data: {
          reputationTrends: trendsResult.rows,
          physicsPerformance: physicsResult.rows,
          aiPerformance: aiResult.rows,
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
async function calculateEffectiveReputation(playerId: string, pool: Pool): Promise<number> {
  try {
    const result = await pool.query(
      `SELECT 
        pr.score,
        rl.weight,
        rl.decay_function
      FROM player_reputation pr
      JOIN reputation_layers rl ON pr.layer_id = rl.id
      WHERE pr.player_id = $1`,
      [playerId]
    );

    let effectiveRep = 0;
    const now = Date.now();

    for (const row of result.rows) {
      const daysSinceUpdate = (now - new Date(row.updated_at).getTime()) / (1000 * 60 * 60 * 24);
      let decayedScore = row.score;

      // Apply decay function
      switch (row.decay_function) {
        case DecayFunction.EXPONENTIAL:
          decayedScore = row.score * Math.exp(-0.01 * daysSinceUpdate);
          break;
        case DecayFunction.LINEAR:
          decayedScore = Math.max(0, row.score - 0.1 * daysSinceUpdate);
          break;
        case DecayFunction.LOGARITHMIC:
          decayedScore = row.score / (1 + Math.log(daysSinceUpdate + 1));
          break;
      }

      effectiveRep += decayedScore * row.weight;
    }

    return Math.round(effectiveRep);
  } catch (error) {
    console.error('Error calculating effective reputation:', error);
    return 0;
  }
}

async function applyReputationPhysics(playerId: string, layer: any, amount: number, pool: Pool): Promise<{ allowed: boolean; reason?: string }> {
  try {
    // Check conservation of trust law
    if (layer.type === ReputationType.TRUST && amount > 100) {
      const totalTrustReputation = await getPlayerReputation(playerId, ReputationType.TRUST, pool);
      const newTrustReputation = totalTrustReputation + amount;
      
      // Check if this creates reputation from nothing
      if (totalTrustReputation < 50 && newTrustReputation > 1000) {
        return { allowed: false, reason: 'Conservation of Trust law violated: reputation created from nothing' };
      }
    }

    // Check entropy law (decay)
    if (layer.decay_function === DecayFunction.NONE && amount > 1000) {
      return { allowed: false, reason: 'Entropy law violated: reputation cannot be permanent without decay' };
    }

    return { allowed: true };
  } catch (error) {
    console.error('Error applying reputation physics:', error);
    return { allowed: false, reason: 'Physics validation error' };
  }
}

async function calculateTotalEconomicMultiplier(playerId: string, pool: Pool): Promise<number> {
  try {
    const result = await pool.query(
      `SELECT 
        COALESCE(SUM(em.multiplier), 1.0) as total_multiplier
      FROM player_badges pb
      JOIN badge_economic_power bep ON pb.category_id = bep.id
      JOIN economic_multipliers em ON bep.id = em.badge_power_id
      WHERE pb.player_id = $1 AND pb.active = true`,
      [playerId]
    );

    return result.rows[0]?.total_multiplier || 1.0;
  } catch (error) {
    console.error('Error calculating total economic multiplier:', error);
    return 1.0;
  }
}

async function calculateVotingPower(playerId: string, pool: Pool): Promise<number> {
  try {
    const result = await pool.query(
      `SELECT 
        pr.score,
        rl.weight,
        gp.historical_accuracy,
        gp.community_trust
      FROM player_reputation pr
      JOIN reputation_layers rl ON pr.layer_id = rl.id
      JOIN governance_power gp ON rl.id = gp.layer_id
      WHERE pr.player_id = $1 AND rl.type = $2`,
      [playerId, ReputationType.GOVERNANCE]
    );

    const governanceRep = result.rows[0];
    if (!governanceRep) return 1;

    // Voting Power = Governance Reputation × Historical Accuracy × Community Trust
    return Math.round(governanceRep.score * governanceRep.historical_accuracy * governanceRep.community_trust * governanceRep.weight);
  } catch (error) {
    console.error('Error calculating voting power:', error);
    return 1;
  }
}

async function checkAntiManipulation(playerId: string, proposalId: string, pool: Pool): Promise<{ allowed: boolean; reason?: string }> {
  try {
    // Check for voting patterns
    const recentVotes = await pool.query(
      `SELECT 
        vote,
        COUNT(*) as vote_count,
        AVG(voting_power) as avg_power
      FROM governance_votes
      WHERE player_id = $1 AND timestamp > NOW() - INTERVAL '24 hours'
      GROUP BY vote`,
      [playerId]
    );

    // Check for collusion patterns
    const collusionCheck = await pool.query(
      `SELECT 
        COUNT(*) as coordinated_votes
      FROM governance_votes gv1
      JOIN governance_votes gv2 ON ABS(EXTRACT(EPOCH FROM gv1.timestamp) - EXTRACT(EPOCH FROM gv2.timestamp)) < 300
      WHERE gv1.player_id = $1 AND gv2.player_id IN (
        SELECT player_id FROM governance_votes 
        WHERE proposal_id = $1 AND vote = gv1.vote
      )
      GROUP BY gv1.vote`,
      [playerId, proposalId]
    );

    // Simple anti-manipulation logic
    if (recentVotes.rows.length > 10) {
      return { allowed: false, reason: 'Excessive voting activity detected' };
    }

    if (collusionCheck.rows[0]?.coordinated_votes > 5) {
      return { allowed: false, reason: 'Potential collusion pattern detected' };
    }

    return { allowed: true };
  } catch (error) {
    console.error('Error checking anti-manipulation:', error);
    return { allowed: false, reason: 'Anti-manipulation check error' };
  }
}

async function validateEthicalConstraints(interventionType: InterventionType, parameters: any, aiBrain: any, pool: Pool): Promise<{ allowed: boolean; reason?: string }> {
  try {
    // Check against ethical framework
    const ethicalFramework = aiBrain.ethical_framework;

    // Example ethical constraints
    if (interventionType === InterventionType.REPUTATION_RESET && parameters.force === true) {
      return { allowed: false, reason: 'Cannot force reputation reset without player consent' };
    }

    if (interventionType === InterventionType.GOVERNANCE_OVERRIDE && parameters.duration > 24) {
      return { allowed: false, reason: 'Governance override cannot exceed 24 hours' };
    }

    return { allowed: true };
  } catch (error) {
    console.error('Error validating ethical constraints:', error);
    return { allowed: false, reason: 'Ethical validation error' };
  }
}

async function getPlayerReputation(playerId: string, type: ReputationType, pool: Pool): Promise<number> {
  try {
    const result = await pool.query(
      `SELECT COALESCE(pr.score, 0) as score
      FROM player_reputation pr
      JOIN reputation_layers rl ON pr.layer_id = rl.id
      WHERE pr.player_id = $1 AND rl.type = $2`,
      [playerId, type]
    );

    return result.rows[0]?.score || 0;
  } catch (error) {
    console.error('Error getting player reputation:', error);
    return 0;
  }
}

async function checkBadgeReputationUpgrades(playerId: string, pool: Pool): Promise<any[]> {
  try {
    const result = await pool.query(
      `SELECT 
        pb.*,
        al.required_reputation
      FROM player_badges pb
      JOIN authority_levels al ON pb.current_level = al.id
      WHERE pb.player_id = $1
      ORDER BY al.required_reputation DESC`,
      [playerId]
    );

    // Check for new authority levels unlocked
    const upgrades = [];
    for (const badge of result.rows) {
      const playerRep = await getPlayerReputation(playerId, ReputationType.ALL, pool);
      if (playerRep >= badge.required_reputation) {
        upgrades.push({
          badgeId: badge.id,
          newAuthorityLevel: badge.current_level + 1,
          unlockedAt: new Date()
        });
      }
    }

    return upgrades;
  } catch (error) {
    console.error('Error checking badge upgrades:', error);
    return [];
  }
}

async function getAvailableEarningMechanics(playerId: string, pool: Pool): Promise<any[]> {
  try {
    const result = await pool.query(
      `SELECT 
        em.*,
        em.reputation_requirement
      FROM earning_mechanics em
      WHERE em.reputation_requirement <= (
        SELECT COALESCE(SUM(pr.score), 0)
        FROM player_reputation pr
        WHERE pr.player_id = $1
      )
      ORDER BY em.reputation_requirement`,
      [playerId]
    );

    return result.rows;
  } catch (error) {
    console.error('Error getting available earning mechanics:', error);
    return [];
  }
}

function calculateFinalReward(baseReward: number, multiplier: any, civilizationHealth: number): number {
  try {
    const multiplierValue = parseFloat(multiplier.multiplier_formula || '1.0');
    return Math.round(baseReward * multiplierValue * civilizationHealth);
  } catch (error) {
    console.error('Error calculating final reward:', error);
    return baseReward;
  }
}
