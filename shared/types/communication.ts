// Custom WhatsApp Business-Style Communication System

export interface WhatsAppMessage {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  
  // Message Content
  content: MessageContent;
  messageType: MessageType;
  category: MessageCategory;
  
  // Status & Timing
  status: MessageStatus;
  timestamp: Date;
  readAt?: Date;
  deliveredAt?: Date;
  
  // Business Features
  isBusinessMessage: boolean;
  businessMetadata?: BusinessMessageMetadata;
  
  // Interactive Features
  quickReplies?: QuickReply[];
  reactions?: MessageReaction[];
  forwardedCount: number;
  isEdited: boolean;
  editedAt?: Date;
  
  // Media
  mediaAttachments?: MediaAttachment[];
  
  // Metadata
  metadata: MessageMetadata;
}

export interface MessageContent {
  text: string;
  formatting?: TextFormatting[];
  mentions?: Mention[];
  hashtags?: string[];
  links?: LinkPreview[];
}

export interface TextFormatting {
  type: 'bold' | 'italic' | 'strikethrough' | 'monospace' | 'underline';
  start: number;
  end: number;
}

export interface Mention {
  userId: string;
  username: string;
  start: number;
  end: number;
  type: 'user' | 'group' | 'channel';
}

export interface LinkPreview {
  url: string;
  title: string;
  description: string;
  image?: string;
  siteName: string;
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  VOICE_NOTE = 'voice_note',
  STICKER = 'sticker',
  POLL = 'poll',
  LOCATION = 'location',
  CONTACT = 'contact',
  INTERACTIVE = 'interactive',
  SYSTEM = 'system'
}

export enum MessageCategory {
  PERSONAL = 'personal',
  BUSINESS = 'business',
  COMMUNITY = 'community',
  GAMING = 'gaming',
  EDUCATION = 'education',
  ANNOUNCEMENT = 'announcement',
  SUPPORT = 'support',
  MARKETING = 'marketing'
}

export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
  DELETED = 'deleted'
}

export interface BusinessMessageMetadata {
  businessId: string;
  campaignId?: string;
  templateId?: string;
  isPromotional: boolean;
  priority: MessagePriority;
  scheduledFor?: Date;
  expiresAt?: Date;
}

export enum MessagePriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface QuickReply {
  id: string;
  text: string;
  action: QuickReplyAction;
  metadata?: Record<string, any>;
}

export interface QuickReplyAction {
  type: 'reply' | 'navigate' | 'api_call' | 'payment' | 'survey' | 'game_action';
  payload: string | Record<string, any>;
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  timestamp: Date;
}

export interface MediaAttachment {
  id: string;
  type: MediaType;
  url: string;
  thumbnail?: string;
  fileName: string;
  fileSize: number;
  duration?: number; // for audio/video
  dimensions?: { width: number; height: number };
  metadata: Record<string, any>;
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  STICKER = 'sticker',
  ANIMATION = 'animation'
}

export interface MessageMetadata {
  deviceId: string;
  ipAddress: string;
  platform: string;
  version: string;
  geolocation?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  sessionId: string;
  campaignData?: Record<string, any>;
}

// Conversation System
export interface WhatsAppConversation {
  id: string;
  participants: ConversationParticipant[];
  type: ConversationType;
  category: ConversationCategory;
  
  // Conversation Info
  title: string;
  description?: string;
  avatar?: string;
  
  // Business Features
  isBusinessConversation: boolean;
  businessId?: string;
  automatedResponses: boolean;
  
  // Settings
  privacy: ConversationPrivacy;
  permissions: ConversationPermissions;
  
  // Status
  isActive: boolean;
  isArchived: boolean;
  isPinned: boolean;
  isMuted: boolean;
  
  // Timing
  createdAt: Date;
  lastMessageAt?: Date;
  lastActivityAt: Date;
  
  // Statistics
  messageCount: number;
  unreadCount: number;
  participantCount: number;
  
  // Features
  features: ConversationFeatures;
  
  // Metadata
  metadata: ConversationMetadata;
}

export interface ConversationParticipant {
  userId: string;
  role: ParticipantRole;
  joinedAt: Date;
  lastSeenAt?: Date;
  permissions: ParticipantPermissions;
  isOnline: boolean;
  isTyping: boolean;
  nickname?: string;
  avatar?: string;
}

export enum ParticipantRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  MEMBER = 'member',
  GUEST = 'guest'
}

export interface ParticipantPermissions {
  canSendMessages: boolean;
  canSendMedia: boolean;
  canAddParticipants: boolean;
  canRemoveParticipants: boolean;
  canEditInfo: boolean;
  canDeleteMessages: boolean;
  canPinMessages: boolean;
  canCreatePolls: boolean;
  canManageSettings: boolean;
}

