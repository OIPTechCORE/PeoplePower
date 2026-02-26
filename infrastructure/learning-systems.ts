// ========================================
// LEARNING SYSTEMS
// Analytics, assessment, and progress tracking for educational content
// ========================================

export interface LearningAnalytics {
  trackEvent(event: LearningEvent): Promise<void>;
  getAnalytics(playerId: string, timeRange?: TimeRange): Promise<PlayerAnalytics>;
  getCourseAnalytics(courseId: string): Promise<CourseAnalytics>;
  getSystemAnalytics(): Promise<SystemAnalytics>;
}

export interface SkillAssessment {
  assessSkills(playerId: string, skillArea: string): Promise<SkillAssessmentResult>;
  getSkillProgression(playerId: string): Promise<SkillProgression[]>;
  recommendSkills(playerId: string): Promise<string[]>;
  benchmarkSkills(playerId: string, peerGroup: string): Promise<SkillBenchmark>;
}

export interface ProgressTracking {
  trackProgress(playerId: string, activity: ProgressActivity): Promise<void>;
  getProgress(playerId: string): Promise<PlayerProgress>;
  getMilestones(playerId: string): Promise<Milestone[]>;
  generateReport(playerId: string, reportType: ReportType): Promise<ProgressReport>;
}

export interface LearningEvent {
  id: string;
  playerId: string;
  type: EventType;
  timestamp: Date;
  data: Record<string, any>;
  sessionId?: string;
}

export enum EventType {
  COURSE_STARTED = 'course_started',
  COURSE_COMPLETED = 'course_completed',
  MODULE_COMPLETED = 'module_completed',
  CHALLENGE_STARTED = 'challenge_started',
  CHALLENGE_COMPLETED = 'challenge_completed',
  QUEST_STARTED = 'quest_started',
  QUEST_COMPLETED = 'quest_completed',
  SKILL_ACQUIRED = 'skill_acquired',
  ASSESSMENT_TAKEN = 'assessment_taken',
  MILESTONE_REACHED = 'milestone_reached'
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface PlayerAnalytics {
  playerId: string;
  totalLearningTime: number;
  coursesCompleted: number;
  challengesCompleted: number;
  questsCompleted: number;
  skillsAcquired: string[];
  averageScore: number;
  engagementMetrics: EngagementMetrics;
  learningPath: LearningPathItem[];
}

export interface EngagementMetrics {
  dailyActiveTime: number;
  weeklyActiveTime: number;
  streakDays: number;
  lastActivity: Date;
  sessionFrequency: number;
  averageSessionDuration: number;
}

export interface LearningPathItem {
  type: 'course' | 'challenge' | 'quest';
  id: string;
  title: string;
  completedAt: Date;
  score?: number;
  timeSpent: number;
}

export interface CourseAnalytics {
  courseId: string;
  totalEnrollments: number;
  completionRate: number;
  averageTimeToComplete: number;
  averageScore: number;
  dropOffPoints: number[];
  playerFeedback: CourseFeedback[];
}

export interface CourseFeedback {
  playerId: string;
  rating: number;
  comment: string;
  timestamp: Date;
}

export interface SystemAnalytics {
  totalPlayers: number;
  activePlayers: number;
  totalCourses: number;
  totalChallenges: number;
  totalQuests: number;
  averageEngagement: number;
  popularContent: PopularContent[];
  skillDistribution: Record<string, number>;
}

export interface PopularContent {
  type: 'course' | 'challenge' | 'quest';
  id: string;
  title: string;
  enrollmentCount: number;
  completionRate: number;
}

export interface SkillAssessmentResult {
  playerId: string;
  skillArea: string;
  currentLevel: number;
  maxLevel: number;
  progress: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  assessedAt: Date;
}

export interface SkillProgression {
  skill: string;
  levels: SkillLevel[];
  currentLevel: number;
  totalProgress: number;
}

export interface SkillLevel {
  level: number;
  name: string;
  description: string;
  requirements: string[];
  achievedAt?: Date;
  progress: number;
}

export interface SkillBenchmark {
  playerId: string;
  skill: string;
  playerLevel: number;
  peerAverage: number;
  peerMedian: number;
  percentile: number;
  rank: number;
  totalPeers: number;
}

export interface ProgressActivity {
  playerId: string;
  activityType: string;
  activityId: string;
  progress: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface PlayerProgress {
  playerId: string;
  overallProgress: number;
  activities: ActivityProgress[];
  achievements: Achievement[];
  milestones: Milestone[];
  nextMilestones: Milestone[];
  timeSpent: number;
  lastUpdated: Date;
}

export interface ActivityProgress {
  activityId: string;
  activityType: string;
  title: string;
  progress: number;
  startedAt: Date;
  lastAccessed: Date;
  timeSpent: number;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  requirements: MilestoneRequirement[];
  reward: MilestoneReward;
  achievedAt?: Date;
  progress: number;
}

export interface MilestoneRequirement {
  type: string;
  target: number;
  current: number;
}

export interface MilestoneReward {
  experience: number;
  reputation: number;
  tokens: number;
  badge?: string;
}

export enum ReportType {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  CUSTOM = 'custom'
}

export interface ProgressReport {
  playerId: string;
  reportType: ReportType;
  period: TimeRange;
  summary: ReportSummary;
  detailedProgress: PlayerProgress;
  recommendations: string[];
  achievements: Achievement[];
  nextSteps: string[];
}

export interface ReportSummary {
  totalTimeSpent: number;
  activitiesCompleted: number;
  skillsImproved: string[];
  levelProgress: number;
  keyAchievements: string[];
}

// Implementation classes
export class LearningAnalyticsImpl implements LearningAnalytics {
  private events: Map<string, LearningEvent[]> = new Map();
  private playerAnalytics: Map<string, PlayerAnalytics> = new Map();

