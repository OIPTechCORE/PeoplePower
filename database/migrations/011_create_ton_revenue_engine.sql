-- ===================================
-- TON SUPER ADMIN REVENUE ENGINE DATABASE SCHEMA
-- 100,000+ TON/DAY REVENUE GENERATION SYSTEM
-- ===================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================
-- USER PURCHASE MANAGEMENT
-- ===================================

-- User purchased benefits and assets
CREATE TABLE user_purchased_benefits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    benefit_type VARCHAR(100) NOT NULL,
    benefit_data JSONB DEFAULT '{}',
    duration_hours INTEGER DEFAULT 0,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true NOT NULL,
    
    UNIQUE(user_id, benefit_type)
);

-- User asset portfolio
CREATE TABLE user_asset_portfolio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    asset_category VARCHAR(50) NOT NULL,
    asset_id VARCHAR(100) NOT NULL,
    asset_name VARCHAR(200) NOT NULL,
    purchase_price DECIMAL(15,4) NOT NULL,
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    asset_data JSONB DEFAULT '{}',
    
    UNIQUE(user_id, asset_id)
);

-- User purchase history
CREATE TABLE user_purchase_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    product_id VARCHAR(100) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(15,4) NOT NULL,
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    transaction_hash VARCHAR(100),
    benefit_granted BOOLEAN DEFAULT false NOT NULL,
    metadata JSONB DEFAULT '{}'
);

-- ===================================
-- SUPER ADMIN REVENUE TRACKING
-- ===================================

-- Super admin revenue records
CREATE TABLE super_admin_revenue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount DECIMAL(15,4) NOT NULL,
    category VARCHAR(50) NOT NULL,
    product_id VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES players(id) ON DELETE SET NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source VARCHAR(50) DEFAULT 'TON_PURCHASE',
    transaction_hash VARCHAR(100),
    metadata JSONB DEFAULT '{}'
);

-- Revenue dashboard cache for fast access
CREATE TABLE revenue_dashboard_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE UNIQUE NOT NULL,
    total_revenue DECIMAL(15,4) NOT NULL DEFAULT 0.0000,
    target_progress DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    revenue_breakdown JSONB DEFAULT '[]',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- PRODUCT CATALOG MANAGEMENT
-- ===================================

-- Product catalog
CREATE TABLE ton_product_catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id VARCHAR(100) UNIQUE NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    user_category VARCHAR(50) NOT NULL,
    price DECIMAL(15,4) NOT NULL,
    reputation_reward INTEGER DEFAULT 0,
    duration_hours INTEGER DEFAULT 0,
    benefit_type VARCHAR(100),
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product usage statistics
CREATE TABLE product_usage_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id VARCHAR(100) NOT NULL,
    usage_date DATE NOT NULL,
    purchase_count INTEGER NOT NULL DEFAULT 0,
    total_revenue DECIMAL(15,4) NOT NULL DEFAULT 0.0000,
    unique_users INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(product_id, usage_date)
);

-- ===================================
-- TON PAYMENT INTEGRATION
-- ===================================

-- TON payment transactions
CREATE TABLE ton_payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    transaction_hash VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(15,4) NOT NULL,
    from_address VARCHAR(100) NOT NULL,
    to_address VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
    block_number BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'
);

-- TON wallet addresses for Super Admin
CREATE TABLE super_admin_ton_wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address VARCHAR(100) UNIQUE NOT NULL,
    wallet_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used TIMESTAMP WITH TIME ZONE
);

-- ===================================
-- USER SEGMENTATION ANALYTICS
-- ===================================

-- User spending segments
CREATE TABLE user_spending_segments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    segment VARCHAR(20) NOT NULL CHECK (segment IN ('casual', 'power', 'investor', 'institutional')),
    total_spent DECIMAL(15,4) NOT NULL DEFAULT 0.0000,
    purchase_count INTEGER NOT NULL DEFAULT 0,
    avg_purchase DECIMAL(15,4) NOT NULL DEFAULT 0.0000,
    first_purchase_date TIMESTAMP WITH TIME ZONE,
    last_purchase_date TIMESTAMP WITH TIME ZONE,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Daily user activity for segmentation
CREATE TABLE daily_user_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    login_count INTEGER DEFAULT 0,
    purchase_count INTEGER DEFAULT 0,
    total_spent DECIMAL(15,4) DEFAULT 0.0000,
    session_duration_minutes INTEGER DEFAULT 0,
    actions_completed INTEGER DEFAULT 0,
    
    UNIQUE(user_id, activity_date)
);

-- ===================================
-- REVENUE OPTIMIZATION
-- ===================================

-- Revenue optimization experiments
CREATE TABLE revenue_experiments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_name VARCHAR(200) NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true NOT NULL,
    target_metric VARCHAR(100) NOT NULL,
    baseline_value DECIMAL(15,4),
    target_value DECIMAL(15,4),
    actual_value DECIMAL(15,4),
    confidence_level DECIMAL(5,4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experiment assignments
CREATE TABLE experiment_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id UUID NOT NULL REFERENCES revenue_experiments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    variant VARCHAR(50) NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(experiment_id, user_id)
);

