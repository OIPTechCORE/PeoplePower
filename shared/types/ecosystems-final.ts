// Final Ecosystems: Leaderboard, TasksBoard, and Super Admin

// ==================== LEADERBOARD ECOSYSTEM ====================
export interface LeaderboardEcosystem {
  id: string;
  playerId: string;
  
  // Rankings
  globalRank: number;
  regionalRank: number;
  communityRank: number;
  categoryRanks: CategoryRank[];
  
  // Points & Scores
  totalPoints: number;
  weeklyPoints: number;
  monthlyPoints: number;
  allTimePoints: number;
  
  // Achievements
  leaderboardAchievements: LeaderboardAchievement[];
  milestones: LeaderboardMilestone[];
  
  // Competition History
  competitionHistory: CompetitionHistory[];
  winRate: number;
  bestStreak: number;
  currentStreak: number;
  
  // Badges & Titles
  leaderboardBadges: LeaderboardBadge[];
  currentTitle: LeaderboardTitle;
  
  // Analytics
  performanceTrends: PerformanceTrend[];
  
  // Social Features
  rivals: Rival[];
  mentors: Mentor[];
  
  // Metadata
  joinedAt: Date;
  lastCompetedAt: Date;
}

export interface CategoryRank {
  category: LeaderboardCategory;
  rank: number;
  points: number;
  tier: LeaderboardTier;
}

export enum LeaderboardCategory {
  OVERALL = 'overall',
  STARS = 'stars',
  DIAMONDS = 'diamonds',
  GIFTS = 'gifts',
  CHARITY = 'charity',
  GAMING = 'gaming',
  EDUCATION = 'education',
  SOCIAL = 'social',
  TRADING = 'trading',
  CREATIVITY = 'creativity'
}

export enum LeaderboardTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  DIAMOND = 'diamond',
  MASTER = 'master',
  GRANDMASTER = 'grandmaster',
  CHALLENGER = 'challenger',
  LEGEND = 'legend'
}

export interface LeaderboardAchievement {
  id: string;
  name: string;
  description: string;
  category: LeaderboardCategory;
  requirement: AchievementRequirement;
  reward: AchievementReward;
  isCompleted: boolean;
  completedAt?: Date;
}

export interface AchievementRequirement {
  type: 'rank' | 'points' | 'streak' | 'wins' | 'participation';
  value: number;
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all_time';
}

export interface AchievementReward {
  type: 'points' | 'badge' | 'title' | 'bonus' | 'access';
  value: number | string;
  description: string;
}

export interface LeaderboardMilestone {
  id: string;
  level: number;
  requiredPoints: number;
  rewards: MilestoneReward[];
  isUnlocked: boolean;
  unlockedAt?: Date;
}

export interface MilestoneReward {
  type: 'points' | 'badge' | 'title' | 'feature' | 'currency';
  value: number | string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface CompetitionHistory {
  id: string;
  competitionId: string;
  competitionName: string;
  category: LeaderboardCategory;
  position: number;
  participants: number;
  points: number;
  rewards: CompetitionReward[];
  competedAt: Date;
}

export interface CompetitionReward {
  type: 'points' | 'currency' | 'badge' | 'title' | 'item';
  value: number | string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface LeaderboardBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  category: LeaderboardCategory;
  earnedAt: Date;
  isEquipped: boolean;
}

export interface LeaderboardTitle {
  id: string;
  name: string;
  description: string;
  category: LeaderboardCategory;
  rarity: TitleRarity;
  earnedAt: Date;
  isActive: boolean;
}

export enum TitleRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
  MYTHIC = 'mythic',
  DIVINE = 'divine'
}

export interface PerformanceTrend {
  period: string;
  points: number;
  rank: number;
  change: number;
  percentile: number;
}

export interface Rival {
  playerId: string;
  playerName: string;
  rivalryStarted: Date;
  wins: number;
  losses: number;
  draws: number;
  currentStreak: number;
}

export interface Mentor {
  playerId: string;
  playerName: string;
  mentorshipStarted: Date;
  sessions: number;
  progress: number;
}

// ==================== TASKSBOARD ECOSYSTEM ====================
export interface TasksBoardEcosystem {
  id: string;
  playerId: string;
  
  // Task Management
  activeTasks: Task[];
  completedTasks: Task[];
  archivedTasks: Task[];
  
  // Productivity Stats
  totalTasksCompleted: number;
  completionRate: number;
  averageCompletionTime: number;
  productivityScore: number;
  
