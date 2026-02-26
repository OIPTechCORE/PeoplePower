export interface EmotionalInvestmentSystem {
  emotionalJourney: EmotionalJourney;
  investmentMechanics: InvestmentMechanic[];
  emotionalRewards: EmotionalReward[];
  psychologicalHooks: PsychologicalHook[];
  longTermEngagement: LongTermEngagement;
  emotionalAnalytics: EmotionalAnalytics;
}

export interface EmotionalJourney {
  phases: EmotionalPhase[];
  milestones: EmotionalMilestone[];
  transformations: EmotionalTransformation;
  personalGrowth: PersonalGrowthTrack;
  communityConnection: CommunityEmotionalBond;
}

export interface EmotionalPhase {
  id: string;
  name: string;
  description: string;
  duration: number; // days
  emotionalTheme: EmotionalTheme;
  challenges: EmotionalChallenge[];
  growthOpportunities: GrowthOpportunity[];
  completionRewards: PhaseReward[];
  nextPhase: string;
}

export interface EmotionalTheme {
  primary: 'hope' | 'determination' | 'courage' | 'wisdom' | 'leadership' | 'purpose';
  secondary: 'inspiration' | 'resilience' | 'growth' | 'connection' | 'achievement';
  colorPalette: string[];
  musicTheme: string;
  visualMotifs: string[];
  narrativeArc: string;
}

export interface EmotionalChallenge {
  id: string;
  name: string;
  type: 'internal' | 'external' | 'social' | 'ethical' | 'strategic';
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  description: string;
  emotionalImpact: number; // 1-10
  learningOutcome: string;
  resolutionOptions: ResolutionOption[];
}

export interface ResolutionOption {
  id: string;
  text: string;
  approach: 'compassionate' | 'strategic' | 'courageous' | 'wise' | 'balanced';
  emotionalCost: number;
  growthBenefit: number;
  communityImpact: number;
  longTermConsequences: string[];
}

export interface GrowthOpportunity {
  id: string;
  name: string;
  description: string;
  type: 'skill' | 'wisdom' | 'relationship' | 'leadership' | 'self_awareness';
  investment: EmotionalInvestment;
  potential: GrowthPotential;
  timeframe: number; // days
}

export interface EmotionalInvestment {
  type: 'time' | 'energy' | 'vulnerability' | 'trust' | 'commitment' | 'sacrifice';
  amount: number;
  description: string;
  risk: number; // 1-10
  expectedReturn: number;
  emotionalCurrency: string;
}

export interface GrowthPotential {
  skillGrowth: number;
  wisdomGain: number;
  relationshipBuilding: number;
  leadershipDevelopment: number;
  selfAwareness: number;
}

export interface PhaseReward {
  emotionalMastery: string;
  newAbilities: string[];
  titles: string[];
  badges: string[];
  visualEvolution: string[];
  storyProgression: string;
}

export interface EmotionalMilestone {
  id: string;
  name: string;
  description: string;
  emotionalThreshold: number;
  requirements: MilestoneRequirement[];
  celebration: MilestoneCelebration;
  permanentChanges: PermanentChange[];
}

export interface MilestoneRequirement {
  type: 'emotional_investment' | 'consistency' | 'growth' | 'community_impact' | 'self_discovery';
  value: number;
  description: string;
  timeframe: number; // days
}

export interface MilestoneCelebration {
  type: 'personal' | 'community' | 'ceremony' | 'reflection';
  description: string;
  visualEffects: string[];
  socialSharing: ShareableMoment;
  emotionalPeak: number;
}

export interface PermanentChange {
  category: 'mindset' | 'ability' | 'perspective' | 'relationship' | 'leadership';
  description: string;
  gameMechanics: string[];
  visualIndicators: string[];
}

export interface EmotionalTransformation {
  stages: TransformationStage[];
  triggers: TransformationTrigger[];
  evolutionPaths: EvolutionPath[];
  masteryLevels: MasteryLevel[];
}

export interface TransformationStage {
  id: string;
  name: string;
  description: string;
  emotionalState: EmotionalState;
  challenges: string[];
  rewards: string[];
  visualTransformation: string;
}

