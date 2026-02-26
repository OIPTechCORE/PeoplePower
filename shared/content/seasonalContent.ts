export interface Season {
  id: string;
  name: string;
  theme: string;
  description: string;
  duration: number; // days
  startDate: string;
  endDate: string;
  isActive: boolean;
  visualTheme: SeasonVisualTheme;
  exclusiveRewards: SeasonReward[];
  specialEvents: SeasonalEvent[];
  challenges: SeasonalChallenge[];
  storyChapter?: string; // New chapter unlock
  leaderboardType: 'seasonal' | 'regional' | 'community';
}

export interface SeasonVisualTheme {
  backgroundColor: string;
  primaryColor: string;
  accentColor: string;
  backgroundImage: string;
  particleEffects: string[];
  musicTheme: string;
  uiStyle: 'festival' | 'serious' | 'celebration' | 'competitive';
}

export interface SeasonReward {
  id: string;
  name: string;
  description: string;
  type: 'cosmetic' | 'title' | 'badge' | 'power_token' | 'exclusive_content';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: SeasonRequirement;
  isClaimed: boolean;
}

export interface SeasonRequirement {
  type: 'level' | 'seasonal_points' | 'wins' | 'participation' | 'community_rank';
  value: number;
  description: string;
}

export interface SeasonalEvent {
  id: string;
  name: string;
  type: 'limited_time' | 'special_mission' | 'community_challenge' | 'double_rewards';
  startTime: string;
  endTime: string;
  description: string;
  rewards: EventReward[];
  participationRequirement?: number;
}

export interface EventReward {
  type: 'experience' | 'influence' | 'power_tokens' | 'exclusive_badge' | 'exclusive_content';
  amount: number;
  description: string;
}

export interface SeasonalChallenge {
  id: string;
  name: string;
  description: string;
  type: 'individual' | 'team' | 'community';
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  objectives: ChallengeObjective[];
  rewards: ChallengeReward[];
  maxParticipants?: number;
  leaderboards: string[];
}

export interface ChallengeObjective {
  id: string;
  description: string;
  target: number;
  progressType: 'count' | 'score' | 'time' | 'resources';
  isMandatory: boolean;
}

export interface ChallengeReward {
  type: 'seasonal_points' | 'power_tokens' | 'exclusive_cosmetic' | 'title' | 'exclusive_content';
  amount: number;
  description: string;
  tier: 'participation' | 'bronze' | 'silver' | 'gold' | 'platinum';
}

