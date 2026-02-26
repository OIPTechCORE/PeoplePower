export interface InfinityReputationEngine {
    id: string;
    name: string;
    description: string;
    version: string;
    reputationLayers: ReputationLayer[];
    reputationPhysics: ReputationPhysicsLayer;
    reputationAIBrain: ReputationAIBrain;
    badgeEconomicPower: BadgeEconomicPower;
    governancePower: GovernancePower;
    reputationMarkets: ReputationMarket[];
    soulboundCivilizationId: SoulboundCivilizationId;
    antiExploitArchitecture: AntiExploitArchitecture;
    createdAt: Date;
    updatedAt: Date;
}
export interface ReputationLayer {
    id: string;
    name: string;
    description: string;
    type: ReputationType;
    measurementMethod: MeasurementMethod;
    calculationFormula: string;
    weight: number;
    decayFunction: DecayFunction;
    socialValidation: SocialValidation;
    economicImpact: EconomicImpact;
    createdAt: Date;
}
export interface ReputationPhysicsLayer {
    id: string;
    name: string;
    description: string;
    laws: PhysicsLaw[];
    masterEquation: MasterEquation;
    parameters: PhysicsParameter[];
    simulationEngine: SimulationEngine;
    stabilityMetrics: StabilityMetric[];
    crisisPrevention: CrisisPrevention[];
}
export interface ReputationAIBrain {
    id: string;
    name: string;
    description: string;
    architecture: AIBrainArchitecture;
    observationLayer: ObservationLayer;
    understandingLayer: UnderstandingLayer;
    predictionEngine: PredictionEngine;
    interventionEngine: InterventionEngine;
    learningLoop: LearningLoop[];
    ethicalConstraints: EthicalConstraint[];
    createdAt: Date;
}
export interface BadgeEconomicPower {
    id: string;
    name: string;
    description: string;
    badgeTypes: BadgeEconomicType[];
    economicMultipliers: EconomicMultiplier[];
    earningMechanics: EarningMechanic[];
    authorityLevels: AuthorityLevel[];
    evolutionSystem: BadgeEvolutionSystem;
    reputationCosts: ReputationCost[];
}
export interface GovernancePower {
    id: string;
    name: string;
    description: string;
    votingSystem: VotingSystem;
    votingPower: VotingPower;
    decisionMaking: DecisionMaking;
    antiManipulation: AntiManipulation[];
    meritocraticPrinciples: MeritocraticPrinciple[];
    crisisManagement: CrisisManagement[];
}
export interface ReputationMarket {
    id: string;
    name: string;
    description: string;
    marketType: MarketType;
    participants: MarketParticipant[];
    instruments: MarketInstrument[];
    pricingMechanism: PricingMechanism;
    riskManagement: RiskManagement[];
    settlementSystem: SettlementSystem[];
}
export interface SoulboundCivilizationId {
    id: string;
    name: string;
    description: string;
    identityComponents: IdentityComponent[];
    nonTransferableAssets: NonTransferableAsset[];
    crossGamePersistence: CrossGamePersistence[];
    historicalRecord: HistoricalRecord[];
    sacredProperties: SacredProperty[];
}
export interface AntiExploitArchitecture {
    id: string;
    name: string;
    description: string;
    behaviorProof: BehaviorProof[];
    reputationCost: ReputationCostSystem;
    antiCollusion: AntiCollusion[];
    antiFarming: AntiFarming[];
    reputationRisk: ReputationRisk[];
    protectiveMechanisms: ProtectiveMechanism[];
}
export interface ContributionReputation extends ReputationLayer {
    type: ReputationType.CONTRIBUTION;
    measurementMetrics: ContributionMetric[];
    valueCalculation: ValueCalculation;
    weight: number;
    decayRate: number;
    socialValidation: SocialValidation;
}
export interface TrustReputation extends ReputationLayer {
    type: ReputationType.TRUST;
    measurementMetrics: TrustMetric[];
    verificationMethods: VerificationMethod[];
    honestyIndicators: HonestyIndicator[];
    fairnessMetrics: FairnessMetric[];
    decayRate: number;
}
export interface GovernanceReputation extends ReputationLayer {
    type: ReputationType.GOVERNANCE;
    measurementMetrics: GovernanceMetric[];
    wisdomIndicators: WisdomIndicator[];
    votingAccuracy: VotingAccuracy;
    proposalSuccessRate: ProposalSuccessRate;
    policyImpact: PolicyImpact[];
}
export interface SocialReputation extends ReputationLayer {
    type: ReputationType.SOCIAL;
    measurementMetrics: SocialMetric[];
    mentoringMetrics: MentoringMetric[];
    conflictResolution: ConflictResolution[];
    positiveEngagement: PositiveEngagement[];
    communityHealth: CommunityHealth[];
}
export interface EconomicReputation extends ReputationLayer {
    type: ReputationType.ECONOMIC;
    measurementMetrics: EconomicMetric[];
    longTermHolding: LongTermHolding;
    marketStabilizing: MarketStabilizing[];
    liquiditySupport: LiquiditySupport[];
    sustainabilityIndicators: SustainabilityIndicator[];
}
export interface BadgeEconomicType {
    id: string;
    name: string;
    description: string;
    category: BadgeCategory;
    unlockedPowers: UnlockedPower[];
    revenueSharing: RevenueSharing[];
    earlyFeatureAccess: EarlyFeatureAccess[];
    economicRights: EconomicRight[];
}
export interface EconomicMultiplier {
    id: string;
    name: string;
    description: string;
    baseReward: number;
    multiplierFormula: string;
    reputationThreshold: number;
    civilizationHealthIndex: number;
    finalReward: number;
    conditions: MultiplierCondition[];
}
export interface EarningMechanic {
    id: string;
    name: string;
    description: string;
    mechanism: MechanismType;
    reputationRequirement: number;
    earningRate: number;
    riskFactors: RiskFactor[];
    sustainability: Sustainability;
}
export interface AuthorityLevel {
    id: string;
    name: string;
    description: string;
    level: number;
    requiredReputation: number;
    governanceRights: GovernanceRight[];
    economicPrivileges: EconomicPrivilege[];
    socialObligations: SocialObligation[];
}
export interface PhysicsLaw {
    id: string;
    name: string;
    description: string;
    formula: string;
    parameters: PhysicsParameter[];
    purpose: LawPurpose;
    enforcement: LawEnforcement;
    exceptions: LawException[];
}
export interface MasterEquation {
    id: string;
    name: string;
    description: string;
    formula: string;
    variables: EquationVariable[];
    coefficients: EquationCoefficient[];
    constraints: EquationConstraint[];
    output: EquationOutput;
}
export interface SimulationEngine {
    id: string;
    name: string;
    description: string;
    simulationType: SimulationType;
    timeHorizon: number;
    accuracy: number;
    scenarios: SimulationScenario[];
    results: SimulationResult[];
}
export interface StabilityMetric {
    id: string;
    name: string;
    description: string;
    metric: string;
    threshold: number;
    weight: number;
    calculation: string;
    trendAnalysis: TrendAnalysis;
}
export interface CrisisPrevention {
    id: string;
    name: string;
    description: string;
    triggerConditions: TriggerCondition[];
    preventionMechanisms: PreventionMechanism[];
    severity: CrisisSeverity;
    responseTime: number;
}
export interface AIBrainArchitecture {
    id: string;
    name: string;
    description: string;
    subsystems: AISubsystem[];
    dataFlow: DataFlow[];
    decisionHierarchy: DecisionHierarchy[];
    learningAlgorithms: LearningAlgorithm[];
    ethicalFramework: EthicalFramework[];
}
export interface ObservationLayer {
    id: string;
    name: string;
    description: string;
    sensors: CivilizationSensor[];
    dataCollection: DataCollection[];
    signalProcessing: SignalProcessing[];
    anomalyDetection: AnomalyDetection[];
    realTimeMonitoring: RealTimeMonitoring[];
}
export interface UnderstandingLayer {
    id: string;
    name: string;
    description: string;
    models: CivilizationModel[];
    patternRecognition: PatternRecognition[];
    socialDynamics: SocialDynamics[];
    economicAnalysis: EconomicAnalysis[];
    governanceAnalysis: GovernanceAnalysis[];
}
export interface PredictionEngine {
    id: string;
    name: string;
    description: string;
    predictionModels: PredictionModel[];
    timeHorizons: TimeHorizon[];
    confidenceIntervals: ConfidenceInterval[];
    scenarioPlanning: ScenarioPlanning[];
    riskAssessment: RiskAssessment[];
}
export interface InterventionEngine {
    id: string;
    name: string;
    description: string;
    interventionTypes: InterventionType[];
    automaticAdjustments: AutomaticAdjustment[];
    manualOverrides: ManualOverride[];
    interventionHistory: InterventionHistory[];
    effectivenessMetrics: EffectivenessMetric[];
}
export declare enum ReputationType {
    CONTRIBUTION = "contribution",
    TRUST = "trust",
    GOVERNANCE = "governance",
    SOCIAL = "social",
    ECONOMIC = "economic"
}
export declare enum MeasurementMethod {
    AUTOMATIC = "automatic",
    PEER_VALIDATION = "peer_validation",
    AI_ANALYSIS = "ai_analysis",
    COMMUNITY_VOTE = "community_vote",
    HYBRID = "hybrid"
}
export declare enum DecayFunction {
    LINEAR = "linear",
    EXPONENTIAL = "exponential",
    LOGARITHMIC = "logarithmic",
    STEP_FUNCTION = "step_function",
    SIGMOID = "sigmoid",
    CUSTOM = "custom"
}
export declare enum SocialValidation {
    PEER_REVIEW = "peer_review",
    COMMUNITY_VALIDATION = "community_validation",
    EXPERT_VALIDATION = "expert_validation",
    STAKEHOLDER_VALIDATION = "stakeholder_validation",
    CONSENSUS_VALIDATION = "consensus_validation"
}
export declare enum BadgeCategory {
    BUILDER = "builder",
    GUARDIAN = "guardian",
    SCHOLAR = "scholar",
    SENTINEL = "sentinel",
    DIPLOMAT = "diplomat"
}
export declare enum MechanismType {
    DIRECT_EARNING = "direct_earning",
    REVENUE_SHARING = "revenue_sharing",
    TEACHING_INCOME = "teaching_income",
    GOVERNANCE_REWARDS = "governance_rewards",
    SECURITY_BONUSES = "security_bonuses",
    DIPLOMATIC_BENEFITS = "diplomatic_benefits"
}
export declare enum Sustainability {
    HIGHLY_SUSTAINABLE = "highly_sustainable",
    SUSTAINABLE = "sustainable",
    MODERATELY_SUSTAINABLE = "moderately_sustainable",
    UNSUSTAINABLE = "unsustainable",
    HIGHLY_UNSUSTAINABLE = "highly_unsustainable"
}
export declare enum LawPurpose {
    CONSERVATION = "conservation",
    ENTROPY = "entropy",
    DIMINISHING_RETURNS = "diminishing_returns",
    SOCIAL_VALIDATION_ENERGY = "social_validation_energy",
    RISK_PRINCIPLE = "risk_principle",
    REPUTATION_RECYCLING = "reputation_recycling",
    MULTI_DIMENSIONAL_BALANCE = "multi_dimensional_balance",
    TIME_WEIGHTED_LEGACY = "time_weighted_legacy",
    CIVILIZATION_HEALTH_COUPLING = "civilization_health_coupling",
    GRAVITATIONAL_ATTRACTOR = "gravitational_attractor",
    ANTI_COLLUSION_PHYSICS = "anti_collusion_physics",
    REPUTATION_HALVING = "reputation_halving",
    MASTER_EQUATION = "master_equation"
}
export declare enum SimulationType {
    ECONOMIC = "economic",
    SOCIAL = "social",
    GOVERNANCE = "governance",
    REPUTATION = "reputation",
    CRISIS = "crisis",
    GROWTH = "growth",
    STABILITY = "stability"
}
export declare enum CrisisSeverity {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical",
    CATASTROPHIC = "catastrophic"
}
export declare enum AISubsystem {
    OBSERVATION = "observation",
    UNDERSTANDING = "understanding",
    PREDICTION = "prediction",
    INTERVENTION = "intervention",
    LEARNING = "learning",
    ETHICS = "ethics",
    COORDINATION = "coordination"
}
export declare enum InterventionType {
    AUTOMATIC_ADJUSTMENT = "automatic_adjustment",
    PARAMETER_TUNING = "parameter_tuning",
    EMERGENCY_INTERVENTION = "emergency_intervention",
    GOVERNANCE_OVERRIDE = "governance_override",
    ECONOMIC_STIMULUS = "economic_stimulus",
    SOCIAL_INTERVENTION = "social_intervention",
    REPUTATION_RESET = "reputation_reset"
}
export declare enum MarketType {
    REPUTATION_BACKING = "reputation_backing",
    SPONSORSHIP_MARKET = "sponsorship_market",
    GUILD_CREDIBILITY = "guild_credibility",
    RISK_POOLING = "risk_pooling",
    FUTURES_MARKET = "futures_market",
    INSURANCE_MARKET = "insurance_market"
}
export interface ContributionMetric {
    type: ContributionType;
    weight: number;
    measurement: string;
    validation: string;
}
export interface TrustMetric {
    type: TrustType;
    measurement: string;
    verification: string;
    weight: number;
}
export interface GovernanceMetric {
    type: GovernanceType;
    measurement: string;
    weight: number;
    impact: string;
}
export interface SocialMetric {
    type: SocialType;
    measurement: string;
    weight: number;
    validation: string;
}
export interface EconomicMetric {
    type: EconomicType;
    measurement: string;
    weight: number;
    sustainability: Sustainability;
}
export interface UnlockedPower {
    type: PowerType;
    description: string;
    mechanism: string;
    value: number;
    duration: number;
    conditions: PowerCondition[];
}
export interface RevenueSharing {
    type: RevenueType;
    percentage: number;
    calculation: string;
    distribution: Distribution[];
    conditions: RevenueCondition[];
}
export interface EarlyFeatureAccess {
    feature: string;
    description: string;
    accessLevel: AccessLevel;
    betaTesting: boolean;
    exclusive: boolean;
}
export interface PhysicsParameter {
    name: string;
    value: number;
    unit: string;
    description: string;
    range: ParameterRange;
}
export interface EquationVariable {
    name: string;
    symbol: string;
    description: string;
    domain: string;
    range: VariableRange;
}
export interface CivilizationSensor {
    type: SensorType;
    description: string;
    dataPoints: string[];
    frequency: number;
    accuracy: number;
}
export interface PredictionModel {
    name: string;
    type: ModelType;
    accuracy: number;
    complexity: number;
    dataRequirements: DataRequirement[];
    outputFormat: OutputFormat;
}
export interface InterventionHistory {
    id: string;
    type: InterventionType;
    timestamp: Date;
    reason: string;
    parameters: any;
    outcome: string;
    effectiveness: number;
    duration: number;
}
export interface ReputationCalculation {
    contributionRep: number;
    trustRep: number;
    governanceRep: number;
    socialRep: number;
    economicRep: number;
    effectiveReputation: number;
    calculationTimestamp: Date;
}
export interface ReputationTransaction {
    id: string;
    playerId: string;
    type: TransactionType;
    amount: number;
    reason: string;
    timestamp: Date;
    metadata: any;
    decayRate: number;
    expiresAt?: Date;
}
export interface ReputationStake {
    id: string;
    stakerId: string;
    stakeeId: string;
    amount: number;
    duration: number;
    conditions: StakeCondition[];
    rewards: StakeReward[];
    riskFactors: StakeRisk[];
    createdAt: Date;
    expiresAt: Date;
}
export interface ReputationHalving {
    id: string;
    halvingNumber: number;
    timestamp: Date;
    newIssuanceRate: number;
    reason: string;
    expectedImpact: string;
    actualImpact: string;
    effectiveness: number;
}
export interface CivilizationHealthIndex {
    overall: number;
    economic: number;
    social: number;
    governance: number;
    reputation: number;
    growth: number;
    stability: number;
    calculatedAt: Date;
    trend: HealthTrend;
}
export interface ReputationInflation {
    rate: number;
    cause: string;
    detection: string;
    intervention: string;
    effectiveness: number;
    resolvedAt?: Date;
}
export interface ReputationDeflation {
    rate: number;
    cause: string;
    impact: string;
    intervention: string;
    effectiveness: number;
    resolvedAt?: Date;
}
export declare enum ContributionType {
    MISSION_COMPLETION = "mission_completion",
    TEACHING = "teaching",
    BUILDING_TOOLS = "building_tools",
    REPORTING_BUGS = "reporting_bugs",
    CREATING_CONTENT = "creating_content",
    MENTORING = "mentoring",
    INNOVATION = "innovation",
    RESEARCH = "research",
    GOVERNANCE_PARTICIPATION = "governance_participation"
}
export declare enum TrustType {
    NO_SCAMS = "no_scams",
    FAIR_TRADES = "fair_trades",
    VERIFIED_TRANSACTIONS = "verified_transactions",
    DISPUTE_OUTCOMES = "dispute_outcomes",
    TRANSACTION_HISTORY = "transaction_history",
    PEER_VALIDATION = "peer_validation"
}
export declare enum GovernanceType {
    VOTING_ACCURACY = "voting_accuracy",
    PROPOSAL_SUCCESS_RATE = "proposal_success_rate",
    POLICY_IMPACT = "policy_impact",
    DECISION_QUALITY = "decision_quality",
    LEADERSHIP_EFFECTIVENESS = "leadership_effectiveness",
    CONFLICT_RESOLUTION = "conflict_resolution"
}
export declare enum SocialType {
    MENTORING = "mentoring",
    CONFLICT_RESOLUTION = "conflict_resolution",
    POSITIVE_ENGAGEMENT = "positive_engagement",
    COMMUNITY_HEALTH = "community_health",
    NEWCOMER_SUPPORT = "newcomer_support",
    TOXICITY_DETECTION = "toxicity_detection",
    COLLABORATION = "collaboration"
}
export declare enum EconomicType {
    LONG_TERM_HOLDING = "long_term_holding",
    MARKET_STABILIZING = "market_stabilizing",
    LIQUIDITY_SUPPORT = "liquidity_support",
    SUSTAINABILITY_INDICATORS = "sustainability_indicators",
    WEALTH_DISTRIBUTION = "wealth_distribution",
    TOKEN_VELOCITY = "token_velocity",
    REWARD_EXTRACTION = "reward_extraction"
}
export declare enum PowerType {
    REVENUE_SHARE = "revenue_share",
    GOVERNANCE_RIGHT = "governance_right",
    EARLY_ACCESS = "early_access",
    MODERATION_POWER = "moderation_power",
    SECURITY_BONUS = "security_bonus",
    DIPLOMATIC_INFLUENCE = "diplomatic_influence",
    MENTORSHIP_AUTHORITY = "mentorship_authority"
}
export declare enum RevenueType {
    ECOSYSTEM_GROWTH = "ecosystem_growth",
    TRANSACTION_FEES = "transaction_fees",
    PREMIUM_FEATURES = "premium_features",
    ADVERTISING = "advertising",
    SPONSORSHIP = "sponsorship",
    AFFILIATE_PROGRAMS = "affiliate_programs"
}
export declare enum AccessLevel {
    BASIC = "basic",
    PREMIUM = "premium",
    EXCLUSIVE = "exclusive",
    BETA = "beta",
    ALPHA = "alpha",
    FOUNDER = "founder"
}
export declare enum HealthTrend {
    IMPROVING = "improving",
    STABLE = "stable",
    DECLINING = "declining",
    VOLATILE = "volatile",
    CRITICAL = "critical",
    RECOVERING = "recovering"
}
export declare enum TransactionType {
    EARNED = "earned",
    STAKED = "staked",
    BURNED = "burned",
    TRANSFERRED = "transferred",
    DECAYED = "decayed",
    CONFISCATED = "confiscated",
    REWARDED = "rewarded",
    PENALIZED = "penalized"
}
export declare enum SensorType {
    PLAYER_INTERACTION = "player_interaction",
    TRADE_FAIRNESS = "trade_fairness",
    MENTORSHIP_PATTERN = "mentorship_pattern",
    CONFLICT_FREQUENCY = "conflict_frequency",
    ECONOMIC_ACTIVITY = "economic_activity",
    GOVERNANCE_PARTICIPATION = "governance_participation",
    SOCIAL_ENGAGEMENT = "social_engagement",
    REPUTATION_FLOW = "reputation_flow"
}
export declare enum ModelType {
    LINEAR_REGRESSION = "linear_regression",
    NEURAL_NETWORK = "neural_network",
    RANDOM_FOREST = "random_forest",
    TIME_SERIES = "time_series",
    AGENT_BASED = "agent_based",
    HYBRID = "hybrid",
    ENSEMBLE = "ensemble"
}
export declare enum OutputFormat {
    NUMERICAL = "numerical",
    CATEGORICAL = "categorical",
    PROBABILITY = "probability",
    TIME_SERIES = "time_series",
    DISTRIBUTION = "distribution",
    CONFIDENCE_INTERVAL = "confidence_interval"
}
//# sourceMappingURL=infinity-reputation-engine.d.ts.map