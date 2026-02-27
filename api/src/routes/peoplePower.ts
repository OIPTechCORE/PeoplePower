import { Router } from 'express';
import { body, query } from 'express-validator';
import { PeoplePowerTokenController } from '../controllers/peoplePowerTokenController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();
const peoplePowerTokenController = new PeoplePowerTokenController();

/**
 * @route GET /api/v1/people-power/profile
 * @desc Get user profile for People Power ecosystem
 * @access Private
 */
router.get('/profile',
  authenticateToken,
  peoplePowerTokenController.getUserProfile.bind(peoplePowerTokenController)
);

/**
 * @route GET /api/v1/people-power/tokens
 * @desc Get all movement tokens
 * @access Public
 */
router.get('/tokens',
  validateRequest([
    query('category').optional().isIn(['education', 'freedom', 'leadership', 'community', 'governance', 'empowerment']),
    query('purpose').optional().isIn(['education', 'freedom', 'leadership', 'community', 'governance', 'empowerment']),
    query('verified').optional().isBoolean(),
    query('trending').optional().isBoolean(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 })
  ]),
  peoplePowerTokenController.getMovementTokens.bind(peoplePowerTokenController)
);

/**
 * @route POST /api/v1/people-power/tokens/create
 * @desc Create new movement token
 * @access Private
 */
router.post('/tokens/create',
  authenticateToken,
  validateRequest([
    body('name')
      .isString()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Name must be between 1 and 100 characters'),
    body('symbol')
      .isString()
      .trim()
      .isLength({ min: 2, max: 10 })
      .withMessage('Symbol must be between 2 and 10 characters'),
    body('purpose')
      .isIn(['education', 'freedom', 'leadership', 'community', 'governance', 'empowerment'])
      .withMessage('Valid purpose is required'),
    body('description')
      .isString()
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),
    body('totalSupply')
      .isInt({ min: 1000, max: 1000000000 })
      .withMessage('Total supply must be between 1,000 and 1,000,000,000'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    body('tags.*')
      .optional()
      .isString()
      .trim()
      .isLength({ min: 1, max: 20 })
      .withMessage('Each tag must be between 1 and 20 characters'),
    body('launchType')
      .optional()
      .isIn(['basic', 'premium', 'enterprise'])
      .withMessage('Valid launch type is required')
  ]),
  peoplePowerTokenController.createMovementToken.bind(peoplePowerTokenController)
);

/**
 * @route POST /api/v1/people-power/tokens/buy
 * @desc Buy movement token
 * @access Private
 */
router.post('/tokens/buy',
  authenticateToken,
  validateRequest([
    body('tokenId')
      .isUUID()
      .withMessage('Valid token ID is required'),
    body('amount')
      .isFloat({ min: 0.01 })
      .withMessage('Amount must be at least 0.01'),
    body('paymentType')
      .optional()
      .isIn(['ton', 'ppc'])
      .withMessage('Payment type must be ton or ppc')
  ]),
  peoplePowerTokenController.buyMovementToken.bind(peoplePowerTokenController)
);

/**
 * @route GET /api/v1/people-power/tokens/:id
 * @desc Get token details
 * @access Public
 */
router.get('/tokens/:id',
  validateRequest([
    query('id').isUUID().withMessage('Valid token ID is required')
  ]),
  peoplePowerTokenController.getTokenDetails.bind(peoplePowerTokenController)
);

/**
 * @route GET /api/v1/people-power/holdings
 * @desc Get user's token holdings
 * @access Private
 */
router.get('/holdings',
  authenticateToken,
  peoplePowerTokenController.getUserTokenHoldings.bind(peoplePowerTokenController)
);

/**
 * @route GET /api/v1/people-power/stats
 * @desc Get marketplace statistics
 * @access Public
 */
router.get('/stats',
  peoplePowerTokenController.getMarketplaceStats.bind(peoplePowerTokenController)
);

export default router;
