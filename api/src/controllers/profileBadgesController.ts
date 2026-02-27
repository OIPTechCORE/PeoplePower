import { Request, Response } from 'express';
import { pool } from '../database/connection';
import { logger } from '../utils/logger';
import { TONPaymentService } from '../services/tonPaymentService';

/**
 * Profile Badges Controller
 * Handles all profile badge related operations
 */
export class ProfileBadgesController {
  private tonService: TONPaymentService;

  constructor() {
    this.tonService = new TONPaymentService(
      process.env.TON_CONTRACT_ADDRESS || '',
      process.env.TON_PRIVATE_KEY || '',
      process.env.TON_RPC_URL || ''
    );
  }

  /**
   * Get all profile badges for user
   */
  async getProfileBadges(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      // Get all profile badges with progress
      const badgesQuery = `
        SELECT 
          pb.id,
          pb.name,
          pb.description,
          pb.icon,
          pb.category,
          pb.rarity,
          pb.requirements,
          pb.benefits,
          pb.display_order,
          CASE WHEN upb.unlocked_at IS NOT NULL THEN true ELSE false END as is_unlocked,
          upb.unlocked_at,
          upb.is_equipped,
          upb.is_visible,
          COALESCE(upb.progress, 0) as progress,
          pb.max_progress
        FROM profile_badges pb
        LEFT JOIN user_profile_badges upb ON pb.id = upb.badge_id AND upb.user_id = $1
        ORDER BY pb.display_order, pb.name
      `;

      const badgesResult = await pool.query(badgesQuery, [userId]);

      // Calculate progress for each badge
      const badges = await Promise.all(
        badgesResult.rows.map(async (badge) => {
          let progress = 0;

          // Calculate progress based on badge type and requirements
          switch (badge.category) {
            case 'achievement':
              progress = await this.calculateAchievementProgress(userId, badge.id);
              break;
            case 'social':
              progress = await this.calculateSocialProgress(userId, badge.id);
              break;
            case 'lifestyle':
              progress = await this.calculateLifestyleProgress(userId, badge.id);
              break;
            case 'skill':
              progress = await this.calculateSkillProgress(userId, badge.id);
              break;
            case 'special':
              progress = await this.calculateSpecialProgress(userId, badge.id);
              break;
            default:
              progress = badge.is_unlocked ? badge.max_progress : 0;
          }

          return {
            id: badge.id,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            category: badge.category,
            rarity: badge.rarity,
            isUnlocked: badge.is_unlocked,
            unlockedAt: badge.unlocked_at,
            progress: badge.is_unlocked ? badge.max_progress : progress,
            maxProgress: badge.max_progress,
            isEquipped: badge.is_equipped || false,
            isVisible: badge.is_visible !== false,
            benefits: badge.benefits || [],
            requirements: badge.requirements || [],
            displayOrder: badge.display_order
          };
        })
      );

      res.json({
        success: true,
        data: badges
      });
    } catch (error) {
      logger.error('Failed to get profile badges:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Equip a badge
   */
  async equipBadge(req: Request, res: Response): Promise<void> {
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

      // Check if badge is unlocked
      const badgeCheckQuery = `
        SELECT id FROM user_profile_badges 
        WHERE user_id = $1 AND badge_id = $2 AND unlocked_at IS NOT NULL
      `;
      const badgeCheckResult = await pool.query(badgeCheckQuery, [userId, badgeId]);

      if (badgeCheckResult.rows.length === 0) {
        res.status(400).json({
          success: false,
          error: 'Badge not unlocked'
        });
        return;
      }

      // Check equipped badge limit (max 5)
      const equippedCountQuery = `
        SELECT COUNT(*) as count FROM user_profile_badges 
        WHERE user_id = $1 AND is_equipped = true
      `;
      const equippedCountResult = await pool.query(equippedCountQuery, [userId]);

      if (Number(equippedCountResult.rows[0].count) >= 5) {
        res.status(400).json({
          success: false,
          error: 'Maximum equipped badges reached (5)'
        });
        return;
      }

      // Equip the badge
      const equipQuery = `
        UPDATE user_profile_badges 
        SET is_equipped = true, updated_at = NOW()
        WHERE user_id = $1 AND badge_id = $2
        RETURNING *
      `;
      const equipResult = await pool.query(equipQuery, [userId, badgeId]);

      logger.info('Badge equipped', {
        userId,
        badgeId
      });

      res.json({
        success: true,
        data: equipResult.rows[0],
        message: 'Badge equipped successfully'
      });
    } catch (error) {
      logger.error('Failed to equip badge:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Unequip a badge
   */
  async unequipBadge(req: Request, res: Response): Promise<void> {
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

      // Unequip the badge
      const unequipQuery = `
        UPDATE user_profile_badges 
        SET is_equipped = false, updated_at = NOW()
        WHERE user_id = $1 AND badge_id = $2
        RETURNING *
      `;
      const unequipResult = await pool.query(unequipQuery, [userId, badgeId]);

      logger.info('Badge unequipped', {
        userId,
        badgeId
      });

      res.json({
        success: true,
        data: unequipResult.rows[0],
        message: 'Badge unequipped successfully'
      });
    } catch (error) {
      logger.error('Failed to unequip badge:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Calculate achievement progress
   */
  private async calculateAchievementProgress(userId: string, badgeId: string): Promise<number> {
    // Implementation for achievement progress calculation
    // This would check various game achievements, levels, etc.
    return 0; // Placeholder
  }

  /**
   * Calculate social progress
   */
  private async calculateSocialProgress(userId: string, badgeId: string): Promise<number> {
    // Implementation for social progress calculation
    // This would check friends, messages, interactions, etc.
    return 0; // Placeholder
  }

  /**
   * Calculate lifestyle progress
   */
  private async calculateLifestyleProgress(userId: string, badgeId: string): Promise<number> {
    // Implementation for lifestyle progress calculation
    // This would check daily activities, streaks, etc.
    return 0; // Placeholder
  }

  /**
   * Calculate skill progress
   */
  private async calculateSkillProgress(userId: string, badgeId: string): Promise<number> {
    // Implementation for skill progress calculation
    // This would check skill levels, completions, etc.
    return 0; // Placeholder
  }

  /**
   * Calculate special progress
   */
  private async calculateSpecialProgress(userId: string, badgeId: string): Promise<number> {
    // Implementation for special progress calculation
    // This would check event participation, special achievements, etc.
    return 0; // Placeholder
  }
}
