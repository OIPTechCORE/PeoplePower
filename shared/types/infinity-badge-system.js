"use strict";
// ========================================
// INFINITY BADGE DESIGN SYSTEM
// Beautiful + Addictive + Status-Driven + Impossible to Copy Easily
// ========================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesignElement = exports.DesignStyle = exports.EffectTarget = exports.EffectType = exports.VisibilityLevel = exports.RecognitionType = exports.PersonalizationLevel = exports.FeedbackType = exports.TrackingMethod = exports.PlayerBehavior = exports.UpgradeCondition = exports.VerificationMethod = exports.RequirementType = exports.AddictionPotential = exports.SocialProof = exports.RecognitionLevel = exports.StatusEffect = exports.AnimationTrigger = exports.AnimationComplexity = exports.BorderStyle = exports.ItemRarity = exports.ItemType = exports.EvolutionStageType = exports.GlowType = exports.ParticleType = exports.AnimationType = exports.UpgradeType = exports.BadgeRarity = exports.BadgeType = void 0;
// ========================================
// COMPREHENSIVE ENUMS
// ========================================
var BadgeType;
(function (BadgeType) {
    BadgeType["LEADERSHIP"] = "leadership";
    BadgeType["ORGANIZER"] = "organizer";
    BadgeType["RANK"] = "rank";
    BadgeType["PROFILE"] = "profile";
    BadgeType["UNIVERSAL"] = "universal";
    BadgeType["ACHIEVEMENT"] = "achievement";
    BadgeType["SPECIAL"] = "special";
    BadgeType["LEGENDARY"] = "legendary";
})(BadgeType || (exports.BadgeType = BadgeType = {}));
var BadgeRarity;
(function (BadgeRarity) {
    BadgeRarity["COMMON"] = "common";
    BadgeRarity["UNCOMMON"] = "uncommon";
    BadgeRarity["RARE"] = "rare";
    BadgeRarity["EPIC"] = "epic";
    BadgeRarity["LEGENDARY"] = "legendary";
    BadgeRarity["MYTHIC"] = "mythic";
    BadgeRarity["ETERNAL"] = "eternal";
    BadgeRarity["TRANSCENDENT"] = "transcendent";
})(BadgeRarity || (exports.BadgeRarity = BadgeRarity = {}));
var UpgradeType;
(function (UpgradeType) {
    UpgradeType["GLOW_INTENSITY"] = "glow_intensity";
    UpgradeType["AURA_RADIUS"] = "aura_radius";
    UpgradeType["PARTICLE_COUNT"] = "particle_count";
    UpgradeType["ANIMATION_COMPLEXITY"] = "animation_complexity";
    UpgradeType["LAYER_ADDITION"] = "layer_addition";
    UpgradeType["SYMBOL_EVOLUTION"] = "symbol_evolution";
    UpgradeType["COLOR_SHIFT"] = "color_shift";
    UpgradeType["GEOMETRIC_TRANSFORMATION"] = "geometric_transformation";
})(UpgradeType || (exports.UpgradeType = UpgradeType = {}));
var AnimationType;
(function (AnimationType) {
    AnimationType["ROTATING_AURA"] = "rotating_aura";
    AnimationType["PULSING_GLOW"] = "pulsing_glow";
    AnimationType["PARTICLE_EMISSION"] = "particle_emission";
    AnimationType["SYMBOL_MORPHING"] = "symbol_morphing";
    AnimationType["LAYER_ROTATION"] = "layer_rotation";
    AnimationType["ENERGY_FLOW"] = "energy_flow";
    AnimationType["HOLOGRAPHIC_PROJECTION"] = "holographic_projection";
    AnimationType["TRANSCENDENT_EFFECT"] = "transcendent_effect";
})(AnimationType || (exports.AnimationType = AnimationType = {}));
var ParticleType;
(function (ParticleType) {
    ParticleType["GLOW_PARTICLES"] = "glow_particles";
    ParticleType["ENERGY_ORBS"] = "energy_orbs";
    ParticleType["LIGHT_SPARKS"] = "light_sparks";
    ParticleType["COSMIC_DUST"] = "cosmic_dust";
    ParticleType["FIRE_PARTICLES"] = "fire_particles";
    ParticleType["CRYSTAL_SHARDS"] = "crystal_shards";
    ParticleType["ETHEREAL_FLAKES"] = "ethereal_flakes";
    ParticleType["GALAXY_STARS"] = "galaxy_stars";
})(ParticleType || (exports.ParticleType = ParticleType = {}));
var GlowType;
(function (GlowType) {
    GlowType["BASIC_GLOW"] = "basic_glow";
    GlowType["ENHANCED_GLOW"] = "enhanced_glow";
    GlowType["INTENSE_GLOW"] = "intense_glow";
    GlowType["MULTI_LAYER_GLOW"] = "multi_layer_glow";
    GlowType["INFINITE_GLOW"] = "infinite_glow";
    GlowType["TRANSCENDENT_GLOW"] = "transcendent_glow";
    GlowType["UNIVERSAL_GLOW"] = "universal_glow";
    GlowType["DIVINE_GLOW"] = "divine_glow";
})(GlowType || (exports.GlowType = GlowType = {}));
var EvolutionStageType;
(function (EvolutionStageType) {
    EvolutionStageType["BASE_FORM"] = "base_form";
    EvolutionStageType["ENHANCED_FORM"] = "enhanced_form";
    EvolutionStageType["LEGENDARY_FORM"] = "legendary_form";
    EvolutionStageType["MYTHIC_FORM"] = "mythic_form";
    EvolutionStageType["ETERNAL_FORM"] = "eternal_form";
    EvolutionStageType["TRANSCENDENT_FORM"] = "transcendent_form";
})(EvolutionStageType || (exports.EvolutionStageType = EvolutionStageType = {}));
var ItemType;
(function (ItemType) {
    ItemType["LEADERSHIP_JACKET"] = "leadership_jacket";
    ItemType["DIGITAL_FLAG"] = "digital_flag";
    ItemType["ENERGY_BOOSTER"] = "energy_booster";
    ItemType["REPUTATION_AMPLIFIER"] = "reputation_amplifier";
    ItemType["CIVILIZATION_RELIC"] = "civilization_relic";
    ItemType["LEGENDARY_ARTIFACT"] = "legendary_artifact";
    ItemType["INFINITY_ITEM"] = "infinity_item";
})(ItemType || (exports.ItemType = ItemType = {}));
var ItemRarity;
(function (ItemRarity) {
    ItemRarity["COMMON"] = "common";
    ItemRarity["UNCOMMON"] = "uncommon";
    ItemRarity["RARE"] = "rare";
    ItemRarity["EPIC"] = "epic";
    ItemRarity["LEGENDARY"] = "legendary";
    ItemRarity["MYTHIC"] = "mythic";
    ItemRarity["ETERNAL"] = "eternal";
})(ItemRarity || (exports.ItemRarity = ItemRarity = {}));
// Additional enums for completeness
var BorderStyle;
(function (BorderStyle) {
    BorderStyle["SOLID"] = "solid";
    BorderStyle["DASHED"] = "dashed";
    BorderStyle["DOTTED"] = "dotted";
    BorderStyle["DOUBLE"] = "double";
    BorderStyle["GROOVE"] = "groove";
    BorderStyle["RIDGE"] = "ridge";
    BorderStyle["INSET"] = "inset";
    BorderStyle["OUTSET"] = "outset";
})(BorderStyle || (exports.BorderStyle = BorderStyle = {}));
var AnimationComplexity;
(function (AnimationComplexity) {
    AnimationComplexity["SIMPLE"] = "simple";
    AnimationComplexity["MODERATE"] = "moderate";
    AnimationComplexity["COMPLEX"] = "complex";
    AnimationComplexity["ADVANCED"] = "advanced";
    AnimationComplexity["TRANSCENDENT"] = "transcendent";
})(AnimationComplexity || (exports.AnimationComplexity = AnimationComplexity = {}));
var AnimationTrigger;
(function (AnimationTrigger) {
    AnimationTrigger["ON_LOAD"] = "on_load";
    AnimationTrigger["ON_HOVER"] = "on_hover";
    AnimationTrigger["ON_CLICK"] = "on_click";
    AnimationTrigger["ON_ACHIEVEMENT"] = "on_achievement";
    AnimationTrigger["CONTINUOUS"] = "continuous";
    AnimationTrigger["BEHAVIOR_BASED"] = "behavior_based";
})(AnimationTrigger || (exports.AnimationTrigger = AnimationTrigger = {}));
var StatusEffect;
(function (StatusEffect) {
    StatusEffect["AUTHORITY"] = "authority";
    StatusEffect["INFLUENCE"] = "influence";
    StatusEffect["PRESTIGE"] = "prestige";
    StatusEffect["RESPECT"] = "respect";
    StatusEffect["ADMIRATION"] = "admiration";
    StatusEffect["INSPIRATION"] = "inspiration";
})(StatusEffect || (exports.StatusEffect = StatusEffect = {}));
var RecognitionLevel;
(function (RecognitionLevel) {
    RecognitionLevel["LOW"] = "low";
    RecognitionLevel["MEDIUM"] = "medium";
    RecognitionLevel["HIGH"] = "high";
    RecognitionLevel["EXTREME"] = "extreme";
    RecognitionLevel["TRANSCENDENT"] = "transcendent";
})(RecognitionLevel || (exports.RecognitionLevel = RecognitionLevel = {}));
var SocialProof;
(function (SocialProof) {
    SocialProof["VISIBILITY"] = "visibility";
    SocialProof["AUTHORITY"] = "authority";
    SocialProof["SCARCITY"] = "scarcity";
    SocialProof["CONSENSUS"] = "consensus";
    SocialProof["LIKING"] = "liking";
    SocialProof["RECIPROCITY"] = "reciprocity";
})(SocialProof || (exports.SocialProof = SocialProof = {}));
var AddictionPotential;
(function (AddictionPotential) {
    AddictionPotential["LOW"] = "low";
    AddictionPotential["MEDIUM"] = "medium";
    AddictionPotential["HIGH"] = "high";
    AddictionPotential["EXTREME"] = "extreme";
    AddictionPotential["TRANSCENDENT"] = "transcendent";
})(AddictionPotential || (exports.AddictionPotential = AddictionPotential = {}));
var RequirementType;
(function (RequirementType) {
    RequirementType["LEVEL"] = "level";
    RequirementType["REPUTATION"] = "reputation";
    RequirementType["CONTRIBUTION"] = "contribution";
    RequirementType["TIME"] = "time";
    RequirementType["ACHIEVEMENT"] = "achievement";
    RequirementType["SKILL"] = "skill";
    RequirementType["SOCIAL"] = "social";
    RequirementType["ECONOMIC"] = "economic";
})(RequirementType || (exports.RequirementType = RequirementType = {}));
var VerificationMethod;
(function (VerificationMethod) {
    VerificationMethod["AUTOMATIC"] = "automatic";
    VerificationMethod["MANUAL"] = "manual";
    VerificationMethod["PEER_REVIEW"] = "peer_review";
    VerificationMethod["AI_ANALYSIS"] = "ai_analysis";
    VerificationMethod["COMMUNITY_VOTE"] = "community_vote";
})(VerificationMethod || (exports.VerificationMethod = VerificationMethod = {}));
var UpgradeCondition;
(function (UpgradeCondition) {
    UpgradeCondition["LEVEL_UP"] = "level_up";
    UpgradeCondition["ACHIEVEMENT_UNLOCK"] = "achievement_unlock";
    UpgradeCondition["BEHAVIOR_CHANGE"] = "behavior_change";
    UpgradeCondition["TIME_BASED"] = "time_based";
    UpgradeCondition["SOCIAL_IMPACT"] = "social_impact";
    UpgradeCondition["ECONOMIC_MILESTONE"] = "economic_milestone";
})(UpgradeCondition || (exports.UpgradeCondition = UpgradeCondition = {}));
var PlayerBehavior;
(function (PlayerBehavior) {
    PlayerBehavior["HELPING_OTHERS"] = "helping_others";
    PlayerBehavior["LEADING_EVENTS"] = "leading_events";
    PlayerBehavior["CONTRIBUTING_CONTENT"] = "contributing_content";
    PlayerBehavior["TRADING_ACTIVITY"] = "trading_activity";
    PlayerBehavior["SOCIAL_ENGAGEMENT"] = "social_engagement";
    PlayerBehavior["EDUCATIONAL_PARTICIPATION"] = "educational_participation";
    PlayerBehavior["GOVERNANCE_PARTICIPATION"] = "governance_participation";
    PlayerBehavior["INACTIVE_PERIOD"] = "inactive_period";
})(PlayerBehavior || (exports.PlayerBehavior = PlayerBehavior = {}));
var TrackingMethod;
(function (TrackingMethod) {
    TrackingMethod["AUTOMATIC"] = "automatic";
    TrackingMethod["MANUAL_REPORTING"] = "manual_reporting";
    TrackingMethod["PEER_NOMINATION"] = "peer_nomination";
    TrackingMethod["AI_DETECTION"] = "ai_detection";
    TrackingMethod["COMMUNITY_VALIDATION"] = "community_validation";
})(TrackingMethod || (exports.TrackingMethod = TrackingMethod = {}));
var FeedbackType;
(function (FeedbackType) {
    FeedbackType["VISUAL"] = "visual";
    FeedbackType["ANIMATION"] = "animation";
    FeedbackType["PARTICLE"] = "particle";
    FeedbackType["GLOW"] = "glow";
    FeedbackType["SOUND"] = "sound";
    FeedbackType["HAPTIC"] = "haptic";
})(FeedbackType || (exports.FeedbackType = FeedbackType = {}));
var PersonalizationLevel;
(function (PersonalizationLevel) {
    PersonalizationLevel["NONE"] = "none";
    PersonalizationLevel["MINIMAL"] = "minimal";
    PersonalizationLevel["MODERATE"] = "moderate";
    PersonalizationLevel["HIGH"] = "high";
    PersonalizationLevel["COMPLETE"] = "complete";
})(PersonalizationLevel || (exports.PersonalizationLevel = PersonalizationLevel = {}));
var RecognitionType;
(function (RecognitionType) {
    RecognitionType["PUBLIC"] = "public";
    RecognitionType["PRIVATE"] = "private";
    RecognitionType["SEMI_PRIVATE"] = "semi_private";
    RecognitionType["EXCLUSIVE"] = "exclusive";
    RecognitionType["TRANSCENDENT"] = "transcendent";
})(RecognitionType || (exports.RecognitionType = RecognitionType = {}));
var VisibilityLevel;
(function (VisibilityLevel) {
    VisibilityLevel["HIDDEN"] = "hidden";
    VisibilityLevel["PROFILE_ONLY"] = "profile_only";
    VisibilityLevel["FRIENDS"] = "friends";
    VisibilityLevel["COMMUNITY"] = "community";
    VisibilityLevel["PUBLIC"] = "public";
    VisibilityLevel["GLOBAL"] = "global";
})(VisibilityLevel || (exports.VisibilityLevel = VisibilityLevel = {}));
var EffectType;
(function (EffectType) {
    EffectType["STAT_BOOST"] = "stat_boost";
    EffectType["ABILITY_UNLOCK"] = "ability_unlock";
    EffectType["VISUAL_ENHANCEMENT"] = "visual_enhancement";
    EffectType["SOCIAL_BONUS"] = "social_bonus";
    EffectType["ECONOMIC_BONUS"] = "economic_bonus";
    EffectType["GOVERNANCE_POWER"] = "governance_power";
})(EffectType || (exports.EffectType = EffectType = {}));
var EffectTarget;
(function (EffectTarget) {
    EffectTarget["SELF"] = "self";
    EffectTarget["TEAM"] = "team";
    EffectTarget["COMMUNITY"] = "community";
    EffectTarget["CIVILIZATION"] = "civilization";
    EffectTarget["GLOBAL"] = "global";
})(EffectTarget || (exports.EffectTarget = EffectTarget = {}));
var DesignStyle;
(function (DesignStyle) {
    DesignStyle["AFRO_FUTURISTIC"] = "afro_futuristic";
    DesignStyle["WEB3"] = "web3";
    DesignStyle["REVOLUTIONARY"] = "revolutionary";
    DesignStyle["CYBERPUNK"] = "cyberpunk";
    DesignStyle["STEAMPUNK"] = "steampunk";
    DesignStyle["FUTURISTIC"] = "futuristic";
    DesignStyle["MYSTICAL"] = "mystical";
    DesignStyle["COSMIC"] = "cosmic";
})(DesignStyle || (exports.DesignStyle = DesignStyle = {}));
var DesignElement;
(function (DesignElement) {
    DesignElement["METALLIC_EDGES"] = "metallic_edges";
    DesignElement["ENERGY_CORES"] = "energy_cores";
    DesignElement["HOLOGRAPHIC_EFFECTS"] = "holographic_effects";
    DesignElement["GEOMETRIC_PATTERNS"] = "geometric_patterns";
    DesignElement["ORGANIC_ELEMENTS"] = "organic_elements";
    DesignElement["CRYSTAL_STRUCTURES"] = "crystal_structures";
    DesignElement["LIGHT_BEAMS"] = "light_beams";
    DesignElement["PARTICLE_SYSTEMS"] = "particle_systems";
})(DesignElement || (exports.DesignElement = DesignElement = {}));
// This comprehensive infinity badge system provides a complete framework
// for creating beautiful, addictive, and status-driven badge systems
// that evolve based on player behavior and create lasting engagement
//# sourceMappingURL=infinity-badge-system.js.map