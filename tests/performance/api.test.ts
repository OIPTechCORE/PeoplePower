import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { Pool } from 'pg';
import { 
  setupTestDatabase, 
  cleanTestDatabase, 
  closeTestDatabase,
  testPool,
  createMockPlayer,
  generateTestToken
} from '../setup';

// Import route creators
import { createGameRoutes } from '../../api/src/routes/game';
import { createSocialRoutes } from '../../api/src/routes/social';
import { createEconomyRoutes } from '../../api/src/routes/economy';
import { createChatRoutes } from '../../api/src/routes/chat';

describe('API Performance Tests', () => {
  let app: express.Application;
  let mockPool: Pool;
  let authToken: string;
  let testPlayer: any;

  beforeAll(async () => {
    await setupTestDatabase();
    mockPool = testPool;
    
    // Create Express app with all routes
    app = express();
    app.use(express.json());
    
    // Add routes
    app.use('/api/game', createGameRoutes(mockPool));
    app.use('/api/social', createSocialRoutes(mockPool));
    app.use('/api/economy', createEconomyRoutes(mockPool));
    app.use('/api/chat', createChatRoutes(mockPool));

    // Create test player and get auth token
    testPlayer = createMockPlayer();
    authToken = generateTestToken(testPlayer);
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  beforeEach(async () => {
    await cleanTestDatabase();
  });

  describe('Response Time Performance', () => {
    it('should respond to profile requests within 100ms', async () => {
      const start = Date.now();
      
      const response = await request(app)
        .get('/api/game/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      const duration = Date.now() - start;
      
      expect(response.body.success).toBe(true);
      expect(duration).toBeLessThan(100);
    });

    it('should handle missions requests within 200ms', async () => {
      const start = Date.now();
      
      const response = await request(app)
        .get('/api/game/missions?page=1&limit=20')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      const duration = Date.now() - start;
      
      expect(response.body.success).toBe(true);
      expect(duration).toBeLessThan(200);
    });

    it('should process game actions within 150ms', async () => {
      const start = Date.now();
      
      const response = await request(app)
        .post('/api/game/action')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'complete_mission',
          data: { missionId: 'test-mission' }
        })
        .expect(200);
      
      const duration = Date.now() - start;
      
      expect(response.body.success).toBe(true);
      expect(duration).toBeLessThan(150);
    });

    it('should handle economy transactions within 100ms', async () => {
      const start = Date.now();
      
      const response = await request(app)
        .post('/api/economy/transaction')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'earn',
          amount: 100,
          source: 'test',
          description: 'Test transaction'
        })
        .expect(200);
      
      const duration = Date.now() - start;
      
      expect(response.body.success).toBe(true);
      expect(duration).toBeLessThan(100);
    });
  });

  describe('Concurrent Request Performance', () => {
    it('should handle 50 concurrent profile requests', async () => {
      const promises = Array(50).fill(null).map(() =>
        request(app)
          .get('/api/game/profile')
          .set('Authorization', `Bearer ${authToken}`)
      );

      const start = Date.now();
      const responses = await Promise.all(promises);
      const duration = Date.now() - start;

      expect(responses.every(r => r.status === 200)).toBe(true);
      expect(duration).toBeLessThan(2000); // Should handle within 2 seconds
      
      // Average response time per request
      const avgResponseTime = duration / 50;
      expect(avgResponseTime).toBeLessThan(40); // Average under 40ms
    });

    it('should handle 20 concurrent game actions', async () => {
      const promises = Array(20).fill(null).map((_, index) =>
        request(app)
          .post('/api/game/action')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            type: 'complete_mission',
            data: { missionId: `test-mission-${index}` }
          })
      );

      const start = Date.now();
      const responses = await Promise.all(promises);
      const duration = Date.now() - start;

      expect(responses.every(r => r.status === 200)).toBe(true);
      expect(duration).toBeLessThan(3000); // Should handle within 3 seconds
    });

    it('should handle mixed concurrent requests', async () => {
      const promises = [
        ...Array(10).fill(null).map(() =>
          request(app)
            .get('/api/game/profile')
            .set('Authorization', `Bearer ${authToken}`)
        ),
        ...Array(10).fill(null).map(() =>
          request(app)
            .get('/api/game/missions')
            .set('Authorization', `Bearer ${authToken}`)
        ),
        ...Array(5).fill(null).map(() =>
          request(app)
            .post('/api/economy/transaction')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
              type: 'earn',
              amount: 50,
              source: 'test'
            })
        ),
        ...Array(5).fill(null).map(() =>
          request(app)
            .get('/api/social/communities')
            .set('Authorization', `Bearer ${authToken}`)
        )
      ];

      const start = Date.now();
      const responses = await Promise.all(promises);
      const duration = Date.now() - start;

      expect(responses.every(r => r.status === 200)).toBe(true);
      expect(duration).toBeLessThan(5000); // Should handle within 5 seconds
    });
  });

  describe('Memory Usage Performance', () => {
    it('should not leak memory during repeated requests', async () => {
      const initialMemory = process.memoryUsage();
      
      // Make 1000 requests
      for (let i = 0; i < 1000; i++) {
        await request(app)
          .get('/api/game/profile')
          .set('Authorization', `Bearer ${authToken}`);
        
        // Force garbage collection if available
        if (global.gc) {
          global.gc();
        }
      }
      
      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      
      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });

    it('should handle large response data efficiently', async () => {
      // Create a scenario that returns large data
      const start = Date.now();
      
      const response = await request(app)
        .get('/api/game/leaderboards?type=global&limit=100')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      const duration = Date.now() - start;
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(duration).toBeLessThan(500); // Even large responses should be fast
    });
  });

  describe('Database Performance', () => {
    it('should handle database connection pooling efficiently', async () => {
      const promises = Array(30).fill(null).map((_, index) =>
        request(app)
          .post('/api/economy/transaction')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            type: 'earn',
            amount: 10,
            source: `test-${index}`,
            description: `Test transaction ${index}`
          })
      );

      const start = Date.now();
      const responses = await Promise.all(promises);
      const duration = Date.now() - start;

      expect(responses.every(r => r.status === 200)).toBe(true);
      expect(duration).toBeLessThan(2000); // Should handle database operations efficiently
    });

    it('should use caching for frequently accessed data', async () => {
      // First request
      const start1 = Date.now();
      await request(app)
        .get('/api/game/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      const firstRequestTime = Date.now() - start1;

      // Second request (should be faster due to caching)
      const start2 = Date.now();
      await request(app)
        .get('/api/game/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      const secondRequestTime = Date.now() - start2;

      // Second request should be faster (cached)
      expect(secondRequestTime).toBeLessThan(firstRequestTime);
    });
  });

  describe('Rate Limiting Performance', () => {
    it('should handle rate limiting efficiently', async () => {
      const promises = Array(100).fill(null).map(() =>
        request(app)
          .get('/api/game/profile')
          .set('Authorization', `Bearer ${authToken}`)
      );

      const start = Date.now();
      const responses = await Promise.all(promises);
      const duration = Date.now() - start;

      // Some should be rate limited (429), others should succeed (200)
      const successResponses = responses.filter(r => r.status === 200);
      const rateLimitedResponses = responses.filter(r => r.status === 429);

      expect(successResponses.length).toBeGreaterThan(0);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(5000); // Should handle quickly even with rate limiting
    });
  });

  describe('Error Handling Performance', () => {
    it('should handle errors quickly without performance degradation', async () => {
      const promises = Array(20).fill(null).map(() =>
        request(app)
          .get('/api/non-existent-endpoint')
          .set('Authorization', `Bearer ${authToken}`)
      );

      const start = Date.now();
      const responses = await Promise.all(promises);
      const duration = Date.now() - start;

      expect(responses.every(r => r.status === 404)).toBe(true);
      expect(duration).toBeLessThan(1000); // Error responses should be fast
    });

    it('should handle validation errors efficiently', async () => {
      const promises = Array(20).fill(null).map(() =>
        request(app)
          .post('/api/game/action')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ invalid: 'data' })
      );

      const start = Date.now();
      const responses = await Promise.all(promises);
      const duration = Date.now() - start;

      expect(responses.every(r => r.status === 400)).toBe(true);
      expect(duration).toBeLessThan(1000); // Validation errors should be fast
    });
  });

  describe('Load Testing', () => {
    it('should sustain load over time', async () => {
      const duration = 5000; // 5 seconds
      const startTime = Date.now();
      let requestCount = 0;
      
      while (Date.now() - startTime < duration) {
        const promises = Array(10).fill(null).map(() =>
          request(app)
            .get('/api/game/profile')
            .set('Authorization', `Bearer ${authToken}`)
        );
        
        await Promise.all(promises);
        requestCount += 10;
      }
      
      const actualDuration = Date.now() - startTime;
      const requestsPerSecond = (requestCount / actualDuration) * 1000;
      
      // Should handle at least 50 requests per second
      expect(requestsPerSecond).toBeGreaterThan(50);
    });

    it('should maintain performance under sustained load', async () => {
      const responseTimes: number[] = [];
      
      // Make 100 requests over time
      for (let i = 0; i < 100; i++) {
        const start = Date.now();
        
        await request(app)
          .get('/api/game/profile')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
        
        responseTimes.push(Date.now() - start);
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      const maxResponseTime = Math.max(...responseTimes);
      
      expect(avgResponseTime).toBeLessThan(100); // Average under 100ms
      expect(maxResponseTime).toBeLessThan(500); // Max under 500ms
    });
  });
});
