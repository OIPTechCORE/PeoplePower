// Complete Ecosystems System for People Power Journey

// ==================== STARS ECOSYSTEM ====================
export interface StarsEcosystem {
  id: string;
  playerId: string;
  
  // Star Collection
  starsCollected: number;
  starRank: StarRank;
  starLevel: number;
  
  // Star Types
  starInventory: StarInventory[];
  
  // Star Power
  starPower: number;
  starMultiplier: number;
  
  // Achievements
  starAchievements: StarAchievement[];
  starMilestones: StarMilestone[];
  
  // Trading & Exchange
  starTransactions: StarTransaction[];
  
  // Social
  starGiftsSent: number;
  starGiftsReceived: number;
  
  // Metadata
  lastStarCollectedAt: Date;
  totalStarsEarned: number;
  createdAt: Date;
}

export enum StarRank {
  NOVICE = 'NOVICE',
  APPRENTICE = 'APPRENTICE',
  JOURNEYMAN = 'JOURNEYMAN',
  MASTER = 'MASTER',
  GRANDMASTER = 'GRANDMASTER',
  LEGEND = 'LEGEND',
  CELESTIAL = 'CELESTIAL'
}

export interface StarInventory {
  starType: StarType;
  quantity: number;
  rarity: StarRarity;
  power: number;
  collectedAt: Date;
}

export enum StarType {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  DIAMOND = 'diamond',
  RAINBOW = 'rainbow',
  COSMIC = 'cosmic',
  QUANTUM = 'quantum'
}

export enum StarRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
  MYTHIC = 'mythic'
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

// ==================== DIAMONDS ECOSYSTEM ====================
export interface DiamondsEcosystem {
  id: string;
  playerId: string;
  
  // Diamond Collection
  diamondsCollected: number;
  diamondRank: DiamondRank;
  diamondLevel: number;
  
  // Diamond Types
  diamondInventory: DiamondInventory[];
  
  // Diamond Power
  diamondPower: number;
  diamondMultiplier: number;
  
  // Mining & Crafting
  miningLevel: number;
  craftingLevel: number;
  recipes: CraftingRecipe[];
  
  // Trading & Exchange
  diamondTransactions: DiamondTransaction[];
  
  // Premium Features
  premiumStatus: PremiumStatus;
  premiumBenefits: PremiumBenefit[];
  
  // Metadata
  lastDiamondMinedAt: Date;
  totalDiamondsEarned: number;
  createdAt: Date;
}

export enum DiamondRank {
  PROSPECTOR = 'PROSPECTOR',
  MINER = 'MINER',
  GEMOLOGIST = 'GEMOLOGIST',
  JEWELER = 'JEWELER',
  MASTER_CRAFTER = 'MASTER_CRAFTER',
  DIAMOND_BARON = 'DIAMOND_BARON',
  DIAMOND_LEGEND = 'DIAMOND_LEGEND'
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

export enum DiamondType {
  COAL = 'coal',
  ROUGH_DIAMOND = 'rough_diamond',
  BRILLIANT = 'brilliant',
  PRINCESS = 'princess',
  EMERALD = 'emerald',
  ASSCHER = 'asscher',
  MARQUISE = 'marquise',
  RADIANT = 'radiant',
  HEART = 'heart',
  PEAR = 'pear',
  OVAL = 'oval',
  CUSHION = 'cushion'
}

export enum DiamondClarity {
  INCLUDED = 'included',
  SLIGHTLY_INCLUDED = 'slightly_included',
  VERY_SLIGHTLY_INCLUDED = 'very_slightly_included',
  SLIGHTLY_INCLUDED_2 = 'slightly_included_2',
  VERY_VERY_SLIGHTLY_INCLUDED = 'very_very_slightly_included',
  INTERNALLY_FLAWLESS = 'internally_flawless',
  FLAWLESS = 'flawless'
}

export enum DiamondCut {
  POOR = 'poor',
  FAIR = 'fair',
  GOOD = 'good',
  VERY_GOOD = 'very_good',
  EXCELLENT = 'excellent',
  IDEAL = 'ideal'
}

export interface CraftingRecipe {
  id: string;
  name: string;
  description: string;
  requirements: CraftingRequirement[];
  result: CraftingResult;
  skillLevel: number;
  successRate: number;
  craftingTime: number; // in minutes
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

export enum PremiumStatus {
  NONE = 'none',
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  DIAMOND = 'diamond',
  VIP = 'vip'
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

// ==================== GIFTS ECOSYSTEM ====================
export interface GiftsEcosystem {
  id: string;
  playerId: string;
  
  // Gift Collection
  giftsReceived: number;
  giftsSent: number;
  giftRank: GiftRank;
  
  // Gift Inventory
  giftInventory: GiftInventory[];
  
  // Gift Power
  giftPower: number;
  giftMultiplier: number;
  
  // Gifting History
  giftHistory: GiftHistory[];
  
  // Wishlist
  wishlist: WishlistItem[];
  
  // Special Gifts
  limitedEditionGifts: LimitedEditionGift[];
  seasonalGifts: SeasonalGift[];
  
  // Social Features
  giftReactions: GiftReaction[];
  giftComments: GiftComment[];
  
  // Metadata
  lastGiftReceivedAt: Date;
  lastGiftSentAt: Date;
  createdAt: Date;
}

export enum GiftRank {
  GIVER = 'GIVER',
  GENEROUS = 'GENEROUS',
  PHILANTHROPIST = 'PHILANTHROPIST',
  BENEFACTOR = 'BENEFACTOR',
  GIFT_MASTER = 'GIFT_MASTER',
  LEGENDARY_GIVER = 'LEGENDARY_GIVER',
  SANTA_CLAUSE = 'SANTA_CLAUSE'
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

export enum GiftType {
  VIRTUAL = 'virtual',
  PHYSICAL = 'physical',
  EXPERIENCE = 'experience',
  DIGITAL = 'digital',
  CUSTOM = 'custom',
  SURPRISE = 'surprise',
  MYSTERY = 'mystery'
}

export enum GiftRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
  MYTHICAL = 'mythical',
  DIVINE = 'divine'
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

export enum WishlistPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
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

export enum ExclusivityLevel {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
  UNIQUE = 'unique'
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

export enum Season {
  SPRING = 'spring',
  SUMMER = 'summer',
  AUTUMN = 'autumn',
  WINTER = 'winter',
  FESTIVAL = 'festival',
  CELEBRATION = 'celebration'
}

export enum SeasonalAvailability {
  LIMITED = 'limited',
  RECURRING = 'recurring',
  SPECIAL = 'special',
  EXCLUSIVE = 'exclusive'
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
