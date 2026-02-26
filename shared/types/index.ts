// Core Game Types

export interface Player {
  id: string;
  telegramId: number;
  username: string;
  displayName: string;
  avatar?: string;
  
  // Game Progress
  level: number;
  rank: PlayerRank;
  experience: number;
  influence: number;
  supporters: number;
  
  // Economy
  powerTokens: number;
  totalEarned: number;
  
  // Social
  referralCode: string;
  referredBy?: string;
  referralsCount: number;
  communityId?: string;
  
  // Status
  isActive: boolean;
  lastActiveAt: Date;
  joinedAt: Date;
  
  // Genesis Era
  generation: PlayerGeneration;
  permanentBonus: number;
  
  // Achievements
  titles: string[];
  badges: Badge[];
  seasonalAchievements: SeasonalAchievement[];
}

export enum PlayerRank {
  VOICE_STARTER = 'VOICE_STARTER',
  ORGANIZER = 'ORGANIZER',
  INFLUENCER = 'INFLUENCER',
  MOVEMENT_LEADER = 'MOVEMENT_LEADER',
  LEGEND = 'LEGEND'
}

export enum PlayerGeneration {
  FOUNDERS = 'FOUNDERS',
  BUILDERS = 'BUILDERS',
  SUPPORTERS = 'SUPPORTERS',
  MASS_MOVEMENT = 'MASS_MOVEMENT'
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: Date;
}

export interface SeasonalAchievement {
  season: number;
  achievements: string[];
  rewards: Reward[];
}

// Story System
export interface StoryChapter {
  id: string;
  title: string;
  theme: StoryTheme;
  order: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  
  // Content
  narrative: StoryScene[];
  missions: StoryMission[];
  
  // Rewards
  completionRewards: Reward[];
  unlockRequirements: Requirement[];
}

export enum StoryTheme {
  GHETTO_ROOTS = 'GHETTO_ROOTS',
  VOICE_THROUGH_MUSIC = 'VOICE_THROUGH_MUSIC',
  RISING_POPULARITY = 'RISING_POPULARITY',
  CHALLENGES = 'CHALLENGES',
  LEADERSHIP = 'LEADERSHIP'
}

export interface StoryScene {
  id: string;
  type: 'text' | 'dialogue' | 'choice' | 'mini-game';
  content: string;
  choices?: StoryChoice[];
  miniGameType?: MiniGameType;
}

export interface StoryChoice {
  id: string;
  text: string;
  consequence: string;
  rewards: Reward[];
}

export interface StoryMission {
  id: string;
  title: string;
  description: string;
  type: MissionType;
  requirements: Requirement[];
  rewards: Reward[];
  isCompleted: boolean;
}

// Mission System
export enum MissionType {
  DAILY_TAP = 'DAILY_TAP',
  RECRUIT_SUPPORTERS = 'RECRUIT_SUPPORTERS',
  WATCH_EDUCATIONAL = 'WATCH_EDUCATIONAL',
  ANSWER_QUIZ = 'ANSWER_QUIZ',
  ORGANIZE_RALLY = 'ORGANIZE_RALLY',
  DEBATE_CHALLENGE = 'DEBATE_CHALLENGE',
  COMMUNITY_QUEST = 'COMMUNITY_QUEST'
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: MissionType;
  category: 'daily' | 'weekly' | 'story' | 'special';
  
  // Requirements & Rewards
  requirements: Requirement[];
  rewards: Reward[];
  
  // Status
  isAvailable: boolean;
  isCompleted: boolean;
  progress: number;
  maxProgress: number;
  
  // Timing
  expiresAt?: Date;
  resetAt?: Date;
}

export interface Requirement {
  type: 'level' | 'influence' | 'supporters' | 'chapter' | 'mission';
  value: number | string;
  operator: 'gte' | 'equals' | 'lte';
}

export interface Reward {
  type: 'influence' | 'power_tokens' | 'supporters' | 'experience' | 'badge' | 'title';
  value: number | string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

// Mini-Games
export enum MiniGameType {
  TAP_RHYTHM = 'TAP_RHYTHM',
  LYRICS_PUZZLE = 'LYRICS_PUZZLE',
  RESOURCE_STRATEGY = 'RESOURCE_STRATEGY',
  DECISION_MAKING = 'DECISION_MAKING',
  TEAM_MANAGEMENT = 'TEAM_MANAGEMENT'
}

export interface MiniGameSession {
  id: string;
  playerId: string;
  type: MiniGameType;
  startedAt: Date;
  completedAt?: Date;
  score: number;
  rewards: Reward[];
  isCompleted: boolean;
}

// Community System
export interface Community {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  
  // Leadership
  leaderId: string;
  officers: string[];
  
