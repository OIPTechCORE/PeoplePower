-- ===================================
-- REVOLUTIONARY REPUTATION STAKING SYSTEM
-- "STAKE YOUR INFLUENCE, EARN YOUR LEGACY"
-- ===================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================
-- REPUTATION STAKING POOLS
-- ===================================
CREATE TABLE reputation_staking_pools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pool_name VARCHAR(100) NOT NULL,
    pool_type VARCHAR(50) NOT NULL CHECK (pool_type IN ('knowledge', 'social', 'builder', 'integrity', 'legacy', 'community', 'governance')),
    
    -- Staking requirements
    min_reputation_score DECIMAL(5,2) NOT NULL DEFAULT 0.00 CHECK (min_reputation_score >= 0 AND min_reputation_score <= 100),
    min_stake_amount DECIMAL(10,2) NOT NULL DEFAULT 1.00 CHECK (min_stake_amount >= 0),
    max_stake_amount DECIMAL(10,2) CHECK (max_stake_amount >= min_stake_amount),
    
    -- Reward mechanics
    base_apr DECIMAL(8,4) NOT NULL DEFAULT 0.0500 CHECK (base_apr >= 0), -- 5% base
    reputation_multiplier DECIMAL(5,4) NOT NULL DEFAULT 1.0000 CHECK (reputation_multiplier >= 0),
    community_bonus_apr DECIMAL(8,4) NOT NULL DEFAULT 0.0000 CHECK (community_bonus_apr >= 0),
    
    -- Lock period mechanics
    min_lock_period_days INTEGER NOT NULL DEFAULT 7 CHECK (min_lock_period_days >= 1),
    max_lock_period_days INTEGER NOT NULL DEFAULT 365 CHECK (max_lock_period_days >= min_lock_period_days),
    lock_bonus_multiplier DECIMAL(5,4) NOT NULL DEFAULT 1.0000 CHECK (lock_bonus_multiplier >= 1),
    
    -- Special features
    governance_power_enabled BOOLEAN DEFAULT false NOT NULL,
    mission_access_level INTEGER DEFAULT 0 CHECK (mission_access_level >= 0),
    education_unlock_tiers JSONB DEFAULT '[]' NOT NULL,
    
    -- Pool status
    is_active BOOLEAN DEFAULT true NOT NULL,
    total_staked_reputation DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    total_stakers INTEGER NOT NULL DEFAULT 0 CHECK (total_stakers >= 0),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- USER REPUTATION STAKES
-- ===================================
CREATE TABLE reputation_stakes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    pool_id UUID NOT NULL REFERENCES reputation_staking_pools(id) ON DELETE RESTRICT,
    
    -- Staking details
    reputation_amount_staked DECIMAL(10,2) NOT NULL CHECK (reputation_amount_staked > 0),
    stake_weight DECIMAL(15,8) NOT NULL CHECK (stake_weight >= 0), -- Calculated weight with multipliers
    
    -- Timing
    staked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    lock_period_days INTEGER NOT NULL CHECK (lock_period_days >= 1),
    unlocks_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_reward_calculation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Multipliers applied
    reputation_multiplier_applied DECIMAL(5,4) NOT NULL DEFAULT 1.0000,
    community_multiplier_applied DECIMAL(5,4) NOT NULL DEFAULT 1.0000,
    lock_multiplier_applied DECIMAL(5,4) NOT NULL DEFAULT 1.0000,
    special_multiplier_applied DECIMAL(5,4) NOT NULL DEFAULT 1.0000,
    
    -- Status
    is_active BOOLEAN DEFAULT true NOT NULL,
    is_compounded BOOLEAN DEFAULT false NOT NULL,
    early_unpenalty_fee_rate DECIMAL(5,4) NOT NULL DEFAULT 0.1000 CHECK (early_unpenalty_fee_rate >= 0),
    
    -- Governance power
    governance_power_generated DECIMAL(15,8) NOT NULL DEFAULT 0.0000,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(player_id, pool_id, staked_at)
);

-- ===================================
-- STAKING REWARDS DISTRIBUTION
-- ===================================
CREATE TABLE staking_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stake_id UUID NOT NULL REFERENCES reputation_stakes(id) ON DELETE CASCADE,
    
    -- Reward details
    reward_type VARCHAR(50) NOT NULL CHECK (reward_type IN ('reputation', 'tokens', 'governance', 'education', 'exclusive')),
    reward_amount DECIMAL(15,8) NOT NULL CHECK (reward_amount >= 0),
    reward_rate_apr DECIMAL(8,4) NOT NULL,
    
    -- Calculation breakdown
    base_reward DECIMAL(15,8) NOT NULL,
    reputation_bonus DECIMAL(15,8) NOT NULL DEFAULT 0.0000,
    community_bonus DECIMAL(15,8) NOT NULL DEFAULT 0.0000,
    lock_bonus DECIMAL(15,8) NOT NULL DEFAULT 0.0000,
    special_bonus DECIMAL(15,8) NOT NULL DEFAULT 0.0000,
    
    -- Period
    reward_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    reward_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Status
    is_claimed BOOLEAN DEFAULT false NOT NULL,
    claimed_at TIMESTAMP WITH TIME ZONE,
    auto_compounded BOOLEAN DEFAULT false NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- COMMUNITY STAKING POOLS
