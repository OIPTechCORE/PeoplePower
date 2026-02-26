import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { 
  AIGenerationRequest, 
  Course, 
  CourseContent, 
  Assessment, 
  Question,
  Faculty,
  CourseLevel,
  ContentType,
  AssessmentType,
  QuestionType,
  GenerationStatus
} from './educationService';

// AI Generation Service for scaling to 100M+ courses
export class AIGenerationService {
  private pool: Pool;
  private generationQueue: AIGenerationRequest[] = [];
  private isProcessing = false;
  private maxConcurrentGenerations = 10;
  private currentGenerations = 0;

  constructor(pool: Pool) {
    this.pool = pool;
    this.startProcessingQueue();
  }

  // Main AI Generation Pipeline
  async generateCourse(request: AIGenerationRequest): Promise<Course> {
    console.log(`Starting AI course generation for: ${request.topic}`);
    
    try {
      // Step 1: Validate request
      await this.validateGenerationRequest(request);
      
      // Step 2: Generate course structure
      const courseStructure = await this.generateCourseStructure(request);
      
      // Step 3: Generate content for each module
      const content = await this.generateCourseContent(courseStructure, request);
      
      // Step 4: Generate assessments
      const assessments = await this.generateAssessments(courseStructure, request);
      
      // Step 5: Apply cultural adaptation
      const adaptedContent = await this.applyCulturalAdaptation(content, request);
      
      // Step 6: Quality assessment
      const qualityScore = await this.assessContentQuality(adaptedContent, request);
      
      // Step 7: Create course object
      const course = this.assembleCourse(courseStructure, adaptedContent, assessments, request, qualityScore);
      
      console.log(`AI course generation completed: ${course.id}`);
      return course;
      
    } catch (error) {
      console.error(`AI course generation failed for ${request.topic}:`, error);
      throw error;
    }
  }

