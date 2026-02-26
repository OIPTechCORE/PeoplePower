// ========================================
// PEOPLE POWER UNIVERSITY & CIVILIZATION CONTROL MAP
// ========================================

export interface PeoplePowerUniversity {
  id: string;
  name: string;
  description: string;
  establishedAt: Date;
  totalStudents: number;
  totalGraduates: number;
  faculties: Faculty[];
  courses: Course[];
  degrees: Degree[];
  mentorshipPrograms: MentorshipProgram[];
  researchProjects: ResearchProject[];
}

export interface Faculty {
  id: string;
  name: string;
  description: string;
  headId: string;
  totalStudents: number;
  coursesOffered: number;
  skillsProduced: Skill[];
  economicRole: EconomicRole;
  reputationScore: number;
  establishedAt: Date;
}

export interface Course {
  id: string;
  facultyId: string;
  title: string;
  description: string;
  duration: number; // in minutes
  difficulty: CourseDifficulty;
  learningObjectives: string[];
  skills: Skill[];
  prerequisites: string[];
  completionReward: CourseReward;
  isPublic: boolean;
  enrollmentCount: number;
  completionRate: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Degree {
  id: string;
  name: string;
  description: string;
  facultyId: string;
  requiredCourses: string[];
  totalCredits: number;
  estimatedDuration: number; // in weeks
  powersUnlocked: Power[];
  governanceEligibility: GovernanceRole[];
  economicBonus: EconomicBonus;
  prestigeLevel: PrestigeLevel;
  totalGraduates: number;
  isActive: boolean;
}

export interface MentorshipProgram {
  id: string;
  name: string;
  description: string;
  facultyId: string;
  mentorRequirements: MentorRequirement[];
  menteeBenefits: MenteeBenefit[];
  mentorRewards: MentorReward[];
  isActive: boolean;
  totalMentors: number;
  totalMentees: number;
  successRate: number;
}

export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  facultyId: string;
  leadResearcherId: string;
  teamMembers: string[];
  objectives: string[];
  methodology: string;
  expectedOutcomes: string[];
  budget: ProjectBudget;
  timeline: ProjectTimeline;
  status: ProjectStatus;
  impact: ProjectImpact;
  createdAt: Date;
}

// ========================================
// CIVILIZATION CONTROL MAP
// ========================================

export interface CivilizationControlMap {
  id: string;
  name: string;
  version: string;
  establishedAt: Date;
  powerPillars: PowerPillar[];
  safetyStructures: SafetyStructure[];
  governanceLayers: GovernanceLayer[];
  powerBalanceMetrics: PowerBalanceMetrics;
}

export interface PowerPillar {
  id: string;
  name: PowerPillarType;
  description: string;
  responsibilities: string[];
  powers: string[];
  limitations: string[];
  currentHolders: string[];
  electionCycle: ElectionCycle;
  checksAndBalances: CheckBalance[];
}

export interface SafetyStructure {
  id: string;
  name: string;
  type: SafetyStructureType;
  description: string;
  mechanisms: string[];
  activationConditions: string[];
  enforcementMethods: string[];
  effectiveness: number;
  lastActivated?: Date;
}

export interface GovernanceLayer {
  id: string;
  name: GovernanceLayerType;
  description: string;
  authority: AuthorityLevel;
  decisionMakingProcess: DecisionProcess;
  votingMechanism: VotingMechanism;
  termLimits: TermLimit;
  accountability: Accountability;
}

export interface PowerBalanceMetrics {
  centralizationScore: number; // 0-100, lower is better
  participationRate: number; // percentage of active citizens
  turnoverRate: number; // leadership refresh rate
  corruptionIndex: number; // 0-100, lower is better
  stabilityIndex: number; // 0-100, higher is better
  lastCalculated: Date;
}

// ========================================
// CITIZEN & IDENTITY SYSTEMS
// ========================================

