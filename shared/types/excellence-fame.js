"use strict";
// ========================================
// PEOPLE POWER CENTER OF EXCELLENCE & WALL OF FAME
// ========================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolutionProcess = exports.PenaltyType = exports.InheritanceType = exports.EffectType = exports.VisualType = exports.WeightingMethod = exports.ThresholdType = exports.RevolutionMethod = exports.RevolutionImpact = exports.RevolutionOutcome = exports.BenefitType = exports.BonusType = exports.ObjectiveType = exports.SignificanceLevel = exports.AssetType = exports.PrivilegeType = exports.ContentType = exports.HistoricalImportance = exports.MilestoneCategory = exports.EventType = exports.EvolutionType = exports.GeneticRarity = exports.IntegrityLevel = exports.BuilderLevel = exports.SocialLevel = exports.AcademicLevel = exports.ConnectionType = exports.TeachingStyle = exports.PersonalityType = exports.CoachSpecialization = exports.RevenueModel = exports.ReviewStatus = exports.SubmissionCategory = exports.RewardType = exports.RequirementType = exports.CourseDifficulty = exports.TransferabilityRule = exports.LegacyCriteria = exports.HallCategory = exports.UniversityLevel = exports.InnovationFocusArea = exports.AcademyType = void 0;
// ========================================
// ENUMS & TYPES
// ========================================
var AcademyType;
(function (AcademyType) {
    AcademyType["GAME_STRATEGY_INSTITUTE"] = "game_strategy_institute";
    AcademyType["DIGITAL_SKILLS_LAB"] = "digital_skills_lab";
    AcademyType["ECONOMIC_INTELLIGENCE_SCHOOL"] = "economic_intelligence_school";
    AcademyType["COMMUNITY_LEADERSHIP_ACADEMY"] = "community_leadership_academy";
    AcademyType["SOCIAL_IMPACT_LAB"] = "social_impact_lab";
})(AcademyType || (exports.AcademyType = AcademyType = {}));
var InnovationFocusArea;
(function (InnovationFocusArea) {
    InnovationFocusArea["MINI_APPS"] = "mini_apps";
    InnovationFocusArea["GAME_TOOLS"] = "game_tools";
    InnovationFocusArea["COMMUNITY_SOLUTIONS"] = "community_solutions";
    InnovationFocusArea["EDUCATIONAL_CONTENT"] = "educational_content";
})(InnovationFocusArea || (exports.InnovationFocusArea = InnovationFocusArea = {}));
var UniversityLevel;
(function (UniversityLevel) {
    UniversityLevel["EXPLORER"] = "explorer";
    UniversityLevel["SCHOLAR"] = "scholar";
    UniversityLevel["INNOVATOR"] = "innovator";
    UniversityLevel["ARCHITECT"] = "architect";
    UniversityLevel["CIVILIZATION_LEADER"] = "civilization_leader";
})(UniversityLevel || (exports.UniversityLevel = UniversityLevel = {}));
var HallCategory;
(function (HallCategory) {
    HallCategory["FOUNDERS_HALL"] = "founders_hall";
    HallCategory["GENIUS_HALL"] = "genius_hall";
    HallCategory["GUARDIANS_HALL"] = "guardians_hall";
    HallCategory["IMPACT_HALL"] = "impact_hall";
    HallCategory["DIAMOND_HANDS_HALL"] = "diamond_hands_hall";
})(HallCategory || (exports.HallCategory = HallCategory = {}));
var LegacyCriteria;
(function (LegacyCriteria) {
    LegacyCriteria["FOUNDER"] = "founder";
    LegacyCriteria["TOP_EARNER"] = "top_earner";
    LegacyCriteria["INNOVATOR"] = "innovator";
    LegacyCriteria["EDUCATOR"] = "educator";
    LegacyCriteria["COMMUNITY_PROTECTOR"] = "community_protector";
    LegacyCriteria["LONG_TERM_HOLDER"] = "long_term_holder";
})(LegacyCriteria || (exports.LegacyCriteria = LegacyCriteria = {}));
var TransferabilityRule;
(function (TransferabilityRule) {
    TransferabilityRule["SOULBOUND"] = "soulbound";
    TransferabilityRule["REPUTATION_LOCKED"] = "reputation_locked";
    TransferabilityRule["CIVILIZATION_GATED"] = "civilization_gated";
    TransferabilityRule["TEMPORARY_BOOST"] = "temporary_boost";
})(TransferabilityRule || (exports.TransferabilityRule = TransferabilityRule = {}));
var CourseDifficulty;
(function (CourseDifficulty) {
    CourseDifficulty["BASIC"] = "basic";
    CourseDifficulty["INTERMEDIATE"] = "intermediate";
    CourseDifficulty["ADVANCED"] = "advanced";
    CourseDifficulty["EXPERT"] = "expert";
    CourseDifficulty["MASTER"] = "master";
})(CourseDifficulty || (exports.CourseDifficulty = CourseDifficulty = {}));
var RequirementType;
(function (RequirementType) {
    RequirementType["LEVEL"] = "level";
    RequirementType["SKILL"] = "skill";
    RequirementType["REPUTATION"] = "reputation";
    RequirementType["COURSE_COMPLETION"] = "course_completion";
    RequirementType["COMMUNITY_CONTRIBUTION"] = "community_contribution";
})(RequirementType || (exports.RequirementType = RequirementType = {}));
var RewardType;
(function (RewardType) {
    RewardType["INFLUENCE"] = "influence";
    RewardType["TOKENS"] = "tokens";
    RewardType["SKILLS"] = "skills";
    RewardType["PRIVILEGES"] = "privileges";
    RewardType["REPUTATION"] = "reputation";
    RewardType["EARNING_MULTIPLIER"] = "earning_multiplier";
})(RewardType || (exports.RewardType = RewardType = {}));
var SubmissionCategory;
(function (SubmissionCategory) {
    SubmissionCategory["MINI_APP"] = "mini_app";
    SubmissionCategory["GAME_TOOL"] = "game_tool";
    SubmissionCategory["COMMUNITY_SOLUTION"] = "community_solution";
    SubmissionCategory["EDUCATIONAL_CONTENT"] = "educational_content";
    SubmissionCategory["PROTOCOL_IMPROVEMENT"] = "protocol_improvement";
})(SubmissionCategory || (exports.SubmissionCategory = SubmissionCategory = {}));
var ReviewStatus;
(function (ReviewStatus) {
    ReviewStatus["PENDING"] = "pending";
    ReviewStatus["UNDER_REVIEW"] = "under_review";
    ReviewStatus["APPROVED"] = "approved";
    ReviewStatus["REJECTED"] = "rejected";
    ReviewStatus["IMPLEMENTED"] = "implemented";
})(ReviewStatus || (exports.ReviewStatus = ReviewStatus = {}));
var RevenueModel;
(function (RevenueModel) {
    RevenueModel["FIXED_ROYALTY"] = "fixed_royalty";
    RevenueModel["PERCENTAGE_REVENUE"] = "percentage_revenue";
    RevenueModel["HYBRID"] = "hybrid";
    RevenueModel["COMMUNITY_POOL"] = "community_pool";
})(RevenueModel || (exports.RevenueModel = RevenueModel = {}));
var CoachSpecialization;
(function (CoachSpecialization) {
    CoachSpecialization["GAMEPLAY"] = "gameplay";
    CoachSpecialization["SKILL_DEVELOPMENT"] = "skill_development";
    CoachSpecialization["SOCIAL_STRATEGY"] = "social_strategy";
    CoachSpecialization["ECONOMIC_PLANNING"] = "economic_planning";
    CoachSpecialization["LEADERSHIP"] = "leadership";
    CoachSpecialization["COMMUNITY_BUILDING"] = "community_building";
})(CoachSpecialization || (exports.CoachSpecialization = CoachSpecialization = {}));
var PersonalityType;
(function (PersonalityType) {
    PersonalityType["MENTOR"] = "mentor";
    PersonalityType["FRIEND"] = "friend";
    PersonalityType["CHALLENGER"] = "challenger";
    PersonalityType["ANALYZER"] = "analyzer";
    PersonalityType["MOTIVATOR"] = "motivator";
})(PersonalityType || (exports.PersonalityType = PersonalityType = {}));
var TeachingStyle;
(function (TeachingStyle) {
    TeachingStyle["DIRECT"] = "direct";
    TeachingStyle["Socratic"] = "socratic";
    TeachingStyle["PROJECT_BASED"] = "project_based";
    TeachingStyle["ADAPTIVE"] = "adaptive";
    TeachingStyle["GAMIFIED"] = "gamified";
})(TeachingStyle || (exports.TeachingStyle = TeachingStyle = {}));
var ConnectionType;
(function (ConnectionType) {
    ConnectionType["DIRECT_UNLOCK"] = "direct_unlock";
    ConnectionType["MENTORSHIP_GATE"] = "mentorship_gate";
    ConnectionType["COMMUNITY_VOTE"] = "community_vote";
    ConnectionType["REPUTATION_THRESHOLD"] = "reputation_threshold";
})(ConnectionType || (exports.ConnectionType = ConnectionType = {}));
var AcademicLevel;
(function (AcademicLevel) {
    AcademicLevel["UNDERGRADUATE"] = "undergraduate";
    AcademicLevel["GRADUATE"] = "graduate";
    AcademicLevel["POST_GRADUATE"] = "post_graduate";
    AcademicLevel["DOCTORAL"] = "doctoral";
    AcademicLevel["POST_DOCTORAL"] = "post_doctoral";
})(AcademicLevel || (exports.AcademicLevel = AcademicLevel = {}));
var SocialLevel;
(function (SocialLevel) {
    SocialLevel["NOVICE"] = "novice";
    SocialLevel["CONTRIBUTOR"] = "contributor";
    SocialLevel["COLLABORATOR"] = "collaborator";
    SocialLevel["LEADER"] = "leader";
    SocialLevel["ELDER"] = "elder";
    SocialLevel["VISIONARY"] = "visionary";
})(SocialLevel || (exports.SocialLevel = SocialLevel = {}));
var BuilderLevel;
(function (BuilderLevel) {
    BuilderLevel["APPRENTICE"] = "apprentice";
    BuilderLevel["JOURNEYMAN"] = "journeyman";
    BuilderLevel["CRAFTSMAN"] = "craftsman";
    BuilderLevel["EXPERT"] = "expert";
    BuilderLevel["MASTER"] = "master";
    BuilderLevel["INNOVATOR"] = "innovator";
    BuilderLevel["ARCHITECT"] = "architect";
})(BuilderLevel || (exports.BuilderLevel = BuilderLevel = {}));
var IntegrityLevel;
(function (IntegrityLevel) {
    IntegrityLevel["TRUSTED"] = "trusted";
    IntegrityLevel["RESPECTED"] = "respected";
    IntegrityLevel["HONORABLE"] = "honorable";
    IntegrityLevel["VENERABLE"] = "venerable";
    IntegrityLevel["LEGENDARY"] = "legendary";
})(IntegrityLevel || (exports.IntegrityLevel = IntegrityLevel = {}));
var GeneticRarity;
(function (GeneticRarity) {
    GeneticRarity["COMMON"] = "common";
    GeneticRarity["UNCOMMON"] = "uncommon";
    GeneticRarity["RARE"] = "rare";
    GeneticRarity["EPIC"] = "epic";
    GeneticRarity["LEGENDARY"] = "legendary";
    GeneticRarity["MYTHIC"] = "mythic";
})(GeneticRarity || (exports.GeneticRarity = GeneticRarity = {}));
var EvolutionType;
(function (EvolutionType) {
    EvolutionType["SKILL_GAIN"] = "skill_gain";
    EvolutionType["REPUTATION_INCREASE"] = "reputation_increase";
    EvolutionType["LEVEL_UP"] = "level_up";
    EvolutionType["ACHIEVEMENT_UNLOCK"] = "achievement_unlock";
    EvolutionType["DNA_MUTATION"] = "dna_mutation";
})(EvolutionType || (exports.EvolutionType = EvolutionType = {}));
var EventType;
(function (EventType) {
    EventType["MILESTONE_ACHIEVED"] = "milestone_achieved";
    EventType["REVOLUTION_STARTED"] = "revolution_started";
    EventType["REVOLUTION_ENDED"] = "revolution_ended";
    EventType["INNOVATION_APPROVED"] = "innovation_approved";
    EventType["GOVERNANCE_DECISION"] = "governance_decision";
    EventType["ECONOMIC_EVENT"] = "economic_event";
    EventType["SOCIAL_MOVEMENT"] = "social_movement";
})(EventType || (exports.EventType = EventType = {}));
var MilestoneCategory;
(function (MilestoneCategory) {
    MilestoneCategory["TECHNOLOGICAL"] = "technological";
    MilestoneCategory["SOCIAL"] = "social";
    MilestoneCategory["ECONOMIC"] = "economic";
    MilestoneCategory["GOVERNANCE"] = "governance";
    MilestoneCategory["CULTURAL"] = "cultural";
    MilestoneCategory["ENVIRONMENTAL"] = "environmental";
})(MilestoneCategory || (exports.MilestoneCategory = MilestoneCategory = {}));
var HistoricalImportance;
(function (HistoricalImportance) {
    HistoricalImportance["LOCAL"] = "local";
    HistoricalImportance["REGIONAL"] = "regional";
    HistoricalImportance["CIVILIZATION_WIDE"] = "civilization_wide";
    HistoricalImportance["HISTORICAL"] = "historical";
    HistoricalImportance["LEGENDARY"] = "legendary";
})(HistoricalImportance || (exports.HistoricalImportance = HistoricalImportance = {}));
var ContentType;
(function (ContentType) {
    ContentType["TEXT"] = "text";
    ContentType["IMAGE"] = "image";
    ContentType["VIDEO"] = "video";
    ContentType["INTERACTIVE"] = "interactive";
    ContentType["DOCUMENT"] = "document";
    ContentType["ARTWORK"] = "artwork";
})(ContentType || (exports.ContentType = ContentType = {}));
var PrivilegeType;
(function (PrivilegeType) {
    PrivilegeType["EARNING_BONUS"] = "earning_bonus";
    PrivilegeType["GOVERNANCE_RIGHT"] = "governance_right";
    PrivilegeType["MENTORING_ABILITY"] = "mentoring_ability";
    PrivilegeType["INNOVATION_ACCESS"] = "innovation_access";
    PrivilegeType["REPUTATION_BOOST"] = "reputation_boost";
})(PrivilegeType || (exports.PrivilegeType = PrivilegeType = {}));
var AssetType;
(function (AssetType) {
    AssetType["ACHIEVEMENT"] = "achievement";
    AssetType["TITLE"] = "title";
    AssetType["VISUAL_EFFECT"] = "visual_effect";
    AssetType["GOVERNANCE_BADGE"] = "governance_badge";
    AssetType["SKILL_CERTIFICATE"] = "skill_certificate";
})(AssetType || (exports.AssetType = AssetType = {}));
var SignificanceLevel;
(function (SignificanceLevel) {
    SignificanceLevel["MINOR"] = "minor";
    SignificanceLevel["MODERATE"] = "moderate";
    SignificanceLevel["MAJOR"] = "major";
    SignificanceLevel["HISTORIC"] = "historic";
    SignificanceLevel["LEGENDARY"] = "legendary";
})(SignificanceLevel || (exports.SignificanceLevel = SignificanceLevel = {}));
var ObjectiveType;
(function (ObjectiveType) {
    ObjectiveType["COLLECT"] = "collect";
    ObjectiveType["ACHIEVE"] = "achieve";
    ObjectiveType["COMPLETE"] = "complete";
    ObjectiveType["PARTICIPATE"] = "participate";
    ObjectiveType["CREATE"] = "create";
})(ObjectiveType || (exports.ObjectiveType = ObjectiveType = {}));
var BonusType;
(function (BonusType) {
    BonusType["MULTIPLIER"] = "multiplier";
    BonusType["FLAT_BONUS"] = "flat_bonus";
    BonusType["TEMPORARY_BOOST"] = "temporary_boost";
    BonusType["PERMANENT_UPGRADE"] = "permanent_upgrade";
})(BonusType || (exports.BonusType = BonusType = {}));
var BenefitType;
(function (BenefitType) {
    BenefitType["ECONOMIC"] = "economic";
    BenefitType["SOCIAL"] = "social";
    BenefitType["GOVERNANCE"] = "governance";
    BenefitType["EDUCATIONAL"] = "educational";
    BenefitType["CULTURAL"] = "cultural";
})(BenefitType || (exports.BenefitType = BenefitType = {}));
var RevolutionOutcome;
(function (RevolutionOutcome) {
    RevolutionOutcome["SUCCESS"] = "success";
    RevolutionOutcome["PARTIAL_SUCCESS"] = "partial_success";
    RevolutionOutcome["FAILURE"] = "failure";
    RevolutionOutcome["CRUSHED"] = "crushed";
    RevolutionOutcome["ONGOING"] = "ongoing";
})(RevolutionOutcome || (exports.RevolutionOutcome = RevolutionOutcome = {}));
var RevolutionImpact;
(function (RevolutionImpact) {
    RevolutionImpact["ECONOMIC"] = "economic";
    RevolutionImpact["SOCIAL"] = "social";
    RevolutionImpact["GOVERNANCE"] = "governance";
    RevolutionImpact["CULTURAL"] = "cultural";
    RevolutionImpact["ENVIRONMENTAL"] = "environmental";
})(RevolutionImpact || (exports.RevolutionImpact = RevolutionImpact = {}));
var RevolutionMethod;
(function (RevolutionMethod) {
    RevolutionMethod["PEACEFUL_EVOLUTION"] = "peaceful_evolution";
    RevolutionMethod["SOCIAL_MOVEMENT"] = "social_movement";
    RevolutionMethod["ECONOMIC_BOYCOTT"] = "economic_boycott";
    RevolutionMethod["GOVERNANCE_REFORM"] = "governance_reform";
    RevolutionMethod["DIGITAL_ACTIVISM"] = "digital_activism";
})(RevolutionMethod || (exports.RevolutionMethod = RevolutionMethod = {}));
var ThresholdType;
(function (ThresholdType) {
    ThresholdType["ABSOLUTE_NUMBER"] = "absolute_number";
    ThresholdType["PERCENTAGE"] = "percentage";
    ThresholdType["REPUTATION_BASED"] = "reputation_based";
    ThresholdType["TIME_BASED"] = "time_based";
})(ThresholdType || (exports.ThresholdType = ThresholdType = {}));
var WeightingMethod;
(function (WeightingMethod) {
    WeightingMethod["QUADRATIC"] = "quadratic";
    WeightingMethod["REPUTATION_WEIGHTED"] = "reputation_weighted";
    WeightingMethod["TIME_DECAYED"] = "time_decayed";
    WeightingMethod["CONSENSUS_WEIGHTED"] = "consensus_weighted";
})(WeightingMethod || (exports.WeightingMethod = WeightingMethod = {}));
var VisualType;
(function (VisualType) {
    VisualType["AVATAR"] = "avatar";
    VisualType["BADGE"] = "badge";
    VisualType["EFFECT"] = "effect";
    VisualType["ANIMATION"] = "animation";
    VisualType["FRAME"] = "frame";
    VisualType["BACKGROUND"] = "background";
})(VisualType || (exports.VisualType = VisualType = {}));
var EffectType;
(function (EffectType) {
    EffectType["MULTIPLIER"] = "multiplier";
    EffectType["BONUS"] = "bonus";
    EffectType["ABILITY"] = "ability";
    EffectType["TRAIT"] = "trait";
    EffectType["MODIFIER"] = "modifier";
})(EffectType || (exports.EffectType = EffectType = {}));
var InheritanceType;
(function (InheritanceType) {
    InheritanceType["DIRECT"] = "direct";
    InheritanceType["MENDLIAN"] = "mendelian";
    InheritanceType["RECESSIVE"] = "recessive";
    InheritanceType["MUTATION"] = "mutation";
    InheritanceType["EPIGENETIC"] = "epigenetic";
})(InheritanceType || (exports.InheritanceType = InheritanceType = {}));
var PenaltyType;
(function (PenaltyType) {
    PenaltyType["WARNING"] = "warning";
    PenaltyType["TEMPORARY_SUSPENSION"] = "temporary_suspension";
    PenaltyType["PERMANENT_BAN"] = "permanent_ban";
    PenaltyType["REPUTATION_LOSS"] = "reputation_loss";
    PenaltyType["FINANCIAL"] = "financial";
})(PenaltyType || (exports.PenaltyType = PenaltyType = {}));
var ResolutionProcess;
(function (ResolutionProcess) {
    ResolutionProcess["MEDIATION"] = "mediation";
    ResolutionProcess["ARBITRATION"] = "arbitration";
    ResolutionProcess["COMMUNITY_VOTE"] = "community_vote";
    ResolutionProcess["EXPERT_REVIEW"] = "expert_review";
    ResolutionProcess["AUTOMATED"] = "automated";
})(ResolutionProcess || (exports.ResolutionProcess = ResolutionProcess = {}));
//# sourceMappingURL=excellence-fame.js.map