import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Extend Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        telegramId: number;
        username: string;
      };
    }
  }
}

/**
 * Middleware to require admin role
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Check if user is authenticated
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  // Check if user has admin role
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    logger.warn('Unauthorized admin access attempt', {
      userId: req.user.id,
      userRole: req.user.role,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    return res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
  }

  next();
};

/**
 * Middleware to require super admin role
 */
export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Check if user is authenticated
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  // Check if user has super admin role
  if (req.user.role !== 'super_admin') {
    logger.warn('Unauthorized super admin access attempt', {
      userId: req.user.id,
      userRole: req.user.role,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    return res.status(403).json({
      success: false,
      error: 'Super admin access required'
    });
  }

  next();
};

/**
 * Middleware to log admin actions
 */
export const logAdminAction = (action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Log the action before processing
    logger.info('Admin action initiated', {
      adminId: req.user?.id,
      action,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      body: req.method !== 'GET' ? req.body : undefined
    });

    // Override res.json to log the response
    const originalJson = res.json;
    res.json = function(data) {
      logger.info('Admin action completed', {
        adminId: req.user?.id,
        action,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        response: data
      });
      return originalJson.call(this, data);
    };

    next();
  };
};
