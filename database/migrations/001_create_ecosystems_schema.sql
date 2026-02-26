-- ========================================
-- ECOSYSTEMS DATABASE SCHEMA MIGRATION
-- Migration: 001_create_ecosystems_schema.sql
-- Description: Creates all tables for the ecosystem systems
-- ========================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- STARS ECOSYSTEM TABLES
-- ========================================

-- Stars Ecosystem main table
CREATE TABLE IF NOT EXISTS stars_ecosystems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) UNIQUE NOT NULL,
    stars_collected INTEGER DEFAULT 0,
    star_rank VARCHAR(50) DEFAULT 'NOVICE',
    star_level INTEGER DEFAULT 1,
    star_power INTEGER DEFAULT 0,
    star_multiplier DECIMAL(3,2) DEFAULT 1.0,
    star_gifts_sent INTEGER DEFAULT 0,
    star_gifts_received INTEGER DEFAULT 0,
    total_stars_earned INTEGER DEFAULT 0,
    last_star_collected_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Star Inventory
CREATE TABLE IF NOT EXISTS star_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    star_type VARCHAR(50) NOT NULL,
    quantity INTEGER DEFAULT 1,
    rarity VARCHAR(50) NOT NULL,
    power INTEGER DEFAULT 0,
    collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    received_from VARCHAR(255),
    UNIQUE(player_id, star_type, rarity)
);

-- Star Achievements
CREATE TABLE IF NOT EXISTS star_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    achievement_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    requirement INTEGER,
    reward JSONB,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, achievement_id)
);

-- Star Milestones
CREATE TABLE IF NOT EXISTS star_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    milestone_id VARCHAR(255) NOT NULL,
    level INTEGER NOT NULL,
    required_stars INTEGER,
    rewards JSONB,
    is_unlocked BOOLEAN DEFAULT FALSE,
    unlocked_at TIMESTAMP,
    UNIQUE(player_id, milestone_id)
);

-- Star Transactions
CREATE TABLE IF NOT EXISTS star_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    amount INTEGER NOT NULL,
    star_type VARCHAR(50) NOT NULL,
    from_player_id VARCHAR(255),
    to_player_id VARCHAR(255),
    reason TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- DIAMONDS ECOSYSTEM TABLES
-- ========================================

-- Diamonds Ecosystem main table
CREATE TABLE IF NOT EXISTS diamonds_ecosystems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) UNIQUE NOT NULL,
    diamonds_collected INTEGER DEFAULT 0,
    diamond_rank VARCHAR(50) DEFAULT 'PROSPECTOR',
    diamond_level INTEGER DEFAULT 1,
    mining_level INTEGER DEFAULT 1,
    crafting_level INTEGER DEFAULT 1,
    diamond_power INTEGER DEFAULT 0,
    diamond_multiplier DECIMAL(3,2) DEFAULT 1.0,
    premium_status VARCHAR(50) DEFAULT 'NONE',
    total_diamonds_earned INTEGER DEFAULT 0,
    last_diamond_mined_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Diamond Inventory
CREATE TABLE IF NOT EXISTS diamond_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    diamond_type VARCHAR(50) NOT NULL,
    quantity INTEGER DEFAULT 1,
    clarity VARCHAR(50) NOT NULL,
    cut VARCHAR(50) NOT NULL,
    carat DECIMAL(4,2) DEFAULT 1.0,
    value INTEGER DEFAULT 0,
    mined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, diamond_type, clarity, cut)
);

-- Crafting Recipes
CREATE TABLE IF NOT EXISTS crafting_recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    requirements JSONB NOT NULL,
    result JSONB NOT NULL,
    skill_level INTEGER DEFAULT 1,
    success_rate INTEGER DEFAULT 100,
    crafting_time INTEGER DEFAULT 60
);

-- Player Unlocked Recipes
CREATE TABLE IF NOT EXISTS player_unlocked_recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    recipe_id UUID NOT NULL REFERENCES crafting_recipes(id),
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, recipe_id)
);

-- Premium Benefits
CREATE TABLE IF NOT EXISTS premium_benefits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    value TEXT,
    required_status VARCHAR(50) DEFAULT 'NONE',
    is_active BOOLEAN DEFAULT TRUE
);

-- Player Premium Benefits
CREATE TABLE IF NOT EXISTS player_premium_benefits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    benefit_id UUID NOT NULL REFERENCES premium_benefits(id),
    is_active BOOLEAN DEFAULT TRUE,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, benefit_id)
);