  async trackEvent(event: LearningEvent): Promise<void> {
    const playerEvents = this.events.get(event.playerId) || [];
    playerEvents.push(event);
    this.events.set(event.playerId, playerEvents);
    
    // Update player analytics
    await this.updatePlayerAnalytics(event.playerId);
  }

  async getAnalytics(playerId: string, timeRange?: TimeRange): Promise<PlayerAnalytics> {
    let analytics = this.playerAnalytics.get(playerId);
    
    if (!analytics) {
      analytics = await this.calculateAnalytics(playerId, timeRange);
      this.playerAnalytics.set(playerId, analytics);
    }
    
    return analytics;
  }

  async getCourseAnalytics(courseId: string): Promise<CourseAnalytics> {
    const events = Array.from(this.events.values())
      .flat()
      .filter(event => event.data.courseId === courseId);

    const enrollments = events.filter(e => e.type === EventType.COURSE_STARTED).length;
    const completions = events.filter(e => e.type === EventType.COURSE_COMPLETED).length;
    
    return {
      courseId,
      totalEnrollments: enrollments,
      completionRate: enrollments > 0 ? (completions / enrollments) * 100 : 0,
      averageTimeToComplete: this.calculateAverageTime(events, EventType.COURSE_STARTED, EventType.COURSE_COMPLETED),
      averageScore: this.calculateAverageScore(events),
      dropOffPoints: this.identifyDropOffPoints(events),
      playerFeedback: []
    };
  }

  async getSystemAnalytics(): Promise<SystemAnalytics> {
    const allEvents = Array.from(this.events.values()).flat();
    const uniquePlayers = new Set(allEvents.map(e => e.playerId)).size;
    
    return {
      totalPlayers: uniquePlayers,
      activePlayers: this.calculateActivePlayers(allEvents),
      totalCourses: 0, // Would be populated from course library
      totalChallenges: 0, // Would be populated from challenge library
      totalQuests: 0, // Would be populated from quest library
      averageEngagement: this.calculateAverageEngagement(allEvents),
      popularContent: this.calculatePopularContent(allEvents),
      skillDistribution: this.calculateSkillDistribution(allEvents)
    };
  }

