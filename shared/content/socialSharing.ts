export interface SocialSharingSystem {
  shareableMoments: ShareableMoment[];
  viralMechanics: ViralMechanic[];
  sharingRewards: SharingReward[];
  socialProof: SocialProofSystem;
  communityImpact: CommunityImpact;
  crossPlatformIntegration: CrossPlatformIntegration;
}

export interface ShareableMoment {
  id: string;
  type: 'achievement' | 'milestone' | 'competition' | 'habit_streak' | 'story_progress' | 'rare_event';
  name: string;
  description: string;
  visualTemplate: VisualTemplate;
  shareText: ShareText[];
  emotionalHook: EmotionalHook;
  viralPotential: number; // 1-100
  requirements: SharingRequirement[];
  rewards: SharingReward[];
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'conditional';
}

export interface VisualTemplate {
  type: 'image' | 'video' | 'animation' | 'interactive' | 'live_card';
  style: 'minimalist' | 'dramatic' | 'celebration' | 'professional' | 'artistic';
  colors: string[];
  animations: string[];
  layout: 'portrait' | 'landscape' | 'square' | 'story';
  customElements: string[];
}

export interface ShareText {
  platform: 'telegram' | 'whatsapp' | 'twitter' | 'instagram' | 'facebook' | 'tiktok';
  template: string;
  variables: string[];
  hashtags: string[];
  callToAction: string;
}

export interface EmotionalHook {
  primary: 'pride' | 'excitement' | 'inspiration' | 'achievement' | 'belonging' | 'growth';
  secondary: 'motivation' | 'curiosity' | 'competition' | 'community' | 'purpose';
  intensity: number; // 1-10
  duration: number; // minutes of emotional resonance
}

export interface SharingRequirement {
  type: 'level' | 'achievement' | 'streak' | 'rank' | 'special_event';
  value: number | string;
  description: string;
}

export interface ViralMechanic {
  id: string;
  name: string;
  type: 'chain_reaction' | 'social_proof' | 'fomo' | 'exclusivity' | 'competition' | 'collaboration';
  description: string;
  trigger: ViralTrigger;
  effect: ViralEffect;
  sustainability: ViralSustainability;
  metrics: ViralMetrics;
}

export interface ViralTrigger {
  condition: string;
  threshold: number;
  multiplier: number;
  timeWindow: number; // hours
}

export interface ViralEffect {
  reachMultiplier: number;
  engagementBoost: number;
  conversionRate: number;
  duration: number;
  cascadingEffect: boolean;
}

export interface ViralSustainability {
  decayRate: number; // per hour
  refreshMechanism: string;
  maximumDuration: number; // hours
  revivalConditions: string[];
}

export interface ViralMetrics {
  shares: number;
  views: number;
  engagement: number;
  conversions: number;
  reach: number;
  viralityScore: number;
}

export interface SharingReward {
  type: 'immediate' | 'cumulative' | 'milestone' | 'viral_bonus';
  experience: number;
  influence: number;
  powerTokens: number;
  exclusiveItems: string[];
  socialCapital: number;
  communityImpact: number;
}

export interface SocialProofSystem {
  testimonials: Testimonial[];
  leaderboards: SocialLeaderboard[];
  achievements: SocialAchievement[];
  reputation: ReputationSystem;
  socialCapital: SocialCapitalSystem;
}

export interface Testimonial {
  id: string;
  playerId: string;
  playerName: string;
  content: string;
  rating: number; // 1-5
  category: 'gameplay' | 'community' | 'growth' | 'achievement';
  visibility: 'public' | 'friends' | 'community';
  verified: boolean;
  featured: boolean;
  date: string;
}

export interface SocialLeaderboard {
  id: string;
  name: string;
  type: 'shares' | 'influence' | 'community_impact' | 'viral_moments' | 'social_capital';
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  filters: LeaderboardFilter[];
  maxEntries: number;
  updateFrequency: number;
}

