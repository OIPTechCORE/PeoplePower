"use strict";
// ========================================
// ADVANCED CIVILIZATION ARCHITECTURE
// Global Research-Based Framework for Digital Societies
// ========================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureType = exports.EvolutionPhase = exports.JusticeType = exports.SecurityType = exports.VerificationMethod = exports.PublicAccess = exports.TransparencyLevel = exports.ProcessType = exports.NetworkType = exports.IdentityType = exports.StructureType = exports.InstitutionType = exports.VotingType = exports.GovernanceType = exports.ActivityType = exports.OwnershipType = exports.AssetCategory = exports.RequirementType = exports.CivilizationLayer = void 0;
// ========================================
// COMPREHENSIVE ENUMS
// ========================================
var CivilizationLayer;
(function (CivilizationLayer) {
    CivilizationLayer["PROPERTY_OWNERSHIP"] = "property_ownership";
    CivilizationLayer["ECONOMIC_SYSTEM"] = "economic_system";
    CivilizationLayer["GOVERNANCE_LAW"] = "governance_law";
    CivilizationLayer["KNOWLEDGE_EDUCATION"] = "knowledge_education";
    CivilizationLayer["SOCIAL_IDENTITY_CULTURE"] = "social_identity_culture";
    CivilizationLayer["TRUST_SECURITY_JUSTICE"] = "trust_security_justice";
    CivilizationLayer["INTEROPERABLE_NETWORK"] = "interoperable_network";
})(CivilizationLayer || (exports.CivilizationLayer = CivilizationLayer = {}));
var RequirementType;
(function (RequirementType) {
    RequirementType["REPUTATION"] = "reputation";
    RequirementType["SKILL"] = "skill";
    RequirementType["CONTRIBUTION"] = "contribution";
    RequirementType["TIME_IN_COMMUNITY"] = "time_in_community";
    RequirementType["ASSET_OWNERSHIP"] = "asset_ownership";
    RequirementType["GOVERNANCE_PARTICIPATION"] = "governance_participation";
    RequirementType["EDUCATIONAL_ACHIEVEMENT"] = "educational_achievement";
    RequirementType["IDENTITY_VERIFICATION"] = "identity_verification";
    RequirementType["SECURITY_CLEARANCE"] = "security_clearance";
})(RequirementType || (exports.RequirementType = RequirementType = {}));
var AssetCategory;
(function (AssetCategory) {
    AssetCategory["REAL_ESTATE"] = "real_estate";
    AssetCategory["VIRTUAL_LAND"] = "virtual_land";
    AssetCategory["DIGITAL_ASSETS"] = "digital_assets";
    AssetCategory["AVATARS"] = "avatars";
    AssetCategory["CLOTHING"] = "clothing";
    AssetCategory["TOOLS"] = "tools";
    AssetCategory["CREATIONS"] = "creations";
    AssetCategory["INTELLECTUAL_PROPERTY"] = "intellectual_property";
    AssetCategory["ACCESS_TOKENS"] = "access_tokens";
    AssetCategory["MEMBERSHIPS"] = "memberships";
})(AssetCategory || (exports.AssetCategory = AssetCategory = {}));
var OwnershipType;
(function (OwnershipType) {
    OwnershipType["FULL_OWNERSHIP"] = "full_ownership";
    OwnershipType["SHARED_OWNERSHIP"] = "shared_ownership";
    OwnershipType["LEASEHOLD"] = "leasehold";
    OwnershipType["STAKING_OWNERSHIP"] = "staking_ownership";
    OwnershipType["LICENSED_USAGE"] = "licensed_usage";
    OwnershipType["COLLECTIVE_OWNERSHIP"] = "collective_ownership";
})(OwnershipType || (exports.OwnershipType = OwnershipType = {}));
var ActivityType;
(function (ActivityType) {
    ActivityType["PRODUCTION"] = "production";
    ActivityType["SERVICE"] = "service";
    ActivityType["TRADING"] = "trading";
    ActivityType["INVESTMENT"] = "investment";
    ActivityType["CONSUMPTION"] = "consumption";
    ActivityType["CREATION"] = "creation";
    ActivityType["RESEARCH"] = "research";
    ActivityType["EDUCATION"] = "education";
    ActivityType["ENTERTAINMENT"] = "entertainment";
    ActivityType["GOVERNANCE"] = "governance";
})(ActivityType || (exports.ActivityType = ActivityType = {}));
var GovernanceType;
(function (GovernanceType) {
    GovernanceType["DIRECT_DEMOCRACY"] = "direct_democracy";
    GovernanceType["REPRESENTATIVE_DEMOCRACY"] = "representative_democracy";
    GovernanceType["LIQUID_DEMOCRACY"] = "liquid_democracy";
    GovernanceType["TECHNOCRACY"] = "technocracy";
    GovernanceType["MERITOCRACY"] = "meritocracy";
    GovernanceType["CORPORATE"] = "corporate";
    GovernanceType["CONSENSUS"] = "consensus";
    GovernanceType["HYBRID"] = "hybrid";
})(GovernanceType || (exports.GovernanceType = GovernanceType = {}));
var VotingType;
(function (VotingType) {
    VotingType["SIMPLE_MAJORITY"] = "simple_majority";
    VotingType["SUPER_MAJORITY"] = "super_majority";
    VotingType["CONSENSUS"] = "consensus";
    VotingType["QUADRATIC"] = "quadratic";
    VotingType["WEIGHTED_CONSENSUS"] = "weighted_consensus";
    VotingType["RANKED_CHOICE"] = "ranked_choice";
    VotingType["DELEGATED"] = "delegated";
    VotingType["LIQUID_DEMOCRACY"] = "liquid_democracy";
})(VotingType || (exports.VotingType = VotingType = {}));
var InstitutionType;
(function (InstitutionType) {
    InstitutionType["UNIVERSITY"] = "university";
    InstitutionType["RESEARCH_INSTITUTE"] = "research_institute";
    InstitutionType["VOCATIONAL_SCHOOL"] = "vocational_school";
    InstitutionType["LIBRARY"] = "library";
    InstitutionType["MUSEUM"] = "museum";
    InstitutionType["LABORATORY"] = "laboratory";
    InstitutionType["THINK_TANK"] = "think_tank";
    InstitutionType["CONSULTING_FIRM"] = "consulting_firm";
    InstitutionType["LEGAL_FIRM"] = "legal_firm";
    InstitutionType["FINANCIAL_INSTITUTION"] = "financial_institution";
    InstitutionType["HEALTHCARE_INSTITUTION"] = "healthcare_institution";
})(InstitutionType || (exports.InstitutionType = InstitutionType = {}));
var StructureType;
(function (StructureType) {
    StructureType["GUILD"] = "guild";
    StructureType["COMMUNITY"] = "community";
    StructureType["ORGANIZATION"] = "organization";
    StructureType["COMPANY"] = "company";
    StructureType["CORPORATION"] = "corporation";
    StructureType["COOPERATIVE"] = "cooperative";
    StructureType["COLLECTIVE"] = "collective";
    StructureType["MOVEMENT"] = "movement";
    StructureType["INSTITUTION"] = "institution";
    StructureType["GOVERNMENT_BODY"] = "government_body";
})(StructureType || (exports.StructureType = StructureType = {}));
var IdentityType;
(function (IdentityType) {
    IdentityType["DIGITAL_IDENTITY"] = "digital_identity";
    IdentityType["REPUTATION_IDENTITY"] = "reputation_identity";
    IdentityType["SOCIAL_IDENTITY"] = "social_identity";
    IdentityType["CULTURAL_IDENTITY"] = "cultural_identity";
    IdentityType["PROFESSIONAL_IDENTITY"] = "professional_identity";
    IdentityType["LEGAL_IDENTITY"] = "legal_identity";
    IdentityType["EDUCATIONAL_IDENTITY"] = "educational_identity";
})(IdentityType || (exports.IdentityType = IdentityType = {}));
var NetworkType;
(function (NetworkType) {
    NetworkType["BLOCKCHAIN_NETWORK"] = "blockchain_network";
    NetworkType["INTEROPERABILITY_PROTOCOL"] = "interoperability_protocol";
    NetworkType["CIVILIZATION_ALLIANCE"] = "civilization_alliance";
    NetworkType["DIGITAL_NATION"] = "digital_nation";
    NetworkType["METAVERSE"] = "metaverse";
    NetworkType["MULTI_METVERSE"] = "multi_metaverse";
    NetworkType["VIRTUAL_WORLD"] = "virtual_world";
})(NetworkType || (exports.NetworkType = NetworkType = {}));
// Additional enums for completeness
var ProcessType;
(function (ProcessType) {
    ProcessType["LEGISLATIVE"] = "legislative";
    ProcessType["EXECUTIVE"] = "executive";
    ProcessType["JUDICIAL"] = "judicial";
    ProcessType["ADMINISTRATIVE"] = "administrative";
    ProcessType["CONSENSUS"] = "consensus";
    ProcessType["AUTOMATED"] = "automated";
})(ProcessType || (exports.ProcessType = ProcessType = {}));
var TransparencyLevel;
(function (TransparencyLevel) {
    TransparencyLevel["FULL"] = "full";
    TransparencyLevel["HIGH"] = "high";
    TransparencyLevel["MEDIUM"] = "medium";
    TransparencyLevel["LOW"] = "low";
    TransparencyLevel["MINIMAL"] = "minimal";
})(TransparencyLevel || (exports.TransparencyLevel = TransparencyLevel = {}));
var PublicAccess;
(function (PublicAccess) {
    PublicAccess["PROPOSALS"] = "proposals";
    PublicAccess["VOTING_RECORDS"] = "voting_records";
    PublicAccess["FINANCIAL_REPORTS"] = "financial_reports";
    PublicAccess["AUDIT_REPORTS"] = "audit_reports";
    PublicAccess["COURT_DECISIONS"] = "court_decisions";
    PublicAccess["REGULATORY_FILINGS"] = "regulatory_filings";
})(PublicAccess || (exports.PublicAccess = PublicAccess = {}));
var VerificationMethod;
(function (VerificationMethod) {
    VerificationMethod["REPUTATION_CHECK"] = "reputation_check";
    VerificationMethod["SKILL_VERIFICATION"] = "skill_verification";
    VerificationMethod["IDENTITY_VERIFICATION"] = "identity_verification";
    VerificationMethod["SECURITY_CLEARANCE"] = "security_clearance";
    VerificationMethod["BACKGROUND_CHECK"] = "background_check";
    VerificationMethod["PEER_REVIEW"] = "peer_review";
    VerificationMethod["AUTOMATED_ANALYSIS"] = "automated_analysis";
})(VerificationMethod || (exports.VerificationMethod = VerificationMethod = {}));
var SecurityType;
(function (SecurityType) {
    SecurityType["ACCESS_CONTROL"] = "access_control";
    SecurityType["ENCRYPTION"] = "encryption";
    SecurityType["AUDIT_LOGGING"] = "audit_logging";
    SecurityType["MONITORING"] = "monitoring";
    SecurityType["THREAT_DETECTION"] = "threat_detection";
    SecurityType["INCIDENT_RESPONSE"] = "incident_response";
    SecurityType["COMPLIANCE"] = "compliance";
    SecurityType["PENALTY_ENFORCEMENT"] = "penalty_enforcement";
})(SecurityType || (exports.SecurityType = SecurityType = {}));
var JusticeType;
(function (JusticeType) {
    JusticeType["CIVIL"] = "civil";
    JusticeType["CRIMINAL"] = "criminal";
    JusticeType["ADMINISTRATIVE"] = "administrative";
    JusticeType["CONSTITUTIONAL"] = "constitutional";
    JusticeType["INTERNATIONAL"] = "international";
    JusticeType["RESTORATIVE"] = "restorative";
    JusticeType["REHABILITATIVE"] = "rehabilitative";
})(JusticeType || (exports.JusticeType = JusticeType = {}));
var EvolutionPhase;
(function (EvolutionPhase) {
    EvolutionPhase["FOUNDATION"] = "foundation";
    EvolutionPhase["GROWTH"] = "growth";
    EvolutionPhase["MATURITY"] = "maturity";
    EvolutionPhase["INTEROPERABILITY"] = "interoperability";
    EvolutionPhase["SUSTAINABILITY"] = "sustainability";
    EvolutionPhase["AUTONOMY"] = "autonomy";
})(EvolutionPhase || (exports.EvolutionPhase = EvolutionPhase = {}));
var FeatureType;
(function (FeatureType) {
    FeatureType["COMMUNICATION"] = "communication";
    FeatureType["SOCIAL_GRAPH"] = "social_graph";
    FeatureType["MINI_APPS"] = "mini_apps";
    FeatureType["BOT_INTEGRATION"] = "bot_integration";
    FeatureType["API_INTEGRATION"] = "api_integration";
    FeatureType["PAYMENT_SYSTEM"] = "payment_system";
    FeatureType["GOVERNANCE"] = "governance";
    FeatureType["SECURITY"] = "security";
    FeatureType["ANALYTICS"] = "analytics";
    FeatureType["AUTOMATION"] = "automation";
})(FeatureType || (exports.FeatureType = FeatureType = {}));
//# sourceMappingURL=civilization-advanced.js.map