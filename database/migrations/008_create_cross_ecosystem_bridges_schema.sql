-- ===================================
-- CROSS-ECOSYSTEM BRIDGES SCHEMA
-- "CONNECT YOUR STAKING POWER TO THE ENTIRE CIVILIZATION"
-- ===================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================
-- ECOSYSTEM BRIDGE TRANSACTIONS
-- ===================================
CREATE TABLE ecosystem_bridge_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    
    -- Bridge details
    source_type VARCHAR(20) NOT NULL CHECK (source_type IN ('staking', 'reputation', 'tokens', 'influence')),
    source_id UUID NOT NULL,
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('education', 'infrastructure', 'marketplace', 'community', 'governance')),
    target_id UUID NOT NULL,
    bridge_type VARCHAR(50) NOT NULL,
    
    -- Conversion details
    conversion_rate DECIMAL(10,6) NOT NULL,
    fee_rate DECIMAL(5,4) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    converted_amount DECIMAL(15,2) NOT NULL,
    fee_amount DECIMAL(15,2) NOT NULL,
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    processed_at TIMESTAMP WITH TIME ZONE,
    failure_reason TEXT,
    
    -- Additional data
    metadata JSONB DEFAULT '{}' NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- EDUCATION STAKING ACCESS (Enhanced)
-- ===================================
CREATE TABLE education_staking_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    course_id UUID NOT NULL,
    stake_id UUID NOT NULL REFERENCES reputation_stakes(id) ON DELETE CASCADE,
    
    -- Access details
    access_level VARCHAR(20) NOT NULL CHECK (access_level IN ('basic', 'premium', 'exclusive', 'master')),
    access_granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    access_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Credits and progress
    credits_granted DECIMAL(10,2) NOT NULL,
    credits_used DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    progress_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    
    -- Requirements
    reputation_required DECIMAL(10,2) NOT NULL,
    stake_duration_required INTEGER NOT NULL,
    pool_type_required VARCHAR(50) NOT NULL,
    
    -- Status
    is_active BOOLEAN DEFAULT true NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    certificate_earned BOOLEAN DEFAULT false NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(player_id, course_id, stake_id)
);

-- ===================================
-- INFRASTRUCTURE PROJECTS
-- ===================================
CREATE TABLE infrastructure_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Project details
    project_name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('protocol', 'education', 'community', 'security', 'scaling', 'research')),
    project_type VARCHAR(30) NOT NULL CHECK (project_type IN ('development', 'research', 'maintenance', 'upgrade', 'expansion')),
    
    -- Funding goals
    funding_goal DECIMAL(15,2) NOT NULL,
    current_funding DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    minimum_funding DECIMAL(15,2) NOT NULL,
    
    -- Progress tracking
    current_progress DECIMAL(5,2) NOT NULL DEFAULT 0.00 CHECK (current_progress >= 0 AND current_progress <= 100),
    estimated_completion DATE,
    actual_completion DATE,
    
    -- Team and management
    project_lead_id UUID REFERENCES players(id) ON DELETE RESTRICT,
    team_members JSONB DEFAULT '[]' NOT NULL,
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'active', 'completed', 'failed', 'cancelled')),
    
    -- Rewards and returns
    token_rewards_enabled BOOLEAN DEFAULT true NOT NULL,
    reputation_return_rate DECIMAL(5,4) NOT NULL DEFAULT 0.1000,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- INFRASTRUCTURE CONTRIBUTIONS
-- ===================================
CREATE TABLE infrastructure_contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES infrastructure_projects(id) ON DELETE CASCADE,
    stake_id UUID NOT NULL REFERENCES reputation_stakes(id) ON DELETE CASCADE,
    
    -- Contribution details
    contribution_type VARCHAR(30) NOT NULL CHECK (contribution_type IN ('development', 'research', 'maintenance', 'security', 'community')),
    tokens_contributed DECIMAL(15,2) NOT NULL,
    reputation_staked DECIMAL(15,2) NOT NULL,
    
    -- Impact metrics
    impact_score DECIMAL(5,4) NOT NULL CHECK (impact_score >= 0 AND impact_score <= 1),
    reputation_return DECIMAL(15,2) NOT NULL,
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed')),
    
    -- Timestamps
    contributed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    return_processed_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    contribution_metadata JSONB DEFAULT '{}' NOT NULL,
    
    UNIQUE(player_id, project_id, stake_id, contributed_at)
);

