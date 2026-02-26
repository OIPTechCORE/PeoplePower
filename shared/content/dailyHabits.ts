export interface DailyHabit {
  id: string;
  name: string;
  category: 'engagement' | 'social' | 'learning' | 'community' | 'personal_growth';
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  frequency: 'daily' | 'weekly' | 'monthly';
  timeRequired: number; // minutes
  rewards: HabitReward;
  streakBonus: StreakBonus;
  requirements: HabitRequirement[];
  visualTheme: HabitVisualTheme;
  emotionalImpact: EmotionalImpact;
  socialProof: SocialProof;
  progression: HabitProgression;
}

export interface HabitReward {
  baseExperience: number;
  baseInfluence: number;
  basePowerTokens: number;
  streakMultiplier: number;
  perfectBonus: number;
  timeBonus: number;
}

export interface StreakBonus {
  multiplier: number;
  thresholds: number[]; // [7, 14, 30, 60, 100, 365]
  rewards: {
    [key: number]: {
      experience: number;
      influence: number;
      powerTokens: number;
      exclusiveReward: string;
    };
  };
}

export interface HabitRequirement {
  type: 'level' | 'supporters' | 'completed_missions' | 'time_of_day' | 'previous_habits';
  value: number | string;
  description: string;
}

export interface HabitVisualTheme {
  icon: string;
  color: string;
  animation: 'pulse' | 'bounce' | 'slide' | 'rotate' | 'glow';
  particleEffect: string;
  backgroundPattern: string;
}

export interface EmotionalImpact {
  primary: 'motivation' | 'achievement' | 'connection' | 'growth' | 'purpose';
  secondary: 'excitement' | 'pride' | 'gratitude' | 'hope' | 'confidence';
  intensity: number; // 1-10
  duration: number; // minutes of emotional effect
}

export interface SocialProof {
  shareable: boolean;
  template: string;
  visibility: 'private' | 'friends' | 'community' | 'public';
  badge: string;
  title: string;
}

export interface HabitProgression {
  levels: number;
  currentLevel: number;
  experienceToNext: number;
  unlockedFeatures: string[];
  masteryChallenges: MasteryChallenge[];
}

export interface MasteryChallenge {
  id: string;
  name: string;
  description: string;
  requirement: string;
  reward: string;
  isCompleted: boolean;
}