export interface DigitalCitizen {
  id: string;
  playerId: string;
  citizenId: string; // unique civilization identifier
  reputationScore: number;
  skills: Skill[];
  contributions: Contribution[];
  communityRoles: CommunityRole[];
  governanceHistory: GovernanceHistory[];
  educationHistory: EducationHistory[];
  economicActivity: EconomicActivity[];
  culturalParticipation: CulturalParticipation[];
  createdAt: Date;
  lastActive: Date;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number;
  experience: number;
  maxLevel: number;
  acquiredAt: Date;
  lastUsed: Date;
  certifications: Certification[];
}

export interface Contribution {
  id: string;
  citizenId: string;
  type: ContributionType;
  description: string;
  impact: number;
  communityBenefit: string;
  recognition: string;
  timestamp: Date;
  verified: boolean;
  verifiedBy?: string;
}

export interface CommunityRole {
  id: string;
  name: string;
  communityId: string;
  responsibilities: string[];
  authority: AuthorityLevel;
  termStart: Date;
  termEnd?: Date;
  isActive: boolean;
  performance: RolePerformance;
}

export interface GovernanceHistory {
  id: string;
  citizenId: string;
  position: GovernancePosition;
  termStart: Date;
  termEnd?: Date;
  achievements: string[];
  challenges: string[];
  approval: number;
  reasonForLeaving?: string;
}

// ========================================
// COMMUNITY & INSTITUTION SYSTEMS
// ========================================

export interface Community {
  id: string;
  name: string;
  description: string;
  type: CommunityType;
  foundingDate: Date;
  members: string[];
  treasury: CommunityTreasury;
  governance: CommunityGovernance;
  projects: CommunityProject[];
  reputation: CommunityReputation;
  status: CommunityStatus;
}

export interface CommunityTreasury {
  id: string;
  communityId: string;
  balance: number;
  currency: string;
  incomeSources: IncomeSource[];
  expenses: Expense[];
  budgetAllocations: BudgetAllocation[];
  lastAudit: Date;
  isTransparent: boolean;
}

export interface CommunityGovernance {
  id: string;
  communityId: string;
  structure: GovernanceStructure;
  votingRules: VotingRules;
  proposalProcess: ProposalProcess;
  disputeResolution: DisputeResolution;
  leadership: CommunityLeadership;
}

export interface CommunityProject {
  id: string;
  name: string;
  description: string;
  category: ProjectCategory;
  proposedBy: string;
  budget: ProjectBudget;
  timeline: ProjectTimeline;
  status: ProjectStatus;
  teamMembers: ProjectTeamMember[];
  milestones: ProjectMilestone[];
  impact: ProjectImpact;
  communityBenefit: string;
}

export interface Institution {
  id: string;
  name: string;
  type: InstitutionType;
  description: string;
  foundingDate: Date;
  charter: InstitutionCharter;
  leadership: InstitutionLeadership;
  resources: InstitutionResources;
  accreditation: Accreditation[];
  impact: InstitutionImpact;
  partnerships: Partnership[];
}

// ========================================
// ECONOMIC & GOVERNANCE SYSTEMS
// ========================================

export interface EconomicSystem {
  id: string;
  name: string;
  type: EconomicType;
  currency: Currency;
  productionMethods: ProductionMethod[];
  exchangeMarkets: ExchangeMarket[];
  opportunityNetworks: OpportunityNetwork[];
  stabilityMetrics: EconomicStability;
  governance: EconomicGovernance;
}

export interface GovernanceSystem {
  id: string;
  name: string;
  type: GovernanceType;
  structure: GovernanceStructure;
  votingMechanisms: VotingMechanism[];
  proposalTypes: ProposalType[];
  decisionHistory: Decision[];
  participationMetrics: ParticipationMetrics;
  effectiveness: GovernanceEffectiveness;
}

export interface TreasurySystem {
  id: string;
  name: string;
  type: TreasuryType;
  totalFunds: number;
  currency: string;
  fundSources: FundSource[];
  expenditureCategories: ExpenditureCategory[];
  controls: TreasuryControl[];
  reporting: TreasuryReporting;
  audits: Audit[];
}

// ========================================
// ENUMS & TYPES
// ========================================