-- ===================================
-- MARKETPLACE STAKING ACCESS
-- ===================================
CREATE TABLE marketplace_staking_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
    stake_id UUID NOT NULL REFERENCES reputation_stakes(id) ON DELETE CASCADE,
    
    -- Access details
    access_level VARCHAR(20) NOT NULL CHECK (access_level IN ('standard', 'enhanced', 'vip', 'enterprise')),
    access_granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    access_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Credits and usage
    credits_granted DECIMAL(10,2) NOT NULL,
    credits_used DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    discount_rate DECIMAL(5,4) NOT NULL CHECK (discount_rate >= 0 AND discount_rate <= 1),
    
    -- Service usage
    services_purchased INTEGER NOT NULL DEFAULT 0 CHECK (services_purchased >= 0),
    total_savings DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    
    -- Status
    is_active BOOLEAN DEFAULT true NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(player_id, service_id, stake_id)
);

-- ===================================
-- COMMUNITY STAKING CONTRIBUTIONS
-- ===================================
CREATE TABLE community_staking_contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    stake_id UUID NOT NULL REFERENCES reputation_stakes(id) ON DELETE CASCADE,
    
    -- Contribution details
    contribution_type VARCHAR(30) NOT NULL CHECK (contribution_type IN ('development', 'events', 'mentorship', 'security', 'governance')),
    influence_contributed DECIMAL(15,2) NOT NULL,
    reputation_staked DECIMAL(15,2) NOT NULL,
    
    -- Leadership and impact
    leadership_points INTEGER NOT NULL DEFAULT 0 CHECK (leadership_points >= 0),
    member_bonus DECIMAL(5,4) NOT NULL CHECK (member_bonus >= 0),
    
    -- Recognition
    contribution_rank VARCHAR(20) DEFAULT 'member' CHECK (contribution_rank IN ('member', 'officer', 'leader', 'legend')),
    
    -- Timestamps
    contributed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata
    contribution_metadata JSONB DEFAULT '{}' NOT NULL,
    
    UNIQUE(player_id, community_id, stake_id, contributed_at)
);

-- ===================================
-- ECOSYSTEM BRIDGE ACHIEVEMENTS
-- ===================================
CREATE TABLE ecosystem_bridge_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    
    -- Achievement details
    achievement_type VARCHAR(50) NOT NULL,
    achievement_name VARCHAR(100) NOT NULL,
    achievement_description TEXT NOT NULL,
    
    -- Criteria and rewards
    criteria_met JSONB NOT NULL,
    rewards_granted JSONB NOT NULL,
    
    -- Rarity and display
    rarity VARCHAR(20) NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary', 'mythic')),
    icon_url TEXT,
    badge_color VARCHAR(7) DEFAULT '#000000',
    
    -- Progress tracking
    progress_current INTEGER NOT NULL DEFAULT 0,
    progress_required INTEGER NOT NULL DEFAULT 1,
    
    -- Timestamps
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_displayed BOOLEAN DEFAULT true NOT NULL,
    
    -- Constraints
    UNIQUE(player_id, achievement_type, achievement_name)
);

-- ===================================
-- BRIDGE POOLS (Liquidity Management)
-- ===================================
CREATE TABLE bridge_pools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Pool details
    pool_name VARCHAR(100) NOT NULL,
    bridge_type VARCHAR(50) NOT NULL,
    
    -- Liquidity
    total_liquidity DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    available_liquidity DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    reserved_liquidity DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    
    -- Rates and fees
    base_conversion_rate DECIMAL(10,6) NOT NULL,
    current_conversion_rate DECIMAL(10,6) NOT NULL,
    fee_rate DECIMAL(5,4) NOT NULL,
    
    -- Limits and controls
    daily_transaction_limit DECIMAL(15,2) NOT NULL,
    daily_volume_used DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    minimum_transaction_amount DECIMAL(15,2) NOT NULL,
    maximum_transaction_amount DECIMAL(15,2) NOT NULL,
    
    -- Risk management
    risk_score DECIMAL(5,4) NOT NULL DEFAULT 0.5000 CHECK (risk_score >= 0 AND risk_score <= 1),
    insurance_fund DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    
    -- Status
    is_active BOOLEAN DEFAULT true NOT NULL,
    is_paused BOOLEAN DEFAULT false NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_rebalanced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- BRIDGE LIQUIDITY PROVIDERS