  // Task Categories
  taskCategories: TaskCategory[];
  
  // Automation
  automatedTasks: AutomatedTask[];
  taskTemplates: TaskTemplate[];
  
  // Collaboration
  sharedTasks: SharedTask[];
  teamProjects: TeamProject[];
  
  // Rewards & Gamification
  taskRewards: TaskReward[];
  streaks: TaskStreak[];
  achievements: TaskAchievement[];
  
  // Analytics
  productivityAnalytics: ProductivityAnalytics[];
  
  // Settings
  taskSettings: TaskSettings;
  
  // Metadata
  joinedAt: Date;
  lastTaskCompletedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  
  // Classification
  category: TaskCategoryType;
  priority: TaskPriority;
  complexity: TaskComplexity;
  
  // Timing
  createdAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  estimatedDuration: number; // in minutes
  actualDuration?: number; // in minutes
  
  // Status
  status: TaskStatus;
  progress: number; // 0-100
  
  // Dependencies
  dependencies: string[];
  subtasks: SubTask[];
  
  // Assignment
  assignedTo?: string;
  assignedBy: string;
  
  // Tags & Labels
  tags: string[];
  labels: TaskLabel[];
  
  // Resources
  attachments: TaskAttachment[];
  links: TaskLink[];
  
  // Collaboration
  collaborators: TaskCollaborator[];
  comments: TaskComment[];
  
  // Rewards
  rewards: TaskReward[];
  
  // Automation
  automation?: TaskAutomation;
  
  // Metadata
  metadata: TaskMetadata;
}

export enum TaskCategoryType {
  PERSONAL = 'personal',
  WORK = 'work',
  EDUCATION = 'education',
  HEALTH = 'health',
  FINANCE = 'finance',
  SOCIAL = 'social',
  CREATIVE = 'creative',
  GAMING = 'gaming',
  CHARITY = 'charity',
  BUSINESS = 'business'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
  CRITICAL = 'critical'
}

export enum TaskComplexity {
  SIMPLE = 'simple',
  MODERATE = 'moderate',
  COMPLEX = 'complex',
  EXPERT = 'expert',
  MASTER = 'master'
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ARCHIVED = 'archived'
}

export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
  completedAt?: Date;
}

export interface TaskLabel {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface TaskAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedAt: Date;
}

export interface TaskLink {
  id: string;
  url: string;
  title: string;
  description?: string;
  favicon?: string;
}

export interface TaskCollaborator {
  playerId: string;
  playerName: string;
  role: CollaboratorRole;
  joinedAt: Date;
  lastActiveAt: Date;
}

export enum CollaboratorRole {
  OWNER = 'owner',
  EDITOR = 'editor',
  VIEWER = 'viewer',
  COMMENTER = 'commenter'
}

export interface TaskComment {
  id: string;
  playerId: string;
  playerName: string;
  content: string;
  createdAt: Date;
  editedAt?: Date;
  isEdited: boolean;
  reactions: CommentReaction[];
}

export interface CommentReaction {
  emoji: string;
  playerId: string;
  timestamp: Date;
}

export interface TaskReward {
  type: 'points' | 'badge' | 'currency' | 'experience' | 'unlock';
  value: number | string;
  description: string;
  isClaimed: boolean;
  claimedAt?: Date;
}

export interface TaskAutomation {
  id: string;
  triggers: AutomationTrigger[];
  actions: AutomationAction[];
  isActive: boolean;
  createdAt: Date;
}

export interface AutomationTrigger {
  type: 'due_date' | 'status_change' | 'completion' | 'time_based' | 'event_based';
  conditions: Record<string, any>;
}

export interface AutomationAction {
  type: 'send_notification' | 'assign_task' | 'create_task' | 'update_status' | 'send_reward';
  parameters: Record<string, any>;
}

export interface TaskMetadata {
  source: 'manual' | 'template' | 'import' | 'automation';
  externalId?: string;
  tags: string[];
  customFields: Record<string, any>;
}

export interface TaskCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  taskCount: number;
  completionRate: number;
}

export interface AutomatedTask {
  id: string;
  templateId: string;
  schedule: AutomationSchedule;
  lastRun?: Date;
  nextRun: Date;
  isActive: boolean;
}

