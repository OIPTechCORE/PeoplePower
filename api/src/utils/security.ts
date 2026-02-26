import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Security utilities for the People Power Journey application

export class SecurityUtils {
  // Generate secure random token
  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  // Generate secure referral code
  static generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Hash password securely
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  // Verify password
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Generate secure session ID
  static generateSessionId(): string {
    return crypto.randomBytes(32).toString('base64url');
  }

  // Create HMAC signature for webhook verification
  static createHMACSignature(payload: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
  }

  // Verify HMAC signature
  static verifyHMACSignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = this.createHMACSignature(payload, secret);
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  }

  // Sanitize input to prevent XSS
  static sanitizeInput(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }

  // Validate and sanitize email
  static sanitizeEmail(email: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
    return email.toLowerCase().trim();
  }

  // Generate secure API key
  static generateApiKey(): string {
    const prefix = 'pp_'; // People Power prefix
    const randomPart = crypto.randomBytes(24).toString('base64url');
    return `${prefix}${randomPart}`;
  }

  // Rate limiting key generator
  static generateRateLimitKey(identifier: string, action: string): string {
    return `rate_limit:${identifier}:${action}`;
  }

  // CSRF token generation
  static generateCSRFToken(): string {
    return crypto.randomBytes(32).toString('base64url');
  }

  // Verify CSRF token
  static verifyCSRFToken(token: string, sessionToken: string): boolean {
    // In a real implementation, you'd store and compare against session
    return token && sessionToken && token === sessionToken;
  }

  // Encrypt sensitive data
  static encrypt(text: string, key: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher('aes-256-cbc', key);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  // Decrypt sensitive data
  static decrypt(encryptedText: string, key: string): string {
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedData = textParts.join(':');
    const decipher = crypto.createDecipher('aes-256-cbc', key);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  // Validate Telegram Web App data
  static validateTelegramData(initData: string, botToken: string): boolean {
    try {
      const urlParams = new URLSearchParams(initData);
      const hash = urlParams.get('hash');
      
      if (!hash) {
        return false;
      }

      // Remove hash from data
      urlParams.delete('hash');
      
      // Sort parameters alphabetically
      const sortedParams = Array.from(urlParams.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

      // Create HMAC-SHA256 signature
      const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
      const signature = crypto.createHmac('sha256', secretKey).update(sortedParams).digest('hex');

      return signature === hash;
    } catch (error) {
      console.error('Telegram data validation error:', error);
      return false;
    }
  }

  // Check for common security issues in input
  static detectSecurityIssues(input: string): string[] {
    const issues: string[] = [];
    
    // SQL injection patterns
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(--|\/\*|\*\/|;|'|")/,
      /\bOR\b.*\b1\s*=\s*1\b/i,
      /\bAND\b.*\b1\s*=\s*1\b/i
    ];

    // XSS patterns
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>/gi
    ];

    // Check for SQL injection
    sqlPatterns.forEach(pattern => {
      if (pattern.test(input)) {
        issues.push('Potential SQL injection detected');
      }
    });

    // Check for XSS
    xssPatterns.forEach(pattern => {
      if (pattern.test(input)) {
        issues.push('Potential XSS detected');
      }
    });

    // Check for path traversal
    if (/\.\./.test(input)) {
      issues.push('Potential path traversal detected');
    }

    return issues;
  }

  // Generate secure password requirements
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    issues: string[];
    score: number;
  } {
    const issues: string[] = [];
    let score = 0;

    if (password.length < 8) {
      issues.push('Password must be at least 8 characters long');
    } else {
      score += 1;
    }

    if (!/[a-z]/.test(password)) {
      issues.push('Password must contain lowercase letters');
    } else {
      score += 1;
    }

    if (!/[A-Z]/.test(password)) {
      issues.push('Password must contain uppercase letters');
    } else {
      score += 1;
    }

    if (!/\d/.test(password)) {
      issues.push('Password must contain numbers');
    } else {
      score += 1;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      issues.push('Password must contain special characters');
    } else {
      score += 1;
    }

    return {
      isValid: issues.length === 0,
      issues,
      score: Math.min(score, 5)
    };
  }

  // Rate limiting implementation
  static createRateLimiter(maxRequests: number, windowMs: number) {
    const requests = new Map<string, { count: number; resetTime: number }>();

    return (identifier: string): boolean => {
      const now = Date.now();
      const key = this.generateRateLimitKey(identifier, 'general');
      const record = requests.get(key);

      if (!record || now > record.resetTime) {
        requests.set(key, { count: 1, resetTime: now + windowMs });
        return true;
      }

      if (record.count >= maxRequests) {
        return false;
      }

      record.count++;
      return true;
    };
  }

  // IP address validation
  static isValidIP(ip: string): boolean {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }

  // Content Security Policy header generator
  static generateCSP(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.telegram.org",
      "frame-src 'none'",
      "object-src 'none'",
      "media-src 'self'",
      "manifest-src 'self'"
    ].join('; ');
  }
}
