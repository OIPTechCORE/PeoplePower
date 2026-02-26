// ========================================
// REPUTATION PHYSICS LAYER
// Mathematical laws that control reputation inflation, decay, and balance
// ========================================

import { Pool } from 'pg';
import { ReputationType, DecayFunction, LawPurpose } from '../../../shared/types/infinity-reputation-engine';

export interface PhysicsLawResult {
  allowed: boolean;
  reason?: string;
  adjustment?: number;
  violationType?: string;
}

export interface PhysicsParameters {
  conservationRate: number;
  entropyCoefficient: number;
  diminishingReturnsRate: number;
  socialValidationWeight: number;
  riskMultiplier: number;
  recyclingRate: number;
  balanceThreshold: number;
  legacyWeight: number;
  healthCoupling: number;
  attractorStrength: number;
  antiCollusionThreshold: number;
  halvingInterval: number;
}

export class ReputationPhysicsLayer {
  private pool: Pool;
  private parameters: PhysicsParameters;

  constructor(pool: Pool) {
    this.pool = pool;
    this.parameters = {
      conservationRate: 0.1,
      entropyCoefficient: 0.01,
      diminishingReturnsRate: 0.1,
      socialValidationWeight: 0.3,
      riskMultiplier: 1.5,
      recyclingRate: 0.8,
      balanceThreshold: 0.2,
      legacyWeight: 0.7,
      healthCoupling: 0.15,
      attractorStrength: 0.05,
      antiCollusionThreshold: 0.8,
      halvingInterval: 365 // days
    };
  }

  // ========================================
  // LAW 1: CONSERVATION OF TRUST
  // Reputation cannot be created from nothing
  // ========================================
  async applyConservationOfTrust(
    playerId: string, 
    amount: number, 
    layerType: ReputationType,
    context: any
  ): Promise<PhysicsLawResult> {
    try {
      // Check if new reputation is backed by real value
      const valueGrowth = await this.calculateCivilizationValueGrowth();
      const maxNewReputation = valueGrowth * this.parameters.conservationRate;

      if (amount > maxNewReputation && layerType === ReputationType.TRUST) {
        return {
          allowed: false,
          reason: `Conservation of Trust violated: ${amount} > ${maxNewReputation} (max new reputation)`,
          violationType: 'CONSERVATION_VIOLATION'
        };
      }

      return { allowed: true };
    } catch (error) {
      console.error('Error applying conservation of trust:', error);
      return { allowed: false, reason: 'Physics calculation error' };
    }
  }

  // ========================================
  // LAW 2: ENTROPY (Natural Decay)
  // R(t) = R₀ × e^(−λt)
  // ========================================
  applyEntropyDecay(currentReputation: number, daysInactive: number): number {
    const lambda = this.parameters.entropyCoefficient;
    const decayedReputation = currentReputation * Math.exp(-lambda * daysInactive);
    
    return Math.max(0, decayedReputation);
  }

  // ========================================
  // LAW 3: DIMINISHING RETURNS
  // Rep Gain = Base × log(1 + Contribution Score)
  // ========================================
  applyDiminishingReturns(baseAmount: number, contributionScore: number): number {
    const diminishingRate = this.parameters.diminishingReturnsRate;
    const adjustedAmount = baseAmount * Math.log(1 + contributionScore) * diminishingRate;
    
    return Math.min(baseAmount, adjustedAmount);
  }

