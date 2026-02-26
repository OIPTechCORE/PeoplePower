export interface Minigame {
  id: string;
  name: string;
  type: 'tap_rhythm' | 'lyric_puzzle' | 'decision_scenario' | 'resource_management';
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  maxScore: number;
  timeLimit?: number; // in seconds
  mechanics: MinigameMechanics;
  rewards: MinigameRewards;
  visualTheme: MinigameVisualTheme;
  soundEffects: string[];
}

export interface MinigameMechanics {
  inputType: 'tap' | 'drag' | 'choice' | 'typing' | 'swipe';
  pattern?: string[];
  choices?: MinigameChoice[];
  resources?: MinigameResource[];
  objectives: MinigameObjective[];
}

export interface MinigameChoice {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
  points: number;
  timeBonus?: number;
}

export interface MinigameResource {
  type: string;
  amount: number;
  cost: number;
  efficiency: number;
}

export interface MinigameObjective {
  id: string;
  description: string;
  target: number;
  current: number;
  completed: boolean;
}

export interface MinigameRewards {
  baseScore: number;
  perfectBonus: number;
  timeBonus: number;
  difficultyMultiplier: number;
}

export interface MinigameVisualTheme {
  backgroundColor: string;
  primaryColor: string;
  accentColor: string;
  animationStyle: 'bounce' | 'fade' | 'slide' | 'pulse' | 'shake';
  particleEffects: boolean;
}

