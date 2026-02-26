export interface EducationalContent {
  id: string;
  title: string;
  category: 'leadership' | 'financial_literacy' | 'teamwork' | 'civic_awareness' | 'entrepreneurship' | 'communication';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  content: EducationalModule[];
  learningObjectives: string[];
  assessment: EducationalAssessment;
  rewards: EducationalReward;
  estimatedTime: number; // minutes
  prerequisites?: string[];
  tags: string[];
}

export interface EducationalModule {
  type: 'text' | 'video' | 'interactive' | 'quiz' | 'scenario' | 'case_study' | 'role_play';
  title: string;
  content: string;
  duration: number; // minutes
  interactive?: InteractiveElement[];
  mediaUrl?: string;
}

export interface InteractiveElement {
  type: 'drag_drop' | 'multiple_choice' | 'simulation' | 'role_play';
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  feedback: string;
  points: number;
}

export interface EducationalAssessment {
  type: 'quiz' | 'practical_application' | 'reflection' | 'peer_evaluation';
  questions: AssessmentQuestion[];
  passingScore: number;
  maxAttempts: number;
}

export interface AssessmentQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'scenario_based';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface EducationalReward {
  experience: number;
  influence: number;
  powerTokens: number;
  badge?: string;
  certificate?: string;
  newAbility?: string;
}

