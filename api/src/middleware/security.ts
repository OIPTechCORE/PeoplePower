import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const securityMiddleware = [
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: ["'self'", "https://api.telegram.org"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
        childSrc: ["'none'"],
        workerSrc: ["'self'"],
        manifestSrc: ["'self'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    referrerPolicy: {
      policy: ["no-referrer-when-downgrade"]
    }
  }),
  
  // Global rate limiting
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      success: false,
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests from this IP, please try again later',
        retryAfter: '15 minutes'
      });
    }
  }),
  
  // API-specific rate limiting
  rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // limit each IP to 30 requests per minute for API
    skip: (req: Request) => !req.path.startsWith('/api'),
    message: {
      success: false,
      error: 'API_RATE_LIMIT_EXCEEDED',
      message: 'Too many API requests, please try again later'
    }
  }),

  // Authentication endpoints rate limiting
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 auth attempts per 15 minutes
    skip: (req: Request) => !req.path.includes('/auth'),
    message: {
      success: false,
      error: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts, please try again later'
    }
  })
];

// Input validation middleware
export const validateInput = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: error.details[0].message,
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    req.body = value; // Use sanitized values
    next();
  };
};

// Query validation middleware
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'QUERY_VALIDATION_ERROR',
        message: error.details[0].message,
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    req.query = value; // Use sanitized values
    next();
  };
};

// Sanitization schemas
export const schemas = {
  auth: Joi.object({
    telegramId: Joi.number().integer().positive().required(),
    firstName: Joi.string().trim().min(1).max(50).required(),
    lastName: Joi.string().trim().max(50).optional().allow(''),
    username: Joi.string().alphanum().min(3).max(32).optional().allow(''),
    photoUrl: Joi.string().uri().optional().allow('')
  }),

  gameAction: Joi.object({
    type: Joi.string().valid('tap', 'mission_complete', 'mini_game', 'social_action', 'purchase').required(),
    data: Joi.object().required(),
    timestamp: Joi.date().timestamp().optional()
  }),

  playerUpdate: Joi.object({
    displayName: Joi.string().trim().min(1).max(50).optional(),
    avatar: Joi.string().uri().optional().allow(''),
    bio: Joi.string().trim().max(200).optional().allow('')
  }),

  chatMessage: Joi.object({
    channelId: Joi.string().required(),
    message: Joi.string().trim().min(1).max(500).required()
  }),

  competitionJoin: Joi.object({
    competitionId: Joi.string().uuid().required()
  }),

  leaderboardQuery: Joi.object({
    type: Joi.string().valid('global', 'generation', 'rank', 'community').default('global'),
    period: Joi.string().valid('daily', 'weekly', 'monthly', 'all_time').default('daily'),
    limit: Joi.number().integer().min(1).max(100).default(50),
    offset: Joi.number().integer().min(0).default(0)
  }),

  playerStatsQuery: Joi.object({
    period: Joi.string().valid('day', 'week', 'month', 'year').default('day'),
    metrics: Joi.string().optional()
  })
};

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Remove server information
  res.removeHeader('X-Powered-By');
  
  // Add custom security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
};

// IP whitelist middleware (for admin endpoints)
export const ipWhitelist = (allowedIPs: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    
    if (!allowedIPs.includes(clientIP as string)) {
      return res.status(403).json({
        success: false,
        error: 'ACCESS_DENIED',
        message: 'Access denied from this IP address'
      });
    }
    
    next();
  };
};

// API key authentication middleware
export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;
  const validApiKey = process.env.API_KEY;
  
  if (!validApiKey) {
    return res.status(500).json({
      success: false,
      error: 'CONFIGURATION_ERROR',
      message: 'API key not configured'
    });
  }
  
  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({
      success: false,
      error: 'INVALID_API_KEY',
      message: 'Invalid or missing API key'
    });
  }
  
  next();
};

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    };
    
    console.log('Request:', JSON.stringify(logData));
  });
  
  next();
};