-- ===================================
CREATE TABLE community_staking_pools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    base_pool_id UUID NOT NULL REFERENCES reputation_staking_pools(id) ON DELETE RESTRICT,
    
    -- Community-specific settings
    community_bonus_apr DECIMAL(8,4) NOT NULL DEFAULT 0.0200 CHECK (community_bonus_apr >= 0), -- +2% base
    member_activity_multiplier DECIMAL(5,4) NOT NULL DEFAULT 1.0000 CHECK (community_bonus_apr >= 0),
    
    -- Community requirements
    min_community_level INTEGER NOT NULL DEFAULT 1 CHECK (min_community_level >= 1),
    min_active_members INTEGER NOT NULL DEFAULT 5 CHECK (min_active_members >= 1),
    
    -- Pool status
    is_active BOOLEAN DEFAULT true NOT NULL,
    total_community_staked DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    community_stakers_count INTEGER NOT NULL DEFAULT 0 CHECK (community_stakers_count >= 0),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(community_id, base_pool_id)
);

-- ===================================
-- AI YIELD OPTIMIZATION ENGINE
-- ===================================
CREATE TABLE yield_optimization_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    
    -- AI analysis
    current_portfolio JSONB NOT NULL, -- Current staking distribution
    optimal_portfolio JSONB NOT NULL, -- AI-recommended distribution
    expected_apr_improvement DECIMAL(8,4) NOT NULL, -- Percentage improvement
    
    -- Specific recommendations
    recommendations JSONB NOT NULL, -- Array of recommended actions
    risk_assessment VARCHAR(20) NOT NULL CHECK (risk_assessment IN ('low', 'medium', 'high')),
    confidence_score DECIMAL(5,4) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
    
    -- Execution
    is_executed BOOLEAN DEFAULT false NOT NULL,
    executed_at TIMESTAMP WITH TIME ZONE,
    actual_improvement DECIMAL(8,4), -- Measured improvement after execution
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ===================================
-- GOVERNANCE POWER TRACKING
-- ===================================
CREATE TABLE governance_power (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    
    -- Power sources
    staked_reputation_power DECIMAL(15,8) NOT NULL DEFAULT 0.0000,
    community_leadership_bonus DECIMAL(15,8) NOT NULL DEFAULT 0.0000,
    integrity_voter_bonus DECIMAL(15,8) NOT NULL DEFAULT 0.0000,
    long_term_staker_bonus DECIMAL(15,8) NOT NULL DEFAULT 0.0000,
    
    -- Total governance power
    total_governance_power DECIMAL(15,8) NOT NULL DEFAULT 0.0000,
    voting_weight_tier VARCHAR(20) NOT NULL DEFAULT 'basic' CHECK (voting_weight_tier IN ('basic', 'enhanced', 'premium', 'supreme')),
    
    -- Usage tracking
    proposals_voted INTEGER NOT NULL DEFAULT 0 CHECK (proposals_voted >= 0),
    proposals_created INTEGER NOT NULL DEFAULT 0 CHECK (proposals_created >= 0),
    voting_alignment_score DECIMAL(5,4) NOT NULL DEFAULT 0.5000 CHECK (voting_alignment_score >= 0 AND voting_alignment_score <= 1),
    
    last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(player_id)
);

-- ===================================
-- EDUCATION ACCESS STAKING
-- ===================================
CREATE TABLE education_staking_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    course_id UUID NOT NULL, -- Links to PPU courses
    stake_id UUID NOT NULL REFERENCES reputation_stakes(id) ON DELETE CASCADE,
    
    -- Access details
    access_level VARCHAR(20) NOT NULL CHECK (access_level IN ('basic', 'premium', 'exclusive', 'master')),
    access_granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    access_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Requirements met
    reputation_required DECIMAL(10,2) NOT NULL,
    stake_duration_required INTEGER NOT NULL, -- days
    pool_type_required VARCHAR(50) NOT NULL,
    
    is_active BOOLEAN DEFAULT true NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(player_id, course_id, stake_id)
);

