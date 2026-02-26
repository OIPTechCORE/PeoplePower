// ========================================
// RETENTION ENGINE
// Long-term Player Engagement Systems
// ========================================

import { Player, GameState, Season, Achievement, Community } from '../types/game';

export interface RetentionMetrics {
  dailyActiveUsers: number;
  weeklyRetention: number;
  monthlyRetention: number;
  seasonCompletionRate: number;
  communityEngagement: number;
  averageSessionDuration: number;
  churnRate: number;
  returningPlayerRate: number;
}

export interface RetentionConfig {
  sessionDuration: number; // minutes
  dailyRewardStreak: number;
  weeklyGoalProgress: number;
  seasonParticipation: number;
  communityActivity: number;
  socialConnections: number;
}

export class RetentionEngine {
  private playerId: string;
  private metrics: RetentionMetrics;
  private config: RetentionConfig;
  private sessionStartTime: number;
  private lastActivityTime: number;
  private consecutiveDays: number;
  private weeklyGoals: Map<string, number>;
  private seasonProgress: Map<number, number>;
  private socialConnections: Set<string>;

  constructor() {
    this.config = {
      sessionDuration: 7, // 7 minutes max per session
      dailyRewardStreak: 0,
      weeklyGoalProgress: 0,
      seasonParticipation: 0,
      communityActivity: 0,
      socialConnections: 0
    };

    this.metrics = {
      dailyActiveUsers: 0,
      weeklyRetention: 0,
      monthlyRetention: 0,
      seasonCompletionRate: 0,
      communityEngagement: 0,
      averageSessionDuration: 0,
      churnRate: 0,
      returningPlayerRate: 0
    };

    this.sessionStartTime = Date.now();
    this.lastActivityTime = Date.now();
    this.consecutiveDays = 0;
    this.weeklyGoals = new Map();
    this.seasonProgress = new Map();
    this.socialConnections = new Set();
  }

  async initialize(playerId: string): Promise<void> {
    this.playerId = playerId;
    await this.loadRetentionData();
    await this.startSessionTracking();
  }

  private async loadRetentionData(): Promise<void> {
    // In production, load from database
    // For now, simulate existing data
    this.consecutiveDays = Math.floor(Math.random() * 30);
    this.config.dailyRewardStreak = this.consecutiveDays;
    
    // Initialize weekly goals
    this.weeklyGoals.set('missions_completed', 0);
    this.weeklyGoals.set('influence_earned', 0);
    this.weeklyGoals.set('friends_invited', 0);
    this.weeklyGoals.set('story_chapters', 0);
    this.weeklyGoals.set('community_contributions', 0);
  }

  private async startSessionTracking(): Promise<void> {
    this.sessionStartTime = Date.now();
    this.lastActivityTime = Date.now();

    // Check session duration limits
    setInterval(() => {
      this.checkSessionLimits();
    }, 60000); // Check every minute
  }

  private checkSessionLimits(): void {
    const sessionDuration = (Date.now() - this.sessionStartTime) / (1000 * 60); // minutes
    
    if (sessionDuration >= this.config.sessionDuration) {
      // Suggest break
      this.suggestBreak();
    }
  }

  private suggestBreak(): void {
    // In production, show UI notification
    console.log(`Session time: ${this.config.sessionDuration} minutes reached. Time for a break!`);
    
    // Update metrics
    this.metrics.averageSessionDuration = this.config.sessionDuration;
  }

  // SYSTEM 1: INFINITE PROGRESSION LOOP
  async checkHorizontalProgression(player: Player): Promise<string[]> {
    const progressionPaths = [];

    // Check skill tree progress
    if (player.level >= 10 && !player.achievements.find(a => a.id === 'skill_tree_unlocked')) {
      progressionPaths.push('skill_tree');
    }

    // Check community leadership
    if (player.influence >= 10000 && !player.achievements.find(a => a.id === 'community_leader_eligible')) {
      progressionPaths.push('community_leadership');
    }

    // Check mentorship eligibility
    if (player.level >= 20 && player.referrals >= 5) {
      progressionPaths.push('mentorship');
    }

    // Check council candidacy
    if (player.level >= 30 && player.communityId) {
      progressionPaths.push('council_candidacy');
    }

    return progressionPaths;
  }

