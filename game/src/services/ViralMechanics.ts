// ========================================
// VIRAL MECHANICS ENGINE
// Ultra-Viral Systems for Million-Player Growth
// ========================================

import { TelegramWebApp } from '../types/telegram';
import { ViralEvent, InviteData, AchievementData } from '../types/viral';

export class ViralMechanics {
  private telegramApp: TelegramWebApp;
  private playerId: string = '';
  private playerGeneration: 'founder' | 'builder' | 'supporter' | 'mass' = 'mass';
  private referralCount: number = 0;
  private inviteCode: string;
  private variableRewardChance: number = 0.15; // 15% chance for random reward
  private lastActionTime: number = Date.now();
  private actionCount: number = 0;

  constructor(telegramApp?: TelegramWebApp) {
    this.telegramApp = telegramApp!;
    this.inviteCode = this.generateInviteCode();
  }

  async initialize(playerId: string): Promise<void> {
    this.playerId = playerId;
    
    // Determine player generation based on join time
    const joinTime = Date.now();
    const launchTime = Date.now() - (30 * 24 * 60 * 60 * 1000); // 30 days ago
    
    if (joinTime < launchTime + (7 * 24 * 60 * 60 * 1000)) {
      this.playerGeneration = 'founder';
    } else if (joinTime < launchTime + (14 * 24 * 60 * 60 * 1000)) {
      this.playerGeneration = 'builder';
    } else if (joinTime < launchTime + (21 * 24 * 60 * 60 * 1000)) {
      this.playerGeneration = 'supporter';
    } else {
      this.playerGeneration = 'mass';
    }

    // Load existing data
    await this.loadPlayerData();
  }

  private async loadPlayerData(): Promise<void> {
    // In production, this would load from database
    // For now, simulate existing data
    this.referralCount = Math.floor(Math.random() * 10);
    this.actionCount = Math.floor(Math.random() * 100);
  }

  private generateInviteCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // SYSTEM 1: GENERATION BONUSES
  getGenerationBonus(): number {
    switch (this.playerGeneration) {
      case 'founder': return 0.4; // 40% bonus
      case 'builder': return 0.2; // 20% bonus
      case 'supporter': return 0.1; // 10% bonus
      case 'mass': return 0; // No bonus
      default: return 0;
    }
  }

  getPlayerGeneration(): string {
    return this.playerGeneration;
  }

  // SYSTEM 2: VARIABLE REWARD ENGINE
  async calculateVariableReward(action: string): Promise<number> {
    this.actionCount++;
    this.lastActionTime = Date.now();

    // Every 7-15 actions, check for random reward
    if (this.actionCount % Math.floor(Math.random() * 9) + 7 === 0) {
      if (Math.random() < this.variableRewardChance) {
        // Random jackpot reward
        const baseReward = 10;
        const multiplier = Math.random() * 5 + 1; // 1x to 5x
        return Math.floor(baseReward * multiplier);
      }
    }

    return 0;
  }

  // SYSTEM 3: STATUS ECONOMY
  async shareAchievement(type: string, data: any): Promise<void> {
    const message = this.createAchievementMessage(type, data);
    
    if (this.telegramApp && this.telegramApp.openTelegramLink) {
      // Create shareable link for Telegram
      const shareUrl = `https://t.me/share/url?url=${encodeURIComponent('https://t.me/people_power_bot')}&text=${encodeURIComponent(message)}`;
      this.telegramApp.openTelegramLink(shareUrl);
    }
  }

  private createAchievementMessage(type: string, data: any): string {
    switch (type) {
      case 'rank':
        return `🔥 ${data.icon} I just reached ${data.title} in People Power: The Journey! #PeoplePower #Game`;
      case 'level':
        return `🎉 Level ${data.level} achieved in People Power! Join the movement: ${this.getInviteLink()}`;
      case 'mission':
        return `✅ Completed "${data.title}" mission in People Power! ${data.rewards.influence} Influence earned!`;
      default:
        return `🚀 Making progress in People Power: The Journey!`;
    }
  }

