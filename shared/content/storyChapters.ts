export interface StoryChapter {
  id: string;
  title: string;
  theme: string;
  chapterOrder: number;
  description: string;
  narrative: StoryScene[];
  missions: StoryMission[];
  completionRewards: ChapterRewards;
  unlockRequirements: UnlockRequirements;
  isLocked: boolean;
  backgroundMusic?: string;
  visualTheme: VisualTheme;
}

export interface StoryScene {
  id: string;
  type: 'dialogue' | 'narration' | 'choice' | 'minigame' | 'cinematic';
  title: string;
  content: string;
  characters?: string[];
  choices?: StoryChoice[];
  minigameType?: 'tap_rhythm' | 'lyric_puzzle' | 'decision_scenario' | 'resource_management';
  visualStyle?: 'street' | 'stage' | 'rally' | 'studio' | 'community';
  emotion: 'hope' | 'struggle' | 'triumph' | 'determination' | 'unity';
}

export interface StoryChoice {
  id: string;
  text: string;
  consequence: string;
  rewardModifier: number;
  nextSceneId: string;
  characterAlignment?: 'courage' | 'wisdom' | 'compassion' | 'leadership';
}

export interface StoryMission {
  id: string;
  title: string;
  description: string;
  type: 'story' | 'choice' | 'minigame';
  requirements: MissionRequirements;
  rewards: MissionRewards;
  isRequired: boolean;
}

export interface ChapterRewards {
  experience: number;
  influence: number;
  powerTokens: number;
  unlocks: string[];
  titles: string[];
  badges: string[];
}

export interface UnlockRequirements {
  playerLevel: number;
  previousChapterCompleted?: string;
  supportersRequired?: number;
  missionsCompleted?: number;
}

