"use strict";
// Core Game Types
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiniGameType = exports.MissionType = exports.StoryTheme = exports.PlayerGeneration = exports.PlayerRank = void 0;
var PlayerRank;
(function (PlayerRank) {
    PlayerRank["VOICE_STARTER"] = "VOICE_STARTER";
    PlayerRank["ORGANIZER"] = "ORGANIZER";
    PlayerRank["INFLUENCER"] = "INFLUENCER";
    PlayerRank["MOVEMENT_LEADER"] = "MOVEMENT_LEADER";
    PlayerRank["LEGEND"] = "LEGEND";
})(PlayerRank || (exports.PlayerRank = PlayerRank = {}));
var PlayerGeneration;
(function (PlayerGeneration) {
    PlayerGeneration["FOUNDERS"] = "FOUNDERS";
    PlayerGeneration["BUILDERS"] = "BUILDERS";
    PlayerGeneration["SUPPORTERS"] = "SUPPORTERS";
    PlayerGeneration["MASS_MOVEMENT"] = "MASS_MOVEMENT";
})(PlayerGeneration || (exports.PlayerGeneration = PlayerGeneration = {}));
var StoryTheme;
(function (StoryTheme) {
    StoryTheme["GHETTO_ROOTS"] = "GHETTO_ROOTS";
    StoryTheme["VOICE_THROUGH_MUSIC"] = "VOICE_THROUGH_MUSIC";
    StoryTheme["RISING_POPULARITY"] = "RISING_POPULARITY";
    StoryTheme["CHALLENGES"] = "CHALLENGES";
    StoryTheme["LEADERSHIP"] = "LEADERSHIP";
})(StoryTheme || (exports.StoryTheme = StoryTheme = {}));
// Mission System
var MissionType;
(function (MissionType) {
    MissionType["DAILY_TAP"] = "DAILY_TAP";
    MissionType["RECRUIT_SUPPORTERS"] = "RECRUIT_SUPPORTERS";
    MissionType["WATCH_EDUCATIONAL"] = "WATCH_EDUCATIONAL";
    MissionType["ANSWER_QUIZ"] = "ANSWER_QUIZ";
    MissionType["ORGANIZE_RALLY"] = "ORGANIZE_RALLY";
    MissionType["DEBATE_CHALLENGE"] = "DEBATE_CHALLENGE";
    MissionType["COMMUNITY_QUEST"] = "COMMUNITY_QUEST";
})(MissionType || (exports.MissionType = MissionType = {}));
// Mini-Games
var MiniGameType;
(function (MiniGameType) {
    MiniGameType["TAP_RHYTHM"] = "TAP_RHYTHM";
    MiniGameType["LYRICS_PUZZLE"] = "LYRICS_PUZZLE";
    MiniGameType["RESOURCE_STRATEGY"] = "RESOURCE_STRATEGY";
    MiniGameType["DECISION_MAKING"] = "DECISION_MAKING";
    MiniGameType["TEAM_MANAGEMENT"] = "TEAM_MANAGEMENT";
})(MiniGameType || (exports.MiniGameType = MiniGameType = {}));
//# sourceMappingURL=index.js.map