export const MINIGAMES: Minigame[] = [
  {
    id: 'tap_rhythm_street',
    name: 'Street Rhythm',
    type: 'tap_rhythm',
    description: 'Find the rhythm of the streets. Tap along with the beat to build your influence.',
    difficulty: 'easy',
    maxScore: 100,
    timeLimit: 60,
    mechanics: {
      inputType: 'tap',
      pattern: ['beat', 'beat', 'rest', 'beat', 'beat', 'rest', 'beat', 'rest'],
      objectives: [
        {
          id: 'timing',
          description: 'Tap in rhythm with the beat',
          target: 50,
          current: 0,
          completed: false
        },
        {
          id: 'consistency',
          description: 'Maintain steady rhythm',
          target: 90,
          current: 0,
          completed: false
        }
      ]
    },
    rewards: {
      baseScore: 50,
      perfectBonus: 25,
      timeBonus: 15,
      difficultyMultiplier: 1.0
    },
    visualTheme: {
      backgroundColor: '#1a1a1a',
      primaryColor: '#ff6b35',
      accentColor: '#f7931e',
      animationStyle: 'pulse',
      particleEffects: true
    },
    soundEffects: ['drum_beat.mp3', 'success_chime.mp3', 'miss_tap.mp3']
  },
  {
    id: 'tap_rhythm_stage',
    name: 'Stage Performance',
    type: 'tap_rhythm',
    description: 'Perform on stage! More complex rhythms with bigger crowds.',
    difficulty: 'medium',
    maxScore: 150,
    timeLimit: 90,
    mechanics: {
      inputType: 'tap',
      pattern: ['beat', 'beat', 'beat', 'rest', 'beat', 'beat', 'rest', 'beat', 'beat', 'rest', 'rest'],
      objectives: [
        {
          id: 'timing',
          description: 'Perfect timing on complex patterns',
          target: 75,
          current: 0,
          completed: false
        },
        {
          id: 'crowd_energy',
          description: 'Build crowd excitement',
          target: 100,
          current: 0,
          completed: false
        }
      ]
    },
    rewards: {
      baseScore: 75,
      perfectBonus: 40,
      timeBonus: 25,
      difficultyMultiplier: 1.5
    },
    visualTheme: {
      backgroundColor: '#2d1b69',
      primaryColor: '#7209b7',
      accentColor: '#a855f7',
      animationStyle: 'pulse',
      particleEffects: true
    },
    soundEffects: ['stage_beat.mp3', 'crowd_cheer.mp3', 'applause.mp3']
  },
  {
    id: 'lyric_puzzle_hope',
    name: 'Lyrics of Hope',
    type: 'lyric_puzzle',
    description: 'Arrange words to create powerful lyrics about hope and unity.',
    difficulty: 'easy',
    maxScore: 100,
    timeLimit: 120,
    mechanics: {
      inputType: 'drag',
      choices: [
        {
          id: 'word_1',
          text: 'rise',
          isCorrect: true,
          feedback: 'Perfect! "Rise" captures the upward movement.',
          points: 20
        },
        {
          id: 'word_2',
          text: 'together',
          isCorrect: true,
          feedback: 'Excellent! Unity is strength.',
          points: 20
        },
        {
          id: 'word_3',
          text: 'dreams',
          isCorrect: true,
          feedback: 'Beautiful! Dreams fuel the movement.',
          points: 20
        },
        {
          id: 'word_4',
          text: 'fall',
          isCorrect: false,
          feedback: 'Not quite. We need uplifting words.',
          points: 0
        },
        {
          id: 'word_5',
          text: 'alone',
          isCorrect: false,
          feedback: 'This goes against unity. Try again.',
          points: 0
        }
      ],
      objectives: [
        {
          id: 'complete_lyric',
          description: 'Create a complete, meaningful lyric',
          target: 3,
          current: 0,
          completed: false
        },
        {
          id: 'thematic_coherence',
          description: 'Maintain consistent theme',
          target: 100,
          current: 0,
          completed: false
        }
      ]
    },
    rewards: {
      baseScore: 60,
      perfectBonus: 30,
      timeBonus: 20,
      difficultyMultiplier: 1.0
    },
    visualTheme: {
      backgroundColor: '#1e293b',
      primaryColor: '#3b82f6',
      accentColor: '#60a5fa',
      animationStyle: 'slide',
      particleEffects: false
    },
    soundEffects: ['word_snap.mp3', 'correct_word.mp3', 'lyric_complete.mp3']
  },
  {
    id: 'lyric_puzzle_courage',
    name: 'Songs of Courage',
    type: 'lyric_puzzle',
    description: 'Craft powerful lyrics about standing up for your beliefs.',
    difficulty: 'medium',
    maxScore: 150,
    timeLimit: 150,
    mechanics: {
      inputType: 'drag',
      choices: [
        {
          id: 'phrase_1',
          text: 'stand tall',
          isCorrect: true,
          feedback: 'Powerful! Standing tall shows courage.',
          points: 25
        },
        {
          id: 'phrase_2',
          text: 'break chains',
          isCorrect: true,
          feedback: 'Revolutionary! Breaking chains symbolizes freedom.',
          points: 25
        },
        {
          id: 'phrase_3',
          text: 'voice thunder',
          isCorrect: true,
          feedback: 'Thunderous voice! Your message resonates.',
          points: 25
        },
        {
          id: 'phrase_4',
          text: 'hide fear',
          isCorrect: false,
          feedback: 'Courage means facing fear, not hiding it.',
          points: 0
        },
        {
          id: 'phrase_5',
          text: 'stay silent',
          isCorrect: false,
          feedback: 'Silence won\'t bring change. Speak up!',
          points: 0
        }
      ],
      objectives: [
        {
          id: 'powerful_message',
          description: 'Create impactful, courageous lyrics',
          target: 4,
          current: 0,
          completed: false
        },
        {
          id: 'emotional_impact',
          description: 'Evoke strong emotions',
          target: 120,
          current: 0,
          completed: false
        }
      ]
    },
    rewards: {
      baseScore: 90,
      perfectBonus: 45,
      timeBonus: 30,
      difficultyMultiplier: 1.5
    },
    visualTheme: {
      backgroundColor: '#7c2d12',
      primaryColor: '#dc2626',
      accentColor: '#ef4444',
      animationStyle: 'bounce',
      particleEffects: true
    },
    soundEffects: ['thunder_crack.mp3', 'courage_theme.mp3', 'revolution_lyric.mp3']
  },
  {
    id: 'decision_scenario_community',
    name: 'Community Crisis',
    type: 'decision_scenario',
    description: 'A crisis threatens your community. Your decisions will determine the outcome.',
    difficulty: 'medium',
    maxScore: 100,
    timeLimit: 180,
    mechanics: {
      inputType: 'choice',
      choices: [
        {
          id: 'decision_1',
          text: 'Call emergency community meeting',
          isCorrect: true,
          feedback: 'Wise! Community input builds unity and shared solutions.',
          points: 30,
          timeBonus: 10
        },
        {
          id: 'decision_2',
          text: 'Take immediate action alone',
          isCorrect: false,
          feedback: 'Risky! Going alone may divide the community.',
          points: 10
        },
        {
          id: 'decision_3',
          text: 'Wait for more information',
          isCorrect: true,
          feedback: 'Strategic! Informed decisions prevent mistakes.',
          points: 25,
          timeBonus: 5
        },
        {
          id: 'decision_4',
          text: 'Ask external authorities for help',
          isCorrect: false,
          feedback: 'Dangerous! External help may come with strings attached.',
          points: 5
        }
      ],
      objectives: [
        {
          id: 'crisis_resolution',
          description: 'Resolve the community crisis effectively',
          target: 80,
          current: 0,
          completed: false
        },
        {
          id: 'unity_maintained',
          description: 'Keep community united through the crisis',
          target: 90,
          current: 0,
          completed: false
        }
      ]
    },
    rewards: {
      baseScore: 70,
      perfectBonus: 35,
      timeBonus: 20,
      difficultyMultiplier: 1.5
    },
    visualTheme: {
      backgroundColor: '#451a03',
      primaryColor: '#92400e',
      accentColor: '#b45309',
      animationStyle: 'fade',
      particleEffects: false
    },
    soundEffects: ['crisis_alert.mp3', 'decision_made.mp3', 'community_unite.mp3']
  },
  {
    id: 'decision_scenario_leadership',
    name: 'Leadership Dilemma',
    type: 'decision_scenario',
    description: 'A complex leadership challenge tests your values and strategic thinking.',
    difficulty: 'hard',
    maxScore: 150,
    timeLimit: 240,
    mechanics: {
      inputType: 'choice',
      choices: [
        {
          id: 'leadership_1',
          text: 'Prioritize transparency and risk losing momentum',
          isCorrect: true,
          feedback: 'Courageous leadership! Trust builds long-term strength.',
          points: 40,
          timeBonus: 15
        },
        {
          id: 'leadership_2',
          text: 'Protect the movement with controlled information',
          isCorrect: false,
          feedback: 'Short-term gain, long-term damage to trust.',
          points: 15
        },
        {
          id: 'leadership_3',
          text: 'Share responsibility with trusted team',
          isCorrect: true,
          feedback: 'Strategic! Shared leadership builds resilience.',
          points: 35,
          timeBonus: 10
        },
        {
          id: 'leadership_4',
          text: 'Delay decision until pressure decreases',
          isCorrect: false,
          feedback: 'Missed opportunity for decisive leadership.',
          points: 10
        }
      ],
      objectives: [
        {
          id: 'effective_leadership',
          description: 'Demonstrate strong, principled leadership',
          target: 100,
          current: 0,
          completed: false
        },
        {
          id: 'movement_integrity',
          description: 'Maintain movement values and trust',
          target: 120,
          current: 0,
          completed: false
        }
      ]
    },
    rewards: {
      baseScore: 100,
      perfectBonus: 50,
      timeBonus: 30,
      difficultyMultiplier: 2.0
    },
    visualTheme: {
      backgroundColor: '#581c87',
      primaryColor: '#9333ea',
      accentColor: '#a855f7',
      animationStyle: 'pulse',
      particleEffects: true
    },
    soundEffects: ['leadership_theme.mp3', 'tough_decision.mp3', 'integrity_confirmed.mp3']
  },
  {
    id: 'resource_management_community',
    name: 'Community Builder',
    type: 'resource_management',
    description: 'Manage community resources, team assignments, and growth strategies.',
    difficulty: 'medium',
    maxScore: 120,
    timeLimit: 180,
    mechanics: {
      inputType: 'drag',
      resources: [
        {
          type: 'volunteers',
          amount: 50,
          cost: 1,
          efficiency: 1.0
        },
        {
          type: 'funds',
          amount: 1000,
          cost: 1,
          efficiency: 1.0
        },
        {
          type: 'space',
          amount: 100,
          cost: 1,
          efficiency: 1.0
        }
      ],
      objectives: [
        {
          id: 'resource_optimization',
          description: 'Optimize resource allocation',
          target: 85,
          current: 0,
          completed: false
        },
        {
          id: 'team_satisfaction',
          description: 'Keep team members motivated and effective',
          target: 90,
          current: 0,
          completed: false
        },
        {
          id: 'growth_achieved',
          description: 'Achieve sustainable growth targets',
          target: 75,
          current: 0,
          completed: false
        }
      ]
    },
    rewards: {
      baseScore: 80,
      perfectBonus: 40,
      timeBonus: 25,
      difficultyMultiplier: 1.5
    },
    visualTheme: {
      backgroundColor: '#134e4a',
      primaryColor: '#059669',
      accentColor: '#10b981',
      animationStyle: 'slide',
      particleEffects: false
    },
    soundEffects: ['resource_allocate.mp3', 'team_happy.mp3', 'growth_achieved.mp3']
  },
  {
    id: 'resource_management_movement',
    name: 'Movement Strategist',
    type: 'resource_management',
    description: 'Coordinate multiple communities and manage large-scale movement resources.',
    difficulty: 'hard',
    maxScore: 200,
    timeLimit: 300,
    mechanics: {
      inputType: 'drag',
      resources: [
        {
          type: 'community_leaders',
          amount: 10,
          cost: 5,
          efficiency: 2.0
        },
        {
          type: 'campaign_funds',
          amount: 10000,
          cost: 1,
          efficiency: 1.0
        },
        {
          type: 'media_reach',
          amount: 50000,
          cost: 1,
          efficiency: 1.5
        },
        {
          type: 'volunteer_network',
          amount: 500,
          cost: 1,
          efficiency: 1.2
        }
      ],
      objectives: [
        {
          id: 'strategic_planning',
          description: 'Create effective long-term strategy',
          target: 95,
          current: 0,
          completed: false
        },
        {
          id: 'network_coordination',
          description: 'Coordinate multiple communities effectively',
          target: 100,
          current: 0,
          completed: false
        },
        {
          id: 'movement_growth',
          description: 'Achieve exponential movement growth',
          target: 150,
          current: 0,
          completed: false
        }
      ]
    },
    rewards: {
      baseScore: 150,
      perfectBonus: 75,
      timeBonus: 40,
      difficultyMultiplier: 2.0
    },
    visualTheme: {
      backgroundColor: '#1e3a8a',
      primaryColor: '#1d4ed8',
      accentColor: '#3b82f6',
      animationStyle: 'pulse',
      particleEffects: true
    },
    soundEffects: ['strategy_mode.mp3', 'network_sync.mp3', 'movement_expansion.mp3']
  }
];

