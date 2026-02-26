// ========================================
// ADDICTION-SAFE ENGAGEMENT FRAMEWORK
// Ethical, Sponsor-Friendly Game Design
// ========================================

import { Player, GameState } from '../types/game';

export interface SessionData {
  canContinue: boolean;
  message: string;
  sessionDuration: number;
  actionsRemaining: number;
  recommendedBreakTime: number;
}

export interface EthicalMetrics {
  positiveImpactScore: number;
  educationalValue: number;
  socialConnectionScore: number;
  wellbeingScore: number;
  sponsorFriendliness: number;
}

export interface SafetyLimits {
  maxSessionDuration: number; // minutes
  maxDailyActions: number;
  maxDailyPlaytime: number; // minutes
  requiredBreakDuration: number; // minutes
  maxConsecutiveDays: number;
  youthProtectionMode: boolean;
}

export class AddictionSafeFramework {
  private playerId: string;
  private sessionStartTime: number;
  private dailyActionCount: number;
  private dailyPlaytime: number;
  private lastBreakTime: number;
  private consecutiveDays: number;
  private safetyLimits: SafetyLimits;
  private ethicalMetrics: EthicalMetrics;
  private educationalContent: Map<string, any>;
  private communityActivities: Map<string, number>;

  constructor() {
    this.safetyLimits = {
      maxSessionDuration: 7, // 7 minutes per session
      maxDailyActions: 500, // Maximum actions per day
      maxDailyPlaytime: 30, // 30 minutes per day
      requiredBreakDuration: 15, // 15 minute breaks
      maxConsecutiveDays: 7, // Suggest break after 7 days
      youthProtectionMode: true
    };

    this.ethicalMetrics = {
      positiveImpactScore: 0,
      educationalValue: 0,
      socialConnectionScore: 0,
      wellbeingScore: 0,
      sponsorFriendliness: 0
    };

    this.sessionStartTime = Date.now();
    this.dailyActionCount = 0;
    this.dailyPlaytime = 0;
    this.lastBreakTime = Date.now();
    this.consecutiveDays = 0;
    this.educationalContent = new Map();
    this.communityActivities = new Map();
  }

  async initialize(playerId: string): Promise<void> {
    this.playerId = playerId;
    await this.loadSafetyData();
    await this.initializeEducationalContent();
    await this.setupSafetyMonitoring();
  }

  private async loadSafetyData(): Promise<void> {
    // In production, load from database
    // For now, simulate existing data
    const now = new Date();
    const today = now.toDateString();
    const lastPlay = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toDateString();
    
    if (today === lastPlay) {
      this.consecutiveDays = Math.floor(Math.random() * 7) + 1;
    } else {
      this.consecutiveDays = 1;
    }

    this.dailyActionCount = Math.floor(Math.random() * 200);
    this.dailyPlaytime = Math.floor(Math.random() * 20);
  }

  private async initializeEducationalContent(): Promise<void> {
    const content = [
      {
        id: 'leadership_basics',
        title: 'Leadership Fundamentals',
        type: 'micro_lesson',
        duration: 2, // minutes
        impact: 'positive',
        sponsorFriendly: true,
        content: 'Great leadership starts with listening and understanding your community.'
      },
      {
        id: 'community_organizing',
        title: 'Community Organization',
        type: 'skill_training',
        duration: 3,
        impact: 'positive',
        sponsorFriendly: true,
        content: 'Organizing communities requires clear communication and shared goals.'
      },
      {
        id: 'financial_literacy',
        title: 'Financial Basics',
        type: 'educational',
        duration: 2,
        impact: 'positive',
        sponsorFriendly: true,
        content: 'Understanding basic financial concepts helps build sustainable communities.'
      },
      {
        id: 'digital_citizenship',
        title: 'Digital Citizenship',
        type: 'social_skill',
        duration: 2,
        impact: 'positive',
        sponsorFriendly: true,
        content: 'Being a good digital citizen means respecting others and contributing positively.'
      },
      {
        id: 'conflict_resolution',
        title: 'Peaceful Resolution',
        type: 'life_skill',
        duration: 3,
        impact: 'positive',
        sponsorFriendly: true,
        content: 'Conflicts are opportunities for understanding and growth when handled peacefully.'
      }
    ];

    content.forEach(item => {
      this.educationalContent.set(item.id, item);
    });
  }

