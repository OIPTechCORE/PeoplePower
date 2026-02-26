export interface Competition {
  id: string;
  name: string;
  type: 'individual' | 'team' | 'community' | 'regional' | 'global';
  category: 'growth' | 'engagement' | 'leadership' | 'creativity' | 'strategy' | 'endurance';
  difficulty: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'legendary';
  duration: CompetitionDuration;
  entryRequirements: CompetitionRequirement[];
  rewards: CompetitionRewards;
  leaderboard: LeaderboardConfig;
  mechanics: CompetitionMechanics;
  visualTheme: CompetitionVisualTheme;
  socialFeatures: SocialFeatures;
  progression: CompetitionProgression;
}

export interface CompetitionDuration {
  type: 'instant' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'endless';
  startTime: string;
  endTime?: string;
  resetSchedule?: string; // For recurring competitions
  phases?: CompetitionPhase[];
}

export interface CompetitionPhase {
  name: string;
  duration: number; // hours
  description: string;
  specialRules: string[];
  multiplier: number;
}

export interface CompetitionRequirement {
  type: 'level' | 'supporters' | 'previous_wins' | 'community_rank' | 'seasonal_points' | 'payment';
  value: number | string;
  description: string;
}

export interface CompetitionRewards {
  participation: RewardTier[];
  placement: {
    [rank: string]: RewardTier;
  };
  special: SpecialReward[];
  cumulative: CumulativeReward;
}

export interface RewardTier {
  rank: string;
  experience: number;
  influence: number;
  powerTokens: number;
  exclusiveItems: string[];
  titles: string[];
  badges: string[];
  visualEffects: string[];
}

export interface SpecialReward {
  name: string;
  description: string;
  condition: string;
  rarity: 'rare' | 'epic' | 'legendary' | 'mythic';
  reward: string;
}

export interface CumulativeReward {
  type: 'streak' | 'participation' | 'improvement' | 'consistency';
  description: string;
  thresholds: {
    [key: number]: RewardTier;
  };
}

export interface LeaderboardConfig {
  type: 'real_time' | 'periodic' | 'final';
  updateFrequency: number; // minutes
  maxEntries: number;
  categories: string[];
  filters: LeaderboardFilter[];
  specialRanks: SpecialRank[];
}

export interface LeaderboardFilter {
  type: 'region' | 'level' | 'community' | 'time_zone' | 'device_type';
  options: string[];
  default: string;
}

export interface SpecialRank {
  name: string;
  condition: string;
  visualEffect: string;
  bonusReward: string;
}

export interface CompetitionMechanics {
  scoringSystem: ScoringSystem;
  rules: CompetitionRule[];
  powerUps: CompetitionPowerUp[];
  sabotages: CompetitionSabotage[];
  events: CompetitionEvent[];
  strategies: Strategy[];
}

export interface ScoringSystem {
  type: 'points' | 'percentage' | 'ranking' | 'combination';
  formula: string;
  multipliers: {
    [action: string]: number;
  };
  bonuses: {
    [condition: string]: number;
  };
}

export interface CompetitionRule {
  id: string;
  name: string;
  description: string;
  penalty: number;
  severity: 'warning' | 'disqualification' | 'ban';
}