export const DAILY_HABITS: DailyHabit[] = [
  {
    id: 'morning_routine',
    name: 'Morning Movement Check-in',
    category: 'engagement',
    description: 'Start your day with purpose. Check in with your movement and set daily intentions.',
    difficulty: 'easy',
    frequency: 'daily',
    timeRequired: 3,
    rewards: {
      baseExperience: 25,
      baseInfluence: 15,
      basePowerTokens: 5,
      streakMultiplier: 1.5,
      perfectBonus: 50,
      timeBonus: 20
    },
    streakBonus: {
      multiplier: 2.0,
      thresholds: [7, 14, 30, 60, 100, 365],
      rewards: {
        7: { experience: 100, influence: 50, powerTokens: 20, exclusiveReward: 'early_bird_badge' },
        14: { experience: 250, influence: 125, powerTokens: 50, exclusiveReward: 'consistency_title' },
        30: { experience: 500, influence: 250, powerTokens: 100, exclusiveReward: 'monthly_master' },
        60: { experience: 1000, influence: 500, powerTokens: 200, exclusiveReward: 'dedication_aura' },
        100: { experience: 2000, influence: 1000, powerTokens: 400, exclusiveReward: 'century_legend' },
        365: { experience: 10000, influence: 5000, powerTokens: 2000, exclusiveReward: 'yearly_immortal' }
      }
    },
    requirements: [
      { type: 'level', value: 1, description: 'Reach level 1' }
    ],
    visualTheme: {
      icon: '☀️',
      color: '#FFD700',
      animation: 'glow',
      particleEffect: 'sunrise_sparkles',
      backgroundPattern: 'morning_gradient'
    },
    emotionalImpact: {
      primary: 'motivation',
      secondary: 'hope',
      intensity: 7,
      duration: 60
    },
    socialProof: {
      shareable: true,
      template: 'Started my day with purpose! 🌅 Day {streak} of consistent morning check-ins.',
      visibility: 'community',
      badge: 'morning_champion',
      title: 'Early Riser'
    },
    progression: {
      levels: 10,
      currentLevel: 1,
      experienceToNext: 100,
      unlockedFeatures: ['basic_checkin'],
      masteryChallenges: [
        {
          id: 'perfect_week',
          name: 'Perfect Week',
          description: 'Complete morning check-in for 7 consecutive days',
          requirement: '7_day_streak',
          reward: 'morning_master_badge',
          isCompleted: false
        }
      ]
    }
  },
  {
    id: 'community_engagement',
    name: 'Community Connection',
    category: 'social',
    description: 'Connect with your movement community. Support others and build relationships.',
    difficulty: 'medium',
    frequency: 'daily',
    timeRequired: 10,
    rewards: {
      baseExperience: 50,
      baseInfluence: 40,
      basePowerTokens: 10,
      streakMultiplier: 1.8,
      perfectBonus: 100,
      timeBonus: 30
    },
    streakBonus: {
      multiplier: 2.5,
      thresholds: [7, 14, 30, 60, 100, 365],
      rewards: {
        7: { experience: 200, influence: 150, powerTokens: 40, exclusiveReward: 'social_butterfly' },
        14: { experience: 500, influence: 375, powerTokens: 100, exclusiveReward: 'community_builder' },
        30: { experience: 1000, influence: 750, powerTokens: 200, exclusiveReward: 'social_master' },
        60: { experience: 2000, influence: 1500, powerTokens: 400, exclusiveReward: 'connection_legend' },
        100: { experience: 4000, influence: 3000, powerTokens: 800, exclusiveReward: 'social_immortal' },
        365: { experience: 20000, influence: 15000, powerTokens: 4000, exclusiveReward: 'community_god' }
      }
    },
    requirements: [
      { type: 'level', value: 5, description: 'Reach level 5' },
      { type: 'supporters', value: 10, description: 'Have at least 10 supporters' }
    ],
    visualTheme: {
      icon: '🤝',
      color: '#FF6B6B',
      animation: 'pulse',
      particleEffect: 'heart_particles',
      backgroundPattern: 'connection_network'
    },
    emotionalImpact: {
      primary: 'connection',
      secondary: 'gratitude',
      intensity: 8,
      duration: 90
    },
    socialProof: {
      shareable: true,
      template: 'Building stronger communities every day! 🤝 Connected with {connections} people today.',
      visibility: 'public',
      badge: 'social_connector',
      title: 'Community Builder'
    },
    progression: {
      levels: 15,
      currentLevel: 1,
      experienceToNext: 200,
      unlockedFeatures: ['basic_interactions'],
      masteryChallenges: [
        {
          id: 'influencer',
          name: 'Social Influencer',
          description: 'Help 50 new players complete their first mission',
          requirement: 'mentor_50_players',
          reward: 'influencer_badge',
          isCompleted: false
        }
      ]
    }
  },
  {
    id: 'learning_session',
    name: 'Leadership Learning',
    category: 'learning',
    description: 'Expand your knowledge and skills. Complete educational content to grow as a leader.',
    difficulty: 'medium',
    frequency: 'daily',
    timeRequired: 15,
    rewards: {
      baseExperience: 75,
      baseInfluence: 30,
      basePowerTokens: 15,
      streakMultiplier: 2.0,
      perfectBonus: 150,
      timeBonus: 40
    },
    streakBonus: {
      multiplier: 3.0,
      thresholds: [7, 14, 30, 60, 100, 365],
      rewards: {
        7: { experience: 300, influence: 100, powerTokens: 60, exclusiveReward: 'knowledge_seeker' },
        14: { experience: 750, influence: 250, powerTokens: 150, exclusiveReward: 'learning_master' },
        30: { experience: 1500, influence: 500, powerTokens: 300, exclusiveReward: 'wisdom_keeper' },
        60: { experience: 3000, influence: 1000, powerTokens: 600, exclusiveReward: 'knowledge_legend' },
        100: { experience: 6000, influence: 2000, powerTokens: 1200, exclusiveReward: 'learning_immortal' },
        365: { experience: 30000, influence: 10000, powerTokens: 6000, exclusiveReward: 'wisdom_god' }
      }
    },
    requirements: [
      { type: 'level', value: 3, description: 'Reach level 3' }
    ],
    visualTheme: {
      icon: '📚',
      color: '#4ECDC4',
      animation: 'slide',
      particleEffect: 'knowledge_sparkles',
      backgroundPattern: 'book_gradient'
    },
    emotionalImpact: {
      primary: 'growth',
      secondary: 'confidence',
      intensity: 6,
      duration: 120
    },
    socialProof: {
      shareable: true,
      template: 'Never stop growing! 📚 Completed {lessons} lessons today. Day {streak} of continuous learning.',
      visibility: 'friends',
      badge: 'knowledge_hunter',
      title: 'Lifelong Learner'
    },
    progression: {
      levels: 20,
      currentLevel: 1,
      experienceToNext: 300,
      unlockedFeatures: ['basic_lessons'],
      masteryChallenges: [
        {
          id: 'scholar',
          name: 'Movement Scholar',
          description: 'Complete all educational content in one category',
          requirement: 'complete_category_lessons',
          reward: 'scholar_badge',
          isCompleted: false
        }
      ]
    }
  },
  {
    id: 'movement_building',
    name: 'Movement Expansion',
    category: 'community',
    description: 'Grow the movement! Recruit new members and expand your influence.',
    difficulty: 'hard',
    frequency: 'daily',
    timeRequired: 20,
    rewards: {
      baseExperience: 100,
      baseInfluence: 80,
      basePowerTokens: 25,
      streakMultiplier: 2.5,
      perfectBonus: 200,
      timeBonus: 50
    },
    streakBonus: {
      multiplier: 3.5,
      thresholds: [7, 14, 30, 60, 100, 365],
      rewards: {
        7: { experience: 500, influence: 400, powerTokens: 100, exclusiveReward: 'recruiter_badge' },
        14: { experience: 1250, influence: 1000, powerTokens: 250, exclusiveReward: 'movement_builder' },
        30: { experience: 2500, influence: 2000, powerTokens: 500, exclusiveReward: 'expansion_master' },
        60: { experience: 5000, influence: 4000, powerTokens: 1000, exclusiveReward: 'growth_legend' },
        100: { experience: 10000, influence: 8000, powerTokens: 2000, exclusiveReward: 'expansion_immortal' },
        365: { experience: 50000, influence: 40000, powerTokens: 10000, exclusiveReward: 'movement_titan' }
      }
    },
    requirements: [
      { type: 'level', value: 10, description: 'Reach level 10' },
      { type: 'supporters', value: 50, description: 'Have at least 50 supporters' }
    ],
    visualTheme: {
      icon: '🚀',
      color: '#9B59B6',
      animation: 'bounce',
      particleEffect: 'growth_bursts',
      backgroundPattern: 'explosion_gradient'
    },
    emotionalImpact: {
      primary: 'achievement',
      secondary: 'excitement',
      intensity: 9,
      duration: 150
    },
    socialProof: {
      shareable: true,
      template: 'Building the future! 🚀 Recruited {recruits} new members today. Movement growing stronger!',
      visibility: 'public',
      badge: 'growth_engine',
      title: 'Movement Architect'
    },
    progression: {
      levels: 25,
      currentLevel: 1,
      experienceToNext: 500,
      unlockedFeatures: ['basic_recruitment'],
      masteryChallenges: [
        {
          id: 'movement_leader',
          name: 'Movement Leader',
          description: 'Recruit 1000 supporters to your movement',
          requirement: 'recruit_1000_supporters',
          reward: 'leader_badge',
          isCompleted: false
        }
      ]
    }
  },
  {
    id: 'personal_reflection',
    name: 'Leadership Reflection',
    category: 'personal_growth',
    description: 'Reflect on your journey, set intentions, and grow as a leader through self-awareness.',
    difficulty: 'extreme',
    frequency: 'daily',
    timeRequired: 25,
    rewards: {
      baseExperience: 150,
      baseInfluence: 100,
      basePowerTokens: 40,
      streakMultiplier: 4.0,
      perfectBonus: 300,
      timeBonus: 75
    },
    streakBonus: {
      multiplier: 5.0,
      thresholds: [7, 14, 30, 60, 100, 365],
      rewards: {
        7: { experience: 750, influence: 500, powerTokens: 200, exclusiveReward: 'reflection_master' },
        14: { experience: 1875, influence: 1250, powerTokens: 500, exclusiveReward: 'wisdom_seeker' },
        30: { experience: 3750, influence: 2500, powerTokens: 1000, exclusiveReward: 'inner_growth' },
        60: { experience: 7500, influence: 5000, powerTokens: 2000, exclusiveReward: 'self_mastery' },
        100: { experience: 15000, influence: 10000, powerTokens: 4000, exclusiveReward: 'enlightenment' },
        365: { experience: 75000, influence: 50000, powerTokens: 20000, exclusiveReward: 'transcendence' }
      }
    },
    requirements: [
      { type: 'level', value: 15, description: 'Reach level 15' },
      { type: 'completed_missions', value: 50, description: 'Complete 50 missions' }
    ],
    visualTheme: {
      icon: '🧘',
      color: '#E74C3C',
      animation: 'rotate',
      particleEffect: 'zen_particles',
      backgroundPattern: 'meditation_gradient'
    },
    emotionalImpact: {
      primary: 'purpose',
      secondary: 'pride',
      intensity: 10,
      duration: 180
    },
    socialProof: {
      shareable: false, // Personal and private
      template: '',
      visibility: 'private',
      badge: 'inner_master',
      title: 'Enlightened Leader'
    },
    progression: {
      levels: 30,
      currentLevel: 1,
      experienceToNext: 750,
      unlockedFeatures: ['basic_reflection'],
      masteryChallenges: [
        {
          id: 'enlightened',
          name: 'Enlightened Leader',
          description: 'Complete 365 consecutive days of reflection',
          requirement: 'year_reflection_streak',
          reward: 'enlightenment_badge',
          isCompleted: false
        }
      ]
    }
  }
];

