import { Router } from 'express';
import { body } from 'express-validator';
import { InfinityController } from '../controllers/infinityController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();
const infinityController = new InfinityController();

/**
 * @route GET /api/v1/infinity/badges
 * @desc Get all badges for user
 * @access Private
 */
router.get('/badges',
  authenticateToken,
  infinityController.getBadges.bind(infinityController)
);

/**
 * @route POST /api/v1/infinity/badges/unlock
 * @desc Unlock a badge
 * @access Private
 */
router.post('/badges/unlock',
  authenticateToken,
  validateRequest([
    body('badgeId')
      .isInt({ min: 1 })
      .withMessage('Badge ID must be a positive integer')
  ]),
  infinityController.unlockBadge.bind(infinityController)
);

/**
 * @route GET /api/v1/infinity/diamond-tiers
 * @desc Get diamond tiers information
 * @access Private
 */
router.get('/diamond-tiers',
  authenticateToken,
  infinityController.getDiamondTiers.bind(infinityController)
);

/**
 * @route GET /api/v1/infinity/user-stats
 * @desc Get user infinity statistics
 * @access Private
 */
router.get('/user-stats',
  authenticateToken,
  infinityController.getUserInfinityStats.bind(infinityController)
);

export default router;
