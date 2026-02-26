import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

// ===================================
// WALL OF FAME INTERFACES
// ===================================

export interface LegacyHall {
  id: string;
  name: string;
  description: string;
  category: 'founders' | 'genius' | 'guardians' | 'impact' | 'diamond_hands';
  icon_url: string;
  entry_criteria: Record<string, any>;
  max_capacity?: number;
  is_active: boolean;
  created_at: Date;
}

export interface WallOfFameEntry {
  id: string;
  player_id: string;
  hall_id: string;
  achievement_type: 'top_earner' | 'top_helper' | 'innovator' | 'educator' | 'community_protector';
  achievement_description: string;
  achievement_value: number;
  rank_position?: number;
  induction_date: Date;
  is_active: boolean;
}

export interface SoulboundNFT {
  id: string;
  player_id: string;
  nft_type: 'achievement' | 'reputation_level' | 'special_recognition';
  nft_name: string;
  description: string;
  metadata: Record<string, any>;
  token_id?: string;
  minted_at: Date;
  is_transferable: boolean;
}

export interface CivilizationTimeline {
  id: string;
  event_type: 'milestone' | 'player_revolution' | 'economic_achievement' | 'governance_vote';
  title: string;
  description: string;
  event_data: Record<string, any>;
  involved_players: string[];
  significance_level: number; // 1-10
  event_date: Date;
  created_at: Date;
}

// ===================================
// WALL OF FAME SERVICE
// ===================================

export class WallOfFameService {
  constructor(private db: Pool) {}

  // ===================================
  // LEGACY HALLS MANAGEMENT
  // ===================================

  async getAllLegacyHalls(): Promise<LegacyHall[]> {
    const query = 'SELECT * FROM legacy_halls WHERE is_active = true ORDER BY name';
    const result = await this.db.query(query);
    return result.rows;
  }

  async getLegacyHallById(id: string): Promise<LegacyHall | null> {
    const query = 'SELECT * FROM legacy_halls WHERE id = $1 AND is_active = true';
    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
  }

  async getHallMembers(hallId: string): Promise<WallOfFameEntry[]> {
    const query = `
      SELECT wofe.*, p.username, p.display_name, p.avatar
      FROM wall_of_fame_entries wofe
      JOIN players p ON wofe.player_id = p.id
      WHERE wofe.hall_id = $1 AND wofe.is_active = true
      ORDER BY wofe.rank_position ASC, wofe.induction_date DESC
    `;
    const result = await this.db.query(query, [hallId]);
    return result.rows;
  }

  async checkHallEligibility(playerId: string, hallId: string): Promise<boolean> {
    const hall = await this.getLegacyHallById(hallId);
    if (!hall) return false;

    const criteria = hall.entry_criteria;
    let eligible = true;

    // Check various eligibility criteria based on hall category
    switch (hall.category) {
      case 'founders':
        eligible = await this.checkFoundersEligibility(playerId, criteria);
        break;
      case 'genius':
        eligible = await this.checkGeniusEligibility(playerId, criteria);
        break;
      case 'guardians':
        eligible = await this.checkGuardiansEligibility(playerId, criteria);
        break;
      case 'impact':
        eligible = await this.checkImpactEligibility(playerId, criteria);
        break;
      case 'diamond_hands':
        eligible = await this.checkDiamondHandsEligibility(playerId, criteria);
        break;
    }

    return eligible;
  }

  async inductPlayerIntoHall(
    playerId: string,
    hallId: string,
    achievementType: WallOfFameEntry['achievement_type'],
    achievementDescription: string,
    achievementValue: number
  ): Promise<WallOfFameEntry> {
    const eligibilityCheck = await this.checkHallEligibility(playerId, hallId);
    if (!eligibilityCheck) {
      throw new Error('Player does not meet eligibility criteria for this hall');
    }

    // Check if already inducted
    const existingQuery = `
      SELECT id FROM wall_of_fame_entries 
      WHERE player_id = $1 AND hall_id = $2 AND achievement_type = $3
    `;
    const existing = await this.db.query(existingQuery, [playerId, hallId, achievementType]);
    
    if (existing.rows.length > 0) {
      throw new Error('Player already inducted for this achievement type');
    }

    // Get next rank position
    const rankQuery = `
      SELECT COALESCE(MAX(rank_position), 0) + 1 as next_rank
      FROM wall_of_fame_entries 
      WHERE hall_id = $1 AND is_active = true
    `;
    const rankResult = await this.db.query(rankQuery, [hallId]);
    const nextRank = rankResult.rows[0].next_rank;

    const insertQuery = `
      INSERT INTO wall_of_fame_entries 
      (id, player_id, hall_id, achievement_type, achievement_description, achievement_value, rank_position, induction_date, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, true)
      RETURNING *
    `;

    const result = await this.db.query(insertQuery, [
      uuidv4(), playerId, hallId, achievementType, achievementDescription, achievementValue, nextRank
    ]);

    // Mint soulbound NFT for induction
    await this.mintSoulboundNFT(
      playerId,
      'achievement',
      `${achievementType}_hall_induction`,
      `Inducted into ${achievementType} Hall of Fame`,
      {
        hall_id: hallId,
        achievement_type: achievementType,
        rank_position: nextRank,
        induction_date: new Date().toISOString()
      }
    );

    // Add to civilization timeline
    await this.addTimelineEvent(
      'player_revolution',
      `${achievementType} Hall Induction`,
      `Player has been inducted into the ${achievementType} Hall of Fame`,
      { achievement_type: achievementType, hall_id: hallId, rank: nextRank },
      [playerId],
      8 // High significance
    );

    return result.rows[0];
  }

