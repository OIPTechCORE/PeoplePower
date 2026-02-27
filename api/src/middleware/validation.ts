import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';

interface ValidationChain {
  run: (req: Request) => Promise<any>;
}

export function validateRequest(validations: ValidationChain[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: errors.array().map(error => ({
          field: error.param,
          message: error.msg,
          value: error.value
        }))
      });
    }

    next();
  };
}

// Common validation schemas
export const schemas = {
  // Player validations
  playerUpdate: [
    body('displayName')
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage('Display name must be between 1 and 100 characters'),
    body('avatar')
      .optional()
      .isURL()
      .withMessage('Avatar must be a valid URL'),
    body('bio')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Bio must not exceed 500 characters')
  ],

  // Game action validations
  gameAction: [
    body('action')
      .notEmpty()
      .withMessage('Action is required'),
    body('data')
      .optional()
      .isObject()
      .withMessage('Data must be an object')
  ],

  // TON Payment validations
  tonPayment: [
    body('userAddress')
      .notEmpty()
      .isEthereumAddress()
      .withMessage('Valid Ethereum address is required'),
    body('amount')
      .notEmpty()
      .isNumeric()
      .withMessage('Amount must be a number'),
    body('paymentType')
      .optional()
      .isIn(['game_payment', 'stake_payment', 'gift_payment', 'marketplace_payment'])
      .withMessage('Invalid payment type')
  ],

  tonStake: [
    body('amount')
      .notEmpty()
      .isNumeric()
      .withMessage('Amount must be a number')
  ],

  tonUnstake: [
    body('amount')
      .notEmpty()
      .isNumeric()
      .withMessage('Amount must be a number')
  ],

  tonEstimateGas: [
    body('functionName')
      .notEmpty()
      .withMessage('Function name is required'),
    body('args')
      .optional()
      .isArray()
      .withMessage('Args must be an array')
  ],
    body('type')
      .isIn(['tap', 'mission_complete', 'story_progress', 'social_action', 'mini_game'])
      .withMessage('Invalid game action type'),
    body('data')
      .isObject()
      .withMessage('Game action data must be an object'),
    body('timestamp')
      .optional()
      .isISO8601()
      .withMessage('Timestamp must be a valid ISO 8601 date')
  ],

  // Mission validations
  missionComplete: [
    param('missionId')
      .isUUID()
      .withMessage('Mission ID must be a valid UUID'),
    body('completionData')
      .optional()
      .isObject()
      .withMessage('Completion data must be an object')
  ],

  // Leaderboard validations
  leaderboardQuery: [
    query('type')
      .optional()
      .isIn(['global', 'generation', 'rank', 'community'])
      .withMessage('Invalid leaderboard type'),
    query('period')
      .optional()
      .isIn(['daily', 'weekly', 'monthly', 'all_time'])
      .withMessage('Invalid leaderboard period'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Offset must be a non-negative integer')
  ],

  // Community validations
  communityCreate: [
    body('name')
      .isLength({ min: 3, max: 100 })
      .withMessage('Community name must be between 3 and 100 characters'),
    body('description')
      .isLength({ min: 10, max: 500 })
      .withMessage('Description must be between 10 and 500 characters'),
    body('type')
      .isIn(['public', 'private', 'invite_only'])
      .withMessage('Invalid community type')
  ],

  // Competition validations
  competitionJoin: [
    param('competitionId')
      .isUUID()
      .withMessage('Competition ID must be a valid UUID')
  ],

  // Education validations
  courseEnroll: [
    param('courseId')
      .isUUID()
      .withMessage('Course ID must be a valid UUID')
  ],

  courseProgress: [
    param('courseId')
      .isUUID()
      .withMessage('Course ID must be a valid UUID'),
    body('progressPercentage')
      .isFloat({ min: 0, max: 100 })
      .withMessage('Progress percentage must be between 0 and 100')
  ],

  // Chat validations
  sendMessage: [
    body('channelId')
      .notEmpty()
      .withMessage('Channel ID is required'),
    body('message')
      .isLength({ min: 1, max: 500 })
      .withMessage('Message must be between 1 and 500 characters')
  ],

  // Transaction validations
  transaction: [
    body('type')
      .isIn(['earn', 'spend', 'transfer'])
      .withMessage('Invalid transaction type'),
    body('amount')
      .isInt({ min: 1 })
      .withMessage('Amount must be a positive integer'),
    body('source')
      .notEmpty()
      .withMessage('Transaction source is required')
  ],

  // Pagination validations
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
  ],

  // UUID parameter validation
  uuidParam: (paramName: string) => [
    param(paramName)
      .isUUID()
      .withMessage(`${paramName} must be a valid UUID`)
  ],

  // Integer parameter validation
  intParam: (paramName: string, min?: number, max?: number) => [
    param(paramName)
      .isInt()
      .withMessage(`${paramName} must be an integer`)
      .custom((value) => {
        if (min !== undefined && value < min) {
          throw new Error(`${paramName} must be at least ${min}`);
        }
        if (max !== undefined && value > max) {
          throw new Error(`${paramName} must be at most ${max}`);
        }
        return true;
      })
  ]
};

// Custom validation middleware
export function validateTelegramInitData(req: Request, res: Response, next: NextFunction) {
  const telegramInitData = req.headers['x-telegram-init-data'];
  
  if (!telegramInitData) {
    return res.status(400).json({
      success: false,
      error: 'TELEGRAM_DATA_MISSING',
      message: 'Telegram initialization data is required'
    });
  }

  try {
    // In production, you should verify the Telegram Web App signature
    // For now, we'll just check if the data exists
    const data = decodeURIComponent(telegramInitData as string);
    
    if (!data || data.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_TELEGRAM_DATA',
        message: 'Invalid Telegram initialization data'
      });
    }

    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: 'TELEGRAM_DATA_ERROR',
      message: 'Error processing Telegram data'
    });
  }
}

export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  // Basic input sanitization
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        // Remove potential XSS characters
        req.body[key] = req.body[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
          .trim();
      }
    });
  }

  next();
}