  // SYSTEM 2: SEASONS (HEARTBEAT OF LONG LIFE)
  async getCurrentSeason(): Promise<Season> {
    // In production, get from database
    const now = new Date();
    const seasonNumber = Math.floor((now.getTime() - Date.parse('2026-01-01')) / (30 * 24 * 60 * 60 * 1000)) + 1;

    return {
      id: seasonNumber,
      name: `Season ${seasonNumber}`,
      theme: this.getSeasonTheme(seasonNumber),
      startTime: new Date(now.getTime() - (now.getDate() - 1) * 24 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + (30 - now.getDate()) * 24 * 60 * 60 * 1000),
      rewards: {
        influence: 1000 * seasonNumber,
        powerTokens: 100 * seasonNumber,
        items: [`season_${seasonNumber}_badge`]
      },
      challenges: await this.getSeasonChallenges(seasonNumber),
      leaderboard: {
        type: 'global',
        period: 'seasonal',
        entries: [],
        playerRank: 0,
        totalPlayers: 0
      }
    };
  }

  private getSeasonTheme(seasonNumber: number): string {
    const themes = [
      'Rising Voices',
      'Community Builders',
      'Digital Revolution',
      'Leadership Legacy',
      'Movement Makers',
      'Change Agents'
    ];
    return themes[seasonNumber % themes.length];
  }

  private async getSeasonChallenges(seasonNumber: number): Promise<any[]> {
    return [
      {
        id: `season_${seasonNumber}_daily`,
        title: 'Daily Activist',
        description: 'Log in for 7 consecutive days',
        type: 'individual',
        requirements: { consecutive_days: 7 },
        rewards: { influence: 500, powerTokens: 50 },
        progress: 0,
        completed: false
      },
      {
        id: `season_${seasonNumber}_community`,
        title: 'Community Champion',
        description: 'Contribute 1000 influence to community',
        type: 'community',
        requirements: { community_influence: 1000 },
        rewards: { influence: 750, powerTokens: 75 },
        progress: 0,
        completed: false
      },
      {
        id: `season_${seasonNumber}_recruitment`,
        title: 'Movement Builder',
        description: 'Invite 10 new players',
        type: 'individual',
        requirements: { referrals: 10 },
        rewards: { influence: 1000, powerTokens: 100 },
        progress: 0,
        completed: false
      }
    ];
  }

  // SYSTEM 3: SOCIAL ANCHORING (ANTI-QUIT MECHANIC)
  async checkSocialAnchors(player: Player, community: Community | null): Promise<any> {
    const anchors = {
      hasCommunity: !!community,
      communitySize: community?.memberCount || 0,
      communityRole: community?.members.find(m => m.playerId === player.id)?.role || 'none',
      socialConnections: this.socialConnections.size,
      teamDependencies: 0
    };

    // Calculate team dependencies
    if (community) {
      const playerMember = community.members.find(m => m.playerId === player.id);
      if (playerMember) {
        anchors.teamDependencies = playerMember.contribution.missions + playerMember.contribution.influence / 100;
      }
    }

    return anchors;
  }

  async strengthenSocialBonds(playerId: string, connectionType: string, targetId: string): Promise<void> {
    this.socialConnections.add(`${playerId}_${connectionType}_${targetId}`);
    this.config.socialConnections = this.socialConnections.size;
  }

