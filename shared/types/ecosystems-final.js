"use strict";
// Final Ecosystems: Leaderboard, TasksBoard, and Super Admin
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModeratorRole = exports.ModerationStatus = exports.ModerationPriority = exports.ContentFlagType = exports.ContentStatus = exports.ContentType = exports.BulkActionType = exports.FlagType = exports.RiskLevel = exports.UserStatus = exports.AdminAction = exports.AdminModule = exports.AdminAccessLevel = exports.StreakType = exports.TeamRole = exports.ProjectStatus = exports.CollaboratorRole = exports.TaskStatus = exports.TaskComplexity = exports.TaskPriority = exports.TaskCategoryType = exports.TitleRarity = exports.LeaderboardTier = exports.LeaderboardCategory = void 0;
var LeaderboardCategory;
(function (LeaderboardCategory) {
    LeaderboardCategory["OVERALL"] = "overall";
    LeaderboardCategory["STARS"] = "stars";
    LeaderboardCategory["DIAMONDS"] = "diamonds";
    LeaderboardCategory["GIFTS"] = "gifts";
    LeaderboardCategory["CHARITY"] = "charity";
    LeaderboardCategory["GAMING"] = "gaming";
    LeaderboardCategory["EDUCATION"] = "education";
    LeaderboardCategory["SOCIAL"] = "social";
    LeaderboardCategory["TRADING"] = "trading";
    LeaderboardCategory["CREATIVITY"] = "creativity";
})(LeaderboardCategory || (exports.LeaderboardCategory = LeaderboardCategory = {}));
var LeaderboardTier;
(function (LeaderboardTier) {
    LeaderboardTier["BRONZE"] = "bronze";
    LeaderboardTier["SILVER"] = "silver";
    LeaderboardTier["GOLD"] = "gold";
    LeaderboardTier["PLATINUM"] = "platinum";
    LeaderboardTier["DIAMOND"] = "diamond";
    LeaderboardTier["MASTER"] = "master";
    LeaderboardTier["GRANDMASTER"] = "grandmaster";
    LeaderboardTier["CHALLENGER"] = "challenger";
    LeaderboardTier["LEGEND"] = "legend";
})(LeaderboardTier || (exports.LeaderboardTier = LeaderboardTier = {}));
var TitleRarity;
(function (TitleRarity) {
    TitleRarity["COMMON"] = "common";
    TitleRarity["UNCOMMON"] = "uncommon";
    TitleRarity["RARE"] = "rare";
    TitleRarity["EPIC"] = "epic";
    TitleRarity["LEGENDARY"] = "legendary";
    TitleRarity["MYTHIC"] = "mythic";
    TitleRarity["DIVINE"] = "divine";
})(TitleRarity || (exports.TitleRarity = TitleRarity = {}));
var TaskCategoryType;
(function (TaskCategoryType) {
    TaskCategoryType["PERSONAL"] = "personal";
    TaskCategoryType["WORK"] = "work";
    TaskCategoryType["EDUCATION"] = "education";
    TaskCategoryType["HEALTH"] = "health";
    TaskCategoryType["FINANCE"] = "finance";
    TaskCategoryType["SOCIAL"] = "social";
    TaskCategoryType["CREATIVE"] = "creative";
    TaskCategoryType["GAMING"] = "gaming";
    TaskCategoryType["CHARITY"] = "charity";
    TaskCategoryType["BUSINESS"] = "business";
})(TaskCategoryType || (exports.TaskCategoryType = TaskCategoryType = {}));
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["LOW"] = "low";
    TaskPriority["MEDIUM"] = "medium";
    TaskPriority["HIGH"] = "high";
    TaskPriority["URGENT"] = "urgent";
    TaskPriority["CRITICAL"] = "critical";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