-- ===================================
CREATE TABLE bridge_liquidity_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    pool_id UUID NOT NULL REFERENCES bridge_pools(id) ON DELETE CASCADE,
    
    -- Provision details
    liquidity_provided DECIMAL(15,2) NOT NULL,
    provision_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    lock_period_days INTEGER NOT NULL CHECK (lock_period_days >= 1),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Rewards
    reward_rate DECIMAL(8,6) NOT NULL,
    total_rewards_earned DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    rewards_claimed DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    
    -- Status
    is_active BOOLEAN DEFAULT true NOT NULL,
    is_withdrawn BOOLEAN DEFAULT false NOT NULL,
    withdrawn_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    provision_metadata JSONB DEFAULT '{}' NOT NULL,
    
    UNIQUE(player_id, pool_id, provision_date)
);

-- ===================================
-- ENHANCED STAKE LOCKING
-- ===================================
ALTER TABLE reputation_stakes ADD COLUMN IF NOT EXISTS education_locked_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00;
ALTER TABLE reputation_stakes ADD COLUMN IF NOT EXISTS infrastructure_locked_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00;
ALTER TABLE reputation_stakes ADD COLUMN IF NOT EXISTS marketplace_locked_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00;
ALTER TABLE reputation_stakes ADD COLUMN IF NOT EXISTS community_locked_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00;
ALTER TABLE reputation_stakes ADD COLUMN IF NOT EXISTS governance_locked_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00;

-- ===================================
-- PERFORMANCE INDEXES
-- ===================================

-- Bridge transactions performance
CREATE INDEX idx_ecosystem_bridge_transactions_player_id ON ecosystem_bridge_transactions(player_id);
CREATE INDEX idx_ecosystem_bridge_transactions_bridge_type ON ecosystem_bridge_transactions(bridge_type);
CREATE INDEX idx_ecosystem_bridge_transactions_status ON ecosystem_bridge_transactions(status);
CREATE INDEX idx_ecosystem_bridge_transactions_created_at ON ecosystem_bridge_transactions(created_at);
CREATE INDEX idx_ecosystem_bridge_transactions_source_type ON ecosystem_bridge_transactions(source_type);
CREATE INDEX idx_ecosystem_bridge_transactions_target_type ON ecosystem_bridge_transactions(target_type);

-- Education access performance
CREATE INDEX idx_education_staking_access_player_id ON education_staking_access(player_id);
CREATE INDEX idx_education_staking_access_course_id ON education_staking_access(course_id);
CREATE INDEX idx_education_staking_access_stake_id ON education_staking_access(stake_id);
CREATE INDEX idx_education_staking_access_is_active ON education_staking_access(is_active);
CREATE INDEX idx_education_staking_access_expires_at ON education_staking_access(access_expires_at);

-- Infrastructure projects performance
CREATE INDEX idx_infrastructure_projects_category ON infrastructure_projects(category);
CREATE INDEX idx_infrastructure_projects_status ON infrastructure_projects(status);
CREATE INDEX idx_infrastructure_projects_project_lead_id ON infrastructure_projects(project_lead_id);
CREATE INDEX idx_infrastructure_projects_current_progress ON infrastructure_projects(current_progress);

-- Infrastructure contributions performance
CREATE INDEX idx_infrastructure_contributions_player_id ON infrastructure_contributions(player_id);
CREATE INDEX idx_infrastructure_contributions_project_id ON infrastructure_contributions(project_id);
CREATE INDEX idx_infrastructure_contributions_stake_id ON infrastructure_contributions(stake_id);
CREATE INDEX idx_infrastructure_contributions_contribution_type ON infrastructure_contributions(contribution_type);
CREATE INDEX idx_infrastructure_contributions_contributed_at ON infrastructure_contributions(contributed_at);

-- Marketplace access performance
CREATE INDEX idx_marketplace_staking_access_player_id ON marketplace_staking_access(player_id);
CREATE INDEX idx_marketplace_staking_access_service_id ON marketplace_staking_access(service_id);
CREATE INDEX idx_marketplace_staking_access_stake_id ON marketplace_staking_access(stake_id);
CREATE INDEX idx_marketplace_staking_access_is_active ON marketplace_staking_access(is_active);