-- Diamond Transactions
CREATE TABLE IF NOT EXISTS diamond_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    amount INTEGER NOT NULL,
    diamond_type VARCHAR(50) NOT NULL,
    from_player_id VARCHAR(255),
    to_player_id VARCHAR(255),
    price INTEGER,
    reason TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- GIFTS ECOSYSTEM TABLES
-- ========================================

-- Gifts Ecosystem main table
CREATE TABLE IF NOT EXISTS gifts_ecosystems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) UNIQUE NOT NULL,
    gifts_received INTEGER DEFAULT 0,
    gifts_sent INTEGER DEFAULT 0,
    gift_rank VARCHAR(50) DEFAULT 'GIVER',
    gift_power INTEGER DEFAULT 0,
    gift_multiplier DECIMAL(3,2) DEFAULT 1.0,
    total_gifts_earned INTEGER DEFAULT 0,
    last_gift_received_at TIMESTAMP,
    last_gift_sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gift Inventory
CREATE TABLE IF NOT EXISTS gift_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    gift_id VARCHAR(255) NOT NULL,
    gift_type VARCHAR(50) NOT NULL,
    quantity INTEGER DEFAULT 1,
    rarity VARCHAR(50) NOT NULL,
    received_from VARCHAR(255),
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_wrapped BOOLEAN DEFAULT TRUE,
    personal_message TEXT
);

-- Gift History
CREATE TABLE IF NOT EXISTS gift_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gift_id VARCHAR(255) NOT NULL,
    gift_type VARCHAR(50) NOT NULL,
    from_player_id VARCHAR(255) NOT NULL,
    to_player_id VARCHAR(255) NOT NULL,
    message TEXT,
    reaction VARCHAR(100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_public BOOLEAN DEFAULT TRUE
);

-- Wishlist Items
CREATE TABLE IF NOT EXISTS wishlist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    price INTEGER,
    is_public BOOLEAN DEFAULT TRUE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_fulfilled BOOLEAN DEFAULT FALSE,
    fulfilled_by VARCHAR(255),
    fulfilled_at TIMESTAMP
);

-- Limited Edition Gifts
CREATE TABLE IF NOT EXISTS limited_edition_gifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    edition_size INTEGER NOT NULL,
    current_supply INTEGER DEFAULT 0,
    price INTEGER NOT NULL,
    available_until TIMESTAMP NOT NULL,
    exclusivity_level VARCHAR(50) NOT NULL
);

-- Seasonal Gifts
CREATE TABLE IF NOT EXISTS seasonal_gifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    season VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    availability VARCHAR(50) NOT NULL,
    special_effects TEXT[]
);

-- Gift Reactions
CREATE TABLE IF NOT EXISTS gift_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gift_id VARCHAR(255) NOT NULL,
    player_id VARCHAR(255) NOT NULL,
    reaction VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(gift_id, player_id)
);

-- Gift Comments
CREATE TABLE IF NOT EXISTS gift_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gift_id VARCHAR(255) NOT NULL,
    player_id VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP
);

-- ========================================
-- MARKETPLACE ECOSYSTEM TABLES
-- ========================================

-- Marketplace Ecosystem main table
CREATE TABLE IF NOT EXISTS marketplace_ecosystems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) UNIQUE NOT NULL,
    trader_rank VARCHAR(50) DEFAULT 'NEWCOMER',
    reputation_score INTEGER DEFAULT 0,
    verification_level VARCHAR(50) DEFAULT 'BASIC',
    has_storefront BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Marketplace Listings
CREATE TABLE IF NOT EXISTS marketplace_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id VARCHAR(255) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    item_type VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL,
    currency VARCHAR(20) DEFAULT 'PWR_TOKEN',
    negotiable BOOLEAN DEFAULT FALSE,
    minimum_offer INTEGER,
    images JSONB,
    video VARCHAR(500),
    condition VARCHAR(50) NOT NULL,
    quality VARCHAR(50) NOT NULL,
    authenticity VARCHAR(50),
    shipping_options JSONB NOT NULL,
    estimated_delivery_time INTEGER DEFAULT 7,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    featured BOOLEAN DEFAULT FALSE,
    promoted BOOLEAN DEFAULT FALSE,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    inquiries INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    sold_at TIMESTAMP
);

-- Storefronts
CREATE TABLE IF NOT EXISTS storefronts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    tags JSONB,
    logo VARCHAR(500),
    banner VARCHAR(500),
    return_policy JSONB,
    shipping_policy JSONB,
    payment_methods JSONB,
    total_sales INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    features JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sold Items
