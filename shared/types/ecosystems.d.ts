export interface StarsEcosystem {
    id: string;
    playerId: string;
    starsCollected: number;
    starRank: StarRank;
    starLevel: number;
    starInventory: StarInventory[];
    starPower: number;
    starMultiplier: number;
    starAchievements: StarAchievement[];
    starMilestones: StarMilestone[];
    starTransactions: StarTransaction[];
    starGiftsSent: number;
    starGiftsReceived: number;
    lastStarCollectedAt: Date;
    totalStarsEarned: number;
    createdAt: Date;
}
export declare enum StarRank {
    NOVICE = "NOVICE",
    APPRENTICE = "APPRENTICE",
    JOURNEYMAN = "JOURNEYMAN",
    MASTER = "MASTER",
    GRANDMASTER = "GRANDMASTER",
    LEGEND = "LEGEND",
    CELESTIAL = "CELESTIAL"
}
export interface StarInventory {
    starType: StarType;
    quantity: number;
    rarity: StarRarity;
    power: number;
    collectedAt: Date;
}
export declare enum StarType {
    BRONZE = "bronze",
    SILVER = "silver",
    GOLD = "gold",
    PLATINUM = "platinum",
    DIAMOND = "diamond",
    RAINBOW = "rainbow",
    COSMIC = "cosmic",
    QUANTUM = "quantum"
}
export declare enum StarRarity {
    COMMON = "common",
    UNCOMMON = "uncommon",
    RARE = "rare",
    EPIC = "epic",
    LEGENDARY = "legendary",
    MYTHIC = "mythic"
}
export interface StarAchievement {
    id: string;
    name: string;
    description: string;
    requirement: number;
    reward: StarReward;
    isCompleted: boolean;
    completedAt?: Date;
}
export interface StarMilestone {
    id: string;
    level: number;
    requiredStars: number;
    rewards: StarReward[];
    isUnlocked: boolean;
    unlockedAt?: Date;
}
export interface StarReward {
    type: 'stars' | 'power_tokens' | 'experience' | 'badge' | 'title' | 'diamonds';
    value: number;
    rarity: StarRarity;
}
export interface StarTransaction {
    id: string;
    type: 'earned' | 'spent' | 'gifted' | 'received' | 'traded';
    amount: number;
    starType: StarType;
    fromPlayerId?: string;
    toPlayerId?: string;
    reason: string;
    timestamp: Date;
}
export interface DiamondsEcosystem {
    id: string;
    playerId: string;
    diamondsCollected: number;
    diamondRank: DiamondRank;
    diamondLevel: number;
    diamondInventory: DiamondInventory[];
    diamondPower: number;
    diamondMultiplier: number;
    miningLevel: number;
    craftingLevel: number;
    recipes: CraftingRecipe[];
    diamondTransactions: DiamondTransaction[];
    premiumStatus: PremiumStatus;
    premiumBenefits: PremiumBenefit[];
    lastDiamondMinedAt: Date;
    totalDiamondsEarned: number;
    createdAt: Date;
}
export declare enum DiamondRank {
    PROSPECTOR = "PROSPECTOR",
    MINER = "MINER",
    GEMOLOGIST = "GEMOLOGIST",
    JEWELER = "JEWELER",
    MASTER_CRAFTER = "MASTER_CRAFTER",
    DIAMOND_BARON = "DIAMOND_BARON",
    DIAMOND_LEGEND = "DIAMOND_LEGEND"
}
export interface DiamondInventory {
    diamondType: DiamondType;
    quantity: number;
    clarity: DiamondClarity;
    cut: DiamondCut;
    carat: number;
    value: number;
    minedAt: Date;
}
export declare enum DiamondType {
    COAL = "coal",
    ROUGH_DIAMOND = "rough_diamond",
    BRILLIANT = "brilliant",
    PRINCESS = "princess",
    EMERALD = "emerald",
    ASSCHER = "asscher",
    MARQUISE = "marquise",
    RADIANT = "radiant",
    HEART = "heart",
    PEAR = "pear",
    OVAL = "oval",
    CUSHION = "cushion"
}
export declare enum DiamondClarity {
    INCLUDED = "included",
    SLIGHTLY_INCLUDED = "slightly_included",
    VERY_SLIGHTLY_INCLUDED = "very_slightly_included",
    SLIGHTLY_INCLUDED_2 = "slightly_included_2",
    VERY_VERY_SLIGHTLY_INCLUDED = "very_very_slightly_included",
    INTERNALLY_FLAWLESS = "internally_flawless",
    FLAWLESS = "flawless"
}
export declare enum DiamondCut {
    POOR = "poor",
    FAIR = "fair",
    GOOD = "good",
    VERY_GOOD = "very_good",
    EXCELLENT = "excellent",
    IDEAL = "ideal"
}
export interface CraftingRecipe {
    id: string;
    name: string;
    description: string;
    requirements: CraftingRequirement[];
    result: CraftingResult;
    skillLevel: number;
    successRate: number;
    craftingTime: number;
}
export interface CraftingRequirement {
    itemType: 'diamond' | 'star' | 'tool' | 'material';
    itemId: string;
    quantity: number;
}
export interface CraftingResult {
    itemId: string;
    quantity: number;
    quality: 'normal' | 'good' | 'excellent' | 'perfect';
}
export declare enum PremiumStatus {
    NONE = "none",
    BRONZE = "bronze",
    SILVER = "silver",
    GOLD = "gold",
    PLATINUM = "platinum",
    DIAMOND = "diamond",
    VIP = "vip"
}
export interface PremiumBenefit {
    id: string;
    name: string;
    description: string;
    type: 'bonus' | 'feature' | 'access' | 'discount';
    value: number | string;
    isActive: boolean;
}
export interface DiamondTransaction {
    id: string;
    type: 'mined' | 'crafted' | 'traded' | 'sold' | 'gifted' | 'received';
    amount: number;
    diamondType: DiamondType;
    fromPlayerId?: string;
    toPlayerId?: string;
    price?: number;
    reason: string;
    timestamp: Date;
}
export interface GiftsEcosystem {
    id: string;
    playerId: string;
    giftsReceived: number;
    giftsSent: number;
    giftRank: GiftRank;
    giftInventory: GiftInventory[];
    giftPower: number;
    giftMultiplier: number;
    giftHistory: GiftHistory[];
    wishlist: WishlistItem[];
    limitedEditionGifts: LimitedEditionGift[];
    seasonalGifts: SeasonalGift[];
    giftReactions: GiftReaction[];
    giftComments: GiftComment[];
    lastGiftReceivedAt: Date;
    lastGiftSentAt: Date;
    createdAt: Date;
}
export declare enum GiftRank {
    GIVER = "GIVER",
    GENEROUS = "GENEROUS",
    PHILANTHROPIST = "PHILANTHROPIST",
    BENEFACTOR = "BENEFACTOR",
    GIFT_MASTER = "GIFT_MASTER",
    LEGENDARY_GIVER = "LEGENDARY_GIVER",
    SANTA_CLAUSE = "SANTA_CLAUSE"
}
export interface GiftInventory {
    giftId: string;
    giftType: GiftType;
    quantity: number;
    rarity: GiftRarity;
    receivedFrom: string;
    receivedAt: Date;
    isWrapped: boolean;
    personalMessage?: string;
}
export declare enum GiftType {
    VIRTUAL = "virtual",
    PHYSICAL = "physical",
    EXPERIENCE = "experience",
    DIGITAL = "digital",
    CUSTOM = "custom",
    SURPRISE = "surprise",
    MYSTERY = "mystery"
}
export declare enum GiftRarity {
    COMMON = "common",
    UNCOMMON = "uncommon",
    RARE = "rare",
    EPIC = "epic",
    LEGENDARY = "legendary",
    MYTHICAL = "mythical",
    DIVINE = "divine"
}
export interface GiftHistory {
    id: string;
    giftId: string;
    giftType: GiftType;
    fromPlayerId: string;
    toPlayerId: string;
    message?: string;
    reaction?: string;
    timestamp: Date;
    isPublic: boolean;
}
export interface WishlistItem {
    id: string;
    itemName: string;
    description: string;
    category: string;
    priority: WishlistPriority;
    price?: number;
    isPublic: boolean;
    addedAt: Date;
    isFulfilled: boolean;
    fulfilledBy?: string;
    fulfilledAt?: Date;
}
export declare enum WishlistPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
export interface LimitedEditionGift {
    id: string;
    name: string;
    description: string;
    editionSize: number;
    currentSupply: number;
    price: number;
    availableUntil: Date;
    exclusivityLevel: ExclusivityLevel;
}
export declare enum ExclusivityLevel {
    COMMON = "common",
    RARE = "rare",
    EPIC = "epic",
    LEGENDARY = "legendary",
    UNIQUE = "unique"
}
export interface SeasonalGift {
    id: string;
    name: string;
    description: string;
    season: Season;
    year: number;
    availability: SeasonalAvailability;
    specialEffects: string[];
}
export declare enum Season {
    SPRING = "spring",
    SUMMER = "summer",
    AUTUMN = "autumn",
    WINTER = "winter",
    FESTIVAL = "festival",
    CELEBRATION = "celebration"
}
export declare enum SeasonalAvailability {
    LIMITED = "limited",
    RECURRING = "recurring",
    SPECIAL = "special",
    EXCLUSIVE = "exclusive"
}
export interface GiftReaction {
    id: string;
    giftId: string;
    playerId: string;
    reaction: string;
    timestamp: Date;
}
export interface GiftComment {
    id: string;
    giftId: string;
    playerId: string;
    comment: string;
    timestamp: Date;
    isEdited: boolean;
    editedAt?: Date;
}
//# sourceMappingURL=ecosystems.d.ts.map