  private async updatePlayerAnalytics(playerId: string): Promise<void> {
    const analytics = await this.calculateAnalytics(playerId);
    this.playerAnalytics.set(playerId, analytics);
  }

  private async calculateAnalytics(playerId: string, timeRange?: TimeRange): Promise<PlayerAnalytics> {
    const events = this.events.get(playerId) || [];
    const filteredEvents = timeRange 
      ? events.filter(e => e.timestamp >= timeRange.start && e.timestamp <= timeRange.end)
      : events;

    return {
      playerId,
      totalLearningTime: this.calculateTotalLearningTime(filteredEvents),
      coursesCompleted: filteredEvents.filter(e => e.type === EventType.COURSE_COMPLETED).length,
      challengesCompleted: filteredEvents.filter(e => e.type === EventType.CHALLENGE_COMPLETED).length,
      questsCompleted: filteredEvents.filter(e => e.type === EventType.QUEST_COMPLETED).length,
      skillsAcquired: this.extractSkillsAcquired(filteredEvents),
      averageScore: this.calculateAverageScore(filteredEvents),
      engagementMetrics: this.calculateEngagementMetrics(filteredEvents),
      learningPath: this.buildLearningPath(filteredEvents)
    };
  }

  private calculateTotalLearningTime(events: LearningEvent[]): number {
    return events.reduce((total, event) => total + (event.data.duration || 0), 0);
  }

  private calculateAverageScore(events: LearningEvent[]): number {
    const scoredEvents = events.filter(e => e.data.score !== undefined);
    if (scoredEvents.length === 0) return 0;
    
    const totalScore = scoredEvents.reduce((sum, e) => sum + e.data.score, 0);
    return totalScore / scoredEvents.length;
  }

  private extractSkillsAcquired(events: LearningEvent[]): string[] {
    return events
      .filter(e => e.type === EventType.SKILL_ACQUIRED)
      .map(e => e.data.skill)
      .filter(Boolean);
  }

  private calculateEngagementMetrics(events: LearningEvent[]): EngagementMetrics {
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentEvents = events.filter(e => e.timestamp >= lastMonth);
    const weeklyEvents = recentEvents.filter(e => e.timestamp >= lastWeek);
    
    return {
      dailyActiveTime: this.calculateDailyActiveTime(recentEvents),
      weeklyActiveTime: this.calculateWeeklyActiveTime(weeklyEvents),
      streakDays: this.calculateStreakDays(events),
      lastActivity: events.length > 0 ? events[events.length - 1].timestamp : new Date(),
      sessionFrequency: this.calculateSessionFrequency(recentEvents),
      averageSessionDuration: this.calculateAverageSessionDuration(recentEvents)
    };
  }

  private buildLearningPath(events: LearningEvent[]): LearningPathItem[] {
    return events
      .filter(e => [EventType.COURSE_COMPLETED, EventType.CHALLENGE_COMPLETED, EventType.QUEST_COMPLETED].includes(e.type))
      .map(e => ({
        type: e.type.replace('_completed', '') as 'course' | 'challenge' | 'quest',
        id: e.data.courseId || e.data.challengeId || e.data.questId,
        title: e.data.title || 'Unknown',
        completedAt: e.timestamp,
        score: e.data.score,
        timeSpent: e.data.duration || 0
      }));
  }

  private calculateAverageTime(events: LearningEvent[], startType: EventType, endType: EventType): number {
    // Implementation would calculate average time between start and completion events
    return 0; // Placeholder
  }

  private identifyDropOffPoints(events: LearningEvent[]): number[] {
    // Implementation would identify common drop-off points in courses
    return []; // Placeholder
  }

