import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

// Types for People Power University
export interface Course {
  id: string;
  title: string;
  description: string;
  faculty: Faculty;
  level: CourseLevel;
  duration: number; // minutes
  difficulty: number; // 1-10
  tags: string[];
  learningObjectives: string[];
  prerequisites: string[];
  content: CourseContent[];
  assessments: Assessment[];
  creatorId: string;
  creatorType: CreatorType;
  status: CourseStatus;
  createdAt: Date;
  updatedAt: Date;
  qualityScore: number;
  completionRate: number;
  averageRating: number;
  enrollmentCount: number;
  language: string;
  region: string;
  culturalContext: string;
  isAIGenerated: boolean;
  isCommunityCreated: boolean;
  revenueShare: number;
}

export interface CourseContent {
  id: string;
  type: ContentType;
  title: string;
  content: string;
  duration: number; // minutes
  order: number;
  mediaUrl?: string;
  interactiveElements?: InteractiveElement[];
  learningOutcomes: string[];
}

export interface Assessment {
  id: string;
  type: AssessmentType;
  questions: Question[];
  passingScore: number;
  timeLimit?: number; // minutes
  maxAttempts: number;
  isGraded: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  difficulty: number;
}

export interface InteractiveElement {
  id: string;
  type: InteractiveType;
  title: string;
  content: any;
  required: boolean;
  points: number;
}

export interface UserProgress {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  lastAccessedAt: Date;
  completedContent: string[];
  currentContent: string;
  progress: number; // 0-100
  timeSpent: number; // minutes
  assessmentAttempts: AssessmentAttempt[];
  certificate?: Certificate;
  isCompleted: boolean;
  completedAt?: Date;
}

export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  userId: string;
  attempt: number;
  answers: Record<string, any>;
  score: number;
  passed: boolean;
  completedAt: Date;
  timeSpent: number;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  type: CertificateType;
  issuedAt: Date;
  expiresAt?: Date;
  verificationCode: string;
  credentialLevel: CredentialLevel;
  skills: string[];
  issuerId: string;
  blockchainVerified?: boolean;
}

export interface CreatorProfile {
  id: string;
  userId: string;
  type: CreatorType;
  tier: CreatorTier;
  specializations: string[];
  bio: string;
  qualifications: Qualification[];
  coursesCreated: number;
  totalRevenue: number;
  averageRating: number;
  reputationScore: number;
  isVerified: boolean;
  verificationDocuments?: string[];
  createdAt: Date;
}

export interface Qualification {
  id: string;
  type: QualificationType;
  title: string;
  institution: string;
  issuedDate: Date;
  expiresAt?: Date;
  verificationStatus: VerificationStatus;
  documents: string[];
}

// Enums
export enum Faculty {
  LEADERSHIP_GOVERNANCE = 'leadership_governance',
  DIGITAL_ENTREPRENEURSHIP = 'digital_entrepreneurship',
  TECHNOLOGY_AI_LITERACY = 'technology_ai_literacy',
  CREATIVE_ARTS_MEDIA = 'creative_arts_media',
  CIVIC_COMMUNITY_DEVELOPMENT = 'civic_community_development'
}

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
  PROFESSIONAL = 'professional'
}

export enum ContentType {
  TEXT = 'text',
  VIDEO = 'video',
  AUDIO = 'audio',
  INTERACTIVE = 'interactive',
  SIMULATION = 'simulation',
  QUIZ = 'quiz',
  ASSIGNMENT = 'assignment',
  CASE_STUDY = 'case_study',
  SCENARIO = 'scenario'
}

export enum AssessmentType {
  QUIZ = 'quiz',
  EXAM = 'exam',
  ASSIGNMENT = 'assignment',
  PROJECT = 'project',
  SIMULATION = 'simulation',
  PEER_REVIEW = 'peer_review',
  PRACTICAL = 'practical'
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay',
  MATCHING = 'matching',
  FILL_BLANK = 'fill_blank',
  DRAG_DROP = 'drag_drop',
  SCENARIO_BASED = 'scenario_based'
}