  // Batch Generation for Scaling
  async batchGenerateCourses(requests: AIGenerationRequest[]): Promise<Course[]> {
    console.log(`Starting batch AI course generation: ${requests.length} requests`);
    
    const courses: Course[] = [];
    const batchSize = 50; // Process in batches to manage resources
    
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      const batchPromises = batch.map(request => this.generateCourse(request));
      
      try {
        const batchResults = await Promise.allSettled(batchPromises);
        
        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            courses.push(result.value);
          } else {
            console.error(`Batch generation failed for request ${batch[index].id}:`, result.reason);
          }
        });
        
        // Add delay between batches to manage API limits
        if (i + batchSize < requests.length) {
          await this.delay(1000); // 1 second delay
        }
        
      } catch (error) {
        console.error(`Batch generation error:`, error);
      }
    }
    
    console.log(`Batch AI course generation completed: ${courses.length}/${requests.length} successful`);
    return courses;
  }

  // Queue Management
  private async startProcessingQueue(): Promise<void> {
    setInterval(async () => {
      if (!this.isProcessing && this.generationQueue.length > 0 && this.currentGenerations < this.maxConcurrentGenerations) {
        this.isProcessing = true;
        await this.processQueue();
        this.isProcessing = false;
      }
    }, 5000); // Check every 5 seconds
  }

  private async processQueue(): Promise<void> {
    while (this.generationQueue.length > 0 && this.currentGenerations < this.maxConcurrentGenerations) {
      const request = this.generationQueue.shift();
      if (request) {
        this.currentGenerations++;
        
        // Process generation in background
        this.generateCourse(request)
          .then(() => {
            console.log(`Queue processing completed for request: ${request.id}`);
          })
          .catch(error => {
            console.error(`Queue processing failed for request ${request.id}:`, error);
          })
          .finally(() => {
            this.currentGenerations--;
          });
      }
    }
  }

  async addToQueue(request: AIGenerationRequest): Promise<void> {
    // Set priority based on creator tier and request type
    request.processingPriority = this.calculatePriority(request);
    
    // Insert into queue maintaining priority order
    const insertIndex = this.generationQueue.findIndex(
      item => item.processingPriority! < request.processingPriority!
    );
    
    if (insertIndex === -1) {
      this.generationQueue.push(request);
    } else {
      this.generationQueue.splice(insertIndex, 0, request);
    }
    
    // Save to database
    await this.saveGenerationRequest(request);
  }

  private calculatePriority(request: AIGenerationRequest): number {
    let priority = 5; // Base priority
    
    // Higher priority for advanced levels
    const levelPriority = {
      [CourseLevel.BEGINNER]: 3,
      [CourseLevel.INTERMEDIATE]: 5,
      [CourseLevel.ADVANCED]: 7,
      [CourseLevel.EXPERT]: 9,
      [CourseLevel.PROFESSIONAL]: 10
    };
    priority = levelPriority[request.level] || 5;
    
    // Higher priority for in-demand faculties
    const facultyPriority = {
      [Faculty.DIGITAL_ENTREPRENEURSHIP]: 9,
      [Faculty.TECHNOLOGY_AI_LITERACY]: 8,
      [Faculty.LEADERSHIP_GOVERNANCE]: 7,
      [Faculty.CREATIVE_ARTS_MEDIA]: 6,
      [Faculty.CIVIC_COMMUNITY_DEVELOPMENT]: 5
    };
    priority = Math.max(priority, facultyPriority[request.faculty] || 5);
    
    return priority;
  }

  // Course Structure Generation
  private async generateCourseStructure(request: AIGenerationRequest): Promise<any> {
    const moduleCount = Math.ceil(request.duration / 10); // 10-minute modules
    const structure = {
      title: this.generateCourseTitle(request),
      description: this.generateCourseDescription(request),
      modules: [],
      learningObjectives: request.learningObjectives || this.generateLearningObjectives(request),
      prerequisites: this.generatePrerequisites(request),
      tags: this.generateTags(request)
    };

    // Generate module structure
    for (let i = 0; i < moduleCount; i++) {
      structure.modules.push({
        id: uuidv4(),
        order: i + 1,
        title: this.generateModuleTitle(request.topic, i, request.level),
        type: this.getModuleType(i, request.level),
        duration: 10,
        learningOutcomes: this.generateModuleLearningOutcomes(request.topic, i)
      });
    }

    return structure;
  }

  private generateCourseTitle(request: AIGenerationRequest): string {
    const templates = {
      [CourseLevel.BEGINNER]: `Introduction to ${request.topic}`,
      [CourseLevel.INTERMEDIATE]: `Advanced ${request.topic}: Skills Development`,
      [CourseLevel.ADVANCED]: `Mastering ${request.topic}: Professional Techniques`,
      [CourseLevel.EXPERT]: `${request.topic}: Expert-Level Strategies`,
      [CourseLevel.PROFESSIONAL]: `Professional ${request.topic}: Industry Applications`
    };
    
    return templates[request.level] || `Complete Guide to ${request.topic}`;
  }

  private generateCourseDescription(request: AIGenerationRequest): string {
    const levelDescriptions = {
      [CourseLevel.BEGINNER]: `A comprehensive introduction to ${request.topic} designed for beginners. Learn fundamental concepts and practical applications.`,
      [CourseLevel.INTERMEDIATE]: `Build on your existing knowledge with this intermediate ${request.topic} course. Develop advanced skills and techniques.`,
      [CourseLevel.ADVANCED]: `Master complex ${request.topic} concepts with this advanced course. Perfect for experienced learners seeking professional expertise.`,
      [CourseLevel.EXPERT]: `Expert-level ${request.topic} training for professionals. Learn cutting-edge techniques and industry best practices.`,
      [CourseLevel.PROFESSIONAL]: `Professional ${request.topic} certification course. Gain industry-recognized skills and credentials.`
    };
    
    let description = levelDescriptions[request.level] || '';
    
    // Add cultural context
    if (request.culturalContext && request.culturalContext !== 'general') {
      description += ` Content is specifically adapted for ${request.culturalContext} contexts and examples.`;
    }
    
    // Add regional information
    if (request.region && request.region !== 'global') {
      description += ` Includes region-specific case studies and applications relevant to ${request.region}.`;
    }
    
    return description;
  }

  private generateLearningObjectives(request: AIGenerationRequest): string[] {
    const baseObjectives = [
      `Understand fundamental concepts of ${request.topic}`,
      `Apply ${request.topic} principles in practical scenarios`,
      `Analyze problems related to ${request.topic}`,
      `Create solutions using ${request.topic} techniques`
    ];

    // Add level-specific objectives
    if (request.level === CourseLevel.ADVANCED || request.level === CourseLevel.EXPERT) {
      baseObjectives.push(
        `Evaluate advanced ${request.topic} strategies`,
        `Design complex ${request.topic} systems`,
        `Lead ${request.topic} initiatives and projects`
      );
    }

    if (request.level === CourseLevel.PROFESSIONAL) {
      baseObjectives.push(
        `Implement industry-standard ${request.topic} practices`,
        `Manage ${request.topic} projects and teams`,
        `Innovate in ${request.topic} applications`
      );
    }

    return baseObjectives;
  }

  private generatePrerequisites(request: AIGenerationRequest): string[] {
    if (request.level === CourseLevel.BEGINNER) {
      return []; // No prerequisites for beginners
    }

    const commonPrereqs = [
      'Basic computer literacy',
      'Internet navigation skills',
      'Critical thinking ability'
    ];

    if (request.faculty === Faculty.TECHNOLOGY_AI_LITERACY) {
      commonPrereqs.push('Basic programming concepts');
    }

    if (request.faculty === Faculty.DIGITAL_ENTREPRENEURSHIP) {
      commonPrereqs.push('Business fundamentals');
    }

    return commonPrereqs;
  }

  private generateTags(request: AIGenerationRequest): string[] {
    const tags = [
      request.topic.toLowerCase(),
      request.faculty,
      request.level,
      request.language,
      request.region
    ];

    // Add related keywords
    const keywords = this.extractKeywords(request.topic);
    tags.push(...keywords);

    // Add faculty-specific tags
    const facultyTags = {
      [Faculty.LEADERSHIP_GOVERNANCE]: ['leadership', 'management', 'governance', 'civic'],
      [Faculty.DIGITAL_ENTREPRENEURSHIP]: ['business', 'entrepreneurship', 'startup', 'innovation'],
      [Faculty.TECHNOLOGY_AI_LITERACY]: ['technology', 'AI', 'digital', 'coding'],
      [Faculty.CREATIVE_ARTS_MEDIA]: ['creative', 'arts', 'media', 'design'],
      [Faculty.CIVIC_COMMUNITY_DEVELOPMENT]: ['community', 'development', 'social', 'civic']
    };

    if (facultyTags[request.faculty]) {
      tags.push(...facultyTags[request.faculty]);
    }

    return [...new Set(tags)]; // Remove duplicates
  }

  private extractKeywords(topic: string): string[] {
    // Simple keyword extraction - in production, use NLP
    return topic
      .toLowerCase()
      .split(' ')
      .filter(word => word.length > 3)
      .slice(0, 5); // Limit to 5 keywords
  }

  private generateModuleTitle(topic: string, index: number, level: CourseLevel): string {
    const templates = {
      0: 'Introduction to Concepts',
      1: 'Core Principles',
      2: 'Practical Applications',
      3: 'Advanced Techniques',
      4: 'Case Studies',
      5: 'Best Practices',
      6: 'Common Challenges',
      7: 'Future Trends',
      8: 'Industry Applications',
      9: 'Professional Development'
    };

    const baseTitle = templates[index % Object.keys(templates).length] || 'Advanced Topics';
    return `Module ${index + 1}: ${baseTitle}`;
  }

  private getModuleType(index: number, level: CourseLevel): ContentType {
    if (index === 0) return ContentType.TEXT; // Introduction
    if (index % 3 === 1) return ContentType.VIDEO; // Video every 3rd module
    if (index % 3 === 2) return ContentType.INTERACTIVE; // Interactive every 3rd module
    return ContentType.TEXT; // Default to text
  }

  private generateModuleLearningOutcomes(topic: string, index: number): string[] {
    return [
      `Understand key concepts in module ${index + 1}`,
      `Apply ${topic} techniques from this module`,
      `Complete practical exercises successfully`
    ];
  }

  // Content Generation
  private async generateCourseContent(structure: any, request: AIGenerationRequest): Promise<CourseContent[]> {
    const content: CourseContent[] = [];

    for (const module of structure.modules) {
      const moduleContent = await this.generateModuleContent(module, request);
      content.push(moduleContent);
    }

    return content;
  }

  private async generateModuleContent(module: any, request: AIGenerationRequest): Promise<CourseContent> {
    const content = await this.callAIContentGeneration(module, request);
    
    return {
      id: module.id,
      type: module.type,
      title: module.title,
      content: content.text,
      duration: module.duration,
      order: module.order,
      learningOutcomes: module.learningOutcomes,
      interactiveElements: content.interactiveElements || [],
      mediaUrl: content.mediaUrl
    };
  }

  private async callAIContentGeneration(module: any, request: AIGenerationRequest): Promise<any> {
    // Simulate AI content generation - in production, call actual AI API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          text: this.generateModuleText(module, request),
          interactiveElements: this.generateInteractiveElements(module),
          mediaUrl: module.type === ContentType.VIDEO ? `https://cdn.example.com/videos/${module.id}.mp4` : undefined
        });
      }, 1000);
    });
  }

  private generateModuleText(module: any, request: AIGenerationRequest): string {
    const complexity = this.getComplexityLevel(request.level);
    
    return `
      <h2>${module.title}</h2>
      <p>This ${complexity} module covers essential concepts related to ${request.topic}.</p>
      
      <h3>Learning Objectives</h3>
      <ul>
        ${module.learningOutcomes.map(outcome => `<li>${outcome}</li>`).join('')}
      </ul>
      
      <div class="content-section">
        <h3>Core Concepts</h3>
        <p>Comprehensive explanation of ${request.topic} concepts at ${request.level} level.</p>
        
        <h3>Practical Examples</h3>
        <p>Real-world applications and case studies relevant to ${request.region || 'global'} contexts.</p>
        
        <h3>Hands-on Exercise</h3>
        <p>Interactive exercise to apply learned concepts in practical scenarios.</p>
      </div>
      
      <div class="cultural-context">
        <h3>Regional Context</h3>
        <p>This content is adapted for ${request.culturalContext || 'general'} cultural contexts with relevant examples.</p>
      </div>
    `;
  }

  private getComplexityLevel(level: CourseLevel): string {
    const complexityMap = {
      [CourseLevel.BEGINNER]: 'foundational',
      [CourseLevel.INTERMEDIATE]: 'intermediate',
      [CourseLevel.ADVANCED]: 'advanced',
      [CourseLevel.EXPERT]: 'expert-level',
      [CourseLevel.PROFESSIONAL]: 'professional'
    };
    return complexityMap[level] || 'intermediate';
  }

  private generateInteractiveElements(module: any): any[] {
    return [
      {
        id: uuidv4(),
        type: 'quiz',
        title: 'Knowledge Check',
        content: 'Test your understanding of the concepts covered in this module.',
        required: true,
        points: 10
      },
      {
        id: uuidv4(),
        type: 'reflection',
        title: 'Personal Reflection',
        content: 'Reflect on how you can apply these concepts in your context.',
        required: false,
        points: 5
      }
    ];
  }

  // Assessment Generation
  private async generateAssessments(structure: any, request: AIGenerationRequest): Promise<Assessment[]> {
    const assessments: Assessment[] = [];

    // Main course assessment
    const mainAssessment = await this.generateMainAssessment(structure, request);
    assessments.push(mainAssessment);

    // Module quizzes for intermediate+ levels
    if (request.level !== CourseLevel.BEGINNER) {
      for (let i = 0; i < structure.modules.length; i += 2) { // Every 2 modules
        const moduleQuiz = await this.generateModuleQuiz(structure.modules[i], request);
        assessments.push(moduleQuiz);
      }
    }

    return assessments;
  }

  private async generateMainAssessment(structure: any, request: AIGenerationRequest): Promise<Assessment> {
    const questionCount = this.getQuestionCount(request.level);
    const questions = [];

    for (let i = 0; i < questionCount; i++) {
      questions.push(await this.generateQuestion(request.topic, request.level, i));
    }

    return {
      id: uuidv4(),
      type: AssessmentType.QUIZ,
      questions,
      passingScore: 70,
      timeLimit: this.getTimeLimit(request.level),
      maxAttempts: 3,
      isGraded: true
    };
  }

  private async generateModuleQuiz(module: any, request: AIGenerationRequest): Promise<Assessment> {
    const questions = [
      await this.generateQuestion(module.title, CourseLevel.BEGINNER, 0),
      await this.generateQuestion(module.title, CourseLevel.BEGINNER, 1)
    ];

    return {
      id: uuidv4(),
      type: AssessmentType.QUIZ,
      questions,
      passingScore: 80,
      timeLimit: 15,
      maxAttempts: 2,
      isGraded: false
    };
  }

  private async generateQuestion(topic: string, level: CourseLevel, index: number): Promise<Question> {
    const questionTypes = [
      QuestionType.MULTIPLE_CHOICE,
      QuestionType.TRUE_FALSE,
      QuestionType.SHORT_ANSWER
    ];

    const selectedType = questionTypes[index % questionTypes.length];

    switch (selectedType) {
      case QuestionType.MULTIPLE_CHOICE:
        return this.generateMultipleChoiceQuestion(topic, level);
      case QuestionType.TRUE_FALSE:
        return this.generateTrueFalseQuestion(topic, level);
      case QuestionType.SHORT_ANSWER:
        return this.generateShortAnswerQuestion(topic, level);
      default:
        return this.generateMultipleChoiceQuestion(topic, level);
    }
  }

  private generateMultipleChoiceQuestion(topic: string, level: CourseLevel): Question {
    const difficulty = this.getQuestionDifficulty(level);
    
    return {
      id: uuidv4(),
      type: QuestionType.MULTIPLE_CHOICE,
      question: `What is the most important aspect of ${topic} in professional contexts?`,
      options: [
        'Strategic planning and execution',
        'Technical implementation details',
        'Team collaboration and communication',
        'Resource management and optimization'
      ],
      correctAnswer: 'Strategic planning and execution',
      explanation: `Strategic planning is crucial for success in ${topic} at professional levels.`,
      points: 20,
      difficulty
    };
  }

  private generateTrueFalseQuestion(topic: string, level: CourseLevel): Question {
    const difficulty = this.getQuestionDifficulty(level);
    
    return {
      id: uuidv4(),
      type: QuestionType.TRUE_FALSE,
      question: `${topic} requires both theoretical knowledge and practical application for success.`,
      correctAnswer: 'true',
      explanation: `${topic} indeed combines theoretical understanding with practical skills.`,
      points: 10,
      difficulty
    };
  }

  private generateShortAnswerQuestion(topic: string, level: CourseLevel): Question {
    const difficulty = this.getQuestionDifficulty(level);
    
    return {
      id: uuidv4(),
      type: QuestionType.SHORT_ANSWER,
      question: `Briefly explain how ${topic} can be applied in your local context.`,
      correctAnswer: 'Answers should demonstrate understanding of practical applications',
      explanation: 'This question assesses practical application skills.',
      points: 30,
      difficulty
    };
  }

  private getQuestionCount(level: CourseLevel): number {
    const counts = {
      [CourseLevel.BEGINNER]: 5,
      [CourseLevel.INTERMEDIATE]: 8,
      [CourseLevel.ADVANCED]: 12,
      [CourseLevel.EXPERT]: 15,
      [CourseLevel.PROFESSIONAL]: 20
    };
    return counts[level] || 10;
  }

  private getTimeLimit(level: CourseLevel): number {
    const limits = {
      [CourseLevel.BEGINNER]: 30,
      [CourseLevel.INTERMEDIATE]: 45,
      [CourseLevel.ADVANCED]: 60,
      [CourseLevel.EXPERT]: 90,
      [CourseLevel.PROFESSIONAL]: 120
    };
    return limits[level] || 60;
  }

  private getQuestionDifficulty(level: CourseLevel): number {
    const difficulties = {
      [CourseLevel.BEGINNER]: 3,
      [CourseLevel.INTERMEDIATE]: 5,
      [CourseLevel.ADVANCED]: 7,
      [CourseLevel.EXPERT]: 9,
      [CourseLevel.PROFESSIONAL]: 10
    };
    return difficulties[level] || 5;
  }

  // Cultural Adaptation
  private async applyCulturalAdaptation(content: CourseContent[], request: AIGenerationRequest): Promise<CourseContent[]> {
    if (request.region === 'global' && request.culturalContext === 'general') {
      return content; // No adaptation needed
    }

    return content.map(item => ({
      ...item,
      content: this.adaptContentForRegion(item.content, request),
      title: this.adaptTitleForRegion(item.title, request)
    }));
  }

  private adaptContentForRegion(content: string, request: AIGenerationRequest): string {
    const regionExamples = {
      'east_africa': [
        'For example, Kenya\'s mobile money ecosystem shows...',
        'In Uganda\'s startup scene...',
        'Tanzania\'s agricultural innovation demonstrates...'
      ],
      'west_africa': [
        'Nigeria\'s entertainment industry illustrates...',
        'Ghana\'s fintech innovation shows...',
        'Senegal\'s cultural preservation efforts...'
      ],
      'north_africa': [
        'Egypt\'s startup ecosystem demonstrates...',
        'Morocco\'s renewable energy initiatives...',
        'Tunisia\'s digital transformation...'
      ],
      'southern_africa': [
        'South Africa\'s mining sector shows...',
        'Botswana\'s tourism innovation...',
        'Zimbabwe\'s agricultural technology...'
      ],
      'central_africa': [
        'The DRC\'s natural resources sector...',
        'Cameroon\'s digital innovation...',
        'Gabon\'s environmental conservation...'
      ]
    };

    const examples = regionExamples[request.region as keyof typeof regionExamples] || [];
    const randomExample = examples[Math.floor(Math.random() * examples.length)];

    return content.replace(/<p>/g, `<p>${randomExample} `);
  }

  private adaptTitleForRegion(title: string, request: AIGenerationRequest): string {
    // Add regional context to titles if needed
    if (request.region !== 'global') {
      return `${title} (${request.region.replace(/_/g, ' ').toUpperCase()} Context)`;
    }
    return title;
  }

  // Quality Assessment
  private async assessContentQuality(content: CourseContent[], request: AIGenerationRequest): Promise<number> {
    // Simulate quality assessment - in production, use AI models
    const metrics = {
      accuracy: Math.random() * 15 + 85, // 85-100
      educationalValue: Math.random() * 10 + 90, // 90-100
      engagement: Math.random() * 20 + 80, // 80-100
      culturalFit: Math.random() * 15 + 85, // 85-100
      technicalQuality: Math.random() * 5 + 95 // 95-100
    };

    const overallScore = (
      metrics.accuracy * 0.3 +
      metrics.educationalValue * 0.3 +
      metrics.engagement * 0.2 +
      metrics.culturalFit * 0.1 +
      metrics.technicalQuality * 0.1
    );

    return Math.round(overallScore);
  }

  // Course Assembly
  private assembleCourse(
    structure: any,
    content: CourseContent[],
    assessments: Assessment[],
    request: AIGenerationRequest,
    qualityScore: number
  ): Course {
    return {
      id: uuidv4(),
      title: structure.title,
      description: structure.description,
      faculty: request.faculty,
      level: request.level,
      duration: request.duration,
      difficulty: this.calculateDifficulty(request.level),
      tags: structure.tags,
      learningObjectives: structure.learningObjectives,
      prerequisites: structure.prerequisites,
      content,
      assessments,
      creatorId: 'ai-generation-system',
      creatorType: 'institutional_partner' as any,
      status: CourseStatus.APPROVED,
      createdAt: new Date(),
      updatedAt: new Date(),
      qualityScore,
      completionRate: 0,
      averageRating: 0,
      enrollmentCount: 0,
      language: request.language,
      region: request.region,
      culturalContext: request.culturalContext,
      isAIGenerated: true,
      isCommunityCreated: false,
      revenueShare: 0 // AI-generated courses have no revenue share
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
    return difficultyMap[level] || 5;
  }

  // Utility Functions
  private async validateGenerationRequest(request: AIGenerationRequest): Promise<void> {
    if (!request.topic || request.topic.length < 3) {
      throw new Error('Topic must be at least 3 characters long');
    }

    if (!Object.values(Faculty).includes(request.faculty)) {
      throw new Error('Invalid faculty');
    }

    if (!Object.values(CourseLevel).includes(request.level)) {
      throw new Error('Invalid course level');
    }

    if (request.duration < 5 || request.duration > 300) {
      throw new Error('Duration must be between 5 and 300 minutes');
    }
  }

  private async saveGenerationRequest(request: AIGenerationRequest): Promise<void> {
    const query = `
      INSERT INTO ai_generation_requests (
        id, topic, faculty, level, duration, language, region,
        cultural_context, target_audience, learning_objectives,
        special_requirements, status, created_at, processing_priority
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    `;

    const values = [
      request.id, request.topic, request.faculty, request.level,
      request.duration, request.language, request.region,
      request.culturalContext, request.targetAudience,
      JSON.stringify(request.learningObjectives), request.specialRequirements,
      request.status, request.createdAt, request.processingPriority
    ];

    await this.pool.query(query, values);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public Methods for External Access
  async getQueueStatus(): Promise<any> {
    return {
      queueLength: this.generationQueue.length,
      currentlyProcessing: this.currentGenerations,
      maxConcurrent: this.maxConcurrentGenerations
    };
  }

  async getGenerationMetrics(): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as total_requests,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed,
        AVG(CASE WHEN status = 'completed' THEN EXTRACT(EPOCH FROM (completed_at - created_at)) END) as avg_generation_time
      FROM ai_generation_requests
      WHERE created_at > NOW() - INTERVAL '24 hours'
    `;

    const result = await this.pool.query(query);
    return result.rows[0];
  }
}

export default AIGenerationService;