  // ========================================
  // LAW 4: SOCIAL VALIDATION ENERGY
  // Rep Earned = Action Score × Validator Reputation Weight
  // ========================================
  async applySocialValidation(
    actionScore: number, 
    playerId: string, 
    validators: string[]
  ): Promise<{ weightedScore: number; validationBonus: number }> {
    try {
      let totalValidatorWeight = 0;
      let totalValidatorReputation = 0;

      for (const validatorId of validators) {
        const validatorRep = await this.getPlayerTotalReputation(validatorId);
        totalValidatorReputation += validatorRep;
        totalValidatorWeight += 1; // Each validator gets base weight
      }

      // Apply reputation weighting
      const avgValidatorReputation = totalValidatorReputation / validators.length;
      const socialValidationWeight = Math.min(2.0, 1 + (avgValidatorReputation / 1000));
      
      const weightedScore = actionScore * socialValidationWeight * this.parameters.socialValidationWeight;
      const validationBonus = weightedScore - actionScore;

      return { weightedScore, validationBonus };
    } catch (error) {
      console.error('Error applying social validation:', error);
      return { weightedScore: actionScore, validationBonus: 0 };
    }
  }

  // ========================================
  // LAW 5: REPUTATION RISK PRINCIPLE
  // Risked Rep = Decision Impact × Authority Level
  // ========================================
  async calculateReputationRisk(
    playerId: string, 
    decisionImpact: number, 
    authorityLevel: number
  ): Promise<{ riskAmount: number; riskMultiplier: number }> {
    try {
      const playerReputation = await this.getPlayerTotalReputation(playerId);
      const baseRisk = decisionImpact * authorityLevel;
      const riskMultiplier = this.parameters.riskMultiplier * (1 + authorityLevel * 0.1);
      const riskAmount = Math.min(playerReputation * 0.1, baseRisk * riskMultiplier);

      return { riskAmount, riskMultiplier };
    } catch (error) {
      console.error('Error calculating reputation risk:', error);
      return { riskAmount: 0, riskMultiplier: 1 };
    }
  }

  // ========================================
  // LAW 6: REPUTATION RECYCLING
  // Lost reputation returns to civilization pool
  // ========================================
  async recycleReputation(burnedAmount: number, reason: string): Promise<void> {
    try {
      // Add burned reputation to civilization pool
      await this.pool.query(
        `INSERT INTO reputation_recycling_pool (
            amount, reason, recycled_at, utilization_status
          ) VALUES ($1, $2, NOW(), 'available')`,
        [burnedAmount * this.parameters.recyclingRate, reason]
      );

      // Update total recyclable reputation
      await this.pool.query(
        `UPDATE civilization_metrics 
          SET recyclable_reputation = recyclable_reputation + $1 
          WHERE id = 'main-metrics'`,
        [burnedAmount * this.parameters.recyclingRate]
      );
    } catch (error) {
      console.error('Error recycling reputation:', error);
    }
  }

  // ========================================
  // LAW 7: MULTI-DIMENSIONAL BALANCE
  // Effective Reputation = √(R₁ × R₂ × R₃ ...)
  // ========================================
  async calculateMultiDimensionalBalance(playerId: string): Promise<{
    effectiveReputation: number;
    balanceScore: number;
    dominantDimensions: string[];
    weakDimensions: string[];
  }> {
    try {
      const result = await this.pool.query(
        `SELECT 
            pr.score,
            rl.type,
            rl.weight
          FROM player_reputation pr
          JOIN reputation_layers rl ON pr.layer_id = rl.id
          WHERE pr.player_id = $1`,
        [playerId]
      );

      const reputationScores = result.rows;
      let product = 1;
      let sum = 0;
      const scoresByType: { [key: string]: number } = {};

      for (const row of reputationScores) {
        const weightedScore = row.score * row.weight;
        product *= Math.max(1, weightedScore);
        sum += weightedScore;
        scoresByType[row.type] = weightedScore;
      }

      // Effective reputation using geometric mean
      const effectiveReputation = Math.pow(product, 1 / reputationScores.length);
      
      // Balance score (coefficient of variation)
      const mean = sum / reputationScores.length;
      const variance = reputationScores.reduce((acc, row) => {
        const diff = (row.score * row.weight) - mean;
        return acc + (diff * diff);
      }, 0) / reputationScores.length;
      const stdDev = Math.sqrt(variance);
      const balanceScore = 1 - (stdDev / mean);

      // Find dominant and weak dimensions
      const avgScore = mean;
      const dominantDimensions = Object.entries(scoresByType)
        .filter(([_, score]) => score > avgScore * 1.5)
        .map(([type, _]) => type);
      
      const weakDimensions = Object.entries(scoresByType)
        .filter(([_, score]) => score < avgScore * 0.5)
        .map(([type, _]) => type);

      return {
        effectiveReputation,
        balanceScore,
        dominantDimensions,
        weakDimensions
      };
    } catch (error) {
      console.error('Error calculating multi-dimensional balance:', error);
      return {
        effectiveReputation: 0,
        balanceScore: 0,
        dominantDimensions: [],
        weakDimensions: []
      };
    }
  }