  // ===================================
  // SOULBOUND NFT MANAGEMENT
  // ===================================

  async getPlayerSoulboundNFTs(playerId: string): Promise<SoulboundNFT[]> {
    const query = `
      SELECT * FROM soulbound_nfts 
      WHERE player_id = $1 
      ORDER BY minted_at DESC
    `;
    const result = await this.db.query(query, [playerId]);
    return result.rows;
  }

  async mintSoulboundNFT(
    playerId: string,
    nftType: SoulboundNFT['nft_type'],
    nftName: string,
    description: string,
    metadata: Record<string, any>
  ): Promise<SoulboundNFT> {
    const tokenId = this.generateTokenId(playerId, nftType, nftName);

    const query = `
      INSERT INTO soulbound_nfts 
      (id, player_id, nft_type, nft_name, description, metadata, token_id, minted_at, is_transferable)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, false)
      RETURNING *
    `;

    const result = await this.db.query(query, [
      uuidv4(), playerId, nftType, nftName, description, metadata, tokenId
    ]);

    return result.rows[0];
  }

  async getNFTCollectionStats(): Promise<Record<string, any>> {
    const query = `
      SELECT 
        nft_type,
        COUNT(*) as total_minted,
        COUNT(DISTINCT player_id) as unique_holders,
        MIN(minted_at) as first_minted,
        MAX(minted_at) as last_minted
      FROM soulbound_nfts
      GROUP BY nft_type
      ORDER BY total_minted DESC
    `;
    const result = await this.db.query(query);
    return result.rows;
  }

  // ===================================
  // CIVILIZATION TIMELINE
  // ===================================