export const EDUCATIONAL_CONTENT: EducationalContent[] = [
  {
    id: 'leadership_fundamentals',
    title: 'Leadership Fundamentals',
    category: 'leadership',
    difficulty: 'beginner',
    description: 'Learn the essential principles of effective leadership and how to apply them in community organizing.',
    learningObjectives: [
      'Understand different leadership styles',
      'Learn to motivate and inspire others',
      'Develop decision-making skills',
      'Practice ethical leadership principles'
    ],
    estimatedTime: 15,
    tags: ['leadership', 'motivation', 'ethics', 'decision-making'],
    content: [
      {
        type: 'text',
        title: 'What Makes a Leader?',
        content: 'Leadership isn\'t about authority – it\'s about influence. True leaders inspire action through vision, empathy, and integrity. In community movements, leadership means serving others while guiding them toward a common goal.',
        duration: 3
      },
      {
        type: 'interactive',
        title: 'Leadership Style Assessment',
        content: 'Discover your natural leadership style through this interactive assessment.',
        duration: 5,
        interactive: [
          {
            type: 'multiple_choice',
            question: 'How do you approach team challenges?',
            options: [
              'I take charge and direct the solution',
              'I facilitate discussion and build consensus',
              'I support others and provide resources',
              'I analyze the problem systematically'
            ],
            correctAnswer: 1,
            feedback: 'Facilitating discussion builds inclusive leadership – a key skill in community movements.',
            points: 10
          }
        ]
      },
      {
        type: 'video',
        title: 'Leadership in Action',
        content: 'Watch real examples of community leaders demonstrating key principles.',
        duration: 4,
        mediaUrl: 'leadership_examples.mp4'
      },
      {
        type: 'scenario',
        title: 'Leadership Challenge',
        content: 'Face a realistic leadership scenario and make decisions that test your understanding.',
        duration: 3
      }
    ],
    assessment: {
      type: 'quiz',
      passingScore: 80,
      maxAttempts: 3,
      questions: [
        {
          id: 'lead_1',
          type: 'multiple_choice',
          question: 'What is the most important quality of a community leader?',
          options: [
            'Authority and power',
            'Ability to inspire and serve others',
            'Public speaking skills',
            'Strict discipline'
          ],
          correctAnswer: 1,
          explanation: 'Community leadership is about service and inspiration, not control.',
          points: 25,
          difficulty: 'easy'
        },
        {
          id: 'lead_2',
          type: 'scenario_based',
          question: 'Your team is divided on an important decision. What\'s the best leadership approach?',
          options: [
            'Make the decision yourself to save time',
            'Let the majority vote without discussion',
            'Facilitate dialogue to find common ground',
            'Postpone the decision indefinitely'
          ],
          correctAnswer: 2,
          explanation: 'Great leaders build consensus through dialogue, ensuring all voices are heard.',
          points: 25,
          difficulty: 'medium'
        },
        {
          id: 'lead_3',
          type: 'true_false',
          question: 'True or False: Leaders should never admit mistakes.',
          correctAnswer: 'False',
          explanation: 'Great leaders acknowledge mistakes and learn from them, building trust through transparency.',
          points: 25,
          difficulty: 'easy'
        },
        {
          id: 'lead_4',
          type: 'short_answer',
          question: 'Describe one situation where you demonstrated leadership and what you learned.',
          correctAnswer: '',
          explanation: 'Reflection helps consolidate learning and identify areas for growth.',
          points: 25,
          difficulty: 'hard'
        }
      ]
    },
    rewards: {
      experience: 100,
      influence: 50,
      powerTokens: 10,
      badge: 'leadership_fundamentals',
      newAbility: 'basic_leadership'
    }
  },
  {
    id: 'financial_literacy_basics',
    title: 'Financial Literacy for Community Organizing',
    category: 'financial_literacy',
    difficulty: 'beginner',
    description: 'Essential financial skills for managing community resources and sustainable movement funding.',
    learningObjectives: [
      'Understand basic budgeting principles',
      'Learn resource allocation strategies',
      'Develop sustainable funding models',
      'Practice transparent financial management'
    ],
    estimatedTime: 20,
    tags: ['finance', 'budgeting', 'fundraising', 'transparency'],
    content: [
      {
        type: 'text',
        title: 'Money in Movements',
        content: 'Financial transparency builds trust. Learn how community movements can manage resources effectively while maintaining accountability to supporters.',
        duration: 4
      },
      {
        type: 'interactive',
        title: 'Budget Simulation',
        content: 'Practice allocating limited resources across competing priorities.',
        duration: 8,
        interactive: [
          {
            type: 'simulation',
            question: 'You have 1000 units of resources. Allocate across: Community Events (40%), Outreach (30%), Operations (20%), Emergency Fund (10%)',
            options: ['400, 300, 200, 100'],
            correctAnswer: '400, 300, 200, 100',
            feedback: 'Correct! Balanced allocation ensures sustainability while maximizing impact.',
            points: 15
          }
        ]
      },
      {
        type: 'case_study',
        title: 'Successful Community Funding',
        content: 'Analyze how real community movements achieved financial sustainability.',
        duration: 5
      },
      {
        type: 'quiz',
        title: 'Financial Knowledge Check',
        content: 'Test your understanding of key financial concepts.',
        duration: 3
      }
    ],
    assessment: {
      type: 'practical_application',
      passingScore: 75,
      maxAttempts: 2,
      questions: [
        {
          id: 'fin_1',
          type: 'multiple_choice',
          question: 'What\'s the most important principle of community financial management?',
          options: [
            'Maximize profits',
            'Transparency and accountability',
            'Minimize expenses at all costs',
            'Keep financial information private'
          ],
          correctAnswer: 1,
          explanation: 'Transparency builds trust, the foundation of sustainable community support.',
          points: 25,
          difficulty: 'easy'
        },
        {
          id: 'fin_2',
          type: 'scenario_based',
          question: 'Your community receives unexpected funding. What\'s the best first step?',
          options: [
            'Immediately spend on visible projects',
            'Create a transparent allocation plan',
            'Save everything for future needs',
            'Distribute equally to all members'
          ],
          correctAnswer: 1,
          explanation: 'Planning ensures resources align with community priorities and maintains trust.',
          points: 25,
          difficulty: 'medium'
        }
      ]
    },
    rewards: {
      experience: 120,
      influence: 60,
      powerTokens: 15,
      badge: 'financial_steward',
      newAbility: 'resource_management'
    }
  },
  {
    id: 'teamwork_excellence',
    title: 'Building Effective Teams',
    category: 'teamwork',
    difficulty: 'intermediate',
    description: 'Master the art of building and leading teams that can achieve extraordinary results together.',
    learningObjectives: [
      'Understand team dynamics and roles',
      'Learn conflict resolution strategies',
      'Develop collaborative decision-making',
      'Practice inclusive team building'
    ],
    estimatedTime: 25,
    tags: ['teamwork', 'collaboration', 'conflict_resolution', 'inclusion'],
    content: [
      {
        type: 'text',
        title: 'The Power of Collective Action',
        content: 'Teams achieve what individuals cannot. Learn how to harness collective intelligence and energy for maximum impact.',
        duration: 5
      },
      {
        type: 'interactive',
        title: 'Role-Playing Scenarios',
        content: 'Practice handling common team challenges through interactive scenarios.',
        duration: 10,
        interactive: [
          {
            type: 'role_play',
            question: 'Team members disagree on strategy. How do you respond as the leader?',
            options: [
              'Impose your preferred solution',
              'Facilitate a structured discussion',
              'Let the team vote immediately',
              'Postpone decision until everyone agrees'
            ],
            correctAnswer: 1,
            feedback: 'Structured discussion ensures all perspectives are heard while moving toward decision.',
            points: 20
          }
        ]
      },
      {
        type: 'video',
        title: 'Team Success Stories',
        content: 'Learn from successful teams and their collaboration strategies.',
        duration: 7,
        mediaUrl: 'team_success_stories.mp4'
      },
      {
        type: 'case_study',
        title: 'Conflict Resolution in Practice',
        content: 'Analyze real examples of teams overcoming internal challenges.',
        duration: 3
      }
    ],
    assessment: {
      type: 'peer_evaluation',
      passingScore: 70,
      maxAttempts: 1,
      questions: [
        {
          id: 'team_1',
          type: 'multiple_choice',
          question: 'What\'s the most important factor in team success?',
          options: [
            'Individual talent levels',
            'Clear communication and shared goals',
            'Strict leadership control',
            'Similar personalities'
          ],
          correctAnswer: 1,
          explanation: 'Communication and shared purpose align diverse talents toward common objectives.',
          points: 25,
          difficulty: 'medium'
        }
      ]
    },
    rewards: {
      experience: 150,
      influence: 75,
      powerTokens: 20,
      badge: 'team_builder',
      newAbility: 'conflict_mediation'
    }
  },
  {
    id: 'civic_engagement_strategies',
    title: 'Civic Awareness and Engagement',
    category: 'civic_awareness',
    difficulty: 'intermediate',
    description: 'Learn how to engage with civic systems while maintaining movement independence and effectiveness.',
    learningObjectives: [
      'Understand civic structures and processes',
      'Learn effective advocacy strategies',
      'Develop community organizing tactics',
      'Practice ethical civic engagement'
    ],
    estimatedTime: 30,
    tags: ['civic', 'advocacy', 'organizing', 'ethics'],
    content: [
      {
        type: 'text',
        title: 'Understanding Power Structures',
        content: 'Effective civic engagement requires understanding how systems work and where to apply pressure for positive change.',
        duration: 6
      },
      {
        type: 'interactive',
        title: 'Advocacy Planning Workshop',
        content: 'Plan a complete advocacy campaign from strategy to execution.',
        duration: 12,
        interactive: [
          {
            type: 'drag_drop',
            question: 'Arrange these advocacy steps in correct order: Research → Build Coalition → Public Campaign → Policy Proposal → Follow-up',
            options: ['Research', 'Build Coalition', 'Public Campaign', 'Policy Proposal', 'Follow-up'],
            correctAnswer: 'Research, Build Coalition, Public Campaign, Policy Proposal, Follow-up',
            feedback: 'Correct! Systematic advocacy maximizes impact and sustainability.',
            points: 30
          }
        ]
      },
      {
        type: 'scenario',
        title: 'Ethical Dilemmas',
        content: 'Navigate complex ethical situations in civic engagement.',
        duration: 8
      },
      {
        type: 'case_study',
        title: 'Successful Movements',
        content: 'Study historical examples of effective civic engagement and social change.',
        duration: 4
      }
    ],
    assessment: {
      type: 'practical_application',
      passingScore: 80,
      maxAttempts: 2,
      questions: [
        {
          id: 'civic_1',
          type: 'scenario_based',
          question: 'Your movement wants to influence local policy. What\'s the most effective first step?',
          options: [
            'Organize large protests immediately',
            'Research and understand the current system',
            'Demand meetings with officials',
            'Start a media campaign without preparation'
          ],
          correctAnswer: 1,
          explanation: 'Research ensures your advocacy is informed, targeted, and likely to succeed.',
          points: 25,
          difficulty: 'medium'
        }
      ]
    },
    rewards: {
      experience: 180,
      influence: 90,
      powerTokens: 25,
      badge: 'civic_champion',
      newAbility: 'policy_advocacy'
    }
  },
  {
    id: 'entrepreneurship_mindset',
    title: 'Entrepreneurship for Social Change',
    category: 'entrepreneurship',
    difficulty: 'advanced',
    description: 'Apply entrepreneurial thinking to create sustainable social impact and community value.',
    learningObjectives: [
      'Develop entrepreneurial mindset',
      'Learn social business models',
      'Practice innovation and adaptation',
      'Create sustainable impact ventures'
    ],
    estimatedTime: 35,
    tags: ['entrepreneurship', 'innovation', 'sustainability', 'social_business'],
    content: [
      {
        type: 'text',
        title: 'Entrepreneurship as Social Tool',
        content: 'Entrepreneurial thinking can solve social problems while creating sustainable community value.',
        duration: 8
      },
      {
        type: 'interactive',
        title: 'Social Business Model Canvas',
        content: 'Design a complete social business model for community impact.',
        duration: 15,
        interactive: [
          {
            type: 'simulation',
            question: 'Build a sustainable model balancing: Social Impact (40%), Financial Sustainability (30%), Community Ownership (20%), Scalability (10%)',
            options: [],
            correctAnswer: '',
            feedback: 'Great work balancing multiple objectives for maximum sustainable impact!',
            points: 40
          }
        ]
      },
      {
        type: 'video',
        title: 'Social Entrepreneur Success Stories',
        content: 'Learn from entrepreneurs who created both social and financial value.',
        duration: 7,
        mediaUrl: 'social_entrepreneurs.mp4'
      },
      {
        type: 'case_study',
        title: 'Innovation in Community Context',
        content: 'Analyze how innovation solves real community problems.',
        duration: 5
      }
    ],
    assessment: {
      type: 'reflection',
      passingScore: 75,
      maxAttempts: 1,
      questions: [
        {
          id: 'entre_1',
          type: 'short_answer',
          question: 'Describe a community problem you could solve with entrepreneurial thinking. What\'s your approach?',
          correctAnswer: '',
          explanation: 'Reflection connects learning to real-world application and personal motivation.',
          points: 50,
          difficulty: 'hard'
        }
      ]
    },
    rewards: {
      experience: 200,
      influence: 100,
      powerTokens: 30,
      badge: 'social_innovator',
      newAbility: 'venture_creation',
      certificate: 'social_entrepreneurship'
    }
  },
  {
    id: 'communication_mastery',
    title: 'Strategic Communication',
    category: 'communication',
    difficulty: 'advanced',
    description: 'Master the art of persuasive communication that moves people to action and builds lasting support.',
    learningObjectives: [
      'Develop persuasive messaging',
      'Learn multi-channel communication',
      'Master public speaking skills',
      'Practice digital communication strategy'
    ],
    estimatedTime: 40,
    tags: ['communication', 'persuasion', 'public_speaking', 'digital_strategy'],
    content: [
      {
        type: 'text',
        title: 'Communication That Moves People',
        content: 'Great communication combines emotional connection with logical reasoning to inspire action.',
        duration: 10
      },
      {
        type: 'interactive',
        title: 'Message Crafting Workshop',
        content: 'Craft compelling messages for different audiences and platforms.',
        duration: 15,
        interactive: [
          {
            type: 'multiple_choice',
            question: 'Which message element is most important for community mobilization?',
            options: [
              'Technical details and data',
              'Emotional connection and shared values',
              'Urgency and fear tactics',
              'Complex language and jargon'
            ],
            correctAnswer: 1,
            feedback: 'Emotional connection and shared values create lasting commitment to the cause.',
            points: 25
          }
        ]
      },
      {
        type: 'video',
        title: 'Master Communicators',
        content: 'Study techniques of history\'s most effective movement communicators.',
        duration: 10,
        mediaUrl: 'communication_masters.mp4'
      },
      {
        type: 'role_play',
        title: 'Public Speaking Practice',
        content: 'Practice and receive feedback on your public speaking skills.',
        duration: 5
      }
    ],
    assessment: {
      type: 'practical_application',
      passingScore: 85,
      maxAttempts: 2,
      questions: [
        {
          id: 'comm_1',
          type: 'scenario_based',
          question: 'You need to convince a skeptical community about your movement. What\'s your approach?',
          options: [
            'Present overwhelming evidence and logic',
            'Share personal stories and emotional appeals',
            'Use authority figures to validate your message',
            'Focus on technical details and complex plans'
          ],
          correctAnswer: 1,
          explanation: 'Personal stories and emotional connection build trust and overcome skepticism effectively.',
          points: 30,
          difficulty: 'hard'
        }
      ]
    },
    rewards: {
      experience: 250,
      influence: 125,
      powerTokens: 40,
      badge: 'master_communicator',
      newAbility: 'persuasive_speaking',
      certificate: 'strategic_communication'
    }
  }
];

