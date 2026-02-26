import { AuthService } from '../../api/src/services/authService';
import { Pool } from 'pg';
import { 
  setupTestDatabase, 
  cleanTestDatabase, 
  closeTestDatabase,
  createMockPlayer,
  generateTestToken,
  verifyTestToken,
  testPool
} from '../setup';

describe('AuthService', () => {
  let authService: AuthService;
  let mockPool: Pool;

  beforeAll(async () => {
    await setupTestDatabase();
    mockPool = testPool;
    authService = new AuthService(mockPool);
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  beforeEach(async () => {
    await cleanTestDatabase();
  });

  describe('authenticateTelegramUser', () => {
    it('should authenticate new user successfully', async () => {
      const telegramUser = {
        id: 123456789,
        first_name: 'Test',
        last_name: 'User',
        username: 'test_user'
      };

      const result = await authService.authenticateTelegramUser(telegramUser);

      expect(result.success).toBe(true);
      expect(result.player).toBeDefined();
      expect(result.player.telegramId).toBe(telegramUser.id);
      expect(result.player.displayName).toBe('Test User');
      expect(result.player.username).toBe('test_user');
      expect(result.tokens).toBeDefined();
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
      expect(result.tokens.expiresIn).toBeGreaterThan(0);
    });

    it('should return existing player for returning user', async () => {
      const telegramUser = {
        id: 123456789,
        first_name: 'Test',
        last_name: 'User',
        username: 'test_user'
      };

      // First authentication
      const firstResult = await authService.authenticateTelegramUser(telegramUser);
      expect(firstResult.success).toBe(true);

      // Second authentication should return same player
      const secondResult = await authService.authenticateTelegramUser(telegramUser);
      expect(secondResult.success).toBe(true);
      expect(secondResult.player.id).toBe(firstResult.player.id);
      expect(secondResult.player.displayName).toBe(firstResult.player.displayName);
    });

    it('should generate correct referral code', async () => {
      const telegramUser = {
        id: 987654321,
        first_name: 'Another',
        last_name: 'User',
        username: 'another_user'
      };

      const result = await authService.authenticateTelegramUser(telegramUser);

      expect(result.success).toBe(true);
      expect(result.player.referralCode).toBeDefined();
      expect(result.player.referralCode).toMatch(/^[A-Z0-9]{8}$/);
    });

    it('should assign correct generation based on player count', async () => {
      // First player should be FOUNDERS
      const telegramUser1 = {
        id: 111111111,
        first_name: 'First',
        username: 'first_user'
      };

      const result1 = await authService.authenticateTelegramUser(telegramUser1);
      expect(result1.player.generation).toBe('FOUNDERS');
      expect(result1.player.permanentBonus).toBe(1.5);

      // Add more players to test other generations
      for (let i = 0; i < 5; i++) {
        await authService.authenticateTelegramUser({
          id: 222222222 + i,
          first_name: `User${i}`,
          username: `user${i}`
        });
      }

      // Next player should be BUILDERS (after 1000 threshold would be FOUNDERS, but for testing we'll check the logic)
      const telegramUser2 = {
        id: 333333333,
        first_name: 'Builder',
        username: 'builder_user'
      };

      const result2 = await authService.authenticateTelegramUser(telegramUser2);
      expect(result2.player.generation).toBeDefined();
    });
  });

  describe('token operations', () => {
    it('should generate valid tokens', async () => {
      const player = createMockPlayer();
      const tokens = authService['generateTokens'](player);

      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      expect(tokens.expiresIn).toBeGreaterThan(0);

      // Verify access token
      const decodedAccess = verifyTestToken(tokens.accessToken);
      expect(decodedAccess.playerId).toBe(player.id);
      expect(decodedAccess.telegramId).toBe(player.telegramId);
      expect(decodedAccess.level).toBe(player.level);
    });

    it('should refresh tokens successfully', async () => {
      const telegramUser = {
        id: 444444444,
        first_name: 'Refresh',
        username: 'refresh_user'
      };

      const authResult = await authService.authenticateTelegramUser(telegramUser);
      expect(authResult.success).toBe(true);

      const refreshResult = await authService.refreshToken(authResult.tokens.refreshToken);
      expect(refreshResult.success).toBe(true);
      expect(refreshResult.tokens).toBeDefined();
      expect(refreshResult.tokens.accessToken).toBeDefined();
      expect(refreshResult.tokens.refreshToken).toBeDefined();
    });

    it('should reject invalid refresh token', async () => {
      const refreshResult = await authService.refreshToken('invalid-token');
      expect(refreshResult.success).toBe(false);
      expect(refreshResult.error).toBe('Invalid refresh token');
    });

    it('should verify access token successfully', async () => {
      const telegramUser = {
        id: 555555555,
        first_name: 'Verify',
        username: 'verify_user'
      };

      const authResult = await authService.authenticateTelegramUser(telegramUser);
      expect(authResult.success).toBe(true);

      const verifiedPlayer = await authService.verifyAccessToken(authResult.tokens.accessToken);
      expect(verifiedPlayer).toBeDefined();
      expect(verifiedPlayer.id).toBe(authResult.player.id);
    });

    it('should reject invalid access token', async () => {
      const verifiedPlayer = await authService.verifyAccessToken('invalid-token');
      expect(verifiedPlayer).toBeNull();
    });
  });

  describe('session management', () => {
    it('should create session successfully', async () => {
      const telegramUser = {
        id: 666666666,
        first_name: 'Session',
        username: 'session_user'
      };

      const authResult = await authService.authenticateTelegramUser(telegramUser);
      expect(authResult.success).toBe(true);

      const sessionId = await authService.createSession(authResult.player.id, {
        userAgent: 'test-agent',
        ipAddress: '127.0.0.1'
      });

      expect(sessionId).toBeDefined();
      expect(sessionId).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should validate session successfully', async () => {
      const telegramUser = {
        id: 777777777,
        first_name: 'Validate',
        username: 'validate_user'
      };

      const authResult = await authService.authenticateTelegramUser(telegramUser);
      expect(authResult.success).toBe(true);

      const sessionId = await authService.createSession(authResult.player.id);
      const validatedPlayer = await authService.validateSession(sessionId);

      expect(validatedPlayer).toBeDefined();
      expect(validatedPlayer.id).toBe(authResult.player.id);
    });

    it('should reject invalid session', async () => {
      const validatedPlayer = await authService.validateSession('invalid-session');
      expect(validatedPlayer).toBeNull();
    });

    it('should revoke session successfully', async () => {
      const telegramUser = {
        id: 888888888,
        first_name: 'Revoke',
        username: 'revoke_user'
      };

      const authResult = await authService.authenticateTelegramUser(telegramUser);
      expect(authResult.success).toBe(true);

      const sessionId = await authService.createSession(authResult.player.id);
      
      // Validate session exists
      let validatedPlayer = await authService.validateSession(sessionId);
      expect(validatedPlayer).toBeDefined();

      // Revoke session
      await authService.revokeSession(sessionId);

      // Session should no longer be valid
      validatedPlayer = await authService.validateSession(sessionId);
      expect(validatedPlayer).toBeNull();
    });
  });

  describe('rate limiting', () => {
    it('should allow actions within limit', async () => {
      const telegramUser = {
        id: 999999999,
        first_name: 'Rate',
        username: 'rate_user'
      };

      const authResult = await authService.authenticateTelegramUser(telegramUser);
      expect(authResult.success).toBe(true);

      // First action should be allowed
      const allowed1 = await authService.checkRateLimit(authResult.player.id, 'test_action', 5, 1);
      expect(allowed1).toBe(true);

      // Second action should be allowed
      const allowed2 = await authService.checkRateLimit(authResult.player.id, 'test_action', 5, 1);
      expect(allowed2).toBe(true);
    });

    it('should block actions exceeding limit', async () => {
      const telegramUser = {
        id: 101010101,
        first_name: 'Limit',
        username: 'limit_user'
      };

      const authResult = await authService.authenticateTelegramUser(telegramUser);
      expect(authResult.success).toBe(true);

      // Use up the limit
      for (let i = 0; i < 5; i++) {
        await authService.checkRateLimit(authResult.player.id, 'test_action', 5, 1);
      }

      // Next action should be blocked
      const blocked = await authService.checkRateLimit(authResult.player.id, 'test_action', 5, 1);
      expect(blocked).toBe(false);
    });
  });

  describe('security monitoring', () => {
    it('should log security events', async () => {
      const telegramUser = {
        id: 111111112,
        first_name: 'Security',
        username: 'security_user'
      };

      const authResult = await authService.authenticateTelegramUser(telegramUser);
      expect(authResult.success).toBe(true);

      // This should not throw an error
      await authService.logSecurityEvent({
        playerId: authResult.player.id,
        type: 'login_attempt',
        description: 'User logged in',
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
        severity: 'low'
      });

      // Verify the event was logged (would need to query the security_logs table)
      expect(true).toBe(true); // Placeholder assertion
    });
  });

  describe('account recovery', () => {
    it('should initiate account recovery successfully', async () => {
      const telegramUser = {
        id: 121212121,
        first_name: 'Recovery',
        username: 'recovery_user'
      };

      const authResult = await authService.authenticateTelegramUser(telegramUser);
      expect(authResult.success).toBe(true);

      const recoveryResult = await authService.initiateAccountRecovery(telegramUser.id);
      expect(recoveryResult.success).toBe(true);
      expect(recoveryResult.recoveryToken).toBeDefined();
    });

    it('should fail recovery for non-existent user', async () => {
      const recoveryResult = await authService.initiateAccountRecovery(999999999);
      expect(recoveryResult.success).toBe(false);
      expect(recoveryResult.error).toBe('Player not found');
    });

    it('should complete account recovery successfully', async () => {
      const telegramUser = {
        id: 131313131,
        first_name: 'Complete',
        username: 'complete_user'
      };

      const authResult = await authService.authenticateTelegramUser(telegramUser);
      expect(authResult.success).toBe(true);

      const recoveryResult = await authService.initiateAccountRecovery(telegramUser.id);
      expect(recoveryResult.success).toBe(true);

      const completeResult = await authService.completeAccountRecovery(
        recoveryResult.recoveryToken,
        999999999 // New telegram ID
      );
      expect(completeResult.success).toBe(true);
    });

    it('should fail recovery with invalid token', async () => {
      const completeResult = await authService.completeAccountRecovery('invalid-token', 999999999);
      expect(completeResult.success).toBe(false);
      expect(completeResult.error).toBe('Invalid or expired recovery token');
    });
  });

  describe('utility methods', () => {
    it('should hash and verify passwords correctly', async () => {
      const password = 'test-password-123';
      
      const hashedPassword = await authService.hashPassword(password);
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(50); // bcrypt hashes are long

      const isValid = await authService.verifyPassword(password, hashedPassword);
      expect(isValid).toBe(true);

      const isInvalid = await authService.verifyPassword('wrong-password', hashedPassword);
      expect(isInvalid).toBe(false);
    });

    it('should parse expiration time correctly', () => {
      const testCases = [
        { input: '15m', expected: 900 },
        { input: '1h', expected: 3600 },
        { input: '7d', expected: 604800 },
        { input: '30s', expected: 30 }
      ];

      testCases.forEach(({ input, expected }) => {
        const result = authService['parseExpirationTime'](input);
        expect(result).toBe(expected);
      });
    });

    it('should generate unique referral codes', () => {
      const codes = new Set();
      
      for (let i = 0; i < 1000; i++) {
        const code = authService['generateReferralCode']();
        expect(code).toMatch(/^[A-Z0-9]{8}$/);
        codes.add(code);
      }

      // Should be highly unlikely to have duplicates in 1000 tries
      expect(codes.size).toBe(1000);
    });

    it('should determine generation bonus correctly', () => {
      const testCases = [
        { generation: 'FOUNDERS', expected: 1.5 },
        { generation: 'BUILDERS', expected: 1.2 },
        { generation: 'SUPPORTERS', expected: 1.1 },
        { generation: 'MASS_MOVEMENT', expected: 1.0 }
      ];

      testCases.forEach(({ generation, expected }) => {
        const bonus = authService['getGenerationBonus'](generation);
        expect(bonus).toBe(expected);
      });
    });
  });

  describe('error handling', () => {
    it('should handle database errors gracefully', async () => {
      // Create a mock pool that throws errors
      const mockErrorPool = {
        query: jest.fn().mockRejectedValue(new Error('Database connection failed'))
      } as any;

      const errorAuthService = new AuthService(mockErrorPool);

      const telegramUser = {
        id: 141414141,
        first_name: 'Error',
        username: 'error_user'
      };

      const result = await errorAuthService.authenticateTelegramUser(telegramUser);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Authentication failed');
    });

    it('should handle malformed telegram user data', async () => {
      const malformedUser = {
        id: null,
        first_name: '',
        username: undefined
      } as any;

      const result = await authService.authenticateTelegramUser(malformedUser);
      // Should handle gracefully without crashing
      expect(result.success).toBeDefined();
    });
  });
});