export const SEASONS: Season[] = [
  {
    id: 'season_1_founders',
    name: 'Founders Era',
    theme: 'Genesis Movement',
    description: 'Where it all began. The first voices rise from the streets, creating ripples that will become waves.',
    duration: 45,
    startDate: '2026-02-01',
    endDate: '2026-03-17',
    isActive: true,
    visualTheme: {
      backgroundColor: '#1a1a1a',
      primaryColor: '#ff6b35',
      accentColor: '#f7931e',
      backgroundImage: 'founders_background.jpg',
      particleEffects: ['sparkle', 'flame'],
      musicTheme: 'genesis_beats.mp3',
      uiStyle: 'serious'
    },
    exclusiveRewards: [
      {
        id: 'founders_badge',
        name: 'Founding Member',
        description: 'You were here when the movement began. This badge can never be earned again.',
        type: 'badge',
        rarity: 'legendary',
        requirement: {
          type: 'participation',
          value: 1,
          description: 'Join during Founders Era'
        },
        isClaimed: false
      },
      {
        id: 'founders_title',
        name: 'Movement Founder',
        description: 'Permanent title recognizing your foundational role in the movement.',
        type: 'title',
        rarity: 'legendary',
        requirement: {
          type: 'seasonal_points',
          value: 1000,
          description: 'Earn 1000 seasonal points'
        },
        isClaimed: false
      },
      {
        id: 'founders_cosmetic',
        name: 'Genesis Aura',
        description: 'Exclusive golden aura that surrounds your avatar, visible to all players.',
        type: 'cosmetic',
        rarity: 'epic',
        requirement: {
          type: 'level',
          value: 10,
          description: 'Reach level 10 during Founders Era'
        },
        isClaimed: false
      }
    ],
    specialEvents: [
      {
        id: 'founders_bonus_week',
        name: 'Founders Bonus Week',
        type: 'double_rewards',
        startTime: '2026-02-15',
        endTime: '2026-02-22',
        description: 'Celebrate the movement\'s founding with double influence and rewards!',
        rewards: [
          {
            type: 'experience',
            amount: 200,
            description: 'Bonus experience for all activities'
          },
          {
            type: 'influence',
            amount: 500,
            description: 'Double influence gains'
          }
        ]
      },
      {
        id: 'first_rally',
        name: 'First Movement Rally',
        type: 'community_challenge',
        startTime: '2026-02-10',
        endTime: '2026-02-12',
        description: 'Join the first official movement rally and make your voice heard!',
        rewards: [
          {
            type: 'exclusive_badge',
            amount: 1,
            description: 'First Rally Participant badge'
          }
        ],
        participationRequirement: 100
      }
    ],
    challenges: [
      {
        id: 'founders_recruitment',
        name: 'Founders Recruitment Drive',
        description: 'Help build the foundation by recruiting new movement members.',
        type: 'individual',
        difficulty: 'medium',
        objectives: [
          {
            id: 'recruit_new_members',
            description: 'Recruit 5 new members to the movement',
            target: 5,
            progressType: 'count',
            isMandatory: true
          },
          {
            id: 'help_new_players',
            description: 'Help 3 new players complete their first mission',
            target: 3,
            progressType: 'count',
            isMandatory: false
          }
        ],
        rewards: [
          {
            type: 'seasonal_points',
            amount: 250,
            description: 'Founders Recruitment points',
            tier: 'participation'
          },
          {
            type: 'power_tokens',
            amount: 50,
            description: 'Recruitment reward',
            tier: 'bronze'
          }
        ],
        leaderboards: ['founders_recruitment', 'community_growth']
      },
      {
        id: 'voice_building',
        name: 'Voice Building Challenge',
        description: 'Strengthen your voice through various activities and missions.',
        type: 'individual',
        difficulty: 'easy',
        objectives: [
          {
            id: 'complete_story_missions',
            description: 'Complete 10 story missions',
            target: 10,
            progressType: 'count',
            isMandatory: true
          },
          {
            id: 'master_minigames',
            description: 'Achieve high scores in 5 different minigames',
            target: 5,
            progressType: 'count',
            isMandatory: false
          }
        ],
        rewards: [
          {
            type: 'seasonal_points',
            amount: 150,
            description: 'Voice Building points',
            tier: 'participation'
          },
          {
            type: 'exclusive_cosmetic',
            amount: 1,
            description: 'Voice Master avatar frame',
            tier: 'silver'
          }
        ],
        leaderboards: ['voice_masters', 'story_progress']
      }
    ],
    leaderboardType: 'seasonal'
  },
  {
    id: 'season_2_builders',
    name: 'Builders Era',
    theme: 'Community Construction',
    description: 'The movement grows stronger. Communities form, structures emerge, and the foundation deepens.',
    duration: 30,
    startDate: '2026-03-18',
    endDate: '2026-04-17',
    isActive: false,
    visualTheme: {
      backgroundColor: '#134e4a',
      primaryColor: '#059669',
      accentColor: '#10b981',
      backgroundImage: 'builders_background.jpg',
      particleEffects: ['construction', 'growth'],
      musicTheme: 'building_beats.mp3',
      uiStyle: 'competitive'
    },
    exclusiveRewards: [
      {
        id: 'builders_badge',
        name: 'Community Builder',
        description: 'Recognized for helping build strong movement communities.',
        type: 'badge',
        rarity: 'epic',
        requirement: {
          type: 'seasonal_points',
          value: 1500,
          description: 'Earn 1500 seasonal points'
        },
        isClaimed: false
      },
      {
        id: 'builders_title',
        name: 'Master Builder',
        description: 'Title awarded to those who excel at community construction.',
        type: 'title',
        rarity: 'epic',
        requirement: {
          type: 'community_rank',
          value: 1,
          description: 'Achieve top rank in your community'
        },
        isClaimed: false
      },
      {
        id: 'builders_cosmetic',
        name: 'Constructor\'s Tools',
        description: 'Exclusive cosmetic tools that appear around your avatar.',
        type: 'cosmetic',
        rarity: 'rare',
        requirement: {
          type: 'wins',
          value: 10,
          description: 'Win 10 community challenges'
        },
        isClaimed: false
      }
    ],
    specialEvents: [
      {
        id: 'community_festival',
        name: 'Community Building Festival',
        type: 'special_mission',
        startTime: '2026-04-01',
        endTime: '2026-04-07',
        description: 'Week-long festival celebrating community achievements with special missions!',
        rewards: [
          {
            type: 'experience',
            amount: 300,
            description: 'Festival participation bonus'
          },
          {
            type: 'power_tokens',
            amount: 100,
            description: 'Festival celebration reward'
          }
        ]
      },
      {
        id: 'team_competition',
        name: 'Great Team Competition',
        type: 'community_challenge',
        startTime: '2026-03-25',
        endTime: '2026-03-27',
        description: 'Communities compete in the ultimate team building challenge!',
        rewards: [
          {
            type: 'exclusive_badge',
            amount: 1,
            description: 'Team Champion badge'
          }
        ],
        participationRequirement: 500
      }
    ],
    challenges: [
      {
        id: 'community_architect',
        name: 'Community Architect Challenge',
        description: 'Design and build the most effective community structure.',
        type: 'team',
        difficulty: 'hard',
        objectives: [
          {
            id: 'optimize_community',
            description: 'Achieve 95% community efficiency',
            target: 95,
            progressType: 'score',
            isMandatory: true
          },
          {
            id: 'team_coordination',
            description: 'Coordinate 20 team activities successfully',
            target: 20,
            progressType: 'count',
            isMandatory: true
          }
        ],
        rewards: [
          {
            type: 'seasonal_points',
            amount: 500,
            description: 'Architect points',
            tier: 'gold'
          },
          {
            type: 'exclusive_content',
            amount: 1,
            description: 'Advanced community management tools',
            tier: 'platinum'
          }
        ],
        maxParticipants: 100,
        leaderboards: ['community_architects', 'team_efficiency']
      }
    ],
    leaderboardType: 'community'
  },
  {
    id: 'season_3_supporters',
    name: 'Supporters Era',
    theme: 'Mass Movement',
    description: 'The movement becomes unstoppable. Thousands join, communities unite, and change becomes inevitable.',
    duration: 45,
    startDate: '2026-04-18',
    endDate: '2026-06-01',
    isActive: false,
    visualTheme: {
      backgroundColor: '#581c87',
      primaryColor: '#9333ea',
      accentColor: '#a855f7',
      backgroundImage: 'supporters_background.jpg',
      particleEffects: ['crowd', 'momentum'],
      musicTheme: 'movement_symphony.mp3',
      uiStyle: 'celebration'
    },
    exclusiveRewards: [
      {
        id: 'supporters_badge',
        name: 'Movement Catalyst',
        description: 'For those who helped transform the movement into a mass phenomenon.',
        type: 'badge',
        rarity: 'legendary',
        requirement: {
          type: 'seasonal_points',
          value: 2000,
          description: 'Earn 2000 seasonal points'
        },
        isClaimed: false
      },
      {
        id: 'supporters_title',
        name: 'Movement Legend',
        description: 'The highest title, reserved for true movement legends.',
        type: 'title',
        rarity: 'legendary',
        requirement: {
          type: 'wins',
          value: 25,
          description: 'Win 25 seasonal challenges'
        },
        isClaimed: false
      },
      {
        id: 'supporters_cosmetic',
        name: 'Legendary Aura',
        description: 'Mythical aura with rainbow effects, visible across all platforms.',
        type: 'cosmetic',
        rarity: 'legendary',
        requirement: {
          type: 'participation',
          value: 100,
          description: 'Participate in 100 seasonal events'
        },
        isClaimed: false
      }
    ],
    specialEvents: [
      {
        id: 'million_march',
        name: 'Million Member March',
        type: 'community_challenge',
        startTime: '2026-05-01',
        endTime: '2026-05-03',
        description: 'The ultimate goal - reach one million movement members together!',
        rewards: [
          {
            type: 'exclusive_badge',
            amount: 1,
            description: 'Million March Participant'
          },
          {
            type: 'power_tokens',
            amount: 500,
            description: 'Historic achievement reward'
          }
        ],
        participationRequirement: 1000000
      },
      {
        id: 'global_summit',
        name: 'Global Movement Summit',
        type: 'special_mission',
        startTime: '2026-05-20',
        endTime: '2026-05-30',
        description: '10-day global summit with movement leaders from around the world.',
        rewards: [
          {
            type: 'experience',
            amount: 1000,
            description: 'Global Summit participation'
          },
          {
            type: 'exclusive_content',
            amount: 1,
            description: 'Global leader recognition'
          }
        ]
      }
    ],
    challenges: [
      {
        id: 'movement_orchestrator',
        name: 'Movement Orchestrator Challenge',
        description: 'Coordinate massive movement activities across multiple regions.',
        type: 'community',
        difficulty: 'legendary',
        objectives: [
          {
            id: 'regional_coordination',
            description: 'Coordinate activities in 5 different regions',
            target: 5,
            progressType: 'count',
            isMandatory: true
          },
          {
            id: 'mass_participation',
            description: 'Achieve 100,000 total participant actions',
            target: 100000,
            progressType: 'count',
            isMandatory: true
          },
          {
            id: 'global_impact',
            description: 'Generate measurable impact in 3 categories',
            target: 3,
            progressType: 'count',
            isMandatory: false
          }
        ],
        rewards: [
          {
            type: 'seasonal_points',
            amount: 1000,
            description: 'Orchestrator points',
            tier: 'platinum'
          },
          {
            type: 'exclusive_content',
            amount: 1,
            description: 'Movement coordination dashboard',
            tier: 'platinum'
          }
        ],
        maxParticipants: 1000,
        leaderboards: ['movement_orchestrators', 'global_impact']
      }
    ],
    leaderboardType: 'regional'
  }
];

