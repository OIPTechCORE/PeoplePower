import { Player, PlayerRank, PlayerGeneration, MissionType, StoryTheme } from '../types';
import { GAME_CONFIG, RANK_REQUIREMENTS, GENERATION_BONUSES } from '../constants';

// Player Utility Functions
export const calculatePlayerRank = (player: Player): PlayerRank => {
  for (const [rank, requirements] of Object.entries(RANK_REQUIREMENTS)) {
    if (player.level >= requirements.level && player.influence >= requirements.influence) {
      return rank as PlayerRank;
    }
  }
  return PlayerRank.VOICE_STARTER;
};

export const calculateTotalBonus = (player: Player): number => {
  const generationBonus = GENERATION_BONUSES[player.generation];
  const rankBonus = getRankBonus(player.rank);
  return generationBonus + rankBonus;
};

export const getRankBonus = (rank: PlayerRank): number => {
  switch (rank) {
    case PlayerRank.LEGEND:
      return 0.25; // 25%
    case PlayerRank.MOVEMENT_LEADER:
      return 0.15; // 15%
    case PlayerRank.INFLUENCER:
      return 0.1; // 10%
    case PlayerRank.ORGANIZER:
      return 0.05; // 5%
    default:
      return 0;
  }
};

export const calculateSupporterCost = (currentSupporters: number): number => {
  return Math.floor(
    GAME_CONFIG.SUPPORTER_BASE_COST * 
    Math.pow(GAME_CONFIG.SUPPORTER_COST_MULTIPLIER, currentSupporters)
  );
};

export const calculatePassiveIncome = (player: Player): number => {
  return player.supporters * GAME_CONFIG.INFLUENCE_PER_SUPPORTER * (1 + calculateTotalBonus(player));
};

export const canAffordSupporter = (player: Player, cost: number): boolean => {
  return player.influence >= cost;
};

export const calculateExperienceToNextLevel = (player: Player): number => {
  if (player.level >= GAME_CONFIG.MAX_LEVEL) return 0;
  return GAME_CONFIG.EXP_PER_LEVEL - (player.experience % GAME_CONFIG.EXP_PER_LEVEL);
};

export const isLevelUp = (experience: number, currentLevel: number): boolean => {
  const newLevel = Math.floor(experience / GAME_CONFIG.EXP_PER_LEVEL);
  return newLevel > currentLevel;
};

// Mission Utility Functions
export const getMissionReward = (type: MissionType, playerLevel: number): number => {
  const baseReward = GAME_CONFIG.BASE_MISSION_REWARD;
  const levelMultiplier = 1 + (playerLevel * 0.02); // 2% per level
  return Math.floor(baseReward * levelMultiplier);
};

export const isMissionAvailable = (type: MissionType, playerLevel: number): boolean => {
  switch (type) {
    case MissionType.ORGANIZE_RALLY:
      return playerLevel >= 20;
    case MissionType.DEBATE_CHALLENGE:
      return playerLevel >= 15;
    case MissionType.COMMUNITY_QUEST:
      return playerLevel >= 10;
    default:
      return true;
  }
};

export const calculateMissionProgress = (
  current: number,
  required: number
): { progress: number; isCompleted: boolean } => {
  const progress = Math.min(current, required);
  return {
    progress,
    isCompleted: progress >= required,
  };
};

// Story Utility Functions
export const isChapterUnlocked = (theme: StoryTheme, playerLevel: number): boolean => {
  return playerLevel >= GAME_CONFIG.STORY_UNLOCK_LEVELS[theme];
};

export const getNextChapter = (currentChapter: string): string | null => {
  const chapters = Object.values(StoryTheme);
  const currentIndex = chapters.indexOf(currentChapter as StoryTheme);
  return currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;
};

// Viral Mechanics Utilities
export const generateReferralCode = (playerId: string): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const calculateReferralReward = (
  referralLevel: number,
  referrerBonus: number
): number => {
  const baseReward = GAME_CONFIG.REFERRAL_BONUS;
  const depthMultiplier = Math.max(0.1, 1 - (referralLevel * 0.3)); // Decreasing rewards for deeper levels
  return Math.floor(baseReward * depthMultiplier * (1 + referrerBonus));
};