CREATE TABLE IF NOT EXISTS sold_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES marketplace_listings(id),
    buyer_id VARCHAR(255) NOT NULL,
    seller_id VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    currency VARCHAR(20) NOT NULL,
    commission INTEGER DEFAULT 0,
    net_earnings INTEGER DEFAULT 0,
    sold_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    feedback JSONB
);

-- Purchased Items
CREATE TABLE IF NOT EXISTS purchased_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES marketplace_listings(id),
    seller_id VARCHAR(255) NOT NULL,
    buyer_id VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    currency VARCHAR(20) NOT NULL,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_status VARCHAR(50) DEFAULT 'PENDING',
    feedback JSONB
);

-- Marketplace Transactions
CREATE TABLE IF NOT EXISTS marketplace_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES marketplace_listings(id),
    buyer_id VARCHAR(255) NOT NULL,
    seller_id VARCHAR(255) NOT NULL,
    offer_price INTEGER NOT NULL,
    currency VARCHAR(20) NOT NULL,
    message TEXT,
    shipping_option JSONB,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- CHARITY ECOSYSTEM TABLES
-- ========================================

-- Charity Ecosystem main table
CREATE TABLE IF NOT EXISTS charity_ecosystems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) UNIQUE NOT NULL,
    giver_rank VARCHAR(50) DEFAULT 'HELPER',
    impact_score INTEGER DEFAULT 0,
    generosity_level VARCHAR(50) DEFAULT 'EMERGING',
    total_donated INTEGER DEFAULT 0,
    lives_impacted INTEGER DEFAULT 0,
    projects_funded INTEGER DEFAULT 0,
    communities_helped INTEGER DEFAULT 0,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_donation_at TIMESTAMP
);

-- Charities
CREATE TABLE IF NOT EXISTS charities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    logo VARCHAR(500),
    verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0,
    total_donations_received INTEGER DEFAULT 0
);

-- Donation History
CREATE TABLE IF NOT EXISTS donation_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    charity_id UUID NOT NULL REFERENCES charities(id),
    amount INTEGER NOT NULL,
    currency VARCHAR(20) DEFAULT 'PWR_TOKEN',
    cause VARCHAR(100) NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    message TEXT,
    matching_amount INTEGER DEFAULT 0,
    impact_description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recurring Donations
CREATE TABLE IF NOT EXISTS recurring_donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    charity_id UUID NOT NULL REFERENCES charities(id),
    amount INTEGER NOT NULL,
    currency VARCHAR(20) DEFAULT 'PWR_TOKEN',
    frequency VARCHAR(20) NOT NULL,
    next_donation_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP
);

-- Supported Causes
CREATE TABLE IF NOT EXISTS supported_causes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    cause_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    total_donated INTEGER DEFAULT 0,
    donation_count INTEGER DEFAULT 0,
    first_donated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_donated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, cause_id)
);

-- Charity Badges
CREATE TABLE IF NOT EXISTS charity_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    rarity VARCHAR(50) NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    criteria TEXT
);

-- Charity Challenges
CREATE TABLE IF NOT EXISTS charity_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    goal INTEGER NOT NULL,
    current_progress INTEGER DEFAULT 0,
    deadline TIMESTAMP NOT NULL,
    participants JSONB,
    rewards JSONB,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP
);

-- ========================================
-- LEADERBOARD ECOSYSTEM TABLES
-- ========================================

-- Leaderboard Ecosystem main table
CREATE TABLE IF NOT EXISTS leaderboard_ecosystems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) UNIQUE NOT NULL,
    global_rank INTEGER DEFAULT 0,
    regional_rank INTEGER DEFAULT 0,
    community_rank INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    weekly_points INTEGER DEFAULT 0,
    monthly_points INTEGER DEFAULT 0,
    all_time_points INTEGER DEFAULT 0,
    win_rate DECIMAL(5,2) DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_competed_at TIMESTAMP
);

-- Category Ranks
CREATE TABLE IF NOT EXISTS category_ranks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    rank INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    tier VARCHAR(50) NOT NULL,
    UNIQUE(player_id, category)
);

-- Competitions
CREATE TABLE IF NOT EXISTS competitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    entry_fee INTEGER DEFAULT 0,
    prize_pool JSONB,
    max_participants INTEGER,
    status VARCHAR(50) DEFAULT 'UPCOMING'
);

