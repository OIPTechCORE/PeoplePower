import { Request, Response, NextFunction } from 'express';
import { Pool } from 'pg';

/**
 * Extended Request interface with ecosystem authentication data
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    isActive: boolean;
    lastActiveAt: Date;
    ecosystems: {
      stars: boolean;
      diamonds: boolean;
      gifts: boolean;
      marketplace: boolean;
      charity: boolean;
      leaderboard: boolean;
      tasksboard: boolean;
    };
  };
  admin?: {
    id: string;
    accessLevel: string;
    permissions: any;
  };
}

/**
 * Ecosystem Authentication Middleware
 * Validates user access to specific ecosystems
 */
export class EcosystemAuthMiddleware {
  constructor(private pool: Pool) {}

  /**
   * Basic user authentication - verifies user exists and is active
   */
  authenticateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const userId = req.headers['x-user-id'] as string;
      
      if (!userId && !authHeader) {
        res.status(401).json({ 
          success: false, 
          error: 'Authentication required - provide user ID or auth token' 
        });
        return;
      }

      // Extract user ID from auth header or direct header
      const targetUserId = userId || this.extractUserIdFromToken(authHeader);
      
      if (!targetUserId) {
        res.status(401).json({ 
          success: false, 
          error: 'Invalid authentication credentials' 
        });
        return;
      }

      // Verify user exists and is active
      const userResult = await this.pool.query(
        'SELECT id, username, email, is_active, last_active_at FROM players WHERE id = $1',
        [targetUserId]
      );

      if (userResult.rows.length === 0) {
        res.status(404).json({ 
          success: false, 
          error: 'User not found' 
        });
        return;
      }

      const user = userResult.rows[0];

      if (!user.is_active) {
        res.status(403).json({ 
          success: false, 
          error: 'User account is inactive' 
        });
        return;
      }

      // Check which ecosystems user has access to
      const ecosystemAccess = await this.checkEcosystemAccess(targetUserId);

      // Update last active timestamp
      await this.updateLastActive(targetUserId);

