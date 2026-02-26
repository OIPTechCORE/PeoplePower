import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

// ===================================
// REPUTATION ECONOMY INTERFACES
// ===================================

export interface ReputationDNA {
  id: string;
  player_id: string;
  knowledge_dna: {
    courses_completed: number;
    skills_mastered: string[];
    teaching_contributions: number;
    assessment_scores: number[];
    expertise_areas: string[];
  };
  social_dna: {
    helping_actions: number;
    conflict_resolutions: number;
    community_participation: number;
    mentorship_sessions: number;
    social_impact_score: number;
  };
  builder_dna: {
    tools_created: number;
    innovations_approved: number;
    economic_contributions: number;
    code_contributions: number;
    infrastructure_improvements: number;
  };
  integrity_dna: {
    rule_compliance_score: number;
    scam_resistance_actions: number;
    governance_honesty: number;
    ethical_behavior_score: number;
    trust_score: number;
  };
  overall_score: number; // 0.00-100.00
  civilization_rank: 'explorer' | 'contributor' | 'builder' | 'architect' | 'elder';
  last_calculated: Date;
}

export interface ReputationTransaction {
  id: string;
  player_id: string;
  transaction_type: 'teaching' | 'helping' | 'innovation' | 'governance' | 'integrity_action' | 'leadership';
  reputation_change: number; // Positive or negative
  dna_category: 'knowledge' | 'social' | 'builder' | 'integrity';
  reference_id?: string;
  description: string;
  transaction_date: Date;
  verified_by?: string;
  verification_notes?: string;
}

export interface MarketplaceListing {
  id: string;
  service_provider_id: string;
  service_type: 'development' | 'design' | 'consulting' | 'mentoring' | 'content_creation';
  service_description: string;
  base_price: number;
  reputation_multiplier: number;
  final_price: number;
  availability_status: 'available' | 'busy' | 'unavailable';
  portfolio_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface MarketplaceContract {
  id: string;
  listing_id: string;
  client_id: string;
  contract_terms: Record<string, any>;
  agreed_price: number;
  status: 'pending' | 'active' | 'completed' | 'disputed' | 'cancelled';
  start_date?: Date;
  completion_date?: Date;
  review_rating?: number; // 1-5
  review_feedback?: string;
  created_at: Date;
}

// ===================================
// REPUTATION ECONOMY SERVICE
// ===================================

export class ReputationEconomyService {
  constructor(private db: Pool) {}

  // ===================================
  // REPUTATION DNA MANAGEMENT
  // ===================================

  async getPlayerReputationDNA(playerId: string): Promise<ReputationDNA | null> {
    const query = 'SELECT * FROM reputation_dna WHERE player_id = $1';
    const result = await this.db.query(query, [playerId]);
    
    if (result.rows.length === 0) {
      return await this.initializeReputationDNA(playerId);
    }
    
    return result.rows[0];
  }