-- Competition Participants
CREATE TABLE IF NOT EXISTS competition_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID NOT NULL REFERENCES competitions(id),
    player_id VARCHAR(255) NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    current_points INTEGER DEFAULT 0,
    position INTEGER,
    UNIQUE(competition_id, player_id)
);

-- Competition History
CREATE TABLE IF NOT EXISTS competition_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    competition_id UUID NOT NULL REFERENCES competitions(id),
    competition_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    position INTEGER,
    participants INTEGER,
    points INTEGER,
    rewards JSONB,
    competed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leaderboard Achievements
CREATE TABLE IF NOT EXISTS leaderboard_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    achievement_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    requirement INTEGER,
    reward JSONB,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, achievement_id)
);

-- Leaderboard Milestones
CREATE TABLE IF NOT EXISTS leaderboard_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    milestone_id VARCHAR(255) NOT NULL,
    level INTEGER NOT NULL,
    required_points INTEGER,
    rewards JSONB,
    is_unlocked BOOLEAN DEFAULT FALSE,
    unlocked_at TIMESTAMP,
    UNIQUE(player_id, milestone_id)
);

-- ========================================
-- TASKSBOARD ECOSYSTEM TABLES
-- ========================================

-- TasksBoard Ecosystem main table
CREATE TABLE IF NOT EXISTS tasksboard_ecosystems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) UNIQUE NOT NULL,
    total_tasks_completed INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    average_completion_time INTEGER DEFAULT 0,
    productivity_score INTEGER DEFAULT 0,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_task_completed_at TIMESTAMP
);

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    complexity VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'TODO',
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP,
    completed_at TIMESTAMP,
    estimated_duration INTEGER DEFAULT 60,
    actual_duration INTEGER,
    assigned_to VARCHAR(255) NOT NULL,
    assigned_by VARCHAR(255) NOT NULL,
    dependencies JSONB,
    tags JSONB,
    labels JSONB,
    metadata JSONB
);

-- Subtasks
CREATE TABLE IF NOT EXISTS subtasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    order_index INTEGER DEFAULT 0
);

-- Task Collaborators
CREATE TABLE IF NOT EXISTS task_collaborators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    player_id VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    contribution INTEGER DEFAULT 0,
    UNIQUE(task_id, player_id)
);

-- Task Comments
CREATE TABLE IF NOT EXISTS task_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    player_id VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP
);

-- Task Attachments
CREATE TABLE IF NOT EXISTS task_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size INTEGER NOT NULL,
    url VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Task Categories
CREATE TABLE IF NOT EXISTS task_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(20) DEFAULT '#007bff',
    icon VARCHAR(50),
    task_count INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    UNIQUE(player_id, name)
);

-- Task Templates
CREATE TABLE IF NOT EXISTS task_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    default_priority VARCHAR(20) NOT NULL,
    default_complexity VARCHAR(20) NOT NULL,
    estimated_duration INTEGER NOT NULL,
    checklist JSONB,
    tags JSONB,
    usage_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT FALSE,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Automated Tasks
CREATE TABLE IF NOT EXISTS automated_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    template_id UUID NOT NULL REFERENCES task_templates(id),
    schedule JSONB NOT NULL,
    last_run TIMESTAMP,
    next_run TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team Projects
CREATE TABLE IF NOT EXISTS team_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'PLANNING',
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    progress INTEGER DEFAULT 0,
    budget JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team Members
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES team_projects(id) ON DELETE CASCADE,
    player_id VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    contribution INTEGER DEFAULT 0,
    UNIQUE(project_id, player_id)
);

-- Task Streaks
CREATE TABLE IF NOT EXISTS task_streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL,
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, type)
);

-- ========================================
-- SUPER ADMIN DASHBOARD TABLES
-- ========================================

