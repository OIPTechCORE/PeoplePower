import { setupIntegrationTest, teardownIntegrationTest, makeHttpRequest, makeAuthenticatedRequest } from '../setup';

describe('API Integration Tests', () => {
  let api: any;
  let pool: any;

  beforeAll(async () => {
    const setup = await setupIntegrationTest();
    api = setup.api;
    pool = setup.pool;
  });

  afterAll(async () => {
    await teardownIntegrationTest();
  });

  describe('Authentication Endpoints', () => {
    describe('POST /api/auth/telegram', () => {
      it('should authenticate telegram user successfully', async () => {
        const telegramUser = {
          id: 123456789,
          first_name: 'Test',
          last_name: 'User',
          username: 'test_user'
        };

        const response = await makeHttpRequest(`${testConfig.api.url}/api/auth/telegram`, {
          method: 'POST',
          body: JSON.stringify({ telegramUser })
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
        expect(response.data.success).toBe(true);
        expect(response.data.player).toBeDefined();
        expect(response.data.tokens).toBeDefined();
        expect(response.data.player.telegramId).toBe(telegramUser.id);
        expect(response.data.player.displayName).toBe('Test User');
      });

      it('should reject invalid telegram user data', async () => {
        const invalidUser = {
          id: null,
          first_name: '',
          username: undefined
        };

        const response = await makeHttpRequest(`${testConfig.api.url}/api/auth/telegram`, {
          method: 'POST',
          body: JSON.stringify({ telegramUser: invalidUser })
        });

        expect(response.status).toBe(400);
        expect(response.ok).toBe(false);
        expect(response.data.success).toBe(false);
        expect(response.data.error).toBeDefined();
      });

      it('should handle missing telegram user data', async () => {
        const response = await makeHttpRequest(`${testConfig.api.url}/api/auth/telegram`, {
          method: 'POST',
          body: JSON.stringify({})
        });

        expect(response.status).toBe(400);
        expect(response.ok).toBe(false);
        expect(response.data.success).toBe(false);
      });
    });

    describe('POST /api/auth/refresh', () => {
      it('should refresh tokens successfully', async () => {
        // First authenticate to get refresh token
        const telegramUser = {
          id: 987654321,
          first_name: 'Refresh',
          username: 'refresh_user'
        };

        const authResponse = await makeHttpRequest(`${testConfig.api.url}/api/auth/telegram`, {
          method: 'POST',
          body: JSON.stringify({ telegramUser })
        });

        expect(authResponse.data.success).toBe(true);

        // Now refresh the token
        const refreshResponse = await makeHttpRequest(`${testConfig.api.url}/api/auth/refresh`, {
          method: 'POST',
          body: JSON.stringify({ 
            refreshToken: authResponse.data.tokens.refreshToken 
          })
        });

        expect(refreshResponse.status).toBe(200);
        expect(refreshResponse.ok).toBe(true);
        expect(refreshResponse.data.success).toBe(true);
        expect(refreshResponse.data.tokens).toBeDefined();
        expect(refreshResponse.data.tokens.accessToken).toBeDefined();
        expect(refreshResponse.data.tokens.refreshToken).toBeDefined();
      });

      it('should reject invalid refresh token', async () => {
        const response = await makeHttpRequest(`${testConfig.api.url}/api/auth/refresh`, {
          method: 'POST',
          body: JSON.stringify({ refreshToken: 'invalid-token' })
        });

        expect(response.status).toBe(401);
        expect(response.ok).toBe(false);
        expect(response.data.success).toBe(false);
        expect(response.data.error).toBe('Invalid refresh token');
      });
    });
  });

  describe('Game Endpoints', () => {
    let authToken: string;
    let playerId: string;

    beforeAll(async () => {
      // Authenticate a test user
      const telegramUser = {
        id: 555555555,
        first_name: 'Game',
        username: 'game_user'
      };

      const authResponse = await makeHttpRequest(`${testConfig.api.url}/api/auth/telegram`, {
        method: 'POST',
        body: JSON.stringify({ telegramUser })
      });

      authToken = authResponse.data.tokens.accessToken;
      playerId = authResponse.data.player.id;
    });

    describe('POST /api/game/action', () => {
      it('should process tap action successfully', async () => {
        const gameAction = {
          type: 'tap',
          data: { tapCount: 10 }
        };

        const response = await makeAuthenticatedRequest(
          `${testConfig.api.url}/api/game/action`,
          authToken,
          {
            method: 'POST',
            body: JSON.stringify(gameAction)
          }
        );

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
        expect(response.data.success).toBe(true);
        expect(response.data.data).toBeDefined();
        expect(response.data.data.influence).toBeGreaterThan(0);
        expect(response.data.data.experience).toBeGreaterThan(0);
      });

      it('should process mission complete action', async () => {
        const gameAction = {
          type: 'mission_complete',
          data: { missionId: 'daily_tap_session' }
        };

        const response = await makeAuthenticatedRequest(
          `${testConfig.api.url}/api/game/action`,
          authToken,
          {
            method: 'POST',
            body: JSON.stringify(gameAction)
          }
        );

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
        expect(response.data.success).toBe(true);
        expect(response.data.data).toBeDefined();
        expect(response.data.data.missionsCompleted).toBeGreaterThan(0);
      });

      it('should reject invalid action type', async () => {
        const gameAction = {
          type: 'invalid_action',
          data: {}
        };

        const response = await makeAuthenticatedRequest(
          `${testConfig.api.url}/api/game/action`,
          authToken,
          {
            method: 'POST',
            body: JSON.stringify(gameAction)
          }
        );

        expect(response.status).toBe(400);
        expect(response.ok).toBe(false);
        expect(response.data.success).toBe(false);
      });

      it('should reject unauthenticated requests', async () => {
        const gameAction = {
          type: 'tap',
          data: { tapCount: 10 }
        };

        const response = await makeHttpRequest(`${testConfig.api.url}/api/game/action`, {
          method: 'POST',
          body: JSON.stringify(gameAction)
        });

        expect(response.status).toBe(401);
        expect(response.ok).toBe(false);
      });
    });

    describe('GET /api/game/missions', () => {
      it('should get available missions', async () => {
        const response = await makeAuthenticatedRequest(
          `${testConfig.api.url}/api/game/missions`,
          authToken
        );

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
        expect(response.data.success).toBe(true);
        expect(response.data.data).toBeDefined();
        expect(Array.isArray(response.data.data)).toBe(true);
      });

      it('should reject unauthenticated requests', async () => {
        const response = await makeHttpRequest(`${testConfig.api.url}/api/game/missions`);

        expect(response.status).toBe(401);
        expect(response.ok).toBe(false);
      });
    });

    describe('GET /api/game/stats', () => {
      it('should get player stats', async () => {
        const response = await makeAuthenticatedRequest(
          `${testConfig.api.url}/api/game/stats`,
          authToken
        );

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
        expect(response.data.success).toBe(true);
        expect(response.data.data).toBeDefined();
        expect(response.data.data.player).toBeDefined();
        expect(response.data.data.missions).toBeDefined();
        expect(response.data.data.sessions).toBeDefined();
      });

      it('should reject unauthenticated requests', async () => {
        const response = await makeHttpRequest(`${testConfig.api.url}/api/game/stats`);

        expect(response.status).toBe(401);
        expect(response.ok).toBe(false);
      });
    });

    describe('GET /api/game/habits', () => {
      it('should get daily habits', async () => {
        const response = await makeAuthenticatedRequest(
          `${testConfig.api.url}/api/game/habits`,
          authToken
        );

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
        expect(response.data.success).toBe(true);
        expect(response.data.data).toBeDefined();
        expect(Array.isArray(response.data.data)).toBe(true);
      });

      it('should reject unauthenticated requests', async () => {
        const response = await makeHttpRequest(`${testConfig.api.url}/api/game/habits`);

        expect(response.status).toBe(401);
        expect(response.ok).toBe(false);
      });
    });

    describe('POST /api/game/habits/:habitId/complete', () => {
      it('should complete habit successfully', async () => {
        const response = await makeAuthenticatedRequest(
          `${testConfig.api.url}/api/game/habits/morning_checkin/complete`,
          authToken,
          {
            method: 'POST'
          }
        );

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
        expect(response.data.success).toBe(true);
        expect(response.data.data).toBeDefined();
        expect(response.data.data.progress).toBeDefined();
        expect(response.data.data.rewards).toBeDefined();
      });

      it('should handle invalid habit ID', async () => {
        const response = await makeAuthenticatedRequest(
          `${testConfig.api.url}/api/game/habits/invalid_habit/complete`,
          authToken,
          {
            method: 'POST'
          }
        );

        expect(response.status).toBe(404);
        expect(response.ok).toBe(false);
        expect(response.data.success).toBe(false);
      });

      it('should reject unauthenticated requests', async () => {
        const response = await makeHttpRequest(
          `${testConfig.api.url}/api/game/habits/morning_checkin/complete`,
          {
            method: 'POST'
          }
        );

        expect(response.status).toBe(401);
        expect(response.ok).toBe(false);
      });
    });
  });

  describe('Leaderboard Endpoints', () => {
    describe('GET /api/leaderboard', () => {
      it('should get global leaderboard', async () => {
        const response = await makeHttpRequest(
          `${testConfig.api.url}/api/leaderboard?type=global&period=weekly&limit=10`
        );

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
        expect(response.data.success).toBe(true);
        expect(response.data.data).toBeDefined();
        expect(Array.isArray(response.data.data)).toBe(true);
      });

      it('should get community leaderboard', async () => {
        const response = await makeHttpRequest(
          `${testConfig.api.url}/api/leaderboard?type=community&period=daily&limit=5`
        );

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
        expect(response.data.success).toBe(true);
        expect(response.data.data).toBeDefined();
        expect(Array.isArray(response.data.data)).toBe(true);
      });

      it('should handle invalid parameters', async () => {
        const response = await makeHttpRequest(
          `${testConfig.api.url}/api/leaderboard?type=invalid&period=invalid`
        );

        expect(response.status).toBe(400);
        expect(response.ok).toBe(false);
        expect(response.data.success).toBe(false);
      });
    });
  });

  describe('Health Check', () => {
    describe('GET /health', () => {
      it('should return health status', async () => {
        const response = await makeHttpRequest(`${testConfig.api.url}/health`);

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
        expect(response.data.status).toBe('healthy');
        expect(response.data.timestamp).toBeDefined();
        expect(response.data.uptime).toBeDefined();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 routes', async () => {
      const response = await makeHttpRequest(`${testConfig.api.url}/api/nonexistent`);

      expect(response.status).toBe(404);
      expect(response.ok).toBe(false);
      expect(response.data.success).toBe(false);
      expect(response.data.error).toBe('Route not found');
    });

    it('should handle malformed JSON', async () => {
      const response = await makeHttpRequest(`${testConfig.api.url}/api/auth/telegram`, {
        method: 'POST',
        body: 'invalid-json',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      expect(response.status).toBe(400);
      expect(response.ok).toBe(false);
    });

    it('should handle rate limiting', async () => {
      // Make multiple rapid requests to trigger rate limiting
      const requests = [];
      for (let i = 0; i < 20; i++) {
        requests.push(
          makeHttpRequest(`${testConfig.api.url}/health`)
        );
      }

      const responses = await Promise.all(requests);
      
      // At least some requests should be rate limited
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });

  describe('Performance Tests', () => {
    it('should handle concurrent requests', async () => {
      const startTime = Date.now();
      
      // Make 50 concurrent requests
      const requests = [];
      for (let i = 0; i < 50; i++) {
        requests.push(
          makeHttpRequest(`${testConfig.api.url}/health`)
        );
      }

      const responses = await Promise.all(requests);
      const endTime = Date.now();
      const duration = endTime - startTime;

      // All requests should succeed
      expect(responses.every(r => r.status === 200)).toBe(true);
      
      // Should complete within reasonable time (less than 2 seconds)
      expect(duration).toBeLessThan(2000);
      
      // Average response time should be reasonable
      const avgTime = duration / 50;
      expect(avgTime).toBeLessThan(100); // Less than 100ms per request
    });

    it('should handle large payload requests', async () => {
      const largePayload = {
        telegramUser: {
          id: 999999999,
          first_name: 'Large'.repeat(1000),
          last_name: 'Payload'.repeat(1000),
          username: 'large_user'
        }
      };

      const response = await makeHttpRequest(`${testConfig.api.url}/api/auth/telegram`, {
        method: 'POST',
        body: JSON.stringify(largePayload)
      });

      // Should either succeed or fail gracefully
      expect([200, 400, 413]).toContain(response.status);
      expect(response.data).toBeDefined();
    });
  });

  describe('Security Tests', () => {
    it('should reject requests with invalid JWT', async () => {
      const response = await makeHttpRequest(`${testConfig.api.url}/api/game/stats`, {
        headers: {
          'Authorization': 'Bearer invalid-jwt-token'
        }
      });

      expect(response.status).toBe(401);
      expect(response.ok).toBe(false);
    });

    it('should reject requests with missing JWT', async () => {
      const response = await makeHttpRequest(`${testConfig.api.url}/api/game/stats`);

      expect(response.status).toBe(401);
      expect(response.ok).toBe(false);
    });

    it('should handle SQL injection attempts', async () => {
      const maliciousInput = "'; DROP TABLE players; --";
      
      const response = await makeHttpRequest(
        `${testConfig.api.url}/api/leaderboard?type=${maliciousInput}`
      );

      // Should handle gracefully without crashing
      expect([400, 404, 500]).toContain(response.status);
      expect(response.data).toBeDefined();
    });

    it('should handle XSS attempts', async () => {
      const xssPayload = '<script>alert("xss")</script>';
      
      const response = await makeHttpRequest(`${testConfig.api.url}/api/leaderboard?search=${xssPayload}`);

      // Should handle gracefully without executing scripts
      expect([200, 400, 404]).toContain(response.status);
      expect(response.data).toBeDefined();
    });
  });
});