      req.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        isActive: user.is_active,
        lastActiveAt: user.last_active_at,
        ecosystems: ecosystemAccess
      };

      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Authentication service error' 
      });
    }
  };

  /**
   * Ecosystem-specific access control
   */
  requireEcosystemAccess = (ecosystem: keyof typeof ECOSYSTEM_PERMISSIONS) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
      try {
        if (!req.user) {
          res.status(401).json({ 
            success: false, 
            error: 'Authentication required' 
          });
          return;
        }

        const hasAccess = req.user.ecosystems[ecosystem];
        
        if (!hasAccess) {
          res.status(403).json({ 
            success: false, 
            error: `Access denied to ${ecosystem} ecosystem` 
          });
          return;
        }

        next();
      } catch (error) {
        console.error('Ecosystem access error:', error);
        res.status(500).json({ 
          success: false, 
          error: 'Access control error' 
        });
      }
    };
  };

  /**
   * Admin authentication with role-based access
   */
  authenticateAdmin = (requiredAccessLevel: string = 'READ_ONLY') => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
      try {
        const adminId = req.headers['x-admin-id'] as string;
        
        if (!adminId) {
          res.status(401).json({ 
            success: false, 
            error: 'Admin authentication required' 
          });
          return;
        }

        // Verify admin exists and get permissions
        const adminResult = await this.pool.query(
          'SELECT * FROM super_admin_dashboard WHERE admin_id = $1',
          [adminId]
        );

        if (adminResult.rows.length === 0) {
          res.status(403).json({ 
            success: false, 
            error: 'Admin not found' 
          });
          return;
        }

        const admin = adminResult.rows[0];

        // Check access level hierarchy
        if (!this.hasRequiredAccess(admin.access_level, requiredAccessLevel)) {
          res.status(403).json({ 
            success: false, 
            error: 'Insufficient admin access level' 
          });
          return;
        }

        // Update last login
        await this.pool.query(
          'UPDATE super_admin_dashboard SET last_login_at = NOW() WHERE admin_id = $1',
          [adminId]
        );

        req.admin = {
          id: admin.admin_id,
          accessLevel: admin.access_level,
          permissions: admin.permissions
        };

        next();
      } catch (error) {
        console.error('Admin authentication error:', error);
        res.status(500).json({ 
          success: false, 
          error: 'Admin authentication service error' 
        });
      }
    };
  };

  /**
   * Rate limiting middleware for ecosystem endpoints
   */
  rateLimit = (maxRequests: number, windowMs: number) => {
    const requests = new Map<string, { count: number; resetTime: number }>();

    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      const userId = req.user?.id || req.ip;
      const now = Date.now();
      const userRequests = requests.get(userId);

      if (!userRequests || now > userRequests.resetTime) {
        requests.set(userId, {
          count: 1,
          resetTime: now + windowMs
        });
        return next();
      }

      if (userRequests.count >= maxRequests) {
        res.status(429).json({
          success: false,
          error: 'Too many requests',
          retryAfter: Math.ceil((userRequests.resetTime - now) / 1000)
        });
        return;
      }

      userRequests.count++;
      next();
    };
  };

  /**
   * API key authentication for service-to-service communication
   */
  authenticateApiKey = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
      const apiKey = req.headers['x-api-key'] as string;
      
      if (!apiKey) {
        res.status(401).json({ 
          success: false, 
          error: 'API key required' 
        });
        return;
      }

      // Validate API key (in production, this would be more secure)
      const validApiKeys = process.env.VALID_API_KEYS?.split(',') || [];
      
      if (!validApiKeys.includes(apiKey)) {
        res.status(401).json({ 
          success: false, 
          error: 'Invalid API key' 
        });
        return;
      }

      // Set service user context
      req.user = {
        id: 'service-user',
        username: 'service',
        email: 'service@peoplepower.local',
        isActive: true,
        lastActiveAt: new Date(),
        ecosystems: {
          stars: true,
          diamonds: true,
          gifts: true,
          marketplace: true,
          charity: true,
          leaderboard: true,
          tasksboard: true
        }
      };

      next();
    } catch (error) {
      console.error('API key authentication error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'API key authentication error' 
      });
    }
  };

  /**
   * Content validation middleware
   */
  validateContent = (allowedFields: string[], maxFieldLength?: number) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      try {
        const body = req.body;

        // Check for unexpected fields
        const bodyFields = Object.keys(body);
        const unexpectedFields = bodyFields.filter(field => !allowedFields.includes(field));
        
        if (unexpectedFields.length > 0) {
          res.status(400).json({
            success: false,
            error: `Unexpected fields: ${unexpectedFields.join(', ')}`
          });
          return;
        }

        // Validate field lengths
        if (maxFieldLength) {
          for (const field of allowedFields) {
            if (body[field] && typeof body[field] === 'string' && body[field].length > maxFieldLength) {
              res.status(400).json({
                success: false,
                error: `Field ${field} exceeds maximum length of ${maxFieldLength} characters`
              });
              return;
            }
          }
        }

        // Basic XSS protection
        for (const field of allowedFields) {
          if (body[field] && typeof body[field] === 'string') {
            if (this.containsXSS(body[field])) {
              res.status(400).json({
                success: false,
                error: `Invalid content in field ${field}`
              });
              return;
            }
          }
        }

        next();
      } catch (error) {
        console.error('Content validation error:', error);
        res.status(500).json({ 
          success: false, 
          error: 'Content validation error' 
        });
      }
    };
  };

  // ==================== PRIVATE HELPER METHODS ====================

  private extractUserIdFromToken(authHeader: string): string | null {
    try {
      // Simple token extraction - in production, use proper JWT verification
      if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        // This would be JWT verification in production
        return JSON.parse(atob(token)).userId;
      }
      return null;
    } catch {
      return null;
    }
  }

  private async checkEcosystemAccess(userId: string): Promise<{
    stars: boolean;
    diamonds: boolean;
    gifts: boolean;
    marketplace: boolean;
    charity: boolean;
    leaderboard: boolean;
    tasksboard: boolean;
  }> {
    try {
      const ecosystems = ['stars', 'diamonds', 'gifts', 'marketplace', 'charity', 'leaderboard', 'tasksboard'];
      const access: any = {};

      for (const ecosystem of ecosystems) {
        const result = await this.pool.query(
          `SELECT COUNT(*) as count FROM ${ecosystem}_ecosystems WHERE player_id = $1`,
          [userId]
        );
        access[ecosystem] = parseInt(result.rows[0].count) > 0;
      }

      return access;
    } catch (error) {
      console.error('Error checking ecosystem access:', error);
      // Return default access on error
      return {
        stars: false,
        diamonds: false,
        gifts: false,
        marketplace: false,
        charity: false,
        leaderboard: false,
        tasksboard: false
      };
    }
  }

  private async updateLastActive(userId: string): Promise<void> {
    try {
      await this.pool.query(
        'UPDATE players SET last_active_at = NOW() WHERE id = $1',
        [userId]
      );
    } catch (error) {
      console.error('Error updating last active:', error);
    }
  }

  private hasRequiredAccess(currentLevel: string, requiredLevel: string): boolean {
    const hierarchy = [
      'READ_ONLY',
      'MODERATOR',
      'ADMINISTRATOR',
      'SUPER_ADMIN',
      'SYSTEM_OWNER'
    ];

    const currentIndex = hierarchy.indexOf(currentLevel);
    const requiredIndex = hierarchy.indexOf(requiredLevel);

    return currentIndex >= requiredIndex;
  }

  private containsXSS(content: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi
    ];

    return xssPatterns.some(pattern => pattern.test(content));
  }
}