-- ===================================
-- PERFORMANCE INDEXES
-- ===================================

-- User purchase indexes
CREATE INDEX idx_user_purchase_history_user_id ON user_purchase_history(user_id);
CREATE INDEX idx_user_purchase_history_purchase_date ON user_purchase_history(purchase_date DESC);
CREATE INDEX idx_user_purchase_history_category ON user_purchase_history(category);

-- Revenue tracking indexes
CREATE INDEX idx_super_admin_revenue_recorded_at ON super_admin_revenue(recorded_at DESC);
CREATE INDEX idx_super_admin_revenue_category ON super_admin_revenue(category);
CREATE INDEX idx_super_admin_revenue_date_category ON super_admin_revenue(DATE(recorded_at), category);

-- Dashboard cache indexes
CREATE INDEX idx_revenue_dashboard_cache_date ON revenue_dashboard_cache(date DESC);

-- Product catalog indexes
CREATE INDEX idx_ton_product_catalog_category ON ton_product_catalog(category);
CREATE INDEX idx_ton_product_catalog_user_category ON ton_product_catalog(user_category);
CREATE INDEX idx_ton_product_catalog_active ON ton_product_catalog(is_active);

-- Payment transaction indexes
CREATE INDEX idx_ton_payment_transactions_user_id ON ton_payment_transactions(user_id);
CREATE INDEX idx_ton_payment_transactions_status ON ton_payment_transactions(status);
CREATE INDEX idx_ton_payment_transactions_created_at ON ton_payment_transactions(created_at DESC);

-- User segmentation indexes
CREATE INDEX idx_user_spending_segments_segment ON user_spending_segments(segment);
CREATE INDEX idx_user_spending_segments_total_spent ON user_spending_segments(total_spent DESC);

-- Daily activity indexes
CREATE INDEX idx_daily_user_activity_user_id ON daily_user_activity(user_id);
CREATE INDEX idx_daily_user_activity_date ON daily_user_activity(activity_date DESC);

-- Product usage stats indexes
CREATE INDEX idx_product_usage_stats_product_id ON product_usage_stats(product_id);
CREATE INDEX idx_product_usage_stats_usage_date ON product_usage_stats(usage_date DESC);

-- ===================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ===================================