export enum InteractiveType {
  POLL = 'poll',
  DISCUSSION = 'discussion',
  ROLE_PLAY = 'role_play',
  SIMULATION = 'simulation',
  GAMIFICATION = 'gamification',
  COLLABORATION = 'collaboration',
  REFLECTION = 'reflection'
}

export enum CertificateType {
  COMPLETION = 'completion',
  ACHIEVEMENT = 'achievement',
  SKILL = 'skill',
  PROFESSIONAL = 'professional',
  CERTIFICATION = 'certification',
  DIPLOMA = 'diploma'
}

export enum CredentialLevel {
  BASIC = 'basic',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
  MASTER = 'master'
}

export enum CreatorType {
  COMMUNITY_CREATOR = 'community_creator',
  CERTIFIED_CONTRIBUTOR = 'certified_contributor',
  EXPERT_CONTRIBUTOR = 'expert_contributor',
  INSTITUTIONAL_PARTNER = 'institutional_partner'
}

export enum CreatorTier {
  TIER_1 = 'tier_1', // Basic creators
  TIER_2 = 'tier_2', // Certified contributors
  TIER_3 = 'tier_3', // Expert contributors
  TIER_4 = 'tier_4'  // Institutional partners
}

export enum QualificationType {
  ACADEMIC_DEGREE = 'academic_degree',
  PROFESSIONAL_CERTIFICATION = 'professional_certification',
  INDUSTRY_EXPERIENCE = 'industry_experience',
  SKILL_CERTIFICATION = 'skill_certification',
  TEACHING_CERTIFICATION = 'teaching_certification'
}

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export enum CourseStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  SUSPENDED = 'suspended',
  ARCHIVED = 'archived'
}

// AI Generation interfaces
export interface AIGenerationRequest {
  id: string;
  topic: string;
  faculty: Faculty;
  level: CourseLevel;
  duration: number;
  language: string;
  region: string;
  culturalContext: string;
  targetAudience: string;
  learningObjectives: string[];
  specialRequirements?: string;
  status: GenerationStatus;
  createdAt: Date;
  completedAt?: Date;
  generatedCourseId?: string;
  qualityScore?: number;
}

export enum GenerationStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  QUALITY_REVIEW = 'quality_review'
}

export interface QualityMetrics {
  id: string;
  courseId: string;
  accuracyScore: number;
  educationalValueScore: number;
  engagementScore: number;
  culturalFitScore: number;
  technicalQualityScore: number;
  overallScore: number;
  reviewedBy: string;
  reviewedAt: Date;
  feedback: string;
  approved: boolean;
}

export interface RegionalAdaptation {
  id: string;
  originalCourseId: string;
  adaptedCourseId: string;
  targetRegion: string;
  targetLanguage: string;
  culturalModifications: string[];
  status: AdaptationStatus;
  adaptedBy: string;
  adaptedAt: Date;
}

export enum AdaptationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

