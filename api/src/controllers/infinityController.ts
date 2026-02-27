import { Request, Response } from 'express';
import { pool } from '../database/connection';
import { logger } from '../utils/logger';
import { TONPaymentService } from '../services/tonPaymentService';

/**
 * Infinity System Controller
 * Handles all infinity badge and diamond tier related operations
 */
export class InfinityController {
  private tonService: TONPaymentService;

  constructor() {
    this.tonService = new TONPaymentService(
      process.env.TON_CONTRACT_ADDRESS || '',
      process.env.TON_PRIVATE_KEY || '',
      process.env.TON_RPC_URL || ''
    );
  }

  /**
   * Get all badges for the user
   */
  async getBadges(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      // Get all badge types
      const badgeTypesQuery = `
        SELECT 
          bt.id,
          bt.name,
          bt.description,
          bt.icon,
          bt.unlock_cost,
          bt.tier,
          bt.category,
          bt.rarity,
          COALESCE(pb.unlocked_at, NULL) as unlocked_at,
          CASE WHEN pb.unlocked_at IS NOT NULL THEN true ELSE false END as is_unlocked
        FROM badge_types bt
        LEFT JOIN player_badges pb ON bt.id = pb.badge_id AND pb.player_id = $1
        ORDER BY bt.tier, bt.name
      `;

      const badgeTypesResult = await pool.query(badgeTypesQuery, [userId]);

      // Calculate progress for each badge
      const badges = await Promise.all(
        badgeTypesResult.rows.map(async (badge) => {
          let progress = 0;
          let maxProgress = 100;

          // Calculate progress based on badge type
          switch (badge.id) {
            case 1: // Infinity Pioneer - First payment
              const paymentQuery = `
                SELECT COUNT(*) as count
                FROM ton_transactions
                WHERE player_id = $1 AND status = 'completed'
              `;
              const paymentResult = await pool.query(paymentQuery, [userId]);
              progress = Math.min(paymentResult.rows[0].count * 20, 100); // 5 payments = 100%
              maxProgress = 100;
              break;

            case 2: // Infinity Explorer - 500 TON total payments
              const totalPaymentsQuery = `
                SELECT COALESCE(SUM(amount), 0) as total
                FROM ton_transactions
                WHERE player_id = $1 AND status = 'completed'
              `;
              const totalPaymentsResult = await pool.query(totalPaymentsQuery, [userId]);
              progress = Math.min((Number(totalPaymentsResult.rows[0].total) / 500) * 100, 100);
              maxProgress = 100;
              break;

            case 3: // Infinity Master - 1000 TON total payments
              const masterPaymentsQuery = `
                SELECT COALESCE(SUM(amount), 0) as total
                FROM ton_transactions
                WHERE player_id = $1 AND status = 'completed'
              `;
              const masterPaymentsResult = await pool.query(masterPaymentsQuery, [userId]);
              progress = Math.min((Number(masterPaymentsResult.rows[0].total) / 1000) * 100, 100);
              maxProgress = 100;
              break;

            case 4: // Infinity Legend - 5000 TON total payments
              const legendPaymentsQuery = `
                SELECT COALESCE(SUM(amount), 0) as total
                FROM ton_transactions
                WHERE player_id = $1 AND status = 'completed'
              `;
              const legendPaymentsResult = await pool.query(legendPaymentsQuery, [userId]);
              progress = Math.min((Number(legendPaymentsResult.rows[0].total) / 5000) * 100, 100);
              maxProgress = 100;
              break;

            case 5: // Infinity God - 10000 TON total payments
              const godPaymentsQuery = `
                SELECT COALESCE(SUM(amount), 0) as total
                FROM ton_transactions
                WHERE player_id = $1 AND status = 'completed'
              `;
              const godPaymentsResult = await pool.query(godPaymentsQuery, [userId]);
              progress = Math.min((Number(godPaymentsResult.rows[0].total) / 10000) * 100, 100);
              maxProgress = 100;
              break;

            default:
              progress = badge.is_unlocked ? 100 : 0;
              maxProgress = 100;
          }

          return {
            id: badge.id,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            category: badge.category,
            rarity: badge.rarity,
            unlockCost: badge.unlock_cost,
            isUnlocked: badge.is_unlocked,
            unlockedAt: badge.unlocked_at,
            progress,
            maxProgress,
            benefits: this.getBadgeBenefits(badge.id),
            requirements: this.getBadgeRequirements(badge.id)
          };
        })
      );

      res.json({
        success: true,
        data: badges
      });
    } catch (error) {
      logger.error('Failed to get badges:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Unlock a badge
   */
  async unlockBadge(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { badgeId } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      if (!badgeId) {
        res.status(400).json({
          success: false,
          error: 'Badge ID is required'
        });
        return;
      }

      // Check if badge is already unlocked
      const existingBadgeQuery = `
        SELECT id FROM player_badges WHERE player_id = $1 AND badge_id = $2
      `;
      const existingBadgeResult = await pool.query(existingBadgeQuery, [userId, badgeId]);

      if (existingBadgeResult.rows.length > 0) {
        res.status(400).json({
          success: false,
          error: 'Badge already unlocked'
        });
        return;
      }

      // Get badge details
      const badgeQuery = `
        SELECT unlock_cost FROM badge_types WHERE id = $1
      `;
      const badgeResult = await pool.query(badgeQuery, [badgeId]);

      if (badgeResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: 'Badge not found'
        });
        return;
      }

      const unlockCost = Number(badgeResult.rows[0].unlock_cost);

      // Check user balance
      const balanceQuery = `
        SELECT COALESCE(SUM(CASE WHEN is_active = true THEN amount ELSE 0 END), 0) as balance
        FROM ton_transactions
        WHERE player_id = $1 AND status = 'completed'
      `;
      const balanceResult = await pool.query(balanceQuery, [userId]);
      const userBalance = Number(balanceResult.rows[0].balance);

      if (userBalance < unlockCost) {
        res.status(400).json({
          success: false,
          error: 'Insufficient balance'
        });
        return;
      }

      // Process badge unlock payment
      const paymentResult = await this.tonService.processPayment(
        userId,
        unlockCost.toString(),
        'badge_unlock'
      );

      if (paymentResult.success) {
        // Unlock the badge
        const unlockQuery = `
          INSERT INTO player_badges (player_id, badge_id, transaction_hash)
          VALUES ($1, $2, $3)
          RETURNING *
        `;
        const unlockResult = await pool.query(unlockQuery, [
          userId,
          badgeId,
          paymentResult.transactionHash
        ]);

        logger.info('Badge unlocked', {
          userId,
          badgeId,
          transactionHash: paymentResult.transactionHash
        });

        res.json({
          success: true,
          data: unlockResult.rows[0],
          message: 'Badge unlocked successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          error: paymentResult.error || 'Failed to process payment'
        });
      }
    } catch (error) {
      logger.error('Failed to unlock badge:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get diamond tiers information
   */
  async getDiamondTiers(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      // Get user's current stake
      const stakeQuery = `
        SELECT COALESCE(SUM(CASE WHEN is_active = true THEN amount ELSE 0 END), 0) as total_staked
        FROM ton_stakes
        WHERE player_id = $1
      `;
      const stakeResult = await pool.query(stakeQuery, [userId]);
      const currentStake = Number(stakeResult.rows[0].total_staked);

      // Define diamond tiers
      const tiers = [
        {
          tier: 1,
          name: 'Bronze',
          icon: '🛡️',
          color: 'orange',
          gradient: 'from-orange-400 to-orange-600',
          requiredStake: 100,
          bonusMultiplier: 1.0,
          cashbackPercent: 5,
          benefits: [
            'Basic rewards',
            '5% cashback on all transactions',
            'Access to basic features',
            'Community support'
          ],
          features: [
            'Standard transaction speed',
            'Basic customer support',
            'Monthly rewards'
          ]
        },
        {
          tier: 2,
          name: 'Silver',
          icon: '⭐',
          color: 'gray',
          gradient: 'from-gray-400 to-gray-600',
          requiredStake: 500,
          bonusMultiplier: 1.2,
          cashbackPercent: 10,
          benefits: [
            'Enhanced rewards (1.2x)',
            '10% cashback on all transactions',
            'Priority support',
            'Exclusive events access',
            'Early access to new features'
          ],
          features: [
            'Fast transaction speed',
            'Priority customer support',
            'Weekly rewards',
            'Exclusive content'
          ]
        },
        {
          tier: 3,
          name: 'Gold',
          icon: '👑',
          color: 'yellow',
          gradient: 'from-yellow-400 to-yellow-600',
          requiredStake: 1000,
          bonusMultiplier: 1.5,
          cashbackPercent: 20,
          benefits: [
            'Premium rewards (1.5x)',
            '20% cashback on all transactions',
            'VIP support',
            'Exclusive events & tournaments',
            'Early access to all features',
            'Special badge access'
          ],
          features: [
            'Instant transaction speed',
            'VIP customer support',
            'Daily rewards',
            'Exclusive tournaments',
            'Premium content'
          ]
        },
        {
          tier: 4,
          name: 'Platinum',
          icon: '🏆',
          color: 'purple',
          gradient: 'from-purple-400 to-purple-600',
          requiredStake: 5000,
          bonusMultiplier: 2.0,
          cashbackPercent: 30,
          benefits: [
            'Elite rewards (2.0x)',
            '30% cashback on all transactions',
            'Dedicated account manager',
            'All exclusive events',
            'First access to all features',
            'Special platinum badges',
            'Revenue sharing program'
          ],
          features: [
            'Lightning transaction speed',
            'Dedicated account manager',
            'Hourly rewards',
            'Exclusive tournaments',
            'Premium content',
            'Revenue sharing',
            'Custom features'
          ]
        }
      ];

      // Add user-specific data to each tier
      const tiersWithUserData = tiers.map(tier => ({
        ...tier,
        isUnlocked: currentStake >= tier.requiredStake,
        currentStake: currentStake,
        progress: Math.min((currentStake / tier.requiredStake) * 100, 100)
      }));

      res.json({
        success: true,
        data: tiersWithUserData
      });
    } catch (error) {
      logger.error('Failed to get diamond tiers:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get user infinity statistics
   */
  async getUserInfinityStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      // Get user's badge count
      const badgeCountQuery = `
        SELECT COUNT(*) as unlocked_badges
        FROM player_badges
        WHERE player_id = $1
      `;
      const badgeCountResult = await pool.query(badgeCountQuery, [userId]);
      const unlockedBadges = Number(badgeCountResult.rows[0].unlocked_badges);

      // Get user's current stake
      const stakeQuery = `
        SELECT COALESCE(SUM(CASE WHEN is_active = true THEN amount ELSE 0 END), 0) as total_staked
        FROM ton_stakes
        WHERE player_id = $1
      `;
      const stakeResult = await pool.query(stakeQuery, [userId]);
      const totalStaked = Number(stakeResult.rows[0].total_staked);

      // Determine current diamond tier
      let currentTier = 0;
      if (totalStaked >= 5000) currentTier = 4; // Platinum
      else if (totalStaked >= 1000) currentTier = 3; // Gold
      else if (totalStaked >= 500) currentTier = 2; // Silver
      else if (totalStaked >= 100) currentTier = 1; // Bronze

      // Calculate next tier progress
      const nextTierStake = currentTier < 4 ? [100, 500, 1000, 5000][currentTier] : 0;
      const nextTierProgress = nextTierStake > 0 ? Math.min((totalStaked / nextTierStake) * 100, 100) : 100;

      // Get user reputation (simplified calculation)
      const reputationQuery = `
        SELECT 
          COALESCE(SUM(amount), 0) as total_spent,
          COUNT(*) as total_transactions
        FROM ton_transactions
        WHERE player_id = $1 AND status = 'completed'
      `;
      const reputationResult = await pool.query(reputationQuery, [userId]);
      const totalSpent = Number(reputationResult.rows[0].total_spent);
      const totalTransactions = Number(reputationResult.rows[0].total_transactions);

      // Calculate reputation score
      const reputation = Math.floor(
        (totalSpent * 10) + 
        (totalTransactions * 100) + 
        (unlockedBadges * 1000) + 
        (currentTier * 5000)
      );

      const stats = {
        totalBadges: 5, // Total number of badges available
        unlockedBadges,
        currentTier,
        totalStaked,
        nextTierProgress,
        reputation,
        achievements: [
          unlockedBadges >= 1 ? 'First Badge' : null,
          unlockedBadges >= 3 ? 'Badge Collector' : null,
          unlockedBadges >= 5 ? 'Badge Master' : null,
          currentTier >= 1 ? 'Bronze Investor' : null,
          currentTier >= 2 ? 'Silver Investor' : null,
          currentTier >= 3 ? 'Gold Investor' : null,
          currentTier >= 4 ? 'Platinum Investor' : null,
          totalTransactions >= 10 ? 'Active Trader' : null,
          totalTransactions >= 100 ? 'Expert Trader' : null,
          totalSpent >= 1000 ? 'Big Spender' : null,
          totalSpent >= 10000 ? 'Whale' : null
        ].filter(Boolean)
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error('Failed to get user infinity stats:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get badge benefits
   */
  private getBadgeBenefits(badgeId: number): string[] {
    const benefits: { [key: number]: string[] } = {
      1: ['Welcome bonus', 'Profile badge', 'Community recognition'],
      2: ['Increased rewards', 'Exclusive content', 'Priority support'],
      3: ['Premium rewards', 'VIP features', 'Special events'],
      4: ['Elite rewards', 'Dedicated support', 'Revenue sharing'],
      5: ['Legendary rewards', 'Custom features', 'Partner benefits']
    };
    return benefits[badgeId] || [];
  }

  /**
   * Get badge requirements
   */
  private getBadgeRequirements(badgeId: number): string[] {
    const requirements: { [key: number]: string[] } = {
      1: ['Make your first payment', 'Complete profile setup'],
      2: ['Complete 5 payments', 'Spend 500 TON total'],
      3: ['Complete 20 payments', 'Spend 1000 TON total'],
      4: ['Complete 100 payments', 'Spend 5000 TON total'],
      5: ['Complete 200 payments', 'Spend 10000 TON total']
    };
    return requirements[badgeId] || [];
  }
}
