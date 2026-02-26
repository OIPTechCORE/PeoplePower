"use strict";
// ========================================
// CIVILIZATION COMPARATIVE ANALYSIS
// Deep Research-Based Framework for Understanding Digital Societies
// ========================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactorRarity = exports.BenchmarkCategory = exports.PotentialValue = exports.RecommendationUrgency = exports.Priority = exports.RiskCategory = exports.TrendDirection = exports.MetricStatus = exports.VitalCategory = exports.HealthStatus = exports.FuturePotential = exports.TrendImpact = exports.PatternStatus = exports.PatternCategory = exports.FailureSeverity = exports.FailureType = exports.ImpactAssessment = exports.InsightSeverity = exports.RecommendationPriority = exports.RecommendationCategory = exports.InsightCategory = exports.FactorCategory = exports.CivilizationLayer = void 0;
// ========================================
// ENUMS FOR COMPARATIVE ANALYSIS
// ========================================
var CivilizationLayer;
(function (CivilizationLayer) {
    CivilizationLayer["FOUNDATION"] = "foundation";
    CivilizationLayer["ECONOMIC"] = "economic";
    CivilizationLayer["GOVERNANCE"] = "governance";
    CivilizationLayer["EDUCATIONAL"] = "educational";
    CivilizationLayer["SOCIAL_IDENTITY_CULTURE"] = "social_identity_culture";
    CivilizationLayer["TRUST_SECURITY_JUSTICE"] = "trust_security_justice";
    CivilizationLayer["INTEROPERABLE_NETWORK"] = "interoperable_network";
})(CivilizationLayer || (exports.CivilizationLayer = CivilizationLayer = {}));
var FactorCategory;
(function (FactorCategory) {
    FactorCategory["ECONOMIC"] = "economic";
    FactorCategory["GOVERNANCE"] = "governance";
    FactorCategory["SOCIAL"] = "social";
    FactorCategory["SECURITY"] = "security";
    FactorCategory["INNOVATION"] = "innovation";
    FactorCategory["EDUCATIONAL"] = "educational";
    FactorCategory["CULTURAL"] = "cultural";
    FactorCategory["SUSTAINABILITY"] = "sustainability";
    FactorCategory["TECHNOLOGICAL"] = "technological";
})(FactorCategory || (exports.FactorCategory = FactorCategory = {}));
var InsightCategory;
(function (InsightCategory) {
    InsightCategory["STRATEGIC"] = "strategic";
    InsightCategory["TACTICAL"] = "tactical";
    InsightCategory["OPERATIONAL"] = "operational";
    InsightCategory["WARNING"] = "warning";
    InsightCategory["CRITICAL"] = "critical";
    InsightCategory["OPPORTUNITY"] = "opportunity";
})(InsightCategory || (exports.InsightCategory = InsightCategory = {}));
var RecommendationCategory;
(function (RecommendationCategory) {
    RecommendationCategory["STRATEGIC"] = "strategic";
    RecommendationCategory["TACTICAL"] = "tactical";
    RecommendationCategory["OPERATIONAL"] = "operational";
    RecommendationCategory["URGENT"] = "urgent";
    RecommendationCategory["LONG_TERM"] = "long_term";
})(RecommendationCategory || (exports.RecommendationCategory = RecommendationCategory = {}));
var RecommendationPriority;
(function (RecommendationPriority) {
    RecommendationPriority["CRITICAL"] = "critical";
    RecommendationPriority["HIGH"] = "high";
    RecommendationPriority["MEDIUM"] = "medium";
    RecommendationPriority["LOW"] = "low";
    RecommendationPriority["INFORMATIONAL"] = "informational";
})(RecommendationPriority || (exports.RecommendationPriority = RecommendationPriority = {}));
var InsightSeverity;
(function (InsightSeverity) {
    InsightSeverity["LOW"] = "low";
    InsightSeverity["MEDIUM"] = "medium";
    InsightSeverity["HIGH"] = "high";
    InsightSeverity["CRITICAL"] = "critical";
})(InsightSeverity || (exports.InsightSeverity = InsightSeverity = {}));
var ImpactAssessment;
(function (ImpactAssessment) {
    ImpactAssessment["MINIMAL"] = "minimal";
    ImpactAssessment["LOW"] = "low";
    ImpactAssessment["MODERATE"] = "moderate";
    ImpactAssessment["SIGNIFICANT"] = "significant";
    ImpactAssessment["MAJOR"] = "major";
    ImpactAssessment["TRANSFORMATIONAL"] = "transformational";
})(ImpactAssessment || (exports.ImpactAssessment = ImpactAssessment = {}));
var FailureType;
(function (FailureType) {
    FailureType["ECONOMIC"] = "economic";
    FailureType["GOVERNANCE"] = "governance";
    FailureType["SOCIAL"] = "social";
    FailureType["SECURITY"] = "security";
    FailureType["TECHNICAL"] = "technical";
    FailureType["ENVIRONMENTAL"] = "environmental";
    FailureType["CULTURAL"] = "cultural";
    FailureType["EXTERNAL"] = "external";
    FailureType["SYSTEMIC"] = "systemic";
})(FailureType || (exports.FailureType = FailureType = {}));
var FailureSeverity;
(function (FailureSeverity) {
    FailureSeverity["WARNING"] = "warning";
    FailureSeverity["MODERATE"] = "moderate";
    FailureSeverity["SEVERE"] = "severe";
    FailureSeverity["CRITICAL"] = "critical";
    FailureSeverity["CATASTROPHIC"] = "catastrophic";
})(FailureSeverity || (exports.FailureSeverity = FailureSeverity = {}));
var PatternCategory;
(function (PatternCategory) {
    PatternCategory["ECONOMIC"] = "economic";
    PatternCategory["GOVERNANCE"] = "governance";
    PatternCategory["SOCIAL"] = "social";
    PatternCategory["TECHNOLOGICAL"] = "technological";
    PatternCategory["REGULATORY"] = "regulatory";
    PatternCategory["CULTURAL"] = "cultural";
    PatternCategory["SECURITY"] = "security";
    PatternCategory["INTEROPERABILITY"] = "interoperability";
})(PatternCategory || (exports.PatternCategory = PatternCategory = {}));
var PatternStatus;
(function (PatternStatus) {
    PatternStatus["EMERGING"] = "emerging";
    PatternStatus["GROWING"] = "growing";
    PatternStatus["MATURING"] = "maturing";
    PatternStatus["ESTABLISHED"] = "established";
    PatternStatus["DECLINING"] = "declining";
})(PatternStatus || (exports.PatternStatus = PatternStatus = {}));
var TrendImpact;
(function (TrendImpact) {
    TrendImpact["MINIMAL"] = "minimal";
    TrendImpact["LOW"] = "low";
    TrendImpact["MODERATE"] = "moderate";
    TrendImpact["SIGNIFICANT"] = "significant";
    TrendImpact["MAJOR"] = "major";
    TrendImpact["TRANSFORMATIONAL"] = "transformational";
})(TrendImpact || (exports.TrendImpact = TrendImpact = {}));
var FuturePotential;
(function (FuturePotential) {
    FuturePotential["LOW"] = "low";
    FuturePotential["MEDIUM"] = "medium";
    FuturePotential["HIGH"] = "high";
    FuturePotential["TRANSFORMATIONAL"] = "transformational";
})(FuturePotential || (exports.FuturePotential = FuturePotential = {}));
var HealthStatus;
(function (HealthStatus) {
    HealthStatus["HEALTHY"] = "healthy";
    HealthStatus["STABLE"] = "stable";
    HealthStatus["WARNING"] = "warning";
    HealthStatus["CRITICAL"] = "critical";
    HealthStatus["DECLINING"] = "declining";
    HealthStatus["RECOVERING"] = "recovering";
})(HealthStatus || (exports.HealthStatus = HealthStatus = {}));
var VitalCategory;
(function (VitalCategory) {
    VitalCategory["ECONOMIC"] = "economic";
    VitalCategory["GOVERNANCE"] = "governance";
    VitalCategory["SOCIAL"] = "social";
    VitalCategory["SECURITY"] = "security";
    VitalCategory["SUSTAINABILITY"] = "sustainability";
    VitalCategory["INNOVATION"] = "innovation";
    VitalCategory["CULTURAL"] = "cultural";
    VitalCategory["PARTICIPATION"] = "participation";
})(VitalCategory || (exports.VitalCategory = VitalCategory = {}));
var MetricStatus;
(function (MetricStatus) {
    MetricStatus["EXCELLENT"] = "excellent";
    MetricStatus["GOOD"] = "good";
    MetricStatus["SATISFACTORY"] = "satisfactory";
    MetricStatus["NEEDS_IMPROVEMENT"] = "needs_improvement";
    MetricStatus["POOR"] = "poor";
    MetricStatus["CRITICAL"] = "critical";
})(MetricStatus || (exports.MetricStatus = MetricStatus = {}));
var TrendDirection;
(function (TrendDirection) {
    TrendDirection["IMPROVING"] = "improving";
    TrendDirection["STABLE"] = "stable";
    TrendDirection["DECLINING"] = "declining";
    TrendDirection["VOLATILE"] = "volatile";
})(TrendDirection || (exports.TrendDirection = TrendDirection = {}));
var RiskCategory;
(function (RiskCategory) {
    RiskCategory["STRATEGIC"] = "strategic";
    RiskCategory["OPERATIONAL"] = "operational";
    RiskCategory["FINANCIAL"] = "financial";
    RiskCategory["SECURITY"] = "security";
    RiskCategory["COMPLIANCE"] = "compliance";
    RiskCategory["REPUTATIONAL"] = "reputational";
    RiskCategory["TECHNOLOGICAL"] = "technological";
    RiskCategory["ENVIRONMENTAL"] = "environmental";
    RiskCategory["SOCIAL"] = "social";
    RiskCategory["GOVERNANCE"] = "governance";
})(RiskCategory || (exports.RiskCategory = RiskCategory = {}));
var Priority;
(function (Priority) {
    Priority["CRITICAL"] = "critical";
    Priority["HIGH"] = "high";
    Priority["MEDIUM"] = "medium";
    Priority["LOW"] = "low";
    Priority["INFORMATIONAL"] = "informational";
})(Priority || (exports.Priority = Priority = {}));
var RecommendationUrgency;
(function (RecommendationUrgency) {
    RecommendationUrgency["IMMEDIATE"] = "immediate";
    RecommendationUrgency["URGENT"] = "urgent";
    RecommendationUrgency["HIGH"] = "high";
    RecommendationUrgency["MEDIUM"] = "medium";
    RecommendationUrgency["LOW"] = "low";
    RecommendationUrgency["ROUTINE"] = "routine";
})(RecommendationUrgency || (exports.RecommendationUrgency = RecommendationUrgency = {}));
var PotentialValue;
(function (PotentialValue) {
    PotentialValue["TRANSFORMATIONAL"] = "transformational";
    PotentialValue["SIGNIFICANT"] = "significant";
    PotentialValue["MODERATE"] = "moderate";
    PotentialValue["MINIMAL"] = "minimal";
    PotentialValue["UNKNOWN"] = "unknown";
})(PotentialValue || (exports.PotentialValue = PotentialValue = {}));
var BenchmarkCategory;
(function (BenchmarkCategory) {
    BenchmarkCategory["ECONOMIC"] = "economic";
    BenchmarkCategory["GOVERNANCE"] = "governance";
    BenchmarkCategory["SOCIAL"] = "social";
    BenchmarkCategory["SECURITY"] = "security";
    BenchmarkCategory["INNOVATION"] = "innovation";
    BenchmarkCategory["EDUCATIONAL"] = "educational";
    BenchmarkCategory["CULTURAL"] = "cultural";
    BenchmarkCategory["SUSTAINABILITY"] = "sustainability";
    BenchmarkCategory["TECHNOLOGICAL"] = "technological";
    BenchmarkCategory["INTEROPERABILITY"] = "interoperability";
    BenchmarkCategory["PARTICIPATION"] = "participation";
})(BenchmarkCategory || (exports.BenchmarkCategory = BenchmarkCategory = {}));
var FactorRarity;
(function (FactorRarity) {
    FactorRarity["COMMON"] = "common";
    FactorRarity["UNCOMMON"] = "uncommon";
    FactorRarity["RARE"] = "rare";
    FactorRarity["EPIC"] = "epic";
    FactorRarity["LEGENDARY"] = "legendary";
    FactorRarity["MYTHIC"] = "mythic";
})(FactorRarity || (exports.FactorRarity = FactorRarity = {}));
// This comprehensive framework enables deep analysis of digital civilizations
// comparing across multiple dimensions and identifying success/failure patterns
//# sourceMappingURL=civilization-comparative.js.map