  // SYSTEM 4: SOCIAL DEPENDENCY LOOP
  calculateTeamBonus(teamSize: number): number {
    if (teamSize === 1) return 1; // Solo: 1x
    if (teamSize <= 5) return 2; // Small team: 2x
    if (teamSize <= 20) return 3; // Medium team: 3x
    if (teamSize <= 50) return 4; // Large team: 4x
    return 5; // Massive team: 5x
  }

  // SYSTEM 5: INVITE PSYCHOLOGY
  async generateInviteLink(playerId: string): Promise<string> {
    const baseUrl = 'https://t.me/people_power_bot';
    return `${baseUrl}?start=${this.inviteCode}`;
  }

  private getInviteLink(): string {
    return `https://t.me/people_power_bot?start=${this.inviteCode}`;
  }

  async processInvite(inviteCode: string, newPlayerId: string): Promise<InviteData> {
    // In production, this would track referrals in database
    this.referralCount++;
    
    return {
      referrerId: this.playerId,
      referrerGeneration: this.playerGeneration,
      inviteCode: this.inviteCode,
      bonusMultiplier: this.getGenerationBonus(),
      teamBonus: this.calculateTeamBonus(this.referralCount + 1)
    };
  }

  async calculateReferralRewards(referrerId: string, newPlayerLevel: number): Promise<any> {
    let rewards = {
      direct: 0,
      friendActivity: 0,
      friendOfFriend: 0,
      teamMilestone: 0
    };

    // Direct invite reward (when friend reaches level 3)
    if (newPlayerLevel >= 3) {
      rewards.direct = 50; // 50 Influence
      rewards.friendActivity = 10; // 10 Influence per level
    }

    // Friend-of-friend rewards (smaller percentage)
    if (newPlayerLevel >= 5) {
      rewards.friendOfFriend = 5; // 5 Influence
    }

    // Team milestone rewards
    if (this.referralCount === 5) {
      rewards.teamMilestone = 100; // 100 Influence bonus
    } else if (this.referralCount === 10) {
      rewards.teamMilestone = 250; // 250 Influence bonus
    } else if (this.referralCount === 25) {
      rewards.teamMilestone = 500; // 500 Influence bonus
    }

    return rewards;
  }

  // SYSTEM 6: ARTIFICIAL SCARCITY EVENTS
  async checkScarcityEvents(): Promise<ViralEvent | null> {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hour = now.getHours();

    // Weekend double influence
    if (dayOfWeek === 6 || dayOfWeek === 0) { // Saturday or Sunday
      return {
        type: 'weekend_bonus',
        message: '🔥 WEEKEND DOUBLE INFLUENCE! All rewards doubled!',
        reward: 0,
        multiplier: 2,
        duration: 48 * 60 * 60 * 1000 // 48 hours
      };
    }

    // Happy hour (random 2-hour window)
    if (hour >= 18 && hour <= 20) { // 6 PM - 8 PM
      return {
        type: 'happy_hour',
        message: '🎉 HAPPY HOUR! 1.5x Influence for 2 hours!',
        reward: 0,
        multiplier: 1.5,
        duration: 2 * 60 * 60 * 1000 // 2 hours
      };
    }

    return null;
  }

  // SYSTEM 7: MASS MOMENT ILLUSION
  async getLiveCounters(): Promise<any> {
    // In production, these would be real-time from database
    const totalPlayers = 2431992 + Math.floor(Math.random() * 1000);
    const onlineNow = 12442 + Math.floor(Math.random() * 100);
    const todayJoined = 8765 + Math.floor(Math.random() * 100);
    const growthRate = 15.3 + (Math.random() * 2 - 1); // 14.3% - 16.3%

    return {
      totalPlayers,
      onlineNow,
      todayJoined,
      growthRate
    };
  }