export const shouldTriggerVariableReward = (actionCount: number): boolean => {
  // Random chance every 7-15 actions
  const minActions = 7;
  const maxActions = 15;
  const chance = 0.15; // 15% chance when in range
  
  return actionCount >= minActions && 
         actionCount <= maxActions && 
         Math.random() < chance;
};

// Time-based Utilities
export const isSessionExpired = (lastActivity: Date, maxDuration: number): boolean => {
  return Date.now() - lastActivity.getTime() > maxDuration;
};

export const canStartNewSession = (
  lastSessionEnd: Date,
  cooldownPeriod: number,
  sessionsToday: number
): boolean => {
  const cooldownPassed = Date.now() - lastSessionEnd.getTime() > cooldownPeriod;
  const underLimit = sessionsToday < GAME_CONFIG.DAILY_SESSION_LIMIT;
  return cooldownPassed && underLimit;
};

export const getTimeUntilNextSession = (
  lastSessionEnd: Date,
  cooldownPeriod: number
): number => {
  const timePassed = Date.now() - lastSessionEnd.getTime();
  return Math.max(0, cooldownPeriod - timePassed);
};

export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return Math.floor(num).toString();
};

// Community Utilities
export const calculateCommunityLevel = (experience: number): number => {
  return Math.floor(experience / 500) + 1; // 500 XP per community level
};

export const getCommunityCapacity = (level: number): number => {
  return GAME_CONFIG.MAX_COMMUNITY_SIZE + (level * 20); // +20 members per level
};

export const calculateUpgradeCost = (
  baseCost: number,
  currentLevel: number,
  multiplier: number
): number => {
  return Math.floor(baseCost * Math.pow(multiplier, currentLevel));
};

// Leaderboard Utilities
export const calculateLeaderboardScore = (player: Player): number => {
  const influenceWeight = 0.4;
  const supporterWeight = 0.3;
  const levelWeight = 0.2;
  const referralWeight = 0.1;

  return Math.floor(
    player.influence * influenceWeight +
    player.supporters * supporterWeight * 10 +
    player.level * levelWeight * 100 +
    player.referralsCount * referralWeight * 50
  );
};

export const getRankChange = (
  currentRank: number,
  previousRank: number
): { change: number; display: string } => {
  const change = previousRank - currentRank;
  let display = '';
  
  if (change > 0) {
    display = `↑${change}`;
  } else if (change < 0) {
    display = `↓${Math.abs(change)}`;
  } else {
    display = '=';
  }
  
  return { change, display };
};

// Validation Utilities
export const isValidTelegramUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{5,32}$/;
  return usernameRegex.test(username);
};

export const isValidReferralCode = (code: string): boolean => {
  const codeRegex = /^[A-Z0-9]{8}$/;
  return codeRegex.test(code);
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Analytics Utilities
export const calculateRetentionRate = (
  initialUsers: number,
  retainedUsers: number
): number => {
  if (initialUsers === 0) return 0;
  return (retainedUsers / initialUsers) * 100;
};

export const calculateDailyActiveUsers = (sessions: any[]): number => {
  const uniqueUsers = new Set(sessions.map(session => session.playerId));
  return uniqueUsers.size;
};

export const calculateAverageSessionDuration = (sessions: any[]): number => {
  if (sessions.length === 0) return 0;
  const totalDuration = sessions.reduce((sum, session) => sum + session.sessionDuration, 0);
  return Math.floor(totalDuration / sessions.length);
};

// Random Utilities
export const weightedRandom = <T>(items: T[], weights: number[]): T => {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return items[i];
    }
  }
  
  return items[items.length - 1];
};

export const chance = (percentage: number): boolean => {
  return Math.random() * 100 < percentage;
};

export const randomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Error Handling Utilities
export class GameError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'GameError';
  }
}

export const handleGameError = (error: any): { message: string; code: string; statusCode: number } => {
  if (error instanceof GameError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    };
  }
  
  return {
    message: 'An unexpected error occurred',
    code: 'INTERNAL_ERROR',
    statusCode: 500,
  };
};
