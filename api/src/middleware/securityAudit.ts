import { Request, Response, NextFunction } from 'express';
import { SecurityUtils } from '../utils/security';
import { logger } from '../utils/logger';

// Security audit middleware
export function securityAudit(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  
  // Log request details for security monitoring
  const auditData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    headers: req.headers,
    body: req.method !== 'GET' ? sanitizeRequestBody(req.body) : undefined
  };

  // Check for security issues in request
  const securityIssues: string[] = [];
  
  // Check URL for security issues
  if (req.originalUrl) {
    const urlIssues = SecurityUtils.detectSecurityIssues(req.originalUrl);
    securityIssues.push(...urlIssues.map(issue => `URL: ${issue}`));
  }

  // Check body for security issues
  if (req.body && typeof req.body === 'object') {
    const bodyStr = JSON.stringify(req.body);
    const bodyIssues = SecurityUtils.detectSecurityIssues(bodyStr);
    securityIssues.push(...bodyIssues.map(issue => `Body: ${issue}`));
  }

  // Check query parameters
  if (req.query) {
    const queryStr = JSON.stringify(req.query);
    const queryIssues = SecurityUtils.detectSecurityIssues(queryStr);
    securityIssues.push(...queryIssues.map(issue => `Query: ${issue}`));
  }

  // Log security issues if found
  if (securityIssues.length > 0) {
    logger.warn('Security issues detected', {
      ...auditData,
      issues: securityIssues,
      severity: 'medium'
    });
    
    // Block request if critical issues found
    if (securityIssues.some(issue => issue.includes('SQL injection'))) {
      return res.status(400).json({
        success: false,
        error: 'SECURITY_VIOLATION',
        message: 'Request contains potentially malicious content'
      });
    }
  }

  // Log successful request
  logger.info('Request processed', {
    ...auditData,
    duration: Date.now() - startTime,
    status: 'success'
  });

  next();
}

// Sanitize request body for logging
function sanitizeRequestBody(body: any): any {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sanitized = { ...body };
  
  // Remove sensitive fields
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth'];
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });

  return sanitized;
}

// IP whitelist middleware
export function ipWhitelist(allowedIPs: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    
    if (!clientIP) {
      return res.status(400).json({
        success: false,
        error: 'IP_ADDRESS_MISSING',
        message: 'Unable to determine client IP address'
      });
    }

    if (!allowedIPs.includes(clientIP)) {
      logger.warn('Unauthorized IP access attempt', {
        ip: clientIP,
        url: req.originalUrl,
        userAgent: req.get('User-Agent')
      });
      
      return res.status(403).json({
        success: false,
        error: 'IP_NOT_ALLOWED',
        message: 'Access denied from this IP address'
      });
    }

    next();
  };
}

// Advanced rate limiting with Redis
export function advancedRateLimit(options: {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: Request) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}) {
  const requests = new Map<string, { count: number; resetTime: number; blockedUntil?: number }>();
  
  const {
    windowMs,
    maxRequests,
    keyGenerator = (req) => req.ip || 'unknown',
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyGenerator(req);
    const now = Date.now();
    const record = requests.get(key);

    // Check if currently blocked
    if (record && record.blockedUntil && now < record.blockedUntil) {
      const remainingTime = Math.ceil((record.blockedUntil - now) / 1000);
      
      logger.warn('Rate limit exceeded - request blocked', {
        key,
        remainingTime,
        url: req.originalUrl
      });

      return res.status(429).json({
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message: `Too many requests. Try again in ${remainingTime} seconds.`,
        retryAfter: remainingTime
      });
    }

    // Initialize or update record
    if (!record || now > record.resetTime) {
      requests.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }

    record.count++;

    // Check if limit exceeded
    if (record.count > maxRequests) {
      // Implement exponential backoff for repeated violations
      const violationCount = Math.floor(record.count / maxRequests);
      const blockDuration = Math.min(windowMs * Math.pow(2, violationCount - 1), 300000); // Max 5 minutes
      
      record.blockedUntil = now + blockDuration;

      logger.warn('Rate limit exceeded - applying backoff', {
        key,
        count: record.count,
        maxRequests,
        blockDuration,
        url: req.originalUrl
      });

      return res.status(429).json({
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message: `Rate limit exceeded. Blocked for ${Math.ceil(blockDuration / 1000)} seconds.`,
        retryAfter: Math.ceil(blockDuration / 1000)
      });
    }

    next();
  };
}

// Request size limiting
export function requestSizeLimit(maxSize: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.get('Content-Length') || '0');
    
    if (contentLength > maxSize) {
      logger.warn('Request size limit exceeded', {
        size: contentLength,
        maxSize,
        url: req.originalUrl,
        ip: req.ip
      });

      return res.status(413).json({
        success: false,
        error: 'REQUEST_TOO_LARGE',
        message: `Request size ${contentLength} exceeds maximum allowed size ${maxSize}`
      });
    }

    next();
  };
}

// CORS configuration for security
export function secureCORS(req: Request, res: Response, next: NextFunction) {
  const allowedOrigins = [
    'https://t.me',
    'https://web.telegram.org',
    process.env.FRONTEND_URL
  ].filter(Boolean);

  const origin = req.get('Origin');
  
  if (allowedOrigins.includes(origin || '')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Telegram-Init-Data');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
}

// Content Security Policy middleware
export function contentSecurityPolicy(req: Request, res: Response, next: NextFunction) {
  const csp = SecurityUtils.generateCSP();
  res.setHeader('Content-Security-Policy', csp);
  next();
}

// Security headers middleware
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // Remove server information
  res.removeHeader('X-Powered-By');
  
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  next();
}

// Input validation middleware
export function validateInput(req: Request, res: Response, next: NextFunction) {
  const validationErrors: string[] = [];

  // Validate query parameters
  if (req.query) {
    for (const [key, value] of Object.entries(req.query)) {
      if (typeof value === 'string') {
        const issues = SecurityUtils.detectSecurityIssues(value);
        if (issues.length > 0) {
          validationErrors.push(`Query parameter '${key}': ${issues.join(', ')}`);
        }
      }
    }
  }

  // Validate request body
  if (req.body && typeof req.body === 'object') {
    const bodyStr = JSON.stringify(req.body);
    const issues = SecurityUtils.detectSecurityIssues(bodyStr);
    if (issues.length > 0) {
      validationErrors.push(`Request body: ${issues.join(', ')}`);
    }
  }

  if (validationErrors.length > 0) {
    logger.warn('Input validation failed', {
      errors: validationErrors,
      url: req.originalUrl,
      ip: req.ip
    });

    return res.status(400).json({
      success: false,
      error: 'VALIDATION_FAILED',
      message: 'Input validation failed',
      details: validationErrors
    });
  }

  next();
}