  // Members
  memberCount: number;
  members: CommunityMember[];
  
  // Progress
  level: number;
  experience: number;
  upgrades: CommunityUpgrade[];
  
  // Social
  isPublic: boolean;
  joinCode?: string;
  requiredLevel: number;
  
  // Created
  createdAt: Date;
}

export interface CommunityMember {
  playerId: string;
  role: 'leader' | 'officer' | 'member';
  joinedAt: Date;
  contribution: number;
  weeklyActivity: number;
}

export interface CommunityUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: UpgradeEffect;
  isPurchased: boolean;
  purchasedAt?: Date;
}

export interface UpgradeEffect {
  type: 'passive_income' | 'member_bonus' | 'mission_reward' | 'storage_limit';
  value: number;
  duration?: number; // in hours, null = permanent
}

// Viral Mechanics
export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  referredUsername: string;
  status: 'pending' | 'active' | 'completed';
  completedAt?: Date;
  rewards: Reward[];
}

export interface ViralEvent {
  id: string;
  name: string;
  description: string;
  type: 'limited_time' | 'emergency' | 'double_rewards' | 'secret_drop';
  
  // Timing
  startsAt: Date;
  endsAt: Date;
  
  // Rewards
  rewards: Reward[];
  
  // Requirements
  requirements: Requirement[];
  
  // Status
  isActive: boolean;
  participantCount: number;
}

// Leaderboard System
export interface Leaderboard {
  id: string;
  name: string;
  type: 'global' | 'regional' | 'community' | 'campus';
  period: 'daily' | 'weekly' | 'seasonal' | 'all_time';
  
  // Entries
  entries: LeaderboardEntry[];
  
  // Timing
  startsAt: Date;
  endsAt: Date;
  resetsAt: Date;
}

export interface LeaderboardEntry {
  playerId: string;
  rank: number;
  score: number;
  displayName: string;
  avatar?: string;
  badges: string[];
  change: number; // rank change from previous period
}

// Economy System
export interface TokenTransaction {
  id: string;
  playerId: string;
  type: 'earned' | 'spent' | 'bonus' | 'penalty';
  amount: number;
  source: string; // mission, referral, upgrade, etc.
  description: string;
  createdAt: Date;
}

export interface EconomyState {
  totalPlayers: number;
  activePlayers: number;
  totalTokensMinted: number;
  totalTokensBurned: number;
  circulatingSupply: number;
  lastUpdateAt: Date;
}

// Session Management
export interface GameSession {
  id: string;
  playerId: string;
  startedAt: Date;
  lastActivityAt: Date;
  actions: SessionAction[];
  
  // Metrics
  sessionDuration: number;
  influenceGained: number;
  missionsCompleted: number;
  tokensEarned: number;
}

export interface SessionAction {
  type: 'tap' | 'mission_complete' | 'story_progress' | 'social_action';
  timestamp: Date;
  data: any;
}

// Analytics & Impact
export interface ImpactMetrics {
  date: Date;
  activeUsers: number;
  newUsers: number;
  missionsCompleted: number;
  learningSessionsCompleted: number;
  communitiesFormed: number;
  geographicDistribution: GeographicData[];
  ageDemographics: AgeDemographicData;
}

export interface GeographicData {
  country: string;
  city?: string;
  userCount: number;
  activeUsers: number;
}

export interface AgeDemographicData {
  ageRange: string;
  count: number;
  percentage: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Telegram Integration
export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

export interface TelegramInitData {
  query_id: string;
  user: TelegramUser;
  auth_date: number;
  hash: string;
}

// Configuration
export interface GameConfig {
  // Base rewards
  baseTapReward: number;
  baseMissionReward: number;
  referralBonus: number;
  
  // Viral mechanics
  founderBonus: number;
  builderBonus: number;
  maxReferralDepth: number;
  
  // Economy
  maxDailyEarnings: number;
  tokenMintRate: number;
  inflationControl: boolean;
  
  // Session limits
  maxSessionDuration: number;
  dailySessionLimit: number;
  
  // Social features
  maxCommunitySize: number;
  minCommunityLevel: number;
  
  // Content
  chaptersPerSeason: number;
  missionsPerDay: number;
  specialEventFrequency: number;
}
