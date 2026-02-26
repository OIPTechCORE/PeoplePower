import { Pool } from 'pg';
import { 
  StarsEcosystem,
  DiamondsEcosystem,
  GiftsEcosystem,
  MarketplaceEcosystem,
  CharityEcosystem,
  LeaderboardEcosystem,
  TasksBoardEcosystem
} from '../../../shared/types';

/**
 * Centralized Ecosystem Service
 * Provides common operations across all ecosystems
 */
export class EcosystemService {
  constructor(private pool: Pool) {}

  // ==================== COMMON OPERATIONS ====================

  /**
   * Get all ecosystems for a player
   */
  async getAllPlayerEcosystems(playerId: string): Promise<{
    stars?: StarsEcosystem;
    diamonds?: DiamondsEcosystem;
    gifts?: GiftsEcosystem;
    marketplace?: MarketplaceEcosystem;
    charity?: CharityEcosystem;
    leaderboard?: LeaderboardEcosystem;
    tasksboard?: TasksBoardEcosystem;
  }> {
    try {
      const [
        stars,
        diamonds,
        gifts,
        marketplace,
        charity,
        leaderboard,
        tasksboard
      ] = await Promise.all([
        this.getPlayerEcosystem('stars_ecosystems', playerId),
        this.getPlayerEcosystem('diamonds_ecosystems', playerId),
        this.getPlayerEcosystem('gifts_ecosystems', playerId),
        this.getPlayerEcosystem('marketplace_ecosystems', playerId),
        this.getPlayerEcosystem('charity_ecosystems', playerId),
        this.getPlayerEcosystem('leaderboard_ecosystems', playerId),
        this.getPlayerEcosystem('tasksboard_ecosystems', playerId)
      ]);

      return {
        stars: stars as StarsEcosystem,
        diamonds: diamonds as DiamondsEcosystem,
        gifts: gifts as GiftsEcosystem,
        marketplace: marketplace as MarketplaceEcosystem,
        charity: charity as CharityEcosystem,
        leaderboard: leaderboard as LeaderboardEcosystem,
        tasksboard: tasksboard as TasksBoardEcosystem
      };
    } catch (error) {
      console.error('Error getting player ecosystems:', error);
      throw error;
    }
  }

  /**
   * Initialize missing ecosystems for a player
   */
  async initializePlayerEcosystems(playerId: string): Promise<void> {
    try {
      const ecosystems = [
        { table: 'stars_ecosystems', defaults: { star_rank: 'NOVICE', star_level: 1 } },
        { table: 'diamonds_ecosystems', defaults: { diamond_rank: 'PROSPECTOR', diamond_level: 1, mining_level: 1, crafting_level: 1, premium_status: 'NONE' } },
        { table: 'gifts_ecosystems', defaults: { gift_rank: 'GIVER' } },
        { table: 'marketplace_ecosystems', defaults: { trader_rank: 'NEWCOMER', verification_level: 'BASIC', has_storefront: false } },
        { table: 'charity_ecosystems', defaults: { giver_rank: 'HELPER', generosity_level: 'EMERGING' } },
        { table: 'leaderboard_ecosystems', defaults: {} },
        { table: 'tasksboard_ecosystems', defaults: {} }
      ];

      for (const ecosystem of ecosystems) {
        await this.ensureEcosystemExists(playerId, ecosystem.table, ecosystem.defaults);
      }
    } catch (error) {
      console.error('Error initializing player ecosystems:', error);
      throw error;
    }
  }

