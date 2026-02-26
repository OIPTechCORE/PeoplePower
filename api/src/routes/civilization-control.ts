import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { 
  CivilizationControlMap,
  PowerPillar,
  SafetyStructure,
  GovernanceLayer,
  DigitalCitizen,
  Community,
  Institution,
  EconomicSystem,
  GovernanceSystem,
  TreasurySystem,
  PowerPillarType,
  SafetyStructureType,
  GovernanceLayerType,
  AuthorityLevel,
  CommunityType,
  InstitutionType,
  EconomicType,
  GovernanceType,
  TreasuryType
} from '../../../shared/types/civilization';

export function createCivilizationControlRoutes(pool: Pool): Router {
  const router = Router();

  // ==================== CIVILIZATION OVERVIEW ====================
  
  // Get civilization control map
  router.get('/control-map', async (req: Request, res: Response) => {
    try {
      const result = await pool.query(
        'SELECT * FROM civilization_control_map WHERE id = $1',
        ['main']
      );

      // Get power pillars
      const pillarsResult = await pool.query(
        'SELECT * FROM power_pillars WHERE civilization_id = $1 ORDER BY name',
        ['main']
      );

      // Get safety structures
      const safetyResult = await pool.query(
        'SELECT * FROM safety_structures WHERE civilization_id = $1 ORDER BY name',
        ['main']
      );

      // Get governance layers
      const governanceResult = await pool.query(
        'SELECT * FROM governance_layers WHERE civilization_id = $1 ORDER BY authority_level',
        ['main']
      );

      // Get power balance metrics
      const metricsResult = await pool.query(
        'SELECT * FROM power_balance_metrics WHERE civilization_id = $1 ORDER BY last_calculated DESC LIMIT 1',
        ['main']
      );

      res.json({ 
        success: true, 
        data: {
          civilization: result.rows[0],
          powerPillars: pillarsResult.rows,
          safetyStructures: safetyResult.rows,
          governanceLayers: governanceResult.rows,
          powerBalanceMetrics: metricsResult.rows[0]
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== POWER PILLARS ====================
  
  // Get power pillar details
  router.get('/power-pillars/:type', async (req: Request, res: Response) => {
    try {
      const { type } = req.params;
      
      const result = await pool.query(
        'SELECT * FROM power_pillars WHERE civilization_id = $1 AND name = $2',
        ['main', type]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Power pillar not found' });
      }

      // Get current holders
      const holdersResult = await pool.query(
        `SELECT 
          cr.citizen_id,
          dc.player_id,
          p.username,
          cr.authority,
          cr.term_start,
          cr.is_active
        FROM community_roles cr
        JOIN digital_citizens dc ON cr.citizen_id = dc.id
        JOIN players p ON dc.player_id = p.id
        WHERE cr.authority = $1 AND cr.is_active = true`,
        [type]
      );

      res.json({ 
        success: true, 
        data: {
          pillar: result.rows[0],
          currentHolders: holdersResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== SAFETY STRUCTURES ====================
  
  // Get safety structures
  router.get('/safety-structures', async (req: Request, res: Response) => {
    try {
      const { type } = req.query;
      
      let query = 'SELECT * FROM safety_structures WHERE civilization_id = $1';
      const params: any[] = ['main'];

      if (type) {
        query += ' AND type = $2';
        params.push(type);
      }

      query += ' ORDER BY name';

      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Activate safety structure
  router.post('/safety-structures/:id/activate', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { activatorId, reason, evidence } = req.body;

      // Verify activator has authority (Protocol Guardian or high-level council)
      const authorityCheck = await pool.query(
        `SELECT COUNT(*) as has_authority FROM community_roles cr
         WHERE cr.citizen_id = (SELECT id FROM digital_citizens WHERE player_id = $1)
         AND cr.authority = $2 AND cr.is_active = true`,
        [activatorId, 'protocol_guardian']
      );

      if (authorityCheck.rows[0].has_authority === 0) {
        return res.status(403).json({ 
          success: false, 
          error: 'Insufficient authority to activate safety structures' 
        });
      }

      // Get safety structure
      const structureResult = await pool.query(
        'SELECT * FROM safety_structures WHERE id = $1',
        [id]
      );

      if (structureResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Safety structure not found' });
      }

      // Check activation conditions
      const conditionsMet = await checkActivationConditions(id, pool);

      if (!conditionsMet) {
        return res.status(400).json({ 
          success: false, 
          error: 'Activation conditions not met' 
        });
      }

      // Activate safety structure
      await pool.query(
        `UPDATE safety_structures SET 
          last_activated = NOW(),
          activation_count = activation_count + 1
        WHERE id = $1`,
        [id]
      );

      // Log activation
      await pool.query(
        `INSERT INTO safety_structure_activations (
          structure_id, activator_id, reason, evidence, activated_at
        ) VALUES ($1, $2, $3, $4, NOW())`,
        [id, activatorId, reason, JSON.stringify(evidence)]
      );

      // Execute safety structure mechanisms
      await executeSafetyMechanisms(id, activatorId, pool);

      res.json({ success: true, message: 'Safety structure activated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== GOVERNANCE LAYERS ====================
  
  // Get governance layer details
  router.get('/governance-layers/:type', async (req: Request, res: Response) => {
    try {
      const { type } = req.params;
      
      const result = await pool.query(
        'SELECT * FROM governance_layers WHERE civilization_id = $1 AND name = $2',
        ['main', type]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Governance layer not found' });
      }

      // Get current office holders
      const officeHoldersResult = await pool.query(
        `SELECT 
          cr.citizen_id,
          dc.player_id,
          p.username,
          cr.name as position,
          cr.authority,
          cr.term_start,
          cr.term_end,
          cr.is_active,
          cr.performance
        FROM community_roles cr
        JOIN digital_citizens dc ON cr.citizen_id = dc.id
        JOIN players p ON dc.player_id = p.id
        WHERE cr.authority = $1 AND cr.is_active = true`,
        [type]
      );

      res.json({ 
        success: true, 
        data: {
          layer: result.rows[0],
          officeHolders: officeHoldersResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== POWER BALANCE MONITORING ====================
  
  // Get real-time power balance metrics
  router.get('/power-balance', async (req: Request, res: Response) => {
    try {
      // Calculate current centralization score
      const centralizationResult = await pool.query(
        `SELECT 
          COUNT(DISTINCT CASE WHEN authority = 'protocol_guardian' THEN citizen_id END) as guardians,
          COUNT(DISTINCT CASE WHEN authority = 'council_member' THEN citizen_id END) as council_members,
          COUNT(DISTINCT CASE WHEN authority = 'community_leader' THEN citizen_id END) as community_leaders,
          COUNT(DISTINCT citizen_id) as total_citizens
        FROM community_roles WHERE is_active = true`,
        []
      );

      const stats = centralizationResult.rows[0];
      const centralizationScore = calculateCentralizationScore(stats);

      // Calculate participation rate
      const participationResult = await pool.query(
        `SELECT 
          COUNT(DISTINCT player_id) as active_players,
          (SELECT COUNT(*) FROM players) as total_players
        FROM players WHERE last_active_at > NOW() - INTERVAL '7 days'`,
        []
      );

      const participationRate = (participationResult.rows[0].active_players / participationResult.rows[0].total_players) * 100;

      // Calculate turnover rate
      const turnoverResult = await pool.query(
        `SELECT 
          COUNT(*) as leadership_changes
        FROM governance_history 
        WHERE term_end > NOW() - INTERVAL '90 days'`,
        []
      );

      const turnoverRate = Math.min(100, (turnoverResult.rows[0].leadership_changes / 10) * 100);

      // Calculate corruption index (simplified)
      const corruptionIndex = await calculateCorruptionIndex(pool);

      // Calculate stability index
      const stabilityIndex = calculateStabilityIndex(centralizationScore, participationRate, turnoverRate, corruptionIndex);

      // Update metrics
      await pool.query(
        `INSERT INTO power_balance_metrics (
          civilization_id, centralization_score, participation_rate, 
          turnover_rate, corruption_index, stability_index, last_calculated
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        ['main', centralizationScore, participationRate, turnoverRate, corruptionIndex, stabilityIndex]
      );

      res.json({ 
        success: true, 
        data: {
          centralizationScore,
          participationRate,
          turnoverRate,
          corruptionIndex,
          stabilityIndex,
          lastCalculated: new Date(),
          alerts: generateStabilityAlerts(centralizationScore, participationRate, corruptionIndex)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== ANTI-MANIPULATION SYSTEMS ====================
  
  // Detect voting manipulation
  router.get('/anti-manipulation/voting-analysis', async (req: Request, res: Response) => {
    try {
      const { timeWindow = '24h' } = req.query;
      
      // Analyze voting patterns for manipulation
      const suspiciousPatterns = await pool.query(
        `SELECT 
          gp.id as proposal_id,
          gp.title,
          COUNT(*) as total_votes,
          COUNT(DISTINCT pv.voter_id) as unique_voters,
          COUNT(CASE WHEN pv.voted_at > gp.created_at + INTERVAL '1 hour' THEN 1 END) as rapid_votes,
          AVG(EXTRACT(EPOCH FROM (pv.voted_at - gp.created_at))) as avg_vote_time
        FROM governance_proposals gp
        LEFT JOIN proposal_votes pv ON gp.id = pv.proposal_id
        WHERE gp.created_at > NOW() - INTERVAL '24 hours'
        GROUP BY gp.id, gp.title
        HAVING COUNT(*) > 5 -- Only analyze proposals with significant voting
        ORDER BY total_votes DESC`,
        []
      );

      // Flag suspicious patterns
      const flaggedProposals = suspiciousPatterns.rows.filter(proposal => {
        const rapidVoteRatio = proposal.rapid_votes / proposal.total_votes;
        const uniqueVoterRatio = proposal.unique_voters / proposal.total_votes;
        const avgVoteTime = parseFloat(proposal.avg_vote_time);
        
        return rapidVoteRatio > 0.7 || uniqueVoterRatio < 0.8 || avgVoteTime < 300;
      });

      res.json({ 
        success: true, 
        data: {
          totalAnalyzed: suspiciousPatterns.rows.length,
          flaggedProposals: flaggedProposals.length,
          suspiciousPatterns: flaggedProposals,
          recommendations: generateAntiManipulationRecommendations(flaggedProposals)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Detect economic manipulation
  router.get('/anti-manipulation/economic-analysis', async (req: Request, res: Response) => {
    try {
      // Analyze transaction patterns for manipulation
      const suspiciousTransactions = await pool.query(
        `SELECT 
          te.*,
          p.username as player_name,
          dc.reputation_score
        FROM treasury_expenditures te
        JOIN players p ON te.player_id = p.id
        JOIN digital_citizens dc ON p.id = dc.player_id
        WHERE te.date > NOW() - INTERVAL '24 hours'
        AND te.amount > (SELECT AVG(amount) * 2 FROM treasury_expenditures WHERE date > NOW() - INTERVAL '7 days')
        ORDER BY te.amount DESC
        LIMIT 20`,
        []
      );

      // Check for coordinated behavior
      const coordinatedPatterns = await pool.query(
        `SELECT 
          COUNT(*) as transaction_count,
          SUM(amount) as total_amount,
          ARRAY_AGG(DISTINCT player_id) as involved_players
        FROM treasury_expenditures 
        WHERE date > NOW() - INTERVAL '1 hour'
        GROUP BY DATE_TRUNC('hour', date)
        HAVING COUNT(*) > 10 AND COUNT(DISTINCT player_id) < 5
        ORDER BY transaction_count DESC`,
        []
      );

      res.json({ 
        success: true, 
        data: {
          suspiciousTransactions: suspiciousTransactions.rows,
          coordinatedPatterns: coordinatedPatterns.rows,
          riskLevel: calculateEconomicRiskLevel(suspiciousTransactions.rows, coordinatedPatterns.rows)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== TRANSPARENCY ENGINE ====================
  
  // Get transparency reports
  router.get('/transparency/reports', async (req: Request, res: Response) => {
    try {
      const { category, period = '30d' } = req.query;
      
      // Get governance transparency
      const governanceTransparency = await pool.query(
        `SELECT 
          'governance' as category,
          COUNT(*) as total_actions,
          COUNT(CASE WHEN is_public = true THEN 1 END) as public_actions,
          COUNT(CASE WHEN reason IS NOT NULL THEN 1 END) as explained_actions
        FROM governance_action_log 
        WHERE timestamp > NOW() - INTERVAL '30 days'
        GROUP BY category`,
        []
      );

      // Get economic transparency
      const economicTransparency = await pool.query(
        `SELECT 
          'economic' as category,
          COUNT(*) as total_transactions,
          SUM(amount) as total_amount,
          COUNT(CASE WHERE is_public = true THEN 1 END) as public_transactions
        FROM treasury_expenditures 
        WHERE date > NOW() - INTERVAL '30 days'
        GROUP BY category`,
        []
      );

      // Get community transparency
      const communityTransparency = await pool.query(
        `SELECT 
          'community' as category,
          COUNT(*) as total_decisions,
          COUNT(CASE WHERE is_public = true THEN 1 END) as public_decisions,
          COUNT(CASE WHERE voting_record IS NOT NULL THEN 1 END) as recorded_votes
        FROM community_decisions 
        WHERE decided_at > NOW() - INTERVAL '30 days'
        GROUP BY category`,
        []
      );

      res.json({ 
        success: true, 
        data: {
          governanceTransparency: governanceTransparency.rows[0],
          economicTransparency: economicTransparency.rows[0],
          communityTransparency: communityTransparency.rows[0],
          overallTransparencyScore: calculateTransparencyScore([
            governanceTransparency.rows[0],
            economicTransparency.rows[0],
            communityTransparency.rows[0]
          ])
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== AUTOMATED SAFETY RESPONSES ====================
  
  // Trigger automated safety response
  router.post('/automated-response', async (req: Request, res: Response) => {
    try {
      const { triggerType, severity, evidence, autoResponse } = req.body;

      // Log the trigger
      const triggerResult = await pool.query(
        `INSERT INTO safety_triggers (
          type, severity, evidence, auto_response, triggered_at
        ) VALUES ($1, $2, $3, $4, NOW()) 
        RETURNING *`,
        [triggerType, severity, JSON.stringify(evidence), autoResponse]
      );

      // Execute automated response if enabled
      if (autoResponse) {
        await executeAutomatedResponse(triggerType, severity, evidence, pool);
      }

      // Notify relevant authorities
      await notifySafetyAuthorities(triggerType, severity, triggerResult.rows[0].id, pool);

      res.json({ 
        success: true, 
        data: {
          triggerId: triggerResult.rows[0].id,
          responseExecuted: autoResponse,
          nextSteps: generateSafetyResponseSteps(triggerType, severity)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== CIVILIZATION HEALTH DASHBOARD ====================
  
  // Get comprehensive civilization health
  router.get('/health-dashboard', async (req: Request, res: Response) => {
    try {
      // Get all health metrics
      const [
        powerBalance,
        transparencyMetrics,
        manipulationAnalysis,
        participationMetrics,
        economicStability
      ] = await Promise.all([
        getPowerBalanceMetrics(pool),
        getTransparencyMetrics(pool),
        getManipulationAnalysis(pool),
        getParticipationMetrics(pool),
        getEconomicStability(pool)
      ]);

      // Calculate overall health score
      const healthScore = calculateCivilizationHealthScore({
        powerBalance,
        transparencyMetrics,
        manipulationAnalysis,
        participationMetrics,
        economicStability
      });

      // Generate health recommendations
      const recommendations = generateHealthRecommendations({
        powerBalance,
        transparencyMetrics,
        manipulationAnalysis,
        participationMetrics,
        economicStability,
        healthScore
      });

      res.json({ 
        success: true, 
        data: {
          overallHealthScore: healthScore,
          healthGrade: getHealthGrade(healthScore),
          metrics: {
            powerBalance,
            transparencyMetrics,
            manipulationAnalysis,
            participationMetrics,
            economicStability
          },
          recommendations,
          lastUpdated: new Date()
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  return router;
}

// Helper functions
async function checkActivationConditions(structureId: string, pool: Pool): Promise<boolean> {
  try {
    const result = await pool.query(
      'SELECT activation_conditions FROM safety_structures WHERE id = $1',
      [structureId]
    );

    if (result.rows.length === 0) return false;

    const conditions = result.rows[0].activation_conditions;
    
    // Check each condition
    for (const condition of conditions) {
      switch (condition.type) {
        case 'corruption_threshold':
          const corruptionIndex = await calculateCorruptionIndex(pool);
          if (corruptionIndex < condition.threshold) return false;
          break;
        case 'centralization_threshold':
          const centralizationResult = await pool.query(
            `SELECT COUNT(*) as guardians FROM community_roles 
             WHERE authority = 'protocol_guardian' AND is_active = true`,
            []
          );
          if (centralizationResult.rows[0].guardians < condition.threshold) return false;
          break;
        case 'participation_threshold':
          const participationResult = await pool.query(
            `SELECT COUNT(DISTINCT player_id) as active_players FROM players 
             WHERE last_active_at > NOW() - INTERVAL '7 days'`,
            []
          );
          if (participationResult.rows[0].active_players < condition.threshold) return false;
          break;
      }
    }

    return true;
  } catch (error) {
    console.error('Error checking activation conditions:', error);
    return false;
  }
}

async function executeSafetyMechanisms(structureId: string, activatorId: string, pool: Pool): Promise<void> {
  try {
    const result = await pool.query(
      'SELECT mechanisms FROM safety_structures WHERE id = $1',
      [structureId]
    );

    if (result.rows.length === 0) return;

    const mechanisms = result.rows[0].mechanisms;
    
    for (const mechanism of mechanisms) {
      switch (mechanism.type) {
        case 'freeze_governance':
          await pool.query(
            'UPDATE governance_proposals SET status = $1 WHERE status = $2',
            ['suspended', 'active']
          );
          break;
        case 'audit_treasury':
          await pool.query(
            'UPDATE treasury_system SET last_audit = NOW() WHERE id = $1',
            ['main']
          );
          break;
        case 'emergency_elections':
          await pool.query(
            `INSERT INTO emergency_elections (
              reason, triggered_by, triggered_at, status
            ) VALUES ($1, $2, NOW(), $3)`,
            [mechanism.reason, activatorId, 'active']
          );
          break;
        case 'reputation_reset':
          await pool.query(
            `UPDATE digital_citizens SET reputation_score = GREATEST(0, reputation_score - $1) 
             WHERE reputation_score > $2`,
            [mechanism.penalty, mechanism.threshold]
          );
          break;
      }
    }
  } catch (error) {
    console.error('Error executing safety mechanisms:', error);
  }
}

function calculateCentralizationScore(stats: any): number {
  const { guardians, council_members, community_leaders, total_citizens } = stats;
  
  // Weight different authority levels
  const weightedLeaders = (guardians * 5) + (council_members * 3) + (community_leaders * 1);
  const maxWeightedLeaders = total_citizens * 5;
  
  return Math.min(100, (weightedLeaders / maxWeightedLeaders) * 100);
}

async function calculateCorruptionIndex(pool: Pool): Promise<number> {
  try {
    const suspiciousTransactions = await pool.query(
      `SELECT COUNT(*) as count FROM treasury_expenditures 
       WHERE amount > (SELECT AVG(amount) * 3 FROM treasury_expenditures)
       AND date > NOW() - INTERVAL '30 days'`,
      []
    );

    const suspiciousVotes = await pool.query(
      `SELECT COUNT(*) as count FROM proposal_votes pv
       JOIN governance_proposals gp ON pv.proposal_id = gp.id
       WHERE gp.type = 'treasury_allocation' 
       AND pv.voted_at > NOW() - INTERVAL '30 days'`,
      []
    );

    const transactionScore = Math.min(50, suspiciousTransactions.rows[0].count * 5);
    const voteScore = Math.min(30, suspiciousVotes.rows[0].count * 2);
    
    return transactionScore + voteScore;
  } catch (error) {
    console.error('Error calculating corruption index:', error);
    return 0;
  }
}

function calculateStabilityIndex(
  centralizationScore: number,
  participationRate: number,
  turnoverRate: number,
  corruptionIndex: number
): number {
  const centralizationFactor = (100 - centralizationScore) / 100;
  const participationFactor = participationRate / 100;
  const turnoverFactor = Math.min(100, turnoverRate) / 100;
  const corruptionFactor = (100 - corruptionIndex) / 100;
  
  return Math.round(
    (centralizationFactor * 0.3 + 
     participationFactor * 0.3 + 
     turnoverFactor * 0.2 + 
     corruptionFactor * 0.2) * 100
  );
}

function generateStabilityAlerts(centralizationScore: number, participationRate: number, corruptionIndex: number): string[] {
  const alerts = [];
  
  if (centralizationScore > 70) {
    alerts.push('HIGH CENTRALIZATION: Power is too concentrated in few hands');
  }
  
  if (participationRate < 30) {
    alerts.push('LOW PARTICIPATION: Citizen engagement is critically low');
  }
  
  if (corruptionIndex > 50) {
    alerts.push('HIGH CORRUPTION RISK: Unusual patterns detected');
  }
  
  return alerts;
}

function generateAntiManipulationRecommendations(flaggedProposals: any[]): string[] {
  const recommendations = [];
  
  if (flaggedProposals.length > 0) {
    recommendations.push('Implement vote timing restrictions');
    recommendations.push('Require identity verification for voting');
    recommendations.push('Add cooldown periods between votes');
  }
  
  return recommendations;
}

function calculateEconomicRiskLevel(suspiciousTransactions: any[], coordinatedPatterns: any[]): string {
  const riskScore = suspiciousTransactions.length * 2 + coordinatedPatterns.length * 5;
  
  if (riskScore > 20) return 'CRITICAL';
  if (riskScore > 10) return 'HIGH';
  if (riskScore > 5) return 'MEDIUM';
  return 'LOW';
}

function calculateTransparencyScore(metrics: any[]): number {
  let totalScore = 0;
  let totalWeight = 0;
  
  for (const metric of metrics) {
    if (!metric) continue;
    
    const transparencyRatio = metric.public_actions / metric.total_actions;
    const weight = metric.category === 'economic' ? 0.4 : 0.3;
    
    totalScore += transparencyRatio * weight;
    totalWeight += weight;
  }
  
  return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0;
}

async function executeAutomatedResponse(triggerType: string, severity: string, evidence: any, pool: Pool): Promise<void> {
  // Implementation for automated safety responses
  console.log(`Executing automated response for ${triggerType} with severity ${severity}`);
}

async function notifySafetyAuthorities(triggerType: string, severity: string, triggerId: string, pool: Pool): Promise<void> {
  // Notify relevant authorities based on trigger type and severity
  const authorities = await pool.query(
    `SELECT DISTINCT citizen_id FROM community_roles 
     WHERE authority IN ($1, $2) AND is_active = true`,
    ['protocol_guardian', 'council_member']
  );

  for (const authority of authorities.rows) {
    await pool.query(
      `INSERT INTO safety_notifications (
        authority_id, trigger_id, type, severity, notified_at
      ) VALUES ($1, $2, $3, $4, NOW())`,
      [authority.citizen_id, triggerId, triggerType, severity]
    );
  }
}

function generateSafetyResponseSteps(triggerType: string, severity: string): string[] {
  const steps = [];
  
  switch (triggerType) {
    case 'corruption_detected':
      steps.push('Initiate immediate audit');
      steps.push('Freeze suspicious accounts');
      steps.push('Launch investigation');
      break;
    case 'centralization_alert':
      steps.push('Review power distribution');
      steps.push('Consider emergency elections');
      steps.push('Activate decentralization measures');
      break;
    case 'participation_crisis':
      steps.push('Launch engagement campaign');
      steps.push('Review barriers to participation');
      steps.push('Activate incentive programs');
      break;
  }
  
  return steps;
}

// Additional helper functions for comprehensive monitoring
async function getPowerBalanceMetrics(pool: Pool) {
  const result = await pool.query(
    'SELECT * FROM power_balance_metrics ORDER BY last_calculated DESC LIMIT 1',
    []
  );
  return result.rows[0] || null;
}

async function getTransparencyMetrics(pool: Pool) {
  const result = await pool.query(
    `SELECT 
      category,
      COUNT(*) as total_actions,
      COUNT(CASE WHEN is_public = true THEN 1 END) as public_actions
    FROM governance_action_log 
    WHERE timestamp > NOW() - INTERVAL '30 days'
    GROUP BY category`,
    []
  );
  return result.rows;
}

async function getManipulationAnalysis(pool: Pool) {
  const result = await pool.query(
    'SELECT * FROM manipulation_analysis ORDER BY detected_at DESC LIMIT 10',
    []
  );
  return result.rows;
}

async function getParticipationMetrics(pool: Pool) {
  const result = await pool.query(
    `SELECT 
      COUNT(DISTINCT player_id) as active_players,
      (SELECT COUNT(*) FROM players) as total_players,
      AVG(session_duration) as avg_session_time
    FROM player_activity 
    WHERE last_active > NOW() - INTERVAL '7 days'`,
    []
  );
  return result.rows[0] || {};
}

async function getEconomicStability(pool: Pool) {
  const result = await pool.query(
    `SELECT 
      SUM(amount) as total_volume,
      COUNT(*) as transaction_count,
      AVG(amount) as avg_transaction_size
    FROM treasury_expenditures 
    WHERE date > NOW() - INTERVAL '30 days'`,
    []
  );
  return result.rows[0] || {};
}

function calculateCivilizationHealthScore(metrics: any): number {
  const weights = {
    powerBalance: 0.3,
    transparencyMetrics: 0.25,
    manipulationAnalysis: 0.2,
    participationMetrics: 0.15,
    economicStability: 0.1
  };

  let score = 0;
  let totalWeight = 0;

  for (const [key, weight] of Object.entries(weights)) {
    if (metrics[key]) {
      score += (metrics[key].score || 50) * weight;
      totalWeight += weight;
    }
  }

  return totalWeight > 0 ? Math.round(score / totalWeight) : 50;
}

function generateHealthRecommendations(metrics: any): string[] {
  const recommendations = [];

  if (metrics.powerBalance?.centralizationScore > 70) {
    recommendations.push('Implement power decentralization measures');
  }

  if (metrics.participationMetrics?.active_players / metrics.participationMetrics?.total_players < 0.5) {
    recommendations.push('Launch citizen engagement initiatives');
  }

  if (metrics.transparencyMetrics?.overallScore < 60) {
    recommendations.push('Increase transparency in governance and economic decisions');
  }

  return recommendations;
}

function getHealthGrade(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}