export interface SocialAchievement {
  id: string;
  name: string;
  description: string;
  category: 'sharing' | 'influence' | 'community' | 'viral' | 'social_capital';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  requirements: AchievementRequirement[];
  rewards: AchievementReward[];
  socialImpact: number;
}

export interface ReputationSystem {
  score: number;
  level: string;
  badges: string[];
  titles: string[];
  privileges: string[];
  history: ReputationHistory[];
}

export interface SocialCapitalSystem {
  balance: number;
  earned: number;
  spent: number;
  sources: CapitalSource[];
  uses: CapitalUse[];
  multiplier: number;
}

export interface CommunityImpact {
  initiatives: CommunityInitiative[];
  projects: CommunityProject[];
  collaborations: Collaboration[];
  measurableImpact: ImpactMetrics;
  recognition: ImpactRecognition;
}

export interface CommunityInitiative {
  id: string;
  name: string;
  description: string;
  type: 'educational' | 'charitable' | 'environmental' | 'cultural' | 'technological';
  goal: number;
  current: number;
  deadline: string;
  participants: string[];
  rewards: InitiativeReward[];
}

export interface CommunityProject {
  id: string;
  name: string;
  description: string;
  phases: ProjectPhase[];
  requirements: ProjectRequirement[];
  budget: number;
  timeline: string;
  impact: ProjectImpact;
}

export interface Collaboration {
  id: string;
  name: string;
  partners: string[];
  type: 'sponsorship' | 'partnership' | 'joint_venture' | 'community_service';
  objectives: string[];
  benefits: string[];
  duration: string;
  success: CollaborationMetrics;
}

export interface CrossPlatformIntegration {
  platforms: Platform[];
  unifiedMessaging: UnifiedMessaging;
  crossPlatformRewards: CrossPlatformReward[];
  analytics: CrossPlatformAnalytics;
  automation: SharingAutomation;
}

export interface Platform {
  name: string;
  type: 'messaging' | 'social' | 'professional' | 'gaming' | 'content';
  integration: PlatformIntegration;
  features: PlatformFeature[];
  audience: PlatformAudience;
}

export interface PlatformIntegration {
  apiAvailable: boolean;
  authentication: string[];
  permissions: string[];
  rateLimits: RateLimit;
  supportedFormats: string[];
}

export interface PlatformFeature {
  name: string;
  type: 'sharing' | 'messaging' | 'analytics' | 'automation' | 'customization';
  enabled: boolean;
  configuration: any;
}

export interface PlatformAudience {
  size: number;
  demographics: string[];
  engagement: number;
  growth: number;
  relevance: number;
}

