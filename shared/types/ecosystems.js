"use strict";
// Complete Ecosystems System for People Power Journey
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeasonalAvailability = exports.Season = exports.ExclusivityLevel = exports.WishlistPriority = exports.GiftRarity = exports.GiftType = exports.GiftRank = exports.PremiumStatus = exports.DiamondCut = exports.DiamondClarity = exports.DiamondType = exports.DiamondRank = exports.StarRarity = exports.StarType = exports.StarRank = void 0;
var StarRank;
(function (StarRank) {
    StarRank["NOVICE"] = "NOVICE";
    StarRank["APPRENTICE"] = "APPRENTICE";
    StarRank["JOURNEYMAN"] = "JOURNEYMAN";
    StarRank["MASTER"] = "MASTER";
    StarRank["GRANDMASTER"] = "GRANDMASTER";
    StarRank["LEGEND"] = "LEGEND";
    StarRank["CELESTIAL"] = "CELESTIAL";
})(StarRank || (exports.StarRank = StarRank = {}));
var StarType;
(function (StarType) {
    StarType["BRONZE"] = "bronze";
    StarType["SILVER"] = "silver";
    StarType["GOLD"] = "gold";
    StarType["PLATINUM"] = "platinum";
    StarType["DIAMOND"] = "diamond";
    StarType["RAINBOW"] = "rainbow";
    StarType["COSMIC"] = "cosmic";
    StarType["QUANTUM"] = "quantum";
})(StarType || (exports.StarType = StarType = {}));
var StarRarity;
(function (StarRarity) {
    StarRarity["COMMON"] = "common";
    StarRarity["UNCOMMON"] = "uncommon";
    StarRarity["RARE"] = "rare";
    StarRarity["EPIC"] = "epic";
    StarRarity["LEGENDARY"] = "legendary";
    StarRarity["MYTHIC"] = "mythic";
})(StarRarity || (exports.StarRarity = StarRarity = {}));
var DiamondRank;
(function (DiamondRank) {
    DiamondRank["PROSPECTOR"] = "PROSPECTOR";
    DiamondRank["MINER"] = "MINER";
    DiamondRank["GEMOLOGIST"] = "GEMOLOGIST";
    DiamondRank["JEWELER"] = "JEWELER";
    DiamondRank["MASTER_CRAFTER"] = "MASTER_CRAFTER";
    DiamondRank["DIAMOND_BARON"] = "DIAMOND_BARON";
    DiamondRank["DIAMOND_LEGEND"] = "DIAMOND_LEGEND";
})(DiamondRank || (exports.DiamondRank = DiamondRank = {}));
var DiamondType;
(function (DiamondType) {
    DiamondType["COAL"] = "coal";
    DiamondType["ROUGH_DIAMOND"] = "rough_diamond";
    DiamondType["BRILLIANT"] = "brilliant";
    DiamondType["PRINCESS"] = "princess";
    DiamondType["EMERALD"] = "emerald";
    DiamondType["ASSCHER"] = "asscher";
    DiamondType["MARQUISE"] = "marquise";
    DiamondType["RADIANT"] = "radiant";
    DiamondType["HEART"] = "heart";
    DiamondType["PEAR"] = "pear";
    DiamondType["OVAL"] = "oval";
    DiamondType["CUSHION"] = "cushion";
})(DiamondType || (exports.DiamondType = DiamondType = {}));
var DiamondClarity;
(function (DiamondClarity) {
    DiamondClarity["INCLUDED"] = "included";
    DiamondClarity["SLIGHTLY_INCLUDED"] = "slightly_included";
    DiamondClarity["VERY_SLIGHTLY_INCLUDED"] = "very_slightly_included";
    DiamondClarity["SLIGHTLY_INCLUDED_2"] = "slightly_included_2";
    DiamondClarity["VERY_VERY_SLIGHTLY_INCLUDED"] = "very_very_slightly_included";
    DiamondClarity["INTERNALLY_FLAWLESS"] = "internally_flawless";
    DiamondClarity["FLAWLESS"] = "flawless";
})(DiamondClarity || (exports.DiamondClarity = DiamondClarity = {}));
var DiamondCut;
(function (DiamondCut) {
    DiamondCut["POOR"] = "poor";
    DiamondCut["FAIR"] = "fair";
    DiamondCut["GOOD"] = "good";
    DiamondCut["VERY_GOOD"] = "very_good";
    DiamondCut["EXCELLENT"] = "excellent";
    DiamondCut["IDEAL"] = "ideal";
})(DiamondCut || (exports.DiamondCut = DiamondCut = {}));
var PremiumStatus;
(function (PremiumStatus) {
    PremiumStatus["NONE"] = "none";
    PremiumStatus["BRONZE"] = "bronze";
    PremiumStatus["SILVER"] = "silver";
    PremiumStatus["GOLD"] = "gold";
    PremiumStatus["PLATINUM"] = "platinum";
    PremiumStatus["DIAMOND"] = "diamond";
    PremiumStatus["VIP"] = "vip";
})(PremiumStatus || (exports.PremiumStatus = PremiumStatus = {}));
var GiftRank;
(function (GiftRank) {
    GiftRank["GIVER"] = "GIVER";
    GiftRank["GENEROUS"] = "GENEROUS";
    GiftRank["PHILANTHROPIST"] = "PHILANTHROPIST";
    GiftRank["BENEFACTOR"] = "BENEFACTOR";
    GiftRank["GIFT_MASTER"] = "GIFT_MASTER";
    GiftRank["LEGENDARY_GIVER"] = "LEGENDARY_GIVER";
    GiftRank["SANTA_CLAUSE"] = "SANTA_CLAUSE";
})(GiftRank || (exports.GiftRank = GiftRank = {}));
var GiftType;
(function (GiftType) {
    GiftType["VIRTUAL"] = "virtual";
    GiftType["PHYSICAL"] = "physical";
    GiftType["EXPERIENCE"] = "experience";
    GiftType["DIGITAL"] = "digital";
    GiftType["CUSTOM"] = "custom";
    GiftType["SURPRISE"] = "surprise";
    GiftType["MYSTERY"] = "mystery";
})(GiftType || (exports.GiftType = GiftType = {}));
var GiftRarity;
(function (GiftRarity) {
    GiftRarity["COMMON"] = "common";
    GiftRarity["UNCOMMON"] = "uncommon";
    GiftRarity["RARE"] = "rare";
    GiftRarity["EPIC"] = "epic";
    GiftRarity["LEGENDARY"] = "legendary";
    GiftRarity["MYTHICAL"] = "mythical";
    GiftRarity["DIVINE"] = "divine";
})(GiftRarity || (exports.GiftRarity = GiftRarity = {}));
var WishlistPriority;
(function (WishlistPriority) {
    WishlistPriority["LOW"] = "low";
    WishlistPriority["MEDIUM"] = "medium";
    WishlistPriority["HIGH"] = "high";
    WishlistPriority["URGENT"] = "urgent";
})(WishlistPriority || (exports.WishlistPriority = WishlistPriority = {}));
var ExclusivityLevel;
(function (ExclusivityLevel) {
    ExclusivityLevel["COMMON"] = "common";
    ExclusivityLevel["RARE"] = "rare";
    ExclusivityLevel["EPIC"] = "epic";
    ExclusivityLevel["LEGENDARY"] = "legendary";
    ExclusivityLevel["UNIQUE"] = "unique";
})(ExclusivityLevel || (exports.ExclusivityLevel = ExclusivityLevel = {}));
var Season;
(function (Season) {
    Season["SPRING"] = "spring";
    Season["SUMMER"] = "summer";
    Season["AUTUMN"] = "autumn";
    Season["WINTER"] = "winter";
    Season["FESTIVAL"] = "festival";
    Season["CELEBRATION"] = "celebration";
})(Season || (exports.Season = Season = {}));
var SeasonalAvailability;
(function (SeasonalAvailability) {
    SeasonalAvailability["LIMITED"] = "limited";
    SeasonalAvailability["RECURRING"] = "recurring";
    SeasonalAvailability["SPECIAL"] = "special";
    SeasonalAvailability["EXCLUSIVE"] = "exclusive";
})(SeasonalAvailability || (exports.SeasonalAvailability = SeasonalAvailability = {}));
//# sourceMappingURL=ecosystems.js.map