export const getMinigameById = (id: string): Minigame | undefined => {
  return MINIGAMES.find(game => game.id === id);
};

export const getMinigamesByType = (type: string): Minigame[] => {
  return MINIGAMES.filter(game => game.type === type);
};

export const getMinigamesByDifficulty = (difficulty: string): Minigame[] => {
  return MINIGAMES.filter(game => game.difficulty === difficulty);
};

// Minigame state management
export interface MinigameState {
  gameId: string;
  currentScore: number;
  timeRemaining: number;
  completedObjectives: string[];
  playerChoices: string[];
  resourcesAllocated: Record<string, number>;
  isCompleted: boolean;
  finalScore: number;
  rewards: {
    experience: number;
    influence: number;
    powerTokens: number;
  };
}

export const initializeMinigameState = (gameId: string): MinigameState => {
  const game = getMinigameById(gameId);
  if (!game) {
    throw new Error(`Minigame ${gameId} not found`);
  }

  return {
    gameId,
    currentScore: 0,
    timeRemaining: game.timeLimit || 0,
    completedObjectives: [],
    playerChoices: [],
    resourcesAllocated: {},
    isCompleted: false,
    finalScore: 0,
    rewards: {
      experience: 0,
      influence: 0,
      powerTokens: 0
    }
  };
};

export const calculateMinigameScore = (
  state: MinigameState,
  game: Minigame
): number => {
  let score = state.currentScore;
  
  // Apply difficulty multiplier
  score *= game.rewards.difficultyMultiplier;
  
  // Add perfect bonus if applicable
  if (state.currentScore >= game.maxScore * 0.95) {
    score += game.rewards.perfectBonus;
  }
  
  // Add time bonus if completed quickly
  if (state.timeRemaining > 0) {
    const timeBonusPercent = state.timeRemaining / (game.timeLimit || 60);
    score += game.rewards.timeBonus * timeBonusPercent;
  }
  
  return Math.round(score);
};

export const calculateMinigameRewards = (
  finalScore: number,
  game: Minigame
): { experience: number; influence: number; powerTokens: number } => {
  const baseMultiplier = finalScore / game.maxScore;
  
  return {
    experience: Math.round(game.rewards.baseScore * baseMultiplier * 2),
    influence: Math.round(game.rewards.baseScore * baseMultiplier * 1.5),
    powerTokens: Math.round(game.rewards.baseScore * baseMultiplier * 0.3)
  };
};