  private calculateActivePlayers(events: LearningEvent[]): number {
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return new Set(events.filter(e => e.timestamp >= lastMonth).map(e => e.playerId)).size;
  }

  private calculateAverageEngagement(events: LearningEvent[]): number {
    // Implementation would calculate average engagement across all players
    return 0; // Placeholder
  }

  private calculatePopularContent(events: LearningEvent[]): PopularContent[] {
    // Implementation would identify most popular content
    return []; // Placeholder
  }

  private calculateSkillDistribution(events: LearningEvent[]): Record<string, number> {
    // Implementation would calculate distribution of skills across players
    return {}; // Placeholder
  }

  private calculateDailyActiveTime(events: LearningEvent[]): number {
    // Implementation would calculate daily active time
    return 0; // Placeholder
  }

  private calculateWeeklyActiveTime(events: LearningEvent[]): number {
    // Implementation would calculate weekly active time
    return 0; // Placeholder
  }

  private calculateStreakDays(events: LearningEvent[]): number {
    // Implementation would calculate consecutive days of activity
    return 0; // Placeholder
  }

  private calculateSessionFrequency(events: LearningEvent[]): number {
    // Implementation would calculate how often player has sessions
    return 0; // Placeholder
  }

  private calculateAverageSessionDuration(events: LearningEvent[]): number {
    const durations = events.map(e => e.data.duration || 0);
    return durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
  }
}

export class SkillAssessmentImpl implements SkillAssessment {
  private assessments: Map<string, SkillAssessmentResult[]> = new Map();

  async assessSkills(playerId: string, skillArea: string): Promise<SkillAssessmentResult> {
    const playerAssessments = this.assessments.get(playerId) || [];
    
    // Generate assessment based on player's activities and performance
    const result: SkillAssessmentResult = {
      playerId,
      skillArea,
      currentLevel: this.calculateCurrentLevel(playerId, skillArea),
      maxLevel: 10,
      progress: this.calculateProgress(playerId, skillArea),
      strengths: this.identifyStrengths(playerId, skillArea),
      weaknesses: this.identifyWeaknesses(playerId, skillArea),
      recommendations: this.generateRecommendations(playerId, skillArea),
      assessedAt: new Date()
    };

    playerAssessments.push(result);
    this.assessments.set(playerId, playerAssessments);

    return result;
  }

  async getSkillProgression(playerId: string): Promise<SkillProgression[]> {
    const assessments = this.assessments.get(playerId) || [];
    const skillMap = new Map<string, SkillProgression>();

    assessments.forEach(assessment => {
      const existing = skillMap.get(assessment.skillArea);
      if (!existing) {
        skillMap.set(assessment.skillArea, {
          skill: assessment.skillArea,
          levels: this.generateSkillLevels(assessment.currentLevel),
          currentLevel: assessment.currentLevel,
          totalProgress: assessment.progress
        });
      }
    });

    return Array.from(skillMap.values());
  }

  async recommendSkills(playerId: string): Promise<string[]> {
    const assessments = this.assessments.get(playerId) || [];
    
    // Recommend skills based on current skill gaps and career goals
    const recommendations = assessments
      .filter(a => a.currentLevel < a.maxLevel)
      .sort((a, b) => a.progress - b.progress)
      .slice(0, 5)
      .map(a => a.skillArea);

    return recommendations;
  }

  async benchmarkSkills(playerId: string, peerGroup: string): Promise<SkillBenchmark> {
    const playerAssessments = this.assessments.get(playerId) || [];
    const peerAssessments = this.getPeerAssessments(peerGroup);

    const benchmarks: SkillBenchmark[] = playerAssessments.map(assessment => {
      const peerLevels = peerAssessments
        .filter(a => a.skillArea === assessment.skillArea)
        .map(a => a.currentLevel);

      return {
        playerId,
        skill: assessment.skillArea,
        playerLevel: assessment.currentLevel,
        peerAverage: peerLevels.length > 0 ? peerLevels.reduce((a, b) => a + b, 0) / peerLevels.length : 0,
        peerMedian: this.calculateMedian(peerLevels),
        percentile: this.calculatePercentile(assessment.currentLevel, peerLevels),
        rank: this.calculateRank(assessment.currentLevel, peerLevels),
        totalPeers: peerLevels.length
      };
    });

    return benchmarks[0]; // Return first benchmark for simplicity
  }