  // ========================================
  // LAW 8: TIME-WEIGHTED LEGACY
  // Recent actions matter more than ancient glory
  // ========================================
  async calculateTimeWeightedLegacy(playerId: string): Promise<number> {
    try {
      const result = await this.pool.query(
        `SELECT 
            pr.score,
            pr.updated_at,
            rl.weight,
            rl.type
          FROM player_reputation pr
          JOIN reputation_layers rl ON pr.layer_id = rl.id
          WHERE pr.player_id = $1`,
        [playerId]
      );

      let totalWeightedScore = 0;
      const now = new Date();

      for (const row of result.rows) {
        const daysSinceUpdate = (now.getTime() - new Date(row.updated_at).getTime()) / (1000 * 60 * 60 * 24);
        
        // Time weighting: recent = full weight, ancient = reduced weight
        const timeWeight = Math.exp(-daysSinceUpdate / 365); // 1-year half-life
        const legacyWeight = this.parameters.legacyWeight;
        const activityWeight = 1 - legacyWeight;
        
        const weightedScore = row.score * row.weight * (legacyWeight * timeWeight + activityWeight * (1 - timeWeight));
        totalWeightedScore += weightedScore;
      }

      return totalWeightedScore;
    } catch (error) {
      console.error('Error calculating time-weighted legacy:', error);
      return 0;
    }
  }

  // ========================================
  // LAW 9: CIVILIZATION HEALTH COUPLING
  // Effective Power = Reputation × Civilization Health Index
  // ========================================
  async applyCivilizationHealthCoupling(baseReputation: number): Promise<number> {
    try {
      const healthResult = await this.pool.query(
        'SELECT overall FROM civilization_health_index ORDER BY calculated_at DESC LIMIT 1'
      );

      const civilizationHealth = healthResult.rows[0]?.overall || 1.0;
      const healthCoupling = this.parameters.healthCoupling;
      
      // Reputation is modulated by civilization health
      const effectivePower = baseReputation * (1 - healthCoupling + healthCoupling * civilizationHealth);
      
      return effectivePower;
    } catch (error) {
      console.error('Error applying civilization health coupling:', error);
      return baseReputation;
    }
  }

  // ========================================
  // LAW 10: GRAVITATIONAL ATTRACTOR EFFECT
  // High reputation attracts responsibility automatically
  // ========================================
  async calculateGravitationalAttraction(playerId: string): Promise<{
    attractionScore: number;
    suggestedRoles: string[];
    responsibilityLevel: number;
  }> {
    try {
      const playerReputation = await this.getPlayerTotalReputation(playerId);
      const totalReputationInSystem = await this.getTotalSystemReputation();
      
      // Calculate player's relative position in reputation distribution
      const reputationPercentile = playerReputation / totalReputationInSystem;
      
      // Gravitational attraction increases with reputation percentile
      const attractionScore = Math.pow(reputationPercentile, 2) * this.parameters.attractorStrength;
      
      // Suggest roles based on attraction level
      const suggestedRoles = [];
      let responsibilityLevel = 0;
      
      if (attractionScore > 0.8) {
        suggestedRoles.push('elder_council', 'crisis_manager', 'policy_maker');
        responsibilityLevel = 5;
      } else if (attractionScore > 0.6) {
        suggestedRoles.push('moderator', 'mentor', 'community_leader');
        responsibilityLevel = 4;
      } else if (attractionScore > 0.4) {
        suggestedRoles.push('helper', 'guide', 'ambassador');
        responsibilityLevel = 3;
      } else if (attractionScore > 0.2) {
        suggestedRoles.push('contributor', 'participant');
        responsibilityLevel = 2;
      } else {
        suggestedRoles.push('learner', 'observer');
        responsibilityLevel = 1;
      }

      return {
        attractionScore,
        suggestedRoles,
        responsibilityLevel
      };
    } catch (error) {
      console.error('Error calculating gravitational attraction:', error);
      return {
        attractionScore: 0,
        suggestedRoles: [],
        responsibilityLevel: 0
      };
    }
  }

