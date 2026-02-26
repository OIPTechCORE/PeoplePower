export interface InfinityBadgeSystem {
    id: string;
    name: string;
    description: string;
    version: string;
    designLanguage: DesignLanguage;
    badgeCategories: BadgeCategory[];
    evolutionEngine: BadgeEvolutionEngine;
    visualRules: VisualRule[];
    livingBadges: LivingBadgeSystem;
    items: InfinityItemSystem;
    universalBadges: UniversalBadge[];
    createdAt: Date;
    updatedAt: Date;
}
export interface DesignLanguage {
    id: string;
    name: string;
    description: string;
    colorPalette: ColorPalette;
    animationStyle: AnimationStyle;
    lighting: LightingSystem;
    borderSystem: BorderSystem;
    glowSystem: GlowSystem;
    particleSystem: ParticleSystem;
}
export interface BadgeCategory {
    id: string;
    name: string;
    description: string;
    type: BadgeType;
    designLanguage: CategoryDesignLanguage;
    evolutionLevels: EvolutionLevel[];
    unlockRequirements: UnlockRequirement[];
    visualUpgradeRules: VisualUpgradeRule[];
    psychologicalImpact: PsychologicalImpact;
}
export interface EvolutionLevel {
    id: string;
    name: string;
    description: string;
    level: number;
    visualUpgrades: VisualUpgrade[];
    animationUpgrades: AnimationUpgrade[];
    particleUpgrades: ParticleUpgrade[];
    glowUpgrades: GlowUpgrade[];
    unlockRequirements: LevelUnlockRequirement[];
    prestigeValue: number;
    rarity: BadgeRarity;
}
export interface VisualUpgrade {
    type: UpgradeType;
    description: string;
    implementation: string;
    visualEffect: VisualEffect;
    animation: UpgradeAnimation;
    timing: UpgradeTiming;
}
export interface AnimationUpgrade {
    type: AnimationType;
    description: string;
    implementation: string;
    duration: number;
    easing: string;
    loop: boolean;
    trigger: AnimationTrigger;
}
export interface ParticleUpgrade {
    type: ParticleType;
    count: number;
    behavior: ParticleBehavior;
    color: string;
    size: number;
    lifetime: number;
    emission: EmissionPattern;
}
export interface GlowUpgrade {
    type: GlowType;
    intensity: number;
    color: string;
    radius: number;
    pulse: PulsePattern;
    spread: number;
}
export interface BadgeEvolutionEngine {
    id: string;
    name: string;
    description: string;
    evolutionStages: EvolutionStage[];
    evolutionTriggers: EvolutionTrigger[];
    evolutionRequirements: EvolutionRequirement[];
    evolutionRewards: EvolutionReward[];
    prestigeSystem: PrestigeSystem;
}
export interface EvolutionStage {
    id: string;
    name: string;
    description: string;
    stage: EvolutionStageType;
    visualTransformation: VisualTransformation;
    animationTransformation: AnimationTransformation;
    particleTransformation: ParticleTransformation;
    requirements: StageRequirement[];
    rewards: StageReward[];
}
export interface LivingBadgeSystem {
    id: string;
    name: string;
    description: string;
    behaviorTracking: BehaviorTracking[];
    adaptationRules: AdaptationRule[];
    evolutionTriggers: LivingEvolutionTrigger[];
    visualFeedback: VisualFeedback[];
    playerRecognition: PlayerRecognition[];
}
export interface InfinityItemSystem {
    id: string;
    name: string;
    description: string;
    itemCategories: ItemCategory[];
    itemEffects: ItemEffect[];
    visualDesign: ItemVisualDesign;
    raritySystem: ItemRaritySystem;
    craftingSystem: CraftingSystem;
}
export interface InfinityLeadershipBadge extends BadgeCategory {
    type: BadgeType.LEADERSHIP;
    designLanguage: {
        colors: ['gold', 'crimson'];
        symbols: ['crown', 'rising_fist'];
        animations: ['rotating_aura', 'glowing_particles'];
        visualElements: ['light_layers', 'aura_radius', 'crown_fragments'];
    };
    evolutionLevels: [
        {
            name: 'Community Voice';
            visualUpgrades: ['basic_glow', 'small_aura'];
            prestigeValue: 100;
        },
        {
            name: 'Squad Leader';
            visualUpgrades: ['enhanced_glow', 'medium_aura', 'crown_spark'];
            prestigeValue: 500;
        },
        {
            name: 'City Leader';
            visualUpgrades: ['intense_glow', 'large_aura', 'rotating_crown'];
            prestigeValue: 2000;
        },
        {
            name: 'Nation Builder';
            visualUpgrades: ['multi_layer_glow', 'expanding_aura', 'floating_crown'];
            prestigeValue: 10000;
        },
        {
            name: 'Civilization Architect';
            visualUpgrades: ['infinite_glow', 'planetary_aura', 'ethereal_crown'];
            prestigeValue: 50000;
        },
        {
            name: 'Eternal Leader (∞)';
            visualUpgrades: ['transcendent_glow', 'universal_aura', 'divine_crown'];
            prestigeValue: 100000;
        }
    ];
}
export interface InfinityOrganizerBadge extends BadgeCategory {
    type: BadgeType.ORGANIZER;
    designLanguage: {
        colors: ['blue', 'gold'];
        symbols: ['connected_hexagons', 'digital_compass', 'strategy_grid'];
        animations: ['pulse_animation', 'data_flow'];
        visualElements: ['network_nodes', 'connecting_lines', 'geometric_circuits'];
    };
    evolutionLevels: [
        {
            name: 'Organizer';
            visualUpgrades: ['basic_network', 'single_node'];
            prestigeValue: 150;
        },
        {
            name: 'Network Master';
            visualUpgrades: ['connected_network', 'multiple_nodes', 'data_flow'];
            prestigeValue: 750;
        },
        {
            name: 'Civilization Coordinator';
            visualUpgrades: ['complex_network', 'holographic_grid', 'energy_flow'];
            prestigeValue: 3000;
        }
    ];
}
export interface InfinityRankBadge extends BadgeCategory {
    type: BadgeType.RANK;
    designLanguage: {
        colors: ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'cosmic'];
        symbols: ['rank_symbols', 'progress_indicators'];
        animations: ['level_up_effects', 'prestige_animations'];
        visualElements: ['circular_shapes', 'multi_layers', 'floating_elements'];
    };
    evolutionLevels: [
        {
            name: 'Bronze Citizen';
            visualUpgrades: ['bronze_circle', 'basic_glow'];
            prestigeValue: 50;
        },
        {
            name: 'Silver Contributor';
            visualUpgrades: ['silver_circle', 'enhanced_glow', 'inner_ring'];
            prestigeValue: 200;
        },
        {
            name: 'Gold Influencer';
            visualUpgrades: ['gold_circle', 'intense_glow', 'outer_ring', 'particles'];
            prestigeValue: 800;
        },
        {
            name: 'Platinum Commander';
            visualUpgrades: ['platinum_hexagon', 'multi_layer_glow', 'floating_elements'];
            prestigeValue: 3000;
        },
        {
            name: 'Diamond Architect';
            visualUpgrades: ['diamond_star', 'infinite_glow', 'complex_particles', 'floating_gems'];
            prestigeValue: 10000;
        },
        {
            name: 'Cosmic Rank ∞';
            visualUpgrades: ['cosmic_orb', 'transcendent_glow', 'galaxy_particles', 'ethereal_elements'];
            prestigeValue: 50000;
        }
    ];
}
export interface InfinityProfileBadge extends BadgeCategory {
    type: BadgeType.PROFILE;
    designLanguage: {
        colors: ['neon', 'premium'];
        symbols: ['profile_icons', 'status_indicators'];
        animations: ['micro_glow', 'subtle_pulse'];
        visualElements: ['clean_icons', 'tiny_visibility', 'neon_outline'];
    };
    categories: [
        'Early Supporter',
        'Founder',
        'Top Trader',
        'Educator',
        'Guardian',
        'Verified Citizen'
    ];
}
export interface InfinityUniversalBadge extends BadgeCategory {
    type: BadgeType.UNIVERSAL;
    designLanguage: {
        colors: ['story_based', 'achievement_colors'];
        symbols: ['achievement_symbols', 'story_icons'];
        animations: ['story_animations', 'achievement_effects'];
        visualElements: ['narrative_elements', 'progress_indicators'];
    };
    examples: [
        {
            name: '🔥 100-Day Streak';
            story: 'Consistent daily participation for 100 days';
            visualElements: ['fire_particles', 'streak_counter', 'burning_aura'];
        },
        {
            name: '🌍 Global Ambassador';
            story: 'Representing the civilization across multiple platforms';
            visualElements: ['globe_particles', 'ambassador_crown', 'cultural_aura'];
        },
        {
            name: '🧠 Knowledge Master';
            story: 'Completing advanced educational achievements';
            visualElements: ['brain_particles', 'knowledge_orbs', 'wisdom_aura'];
        },
        {
            name: '⚖️ Justice Keeper';
            story: 'Maintaining fairness and justice in the community';
            visualElements: ['scales_particles', 'justice_sword', 'balance_aura'];
        },
        {
            name: '💎 Whale Supporter';
            story: 'Significant economic contribution to the ecosystem';
            visualElements: ['diamond_particles', 'whale_icon', 'wealth_aura'];
        }
    ];
}
export interface InfinityItem extends ItemCategory {
    type: ItemType.INFINITY_ITEM;
    categories: [
        'Leadership Jackets',
        'Digital Flags',
        'Energy Boosters',
        'Reputation Amplifiers',
        'Civilization Relics',
        'Legendary Artifacts'
    ];
    designStyle: {
        influences: ['afro_futuristic', 'web3', 'revolutionary'];
        elements: ['metallic_gold_edges', 'energy_cores', 'floating_holographic_effects'];
    };
    gameplayAdvantages: ItemGameplayAdvantage[];
}
export declare enum BadgeType {
    LEADERSHIP = "leadership",
    ORGANIZER = "organizer",
    RANK = "rank",
    PROFILE = "profile",
    UNIVERSAL = "universal",
    ACHIEVEMENT = "achievement",
    SPECIAL = "special",
    LEGENDARY = "legendary"
}
export declare enum BadgeRarity {
    COMMON = "common",
    UNCOMMON = "uncommon",
    RARE = "rare",
    EPIC = "epic",
    LEGENDARY = "legendary",
    MYTHIC = "mythic",
    ETERNAL = "eternal",
    TRANSCENDENT = "transcendent"
}
export declare enum UpgradeType {
    GLOW_INTENSITY = "glow_intensity",
    AURA_RADIUS = "aura_radius",
    PARTICLE_COUNT = "particle_count",
    ANIMATION_COMPLEXITY = "animation_complexity",
    LAYER_ADDITION = "layer_addition",
    SYMBOL_EVOLUTION = "symbol_evolution",
    COLOR_SHIFT = "color_shift",
    GEOMETRIC_TRANSFORMATION = "geometric_transformation"
}
export declare enum AnimationType {
    ROTATING_AURA = "rotating_aura",
    PULSING_GLOW = "pulsing_glow",
    PARTICLE_EMISSION = "particle_emission",
    SYMBOL_MORPHING = "symbol_morphing",
    LAYER_ROTATION = "layer_rotation",
    ENERGY_FLOW = "energy_flow",
    HOLOGRAPHIC_PROJECTION = "holographic_projection",
    TRANSCENDENT_EFFECT = "transcendent_effect"
}
export declare enum ParticleType {
    GLOW_PARTICLES = "glow_particles",
    ENERGY_ORBS = "energy_orbs",
    LIGHT_SPARKS = "light_sparks",
    COSMIC_DUST = "cosmic_dust",
    FIRE_PARTICLES = "fire_particles",
    CRYSTAL_SHARDS = "crystal_shards",
    ETHEREAL_FLAKES = "ethereal_flakes",
    GALAXY_STARS = "galaxy_stars"
}
export declare enum GlowType {
    BASIC_GLOW = "basic_glow",
    ENHANCED_GLOW = "enhanced_glow",
    INTENSE_GLOW = "intense_glow",
    MULTI_LAYER_GLOW = "multi_layer_glow",
    INFINITE_GLOW = "infinite_glow",
    TRANSCENDENT_GLOW = "transcendent_glow",
    UNIVERSAL_GLOW = "universal_glow",
    DIVINE_GLOW = "divine_glow"
}
export declare enum EvolutionStageType {
    BASE_FORM = "base_form",
    ENHANCED_FORM = "enhanced_form",
    LEGENDARY_FORM = "legendary_form",
    MYTHIC_FORM = "mythic_form",
    ETERNAL_FORM = "eternal_form",
    TRANSCENDENT_FORM = "transcendent_form"
}
export declare enum ItemType {
    LEADERSHIP_JACKET = "leadership_jacket",
    DIGITAL_FLAG = "digital_flag",
    ENERGY_BOOSTER = "energy_booster",
    REPUTATION_AMPLIFIER = "reputation_amplifier",
    CIVILIZATION_RELIC = "civilization_relic",
    LEGENDARY_ARTIFACT = "legendary_artifact",
    INFINITY_ITEM = "infinity_item"
}
export declare enum ItemRarity {
    COMMON = "common",
    UNCOMMON = "uncommon",
    RARE = "rare",
    EPIC = "epic",
    LEGENDARY = "legendary",
    MYTHIC = "mythic",
    ETERNAL = "eternal"
}
export interface ColorPalette {
    primary: string[];
    secondary: string[];
    accent: string[];
    glow: string[];
    particle: string[];
}
export interface AnimationStyle {
    duration: number;
    easing: string;
    loop: boolean;
    trigger: AnimationTrigger;
    complexity: AnimationComplexity;
}
export interface LightingSystem {
    direction: string;
    intensity: number;
    shadows: boolean;
    reflections: boolean;
    ambient: number;
}
export interface BorderSystem {
    thickness: number;
    style: BorderStyle;
    color: string;
    glow: boolean;
    animation: boolean;
}
export interface GlowSystem {
    intensity: number;
    radius: number;
    color: string;
    pulse: boolean;
    spread: number;
}
export interface ParticleSystem {
    count: number;
    behavior: ParticleBehavior;
    emission: EmissionPattern;
    lifetime: number;
    size: number;
}
export interface PsychologicalImpact {
    statusEffect: StatusEffect;
    recognitionLevel: RecognitionLevel;
    motivationFactor: number;
    socialProof: SocialProof;
    addictionPotential: AddictionPotential;
}
export interface UnlockRequirement {
    type: RequirementType;
    value: number;
    description: string;
    verification: VerificationMethod;
    timeLimit?: number;
}
export interface VisualUpgradeRule {
    condition: UpgradeCondition;
    upgrade: VisualUpgrade;
    timing: UpgradeTiming;
    animation: UpgradeAnimation;
    feedback: UpgradeFeedback;
}
export interface BehaviorTracking {
    behavior: PlayerBehavior;
    trackingMethod: TrackingMethod;
    impact: BehaviorImpact;
    threshold: number;
    feedback: BehaviorFeedback;
}
export interface AdaptationRule {
    trigger: AdaptationTrigger;
    condition: AdaptationCondition;
    adaptation: BadgeAdaptation;
    reversal: AdaptationReversal;
}
export interface LivingEvolutionTrigger {
    behavior: PlayerBehavior;
    frequency: number;
    intensity: number;
    duration: number;
    socialImpact: number;
}
export interface VisualFeedback {
    type: FeedbackType;
    visual: VisualEffect;
    timing: FeedbackTiming;
    intensity: number;
    personalization: PersonalizationLevel;
}
export interface PlayerRecognition {
    type: RecognitionType;
    visibility: VisibilityLevel;
    socialImpact: SocialImpact;
    reward: RecognitionReward;
    duration: number;
}
export interface ItemEffect {
    type: EffectType;
    target: EffectTarget;
    magnitude: number;
    duration: number;
    conditions: EffectCondition[];
    stackable: boolean;
}
export interface ItemVisualDesign {
    style: DesignStyle;
    elements: DesignElement[];
    animations: ItemAnimation[];
    effects: VisualEffect[];
    rarity: ItemRarity;
}
export interface CraftingSystem {
    recipes: CraftingRecipe[];
    requirements: CraftingRequirement[];
    costs: CraftingCost[];
    success: CraftingSuccess;
}
export interface PrestigeSystem {
    levels: PrestigeLevel[];
    requirements: PrestigeRequirement[];
    rewards: PrestigeReward[];
    reset: PrestigeReset;
}
export declare enum BorderStyle {
    SOLID = "solid",
    DASHED = "dashed",
    DOTTED = "dotted",
    DOUBLE = "double",
    GROOVE = "groove",
    RIDGE = "ridge",
    INSET = "inset",
    OUTSET = "outset"
}
export declare enum AnimationComplexity {
    SIMPLE = "simple",
    MODERATE = "moderate",
    COMPLEX = "complex",
    ADVANCED = "advanced",
    TRANSCENDENT = "transcendent"
}
export declare enum AnimationTrigger {
    ON_LOAD = "on_load",
    ON_HOVER = "on_hover",
    ON_CLICK = "on_click",
    ON_ACHIEVEMENT = "on_achievement",
    CONTINUOUS = "continuous",
    BEHAVIOR_BASED = "behavior_based"
}
export declare enum StatusEffect {
    AUTHORITY = "authority",
    INFLUENCE = "influence",
    PRESTIGE = "prestige",
    RESPECT = "respect",
    ADMIRATION = "admiration",
    INSPIRATION = "inspiration"
}
export declare enum RecognitionLevel {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    EXTREME = "extreme",
    TRANSCENDENT = "transcendent"
}
export declare enum SocialProof {
    VISIBILITY = "visibility",
    AUTHORITY = "authority",
    SCARCITY = "scarcity",
    CONSENSUS = "consensus",
    LIKING = "liking",
    RECIPROCITY = "reciprocity"
}
export declare enum AddictionPotential {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    EXTREME = "extreme",
    TRANSCENDENT = "transcendent"
}
export declare enum RequirementType {
    LEVEL = "level",
    REPUTATION = "reputation",
    CONTRIBUTION = "contribution",
    TIME = "time",
    ACHIEVEMENT = "achievement",
    SKILL = "skill",
    SOCIAL = "social",
    ECONOMIC = "economic"
}
export declare enum VerificationMethod {
    AUTOMATIC = "automatic",
    MANUAL = "manual",
    PEER_REVIEW = "peer_review",
    AI_ANALYSIS = "ai_analysis",
    COMMUNITY_VOTE = "community_vote"
}
export declare enum UpgradeCondition {
    LEVEL_UP = "level_up",
    ACHIEVEMENT_UNLOCK = "achievement_unlock",
    BEHAVIOR_CHANGE = "behavior_change",
    TIME_BASED = "time_based",
    SOCIAL_IMPACT = "social_impact",
    ECONOMIC_MILESTONE = "economic_milestone"
}
export declare enum PlayerBehavior {
    HELPING_OTHERS = "helping_others",
    LEADING_EVENTS = "leading_events",
    CONTRIBUTING_CONTENT = "contributing_content",
    TRADING_ACTIVITY = "trading_activity",
    SOCIAL_ENGAGEMENT = "social_engagement",
    EDUCATIONAL_PARTICIPATION = "educational_participation",
    GOVERNANCE_PARTICIPATION = "governance_participation",
    INACTIVE_PERIOD = "inactive_period"
}
export declare enum TrackingMethod {
    AUTOMATIC = "automatic",
    MANUAL_REPORTING = "manual_reporting",
    PEER_NOMINATION = "peer_nomination",
    AI_DETECTION = "ai_detection",
    COMMUNITY_VALIDATION = "community_validation"
}
export declare enum FeedbackType {
    VISUAL = "visual",
    ANIMATION = "animation",
    PARTICLE = "particle",
    GLOW = "glow",
    SOUND = "sound",
    HAPTIC = "haptic"
}
export declare enum PersonalizationLevel {
    NONE = "none",
    MINIMAL = "minimal",
    MODERATE = "moderate",
    HIGH = "high",
    COMPLETE = "complete"
}
export declare enum RecognitionType {
    PUBLIC = "public",
    PRIVATE = "private",
    SEMI_PRIVATE = "semi_private",
    EXCLUSIVE = "exclusive",
    TRANSCENDENT = "transcendent"
}
export declare enum VisibilityLevel {
    HIDDEN = "hidden",
    PROFILE_ONLY = "profile_only",
    FRIENDS = "friends",
    COMMUNITY = "community",
    PUBLIC = "public",
    GLOBAL = "global"
}
export declare enum EffectType {
    STAT_BOOST = "stat_boost",
    ABILITY_UNLOCK = "ability_unlock",
    VISUAL_ENHANCEMENT = "visual_enhancement",
    SOCIAL_BONUS = "social_bonus",
    ECONOMIC_BONUS = "economic_bonus",
    GOVERNANCE_POWER = "governance_power"
}
export declare enum EffectTarget {
    SELF = "self",
    TEAM = "team",
    COMMUNITY = "community",
    CIVILIZATION = "civilization",
    GLOBAL = "global"
}
export declare enum DesignStyle {
    AFRO_FUTURISTIC = "afro_futuristic",
    WEB3 = "web3",
    REVOLUTIONARY = "revolutionary",
    CYBERPUNK = "cyberpunk",
    STEAMPUNK = "steampunk",
    FUTURISTIC = "futuristic",
    MYSTICAL = "mystical",
    COSMIC = "cosmic"
}
export declare enum DesignElement {
    METALLIC_EDGES = "metallic_edges",
    ENERGY_CORES = "energy_cores",
    HOLOGRAPHIC_EFFECTS = "holographic_effects",
    GEOMETRIC_PATTERNS = "geometric_patterns",
    ORGANIC_ELEMENTS = "organic_elements",
    CRYSTAL_STRUCTURES = "crystal_structures",
    LIGHT_BEAMS = "light_beams",
    PARTICLE_SYSTEMS = "particle_systems"
}
//# sourceMappingURL=infinity-badge-system.d.ts.map