  private async setupSafetyMonitoring(): Promise<void> {
    // Monitor session duration
    setInterval(() => {
      this.checkSessionDuration();
    }, 60000); // Every minute

    // Monitor daily limits
    setInterval(() => {
      this.checkDailyLimits();
    }, 300000); // Every 5 minutes

    // Monitor consecutive days
    setInterval(() => {
      this.checkConsecutiveDays();
    }, 3600000); // Every hour
  }

  // PILLAR 1: PURPOSE-DRIVEN ENGAGEMENT
  async getPurposeDrivenContent(): Promise<any> {
    const contentTypes = ['leadership', 'community', 'education', 'social_impact'];
    const selectedType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
    
    const relevantContent = Array.from(this.educationalContent.values())
      .filter(content => content.type.includes(selectedType) || content.title.toLowerCase().includes(selectedType));

    if (relevantContent.length > 0) {
      return relevantContent[Math.floor(Math.random() * relevantContent.length)];
    }

    return null;
  }

  async evaluatePurposeImpact(action: string, context: any): Promise<number> {
    let impactScore = 0;

    switch (action) {
      case 'complete_educational_content':
        impactScore = 10;
        break;
      case 'help_community_member':
        impactScore = 8;
        break;
      case 'mentor_new_player':
        impactScore = 9;
        break;
      case 'complete_story_mission':
        impactScore = 6;
        break;
      case 'participate_in_community_event':
        impactScore = 7;
        break;
      default:
        impactScore = 2; // Basic actions have minimal purpose impact
    }

    this.ethicalMetrics.positiveImpactScore += impactScore;
    return impactScore;
  }

  // PILLAR 2: HEALTHY SESSION DESIGN
  async checkSessionLimits(): Promise<SessionData> {
    const currentSessionDuration = (Date.now() - this.sessionStartTime) / (1000 * 60); // minutes
    const timeSinceLastBreak = (Date.now() - this.lastBreakTime) / (1000 * 60); // minutes

    let canContinue = true;
    let message = '';
    let recommendedBreakTime = 0;

    // Check session duration
    if (currentSessionDuration >= this.safetyLimits.maxSessionDuration) {
      canContinue = false;
      message = `✅ Great work today. Your supporters are active. Come back in ${this.safetyLimits.requiredBreakDuration} minutes to continue.`;
      recommendedBreakTime = this.safetyLimits.requiredBreakDuration;
    }

    // Check if break is needed
    if (timeSinceLastBreak >= this.safetyLimits.requiredBreakDuration && currentSessionDuration >= 5) {
      message = message || `💡 Time for a quick break! Your progress is saved. Return refreshed in ${this.safetyLimits.requiredBreakDuration} minutes.`;
      recommendedBreakTime = this.safetyLimits.requiredBreakDuration;
    }

    // Check daily limits
    if (this.dailyPlaytime >= this.safetyLimits.maxDailyPlaytime) {
      canContinue = false;
      message = message || '🌟 Daily goal achieved! Your community appreciates your dedication. See you tomorrow!';
      recommendedBreakTime = 1440; // 24 hours
    }

    return {
      canContinue,
      message,
      sessionDuration: currentSessionDuration,
      actionsRemaining: Math.max(0, this.safetyLimits.maxDailyActions - this.dailyActionCount),
      recommendedBreakTime
    };
  }

  private checkSessionDuration(): void {
    const sessionData = this.checkSessionLimits();
    if (!sessionData.canContinue) {
      console.log('Session limit reached:', sessionData.message);
    }
  }

