// ========================================
// VIRAL MECHANICS TYPES
// ========================================

export interface ViralEvent {
  type: string;
  message: string;
  reward: number;
  multiplier: number;
  duration: number;
}

export interface InviteData {
  referrerId: string;
  referrerGeneration: 'founder' | 'builder' | 'supporter' | 'mass';
  inviteCode: string;
  bonusMultiplier: number;
  teamBonus: number;
}

export interface AchievementData {
  type: string;
  message: string;
  reward: number;
}

export interface SocialProof {
  message: string;
  timestamp: number;
  type: 'friends_joined' | 'growth_ranking' | 'leaderboard_position' | 'community_size';
}

export interface FOMOContent {
  message: string;
  urgency: 'high' | 'medium' | 'low';
  expiresAt: number;
}

export interface PlayerGeneration {
  type: 'founder' | 'builder' | 'supporter' | 'mass';
  bonusMultiplier: number;
  description: string;
  icon: string;
}

export interface VariableReward {
  baseAmount: number;
  multiplier: number;
  probability: number;
  action: string;
}

export interface TeamBonus {
  teamSize: number;
  multiplier: number;
  description: string;
}

export interface ReferralReward {
  direct: number;
  friendActivity: number;
  friendOfFriend: number;
  teamMilestone: number;
}

export interface ScarcityEvent {
  type: 'weekend_bonus' | 'happy_hour' | 'flash_event' | 'limited_mission';
  message: string;
  multiplier: number;
  duration: number;
  startTime: number;
  endTime: number;
}

export interface MicroGoal {
  type: string;
  target: number;
  current: number;
  reward: number;
  completed: boolean;
}

export interface SecretMission {
  id: string;
  title: string;
  description: string;
  reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  expiresAt: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface ViralMetrics {
  playerGeneration: PlayerGeneration;
  referralCount: number;
  actionCount: number;
  generationBonus: number;
  inviteCode: string;
  variableRewardChance: number;
  socialProofs: SocialProof[];
  fomoContent: FOMOContent[];
  activeEvents: ScarcityEvent[];
  completedGoals: MicroGoal[];
  discoveredSecrets: SecretMission[];
}
