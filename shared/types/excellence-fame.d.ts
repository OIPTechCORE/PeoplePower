export interface PeoplePowerCenterOfExcellence {
    id: string;
    name: string;
    description: string;
    establishedAt: Date;
    totalAcademies: number;
    totalGraduates: number;
    activeStudents: number;
    innovationLabs: InnovationLab[];
    aiMentorshipSystem: AIMentorshipSystem;
    universityIntegration: UniversityIntegration;
    economicImpact: EconomicImpact;
    reputationEconomy: ReputationEconomy;
}
export interface PeoplePowerWallOfFame {
    id: string;
    name: string;
    description: string;
    establishedAt: Date;
    totalHonored: number;
    achievementHall: AchievementHall;
    legacyCategories: LegacyCategory[];
    soulboundReputationNFTs: SoulboundReputationNFT[];
    livingHistoryTimeline: LivingHistoryTimeline;
    civilizationRankSystem: CivilizationRankSystem;
}
export interface Academy {
    id: string;
    name: string;
    type: AcademyType;
    description: string;
    requirements: AcademyRequirement[];
    rewards: AcademyReward[];
    courses: AcademyCourse[];
    graduates: number;
    activeStudents: number;
    successRate: number;
    establishedAt: Date;
}
export interface InnovationLab {
    id: string;
    name: string;
    description: string;
    focusArea: InnovationFocusArea;
    playerSubmissions: PlayerSubmission[];
    approvedInnovations: ApprovedInnovation[];
    revenueSharing: RevenueSharing;
    isActive: boolean;
    establishedAt: Date;
}
export interface AIMentorshipSystem {
    id: string;
    name: string;
    description: string;
    aiCoaches: AICoach[];
    skillPaths: SkillPath[];
    personalizedMissions: PersonalizedMission[];
    earningConnections: EarningConnection[];
    playerProgress: PlayerMentorshipProgress[];
}
export interface UniversityIntegration {
    id: string;
    currentLevel: UniversityLevel;
    requiredCredits: number;
    earnedCredits: number;
    unlockedPrivileges: UnlockedPrivilege[];
    nextMilestone: Milestone;
    graduationPath: GraduationPath;
}
export interface EconomicImpact {
    skillBasedEarning: SkillBasedEarning;
    longTermEngagement: LongTermEngagement;
    realDigitalWorkforce: RealDigitalWorkforce;
    tokenUtility: TokenUtility;
}
export interface ReputationEconomy {
    identityAsCurrency: boolean;
    reputationScore: number;
    reputationDNA: ReputationDNA;
    nonTransferableAssets: NonTransferableAsset[];
    economicPrivileges: EconomicPrivilege[];
    trustBasedMarketplace: TrustBasedMarketplace;
}
export interface AchievementHall {
    id: string;
    name: string;
    category: HallCategory;
    honoredMembers: HonoredMember[];
    recognitionCriteria: RecognitionCriteria;
    displayFormat: DisplayFormat;
    updatedFrequency: string;
}
export interface LegacyCategory {
    id: string;
    name: string;
    description: string;
    criteria: LegacyCriteria;
    members: LegacyMember[];
    historicalSignificance: string;
    culturalImpact: string;
}
export interface SoulboundReputationNFT {
    id: string;
    tokenId: string;
    ownerPlayerId: string;
    reputationScore: number;
    achievement: string;
    visualTraits: VisualTrait[];
    governanceInfluence: number;
    transferability: TransferabilityRule;
    mintedAt: Date;
}
export interface LivingHistoryTimeline {
    id: string;
    events: TimelineEvent[];
    milestones: CivilizationMilestone[];
    playerRevolutions: PlayerRevolution[];
    economicAchievements: EconomicAchievement[];
    governanceVotes: GovernanceVote[];
    scrollableContent: ScrollableContent;
}
export interface CivilizationRankSystem {
    economicPower: number;
    civilizationContribution: number;
    balancedLeaders: BalancedLeader[];
    antiWhaleMechanics: AntiWhaleMechanic;
    reputationBasedGovernance: ReputationBasedGovernance;
}
export interface AcademyCourse {
    id: string;
    title: string;
    description: string;
    duration: number;
    difficulty: CourseDifficulty;
    skills: Skill[];
    earningPower: number;
    prerequisites: string[];
    completionRate: number;
}
export interface AcademyRequirement {
    type: RequirementType;
    value: number;
    description: string;
    isMandatory: boolean;
}
export interface AcademyReward {
    type: RewardType;
    value: number;
    description: string;
    duration?: number;
    conditions: RewardCondition[];
}
export interface PlayerSubmission {
    id: string;
    playerId: string;
    title: string;
    description: string;
    category: SubmissionCategory;
    content: SubmissionContent;
    submittedAt: Date;
    reviewStatus: ReviewStatus;
    reviewerFeedback: string[];
}
export interface ApprovedInnovation {
    id: string;
    submissionId: string;
    title: string;
    description: string;
    implementationStatus: ImplementationStatus;
    revenueGenerated: number;
    creatorRoyalty: number;
    adoptionRate: number;
    approvedAt: Date;
}
export interface RevenueSharing {
    model: RevenueModel;
    creatorPercentage: number;
    platformPercentage: number;
    communityPercentage: number;
    paymentFrequency: string;
    minimumThreshold: number;
}
export interface AICoach {
    id: string;
    name: string;
    specialization: CoachSpecialization;
    personalityType: PersonalityType;
    teachingStyle: TeachingStyle;
    capabilities: CoachCapability[];
    playerAssignment: PlayerAssignment[];
}
export interface SkillPath {
    id: string;
    name: string;
    description: string;
    levels: SkillLevel[];
    prerequisites: string[];
    rewards: PathReward[];
    estimatedDuration: number;
}
export interface PersonalizedMission {
    id: string;
    playerId: string;
    title: string;
    description: string;
    objectives: MissionObjective[];
    adaptiveDifficulty: boolean;
    completionBonus: CompletionBonus;
    timeLimit: number;
    generatedAt: Date;
}
export interface EarningConnection {
    id: string;
    fromSkill: string;
    toEarning: string;
    connectionType: ConnectionType;
    multiplier: number;
    requirements: ConnectionRequirement[];
}
export interface PlayerMentorshipProgress {
    playerId: string;
    currentPath: string;
    completedLevels: number;
    totalLevels: number;
    skillPoints: number;
    mentorshipScore: number;
    lastActiveAt: Date;
}
export interface ReputationDNA {
    knowledgeDNA: KnowledgeDNA;
    socialDNA: SocialDNA;
    builderDNA: BuilderDNA;
    integrityDNA: IntegrityDNA;
    overallScore: number;
    geneticMarkers: GeneticMarker[];
    evolutionHistory: EvolutionHistory[];
}
export interface KnowledgeDNA {
    coursesCompleted: number;
    skillsMastered: number;
    teachingContributions: number;
    researchParticipation: number;
    academicLevel: AcademicLevel;
}
export interface SocialDNA {
    helpingActions: number;
    communityParticipation: number;
    conflictResolution: number;
    mentorshipHours: number;
    socialLevel: SocialLevel;
}
export interface BuilderDNA {
    toolsCreated: number;
    innovationsSubmitted: number;
    economicContributions: number;
    infrastructureBuilt: number;
    builderLevel: BuilderLevel;
}
export interface IntegrityDNA {
    ruleCompliance: number;
    scamResistance: number;
    ethicalBehavior: number;
    governanceParticipation: number;
    integrityLevel: IntegrityLevel;
}
export interface GeneticMarker {
    id: string;
    name: string;
    description: string;
    rarity: GeneticRarity;
    effect: GeneticEffect;
    inheritancePattern: InheritancePattern;
}
export interface EvolutionHistory {
    timestamp: Date;
    evolutionType: EvolutionType;
    previousScore: number;
    newScore: number;
    trigger: string;
    benefits: string[];
}
export interface BalancedLeader {
    playerId: string;
    economicPower: number;
    civilizationContribution: number;
    balanceScore: number;
    rank: string;
    privileges: string[];
}
export interface AntiWhaleMechanic {
    type: AntiWhaleType;
    description: string;
    mechanics: string[];
    effectiveness: number;
    implementation: string;
}
export interface ReputationBasedGovernance {
    votingPower: VotingPowerCalculation;
    proposalThreshold: ProposalThreshold;
    decisionWeighting: DecisionWeighting;
    reputationRequirements: ReputationRequirement[];
}
export interface TimelineEvent {
    id: string;
    timestamp: Date;
    eventType: EventType;
    title: string;
    description: string;
    participants: string[];
    impact: EventImpact;
    media: MediaAttachment[];
    significance: EventSignificance;
}
export interface CivilizationMilestone {
    id: string;
    title: string;
    description: string;
    achievedAt: Date;
    category: MilestoneCategory;
    contributors: string[];
    rewards: MilestoneReward[];
    historicalImportance: HistoricalImportance;
}
export interface PlayerRevolution {
    id: string;
    playerId: string;
    title: string;
    description: string;
    startedAt: Date;
    endedAt: Date;
    participants: string[];
    outcome: RevolutionOutcome;
    impact: RevolutionImpact;
    methods: RevolutionMethod[];
}
export interface ScrollableContent {
    id: string;
    contentType: ContentType;
    title: string;
    content: string;
    author: string;
    createdAt: Date;
    views: number;
    shares: number;
    bookmarks: number;
    tags: string[];
}
export interface EconomicPrivilege {
    id: string;
    name: string;
    description: string;
    reputationRequirement: number;
    privilegeType: PrivilegeType;
    benefits: PrivilegeBenefit[];
    duration: number;
    isActive: boolean;
}
export interface TrustBasedMarketplace {
    id: string;
    name: string;
    description: string;
    reputationBasedPricing: ReputationBasedPricing;
    trustVerification: TrustVerification;
    disputeResolution: DisputeResolution;
    successMetrics: SuccessMetrics;
}
export interface NonTransferableAsset {
    id: string;
    name: string;
    description: string;
    assetType: AssetType;
    visualRepresentation: VisualRepresentation;
    permanentBenefits: PermanentBenefit[];
    soulbound: boolean;
    earnedAt: Date;
    rarity: AssetRarity;
}
export declare enum AcademyType {
    GAME_STRATEGY_INSTITUTE = "game_strategy_institute",
    DIGITAL_SKILLS_LAB = "digital_skills_lab",
    ECONOMIC_INTELLIGENCE_SCHOOL = "economic_intelligence_school",
    COMMUNITY_LEADERSHIP_ACADEMY = "community_leadership_academy",
    SOCIAL_IMPACT_LAB = "social_impact_lab"
}
export declare enum InnovationFocusArea {
    MINI_APPS = "mini_apps",
    GAME_TOOLS = "game_tools",
    COMMUNITY_SOLUTIONS = "community_solutions",
    EDUCATIONAL_CONTENT = "educational_content"
}
export declare enum UniversityLevel {
    EXPLORER = "explorer",
    SCHOLAR = "scholar",
    INNOVATOR = "innovator",
    ARCHITECT = "architect",
    CIVILIZATION_LEADER = "civilization_leader"
}
export declare enum HallCategory {
    FOUNDERS_HALL = "founders_hall",
    GENIUS_HALL = "genius_hall",
    GUARDIANS_HALL = "guardians_hall",
    IMPACT_HALL = "impact_hall",
    DIAMOND_HANDS_HALL = "diamond_hands_hall"
}
export declare enum LegacyCriteria {
    FOUNDER = "founder",
    TOP_EARNER = "top_earner",
    INNOVATOR = "innovator",
    EDUCATOR = "educator",
    COMMUNITY_PROTECTOR = "community_protector",
    LONG_TERM_HOLDER = "long_term_holder"
}
export declare enum TransferabilityRule {
    SOULBOUND = "soulbound",
    REPUTATION_LOCKED = "reputation_locked",
    CIVILIZATION_GATED = "civilization_gated",
    TEMPORARY_BOOST = "temporary_boost"
}
export declare enum CourseDifficulty {
    BASIC = "basic",
    INTERMEDIATE = "intermediate",
    ADVANCED = "advanced",
    EXPERT = "expert",
    MASTER = "master"
}
export declare enum RequirementType {
    LEVEL = "level",
    SKILL = "skill",
    REPUTATION = "reputation",
    COURSE_COMPLETION = "course_completion",
    COMMUNITY_CONTRIBUTION = "community_contribution"
}
export declare enum RewardType {
    INFLUENCE = "influence",
    TOKENS = "tokens",
    SKILLS = "skills",
    PRIVILEGES = "privileges",
    REPUTATION = "reputation",
    EARNING_MULTIPLIER = "earning_multiplier"
}
export declare enum SubmissionCategory {
    MINI_APP = "mini_app",
    GAME_TOOL = "game_tool",
    COMMUNITY_SOLUTION = "community_solution",
    EDUCATIONAL_CONTENT = "educational_content",
    PROTOCOL_IMPROVEMENT = "protocol_improvement"
}
export declare enum ReviewStatus {
    PENDING = "pending",
    UNDER_REVIEW = "under_review",
    APPROVED = "approved",
    REJECTED = "rejected",
    IMPLEMENTED = "implemented"
}
export declare enum RevenueModel {
    FIXED_ROYALTY = "fixed_royalty",
    PERCENTAGE_REVENUE = "percentage_revenue",
    HYBRID = "hybrid",
    COMMUNITY_POOL = "community_pool"
}
export declare enum CoachSpecialization {
    GAMEPLAY = "gameplay",
    SKILL_DEVELOPMENT = "skill_development",
    SOCIAL_STRATEGY = "social_strategy",
    ECONOMIC_PLANNING = "economic_planning",
    LEADERSHIP = "leadership",
    COMMUNITY_BUILDING = "community_building"
}
export declare enum PersonalityType {
    MENTOR = "mentor",
    FRIEND = "friend",
    CHALLENGER = "challenger",
    ANALYZER = "analyzer",
    MOTIVATOR = "motivator"
}
export declare enum TeachingStyle {
    DIRECT = "direct",
    Socratic = "socratic",
    PROJECT_BASED = "project_based",
    ADAPTIVE = "adaptive",
    GAMIFIED = "gamified"
}
export declare enum ConnectionType {
    DIRECT_UNLOCK = "direct_unlock",
    MENTORSHIP_GATE = "mentorship_gate",
    COMMUNITY_VOTE = "community_vote",
    REPUTATION_THRESHOLD = "reputation_threshold"
}
export declare enum AcademicLevel {
    UNDERGRADUATE = "undergraduate",
    GRADUATE = "graduate",
    POST_GRADUATE = "post_graduate",
    DOCTORAL = "doctoral",
    POST_DOCTORAL = "post_doctoral"
}
export declare enum SocialLevel {
    NOVICE = "novice",
    CONTRIBUTOR = "contributor",
    COLLABORATOR = "collaborator",
    LEADER = "leader",
    ELDER = "elder",
    VISIONARY = "visionary"
}
export declare enum BuilderLevel {
    APPRENTICE = "apprentice",
    JOURNEYMAN = "journeyman",
    CRAFTSMAN = "craftsman",
    EXPERT = "expert",
    MASTER = "master",
    INNOVATOR = "innovator",
    ARCHITECT = "architect"
}
export declare enum IntegrityLevel {
    TRUSTED = "trusted",
    RESPECTED = "respected",
    HONORABLE = "honorable",
    VENERABLE = "venerable",
    LEGENDARY = "legendary"
}
export declare enum GeneticRarity {
    COMMON = "common",
    UNCOMMON = "uncommon",
    RARE = "rare",
    EPIC = "epic",
    LEGENDARY = "legendary",
    MYTHIC = "mythic"
}
export declare enum EvolutionType {
    SKILL_GAIN = "skill_gain",
    REPUTATION_INCREASE = "reputation_increase",
    LEVEL_UP = "level_up",
    ACHIEVEMENT_UNLOCK = "achievement_unlock",
    DNA_MUTATION = "dna_mutation"
}
export declare enum EventType {
    MILESTONE_ACHIEVED = "milestone_achieved",
    REVOLUTION_STARTED = "revolution_started",
    REVOLUTION_ENDED = "revolution_ended",
    INNOVATION_APPROVED = "innovation_approved",
    GOVERNANCE_DECISION = "governance_decision",
    ECONOMIC_EVENT = "economic_event",
    SOCIAL_MOVEMENT = "social_movement"
}
export declare enum MilestoneCategory {
    TECHNOLOGICAL = "technological",
    SOCIAL = "social",
    ECONOMIC = "economic",
    GOVERNANCE = "governance",
    CULTURAL = "cultural",
    ENVIRONMENTAL = "environmental"
}
export declare enum HistoricalImportance {
    LOCAL = "local",
    REGIONAL = "regional",
    CIVILIZATION_WIDE = "civilization_wide",
    HISTORICAL = "historical",
    LEGENDARY = "legendary"
}
export declare enum ContentType {
    TEXT = "text",
    IMAGE = "image",
    VIDEO = "video",
    INTERACTIVE = "interactive",
    DOCUMENT = "document",
    ARTWORK = "artwork"
}
export declare enum PrivilegeType {
    EARNING_BONUS = "earning_bonus",
    GOVERNANCE_RIGHT = "governance_right",
    MENTORING_ABILITY = "mentoring_ability",
    INNOVATION_ACCESS = "innovation_access",
    REPUTATION_BOOST = "reputation_boost"
}
export declare enum AssetType {
    ACHIEVEMENT = "achievement",
    TITLE = "title",
    VISUAL_EFFECT = "visual_effect",
    GOVERNANCE_BADGE = "governance_badge",
    SKILL_CERTIFICATE = "skill_certificate"
}
export interface SkillLevel {
    level: number;
    name: string;
    requirements: string[];
    rewards: string[];
}
export interface Skill {
    id: string;
    name: string;
    category: string;
    level: number;
    experience: number;
    maxLevel: number;
}
export interface MissionObjective {
    id: string;
    description: string;
    type: ObjectiveType;
    requiredAction: string;
    completionCriteria: string[];
    rewards: ObjectiveReward[];
}
export interface CompletionBonus {
    type: BonusType;
    value: number;
    multiplier: number;
    conditions: string[];
}
export interface ConnectionRequirement {
    type: RequirementType;
    value: number;
    description: string;
}
export interface MilestoneReward {
    type: RewardType;
    value: number;
    description: string;
    isPermanent: boolean;
}
export interface UnlockedPrivilege {
    name: string;
    description: string;
    privileges: string[];
    duration: number;
}
export interface Milestone {
    id: string;
    name: string;
    description: string;
    requiredCredits: number;
    rewards: MilestoneReward[];
    isCompleted: boolean;
    completedAt?: Date;
}
export interface GraduationPath {
    currentLevel: UniversityLevel;
    nextLevel: UniversityLevel;
    requirements: PathRequirement[];
    estimatedTime: number;
    benefits: GraduationBenefit[];
}
export interface PathRequirement {
    type: RequirementType;
    value: number;
    description: string;
}
export interface GraduationBenefit {
    name: string;
    description: string;
    type: BenefitType;
    value: number;
}
export interface CoachCapability {
    name: string;
    description: string;
    effectiveness: number;
    useCases: string[];
}
export interface PlayerAssignment {
    playerId: string;
    assignmentDate: Date;
    progress: number;
    performance: number;
    feedback: string[];
}
export interface PathReward {
    type: RewardType;
    value: number;
    description: string;
    isPermanent: boolean;
}
export interface SubmissionContent {
    type: ContentType;
    data: string;
    metadata: Record<string, any>;
    attachments: MediaAttachment[];
}
export interface MediaAttachment {
    type: ContentType;
    url: string;
    title: string;
    description: string;
}
export interface RewardCondition {
    type: ConditionType;
    value: number;
    description: string;
}
export interface EventImpact {
    economic: number;
    social: number;
    governance: number;
    cultural: number;
    description: string;
}
export interface EventSignificance {
    level: SignificanceLevel;
    description: string;
    affectedPlayers: number;
    longTermEffect: string;
}
export declare enum SignificanceLevel {
    MINOR = "minor",
    MODERATE = "moderate",
    MAJOR = "major",
    HISTORIC = "historic",
    LEGENDARY = "legendary"
}
export declare enum ObjectiveType {
    COLLECT = "collect",
    ACHIEVE = "achieve",
    COMPLETE = "complete",
    PARTICIPATE = "participate",
    CREATE = "create"
}
export declare enum BonusType {
    MULTIPLIER = "multiplier",
    FLAT_BONUS = "flat_bonus",
    TEMPORARY_BOOST = "temporary_boost",
    PERMANENT_UPGRADE = "permanent_upgrade"
}
export interface ObjectiveReward {
    type: RewardType;
    value: number;
    description: string;
}
export declare enum BenefitType {
    ECONOMIC = "economic",
    SOCIAL = "social",
    GOVERNANCE = "governance",
    EDUCATIONAL = "educational",
    CULTURAL = "cultural"
}
export declare enum RevolutionOutcome {
    SUCCESS = "success",
    PARTIAL_SUCCESS = "partial_success",
    FAILURE = "failure",
    CRUSHED = "crushed",
    ONGOING = "ongoing"
}
export declare enum RevolutionImpact {
    ECONOMIC = "economic",
    SOCIAL = "social",
    GOVERNANCE = "governance",
    CULTURAL = "cultural",
    ENVIRONMENTAL = "environmental"
}
export declare enum RevolutionMethod {
    PEACEFUL_EVOLUTION = "peaceful_evolution",
    SOCIAL_MOVEMENT = "social_movement",
    ECONOMIC_BOYCOTT = "economic_boycott",
    GOVERNANCE_REFORM = "governance_reform",
    DIGITAL_ACTIVISM = "digital_activism"
}
export interface VotingPowerCalculation {
    formula: string;
    reputationWeight: number;
    participationWeight: number;
    timeWeight: number;
    minimumThreshold: number;
}
export interface ProposalThreshold {
    type: ThresholdType;
    value: number;
    description: string;
}
export declare enum ThresholdType {
    ABSOLUTE_NUMBER = "absolute_number",
    PERCENTAGE = "percentage",
    REPUTATION_BASED = "reputation_based",
    TIME_BASED = "time_based"
}
export interface DecisionWeighting {
    method: WeightingMethod;
    factors: WeightingFactor[];
    calculation: string;
}
export declare enum WeightingMethod {
    QUADRATIC = "quadratic",
    REPUTATION_WEIGHTED = "reputation_weighted",
    TIME_DECAYED = "time_decayed",
    CONSENSUS_WEIGHTED = "consensus_weighted"
}
export interface WeightingFactor {
    name: string;
    weight: number;
    description: string;
}
export interface ReputationRequirement {
    type: RequirementType;
    value: number;
    description: string;
}
export interface VisualRepresentation {
    type: VisualType;
    url: string;
    metadata: Record<string, any>;
    animations: string[];
    effects: string[];
}
export declare enum VisualType {
    AVATAR = "avatar",
    BADGE = "badge",
    EFFECT = "effect",
    ANIMATION = "animation",
    FRAME = "frame",
    BACKGROUND = "background"
}
export interface PermanentBenefit {
    name: string;
    description: string;
    type: BenefitType;
    value: number;
    isPassive: boolean;
}
export interface AssetRarity {
    level: string;
    dropRate: number;
    visualEffects: string[];
    specialAbilities: string[];
}
export interface GeneticEffect {
    name: string;
    description: string;
    type: EffectType;
    value: number;
    duration: number;
    stackable: boolean;
}
export declare enum EffectType {
    MULTIPLIER = "multiplier",
    BONUS = "bonus",
    ABILITY = "ability",
    TRAIT = "trait",
    MODIFIER = "modifier"
}
export interface InheritancePattern {
    type: InheritanceType;
    probability: number;
    conditions: string[];
}
export declare enum InheritanceType {
    DIRECT = "direct",
    MENDLIAN = "mendelian",
    RECESSIVE = "recessive",
    MUTATION = "mutation",
    EPIGENETIC = "epigenetic"
}
export interface ReputationBasedPricing {
    basePrice: number;
    reputationDiscount: number;
    minimumReputation: number;
    priceTiers: PriceTier[];
}
export interface TrustVerification {
    methods: VerificationMethod[];
    requiredLevel: number;
    gracePeriod: number;
    penalties: TrustPenalty[];
}
export interface DisputeResolution {
    process: ResolutionProcess;
    timeline: number;
    arbitrators: string[];
    binding: boolean;
}
export interface SuccessMetrics {
    successRate: number;
    disputeRate: number;
    averageRating: number;
    repeatBusinessRate: number;
}
export interface PriceTier {
    reputationLevel: number;
    discountPercentage: number;
    specialBenefits: string[];
}
export interface VerificationMethod {
    name: string;
    description: string;
    reliability: number;
    cost: number;
}
export interface TrustPenalty {
    type: PenaltyType;
    severity: number;
    duration: number;
    description: string;
}
export declare enum PenaltyType {
    WARNING = "warning",
    TEMPORARY_SUSPENSION = "temporary_suspension",
    PERMANENT_BAN = "permanent_ban",
    REPUTATION_LOSS = "reputation_loss",
    FINANCIAL = "financial"
}
export declare enum ResolutionProcess {
    MEDIATION = "mediation",
    ARBITRATION = "arbitration",
    COMMUNITY_VOTE = "community_vote",
    EXPERT_REVIEW = "expert_review",
    AUTOMATED = "automated"
}
//# sourceMappingURL=excellence-fame.d.ts.map