  // ========================================
  // LAW 11: ANTI-COLLUSION PHYSICS
  // Detect reputation rings via graph analysis
  // ========================================
  async detectCollusion(playerId: string): Promise<{
    collusionScore: number;
    clusterRisk: 'low' | 'medium' | 'high' | 'critical';
    suspiciousConnections: string[];
    recommendedActions: string[];
  }> {
    try {
      // Analyze player's validation network
      const networkResult = await this.pool.query(
        `SELECT 
            validator_id,
            COUNT(*) as validation_count,
            AVG(rt.amount) as avg_amount,
            MAX(rt.timestamp) as last_validation
          FROM reputation_transactions rt
          WHERE rt.player_id = $1 AND rt.type = 'earned'
          GROUP BY validator_id
          HAVING COUNT(*) > 2`,
        [playerId]
      );

      // Check for closed loops
      const loopResult = await this.pool.query(
        `SELECT 
            COUNT(*) as loop_count,
            AVG(rt.amount) as loop_avg_amount
          FROM reputation_transactions rt1
          JOIN reputation_transactions rt2 ON rt1.validator_id = rt2.player_id 
            AND rt2.validator_id = rt1.player_id
          WHERE rt1.player_id = $1 AND rt2.player_id = $1
            AND ABS(EXTRACT(EPOCH FROM rt1.timestamp) - EXTRACT(EPOCH FROM rt2.timestamp)) < 86400`,
        [playerId]
      );

      // Calculate collusion score
      const networkDensity = networkResult.rows.length;
      const loopCount = loopResult.rows[0]?.loop_count || 0;
      const avgLoopAmount = loopResult.rows[0]?.loop_avg_amount || 0;
      
      const collusionScore = Math.min(1.0, 
        (networkDensity * 0.3) + 
        (loopCount * 0.4) + 
        (avgLoopAmount / 1000 * 0.3)
      );

      // Determine risk level
      let clusterRisk: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (collusionScore > 0.8) clusterRisk = 'critical';
      else if (collusionScore > 0.6) clusterRisk = 'high';
      else if (collusionScore > 0.4) clusterRisk = 'medium';

      // Identify suspicious connections
      const suspiciousConnections = networkResult.rows
        .filter(row => row.validation_count > 5)
        .map(row => row.validator_id);

      // Recommended actions
      const recommendedActions = [];
      if (clusterRisk === 'critical') {
        recommendedActions.push('temporary_reputation_freeze', 'manual_review', 'reduced_validation_weight');
      } else if (clusterRisk === 'high') {
        recommendedActions.push('increased_scrutiny', 'validation_limits', 'behavioral_analysis');
      } else if (clusterRisk === 'medium') {
        recommendedActions.push('monitoring_alert', 'pattern_analysis');
      }

      return {
        collusionScore,
        clusterRisk,
        suspiciousConnections,
        recommendedActions
      };
    } catch (error) {
      console.error('Error detecting collusion:', error);
      return {
        collusionScore: 0,
        clusterRisk: 'low',
        suspiciousConnections: [],
        recommendedActions: []
      };
    }
  }