export const getEducationalContentById = (id: string): EducationalContent | undefined => {
  return EDUCATIONAL_CONTENT.find(content => content.id === id);
};

export const getEducationalContentByCategory = (category: string): EducationalContent[] => {
  return EDUCATIONAL_CONTENT.filter(content => content.category === category);
};

export const getEducationalContentByDifficulty = (difficulty: string): EducationalContent[] => {
  return EDUCATIONAL_CONTENT.filter(content => content.difficulty === difficulty);
};

export const getRecommendedContent = (playerLevel: number, completedContent: string[]): EducationalContent[] => {
  return EDUCATIONAL_CONTENT.filter(content => {
    const levelAppropriate = playerLevel >= (content.difficulty === 'beginner' ? 1 : content.difficulty === 'intermediate' ? 10 : 20);
    const notCompleted = !completedContent.includes(content.id);
    const hasPrerequisites = !content.prerequisites || content.prerequisites.every(prereq => completedContent.includes(prereq));
    
    return levelAppropriate && notCompleted && hasPrerequisites;
  }).sort((a, b) => {
    // Sort by difficulty then by estimated time
    const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
    return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty] || a.estimatedTime - b.estimatedTime;
  });
};

// Learning progress tracking
export interface LearningProgress {
  contentId: string;
  playerId: string;
  startedAt: string;
  completedAt?: string;
  currentModule: number;
  assessmentScore?: number;
  assessmentAttempts: number;
  rewardsClaimed: boolean;
  timeSpent: number; // minutes
  notes?: string;
}