export enum FacultyType {
  LEADERSHIP_GOVERNANCE = 'leadership_governance',
  DIGITAL_ENTREPRENEURSHIP = 'digital_entrepreneurship',
  TECHNOLOGY_AI_LITERACY = 'technology_ai_literacy',
  CREATIVE_ARTS_MEDIA = 'creative_arts_media',
  CIVIC_COMMUNITY_DEVELOPMENT = 'civic_community_development'
}

export enum CourseDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export enum PrestigeLevel {
  CERTIFICATE = 'certificate',
  DIPLOMA = 'diploma',
  BACHELOR = 'bachelor',
  MASTER = 'master',
  DOCTORATE = 'doctorate',
  FELLOW = 'fellow'
}

export enum PowerPillarType {
  CITIZENS = 'citizens',
  COMMUNITIES = 'communities',
  INSTITUTIONS = 'institutions',
  COUNCILS = 'councils',
  PROTOCOL_GUARDIANS = 'protocol_guardians'
}

export enum SafetyStructureType {
  TRANSPARENCY_ENGINE = 'transparency_engine',
  REPUTATION_BASED_AUTHORITY = 'reputation_based_authority',
  ECONOMIC_STABILITY_BOARD = 'economic_stability_board',
  ANTI_MANIPULATION_SYSTEMS = 'anti_manipulation_systems'
}

export enum GovernanceLayerType {
  CITIZENS = 'citizens',
  COMMUNITIES = 'communities',
  INSTITUTIONS = 'institutions',
  COUNCILS = 'councils',
  PROTOCOL_GUARDIANS = 'protocol_guardians'
}

export enum SkillCategory {
  LEADERSHIP = 'leadership',
  TECHNICAL = 'technical',
  CREATIVE = 'creative',
  SOCIAL = 'social',
  ECONOMIC = 'economic',
  GOVERNANCE = 'governance'
}

export enum ContributionType {
  MENTORSHIP = 'mentorship',
  COMMUNITY_BUILDING = 'community_building',
  KNOWLEDGE_CREATION = 'knowledge_creation',
  INNOVATION = 'innovation',
  GOVERNANCE = 'governance',
  CULTURAL = 'cultural'
}

export enum CommunityType {
  GUILD = 'guild',
  MOVEMENT = 'movement',
  LEARNING_GROUP = 'learning_group',
  PROJECT_TEAM = 'project_team',
  REGIONAL_GROUP = 'regional_group',
  INTEREST_GROUP = 'interest_group'
}

export enum InstitutionType {
  UNIVERSITY = 'university',
  RESEARCH_INSTITUTE = 'research_institute',
  CULTURAL_CENTER = 'cultural_center',
  ECONOMIC_BODY = 'economic_body',
  GOVERNANCE_BODY = 'governance_body'
}

// ========================================
// HELPER INTERFACES
// ========================================

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number;
  experience: number;
  maxLevel: number;
  acquiredAt: Date;
  lastUsed: Date;
  certifications: Certification[];
}

export interface Certification {
  id: string;
  skillId: string;
  issuingInstitution: string;
  issueDate: Date;
  expiryDate?: Date;
  level: number;
  verificationCode: string;
}

export interface EconomicRole {
  title: string;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  economicBenefits: string[];
  authorityLevel: AuthorityLevel;
}

export interface CourseReward {
  influence: number;
  reputation: number;
  skills: string[];
  unlocks: string[];
  economicBonus: number;
}

export interface Power {
  name: string;
  description: string;
  type: PowerType;
  authority: AuthorityLevel;
  duration?: number;
  cooldown?: number;
}

export interface GovernanceRole {
  position: string;
  authority: AuthorityLevel;
  responsibilities: string[];
  termLimits: TermLimit;
  requirements: RoleRequirement[];
}

export interface EconomicBonus {
  type: BonusType;
  value: number;
  duration?: number;
  conditions: string[];
}

export interface MentorRequirement {
  type: RequirementType;
  value: number;
  description: string;
}

export interface MenteeBenefit {
  type: BenefitType;
  value: string;
  description: string;
}

export interface MentorReward {
  type: RewardType;
  value: number;
  condition: string;
}

export interface ProjectBudget {
  total: number;
  currency: string;
  allocations: BudgetAllocation[];
  fundingSources: FundingSource[];
}

