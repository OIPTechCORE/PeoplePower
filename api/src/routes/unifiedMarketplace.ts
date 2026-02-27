import { Router } from 'express';
import { body, query } from 'express-validator';
import { MarketplaceController } from '../controllers/marketplaceController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();
const marketplaceController = new MarketplaceController();

/**
 * @route GET /api/v1/marketplace/items
 * @desc Get marketplace items with filters
 * @access Public
 */
router.get('/items',
  validateRequest([
    query('category').optional().isIn(['gaming', 'digital', 'physical', 'services', 'exclusive']),
    query('rarity').optional().isIn(['common', 'rare', 'epic', 'legendary', 'mythic']),
    query('minPrice').optional().isFloat({ min: 0 }),
    query('maxPrice').optional().isFloat({ min: 0 }),
    query('search').optional().isString().trim(),
    query('sortBy').optional().isIn(['price', 'rating', 'newest', 'popularity']),
    query('sortOrder').optional().isIn(['asc', 'desc']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ]),
  marketplaceController.getMarketplaceItems.bind(marketplaceController)
);

/**
 * @route POST /api/v1/marketplace/purchase
 * @desc Purchase marketplace item
 * @access Private
 */
router.post('/purchase',
  authenticateToken,
  validateRequest([
    body('itemId')
      .isUUID()
      .withMessage('Valid item ID is required')
  ]),
  marketplaceController.purchaseMarketplaceItem.bind(marketplaceController)
);

/**
 * @route POST /api/v1/marketplace/listings
 * @desc Create marketplace listing
 * @access Private
 */
router.post('/listings',
  authenticateToken,
  validateRequest([
    body('name')
      .isString()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Name must be between 1 and 100 characters'),
    body('description')
      .isString()
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),
    body('price')
      .isFloat({ min: 0.01 })
      .withMessage('Price must be at least 0.01 TON'),
    body('category')
      .isIn(['gaming', 'digital', 'physical', 'services', 'exclusive'])
      .withMessage('Valid category is required'),
    body('rarity')
      .isIn(['common', 'rare', 'epic', 'legendary', 'mythic'])
      .withMessage('Valid rarity is required'),
    body('icon')
      .optional()
      .isString()
      .trim(),
    body('image')
      .optional()
      .isURL()
      .withMessage('Image must be a valid URL'),
    body('isLimited')
      .optional()
      .isBoolean(),
    body('maxStock')
      .optional()
      .isInt({ min: 1, max: 1000 })
      .withMessage('Max stock must be between 1 and 1000'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    body('tags.*')
      .optional()
      .isString()
      .trim()
      .isLength({ min: 1, max: 20 })
      .withMessage('Each tag must be between 1 and 20 characters')
  ]),
  marketplaceController.createMarketplaceListing.bind(marketplaceController)
);

/**
 * @route GET /api/v1/marketplace/listings
 * @desc Get user's marketplace listings
 * @access Private
 */
router.get('/listings',
  authenticateToken,
  marketplaceController.getUserListings.bind(marketplaceController)
);

/**
 * @route GET /api/v1/marketplace/purchases
 * @desc Get user's purchase history
 * @access Private
 */
router.get('/purchases',
  authenticateToken,
  marketplaceController.getUserPurchases.bind(marketplaceController)
);

/**
 * @route GET /api/v1/marketplace/stats
 * @desc Get marketplace statistics
 * @access Public
 */
router.get('/stats',
  marketplaceController.getMarketplaceStats.bind(marketplaceController)
);

export default router;
