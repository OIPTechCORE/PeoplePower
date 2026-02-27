import { Router, Application } from 'express';
import authRoutes from './auth';
import civilizationRoutes from './civilization';
import { createEducationRoutes } from './education';
import { createCommunicationRoutes } from './communication';
import { createStarsRoutes } from './stars';
import { createDiamondsRoutes } from './diamonds';
import { createGiftsRoutes } from './gifts';
import { createMarketplaceRoutes } from './marketplace';
import { createCharityRoutes } from './charity';
import { createLeaderboardRoutes } from './leaderboard';
import { createTasksBoardRoutes } from './tasksboard';
import { createAdminRoutes } from './admin';
import { createUniversityRoutes } from './university';
import { createCivilizationControlRoutes } from './civilization-control';
import { createExcellenceRoutes } from './excellence';
import { createCivilizationAdvancedRoutes } from './civilization-advanced';
import { createCivilizationComparativeRoutes } from './civilization-comparative';
import { createInfinityBadgeRoutes } from './infinity-badges';
import { createInfinityReputationRoutes } from './infinity-reputation';
import { createGameRoutes } from './game';
import { createSocialRoutes } from './social';
import { createEconomyRoutes } from './economy';
import { createChatRoutes } from './chat';
import tonRoutes from './ton';
import superAdminRoutes from './superAdmin';
import infinityRoutes from './infinity';
import unifiedMarketplaceRoutes from './unifiedMarketplace';
import { pool } from '../database/connection';
import { CacheService } from '../services/cacheService';

const router = Router();
const cacheService = new CacheService(process.env.REDIS_URL, pool);

// API version prefix
const API_VERSION = '/api/v1';

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Route modules
router.use(`${API_VERSION}/auth`, authRoutes);
router.use(`${API_VERSION}/civilization`, civilizationRoutes);
router.use(`${API_VERSION}/education`, createEducationRoutes(pool));
router.use(`${API_VERSION}/communication`, createCommunicationRoutes(pool));
router.use(`${API_VERSION}/stars`, createStarsRoutes(pool));
router.use(`${API_VERSION}/diamonds`, createDiamondsRoutes(pool));
router.use(`${API_VERSION}/gifts`, createGiftsRoutes(pool));
router.use(`${API_VERSION}/marketplace`, createMarketplaceRoutes(pool));
router.use(`${API_VERSION}/charity`, createCharityRoutes(pool));
router.use(`${API_VERSION}/leaderboard`, createLeaderboardRoutes(pool));
router.use(`${API_VERSION}/tasksboard`, createTasksBoardRoutes(pool));
router.use(`${API_VERSION}/admin`, createAdminRoutes(pool));
router.use(`${API_VERSION}/university`, createUniversityRoutes(pool));
router.use(`${API_VERSION}/civilization-control`, createCivilizationControlRoutes(pool));
router.use(`${API_VERSION}/excellence`, createExcellenceRoutes(pool));
router.use(`${API_VERSION}/civilization-advanced`, createCivilizationAdvancedRoutes(pool));
router.use(`${API_VERSION}/civilization-comparative`, createCivilizationComparativeRoutes(pool));
router.use(`${API_VERSION}/infinity-badges`, createInfinityBadgeRoutes(pool));
router.use(`${API_VERSION}/infinity-reputation`, createInfinityReputationRoutes(pool));
router.use(`${API_VERSION}/game`, createGameRoutes(pool, cacheService));
router.use(`${API_VERSION}/social`, createSocialRoutes(pool));
router.use(`${API_VERSION}/economy`, createEconomyRoutes(pool));
router.use(`${API_VERSION}/chat`, createChatRoutes(pool));
router.use(`${API_VERSION}/ton`, tonRoutes);
router.use(`${API_VERSION}/admin`, superAdminRoutes);
router.use(`${API_VERSION}/infinity`, infinityRoutes);
router.use(`${API_VERSION}/marketplace`, unifiedMarketplaceRoutes);

// API documentation
router.get('/', (req, res) => {
  res.json({
    name: 'People Power Journey API',
    version: '1.0.0',
    description: 'API for the People Power Journey Telegram game',
    endpoints: {
      auth: `${API_VERSION}/auth`,
      civilization: `${API_VERSION}/civilization`,
      education: `${API_VERSION}/education`,
      communication: `${API_VERSION}/communication`,
      stars: `${API_VERSION}/stars`,
      diamonds: `${API_VERSION}/diamonds`,
      gifts: `${API_VERSION}/gifts`,
      marketplace: `${API_VERSION}/marketplace`,
      charity: `${API_VERSION}/charity`,
      leaderboard: `${API_VERSION}/leaderboard`,
      tasksboard: `${API_VERSION}/tasksboard`,
      admin: `${API_VERSION}/admin`,
      university: `${API_VERSION}/university`,
      'civilization-control': `${API_VERSION}/civilization-control`,
      excellence: `${API_VERSION}/excellence`,
      'civilization-advanced': `${API_VERSION}/civilization-advanced`,
      'civilization-comparative': `${API_VERSION}/civilization-comparative`,
      'infinity-badges': `${API_VERSION}/infinity-badges`,
      'infinity-reputation': `${API_VERSION}/infinity-reputation`,
    },
    health: '/health',
    documentation: '/docs',
  });
});

// Setup function to configure routes on the Express app
export const setupRoutes = (app: Application) => {
  app.use('/', router);
};

export default router;
