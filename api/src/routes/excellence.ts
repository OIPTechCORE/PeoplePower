import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { 
  PeoplePowerCenterOfExcellence,
  PeoplePowerWallOfFame,
  Academy,
  InnovationLab,
  AIMentorshipSystem,
  AchievementHall,
  LegacyCategory,
  SoulboundReputationNFT,
  CivilizationRankSystem,
  AcademyType,
  InnovationFocusArea,
  UniversityLevel,
  HallCategory,
  LegacyCriteria,
  ReputationDNA,
  GeneticMarker,
  EvolutionType,
  SubmissionCategory,
  ReviewStatus,
  RevenueModel,
  CoachSpecialization,
  PersonalityType,
  ConnectionType,
  RequirementType,
  RewardType,
  CourseDifficulty,
  SocialLevel,
  BuilderLevel,
  IntegrityLevel,
  GeneticRarity,
  EventType,
  MilestoneCategory,
  HistoricalImportance,
  ContentType,
  PrivilegeType,
  AssetType,
  SignificanceLevel,
  ObjectiveType,
  BonusType,
  BenefitType,
  RevolutionOutcome,
  RevolutionImpact,
  RevolutionMethod,
  WeightingMethod,
  ThresholdType,
  VisualType,
  EffectType,
  InheritanceType,
  PenaltyType,
  ResolutionProcess
} from '../../../shared/types/excellence-fame';

