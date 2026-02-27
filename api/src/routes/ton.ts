import { Router } from 'express';
import { TONPaymentController } from '../controllers/tonPaymentController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, schemas } from '../middleware/validation';

const router = Router();
const tonController = new TONPaymentController();

/**
 * @route POST /api/v1/ton/payment
 * @desc Process a payment with TON tokens
 * @access Private
 */
router.post('/payment', 
  authenticateToken,
  validateRequest(schemas.tonPayment),
  tonController.processPayment.bind(tonController)
);

/**
 * @route POST /api/v1/ton/stake
 * @desc Stake TON tokens for diamond tier benefits
 * @access Private
 */
router.post('/stake',
  authenticateToken,
  validateRequest(schemas.tonStake),
  tonController.stakeTokens.bind(tonController)
);

/**
 * @route POST /api/v1/ton/unstake
 * @desc Unstake TON tokens
 * @access Private
 */
router.post('/unstake',
  authenticateToken,
  validateRequest(schemas.tonUnstake),
  tonController.unstakeTokens.bind(tonController)
);

/**
 * @route GET /api/v1/ton/stats/:userAddress
 * @desc Get user statistics
 * @access Private
 */
router.get('/stats/:userAddress',
  authenticateToken,
  tonController.getUserStats.bind(tonController)
);

/**
 * @route GET /api/v1/ton/benefits/:userAddress
 * @desc Get diamond tier benefits
 * @access Private
 */
router.get('/benefits/:userAddress',
  authenticateToken,
  tonController.getDiamondTierBenefits.bind(tonController)
);

/**
 * @route GET /api/v1/ton/balance
 * @desc Get contract balance
 * @access Private (Admin only)
 */
router.get('/balance',
  authenticateToken,
  tonController.getContractBalance.bind(tonController)
);

/**
 * @route POST /api/v1/ton/estimate-gas
 * @desc Estimate gas for transaction
 * @access Private
 */
router.post('/estimate-gas',
  authenticateToken,
  tonController.estimateGas.bind(tonController)
);

export default router;