  // ========================================
  // LAW 12: REPUTATION HALVING EVENTS
  // Every few years: New reputation issuance reduces
  // ========================================
  async checkReputationHalving(): Promise<{
    halvingNeeded: boolean;
    daysUntilHalving: number;
    newIssuanceRate: number;
    impact: string;
  }> {
    try {
      const lastHalvingResult = await this.pool.query(
        'SELECT * FROM reputation_halvings ORDER BY timestamp DESC LIMIT 1'
      );

      const lastHalving = lastHalvingResult.rows[0];
      const now = new Date();
      
      let daysUntilHalving = this.parameters.halvingInterval;
      let halvingNeeded = false;
      
      if (lastHalving) {
        const daysSinceLastHalving = Math.floor(
          (now.getTime() - new Date(lastHalving.timestamp).getTime()) / (1000 * 60 * 60 * 24)
        );
        daysUntilHalving = Math.max(0, this.parameters.halvingInterval - daysSinceLastHalving);
        
        if (daysUntilHalving === 0) {
          halvingNeeded = true;
        }
      } else {
        // No halving has occurred yet, check if system is old enough
        const systemAge = await this.getSystemAge();
        if (systemAge >= this.parameters.halvingInterval) {
          halvingNeeded = true;
        }
      }

      // Calculate new issuance rate (50% reduction)
      const currentRate = await this.getCurrentReputationIssuanceRate();
      const newIssuanceRate = halvingNeeded ? currentRate * 0.5 : currentRate;

      // Estimate impact
      const impact = halvingNeeded 
        ? `Reputation issuance will reduce from ${currentRate.toFixed(4)} to ${newIssuanceRate.toFixed(4)} per day`
        : `Current issuance rate: ${currentRate.toFixed(4)} per day`;

      return {
        halvingNeeded,
        daysUntilHalving,
        newIssuanceRate,
        impact
      };
    } catch (error) {
      console.error('Error checking reputation halving:', error);
      return {
        halvingNeeded: false,
        daysUntilHalving: this.parameters.halvingInterval,
        newIssuanceRate: 0.1,
        impact: 'Error checking halving status'
      };
    }
  }

  // ========================================
  // MASTER EQUATION
  // Effective Reputation Power (ERP) = √(Multi-Dimensional Rep) × e^(−Decay) × Social Validation Weight × Civilization Health Index × Anti-Collusion Factor
  // ========================================
  async calculateMasterEquation(playerId: string): Promise<{
    effectiveReputationPower: number;
    components: {
      multiDimensionalRep: number;
      decayFactor: number;
      socialValidationWeight: number;
      civilizationHealthIndex: number;
      antiCollusionFactor: number;
    };
    breakdown: string;
  }> {
    try {
      // Component 1: Multi-dimensional reputation
      const balanceResult = await this.calculateMultiDimensionalBalance(playerId);
      const multiDimensionalRep = balanceResult.effectiveReputation;

      // Component 2: Decay factor
      const timeWeightedLegacy = await this.calculateTimeWeightedLegacy(playerId);
      const totalReputation = await this.getPlayerTotalReputation(playerId);
      const decayFactor = timeWeightedLegacy / Math.max(1, totalReputation);

      // Component 3: Social validation weight
      const recentValidations = await this.getRecentValidationWeight(playerId);
      const socialValidationWeight = Math.min(2.0, 1 + recentValidations);

      // Component 4: Civilization health index
      const healthResult = await this.pool.query(
        'SELECT overall FROM civilization_health_index ORDER BY calculated_at DESC LIMIT 1'
      );
      const civilizationHealthIndex = healthResult.rows[0]?.overall || 1.0;

      // Component 5: Anti-collusion factor
      const collusionResult = await this.detectCollusion(playerId);
      const antiCollusionFactor = Math.max(0.1, 1 - collusionResult.collusionScore);

      // Calculate final effective reputation power
      const effectiveReputationPower = 
        Math.sqrt(multiDimensionalRep) * 
        decayFactor * 
        socialValidationWeight * 
        civilizationHealthIndex * 
        antiCollusionFactor;

      const components = {
        multiDimensionalRep,
        decayFactor,
        socialValidationWeight,
        civilizationHealthIndex,
        antiCollusionFactor
      };

      const breakdown = `
        ERP = √(${multiDimensionalRep.toFixed(2)}) × ${decayFactor.toFixed(3)} × ${socialValidationWeight.toFixed(2)} × ${civilizationHealthIndex.toFixed(2)} × ${antiCollusionFactor.toFixed(3)}
        = ${effectiveReputationPower.toFixed(2)}
      `;

      return {
        effectiveReputationPower,
        components,
        breakdown
      };
    } catch (error) {
      console.error('Error calculating master equation:', error);
      return {
        effectiveReputationPower: 0,
        components: {
          multiDimensionalRep: 0,
          decayFactor: 0,
          socialValidationWeight: 0,
          civilizationHealthIndex: 0,
          antiCollusionFactor: 0
        },
        breakdown: 'Error in calculation'
      };
    }
  }