export function createExcellenceRoutes(pool: Pool): Router {
  const router = Router();

  // ==================== CENTER OF EXCELLENCE ====================
  
  // Get Center of Excellence overview
  router.get('/center-of-excellence', async (req: Request, res: Response) => {
    try {
      const result = await pool.query(
        `SELECT 
          coe.*,
          COUNT(DISTINCT a.id) as total_academies,
          COUNT(DISTINCT il.id) as total_labs,
          COUNT(DISTINCT ams.id) as total_mentorship_systems
        FROM people_power_center_of_excellence coe
        LEFT JOIN academies a ON coe.id = a.center_of_excellence_id
        LEFT JOIN innovation_labs il ON coe.id = il.center_of_excellence_id
        LEFT JOIN ai_mentorship_systems ams ON coe.id = ams.center_of_excellence_id
        WHERE coe.id = 'main'`,
        []
      );

      // Get academies
      const academiesResult = await pool.query(
        'SELECT * FROM academies WHERE center_of_excellence_id = $1 ORDER BY established_at ASC',
        ['main']
      );

      // Get innovation labs
      const labsResult = await pool.query(
        'SELECT * FROM innovation_labs WHERE center_of_excellence_id = $1 ORDER BY established_at ASC',
        ['main']
      );

      // Get AI mentorship systems
      const mentorshipResult = await pool.query(
        'SELECT * FROM ai_mentorship_systems WHERE center_of_excellence_id = $1 ORDER BY established_at ASC',
        ['main']
      );

      res.json({ 
        success: true, 
        data: {
          center: result.rows[0],
          academies: academiesResult.rows,
          innovationLabs: labsResult.rows,
          mentorshipSystems: mentorshipResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== ACADEMIES ====================
  
  // Get all academies
  router.get('/academies', async (req: Request, res: Response) => {
    try {
      const { type, difficulty } = req.query;
      
      let query = 'SELECT * FROM academies WHERE 1=1';
      const params: any[] = [];

      if (type) {
        query += ' AND type = $' + (params.length + 1);
        params.push(type);
      }

      if (difficulty) {
        query += ' AND EXISTS (SELECT 1 FROM academy_courses ac WHERE ac.academy_id = academies.id AND ac.difficulty = $' + (params.length + 1) + ')';
        params.push(difficulty);
      }

      query += ' ORDER BY success_rate DESC, established_at ASC';

      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Enroll in academy
  router.post('/academies/:id/enroll', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { playerId } = req.body;

      // Verify academy exists
      const academyResult = await pool.query(
        'SELECT * FROM academies WHERE id = $1',
        [id]
      );

      if (academyResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Academy not found' });
      }

      const academy = academyResult.rows[0];

      // Check prerequisites
      const prerequisitesMet = await checkAcademyPrerequisites(playerId, academy.requirements, pool);

      if (!prerequisitesMet.met) {
        return res.status(400).json({ 
          success: false, 
          error: 'Prerequisites not met',
          missing: prerequisitesMet.missing
        });
      }

      // Create enrollment
      const enrollmentResult = await pool.query(
        `INSERT INTO academy_enrollments (
          academy_id, player_id, status, enrolled_at, progress
        ) VALUES ($1, $2, $3, NOW(), 0) 
        RETURNING *`,
        [id, playerId, 'active']
      );

      // Update academy student count
      await pool.query(
        'UPDATE academies SET active_students = active_students + 1 WHERE id = $1',
        [id]
      );

      res.json({ success: true, data: enrollmentResult.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get academy progress
  router.get('/academies/:id/progress/:playerId', async (req: Request, res: Response) => {
    try {
      const { id, playerId } = req.params;
      
      const result = await pool.query(
        `SELECT 
          ae.*,
          a.name as academy_name,
          a.type as academy_type
        FROM academy_enrollments ae
        JOIN academies a ON ae.academy_id = a.id
        WHERE ae.academy_id = $1 AND ae.player_id = $2`,
        [id, playerId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Enrollment not found' });
      }

      // Get completed courses
      const coursesResult = await pool.query(
        `SELECT 
          ac.*,
          aec.completed_at,
          aec.score
        FROM academy_enrollment_courses aec
        JOIN academy_courses ac ON aec.course_id = ac.id
        WHERE aec.enrollment_id = $1
        ORDER BY aec.completed_at DESC`,
        [result.rows[0].id]
      );

      res.json({ 
        success: true, 
        data: {
          enrollment: result.rows[0],
          completedCourses: coursesResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== INNOVATION LABS ====================
  
  // Get innovation labs
  router.get('/innovation-labs', async (req: Request, res: Response) => {
    try {
      const { focusArea, isActive } = req.query;
      
      let query = 'SELECT * FROM innovation_labs WHERE 1=1';
      const params: any[] = [];

      if (focusArea) {
        query += ' AND focus_area = $' + (params.length + 1);
        params.push(focusArea);
      }

      if (isActive !== undefined) {
        query += ' AND is_active = $' + (params.length + 1);
        params.push(isActive === 'true');
      }

      query += ' ORDER BY established_at ASC';

      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Submit innovation
  router.post('/innovation-labs/:id/submit', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { playerId, title, description, category, content } = req.body;

      // Verify lab exists and is active
      const labResult = await pool.query(
        'SELECT * FROM innovation_labs WHERE id = $1 AND is_active = true',
        [id]
      );

      if (labResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Innovation lab not found or inactive' });
      }

      // Create submission
      const submissionResult = await pool.query(
        `INSERT INTO player_submissions (
          player_id, lab_id, title, description, category, content, submitted_at, review_status
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7) 
        RETURNING *`,
        [playerId, id, title, description, category, JSON.stringify(content), 'pending']
      );

      res.json({ success: true, data: submissionResult.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== AI MENTORSHIP SYSTEM ====================
  
  // Get AI mentorship systems
  router.get('/ai-mentorship', async (req: Request, res: Response) => {
    try {
      const { specialization } = req.query;
      
      let query = 'SELECT * FROM ai_mentorship_systems WHERE 1=1';
      const params: any[] = [];

      if (specialization) {
        query += ' AND EXISTS (SELECT 1 FROM ai_coaches ac WHERE ac.mentorship_system_id = ai_mentorship_systems.id AND ac.specialization = $' + (params.length + 1) + ')';
        params.push(specialization);
      }

      query += ' ORDER BY established_at ASC';

      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get AI coach assignment
  router.get('/ai-mentorship/:id/coach/:playerId', async (req: Request, res: Response) => {
    try {
      const { id, playerId } = req.params;
      
      const result = await pool.query(
        `SELECT 
          pa.*,
          ac.name as coach_name,
          ac.specialization,
          ac.personality_type
        FROM player_assignments pa
        JOIN ai_coaches ac ON pa.coach_id = ac.id
        WHERE pa.mentorship_system_id = $1 AND pa.player_id = $2`,
        [id, playerId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Coach assignment not found' });
      }

      // Get personalized missions
      const missionsResult = await pool.query(
        'SELECT * FROM personalized_missions WHERE player_id = $1 AND mentorship_system_id = $2 ORDER BY generated_at DESC',
        [playerId, id]
      );

      // Get skill path progress
      const pathResult = await pool.query(
        `SELECT 
          pmp.*,
          sp.name as path_name,
          sp.description as path_description
        FROM player_mentorship_progress pmp
        JOIN skill_paths sp ON pmp.current_path = sp.id
        WHERE pmp.player_id = $1 AND pmp.mentorship_system_id = $2`,
        [playerId, id]
      );

      res.json({ 
        success: true, 
        data: {
          assignment: result.rows[0],
          personalizedMissions: missionsResult.rows,
          skillPathProgress: pathResult.rows[0]
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== WALL OF FAME ====================
  
  // Get Wall of Fame overview
  router.get('/wall-of-fame', async (req: Request, res: Response) => {
    try {
      const result = await pool.query(
        'SELECT * FROM people_power_wall_of_fame WHERE id = $1',
        ['main']
      );

      // Get achievement halls
      const hallsResult = await pool.query(
        'SELECT * FROM achievement_halls WHERE wall_of_fame_id = $1 ORDER BY category, updated_frequency',
        ['main']
      );

      // Get legacy categories
      const legacyResult = await pool.query(
        'SELECT * FROM legacy_categories WHERE wall_of_fame_id = $1 ORDER BY historical_significance DESC',
        ['main']
      );

      res.json({ 
        success: true, 
        data: {
          wall: result.rows[0],
          achievementHalls: hallsResult.rows,
          legacyCategories: legacyResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get achievement hall details
  router.get('/wall-of-fame/halls/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const result = await pool.query(
        'SELECT * FROM achievement_halls WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Achievement hall not found' });
      }

      // Get honored members
      const membersResult = await pool.query(
        `SELECT 
          hm.*,
          p.username as player_name,
          p.avatar as player_avatar,
          dr.reputation_score
        FROM honored_members hm
        JOIN players p ON hm.player_id = p.id
        JOIN digital_reputation dr ON p.id = dr.player_id
        WHERE hm.hall_id = $1
        ORDER BY dr.reputation_score DESC`,
        [id]
      );

      res.json({ 
        success: true, 
        data: {
          hall: result.rows[0],
          honoredMembers: membersResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== REPUTATION DNA SYSTEM ====================
  
  // Get player reputation DNA
  router.get('/reputation-dna/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      
      const result = await pool.query(
        'SELECT * FROM reputation_dna WHERE player_id = $1',
        [playerId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Reputation DNA not found' });
      }

      const dna = result.rows[0];

      // Get genetic markers
      const markersResult = await pool.query(
        'SELECT * FROM genetic_markers WHERE reputation_dna_id = $1 ORDER BY rarity DESC',
        [dna.id]
      );

      // Get evolution history
      const evolutionResult = await pool.query(
        'SELECT * FROM evolution_history WHERE reputation_dna_id = $1 ORDER BY timestamp DESC LIMIT 20',
        [dna.id]
      );

      res.json({ 
        success: true, 
        data: {
          reputationDNA: dna,
          geneticMarkers: markersResult.rows,
          evolutionHistory: evolutionResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Trigger reputation evolution
  router.post('/reputation-dna/:playerId/evolve', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      const { evolutionType, trigger } = req.body;

      // Get current DNA
      const dnaResult = await pool.query(
        'SELECT * FROM reputation_dna WHERE player_id = $1',
        [playerId]
      );

      if (dnaResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Reputation DNA not found' });
      }

      const currentDNA = dnaResult.rows[0];
      const newScore = calculateEvolutionScore(currentDNA, evolutionType);

      // Update DNA
      await pool.query(
        `UPDATE reputation_dna SET 
          overall_score = $1,
          knowledge_dna = $2,
          social_dna = $3,
          builder_dna = $4,
          integrity_dna = $5
        WHERE player_id = $6`,
        [
          newScore.overall,
          JSON.stringify(newScore.knowledge),
          JSON.stringify(newScore.social),
          JSON.stringify(newScore.builder),
          JSON.stringify(newScore.integrity),
          playerId
        ]
      );

      // Record evolution
      const evolutionRecord = await pool.query(
        `INSERT INTO evolution_history (
          reputation_dna_id, evolution_type, previous_score, new_score, trigger, timestamp
        ) VALUES ($1, $2, $3, $4, $5, NOW()) 
        RETURNING *`,
        [currentDNA.id, evolutionType, currentDNA.overall_score, newScore.overall, trigger]
      );

      // Check for new genetic markers
      await checkAndAwardGeneticMarkers(currentDNA.id, newScore, pool);

      res.json({ 
        success: true, 
        data: {
          evolution: evolutionRecord.rows[0],
          newScore: newScore,
          unlockedMarkers: await getUnlockedMarkers(currentDNA.id, pool)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== CIVILIZATION RANK SYSTEM ====================
  
  // Get civilization rankings
  router.get('/civilization-rankings', async (req: Request, res: Response) => {
    try {
      const { limit = 100 } = req.query;
      
      const result = await pool.query(
        `SELECT 
          cr.*,
          p.username as player_name,
          p.avatar as player_avatar,
          rdna.overall_score as reputation_score
        FROM civilization_rankings cr
        JOIN players p ON cr.player_id = p.id
        LEFT JOIN reputation_dna rdna ON p.id = rdna.player_id
        ORDER BY cr.balance_score DESC
        LIMIT $1`,
        [limit]
      );

      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== SOULBOUND REPUTATION NFTS ====================
  
  // Get player's soulbound NFTs
  router.get('/soulbound-nfts/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      
      const result = await pool.query(
        `SELECT 
          srn.*,
          p.username as player_name
        FROM soulbound_reputation_nfts srn
        JOIN players p ON srn.owner_player_id = p.id
        WHERE srn.owner_player_id = $1
        ORDER BY srn.minted_at DESC`,
        [playerId]
      );

      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Mint soulbound NFT
  router.post('/soulbound-nfts/mint', async (req: Request, res: Response) => {
    try {
      const { playerId, achievement, reputationScore, visualTraits } = req.body;

      // Generate unique token ID
      const tokenId = generateSoulboundTokenId(playerId, achievement);

      // Create NFT
      const nftResult = await pool.query(
        `INSERT INTO soulbound_reputation_nfts (
          token_id, owner_player_id, reputation_score, achievement, visual_traits, governance_influence, transferability, minted_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
        RETURNING *`,
        [tokenId, playerId, reputationScore, achievement, JSON.stringify(visualTraits), calculateGovernanceInfluence(reputationScore), 'soulbound']
      );

      res.json({ success: true, data: nftResult.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== LIVING HISTORY TIMELINE ====================
  
  // Get player's living history
  router.get('/living-history/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      const { limit = 50, offset = 0 } = req.query;
      
      const result = await pool.query(
        `SELECT * FROM timeline_events 
         WHERE player_id = $1 OR $1 = ANY(participants)
         ORDER BY timestamp DESC 
         LIMIT $2 OFFSET $3`,
        [playerId, limit, offset]
      );

      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Add timeline event
  router.post('/living-history/:playerId/events', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      const { eventType, title, description, participants, impact, media } = req.body;

      const result = await pool.query(
        `INSERT INTO timeline_events (
          player_id, event_type, title, description, participants, impact, media, timestamp
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
        RETURNING *`,
        [playerId, eventType, title, description, JSON.stringify(participants), JSON.stringify(impact), JSON.stringify(media)]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== ANALYTICS & INSIGHTS ====================
  
  // Get excellence system analytics
  router.get('/analytics', async (req: Request, res: Response) => {
    try {
      const { period = '30d' } = req.query;
      
      // Get academy performance
      const academyStats = await pool.query(
        `SELECT 
          a.type,
          COUNT(*) as total_enrollments,
          COUNT(CASE WHEN ae.status = 'completed' THEN 1 END) as completions,
          AVG(ae.progress) as avg_progress
        FROM academies a
        LEFT JOIN academy_enrollments ae ON a.id = ae.academy_id
        WHERE ae.enrolled_at > NOW() - INTERVAL '30 days'
        GROUP BY a.type`,
        []
      );

      // Get innovation metrics
      const innovationStats = await pool.query(
        `SELECT 
          COUNT(*) as total_submissions,
          COUNT(CASE WHEN ps.review_status = 'approved' THEN 1 END) as approved_innovations,
          SUM(CASE WHEN ps.implementation_status = 'implemented' THEN ps.revenue_generated ELSE 0 END) as total_revenue
        FROM player_submissions ps
        WHERE ps.submitted_at > NOW() - INTERVAL '30 days'`,
        []
      );

      // Get reputation evolution trends
      const reputationTrends = await pool.query(
        `SELECT 
          DATE_TRUNC('day', eh.timestamp) as date,
          AVG(eh.new_score) as avg_reputation,
          COUNT(*) as evolutions
        FROM evolution_history eh
        JOIN reputation_dna rdna ON eh.reputation_dna_id = rdna.id
        WHERE eh.timestamp > NOW() - INTERVAL '30 days'
        GROUP BY DATE_TRUNC('day', eh.timestamp)
        ORDER BY date DESC`,
        []
      );

      // Get wall of fame engagement
      const fameEngagement = await pool.query(
        `SELECT 
          hc.category,
          COUNT(*) as profile_views,
          COUNT(DISTINCT hm.player_id) as unique_visitors
        FROM honored_members hm
        JOIN achievement_halls hc ON hm.hall_id = hc.id
        WHERE hm.last_viewed_at > NOW() - INTERVAL '30 days'
        GROUP BY hc.category`,
        []
      );

      res.json({ 
        success: true, 
        data: {
          academyStats: academyStats.rows,
          innovationStats: innovationStats.rows[0],
          reputationTrends: reputationTrends.rows,
          fameEngagement: fameEngagement.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  return router;
}

// Helper functions
async function checkAcademyPrerequisites(playerId: string, requirements: any[], pool: Pool): Promise<{ met: boolean; missing: string[] }> {
  try {
    const missing: string[] = [];

    for (const req of requirements) {
      switch (req.type) {
        case RequirementType.LEVEL:
          const playerLevel = await getPlayerLevel(playerId, pool);
          if (playerLevel < req.value) {
            missing.push(`Level ${req.value} required`);
          }
          break;
        case RequirementType.SKILL:
          const hasSkill = await checkPlayerSkill(playerId, req.value, pool);
          if (!hasSkill) {
            missing.push(`Skill: ${req.value}`);
          }
          break;
        case RequirementType.REPUTATION:
          const reputation = await getPlayerReputation(playerId, pool);
          if (reputation < req.value) {
            missing.push(`Reputation: ${req.value}`);
          }
          break;
        case RequirementType.COURSE_COMPLETION:
          const completedCourses = await getCompletedCourses(playerId, pool);
          if (completedCourses < req.value) {
            missing.push(`${req.value} courses completed`);
          }
          break;
      }
    }

    return { met: missing.length === 0, missing };
  } catch (error) {
    console.error('Error checking prerequisites:', error);
    return { met: false, missing: ['Error checking prerequisites'] };
  }
}

async function getPlayerLevel(playerId: string, pool: Pool): Promise<number> {
  const result = await pool.query(
    'SELECT COALESCE(MAX(ae.progress), 0) as level FROM academy_enrollments ae WHERE ae.player_id = $1',
    [playerId]
  );
  return result.rows[0].level;
}

async function checkPlayerSkill(playerId: string, skillName: string, pool: Pool): Promise<boolean> {
  const result = await pool.query(
    `SELECT EXISTS(
      SELECT 1 FROM player_skills ps 
      JOIN skill_paths sp ON ps.path_id = sp.id 
      WHERE ps.player_id = $1 AND sp.name = $2 AND ps.level >= 1
    )`,
    [playerId, skillName]
  );
  return result.rows[0].exists;
}

async function getPlayerReputation(playerId: string, pool: Pool): Promise<number> {
  const result = await pool.query(
    'SELECT COALESCE(overall_score, 0) as reputation FROM reputation_dna WHERE player_id = $1',
    [playerId]
  );
  return result.rows[0].reputation;
}

async function getCompletedCourses(playerId: string, pool: Pool): Promise<number> {
  const result = await pool.query(
    `SELECT COUNT(*) as count FROM academy_enrollment_courses aec 
     JOIN academy_enrollments ae ON aec.enrollment_id = ae.id 
     WHERE ae.player_id = $1 AND aec.completed_at IS NOT NULL`,
    [playerId]
  );
  return result.rows[0].count;
}

function calculateEvolutionScore(currentDNA: any, evolutionType: EvolutionType): any {
  const baseScore = currentDNA.overall_score;
  let bonus = 0;

  switch (evolutionType) {
    case EvolutionType.SKILL_GAIN:
      bonus = 50;
      break;
    case EvolutionType.REPUTATION_INCREASE:
      bonus = 100;
      break;
    case EvolutionType.LEVEL_UP:
      bonus = 75;
      break;
    case EvolutionType.ACHIEVEMENT_UNLOCK:
      bonus = 25;
      break;
    case EvolutionType.DNA_MUTATION:
      bonus = 200;
      break;
  }

  return {
    overall: baseScore + bonus,
    knowledge: Math.min(100, currentDNA.knowledge_dna + bonus * 0.3),
    social: Math.min(100, currentDNA.social_dna + bonus * 0.2),
    builder: Math.min(100, currentDNA.builder_dna + bonus * 0.3),
    integrity: Math.min(100, currentDNA.integrity_dna + bonus * 0.2)
  };
}

async function checkAndAwardGeneticMarkers(dnaId: string, newScore: any, pool: Pool): Promise<void> {
  try {
    // Check for new marker unlocks based on score thresholds
    const markerThresholds = [
      { score: 100, rarity: GeneticRarity.UNCOMMON },
      { score: 250, rarity: GeneticRarity.RARE },
      { score: 500, rarity: GeneticRarity.EPIC },
      { score: 1000, rarity: GeneticRarity.LEGENDARY },
      { score: 2000, rarity: GeneticRarity.MYTHIC }
    ];

    for (const threshold of markerThresholds) {
      if (newScore.overall >= threshold.score) {
        // Check if already awarded
        const existing = await pool.query(
          'SELECT * FROM genetic_markers WHERE reputation_dna_id = $1 AND rarity = $2',
          [dnaId, threshold.rarity]
        );

        if (existing.rows.length === 0) {
          await pool.query(
            `INSERT INTO genetic_markers (
              reputation_dna_id, name, description, rarity, effect, inheritance_pattern
            ) VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              dnaId, 
              `Genetic Marker ${threshold.rarity}`,
              `Unlocked at reputation ${threshold.score}`,
              threshold.rarity,
              JSON.stringify({ type: EffectType.BONUS, value: 10 }),
              InheritanceType.DIRECT
            ]
          );
        }
      }
    }
  } catch (error) {
    console.error('Error checking genetic markers:', error);
  }
}

async function getUnlockedMarkers(dnaId: string, pool: Pool): Promise<any[]> {
  const result = await pool.query(
    'SELECT * FROM genetic_markers WHERE reputation_dna_id = $1 ORDER BY rarity DESC',
    [dnaId]
  );
  return result.rows;
}

function generateSoulboundTokenId(playerId: string, achievement: string): string {
  const timestamp = Date.now();
  const hash = Buffer.from(`${playerId}-${achievement}-${timestamp}`).toString('base64');
  return `PPU-${hash.substring(0, 16).toUpperCase()}`;
}

function calculateGovernanceInfluence(reputationScore: number): number {
  // Governance influence scales with reputation but with diminishing returns
  return Math.floor(Math.sqrt(reputationScore) * 10);
}
