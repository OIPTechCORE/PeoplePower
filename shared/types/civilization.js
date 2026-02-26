"use strict";
// ========================================
// PEOPLE POWER UNIVERSITY & CIVILIZATION CONTROL MAP
// ========================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberStatus = exports.AccreditationStatus = exports.PartnershipStatus = exports.PartnershipType = exports.TreasuryType = exports.GovernanceType = exports.EconomicType = exports.CommunityStatus = exports.IncomeSourceType = exports.QuorumRequirement = exports.VoteWeighting = exports.VotingType = exports.MilestoneStatus = exports.ProjectStatus = exports.RewardType = exports.BenefitType = exports.RequirementType = exports.BonusType = exports.AuthorityLevel = exports.PowerType = exports.InstitutionType = exports.CommunityType = exports.ContributionType = exports.SkillCategory = exports.GovernanceLayerType = exports.SafetyStructureType = exports.PowerPillarType = exports.PrestigeLevel = exports.CourseDifficulty = exports.FacultyType = void 0;
// ========================================
// ENUMS & TYPES
// ========================================
var FacultyType;
(function (FacultyType) {
    FacultyType["LEADERSHIP_GOVERNANCE"] = "leadership_governance";
    FacultyType["DIGITAL_ENTREPRENEURSHIP"] = "digital_entrepreneurship";
    FacultyType["TECHNOLOGY_AI_LITERACY"] = "technology_ai_literacy";
    FacultyType["CREATIVE_ARTS_MEDIA"] = "creative_arts_media";
    FacultyType["CIVIC_COMMUNITY_DEVELOPMENT"] = "civic_community_development";
})(FacultyType || (exports.FacultyType = FacultyType = {}));
var CourseDifficulty;
(function (CourseDifficulty) {
    CourseDifficulty["BEGINNER"] = "beginner";
    CourseDifficulty["INTERMEDIATE"] = "intermediate";
    CourseDifficulty["ADVANCED"] = "advanced";
    CourseDifficulty["EXPERT"] = "expert";
})(CourseDifficulty || (exports.CourseDifficulty = CourseDifficulty = {}));
var PrestigeLevel;
(function (PrestigeLevel) {
    PrestigeLevel["CERTIFICATE"] = "certificate";
    PrestigeLevel["DIPLOMA"] = "diploma";
    PrestigeLevel["BACHELOR"] = "bachelor";
    PrestigeLevel["MASTER"] = "master";
    PrestigeLevel["DOCTORATE"] = "doctorate";
    PrestigeLevel["FELLOW"] = "fellow";
})(PrestigeLevel || (exports.PrestigeLevel = PrestigeLevel = {}));
var PowerPillarType;
(function (PowerPillarType) {
    PowerPillarType["CITIZENS"] = "citizens";
    PowerPillarType["COMMUNITIES"] = "communities";
    PowerPillarType["INSTITUTIONS"] = "institutions";
    PowerPillarType["COUNCILS"] = "councils";
    PowerPillarType["PROTOCOL_GUARDIANS"] = "protocol_guardians";
})(PowerPillarType || (exports.PowerPillarType = PowerPillarType = {}));
var SafetyStructureType;
(function (SafetyStructureType) {
    SafetyStructureType["TRANSPARENCY_ENGINE"] = "transparency_engine";
    SafetyStructureType["REPUTATION_BASED_AUTHORITY"] = "reputation_based_authority";
    SafetyStructureType["ECONOMIC_STABILITY_BOARD"] = "economic_stability_board";
    SafetyStructureType["ANTI_MANIPULATION_SYSTEMS"] = "anti_manipulation_systems";
})(SafetyStructureType || (exports.SafetyStructureType = SafetyStructureType = {}));
var GovernanceLayerType;
(function (GovernanceLayerType) {
    GovernanceLayerType["CITIZENS"] = "citizens";
    GovernanceLayerType["COMMUNITIES"] = "communities";
    GovernanceLayerType["INSTITUTIONS"] = "institutions";
    GovernanceLayerType["COUNCILS"] = "councils";
    GovernanceLayerType["PROTOCOL_GUARDIANS"] = "protocol_guardians";
})(GovernanceLayerType || (exports.GovernanceLayerType = GovernanceLayerType = {}));
var SkillCategory;
(function (SkillCategory) {
    SkillCategory["LEADERSHIP"] = "leadership";
    SkillCategory["TECHNICAL"] = "technical";
    SkillCategory["CREATIVE"] = "creative";
    SkillCategory["SOCIAL"] = "social";
    SkillCategory["ECONOMIC"] = "economic";
    SkillCategory["GOVERNANCE"] = "governance";
})(SkillCategory || (exports.SkillCategory = SkillCategory = {}));
var ContributionType;
(function (ContributionType) {
    ContributionType["MENTORSHIP"] = "mentorship";
    ContributionType["COMMUNITY_BUILDING"] = "community_building";
    ContributionType["KNOWLEDGE_CREATION"] = "knowledge_creation";
    ContributionType["INNOVATION"] = "innovation";
    ContributionType["GOVERNANCE"] = "governance";
    ContributionType["CULTURAL"] = "cultural";
})(ContributionType || (exports.ContributionType = ContributionType = {}));
var CommunityType;
(function (CommunityType) {
    CommunityType["GUILD"] = "guild";
    CommunityType["MOVEMENT"] = "movement";
    CommunityType["LEARNING_GROUP"] = "learning_group";
    CommunityType["PROJECT_TEAM"] = "project_team";
    CommunityType["REGIONAL_GROUP"] = "regional_group";
    CommunityType["INTEREST_GROUP"] = "interest_group";
})(CommunityType || (exports.CommunityType = CommunityType = {}));
var InstitutionType;
(function (InstitutionType) {
    InstitutionType["UNIVERSITY"] = "university";
    InstitutionType["RESEARCH_INSTITUTE"] = "research_institute";
    InstitutionType["CULTURAL_CENTER"] = "cultural_center";
    InstitutionType["ECONOMIC_BODY"] = "economic_body";
    InstitutionType["GOVERNANCE_BODY"] = "governance_body";
})(InstitutionType || (exports.InstitutionType = InstitutionType = {}));
var PowerType;
(function (PowerType) {
    PowerType["GOVERNANCE"] = "governance";
    PowerType["ECONOMIC"] = "economic";
    PowerType["SOCIAL"] = "social";
    PowerType["EDUCATIONAL"] = "educational";
    PowerType["CULTURAL"] = "cultural";
})(PowerType || (exports.PowerType = PowerType = {}));
var AuthorityLevel;
(function (AuthorityLevel) {
    AuthorityLevel["CITIZEN"] = "citizen";
    AuthorityLevel["COMMUNITY_MEMBER"] = "community_member";
    AuthorityLevel["COMMUNITY_LEADER"] = "community_leader";
    AuthorityLevel["INSTITUTIONAL_MEMBER"] = "institutional_member";
    AuthorityLevel["COUNCIL_MEMBER"] = "council_member";
    AuthorityLevel["PROTOCOL_GUARDIAN"] = "protocol_guardian";
})(AuthorityLevel || (exports.AuthorityLevel = AuthorityLevel = {}));
var BonusType;
(function (BonusType) {
    BonusType["ECONOMIC"] = "economic";
    BonusType["REPUTATION"] = "reputation";
    BonusType["GOVERNANCE"] = "governance";
    BonusType["EDUCATIONAL"] = "educational";
    BonusType["SOCIAL"] = "social";
})(BonusType || (exports.BonusType = BonusType = {}));
var RequirementType;
(function (RequirementType) {
    RequirementType["SKILL_LEVEL"] = "skill_level";
    RequirementType["REPUTATION"] = "reputation";
    RequirementType["CONTRIBUTION"] = "contribution";
    RequirementType["EDUCATION"] = "education";
    RequirementType["EXPERIENCE"] = "experience";
})(RequirementType || (exports.RequirementType = RequirementType = {}));
var BenefitType;
(function (BenefitType) {
    BenefitType["SKILL_ACCELERATION"] = "skill_acceleration";
    BenefitType["ECONOMIC_BONUS"] = "economic_bonus";
    BenefitType["REPUTATION_BOOST"] = "reputation_boost";
    BenefitType["EXCLUSIVE_ACCESS"] = "exclusive_access";
    BenefitType["MENTORSHIP_OPPORTUNITY"] = "mentorship_opportunity";
})(BenefitType || (exports.BenefitType = BenefitType = {}));
var RewardType;
(function (RewardType) {
    RewardType["TOKEN"] = "token";
    RewardType["REPUTATION"] = "reputation";
    RewardType["SKILL_POINTS"] = "skill_points";
    RewardType["GOVERNANCE_POWER"] = "governance_power";
    RewardType["EXCLUSIVE_CONTENT"] = "exclusive_content";
})(RewardType || (exports.RewardType = RewardType = {}));
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["PLANNING"] = "planning";
    ProjectStatus["ACTIVE"] = "active";
    ProjectStatus["ON_HOLD"] = "on_hold";
    ProjectStatus["COMPLETED"] = "completed";
    ProjectStatus["CANCELLED"] = "cancelled";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
