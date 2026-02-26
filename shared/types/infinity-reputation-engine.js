"use strict";
// ========================================
// INFINITY REPUTATION ENGINE (IRE)
// Where badges become economic power, governance rights, and earning multipliers
// ========================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputFormat = exports.ModelType = exports.SensorType = exports.TransactionType = exports.HealthTrend = exports.AccessLevel = exports.RevenueType = exports.PowerType = exports.EconomicType = exports.SocialType = exports.GovernanceType = exports.TrustType = exports.ContributionType = exports.MarketType = exports.InterventionType = exports.AISubsystem = exports.CrisisSeverity = exports.SimulationType = exports.LawPurpose = exports.Sustainability = exports.MechanismType = exports.BadgeCategory = exports.SocialValidation = exports.DecayFunction = exports.MeasurementMethod = exports.ReputationType = void 0;
// ========================================
// COMPREHENSIVE ENUMS
// ========================================
var ReputationType;
(function (ReputationType) {
    ReputationType["CONTRIBUTION"] = "contribution";
    ReputationType["TRUST"] = "trust";
    ReputationType["GOVERNANCE"] = "governance";
    ReputationType["SOCIAL"] = "social";
    ReputationType["ECONOMIC"] = "economic";
})(ReputationType || (exports.ReputationType = ReputationType = {}));
var MeasurementMethod;
(function (MeasurementMethod) {
    MeasurementMethod["AUTOMATIC"] = "automatic";
    MeasurementMethod["PEER_VALIDATION"] = "peer_validation";
    MeasurementMethod["AI_ANALYSIS"] = "ai_analysis";
    MeasurementMethod["COMMUNITY_VOTE"] = "community_vote";
    MeasurementMethod["HYBRID"] = "hybrid";
})(MeasurementMethod || (exports.MeasurementMethod = MeasurementMethod = {}));
var DecayFunction;
(function (DecayFunction) {
    DecayFunction["LINEAR"] = "linear";
    DecayFunction["EXPONENTIAL"] = "exponential";
    DecayFunction["LOGARITHMIC"] = "logarithmic";
    DecayFunction["STEP_FUNCTION"] = "step_function";
    DecayFunction["SIGMOID"] = "sigmoid";
    DecayFunction["CUSTOM"] = "custom";
})(DecayFunction || (exports.DecayFunction = DecayFunction = {}));
var SocialValidation;
(function (SocialValidation) {
    SocialValidation["PEER_REVIEW"] = "peer_review";
    SocialValidation["COMMUNITY_VALIDATION"] = "community_validation";
    SocialValidation["EXPERT_VALIDATION"] = "expert_validation";
    SocialValidation["STAKEHOLDER_VALIDATION"] = "stakeholder_validation";
    SocialValidation["CONSENSUS_VALIDATION"] = "consensus_validation";
})(SocialValidation || (exports.SocialValidation = SocialValidation = {}));
var BadgeCategory;
(function (BadgeCategory) {
    BadgeCategory["BUILDER"] = "builder";
    BadgeCategory["GUARDIAN"] = "guardian";
    BadgeCategory["SCHOLAR"] = "scholar";
    BadgeCategory["SENTINEL"] = "sentinel";
    BadgeCategory["DIPLOMAT"] = "diplomat";
})(BadgeCategory || (exports.BadgeCategory = BadgeCategory = {}));
var MechanismType;
(function (MechanismType) {
    MechanismType["DIRECT_EARNING"] = "direct_earning";
    MechanismType["REVENUE_SHARING"] = "revenue_sharing";
    MechanismType["TEACHING_INCOME"] = "teaching_income";
    MechanismType["GOVERNANCE_REWARDS"] = "governance_rewards";
    MechanismType["SECURITY_BONUSES"] = "security_bonuses";
    MechanismType["DIPLOMATIC_BENEFITS"] = "diplomatic_benefits";
})(MechanismType || (exports.MechanismType = MechanismType = {}));
var Sustainability;
(function (Sustainability) {
    Sustainability["HIGHLY_SUSTAINABLE"] = "highly_sustainable";
    Sustainability["SUSTAINABLE"] = "sustainable";
    Sustainability["MODERATELY_SUSTAINABLE"] = "moderately_sustainable";
    Sustainability["UNSUSTAINABLE"] = "unsustainable";
    Sustainability["HIGHLY_UNSUSTAINABLE"] = "highly_unsustainable";
})(Sustainability || (exports.Sustainability = Sustainability = {}));
var LawPurpose;
(function (LawPurpose) {
    LawPurpose["CONSERVATION"] = "conservation";
    LawPurpose["ENTROPY"] = "entropy";
    LawPurpose["DIMINISHING_RETURNS"] = "diminishing_returns";
    LawPurpose["SOCIAL_VALIDATION_ENERGY"] = "social_validation_energy";
    LawPurpose["RISK_PRINCIPLE"] = "risk_principle";
    LawPurpose["REPUTATION_RECYCLING"] = "reputation_recycling";
    LawPurpose["MULTI_DIMENSIONAL_BALANCE"] = "multi_dimensional_balance";
    LawPurpose["TIME_WEIGHTED_LEGACY"] = "time_weighted_legacy";
    LawPurpose["CIVILIZATION_HEALTH_COUPLING"] = "civilization_health_coupling";
    LawPurpose["GRAVITATIONAL_ATTRACTOR"] = "gravitational_attractor";
    LawPurpose["ANTI_COLLUSION_PHYSICS"] = "anti_collusion_physics";
    LawPurpose["REPUTATION_HALVING"] = "reputation_halving";
    LawPurpose["MASTER_EQUATION"] = "master_equation";
})(LawPurpose || (exports.LawPurpose = LawPurpose = {}));
var SimulationType;
(function (SimulationType) {
    SimulationType["ECONOMIC"] = "economic";
    SimulationType["SOCIAL"] = "social";
    SimulationType["GOVERNANCE"] = "governance";
    SimulationType["REPUTATION"] = "reputation";
    SimulationType["CRISIS"] = "crisis";
    SimulationType["GROWTH"] = "growth";
    SimulationType["STABILITY"] = "stability";
})(SimulationType || (exports.SimulationType = SimulationType = {}));
var CrisisSeverity;
(function (CrisisSeverity) {
    CrisisSeverity["LOW"] = "low";
    CrisisSeverity["MEDIUM"] = "medium";
    CrisisSeverity["HIGH"] = "high";
    CrisisSeverity["CRITICAL"] = "critical";
    CrisisSeverity["CATASTROPHIC"] = "catastrophic";
})(CrisisSeverity || (exports.CrisisSeverity = CrisisSeverity = {}));
var AISubsystem;
(function (AISubsystem) {
    AISubsystem["OBSERVATION"] = "observation";
    AISubsystem["UNDERSTANDING"] = "understanding";
    AISubsystem["PREDICTION"] = "prediction";
    AISubsystem["INTERVENTION"] = "intervention";
    AISubsystem["LEARNING"] = "learning";
    AISubsystem["ETHICS"] = "ethics";
    AISubsystem["COORDINATION"] = "coordination";
})(AISubsystem || (exports.AISubsystem = AISubsystem = {}));
var InterventionType;
(function (InterventionType) {
    InterventionType["AUTOMATIC_ADJUSTMENT"] = "automatic_adjustment";
    InterventionType["PARAMETER_TUNING"] = "parameter_tuning";
    InterventionType["EMERGENCY_INTERVENTION"] = "emergency_intervention";
    InterventionType["GOVERNANCE_OVERRIDE"] = "governance_override";
    InterventionType["ECONOMIC_STIMULUS"] = "economic_stimulus";
    InterventionType["SOCIAL_INTERVENTION"] = "social_intervention";
    InterventionType["REPUTATION_RESET"] = "reputation_reset";
})(InterventionType || (exports.InterventionType = InterventionType = {}));
var MarketType;
(function (MarketType) {
    MarketType["REPUTATION_BACKING"] = "reputation_backing";
    MarketType["SPONSORSHIP_MARKET"] = "sponsorship_market";
    MarketType["GUILD_CREDIBILITY"] = "guild_credibility";
    MarketType["RISK_POOLING"] = "risk_pooling";
    MarketType["FUTURES_MARKET"] = "futures_market";
    MarketType["INSURANCE_MARKET"] = "insurance_market";
})(MarketType || (exports.MarketType = MarketType = {}));
// Additional enums for completeness
var ContributionType;
(function (ContributionType) {
    ContributionType["MISSION_COMPLETION"] = "mission_completion";
    ContributionType["TEACHING"] = "teaching";
    ContributionType["BUILDING_TOOLS"] = "building_tools";
    ContributionType["REPORTING_BUGS"] = "reporting_bugs";
    ContributionType["CREATING_CONTENT"] = "creating_content";
    ContributionType["MENTORING"] = "mentoring";
    ContributionType["INNOVATION"] = "innovation";
    ContributionType["RESEARCH"] = "research";
    ContributionType["GOVERNANCE_PARTICIPATION"] = "governance_participation";
})(ContributionType || (exports.ContributionType = ContributionType = {}));
var TrustType;
(function (TrustType) {
    TrustType["NO_SCAMS"] = "no_scams";
    TrustType["FAIR_TRADES"] = "fair_trades";
    TrustType["VERIFIED_TRANSACTIONS"] = "verified_transactions";
    TrustType["DISPUTE_OUTCOMES"] = "dispute_outcomes";
    TrustType["TRANSACTION_HISTORY"] = "transaction_history";
    TrustType["PEER_VALIDATION"] = "peer_validation";
})(TrustType || (exports.TrustType = TrustType = {}));
var GovernanceType;
(function (GovernanceType) {
    GovernanceType["VOTING_ACCURACY"] = "voting_accuracy";
    GovernanceType["PROPOSAL_SUCCESS_RATE"] = "proposal_success_rate";
    GovernanceType["POLICY_IMPACT"] = "policy_impact";
    GovernanceType["DECISION_QUALITY"] = "decision_quality";
    GovernanceType["LEADERSHIP_EFFECTIVENESS"] = "leadership_effectiveness";
    GovernanceType["CONFLICT_RESOLUTION"] = "conflict_resolution";
})(GovernanceType || (exports.GovernanceType = GovernanceType = {}));
var SocialType;
(function (SocialType) {
    SocialType["MENTORING"] = "mentoring";
    SocialType["CONFLICT_RESOLUTION"] = "conflict_resolution";
    SocialType["POSITIVE_ENGAGEMENT"] = "positive_engagement";
    SocialType["COMMUNITY_HEALTH"] = "community_health";
    SocialType["NEWCOMER_SUPPORT"] = "newcomer_support";
    SocialType["TOXICITY_DETECTION"] = "toxicity_detection";
    SocialType["COLLABORATION"] = "collaboration";
})(SocialType || (exports.SocialType = SocialType = {}));
var EconomicType;
(function (EconomicType) {
    EconomicType["LONG_TERM_HOLDING"] = "long_term_holding";
    EconomicType["MARKET_STABILIZING"] = "market_stabilizing";
    EconomicType["LIQUIDITY_SUPPORT"] = "liquidity_support";
    EconomicType["SUSTAINABILITY_INDICATORS"] = "sustainability_indicators";
    EconomicType["WEALTH_DISTRIBUTION"] = "wealth_distribution";
    EconomicType["TOKEN_VELOCITY"] = "token_velocity";
    EconomicType["REWARD_EXTRACTION"] = "reward_extraction";
})(EconomicType || (exports.EconomicType = EconomicType = {}));
var PowerType;
(function (PowerType) {
    PowerType["REVENUE_SHARE"] = "revenue_share";
    PowerType["GOVERNANCE_RIGHT"] = "governance_right";
    PowerType["EARLY_ACCESS"] = "early_access";
    PowerType["MODERATION_POWER"] = "moderation_power";
    PowerType["SECURITY_BONUS"] = "security_bonus";
    PowerType["DIPLOMATIC_INFLUENCE"] = "diplomatic_influence";
    PowerType["MENTORSHIP_AUTHORITY"] = "mentorship_authority";
})(PowerType || (exports.PowerType = PowerType = {}));
var RevenueType;
(function (RevenueType) {
    RevenueType["ECOSYSTEM_GROWTH"] = "ecosystem_growth";
    RevenueType["TRANSACTION_FEES"] = "transaction_fees";
    RevenueType["PREMIUM_FEATURES"] = "premium_features";
    RevenueType["ADVERTISING"] = "advertising";
    RevenueType["SPONSORSHIP"] = "sponsorship";
    RevenueType["AFFILIATE_PROGRAMS"] = "affiliate_programs";
})(RevenueType || (exports.RevenueType = RevenueType = {}));
var AccessLevel;
(function (AccessLevel) {
    AccessLevel["BASIC"] = "basic";
    AccessLevel["PREMIUM"] = "premium";
    AccessLevel["EXCLUSIVE"] = "exclusive";
    AccessLevel["BETA"] = "beta";
    AccessLevel["ALPHA"] = "alpha";
    AccessLevel["FOUNDER"] = "founder";
})(AccessLevel || (exports.AccessLevel = AccessLevel = {}));
var HealthTrend;
(function (HealthTrend) {
    HealthTrend["IMPROVING"] = "improving";
    HealthTrend["STABLE"] = "stable";
    HealthTrend["DECLINING"] = "declining";
    HealthTrend["VOLATILE"] = "volatile";
    HealthTrend["CRITICAL"] = "critical";
    HealthTrend["RECOVERING"] = "recovering";
})(HealthTrend || (exports.HealthTrend = HealthTrend = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["EARNED"] = "earned";
    TransactionType["STAKED"] = "staked";
    TransactionType["BURNED"] = "burned";
    TransactionType["TRANSFERRED"] = "transferred";
    TransactionType["DECAYED"] = "decayed";
    TransactionType["CONFISCATED"] = "confiscated";
    TransactionType["REWARDED"] = "rewarded";
    TransactionType["PENALIZED"] = "penalized";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var SensorType;
(function (SensorType) {
    SensorType["PLAYER_INTERACTION"] = "player_interaction";
    SensorType["TRADE_FAIRNESS"] = "trade_fairness";
    SensorType["MENTORSHIP_PATTERN"] = "mentorship_pattern";
    SensorType["CONFLICT_FREQUENCY"] = "conflict_frequency";
    SensorType["ECONOMIC_ACTIVITY"] = "economic_activity";
    SensorType["GOVERNANCE_PARTICIPATION"] = "governance_participation";
    SensorType["SOCIAL_ENGAGEMENT"] = "social_engagement";
    SensorType["REPUTATION_FLOW"] = "reputation_flow";
})(SensorType || (exports.SensorType = SensorType = {}));
var ModelType;
(function (ModelType) {
    ModelType["LINEAR_REGRESSION"] = "linear_regression";
    ModelType["NEURAL_NETWORK"] = "neural_network";
    ModelType["RANDOM_FOREST"] = "random_forest";
    ModelType["TIME_SERIES"] = "time_series";
    ModelType["AGENT_BASED"] = "agent_based";
    ModelType["HYBRID"] = "hybrid";
    ModelType["ENSEMBLE"] = "ensemble";
})(ModelType || (exports.ModelType = ModelType = {}));
var OutputFormat;
(function (OutputFormat) {
    OutputFormat["NUMERICAL"] = "numerical";
    OutputFormat["CATEGORICAL"] = "categorical";
    OutputFormat["PROBABILITY"] = "probability";
    OutputFormat["TIME_SERIES"] = "time_series";
    OutputFormat["DISTRIBUTION"] = "distribution";
    OutputFormat["CONFIDENCE_INTERVAL"] = "confidence_interval";
})(OutputFormat || (exports.OutputFormat = OutputFormat = {}));
// This comprehensive Infinity Reputation Engine provides the mathematical and
// architectural foundation for a self-regulating digital civilization
// where reputation becomes the primary economic and governance force
//# sourceMappingURL=infinity-reputation-engine.js.map