-- Super Admin Dashboard
CREATE TABLE IF NOT EXISTS super_admin_dashboard (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id VARCHAR(255) UNIQUE NOT NULL,
    access_level VARCHAR(50) NOT NULL,
    permissions JSONB NOT NULL,
    system_stats JSONB,
    user_stats JSONB,
    economy_stats JSONB,
    last_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_duration INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Action Log
CREATE TABLE IF NOT EXISTS admin_action_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id VARCHAR(255) NOT NULL,
    reason TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System Settings
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System Logs
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    context JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Flags
CREATE TABLE IF NOT EXISTS user_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    reason TEXT NOT NULL,
    flagged_by VARCHAR(255) NOT NULL,
    flagged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Content Moderation
CREATE TABLE IF NOT EXISTS content_moderation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_type VARCHAR(50) NOT NULL,
    content_id VARCHAR(255) NOT NULL,
    reported_by VARCHAR(255),
    reason TEXT,
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    status VARCHAR(50) DEFAULT 'PENDING',
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMP,
    review_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Stars Ecosystem Indexes
CREATE INDEX IF NOT EXISTS idx_stars_ecosystems_player_id ON stars_ecosystems(player_id);
CREATE INDEX IF NOT EXISTS idx_star_inventory_player_id ON star_inventory(player_id);
CREATE INDEX IF NOT EXISTS idx_star_transactions_player_id ON star_transactions(player_id);

-- Diamonds Ecosystem Indexes
CREATE INDEX IF NOT EXISTS idx_diamonds_ecosystems_player_id ON diamonds_ecosystems(player_id);
CREATE INDEX IF NOT EXISTS idx_diamond_inventory_player_id ON diamond_inventory(player_id);
CREATE INDEX IF NOT EXISTS idx_diamond_transactions_player_id ON diamond_transactions(player_id);

-- Gifts Ecosystem Indexes
CREATE INDEX IF NOT EXISTS idx_gifts_ecosystems_player_id ON gifts_ecosystems(player_id);
CREATE INDEX IF NOT EXISTS idx_gift_inventory_player_id ON gift_inventory(player_id);
CREATE INDEX IF NOT EXISTS idx_gift_history_from_player ON gift_history(from_player_id);
CREATE INDEX IF NOT EXISTS idx_gift_history_to_player ON gift_history(to_player_id);

-- Marketplace Ecosystem Indexes
CREATE INDEX IF NOT EXISTS idx_marketplace_ecosystems_player_id ON marketplace_ecosystems(player_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_seller_id ON marketplace_listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_status ON marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_transactions_buyer_id ON marketplace_transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_transactions_seller_id ON marketplace_transactions(seller_id);

-- Charity Ecosystem Indexes
CREATE INDEX IF NOT EXISTS idx_charity_ecosystems_player_id ON charity_ecosystems(player_id);
CREATE INDEX IF NOT EXISTS idx_donation_history_player_id ON donation_history(player_id);
CREATE INDEX IF NOT EXISTS idx_donation_history_charity_id ON donation_history(charity_id);

-- Leaderboard Ecosystem Indexes
CREATE INDEX IF NOT EXISTS idx_leaderboard_ecosystems_player_id ON leaderboard_ecosystems(player_id);
CREATE INDEX IF NOT EXISTS idx_category_ranks_player_id ON category_ranks(player_id);
CREATE INDEX IF NOT EXISTS idx_competition_participants_player_id ON competition_participants(player_id);

-- TasksBoard Ecosystem Indexes
CREATE INDEX IF NOT EXISTS idx_tasksboard_ecosystems_player_id ON tasksboard_ecosystems(player_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- Admin Dashboard Indexes
CREATE INDEX IF NOT EXISTS idx_admin_dashboard_admin_id ON super_admin_dashboard(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_action_log_admin_id ON admin_action_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_action_log_timestamp ON admin_action_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_system_logs_timestamp ON system_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level);

-- ========================================
-- TRIGGERS FOR UPDATED_AT
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for tables with updated_at
CREATE TRIGGER update_stars_ecosystems_updated_at BEFORE UPDATE ON stars_ecosystems 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diamonds_ecosystems_updated_at BEFORE UPDATE ON diamonds_ecosystems 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gifts_ecosystems_updated_at BEFORE UPDATE ON gifts_ecosystems 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketplace_listings_updated_at BEFORE UPDATE ON marketplace_listings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_super_admin_dashboard_updated_at BEFORE UPDATE ON super_admin_dashboard 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- MIGRATION COMPLETION
-- ========================================

-- Insert initial system settings
INSERT INTO system_settings (key, value) VALUES 
    ('maintenance_mode', '{"enabled": false, "message": "System under maintenance"}'),
    ('ecosystem_settings', '{"max_daily_transactions": 1000, "min_transaction_amount": 1}'),
    ('admin_settings', '{"session_timeout": 3600, "max_login_attempts": 5}')
ON CONFLICT (key) DO NOTHING;

-- Create initial admin user (if needed)
-- This would typically be done through a separate secure process
-- INSERT INTO super_admin_dashboard (admin_id, access_level, permissions) VALUES 
--     ('admin_001', 'SYSTEM_OWNER', '{"all": true}');

COMMIT;
