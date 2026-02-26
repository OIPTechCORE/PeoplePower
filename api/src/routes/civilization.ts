import express from 'express';
import { CenterOfExcellenceService } from '../services/centerOfExcellenceService';
import { WallOfFameService } from '../services/wallOfFameService';
import { ReputationEconomyService } from '../services/reputationEconomyService';
import { CivilizationStabilityEngine } from '../services/civilizationStabilityEngine';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// ===================================
// CENTER OF EXCELLENCE ROUTES
// ===================================

// Get all academies
router.get('/academies', async (req, res) => {
  try {
    const coeService = new CenterOfExcellenceService(req.app.locals.db);
    const academies = await coeService.getAllAcademies();
    res.json({ success: true, data: academies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get academy details
router.get('/academies/:id', async (req, res) => {
  try {
    const coeService = new CenterOfExcellenceService(req.app.locals.db);
    const academy = await coeService.getAcademyById(req.params.id);
    
    if (!academy) {
      return res.status(404).json({ success: false, error: 'Academy not found' });
    }

    const courses = await coeService.getAcademyCourses(req.params.id);
    res.json({ success: true, data: { academy, courses } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Enroll in course
router.post('/academies/enroll', authenticateToken, validateRequest({
  body: {
    course_id: { type: 'string', required: true }
  }
}), async (req, res) => {
  try {
    const coeService = new CenterOfExcellenceService(req.app.locals.db);
    const enrollment = await coeService.enrollPlayerInCourse(req.user.id, req.body.course_id);
    res.json({ success: true, data: enrollment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update course progress
router.put('/academies/progress', authenticateToken, validateRequest({
  body: {
    course_id: { type: 'string', required: true },
    progress_percentage: { type: 'number', min: 0, max: 100, required: true },
    assessment_score: { type: 'number', min: 0, max: 100 }
  }
}), async (req, res) => {
  try {
    const coeService = new CenterOfExcellenceService(req.app.locals.db);
    const progress = await coeService.updatePlayerProgress(
      req.user.id,
      req.body.course_id,
      req.body.progress_percentage,
      req.body.assessment_score
    );
    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get player's academy progress
router.get('/academies/my-progress', authenticateToken, async (req, res) => {
  try {
    const coeService = new CenterOfExcellenceService(req.app.locals.db);
    const progress = await coeService.getPlayerAcademyProgress(req.user.id);
    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get AI mentor
router.get('/mentor/:type', authenticateToken, async (req, res) => {
  try {
    const coeService = new CenterOfExcellenceService(req.app.locals.db);
    const mentorType = req.params.type as 'skill_coach' | 'career_guide' | 'innovation_advisor';
    
    if (!['skill_coach', 'career_guide', 'innovation_advisor'].includes(mentorType)) {
      return res.status(400).json({ success: false, error: 'Invalid mentor type' });
    }

    const mentor = await coeService.getOrCreateAIMentor(req.user.id, mentorType);
    res.json({ success: true, data: mentor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create mentorship session
router.post('/mentor/session', authenticateToken, validateRequest({
  body: {
    mentor_id: { type: 'string', required: true },
    session_type: { type: 'string', required: true },
    session_data: { type: 'object', required: true }
  }
}), async (req, res) => {
  try {
    const coeService = new CenterOfExcellenceService(req.app.locals.db);
    const session = await coeService.createMentorshipSession(
      req.body.mentor_id,
      req.user.id,
      req.body.session_type,
      req.body.session_data
    );
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get innovation labs
router.get('/innovation-labs', async (req, res) => {
  try {
    const coeService = new CenterOfExcellenceService(req.app.locals.db);
    const labs = await coeService.getAllInnovationLabs();
    res.json({ success: true, data: labs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Submit innovation
router.post('/innovation/submit', authenticateToken, validateRequest({
  body: {
    lab_id: { type: 'string', required: true },
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    submission_type: { type: 'string', required: true },
    implementation_url: { type: 'string' },
    demo_video_url: { type: 'string' },
    technical_documentation: { type: 'string' }
  }
}), async (req, res) => {
  try {
    const coeService = new CenterOfExcellenceService(req.app.locals.db);
    const submission = await coeService.submitInnovation(req.body.lab_id, req.user.id, req.body);
    res.json({ success: true, data: submission });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ===================================
// WALL OF FAME ROUTES
// ===================================

// Get all legacy halls
router.get('/wall-of-fame/halls', async (req, res) => {
  try {
    const wofService = new WallOfFameService(req.app.locals.db);
    const halls = await wofService.getAllLegacyHalls();
    res.json({ success: true, data: halls });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get hall members
router.get('/wall-of-fame/halls/:id/members', async (req, res) => {
  try {
    const wofService = new WallOfFameService(req.app.locals.db);
    const members = await wofService.getHallMembers(req.params.id);
    res.json({ success: true, data: members });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Check hall eligibility
router.get('/wall-of-fame/halls/:id/eligibility', authenticateToken, async (req, res) => {
  try {
    const wofService = new WallOfFameService(req.app.locals.db);
    const eligible = await wofService.checkHallEligibility(req.user.id, req.params.id);
    res.json({ success: true, data: { eligible } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get player's soulbound NFTs
router.get('/wall-of-fame/my-nfts', authenticateToken, async (req, res) => {
  try {
    const wofService = new WallOfFameService(req.app.locals.db);
    const nfts = await wofService.getPlayerSoulboundNFTs(req.user.id);
    res.json({ success: true, data: nfts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get civilization timeline
router.get('/wall-of-fame/timeline', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    
    const wofService = new WallOfFameService(req.app.locals.db);
    const events = await wofService.getTimelineEvents(limit, offset);
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Wall of Fame leaderboard
router.get('/wall-of-fame/leaderboard', async (req, res) => {
  try {
    const wofService = new WallOfFameService(req.app.locals.db);
    const hallId = req.query.hall_id as string;
    const leaderboard = await wofService.getWallOfFameLeaderboard(hallId);
    res.json({ success: true, data: leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===================================
// REPUTATION ECONOMY ROUTES
// ===================================

// Get player's reputation DNA
router.get('/reputation/my-dna', authenticateToken, async (req, res) => {
  try {
    const reputationService = new ReputationEconomyService(req.app.locals.db);
    const dna = await reputationService.getPlayerReputationDNA(req.user.id);
    res.json({ success: true, data: dna });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get reputation history
router.get('/reputation/my-history', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const reputationService = new ReputationEconomyService(req.app.locals.db);
    const history = await reputationService.getPlayerReputationHistory(req.user.id, limit);
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mine reputation
router.post('/reputation/mine', authenticateToken, validateRequest({
  body: {
    action: { type: 'string', required: true }
  }
}), async (req, res) => {
  try {
    const reputationService = new ReputationEconomyService(req.app.locals.db);
    const transaction = await reputationService.mineReputation(req.user.id, req.body.action);
    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get reputation mining actions
router.get('/reputation/mining-actions', async (req, res) => {
  try {
    const reputationService = new ReputationEconomyService(req.app.locals.db);
    const actions = await reputationService.getReputationMiningActions();
    res.json({ success: true, data: actions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get reputation leaderboard
router.get('/reputation/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const reputationService = new ReputationEconomyService(req.app.locals.db);
    const leaderboard = await reputationService.getReputationLeaderboard(limit);
    res.json({ success: true, data: leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create marketplace listing
router.post('/marketplace/listing', authenticateToken, validateRequest({
  body: {
    service_type: { type: 'string', required: true },
    service_description: { type: 'string', required: true },
    base_price: { type: 'number', min: 0, required: true },
    portfolio_url: { type: 'string' }
  }
}), async (req, res) => {
  try {
    const reputationService = new ReputationEconomyService(req.app.locals.db);
    const listing = await reputationService.createMarketplaceListing(
      req.user.id,
      req.body.service_type,
      req.body.service_description,
      req.body.base_price,
      req.body.portfolio_url
    );
    res.json({ success: true, data: listing });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get marketplace listings
router.get('/marketplace/listings', async (req, res) => {
  try {
    const reputationService = new ReputationEconomyService(req.app.locals.db);
    const listings = await reputationService.getMarketplaceListings(
      req.query.service_type as any,
      req.query.min_reputation ? parseInt(req.query.min_reputation as string) : undefined,
      req.query.max_price ? parseInt(req.query.max_price as string) : undefined
    );
    res.json({ success: true, data: listings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===================================
// CIVILIZATION STABILITY ROUTES
// ===================================

// Get stability dashboard
router.get('/stability/dashboard', authenticateToken, async (req, res) => {
  try {
    // Only admins or high-reputation players can access stability dashboard
    const reputationService = new ReputationEconomyService(req.app.locals.db);
    const userReputation = await reputationService.getPlayerReputationDNA(req.user.id);
    
    if (!userReputation || userReputation.civilization_rank === 'explorer') {
      return res.status(403).json({ success: false, error: 'Insufficient privileges' });
    }

    const stabilityEngine = new CivilizationStabilityEngine(req.app.locals.db);
    const dashboard = await stabilityEngine.getStabilityDashboard();
    res.json({ success: true, data: dashboard });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create governance proposal
router.post('/governance/proposal', authenticateToken, validateRequest({
  body: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    proposal_type: { type: 'string', required: true },
    proposal_data: { type: 'object', required: true }
  }
}), async (req, res) => {
  try {
    const stabilityEngine = new CivilizationStabilityEngine(req.app.locals.db);
    const proposal = await stabilityEngine.createGovernanceProposal(
      req.user.id,
      req.body.title,
      req.body.description,
      req.body.proposal_type,
      req.body.proposal_data
    );
    res.json({ success: true, data: proposal });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Vote on proposal
router.post('/governance/vote', authenticateToken, validateRequest({
  body: {
    proposal_id: { type: 'string', required: true },
    vote: { type: 'string', enum: ['for', 'against', 'abstain'], required: true }
  }
}), async (req, res) => {
  try {
    const stabilityEngine = new CivilizationStabilityEngine(req.app.locals.db);
    await stabilityEngine.voteOnProposal(req.body.proposal_id, req.user.id, req.body.vote);
    res.json({ success: true, message: 'Vote recorded successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get civilization missions
router.get('/missions', async (req, res) => {
  try {
    const query = `
      SELECT * FROM civilization_missions 
      WHERE status IN ('upcoming', 'active')
      ORDER BY created_at DESC
    `;
    const result = await req.app.locals.db.query(query);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Join mission
router.post('/missions/:id/join', authenticateToken, async (req, res) => {
  try {
    const stabilityEngine = new CivilizationStabilityEngine(req.app.locals.db);
    await stabilityEngine.updateMissionProgress(req.params.id, req.user.id, {
      joined: true,
      progress_percentage: 0
    });
    res.json({ success: true, message: 'Successfully joined mission' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update mission progress
router.put('/missions/:id/progress', authenticateToken, validateRequest({
  body: {
    progress_data: { type: 'object', required: true }
  }
}), async (req, res) => {
  try {
    const stabilityEngine = new CivilizationStabilityEngine(req.app.locals.db);
    await stabilityEngine.updateMissionProgress(req.params.id, req.user.id, req.body.progress_data);
    res.json({ success: true, message: 'Mission progress updated' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ===================================
// COMBINED ANALYTICS ROUTES
// ===================================

// Get comprehensive player stats
router.get('/my-stats', authenticateToken, async (req, res) => {
  try {
    const coeService = new CenterOfExcellenceService(req.app.locals.db);
    const wofService = new WallOfFameService(req.app.locals.db);
    const reputationService = new ReputationEconomyService(req.app.locals.db);

    const [coeStats, wofStats, reputationStats] = await Promise.all([
      coeService.getPlayerCenterOfExcellenceStats(req.user.id),
      wofService.getPlayerWallOfFameStats(req.user.id),
      reputationService.getPlayerReputationDNA(req.user.id)
    ]);

    const marketplaceStats = await reputationService.getPlayerMarketplaceStats(req.user.id);

    res.json({
      success: true,
      data: {
        center_of_excellence: coeStats,
        wall_of_fame: wofStats,
        reputation: reputationStats,
        marketplace: marketplaceStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get ecosystem overview
router.get('/ecosystem-overview', async (req, res) => {
  try {
    const reputationService = new ReputationEconomyService(req.app.locals.db);
    const stabilityEngine = new CivilizationStabilityEngine(req.app.locals.db);

    const [reputationStats, stabilityStats] = await Promise.all([
      reputationService.getReputationEconomyStats(),
      stabilityEngine.getStabilityDashboard()
    ]);

    res.json({
      success: true,
      data: {
        reputation_economy: reputationStats,
        stability_engine: stabilityStats,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