export enum ConversationType {
  PRIVATE = 'private',
  GROUP = 'group',
  BROADCAST = 'broadcast',
  COMMUNITY = 'community',
  BUSINESS = 'business',
  SUPPORT = 'support'
}

export enum ConversationCategory {
  GENERAL = 'general',
  GAMING = 'gaming',
  EDUCATION = 'education',
  BUSINESS = 'business',
  SUPPORT = 'support',
  ANNOUNCEMENT = 'announcement',
  MARKETING = 'marketing',
  COMMUNITY_BUILDING = 'community_building'
}

export enum ConversationPrivacy {
  PUBLIC = 'public',
  PRIVATE = 'private',
  INVITE_ONLY = 'invite_only'
}

export interface ConversationPermissions {
  allowNewMembers: boolean;
  requireApproval: boolean;
  messageHistory: 'everyone' | 'admins' | 'disabled';
  mediaPermissions: 'everyone' | 'admins' | 'disabled';
  pollPermissions: 'everyone' | 'admins' | 'disabled';
}

export interface ConversationFeatures {
  reactions: boolean;
  replies: boolean;
  forwards: boolean;
  edits: boolean;
  deletes: boolean;
  voiceNotes: boolean;
  videoCalls: boolean;
  screenSharing: boolean;
  fileSharing: boolean;
  polls: boolean;
  quizzes: boolean;
  events: boolean;
  announcements: boolean;
}

export interface ConversationMetadata {
  creatorId: string;
  source: 'manual' | 'import' | 'automated';
  tags: string[];
  customFields: Record<string, any>;
}

// Business Communication Features
export interface BusinessProfile {
  id: string;
  name: string;
  description: string;
  category: BusinessCategory;
  logo?: string;
  coverImage?: string;
  
  // Contact Info
  phone: string;
  email?: string;
  website?: string;
  address?: BusinessAddress;
  
  // Business Hours
  businessHours: BusinessHours[];
  timezone: string;
  
  // Verification
  isVerified: boolean;
  verificationLevel: VerificationLevel;
  
  // Features
  features: BusinessFeatures;
  
  // Statistics
  stats: BusinessStats;
  
  // Settings
  settings: BusinessSettings;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export enum BusinessCategory {
  GAMING = 'gaming',
  EDUCATION = 'education',
  ENTERTAINMENT = 'entertainment',
  TECHNOLOGY = 'technology',
  FINANCE = 'finance',
  HEALTHCARE = 'healthcare',
  RETAIL = 'retail',
  SERVICES = 'services',
  NON_PROFIT = 'non_profit',
  GOVERNMENT = 'government'
}

export interface BusinessAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface BusinessHours {
  day: DayOfWeek;
  openTime: string; // HH:MM format
  closeTime: string; // HH:MM format
  isOpen: boolean;
}

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday'
}

export enum VerificationLevel {
  NONE = 'none',
  BASIC = 'basic',
  VERIFIED = 'verified',
  PREMIUM = 'premium'
}

export interface BusinessFeatures {
  quickReplies: boolean;
  automatedMessages: boolean;
  chatbots: boolean;
  analytics: boolean;
  campaigns: boolean;
  payments: boolean;
  appointments: boolean;
  catalogs: boolean;
  multiLanguage: boolean;
}

export interface BusinessStats {
  totalConversations: number;
  activeConversations: number;
  totalMessages: number;
  averageResponseTime: number; // in minutes
  customerSatisfaction: number; // 1-5 rating
  conversionRate: number; // percentage
  monthlyActiveUsers: number;
}

export interface BusinessSettings {
  autoReply: AutoReplySettings;
  businessHoursOnly: boolean;
  messageTemplates: MessageTemplate[];
  teamMembers: TeamMember[];
  notifications: NotificationSettings;
  integrations: IntegrationSettings;
}

export interface AutoReplySettings {
  enabled: boolean;
  message: string;
  delay: number; // in minutes
  keywords: string[];
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  variables: TemplateVariable[];
  category: string;
  isActive: boolean;
}

export interface TemplateVariable {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean';
  defaultValue?: string;
  required: boolean;
}

export interface TeamMember {
  userId: string;
  name: string;
  role: TeamRole;
  permissions: TeamPermissions;
  status: TeamMemberStatus;
}

export enum TeamRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MANAGER = 'manager',
  AGENT = 'agent',
  SUPPORT = 'support'
}

export interface TeamPermissions {
  canViewConversations: boolean;
  canReplyToMessages: boolean;
  canManageTemplates: boolean;
  canViewAnalytics: boolean;
  canManageSettings: boolean;
  canManageTeam: boolean;
}