  async getTimelineEvents(limit: number = 50, offset: number = 0): Promise<CivilizationTimeline[]> {
    const query = `
      SELECT ct.*, 
             array_agg(DISTINCT p.username) as player_names
      FROM civilization_timeline ct
      LEFT JOIN players p ON p.id = ANY(ct.involved_players)
      GROUP BY ct.id
      ORDER BY ct.significance_level DESC, ct.event_date DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await this.db.query(query, [limit, offset]);
    return result.rows;
  }

  async addTimelineEvent(
    eventType: CivilizationTimeline['event_type'],
    title: string,
    description: string,
    eventData: Record<string, any>,
    involvedPlayers: string[] = [],
    significanceLevel: number = 5
  ): Promise<CivilizationTimeline> {
    const query = `
      INSERT INTO civilization_timeline 
      (id, event_type, title, description, event_data, involved_players, significance_level, event_date, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const result = await this.db.query(query, [
      uuidv4(), eventType, title, description, eventData, involvedPlayers, significanceLevel
    ]);

    return result.rows[0];
  }

  async getPlayerTimelineHistory(playerId: string): Promise<CivilizationTimeline[]> {
    const query = `
      SELECT * FROM civilization_timeline 
      WHERE $1 = ANY(involved_players)
      ORDER BY event_date DESC
      LIMIT 20
    `;
    const result = await this.db.query(query, [playerId]);
    return result.rows;
  }

  // ===================================
  // AUTOMATIC INDUCTION SYSTEM
  // ===================================

  async processAutomaticInductions(): Promise<void> {
    const halls = await this.getAllLegacyHalls();
    
    for (const hall of halls) {
      await this.processHallInductions(hall);
    }
  }

  private async processHallInductions(hall: LegacyHall): Promise<void> {
    const criteria = hall.entry_criteria;
    
    switch (hall.category) {
      case 'top_earner':
        await this.processTopEarnerInductions(hall);
        break;
      case 'top_helper':
        await this.processTopHelperInductions(hall);
        break;
      case 'innovator':
        await this.processInnovatorInductions(hall);
        break;
      case 'educator':
        await this.processEducatorInductions(hall);
        break;
      case 'community_protector':
        await this.processCommunityProtectorInductions(hall);
        break;
    }
  }

  private async processTopEarnerInductions(hall: LegacyHall): Promise<void> {
    const query = `
      SELECT p.id, p.username, p.total_earned
      FROM players p
      WHERE p.id NOT IN (
        SELECT DISTINCT player_id FROM wall_of_fame_entries 
        WHERE hall_id = $1 AND achievement_type = 'top_earner'
      )
      ORDER BY p.total_earned DESC
      LIMIT 10
    `;
    
    const result = await this.db.query(query, [hall.id]);
    
    for (let i = 0; i < result.rows.length; i++) {
      const player = result.rows[i];
      await this.inductPlayerIntoHall(
        player.id,
        hall.id,
        'top_earner',
        `Top Earner Rank #${i + 1}`,
        player.total_earned
      );
    }
  }

  private async processTopHelperInductions(hall: LegacyHall): Promise<void> {
    // This would integrate with community help tracking
    // For now, using reputation transactions as proxy
    const query = `
      SELECT rt.player_id, COUNT(*) as help_count
      FROM reputation_transactions rt
      WHERE rt.transaction_type = 'helping'
      AND rt.player_id NOT IN (
        SELECT DISTINCT player_id FROM wall_of_fame_entries 
        WHERE hall_id = $1 AND achievement_type = 'top_helper'
      )
      GROUP BY rt.player_id
      ORDER BY help_count DESC
      LIMIT 10
    `;
    
    const result = await this.db.query(query, [hall.id]);
    
    for (let i = 0; i < result.rows.length; i++) {
      const player = result.rows[i];
      await this.inductPlayerIntoHall(
        player.player_id,
        hall.id,
        'top_helper',
        `Community Helper Rank #${i + 1}`,
        player.help_count
      );
    }
  }

  private async processInnovatorInductions(hall: LegacyHall): Promise<void> {
    const query = `
      SELECT isub.player_id, COUNT(*) as innovation_count, AVG(isub.review_score) as avg_score
      FROM innovation_submissions isub
      WHERE isub.status = 'approved'
      AND isub.player_id NOT IN (
        SELECT DISTINCT player_id FROM wall_of_fame_entries 
        WHERE hall_id = $1 AND achievement_type = 'innovator'
      )
      GROUP BY isub.player_id
      HAVING COUNT(*) >= 3 AND AVG(isub.review_score) >= 80
      ORDER BY innovation_count DESC, avg_score DESC
      LIMIT 10
    `;
    
    const result = await this.db.query(query, [hall.id]);
    
    for (const player of result.rows) {
      await this.inductPlayerIntoHall(
        player.player_id,
        hall.id,
        'innovator',
        `Innovation Master (${player.innovation_count} innovations)`,
        player.innovation_count
      );
    }
  }

  private async processEducatorInductions(hall: LegacyHall): Promise<void> {
    const query = `
      SELECT pap.player_id, COUNT(*) as courses_taught
      FROM player_academy_progress pap
      WHERE pap.status = 'completed'
      AND pap.player_id NOT IN (
        SELECT DISTINCT player_id FROM wall_of_fame_entries 
        WHERE hall_id = $1 AND achievement_type = 'educator'
      )
      GROUP BY pap.player_id
      HAVING COUNT(*) >= 10
      ORDER BY courses_taught DESC
      LIMIT 10
    `;
    
    const result = await this.db.query(query, [hall.id]);
    
    for (const player of result.rows) {
      await this.inductPlayerIntoHall(
        player.player_id,
        hall.id,
        'educator',
        `Master Educator (${player.courses_taught} courses completed)`,
        player.courses_taught
      );
    }
  }

  private async processCommunityProtectorInductions(hall: LegacyHall): Promise<void> {
    // This would integrate with moderation/security systems
    // For now, using integrity DNA as proxy
    const query = `
      SELECT rd.player_id, (rd.integrity_dna->>'score')::decimal as integrity_score
      FROM reputation_dna rd
      WHERE (rd.integrity_dna->>'score')::decimal >= 95
      AND rd.player_id NOT IN (
        SELECT DISTINCT player_id FROM wall_of_fame_entries 
        WHERE hall_id = $1 AND achievement_type = 'community_protector'
      )
      ORDER BY integrity_score DESC
      LIMIT 10
    `;
    
    const result = await this.db.query(query, [hall.id]);
    
    for (const player of result.rows) {
      await this.inductPlayerIntoHall(
        player.player_id,
        hall.id,
        'community_protector',
        `Community Guardian (Integrity: ${player.integrity_score})`,
        player.integrity_score
      );
    }
  }

  // ===================================
  // ELIGIBILITY CHECK METHODS
  // ===================================

  private async checkFoundersEligibility(playerId: string, criteria: Record<string, any>): Promise<boolean> {
    const query = `
      SELECT joined_at FROM players WHERE id = $1
    `;
    const result = await this.db.query(query, [playerId]);
    
    if (result.rows.length === 0) return false;
    
    const joinedDate = new Date(result.rows[0].joined_at);
    const cutoffDate = new Date(criteria.joined_before);
    
    return joinedDate <= cutoffDate;
  }

  private async checkGeniusEligibility(playerId: string, criteria: Record<string, any>): Promise<boolean> {
    const query = `
      SELECT 
        COUNT(*) as innovation_count,
        AVG(review_score) as avg_score
      FROM innovation_submissions 
      WHERE player_id = $1 AND status = 'approved'
    `;
    const result = await this.db.query(query, [playerId]);
    
    if (result.rows.length === 0) return false;
    
    const stats = result.rows[0];
    return stats.innovation_count >= criteria.innovations_approved && 
           stats.avg_score >= criteria.average_score;
  }

  private async checkGuardiansEligibility(playerId: string, criteria: Record<string, any>): Promise<boolean> {
    // This would integrate with moderation systems
    // For now, checking reputation integrity
    const query = `
      SELECT (integrity_dna->>'score')::decimal as integrity_score
      FROM reputation_dna 
      WHERE player_id = $1
    `;
    const result = await this.db.query(query, [playerId]);
    
    if (result.rows.length === 0) return false;
    
    return result.rows[0].integrity_score >= criteria.integrity_score;
  }

  private async checkImpactEligibility(playerId: string, criteria: Record<string, any>): Promise<boolean> {
    // This would integrate with social impact tracking
    // For now, checking mission participations
    const query = `
      SELECT COUNT(*) as mission_count
      FROM mission_participations mp
      JOIN civilization_missions cm ON mp.mission_id = cm.id
      WHERE mp.player_id = $1 AND cm.mission_type = 'social_impact'
    `;
    const result = await this.db.query(query, [playerId]);
    
    return result.rows[0].mission_count >= criteria.missions_completed;
  }

  private async checkDiamondHandsEligibility(playerId: string, criteria: Record<string, any>): Promise<boolean> {
    const query = `
      SELECT 
        EXTRACT(DAYS FROM CURRENT_TIMESTAMP - joined_at) as days_active,
        last_active_at
      FROM players 
      WHERE id = $1
    `;
    const result = await this.db.query(query, [playerId]);
    
    if (result.rows.length === 0) return false;
    
    const stats = result.rows[0];
    return stats.days_active >= criteria.days_active;
  }

  // ===================================
  // UTILITY METHODS
  // ===================================

  private generateTokenId(playerId: string, nftType: string, nftName: string): string {
    const timestamp = Date.now();
    const hash = Buffer.from(`${playerId}-${nftType}-${nftName}-${timestamp}`).toString('base64');
    return `PP_${hash.substring(0, 16)}`;
  }

  async getPlayerWallOfFameStats(playerId: string): Promise<Record<string, any>> {
    const query = `
      SELECT 
        COUNT(DISTINCT wofe.id) as total_inductions,
        COUNT(DISTINCT wofe.hall_id) as halls_represented,
        COUNT(DISTINCT snft.id) as soulbound_nfts,
        MAX(wofe.rank_position) as highest_rank,
        COUNT(DISTINCT ct.id) as timeline_appearances
      FROM wall_of_fame_entries wofe
      LEFT JOIN soulbound_nfts snft ON wofe.player_id = snft.player_id
      LEFT JOIN civilization_timeline ct ON $1 = ANY(ct.involved_players)
      WHERE wofe.player_id = $1 AND wofe.is_active = true
    `;
    const result = await this.db.query(query, [playerId]);
    return result.rows[0];
  }

  async getWallOfFameLeaderboard(hallId?: string): Promise<Record<string, any>[]> {
    let query = `
      SELECT 
        p.username,
        p.display_name,
        p.avatar,
        lh.name as hall_name,
        COUNT(wofe.id) as total_inductions,
        MIN(wofe.rank_position) as best_rank,
        MAX(wofe.achievement_value) as highest_achievement
      FROM wall_of_fame_entries wofe
      JOIN players p ON wofe.player_id = p.id
      JOIN legacy_halls lh ON wofe.hall_id = lh.id
      WHERE wofe.is_active = true
    `;

    const params: any[] = [];
    
    if (hallId) {
      query += ' AND wofe.hall_id = $1';
      params.push(hallId);
    }

    query += `
      GROUP BY p.id, p.username, p.display_name, p.avatar, lh.name
      ORDER BY total_inductions DESC, best_rank ASC
      LIMIT 100
    `;

    const result = await this.db.query(query, params);
    return result.rows;
  }
}