-- Community contributions performance
CREATE INDEX idx_community_staking_contributions_player_id ON community_staking_contributions(player_id);
CREATE INDEX idx_community_staking_contributions_community_id ON community_staking_contributions(community_id);
CREATE INDEX idx_community_staking_contributions_stake_id ON community_staking_contributions(stake_id);
CREATE INDEX idx_community_staking_contributions_contribution_type ON community_staking_contributions(contribution_type);
CREATE INDEX idx_community_staking_contributions_contributed_at ON community_staking_contributions(contributed_at);

-- Bridge achievements performance
CREATE INDEX idx_ecosystem_bridge_achievements_player_id ON ecosystem_bridge_achievements(player_id);
CREATE INDEX idx_ecosystem_bridge_achievements_achievement_type ON ecosystem_bridge_achievements(achievement_type);
CREATE INDEX idx_ecosystem_bridge_achievements_rarity ON ecosystem_bridge_achievements(rarity);
CREATE INDEX idx_ecosystem_bridge_achievements_earned_at ON ecosystem_bridge_achievements(earned_at);

-- Bridge pools performance
CREATE INDEX idx_bridge_pools_bridge_type ON bridge_pools(bridge_type);
CREATE INDEX idx_bridge_pools_is_active ON bridge_pools(is_active);
CREATE INDEX idx_bridge_pools_risk_score ON bridge_pools(risk_score);
CREATE INDEX idx_bridge_pools_total_liquidity ON bridge_pools(total_liquidity);

-- Liquidity providers performance
CREATE INDEX idx_bridge_liquidity_providers_player_id ON bridge_liquidity_providers(player_id);
CREATE INDEX idx_bridge_liquidity_providers_pool_id ON bridge_liquidity_providers(pool_id);
CREATE INDEX idx_bridge_liquidity_providers_is_active ON bridge_liquidity_providers(is_active);
CREATE INDEX idx_bridge_liquidity_providers_expires_at ON bridge_liquidity_providers(expires_at);

-- ===================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ===================================

-- Update bridge pool liquidity when transactions are processed
CREATE OR REPLACE FUNCTION update_bridge_pool_liquidity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        -- Update pool liquidity when transaction is completed
        IF NEW.status = 'completed' THEN
            UPDATE bridge_pools 
            SET 
                available_liquidity = available_liquidity - NEW.converted_amount,
                daily_volume_used = daily_volume_used + NEW.converted_amount,
                updated_at = NOW()
            WHERE bridge_type = NEW.bridge_type AND is_active = true;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_bridge_pool_liquidity
    AFTER INSERT OR UPDATE ON ecosystem_bridge_transactions
    FOR EACH ROW EXECUTE FUNCTION update_bridge_pool_liquidity();

-- Reset daily volume at midnight
CREATE OR REPLACE FUNCTION reset_daily_bridge_volume()
RETURNS VOID AS $$
BEGIN
    UPDATE bridge_pools 
    SET daily_volume_used = 0, updated_at = NOW()
    WHERE is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ecosystem_bridge_transactions_updated_at 
    BEFORE UPDATE ON ecosystem_bridge_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_infrastructure_projects_updated_at 
    BEFORE UPDATE ON infrastructure_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bridge_pools_updated_at 
    BEFORE UPDATE ON bridge_pools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- INITIAL BRIDGE POOLS SETUP
-- ===================================

INSERT INTO bridge_pools (id, pool_name, bridge_type, base_conversion_rate, current_conversion_rate, fee_rate, daily_transaction_limit, minimum_transaction_amount, maximum_transaction_amount)
VALUES 
    (uuid_generate_v4(), 'Education Bridge Pool', 'education_access', 1.0, 1.0, 0.02, 10000.00, 10.00, 5000.00),
    (uuid_generate_v4(), 'Infrastructure Bridge Pool', 'infrastructure_contribution', 0.1, 0.1, 0.03, 50000.00, 50.00, 25000.00),
    (uuid_generate_v4(), 'Marketplace Bridge Pool', 'marketplace_access', 0.1, 0.1, 0.015, 25000.00, 25.00, 12500.00),
    (uuid_generate_v4(), 'Community Bridge Pool', 'community_contribution', 2.5, 2.5, 0.005, 15000.00, 15.00, 7500.00),
    (uuid_generate_v4(), 'Governance Bridge Pool', 'governance_access', 1.0, 1.0, 0.01, 20000.00, 20.00, 10000.00);