export enum TeamMemberStatus {
  ACTIVE = 'active',
  AWAY = 'away',
  BUSY = 'busy',
  OFFLINE = 'offline'
}

export interface NotificationSettings {
  newMessages: boolean;
  mentions: boolean;
  businessHours: boolean;
  keywords: string[];
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface IntegrationSettings {
  crm: CRMIntegration;
  analytics: AnalyticsIntegration;
  payments: PaymentIntegration;
  calendar: CalendarIntegration;
}

export interface CRMIntegration {
  enabled: boolean;
  provider: string;
  apiKey?: string;
  syncContacts: boolean;
  syncConversations: boolean;
}

export interface AnalyticsIntegration {
  enabled: boolean;
  provider: string;
  trackingId?: string;
  customEvents: string[];
}

export interface PaymentIntegration {
  enabled: boolean;
  provider: string;
  publicKey?: string;
  acceptedCurrencies: string[];
}

export interface CalendarIntegration {
  enabled: boolean;
  provider: string;
  apiKey?: string;
  syncAppointments: boolean;
}

// Advanced Features
export interface ChatBot {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  
  // Configuration
  type: BotType;
  personality: BotPersonality;
  capabilities: BotCapabilities;
  
  // AI Settings
  aiProvider: AIProvider;
  model: string;
  temperature: number;
  maxTokens: number;
  
  // Training
  trainingData: TrainingData[];
  customInstructions: string;
  
  // Integration
  businessId: string;
  conversations: string[];
  
  // Performance
  stats: BotStats;
  
  // Status
  isActive: boolean;
  isLearning: boolean;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export enum BotType {
  CUSTOMER_SERVICE = 'customer_service',
  SALES_ASSISTANT = 'sales_assistant',
  INFORMATION = 'information',
  ENTERTAINMENT = 'entertainment',
  EDUCATION = 'education',
  GAMING = 'gaming'
}

export interface BotPersonality {
  tone: 'professional' | 'friendly' | 'casual' | 'formal' | 'humorous' | 'empathetic';
  language: string;
  greetingStyle: string;
  responseStyle: string;
  emojiUsage: 'minimal' | 'moderate' | 'frequent';
}

export interface BotCapabilities {
  textGeneration: boolean;
  imageRecognition: boolean;
  voiceRecognition: boolean;
  dataAnalysis: boolean;
  appointmentBooking: boolean;
  paymentProcessing: boolean;
  multilingual: boolean[];
}

export enum AIProvider {
  OPENAI = 'openai',
  GOOGLE = 'google',
  ANTHROPIC = 'anthropic',
  MICROSOFT = 'microsoft',
  CUSTOM = 'custom'
}

export interface TrainingData {
  type: 'faq' | 'conversation' | 'document' | 'manual';
  content: string;
  category: string;
  priority: number;
  lastUpdated: Date;
}

export interface BotStats {
  totalConversations: number;
  successfulResponses: number;
  failedResponses: number;
  averageResponseTime: number;
  userSatisfaction: number;
  learningProgress: number;
}

// Campaign System
export interface MessageCampaign {
  id: string;
  name: string;
  description: string;
  
  // Targeting
  targetAudience: CampaignTarget;
  
  // Content
  message: WhatsAppMessage;
  template?: MessageTemplate;
  
  // Timing
  schedule: CampaignSchedule;
  
  // Budget
  budget: CampaignBudget;
  
  // Performance
  stats: CampaignStats;
  
  // Settings
  settings: CampaignSettings;
  
  // Status
  status: CampaignStatus;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface CampaignTarget {
  type: 'all' | 'segment' | 'custom';
  criteria: TargetCriteria[];
  excludeCriteria?: TargetCriteria[];
  estimatedReach: number;
}

export interface TargetCriteria {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: any;
}

export interface CampaignSchedule {
  type: 'immediate' | 'scheduled' | 'recurring';
  startDate?: Date;
  endDate?: Date;
  timezone: string;
  frequency?: RecurringFrequency;
  optimalSendTimes: string[];
}

export enum RecurringFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly'
}

export interface CampaignBudget {
  type: 'unlimited' | 'limited';
  amount?: number;
  currency: string;
  costPerMessage: number;
  totalSpent: number;
}

export interface CampaignStats {
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  responseCount: number;
  clickCount: number;
  conversionCount: number;
  deliveryRate: number;
  readRate: number;
  responseRate: number;
  clickRate: number;
  conversionRate: number;
  cost: number;
  roi: number;
}

export interface CampaignSettings {
  allowReplies: boolean;
  trackOpens: boolean;
  trackClicks: boolean;
  personalization: boolean;
  aBTesting: boolean;
  frequencyCapping: boolean;
  complianceMode: boolean;
}

export enum CampaignStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed'
}