// Dynamic habit generation system
export interface DynamicHabitGenerator {
  generatePersonalizedHabits: (playerProfile: PlayerProfile) => DailyHabit[];
  generateSeasonalHabits: (season: string) => DailyHabit[];
  generateChallengeHabits: (challengeType: string) => DailyHabit[];
  generateCommunityHabits: (communityLevel: number) => DailyHabit[];
}

export interface PlayerProfile {
  level: number;
  supporters: number;
  completedMissions: number;
  interests: string[];
  personality: string[];
  playStyle: string;
  timeAvailable: number; // minutes per day
  socialPreference: 'private' | 'friends' | 'community' | 'public';
}

export const generatePersonalizedHabits = (playerProfile: PlayerProfile): DailyHabit[] => {
  const baseHabits = [...DAILY_HABITS];
  const personalizedHabits: DailyHabit[] = [];

  // Filter habits based on player level and requirements
  const availableHabits = baseHabits.filter(habit => {
    return habit.requirements.every(req => {
      switch (req.type) {
        case 'level':
          return playerProfile.level >= (req.value as number);
        case 'supporters':
          return playerProfile.supporters >= (req.value as number);
        case 'completed_missions':
          return playerProfile.completedMissions >= (req.value as number);
        default:
          return true;
      }
    });
  });

  // Personalize based on interests
  availableHabits.forEach(habit => {
    if (playerProfile.interests.includes(habit.category)) {
      // Boost rewards for interested categories
      habit.rewards.baseExperience *= 1.2;
      habit.rewards.baseInfluence *= 1.2;
      habit.rewards.basePowerTokens *= 1.2;
    }
  });

  // Adjust difficulty based on play style
  if (playerProfile.playStyle === 'casual') {
    availableHabits.forEach(habit => {
      habit.timeRequired *= 0.7;
      habit.rewards.baseExperience *= 0.8;
    });
  } else if (playerProfile.playStyle === 'hardcore') {
    availableHabits.forEach(habit => {
      habit.timeRequired *= 1.3;
      habit.rewards.baseExperience *= 1.5;
    });
  }

  return availableHabits;
};

