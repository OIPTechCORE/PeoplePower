import { Router } from 'express';
import { SuperAdminController } from '../controllers/superAdminController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { validateRequest, schemas } from '../middleware/validation';

const router = Router();
const superAdminController = new SuperAdminController();

/**
 * @route GET /api/v1/admin/dashboard/metrics
 * @desc Get dashboard metrics
 * @access Private (Admin only)
 */
router.get('/dashboard/metrics',
  authenticateToken,
  requireAdmin,
  superAdminController.getDashboardMetrics.bind(superAdminController)
);

/**
 * @route GET /api/v1/admin/users/analytics
 * @desc Get user analytics
 * @access Private (Admin only)
 */
router.get('/users/analytics',
  authenticateToken,
  requireAdmin,
  superAdminController.getUserAnalytics.bind(superAdminController)
);

/**
 * @route GET /api/v1/admin/transactions/analytics
 * @desc Get transaction analytics
 * @access Private (Admin only)
 */
router.get('/transactions/analytics',
  authenticateToken,
  requireAdmin,
  superAdminController.getTransactionAnalytics.bind(superAdminController)
);

/**
 * @route GET /api/v1/admin/revenue/analytics
 * @desc Get revenue analytics
 * @access Private (Admin only)
 */
router.get('/revenue/analytics',
  authenticateToken,
  requireAdmin,
  superAdminController.getRevenueAnalytics.bind(superAdminController)
);

/**
 * @route PUT /api/v1/admin/users/:userId/status
 * @desc Update user status
 * @access Private (Admin only)
 */
router.put('/users/:userId/status',
  authenticateToken,
  requireAdmin,
  validateRequest([
    body('status')
      .isIn(['active', 'inactive', 'suspended', 'banned'])
      .withMessage('Invalid status'),
    body('reason')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Reason must not exceed 500 characters')
  ]),
  superAdminController.updateUserStatus.bind(superAdminController)
);

/**
 * @route POST /api/v1/admin/payout
 * @desc Process super admin payout
 * @access Private (Admin only)
 */
router.post('/payout',
  authenticateToken,
  requireAdmin,
  superAdminController.processPayout.bind(superAdminController)
);

/**
 * @route GET /api/v1/admin/system/health
 * @desc Get system health
 * @access Private (Admin only)
 */
router.get('/system/health',
  authenticateToken,
  requireAdmin,
  superAdminController.getSystemHealth.bind(superAdminController)
);

export default router;