  // ========================================
  // HELPER FUNCTIONS
  // ========================================

  private async calculateCivilizationValueGrowth(): Promise<number> {
    try {
      const result = await this.pool.query(
        `SELECT 
            COUNT(*) as new_users,
            COALESCE(SUM(economic_volume), 0) as economic_volume,
            COALESCE(SUM(knowledge_added), 0) as knowledge_added,
            COALESCE(SUM(conflicts_resolved), 0) as conflicts_resolved
          FROM civilization_metrics 
          WHERE calculated_at > NOW() - INTERVAL '7 days'`
      );

      const metrics = result.rows[0];
      return (
        (metrics.new_users * 10) +
        (metrics.economic_volume * 0.001) +
        (metrics.knowledge_added * 5) +
        (metrics.conflicts_resolved * 20)
      );
    } catch (error) {
      console.error('Error calculating civilization value growth:', error);
      return 0;
    }
  }

  private async getPlayerTotalReputation(playerId: string): Promise<number> {
    try {
      const result = await this.pool.query(
        `SELECT COALESCE(SUM(pr.score * rl.weight), 0) as total_reputation
          FROM player_reputation pr
          JOIN reputation_layers rl ON pr.layer_id = rl.id
          WHERE pr.player_id = $1`,
        [playerId]
      );

      return result.rows[0]?.total_reputation || 0;
    } catch (error) {
      console.error('Error getting player total reputation:', error);
      return 0;
    }
  }

  private async getTotalSystemReputation(): Promise<number> {
    try {
      const result = await this.pool.query(
        `SELECT COALESCE(SUM(pr.score * rl.weight), 0) as total_reputation
          FROM player_reputation pr
          JOIN reputation_layers rl ON pr.layer_id = rl.id`
      );

      return result.rows[0]?.total_reputation || 1;
    } catch (error) {
      console.error('Error getting total system reputation:', error);
      return 1;
    }
  }

  private async getRecentValidationWeight(playerId: string): Promise<number> {
    try {
      const result = await this.pool.query(
        `SELECT COUNT(*) as validation_count,
                AVG(rt.amount) as avg_amount
          FROM reputation_transactions rt
          WHERE rt.player_id = $1 
            AND rt.type = 'earned'
            AND rt.timestamp > NOW() - INTERVAL '7 days'`,
        [playerId]
      );

      const validations = result.rows[0];
      return Math.min(1.0, (validations.validation_count * 0.1) + (validations.avg_amount * 0.001));
    } catch (error) {
      console.error('Error getting recent validation weight:', error);
      return 0;
    }
  }

  private async getSystemAge(): Promise<number> {
    try {
      const result = await this.pool.query(
        'SELECT MIN(created_at) as first_created FROM infinity_reputation_engine'
      );

      const firstCreated = result.rows[0]?.first_created;
      if (!firstCreated) return 0;

      return Math.floor(
        (new Date().getTime() - new Date(firstCreated).getTime()) / (1000 * 60 * 60 * 24)
      );
    } catch (error) {
      console.error('Error getting system age:', error);
      return 0;
    }
  }

