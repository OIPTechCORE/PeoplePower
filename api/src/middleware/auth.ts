import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    telegramId: number;
    username: string;
    displayName: string;
  };
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'ACCESS_TOKEN_MISSING',
      message: 'Access token is required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded: any) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'INVALID_TOKEN',
        message: 'Invalid or expired token'
      });
    }

    req.user = {
      id: decoded.userId,
      telegramId: decoded.telegramId,
      username: decoded.username,
      displayName: decoded.displayName
    };

    next();
  });
}

export function createAuthMiddleware(pool: Pool) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'ACCESS_TOKEN_MISSING',
        message: 'Access token is required'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      // Verify user still exists and is active
      const userQuery = await pool.query(
        'SELECT id, telegram_id, username, display_name, is_active FROM players WHERE id = $1',
        [decoded.userId]
      );

      if (userQuery.rows.length === 0) {
        return res.status(403).json({
          success: false,
          error: 'USER_NOT_FOUND',
          message: 'User not found'
        });
      }

      const user = userQuery.rows[0];
      
      if (!user.is_active) {
        return res.status(403).json({
          success: false,
          error: 'USER_INACTIVE',
          message: 'User account is inactive'
        });
      }

      req.user = {
        id: user.id,
        telegramId: user.telegram_id,
        username: user.username,
        displayName: user.display_name
      };

      // Update last active timestamp
      await pool.query(
        'UPDATE players SET last_active_at = NOW() WHERE id = $1',
        [user.id]
      );

      next();
    } catch (error) {
      return res.status(403).json({
        success: false,
        error: 'INVALID_TOKEN',
        message: 'Invalid or expired token'
      });
    }
  };
}

export function requireRole(roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'AUTHENTICATION_REQUIRED',
        message: 'Authentication required'
      });
    }

    // For now, all authenticated users have basic access
    // In the future, you can implement role-based access control
    next();
  };
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'AUTHENTICATION_REQUIRED',
      message: 'Authentication required'
    });
  }

  // For now, check if user has admin privileges
  // This can be enhanced with proper role management
  if (req.user.username && req.user.username.includes('admin')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: 'INSUFFICIENT_PERMISSIONS',
      message: 'Admin privileges required'
    });
  }
}

export { AuthenticatedRequest };
