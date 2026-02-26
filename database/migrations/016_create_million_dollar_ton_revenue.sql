-- Million Dollar TON Revenue Database Schema
-- Supporting 1M TON/day revenue generation for Super Admin

-- Premium Civilization Memberships
CREATE TABLE IF NOT EXISTS premium_memberships (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    membership_tier VARCHAR(50) NOT NULL, -- Citizen Plus, Noble, Elite, Royal, Imperial, Legendary, Mythic
    price_ton INTEGER NOT NULL,
    start_date TIMESTAMP DEFAULT NOW(),
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    auto_renew BOOLEAN DEFAULT false,
    benefits JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Virtual Real Estate Properties
CREATE TABLE IF NOT EXISTS virtual_properties (
    id SERIAL PRIMARY KEY,
    property_id VARCHAR(100) UNIQUE NOT NULL,
    owner_id VARCHAR(50),
    property_type VARCHAR(50) NOT NULL, -- Residential, Commercial, Luxury, District
    location_x INTEGER,
    location_y INTEGER,
    size_sqm INTEGER,
    base_price_ton INTEGER NOT NULL,
    current_value_ton INTEGER,
    monthly_tax_ton INTEGER DEFAULT 0,
    purchase_date TIMESTAMP,
    last_tax_payment TIMESTAMP,
    upgrades JSONB,
    is_listed BOOLEAN DEFAULT false,
    listing_price_ton INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Education Courses & Certifications
CREATE TABLE IF NOT EXISTS education_courses (
    id SERIAL PRIMARY KEY,
    course_id VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    instructor_id VARCHAR(50),
    price_ton INTEGER NOT NULL,
    certification_price_ton INTEGER,
    duration_hours INTEGER,
            difficulty_level VARCHAR(20),
    enrollment_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_enrollments (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    course_id VARCHAR(100) REFERENCES education_courses(course_id),
    enrollment_date TIMESTAMP DEFAULT NOW(),
    completion_date TIMESTAMP,
    progress_percentage INTEGER DEFAULT 0,
    certificate_earned BOOLEAN DEFAULT false,
    paid_amount_ton INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Gaming & Entertainment
CREATE TABLE IF NOT EXISTS gaming_transactions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- in_game_purchase, tournament_entry, virtual_item
    game_id VARCHAR(100),
    item_name VARCHAR(255),
    amount_ton INTEGER NOT NULL,
    transaction_date TIMESTAMP DEFAULT NOW(),
    metadata JSONB
);

CREATE TABLE IF NOT EXISTS entertainment_events (
    id SERIAL PRIMARY KEY,
    event_id VARCHAR(100) UNIQUE NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- concert, tournament, virtual_event
    title VARCHAR(255) NOT NULL,
    price_ton INTEGER NOT NULL,
    max_attendees INTEGER,
    current_attendees INTEGER DEFAULT 0,
    event_date TIMESTAMP,
    organizer_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Business Marketplace
CREATE TABLE IF NOT EXISTS business_listings (
    id SERIAL PRIMARY KEY,
    listing_id VARCHAR(100) UNIQUE NOT NULL,
    business_id VARCHAR(50) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price_ton INTEGER NOT NULL,
    commission_rate DECIMAL(5,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS business_transactions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    business_id VARCHAR(50) NOT NULL,
    listing_id VARCHAR(100) REFERENCES business_listings(listing_id),
    amount_ton INTEGER NOT NULL,
    commission_ton INTEGER NOT NULL,
    transaction_date TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'completed'
);

-- Social Influence & Creator Economy
CREATE TABLE IF NOT EXISTS creator_profiles (
    id SERIAL PRIMARY KEY,
    creator_id VARCHAR(50) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    follower_count INTEGER DEFAULT 0,
    content_category VARCHAR(100),
    subscription_price_ton INTEGER DEFAULT 0,
    total_earnings_ton BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fan_subscriptions (
    id SERIAL PRIMARY KEY,
    fan_id VARCHAR(50) NOT NULL,
    creator_id VARCHAR(50) REFERENCES creator_profiles(creator_id),
    subscription_price_ton INTEGER NOT NULL,
    start_date TIMESTAMP DEFAULT NOW(),
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS virtual_gifts (
    id SERIAL PRIMARY KEY,
    sender_id VARCHAR(50) NOT NULL,
    receiver_id VARCHAR(50) NOT NULL,
    creator_id VARCHAR(50),
    gift_type VARCHAR(100) NOT NULL,
    gift_value_ton INTEGER NOT NULL,
    platform_cut_ton INTEGER NOT NULL,
    creator_share_ton INTEGER NOT NULL,
    sent_date TIMESTAMP DEFAULT NOW()
);

-- Health & Wellness Services
CREATE TABLE IF NOT EXISTS wellness_programs (
    id SERIAL PRIMARY KEY,
    program_id VARCHAR(100) UNIQUE NOT NULL,
    program_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- fitness, nutrition, mental_health, meditation
        price_ton INTEGER NOT NULL,
    duration_days INTEGER,
    provider_id VARCHAR(50),
    is_subscription BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_wellness_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    program_id VARCHAR(100) REFERENCES wellness_programs(program_id),
    start_date TIMESTAMP DEFAULT NOW(),
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    paid_amount_ton INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Luxury Lifestyle Experiences
CREATE TABLE IF NOT EXISTS luxury_items (
    id SERIAL PRIMARY KEY,
    item_id VARCHAR(100) UNIQUE NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- virtual_real_estate, digital_art, luxury_vehicles, fashion
    price_ton INTEGER NOT NULL,
    rarity_level VARCHAR(20), -- common, rare, epic, legendary
    owner_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS luxury_experiences (
    id SERIAL PRIMARY KEY,
    experience_id VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price_ton INTEGER NOT NULL,
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    experience_date TIMESTAMP,
    exclusivity_level VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Revenue Tracking for Super Admin
CREATE TABLE IF NOT EXISTS daily_revenue_summary (
    id SERIAL PRIMARY KEY,
    revenue_date DATE NOT NULL,
    membership_revenue BIGINT DEFAULT 0,
    property_revenue BIGINT DEFAULT 0,
    education_revenue BIGINT DEFAULT 0,
    gaming_revenue BIGINT DEFAULT 0,
    business_revenue BIGINT DEFAULT 0,
    social_revenue BIGINT DEFAULT 0,
    wellness_revenue BIGINT DEFAULT 0,
    luxury_revenue BIGINT DEFAULT 0,
    total_revenue BIGINT DEFAULT 0,
    super_admin_commission BIGINT DEFAULT 0,
    unique_users INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS revenue_mechanisms_performance (
    id SERIAL PRIMARY KEY,
    mechanism_id VARCHAR(100) NOT NULL,
    performance_date DATE NOT NULL,
    daily_revenue BIGINT DEFAULT 0,
    daily_transactions INTEGER DEFAULT 0,
    active_users INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2),
    average_transaction_value DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- User Analytics
CREATE TABLE IF NOT EXISTS user_spending_analytics (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    spending_date DATE NOT NULL,
    total_spent_ton BIGINT DEFAULT 0,
    transaction_count INTEGER DEFAULT 0,
    categories_spent JSONB,
    membership_tier VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Super Admin Commission Tracking
CREATE TABLE IF NOT EXISTS super_admin_commissions (
    id SERIAL PRIMARY KEY,
    commission_date DATE NOT NULL,
    source_mechanism VARCHAR(100) NOT NULL,
    gross_revenue BIGINT NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    commission_amount BIGINT NOT NULL,
    is_paid BOOLEAN DEFAULT false,
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_premium_memberships_user ON premium_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_premium_memberships_tier ON premium_memberships(membership_tier);
CREATE INDEX IF NOT EXISTS idx_virtual_properties_owner ON virtual_properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_virtual_properties_type ON virtual_properties(property_type);
CREATE INDEX IF NOT EXISTS idx_user_enrollments_user ON user_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_enrollments_course ON user_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_gaming_transactions_user ON gaming_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_gaming_transactions_date ON gaming_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_business_transactions_user ON business_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_business_transactions_date ON business_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_fan_subscriptions_fan ON fan_subscriptions(fan_id);
CREATE INDEX IF NOT EXISTS idx_fan_subscriptions_creator ON fan_subscriptions(creator_id);
CREATE INDEX IF NOT EXISTS idx_daily_revenue_summary_date ON daily_revenue_summary(revenue_date);
CREATE INDEX IF NOT EXISTS idx_user_spending_analytics_user ON user_spending_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_spending_analytics_date ON user_spending_analytics(spending_date);

-- Create triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_premium_memberships_updated_at BEFORE UPDATE ON premium_memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_virtual_properties_updated_at BEFORE UPDATE ON virtual_properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for daily revenue dashboard
CREATE OR REPLACE VIEW super_admin_daily_revenue AS
SELECT 
    drs.revenue_date,
    drs.membership_revenue,
    drs.property_revenue,
    drs.education_revenue,
    drs.gaming_revenue,
    drs.business_revenue,
    drs.social_revenue,
    drs.wellness_revenue,
    drs.luxury_revenue,
    drs.total_revenue,
    drs.super_admin_commission,
    drs.unique_users,
    CASE 
        WHEN drs.super_admin_commission >= 1000000 THEN 'TARGET_ACHIEVED'
        WHEN drs.super_admin_commission >= 500000 THEN 'ABOVE_TARGET'
        WHEN drs.super_admin_commission >= 100000 THEN 'ON_TRACK'
        ELSE 'BELOW_TARGET'
    END as target_status
FROM daily_revenue_summary drs
ORDER BY drs.revenue_date DESC;

-- Create view for mechanism performance
CREATE OR REPLACE VIEW mechanism_performance_summary AS
SELECT 
    mechanism_id,
    AVG(daily_revenue) as avg_daily_revenue,
    SUM(daily_revenue) as total_revenue,
    AVG(daily_transactions) as avg_daily_transactions,
    AVG(active_users) as avg_active_users,
    AVG(conversion_rate) as avg_conversion_rate,
    AVG(average_transaction_value) as avg_transaction_value,
    COUNT(*) as days_tracked
FROM revenue_mechanisms_performance
WHERE performance_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY mechanism_id
ORDER BY avg_daily_revenue DESC;

-- Insert initial luxury items
INSERT INTO luxury_items (item_id, item_name, category, price_ton, rarity_level) VALUES
('luxury_villa_001', 'Oceanfront Virtual Villa', 'virtual_real_estate', 10000, 'legendary'),
('luxury_yacht_001', 'Digital Superyacht', 'luxury_vehicles', 5000, 'epic'),
('luxury_art_001', 'Genesis NFT Collection', 'digital_art', 2500, 'legendary'),
('luxury_fashion_001', 'Designer Virtual Wardrobe', 'fashion', 1000, 'rare')
ON CONFLICT (item_id) DO NOTHING;

-- Insert initial wellness programs
INSERT INTO wellness_programs (program_id, program_name, category, price_ton, duration_days, is_subscription) VALUES
('fitness_premium', 'Premium Fitness Plan', 'fitness', 100, 30, true),
('nutrition_pro', 'Professional Nutrition Coaching', 'nutrition', 150, 90, true),
('meditation_mastery', 'Meditation Mastery Course', 'meditation', 75, 60, false),
('mental_wellness', 'Mental Wellness Program', 'mental_health', 200, 90, true)
ON CONFLICT (program_id) DO NOTHING;