export const generateSeasonalHabits = (season: string): DailyHabit[] => {
  const seasonalModifiers = {
    'founders_era': {
      multiplier: 1.5,
      theme: 'genesis',
      exclusiveRewards: ['founders_badge', 'genesis_aura']
    },
    'builders_era': {
      multiplier: 2.0,
      theme: 'construction',
      exclusiveRewards: ['builders_badge', 'construction_tools']
    },
    'supporters_era': {
      multiplier: 3.0,
      theme: 'mass_movement',
      exclusiveRewards: ['supporters_badge', 'movement_crown']
    }
  };

  const modifier = seasonalModifiers[season as keyof typeof seasonalModifiers];
  if (!modifier) return DAILY_HABITS;

  return DAILY_HABITS.map(habit => ({
    ...habit,
    rewards: {
      ...habit.rewards,
      baseExperience: Math.round(habit.rewards.baseExperience * modifier.multiplier),
      baseInfluence: Math.round(habit.rewards.baseInfluence * modifier.multiplier),
      basePowerTokens: Math.round(habit.rewards.basePowerTokens * modifier.multiplier)
    },
    visualTheme: {
      ...habit.visualTheme,
      particleEffect: `${modifier.theme}_${habit.visualTheme.particleEffect}`
    }
  }));
};