var MilestoneStatus;
(function (MilestoneStatus) {
    MilestoneStatus["PENDING"] = "pending";
    MilestoneStatus["IN_PROGRESS"] = "in_progress";
    MilestoneStatus["COMPLETED"] = "completed";
    MilestoneStatus["OVERDUE"] = "overdue";
    MilestoneStatus["CANCELLED"] = "cancelled";
})(MilestoneStatus || (exports.MilestoneStatus = MilestoneStatus = {}));
(function (SafetyStructureType) {
    SafetyStructureType["TRANSPARENCY_ENGINE"] = "transparency_engine";
    SafetyStructureType["REPUTATION_BASED_AUTHORITY"] = "reputation_based_authority";
    SafetyStructureType["ECONOMIC_STABILITY_BOARD"] = "economic_stability_board";
    SafetyStructureType["ANTI_MANIPULATION_SYSTEMS"] = "anti_manipulation_systems";
})(SafetyStructureType || (exports.SafetyStructureType = SafetyStructureType = {}));
(function (GovernanceLayerType) {
    GovernanceLayerType["CITIZENS"] = "citizens";
    GovernanceLayerType["COMMUNITIES"] = "communities";
    GovernanceLayerType["INSTITUTIONS"] = "institutions";
    GovernanceLayerType["COUNCILS"] = "councils";
    GovernanceLayerType["PROTOCOL_GUARDIANS"] = "protocol_guardians";
})(GovernanceLayerType || (exports.GovernanceLayerType = GovernanceLayerType = {}));
var VotingType;
(function (VotingType) {
    VotingType["SIMPLE_MAJORITY"] = "simple_majority";
    VotingType["SUPER_MAJORITY"] = "super_majority";
    VotingType["CONSENSUS"] = "consensus";
    VotingType["WEIGHTED"] = "weighted";
    VotingType["QUADRATIC"] = "quadratic";
})(VotingType || (exports.VotingType = VotingType = {}));
var VoteWeighting;
(function (VoteWeighting) {
    VoteWeighting["EQUAL"] = "equal";
    VoteWeighting["REPUTATION_BASED"] = "reputation_based";
    VoteWeighting["CONTRIBUTION_BASED"] = "contribution_based";
    VoteWeighting["SKILL_BASED"] = "skill_based";
    VoteWeighting["HYBRID"] = "hybrid";
})(VoteWeighting || (exports.VoteWeighting = VoteWeighting = {}));
var QuorumRequirement;
(function (QuorumRequirement) {
    QuorumRequirement["FIXED_NUMBER"] = "fixed_number";
    QuorumRequirement["PERCENTAGE"] = "percentage";
    QuorumRequirement["ADAPTIVE"] = "adaptive";
})(QuorumRequirement || (exports.QuorumRequirement = QuorumRequirement = {}));
var IncomeSourceType;
(function (IncomeSourceType) {
    IncomeSourceType["MEMBERSHIP_DUES"] = "membership_dues";
    IncomeSourceType["DONATIONS"] = "donations";
    IncomeSourceType["INVESTMENT_RETURNS"] = "investment_returns";
    IncomeSourceType["SERVICE_FEES"] = "service_fees";
    IncomeSourceType["SPONSORSHIP"] = "sponsorship";
})(IncomeSourceType || (exports.IncomeSourceType = IncomeSourceType = {}));
var CommunityStatus;
(function (CommunityStatus) {
    CommunityStatus["ACTIVE"] = "active";
    CommunityStatus["INACTIVE"] = "inactive";
    CommunityStatus["SUSPENDED"] = "suspended";
    CommunityStatus["DISSOLVED"] = "dissolved";
})(CommunityStatus || (exports.CommunityStatus = CommunityStatus = {}));
(function (InstitutionType) {
    InstitutionType["UNIVERSITY"] = "university";
    InstitutionType["RESEARCH_INSTITUTE"] = "research_institute";
    InstitutionType["CULTURAL_CENTER"] = "cultural_center";
    InstitutionType["ECONOMIC_BODY"] = "economic_body";
    InstitutionType["GOVERNANCE_BODY"] = "governance_body";
})(InstitutionType || (exports.InstitutionType = InstitutionType = {}));
var EconomicType;
(function (EconomicType) {
    EconomicType["MARKET_BASED"] = "market_based";
    EconomicType["PLANNED"] = "planned";
    EconomicType["MIXED"] = "mixed";
    EconomicType["GIFT_ECONOMY"] = "gift_economy";
    EconomicType["CONTRIBUTION_BASED"] = "contribution_based";
})(EconomicType || (exports.EconomicType = EconomicType = {}));
var GovernanceType;
(function (GovernanceType) {
    GovernanceType["DIRECT_DEMOCRACY"] = "direct_democracy";
    GovernanceType["REPRESENTATIVE_DEMOCRACY"] = "representative_democracy";
    GovernanceType["LIQUID_DEMOCRACY"] = "liquid_democracy";
    GovernanceType["TECHNOCRACY"] = "technocracy";
    GovernanceType["MERITOCRACY"] = "meritocracy";
    GovernanceType["HYBRID"] = "hybrid";
})(GovernanceType || (exports.GovernanceType = GovernanceType = {}));
var TreasuryType;
(function (TreasuryType) {
    TreasuryType["CENTRALIZED"] = "centralized";
    TreasuryType["DISTRIBUTED"] = "distributed";
    TreasuryType["COMMUNITY_CONTROLLED"] = "community_controlled";
    TreasuryType["HYBRID"] = "hybrid";
})(TreasuryType || (exports.TreasuryType = TreasuryType = {}));
var PartnershipType;
(function (PartnershipType) {
    PartnershipType["ACADEMIC"] = "academic";
    PartnershipType["COMMERCIAL"] = "commercial";
    PartnershipType["GOVERNMENTAL"] = "governmental";
    PartnershipType["NON_PROFIT"] = "non_profit";
    PartnershipType["TECHNICAL"] = "technical";
})(PartnershipType || (exports.PartnershipType = PartnershipType = {}));
var PartnershipStatus;
(function (PartnershipStatus) {
    PartnershipStatus["ACTIVE"] = "active";
    PartnershipStatus["PENDING"] = "pending";
    PartnershipStatus["SUSPENDED"] = "suspended";
    PartnershipStatus["TERMINATED"] = "terminated";
})(PartnershipStatus || (exports.PartnershipStatus = PartnershipStatus = {}));
var AccreditationStatus;
(function (AccreditationStatus) {
    AccreditationStatus["PENDING"] = "pending";
    AccreditationStatus["ACCREDITED"] = "accredited";
    AccreditationStatus["PROVISIONAL"] = "provisional";
    AccreditationStatus["EXPIRED"] = "expired";
    AccreditationStatus["REVOKED"] = "revoked";
})(AccreditationStatus || (exports.AccreditationStatus = AccreditationStatus = {}));
var MemberStatus;
(function (MemberStatus) {
    MemberStatus["ACTIVE"] = "active";
    MemberStatus["INACTIVE"] = "inactive";
    MemberStatus["SUSPENDED"] = "suspended";
    MemberStatus["TERMINATED"] = "terminated";
})(MemberStatus || (exports.MemberStatus = MemberStatus = {}));
//# sourceMappingURL=civilization.js.map