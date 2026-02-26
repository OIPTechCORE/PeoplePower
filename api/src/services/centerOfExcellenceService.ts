import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

// ===================================
// CENTER OF EXCELLENCE INTERFACES
// ===================================

export interface Academy {
  id: string;
  name: string;
  description: string;
  category: 'game_strategy' | 'digital_skills' | 'economic_intelligence' | 'community_leadership' | 'social_impact';
  icon_url: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AcademyCourse {
  id: string;
  academy_id: string;
  title: string;
  description: string;
  difficulty_level: number; // 1-5
  duration_minutes: number;
  prerequisites: string[];
  learning_outcomes: string[];
  rewards: {
    tokens: number;
    nfts: string[];
    privileges: string[];
  };
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface PlayerAcademyProgress {
  id: string;
  player_id: string;
  academy_id: string;
  course_id: string;
  enrollment_date: Date;
  completion_date?: Date;
  progress_percentage: number; // 0-100
  assessment_score?: number; // 0-100
  status: 'enrolled' | 'in_progress' | 'completed' | 'failed';
}

export interface AIMentor {
  id: string;
  player_id: string;
  mentor_type: 'skill_coach' | 'career_guide' | 'innovation_advisor';
  personality_traits: Record<string, any>;
  expertise_areas: string[];
  activation_date: Date;
  last_interaction?: Date;
  interaction_count: number;
  effectiveness_score: number; // 0.00-1.00
}

export interface MentorshipSession {
  id: string;
  mentor_id: string;
  player_id: string;
  session_type: 'skill_assessment' | 'personalized_mission' | 'learning_path' | 'career_advice';
  session_data: Record<string, any>;
  player_feedback?: number; // 1-5 rating
  completed_at: Date;
  outcomes: Record<string, any>;
}

export interface InnovationLab {
  id: string;
  name: string;
  description: string;
  focus_area: 'mini_apps' | 'game_tools' | 'community_solutions' | 'educational_content';
  submission_guidelines: string;
  evaluation_criteria: Record<string, any>;
  reward_pool: number; // Tokens
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface InnovationSubmission {
  id: string;
  lab_id: string;
  player_id: string;
  title: string;
  description: string;
  submission_type: 'mini_app' | 'tool' | 'solution' | 'content';
  implementation_url?: string;
  demo_video_url?: string;
  technical_documentation?: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'implemented';
  review_score?: number; // 0-100
  reviewer_feedback?: string;
  reward_amount?: number;
  submitted_at: Date;
  reviewed_at?: Date;
  implemented_at?: Date;
}

// ===================================
// CENTER OF EXCELLENCE SERVICE
// ===================================

export class CenterOfExcellenceService {
  constructor(private db: Pool) {}

  // ===================================
  // ACADEMY MANAGEMENT
  // ===================================

  async getAllAcademies(): Promise<Academy[]> {
    const query = `
      SELECT * FROM academies 
      WHERE is_active = true 
      ORDER BY name
    `;
    const result = await this.db.query(query);
    return result.rows;
  }

  async getAcademyById(id: string): Promise<Academy | null> {
    const query = 'SELECT * FROM academies WHERE id = $1 AND is_active = true';
    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
  }

  async getAcademyCourses(academyId: string): Promise<AcademyCourse[]> {
    const query = `
      SELECT * FROM academy_courses 
      WHERE academy_id = $1 AND is_active = true 
      ORDER BY difficulty_level, title
    `;
    const result = await this.db.query(query, [academyId]);
    return result.rows.map(row => ({
      ...row,
      prerequisites: row.prerequisites || [],
      learning_outcomes: row.learning_outcomes || [],
      rewards: row.rewards || { tokens: 0, nfts: [], privileges: [] }
    }));
  }

  async enrollPlayerInCourse(playerId: string, courseId: string): Promise<PlayerAcademyProgress> {
    const checkQuery = `
      SELECT id FROM player_academy_progress 
      WHERE player_id = $1 AND course_id = $2
    `;
    const existing = await this.db.query(checkQuery, [playerId, courseId]);
    
    if (existing.rows.length > 0) {
      throw new Error('Player already enrolled in this course');
    }

    const courseQuery = 'SELECT academy_id FROM academy_courses WHERE id = $1';
    const courseResult = await this.db.query(courseQuery, [courseId]);
    
    if (courseResult.rows.length === 0) {
      throw new Error('Course not found');
    }

    const insertQuery = `
      INSERT INTO player_academy_progress 
      (id, player_id, academy_id, course_id, enrollment_date, status) 
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, 'enrolled')
      RETURNING *
    `;
    
    const result = await this.db.query(insertQuery, [
      uuidv4(), playerId, courseResult.rows[0].academy_id, courseId
    ]);
    
    return result.rows[0];
  }

  async updatePlayerProgress(
    playerId: string, 
    courseId: string, 
    progressPercentage: number, 
    assessmentScore?: number
  ): Promise<PlayerAcademyProgress> {
    const status = progressPercentage >= 100 ? 'completed' : 'in_progress';
    const completionDate = progressPercentage >= 100 ? new Date() : null;

    const query = `
      UPDATE player_academy_progress 
      SET 
        progress_percentage = $1,
        assessment_score = $2,
        status = $3,
        completion_date = $4
      WHERE player_id = $5 AND course_id = $6
      RETURNING *
    `;

    const result = await this.db.query(query, [
      progressPercentage, assessmentScore, status, completionDate, playerId, courseId
    ]);

    if (result.rows.length === 0) {
      throw new Error('Enrollment not found');
    }

    return result.rows[0];
  }

  async getPlayerAcademyProgress(playerId: string): Promise<PlayerAcademyProgress[]> {
    const query = `
      SELECT pap.*, ac.title as course_title, a.name as academy_name
      FROM player_academy_progress pap
      JOIN academy_courses ac ON pap.course_id = ac.id
      JOIN academies a ON pap.academy_id = a.id
      WHERE pap.player_id = $1
      ORDER BY pap.enrollment_date DESC
    `;
    const result = await this.db.query(query, [playerId]);
    return result.rows;
  }

  // ===================================
  // AI MENTORSHIP SYSTEM
  // ===================================

  async getOrCreateAIMentor(
    playerId: string, 
    mentorType: 'skill_coach' | 'career_guide' | 'innovation_advisor'
  ): Promise<AIMentor> {
    const checkQuery = 'SELECT * FROM ai_mentors WHERE player_id = $1 AND mentor_type = $2';
    const existing = await this.db.query(checkQuery, [playerId, mentorType]);
    
    if (existing.rows.length > 0) {
      return existing.rows[0];
    }

    const personalityTraits = this.generateMentorPersonality(mentorType);
    const expertiseAreas = this.getMentorExpertiseAreas(mentorType);

    const insertQuery = `
      INSERT INTO ai_mentors 
      (id, player_id, mentor_type, personality_traits, expertise_areas, activation_date, interaction_count, effectiveness_score)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, 0, 0.8)
      RETURNING *
    `;

    const result = await this.db.query(insertQuery, [
      uuidv4(), playerId, mentorType, personalityTraits, expertiseAreas
    ]);

    return result.rows[0];
  }

  async createMentorshipSession(
    mentorId: string,
    playerId: string,
    sessionType: 'skill_assessment' | 'personalized_mission' | 'learning_path' | 'career_advice',
    sessionData: Record<string, any>
  ): Promise<MentorshipSession> {
    const query = `
      INSERT INTO mentorship_sessions 
      (id, mentor_id, player_id, session_type, session_data, completed_at, outcomes)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6)
      RETURNING *
    `;

    const outcomes = this.generateSessionOutcomes(sessionType, sessionData);

    const result = await this.db.query(query, [
      uuidv4(), mentorId, playerId, sessionType, sessionData, outcomes
    ]);

    // Update mentor interaction count
    await this.db.query(
      'UPDATE ai_mentors SET interaction_count = interaction_count + 1, last_interaction = CURRENT_TIMESTAMP WHERE id = $1',
      [mentorId]
    );

    return result.rows[0];
  }

  async getPlayerMentorshipHistory(playerId: string): Promise<MentorshipSession[]> {
    const query = `
      SELECT ms.*, am.mentor_type
      FROM mentorship_sessions ms
      JOIN ai_mentors am ON ms.mentor_id = am.id
      WHERE ms.player_id = $1
      ORDER BY ms.completed_at DESC
      LIMIT 50
    `;
    const result = await this.db.query(query, [playerId]);
    return result.rows;
  }

  // ===================================
  // INNOVATION LABS
  // ===================================

  async getAllInnovationLabs(): Promise<InnovationLab[]> {
    const query = 'SELECT * FROM innovation_labs WHERE is_active = true ORDER BY name';
    const result = await this.db.query(query);
    return result.rows;
  }

  async submitInnovation(
    labId: string,
    playerId: string,
    submissionData: Omit<InnovationSubmission, 'id' | 'lab_id' | 'player_id' | 'submitted_at'>
  ): Promise<InnovationSubmission> {
    const query = `
      INSERT INTO innovation_submissions 
      (id, lab_id, player_id, title, description, submission_type, implementation_url, 
       demo_video_url, technical_documentation, status, submitted_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'submitted', CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const result = await this.db.query(query, [
      uuidv4(),
      labId,
      playerId,
      submissionData.title,
      submissionData.description,
      submissionData.submission_type,
      submissionData.implementation_url,
      submissionData.demo_video_url,
      submissionData.technical_documentation
    ]);

    return result.rows[0];
  }

  async reviewInnovation(
    submissionId: string,
    reviewScore: number,
    reviewerFeedback: string,
    status: 'approved' | 'rejected'
  ): Promise<InnovationSubmission> {
    const rewardAmount = status === 'approved' ? this.calculateInnovationReward(reviewScore) : 0;

    const query = `
      UPDATE innovation_submissions 
      SET 
        review_score = $1,
        reviewer_feedback = $2,
        status = $3,
        reward_amount = $4,
        reviewed_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `;

    const result = await this.db.query(query, [
      reviewScore, reviewerFeedback, status, rewardAmount, submissionId
    ]);

    return result.rows[0];
  }

  async getPlayerInnovationSubmissions(playerId: string): Promise<InnovationSubmission[]> {
    const query = `
      SELECT isub.*, il.name as lab_name, il.focus_area
      FROM innovation_submissions isub
      JOIN innovation_labs il ON isub.lab_id = il.id
      WHERE isub.player_id = $1
      ORDER BY isub.submitted_at DESC
    `;
    const result = await this.db.query(query, [playerId]);
    return result.rows;
  }

  async getPendingInnovations(): Promise<InnovationSubmission[]> {
    const query = `
      SELECT isub.*, p.username, p.display_name, il.name as lab_name
      FROM innovation_submissions isub
      JOIN players p ON isub.player_id = p.id
      JOIN innovation_labs il ON isub.lab_id = il.id
      WHERE isub.status = 'submitted'
      ORDER BY isub.submitted_at ASC
    `;
    const result = await this.db.query(query);
    return result.rows;
  }

  // ===================================
  // UTILITY METHODS
  // ===================================

  private generateMentorPersonality(mentorType: string): Record<string, any> {
    const personalities = {
      skill_coach: {
        communication_style: 'encouraging',
        approach: 'step_by_step',
        feedback_frequency: 'high',
        motivation_type: 'achievement_focused'
      },
      career_guide: {
        communication_style: 'inspirational',
        approach: 'big_picture',
        feedback_frequency: 'medium',
        motivation_type: 'growth_focused'
      },
      innovation_advisor: {
        communication_style: 'challenging',
        approach: 'experimental',
        feedback_frequency: 'low',
        motivation_type: 'impact_focused'
      }
    };
    return personalities[mentorType] || personalities.skill_coach;
  }

  private getMentorExpertiseAreas(mentorType: string): string[] {
    const expertise = {
      skill_coach: ['gameplay_mechanics', 'strategy_optimization', 'skill_assessment'],
      career_guide: ['path_planning', 'opportunity_identification', 'network_building'],
      innovation_advisor: ['creative_thinking', 'problem_solving', 'implementation_strategy']
    };
    return expertise[mentorType] || expertise.skill_coach;
  }

  private generateSessionOutcomes(sessionType: string, sessionData: Record<string, any>): Record<string, any> {
    const outcomes = {
      skill_assessment: {
        skill_level_identified: Math.floor(Math.random() * 100),
        improvement_areas: ['area1', 'area2'],
        recommended_courses: ['course1', 'course2']
      },
      personalized_mission: {
        mission_generated: true,
        difficulty_level: 'medium',
        estimated_completion_time: '2 hours',
        reward_potential: 500
      },
      learning_path: {
        path_created: true,
        total_courses: 5,
        estimated_duration: '3 months',
        final_outcome: 'certification'
      },
      career_advice: {
        career_stage_identified: 'intermediate',
        next_steps: ['step1', 'step2'],
        opportunities_identified: 3
      }
    };
    return outcomes[sessionType] || {};
  }

  private calculateInnovationReward(reviewScore: number): number {
    const baseReward = 1000;
    const multiplier = reviewScore / 100;
    return Math.floor(baseReward * multiplier * (0.8 + Math.random() * 0.4)); // 80%-120% of base
  }

  // ===================================
  // ANALYTICS AND REPORTING
  // ===================================

  async getAcademyPerformanceMetrics(academyId: string): Promise<Record<string, any>> {
    const query = `
      SELECT 
        COUNT(DISTINCT pap.player_id) as total_enrollments,
        COUNT(DISTINCT CASE WHEN pap.status = 'completed' THEN pap.player_id END) as total_completions,
        AVG(CASE WHEN pap.assessment_score IS NOT NULL THEN pap.assessment_score END) as average_score,
        COUNT(DISTINCT isub.id) as innovations_generated
      FROM player_academy_progress pap
      LEFT JOIN innovation_submissions isub ON pap.player_id = isub.player_id AND isub.status = 'approved'
      WHERE pap.academy_id = $1
    `;
    const result = await this.db.query(query, [academyId]);
    return result.rows[0];
  }

  async getPlayerCenterOfExcellenceStats(playerId: string): Promise<Record<string, any>> {
    const query = `
      SELECT 
        COUNT(DISTINCT pap.course_id) as courses_enrolled,
        COUNT(DISTINCT CASE WHEN pap.status = 'completed' THEN pap.course_id END) as courses_completed,
        AVG(CASE WHEN pap.assessment_score IS NOT NULL THEN pap.assessment_score END) as average_score,
        COUNT(DISTINCT ms.id) as mentorship_sessions,
        COUNT(DISTINCT isub.id) as innovations_submitted,
        COUNT(DISTINCT CASE WHEN isub.status = 'approved' THEN isub.id END) as innovations_approved,
        COALESCE(SUM(CASE WHEN isub.reward_amount IS NOT NULL THEN isub.reward_amount END), 0) as total_innovation_rewards
      FROM player_academy_progress pap
      LEFT JOIN mentorship_sessions ms ON pap.player_id = ms.player_id
      LEFT JOIN innovation_submissions isub ON pap.player_id = isub.player_id
      WHERE pap.player_id = $1
    `;
    const result = await this.db.query(query, [playerId]);
    return result.rows[0];
  }
}