var TaskComplexity;
(function (TaskComplexity) {
    TaskComplexity["SIMPLE"] = "simple";
    TaskComplexity["MODERATE"] = "moderate";
    TaskComplexity["COMPLEX"] = "complex";
    TaskComplexity["EXPERT"] = "expert";
    TaskComplexity["MASTER"] = "master";
})(TaskComplexity || (exports.TaskComplexity = TaskComplexity = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["TODO"] = "todo";
    TaskStatus["IN_PROGRESS"] = "in_progress";
    TaskStatus["REVIEW"] = "review";
    TaskStatus["COMPLETED"] = "completed";
    TaskStatus["CANCELLED"] = "cancelled";
    TaskStatus["ARCHIVED"] = "archived";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var CollaboratorRole;
(function (CollaboratorRole) {
    CollaboratorRole["OWNER"] = "owner";
    CollaboratorRole["EDITOR"] = "editor";
    CollaboratorRole["VIEWER"] = "viewer";
    CollaboratorRole["COMMENTER"] = "commenter";
})(CollaboratorRole || (exports.CollaboratorRole = CollaboratorRole = {}));
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["PLANNING"] = "planning";
    ProjectStatus["ACTIVE"] = "active";
    ProjectStatus["ON_HOLD"] = "on_hold";
    ProjectStatus["COMPLETED"] = "completed";
    ProjectStatus["CANCELLED"] = "cancelled";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
var TeamRole;
(function (TeamRole) {
    TeamRole["LEADER"] = "leader";
    TeamRole["MANAGER"] = "manager";
    TeamRole["CONTRIBUTOR"] = "contributor";
    TeamRole["OBSERVER"] = "observer";
})(TeamRole || (exports.TeamRole = TeamRole = {}));
var StreakType;
(function (StreakType) {
    StreakType["DAILY"] = "daily";
    StreakType["WEEKLY"] = "weekly";
    StreakType["MONTHLY"] = "monthly";
})(StreakType || (exports.StreakType = StreakType = {}));
var AdminAccessLevel;
(function (AdminAccessLevel) {
    AdminAccessLevel["READ_ONLY"] = "read_only";
    AdminAccessLevel["MODERATOR"] = "moderator";
    AdminAccessLevel["ADMINISTRATOR"] = "administrator";
    AdminAccessLevel["SUPER_ADMIN"] = "super_admin";
    AdminAccessLevel["SYSTEM_OWNER"] = "system_owner";
})(AdminAccessLevel || (exports.AdminAccessLevel = AdminAccessLevel = {}));
var AdminModule;
(function (AdminModule) {
    AdminModule["USERS"] = "users";
    AdminModule["CONTENT"] = "content";
    AdminModule["ECONOMY"] = "economy";
    AdminModule["SYSTEM"] = "system";
    AdminModule["SECURITY"] = "security";
    AdminModule["ANALYTICS"] = "analytics";
    AdminModule["COMMUNICATION"] = "communication";
    AdminModule["ECOSYSTEMS"] = "ecosystems";
})(AdminModule || (exports.AdminModule = AdminModule = {}));
var AdminAction;
(function (AdminAction) {
    AdminAction["VIEW"] = "view";
    AdminAction["CREATE"] = "create";
    AdminAction["EDIT"] = "edit";
    AdminAction["DELETE"] = "delete";
    AdminAction["APPROVE"] = "approve";
    AdminAction["REJECT"] = "reject";
    AdminAction["SUSPEND"] = "suspend";
    AdminAction["BAN"] = "ban";
    AdminAction["RESTORE"] = "restore";
})(AdminAction || (exports.AdminAction = AdminAction = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
    UserStatus["SUSPENDED"] = "suspended";
    UserStatus["BANNED"] = "banned";
    UserStatus["PENDING"] = "pending";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var RiskLevel;
(function (RiskLevel) {
    RiskLevel["LOW"] = "low";
    RiskLevel["MEDIUM"] = "medium";
    RiskLevel["HIGH"] = "high";
    RiskLevel["CRITICAL"] = "critical";
})(RiskLevel || (exports.RiskLevel = RiskLevel = {}));
var FlagType;
(function (FlagType) {
    FlagType["SUSPICIOUS_ACTIVITY"] = "suspicious_activity";
    FlagType["VIOLATION"] = "violation";
    FlagType["SPAM"] = "spam";
    FlagType["FRAUD"] = "fraud";
    FlagType["ABUSE"] = "abuse";
})(FlagType || (exports.FlagType = FlagType = {}));
var BulkActionType;
(function (BulkActionType) {
    BulkActionType["SUSPEND"] = "suspend";
    BulkActionType["BAN"] = "ban";
    BulkActionType["SEND_NOTIFICATION"] = "send_notification";
    BulkActionType["RESET_PASSWORD"] = "reset_password";
    BulkActionType["DELETE_ACCOUNT"] = "delete_account";
})(BulkActionType || (exports.BulkActionType = BulkActionType = {}));
var ContentType;
(function (ContentType) {
    ContentType["STORY"] = "story";
    ContentType["MISSION"] = "mission";
    ContentType["EDUCATION"] = "education";
    ContentType["GAME"] = "game";
    ContentType["COMMUNITY"] = "community";
    ContentType["ANNOUNCEMENT"] = "announcement";
})(ContentType || (exports.ContentType = ContentType = {}));
var ContentStatus;
(function (ContentStatus) {
    ContentStatus["DRAFT"] = "draft";
    ContentStatus["REVIEW"] = "review";
    ContentStatus["APPROVED"] = "approved";
    ContentStatus["PUBLISHED"] = "published";
    ContentStatus["REJECTED"] = "rejected";
    ContentStatus["ARCHIVED"] = "archived";
})(ContentStatus || (exports.ContentStatus = ContentStatus = {}));
var ContentFlagType;
(function (ContentFlagType) {
    ContentFlagType["INAPPROPRIATE"] = "inappropriate";
    ContentFlagType["SPAM"] = "spam";
    ContentFlagType["COPYRIGHT"] = "copyright";
    ContentFlagType["MISINFORMATION"] = "misinformation";
    ContentFlagType["OFFENSIVE"] = "offensive";
})(ContentFlagType || (exports.ContentFlagType = ContentFlagType = {}));
var ModerationPriority;
(function (ModerationPriority) {
    ModerationPriority["LOW"] = "low";
    ModerationPriority["MEDIUM"] = "medium";
    ModerationPriority["HIGH"] = "high";
    ModerationPriority["URGENT"] = "urgent";
})(ModerationPriority || (exports.ModerationPriority = ModerationPriority = {}));
var ModerationStatus;
(function (ModerationStatus) {
    ModerationStatus["PENDING"] = "pending";
    ModerationStatus["IN_REVIEW"] = "in_review";
    ModerationStatus["APPROVED"] = "approved";
    ModerationStatus["REJECTED"] = "rejected";
    ModerationStatus["ESCALATED"] = "escalated";
})(ModerationStatus || (exports.ModerationStatus = ModerationStatus = {}));
var ModeratorRole;
(function (ModeratorRole) {
    ModeratorRole["TRAINEE"] = "trainee";
    ModeratorRole["MODERATOR"] = "moderator";
    ModeratorRole["SENIOR_MODERATOR"] = "senior_moderator";
    ModeratorRole["LEAD_MODERATOR"] = "lead_moderator";
    ModeratorRole["ADMIN"] = "admin";
})(ModeratorRole || (exports.ModeratorRole = ModeratorRole = {}));
// Continue with remaining interfaces in next message due to length...
//# sourceMappingURL=ecosystems-final.js.map