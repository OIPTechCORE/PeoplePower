import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Test database configuration
export const testConfig = {
  database: {
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT || '5433'),
    database: process.env.TEST_DB_NAME || 'people_power_journey_test',
    user: process.env.TEST_DB_USER || 'postgres',
    password: process.env.TEST_DB_PASSWORD || 'password',
  },
  api: {
    port: parseInt(process.env.TEST_API_PORT || '3002'),
    url: process.env.TEST_API_URL || 'http://localhost:3002'
  },
  bot: {
    token: process.env.TEST_BOT_TOKEN || 'test_bot_token'
  }
};

// Test database pool
export let testPool: Pool;

// Setup test database
export async function setupTestDatabase(): Promise<void> {
  testPool = new Pool(testConfig.database);
  
  try {
    await testPool.query('SELECT NOW()');
    console.log('✅ Test database connected');
  } catch (error) {
    console.error('❌ Failed to connect to test database:', error);
    throw error;
  }
}

// Clean test database
export async function cleanTestDatabase(): Promise<void> {
  if (!testPool) return;
  
  const tables = [
    'token_transactions',
    'game_sessions',
    'social_shares',
    'emotional_investments',
    'player_competitions',
    'viral_event_participants',
    'leaderboard_entries',
    'community_members',
    'player_missions',
    'player_habit_progress',
    'player_chapter_progress',
    'player_titles',
    'player_badges',
    'referrals',
    'communities',
    'viral_events',
    'leaderboards',
    'missions',
    'competitions',
    'daily_habits',
    'story_scenes',
    'story_choices',
    'story_chapters',
    'players'
  ];

  for (const table of tables) {
    try {
      await testPool.query(`DELETE FROM ${table}`);
    } catch (error) {
      // Table might not exist, continue
    }
  }
}

// Seed test data
export async function seedTestData(): Promise<any> {
  const testPlayer = {
    telegram_id: 123456789,
    username: 'test_user',
    display_name: 'Test User',
    level: 5,
    rank: 'ORGANIZER',
    experience: 5000,
    influence: 2500,
    supporters: 25,
    power_tokens: 100,
    total_earned: 200,
    referral_code: 'TEST123',
    generation: 'BUILDERS',
    permanent_bonus: 1.2,
    is_active: true
  };

  const result = await testPool.query(`
    INSERT INTO players (
      telegram_id, username, display_name, level, rank,
      experience, influence, supporters, power_tokens, total_earned,
      referral_code, generation, permanent_bonus, is_active
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING id
  `, Object.values(testPlayer));

  return {
    player: { ...testPlayer, id: result.rows[0].id }
  };
}

// Close test database
export async function closeTestDatabase(): Promise<void> {
  if (testPool) {
    await testPool.end();
    console.log('🔌 Test database connection closed');
  }
}

// Mock data generators
export const createMockPlayer = (overrides: any = {}) => ({
  id: 'test-player-id',
  telegramId: 123456789,
  username: 'test_user',
  displayName: 'Test User',
  level: 1,
  rank: 'VOICE_STARTER',
  experience: 0,
  influence: 0,
  supporters: 0,
  powerTokens: 0,
  totalEarned: 0,
  referralCode: 'TEST123',
  referralsCount: 0,
  isActive: true,
  lastActiveAt: new Date(),
  joinedAt: new Date(),
  generation: 'MASS_MOVEMENT',
  permanentBonus: 1.0,
  titles: [],
  badges: [],
  seasonalAchievements: [],
  ...overrides
});

export const createMockMission = (overrides: any = {}) => ({
  id: 'test-mission-id',
  missionId: 'test_mission',
  title: 'Test Mission',
  description: 'A test mission',
  type: 'DAILY_TAP',
  category: 'daily',
  requirements: [],
  rewards: [
    { type: 'influence', value: 50 },
    { type: 'experience', value: 25 }
  ],
  isAvailable: true,
  isCompleted: false,
  progress: 0,
  maxProgress: 100,
  ...overrides
});

export const createMockGameAction = (overrides: any = {}) => ({
  type: 'tap',
  data: { tapCount: 10 },
  timestamp: new Date(),
  ...overrides
});

// Test utilities
export const waitFor = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const generateRandomString = (length: number = 10): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateRandomNumber = (min: number = 0, max: number = 100): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// HTTP test utilities
export const makeHttpRequest = async (url: string, options: any = {}): Promise<any> => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  const data = await response.json();
  
  return {
    status: response.status,
    ok: response.ok,
    data,
    headers: response.headers
  };
};

