// Game Constants

export const GAME_CONFIG = {
  // Base Rewards
  BASE_TAP_REWARD: 1,
  BASE_MISSION_REWARD: 10,
  REFERRAL_BONUS: 50,
  
  // Viral Mechanics
  FOUNDER_BONUS: 0.4, // 40%
  BUILDER_BONUS: 0.2, // 20%
  SUPPORTER_BONUS: 0.1, // 10%
  MAX_REFERRAL_DEPTH: 3,
  
  // Economy
  MAX_DAILY_EARNINGS: 1000,
  TOKEN_MINT_RATE: 0.1,
  INFLATION_CONTROL_ENABLED: true,
  
  // Session Limits (Addiction-Safe)
  MAX_SESSION_DURATION: 7 * 60 * 1000, // 7 minutes
  DAILY_SESSION_LIMIT: 10, // Maximum sessions per day
  SESSION_COOLDOWN: 3 * 60 * 60 * 1000, // 3 hours between sessions
  
  // Social Features
  MAX_COMMUNITY_SIZE: 100,
  MIN_COMMUNITY_LEVEL: 5,
  
  // Content
  CHAPTERS_PER_SEASON: 5,
  MISSIONS_PER_DAY: 5,
  SPECIAL_EVENT_FREQUENCY: 7, // days
  
  // Level Progression
  EXP_PER_LEVEL: 100,
  MAX_LEVEL: 100,
  
  // Influence Multipliers
  INFLUENCE_PER_SUPPORTER: 0.1,
  SUPPORTER_BASE_COST: 10,
  SUPPORTER_COST_MULTIPLIER: 1.15,
  
  // Story Progression
  STORY_UNLOCK_LEVELS: {
    [StoryTheme.GHETTO_ROOTS]: 1,
    [StoryTheme.VOICE_THROUGH_MUSIC]: 5,
    [StoryTheme.RISING_POPULARITY]: 15,
    [StoryTheme.CHALLENGES]: 30,
    [StoryTheme.LEADERSHIP]: 50,
  },
} as const;

// Player Rank Requirements
export const RANK_REQUIREMENTS = {
  [PlayerRank.VOICE_STARTER]: { level: 1, influence: 0 },
  [PlayerRank.ORGANIZER]: { level: 10, influence: 500 },
  [PlayerRank.INFLUENCER]: { level: 25, influence: 2500 },
  [PlayerRank.MOVEMENT_LEADER]: { level: 50, influence: 10000 },
  [PlayerRank.LEGEND]: { level: 100, influence: 50000 },
} as const;

// Generation Bonuses
export const GENERATION_BONUSES = {
  [PlayerGeneration.FOUNDERS]: 0.4,
  [PlayerGeneration.BUILDERS]: 0.2,
  [PlayerGeneration.SUPPORTERS]: 0.1,
  [PlayerGeneration.MASS_MOVEMENT]: 0.05,
} as const;

// Mission Types and Rewards
export const MISSION_CONFIG = {
  [MissionType.DAILY_TAP]: {
    baseReward: 5,
    maxProgress: 100,
    expReward: 10,
  },
  [MissionType.RECRUIT_SUPPORTERS]: {
    baseReward: 20,
    maxProgress: 10,
    expReward: 25,
  },
  [MissionType.WATCH_EDUCATIONAL]: {
    baseReward: 15,
    maxProgress: 3,
    expReward: 20,
  },
  [MissionType.ANSWER_QUIZ]: {
    baseReward: 10,
    maxProgress: 5,
    expReward: 15,
  },
  [MissionType.ORGANIZE_RALLY]: {
    baseReward: 50,
    maxProgress: 1,
    expReward: 75,
  },
  [MissionType.DEBATE_CHALLENGE]: {
    baseReward: 30,
    maxProgress: 3,
    expReward: 40,
  },
  [MissionType.COMMUNITY_QUEST]: {
    baseReward: 25,
    maxProgress: 5,
    expReward: 35,
  },
} as const;