export interface EmotionalState {
  core: 'confident' | 'humble' | 'passionate' | 'wise' | 'resilient' | 'inspired';
  modifiers: string[];
  intensity: number; // 1-10
  stability: number; // 1-10
}

export interface TransformationTrigger {
  type: 'achievement' | 'failure' | 'community_event' | 'personal_reflection' | 'external_crisis';
  condition: string;
  emotionalImpact: number;
  transformation: string;
}

export interface EvolutionPath {
  name: string;
  description: string;
  requirements: PathRequirement[];
  benefits: PathBenefit[];
  specialization: string;
}

export interface PathRequirement {
  type: 'emotional_mastery' | 'skill_development' | 'community_leadership' | 'personal_growth';
  value: number;
  description: string;
}

export interface PathBenefit {
  category: 'personal' | 'community' | 'leadership' | 'gameplay';
  description: string;
  value: number;
  uniqueness: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface MasteryLevel {
  level: number;
  name: string;
  requirements: MasteryRequirement[];
  abilities: MasteryAbility[];
  recognition: MasteryRecognition;
}

export interface MasteryRequirement {
  type: 'emotional_depth' | 'consistency' | 'impact' | 'wisdom' | 'leadership';
  value: number;
  description: string;
}

export interface MasteryAbility {
  name: string;
  description: string;
  type: 'passive' | 'active' | 'ultimate';
  power: number;
  cooldown?: number;
  duration?: number;
}

export interface MasteryRecognition {
  titles: string[];
  badges: string[];
  visualEffects: string[];
  communityStatus: string;
}

export interface PersonalGrowthTrack {
  dimensions: GrowthDimension[];
  assessments: PersonalAssessment[];
  developmentPlans: DevelopmentPlan[];
  progressTracking: ProgressTracking;
}

export interface GrowthDimension {
  name: string;
  description: string;
  currentLevel: number;
  maxLevel: number;
  experience: number;
  skills: string[];
  milestones: string[];
}

export interface PersonalAssessment {
  id: string;
  name: string;
  type: 'self_reflection' | 'peer_feedback' | 'performance_analysis' | 'emotional_intelligence';
  questions: AssessmentQuestion[];
  results: AssessmentResult[];
  recommendations: string[];
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'scale' | 'open_ended' | 'scenario';
  options?: string[];
  weight: number;
  category: string;
}

export interface AssessmentResult {
  dimension: string;
  score: number;
  interpretation: string;
  strengths: string[];
  areas_for_growth: string[];
}

export interface DevelopmentPlan {
  id: string;
  name: string;
  goals: DevelopmentGoal[];
  timeline: number; // days
  resources: string[];
  milestones: string[];
  tracking: string[];
}

export interface DevelopmentGoal {
  description: string;
  target: number;
  current: number;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ProgressTracking {
  metrics: ProgressMetric[];
  history: ProgressHistory[];
  insights: ProgressInsight[];
  predictions: ProgressPrediction[];
}

export interface ProgressMetric {
  name: string;
  value: number;
  change: number;
  trend: 'improving' | 'stable' | 'declining';
  significance: 'high' | 'medium' | 'low';
}

export interface ProgressHistory {
  date: string;
  metrics: { [key: string]: number };
  events: string[];
  emotionalState: string;
}

export interface ProgressInsight {
  type: 'pattern' | 'correlation' | 'recommendation' | 'warning';
  description: string;
  data: any;
  actionability: 'immediate' | 'short_term' | 'long_term';
}

export interface ProgressPrediction {
  metric: string;
  prediction: number;
  confidence: number; // 0-100
  timeframe: number; // days
  factors: string[];
}

export interface CommunityEmotionalBond {
  connections: EmotionalConnection[];
  sharedExperiences: SharedExperience[];
  collectiveGrowth: CollectiveGrowth;
  emotionalSupport: EmotionalSupport;
  communityWellness: CommunityWellness;
}

export interface EmotionalConnection {
  id: string;
  playerId: string;
  playerName: string;
  type: 'mentorship' | 'friendship' | 'rivalry' | 'collaboration' | 'inspiration';
  strength: number; // 1-10
  history: ConnectionHistory[];
  mutualInvestment: number;
  growthPotential: number;
}

export interface ConnectionHistory {
  date: string;
  event: string;
  emotionalImpact: number;
  growth: number;
  significance: 'minor' | 'moderate' | 'major' | 'transformative';
}

export interface SharedExperience {
  id: string;
  name: string;
  description: string;
  participants: string[];
  emotionalImpact: number;
  sharedGrowth: number;
  memories: string[];
  legacy: string;
}

export interface CollectiveGrowth {
  metrics: CollectiveMetric[];
  achievements: CollectiveAchievement[];
  evolution: CommunityEvolution;
  impact: CommunityImpact;
}

export interface CollectiveMetric {
  name: string;
  value: number;
  change: number;
  contribution: { [playerId: string]: number };
}

export interface CollectiveAchievement {
  id: string;
  name: string;
  description: string;
  requirements: CollectiveRequirement[];
  rewards: CollectiveReward[];
  celebration: string;
}

export interface CollectiveRequirement {
  type: 'community_investment' | 'collective_action' | 'shared_goal' | 'emotional_synergy';
  value: number;
  description: string;
}

export interface CollectiveReward {
  type: 'community_bonus' | 'shared_ability' | 'collective_title' | 'group_visual';
  description: string;
  value: number;
  distribution: 'equal' | 'contribution_based' | 'leadership_bonus';
}

export interface CommunityEvolution {
  stage: string;
  characteristics: string[];
  abilities: string[];
  challenges: string[];
  nextStage: string;
}

export interface EmotionalSupport {
  systems: SupportSystem[];
  resources: SupportResource[];
  interventions: SupportIntervention[];
  outcomes: SupportOutcome[];
}

export interface SupportSystem {
  type: 'peer_support' | 'mentorship' | 'professional_help' | 'community_counseling';
  description: string;
  availability: string;
  effectiveness: number;
  accessibility: number;
}

export interface SupportResource {
  name: string;
  type: 'guide' | 'tool' | 'exercise' | 'meditation' | 'community';
  description: string;
  accessibility: string;
  effectiveness: number;
}

export interface SupportIntervention {
  trigger: string;
  type: 'preventive' | 'reactive' | 'developmental';
  description: string;
  implementation: string;
  success_rate: number;
}

export interface SupportOutcome {
  metric: string;
  improvement: number;
  sustainability: number;
  participant_satisfaction: number;
}

export interface CommunityWellness {
  indicators: WellnessIndicator[];
  programs: WellnessProgram[];
  initiatives: WellnessInitiative[];
  metrics: WellnessMetrics;
}

export interface WellnessIndicator {
  name: string;
  value: number;
  status: 'excellent' | 'good' | 'moderate' | 'concerning' | 'critical';
  trend: 'improving' | 'stable' | 'declining';
}

export interface WellnessProgram {
  name: string;
  description: string;
  participation: number;
  effectiveness: number;
  duration: number;
}

export interface WellnessInitiative {
  id: string;
  name: string;
  description: string;
  goals: string[];
  participants: string[];
  progress: number;
}

export interface WellnessMetrics {
  overall_score: number;
  individual_wellness: { [playerId: string]: number };
  community_factors: { [factor: string]: number };
  improvement_trends: string[];
}

export const EMOTIONAL_INVESTMENT_SYSTEM: EmotionalInvestmentSystem = {
  emotionalJourney: {
    phases: [
      {
        id: 'awakening',
        name: 'Emotional Awakening',
        description: 'Discover your inner strength and potential for leadership',
        duration: 30,
        emotionalTheme: {
          primary: 'hope',
          secondary: 'inspiration',
          colorPalette: ['#FFD700', '#FFA500', '#87CEEB'],
          musicTheme: 'hopeful_melodies',
          visualMotifs: ['sunrise', 'growing_plants', 'light_rays'],
          narrativeArc: 'from_doubt_to_possibility'
        },
        challenges: [
          {
            id: 'first_doubt',
            name: 'Facing Self-Doubt',
            type: 'internal',
            difficulty: 'easy',
            description: 'Confront your doubts about leadership potential',
            emotionalImpact: 6,
            learningOutcome: 'Self-awareness and confidence building',
            resolutionOptions: [
              {
                id: 'seek_guidance',
                text: 'Seek wisdom from mentors',
                approach: 'wise',
                emotionalCost: 3,
                growthBenefit: 7,
                communityImpact: 5,
                longTermConsequences: ['Builds support network', 'Shows humility']
              },
              {
                id: 'self_reflection',
                text: 'Reflect on past successes',
                approach: 'wise',
                emotionalCost: 4,
                growthBenefit: 6,
                communityImpact: 2,
                longTermConsequences: ['Builds self-reliance', 'Deeper understanding']
              },
              {
                id: 'take_action',
                text: 'Act despite fear',
                approach: 'courageous',
                emotionalCost: 6,
                growthBenefit: 9,
                communityImpact: 7,
                longTermConsequences: ['Builds courage', 'Inspires others']
              }
            ]
          }
        ],
        growthOpportunities: [
          {
            id: 'emotional_vulnerability',
            name: 'Practice Vulnerability',
            description: 'Share your fears and hopes with trusted allies',
            type: 'relationship',
            investment: {
              type: 'vulnerability',
              amount: 5,
              description: 'Open up emotionally',
              risk: 6,
              expectedReturn: 8,
              emotionalCurrency: 'trust_points'
            },
            potential: {
              skillGrowth: 7,
              wisdomGain: 6,
              relationshipBuilding: 9,
              leadershipDevelopment: 8,
              selfAwareness: 8
            },
            timeframe: 14
          }
        ],
        completionRewards: [
          {
            emotionalMastery: 'Hope_Bearer',
            newAbilities: ['inspire_others', 'emotional_resilience'],
            titles: ['Awakened Leader'],
            badges: ['first_steps_badge'],
            visualEvolution: ['hope_aura', 'light_effect'],
            storyProgression: 'Chapter 1: The Awakening'
          }
        ],
        nextPhase: 'growth'
      }
    ],
    milestones: [
      {
        id: 'emotional_breakthrough',
        name: 'Emotional Breakthrough',
        description: 'Moment of profound emotional clarity and strength',
        emotionalThreshold: 50,
        requirements: [
          {
            type: 'emotional_investment',
            value: 100,
            description: 'Invest 100 emotional currency',
            timeframe: 30
          }
        ],
        celebration: {
          type: 'personal',
          description: 'Private moment of emotional realization',
          visualEffects: ['light_burst', 'aura_expansion'],
          socialSharing: {
            id: 'breakthrough_share',
            type: 'achievement',
            name: 'Emotional Breakthrough',
            description: 'Share your breakthrough moment',
            visualTemplate: {
              type: 'image',
              style: 'dramatic',
              colors: ['#9B59B6', '#E74C3C', '#F39C12'],
              animations: ['light_ray', 'aura_glow'],
              layout: 'portrait',
              customElements: ['breakthrough_symbol', 'emotional_light']
            },
            shareText: [],
            emotionalHook: {
              primary: 'pride',
              secondary: 'inspiration',
              intensity: 9,
              duration: 120
            },
            viralPotential: 70,
            requirements: [],
            rewards: [],
            frequency: 'once'
          },
          emotionalPeak: 9
        },
        permanentChanges: [
          {
            category: 'mindset',
            description: 'Permanent emotional resilience',
            gameMechanics: ['emotional_armor', 'stress_resistance'],
            visualIndicators: ['resilient_aura', 'calm_demeanor']
          }
        ]
      }
    ],
    transformations: {
      stages: [
        {
          id: 'novice',
          name: 'Emotional Novice',
          description: 'Beginning to understand emotional depth',
          emotionalState: {
            core: 'humble',
            modifiers: ['learning', 'curious'],
            intensity: 4,
            stability: 3
          },
          challenges: ['self_doubt', 'emotional_confusion'],
          rewards: ['basic_empathy', 'self_awareness'],
          visualTransformation: 'subtle_glow'
        }
      ],
      triggers: [
        {
          type: 'achievement',
          condition: 'complete_emotional_challenge',
          emotionalImpact: 7,
          transformation: 'growth_stage'
        }
      ],
      evolutionPaths: [
        {
          name: 'Path of Wisdom',
          description: 'Focus on emotional intelligence and understanding',
          requirements: [
            {
              type: 'emotional_mastery',
              value: 50,
              description: 'Master 50 emotional challenges'
            }
          ],
          benefits: [
            {
              category: 'personal',
              description: 'Enhanced emotional intelligence',
              value: 25,
              uniqueness: 'rare'
            }
          ],
          specialization: 'emotional_sage'
        }
      ],
      masteryLevels: [
        {
          level: 1,
          name: 'Emotional Apprentice',
          requirements: [
            {
              type: 'emotional_depth',
              value: 10,
              description: 'Reach emotional depth of 10'
            }
          ],
          abilities: [
            {
              name: 'Empathy',
              description: 'Understand and share feelings of others',
              type: 'passive',
              power: 5
            }
          ],
          recognition: {
            titles: ['Empathetic Leader'],
            badges: ['empathy_badge'],
            visualEffects: ['understanding_aura'],
            communityStatus: 'Trusted Confidant'
          }
        }
      ]
    },
    personalGrowth: {
      dimensions: [
        {
          name: 'Emotional Intelligence',
          description: 'Ability to understand and manage emotions',
          currentLevel: 1,
          maxLevel: 100,
          experience: 0,
          skills: ['empathy', 'self_awareness', 'emotional_regulation'],
          milestones: ['first_emotional_breakthrough', 'emotional_mastery', 'wisdom_attained']
        }
      ],
      assessments: [
        {
          id: 'emotional_intelligence_baseline',
          name: 'Emotional Intelligence Assessment',
          type: 'self_reflection',
          questions: [
            {
              id: 'eq_1',
              question: 'How do you handle stress in leadership situations?',
              type: 'multiple_choice',
              options: ['Become overwhelmed', 'Stay calm and focused', 'Seek help', 'Take breaks'],
              weight: 10,
              category: 'emotional_regulation'
            }
          ],
          results: [
            {
              dimension: 'emotional_regulation',
              score: 65,
              interpretation: 'Good emotional control with room for growth',
              strengths: ['stress_management', 'focus_under_pressure'],
              areas_for_growth: ['emotional_expression', 'conflict_resolution']
            }
          ],
          recommendations: ['Practice mindfulness', 'Develop emotional vocabulary', 'Seek feedback']
        }
      ],
      developmentPlans: [
        {
          id: 'eq_development_plan',
          name: 'Emotional Intelligence Growth Plan',
          goals: [
            {
              description: 'Improve emotional regulation skills',
              target: 80,
              current: 65,
              deadline: '2026-06-01',
              priority: 'high'
            }
          ],
          timeline: 90,
          resources: ['emotional_intelligence_guide', 'meditation_exercises', 'peer_feedback'],
          milestones: ['eq_assessment_improvement', 'stress_mastery', 'emotional_leadership'],
          tracking: ['daily_emotional_journal', 'weekly_reflections', 'monthly_assessments']
        }
      ],
      progressTracking: {
        metrics: [
          {
            name: 'Emotional Intelligence Score',
            value: 65,
            change: 5,
            trend: 'improving',
            significance: 'high'
          }
        ],
        history: [
          {
            date: '2026-02-01',
            metrics: { 'eq_score': 60 },
            events: ['completed_emotional_challenge', 'practiced_vulnerability'],
            emotionalState: 'growing_confidence'
          }
        ],
        insights: [
          {
            type: 'pattern',
            description: 'Emotional growth accelerates after vulnerability practice',
            data: { correlation: 0.85 },
            actionability: 'immediate'
          }
        ],
        predictions: [
          {
            metric: 'emotional_intelligence',
            prediction: 75,
            confidence: 80,
            timeframe: 30,
            factors: ['consistent_practice', 'peer_support', 'self_reflection']
          }
        ]
      }
    },
    communityEmotionalBond: {
      connections: [
        {
          id: 'mentor_connection',
          playerId: 'mentor_123',
          playerName: 'Wisdom Guide',
          type: 'mentorship',
          strength: 8,
          history: [
            {
              date: '2026-02-15',
              event: 'guidance_session',
              emotionalImpact: 7,
              growth: 6,
              significance: 'major'
            }
          ],
          mutualInvestment: 150,
          growthPotential: 9
        }
      ],
      sharedExperiences: [
        {
          id: 'community_breakthrough',
          name: 'Community Emotional Breakthrough',
          description: 'Collective moment of emotional clarity and unity',
          participants: ['player_1', 'player_2', 'player_3'],
          emotionalImpact: 9,
          sharedGrowth: 8,
          memories: ['shared_vulnerability', 'collective_support', 'mutual_growth'],
          legacy: 'Stronger community bonds'
        }
      ],
      collectiveGrowth: {
        metrics: [
          {
            name: 'Community Emotional Intelligence',
            value: 72,
            change: 8,
            contribution: { 'player_1': 15, 'player_2': 12, 'player_3': 18 }
          }
        ],
        achievements: [
          {
            id: 'emotional_synergy',
            name: 'Emotional Synergy',
            description: 'Community achieves emotional intelligence breakthrough together',
            requirements: [
              {
                type: 'emotional_synergy',
                value: 80,
                description: 'Community emotional intelligence reaches 80'
              }
            ],
            rewards: [
              {
                type: 'shared_ability',
                description: 'Community emotional resonance ability',
                value: 100,
                distribution: 'equal'
              }
            ],
            celebration: 'community_aura_activation'
          }
        ],
        evolution: {
          stage: 'emotionally_intelligent_community',
          characteristics: ['high_empathy', 'excellent_communication', 'strong_support'],
          abilities: ['emotional_resonance', 'collective_intuition'],
          challenges: ['maintaining_depth', 'scaling_intimacy'],
          nextStage: 'emotional_mastery_community'
        },
        impact: {
          socialChangeScore: 85,
          individualTransformationCount: 150,
          communityWellnessScore: 78,
          emotionalIntelligenceImprovement: 25
        }
      },
      emotionalSupport: {
        systems: [
          {
            type: 'peer_support',
            description: 'Community members support each other emotionally',
            availability: '24/7',
            effectiveness: 0.85,
            accessibility: 0.9
          }
        ],
        resources: [
          {
            name: 'Emotional Intelligence Guide',
            type: 'guide',
            description: 'Comprehensive guide to emotional development',
            accessibility: 'all_members',
            effectiveness: 0.9
          }
        ],
        interventions: [
          {
            trigger: 'emotional_crisis',
            type: 'reactive',
            description: 'Immediate support for emotional difficulties',
            implementation: 'peer_support_activation',
            success_rate: 0.8
          }
        ],
        outcomes: [
          {
            metric: 'emotional_wellness',
            improvement: 30,
            sustainability: 0.75,
            participant_satisfaction: 0.9
          }
        ]
      },
      communityWellness: {
        indicators: [
          {
            name: 'Overall Community Wellness',
            value: 78,
            status: 'good',
            trend: 'improving'
          }
        ],
        programs: [
          {
            name: 'Emotional Wellness Program',
            description: 'Regular emotional health activities',
            participation: 85,
            effectiveness: 0.8,
            duration: 90
          }
        ],
        initiatives: [
          {
            id: 'emotional_intelligence_month',
            name: 'Emotional Intelligence Focus Month',
            description: 'Month dedicated to emotional growth',
            goals: ['improve_eq_scores', 'strengthen_bonds', 'share_vulnerability'],
            participants: ['all_active_members'],
            progress: 65
          }
        ],
        metrics: {
          overall_score: 78,
          individual_wellness: { 'player_1': 85, 'player_2': 72, 'player_3': 90 },
          community_factors: { 'trust': 0.85, 'support': 0.9, 'communication': 0.8 },
          improvement_trends: ['steady_growth', 'increased_vulnerability', 'stronger_bonds']
        }
      }
    }
  },
  investmentMechanics: [
    {
      id: 'emotional_currency',
      name: 'Emotional Currency Investment',
      type: 'currency',
      description: 'Invest emotional currency to unlock growth opportunities',
      mechanics: {
        currency: 'emotional_points',
        earning: ['vulnerability', 'empathy', 'leadership', 'community_support'],
        spending: ['growth_opportunities', 'abilities', 'transformations'],
        exchange_rate: 1
      },
      rewards: {
        investment: 100,
        return: 150,
        timeframe: 30,
        risk: 0.1
      }
    }
  ],
  emotionalRewards: [
    {
      id: 'emotional_mastery',
      name: 'Emotional Mastery',
      description: 'Achieve mastery over emotional challenges',
      requirements: [
        { type: 'emotional_investment', value: 500, description: 'Invest 500 emotional currency' }
      ],
      rewards: {
        abilities: ['emotional_resilience', 'empathy_mastery', 'leadership_charisma'],
        titles: ['Emotional Master'],
        badges: ['emotional_mastery_badge'],
        visualEffects: ['emotional_aura', 'wisdom_halo'],
        permanentChanges: ['enhanced_emotional_intelligence', 'natural_leadership_presence']
      }
    }
  ],
  psychologicalHooks: [
    {
      id: 'progress_illusion',
      name: 'Progress Illusion Hook',
      type: 'cognitive_bias',
      description: 'Create feeling of continuous emotional growth',
      trigger: 'daily_emotional_activity',
      effect: 'growth_sensation',
      intensity: 7,
      duration: 120
    }
  ],
  longTermEngagement: [
    {
      id: 'emotional_legacy',
      name: 'Emotional Legacy System',
      description: 'Build lasting emotional impact that persists',
      mechanics: {
        legacy_building: 'emotional_investments',
        impact_measurement: 'community_transformation',
        permanence: 'permanent_abilities',
        recognition: 'legacy_titles'
      },
      rewards: {
        personal_satisfaction: 10,
        community_recognition: 9,
        historical_significance: 8
      }
    }
  ],
  emotionalAnalytics: {
    tracking: ['emotional_state', 'growth_patterns', 'investment_returns', 'community_impact'],
    insights: ['emotional_trends', 'growth_predictions', 'investment_optimization'],
    predictions: ['emotional_breakthroughs', 'growth_opportunities', 'community_needs']
  }
};

// Emotional investment calculation functions
export const calculateEmotionalReturn = (investment: EmotionalInvestment, outcome: string): number => {
  const baseReturn = investment.expectedReturn;
  const riskFactor = 1 - (investment.risk / 20);
  const outcomeMultiplier = outcome === 'success' ? 1.5 : outcome === 'partial' ? 1.0 : 0.5;
  
  return Math.round(baseReturn * riskFactor * outcomeMultiplier);
};

export const calculateEmotionalGrowth = (investments: EmotionalInvestment[], experiences: any[]): number => {
  const investmentGrowth = investments.reduce((total, inv) => total + (inv.expectedReturn * 0.3), 0);
  const experienceGrowth = experiences.length * 10;
  
  return Math.round(investmentGrowth + experienceGrowth);
};

export const predictEmotionalBreakthrough = (playerData: any): {
  probability: number;
  timeframe: number;
  factors: string[];
} => {
  let probability = 0.1; // Base 10%
  const factors: string[] = [];
  
  // Investment consistency
  if (playerData.emotionalInvestmentStreak > 7) {
    probability += 0.2;
    factors.push('consistent_investment');
  }
  
  // Community support
  if (playerData.communityConnections > 5) {
    probability += 0.15;
    factors.push('strong_community_support');
  }
  
  // Vulnerability practice
  if (playerData.vulnerabilityScore > 70) {
    probability += 0.25;
    factors.push('regular_vulnerability_practice');
  }
  
  // Self-awareness
  if (playerData.selfAwarenessLevel > 60) {
    probability += 0.2;
    factors.push('high_self_awareness');
  }
  
  const timeframe = Math.max(1, Math.round(30 / (probability * 10)));
  
  return {
    probability: Math.min(probability, 0.95),
    timeframe,
    factors
  };
};