  private async getCurrentReputationIssuanceRate(): Promise<number> {
    try {
      const result = await this.pool.query(
        `SELECT AVG(amount) as daily_issuance
          FROM reputation_transactions 
          WHERE type = 'earned' 
            AND timestamp > NOW() - INTERVAL '7 days'`
      );

      return result.rows[0]?.daily_issuance || 0.1;
    } catch (error) {
      console.error('Error getting current reputation issuance rate:', error);
      return 0.1;
    }
  }

  // ========================================
  // PHYSICS PARAMETER MANAGEMENT
  // ========================================

  async updateParameters(newParameters: Partial<PhysicsParameters>): Promise<void> {
    try {
      this.parameters = { ...this.parameters, ...newParameters };
      
      // Log parameter changes
      await this.pool.query(
        `INSERT INTO physics_parameter_updates (
            parameters, updated_at, updated_by
          ) VALUES ($1, NOW(), 'system')`,
        [JSON.stringify(this.parameters)]
      );
    } catch (error) {
      console.error('Error updating physics parameters:', error);
    }
  }

  getParameters(): PhysicsParameters {
    return { ...this.parameters };
  }

  async getPhysicsPerformance(): Promise<{
    lawEffectiveness: { [lawName: string]: number };
    systemStability: number;
    recommendationCount: number;
    lastOptimization: Date;
  }> {
    try {
      // Get law effectiveness metrics
      const lawEffectiveness: { [lawName: string]: number } = {};
      
      // Conservation of Trust effectiveness
      const conservationResult = await this.pool.query(
        `SELECT COUNT(*) as violations 
          FROM reputation_transactions 
          WHERE type = 'earned' 
            AND timestamp > NOW() - INTERVAL '7 days'
            AND amount > (SELECT AVG(amount) * 2 FROM reputation_transactions WHERE type = 'earned')`
      );
      lawEffectiveness.conservation_of_trust = Math.max(0, 1 - (conservationResult.rows[0].violations / 100));

      // Entropy effectiveness
      const entropyResult = await this.pool.query(
        `SELECT AVG(decay_rate) as avg_decay 
          FROM reputation_transactions 
          WHERE timestamp > NOW() - INTERVAL '7 days'`
      );
      lawEffectiveness.entropy = Math.min(1, (entropyResult.rows[0].avg_decay || 0) / 0.01);

      // Anti-collusion effectiveness
      const collusionResult = await this.pool.query(
        `SELECT AVG(collusion_score) as avg_collusion 
          FROM anti_collusion 
          WHERE detected_at > NOW() - INTERVAL '7 days'`
      );
      lawEffectiveness.anti_collusion = Math.max(0, 1 - (collusionResult.rows[0].avg_collusion || 0));

      // System stability (overall health)
      const stabilityScore = Object.values(lawEffectiveness).reduce((sum, score) => sum + score, 0) / Object.keys(lawEffectiveness).length;

      // Recommendation count
      const recommendationResult = await this.pool.query(
        `SELECT COUNT(*) as count 
          FROM ai_interventions 
          WHERE intervention_type = 'automatic_adjustment'
            AND intervened_at > NOW() - INTERVAL '7 days'`
      );

      // Last optimization
      const optimizationResult = await this.pool.query(
        'SELECT MAX(intervened_at) as last_optimization FROM ai_interventions WHERE intervention_type = $1',
        ['parameter_optimization']
      );

      return {
        lawEffectiveness,
        systemStability: stabilityScore,
        recommendationCount: recommendationResult.rows[0].count || 0,
        lastOptimization: optimizationResult.rows[0].last_optimization || new Date(0)
      };
    } catch (error) {
      console.error('Error getting physics performance:', error);
      return {
        lawEffectiveness: {},
        systemStability: 0,
        recommendationCount: 0,
        lastOptimization: new Date(0)
      };
    }
  }
}

export default ReputationPhysicsLayer;