export const SOCIAL_SHARING_SYSTEM: SocialSharingSystem = {
  shareableMoments: [
    {
      id: 'first_victory',
      name: 'First Victory Celebration',
      type: 'achievement',
      description: 'Share your first competition victory with the world!',
      visualTemplate: {
        type: 'image',
        style: 'celebration',
        colors: ['#FFD700', '#FF6B35', '#4ECDC4'],
        animations: ['confetti', 'fireworks', 'victory_dance'],
        layout: 'square',
        customElements: ['trophy', 'medal', 'victory_text']
      },
      shareText: [
        {
          platform: 'telegram',
          template: '🏆 VICTORY! Just won my first competition in People Power Journey! 🚀 Day {streak} of the journey and feeling unstoppable! Join the movement: {referral_link}',
          variables: ['streak', 'referral_link'],
          hashtags: ['PeoplePower', 'FirstVictory', 'MovementBuilder'],
          callToAction: 'Join my movement!'
        },
        {
          platform: 'whatsapp',
          template: '🔥 Amazing news! I just won my first competition! 🏆 This journey is incredible - building a real movement with amazing people. Want to join? {referral_link}',
          variables: ['referral_link'],
          hashtags: [],
          callToAction: 'Join us!'
        }
      ],
      emotionalHook: {
        primary: 'pride',
        secondary: 'excitement',
        intensity: 9,
        duration: 120
      },
      viralPotential: 85,
      requirements: [
        { type: 'achievement', value: 'first_win', description: 'Win first competition' }
      ],
      rewards: [
        {
          type: 'immediate',
          experience: 100,
          influence: 75,
          powerTokens: 25,
          exclusiveItems: ['first_victory_frame'],
          socialCapital: 50,
          communityImpact: 10
        }
      ],
      frequency: 'once'
    },
    {
      id: 'streak_milestone',
      name: 'Streak Master',
      type: 'habit_streak',
      description: 'Celebrate your incredible consistency and inspire others!',
      visualTemplate: {
        type: 'animation',
        style: 'dramatic',
        colors: ['#FF6B35', '#F7931E', '#FFD700'],
        animations: ['streak_counter', 'fire_effect', 'glow_pulse'],
        layout: 'portrait',
        customElements: ['calendar', 'streak_number', 'flame_effect']
      },
      shareText: [
        {
          platform: 'telegram',
          template: '🔥 {streak} DAY STREAK! 🔥 Consistency is creating real change. Every day building stronger communities and better leaders. Who\'s with me? {referral_link}',
          variables: ['streak', 'referral_link'],
          hashtags: ['Consistency', 'DailyHabits', 'MovementBuilding'],
          callToAction: 'Build with me!'
        }
      ],
      emotionalHook: {
        primary: 'achievement',
        secondary: 'motivation',
        intensity: 8,
        duration: 90
      },
      viralPotential: 75,
      requirements: [
        { type: 'streak', value: 7, description: '7-day streak' }
      ],
      rewards: [
        {
          type: 'milestone',
          experience: 200,
          influence: 150,
          powerTokens: 50,
          exclusiveItems: ['streak_master_badge'],
          socialCapital: 100,
          communityImpact: 25
        }
      ],
      frequency: 'weekly'
    },
    {
      id: 'viral_moment',
      name: 'Going Viral',
      type: 'rare_event',
      description: 'Your content is spreading like wildfire! Capture this moment!',
      visualTemplate: {
        type: 'live_card',
        style: 'artistic',
        colors: ['#9B59B6', '#E74C3C', '#3498DB'],
        animations: ['viral_spread', 'network_effect', 'explosion'],
        layout: 'story',
        customElements: ['virus_icon', 'spreading_network', 'live_counter']
      },
      shareText: [
        {
          platform: 'tiktok',
          template: '🚀 WE\'RE GOING VIRAL! 🚀 {share_count} people shared my journey in {time_hours} hours! This movement is unstoppable! #PeoplePower #ViralMovement',
          variables: ['share_count', 'time_hours'],
          hashtags: ['PeoplePower', 'Viral', 'Movement'],
          callToAction: 'Be part of history!'
        }
      ],
      emotionalHook: {
        primary: 'excitement',
        secondary: 'belonging',
        intensity: 10,
        duration: 180
      },
      viralPotential: 95,
      requirements: [
        { type: 'special_event', value: 'viral_trigger', description: 'Content goes viral' }
      ],
      rewards: [
        {
          type: 'viral_bonus',
          experience: 1000,
          influence: 750,
          powerTokens: 250,
          exclusiveItems: ['viral_legend_badge', 'viral_aura'],
          socialCapital: 500,
          communityImpact: 100
        }
      ],
      frequency: 'conditional'
    }
  ],
  viralMechanics: [
    {
      id: 'chain_reaction',
      name: 'Chain Reaction Sharing',
      type: 'chain_reaction',
      description: 'Each share triggers bonus rewards for the original sharer',
      trigger: {
        condition: 'someone_shares_your_content',
        threshold: 1,
        multiplier: 1.5,
        timeWindow: 24
      },
      effect: {
        reachMultiplier: 2.0,
        engagementBoost: 1.3,
        conversionRate: 0.15,
        duration: 48,
        cascadingEffect: true
      },
      sustainability: {
        decayRate: 0.1,
        refreshMechanism: 'new_share_resets_timer',
        maximumDuration: 168,
        revivalConditions: ['milestone_achievement', 'viral_content']
      },
      metrics: {
        shares: 0,
        views: 0,
        engagement: 0,
        conversions: 0,
        reach: 0,
        viralityScore: 0
      }
    },
    {
      id: 'social_proof_amplification',
      name: 'Social Proof Amplification',
      type: 'social_proof',
      description: 'More shares = more visibility = more exponential growth',
      trigger: {
        condition: 'share_count_threshold',
        threshold: 10,
        multiplier: 2.0,
        timeWindow: 6
      },
      effect: {
        reachMultiplier: 3.0,
        engagementBoost: 2.0,
        conversionRate: 0.25,
        duration: 72,
        cascadingEffect: true
      },
      sustainability: {
        decayRate: 0.05,
        refreshMechanism: 'continuous_engagement',
        maximumDuration: 240,
        revivalConditions: ['community_challenge', 'featured_content']
      },
      metrics: {
        shares: 0,
        views: 0,
        engagement: 0,
        conversions: 0,
        reach: 0,
        viralityScore: 0
      }
    }
  ],
  sharingRewards: [
    {
      type: 'immediate',
      experience: 25,
      influence: 15,
      powerTokens: 5,
      exclusiveItems: [],
      socialCapital: 10,
      communityImpact: 2
    },
    {
      type: 'cumulative',
      experience: 100,
      influence: 75,
      powerTokens: 25,
      exclusiveItems: ['social_butterfly_badge'],
      socialCapital: 50,
      communityImpact: 10
    },
    {
      type: 'milestone',
      experience: 500,
      influence: 300,
      powerTokens: 100,
      exclusiveItems: ['viral_champion_crown'],
      socialCapital: 250,
      communityImpact: 50
    },
    {
      type: 'viral_bonus',
      experience: 2000,
      influence: 1200,
      powerTokens: 400,
      exclusiveItems: ['viral_legend_status', 'viral_aura'],
      socialCapital: 1000,
      communityImpact: 200
    }
  ],
  socialProof: {
    testimonials: [],
    leaderboards: [
      {
        id: 'daily_shares',
        name: 'Daily Sharing Champions',
        type: 'shares',
        period: 'daily',
        filters: [
          { type: 'region', options: ['africa', 'global'], default: 'africa' }
        ],
        maxEntries: 100,
        updateFrequency: 60
      }
    ],
    achievements: [
      {
        id: 'social_influencer',
        name: 'Social Influencer',
        description: 'Generate 1000 shares through your content',
        category: 'sharing',
        rarity: 'epic',
        requirements: [
          { type: 'shares', value: 1000, description: '1000 total shares' }
        ],
        rewards: [
          {
            type: 'milestone',
            experience: 1500,
            influence: 900,
            powerTokens: 300,
            exclusiveItems: ['influencer_badge'],
            socialCapital: 750,
            communityImpact: 150
          }
        ],
        socialImpact: 75
      }
    ],
    reputation: {
      score: 0,
      level: 'Newcomer',
      badges: [],
      titles: [],
      privileges: [],
      history: []
    },
    socialCapital: {
      balance: 0,
      earned: 0,
      spent: 0,
      sources: [],
      uses: [],
      multiplier: 1.0
    }
  },
  communityImpact: {
    initiatives: [
      {
        id: 'education_fund',
        name: 'Community Education Fund',
        description: 'Fund educational programs through social sharing impact',
        type: 'educational',
        goal: 10000,
        current: 0,
        deadline: '2026-12-31',
        participants: [],
        rewards: [
          {
            type: 'milestone',
            experience: 500,
            influence: 300,
            powerTokens: 100,
            exclusiveItems: ['education_supporter_badge'],
            socialCapital: 250,
            communityImpact: 100
          }
        ]
      }
    ],
    projects: [],
    collaborations: [],
    measurableImpact: {
      livesImpacted: 0,
      communitiesReached: 0,
      educationalHours: 0,
      socialChangeScore: 0
    },
    recognition: {
      impactBadges: [],
      communityTitles: [],
      featuredStories: []
    }
  },
  crossPlatformIntegration: {
    platforms: [
      {
        name: 'Telegram',
        type: 'messaging',
        integration: {
          apiAvailable: true,
          authentication: ['bot_token', 'oauth'],
          permissions: ['send_messages', 'share_content'],
          rateLimits: { requests: 30, window: 'minute' },
          supportedFormats: ['image', 'video', 'text', 'animation']
        },
        features: [
          {
            name: 'auto_sharing',
            type: 'automation',
            enabled: true,
            configuration: { frequency: 'auto', platforms: ['telegram'] }
          }
        ],
        audience: {
          size: 700000000,
          demographics: ['global', 'tech_savvy', 'mobile_first'],
          engagement: 0.85,
          growth: 0.15,
          relevance: 0.95
        }
      }
    ],
    unifiedMessaging: {
      crossPlatformSync: true,
      consistentBranding: true,
      adaptiveContent: true,
      unifiedAnalytics: true
    },
    crossPlatformRewards: [
      {
        platforms: ['telegram', 'whatsapp'],
        bonus: 1.5,
        description: 'Multi-platform sharing bonus'
      }
    ],
    analytics: {
      realTimeTracking: true,
      crossPlatformMetrics: true,
      viralPrediction: true,
      optimizationSuggestions: true
    },
    automation: {
      smartScheduling: true,
      contentOptimization: true,
      platformSpecificAdaptation: true,
      performanceMonitoring: true
    }
  }
};

