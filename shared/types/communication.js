"use strict";
// Custom WhatsApp Business-Style Communication System
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignStatus = exports.RecurringFrequency = exports.AIProvider = exports.BotType = exports.TeamMemberStatus = exports.TeamRole = exports.VerificationLevel = exports.DayOfWeek = exports.BusinessCategory = exports.ConversationPrivacy = exports.ConversationCategory = exports.ConversationType = exports.ParticipantRole = exports.MediaType = exports.MessagePriority = exports.MessageStatus = exports.MessageCategory = exports.MessageType = void 0;
var MessageType;
(function (MessageType) {
    MessageType["TEXT"] = "text";
    MessageType["IMAGE"] = "image";
    MessageType["VIDEO"] = "video";
    MessageType["AUDIO"] = "audio";
    MessageType["DOCUMENT"] = "document";
    MessageType["VOICE_NOTE"] = "voice_note";
    MessageType["STICKER"] = "sticker";
    MessageType["POLL"] = "poll";
    MessageType["LOCATION"] = "location";
    MessageType["CONTACT"] = "contact";
    MessageType["INTERACTIVE"] = "interactive";
    MessageType["SYSTEM"] = "system";
})(MessageType || (exports.MessageType = MessageType = {}));
var MessageCategory;
(function (MessageCategory) {
    MessageCategory["PERSONAL"] = "personal";
    MessageCategory["BUSINESS"] = "business";
    MessageCategory["COMMUNITY"] = "community";
    MessageCategory["GAMING"] = "gaming";
    MessageCategory["EDUCATION"] = "education";
    MessageCategory["ANNOUNCEMENT"] = "announcement";
    MessageCategory["SUPPORT"] = "support";
    MessageCategory["MARKETING"] = "marketing";
})(MessageCategory || (exports.MessageCategory = MessageCategory = {}));
var MessageStatus;
(function (MessageStatus) {
    MessageStatus["SENDING"] = "sending";
    MessageStatus["SENT"] = "sent";
    MessageStatus["DELIVERED"] = "delivered";
    MessageStatus["READ"] = "read";
    MessageStatus["FAILED"] = "failed";
    MessageStatus["DELETED"] = "deleted";
})(MessageStatus || (exports.MessageStatus = MessageStatus = {}));
var MessagePriority;
(function (MessagePriority) {
    MessagePriority["LOW"] = "low";
    MessagePriority["NORMAL"] = "normal";
    MessagePriority["HIGH"] = "high";
    MessagePriority["URGENT"] = "urgent";
})(MessagePriority || (exports.MessagePriority = MessagePriority = {}));
var MediaType;
(function (MediaType) {
    MediaType["IMAGE"] = "image";
    MediaType["VIDEO"] = "video";
    MediaType["AUDIO"] = "audio";
    MediaType["DOCUMENT"] = "document";
    MediaType["STICKER"] = "sticker";
    MediaType["ANIMATION"] = "animation";
})(MediaType || (exports.MediaType = MediaType = {}));
var ParticipantRole;
(function (ParticipantRole) {
    ParticipantRole["OWNER"] = "owner";
    ParticipantRole["ADMIN"] = "admin";
    ParticipantRole["MODERATOR"] = "moderator";
    ParticipantRole["MEMBER"] = "member";
    ParticipantRole["GUEST"] = "guest";
})(ParticipantRole || (exports.ParticipantRole = ParticipantRole = {}));
var ConversationType;
(function (ConversationType) {
    ConversationType["PRIVATE"] = "private";
    ConversationType["GROUP"] = "group";
    ConversationType["BROADCAST"] = "broadcast";
    ConversationType["COMMUNITY"] = "community";
    ConversationType["BUSINESS"] = "business";
    ConversationType["SUPPORT"] = "support";
})(ConversationType || (exports.ConversationType = ConversationType = {}));
var ConversationCategory;
(function (ConversationCategory) {
    ConversationCategory["GENERAL"] = "general";
    ConversationCategory["GAMING"] = "gaming";
    ConversationCategory["EDUCATION"] = "education";
    ConversationCategory["BUSINESS"] = "business";
    ConversationCategory["SUPPORT"] = "support";
    ConversationCategory["ANNOUNCEMENT"] = "announcement";
    ConversationCategory["MARKETING"] = "marketing";
    ConversationCategory["COMMUNITY_BUILDING"] = "community_building";
})(ConversationCategory || (exports.ConversationCategory = ConversationCategory = {}));
var ConversationPrivacy;
(function (ConversationPrivacy) {
    ConversationPrivacy["PUBLIC"] = "public";
    ConversationPrivacy["PRIVATE"] = "private";
    ConversationPrivacy["INVITE_ONLY"] = "invite_only";
})(ConversationPrivacy || (exports.ConversationPrivacy = ConversationPrivacy = {}));
var BusinessCategory;
(function (BusinessCategory) {
    BusinessCategory["GAMING"] = "gaming";
    BusinessCategory["EDUCATION"] = "education";
    BusinessCategory["ENTERTAINMENT"] = "entertainment";
    BusinessCategory["TECHNOLOGY"] = "technology";
    BusinessCategory["FINANCE"] = "finance";
    BusinessCategory["HEALTHCARE"] = "healthcare";
    BusinessCategory["RETAIL"] = "retail";
    BusinessCategory["SERVICES"] = "services";
    BusinessCategory["NON_PROFIT"] = "non_profit";
    BusinessCategory["GOVERNMENT"] = "government";
})(BusinessCategory || (exports.BusinessCategory = BusinessCategory = {}));
var DayOfWeek;
(function (DayOfWeek) {
    DayOfWeek["MONDAY"] = "monday";
    DayOfWeek["TUESDAY"] = "tuesday";
    DayOfWeek["WEDNESDAY"] = "wednesday";
    DayOfWeek["THURSDAY"] = "thursday";
    DayOfWeek["FRIDAY"] = "friday";
    DayOfWeek["SATURDAY"] = "saturday";
    DayOfWeek["SUNDAY"] = "sunday";
})(DayOfWeek || (exports.DayOfWeek = DayOfWeek = {}));
var VerificationLevel;
(function (VerificationLevel) {
    VerificationLevel["NONE"] = "none";
    VerificationLevel["BASIC"] = "basic";
    VerificationLevel["VERIFIED"] = "verified";
    VerificationLevel["PREMIUM"] = "premium";
})(VerificationLevel || (exports.VerificationLevel = VerificationLevel = {}));
var TeamRole;
(function (TeamRole) {
    TeamRole["OWNER"] = "owner";
    TeamRole["ADMIN"] = "admin";
    TeamRole["MANAGER"] = "manager";
    TeamRole["AGENT"] = "agent";
    TeamRole["SUPPORT"] = "support";
})(TeamRole || (exports.TeamRole = TeamRole = {}));
var TeamMemberStatus;
(function (TeamMemberStatus) {
    TeamMemberStatus["ACTIVE"] = "active";
    TeamMemberStatus["AWAY"] = "away";
    TeamMemberStatus["BUSY"] = "busy";
    TeamMemberStatus["OFFLINE"] = "offline";
})(TeamMemberStatus || (exports.TeamMemberStatus = TeamMemberStatus = {}));
var BotType;
(function (BotType) {
    BotType["CUSTOMER_SERVICE"] = "customer_service";
    BotType["SALES_ASSISTANT"] = "sales_assistant";
    BotType["INFORMATION"] = "information";
    BotType["ENTERTAINMENT"] = "entertainment";
    BotType["EDUCATION"] = "education";
    BotType["GAMING"] = "gaming";
})(BotType || (exports.BotType = BotType = {}));
var AIProvider;
(function (AIProvider) {
    AIProvider["OPENAI"] = "openai";
    AIProvider["GOOGLE"] = "google";
    AIProvider["ANTHROPIC"] = "anthropic";
    AIProvider["MICROSOFT"] = "microsoft";
    AIProvider["CUSTOM"] = "custom";
})(AIProvider || (exports.AIProvider = AIProvider = {}));
var RecurringFrequency;
(function (RecurringFrequency) {
    RecurringFrequency["DAILY"] = "daily";
    RecurringFrequency["WEEKLY"] = "weekly";
    RecurringFrequency["MONTHLY"] = "monthly";
    RecurringFrequency["QUARTERLY"] = "quarterly";
})(RecurringFrequency || (exports.RecurringFrequency = RecurringFrequency = {}));
var CampaignStatus;
(function (CampaignStatus) {
    CampaignStatus["DRAFT"] = "draft";
    CampaignStatus["SCHEDULED"] = "scheduled";
    CampaignStatus["ACTIVE"] = "active";
    CampaignStatus["PAUSED"] = "paused";
    CampaignStatus["COMPLETED"] = "completed";
    CampaignStatus["CANCELLED"] = "cancelled";
    CampaignStatus["FAILED"] = "failed";
})(CampaignStatus || (exports.CampaignStatus = CampaignStatus = {}));
//# sourceMappingURL=communication.js.map