export interface ProjectTimeline {
  startDate: Date;
  endDate: Date;
  milestones: ProjectMilestone[];
  currentPhase: string;
}

export interface ProjectImpact {
  social: number;
  economic: number;
  educational: number;
  cultural: number;
  environmental?: number;
  description: string;
}

export interface CheckBalance {
  mechanism: string;
  description: string;
  trigger: string;
  effect: string;
}

export interface ElectionCycle {
  frequency: string;
  nextElection: Date;
  termLength: number;
  votingMethod: string;
}

export interface DecisionProcess {
  steps: string[];
  timeframes: number[];
  requiredConsensus: number;
  vetoPower: string[];
}

export interface VotingMechanism {
  type: VotingType;
  weighting: VoteWeighting;
  quorum: QuorumRequirement;
  execution: VoteExecution;
}

export interface TermLimit {
  duration: number;
  maxConsecutiveTerms: number;
  coolingOffPeriod: number;
}

export interface Accountability {
  reporting: ReportingRequirement;
  oversight: OversightMechanism;
  removal: RemovalProcess;
  transparency: TransparencyLevel;
}

export interface RolePerformance {
  metrics: PerformanceMetric[];
  rating: number;
  feedback: string[];
  achievements: string[];
  challenges: string[];
}

export interface IncomeSource {
  type: IncomeSourceType;
  amount: number;
  frequency: string;
  reliability: number;
}

export interface Expense {
  category: string;
  amount: number;
  frequency: string;
  approval: string;
  justification: string;
}

export interface BudgetAllocation {
  category: string;
  amount: number;
  percentage: number;
  justification: string;
  expectedImpact: string;
}

export interface VotingRules {
  eligibility: EligibilityRule[];
  votingPeriods: VotingPeriod[];
  proposalThresholds: ProposalThreshold[];
  executionRules: ExecutionRule[];
}

export interface ProposalProcess {
  submission: SubmissionProcess;
  review: ReviewProcess;
  voting: VotingProcess;
  implementation: ImplementationProcess;
}

export interface DisputeResolution {
  mechanisms: ResolutionMechanism[];
  arbitration: ArbitrationProcess;
  appeals: AppealsProcess;
  enforcement: EnforcementProcess;
}

export interface CommunityLeadership {
  structure: LeadershipStructure;
  roles: LeadershipRole[];
  election: ElectionProcess;
  succession: SuccessionPlan;
}

export interface ProjectTeamMember {
  citizenId: string;
  role: string;
  responsibilities: string[];
  contribution: number;
  joinDate: Date;
  status: MemberStatus;
}

export interface ProjectMilestone {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  completedDate?: Date;
  status: MilestoneStatus;
  deliverables: string[];
}

export interface InstitutionCharter {
  mission: string;
  vision: string;
  values: string[];
  principles: string[];
  governance: GovernanceStructure;
  accountability: Accountability;
}

export interface InstitutionLeadership {
  structure: LeadershipStructure;
  currentLeaders: CurrentLeader[];
  selection: SelectionProcess;
  evaluation: EvaluationProcess;
}

export interface InstitutionResources {
  financial: FinancialResources;
  human: HumanResources;
  physical: PhysicalResources;
  intellectual: IntellectualResources;
  digital: DigitalResources;
}

export interface Accreditation {
  accreditingBody: string;
  accreditationType: string;
  issueDate: Date;
  expiryDate?: Date;
  status: AccreditationStatus;
  standards: string[];
}

export interface InstitutionImpact {
  social: SocialImpact;
  economic: EconomicImpact;
  educational: EducationalImpact;
  cultural: CulturalImpact;
  metrics: ImpactMetric[];
}

export interface Partnership {
  partnerId: string;
  partnerName: string;
  partnershipType: PartnershipType;
  startDate: Date;
  endDate?: Date;
  objectives: string[];
  benefits: string[];
  status: PartnershipStatus;
}

export enum PowerType {
  GOVERNANCE = 'governance',
  ECONOMIC = 'economic',
  SOCIAL = 'social',
  EDUCATIONAL = 'educational',
  CULTURAL = 'cultural'
}

