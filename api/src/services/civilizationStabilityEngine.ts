import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

// ===================================
// CIVILIZATION STABILITY ENGINE INTERFACES
// ===================================

export interface EconomicMetrics {
  id: string;
  metric_date: Date;
  token_velocity: number;
  inflation_rate: number; // Percentage
  new_vs_old_player_ratio: number;
  earnings_distribution_gini: number; // Gini coefficient
  active_player_count: number;
  total_transaction_volume: number;
  average_daily_earnings: number;
  created_at: Date;
}

export interface StabilityIntervention {
  id: string;
  intervention_type: 'reward_adjustment' | 'inflation_control' | 'inequality_reduction' | 'activity_boost';
  trigger_condition: Record<string, any>;
  intervention_parameters: Record<string, any>;
  expected_outcome: Record<string, any>;
  status: 'active' | 'completed' | 'failed';
  start_date: Date;
  end_date?: Date;
  effectiveness_score?: number; // 0.00-1.00
}

export interface GovernanceProposal {
  id: string;
  proposer_id: string;
  title: string;
  description: string;
  proposal_type: 'economic' | 'governance' | 'community' | 'technical';
  proposal_data: Record<string, any>;
  citizen_votes: {
    for: number;
    against: number;
    abstain: number;
    total_voters: number;
  };
  council_review: {
    feasibility_score: number;
    impact_assessment: string;
    recommendations: string[];
  };
  guardian_approval: {
    ethical_alignment: boolean;
    risk_assessment: string;
    final_decision: 'approve' | 'reject' | 'request_revision';
  };
  final_status: 'pending' | 'approved' | 'rejected' | 'implemented';
  created_at: Date;
  voting_deadline: Date;
}

export interface ImmunityAlert {
  id: string;
  alert_type: 'manipulation' | 'fake_accounts' | 'vote_buying' | 'reputation_farming' | 'coordinated_attack';
  detected_players: string[];
  evidence_data: Record<string, any>;
  severity_level: number; // 1-10
  status: 'investigating' | 'action_taken' | 'resolved';
  detection_date: Date;
  resolution_date?: Date;
  resolution_actions?: Record<string, any>;
}

export interface CivilizationMission {
  id: string;
  title: string;
  description: string;
  mission_type: 'seasonal_challenge' | 'cooperative_goal' | 'crisis_simulation' | 'social_impact';
  objectives: Record<string, any>;
  rewards: {
    tokens: number;
    reputation: number;
    special_recognitions: string[];
  };
  participation_requirements: {
    minimum_reputation?: number;
    required_skills?: string[];
    time_commitment?: string;
  };
  start_date: Date;
  end_date: Date;
  current_progress: Record<string, any>;
  status: 'upcoming' | 'active' | 'completed' | 'failed';
  created_at: Date;
}

// ===================================
// CIVILIZATION STABILITY ENGINE SERVICE
// ===================================

export class CivilizationStabilityEngine {
  constructor(private db: Pool) {}

  // ===================================
  // ECONOMIC BALANCE CORE
  // ===================================