export interface VisualTheme {
  backgroundColor: string;
  primaryColor: string;
  accentColor: string;
  backgroundImage?: string;
  characterSprites: string[];
}

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'chapter_1',
    title: 'Ghetto Roots',
    theme: 'Humble Beginnings',
    chapterOrder: 1,
    description: 'Every movement starts somewhere. Yours begins in the streets, where voices are small but dreams are big.',
    narrative: [
      {
        id: 'scene_1_1',
        type: 'narration',
        title: 'The Streets Call',
        content: 'The sun beats down on the dusty streets. You walk through neighborhoods where hope lives in small moments - a shared meal, a song from a window, children playing football with a ball made of rags.',
        visualStyle: 'street',
        emotion: 'hope'
      },
      {
        id: 'scene_1_2',
        type: 'dialogue',
        title: 'First Conversation',
        content: 'Elder Mama Rosa: "I see the fire in your eyes. The same fire I saw in others who dared to dream bigger than these streets."',
        characters: ['Mama Rosa', 'Player'],
        visualStyle: 'street',
        emotion: 'determination'
      },
      {
        id: 'scene_1_3',
        type: 'choice',
        title: 'Your First Decision',
        content: 'A group of youth are arguing about resources for a community event. They look to you for guidance.',
        choices: [
          {
            id: 'choice_1_1',
            text: 'Mediate and find compromise',
            consequence: 'You earn respect for wisdom',
            rewardModifier: 1.2,
            nextSceneId: 'scene_1_4',
            characterAlignment: 'wisdom'
          },
          {
            id: 'choice_1_2',
            text: 'Propose sharing resources equally',
            consequence: 'You build unity through fairness',
            rewardModifier: 1.1,
            nextSceneId: 'scene_1_4',
            characterAlignment: 'compassion'
          },
          {
            id: 'choice_1_3',
            text: 'Suggest creative solution',
            consequence: 'You show innovative thinking',
            rewardModifier: 1.3,
            nextSceneId: 'scene_1_4',
            characterAlignment: 'leadership'
          }
        ],
        visualStyle: 'community',
        emotion: 'struggle'
      },
      {
        id: 'scene_1_4',
        type: 'minigame',
        title: 'Rhythm of the Streets',
        content: 'Music is the heartbeat of the community. Learn to find the rhythm that brings people together.',
        minigameType: 'tap_rhythm',
        visualStyle: 'street',
        emotion: 'hope'
      },
      {
        id: 'scene_1_5',
        type: 'cinematic',
        title: 'First Followers',
        content: 'Word spreads. Small gatherings become larger. Your voice, once lost in the crowd, now carries weight. The journey has begun.',
        visualStyle: 'community',
        emotion: 'triumph'
      }
    ],
    missions: [
      {
        id: 'story_1_1',
        title: 'Find Your Voice',
        description: 'Complete the rhythm minigame to discover your natural leadership style',
        type: 'minigame',
        requirements: { minigameCompletion: 'tap_rhythm', targetScore: 70 },
        rewards: { experience: 50, influence: 25, powerTokens: 5 },
        isRequired: true
      },
      {
        id: 'story_1_2',
        title: 'Community Listener',
        description: 'Make your first meaningful choice in the story',
        type: 'choice',
        requirements: { choicesMade: 1 },
        rewards: { experience: 30, influence: 15, powerTokens: 3 },
        isRequired: true
      },
      {
        id: 'story_1_3',
        title: 'Street Credibility',
        description: 'Recruit your first 10 supporters',
        type: 'story',
        requirements: { supportersRecruited: 10 },
        rewards: { experience: 75, influence: 50, powerTokens: 10 },
        isRequired: true
      }
    ],
    completionRewards: {
      experience: 500,
      influence: 250,
      powerTokens: 25,
      unlocks: ['chapter_2', 'voice_through_music'],
      titles: ['Street Voice'],
      badges: ['first_steps']
    },
    unlockRequirements: {
      playerLevel: 1
    },
    isLocked: false,
    backgroundMusic: 'ghetto_beats.mp3',
    visualTheme: {
      backgroundColor: '#1a1a1a',
      primaryColor: '#ff6b35',
      accentColor: '#f7931e',
      backgroundImage: 'street_background.jpg',
      characterSprites: ['player_street.png', 'mama_rosa.png', 'youth_group.png']
    }
  },
  {
    id: 'chapter_2',
    title: 'Voice Through Music',
    theme: 'Awareness',
    chapterOrder: 2,
    description: 'Your voice finds its instrument. Music becomes your megaphone, carrying messages of hope across neighborhoods.',
    narrative: [
      {
        id: 'scene_2_1',
        type: 'narration',
        title: 'The Power of Song',
        content: 'In the community center, an old guitar sits waiting. You pick it up, and somehow the melodies come naturally. Each note carries the stories of your people.',
        visualStyle: 'stage',
        emotion: 'hope'
      },
      {
        id: 'scene_2_2',
        type: 'dialogue',
        title: 'The Music Teacher',
        content: 'Professor Kofi: "Music isn\'t just entertainment. It\'s how we remember our history, how we speak truth to power, how we heal."',
        characters: ['Professor Kofi', 'Player'],
        visualStyle: 'studio',
        emotion: 'wisdom'
      },
      {
        id: 'scene_2_3',
        type: 'minigame',
        title: 'Lyrics That Matter',
        content: 'Craft lyrics that speak to your community\'s struggles and dreams. Each word must carry weight and meaning.',
        minigameType: 'lyric_puzzle',
        visualStyle: 'studio',
        emotion: 'determination'
      },
      {
        id: 'scene_2_4',
        type: 'choice',
        title: 'First Performance',
        content: 'You\'re invited to perform at a community gathering. What message will you share?',
        choices: [
          {
            id: 'choice_2_1',
            text: 'Sing about hope and unity',
            consequence: 'Your message inspires many',
            rewardModifier: 1.2,
            nextSceneId: 'scene_2_5',
            characterAlignment: 'compassion'
          },
          {
            id: 'choice_2_2',
            text: 'Address community challenges',
            consequence: 'You show courage to speak truth',
            rewardModifier: 1.4,
            nextSceneId: 'scene_2_5',
            characterAlignment: 'courage'
          },
          {
            id: 'choice_2_3',
            text: 'Share personal journey',
            consequence: 'Your authenticity connects deeply',
            rewardModifier: 1.1,
            nextSceneId: 'scene_2_5',
            characterAlignment: 'wisdom'
          }
        ],
        visualStyle: 'stage',
        emotion: 'struggle'
      },
      {
        id: 'scene_2_5',
        type: 'cinematic',
        title: 'The Movement Grows',
        content: 'Your voice echoes beyond the community center. People record your songs, share your lyrics. The movement now has a soundtrack.',
        visualStyle: 'rally',
        emotion: 'triumph'
      }
    ],
    missions: [
      {
        id: 'story_2_1',
        title: 'Find Your Rhythm',
        description: 'Master the lyric puzzle minigame',
        type: 'minigame',
        requirements: { minigameCompletion: 'lyric_puzzle', targetScore: 75 },
        rewards: { experience: 75, influence: 40, powerTokens: 8 },
        isRequired: true
      },
      {
        id: 'story_2_2',
        title: 'Message That Matters',
        description: 'Choose your performance theme',
        type: 'choice',
        requirements: { choicesMade: 3 },
        rewards: { experience: 50, influence: 30, powerTokens: 5 },
        isRequired: true
      },
      {
        id: 'story_2_3',
        title: 'Musical Movement',
        description: 'Reach 50 supporters through your music',
        type: 'story',
        requirements: { supportersRecruited: 50 },
        rewards: { experience: 150, influence: 100, powerTokens: 20 },
        isRequired: true
      }
    ],
    completionRewards: {
      experience: 1000,
      influence: 500,
      powerTokens: 50,
      unlocks: ['chapter_3', 'rising_popularity'],
      titles: ['Voice of the People'],
      badges: ['musical_messenger']
    },
    unlockRequirements: {
      playerLevel: 5,
      previousChapterCompleted: 'chapter_1',
      supportersRequired: 25
    },
    isLocked: true,
    backgroundMusic: 'voice_through_music.mp3',
    visualTheme: {
      backgroundColor: '#2d1b69',
      primaryColor: '#7209b7',
      accentColor: '#a855f7',
      backgroundImage: 'stage_background.jpg',
      characterSprites: ['player_stage.png', 'professor_kofi.png', 'audience.png']
    }
  },
  {
    id: 'chapter_3',
    title: 'Rising Popularity',
    theme: 'Community Growth',
    chapterOrder: 3,
    description: 'Your influence expands beyond neighborhoods. The challenge now is managing growth while staying true to your values.',
    narrative: [
      {
        id: 'scene_3_1',
        type: 'narration',
        title: 'Growing Pains',
        content: 'The movement is growing faster than expected. New faces appear daily, each drawn by your message. But growth brings new challenges.',
        visualStyle: 'community',
        emotion: 'struggle'
      },
      {
        id: 'scene_3_2',
        type: 'dialogue',
        title: 'The Organizers',
        content: 'Team Lead Amara: "We need structure. Passion brought people here, but organization will keep them. We need teams, roles, and clear goals."',
        characters: ['Amara', 'Player', 'Organizer Team'],
        visualStyle: 'community',
        emotion: 'determination'
      },
      {
        id: 'scene_3_3',
        type: 'minigame',
        title: 'Resource Management',
        content: 'Balance community resources, team assignments, and event planning. Every decision affects movement growth.',
        minigameType: 'resource_management',
        visualStyle: 'community',
        emotion: 'wisdom'
      },
      {
        id: 'scene_3_4',
        type: 'choice',
        title: 'Leadership Style',
        content: 'Your team asks how to handle rapid growth. Your approach will define the movement\'s future.',
        choices: [
          {
            id: 'choice_3_1',
            text: 'Build formal structure with clear roles',
            consequence: 'Organization improves, but some feel restricted',
            rewardModifier: 1.1,
            nextSceneId: 'scene_3_5',
            characterAlignment: 'leadership'
          },
          {
            id: 'choice_3_2',
            text: 'Keep informal, community-led approach',
            consequence: 'Creativity flourishes, but coordination suffers',
            rewardModifier: 0.9,
            nextSceneId: 'scene_3_5',
            characterAlignment: 'compassion'
          },
          {
            id: 'choice_3_3',
            text: 'Hybrid model with core team and community input',
            consequence: 'Balance of structure and participation',
            rewardModifier: 1.3,
            nextSceneId: 'scene_3_5',
            characterAlignment: 'wisdom'
          }
        ],
        visualStyle: 'community',
        emotion: 'struggle'
      },
      {
        id: 'scene_3_5',
        type: 'cinematic',
        title: 'The Network Expands',
        content: 'Communities across the city hear about your movement. Requests for speaking engagements pour in. Your voice now carries beyond your neighborhood.',
        visualStyle: 'rally',
        emotion: 'triumph'
      }
    ],
    missions: [
      {
        id: 'story_3_1',
        title: 'Organizational Skills',
        description: 'Master the resource management minigame',
        type: 'minigame',
        requirements: { minigameCompletion: 'resource_management', targetScore: 80 },
        rewards: { experience: 100, influence: 60, powerTokens: 12 },
        isRequired: true
      },
      {
        id: 'story_3_2',
        title: 'Leadership Decision',
        description: 'Choose your growth strategy',
        type: 'choice',
        requirements: { choicesMade: 5 },
        rewards: { experience: 75, influence: 45, powerTokens: 8 },
        isRequired: true
      },
      {
        id: 'story_3_3',
        title: 'Community Builder',
        description: 'Reach 200 supporters',
        type: 'story',
        requirements: { supportersRecruited: 200 },
        rewards: { experience: 300, influence: 200, powerTokens: 40 },
        isRequired: true
      }
    ],
    completionRewards: {
      experience: 2000,
      influence: 1000,
      powerTokens: 100,
      unlocks: ['chapter_4', 'challenges', 'community_management'],
      titles: ['Community Organizer'],
      badges: ['growth_leader']
    },
    unlockRequirements: {
      playerLevel: 10,
      previousChapterCompleted: 'chapter_2',
      supportersRequired: 100
    },
    isLocked: true,
    backgroundMusic: 'rising_popularity.mp3',
    visualTheme: {
      backgroundColor: '#134e4a',
      primaryColor: '#059669',
      accentColor: '#10b981',
      backgroundImage: 'community_background.jpg',
      characterSprites: ['player_organizer.png', 'amara.png', 'team_members.png']
    }
  },
  {
    id: 'chapter_4',
    title: 'Challenges',
    theme: 'Obstacles',
    chapterOrder: 4,
    description: 'Success attracts resistance. Your movement faces tests that will forge it into something stronger.',
    narrative: [
      {
        id: 'scenario_4_1',
        type: 'narration',
        title: 'The Storm Gathers',
        content: 'Not everyone welcomes change. Whispers become warnings. Challenges appear from unexpected places - both external and internal.',
        visualStyle: 'street',
        emotion: 'struggle'
      },
      {
        id: 'scenario_4_2',
        type: 'dialogue',
        title: 'The Opposition',
        content: 'Council Member: "Your movement disrupts order. People question authority. This cannot continue unchecked."',
        characters: ['Council Member', 'Player', 'Legal Advisor'],
        visualStyle: 'studio',
        emotion: 'struggle'
      },
      {
        id: 'scenario_4_3',
        type: 'minigame',
        title: 'Decision Under Pressure',
        content: 'Face critical decisions that test your values and leadership. Each choice has consequences for your movement.',
        minigameType: 'decision_scenario',
        visualStyle: 'studio',
        emotion: 'determination'
      },
      {
        id: 'scenario_4_4',
        type: 'choice',
        title: 'Crisis Response',
        content: 'Authorities threaten to shut down your community center. How do you respond?',
        choices: [
          {
            id: 'choice_4_1',
            text: 'Legal challenge through courts',
            consequence: 'Long battle, but principle stands',
            rewardModifier: 1.0,
            nextSceneId: 'scenario_4_5',
            characterAlignment: 'wisdom'
          },
          {
            id: 'choice_4_2',
            text: 'Public protest and media campaign',
            consequence: 'Massive support, but increased risk',
            rewardModifier: 1.5,
            nextSceneId: 'scenario_4_5',
            characterAlignment: 'courage'
          },
          {
            id: 'choice_4_3',
            text: 'Negotiate compromise',
            consequence: 'Partial victory, maintains operation',
            rewardModifier: 0.8,
            nextSceneId: 'scenario_4_5',
            characterAlignment: 'compassion'
          }
        ],
        visualStyle: 'rally',
        emotion: 'struggle'
      },
      {
        id: 'scenario_4_5',
        type: 'cinematic',
        title: 'Resilience Forged',
        content: 'The movement survives the storm, stronger and more united. Challenges that would have broken others only forged your resolve.',
        visualStyle: 'community',
        emotion: 'triumph'
      }
    ],
    missions: [
      {
        id: 'story_4_1',
        title: 'Crisis Management',
        description: 'Handle 5 decision scenarios successfully',
        type: 'minigame',
        requirements: { minigameCompletion: 'decision_scenario', targetScore: 85 },
        rewards: { experience: 150, influence: 100, powerTokens: 20 },
        isRequired: true
      },
      {
        id: 'story_4_2',
        title: 'Courage Under Fire',
        description: 'Make difficult choices during crisis',
        type: 'choice',
        requirements: { choicesMade: 8 },
        rewards: { experience: 100, influence: 75, powerTokens: 15 },
        isRequired: true
      },
      {
        id: 'story_4_3',
        title: 'Movement Resilience',
        description: 'Maintain 500 supporters through challenges',
        type: 'story',
        requirements: { supportersRecruited: 500 },
        rewards: { experience: 500, influence: 400, powerTokens: 80 },
        isRequired: true
      }
    ],
    completionRewards: {
      experience: 4000,
      influence: 2000,
      powerTokens: 200,
      unlocks: ['chapter_5', 'leadership_training'],
      titles: ['Resilient Leader'],
      badges: ['crisis_survivor', 'unbreakable']
    },
    unlockRequirements: {
      playerLevel: 20,
      previousChapterCompleted: 'chapter_3',
      supportersRequired: 300
    },
    isLocked: true,
    backgroundMusic: 'challenges_theme.mp3',
    visualTheme: {
      backgroundColor: '#7c2d12',
      primaryColor: '#dc2626',
      accentColor: '#ef4444',
      backgroundImage: 'challenge_background.jpg',
      characterSprites: ['player_resilient.png', 'council_member.png', 'legal_team.png']
    }
  },
  {
    id: 'chapter_5',
    title: 'Leadership',
    theme: 'Movement Building',
    chapterOrder: 5,
    description: 'The final transformation. From voice of the streets to leader of a movement that spans communities and inspires generations.',
    narrative: [
      {
        id: 'leadership_5_1',
        type: 'narration',
        title: 'The Summit',
        content: 'Leaders from across the region gather. They don\'t come to challenge you, but to learn. Your movement has become a model for change.',
        visualStyle: 'rally',
        emotion: 'triumph'
      },
      {
        id: 'leadership_5_2',
        type: 'dialogue',
        title: 'The Council of Leaders',
        content: 'Regional Leaders: "Your approach - combining music, community, and principled leadership - has created something we\'ve never seen before."',
        characters: ['Regional Leaders', 'Player', 'Movement Elders'],
        visualStyle: 'rally',
        emotion: 'unity'
      },
      {
        id: 'leadership_5_3',
        type: 'minigame',
        title: 'Movement Strategy',
        content: 'Coordinate multiple communities, manage resources at scale, and plan the future of your movement.',
        minigameType: 'resource_management',
        visualStyle: 'rally',
        emotion: 'wisdom'
      },
      {
        id: 'leadership_5_4',
        type: 'choice',
        title: 'The Future Path',
        content: 'Your movement stands at a crossroads. Your next decision will define its legacy for generations.',
        choices: [
          {
            id: 'choice_5_1',
            text: 'Expand nationally with structured organization',
            consequence: 'Your movement becomes a national force',
            rewardModifier: 1.2,
            nextSceneId: 'leadership_5_5',
            characterAlignment: 'leadership'
          },
          {
            id: 'choice_5_2',
            text: 'Focus on local community empowerment',
            consequence: 'Deep impact in communities, slower expansion',
            rewardModifier: 1.0,
            nextSceneId: 'leadership_5_5',
            characterAlignment: 'compassion'
          },
          {
            id: 'choice_5_3',
            text: 'Create a network of autonomous movements',
            consequence: 'Maximum spread, less central control',
            rewardModifier: 1.4,
            nextSceneId: 'leadership_5_5',
            characterAlignment: 'wisdom'
          }
        ],
        visualStyle: 'rally',
        emotion: 'determination'
      },
      {
        id: 'leadership_5_5',
        type: 'cinematic',
        title: 'The Legacy Begins',
        content: 'Your journey from the streets to leadership inspires countless others. The movement you built will continue growing, guided by the values you established.',
        visualStyle: 'rally',
        emotion: 'triumph'
      }
    ],
    missions: [
      {
        id: 'story_5_1',
        title: 'Strategic Leadership',
        description: 'Master advanced movement management',
        type: 'minigame',
        requirements: { minigameCompletion: 'resource_management', targetScore: 95 },
        rewards: { experience: 250, influence: 200, powerTokens: 40 },
        isRequired: true
      },
      {
        id: 'story_5_2',
        title: 'Legacy Decision',
        description: 'Choose your movement\'s future path',
        type: 'choice',
        requirements: { choicesMade: 12 },
        rewards: { experience: 200, influence: 150, powerTokens: 30 },
        isRequired: true
      },
      {
        id: 'story_5_3',
        title: 'Movement Builder',
        description: 'Reach 1000 supporters',
        type: 'story',
        requirements: { supportersRecruited: 1000 },
        rewards: { experience: 1000, influence: 800, powerTokens: 150 },
        isRequired: true
      }
    ],
    completionRewards: {
      experience: 8000,
      influence: 4000,
      powerTokens: 400,
      unlocks: ['infinite_progression', 'seasonal_content', 'leadership_paths'],
      titles: ['Movement Leader', 'Legend'],
      badges: ['movement_founder', 'transformational_leader', 'legendary_status']
    },
    unlockRequirements: {
      playerLevel: 30,
      previousChapterCompleted: 'chapter_4',
      supportersRequired: 800
    },
    isLocked: true,
    backgroundMusic: 'leadership_theme.mp3',
    visualTheme: {
      backgroundColor: '#581c87',
      primaryColor: '#9333ea',
      accentColor: '#a855f7',
      backgroundImage: 'leadership_background.jpg',
      characterSprites: ['player_legend.png', 'regional_leaders.png', 'movement_crowd.png']
    }
  }
];

export const getChapterById = (id: string): StoryChapter | undefined => {
  return STORY_CHAPTERS.find(chapter => chapter.id === id);
};

export const getChapterByOrder = (order: number): StoryChapter | undefined => {
  return STORY_CHAPTERS.find(chapter => chapter.chapterOrder === order);
};

export const getUnlockedChapters = (playerLevel: number, completedChapters: string[]): StoryChapter[] => {
  return STORY_CHAPTERS.filter(chapter => {
    if (chapter.chapterOrder === 1) return true; // First chapter always unlocked
    
    const requirements = chapter.unlockRequirements;
    const levelMet = playerLevel >= requirements.playerLevel;
    const previousCompleted = !requirements.previousChapterCompleted || completedChapters.includes(requirements.previousChapterCompleted);
    const supportersMet = !requirements.supportersRequired || true; // This would come from player data
    
    return levelMet && previousCompleted && supportersMet;
  });
};