  // SYSTEM 8: MICRO-GOALS
  async checkMicroGoals(): Promise<AchievementData | null> {
    const goals = [
      { type: 'daily_taps', target: 100, reward: 25 },
      { type: 'daily_missions', target: 5, reward: 50 },
      { type: 'daily_invites', target: 3, reward: 100 },
      { type: 'daily_story', target: 2, reward: 30 }
    ];

    // In production, check actual progress against goals
    // For now, randomly return completed goals
    if (Math.random() < 0.3) { // 30% chance of completed goal
      const goal = goals[Math.floor(Math.random() * goals.length)];
      return {
        type: goal.type,
        message: `✅ Goal Complete: ${goal.type.replace('_', ' ').toUpperCase()}!`,
        reward: goal.reward
      };
    }

    return null;
  }

  // SYSTEM 9: SECRET MISSIONS
  async checkSecretMissions(): Promise<ViralEvent | null> {
    // Secret missions appear randomly (3% chance)
    if (Math.random() < 0.03) {
      return {
        type: 'secret_mission',
        message: '🤫 SECRET MISSION UNLOCKED! Only 3% of players discover this!',
        reward: 200,
        multiplier: 1,
        duration: 24 * 60 * 60 * 1000 // 24 hours
      };
    }

    return null;
  }

  // SYSTEM 10: IDENTITY TRANSFORMATION
  async updatePlayerIdentity(level: number, achievements: number, referrals: number): Promise<string> {
    let identity = 'Player';

    if (level >= 50 && referrals >= 10) {
      identity = 'Movement Leader';
    } else if (level >= 30 && referrals >= 5) {
      identity = 'Community Builder';
    } else if (level >= 20 && referrals >= 3) {
      identity = 'Influencer';
    } else if (level >= 10) {
      identity = 'Organizer';
    } else if (level >= 5) {
      identity = 'Activist';
    }

    return identity;
  }

  // COMBINED VIRAL EVENT CHECKER
  async checkRandomEvents(): Promise<ViralEvent | null> {
    // Check all viral systems
    const scarcityEvent = await this.checkScarcityEvents();
    if (scarcityEvent) return scarcityEvent;

    const secretMission = await this.checkSecretMissions();
    if (secretMission) return secretMission;

    const microGoal = await this.checkMicroGoals();
    if (microGoal) {
      return {
        type: 'micro_goal',
        message: microGoal.message,
        reward: microGoal.reward,
        multiplier: 1,
        duration: 0
      };
    }

    return null;
  }

  // ANALYTICS AND TRACKING
  async trackViralAction(action: string, data: any): Promise<void> {
    // In production, send to analytics service
    console.log(`Viral Action: ${action}`, data);
  }

  async getViralMetrics(): Promise<any> {
    return {
      playerGeneration: this.playerGeneration,
      referralCount: this.referralCount,
      actionCount: this.actionCount,
      generationBonus: this.getGenerationBonus(),
      inviteCode: this.inviteCode,
      variableRewardChance: this.variableRewardChance
    };
  }

  // SOCIAL PROOF GENERATION
  async generateSocialProof(): Promise<string[]> {
    const proofs = [
      `🔥 ${Math.floor(Math.random() * 20) + 5} friends joined your movement today!`,
      `🌍 Your community is growing faster than 85% of players!`,
      `🏆 You're in the top ${Math.floor(Math.random() * 10) + 1}% of influencers this week!`,
      `⭐ Your rank is higher than ${Math.floor(Math.random() * 1000) + 500} other players!`,
      `🚀 Your movement has ${Math.floor(Math.random() * 100) + 20} active members!`
    ];

    return proofs;
  }

  // FOMO GENERATION
  async generateFOMOContent(): Promise<string> {
    const events = [
      'Limited-time event ending in 2 hours!',
      'Only 100 spots left for exclusive reward!',
      'Your friends are getting ahead - don\'t miss out!',
      'Rare opportunity expires at midnight!',
      'Bonus multiplier ending soon!'
    ];

    return events[Math.floor(Math.random() * events.length)];
  }
}