  // SYSTEM 4: STATUS MEMORY
  async getPermanentStatus(player: Player): Promise<any> {
    const status = {
      currentRank: player.rank,
      allTimeRank: this.calculateAllTimeRank(player),
      seasonAchievements: this.getSeasonAchievements(player),
      legacyBadges: this.getLegacyBadges(player),
      founderStatus: player.generation === 'founder',
      totalContributions: player.totalEarned,
      communityLeadership: this.getCommunityLeadership(player),
      mentorshipImpact: this.getMentorshipImpact(player)
    };

    return status;
  }

  private calculateAllTimeRank(player: Player): string {
    if (player.level >= 50) return 'Legend';
    if (player.level >= 30) return 'Movement Leader';
    if (player.level >= 20) return 'Influencer';
    if (player.level >= 10) return 'Community Leader';
    return 'Organizer';
  }

  private getSeasonAchievements(player: Player): Achievement[] {
    return player.achievements.filter(a => a.type === 'season' || a.type === 'special');
  }

  private getLegacyBadges(player: Player): string[] {
    const badges = [];
    
    if (player.generation === 'founder') badges.push('👑 Founder');
    if (player.referrals >= 10) badges.push('🌟 Recruiter');
    if (player.dailyStreak >= 30) badges.push('🔥 Dedicated');
    if (player.communityId) badges.push('🏛️ Community Member');
    if (player.level >= 50) badges.push('🏆 Legend');
    
    return badges;
  }

  private getCommunityLeadership(player: Player): any {
    // In production, get from community data
    return {
      hasLedCommunity: player.level >= 25,
      leadershipScore: player.influence / 100,
      teamsBuilt: Math.floor(player.referrals / 3),
      membersMentored: Math.floor(player.referrals * 2)
    };
  }

  private getMentorshipImpact(player: Player): any {
    return {
      playersMentored: Math.floor(player.referrals * 1.5),
      mentorshipLevel: player.level >= 20 ? 'Senior' : player.level >= 10 ? 'Junior' : 'None',
      totalMentorshipInfluence: player.totalEarned.influence * 0.1,
      mentorshipAchievements: player.achievements.filter(a => a.type === 'social').length
    };
  }