  private calculateCurrentLevel(playerId: string, skillArea: string): number {
    // Implementation would calculate current skill level based on activities
    return Math.floor(Math.random() * 10); // Placeholder
  }

  private calculateProgress(playerId: string, skillArea: string): number {
    // Implementation would calculate progress toward next level
    return Math.random() * 100; // Placeholder
  }

  private identifyStrengths(playerId: string, skillArea: string): string[] {
    // Implementation would identify player's strengths in this skill area
    return ['Communication', 'Problem Solving']; // Placeholder
  }

  private identifyWeaknesses(playerId: string, skillArea: string): string[] {
    // Implementation would identify areas for improvement
    return ['Advanced Concepts', 'Practical Application']; // Placeholder
  }

  private generateRecommendations(playerId: string, skillArea: string): string[] {
    // Implementation would generate personalized recommendations
    return ['Take advanced course', 'Practice with real projects']; // Placeholder
  }

  private generateSkillLevels(currentLevel: number): SkillLevel[] {
    const levels: SkillLevel[] = [];
    for (let i = 1; i <= 10; i++) {
      levels.push({
        level: i,
        name: `Level ${i}`,
        description: `Skill level ${i} description`,
        requirements: [`Complete level ${i - 1} requirements`],
        achievedAt: i <= currentLevel ? new Date() : undefined,
        progress: i <= currentLevel ? 100 : 0
      });
    }
    return levels;
  }

  private getPeerAssessments(peerGroup: string): SkillAssessmentResult[] {
    // Implementation would get assessments for peer group
    return []; // Placeholder
  }

  private calculateMedian(values: number[]): number {
    const sorted = values.sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  }

  private calculatePercentile(playerValue: number, peerValues: number[]): number {
    if (peerValues.length === 0) return 0;
    const count = peerValues.filter(v => v <= playerValue).length;
    return (count / peerValues.length) * 100;
  }

  private calculateRank(playerValue: number, peerValues: number[]): number {
    const sorted = peerValues.sort((a, b) => b - a);
    return sorted.indexOf(playerValue) + 1;
  }
}

export class ProgressTrackingImpl implements ProgressTracking {
  private progress: Map<string, PlayerProgress> = new Map();
  private activities: Map<string, ProgressActivity[]> = new Map();

  async trackProgress(playerId: string, activity: ProgressActivity): Promise<void> {
    const playerActivities = this.activities.get(playerId) || [];
    playerActivities.push(activity);
    this.activities.set(playerId, playerActivities);

    // Update overall progress
    await this.updatePlayerProgress(playerId);
  }

  async getProgress(playerId: string): Promise<PlayerProgress> {
    let progress = this.progress.get(playerId);
    
    if (!progress) {
      progress = await this.calculateProgress(playerId);
      this.progress.set(playerId, progress);
    }
    
    return progress;
  }

  async getMilestones(playerId: string): Promise<Milestone[]> {
    const progress = await this.getProgress(playerId);
    return [...progress.milestones, ...progress.nextMilestones];
  }

  async generateReport(playerId: string, reportType: ReportType): Promise<ProgressReport> {
    const progress = await this.getProgress(playerId);
    const timeRange = this.getTimeRangeForReport(reportType);
    
    return {
      playerId,
      reportType,
      period: timeRange,
      summary: this.generateSummary(progress, timeRange),
      detailedProgress: progress,
      recommendations: this.generateRecommendations(progress),
      achievements: progress.achievements,
      nextSteps: this.generateNextSteps(progress)
    };
  }