// ==================== ECOSYSTEM PERMISSIONS ====================

export const ECOSYSTEM_PERMISSIONS = {
  STARS: {
    READ: 'stars:read',
    WRITE: 'stars:write',
    TRADE: 'stars:trade',
    ADMIN: 'stars:admin'
  },
  DIAMONDS: {
    READ: 'diamonds:read',
    WRITE: 'diamonds:write',
    MINE: 'diamonds:mine',
    CRAFT: 'diamonds:craft',
    ADMIN: 'diamonds:admin'
  },
  GIFTS: {
    READ: 'gifts:read',
    WRITE: 'gifts:write',
    SEND: 'gifts:send',
    ADMIN: 'gifts:admin'
  },
  MARKETPLACE: {
    READ: 'marketplace:read',
    WRITE: 'marketplace:write',
    TRADE: 'marketplace:trade',
    ADMIN: 'marketplace:admin'
  },
  CHARITY: {
    READ: 'charity:read',
    WRITE: 'charity:write',
    DONATE: 'charity:donate',
    ADMIN: 'charity:admin'
  },
  LEADERBOARD: {
    READ: 'leaderboard:read',
    WRITE: 'leaderboard:write',
    COMPETE: 'leaderboard:compete',
    ADMIN: 'leaderboard:admin'
  },
  TASKSBOARD: {
    READ: 'tasksboard:read',
    WRITE: 'tasksboard:write',
    MANAGE: 'tasksboard:manage',
    ADMIN: 'tasksboard:admin'
  }
};

// ==================== MIDDLEWARE FACTORIES ====================

/**
 * Factory function to create ecosystem middleware
 */
export const createEcosystemMiddleware = (pool: Pool) => {
  const auth = new EcosystemAuthMiddleware(pool);
  
  return {
    authenticateUser: auth.authenticateUser,
    requireEcosystemAccess: auth.requireEcosystemAccess,
    authenticateAdmin: auth.authenticateAdmin,
    rateLimit: auth.rateLimit,
    authenticateApiKey: auth.authenticateApiKey,
    validateContent: auth.validateContent
  };
};

// ==================== COMMON MIDDLEWARE COMBINATIONS ====================

/**
 * Standard user authentication with rate limiting
 */
export const standardAuth = (pool: Pool) => {
  const auth = createEcosystemMiddleware(pool);
  return [
    auth.authenticateUser,
    auth.rateLimit(100, 60 * 1000) // 100 requests per minute
  ];
};

/**
 * Admin authentication with stricter rate limiting
 */
export const adminAuth = (pool: Pool, requiredLevel?: string) => {
  const auth = createEcosystemMiddleware(pool);
  return [
    auth.authenticateAdmin(requiredLevel),
    auth.rateLimit(50, 60 * 1000) // 50 requests per minute for admins
  ];
};

/**
 * Service-to-service authentication
 */
export const serviceAuth = (pool: Pool) => {
  const auth = createEcosystemMiddleware(pool);
  return [
    auth.authenticateApiKey,
    auth.rateLimit(1000, 60 * 1000) // Higher limit for services
  ];
};