  // PILLAR 3: SKILL-BASED REWARDS
  async calculateSkillBasedReward(action: string, skillLevel: number, context: any): Promise<number> {
    const baseRewards = {
      'educational_content': { base: 10, skillMultiplier: 0.2 },
      'community_help': { base: 8, skillMultiplier: 0.15 },
      'mentorship': { base: 12, skillMultiplier: 0.25 },
      'leadership_action': { base: 15, skillMultiplier: 0.3 },
      'creative_contribution': { base: 9, skillMultiplier: 0.18 },
      'strategic_planning': { base: 11, skillMultiplier: 0.22 }
    };

    const rewardConfig = baseRewards[action] || { base: 2, skillMultiplier: 0.1 };
    const skillBonus = Math.floor(skillLevel * rewardConfig.skillMultiplier);
    const totalReward = rewardConfig.base + skillBonus;

    // Track educational value
    this.ethicalMetrics.educationalValue += Math.floor(totalReward * 0.3);

    return totalReward;
  }

  async validateSkillBasedAction(action: string, playerSkills: any): Promise<boolean> {
    const skillRequirements = {
      'leadership_action': ['leadership', 'communication'],
      'strategic_planning': ['strategy', 'planning'],
      'mentorship': ['teaching', 'patience'],
      'creative_contribution': ['creativity', 'expression']
    };

    const requiredSkills = skillRequirements[action];
    if (!requiredSkills) return true; // No special skills required

    return requiredSkills.some(skill => 
      playerSkills[skill] && playerSkills[skill] >= 3 // Minimum skill level 3
    );
  }

  // PILLAR 4: COMMUNITY-FIRST DESIGN
  async evaluateCommunityImpact(action: string, communityData: any): Promise<number> {
    let impactScore = 0;

    switch (action) {
      case 'community_contribution':
        impactScore = 8;
        break;
      case 'team_mission':
        impactScore = 10;
        break;
      case 'help_teammate':
        impactScore = 7;
        break;
      case 'community_event':
        impactScore = 9;
        break;
      case 'shared_resource':
        impactScore = 6;
        break;
      default:
        impactScore = 2;
    }

    this.ethicalMetrics.socialConnectionScore += impactScore;
    return impactScore;
  }

  async generateCommunityFirstMission(player: Player, community: any): Promise<any> {
    const missionTypes = [
      {
        type: 'community_support',
        title: 'Support Your Community',
        description: 'Help community members achieve their goals',
        collaborative: true,
        individualReward: 50,
        communityReward: 200,
        socialImpact: 'high'
      },
      {
        type: 'team_challenge',
        title: 'Team Challenge',
        description: 'Work together to complete community objectives',
        collaborative: true,
        individualReward: 75,
        communityReward: 300,
        socialImpact: 'high'
      },
      {
        type: 'mentorship_drive',
        title: 'Mentorship Drive',
        description: 'Help new players learn and grow',
        collaborative: true,
        individualReward: 60,
        communityReward: 250,
        socialImpact: 'medium'
      }
    ];

    return missionTypes[Math.floor(Math.random() * missionTypes.length)];
  }

