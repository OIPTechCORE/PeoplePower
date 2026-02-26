import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'jest';
import { SecurityUtils } from '../../api/src/utils/security';

describe('Security Utils Tests', () => {
  describe('Token Generation', () => {
    it('should generate secure tokens of specified length', () => {
      const token = SecurityUtils.generateSecureToken(32);
      expect(token).toHaveLength(64); // 32 bytes = 64 hex chars
      expect(token).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should generate different tokens each time', () => {
      const token1 = SecurityUtils.generateSecureToken(16);
      const token2 = SecurityUtils.generateSecureToken(16);
      expect(token1).not.toBe(token2);
    });

    it('should generate valid referral codes', () => {
      const code = SecurityUtils.generateReferralCode();
      expect(code).toHaveLength(8);
      expect(code).toMatch(/^[A-Z0-9]{8}$/);
    });

    it('should generate unique referral codes', () => {
      const codes = new Set();
      for (let i = 0; i < 1000; i++) {
        codes.add(SecurityUtils.generateReferralCode());
      }
      expect(codes.size).toBe(1000);
    });
  });

  describe('Password Security', () => {
    it('should hash passwords correctly', async () => {
      const password = 'test-password-123';
      const hash = await SecurityUtils.hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(50);
      expect(hash).toMatch(/^\$2[aby]\$\d+\$/); // bcrypt format
    });

    it('should verify correct passwords', async () => {
      const password = 'test-password-123';
      const hash = await SecurityUtils.hashPassword(password);
      const isValid = await SecurityUtils.verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect passwords', async () => {
      const password = 'test-password-123';
      const wrongPassword = 'wrong-password';
      const hash = await SecurityUtils.hashPassword(password);
      const isValid = await SecurityUtils.verifyPassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });
  });

  describe('Input Sanitization', () => {
    it('should sanitize input for XSS prevention', () => {
      const maliciousInput = '<script>alert("xss")</script>Hello World';
      const sanitized = SecurityUtils.sanitizeInput(maliciousInput);
      expect(sanitized).toBe('alert("xss")Hello World');
    });

    it('should remove javascript: protocol', () => {
      const maliciousInput = 'javascript:alert("xss")';
      const sanitized = SecurityUtils.sanitizeInput(maliciousInput);
      expect(sanitized).toBe('alert("xss")');
    });

    it('should remove event handlers', () => {
      const maliciousInput = 'onclick="alert("xss")"';
      const sanitized = SecurityUtils.sanitizeInput(maliciousInput);
      expect(sanitized).toBe('"alert("xss")"');
    });

    it('should handle empty input', () => {
      const sanitized = SecurityUtils.sanitizeInput('');
      expect(sanitized).toBe('');
    });

    it('should handle null/undefined input', () => {
      const sanitized1 = SecurityUtils.sanitizeInput(null as any);
      const sanitized2 = SecurityUtils.sanitizeInput(undefined as any);
      expect(sanitized1).toBe('');
      expect(sanitized2).toBe('');
    });
  });

  describe('Email Validation', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com'
      ];

      validEmails.forEach(email => {
        expect(() => SecurityUtils.sanitizeEmail(email)).not.toThrow();
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test.example.com',
        'test@.com',
        ''
      ];

      invalidEmails.forEach(email => {
        expect(() => SecurityUtils.sanitizeEmail(email)).toThrow('Invalid email format');
      });
    });

    it('should normalize email case', () => {
      const email = 'Test.USER@EXAMPLE.COM';
      const sanitized = SecurityUtils.sanitizeEmail(email);
      expect(sanitized).toBe('test.user@example.com');
    });
  });

  describe('Security Issue Detection', () => {
    it('should detect SQL injection attempts', () => {
      const sqlInputs = [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "1' UNION SELECT * FROM users --",
        "'; INSERT INTO users VALUES ('hacker', 'pass'); --"
      ];

      sqlInputs.forEach(input => {
        const issues = SecurityUtils.detectSecurityIssues(input);
        expect(issues.length).toBeGreaterThan(0);
        expect(issues.some(issue => issue.includes('SQL injection'))).toBe(true);
      });
    });

    it('should detect XSS attempts', () => {
      const xssInputs = [
        '<script>alert("xss")</script>',
        '<img src="x" onerror="alert(1)">',
        'javascript:alert("xss")',
        '<iframe src="javascript:alert(1)"></iframe>'
      ];

      xssInputs.forEach(input => {
        const issues = SecurityUtils.detectSecurityIssues(input);
        expect(issues.length).toBeGreaterThan(0);
        expect(issues.some(issue => issue.includes('XSS'))).toBe(true);
      });
    });

    it('should detect path traversal attempts', () => {
      const pathInputs = [
        '../../../etc/passwd',
        '..\\..\\windows\\system32',
        'file:///etc/passwd',
        '....//....//....//etc/passwd'
      ];

      pathInputs.forEach(input => {
        const issues = SecurityUtils.detectSecurityIssues(input);
        expect(issues.length).toBeGreaterThan(0);
        expect(issues.some(issue => issue.includes('path traversal'))).toBe(true);
      });
    });

    it('should not flag safe input', () => {
      const safeInputs = [
        'Hello World',
        'This is a normal message',
        'user@example.com',
        '12345',
        'normal-text-with-dashes'
      ];

      safeInputs.forEach(input => {
        const issues = SecurityUtils.detectSecurityIssues(input);
        expect(issues.length).toBe(0);
      });
    });
  });

  describe('Password Strength Validation', () => {
    it('should validate strong passwords', () => {
      const strongPassword = 'MyStr0ng!P@ssw0rd';
      const result = SecurityUtils.validatePasswordStrength(strongPassword);
      
      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
      expect(result.score).toBe(5);
    });

    it('should reject weak passwords', () => {
      const weakPassword = '123';
      const result = SecurityUtils.validatePasswordStrength(weakPassword);
      
      expect(result.isValid).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.score).toBeLessThan(5);
    });

    it('should identify specific password issues', () => {
      const password = 'short';
      const result = SecurityUtils.validatePasswordStrength(password);
      
      expect(result.issues).toContain('Password must be at least 8 characters long');
      expect(result.issues).toContain('Password must contain uppercase letters');
      expect(result.issues).toContain('Password must contain numbers');
      expect(result.issues).toContain('Password must contain special characters');
    });

    it('should score passwords correctly', () => {
      const testCases = [
        { password: 'short', expectedScore: 1 }, // length only
        { password: 'shortlower', expectedScore: 2 }, // length + lowercase
        { password: 'Shortlower', expectedScore: 3 }, // length + lowercase + uppercase
        { password: 'Short1lower', expectedScore: 4 }, // length + lowercase + uppercase + numbers
        { password: 'Short1lower!', expectedScore: 5 } // all requirements
      ];

      testCases.forEach(({ password, expectedScore }) => {
        const result = SecurityUtils.validatePasswordStrength(password);
        expect(result.score).toBe(expectedScore);
      });
    });
  });

  describe('HMAC Operations', () => {
    it('should create and verify HMAC signatures', () => {
      const payload = 'test-payload';
      const secret = 'test-secret';
      
      const signature = SecurityUtils.createHMACSignature(payload, secret);
      const isValid = SecurityUtils.verifyHMACSignature(payload, signature, secret);
      
      expect(isValid).toBe(true);
    });

    it('should reject invalid HMAC signatures', () => {
      const payload = 'test-payload';
      const secret = 'test-secret';
      const wrongSignature = 'invalid-signature';
      
      const isValid = SecurityUtils.verifyHMACSignature(payload, wrongSignature, secret);
      expect(isValid).toBe(false);
    });

    it('should reject signatures with wrong secret', () => {
      const payload = 'test-payload';
      const secret = 'test-secret';
      const wrongSecret = 'wrong-secret';
      
      const signature = SecurityUtils.createHMACSignature(payload, secret);
      const isValid = SecurityUtils.verifyHMACSignature(payload, signature, wrongSecret);
      expect(isValid).toBe(false);
    });
  });

  describe('Telegram Data Validation', () => {
    it('should validate correct telegram data', () => {
      // This is a simplified test - in reality, telegram data is more complex
      const mockTelegramData = 'auth_date=1234567890&id=12345&hash=validhash';
      const botToken = 'test-bot-token';
      
      // Mock the validation since we can't easily create real telegram hashes
      const mockCreateHmac = jest.fn().mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('validhash')
      });
      
      (require('crypto').createHmac as jest.Mock) = mockCreateHmac;
      
      const isValid = SecurityUtils.validateTelegramData(mockTelegramData, botToken);
      expect(isValid).toBe(true);
      
      jest.restoreAllMocks();
    });

    it('should reject invalid telegram data', () => {
      const invalidData = 'invalid-data';
      const botToken = 'test-bot-token';
      
      const isValid = SecurityUtils.validateTelegramData(invalidData, botToken);
      expect(isValid).toBe(false);
    });
  });

  describe('Rate Limiting', () => {
    it('should allow requests within limit', () => {
      const rateLimiter = SecurityUtils.createRateLimiter(5, 60000); // 5 requests per minute
      
      expect(rateLimiter('user1')).toBe(true);
      expect(rateLimiter('user1')).toBe(true);
      expect(rateLimiter('user1')).toBe(true);
      expect(rateLimiter('user1')).toBe(true);
      expect(rateLimiter('user1')).toBe(true);
    });

    it('should block requests exceeding limit', () => {
      const rateLimiter = SecurityUtils.createRateLimiter(2, 60000); // 2 requests per minute
      
      expect(rateLimiter('user1')).toBe(true);
      expect(rateLimiter('user1')).toBe(true);
      expect(rateLimiter('user1')).toBe(false); // Should be blocked
    });

    it('should handle different users independently', () => {
      const rateLimiter = SecurityUtils.createRateLimiter(1, 60000); // 1 request per minute
      
      expect(rateLimiter('user1')).toBe(true);
      expect(rateLimiter('user2')).toBe(true); // Different user should be allowed
      expect(rateLimiter('user1')).toBe(false); // user1 should be blocked
      expect(rateLimiter('user2')).toBe(false); // user2 should be blocked
    });
  });

  describe('IP Validation', () => {
    it('should validate IPv4 addresses', () => {
      const validIPv4 = [
        '192.168.1.1',
        '127.0.0.1',
        '10.0.0.1',
        '255.255.255.255'
      ];

      validIPv4.forEach(ip => {
        expect(SecurityUtils.isValidIP(ip)).toBe(true);
      });
    });

    it('should validate IPv6 addresses', () => {
      const validIPv6 = [
        '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
        '::1',
        'fe80::1',
        '2001:db8::1'
      ];

      validIPv6.forEach(ip => {
        expect(SecurityUtils.isValidIP(ip)).toBe(true);
      });
    });

    it('should reject invalid IP addresses', () => {
      const invalidIPs = [
        '256.256.256.256',
        '192.168.1',
        'not-an-ip',
        '192.168.1.1.1',
        ''
      ];

      invalidIPs.forEach(ip => {
        expect(SecurityUtils.isValidIP(ip)).toBe(false);
      });
    });
  });

  describe('CSP Generation', () => {
    it('should generate valid CSP header', () => {
      const csp = SecurityUtils.generateCSP();
      
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("script-src 'self'");
      expect(csp).toContain("style-src 'self'");
      expect(csp).toContain("connect-src 'self'");
      expect(csp).toContain(';');
    });

    it('should include all required directives', () => {
      const csp = SecurityUtils.generateCSP();
      const directives = [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self'",
        "font-src 'self'",
        "img-src 'self'",
        "connect-src 'self'",
        "frame-src 'none'",
        "object-src 'none'"
      ];

      directives.forEach(directive => {
        expect(csp).toContain(directive);
      });
    });
  });
});
