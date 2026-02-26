// ========================================
// GAME CORE TYPES
// ========================================

export interface Player {
  id: string;
  telegramId: number;
  username: string;
  firstName: string;
  lastName?: string;
  level: number;
  experience: number;
  influence: number;
  powerTokens: number;
  supporters: number;
  rank: string;
  generation: 'founder' | 'builder' | 'supporter' | 'mass';
  dailyStreak: number;
  lastPlayTime: Date;
  joinedAt: Date;
  achievements: Achievement[];
  communityId?: string;
  storyProgress: number;
  season: number;
  referrals: number;
  totalEarned: {
    influence: number;
    powerTokens: number;
  };
}

export interface GameState {
  player: Player;
  currentScreen: 'home' | 'missions' | 'story' | 'community' | 'profile' | 'shop';
  supporters: number;
  influence: number;
  powerTokens: number;
  level: number;
  experience: number;
  dailyStreak: number;
  lastPlayTime: Date;
  community: Community | null;
  missions: Mission[];
  storyProgress: number;
  season: number;
  achievements: Achievement[];
  notifications: Notification[];
  currentChapter?: StoryChapter;
  selectedMission?: Mission;
  isLoading: boolean;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'story' | 'special' | 'secret';
  difficulty: 'easy' | 'medium' | 'hard';
  requirements: {
    taps?: number;
    missions?: number;
    invites?: number;
    story?: number;
    influence?: number;
  };
  rewards: {
    influence: number;
    powerTokens: number;
    experience: number;
  };
  duration: number;
  expiresAt?: Date;
  completed: boolean;
  progress: number;
}

export interface StoryChapter {
  id: number;
  title: string;
  content: string;
  type: 'story' | 'decision' | 'action' | 'puzzle';
  chapterNumber: number;
  season: number;
  rewards: {
    influence: number;
    powerTokens: number;
    experience: number;
  };
  unlocked: boolean;
  completed: boolean;
  choices?: StoryChoice[];
  miniGame?: {
    type: 'tap_rhythm' | 'lyrics_puzzle' | 'resource_strategy' | 'decision_making' | 'team_management';
    data: any;
  };
}

export interface StoryChoice {
  id: string;
  text: string;
  consequence: {
    influence: number;
    reputation: number;
    story: string;
  };
  requires?: {
    level?: number;
    skill?: string;
    item?: string;
  };
}

export interface Community {
  id: string;
  name: string;
  description: string;
  type: 'guild' | 'movement' | 'organization' | 'university_chapter';
  memberCount: number;
  maxMembers: number;
  level: number;
  experience: number;
  treasury: {
    influence: number;
    powerTokens: number;
  };
  leaderId: string;
  leaderName: string;
  rank: number;
  achievements: CommunityAchievement[];
  requirements: {
    level?: number;
    influence?: number;
    invitation?: boolean;
  };
  perks: string[];
  created: Date;
  members: CommunityMember[];
}

export interface CommunityMember {
  playerId: string;
  playerName: string;
  role: 'leader' | 'officer' | 'member';
  joinedAt: Date;
  contribution: {
    influence: number;
    powerTokens: number;
    missions: number;
  };
  rank: number;
  online: boolean;
  lastActive: Date;
}

export interface CommunityAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  reward: {
    influence: number;
    powerTokens: number;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'level' | 'rank' | 'mission' | 'story' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
  progress: number;
  target: number;
  reward: {
    influence: number;
    powerTokens: number;
  };
}

export interface Notification {
  id: string;
  type: 'reward' | 'mission' | 'community' | 'friend' | 'system' | 'event';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
  action?: {
    type: string;
    label: string;
    data: any;
  };
}

export interface Reward {
  type: 'influence' | 'power_tokens' | 'experience' | 'item' | 'achievement';
  amount: number;
  source: string;
  timestamp: Date;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: 'avatar' | 'banner' | 'effect' | 'boost' | 'pack';
  price: {
    powerTokens: number;
    influence?: number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  available: boolean;
  limited?: boolean;
  expiresAt?: Date;
  effects?: {
    influence?: number;
    powerTokens?: number;
    experience?: number;
  };
  duration?: number;
}

export interface Leaderboard {
  type: 'global' | 'regional' | 'community' | 'friends';
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  entries: LeaderboardEntry[];
  playerRank: number;
  totalPlayers: number;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  avatar?: string;
  score: number;
  change: number;
  badge?: string;
}

export interface Season {
  id: number;
  name: string;
  theme: string;
  startTime: Date;
  endTime: Date;
  rewards: {
    influence: number;
    powerTokens: number;
    items: string[];
  };
  challenges: SeasonChallenge[];
  leaderboard: Leaderboard;
}

export interface SeasonChallenge {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'community';
  requirements: any;
  rewards: {
    influence: number;
    powerTokens: number;
  };
  progress: number;
  completed: boolean;
}

export interface GameSettings {
  tapCooldown: number;
  maxDailyActions: number;
  sessionDuration: number;
  rewardMultipliers: {
    generation: {
      founder: number;
      builder: number;
      supporter: number;
      mass: number;
    };
    team: {
      solo: number;
      small: number;
      medium: number;
      large: number;
      massive: number;
    };
    events: {
      weekend: number;
      happy_hour: number;
      special: number;
    };
  };
  limits: {
    maxInfluencePerHour: number;
    maxPowerTokensPerDay: number;
    maxSupporters: number;
    maxCommunitySize: number;
  };
}