export interface CompetitionPowerUp {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: string;
  duration: number;
  cooldown: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface CompetitionSabotage {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: string;
  duration: number;
  defense: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface CompetitionEvent {
  id: string;
  name: string;
  type: 'bonus' | 'challenge' | 'surprise' | 'disaster';
  trigger: string;
  effect: string;
  duration: number;
  global: boolean;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  effectiveness: number;
  risk: number;
  learning: string;
}

export interface CompetitionVisualTheme {
  backgroundColor: string;
  primaryColor: string;
  accentColor: string;
  backgroundImage: string;
  animationStyle: 'intense' | 'elegant' | 'playful' | 'dramatic' | 'mysterious';
  particleEffects: string[];
  soundTheme: string;
  musicIntensity: 'calm' | 'energetic' | 'epic' | 'tense';
}

export interface SocialFeatures {
  teamFormation: boolean;
  spectating: boolean;
  cheering: boolean;
  trashTalk: boolean;
  sharing: boolean;
  streaming: boolean;
  betting: boolean;
  commentary: boolean;
}

export interface CompetitionProgression {
  levels: CompetitionLevel[];
  achievements: CompetitionAchievement[];
  milestones: CompetitionMilestone[];
  evolution: CompetitionEvolution;
}

export interface CompetitionLevel {
  level: number;
  name: string;
  requirements: string[];
  rewards: string[];
  unlockedFeatures: string[];
}

export interface CompetitionAchievement {
  id: string;
  name: string;
  description: string;
  condition: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  reward: string;
  isHidden: boolean;
}

export interface CompetitionMilestone {
  name: string;
  description: string;
  threshold: number;
  reward: string;
  celebration: string;
}

export interface CompetitionEvolution {
  stages: EvolutionStage[];
  requirements: EvolutionRequirement[];
}

export interface EvolutionStage {
  name: string;
  description: string;
  visualChanges: string[];
  abilityUnlocks: string[];
  statBonuses: { [stat: string]: number };
}

export interface EvolutionRequirement {
  type: 'wins' | 'participation' | 'performance' | 'time' | 'special';
  value: number;
  description: string;
}

export const COMPETITIONS: Competition[] = [
  {
    id: 'daily_growth_race',
    name: 'Daily Growth Race',
    type: 'individual',
    category: 'growth',
    difficulty: 'bronze',
    duration: {
      type: 'daily',
      startTime: '00:00:00',
      endTime: '23:59:59',
      resetSchedule: 'daily'
    },
    entryRequirements: [
      { type: 'level', value: 1, description: 'Reach level 1' }
    ],
    rewards: {
      participation: [
        {
          rank: 'participant',
          experience: 50,
          influence: 25,
          powerTokens: 10,
          exclusiveItems: ['daily_racer_badge'],
          titles: [],
          badges: ['daily_participant'],
          visualEffects: ['growth_aura']
        }
      ],
      placement: {
        '1': {
          rank: '1st',
          experience: 500,
          influence: 250,
          powerTokens: 100,
          exclusiveItems: ['daily_champion_crown'],
          titles: ['Daily Champion'],
          badges: ['growth_master'],
          visualEffects: ['champion_aura', 'fire_trail']
        },
        '2': {
          rank: '2nd',
          experience: 300,
          influence: 150,
          powerTokens: 60,
          exclusiveItems: ['silver_medal'],
          titles: ['Growth Expert'],
          badges: ['growth_specialist'],
          visualEffects: ['silver_aura']
        },
        '3': {
          rank: '3rd',
          experience: 200,
          influence: 100,
          powerTokens: 40,
          exclusiveItems: ['bronze_medal'],
          titles: ['Growth Talent'],
          badges: ['growth_apprentice'],
          visualEffects: ['bronze_aura']
        }
      },
      special: [
        {
          name: 'Perfect Day',
          description: 'Complete all daily habits with 100% accuracy',
          condition: 'perfect_daily_completion',
          rarity: 'legendary',
          reward: 'perfectionist_badge'
        }
      ],
      cumulative: {
        type: 'streak',
        description: 'Consecutive daily participations',
        thresholds: {
          7: {
            rank: 'week_warrior',
            experience: 200,
            influence: 100,
            powerTokens: 40,
            exclusiveItems: ['week_streak_badge'],
            titles: ['Week Warrior'],
            badges: ['consistent_player'],
            visualEffects: ['streak_glow']
          },
          30: {
            rank: 'month_master',
            experience: 1000,
            influence: 500,
            powerTokens: 200,
            exclusiveItems: ['month_streak_crown'],
            titles: ['Month Master'],
            badges: ['dedication_master'],
            visualEffects: ['month_aura']
          }
        }
      }
    },
    leaderboard: {
      type: 'real_time',
      updateFrequency: 5,
      maxEntries: 1000,
      categories: ['global', 'regional', 'level_based'],
      filters: [
        { type: 'region', options: ['africa', 'europe', 'asia', 'americas'], default: 'africa' },
        { type: 'level', options: ['1-10', '11-25', '26-50', '51+'], default: '1-10' }
      ],
      specialRanks: [
        {
          name: 'Rising Star',
          condition: 'biggest_jump_in_rank',
          visualEffect: 'star_burst',
          bonusReward: 'rising_star_badge'
        }
      ]
    },
    mechanics: {
      scoringSystem: {
        type: 'points',
        formula: 'base_points * speed_multiplier * accuracy_multiplier',
        multipliers: {
          'habit_completion': 10,
          'perfect_timing': 2,
          'speed_bonus': 1.5,
          'streak_bonus': 1.2
        },
        bonuses: {
          'early_completion': 50,
          'perfect_day': 100,
          'helping_others': 25
        }
      },
      rules: [
        {
          id: 'no_cheating',
          name: 'Fair Play',
          description: 'No automated or unfair methods allowed',
          penalty: 1000,
          severity: 'disqualification'
        }
      ],
      powerUps: [
        {
          id: 'double_points',
          name: 'Double Points',
          description: 'Double your points for 10 minutes',
          cost: 50,
          effect: 'points_x2',
          duration: 600,
          cooldown: 3600,
          rarity: 'common'
        }
      ],
      sabotages: [],
      events: [
        {
          id: 'bonus_hour',
          name: 'Golden Hour',
          type: 'bonus',
          trigger: 'random_time',
          effect: 'points_x3',
          duration: 3600,
          global: true
        }
      ],
      strategies: [
        {
          id: 'early_bird',
          name: 'Early Bird Strategy',
          description: 'Complete habits early for bonus points',
          requirements: ['morning_person'],
          effectiveness: 1.3,
          risk: 0.1,
          learning: 'Consistency beats intensity'
        }
      ]
    },
    visualTheme: {
      backgroundColor: '#FFD700',
      primaryColor: '#FFA500',
      accentColor: '#FF6347',
      backgroundImage: 'daily_race_background.jpg',
      animationStyle: 'intense' as const,
      particleEffects: ['gold_sparkles', 'speed_lines'],
      soundTheme: 'upbeat_race',
      musicIntensity: 'energetic'
    },
    socialFeatures: {
      teamFormation: false,
      spectating: true,
      cheering: true,
      trashTalk: false,
      sharing: true,
      streaming: false,
      betting: false,
      commentary: true
    },
    progression: {
      levels: [
        {
          level: 1,
          name: 'Rookie Racer',
          requirements: ['participate_1_day'],
          rewards: ['rookie_badge'],
          unlockedFeatures: ['basic_leaderboard']
        }
      ],
      achievements: [
        {
          id: 'first_win',
          name: 'First Victory',
          description: 'Win your first daily race',
          condition: 'daily_race_win_1',
          rarity: 'common',
          reward: 'first_winner_badge',
          isHidden: false
        }
      ],
      milestones: [
        {
          name: 'Century Mark',
          description: 'Participate in 100 daily races',
          threshold: 100,
          reward: 'century_racer_badge',
          celebration: 'confetti_explosion'
        }
      ],
      evolution: {
        stages: [
          {
            name: 'Speed Demon',
            description: 'Master of quick completion',
            visualChanges: ['speed_aura', 'lightning_effects'],
            abilityUnlocks: ['instant_completion'],
            statBonuses: { speed: 50, accuracy: 20 }
          }
        ],
        requirements: [
          { type: 'wins', value: 50, description: 'Win 50 daily races' }
        ]
      }
    }
  },
  {
    id: 'weekly_community_challenge',
    name: 'Weekly Community Challenge',
    type: 'community',
    category: 'engagement',
    difficulty: 'silver',
    duration: {
      type: 'weekly',
      startTime: 'Monday 00:00:00',
      endTime: 'Sunday 23:59:59',
      resetSchedule: 'weekly',
      phases: [
        {
          name: 'Planning Phase',
          duration: 48,
          description: 'Plan your community strategy',
          specialRules: ['bonus_for_planning'],
          multiplier: 1.2
        },
        {
          name: 'Execution Phase',
          duration: 96,
          description: 'Execute your community plan',
          specialRules: ['team_bonus_active'],
          multiplier: 1.5
        },
        {
          name: 'Final Push',
          duration: 24,
          description: 'Last chance to maximize points',
          specialRules: ['double_points_active'],
          multiplier: 2.0
        }
      ]
    },
    entryRequirements: [
      { type: 'level', value: 10, description: 'Reach level 10' },
      { type: 'supporters', value: 25, description: 'Have at least 25 supporters' }
    ],
    rewards: {
      participation: [
        {
          rank: 'participant',
          experience: 200,
          influence: 150,
          powerTokens: 50,
          exclusiveItems: ['team_player_badge'],
          titles: [],
          badges: ['community_participant'],
          visualEffects: ['team_aura']
        }
      ],
      placement: {
        '1': {
          rank: '1st',
          experience: 2000,
          influence: 1500,
          powerTokens: 500,
          exclusiveItems: ['community_champion_trophy'],
          titles: ['Community Champion'],
          badges: ['team_leader', 'community_master'],
          visualEffects: ['champion_crown', 'team_glory']
        }
      },
      special: [
        {
          name: 'Perfect Teamwork',
          description: 'All team members complete all tasks',
          condition: 'perfect_team_completion',
          rarity: 'mythic',
          reward: 'perfect_team_badge'
        }
      ],
      cumulative: {
        type: 'participation',
        description: 'Total weekly challenges participated',
        thresholds: {
          4: {
            rank: 'monthly_regular',
            experience: 500,
            influence: 300,
            powerTokens: 100,
            exclusiveItems: ['monthly_badge'],
            titles: ['Dedicated Member'],
            badges: ['regular_player'],
            visualEffects: ['dedication_glow']
          }
        }
      }
    },
    leaderboard: {
      type: 'periodic',
      updateFrequency: 15,
      maxEntries: 500,
      categories: ['community', 'regional', 'size_based'],
      filters: [
        { type: 'community', options: ['small', 'medium', 'large'], default: 'medium' },
        { type: 'region', options: ['east_africa', 'west_africa', 'southern_africa'], default: 'east_africa' }
      ],
      specialRanks: [
        {
          name: 'Most Improved',
          condition: 'biggest_rank_increase',
          visualEffect: 'improvement_star',
          bonusReward: 'improvement_badge'
        }
      ]
    },
    mechanics: {
      scoringSystem: {
        type: 'combination',
        formula: '(individual_points + team_bonus + community_multiplier) * participation_rate',
        multipliers: {
          'team_coordination': 1.5,
          'community_help': 1.3,
          'perfect_participation': 2.0
        },
        bonuses: {
          'helping_teammates': 100,
          'community_event': 200,
          'perfect_week': 500
        }
      },
      rules: [
        {
          id: 'team_cooperation',
          name: 'Team Cooperation Required',
          description: 'At least 50% team participation required',
          penalty: 500,
          severity: 'warning'
        }
      ],
      powerUps: [
        {
          id: 'team_boost',
          name: 'Team Boost',
          description: 'Boost entire team\'s points by 20%',
          cost: 100,
          effect: 'team_points_x1.2',
          duration: 1800,
          cooldown: 7200,
          rarity: 'rare'
        }
      ],
      sabotages: [
        {
          id: 'distraction',
          name: 'Distraction',
          description: 'Reduce opponent team efficiency by 10%',
          cost: 75,
          effect: 'efficiency_x0.9',
          duration: 900,
          defense: 'focus_power_up',
          rarity: 'common'
        }
      ],
      events: [
        {
          id: 'community_rally',
          name: 'Community Rally',
          type: 'bonus',
          trigger: 'low_participation',
          effect: 'participation_boost_x2',
          duration: 3600,
          global: true
        }
      ],
      strategies: [
        {
          id: 'balanced_approach',
          name: 'Balanced Approach',
          description: 'Balance individual and team efforts',
          requirements: ['team_player'],
          effectiveness: 1.2,
          risk: 0.2,
          learning: 'Balance creates stability'
        }
      ]
    },
    visualTheme: {
      backgroundColor: '#4169E1',
      primaryColor: '#1E90FF',
      accentColor: '#00BFFF',
      backgroundImage: 'community_challenge_background.jpg',
      animationStyle: 'dramatic',
      particleEffects: ['team_sparkles', 'unity_rays'],
      soundTheme: 'epic_orchestra',
      musicIntensity: 'epic'
    },
    socialFeatures: {
      teamFormation: true,
      spectating: true,
      cheering: true,
      trashTalk: true,
      sharing: true,
      streaming: true,
      betting: false,
      commentary: true
    },
    progression: {
      levels: [
        {
          level: 1,
          name: 'Team Player',
          requirements: ['join_team', 'participate_1_week'],
          rewards: ['team_player_badge'],
          unlockedFeatures: ['team_chat', 'team_leaderboard']
        }
      ],
      achievements: [
        {
          id: 'team_victory',
          name: 'Team Victory',
          description: 'Win a weekly community challenge',
          condition: 'weekly_challenge_win_1',
          rarity: 'rare',
          reward: 'team_winner_badge',
          isHidden: false
        }
      ],
      milestones: [
        {
          name: 'Community Legend',
          description: 'Help your community win 10 challenges',
          threshold: 10,
          reward: 'community_legend_badge',
          celebration: 'victory_parade'
        }
      ],
      evolution: {
        stages: [
          {
            name: 'Community Leader',
            description: 'Natural leader who inspires others',
            visualChanges: ['leadership_aura', 'inspiration_effect'],
            abilityUnlocks: ['team_motivation', 'community_blessing'],
            statBonuses: { leadership: 100, teamwork: 75 }
          }
        ],
        requirements: [
          { type: 'wins', value: 25, description: 'Lead team to 25 victories' }
        ]
      }
    }
  },
  {
    id: 'monthly_strategy_masters',
    name: 'Monthly Strategy Masters',
    type: 'individual',
    category: 'strategy',
    difficulty: 'gold',
    duration: {
      type: 'monthly',
      startTime: '1st 00:00:00',
      endTime: 'last_day 23:59:59',
      resetSchedule: 'monthly'
    },
    entryRequirements: [
      { type: 'level', value: 25, description: 'Reach level 25' },
      { type: 'previous_wins', value: 5, description: 'Win at least 5 competitions' }
    ],
    rewards: {
      participation: [
        {
          rank: 'participant',
          experience: 500,
          influence: 300,
          powerTokens: 150,
          exclusiveItems: ['strategist_badge'],
          titles: [],
          badges: ['strategy_participant'],
          visualEffects: ['thinking_aura']
        }
      ],
      placement: {
        '1': {
          rank: '1st',
          experience: 5000,
          influence: 3000,
          powerTokens: 1500,
          exclusiveItems: ['strategy_master_crown'],
          titles: ['Strategy Master'],
          badges: ['grand_strategist', 'tactical_genius'],
          visualEffects: ['master_aura', 'wisdom_halo']
        }
      ],
      special: [
        {
          name: 'Perfect Strategy',
          description: 'Complete all challenges with optimal moves',
          condition: 'perfect_strategy_execution',
          rarity: 'mythic',
          reward: 'perfect_strategist_badge'
        }
      ],
      cumulative: {
        type: 'improvement',
        description: 'Consistent improvement over months',
        thresholds: {
          3: {
            rank: 'improving_player',
            experience: 1500,
            influence: 900,
            powerTokens: 450,
            exclusiveItems: ['improvement_badge'],
            titles: ['Improving Master'],
            badges: ['growth_mindset'],
            visualEffects: ['improvement_glow']
          }
        }
      }
    },
    leaderboard: {
      type: 'final',
      updateFrequency: 60,
      maxEntries: 100,
      categories: ['global', 'strategy_type'],
      filters: [
        { type: 'level', options: ['25-40', '41-60', '61+'], default: '25-40' }
      ],
      specialRanks: [
        {
          name: 'Tactical Genius',
          condition: 'most_efficient_moves',
          visualEffect: 'genius_sparkle',
          bonusReward: 'tactical_badge'
        }
      ]
    },
    mechanics: {
      scoringSystem: {
        type: 'percentage',
        formula: 'base_score * efficiency * strategy_complexity * time_bonus',
        multipliers: {
          'optimal_move': 2.0,
          'strategic_depth': 1.5,
          'speed_execution': 1.3,
          'risk_management': 1.2
        },
        bonuses: {
          'perfect_strategy': 500,
          'innovative_solution': 300,
          'underdog_victory': 400
        }
      },
      rules: [
        {
          id: 'strategic_thinking',
          name: 'Strategic Depth Required',
          description: 'Must demonstrate strategic thinking',
          penalty: 200,
          severity: 'warning'
        }
      ],
      powerUps: [
        {
          id: 'foresight',
          name: 'Foresight',
          description: 'See optimal moves for 5 minutes',
          cost: 200,
          effect: 'reveal_optimal_moves',
          duration: 300,
          cooldown: 1800,
          rarity: 'epic'
        }
      ],
      sabotages: [
        {
          id: 'misinformation',
          name: 'Misinformation',
          description: 'Show false optimal moves to opponent',
          cost: 150,
          effect: 'false_hints',
          duration: 600,
          defense: 'critical_thinking',
          rarity: 'rare'
        }
      ],
      events: [
        {
          id: 'strategy_shift',
          name: 'Strategy Shift',
          type: 'challenge',
          trigger: 'mid_competition',
          effect: 'change_optimal_strategy',
          duration: 1800,
          global: true
        }
      ],
      strategies: [
        {
          id: 'aggressive_expansion',
          name: 'Aggressive Expansion',
          description: 'Rapid growth strategy with high risk',
          requirements: ['risk_taker'],
          effectiveness: 1.8,
          risk: 0.6,
          learning: 'High risk, high reward'
        }
      ]
    },
    visualTheme: {
      backgroundColor: '#2F4F4F',
      primaryColor: '#708090',
      accentColor: '#B0C4DE',
      backgroundImage: 'strategy_masters_background.jpg',
      animationStyle: 'elegant',
      particleEffects: ['thought_bubbles', 'strategy_lines'],
      soundTheme: 'classical_strategy',
      musicIntensity: 'calm'
    },
    socialFeatures: {
      teamFormation: false,
      spectating: true,
      cheering: false,
      trashTalk: false,
      sharing: true,
      streaming: true,
      betting: true,
      commentary: true
    },
    progression: {
      levels: [
        {
          level: 1,
          name: 'Strategic Novice',
          requirements: ['complete_basic_strategy'],
          rewards: ['novice_strategist_badge'],
          unlockedFeatures: ['basic_strategy_tools']
        }
      ],
      achievements: [
        {
          id: 'strategic_breakthrough',
          name: 'Strategic Breakthrough',
          description: 'Discover a winning strategy',
          condition: 'innovative_strategy_win',
          rarity: 'epic',
          reward: 'innovator_badge',
          isHidden: true
        }
      ],
      milestones: [
        {
          name: 'Strategy Master',
          description: 'Master 10 different strategies',
          threshold: 10,
          reward: 'versatile_strategist_badge',
          celebration: 'strategy_montage'
        }
      ],
      evolution: {
        stages: [
          {
            name: 'Grand Master',
            description: 'Ultimate strategic mind',
            visualChanges: ['master_aura', 'wisdom_crown'],
            abilityUnlocks: ['predict_future', 'perfect_strategy'],
            statBonuses: { intelligence: 150, wisdom: 125 }
          }
        ],
        requirements: [
          { type: 'wins', value: 100, description: 'Win 100 strategy competitions' }
        ]
      }
    }
  }
];

// Dynamic competition generation
export interface CompetitionGenerator {
  generatePersonalizedCompetitions: (playerProfile: PlayerProfile) => Competition[];
  generateSeasonalCompetitions: (season: string) => Competition[];
  generateEmergencyCompetitions: (eventType: string) => Competition[];
  generateCommunityCompetitions: (communityData: CommunityData) => Competition[];
}

export interface CommunityData {
  size: number;
  activity: number;
  interests: string[];
  competitionHistory: string[];
  averageLevel: number;
}

export const generatePersonalizedCompetitions = (playerProfile: PlayerProfile): Competition[] => {
  const baseCompetitions = [...COMPETITIONS];
  const personalizedCompetitions: Competition[] = [];

  baseCompetitions.forEach(competition => {
    // Check if player meets requirements
    const meetsRequirements = competition.entryRequirements.every(req => {
      switch (req.type) {
        case 'level':
          return playerProfile.level >= (req.value as number);
        case 'supporters':
          return playerProfile.supporters >= (req.value as number);
        case 'previous_wins':
          return playerProfile.completedMissions >= (req.value as number);
        default:
          return true;
      }
    });

    if (meetsRequirements) {
      // Personalize competition based on player interests
      if (playerProfile.interests.includes(competition.category)) {
        // Boost rewards for interested categories
        competition.rewards.participation.forEach(tier => {
          tier.experience *= 1.3;
          tier.influence *= 1.3;
          tier.powerTokens *= 1.3;
        });
      }

      personalizedCompetitions.push(competition);
    }
  });

  return personalizedCompetitions;
};

export const generateEmergencyCompetitions = (eventType: string): Competition[] => {
  const emergencyTemplates = {
    'server_crash': {
      name: 'Emergency Recovery Race',
      type: 'individual' as const,
      category: 'endurance' as const,
      difficulty: 'diamond' as const,
      duration: 2, // hours
      rewards: {
        participation: [{
          rank: 'participant',
          experience: 100,
          influence: 50,
          powerTokens: 25,
          exclusiveItems: ['emergency_helper_badge'],
          titles: [],
          badges: ['crisis_responder'],
          visualEffects: ['emergency_aura']
        }]
      },
      placement: {},
      special: [],
      cumulative: { type: 'participation', description: '', thresholds: {} }
    },
    'special_event': {
      name: 'Limited Time Event',
      type: 'global' as const,
      category: 'engagement' as const,
      difficulty: 'legendary' as const,
      duration: 6, // hours
      rewards: {
        participation: [{
          rank: 'participant',
          experience: 200,
          influence: 100,
          powerTokens: 50,
          exclusiveItems: ['event_participant_badge'],
          titles: [],
          badges: ['special_guest'],
          visualEffects: ['event_aura']
        }]
      }
    }
  };

  const template = emergencyTemplates[eventType as keyof typeof emergencyTemplates];
  if (!template) return [];

  return [{
    id: `emergency_${eventType}_${Date.now()}`,
    name: template.name,
    type: template.type,
    category: template.category,
    difficulty: template.difficulty,
    duration: {
      type: 'hourly',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + template.duration * 3600000).toISOString()
    },
    entryRequirements: [{ type: 'level', value: 1, description: 'Open to all players' }],
    rewards: template.rewards,
    placement: {},
    special: [],
    cumulative: { type: 'participation', description: '', thresholds: {} },
    leaderboard: {
      type: 'real_time',
      updateFrequency: 1,
      maxEntries: 10000,
      categories: ['global'],
      filters: [],
      specialRanks: []
    },
    mechanics: {
      scoringSystem: {
        type: 'points',
        formula: 'participation_points',
        multipliers: {},
        bonuses: {}
      },
      rules: [],
      powerUps: [],
      sabotages: [],
      events: [],
      strategies: []
    },
    visualTheme: {
      backgroundColor: '#FF4500',
      primaryColor: '#FF6347',
      accentColor: '#FFD700',
      backgroundImage: 'emergency_background.jpg',
      animationStyle: 'intense',
      particleEffects: ['emergency_sparkles'],
      soundTheme: 'urgent',
      musicIntensity: 'tense'
    },
    socialFeatures: {
      teamFormation: false,
      spectating: true,
      cheering: true,
      trashTalk: false,
      sharing: true,
      streaming: true,
      betting: false,
      commentary: true
    },
    progression: {
      levels: [],
      achievements: [],
      milestones: [],
      evolution: { stages: [], requirements: [] }
    }
  }];
};
