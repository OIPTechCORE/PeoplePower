export interface MarketplaceEcosystem {
    id: string;
    playerId: string;
    traderRank: TraderRank;
    reputationScore: number;
    verificationLevel: VerificationLevel;
    activeListings: MarketplaceListing[];
    soldItems: SoldItem[];
    purchasedItems: PurchasedItem[];
    hasStorefront: boolean;
    storefront?: Storefront;
    tradeHistory: TradeHistory[];
    marketplaceWallet: MarketplaceWallet;
    sellerStats: SellerStats;
    buyerStats: BuyerStats;
    joinedAt: Date;
    lastActiveAt: Date;
}
export declare enum TraderRank {
    NEWCOMER = "NEWCOMER",
    TRADER = "TRADER",
    MERCHANT = "MERCHANT",
    ENTREPRENEUR = "ENTREPRENEUR",
    BUSINESS_OWNER = "BUSINESS_OWNER",
    MARKET_MASTER = "MARKET_MASTER",
    TRADING_LEGEND = "TRADING_LEGEND"
}
export interface MarketplaceListing {
    id: string;
    sellerId: string;
    itemType: ItemType;
    itemName: string;
    description: string;
    category: MarketplaceCategory;
    price: number;
    currency: Currency;
    negotiable: boolean;
    minimumOffer?: number;
    images: string[];
    video?: string;
    condition: ItemCondition;
    quality: ItemQuality;
    authenticity?: AuthenticityStatus;
    shippingOptions: ShippingOption[];
    deliveryTime: number;
    status: ListingStatus;
    featured: boolean;
    promoted: boolean;
    views: number;
    likes: number;
    inquiries: number;
    listedAt: Date;
    expiresAt?: Date;
    soldAt?: Date;
}
export declare enum ItemType {
    DIGITAL = "digital",
    PHYSICAL = "physical",
    SERVICE = "service",
    EXPERIENCE = "experience",
    VIRTUAL = "virtual",
    CUSTOM = "custom"
}
export declare enum MarketplaceCategory {
    GAMING = "gaming",
    EDUCATION = "education",
    ENTERTAINMENT = "entertainment",
    TECHNOLOGY = "technology",
    ART = "art",
    COLLECTIBLES = "collectibles",
    SERVICES = "services",
    REAL_ESTATE = "real_estate",
    VEHICLES = "vehicles",
    FASHION = "fashion",
    HEALTH = "health",
    FOOD = "food"
}
export declare enum Currency {
    PWR_TOKEN = "pwr_token",
    STARS = "stars",
    DIAMONDS = "diamonds",
    USD = "usd",
    EUR = "eur",
    LOCAL = "local"
}
export declare enum ItemCondition {
    NEW = "new",
    LIKE_NEW = "like_new",
    EXCELLENT = "excellent",
    GOOD = "good",
    FAIR = "fair",
    POOR = "poor",
    FOR_PARTS = "for_parts"
}
export declare enum ItemQuality {
    BASIC = "basic",
    STANDARD = "standard",
    PREMIUM = "premium",
    LUXURY = "luxury",
    EXCLUSIVE = "exclusive",
    MASTERPIECE = "masterpiece"
}
export declare enum AuthenticityStatus {
    NOT_VERIFIED = "not_verified",
    PENDING = "pending",
    VERIFIED = "verified",
    CERTIFIED = "certified",
    GUARANTEED = "guaranteed"
}
export interface ShippingOption {
    type: ShippingType;
    cost: number;
    estimatedDays: number;
    tracking: boolean;
    insurance: boolean;
}
export declare enum ShippingType {
    STANDARD = "standard",
    EXPRESS = "express",
    OVERNIGHT = "overnight",
    INTERNATIONAL = "international",
    LOCAL_PICKUP = "local_pickup",
    DIGITAL_DELIVERY = "digital_delivery"
}
export declare enum ListingStatus {
    ACTIVE = "active",
    PENDING = "pending",
    SOLD = "sold",
    EXPIRED = "expired",
    CANCELLED = "cancelled",
    SUSPENDED = "suspended"
}
export interface Storefront {
    id: string;
    name: string;
    description: string;
    logo?: string;
    banner?: string;
    category: MarketplaceCategory;
    tags: string[];
    returnPolicy: ReturnPolicy;
    shippingPolicy: ShippingPolicy;
    paymentMethods: PaymentMethod[];
    totalSales: number;
    averageRating: number;
    reviewCount: number;
    features: StorefrontFeatures;
    isActive: boolean;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface ReturnPolicy {
    enabled: boolean;
    days: number;
    conditions: string[];
    exceptions: string[];
}
export interface ShippingPolicy {
    freeShippingThreshold?: number;
    processingTime: number;
    internationalShipping: boolean;
    expressShipping: boolean;
}
export declare enum PaymentMethod {
    PWR_TOKEN = "pwr_token",
    STARS = "stars",
    DIAMONDS = "diamonds",
    CREDIT_CARD = "credit_card",
    BANK_TRANSFER = "bank_transfer",
    CRYPTOCURRENCY = "cryptocurrency",
    ESCROW = "escrow"
}
export interface StorefrontFeatures {
    featuredListings: boolean;
    promotionalBanners: boolean;
    customerSupport: boolean;
    liveChat: boolean;
    analytics: boolean;
    bulkDiscounts: boolean;
    loyaltyProgram: boolean;
}
export interface SoldItem {
    id: string;
    listingId: string;
    buyerId: string;
    price: number;
    currency: Currency;
    commission: number;
    netEarnings: number;
    soldAt: Date;
    feedback?: Feedback;
}
export interface PurchasedItem {
    id: string;
    listingId: string;
    sellerId: string;
    price: number;
    currency: Currency;
    purchasedAt: Date;
    deliveryStatus: DeliveryStatus;
    feedback?: Feedback;
}
export declare enum DeliveryStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}
export interface Feedback {
    rating: number;
    comment: string;
    images?: string[];
    timestamp: Date;
    isPublic: boolean;
}
export interface TradeHistory {
    id: string;
    type: 'buy' | 'sell' | 'trade';
    counterpartyId: string;
    itemId: string;
    amount: number;
    currency: Currency;
    timestamp: Date;
    status: TradeStatus;
}
export declare enum TradeStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    DISPUTED = "disputed"
}
export interface MarketplaceWallet {
    balance: WalletBalance[];
    transactions: WalletTransaction[];
    escrowHoldings: EscrowHolding[];
}
export interface WalletBalance {
    currency: Currency;
    amount: number;
    frozen: number;
    available: number;
}
export interface WalletTransaction {
    id: string;
    type: 'credit' | 'debit' | 'freeze' | 'unfreeze';
    amount: number;
    currency: Currency;
    description: string;
    referenceId?: string;
    timestamp: Date;
}
export interface EscrowHolding {
    id: string;
    tradeId: string;
    amount: number;
    currency: Currency;
    releaseDate?: Date;
    status: EscrowStatus;
}
export declare enum EscrowStatus {
    PENDING = "pending",
    RELEASED = "released",
    DISPUTED = "disputed",
    REFUNDED = "refunded"
}
export interface SellerStats {
    totalRevenue: number;
    totalSales: number;
    averageOrderValue: number;
    conversionRate: number;
    customerSatisfaction: number;
    repeatCustomers: number;
    topCategories: string[];
    monthlyTrend: MonthlyTrend[];
}
export interface BuyerStats {
    totalSpent: number;
    totalPurchases: number;
    averageOrderValue: number;
    favoriteCategories: string[];
    savingsFromDiscounts: number;
    monthlyTrend: MonthlyTrend[];
}
export interface MonthlyTrend {
    month: string;
    revenue: number;
    orders: number;
    customers: number;
}
export interface CharityEcosystem {
    id: string;
    playerId: string;
    giverRank: GiverRank;
    impactScore: number;
    generosityLevel: GenerosityLevel;
    totalDonated: number;
    donationHistory: DonationHistory[];
    recurringDonations: RecurringDonation[];
    supportedCauses: SupportedCause[];
    favoriteCharities: FavoriteCharity[];
    livesImpacted: number;
    projectsFunded: number;
    communitiesHelped: number;
    charityBadges: CharityBadge[];
    certificates: CharityCertificate[];
    charityChallenges: CharityChallenge[];
    teamDonations: TeamDonation[];
    matchingContributions: MatchingContribution[];
    grantApplications: GrantApplication[];
    joinedAt: Date;
    lastDonationAt: Date;
}
export declare enum GiverRank {
    HELPER = "HELPER",
    SUPPORTER = "SUPPORTER",
    CONTRIBUTOR = "CONTRIBUTOR",
    PHILANTHROPIST = "PHILANTHROPIST",
    BENEFACTOR = "BENEFACTOR",
    HUMANITARIAN = "HUMANITARIAN",
    CHAMPION = "CHAMPION",
    LEGEND = "LEGEND"
}
export declare enum GenerosityLevel {
    EMERGING = "emerging",
    GROWING = "growing",
    ESTABLISHED = "established",
    EXCEPTIONAL = "exceptional",
    EXTRAORDINARY = "extraordinary",
    LEGENDARY = "legendary"
}
export interface DonationHistory {
    id: string;
    charityId: string;
    amount: number;
    currency: Currency;
    cause: string;
    isAnonymous: boolean;
    message?: string;
    matchingAmount?: number;
    impactDescription: string;
    timestamp: Date;
}
export interface RecurringDonation {
    id: string;
    charityId: string;
    amount: number;
    currency: Currency;
    frequency: DonationFrequency;
    nextDonationDate: Date;
    isActive: boolean;
    startDate: Date;
    endDate?: Date;
}
export declare enum DonationFrequency {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    YEARLY = "yearly"
}
export interface SupportedCause {
    causeId: string;
    name: string;
    category: CauseCategory;
    totalDonated: number;
    donationCount: number;
    firstDonatedAt: Date;
    lastDonatedAt: Date;
}
export declare enum CauseCategory {
    EDUCATION = "education",
    HEALTHCARE = "healthcare",
    ENVIRONMENT = "environment",
    POVERTY = "poverty",
    HUMAN_RIGHTS = "human_rights",
    ANIMAL_WELFARE = "animal_welfare",
    DISASTER_RELIEF = "disaster_relief",
    COMMUNITY_DEVELOPMENT = "community_development",
    ARTS_CULTURE = "arts_culture",
    SCIENCE_RESEARCH = "science_research"
}
export interface FavoriteCharity {
    charityId: string;
    name: string;
    description: string;
    logo?: string;
    verified: boolean;
    rating: number;
    totalDonated: number;
    addedAt: Date;
}
export interface CharityBadge {
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: BadgeRarity;
    earnedAt: Date;
    criteria: string;
}
export declare enum BadgeRarity {
    COMMON = "common",
    UNCOMMON = "uncommon",
    RARE = "rare",
    EPIC = "epic",
    LEGENDARY = "legendary",
    MYTHIC = "mythic"
}
export interface CharityCertificate {
    id: string;
    title: string;
    description: string;
    issuedBy: string;
    issuedAt: Date;
    achievements: string[];
    verificationCode: string;
}
export interface CharityChallenge {
    id: string;
    name: string;
    description: string;
    goal: number;
    currentProgress: number;
    deadline: Date;
    participants: string[];
    rewards: ChallengeReward[];
    isCompleted: boolean;
    completedAt?: Date;
}
export interface ChallengeReward {
    type: 'badge' | 'certificate' | 'title' | 'recognition';
    name: string;
    description: string;
    value: string;
}
export interface TeamDonation {
    id: string;
    teamId: string;
    teamName: string;
    totalRaised: number;
    memberCount: number;
    goal: number;
    deadline: Date;
    isCompleted: boolean;
    completedAt?: Date;
}
export interface MatchingContribution {
    id: string;
    donorId: string;
    originalAmount: number;
    matchedAmount: number;
    matcherId: string;
    matcherName: string;
    timestamp: Date;
}
export interface GrantApplication {
    id: string;
    grantId: string;
    title: string;
    description: string;
    requestedAmount: number;
    status: GrantStatus;
    submittedAt: Date;
    reviewedAt?: Date;
    approvedAmount?: number;
    feedback?: string;
}
export declare enum GrantStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    UNDER_REVIEW = "under_review",
    APPROVED = "approved",
    REJECTED = "rejected",
    FUNDED = "funded",
    COMPLETED = "completed"
}
//# sourceMappingURL=ecosystems-extended.d.ts.map