export interface AutomationSchedule {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  frequency: number;
  timezone: string;
  endDate?: Date;
}

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  category: TaskCategoryType;
  defaultPriority: TaskPriority;
  defaultComplexity: TaskComplexity;
  estimatedDuration: number;
  checklist: TemplateChecklist[];
  tags: string[];
  usageCount: number;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface TemplateChecklist {
  id: string;
  text: string;
  isRequired: boolean;
  order: number;
}

export interface SharedTask {
  id: string;
  taskId: string;
  sharedBy: string;
  sharedWith: string[];
  permissions: SharedPermissions;
  sharedAt: Date;
  expiresAt?: Date;
}

export interface SharedPermissions {
  canView: boolean;
  canEdit: boolean;
  canComment: boolean;
  canComplete: boolean;
  canDelete: boolean;
}

export interface TeamProject {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  tasks: string[];
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
  progress: number;
  budget?: ProjectBudget;
}

export enum ProjectStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface TeamMember {
  playerId: string;
  playerName: string;
  role: TeamRole;
  joinedAt: Date;
  contribution: number;
}

export enum TeamRole {
  LEADER = 'leader',
  MANAGER = 'manager',
  CONTRIBUTOR = 'contributor',
  OBSERVER = 'observer'
}

export interface ProjectBudget {
  allocated: number;
  spent: number;
  currency: Currency;
}

export interface TaskStreak {
  id: string;
  type: StreakType;
  currentStreak: number;
  bestStreak: number;
  startDate: Date;
  lastActivity: Date;
}

export enum StreakType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

export interface TaskAchievement {
  id: string;
  name: string;
  description: string;
  criteria: AchievementCriteria;
  reward: TaskReward;
  isCompleted: boolean;
  completedAt?: Date;
}

export interface AchievementCriteria {
  type: 'tasks_completed' | 'streak' | 'category' | 'collaboration';
  value: number;
  timeframe?: string;
}

export interface ProductivityAnalytics {
  period: string;
  tasksCompleted: number;
  averageCompletionTime: number;
  productivityScore: number;
  categoryBreakdown: CategoryBreakdown[];
  trends: ProductivityTrend[];
}

export interface CategoryBreakdown {
  category: TaskCategoryType;
  taskCount: number;
  completionRate: number;
  averageTime: number;
}

export interface ProductivityTrend {
  date: string;
  score: number;
  tasks: number;
  efficiency: number;
}

export interface TaskSettings {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  automation: AutomationSettings;
  display: DisplaySettings;
}

export interface NotificationSettings {
  taskReminders: boolean;
  dueDateAlerts: boolean;
  collaborationAlerts: boolean;
  achievementAlerts: boolean;
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
}

export interface PrivacySettings {
  publicProfile: boolean;
  shareProgress: boolean;
  allowCollaboration: boolean;
  dataSharing: boolean;
}

export interface AutomationSettings {
  autoScheduling: boolean;
  smartReminders: boolean;
  taskSuggestions: boolean;
  productivityTracking: boolean;
}

export interface DisplaySettings {
  theme: 'light' | 'dark' | 'auto';
  layout: 'list' | 'board' | 'calendar';
  compactMode: boolean;
  showCompleted: boolean;
}

// ==================== SUPER ADMIN DASHBOARD ====================
export interface SuperAdminDashboard {
  id: string;
  adminId: string;
  
  // Access Control
  accessLevel: AdminAccessLevel;
  permissions: AdminPermission[];
  
  // System Overview
  systemStats: SystemStats;
  userStats: UserStats;
  economyStats: EconomyStats;
  
  // Control Panels
  userManagement: UserManagementPanel;
  contentManagement: ContentManagementPanel;
  economyManagement: EconomyManagementPanel;
  systemManagement: SystemManagementPanel;
  
  // Analytics & Monitoring
  realTimeMonitoring: RealTimeMonitoring;
  analytics: AdvancedAnalytics;
  alerts: SystemAlert[];
  
  // Tools & Utilities
  adminTools: AdminTools;
  debugTools: DebugTools;
  maintenanceTools: MaintenanceTools;
  
  // Security
  securityCenter: SecurityCenter;
  auditLogs: AuditLog[];
  
  // Settings
  adminSettings: AdminSettings;
  
  // Metadata
  lastLoginAt: Date;
  sessionDuration: number;
}

export enum AdminAccessLevel {
  READ_ONLY = 'read_only',
  MODERATOR = 'moderator',
  ADMINISTRATOR = 'administrator',
  SUPER_ADMIN = 'super_admin',
  SYSTEM_OWNER = 'system_owner'
}