  private async updatePlayerProgress(playerId: string): Promise<void> {
    const progress = await this.calculateProgress(playerId);
    this.progress.set(playerId, progress);
  }

  private async calculateProgress(playerId: string): Promise<PlayerProgress> {
    const activities = this.activities.get(playerId) || [];
    
    return {
      playerId,
      overallProgress: this.calculateOverallProgress(activities),
      activities: this.calculateActivityProgress(activities),
      achievements: this.calculateAchievements(activities),
      milestones: this.calculateMilestones(activities, true),
      nextMilestones: this.calculateMilestones(activities, false),
      timeSpent: this.calculateTotalTimeSpent(activities),
      lastUpdated: new Date()
    };
  }

  private calculateOverallProgress(activities: ProgressActivity[]): number {
    if (activities.length === 0) return 0;
    
    const totalProgress = activities.reduce((sum, activity) => sum + activity.progress, 0);
    return totalProgress / activities.length;
  }

  private calculateActivityProgress(activities: ProgressActivity[]): ActivityProgress[] {
    const activityMap = new Map<string, ActivityProgress>();

    activities.forEach(activity => {
      const existing = activityMap.get(activity.activityId);
      if (!existing) {
        activityMap.set(activity.activityId, {
          activityId: activity.activityId,
          activityType: activity.activityType,
          title: activity.activityId, // Would be populated from content library
          progress: activity.progress,
          startedAt: activity.timestamp,
          lastAccessed: activity.timestamp,
          timeSpent: activity.metadata?.duration || 0,
          status: activity.progress >= 100 ? 'completed' : 'in_progress'
        });
      } else {
        existing.progress = Math.max(existing.progress, activity.progress);
        existing.lastAccessed = activity.timestamp;
        existing.timeSpent += activity.metadata?.duration || 0;
        existing.status = existing.progress >= 100 ? 'completed' : 'in_progress';
      }
    });

    return Array.from(activityMap.values());
  }

  private calculateAchievements(activities: ProgressActivity[]): Achievement[] {
    // Implementation would calculate achievements based on activities
    return []; // Placeholder
  }

  private calculateMilestones(activities: ProgressActivity[], achieved: boolean): Milestone[] {
    // Implementation would calculate milestones based on activities
    return []; // Placeholder
  }

  private calculateTotalTimeSpent(activities: ProgressActivity[]): number {
    return activities.reduce((total, activity) => total + (activity.metadata?.duration || 0), 0);
  }

  private getTimeRangeForReport(reportType: ReportType): TimeRange {
    const now = new Date();
    let start: Date;

    switch (reportType) {
      case ReportType.WEEKLY:
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case ReportType.MONTHLY:
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case ReportType.QUARTERLY:
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case ReportType.YEARLY:
        start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return { start, end: now };
  }

  private generateSummary(progress: PlayerProgress, timeRange: TimeRange): ReportSummary {
    return {
      totalTimeSpent: progress.timeSpent,
      activitiesCompleted: progress.activities.filter(a => a.status === 'completed').length,
      skillsImproved: [], // Would be populated from skill assessments
      levelProgress: progress.overallProgress,
      keyAchievements: progress.achievements.slice(0, 3).map(a => a.title)
    };
  }

  private generateRecommendations(progress: PlayerProgress): string[] {
    // Implementation would generate personalized recommendations
    return ['Focus on completing in-progress activities', 'Explore new skill areas'];
  }

  private generateNextSteps(progress: PlayerProgress): string[] {
    // Implementation would generate next steps based on progress
    return ['Complete next milestone', 'Enroll in advanced course'];
  }
}

// Export instances for easy use
export const LearningAnalytics = new LearningAnalyticsImpl();
export const SkillAssessment = new SkillAssessmentImpl();
export const ProgressTracking = new ProgressTrackingImpl();