  /**
   * Get ecosystem statistics across all systems
   */
  async getGlobalEcosystemStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    ecosystemStats: Array<{
      name: string;
      totalUsers: number;
      activeUsers: number;
      engagement: number;
    }>;
  }> {
    try {
      // Get total users
      const totalUsersResult = await this.pool.query(
        'SELECT COUNT(DISTINCT player_id) as total FROM (SELECT player_id FROM stars_ecosystems UNION ALL SELECT player_id FROM diamonds_ecosystems UNION ALL SELECT player_id FROM gifts_ecosystems) as all_players'
      );

      // Get active users (last 7 days)
      const activeUsersResult = await this.pool.query(
        `SELECT COUNT(DISTINCT player_id) as active FROM (
          SELECT player_id FROM stars_ecosystems WHERE updated_at > NOW() - INTERVAL '7 days'
          UNION ALL
          SELECT player_id FROM diamonds_ecosystems WHERE updated_at > NOW() - INTERVAL '7 days'
          UNION ALL
          SELECT player_id FROM gifts_ecosystems WHERE updated_at > NOW() - INTERVAL '7 days'
        ) as active_players`
      );

      // Get individual ecosystem stats
      const ecosystemQueries = [
        { name: 'Stars', table: 'stars_ecosystems' },
        { name: 'Diamonds', table: 'diamonds_ecosystems' },
        { name: 'Gifts', table: 'gifts_ecosystems' },
        { name: 'Marketplace', table: 'marketplace_ecosystems' },
        { name: 'Charity', table: 'charity_ecosystems' },
        { name: 'Leaderboard', table: 'leaderboard_ecosystems' },
        { name: 'TasksBoard', table: 'tasksboard_ecosystems' }
      ];

      const ecosystemStats = await Promise.all(
        ecosystemQueries.map(async ({ name, table }) => {
          const result = await this.pool.query(
            `SELECT 
              COUNT(*) as total_users,
              COUNT(CASE WHEN updated_at > NOW() - INTERVAL '7 days' THEN 1 END) as active_users
            FROM ${table}`
          );

          const total = parseInt(result.rows[0].total_users);
          const active = parseInt(result.rows[0].active_users);
          const engagement = total > 0 ? (active / total) * 100 : 0;

          return {
            name,
            totalUsers: total,
            activeUsers: active,
            engagement: Math.round(engagement * 100) / 100
          };
        })
      );

      return {
        totalUsers: parseInt(totalUsersResult.rows[0].total),
        activeUsers: parseInt(activeUsersResult.rows[0].active),
        ecosystemStats
      };
    } catch (error) {
      console.error('Error getting global ecosystem stats:', error);
      throw error;
    }
  }

  /**
   * Calculate cross-ecosystem player score
   */
  async calculatePlayerScore(playerId: string): Promise<{
    totalScore: number;
    ecosystemScores: Array<{
      ecosystem: string;
      score: number;
      weight: number;
      weightedScore: number;
    }>;
    rank: string;
  }> {
    try {
      const ecosystems = await this.getAllPlayerEcosystems(playerId);
      
      const ecosystemScores = [
        {
          ecosystem: 'Stars',
          score: this.calculateStarsScore(ecosystems.stars),
          weight: 0.15
        },
        {
          ecosystem: 'Diamonds',
          score: this.calculateDiamondsScore(ecosystems.diamonds),
          weight: 0.20
        },
        {
          ecosystem: 'Gifts',
          score: this.calculateGiftsScore(ecosystems.gifts),
          weight: 0.15
        },
        {
          ecosystem: 'Marketplace',
          score: this.calculateMarketplaceScore(ecosystems.marketplace),
          weight: 0.15
        },
        {
          ecosystem: 'Charity',
          score: this.calculateCharityScore(ecosystems.charity),
          weight: 0.20
        },
        {
          ecosystem: 'Leaderboard',
          score: this.calculateLeaderboardScore(ecosystems.leaderboard),
          weight: 0.10
        },
        {
          ecosystem: 'TasksBoard',
          score: this.calculateTasksBoardScore(ecosystems.tasksboard),
          weight: 0.05
        }
      ];

      const weightedScores = ecosystemScores.map(es => ({
        ...es,
        weightedScore: es.score * es.weight
      }));

      const totalScore = weightedScores.reduce((sum, es) => sum + es.weightedScore, 0);
      const rank = this.calculatePlayerRank(totalScore);

      return {
        totalScore: Math.round(totalScore * 100) / 100,
        ecosystemScores: weightedScores,
        rank
      };
    } catch (error) {
      console.error('Error calculating player score:', error);
      throw error;
    }
  }

  /**
   * Get leaderboard based on cross-ecosystem scores
   */
  async getCrossEcosystemLeaderboard(limit: number = 100): Promise<Array<{
    playerId: string;
    totalScore: number;
    rank: number;
    ecosystemScores: any;
  }>> {
    try {
      // This would typically use a materialized view or cached data
      // For now, we'll calculate on the fly (not optimized for production)
      const allPlayersResult = await this.pool.query(
        'SELECT DISTINCT player_id FROM stars_ecosystems LIMIT 1000'
      );

      const playerScores = await Promise.all(
        allPlayersResult.rows.map(async (row) => {
          const score = await this.calculatePlayerScore(row.player_id);
          return {
            playerId: row.player_id,
            totalScore: score.totalScore,
            ecosystemScores: score.ecosystemScores
          };
        })
      );

      // Sort by total score and add ranks
      playerScores.sort((a, b) => b.totalScore - a.totalScore);
      
      return playerScores.slice(0, limit).map((player, index) => ({
        ...player,
        rank: index + 1
      }));
    } catch (error) {
      console.error('Error getting cross-ecosystem leaderboard:', error);
      throw error;
    }
  }

  // ==================== UTILITY METHODS ====================

  private async getPlayerEcosystem(table: string, playerId: string): Promise<any> {
    const result = await this.pool.query(
      `SELECT * FROM ${table} WHERE player_id = $1`,
      [playerId]
    );
    return result.rows[0] || null;
  }

  private async ensureEcosystemExists(playerId: string, table: string, defaults: any): Promise<void> {
    const existing = await this.getPlayerEcosystem(table, playerId);
    
    if (!existing) {
      const columns = Object.keys(defaults);
      const values = Object.values(defaults);
      const placeholders = values.map((_, index) => `$${index + 2}`).join(', ');
      
      await this.pool.query(
        `INSERT INTO ${table} (player_id, ${columns.join(', ')}, created_at, updated_at) 
         VALUES ($1, ${placeholders}, NOW(), NOW())`,
        [playerId, ...values]
      );
    }
  }

  private calculateStarsScore(stars: StarsEcosystem | null): number {
    if (!stars) return 0;
    
    const rankScore = this.getRankScore(stars.starRank);
    const starsScore = Math.min(stars.starsCollected / 1000, 1) * 30;
    const powerScore = Math.min(stars.starPower / 1000, 1) * 20;
    
    return rankScore + starsScore + powerScore;
  }

  private calculateDiamondsScore(diamonds: DiamondsEcosystem | null): number {
    if (!diamonds) return 0;
    
    const rankScore = this.getRankScore(diamonds.diamondRank);
    const diamondsScore = Math.min(diamonds.diamondsCollected / 500, 1) * 30;
    const miningScore = Math.min(diamonds.miningLevel / 10, 1) * 20;
    
    return rankScore + diamondsScore + miningScore;
  }

  private calculateGiftsScore(gifts: GiftsEcosystem | null): number {
    if (!gifts) return 0;
    
    const rankScore = this.getRankScore(gifts.giftRank);
    const giftsScore = Math.min(gifts.giftsSent / 100, 1) * 30;
    const powerScore = Math.min(gifts.giftPower / 500, 1) * 20;
    
    return rankScore + giftsScore + powerScore;
  }

  private calculateMarketplaceScore(marketplace: MarketplaceEcosystem | null): number {
    if (!marketplace) return 0;
    
    const rankScore = this.getRankScore(marketplace.traderRank);
    const reputationScore = Math.min(marketplace.reputationScore / 1000, 1) * 30;
    const storefrontScore = marketplace.hasStorefront ? 20 : 0;
    
    return rankScore + reputationScore + storefrontScore;
  }

  private calculateCharityScore(charity: CharityEcosystem | null): number {
    if (!charity) return 0;
    
    const rankScore = this.getRankScore(charity.giverRank);
    const donationScore = Math.min(charity.totalDonated / 1000, 1) * 30;
    const impactScore = Math.min(charity.impactScore / 500, 1) * 20;
    
    return rankScore + donationScore + impactScore;
  }

  private calculateLeaderboardScore(leaderboard: LeaderboardEcosystem | null): number {
    if (!leaderboard) return 0;
    
    const pointsScore = Math.min(leaderboard.totalPoints / 10000, 1) * 40;
    const winRateScore = (leaderboard.winRate / 100) * 30;
    const streakScore = Math.min(leaderboard.bestStreak / 10, 1) * 30;
    
    return pointsScore + winRateScore + streakScore;
  }

  private calculateTasksBoardScore(tasksboard: TasksBoardEcosystem | null): number {
    if (!tasksboard) return 0;
    
    const completionScore = (tasksboard.completionRate / 100) * 40;
    const productivityScore = Math.min(tasksboard.productivityScore / 100, 1) * 30;
    const tasksScore = Math.min(tasksboard.totalTasksCompleted / 100, 1) * 30;
    
    return completionScore + productivityScore + tasksScore;
  }

  private getRankScore(rank: string): number {
    const rankScores: { [key: string]: number } = {
      'NOVICE': 10, 'APPRENTICE': 15, 'JOURNEYMAN': 20, 'MASTER': 30,
      'GRANDMASTER': 40, 'LEGEND': 45, 'CELESTIAL': 50,
      'PROSPECTOR': 10, 'MINER': 15, 'GEMOLOGIST': 20, 'JEWELER': 30,
      'MASTER_CRAFTER': 40, 'DIAMOND_BARON': 45, 'DIAMOND_LEGEND': 50,
      'GIVER': 10, 'GENEROUS': 15, 'PHILANTHROPIST': 20, 'BENEFACTOR': 30,
      'GIFT_MASTER': 40, 'LEGENDARY_GIVER': 45, 'SANTA_CLAUSE': 50,
      'NEWCOMER': 10, 'TRADER': 15, 'MERCHANT': 20, 'ENTREPRENEUR': 30,
      'BUSINESS_OWNER': 40, 'MARKET_MASTER': 45, 'TRADING_LEGEND': 50,
      'HELPER': 10, 'SUPPORTER': 15, 'CONTRIBUTOR': 20, 'PHILANTHROPIST': 30,
      'BENEFACTOR': 40, 'HUMANITARIAN': 45, 'CHAMPION': 50, 'LEGEND': 60
    };
    
    return rankScores[rank] || 0;
  }

  private calculatePlayerRank(score: number): string {
    if (score >= 450) return 'LEGENDARY';
    if (score >= 350) return 'MASTER';
    if (score >= 250) return 'EXPERT';
    if (score >= 150) return 'ADVANCED';
    if (score >= 50) return 'INTERMEDIATE';
    return 'BEGINNER';
  }

  // ==================== ANALYTICS ====================

  /**
   * Get ecosystem engagement trends
   */
  async getEngagementTrends(days: number = 30): Promise<{
    dailyEngagement: Array<{
      date: string;
      activeUsers: number;
      totalInteractions: number;
    }>;
    ecosystemGrowth: Array<{
      ecosystem: string;
      growth: number;
      newUsers: number;
    }>;
  }> {
    try {
      // Daily engagement
      const dailyEngagementResult = await this.pool.query(
        `SELECT 
          DATE_TRUNC('day', updated_at) as date,
          COUNT(DISTINCT player_id) as active_users,
          COUNT(*) as total_interactions
        FROM (
          SELECT player_id, updated_at FROM stars_ecosystems WHERE updated_at > NOW() - INTERVAL '${days} days'
          UNION ALL
          SELECT player_id, updated_at FROM diamonds_ecosystems WHERE updated_at > NOW() - INTERVAL '${days} days'
          UNION ALL
          SELECT player_id, updated_at FROM gifts_ecosystems WHERE updated_at > NOW() - INTERVAL '${days} days'
        ) as all_activity
        GROUP BY DATE_TRUNC('day', updated_at)
        ORDER BY date DESC`
      );

      // Ecosystem growth
      const ecosystemGrowthResult = await this.pool.query(
        `SELECT 
          'Stars' as ecosystem,
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '${days} days' THEN 1 END) as new_users,
          COUNT(*) as total_users
        FROM stars_ecosystems
        UNION ALL
        SELECT 
          'Diamonds' as ecosystem,
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '${days} days' THEN 1 END) as new_users,
          COUNT(*) as total_users
        FROM diamonds_ecosystems`
      );

      const ecosystemGrowth = ecosystemGrowthResult.rows.map(row => ({
        ecosystem: row.ecosystem,
        growth: row.total_users > 0 ? (row.new_users / row.total_users) * 100 : 0,
        newUsers: parseInt(row.new_users)
      }));

      return {
        dailyEngagement: dailyEngagementResult.rows,
        ecosystemGrowth
      };
    } catch (error) {
      console.error('Error getting engagement trends:', error);
      throw error;
    }
  }

  /**
   * Get ecosystem performance metrics
   */
  async getPerformanceMetrics(): Promise<{
    ecosystemPerformance: Array<{
      ecosystem: string;
      totalUsers: number;
      activeUsers: number;
      retentionRate: number;
      averageEngagement: number;
    }>;
    systemHealth: {
      overallHealth: number;
      issues: string[];
    };
  }> {
    try {
      const ecosystems = ['stars', 'diamonds', 'gifts', 'marketplace', 'charity', 'leaderboard', 'tasksboard'];
      
      const ecosystemPerformance = await Promise.all(
        ecosystems.map(async (ecosystem) => {
          const result = await this.pool.query(
            `SELECT 
              COUNT(*) as total_users,
              COUNT(CASE WHEN updated_at > NOW() - INTERVAL '7 days' THEN 1 END) as active_users,
              COUNT(CASE WHEN updated_at > NOW() - INTERVAL '30 days' THEN 1 END) as retained_users
            FROM ${ecosystem}_ecosystems`
          );

          const total = parseInt(result.rows[0].total_users);
          const active = parseInt(result.rows[0].active_users);
          const retained = parseInt(result.rows[0].retained_users);
          
          return {
            ecosystem: ecosystem.charAt(0).toUpperCase() + ecosystem.slice(1),
            totalUsers: total,
            activeUsers: active,
            retentionRate: total > 0 ? (retained / total) * 100 : 0,
            averageEngagement: total > 0 ? (active / total) * 100 : 0
          };
        })
      );

      // System health calculation
      const avgRetention = ecosystemPerformance.reduce((sum, ep) => sum + ep.retentionRate, 0) / ecosystemPerformance.length;
      const avgEngagement = ecosystemPerformance.reduce((sum, ep) => sum + ep.averageEngagement, 0) / ecosystemPerformance.length;
      
      const overallHealth = (avgRetention + avgEngagement) / 2;
      const issues: string[] = [];
      
      if (overallHealth < 50) issues.push('Low overall system health');
      if (avgRetention < 60) issues.push('Poor user retention');
      if (avgEngagement < 40) issues.push('Low user engagement');

      return {
        ecosystemPerformance,
        systemHealth: {
          overallHealth: Math.round(overallHealth * 100) / 100,
          issues
        }
      };
    } catch (error) {
      console.error('Error getting performance metrics:', error);
      throw error;
    }
  }
}