export enum AuthorityLevel {
  CITIZEN = 'citizen',
  COMMUNITY_MEMBER = 'community_member',
  COMMUNITY_LEADER = 'community_leader',
  INSTITUTIONAL_MEMBER = 'institutional_member',
  COUNCIL_MEMBER = 'council_member',
  PROTOCOL_GUARDIAN = 'protocol_guardian'
}

export enum BonusType {
  ECONOMIC = 'economic',
  REPUTATION = 'reputation',
  GOVERNANCE = 'governance',
  EDUCATIONAL = 'educational',
  SOCIAL = 'social'
}

export enum RequirementType {
  SKILL_LEVEL = 'skill_level',
  REPUTATION = 'reputation',
  CONTRIBUTION = 'contribution',
  EDUCATION = 'education',
  EXPERIENCE = 'experience'
}

export enum BenefitType {
  SKILL_ACCELERATION = 'skill_acceleration',
  ECONOMIC_BONUS = 'economic_bonus',
  REPUTATION_BOOST = 'reputation_boost',
  EXCLUSIVE_ACCESS = 'exclusive_access',
  MENTORSHIP_OPPORTUNITY = 'mentorship_opportunity'
}

export enum RewardType {
  TOKEN = 'token',
  REPUTATION = 'reputation',
  SKILL_POINTS = 'skill_points',
  GOVERNANCE_POWER = 'governance_power',
  EXCLUSIVE_CONTENT = 'exclusive_content'
}

export enum ProjectStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum MilestoneStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

export enum SafetyStructureType {
  TRANSPARENCY_ENGINE = 'transparency_engine',
  REPUTATION_BASED_AUTHORITY = 'reputation_based_authority',
  ECONOMIC_STABILITY_BOARD = 'economic_stability_board',
  ANTI_MANIPULATION_SYSTEMS = 'anti_manipulation_systems'
}

export enum GovernanceLayerType {
  CITIZENS = 'citizens',
  COMMUNITIES = 'communities',
  INSTITUTIONS = 'institutions',
  COUNCILS = 'councils',
  PROTOCOL_GUARDIANS = 'protocol_guardians'
}

export enum VotingType {
  SIMPLE_MAJORITY = 'simple_majority',
  SUPER_MAJORITY = 'super_majority',
  CONSENSUS = 'consensus',
  WEIGHTED = 'weighted',
  QUADRATIC = 'quadratic'
}

export enum VoteWeighting {
  EQUAL = 'equal',
  REPUTATION_BASED = 'reputation_based',
  CONTRIBUTION_BASED = 'contribution_based',
  SKILL_BASED = 'skill_based',
  HYBRID = 'hybrid'
}

export enum QuorumRequirement {
  FIXED_NUMBER = 'fixed_number',
  PERCENTAGE = 'percentage',
  ADAPTIVE = 'adaptive'
}

export enum IncomeSourceType {
  MEMBERSHIP_DUES = 'membership_dues',
  DONATIONS = 'donations',
  INVESTMENT_RETURNS = 'investment_returns',
  SERVICE_FEES = 'service_fees',
  SPONSORSHIP = 'sponsorship'
}

export enum CommunityStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  DISSOLVED = 'dissolved'
}

export enum InstitutionType {
  UNIVERSITY = 'university',
  RESEARCH_INSTITUTE = 'research_institute',
  CULTURAL_CENTER = 'cultural_center',
  ECONOMIC_BODY = 'economic_body',
  GOVERNANCE_BODY = 'governance_body'
}

export enum EconomicType {
  MARKET_BASED = 'market_based',
  PLANNED = 'planned',
  MIXED = 'mixed',
  GIFT_ECONOMY = 'gift_economy',
  CONTRIBUTION_BASED = 'contribution_based'
}

export enum GovernanceType {
  DIRECT_DEMOCRACY = 'direct_democracy',
  REPRESENTATIVE_DEMOCRACY = 'representative_democracy',
  LIQUID_DEMOCRACY = 'liquid_democracy',
  TECHNOCRACY = 'technocracy',
  MERITOCRACY = 'meritocracy',
  HYBRID = 'hybrid'
}