export interface AdminPermission {
  module: AdminModule;
  actions: AdminAction[];
  restrictions: string[];
}

export enum AdminModule {
  USERS = 'users',
  CONTENT = 'content',
  ECONOMY = 'economy',
  SYSTEM = 'system',
  SECURITY = 'security',
  ANALYTICS = 'analytics',
  COMMUNICATION = 'communication',
  ECOSYSTEMS = 'ecosystems'
}

export enum AdminAction {
  VIEW = 'view',
  CREATE = 'create',
  EDIT = 'edit',
  DELETE = 'delete',
  APPROVE = 'approve',
  REJECT = 'reject',
  SUSPEND = 'suspend',
  BAN = 'ban',
  RESTORE = 'restore'
}

export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  onlineUsers: number;
  totalTransactions: number;
  systemUptime: number;
  serverLoad: ServerLoad;
  databaseStats: DatabaseStats;
  cacheStats: CacheStats;
}

export interface ServerLoad {
  cpu: number;
  memory: number;
  disk: number;
  network: NetworkStats;
}

export interface NetworkStats {
  bandwidth: number;
  requests: number;
  errors: number;
  responseTime: number;
}

export interface DatabaseStats {
  connections: number;
  queries: number;
  slowQueries: number;
  size: number;
  indexes: number;
}

export interface CacheStats {
  hitRate: number;
  missRate: number;
  size: number;
  evictions: number;
}

export interface UserStats {
  newUsers: number;
  returningUsers: number;
  churnRate: number;
  retentionRate: number;
  demographics: UserDemographics;
  activityPatterns: ActivityPattern[];
}

export interface UserDemographics {
  ageGroups: AgeGroup[];
  locations: LocationData[];
  devices: DeviceData[];
  languages: LanguageData[];
}

export interface AgeGroup {
  range: string;
  count: number;
  percentage: number;
}

export interface LocationData {
  country: string;
  city: string;
  count: number;
  percentage: number;
}

export interface DeviceData {
  type: string;
  os: string;
  count: number;
  percentage: number;
}

export interface LanguageData {
  language: string;
  count: number;
  percentage: number;
}

export interface ActivityPattern {
  hour: number;
  day: string;
  activity: number;
}

export interface EconomyStats {
  totalSupply: number;
  circulatingSupply: number;
  dailyVolume: number;
  transactionCount: number;
  tokenDistribution: TokenDistribution[];
  marketMetrics: MarketMetrics;
}

export interface TokenDistribution {
  tokenType: string;
  holders: number;
  totalHeld: number;
  percentage: number;
}

export interface MarketMetrics {
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
}

export interface UserManagementPanel {
  users: UserAccount[];
  userSearch: UserSearchFilters;
  bulkActions: BulkAction[];
  userSegments: UserSegment[];
}

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  status: UserStatus;
  registrationDate: Date;
  lastActive: Date;
  totalSpent: number;
  riskLevel: RiskLevel;
  flags: UserFlag[];
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
  PENDING = 'pending'
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface UserFlag {
  type: FlagType;
  reason: string;
  flaggedBy: string;
  flaggedAt: Date;
  isActive: boolean;
}

export enum FlagType {
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  VIOLATION = 'violation',
  SPAM = 'spam',
  FRAUD = 'fraud',
  ABUSE = 'abuse'
}

export interface UserSearchFilters {
  username?: string;
  email?: string;
  status?: UserStatus;
  registrationDate?: DateRange;
  lastActive?: DateRange;
  riskLevel?: RiskLevel;
  flags?: FlagType[];
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface BulkAction {
  type: BulkActionType;
  description: string;
  affectedUsers: number;
  executedBy: string;
  executedAt: Date;
}

export enum BulkActionType {
  SUSPEND = 'suspend',
  BAN = 'ban',
  SEND_NOTIFICATION = 'send_notification',
  RESET_PASSWORD = 'reset_password',
  DELETE_ACCOUNT = 'delete_account'
}

export interface UserSegment {
  id: string;
  name: string;
  criteria: SegmentCriteria;
  userCount: number;
  createdAt: Date;
  lastUpdated: Date;
}

export interface SegmentCriteria {
  rules: SegmentRule[];
  operator: 'AND' | 'OR';
}

export interface SegmentRule {
  field: string;
  operator: string;
  value: any;
}

export interface ContentManagementPanel {
  content: ContentItem[];
  contentModeration: ContentModeration;
  contentAnalytics: ContentAnalytics;
  contentTemplates: ContentTemplate[];
}

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  author: string;
  status: ContentStatus;
  createdAt: Date;
  publishedAt?: Date;
  views: number;
  engagement: EngagementMetrics;
  flags: ContentFlag[];
}