// Community Upgrade Costs
export const COMMUNITY_UPGRADES = {
  STORAGE_LIMIT: {
    baseCost: 100,
    multiplier: 1.5,
    effect: 10, // +10 members per level
  },
  PASSIVE_INCOME: {
    baseCost: 200,
    multiplier: 2.0,
    effect: 0.05, // +5% passive income per level
  },
  MISSION_REWARD: {
    baseCost: 150,
    multiplier: 1.8,
    effect: 0.1, // +10% mission rewards per level
  },
} as const;

// Viral Event Types
export const VIRAL_EVENT_TYPES = {
  LIMITED_TIME_CAMPAIGN: {
    duration: 48 * 60 * 60 * 1000, // 48 hours
    rewardMultiplier: 2,
  },
  EMERGENCY_CHALLENGE: {
    duration: 24 * 60 * 60 * 1000, // 24 hours
    rewardMultiplier: 1.5,
  },
  DOUBLE_INFLUENCE: {
    duration: 72 * 60 * 60 * 1000, // 72 hours
    rewardMultiplier: 2,
  },
  SECRET_DROP: {
    duration: 12 * 60 * 60 * 1000, // 12 hours
    rewardMultiplier: 3,
  },
} as const;

// Session Tracking
export const SESSION_EVENTS = {
  SESSION_START: 'session_start',
  SESSION_END: 'session_end',
  TAP_ACTION: 'tap_action',
  MISSION_COMPLETE: 'mission_complete',
  STORY_PROGRESS: 'story_progress',
  SOCIAL_ACTION: 'social_action',
  PURCHASE_MADE: 'purchase_made',
  LEVEL_UP: 'level_up',
  RANK_UP: 'rank_up',
} as const;

// Achievement Types
export const ACHIEVEMENT_TYPES = {
  FIRST_TAP: 'first_tap',
  FIRST_MISSION: 'first_mission',
  FIRST_REFERRAL: 'first_referral',
  LEVEL_10: 'level_10',
  LEVEL_25: 'level_25',
  LEVEL_50: 'level_50',
  LEVEL_100: 'level_100',
  SUPPORTER_100: 'supporter_100',
  SUPPORTER_1000: 'supporter_1000',
  INFLUENCE_1000: 'influence_1000',
  INFLUENCE_10000: 'influence_10000',
  COMMUNITY_LEADER: 'community_leader',
  STORY_CHAPTER_1: 'story_chapter_1',
  STORY_CHAPTER_5: 'story_chapter_5',
  STORY_COMPLETE: 'story_complete',
  DAILY_STREAK_7: 'daily_streak_7',
  DAILY_STREAK_30: 'daily_streak_30',
  WEEKLY_CHAMPION: 'weekly_champion',
  SEASONAL_CHAMPION: 'seasonal_champion',
} as const;

// Educational Content Categories
export const EDUCATION_CATEGORIES = {
  LEADERSHIP: 'leadership',
  FINANCIAL_LITERACY: 'financial_literacy',
  TEAMWORK: 'teamwork',
  DIGITAL_ENTREPRENEURSHIP: 'digital_entrepreneurship',
  CIVIC_AWARENESS: 'civic_awareness',
  COMMUNITY_ORGANIZING: 'community_organizing',
} as const;

// Geographic Regions for Leaderboards
export const GEOGRAPHIC_REGIONS = {
  EAST_AFRICA: ['KE', 'UG', 'TZ', 'RW', 'BI'],
  WEST_AFRICA: ['NG', 'GH', 'CI', 'SN', 'ML'],
  SOUTHERN_AFRICA: ['ZA', 'ZM', 'MW', 'ZW', 'BW'],
  NORTH_AFRICA: ['EG', 'MA', 'DZ', 'TN', 'LY'],
  CENTRAL_AFRICA: ['CD', 'CM', 'GA', 'CG', 'CF'],
} as const;

// Campus Competition Tiers
export const CAMPUS_TIERS = {
  BRONZE: { minPlayers: 100, rewards: 1000 },
  SILVER: { minPlayers: 500, rewards: 5000 },
  GOLD: { minPlayers: 1000, rewards: 10000 },
  PLATINUM: { minPlayers: 5000, rewards: 50000 },
  DIAMOND: { minPlayers: 10000, rewards: 100000 },
} as const;

// Import enums for type usage
import { PlayerRank, PlayerGeneration, MissionType, StoryTheme } from '../types';