export enum TreasuryType {
  CENTRALIZED = 'centralized',
  DISTRIBUTED = 'distributed',
  COMMUNITY_CONTROLLED = 'community_controlled',
  HYBRID = 'hybrid'
}

// Additional detailed interfaces for completeness
export interface PerformanceMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export interface EligibilityRule {
  condition: string;
  requirement: string;
  description: string;
}

export interface VotingPeriod {
  type: string;
  duration: number;
  startTime: string;
  endTime: string;
}

export interface ProposalThreshold {
  type: string;
  value: number;
  description: string;
}

export interface ExecutionRule {
  condition: string;
  action: string;
  timeframe: number;
}

export interface SubmissionProcess {
  requirements: string[];
  format: string;
  reviewProcess: string;
  timeline: number;
}

export interface ReviewProcess {
  criteria: string[];
  reviewers: string[];
  timeline: number;
  approvalThreshold: number;
}

export interface VotingProcess {
  method: VotingType;
  duration: number;
  quorum: QuorumRequirement;
  resultAnnouncement: string;
}

export interface ImplementationProcess {
  steps: string[];
  timeline: number;
  responsible: string[];
  monitoring: string[];
}

export interface ResolutionMechanism {
  type: string;
  process: string[];
  timeline: number;
  binding: boolean;
}

export interface ArbitrationProcess {
  arbitrators: string[];
  process: string[];
  timeline: number;
  cost: number;
  binding: boolean;
}

export interface AppealsProcess {
  grounds: string[];
  timeline: number;
  process: string[];
  final: boolean;
}

export interface EnforcementProcess {
  mechanisms: string[];
  responsible: string[];
  timeline: number;
  penalties: string[];
}

export interface LeadershipStructure {
  type: string;
  roles: string[];
  hierarchy: string[];
  decisionMaking: string[];
}

export interface LeadershipRole {
  title: string;
  responsibilities: string[];
  authority: AuthorityLevel;
  termLimits: TermLimit;
  selection: string[];
}

export interface ElectionProcess {
  type: string;
  eligibility: string[];
  timeline: number;
  voting: string[];
  results: string[];
}

export interface SuccessionPlan {
  triggers: string[];
  process: string[];
  timeline: number;
  interim: string[];
}

export interface FinancialResources {
  budget: number;
  funding: string[];
  assets: string[];
  revenue: string[];
}

export interface HumanResources {
  staff: number;
  volunteers: number;
  expertise: string[];
  recruitment: string[];
}

export interface PhysicalResources {
  facilities: string[];
  equipment: string[];
  locations: string[];
  capacity: string[];
}

export interface IntellectualResources {
  patents: string[];
  copyrights: string[];
  trademarks: string[];
  knowledge: string[];
}

export interface DigitalResources {
  platforms: string[];
  data: string[];
  software: string[];
  infrastructure: string[];
}

export interface SocialImpact {
  beneficiaries: number;
  communities: number;
  improvements: string[];
  metrics: ImpactMetric[];
}

export interface EconomicImpact {
  jobsCreated: number;
  revenueGenerated: number;
  investments: number;
  growth: number;
}

export interface EducationalImpact {
  studentsTrained: number;
  coursesOffered: number;
  certifications: number;
  skillsDeveloped: string[];
}

export interface CulturalImpact {
  events: number;
  participants: number;
  traditions: string[];
  innovations: string[];
}

export interface ImpactMetric {
  name: string;
  value: number;
  unit: string;
  target: number;
  trend: 'up' | 'down' | 'stable';
}

export enum PartnershipType {
  ACADEMIC = 'academic',
  COMMERCIAL = 'commercial',
  GOVERNMENTAL = 'governmental',
  NON_PROFIT = 'non_profit',
  TECHNICAL = 'technical'
}

export enum PartnershipStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
  TERMINATED = 'terminated'
}

export enum AccreditationStatus {
  PENDING = 'pending',
  ACCREDITED = 'accredited',
  PROVISIONAL = 'provisional',
  EXPIRED = 'expired',
  REVOKED = 'revoked'
}

export enum MemberStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  TERMINATED = 'terminated'
}