// Main Education Service
export class EducationService {
  private pool: Pool;
  private aiGenerationQueue: AIGenerationRequest[] = [];
  private qualityThreshold = 85; // Minimum quality score for publication

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // Course Management
  async createCourse(courseData: Partial<Course>, creatorId: string): Promise<Course> {
    const course: Course = {
      id: uuidv4(),
      title: courseData.title!,
      description: courseData.description!,
      faculty: courseData.faculty!,
      level: courseData.level!,
      duration: courseData.duration!,
      difficulty: courseData.difficulty || 5,
      tags: courseData.tags || [],
      learningObjectives: courseData.learningObjectives || [],
      prerequisites: courseData.prerequisites || [],
      content: courseData.content || [],
      assessments: courseData.assessments || [],
      creatorId,
      creatorType: courseData.creatorType || CreatorType.COMMUNITY_CREATOR,
      status: CourseStatus.DRAFT,
      createdAt: new Date(),
      updatedAt: new Date(),
      qualityScore: 0,
      completionRate: 0,
      averageRating: 0,
      enrollmentCount: 0,
      language: courseData.language || 'en',
      region: courseData.region || 'global',
      culturalContext: courseData.culturalContext || 'general',
      isAIGenerated: courseData.isAIGenerated || false,
      isCommunityCreated: courseData.isCommunityCreated || true,
      revenueShare: this.calculateRevenueShare(courseData.creatorType || CreatorType.COMMUNITY_CREATOR)
    };

    const query = `
      INSERT INTO courses (
        id, title, description, faculty, level, duration, difficulty, tags,
        learning_objectives, prerequisites, content, assessments, creator_id,
        creator_type, status, created_at, updated_at, quality_score,
        completion_rate, average_rating, enrollment_count, language, region,
        cultural_context, is_ai_generated, is_community_created, revenue_share
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26
      ) RETURNING *
    `;

    const values = [
      course.id, course.title, course.description, course.faculty, course.level,
      course.duration, course.difficulty, JSON.stringify(course.tags),
      JSON.stringify(course.learningObjectives), JSON.stringify(course.prerequisites),
      JSON.stringify(course.content), JSON.stringify(course.assessments),
      course.creatorId, course.creatorType, course.status, course.createdAt,
      course.updatedAt, course.qualityScore, course.completionRate,
      course.averageRating, course.enrollmentCount, course.language,
      course.region, course.culturalContext, course.isAIGenerated,
      course.isCommunityCreated, course.revenueShare
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async generateCourseWithAI(request: AIGenerationRequest): Promise<Course> {
    // Update request status
    request.status = GenerationStatus.PROCESSING;
    await this.updateGenerationRequest(request);

    try {
      // Step 1: Generate course content using AI
      const generatedContent = await this.callAIGenerationAPI(request);
      
      // Step 2: Create course structure
      const courseData = this.structureAIGeneratedContent(generatedContent, request);
      
      // Step 3: Quality assessment
      const qualityMetrics = await this.assessCourseQuality(courseData);
      
      // Step 4: Cultural adaptation
      const adaptedCourse = await this.adaptCourseForRegion(courseData, request.region, request.language);
      
      // Step 5: Create course in database
      const course = await this.createCourse(adaptedCourse, 'ai-system');
      
      // Step 6: Update generation request
      request.status = GenerationStatus.COMPLETED;
      request.completedAt = new Date();
      request.generatedCourseId = course.id;
      request.qualityScore = qualityMetrics.overallScore;
      await this.updateGenerationRequest(request);
      
      // Step 7: Store quality metrics
      await this.storeQualityMetrics(course.id, qualityMetrics);
      
      return course;
    } catch (error) {
      request.status = GenerationStatus.FAILED;
      await this.updateGenerationRequest(request);
      throw error;
    }
  }

  private async callAIGenerationAPI(request: AIGenerationRequest): Promise<any> {
    // Simulate AI API call - in production, this would call actual AI service
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          title: `Introduction to ${request.topic}`,
          description: `A comprehensive course on ${request.topic} for ${request.level} learners`,
          content: this.generateCourseContent(request),
          assessments: this.generateAssessments(request)
        });
      }, 2000);
    });
  }

  private generateCourseContent(request: AIGenerationRequest): CourseContent[] {
    const contentCount = Math.ceil(request.duration / 10); // 10-minute segments
    const content: CourseContent[] = [];
    
    for (let i = 0; i < contentCount; i++) {
      content.push({
        id: uuidv4(),
        type: ContentType.TEXT,
        title: `Module ${i + 1}: ${this.generateModuleTitle(request.topic, i)}`,
        content: this.generateModuleContent(request.topic, i, request.level),
        duration: 10,
        order: i + 1,
        learningOutcomes: this.generateLearningOutcomes(request.topic, i)
      });
    }
    
    return content;
  }

  private generateModuleTitle(topic: string, index: number): string {
    const titles = [
      'Introduction to Concepts',
      'Core Principles',
      'Practical Applications',
      'Advanced Techniques',
      'Case Studies',
      'Best Practices',
      'Common Challenges',
      'Future Trends'
    ];
    return titles[index % titles.length];
  }

  private generateModuleContent(topic: string, index: number, level: CourseLevel): string {
    const complexity = level === CourseLevel.BEGINNER ? 'simple' : 
                     level === CourseLevel.INTERMEDIATE ? 'moderate' : 'complex';
    
    return `
      <h2>Module ${index + 1}: ${this.generateModuleTitle(topic, index)}</h2>
      <p>This ${complexity} module covers essential concepts related to ${topic}.</p>
      <p>Learning objectives for this module include understanding key principles and applying them in practical scenarios.</p>
      <p>Content is adapted for ${level} learners with appropriate depth and examples.</p>
      <div class="interactive-element">
        <h3>Interactive Exercise</h3>
        <p>Apply your knowledge through this hands-on exercise related to ${topic}.</p>
      </div>
    `;
  }

  private generateLearningOutcomes(topic: string, index: number): string[] {
    return [
      `Understand fundamental concepts of ${topic}`,
      `Apply ${topic} principles in practical situations`,
      `Analyze problems related to ${topic}`,
      `Create solutions using ${topic} techniques`
    ];
  }

  private generateAssessments(request: AIGenerationRequest): Assessment[] {
    return [
      {
        id: uuidv4(),
        type: AssessmentType.QUIZ,
        questions: this.generateQuizQuestions(request.topic, request.level),
        passingScore: 70,
        timeLimit: 30,
        maxAttempts: 3,
        isGraded: true
      }
    ];
  }

  private generateQuizQuestions(topic: string, level: CourseLevel): Question[] {
    const questions: Question[] = [];
    
    for (let i = 0; i < 5; i++) {
      questions.push({
        id: uuidv4(),
        type: QuestionType.MULTIPLE_CHOICE,
        question: `What is the most important aspect of ${topic} in this scenario?`,
        options: [
          'Option A: Strategic planning',
          'Option B: Technical execution',
          'Option C: Team collaboration',
          'Option D: Resource management'
        ],
        correctAnswer: 'Option A: Strategic planning',
        explanation: `Strategic planning is crucial for success in ${topic}.`,
        points: 20,
        difficulty: level === CourseLevel.BEGINNER ? 3 : 7
      });
    }
    
    return questions;
  }

  private structureAIGeneratedContent(generatedContent: any, request: AIGenerationRequest): Partial<Course> {
    return {
      title: generatedContent.title,
      description: generatedContent.description,
      faculty: request.faculty,
      level: request.level,
      duration: request.duration,
      difficulty: this.calculateDifficulty(request.level),
      tags: this.generateTags(request.topic, request.faculty),
      learningObjectives: request.learningObjectives,
      content: generatedContent.content,
      assessments: generatedContent.assessments,
      language: request.language,
      region: request.region,
      culturalContext: request.culturalContext,
      isAIGenerated: true,
      isCommunityCreated: false
    };
  }

  private calculateDifficulty(level: CourseLevel): number {
    const difficultyMap = {
      [CourseLevel.BEGINNER]: 3,
      [CourseLevel.INTERMEDIATE]: 5,
      [CourseLevel.ADVANCED]: 7,
      [CourseLevel.EXPERT]: 9,
      [CourseLevel.PROFESSIONAL]: 10
    };
    return difficultyMap[level];
  }

  private generateTags(topic: string, faculty: Faculty): string[] {
    const baseTags = [topic.toLowerCase(), faculty];
    const additionalTags = this.extractKeywords(topic);
    return [...baseTags, ...additionalTags];
  }

  private extractKeywords(topic: string): string[] {
    // Simple keyword extraction - in production, use NLP
    return topic.toLowerCase().split(' ').filter(word => word.length > 3);
  }

  private async assessCourseQuality(courseData: Partial<Course>): Promise<QualityMetrics> {
    // Simulate quality assessment - in production, use AI models
    const accuracyScore = Math.random() * 20 + 80; // 80-100
    const educationalValueScore = Math.random() * 15 + 85; // 85-100
    const engagementScore = Math.random() * 25 + 75; // 75-100
    const culturalFitScore = Math.random() * 20 + 80; // 80-100
    const technicalQualityScore = Math.random() * 10 + 90; // 90-100
    
    const overallScore = (accuracyScore + educationalValueScore + engagementScore + culturalFitScore + technicalQualityScore) / 5;
    
    return {
      id: uuidv4(),
      courseId: courseData.id!,
      accuracyScore,
      educationalValueScore,
      engagementScore,
      culturalFitScore,
      technicalQualityScore,
      overallScore,
      reviewedBy: 'ai-quality-system',
      reviewedAt: new Date(),
      feedback: overallScore >= this.qualityThreshold ? 'Course meets quality standards' : 'Course needs improvement',
      approved: overallScore >= this.qualityThreshold
    };
  }

  private async adaptCourseForRegion(courseData: Partial<Course>, region: string, language: string): Promise<Partial<Course>> {
    // Simulate regional adaptation - in production, use cultural adaptation AI
    const adaptedContent = courseData.content?.map(content => ({
      ...content,
      content: this.adaptContentForRegion(content.content, region),
      title: this.adaptTitleForRegion(content.title, region)
    }));
    
    return {
      ...courseData,
      content: adaptedContent,
      region,
      language,
      culturalContext: this.generateCulturalContext(region)
    };
  }

  private adaptContentForRegion(content: string, region: string): string {
    // Add region-specific examples and context
    const regionExamples = {
      'east_africa': 'For example, in Kenya\'s mobile money ecosystem...',
      'west_africa': 'Consider Nigeria\'s entertainment industry...',
      'north_africa': "In Egypt's startup scene...",
      'southern_africa': 'South Africa\'s mining sector shows...',
      'central_africa': 'The DRC\'s natural resources...'
    };
    
    const example = regionExamples[region as keyof typeof regionExamples] || '';
    return content.replace(/<p>/g, `<p>${example} `);
  }

  private adaptTitleForRegion(title: string, region: string): string {
    return title; // In production, adapt titles for cultural relevance
  }

  private generateCulturalContext(region: string): string {
    const contexts = {
      'east_africa': 'Adapted for East African context with local business examples',
      'west_africa': 'Contextualized for West African markets and cultural practices',
      'north_africa': 'Tailored for North African business environment',
      'southern_africa': 'Optimized for Southern African economic conditions',
      'central_africa': 'Designed for Central African development context'
    };
    
    return contexts[region as keyof typeof contexts] || 'Global context';
  }

  private calculateRevenueShare(creatorType: CreatorType): number {
    const shares = {
      [CreatorType.COMMUNITY_CREATOR]: 10,
      [CreatorType.CERTIFIED_CONTRIBUTOR]: 20,
      [CreatorType.EXPERT_CONTRIBUTOR]: 30,
      [CreatorType.INSTITUTIONAL_PARTNER]: 40
    };
    return shares[creatorType];
  }

  private async updateGenerationRequest(request: AIGenerationRequest): Promise<void> {
    const query = `
      UPDATE ai_generation_requests 
      SET status = $1, completed_at = $2, generated_course_id = $3, quality_score = $4
      WHERE id = $5
    `;
    
    await this.pool.query(query, [
      request.status, request.completedAt, request.generatedCourseId, 
      request.qualityScore, request.id
    ]);
  }

  private async storeQualityMetrics(courseId: string, metrics: QualityMetrics): Promise<void> {
    const query = `
      INSERT INTO quality_metrics (
        id, course_id, accuracy_score, educational_value_score, engagement_score,
        cultural_fit_score, technical_quality_score, overall_score, reviewed_by,
        reviewed_at, feedback, approved
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `;
    
    await this.pool.query(query, [
      metrics.id, courseId, metrics.accuracyScore, metrics.educationalValueScore,
      metrics.engagementScore, metrics.culturalFitScore, metrics.technicalQualityScore,
      metrics.overallScore, metrics.reviewedBy, metrics.reviewedAt,
      metrics.feedback, metrics.approved
    ]);
  }

  // User Progress Management
  async enrollUser(userId: string, courseId: string): Promise<UserProgress> {
    const existingProgress = await this.getUserProgress(userId, courseId);
    if (existingProgress) {
      return existingProgress;
    }

    const progress: UserProgress = {
      id: uuidv4(),
      userId,
      courseId,
      enrolledAt: new Date(),
      lastAccessedAt: new Date(),
      completedContent: [],
      currentContent: '',
      progress: 0,
      timeSpent: 0,
      assessmentAttempts: [],
      isCompleted: false
    };

    const query = `
      INSERT INTO user_progress (
        id, user_id, course_id, enrolled_at, last_accessed_at,
        completed_content, current_content, progress, time_spent,
        assessment_attempts, is_completed
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
      progress.id, progress.userId, progress.courseId, progress.enrolledAt,
      progress.lastAccessedAt, JSON.stringify(progress.completedContent),
      progress.currentContent, progress.progress, progress.timeSpent,
      JSON.stringify(progress.assessmentAttempts), progress.isCompleted
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async updateProgress(userId: string, courseId: string, contentId: string, timeSpent: number): Promise<UserProgress> {
    const progress = await this.getUserProgress(userId, courseId);
    if (!progress) {
      throw new Error('User not enrolled in course');
    }

    // Update completed content
    if (!progress.completedContent.includes(contentId)) {
      progress.completedContent.push(contentId);
    }

    // Update current content and time spent
    progress.currentContent = contentId;
    progress.timeSpent += timeSpent;
    progress.lastAccessedAt = new Date();

    // Calculate progress percentage
    const course = await this.getCourse(courseId);
    const totalContent = course.content.length;
    progress.progress = (progress.completedContent.length / totalContent) * 100;

    // Check if course is completed
    if (progress.progress >= 100) {
      progress.isCompleted = true;
      progress.completedAt = new Date();
      await this.issueCertificate(userId, courseId);
    }

    const query = `
      UPDATE user_progress 
      SET completed_content = $1, current_content = $2, progress = $3,
          time_spent = $4, last_accessed_at = $5, is_completed = $6,
          completed_at = $7
      WHERE user_id = $8 AND course_id = $9
      RETURNING *
    `;

    const values = [
      JSON.stringify(progress.completedContent), progress.currentContent,
      progress.progress, progress.timeSpent, progress.lastAccessedAt,
      progress.isCompleted, progress.completedAt, userId, courseId
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getUserProgress(userId: string, courseId: string): Promise<UserProgress | null> {
    const query = `
      SELECT * FROM user_progress WHERE user_id = $1 AND course_id = $2
    `;
    const result = await this.pool.query(query, [userId, courseId]);
    return result.rows[0] || null;
  }

  async getCourse(courseId: string): Promise<Course> {
    const query = 'SELECT * FROM courses WHERE id = $1';
    const result = await this.pool.query(query, [courseId]);
    return result.rows[0];
  }

  private async issueCertificate(userId: string, courseId: string): Promise<Certificate> {
    const certificate: Certificate = {
      id: uuidv4(),
      userId,
      courseId,
      type: CertificateType.COMPLETION,
      issuedAt: new Date(),
      verificationCode: this.generateVerificationCode(),
      credentialLevel: CredentialLevel.BASIC,
      skills: await this.getCourseSkills(courseId),
      issuerId: 'people-power-university',
      blockchainVerified: false
    };

    const query = `
      INSERT INTO certificates (
        id, user_id, course_id, type, issued_at, verification_code,
        credential_level, skills, issuer_id, blockchain_verified
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;

    const values = [
      certificate.id, certificate.userId, certificate.courseId,
      certificate.type, certificate.issuedAt, certificate.verificationCode,
      certificate.credentialLevel, JSON.stringify(certificate.skills),
      certificate.issuerId, certificate.blockchainVerified
    ];

    await this.pool.query(query, values);
    return certificate;
  }

  private generateVerificationCode(): string {
    return Math.random().toString(36).substring(2, 15).toUpperCase();
  }

  private async getCourseSkills(courseId: string): Promise<string[]> {
    const course = await this.getCourse(courseId);
    return course.learningObjectives;
  }

  // Course Discovery and Recommendation
  async searchCourses(query: string, filters: {
    faculty?: Faculty;
    level?: CourseLevel;
    language?: string;
    region?: string;
    duration?: { min?: number; max?: number };
    tags?: string[];
  } = {}): Promise<Course[]> {
    let sql = `
      SELECT * FROM courses 
      WHERE status = $1 AND (title ILIKE $2 OR description ILIKE $2)
    `;
    const params: any[] = [CourseStatus.PUBLISHED, `%${query}%`];
    let paramIndex = 3;

    if (filters.faculty) {
      sql += ` AND faculty = $${paramIndex++}`;
      params.push(filters.faculty);
    }

    if (filters.level) {
      sql += ` AND level = $${paramIndex++}`;
      params.push(filters.level);
    }

    if (filters.language) {
      sql += ` AND language = $${paramIndex++}`;
      params.push(filters.language);
    }

    if (filters.region) {
      sql += ` AND region = $${paramIndex++}`;
      params.push(filters.region);
    }

    if (filters.duration) {
      if (filters.duration.min) {
        sql += ` AND duration >= $${paramIndex++}`;
        params.push(filters.duration.min);
      }
      if (filters.duration.max) {
        sql += ` AND duration <= $${paramIndex++}`;
        params.push(filters.duration.max);
      }
    }

    if (filters.tags && filters.tags.length > 0) {
      sql += ` AND tags && $${paramIndex++}`;
      params.push(filters.tags);
    }

    sql += ` ORDER BY quality_score DESC, average_rating DESC LIMIT 50`;

    const result = await this.pool.query(sql, params);
    return result.rows;
  }

  async getRecommendedCourses(userId: string, limit: number = 10): Promise<Course[]> {
    // Get user's learning history and preferences
    const userHistory = await this.getUserLearningHistory(userId);
    const userSkills = await this.getUserSkills(userId);
    
    // Generate recommendations based on:
    // 1. Completed courses in same faculty
    // 2. Skill gaps
    // 3. Similar user preferences
    // 4. Popular courses in user's region
    
    const query = `
      SELECT DISTINCT c.* FROM courses c
      LEFT JOIN user_progress up ON c.id = up.course_id AND up.user_id = $1
      WHERE c.status = $2 
        AND up.id IS NULL
        AND c.faculty IN (SELECT faculty FROM user_progress up2 
                         JOIN courses c2 ON up2.course_id = c2.id 
                         WHERE up2.user_id = $1 AND up2.is_completed = true)
      ORDER BY c.quality_score DESC, c.average_rating DESC
      LIMIT $3
    `;

    const result = await this.pool.query(query, [userId, CourseStatus.PUBLISHED, limit]);
    return result.rows;
  }

  private async getUserLearningHistory(userId: string): Promise<any[]> {
    const query = `
      SELECT up.*, c.faculty, c.level FROM user_progress up
      JOIN courses c ON up.course_id = c.id
      WHERE up.user_id = $1
      ORDER BY up.enrolled_at DESC
    `;
    const result = await this.pool.query(query, [userId]);
    return result.rows;
  }

  private async getUserSkills(userId: string): Promise<string[]> {
    const query = `
      SELECT DISTINCT unnest(skills) as skill FROM certificates
      WHERE user_id = $1
    `;
    const result = await this.pool.query(query, [userId]);
    return result.rows.map(row => row.skill);
  }

  // Analytics and Reporting
  async getCourseAnalytics(courseId: string): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as total_enrollments,
        COUNT(CASE WHEN is_completed = true THEN 1 END) as completions,
        AVG(progress) as average_progress,
        AVG(time_spent) as average_time_spent,
        COUNT(CASE WHEN last_accessed_at > NOW() - INTERVAL '7 days' THEN 1 END) as active_users
      FROM user_progress 
      WHERE course_id = $1
    `;
    
    const result = await this.pool.query(query, [courseId]);
    return result.rows[0];
  }

  async getFacultyAnalytics(): Promise<any> {
    const query = `
      SELECT 
        faculty,
        COUNT(*) as course_count,
        AVG(quality_score) as avg_quality,
        AVG(average_rating) as avg_rating,
        SUM(enrollment_count) as total_enrollments
      FROM courses
      WHERE status = $1
      GROUP BY faculty
      ORDER BY total_enrollments DESC
    `;
    
    const result = await this.pool.query(query, [CourseStatus.PUBLISHED]);
    return result.rows;
  }

  // Batch Operations for Scaling
  async batchGenerateCourses(requests: AIGenerationRequest[]): Promise<Course[]> {
    const courses: Course[] = [];
    
    for (const request of requests) {
      try {
        const course = await this.generateCourseWithAI(request);
        courses.push(course);
      } catch (error) {
        console.error(`Failed to generate course for request ${request.id}:`, error);
      }
    }
    
    return courses;
  }

  async batchAdaptCourses(courseIds: string[], targetRegion: string, targetLanguage: string): Promise<Course[]> {
    const adaptedCourses: Course[] = [];
    
    for (const courseId of courseIds) {
      const originalCourse = await this.getCourse(courseId);
      const adaptedCourse = await this.adaptCourseForRegion(originalCourse, targetRegion, targetLanguage);
      const newCourse = await this.createCourse(adaptedCourse, 'regional-adaptation-system');
      adaptedCourses.push(newCourse);
    }
    
    return adaptedCourses;
  }

  // Quality Control and Community Review
  async submitForPeerReview(courseId: string, reviewerId: string): Promise<void> {
    const query = `
      INSERT INTO peer_reviews (id, course_id, reviewer_id, status, created_at)
      VALUES ($1, $2, $3, $4, $5)
    `;
    
    await this.pool.query(query, [uuidv4(), courseId, reviewerId, 'pending', new Date()]);
  }

  async submitPeerReview(courseId: string, reviewerId: string, review: {
    rating: number;
    feedback: string;
    recommendations: string[];
  }): Promise<void> {
    const query = `
      UPDATE peer_reviews 
      SET rating = $1, feedback = $2, recommendations = $3, 
          status = $4, reviewed_at = $5
      WHERE course_id = $6 AND reviewer_id = $7
    `;
    
    await this.pool.query(query, [
      review.rating, review.feedback, JSON.stringify(review.recommendations),
      'completed', new Date(), courseId, reviewerId
    ]);
    
    // Update course average rating
    await this.updateCourseRating(courseId);
  }

  private async updateCourseRating(courseId: string): Promise<void> {
    const query = `
      UPDATE courses 
      SET average_rating = (
        SELECT AVG(rating) FROM peer_reviews 
        WHERE course_id = $1 AND status = 'completed'
      )
      WHERE id = $2
    `;
    
    await this.pool.query(query, [courseId, courseId]);
  }
}

export default EducationService;