  async initializeReputationDNA(playerId: string): Promise<ReputationDNA> {
    const initialDNA: Omit<ReputationDNA, 'id' | 'player_id' | 'last_calculated'> = {
      knowledge_dna: {
        courses_completed: 0,
        skills_mastered: [],
        teaching_contributions: 0,
        assessment_scores: [],
        expertise_areas: []
      },
      social_dna: {
        helping_actions: 0,
        conflict_resolutions: 0,
        community_participation: 0,
        mentorship_sessions: 0,
        social_impact_score: 0
      },
      builder_dna: {
        tools_created: 0,
        innovations_approved: 0,
        economic_contributions: 0,
        code_contributions: 0,
        infrastructure_improvements: 0
      },
      integrity_dna: {
        rule_compliance_score: 100,
        scam_resistance_actions: 0,
        governance_honesty: 100,
        ethical_behavior_score: 100,
        trust_score: 50
      },
      overall_score: 50.0,
      civilization_rank: 'explorer'
    };

    const query = `
      INSERT INTO reputation_dna 
      (id, player_id, knowledge_dna, social_dna, builder_dna, integrity_dna, overall_score, civilization_rank, last_calculated)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const result = await this.db.query(query, [
      uuidv4(),
      playerId,
      JSON.stringify(initialDNA.knowledge_dna),
      JSON.stringify(initialDNA.social_dna),
      JSON.stringify(initialDNA.builder_dna),
      JSON.stringify(initialDNA.integrity_dna),
      initialDNA.overall_score,
      initialDNA.civilization_rank
    ]);

    return result.rows[0];
  }

  async updateReputationDNA(playerId: string): Promise<ReputationDNA> {
    // Calculate DNA components from recent transactions
    const dnaQuery = `
      SELECT 
        dna_category,
        SUM(reputation_change) as total_change,
        COUNT(*) as transaction_count
      FROM reputation_transactions 
      WHERE player_id = $1 
      AND transaction_date > COALESCE(
        (SELECT last_calculated FROM reputation_dna WHERE player_id = $1), 
        '1970-01-01'::timestamp
      )
      GROUP BY dna_category
    `;

    const dnaResult = await this.db.query(dnaQuery, [playerId]);
    const changes = dnaResult.rows;

    // Get current DNA
    const currentDNA = await this.getPlayerReputationDNA(playerId);
    if (!currentDNA) throw new Error('Reputation DNA not found');

    // Update DNA components
    const updatedDNA = { ...currentDNA };
    
    changes.forEach(change => {
      switch (change.dna_category) {
        case 'knowledge':
          updatedDNA.knowledge_dna.teaching_contributions += change.transaction_count;
          break;
        case 'social':
          updatedDNA.social_dna.helping_actions += change.transaction_count;
          break;
        case 'builder':
          updatedDNA.builder_dna.innovations_approved += Math.floor(change.transaction_count / 2);
          break;
        case 'integrity':
          updatedDNA.integrity_dna.trust_score = Math.min(100, updatedDNA.integrity_dna.trust_score + change.total_change);
          break;
      }
    });

    // Calculate overall score
    updatedDNA.overall_score = this.calculateOverallScore(updatedDNA);
    updatedDNA.civilization_rank = this.calculateCivilizationRank(updatedDNA.overall_score);

    // Update database
    const updateQuery = `
      UPDATE reputation_dna 
      SET 
        knowledge_dna = $2,
        social_dna = $3,
        builder_dna = $4,
        integrity_dna = $5,
        overall_score = $6,
        civilization_rank = $7,
        last_calculated = CURRENT_TIMESTAMP
      WHERE player_id = $1
      RETURNING *
    `;

    const result = await this.db.query(updateQuery, [
      playerId,
      JSON.stringify(updatedDNA.knowledge_dna),
      JSON.stringify(updatedDNA.social_dna),
      JSON.stringify(updatedDNA.builder_dna),
      JSON.stringify(updatedDNA.integrity_dna),
      updatedDNA.overall_score,
      updatedDNA.civilization_rank
    ]);

    return result.rows[0];
  }

  // ===================================
  // REPUTATION TRANSACTIONS
  // ===================================

  async addReputationTransaction(
    playerId: string,
    transactionType: ReputationTransaction['transaction_type'],
    reputationChange: number,
    dnaCategory: ReputationTransaction['dna_category'],
    description: string,
    referenceId?: string,
    verifiedBy?: string,
    verificationNotes?: string
  ): Promise<ReputationTransaction> {
    const query = `
      INSERT INTO reputation_transactions 
      (id, player_id, transaction_type, reputation_change, dna_category, reference_id, description, transaction_date, verified_by, verification_notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, $8, $9)
      RETURNING *
    `;

    const result = await this.db.query(query, [
      uuidv4(),
      playerId,
      transactionType,
      reputationChange,
      dnaCategory,
      referenceId,
      description,
      verifiedBy,
      verificationNotes
    ]);

    // Update DNA after transaction
    await this.updateReputationDNA(playerId);

    return result.rows[0];
  }

  async getPlayerReputationHistory(playerId: string, limit: number = 50): Promise<ReputationTransaction[]> {
    const query = `
      SELECT * FROM reputation_transactions 
      WHERE player_id = $1 
      ORDER BY transaction_date DESC 
      LIMIT $2
    `;
    const result = await this.db.query(query, [playerId, limit]);
    return result.rows;
  }

  async verifyReputationTransaction(
    transactionId: string,
    verifiedBy: string,
    verificationNotes: string
  ): Promise<ReputationTransaction> {
    const query = `
      UPDATE reputation_transactions 
      SET verified_by = $2, verification_notes = $3
      WHERE id = $1
      RETURNING *
    `;

    const result = await this.db.query(query, [transactionId, verifiedBy, verificationNotes]);
    return result.rows[0];
  }

  // ===================================
  // TRUST-BASED MARKETPLACE
  // ===================================

  async createMarketplaceListing(
    providerId: string,
    serviceType: MarketplaceListing['service_type'],
    serviceDescription: string,
    basePrice: number,
    portfolioUrl?: string
  ): Promise<MarketplaceListing> {
    // Get provider's reputation score
    const reputation = await this.getPlayerReputationDNA(providerId);
    if (!reputation) throw new Error('Provider reputation not found');

    const reputationMultiplier = this.calculateReputationMultiplier(reputation.overall_score);

    const query = `
      INSERT INTO marketplace_listings 
      (id, service_provider_id, service_type, service_description, base_price, reputation_multiplier, portfolio_url, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const result = await this.db.query(query, [
      uuidv4(),
      providerId,
      serviceType,
      serviceDescription,
      basePrice,
      reputationMultiplier,
      portfolioUrl
    ]);

    return result.rows[0];
  }

  async getMarketplaceListings(
    serviceType?: MarketplaceListing['service_type'],
    minReputation?: number,
    maxPrice?: number
  ): Promise<MarketplaceListing[]> {
    let query = `
      SELECT ml.*, p.username, p.display_name, rd.overall_score as reputation_score
      FROM marketplace_listings ml
      JOIN players p ON ml.service_provider_id = p.id
      LEFT JOIN reputation_dna rd ON ml.service_provider_id = rd.player_id
      WHERE ml.availability_status = 'available'
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (serviceType) {
      query += ` AND ml.service_type = $${paramIndex++}`;
      params.push(serviceType);
    }

    if (minReputation) {
      query += ` AND rd.overall_score >= $${paramIndex++}`;
      params.push(minReputation);
    }

    if (maxPrice) {
      query += ` AND ml.final_price <= $${paramIndex++}`;
      params.push(maxPrice);
    }

    query += ' ORDER BY ml.final_price ASC, rd.overall_score DESC LIMIT 100';

    const result = await this.db.query(query, params);
    return result.rows;
  }

  async createMarketplaceContract(
    listingId: string,
    clientId: string,
    contractTerms: Record<string, any>
  ): Promise<MarketplaceContract> {
    // Get listing details
    const listingQuery = 'SELECT * FROM marketplace_listings WHERE id = $1';
    const listingResult = await this.db.query(listingQuery, [listingId]);
    
    if (listingResult.rows.length === 0) {
      throw new Error('Listing not found');
    }

    const listing = listingResult.rows[0];

    const query = `
      INSERT INTO marketplace_contracts 
      (id, listing_id, client_id, contract_terms, agreed_price, status, created_at)
      VALUES ($1, $2, $3, $4, $5, 'pending', CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const result = await this.db.query(query, [
      uuidv4(),
      listingId,
      clientId,
      contractTerms,
      listing.final_price
    ]);

    return result.rows[0];
  }

  async completeMarketplaceContract(
    contractId: string,
    reviewRating: number,
    reviewFeedback: string
  ): Promise<MarketplaceContract> {
    const query = `
      UPDATE marketplace_contracts 
      SET 
        status = 'completed',
        completion_date = CURRENT_TIMESTAMP,
        review_rating = $2,
        review_feedback = $3
      WHERE id = $1
      RETURNING *
    `;

    const result = await this.db.query(query, [contractId, reviewRating, reviewFeedback]);
    const contract = result.rows[0];

    // Add reputation transaction for provider
    const reputationChange = reviewRating >= 4 ? 5 : reviewRating >= 3 ? 2 : -3;
    
    await this.addReputationTransaction(
      contract.service_provider_id,
      'innovation',
      reputationChange,
      'builder',
      `Completed marketplace contract with rating ${reviewRating}/5`,
      contractId
    );

    return contract;
  }

  async getPlayerMarketplaceStats(playerId: string): Promise<Record<string, any>> {
    const query = `
      SELECT 
        COUNT(DISTINCT ml.id) as total_listings,
        COUNT(DISTINCT CASE WHEN ml.availability_status = 'available' THEN ml.id END) as active_listings,
        COUNT(DISTINCT mc.id) as total_contracts,
        COUNT(DISTINCT CASE WHEN mc.status = 'completed' THEN mc.id END) as completed_contracts,
        AVG(CASE WHEN mc.review_rating IS NOT NULL THEN mc.review_rating END) as average_rating,
        COALESCE(SUM(CASE WHEN mc.status = 'completed' THEN mc.agreed_price END), 0) as total_earnings
      FROM marketplace_listings ml
      LEFT JOIN marketplace_contracts mc ON ml.id = mc.listing_id
      WHERE ml.service_provider_id = $1
    `;
    const result = await this.db.query(query, [playerId]);
    return result.rows[0];
  }

  // ===================================
  // REPUTATION MINING
  // ===================================

  async mineReputation(playerId: string, action: string): Promise<ReputationTransaction> {
    const miningActions = {
      'teach_others': { type: 'teaching' as const, change: 3, category: 'knowledge' as const },
      'solve_problems': { type: 'innovation' as const, change: 2, category: 'builder' as const },
      'create_knowledge': { type: 'teaching' as const, change: 4, category: 'knowledge' as const },
      'protect_community': { type: 'integrity_action' as const, change: 5, category: 'integrity' as const },
      'mentor_new_players': { type: 'leadership' as const, change: 3, category: 'social' as const }
    };

    const actionConfig = miningActions[action];
    if (!actionConfig) {
      throw new Error('Invalid reputation mining action');
    }

    return await this.addReputationTransaction(
      playerId,
      actionConfig.type,
      actionConfig.change,
      actionConfig.category,
      `Reputation mining: ${action}`
    );
  }

  async getReputationMiningActions(): Promise<Record<string, any>> {
    return {
      teach_others: {
        description: 'Help other players learn new skills',
        reputation_reward: 3,
        dna_category: 'knowledge',
        cooldown_minutes: 60
      },
      solve_problems: {
        description: 'Solve community challenges or technical problems',
        reputation_reward: 2,
        dna_category: 'builder',
        cooldown_minutes: 30
      },
      create_knowledge: {
        description: 'Create educational content or tutorials',
        reputation_reward: 4,
        dna_category: 'knowledge',
        cooldown_minutes: 120
      },
      protect_community: {
        description: 'Report scams or help maintain community integrity',
        reputation_reward: 5,
        dna_category: 'integrity',
        cooldown_minutes: 240
      },
      mentor_new_players: {
        description: 'Guide and help new community members',
        reputation_reward: 3,
        dna_category: 'social',
        cooldown_minutes: 45
      }
    };
  }

  // ===================================
  // UTILITY METHODS
  // ===================================

  private calculateOverallScore(dna: ReputationDNA): number {
    const knowledgeScore = Math.min(100, dna.knowledge_dna.teaching_contributions * 2 + dna.knowledge_dna.courses_completed);
    const socialScore = Math.min(100, dna.social_dna.helping_actions * 3 + dna.social_dna.mentorship_sessions * 2);
    const builderScore = Math.min(100, dna.builder_dna.innovations_approved * 5 + dna.builder_dna.tools_created * 3);
    const integrityScore = dna.integrity_dna.trust_score;

    // Weighted average (integrity has higher weight)
    const overallScore = (
      knowledgeScore * 0.25 +
      socialScore * 0.25 +
      builderScore * 0.25 +
      integrityScore * 0.25
    );

    return Math.round(overallScore * 100) / 100;
  }

  private calculateCivilizationRank(score: number): ReputationDNA['civilization_rank'] {
    if (score >= 90) return 'elder';
    if (score >= 75) return 'architect';
    if (score >= 60) return 'builder';
    if (score >= 40) return 'contributor';
    return 'explorer';
  }

  private calculateReputationMultiplier(score: number): number {
    if (score >= 90) return 2.0;
    if (score >= 75) return 1.5;
    if (score >= 60) return 1.3;
    if (score >= 40) return 1.1;
    return 1.0;
  }

  async getReputationLeaderboard(limit: number = 100): Promise<Record<string, any>[]> {
    const query = `
      SELECT 
        p.username,
        p.display_name,
        p.avatar,
        rd.overall_score,
        rd.civilization_rank,
        rd.knowledge_dna,
        rd.social_dna,
        rd.builder_dna,
        rd.integrity_dna,
        COUNT(rt.id) as total_transactions
      FROM reputation_dna rd
      JOIN players p ON rd.player_id = p.id
      LEFT JOIN reputation_transactions rt ON rd.player_id = rt.player_id
      GROUP BY rd.id, p.id
      ORDER BY rd.overall_score DESC
      LIMIT $1
    `;
    const result = await this.db.query(query, [limit]);
    return result.rows;
  }

  async getReputationEconomyStats(): Promise<Record<string, any>> {
    const query = `
      SELECT 
        COUNT(DISTINCT rd.player_id) as total_players_with_reputation,
        AVG(rd.overall_score) as average_reputation_score,
        COUNT(DISTINCT CASE WHEN rd.civilization_rank = 'elder' THEN rd.player_id END) as elders,
        COUNT(DISTINCT CASE WHEN rd.civilization_rank = 'architect' THEN rd.player_id END) as architects,
        COUNT(DISTINCT CASE WHEN rd.civilization_rank = 'builder' THEN rd.player_id END) as builders,
        COUNT(DISTINCT ml.id) as active_marketplace_listings,
        COUNT(DISTINCT mc.id) as total_marketplace_contracts,
        COALESCE(SUM(mc.agreed_price), 0) as total_marketplace_volume,
        COUNT(DISTINCT rt.id) as total_reputation_transactions
      FROM reputation_dna rd
      LEFT JOIN marketplace_listings ml ON rd.player_id = ml.service_provider_id AND ml.availability_status = 'available'
      LEFT JOIN marketplace_contracts mc ON ml.id = mc.listing_id
      LEFT JOIN reputation_transactions rt ON rd.player_id = rt.player_id
    `;
    const result = await this.db.query(query);
    return result.rows[0];
  }
}