  // SYSTEM 5: VARIABLE LONG-TERM REWARDS
  async calculateDelayedRewards(player: Player): Promise<any> {
    const now = new Date();
    const rewards = {
      streak14: 0,
      streak30: 0,
      streak90: 0,
      monthlyAchievement: 0,
      seasonalCompletion: 0,
      loyaltyBonus: 0
    };

    // 14-day streak
    if (player.dailyStreak >= 14) {
      rewards.streak14 = 200;
    }

    // 30-day streak
    if (player.dailyStreak >= 30) {
      rewards.streak30 = 500;
    }

    // 90-day streak
    if (player.dailyStreak >= 90) {
      rewards.streak90 = 1500;
    }

    // Monthly achievement bonus
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    if (player.dailyStreak >= daysInMonth) {
      rewards.monthlyAchievement = 1000;
    }

    // Seasonal completion
    const currentSeason = await this.getCurrentSeason();
    const seasonProgress = this.seasonProgress.get(currentSeason.id) || 0;
    if (seasonProgress >= 0.8) { // 80% completion
      rewards.seasonalCompletion = currentSeason.rewards.powerTokens / 2;
    }

    // Loyalty bonus (based on total play time)
    const daysSinceJoined = Math.floor((now.getTime() - player.joinedAt.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceJoined >= 180) { // 6 months
      rewards.loyaltyBonus = 2000;
    }

    return rewards;
  }

  // SYSTEM 6: STORY EVOLUTION (EMOTIONAL RETENTION)
  async getNextStoryChapter(currentProgress: number): Promise<any> {
    const chapters = [
      { id: 1, title: "Ghetto Roots", theme: "humble beginnings", emotionalHook: "Every journey starts with a single step" },
      { id: 2, title: "Voice Through Music", theme: "finding your voice", emotionalHook: "Music becomes the language of change" },
      { id: 3, title: "Rising Popularity", theme: "community building", emotionalHook: "When one voice becomes many" },
      { id: 4, title: "Challenges", theme: "overcoming obstacles", emotionalHook: "True strength is tested in fire" },
      { id: 5, title: "Leadership", theme: "movement building", emotionalHook: "From follower to leader" },
      { id: 6, title: "Pressure", theme: "resilience", emotionalHook: "Standing strong when it matters most" },
      { id: 7, title: "Legacy", theme: "lasting impact", emotionalHook: "What will you leave behind?" }
    ];

    const nextChapter = chapters[currentProgress];
    if (nextChapter) {
      return {
        ...nextChapter,
        unlocked: true,
        anticipation: this.generateChapterAnticipation(nextChapter),
        playerChoices: this.getPreviousPlayerChoices(currentProgress),
        returningCharacters: this.getReturningCharacters(currentProgress)
      };
    }

    return null;
  }

  private generateChapterAnticipation(chapter: any): string {
    const anticipationMessages = [
      "The community is waiting to see what happens next...",
      "Your decisions in this chapter will shape the future...",
      "Something unexpected is about to unfold...",
      "The movement reaches a critical turning point...",
      "Your leadership will be tested like never before..."
    ];

    return anticipationMessages[Math.floor(Math.random() * anticipationMessages.length)];
  }

  private getPreviousPlayerChoices(chapterNumber: number): any[] {
    // In production, get from player's story history
    return [
      { chapter: chapterNumber - 1, choice: "stood_with_community", impact: "unity" },
      { chapter: chapterNumber - 2, choice: "spoke_truth", impact: "courage" }
    ];
  }

  private getReturningCharacters(chapterNumber: number): string[] {
    const characters = ["Mentor", "Community Elder", "Rival Leader", "Child Supporter"];
    return characters.slice(0, Math.min(2, chapterNumber));
  }

  // SYSTEM 7: CONTROLLED ECONOMY STABILITY
  async checkEconomicStability(metrics: any): Promise<any> {
    const stability = {
      influenceInflation: this.calculateInflationRate(metrics.inflationData),
      rewardBalance: this.checkRewardBalance(metrics.rewardData),
      marketHealth: this.assessMarketHealth(metrics.marketData),
      adjustments: []
    };

    // Automatic adjustments
    if (stability.influenceInflation > 0.1) { // 10% inflation
      stability.adjustments.push({
        type: 'reduce_rewards',
        amount: 0.1,
        reason: 'High inflation detected'
      });
    }

    if (stability.rewardBalance < 0.8) { // Low balance
      stability.adjustments.push({
        type: 'increase_sinks',
        amount: 0.15,
        reason: 'Reward balance too low'
      });
    }

    return stability;
  }

  private calculateInflationRate(inflationData: any): number {
    // In production, calculate from actual economic data
    return Math.random() * 0.2; // 0-20% inflation
  }

  private checkRewardBalance(rewardData: any): number {
    // Ratio of rewards to economic activity
    return Math.random() * 0.5 + 0.5; // 50-100%
  }

  private assessMarketHealth(marketData: any): 'healthy' | 'warning' | 'critical' {
    const healthScore = Math.random();
    if (healthScore > 0.7) return 'healthy';
    if (healthScore > 0.3) return 'warning';
    return 'critical';
  }

  // SYSTEM 8: MICRO PURPOSE MISSIONS
  async generatePersonalMissions(player: Player): Promise<any[]> {
    const missions = [];

    // Recruitment mission
    if (player.referrals < 5) {
      missions.push({
        type: 'recruit',
        title: 'Find Your Voice',
        description: 'Invite 2 friends to join the movement',
        target: 2,
        current: player.referrals,
        reward: { influence: 100, powerTokens: 10 },
        purpose: 'community_growth'
      });
    }

    // Community contribution
    if (player.communityId) {
      missions.push({
        type: 'community',
        title: 'Support Your Community',
        description: 'Contribute 500 influence to community treasury',
        target: 500,
        current: 0, // Would get from community data
        reward: { influence: 200, powerTokens: 20 },
        purpose: 'community_support'
      });
    }

    // Mentorship mission
    if (player.level >= 15) {
      missions.push({
        type: 'mentor',
        title: 'Guide the Next Generation',
        description: 'Help 3 new players reach level 5',
        target: 3,
        current: 0, // Would get from mentorship data
        reward: { influence: 300, powerTokens: 30 },
        purpose: 'knowledge_sharing'
      });
    }

    return missions;
  }

  // SYSTEM 9: SURPRISE MOMENTS (DOPAMINE RESETS)
  async checkSurpriseMoments(): Promise<any> {
    const chance = Math.random();
    
    if (chance < 0.05) { // 5% chance
      const surprises = [
        {
          type: 'mystery_character',
          message: 'A mysterious mentor appears with wisdom to share...',
          reward: 150,
          duration: 24 * 60 * 60 * 1000 // 24 hours
        },
        {
          type: 'hidden_treasure',
          message: 'You discovered a hidden cache of influence!',
          reward: 200,
          duration: 12 * 60 * 60 * 1000 // 12 hours
        },
        {
          type: 'community_celebration',
          message: 'The community celebrates your dedication!',
          reward: 100,
          duration: 6 * 60 * 60 * 1000 // 6 hours
        },
        {
          type: 'legacy_boost',
          message: 'Your past actions inspire others!',
          reward: 250,
          duration: 48 * 60 * 60 * 1000 // 48 hours
        }
      ];

      return surprises[Math.floor(Math.random() * surprises.length)];
    }

    return null;
  }

  // SYSTEM 10: IDENTITY EVOLUTION
  async calculateIdentityEvolution(player: Player): Promise<any> {
    const identity = {
      visualProgression: this.getVisualProgression(player),
      titleEvolution: this.getTitleEvolution(player),
      socialRecognition: this.getSocialRecognition(player),
      communityRole: this.getCommunityRole(player),
      legacyStatus: this.getLegacyStatus(player)
    };

    return identity;
  }

  private getVisualProgression(player: Player): any {
    return {
      avatarTier: Math.floor(player.level / 10) + 1,
      auraEffect: player.level >= 20 ? 'golden' : player.level >= 10 ? 'silver' : 'bronze',
      titleDisplay: player.rank,
      badgeCount: player.achievements.length,
      animationLevel: Math.min(Math.floor(player.level / 5), 10)
    };
  }

  private getTitleEvolution(player: Player): string[] {
    const titles = [];
    
    if (player.level >= 5) titles.push('Activist');
    if (player.level >= 10) titles.push('Organizer');
    if (player.level >= 15) titles.push('Mentor');
    if (player.level >= 20) titles.push('Leader');
    if (player.level >= 30) titles.push('Influencer');
    if (player.level >= 40) titles.push('Champion');
    if (player.level >= 50) titles.push('Legend');

    return titles;
  }

  private getSocialRecognition(player: Player): any {
    return {
      recognitionLevel: Math.floor(player.influence / 10000) + 1,
      socialProofs: Math.floor(player.referrals * 2),
      communityRespect: player.communityId ? 'high' : 'medium',
      influenceTier: this.getInfluenceTier(player.influence)
    };
  }

  private getInfluenceTier(influence: number): string {
    if (influence >= 100000) return 'movement_leader';
    if (influence >= 50000) return 'community_icon';
    if (influence >= 20000) return 'rising_star';
    if (influence >= 10000) return 'active_member';
    return 'newcomer';
  }

  private getCommunityRole(player: Player): string {
    if (!player.communityId) return 'independent';
    if (player.level >= 25) return 'elder';
    if (player.level >= 15) return 'officer';
    return 'member';
  }

  private getLegacyStatus(player: Player): any {
    return {
      founderStatus: player.generation === 'founder',
      earlyAdopter: player.joinedAt < new Date('2026-02-01'),
      veteranStatus: player.dailyStreak >= 30,
      mentorshipLegacy: player.referrals >= 10,
      communityBuilder: player.communityId && player.level >= 20
    };
  }

  // SYSTEM 11: COMMUNITY GOVERNANCE (ADVANCED)
  async checkGovernanceEligibility(player: Player): Promise<any> {
    const eligibility = {
      canVote: player.level >= 5,
      canPropose: player.level >= 15,
      canLeadCouncil: player.level >= 25,
      canMentor: player.level >= 20,
      canModerate: player.level >= 30,
      specialPermissions: []
    };

    // Check special permissions
    if (player.generation === 'founder') {
      eligibility.specialPermissions.push('founder_privileges');
    }

    if (player.referrals >= 20) {
      eligibility.specialPermissions.push('recruitment_master');
    }

    if (player.dailyStreak >= 100) {
      eligibility.specialPermissions.push('dedicated_member');
    }

    return eligibility;
  }

  // SYSTEM 12: RETURNING PLAYER MAGNET
  async generateComebackMessage(player: Player): Promise<any> {
    const daysAway = Math.floor((Date.now() - player.lastPlayTime.getTime()) / (1000 * 60 * 60 * 24));
    
    let message = '';
    let bonus = 0;
    let urgency = 'low';

    if (daysAway <= 3) {
      message = `👋 Welcome back! Your community missed you. ${player.supporters} supporters are waiting for your leadership!`;
      bonus = 50;
      urgency = 'medium';
    } else if (daysAway <= 7) {
      message = `⚡ Your movement needs you! Your rank is being challenged. Return now to defend your position!`;
      bonus = 100;
      urgency = 'high';
    } else if (daysAway <= 14) {
      message = `🔥 The movement grows without you! Your legacy awaits. Return and claim your bonus!`;
      bonus = 200;
      urgency = 'high';
    } else {
      message = `🌟 Legend, your time has come again! The community needs your wisdom. Great rewards await!`;
      bonus = 500;
      urgency = 'critical';
    }

    return {
      message,
      bonus,
      urgency,
      daysAway,
      personalizedElements: {
        supporterCount: player.supporters,
        currentRank: player.rank,
        communityStatus: player.communityId ? 'leader' : 'independent',
        lastAchievement: player.achievements[player.achievements.length - 1]?.title || 'None'
      }
    };
  }

  // METRICS AND ANALYTICS
  async getRetentionMetrics(): Promise<RetentionMetrics> {
    return this.metrics;
  }

  async updateMetrics(newData: Partial<RetentionMetrics>): Promise<void> {
    this.metrics = { ...this.metrics, ...newData };
  }

  async trackActivity(activityType: string, value: number): Promise<void> {
    this.lastActivityTime = Date.now();
    
    // Update weekly goals
    const currentGoal = this.weeklyGoals.get(activityType) || 0;
    this.weeklyGoals.set(activityType, currentGoal + value);
    
    // Update season progress
    const currentSeason = await this.getCurrentSeason();
    const currentProgress = this.seasonProgress.get(currentSeason.id) || 0;
    this.seasonProgress.set(currentSeason.id, Math.min(currentProgress + 0.01, 1));
  }

  async getWeeklyProgress(): Promise<Map<string, number>> {
    return this.weeklyGoals;
  }

  async getSeasonProgress(seasonId: number): Promise<number> {
    return this.seasonProgress.get(seasonId) || 0;
  }

  async resetWeeklyGoals(): Promise<void> {
    this.weeklyGoals.clear();
    this.weeklyGoals.set('missions_completed', 0);
    this.weeklyGoals.set('influence_earned', 0);
    this.weeklyGoals.set('friends_invited', 0);
    this.weeklyGoals.set('story_chapters', 0);
    this.weeklyGoals.set('community_contributions', 0);
  }
}