export const calculateLearningPath = (playerLevel: number, interests: string[]): EducationalContent[] => {
  const relevantContent = EDUCATIONAL_CONTENT.filter(content => {
    const levelMatch = playerLevel >= (content.difficulty === 'beginner' ? 1 : content.difficulty === 'intermediate' ? 10 : 20);
    const interestMatch = interests.some(interest => content.tags.includes(interest));
    return levelMatch && interestMatch;
  });

  return relevantContent.sort((a, b) => {
    // Prioritize based on interests and difficulty progression
    const aScore = a.difficulty === 'beginner' ? 3 : a.difficulty === 'intermediate' ? 2 : 1;
    const bScore = b.difficulty === 'beginner' ? 3 : b.difficulty === 'intermediate' ? 2 : 1;
    return bScore - aScore;
  });
};

export const getLearningStreak = (progress: LearningProgress[]): number => {
  if (progress.length === 0) return 0;
  
  const sortedProgress = progress.sort((a, b) => new Date(b.completedAt || b.startedAt).getTime() - new Date(a.completedAt || a.startedAt).getTime());
  
  let streak = 0;
  let currentDate = new Date();
  
  for (const item of sortedProgress) {
    const itemDate = new Date(item.completedAt || item.startedAt);
    const daysDiff = Math.floor((currentDate.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= streak + 1) {
      streak++;
      currentDate = itemDate;
    } else {
      break;
    }
  }
  
  return streak;
};