-- Update user spending segment after purchase
CREATE OR REPLACE FUNCTION update_user_spending_segment()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_spending_segments (id, user_id, segment, total_spent, purchase_count, avg_purchase, first_purchase_date, last_purchase_date, calculated_at)
    VALUES (
        uuid_generate_v4(),
        NEW.user_id,
        CASE 
            WHEN NEW.price < 100 THEN 'casual'
            WHEN NEW.price < 1000 THEN 'power'
            WHEN NEW.price < 10000 THEN 'investor'
            ELSE 'institutional'
        END,
        COALESCE((SELECT total_spent FROM user_spending_segments WHERE user_id = NEW.user_id), 0) + NEW.price,
        COALESCE((SELECT purchase_count FROM user_spending_segments WHERE user_id = NEW.user_id), 0) + 1,
        (COALESCE((SELECT total_spent FROM user_spending_segments WHERE user_id = NEW.user_id), 0) + NEW.price) / 
        (COALESCE((SELECT purchase_count FROM user_spending_segments WHERE user_id = NEW.user_id), 0) + 1),
        COALESCE((SELECT first_purchase_date FROM user_spending_segments WHERE user_id = NEW.user_id), NEW.purchase_date),
        NEW.purchase_date,
        NOW()
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET
        segment = CASE 
            WHEN EXCLUDED.total_spent + NEW.price < 100 THEN 'casual'
            WHEN EXCLUDED.total_spent + NEW.price < 1000 THEN 'power'
            WHEN EXCLUDED.total_spent + NEW.price < 10000 THEN 'investor'
            ELSE 'institutional'
        END,
        total_spent = EXCLUDED.total_spent + NEW.price,
        purchase_count = EXCLUDED.purchase_count + 1,
        avg_purchase = (EXCLUDED.total_spent + NEW.price) / (EXCLUDED.purchase_count + 1),
        last_purchase_date = NEW.purchase_date,
        calculated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_spending_segment
    AFTER INSERT ON user_purchase_history
    FOR EACH ROW EXECUTE FUNCTION update_user_spending_segment();

-- Update product usage stats
CREATE OR REPLACE FUNCTION update_product_usage_stats()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO product_usage_stats (id, product_id, usage_date, purchase_count, total_revenue, unique_users)
    VALUES (
        uuid_generate_v4(),
        NEW.product_id,
        DATE(NEW.purchase_date),
        1,
        NEW.price,
        1
    )
    ON CONFLICT (product_id, usage_date) 
    DO UPDATE SET
        purchase_count = product_usage_stats.purchase_count + 1,
        total_revenue = product_usage_stats.total_revenue + NEW.price,
        unique_users = (
            SELECT COUNT(DISTINCT user_id) 
            FROM user_purchase_history 
            WHERE product_id = NEW.product_id 
            AND DATE(purchase_date) = DATE(NEW.purchase_date)
        );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_product_usage_stats
    AFTER INSERT ON user_purchase_history
    FOR EACH ROW EXECUTE FUNCTION update_product_usage_stats();

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ton_product_catalog_updated_at 
    BEFORE UPDATE ON ton_product_catalog
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- INITIAL DATA SETUP
-- ===================================

-- Insert Super Admin TON wallets
INSERT INTO super_admin_ton_wallets (id, wallet_address, wallet_name) VALUES
(uuid_generate_v4(), 'EQD...', 'Main Revenue Wallet'),
(uuid_generate_v4(), 'EQB...', 'Secondary Revenue Wallet'),
(uuid_generate_v4(), 'EQC...', 'Reserve Wallet');

-- Insert initial product catalog
INSERT INTO ton_product_catalog (id, product_id, product_name, description, category, user_category, price, reputation_reward, duration_hours, benefit_type) VALUES
-- Reputation Boost Products
(uuid_generate_v4(), 'daily_boost', 'Daily Reputation Boost', '+50 reputation for 24 hours', 'reputationBoost', 'casual', 5, 50, 24, 'reputation_boost'),
(uuid_generate_v4(), 'weekly_package', 'Weekly Reputation Package', '+350 reputation for 7 days', 'reputationBoost', 'casual', 25, 350, 168, 'reputation_boost'),
(uuid_generate_v4(), 'monthly_accelerator', 'Monthly Reputation Accelerator', '+1,500 reputation for 30 days', 'reputationBoost', 'casual', 80, 1500, 720, 'reputation_boost'),
(uuid_generate_v4(), 'professional_package', 'Professional Reputation Package', '+5,000 reputation instantly', 'reputationBoost', 'power', 200, 5000, 0, 'reputation_boost'),
(uuid_generate_v4(), 'whale_package', 'Whale Reputation Package', '+50,000 reputation instantly', 'reputationBoost', 'investor', 2000, 50000, 0, 'reputation_boost'),

-- Education Token Products
(uuid_generate_v4(), 'course_completion_boost', 'Course Completion Boost', 'Instant course pass', 'educationTokens', 'learners', 50, 0, 0, 'instant_course_completion'),
(uuid_generate_v4(), 'skill_certificate', 'Skill Certificate', 'Verified skill credential', 'educationTokens', 'learners', 30, 0, 0, 'verified_skill_credential'),
(uuid_generate_v4(), 'teaching_license', 'Teaching License', 'Monetize knowledge', 'educationTokens', 'educators', 200, 0, 0, 'teaching_monetization'),
(uuid_generate_v4(), 'employee_training_package', 'Employee Training Package', '100 employee licenses', 'educationTokens', 'corporate', 5000, 0, 0, 'employee_licenses_100'),

-- Civilization Asset Products
(uuid_generate_v4(), 'regional_governor', 'Regional Governor', 'Control geographical area', 'civilizationAssets', 'countryInfluence', 1000, 0, 0, 'geographical_control_regional'),
(uuid_generate_v4(), 'country_president', 'Country President', 'National leadership', 'civilizationAssets', 'countryInfluence', 10000, 0, 0, 'national_leadership'),
(uuid_generate_v4(), 'digital_real_estate', 'Digital Real Estate', 'Land in metaverse', 'civilizationAssets', 'infrastructure', 500, 0, 0, 'metaverse_land'),
(uuid_generate_v4(), 'historical_monument', 'Historical Monument', 'Permanent world landmark', 'civilizationAssets', 'cultural', 1000, 0, 0, 'permanent_landmark'),

-- Governance Power Products
(uuid_generate_v4(), 'vote_multiplier', 'Vote Multiplier', '2x voting power', 'governancePower', 'voting', 500, 0, 0, 'voting_power_2x'),
(uuid_generate_v4(), 'proposal_priority', 'Proposal Priority', 'Fast-track governance', 'governancePower', 'voting', 1000, 0, 0, 'governance_fast_track'),
(uuid_generate_v4(), 'reputation_shield', 'Reputation Shield', 'Protection from attacks', 'governancePower', 'protection', 200, 0, 0, 'reputation_protection'),
(uuid_generate_v4(), 'veto_power', 'Veto Power', 'Block unwanted proposals', 'governancePower', 'voting', 5000, 0, 0, 'proposal_veto_power');

-- Initialize revenue dashboard cache
INSERT INTO revenue_dashboard_cache (id, date, total_revenue, target_progress, revenue_breakdown) VALUES
(uuid_generate_v4(), CURRENT_DATE, 0, 0, '[]');