export const makeAuthenticatedRequest = async (url: string, token: string, options: any = {}): Promise<any> => {
  return makeHttpRequest(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
};

// JWT test utilities
export const generateTestToken = (payload: any, expiresIn: string = '15m'): string => {
  const jwt = require('jsonwebtoken');
  return jwt.sign(payload, process.env.JWT_SECRET || 'test-secret', { expiresIn });
};

export const verifyTestToken = (token: string): any => {
  const jwt = require('jsonwebtoken');
  return jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
};

// Database test utilities
export const insertTestPlayer = async (playerData: any): Promise<any> => {
  const result = await testPool.query(`
    INSERT INTO players (
      telegram_id, username, display_name, level, rank,
      experience, influence, supporters, power_tokens, total_earned,
      referral_code, generation, permanent_bonus, is_active
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *
  `, [
    playerData.telegram_id,
    playerData.username,
    playerData.display_name,
    playerData.level,
    playerData.rank,
    playerData.experience,
    playerData.influence,
    playerData.supporters,
    playerData.power_tokens,
    playerData.total_earned,
    playerData.referral_code,
    playerData.generation,
    playerData.permanent_bonus,
    playerData.is_active
  ]);

  return result.rows[0];
};

export const getPlayerById = async (playerId: string): Promise<any> => {
  const result = await testPool.query('SELECT * FROM players WHERE id = $1', [playerId]);
  return result.rows[0] || null;
};

export const countTableRows = async (tableName: string): Promise<number> => {
  const result = await testPool.query(`SELECT COUNT(*) as count FROM ${tableName}`);
  return parseInt(result.rows[0].count);
};

// Performance test utilities
export const measureTime = async (fn: () => Promise<any>): Promise<{ result: any; duration: number }> => {
  const start = Date.now();
  const result = await fn();
  const duration = Date.now() - start;
  
  return { result, duration };
};

export const runPerformanceTest = async (
  testName: string,
  iterations: number,
  testFn: () => Promise<any>
): Promise<void> => {
  console.log(`🚀 Running performance test: ${testName} (${iterations} iterations)`);
  
  const times: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const { duration } = await measureTime(testFn);
    times.push(duration);
  }
  
  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  
  console.log(`📊 Performance results for ${testName}:`);
  console.log(`   Average: ${avgTime.toFixed(2)}ms`);
  console.log(`   Min: ${minTime}ms`);
  console.log(`   Max: ${maxTime}ms`);
  console.log(`   Total: ${(times.reduce((a, b) => a + b, 0)).toFixed(2)}ms`);
};

// Integration test utilities
export const setupIntegrationTest = async (): Promise<{ api: any; pool: Pool }> => {
  // This would set up the actual API server for integration tests
  // For now, return mock
  return {
    api: null,
    pool: testPool
  };
};

export const teardownIntegrationTest = async (): Promise<void> => {
  // This would tear down the API server
  await cleanTestDatabase();
};

// Error handling utilities
export const expectError = async (fn: () => Promise<any>, expectedError?: string): Promise<void> => {
  try {
    await fn();
    throw new Error('Expected function to throw an error, but it did not');
  } catch (error) {
    if (expectedError && !error.message.includes(expectedError)) {
      throw new Error(`Expected error message to contain "${expectedError}", but got "${error.message}"`);
    }
  }
};

// Data validation utilities
export const validatePlayer = (player: any): boolean => {
  return (
    player &&
    typeof player.id === 'string' &&
    typeof player.telegramId === 'number' &&
    typeof player.displayName === 'string' &&
    typeof player.level === 'number' &&
    typeof player.influence === 'number' &&
    typeof player.powerTokens === 'number'
  );
};

export const validateApiResponse = (response: any, expectedData?: any): boolean => {
  return (
    response &&
    typeof response.success === 'boolean' &&
    (response.data !== undefined || response.error !== undefined) &&
    response.timestamp instanceof Date
  );
};

// Mock services
export class MockAuthService {
  async authenticateTelegramUser(telegramUser: any) {
    return {
      success: true,
      player: createMockPlayer(telegramUser),
      tokens: {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        expiresIn: 900
      }
    };
  }

  async verifyAccessToken(token: string) {
    return createMockPlayer();
  }
}

export class MockGameService {
  async processGameAction(playerId: string, action: any) {
    return {
      success: true,
      data: {
        level: 1,
        experience: 100,
        influence: 50,
        supporters: 0,
        powerTokens: 10,
        missionsCompleted: 1,
        currentStreak: 0
      }
    };
  }

  async getAvailableMissions(playerId: string) {
    return {
      success: true,
      data: [createMockMission()]
    };
  }
}

// Global test setup
beforeAll(async () => {
  await setupTestDatabase();
});

afterAll(async () => {
  await closeTestDatabase();
});

beforeEach(async () => {
  await cleanTestDatabase();
});

// Export for use in test files
export {
  MockAuthService,
  MockGameService
};