export enum ContentType {
  STORY = 'story',
  MISSION = 'mission',
  EDUCATION = 'education',
  GAME = 'game',
  COMMUNITY = 'community',
  ANNOUNCEMENT = 'announcement'
}

export enum ContentStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  REJECTED = 'rejected',
  ARCHIVED = 'archived'
}

export interface EngagementMetrics {
  likes: number;
  comments: number;
  shares: number;
  completionRate: number;
  averageTimeSpent: number;
}

export interface ContentFlag {
  type: ContentFlagType;
  reason: string;
  flaggedBy: string;
  flaggedAt: Date;
  isResolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
}

export enum ContentFlagType {
  INAPPROPRIATE = 'inappropriate',
  SPAM = 'spam',
  COPYRIGHT = 'copyright',
  MISINFORMATION = 'misinformation',
  OFFENSIVE = 'offensive'
}

export interface ContentModeration {
  queue: ModerationQueue[];
  moderators: Moderator[];
  moderationRules: ModerationRule[];
  autoModeration: AutoModerationSettings;
}

export interface ModerationQueue {
  id: string;
  contentId: string;
  contentType: ContentType;
  reason: string;
  priority: ModerationPriority;
  assignedTo?: string;
  status: ModerationStatus;
  createdAt: Date;
  reviewedAt?: Date;
}

export enum ModerationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum ModerationStatus {
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ESCALATED = 'escalated'
}

export interface Moderator {
  userId: string;
  username: string;
  role: ModeratorRole;
  permissions: ModeratorPermission[];
  stats: ModeratorStats;
}

export enum ModeratorRole {
  TRAINEE = 'trainee',
  MODERATOR = 'moderator',
  SENIOR_MODERATOR = 'senior_moderator',
  LEAD_MODERATOR = 'lead_moderator',
  ADMIN = 'admin'
}

export interface ModeratorPermission {
  action: string;
  categories: ContentType[];
}

export interface ModeratorStats {
  totalReviewed: number;
  approved: number;
  rejected: number;
  escalated: number;
  averageTime: number;
  accuracy: number;
}

export interface ModerationRule {
  id: string;
  name: string;
  conditions: RuleCondition[];
  action: RuleAction;
  isActive: boolean;
  priority: number;
}

export interface RuleCondition {
  field: string;
  operator: string;
  value: any;
}

export interface RuleAction {
  type: 'flag' | 'hide' | 'delete' | 'escalate' | 'approve';
  parameters: Record<string, any>;
}

export interface AutoModerationSettings {
  enabled: boolean;
  sensitivity: number;
  aiDetection: boolean;
  keywordFilter: boolean;
  imageAnalysis: boolean;
  customRules: ModerationRule[];
}

export interface ContentAnalytics {
  performance: ContentPerformance[];
  trends: ContentTrend[];
  topContent: TopContent[];
  userEngagement: UserEngagementMetrics;
}

export interface ContentPerformance {
  contentType: ContentType;
  totalViews: number;
  averageEngagement: number;
  conversionRate: number;
  revenue: number;
}

export interface ContentTrend {
  date: string;
  views: number;
  engagement: number;
  newContent: number;
}

export interface TopContent {
  id: string;
  title: string;
  type: ContentType;
  views: number;
  engagement: number;
  rank: number;
}

export interface UserEngagementMetrics {
  dailyActiveUsers: number;
  averageSessionDuration: number;
  bounceRate: number;
  returnVisitorRate: number;
}

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  category: ContentType;
  structure: TemplateStructure;
  variables: TemplateVariable[];
  usageCount: number;
  isPublic: boolean;
}

export interface TemplateStructure {
  sections: TemplateSection[];
  layout: string;
  styling: Record<string, any>;
}

export interface TemplateSection {
  id: string;
  type: string;
  content: string;
  isRequired: boolean;
  order: number;
}

export interface TemplateVariable {
  name: string;
  type: string;
  defaultValue?: string;
  required: boolean;
  description: string;
}

// Continue with remaining interfaces in next message due to length...
