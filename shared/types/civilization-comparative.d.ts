export interface CivilizationComparison {
    id: string;
    name: string;
    description: string;
    comparisonDate: Date;
    comparedCivilizations: ComparedCivilization[];
    framework: CivilizationFramework;
    metrics: ComparisonMetrics;
    insights: CivilizationInsight[];
    recommendations: ComparativeRecommendation[];
}
export interface ComparedCivilization {
    id: string;
    name: string;
    description: string;
    framework: CivilizationFramework;
    maturityLevel: number;
    totalCitizens: number;
    activeCitizens: number;
    economicMetrics: EconomicMetrics;
    governanceStructure: GovernanceStructure;
    socialCohesion: SocialCohesion;
    securityLevel: SecurityLevel;
    interoperabilityScore: number;
    sustainabilityScore: number;
    innovationIndex: number;
    culturalImpact: CulturalImpact;
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
}
export interface ComparisonMetrics {
    economicComplexity: number;
    economicStability: number;
    governanceEffectiveness: number;
    socialEngagement: number;
    securityRobustness: number;
    innovationCapacity: number;
    culturalRichness: number;
    sustainabilityIndex: number;
    adaptabilityScore: number;
    scalability: number;
}
export interface CivilizationInsight {
    category: InsightCategory;
    title: string;
    description: string;
    severity: InsightSeverity;
    evidence: Evidence[];
    impact: ImpactAssessment;
    recommendations: string[];
    confidence: number;
}
export interface ComparativeRecommendation {
    category: RecommendationCategory;
    priority: RecommendationPriority;
    title: string;
    description: string;
    rationale: string;
    implementation: ImplementationPlan;
    expectedImpact: ImpactAssessment;
    timeline: ImplementationTimeline;
    resources: ResourceRequirement[];
}
export interface SuccessfulCivilization {
    name: string;
    description: string;
    launchYear: number;
    currentMaturity: CivilizationLayer;
    totalUsers: number;
    activeUsers: number;
    economicMetrics: EconomicMetrics;
    keySuccessFactors: SuccessFactor[];
    governanceModel: GovernanceModel;
    socialStructure: SocialStructure;
    securityMeasures: SecurityMeasures[];
    innovationEcosystem: InnovationEcosystem;
    culturalElements: CulturalElement[];
    sustainabilityPractices: SustainabilityPractice[];
    lessonsLearned: CivilizationLesson[];
}
export interface SuccessFactor {
    category: FactorCategory;
    name: string;
    description: string;
    impact: number;
    implementation: string;
    evidence: string[];
}
export interface GovernanceModel {
    type: GovernanceType;
    description: string;
    implementation: string;
    effectiveness: number;
    participationRate: number;
    transparency: TransparencyLevel;
    accountability: Accountability;
}
export interface SocialStructure {
    type: SocialStructureType;
    description: string;
    implementation: string;
    engagement: SocialEngagement;
    governance: StructureGovernance;
}
export interface InnovationEcosystem {
    type: InnovationType;
    description: string;
    funding: InnovationFunding;
    collaboration: CollaborationModel;
    output: InnovationOutput;
    adoption: AdoptionMetrics;
}
export interface CulturalElement {
    type: CulturalElementType;
    description: string;
    implementation: string;
    participation: CulturalParticipation;
    preservation: PreservationMethod;
    evolution: CulturalEvolution;
}
export interface SustainabilityPractice {
    category: SustainabilityCategory;
    description: string;
    implementation: string;
    effectiveness: number;
    metrics: SustainabilityMetric[];
}
export interface CivilizationFailure {
    name: string;
    launchYear: number;
    collapseYear: number;
    totalUsers: number;
    maxUsers: number;
    failureCauses: FailureCause[];
    lessonsLearned: FailureLesson[];
    warningSigns: WarningSign[];
}
export interface FailureCause {
    type: FailureType;
    description: string;
    severity: FailureSeverity;
    timeline: string;
    preventable: boolean;
    earlyIndicators: string[];
}
export interface FailureLesson {
    category: LessonCategory;
    title: string;
    description: string;
    application: string;
    preventable: boolean;
    cost: number;
}
export interface WarningSign {
    type: WarningType;
    description: string;
    indicator: string;
    timeframe: string;
    severity: WarningSeverity;
}
export interface EmergingPattern {
    id: string;
    name: string;
    description: string;
    category: PatternCategory;
    firstObserved: Date;
    currentStatus: PatternStatus;
    adoptionRate: number;
    impact: TrendImpact;
    examples: string[];
    futurePotential: FuturePotential;
}
export interface TrendAnalysis {
    currentPatterns: EmergingPattern[];
    emergingTrends: EmergingTrend[];
    technologicalAdvances: TechnologicalAdvance[];
    regulatoryChanges: RegulatoryChange[];
    marketShifts: MarketShift[];
    socialChanges: SocialChange[];
}
export interface ComparativeFramework {
    id: string;
    name: string;
    description: string;
    version: string;
    comparisonMethodologies: ComparisonMethodology[];
    assessmentCriteria: AssessmentCriteria[];
    scoringSystem: ScoringSystem;
    benchmarkData: BenchmarkData[];
}
export interface ComparisonMethodology {
    id: string;
    name: string;
    description: string;
    approach: AssessmentApproach;
    dataSources: DataSource[];
    metrics: string[];
    limitations: string[];
}
export interface AssessmentCriteria {
    category: CriteriaCategory;
    name: string;
    description: string;
    weight: number;
    measurement: Measurement;
    thresholds: Threshold[];
}
export interface ScoringSystem {
    id: string;
    name: string;
    description: string;
    scoringMethod: ScoringMethod[];
    weights: ScoringWeight[];
    normalization: NormalizationMethod[];
}
export declare enum CivilizationLayer {
    FOUNDATION = "foundation",
    ECONOMIC = "economic",
    GOVERNANCE = "governance",
    EDUCATIONAL = "educational",
    SOCIAL_IDENTITY_CULTURE = "social_identity_culture",
    TRUST_SECURITY_JUSTICE = "trust_security_justice",
    INTEROPERABLE_NETWORK = "interoperable_network"
}
export declare enum FactorCategory {
    ECONOMIC = "economic",
    GOVERNANCE = "governance",
    SOCIAL = "social",
    SECURITY = "security",
    INNOVATION = "innovation",
    EDUCATIONAL = "educational",
    CULTURAL = "cultural",
    SUSTAINABILITY = "sustainability",
    TECHNOLOGICAL = "technological"
}
export declare enum InsightCategory {
    STRATEGIC = "strategic",
    TACTICAL = "tactical",
    OPERATIONAL = "operational",
    WARNING = "warning",
    CRITICAL = "critical",
    OPPORTUNITY = "opportunity"
}
export declare enum RecommendationCategory {
    STRATEGIC = "strategic",
    TACTICAL = "tactical",
    OPERATIONAL = "operational",
    URGENT = "urgent",
    LONG_TERM = "long_term"
}
export declare enum RecommendationPriority {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    INFORMATIONAL = "informational"
}
export declare enum InsightSeverity {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
export declare enum ImpactAssessment {
    MINIMAL = "minimal",
    LOW = "low",
    MODERATE = "moderate",
    SIGNIFICANT = "significant",
    MAJOR = "major",
    TRANSFORMATIONAL = "transformational"
}
export declare enum FailureType {
    ECONOMIC = "economic",
    GOVERNANCE = "governance",
    SOCIAL = "social",
    SECURITY = "security",
    TECHNICAL = "technical",
    ENVIRONMENTAL = "environmental",
    CULTURAL = "cultural",
    EXTERNAL = "external",
    SYSTEMIC = "systemic"
}
export declare enum FailureSeverity {
    WARNING = "warning",
    MODERATE = "moderate",
    SEVERE = "severe",
    CRITICAL = "critical",
    CATASTROPHIC = "catastrophic"
}
export declare enum PatternCategory {
    ECONOMIC = "economic",
    GOVERNANCE = "governance",
    SOCIAL = "social",
    TECHNOLOGICAL = "technological",
    REGULATORY = "regulatory",
    CULTURAL = "cultural",
    SECURITY = "security",
    INTEROPERABILITY = "interoperability"
}
export declare enum PatternStatus {
    EMERGING = "emerging",
    GROWING = "growing",
    MATURING = "maturing",
    ESTABLISHED = "established",
    DECLINING = "declining"
}
export declare enum TrendImpact {
    MINIMAL = "minimal",
    LOW = "low",
    MODERATE = "moderate",
    SIGNIFICANT = "significant",
    MAJOR = "major",
    TRANSFORMATIONAL = "transformational"
}
export declare enum FuturePotential {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    TRANSFORMATIONAL = "transformational"
}
export interface SuccessFactorAnalysis {
    commonFactors: CommonSuccessFactor[];
    uniqueFactors: UniqueSuccessFactor[];
    criticalSuccessFactors: CriticalSuccessFactor[];
    contextualFactors: ContextualSuccessFactor[];
    temporalFactors: TemporalSuccessFactor[];
}
export interface CommonSuccessFactor {
    name: string;
    description: string;
    frequency: number;
    impact: number;
    examples: string[];
    implementation: string;
}
export interface UniqueSuccessFactor {
    name: string;
    description: string;
    rarity: FactorRarity;
    impact: number;
    examples: string[];
    implementation: string[];
}
export interface CriticalSuccessFactor {
    name: string;
    description: string;
    makeOrBreak: string;
    examples: string[];
    implementation: string[];
    alternatives: string[];
}
export interface CivilizationHealth {
    overall: HealthStatus;
    vitals: VitalMetric[];
    risks: RiskAssessment[];
    opportunities: Opportunity[];
    trends: TrendAnalysis;
    recommendations: HealthRecommendation[];
}
export interface VitalMetric {
    category: VitalCategory;
    name: string;
    value: number;
    status: MetricStatus;
    trend: TrendDirection;
    threshold: number;
    lastUpdated: Date;
}
export interface RiskAssessment {
    category: RiskCategory;
    severity: RiskSeverity;
    description: string;
    probability: number;
    impact: ImpactAssessment;
    mitigation: MitigationStrategy[];
    timeline: RiskTimeline;
}
export interface Opportunity {
    category: OpportunityCategory;
    title: string;
    description: string;
    potential: PotentialValue;
    requirements: Requirement[];
    timeline: OpportunityTimeline;
    priority: Priority;
}
export interface HealthRecommendation {
    category: RecommendationCategory;
    priority: RecommendationPriority;
    title: string;
    description: string;
    urgency: RecommendationUrgency;
    implementation: ImplementationPlan;
    expectedBenefit: ExpectedBenefit;
    resourceRequirements: ResourceRequirement[];
}
export declare enum HealthStatus {
    HEALTHY = "healthy",
    STABLE = "stable",
    WARNING = "warning",
    CRITICAL = "critical",
    DECLINING = "declining",
    RECOVERING = "recovering"
}
export declare enum VitalCategory {
    ECONOMIC = "economic",
    GOVERNANCE = "governance",
    SOCIAL = "social",
    SECURITY = "security",
    SUSTAINABILITY = "sustainability",
    INNOVATION = "innovation",
    CULTURAL = "cultural",
    PARTICIPATION = "participation"
}
export declare enum MetricStatus {
    EXCELLENT = "excellent",
    GOOD = "good",
    SATISFACTORY = "satisfactory",
    NEEDS_IMPROVEMENT = "needs_improvement",
    POOR = "poor",
    CRITICAL = "critical"
}
export declare enum TrendDirection {
    IMPROVING = "improving",
    STABLE = "stable",
    DECLINING = "declining",
    VOLATILE = "volatile"
}
export declare enum RiskCategory {
    STRATEGIC = "strategic",
    OPERATIONAL = "operational",
    FINANCIAL = "financial",
    SECURITY = "security",
    COMPLIANCE = "compliance",
    REPUTATIONAL = "reputational",
    TECHNOLOGICAL = "technological",
    ENVIRONMENTAL = "environmental",
    SOCIAL = "social",
    GOVERNANCE = "governance"
}
export declare enum Priority {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    INFORMATIONAL = "informational"
}
export declare enum RecommendationUrgency {
    IMMEDIATE = "immediate",
    URGENT = "urgent",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    ROUTINE = "routine"
}
export declare enum PotentialValue {
    TRANSFORMATIONAL = "transformational",
    SIGNIFICANT = "significant",
    MODERATE = "moderate",
    MINIMAL = "minimal",
    UNKNOWN = "unknown"
}
export interface BenchmarkData {
    id: string;
    name: string;
    source: string;
    category: BenchmarkCategory;
    metrics: BenchmarkMetric[];
    methodology: string;
    collectionDate: Date;
    validityPeriod: string;
    comparators: string[];
}
export interface BenchmarkMetric {
    name: string;
    value: number;
    unit: string;
    description: string;
    calculation: string;
    context: string;
}
export declare enum BenchmarkCategory {
    ECONOMIC = "economic",
    GOVERNANCE = "governance",
    SOCIAL = "social",
    SECURITY = "security",
    INNOVATION = "innovation",
    EDUCATIONAL = "educational",
    CULTURAL = "cultural",
    SUSTAINABILITY = "sustainability",
    TECHNOLOGICAL = "technological",
    INTEROPERABILITY = "interoperability",
    PARTICIPATION = "participation"
}
export declare enum FactorRarity {
    COMMON = "common",
    UNCOMMON = "uncommon",
    RARE = "rare",
    EPIC = "epic",
    LEGENDARY = "legendary",
    MYTHIC = "mythic"
}
export interface CivilizationAnalysisSuite {
    framework: ComparativeFramework;
    successFactors: SuccessFactorAnalysis;
    failurePatterns: FailurePattern[];
    emergingTrends: TrendAnalysis;
    benchmarkData: BenchmarkData[];
    healthMonitoring: CivilizationHealth;
    predictiveAnalytics: PredictiveAnalytics;
    reportingTools: ReportingTool[];
}
export interface PredictiveAnalytics {
    models: PredictiveModel[];
    scenarios: Scenario[];
    forecasts: Forecast[];
    riskAssessment: RiskAssessment[];
    recommendations: PredictiveRecommendation[];
}
export interface PredictiveModel {
    id: string;
    name: string;
    type: ModelType;
    accuracy: number;
    parameters: ModelParameter[];
    trainingData: TrainingData[];
    validation: ValidationMetric[];
    lastUpdated: Date;
}
export interface Scenario {
    id: string;
    name: string;
    description: string;
    parameters: ScenarioParameter[];
    outcomes: ScenarioOutcome[];
    probability: number;
    confidence: number;
}
export interface Forecast {
    id: string;
    type: ForecastType;
    timeframe: string;
    predictions: Prediction[];
    confidence: number;
    generatedAt: Date;
    actuals: ActualResult[];
}
export interface CivilizationEvolution {
    currentPhase: EvolutionPhase;
    phaseProgress: PhaseProgress[];
    transitionReadiness: TransitionReadiness;
    adaptiveCapabilities: AdaptiveCapability[];
    resilienceFactors: ResilienceFactor[];
    futureScenarios: FutureScenario[];
}
export interface PhaseProgress {
    phase: EvolutionPhase;
    progress: number;
    milestones: PhaseMilestone[];
    blockers: Blocker[];
    achievements: Achievement[];
    nextSteps: NextStep[];
}
export interface AdaptiveCapability {
    name: string;
    description: string;
    currentLevel: number;
    maxLevel: number;
    implementation: string;
    benefits: string[];
}
export interface ResilienceFactor {
    category: ResilienceCategory;
    name: string;
    description: string;
    strength: number;
    implementation: string;
    examples: string[];
}
//# sourceMappingURL=civilization-comparative.d.ts.map