  async collectEconomicMetrics(): Promise<EconomicMetrics> {
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate token velocity
    const velocityQuery = `
      SELECT COALESCE(SUM(amount), 0) as total_volume,
             COUNT(DISTINCT player_id) as active_players
      FROM player_transactions 
      WHERE DATE(transaction_date) = $1
    `;
    const velocityResult = await this.db.query(velocityQuery, [today]);
    
    // Calculate inflation rate (compare with previous day)
    const inflationQuery = `
      WITH today_metrics AS (
        SELECT COALESCE(AVG(amount), 0) as avg_earnings
        FROM player_transactions 
        WHERE DATE(transaction_date) = $1 AND amount > 0
      ),
      yesterday_metrics AS (
        SELECT COALESCE(AVG(amount), 0) as avg_earnings
        FROM player_transactions 
        WHERE DATE(transaction_date) = $1 - INTERVAL '1 day' AND amount > 0
      )
      SELECT 
        CASE 
          WHEN yesterday_metrics.avg_earnings = 0 THEN 0
          ELSE ((today_metrics.avg_earnings - yesterday_metrics.avg_earnings) / yesterday_metrics.avg_earnings) * 100
        END as inflation_rate
      FROM today_metrics, yesterday_metrics
    `;
    const inflationResult = await this.db.query(inflationQuery, [today]);
    
    // Calculate Gini coefficient for earnings distribution
    const giniQuery = `
      WITH player_earnings AS (
        SELECT player_id, SUM(amount) as total_earnings
        FROM player_transactions 
        WHERE DATE(transaction_date) = $1 AND amount > 0
        GROUP BY player_id
      ),
      sorted_earnings AS (
        SELECT total_earnings, 
               ROW_NUMBER() OVER (ORDER BY total_earnings) as rank,
               COUNT(*) OVER () as total_players
        FROM player_earnings
      )
      SELECT 
        SUM(ABS(total_earnings - LAG(total_earnings) OVER (ORDER BY total_earnings))) as gini_numerator,
        (total_players * total_earnings) as gini_denominator
      FROM sorted_earnings
    `;
    const giniResult = await this.db.query(giniQuery, [today]);
    
    const giniCoefficient = giniResult.rows[0]?.gini_denominator > 0 
      ? giniResult.rows[0].gini_numerator / giniResult.rows[0].gini_denominator 
      : 0;

    // Calculate new vs old player ratio
    const playerRatioQuery = `
      WITH new_players AS (
        SELECT COUNT(*) as count
        FROM players 
        WHERE DATE(joined_at) = $1
      ),
      returning_players AS (
        SELECT COUNT(DISTINCT player_id) as count
        FROM player_sessions 
        WHERE DATE(session_start) = $1
        AND player_id NOT IN (SELECT id FROM players WHERE DATE(joined_at) = $1)
      )
      SELECT 
        new_players.count as new_count,
        returning_players.count as returning_count,
        CASE 
          WHEN returning_players.count = 0 THEN 0
          ELSE new_players.count::decimal / returning_players.count
        END as new_old_ratio
      FROM new_players, returning_players
    `;
    const ratioResult = await this.db.query(playerRatioQuery, [today]);

    const metrics: Omit<EconomicMetrics, 'id' | 'created_at'> = {
      metric_date: new Date(),
      token_velocity: velocityResult.rows[0]?.total_volume || 0,
      inflation_rate: inflationResult.rows[0]?.inflation_rate || 0,
      new_vs_old_player_ratio: ratioResult.rows[0]?.new_old_ratio || 0,
      earnings_distribution_gini: giniCoefficient,
      active_player_count: velocityResult.rows[0]?.active_players || 0,
      total_transaction_volume: velocityResult.rows[0]?.total_volume || 0,
      average_daily_earnings: velocityResult.rows[0]?.avg_earnings || 0
    };

    // Store metrics
    const insertQuery = `
      INSERT INTO economic_metrics 
      (id, metric_date, token_velocity, inflation_rate, new_vs_old_player_ratio, 
       earnings_distribution_gini, active_player_count, total_transaction_volume, average_daily_earnings, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const result = await this.db.query(insertQuery, [
      uuidv4(),
      metrics.metric_date,
      metrics.token_velocity,
      metrics.inflation_rate,
      metrics.new_vs_old_player_ratio,
      metrics.earnings_distribution_gini,
      metrics.active_player_count,
      metrics.total_transaction_volume,
      metrics.average_daily_earnings
    ]);

    return result.rows[0];
  }

  async analyzeEconomicStability(): Promise<Record<string, any>> {
    const latestMetricsQuery = `
      SELECT * FROM economic_metrics 
      ORDER BY metric_date DESC 
      LIMIT 7
    `;
    const metricsResult = await this.db.query(latestMetricsQuery);
    const metrics = metricsResult.rows;

    if (metrics.length < 2) {
      return { status: 'insufficient_data', recommendations: [] };
    }

    const latest = metrics[0];
    const previous = metrics[1];
    
    const stabilityAnalysis = {
      inflation_trend: latest.inflation_rate > previous.inflation_rate ? 'increasing' : 'stable',
      inequality_trend: latest.earnings_distribution_gini > previous.earnings_distribution_gini ? 'worsening' : 'improving',
      activity_trend: latest.active_player_count > previous.active_player_count ? 'growing' : 'declining',
      economic_health_score: this.calculateEconomicHealthScore(latest),
      recommendations: [] as string[]
    };

    // Generate recommendations based on analysis
    if (latest.inflation_rate > 5) {
      stabilityAnalysis.recommendations.push('Consider reducing reward rates to control inflation');
    }

    if (latest.earnings_distribution_gini > 0.4) {
      stabilityAnalysis.recommendations.push('Implement progressive rewards to reduce inequality');
    }

    if (latest.active_player_count < previous.active_player_count * 0.9) {
      stabilityAnalysis.recommendations.push('Launch engagement campaign to retain players');
    }

    return stabilityAnalysis;
  }

  async createStabilityIntervention(
    interventionType: StabilityIntervention['intervention_type'],
    triggerCondition: Record<string, any>,
    interventionParameters: Record<string, any>
  ): Promise<StabilityIntervention> {
    const expectedOutcome = this.predictInterventionOutcome(interventionType, interventionParameters);

    const query = `
      INSERT INTO stability_interventions 
      (id, intervention_type, trigger_condition, intervention_parameters, expected_outcome, status, start_date)
      VALUES ($1, $2, $3, $4, $5, 'active', CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const result = await this.db.query(query, [
      uuidv4(),
      interventionType,
      triggerCondition,
      interventionParameters,
      expectedOutcome
    ]);

    return result.rows[0];
  }

  // ===================================
  // THREE-CHAMBER GOVERNANCE
  // ===================================

  async createGovernanceProposal(
    proposerId: string,
    title: string,
    description: string,
    proposalType: GovernanceProposal['proposal_type'],
    proposalData: Record<string, any>
  ): Promise<GovernanceProposal> {
    const votingDeadline = new Date();
    votingDeadline.setDate(votingDeadline.getDate() + 7); // 7-day voting period

    const query = `
      INSERT INTO governance_proposals 
      (id, proposer_id, title, description, proposal_type, proposal_data, citizen_votes, council_review, guardian_approval, final_status, created_at, voting_deadline)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', CURRENT_TIMESTAMP, $10)
      RETURNING *
    `;

    const result = await this.db.query(query, [
      uuidv4(),
      proposerId,
      title,
      description,
      proposalType,
      proposalData,
      { for: 0, against: 0, abstain: 0, total_voters: 0 },
      { feasibility_score: 0, impact_assessment: '', recommendations: [] },
      { ethical_alignment: false, risk_assessment: '', final_decision: 'request_revision' },
      votingDeadline
    ]);

    return result.rows[0];
  }

  async voteOnProposal(
    proposalId: string,
    playerId: string,
    vote: 'for' | 'against' | 'abstain'
  ): Promise<void> {
    // Check if player has already voted
    const voteCheckQuery = `
      SELECT id FROM proposal_votes 
      WHERE proposal_id = $1 AND player_id = $2
    `;
    const existingVote = await this.db.query(voteCheckQuery, [proposalId, playerId]);
    
    if (existingVote.rows.length > 0) {
      throw new Error('Player has already voted on this proposal');
    }

    // Record vote
    const insertVoteQuery = `
      INSERT INTO proposal_votes (id, proposal_id, player_id, vote, voted_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
    `;
    await this.db.query(insertVoteQuery, [uuidv4(), proposalId, playerId, vote]);

    // Update vote counts
    const updateCountsQuery = `
      UPDATE governance_proposals 
      SET citizen_votes = jsonb_set(
        citizen_votes,
        array[CASE 
          WHEN $3 = 'for' THEN 'for'
          WHEN $3 = 'against' THEN 'against'
          ELSE 'abstain'
        END],
        (citizen_votes->CASE 
          WHEN $3 = 'for' THEN 'for'
          WHEN $3 = 'against' THEN 'against'
          ELSE 'abstain'
        END) + 1
      ),
      citizen_votes = jsonb_set(
        citizen_votes,
        array['total_voters'],
        (citizen_votes->>'total_voters')::int + 1
      )
      WHERE id = $1
    `;
    await this.db.query(updateCountsQuery, [proposalId, vote]);
  }

  async processProposalReview(proposalId: string): Promise<GovernanceProposal> {
    const proposal = await this.getGovernanceProposal(proposalId);
    if (!proposal) throw new Error('Proposal not found');

    // Builder Council Review
    const councilReview = await this.conductBuilderCouncilReview(proposal);
    
    // Guardian Council Review
    const guardianApproval = await this.conductGuardianCouncilReview(proposal);

    // Update proposal with reviews
    const updateQuery = `
      UPDATE governance_proposals 
      SET council_review = $2, guardian_approval = $3
      WHERE id = $1
      RETURNING *
    `;

    const result = await this.db.query(updateQuery, [proposalId, councilReview, guardianApproval]);
    return result.rows[0];
  }

  // ===================================
  // REPUTATION IMMUNITY SYSTEM
  // ===================================

  async detectSuspiciousActivity(): Promise<ImmunityAlert[]> {
    const alerts: ImmunityAlert[] = [];

    // Detect coordinated manipulation
    const manipulationQuery = `
      WITH suspicious_patterns AS (
        SELECT 
          player_id,
          COUNT(*) as transaction_count,
          AVG(amount) as avg_amount,
          STDDEV(amount) as amount_variance
        FROM player_transactions 
        WHERE transaction_date > CURRENT_TIMESTAMP - INTERVAL '24 hours'
        GROUP BY player_id
        HAVING COUNT(*) > 100 AND STDDEV(amount) < 10
      )
      SELECT 
        sp.player_id,
        sp.transaction_count,
        sp.avg_amount
      FROM suspicious_patterns sp
    `;
    const manipulationResult = await this.db.query(manipulationQuery);

    if (manipulationResult.rows.length > 0) {
      alerts.push(await this.createImmunityAlert(
        'manipulation',
        manipulationResult.rows.map(r => r.player_id),
        {
          pattern: 'high_frequency_low_variance_transactions',
          evidence: manipulationResult.rows
        },
        7
      ));
    }

    // Detect reputation farming
    const farmingQuery = `
      WITH reputation_farming AS (
        SELECT 
          rt.player_id,
          COUNT(*) as reputation_transactions,
          SUM(reputation_change) as total_reputation_gain
        FROM reputation_transactions rt
        WHERE rt.transaction_date > CURRENT_TIMESTAMP - INTERVAL '24 hours'
        GROUP BY rt.player_id
        HAVING COUNT(*) > 20 AND SUM(reputation_change) > 50
      )
      SELECT * FROM reputation_farming
    `;
    const farmingResult = await this.db.query(farmingQuery);

    if (farmingResult.rows.length > 0) {
      alerts.push(await this.createImmunityAlert(
        'reputation_farming',
        farmingResult.rows.map(r => r.player_id),
        {
          pattern: 'excessive_reputation_gain',
          evidence: farmingResult.rows
        },
        6
      ));
    }

    return alerts;
  }

  async createImmunityAlert(
    alertType: ImmunityAlert['alert_type'],
    detectedPlayers: string[],
    evidenceData: Record<string, any>,
    severityLevel: number
  ): Promise<ImmunityAlert> {
    const query = `
      INSERT INTO immunity_alerts 
      (id, alert_type, detected_players, evidence_data, severity_level, status, detection_date)
      VALUES ($1, $2, $3, $4, $5, 'investigating', CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const result = await this.db.query(query, [
      uuidv4(),
      alertType,
      detectedPlayers,
      evidenceData,
      severityLevel
    ]);

    return result.rows[0];
  }

  async resolveImmunityAlert(
    alertId: string,
    resolutionActions: Record<string, any>
  ): Promise<ImmunityAlert> {
    const query = `
      UPDATE immunity_alerts 
      SET 
        status = 'resolved',
        resolution_date = CURRENT_TIMESTAMP,
        resolution_actions = $2
      WHERE id = $1
      RETURNING *
    `;

    const result = await this.db.query(query, [alertId, resolutionActions]);
    return result.rows[0];
  }

  // ===================================
  // MEANING REGENERATION ENGINE
  // ===================================

  async createCivilizationMission(
    title: string,
    description: string,
    missionType: CivilizationMission['mission_type'],
    objectives: Record<string, any>,
    rewards: CivilizationMission['rewards'],
    participationRequirements: CivilizationMission['participation_requirements'],
    durationDays: number
  ): Promise<CivilizationMission> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);

    const query = `
      INSERT INTO civilization_missions 
      (id, title, description, mission_type, objectives, rewards, participation_requirements, start_date, end_date, current_progress, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'upcoming', CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const result = await this.db.query(query, [
      uuidv4(),
      title,
      description,
      missionType,
      objectives,
      rewards,
      participationRequirements,
      startDate,
      endDate,
      { participants: 0, progress_percentage: 0 }
    ]);

    return result.rows[0];
  }

  async updateMissionProgress(
    missionId: string,
    playerId: string,
    progressData: Record<string, any>
  ): Promise<void> {
    const query = `
      INSERT INTO mission_participations 
      (id, mission_id, player_id, contribution_data, progress_percentage, joined_at, last_updated)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (mission_id, player_id)
      DO UPDATE SET
        contribution_data = EXCLUDED.contribution_data,
        progress_percentage = EXCLUDED.progress_percentage,
        last_updated = CURRENT_TIMESTAMP
    `;

    await this.db.query(query, [
      uuidv4(),
      missionId,
      playerId,
      progressData,
      progressData.progress_percentage || 0
    ]);

    // Update overall mission progress
    await this.updateOverallMissionProgress(missionId);
  }

  // ===================================
  // UTILITY METHODS
  // ===================================

  private calculateEconomicHealthScore(metrics: EconomicMetrics): number {
    let score = 100;

    // Inflation impact (0-30 points)
    if (metrics.inflation_rate > 10) score -= 30;
    else if (metrics.inflation_rate > 5) score -= 20;
    else if (metrics.inflation_rate > 2) score -= 10;

    // Inequality impact (0-30 points)
    if (metrics.earnings_distribution_gini > 0.5) score -= 30;
    else if (metrics.earnings_distribution_gini > 0.4) score -= 20;
    else if (metrics.earnings_distribution_gini > 0.3) score -= 10;

    // Activity impact (0-20 points)
    if (metrics.active_player_count < 100) score -= 20;
    else if (metrics.active_player_count < 500) score -= 10;
    else if (metrics.active_player_count < 1000) score -= 5;

    // Token velocity impact (0-20 points)
    if (metrics.token_velocity < 1000) score -= 20;
    else if (metrics.token_velocity < 5000) score -= 10;
    else if (metrics.token_velocity < 10000) score -= 5;

    return Math.max(0, score);
  }

  private predictInterventionOutcome(
    interventionType: StabilityIntervention['intervention_type'],
    parameters: Record<string, any>
  ): Record<string, any> {
    const outcomes = {
      reward_adjustment: {
        expected_inflation_change: parameters.reward_multiplier * -2,
        expected_activity_change: parameters.reward_multiplier * 5,
        timeframe_days: 7
      },
      inflation_control: {
        expected_inflation_change: -5,
        expected_activity_change: -10,
        timeframe_days: 14
      },
      inequality_reduction: {
        expected_gini_change: -0.1,
        expected_activity_change: 3,
        timeframe_days: 21
      },
      activity_boost: {
        expected_activity_change: 25,
        expected_inflation_change: 2,
        timeframe_days: 3
      }
    };

    return outcomes[interventionType] || {};
  }

  private async getGovernanceProposal(proposalId: string): Promise<GovernanceProposal | null> {
    const query = 'SELECT * FROM governance_proposals WHERE id = $1';
    const result = await this.db.query(query, [proposalId]);
    return result.rows[0] || null;
  }

  private async conductBuilderCouncilReview(proposal: GovernanceProposal): Promise<GovernanceProposal['council_review']> {
    // Simulate AI-based feasibility analysis
    const feasibilityScore = Math.floor(Math.random() * 40) + 60; // 60-100
    const impactAssessment = this.generateImpactAssessment(proposal);
    const recommendations = this.generateCouncilRecommendations(proposal, feasibilityScore);

    return {
      feasibility_score: feasibilityScore,
      impact_assessment: impactAssessment,
      recommendations
    };
  }

  private async conductGuardianCouncilReview(proposal: GovernanceProposal): Promise<GovernanceProposal['guardian_approval']> {
    // Simulate ethical alignment analysis
    const ethicalAlignment = Math.random() > 0.3; // 70% chance of ethical alignment
    const riskAssessment = this.generateRiskAssessment(proposal);
    const finalDecision = ethicalAlignment ? 'approve' : 'request_revision';

    return {
      ethical_alignment: ethicalAlignment,
      risk_assessment: riskAssessment,
      final_decision
    };
  }

  private generateImpactAssessment(proposal: GovernanceProposal): string {
    const impacts = [
      'High positive impact on community engagement',
      'Moderate economic benefits with minimal risk',
      'Significant improvement to ecosystem stability',
      'Low implementation complexity with high ROI'
    ];
    return impacts[Math.floor(Math.random() * impacts.length)];
  }

  private generateCouncilRecommendations(proposal: GovernanceProposal, feasibilityScore: number): string[] {
    const recommendations = [];
    
    if (feasibilityScore < 70) {
      recommendations.push('Consider simplifying implementation approach');
    }
    
    if (proposal.proposal_type === 'economic') {
      recommendations.push('Conduct thorough economic modeling before implementation');
    }
    
    if (proposal.proposal_type === 'governance') {
      recommendations.push('Ensure broad community consultation process');
    }

    return recommendations;
  }

  private generateRiskAssessment(proposal: GovernanceProposal): string {
    const risks = [
      'Low risk: Well-defined scope with clear success metrics',
      'Medium risk: Requires careful monitoring during implementation',
      'High risk: Potential for unintended consequences',
      'Minimal risk: Incremental improvement with proven approach'
    ];
    return risks[Math.floor(Math.random() * risks.length)];
  }

  private async updateOverallMissionProgress(missionId: string): Promise<void> {
    const query = `
      UPDATE civilization_missions 
      SET current_progress = (
        SELECT jsonb_build_object(
          'participants', COUNT(*),
          'progress_percentage', AVG(progress_percentage)
        )
        FROM mission_participations 
        WHERE mission_id = $1
      )
      WHERE id = $1
    `;
    await this.db.query(query, [missionId]);
  }

  async getStabilityDashboard(): Promise<Record<string, any>> {
    const latestMetricsQuery = `
      SELECT * FROM economic_metrics 
      ORDER BY metric_date DESC 
      LIMIT 1
    `;
    const metricsResult = await this.db.query(latestMetricsQuery);

    const activeInterventionsQuery = `
      SELECT COUNT(*) as count FROM stability_interventions 
      WHERE status = 'active'
    `;
    const interventionsResult = await this.db.query(activeInterventionsQuery);

    const pendingProposalsQuery = `
      SELECT COUNT(*) as count FROM governance_proposals 
      WHERE final_status = 'pending'
    `;
    const proposalsResult = await this.db.query(pendingProposalsQuery);

    const activeAlertsQuery = `
      SELECT COUNT(*) as count FROM immunity_alerts 
      WHERE status = 'investigating'
    `;
    const alertsResult = await this.db.query(activeAlertsQuery);

    const activeMissionsQuery = `
      SELECT COUNT(*) as count FROM civilization_missions 
      WHERE status = 'active'
    `;
    const missionsResult = await this.db.query(activeMissionsQuery);

    return {
      economic_metrics: metricsResult.rows[0] || null,
      active_interventions: parseInt(interventionsResult.rows[0].count),
      pending_proposals: parseInt(proposalsResult.rows[0].count),
      active_alerts: parseInt(alertsResult.rows[0].count),
      active_missions: parseInt(missionsResult.rows[0].count),
      stability_score: metricsResult.rows[0] 
        ? this.calculateEconomicHealthScore(metricsResult.rows[0]) 
        : 0
    };
  }
}