-- ===================================
-- STAKING EVENTS & ACHIEVEMENTS
-- ===================================
CREATE TABLE staking_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    
    -- Achievement details
    achievement_type VARCHAR(50) NOT NULL CHECK (achievement_type IN ('first_stake', 'long_term_staker', 'high_staker', 'community_leader', 'governance_power', 'education_master', 'yield_optimizer')),
    achievement_name VARCHAR(100) NOT NULL,
    achievement_description TEXT NOT NULL,
    
    -- Achievement criteria
    criteria_met JSONB NOT NULL,
    reward_granted JSONB NOT NULL,
    
    -- Rarity and display
    rarity VARCHAR(20) NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary', 'mythic')),
    icon_url TEXT,
    badge_color VARCHAR(7) DEFAULT '#000000',
    
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_displayed BOOLEAN DEFAULT true NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(player_id, achievement_type, achievement_name)
);

-- ===================================
-- PERFORMANCE INDEXES
-- ===================================

-- Staking performance
CREATE INDEX idx_reputation_stakes_player_id ON reputation_stakes(player_id);
CREATE INDEX idx_reputation_stakes_pool_id ON reputation_stakes(pool_id);
CREATE INDEX idx_reputation_stakes_is_active ON reputation_stakes(is_active);
CREATE INDEX idx_reputation_stakes_unlocks_at ON reputation_stakes(unlocks_at);
CREATE INDEX idx_reputation_stakes_stake_weight ON reputation_stakes(stake_weight);

-- Rewards performance
CREATE INDEX idx_staking_rewards_stake_id ON staking_rewards(stake_id);
CREATE INDEX idx_staking_rewards_is_claimed ON staking_rewards(is_claimed);
CREATE INDEX idx_staking_rewards_reward_type ON staking_rewards(reward_type);
CREATE INDEX idx_staking_rewards_calculated_at ON staking_rewards(calculated_at);

-- Pool performance
CREATE INDEX idx_reputation_staking_pools_pool_type ON reputation_staking_pools(pool_type);
CREATE INDEX idx_reputation_staking_pools_is_active ON reputation_staking_pools(is_active);
CREATE INDEX idx_reputation_staking_pools_total_staked ON reputation_staking_pools(total_staked_reputation);

-- Governance performance
CREATE INDEX idx_governance_power_player_id ON governance_power(player_id);
CREATE INDEX idx_governance_power_total_power ON governance_power(total_governance_power);
CREATE INDEX idx_governance_power_voting_tier ON governance_power(voting_weight_tier);

-- Community staking performance
CREATE INDEX idx_community_staking_pools_community_id ON community_staking_pools(community_id);
CREATE INDEX idx_community_staking_pools_is_active ON community_staking_pools(is_active);

-- AI optimization performance
CREATE INDEX idx_yield_optimization_player_id ON yield_optimization_suggestions(player_id);
CREATE INDEX idx_yield_optimization_confidence ON yield_optimization_suggestions(confidence_score);
CREATE INDEX idx_yield_optimization_expires_at ON yield_optimization_suggestions(expires_at);

-- ===================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ===================================

-- Update pool totals when stakes change
CREATE OR REPLACE FUNCTION update_pool_totals_on_stake()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE reputation_staking_pools 
        SET 
            total_staked_reputation = total_staked_reputation + NEW.reputation_amount_staked,
            total_stakers = total_stakers + 1,
            updated_at = NOW()
        WHERE id = NEW.pool_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE reputation_staking_pools 
        SET 
            total_staked_reputation = total_staked_reputation - OLD.reputation_amount_staked,
            total_stakers = total_stakers - 1,
            updated_at = NOW()
        WHERE id = OLD.pool_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_pool_totals_on_stake
    AFTER INSERT OR UPDATE OR DELETE ON reputation_stakes
    FOR EACH ROW EXECUTE FUNCTION update_pool_totals_on_stake();

-- Update governance power when stakes change
CREATE OR REPLACE FUNCTION update_governance_power_on_stake()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO governance_power (player_id, staked_reputation_power, total_governance_power, last_calculated)
        VALUES (NEW.player_id, NEW.stake_weight, NEW.stake_weight, NOW())
        ON CONFLICT (player_id) 
        DO UPDATE SET
            staked_reputation_power = governance_power.staked_reputation_power + NEW.stake_weight,
            total_governance_power = governance_power.total_governance_power + NEW.stake_weight,
            last_calculated = NOW();
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE governance_power 
        SET 
            staked_reputation_power = staked_reputation_power - OLD.stake_weight,
            total_governance_power = total_governance_power - OLD.stake_weight,
            last_calculated = NOW()
        WHERE player_id = OLD.player_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_governance_power_on_stake
    AFTER INSERT OR UPDATE OR DELETE ON reputation_stakes
    FOR EACH ROW EXECUTE FUNCTION update_governance_power_on_stake();

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reputation_staking_pools_updated_at 
    BEFORE UPDATE ON reputation_staking_pools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reputation_stakes_updated_at 
    BEFORE UPDATE ON reputation_stakes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_staking_pools_updated_at 
    BEFORE UPDATE ON community_staking_pools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
