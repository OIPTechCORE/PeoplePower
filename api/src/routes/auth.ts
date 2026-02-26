import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/authController';
import { asyncHandler } from '../middleware/errorHandler';
import { validateTelegramInitData } from '../middleware/telegramAuth';

const router = Router();
const authController = new AuthController();

// Telegram authentication
router.post('/telegram',
  validateTelegramInitData,
  [
    body('telegramUser.id').isNumeric().withMessage('Invalid Telegram user ID'),
    body('telegramUser.first_name').notEmpty().withMessage('First name is required'),
    body('telegramUser.username').optional().isAlphanumeric().withMessage('Invalid username'),
  ],
  asyncHandler(authController.authenticateTelegram.bind(authController))
);

// Create or get player (for bot integration)
router.post('/create-or-get',
  validateTelegramInitData,
  [
    body('telegramUser.id').isNumeric().withMessage('Invalid Telegram user ID'),
    body('telegramUser.first_name').notEmpty().withMessage('First name is required'),
    body('referralCode').optional().isLength({ min: 8, max: 8 }).withMessage('Invalid referral code'),
  ],
  asyncHandler(authController.createOrGetPlayer.bind(authController))
);

// Refresh token
router.post('/refresh',
  [
    body('refreshToken').notEmpty().withMessage('Refresh token is required'),
  ],
  asyncHandler(authController.refreshToken.bind(authController))
);

// Logout
router.post('/logout',
  [
    body('token').notEmpty().withMessage('Token is required'),
  ],
  asyncHandler(authController.logout.bind(authController))
);

// Verify token (for mini-app)
router.get('/verify',
  asyncHandler(authController.verifyToken.bind(authController))
);

export default router;