// Habit tracking and analytics
export interface HabitAnalytics {
  totalHabitsCompleted: number;
  currentStreaks: { [habitId: string]: number };
  longestStreaks: { [habitId: string]: number };
  completionRates: { [habitId: string]: number };
  bestPerformanceTimes: { [habitId: string]: string };
  emotionalImpactHistory: EmotionalImpact[];
  socialSharesGenerated: number;
  communityImpactScore: number;
}

export const calculateHabitImpact = (habit: DailyHabit, streak: number): number => {
  let baseImpact = habit.rewards.baseExperience + habit.rewards.baseInfluence + habit.rewards.basePowerTokens;
  
  // Apply streak multiplier
  baseImpact *= Math.pow(habit.streakBonus.multiplier, Math.floor(streak / 7));
  
  // Apply emotional intensity
  baseImpact *= (1 + habit.emotionalImpact.intensity / 10);
  
  // Apply social proof bonus
  if (habit.socialProof.shareable) {
    baseImpact *= 1.2;
  }
  
  return Math.round(baseImpact);
};

export const getNextHabitMilestone = (habit: DailyHabit, currentStreak: number): number | null => {
  const nextThreshold = habit.streakBonus.thresholds.find(threshold => threshold > currentStreak);
  return nextThreshold || null;
};

export const getHabitMotivationMessage = (habit: DailyHabit, streak: number): string => {
  const messages = {
    1: "Great start! Every journey begins with a single step.",
    3: "Three days strong! You're building momentum.",
    7: "A full week! You're creating lasting change.",
    14: "Two weeks! Your consistency is inspiring.",
    30: "A month of dedication! You're transforming yourself.",
    60: "Two months! Your commitment is extraordinary.",
    100: "100 days! You're building a legacy.",
    365: "A full year! You've achieved mastery."
  };

  return messages[streak as keyof typeof messages] || "Keep going! Your consistency creates impact.";
};