// Dynamic sharing content generation
export interface SharingContentGenerator {
  generatePersonalizedContent: (playerProfile: any, momentType: string) => ShareableMoment;
  generateViralContent: (triggerEvent: any) => ShareableMoment;
  generateTrendingContent: (trends: any[]) => ShareableMoment[];
  optimizeForPlatform: (content: ShareableMoment, platform: string) => ShareText;
}

export const generatePersonalizedContent = (playerProfile: any, momentType: string): ShareableMoment => {
  const baseMoments = SOCIAL_SHARING_SYSTEM.shareableMoments;
  const moment = baseMoments.find(m => m.id === momentType);
  
  if (!moment) {
    throw new Error(`Moment type ${momentType} not found`);
  }

  // Personalize based on player profile
  const personalizedMoment = { ...moment };
  
  // Adjust emotional intensity based on player personality
  if (playerProfile.personality?.includes('enthusiastic')) {
    personalizedMoment.emotionalHook.intensity *= 1.2;
  }
  
  // Boost viral potential for social players
  if (playerProfile.socialPreference === 'public') {
    personalizedMoment.viralPotential *= 1.3;
  }
  
  return personalizedMoment;
};

export const calculateViralScore = (metrics: ViralMetrics): number => {
  const shareWeight = 0.3;
  const viewWeight = 0.2;
  const engagementWeight = 0.3;
  const conversionWeight = 0.2;
  
  const normalizedShares = Math.min(metrics.shares / 100, 1);
  const normalizedViews = Math.min(metrics.views / 1000, 1);
  const normalizedEngagement = Math.min(metrics.engagement / 500, 1);
  const normalizedConversions = Math.min(metrics.conversions / 50, 1);
  
  return Math.round(
    (normalizedShares * shareWeight +
     normalizedViews * viewWeight +
     normalizedEngagement * engagementWeight +
     normalizedConversions * conversionWeight) * 100
  );
};

export const predictViralPotential = (content: ShareableMoment, playerProfile: any): number => {
  let basePotential = content.viralPotential;
  
  // Player influence modifier
  if (playerProfile.influence > 1000) basePotential *= 1.2;
  if (playerProfile.influence > 5000) basePotential *= 1.5;
  
  // Content type modifier
  if (content.type === 'rare_event') basePotential *= 1.3;
  if (content.type === 'achievement') basePotential *= 1.1;
  
  // Time modifier
  const hour = new Date().getHours();
  if (hour >= 18 && hour <= 22) basePotential *= 1.2; // Prime time
  
  return Math.min(Math.round(basePotential), 100);
};
