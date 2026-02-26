"use strict";
// Extended Ecosystems: Marketplace, Charity, Leaderboard, TasksBoard
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrantStatus = exports.BadgeRarity = exports.CauseCategory = exports.DonationFrequency = exports.GenerosityLevel = exports.GiverRank = exports.EscrowStatus = exports.TradeStatus = exports.DeliveryStatus = exports.PaymentMethod = exports.ListingStatus = exports.ShippingType = exports.AuthenticityStatus = exports.ItemQuality = exports.ItemCondition = exports.Currency = exports.MarketplaceCategory = exports.ItemType = exports.TraderRank = void 0;
var TraderRank;
(function (TraderRank) {
    TraderRank["NEWCOMER"] = "NEWCOMER";
    TraderRank["TRADER"] = "TRADER";
    TraderRank["MERCHANT"] = "MERCHANT";
    TraderRank["ENTREPRENEUR"] = "ENTREPRENEUR";
    TraderRank["BUSINESS_OWNER"] = "BUSINESS_OWNER";
    TraderRank["MARKET_MASTER"] = "MARKET_MASTER";
    TraderRank["TRADING_LEGEND"] = "TRADING_LEGEND";
})(TraderRank || (exports.TraderRank = TraderRank = {}));
var ItemType;
(function (ItemType) {
    ItemType["DIGITAL"] = "digital";
    ItemType["PHYSICAL"] = "physical";
    ItemType["SERVICE"] = "service";
    ItemType["EXPERIENCE"] = "experience";
    ItemType["VIRTUAL"] = "virtual";
    ItemType["CUSTOM"] = "custom";
})(ItemType || (exports.ItemType = ItemType = {}));
var MarketplaceCategory;
(function (MarketplaceCategory) {
    MarketplaceCategory["GAMING"] = "gaming";
    MarketplaceCategory["EDUCATION"] = "education";
    MarketplaceCategory["ENTERTAINMENT"] = "entertainment";
    MarketplaceCategory["TECHNOLOGY"] = "technology";
    MarketplaceCategory["ART"] = "art";
    MarketplaceCategory["COLLECTIBLES"] = "collectibles";
    MarketplaceCategory["SERVICES"] = "services";
    MarketplaceCategory["REAL_ESTATE"] = "real_estate";
    MarketplaceCategory["VEHICLES"] = "vehicles";
    MarketplaceCategory["FASHION"] = "fashion";
    MarketplaceCategory["HEALTH"] = "health";
    MarketplaceCategory["FOOD"] = "food";
})(MarketplaceCategory || (exports.MarketplaceCategory = MarketplaceCategory = {}));
var Currency;
(function (Currency) {
    Currency["PWR_TOKEN"] = "pwr_token";
    Currency["STARS"] = "stars";
    Currency["DIAMONDS"] = "diamonds";
    Currency["USD"] = "usd";
    Currency["EUR"] = "eur";
    Currency["LOCAL"] = "local";
})(Currency || (exports.Currency = Currency = {}));
var ItemCondition;
(function (ItemCondition) {
    ItemCondition["NEW"] = "new";
    ItemCondition["LIKE_NEW"] = "like_new";
    ItemCondition["EXCELLENT"] = "excellent";
    ItemCondition["GOOD"] = "good";
    ItemCondition["FAIR"] = "fair";
    ItemCondition["POOR"] = "poor";
    ItemCondition["FOR_PARTS"] = "for_parts";
})(ItemCondition || (exports.ItemCondition = ItemCondition = {}));
var ItemQuality;
(function (ItemQuality) {
    ItemQuality["BASIC"] = "basic";
    ItemQuality["STANDARD"] = "standard";
    ItemQuality["PREMIUM"] = "premium";
    ItemQuality["LUXURY"] = "luxury";
    ItemQuality["EXCLUSIVE"] = "exclusive";
    ItemQuality["MASTERPIECE"] = "masterpiece";
})(ItemQuality || (exports.ItemQuality = ItemQuality = {}));
var AuthenticityStatus;
(function (AuthenticityStatus) {
    AuthenticityStatus["NOT_VERIFIED"] = "not_verified";
    AuthenticityStatus["PENDING"] = "pending";
    AuthenticityStatus["VERIFIED"] = "verified";
    AuthenticityStatus["CERTIFIED"] = "certified";
    AuthenticityStatus["GUARANTEED"] = "guaranteed";
})(AuthenticityStatus || (exports.AuthenticityStatus = AuthenticityStatus = {}));
var ShippingType;
(function (ShippingType) {
    ShippingType["STANDARD"] = "standard";
    ShippingType["EXPRESS"] = "express";
    ShippingType["OVERNIGHT"] = "overnight";
    ShippingType["INTERNATIONAL"] = "international";
    ShippingType["LOCAL_PICKUP"] = "local_pickup";
    ShippingType["DIGITAL_DELIVERY"] = "digital_delivery";
})(ShippingType || (exports.ShippingType = ShippingType = {}));
var ListingStatus;
(function (ListingStatus) {
    ListingStatus["ACTIVE"] = "active";
    ListingStatus["PENDING"] = "pending";
    ListingStatus["SOLD"] = "sold";
    ListingStatus["EXPIRED"] = "expired";
    ListingStatus["CANCELLED"] = "cancelled";
    ListingStatus["SUSPENDED"] = "suspended";
})(ListingStatus || (exports.ListingStatus = ListingStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["PWR_TOKEN"] = "pwr_token";
    PaymentMethod["STARS"] = "stars";
    PaymentMethod["DIAMONDS"] = "diamonds";
    PaymentMethod["CREDIT_CARD"] = "credit_card";
    PaymentMethod["BANK_TRANSFER"] = "bank_transfer";
    PaymentMethod["CRYPTOCURRENCY"] = "cryptocurrency";
    PaymentMethod["ESCROW"] = "escrow";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["PENDING"] = "pending";
    DeliveryStatus["PROCESSING"] = "processing";
    DeliveryStatus["SHIPPED"] = "shipped";
    DeliveryStatus["DELIVERED"] = "delivered";
    DeliveryStatus["CANCELLED"] = "cancelled";
    DeliveryStatus["REFUNDED"] = "refunded";
})(DeliveryStatus || (exports.DeliveryStatus = DeliveryStatus = {}));
var TradeStatus;
(function (TradeStatus) {
    TradeStatus["PENDING"] = "pending";
    TradeStatus["CONFIRMED"] = "confirmed";
    TradeStatus["COMPLETED"] = "completed";
    TradeStatus["CANCELLED"] = "cancelled";
    TradeStatus["DISPUTED"] = "disputed";
})(TradeStatus || (exports.TradeStatus = TradeStatus = {}));
var EscrowStatus;
(function (EscrowStatus) {
    EscrowStatus["PENDING"] = "pending";
    EscrowStatus["RELEASED"] = "released";
    EscrowStatus["DISPUTED"] = "disputed";
    EscrowStatus["REFUNDED"] = "refunded";
})(EscrowStatus || (exports.EscrowStatus = EscrowStatus = {}));
var GiverRank;
(function (GiverRank) {
    GiverRank["HELPER"] = "HELPER";
    GiverRank["SUPPORTER"] = "SUPPORTER";
    GiverRank["CONTRIBUTOR"] = "CONTRIBUTOR";
    GiverRank["PHILANTHROPIST"] = "PHILANTHROPIST";
    GiverRank["BENEFACTOR"] = "BENEFACTOR";
    GiverRank["HUMANITARIAN"] = "HUMANITARIAN";
    GiverRank["CHAMPION"] = "CHAMPION";
    GiverRank["LEGEND"] = "LEGEND";
})(GiverRank || (exports.GiverRank = GiverRank = {}));
var GenerosityLevel;
(function (GenerosityLevel) {
    GenerosityLevel["EMERGING"] = "emerging";
    GenerosityLevel["GROWING"] = "growing";
    GenerosityLevel["ESTABLISHED"] = "established";
    GenerosityLevel["EXCEPTIONAL"] = "exceptional";
    GenerosityLevel["EXTRAORDINARY"] = "extraordinary";
    GenerosityLevel["LEGENDARY"] = "legendary";
})(GenerosityLevel || (exports.GenerosityLevel = GenerosityLevel = {}));
var DonationFrequency;
(function (DonationFrequency) {
    DonationFrequency["DAILY"] = "daily";
    DonationFrequency["WEEKLY"] = "weekly";
    DonationFrequency["MONTHLY"] = "monthly";
    DonationFrequency["QUARTERLY"] = "quarterly";
    DonationFrequency["YEARLY"] = "yearly";
})(DonationFrequency || (exports.DonationFrequency = DonationFrequency = {}));
var CauseCategory;
(function (CauseCategory) {
    CauseCategory["EDUCATION"] = "education";
    CauseCategory["HEALTHCARE"] = "healthcare";
    CauseCategory["ENVIRONMENT"] = "environment";
    CauseCategory["POVERTY"] = "poverty";
    CauseCategory["HUMAN_RIGHTS"] = "human_rights";
    CauseCategory["ANIMAL_WELFARE"] = "animal_welfare";
    CauseCategory["DISASTER_RELIEF"] = "disaster_relief";
    CauseCategory["COMMUNITY_DEVELOPMENT"] = "community_development";
    CauseCategory["ARTS_CULTURE"] = "arts_culture";
    CauseCategory["SCIENCE_RESEARCH"] = "science_research";
})(CauseCategory || (exports.CauseCategory = CauseCategory = {}));
var BadgeRarity;
(function (BadgeRarity) {
    BadgeRarity["COMMON"] = "common";
    BadgeRarity["UNCOMMON"] = "uncommon";
    BadgeRarity["RARE"] = "rare";
    BadgeRarity["EPIC"] = "epic";
    BadgeRarity["LEGENDARY"] = "legendary";
    BadgeRarity["MYTHIC"] = "mythic";
})(BadgeRarity || (exports.BadgeRarity = BadgeRarity = {}));
var GrantStatus;
(function (GrantStatus) {
    GrantStatus["DRAFT"] = "draft";
    GrantStatus["SUBMITTED"] = "submitted";
    GrantStatus["UNDER_REVIEW"] = "under_review";
    GrantStatus["APPROVED"] = "approved";
    GrantStatus["REJECTED"] = "rejected";
    GrantStatus["FUNDED"] = "funded";
    GrantStatus["COMPLETED"] = "completed";
})(GrantStatus || (exports.GrantStatus = GrantStatus = {}));
//# sourceMappingURL=ecosystems-extended.js.map