export const getCurrentSeason = (): Season | undefined => {
  const now = new Date();
  return SEASONS.find(season => {
    const start = new Date(season.startDate);
    const end = new Date(season.endDate);
    return now >= start && now <= end && season.isActive;
  });
};

export const getSeasonById = (id: string): Season | undefined => {
  return SEASONS.find(season => season.id === id);
};

export const getUpcomingSeasons = (): Season[] => {
  const now = new Date();
  return SEASONS.filter(season => {
    const start = new Date(season.startDate);
    return start > now;
  }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
};

export const getSeasonalEvents = (seasonId: string): SeasonalEvent[] => {
  const season = getSeasonById(seasonId);
  return season?.specialEvents || [];
};

export const getSeasonalChallenges = (seasonId: string): SeasonalChallenge[] => {
  const season = getSeasonById(seasonId);
  return season?.challenges || [];
};

// Seasonal progress tracking
export interface SeasonalProgress {
  seasonId: string;
  playerId: string;
  seasonalPoints: number;
  completedChallenges: string[];
  participatedEvents: string[];
  currentRank: number;
  rewardsClaimed: string[];
  lastUpdated: string;
}

export const calculateSeasonalPoints = (progress: SeasonalProgress): number => {
  let points = progress.seasonalPoints;
  
  // Bonus points for challenge completion
  points += progress.completedChallenges.length * 50;
  
  // Bonus points for event participation
  points += progress.participatedEvents.length * 25;
  
  return points;
};

export const getSeasonalRank = (points: number, allPlayers: SeasonalProgress[]): number => {
  const sortedPlayers = allPlayers.sort((a, b) => b.seasonalPoints - a.seasonalPoints);
  return sortedPlayers.findIndex(p => p.seasonalPoints === points) + 1;
};

export const getSeasonalRewardsForPlayer = (seasonId: string, playerLevel: number, seasonalPoints: number): SeasonReward[] => {
  const season = getSeasonById(seasonId);
  if (!season) return [];
  
  return season.exclusiveRewards.filter(reward => {
    // Check if player meets requirements
    const requirement = reward.requirement;
    
    switch (requirement.type) {
      case 'level':
        return playerLevel >= requirement.value;
      case 'seasonal_points':
        return seasonalPoints >= requirement.value;
      default:
        return true; // Other types handled separately
    }
  });
};