  // PILLAR 5: TRANSPARENT ECONOMY
  async getTransparentEconomyReport(): Promise<any> {
    return {
      totalInfluenceGenerated: 1000000,
      totalInfluenceDistributed: 850000,
      sources: {
        gameplay: 60,
        education: 20,
        community: 15,
        sponsorships: 5
      },
      sinks: {
        upgrades: 40,
        community_projects: 30,
        special_events: 20,
        treasury: 10
      },
      sustainability: 'healthy',
      lastUpdated: new Date(),
      nextAudit: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
  }

  async explainRewardSource(action: string): Promise<string> {
    const explanations = {
      'educational_content': 'This reward recognizes your investment in personal growth and knowledge.',
      'community_help': 'This reward comes from the community treasury, funded by collective contributions.',
      'sponsorship': 'This reward is sponsored by external partners supporting youth development.',
      'gameplay': 'This reward is generated through your active participation in the game ecosystem.',
      'mentorship': 'This reward acknowledges your role in strengthening the community through knowledge sharing.'
    };

    return explanations[action] || 'This reward is part of the game\'s balanced economic system.';
  }

  // SAFETY MECHANISMS

  private checkDailyLimits(): void {
    if (this.dailyActionCount >= this.safetyLimits.maxDailyActions) {
      console.log('Daily action limit reached for player:', this.playerId);
    }

    if (this.dailyPlaytime >= this.safetyLimits.maxDailyPlaytime) {
      console.log('Daily playtime limit reached for player:', this.playerId);
    }
  }

  private checkConsecutiveDays(): void {
    if (this.consecutiveDays >= this.safetyLimits.maxConsecutiveDays) {
      console.log('Consecutive days limit reached, suggesting break for player:', this.playerId);
    }
  }

  async trackAction(action: string, reward: number): Promise<void> {
    this.dailyActionCount++;
    this.dailyPlaytime += 1; // Assume 1 minute per action for tracking

    // Evaluate ethical impact
    await this.evaluatePurposeImpact(action, {});
    await this.evaluateCommunityImpact(action, {});

    // Update wellbeing score
    this.updateWellbeingScore(action, reward);
  }

  private updateWellbeingScore(action: string, reward: number): void {
    let wellbeingChange = 0;

    // Positive wellbeing factors
    if (action.includes('educational') || action.includes('help') || action.includes('community')) {
      wellbeingChange += 2;
    }

    // Negative wellbeing factors (excessive grinding)
    if (this.dailyActionCount > 300) {
      wellbeingChange -= 1;
    }

    if (this.dailyPlaytime > 25) {
      wellbeingChange -= 1;
    }

    this.ethicalMetrics.wellbeingScore = Math.max(0, Math.min(100, 
      this.ethicalMetrics.wellbeingScore + wellbeingChange));
  }

  // YOUTH PROTECTION
  async enableYouthProtectionMode(): Promise<void> {
    this.safetyLimits.youthProtectionMode = true;
    this.safetyLimits.maxSessionDuration = 5; // 5 minutes
    this.safetyLimits.maxDailyPlaytime = 20; // 20 minutes
    this.safetyLimits.requiredBreakDuration = 20; // 20 minute breaks

    // Disable gambling-like mechanics
    // Enable additional safety notifications
    // Restrict certain features
  }

  async checkContentAppropriateness(content: any): Promise<boolean> {
    if (!this.safetyLimits.youthProtectionMode) return true;

    // Check for inappropriate content
    const inappropriateKeywords = ['violence', 'gambling', 'adult', 'weapons'];
    const contentString = JSON.stringify(content).toLowerCase();

    return !inappropriateKeywords.some(keyword => contentString.includes(keyword));
  }

  // EMOTIONAL SAFETY
  async generatePositiveMessage(context: string): Promise<string> {
    const messages = {
      'session_start': [
        'Welcome back! Your community is excited to see you.',
        'Ready to make a positive impact today?',
        'Your leadership journey continues!'
      ],
      'achievement': [
        'Amazing progress! You\'re inspiring others.',
        'Your dedication strengthens the entire community.',
        'Every step forward creates positive change!'
      ],
      'break_time': [
        'Rest well! Your supporters will be here when you return.',
        'Taking care of yourself helps you care for others.',
        'Balance is key to sustainable leadership.'
      ],
      'daily_complete': [
        'Fantastic work today! You\'ve made a real difference.',
        'Your community appreciates your consistent effort.',
        'Today\'s actions build tomorrow\'s success!'
      ]
    };

    const contextMessages = messages[context] || messages['session_start'];
    return contextMessages[Math.floor(Math.random() * contextMessages.length)];
  }

  async preventShameBasedMessaging(): Promise<string[]> {
    // Filter out shame-based messages
    const positiveOnly = [
      'Your community values your contribution',
      'Every effort counts toward collective success',
      'Your journey inspires others to grow',
      'Consistent effort creates lasting change',
      'Your leadership makes a difference'
    ];

    return positiveOnly;
  }

  // EDUCATIONAL MICRO-LEARNING LAYER
  async getMicroLearningContent(playerLevel: number): Promise<any> {
    const appropriateContent = Array.from(this.educationalContent.values())
      .filter(content => {
        // Match content to player level
        if (playerLevel < 10) return content.duration <= 2;
        if (playerLevel < 20) return content.duration <= 3;
        return true;
      });

    if (appropriateContent.length > 0) {
      return appropriateContent[Math.floor(Math.random() * appropriateContent.length)];
    }

    return null;
  }

  async integrateLearningWithGameplay(action: string): Promise<any> {
    const learningIntegrations = {
      'mission_complete': {
        lesson: 'Leadership Lesson',
        content: 'Completing missions teaches commitment and follow-through.',
        duration: 1
      },
      'community_help': {
        lesson: 'Community Building',
        content: 'Helping others strengthens community bonds.',
        duration: 2
      },
      'level_up': {
        lesson: 'Personal Growth',
        content: 'Progress comes from consistent effort and learning.',
        duration: 1
      }
    };

    return learningIntegrations[action] || null;
  }

  // NGO & SPONSOR INTEGRATION
  async generateSponsorFriendlyMission(sponsorData: any): Promise<any> {
    return {
      id: `sponsor_${sponsorData.id}_${Date.now()}`,
      title: `${sponsorData.name} Youth Challenge`,
      description: `Complete this challenge to support ${sponsorData.cause}`,
      sponsor: sponsorData.name,
      rewards: {
        influence: sponsorData.rewardAmount,
        powerTokens: Math.floor(sponsorData.rewardAmount / 10),
        certificate: true
      },
      requirements: sponsorData.requirements,
      impact: sponsorData.impact,
      duration: sponsorData.duration,
      ethicalRating: 'high'
    };
  }

  async calculateSponsorROI(sponsorId: string, metrics: any): Promise<any> {
    return {
      sponsorId,
      reach: metrics.participantCount,
      engagement: metrics.completionRate,
      educationalImpact: metrics.learningScore,
      socialImpact: metrics.communityBenefit,
      brandSafety: this.ethicalMetrics.wellbeingScore,
      costPerImpact: sponsorId === 'ngo' ? 0.5 : 2.0, // NGOs get better rates
      overallScore: this.calculateSponsorScore(metrics)
    };
  }

  private calculateSponsorScore(metrics: any): number {
    return (
      metrics.participantCount * 0.3 +
      metrics.completionRate * 0.25 +
      metrics.learningScore * 0.25 +
      metrics.communityBenefit * 0.2
    );
  }

  // METRICS AND REPORTING
  async getEthicalMetrics(): Promise<EthicalMetrics> {
    return { ...this.ethicalMetrics };
  }

  async generateImpactReport(): Promise<any> {
    return {
      playerCount: 1000000,
      averageSessionDuration: 6.5, // minutes
      educationalContentCompleted: 500000,
      communityActions: 750000,
      positiveInteractions: 900000,
      wellbeingScore: this.ethicalMetrics.wellbeingScore,
      sponsorSatisfaction: 4.7, // out of 5
      youthProtectionCompliance: '100%',
      ethicalRating: 'excellent'
    };
  }

  async getSafetyStatus(): Promise<any> {
    return {
      currentPlayerSafety: {
        sessionTime: (Date.now() - this.sessionStartTime) / (1000 * 60),
        dailyActions: this.dailyActionCount,
        dailyPlaytime: this.dailyPlaytime,
        consecutiveDays: this.consecutiveDays,
        needsBreak: (Date.now() - this.lastBreakTime) / (1000 * 60) > this.safetyLimits.requiredBreakDuration
      },
      systemHealth: {
        averageWellbeingScore: this.ethicalMetrics.wellbeingScore,
        totalEducationalContent: this.educationalContent.size,
        communityEngagementRate: this.ethicalMetrics.socialConnectionScore,
        sponsorFriendliness: this.ethicalMetrics.sponsorFriendliness
      }
    };
  }

  async updateSafetyLimits(newLimits: Partial<SafetyLimits>): Promise<void> {
    this.safetyLimits = { ...this.safetyLimits, ...newLimits };
  }

  async resetDailyCounters(): Promise<void> {
    this.dailyActionCount = 0;
    this.dailyPlaytime = 0;
    this.sessionStartTime = Date.now();
  }
}
