-- POWER Token (PWR) Economy Database Schema
-- Total Supply: 1 TRILLION PWR
-- Anti-Collapse Design with Dual Currency Model

-- POWER Token (PWR) Main Token Table
CREATE TABLE IF NOT EXISTS power_token (
    id SERIAL PRIMARY KEY,
    token_id VARCHAR(100) UNIQUE NOT NULL DEFAULT 'PWR',
    token_name VARCHAR(100) NOT NULL DEFAULT 'POWER Token',
    token_symbol VARCHAR(10) NOT NULL DEFAULT 'PWR',
    total_supply BIGINT NOT NULL DEFAULT 1000000000000000, -- 1 TRILLION PWR (18 decimals)
    circulating_supply BIGINT NOT NULL DEFAULT 0,
    burned_supply BIGINT NOT NULL DEFAULT 0,
    locked_supply BIGINT NOT NULL DEFAULT 0,
    staked_supply BIGINT NOT NULL DEFAULT 0,
    governance_supply BIGINT NOT NULL DEFAULT 0,
    treasury_supply BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Influence Currency (Off-chain) Table
CREATE TABLE IF NOT EXISTS influence_currency (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    influence_balance BIGINT NOT NULL DEFAULT 0,
    influence_earned BIGINT NOT NULL DEFAULT 0,
    influence_spent BIGINT NOT NULL DEFAULT 0,
    last_earned TIMESTAMP DEFAULT NOW(),
    daily_earn_limit BIGINT NOT NULL DEFAULT 10000, -- Daily earn limit
    daily_spent_limit BIGINT NOT NULL DEFAULT 5000, -- Daily spend limit
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- PWR Token Holdings Table
CREATE TABLE IF NOT EXISTS pwr_holdings (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    pwr_balance BIGINT NOT NULL DEFAULT 0,
    pwr_locked BIGINT NOT NULL DEFAULT 0,
    pwr_staked BIGINT NOT NULL DEFAULT 0,
    pwr_governance BIGINT NOT NULL DEFAULT 0,
    total_earned BIGINT NOT NULL DEFAULT 0,
    total_spent BIGINT NOT NULL DEFAULT 0,
    first_acquired TIMESTAMP DEFAULT NOW(),
    last_transaction TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Token Distribution Tracking
CREATE TABLE IF NOT EXISTS token_distribution (
    id SERIAL PRIMARY KEY,
    distribution_type VARCHAR(50) NOT NULL, -- 'genesis', 'mining', 'staking', 'governance', 'treasury', 'charity'
    amount BIGINT NOT NULL,
    recipient_id VARCHAR(50),
    recipient_type VARCHAR(20), -- 'user', 'contract', 'treasury', 'dao'
    distribution_date TIMESTAMP DEFAULT NOW(),
    transaction_hash VARCHAR(100),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- PWR Token Mining/Minting Table
CREATE TABLE IF NOT EXISTS pwr_mining (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    mining_type VARCHAR(50) NOT NULL, -- 'gameplay', 'staking', 'liquidity', 'governance'
    amount_mined BIGINT NOT NULL,
    difficulty_level DECIMAL(10,2) NOT NULL DEFAULT 1.0,
    energy_consumed BIGINT NOT NULL DEFAULT 0,
    mining_date TIMESTAMP DEFAULT NOW(),
    block_number BIGINT,
    transaction_hash VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- PWR Token Staking Table
CREATE TABLE IF NOT EXISTS pwr_staking (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    staking_pool_id VARCHAR(100) NOT NULL,
    amount_staked BIGINT NOT NULL,
    staking_period INTEGER NOT NULL, -- Days
    apy_rate DECIMAL(5,2) NOT NULL,
    rewards_earned BIGINT NOT NULL DEFAULT 0,
    rewards_claimed BIGINT NOT NULL DEFAULT 0,
    start_date TIMESTAMP DEFAULT NOW(),
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    auto_compound BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- PWR Token Governance Table
CREATE TABLE IF NOT EXISTS pwr_governance (
    id SERIAL PRIMARY KEY,
    proposal_id VARCHAR(100) UNIQUE NOT NULL,
    proposer_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    voting_power_required BIGINT NOT NULL,
    voting_power_for BIGINT NOT NULL DEFAULT 0,
    voting_power_against BIGINT NOT NULL DEFAULT 0,
    voting_period INTEGER NOT NULL, -- Hours
    execution_delay INTEGER NOT NULL, -- Hours
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'passed', 'rejected', 'executed'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- PWR Token Voting Table
CREATE TABLE IF NOT EXISTS pwr_voting (
    id SERIAL PRIMARY KEY,
    proposal_id VARCHAR(100) REFERENCES pwr_governance(proposal_id),
    voter_id VARCHAR(50) NOT NULL,
    voting_power BIGINT NOT NULL,
    vote_direction VARCHAR(10) NOT NULL, -- 'for', 'against'
    vote_timestamp TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- PWR Token Burning Table
CREATE TABLE IF NOT EXISTS pwr_burning (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    amount_burned BIGINT NOT NULL,
    burn_reason VARCHAR(100) NOT NULL, -- 'transaction_fee', 'penalty', 'voluntary', 'deflation'
    burn_date TIMESTAMP DEFAULT NOW(),
    transaction_hash VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- PWR Token Transaction History
CREATE TABLE IF NOT EXISTS pwr_transactions (
    id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    from_user_id VARCHAR(50),
    to_user_id VARCHAR(50),
    amount BIGINT NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- 'transfer', 'mint', 'burn', 'stake', 'unstake', 'governance'
    fee_amount BIGINT NOT NULL DEFAULT 0,
    fee_type VARCHAR(20) DEFAULT 'pwr', -- 'pwr', 'influence'
    block_number BIGINT,
    transaction_hash VARCHAR(100),
    timestamp TIMESTAMP DEFAULT NOW(),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Influence Earning Events
CREATE TABLE IF NOT EXISTS influence_earning_events (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- 'gameplay', 'achievement', 'social', 'referral', 'daily_bonus'
    amount_earned BIGINT NOT NULL,
    event_data JSONB,
    earned_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Influence Spending Events
CREATE TABLE IF NOT EXISTS influence_spending_events (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- 'item_purchase', 'upgrade', 'boost', 'premium_feature'
    amount_spent BIGINT NOT NULL,
    event_data JSONB,
    spent_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- PWR Token Economics Metrics
CREATE TABLE IF NOT EXISTS pwr_economics_metrics (
    id SERIAL PRIMARY KEY,
    metric_date DATE NOT NULL,
    total_supply BIGINT NOT NULL,
    circulating_supply BIGINT NOT NULL,
    burned_supply BIGINT NOT NULL,
    locked_supply BIGINT NOT NULL,
    staked_supply BIGINT NOT NULL,
    price_usd DECIMAL(18,8),
    market_cap_usd BIGINT,
    volume_24h BIGINT,
    holders_count INTEGER,
    transactions_count INTEGER,
    staking_apy DECIMAL(5,2),
    inflation_rate DECIMAL(5,4),
    deflation_rate DECIMAL(5,4),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Token Supply Allocations (Fixed Distribution)
CREATE TABLE IF NOT EXISTS token_supply_allocations (
    id SERIAL PRIMARY KEY,
    allocation_type VARCHAR(50) NOT NULL,
    allocation_percentage DECIMAL(5,2) NOT NULL,
    allocation_amount BIGINT NOT NULL,
    allocated_amount BIGINT NOT NULL DEFAULT 0,
    vesting_period INTEGER, -- Months
    vesting_start_date TIMESTAMP,
    is_locked BOOLEAN DEFAULT true,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Anti-Collapse Mechanisms
CREATE TABLE IF NOT EXISTS anti_collapse_mechanisms (
    id SERIAL PRIMARY KEY,
    mechanism_name VARCHAR(100) NOT NULL,
    mechanism_type VARCHAR(50) NOT NULL, -- 'burning', 'staking', 'supply_control', 'demand_stimulation'
    activation_threshold DECIMAL(5,4), -- Percentage threshold
    activation_parameters JSONB,
    is_active BOOLEAN DEFAULT false,
    last_activated TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_pwr_holdings_user ON pwr_holdings(user_id);
CREATE INDEX IF NOT EXISTS idx_influence_currency_user ON influence_currency(user_id);
CREATE INDEX IF NOT EXISTS idx_token_distribution_type ON token_distribution(distribution_type);
CREATE INDEX IF NOT EXISTS idx_pwr_mining_user ON pwr_mining(user_id);
CREATE INDEX IF NOT EXISTS idx_pwr_staking_user ON pwr_staking(user_id);
CREATE INDEX IF NOT EXISTS idx_pwr_staking_pool ON pwr_staking(staking_pool_id);
CREATE INDEX IF NOT EXISTS idx_pwr_governance_proposal ON pwr_governance(proposal_id);
CREATE INDEX IF NOT EXISTS idx_pwr_voting_proposal ON pwr_voting(proposal_id);
CREATE INDEX IF NOT EXISTS idx_pwr_transactions_from ON pwr_transactions(from_user_id);
CREATE INDEX IF NOT EXISTS idx_pwr_transactions_to ON pwr_transactions(to_user_id);
CREATE INDEX IF NOT EXISTS idx_pwr_transactions_type ON pwr_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_influence_earning_user ON influence_earning_events(user_id);
CREATE INDEX IF NOT EXISTS idx_influence_spending_user ON influence_spending_events(user_id);
CREATE INDEX IF NOT EXISTS idx_pwr_economics_date ON pwr_economics_metrics(metric_date);

-- Create triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_power_token_updated_at BEFORE UPDATE ON power_token FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_influence_currency_updated_at BEFORE UPDATE ON influence_currency FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pwr_holdings_updated_at BEFORE UPDATE ON pwr_holdings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pwr_staking_updated_at BEFORE UPDATE ON pwr_staking FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pwr_governance_updated_at BEFORE UPDATE ON pwr_governance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create views for comprehensive token analytics
CREATE OR REPLACE VIEW token_supply_overview AS
SELECT 
    pt.token_name,
    pt.token_symbol,
    pt.total_supply,
    pt.circulating_supply,
    pt.burned_supply,
    pt.locked_supply,
    pt.staked_supply,
    pt.governance_supply,
    pt.treasury_supply,
    ROUND((pt.circulating_supply::DECIMAL / pt.total_supply::DECIMAL) * 100, 2) as circulation_percentage,
    ROUND((pt.burned_supply::DECIMAL / pt.total_supply::DECIMAL) * 100, 2) as burn_percentage,
    ROUND((pt.staked_supply::DECIMAL / pt.total_supply::DECIMAL) * 100, 2) as staking_percentage,
    ROUND((pt.locked_supply::DECIMAL / pt.total_supply::DECIMAL) * 100, 2) as lock_percentage
FROM power_token pt;

CREATE OR REPLACE VIEW user_token_summary AS
SELECT 
    u.user_id,
    ic.influence_balance,
    ic.influence_earned,
    ic.influence_spent,
    ph.pwr_balance,
    ph.pwr_staked,
    ph.pwr_governance,
    ph.total_earned,
    ph.total_spent,
    (ph.pwr_balance + ph.pwr_staked + ph.pwr_governance) as total_pwr,
    ph.first_acquired,
    ph.last_transaction
FROM influence_currency ic
LEFT JOIN pwr_holdings ph ON ic.user_id = ph.user_id
WHERE ic.user_id = ph.user_id;

CREATE OR REPLACE VIEW mining_statistics AS
SELECT 
    mining_type,
    COUNT(*) as total_mining_events,
    SUM(amount_mined) as total_mined,
    AVG(amount_mined) as average_mined,
    MAX(amount_mined) as max_mined,
    MIN(amount_mined) as min_mined,
    DATE_TRUNC('day', mining_date) as mining_day
FROM pwr_mining
GROUP BY mining_type, DATE_TRUNC('day', mining_date)
ORDER BY mining_day DESC;

CREATE OR REPLACE VIEW staking_overview AS
SELECT 
    staking_pool_id,
    COUNT(*) as total_stakers,
    SUM(amount_staked) as total_staked,
    AVG(apy_rate) as average_apy,
    SUM(rewards_earned) as total_rewards_earned,
    SUM(rewards_claimed) as total_rewards_claimed,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_stakers
FROM pwr_staking
GROUP BY staking_pool_id;

-- Initialize token supply with 1 TRILLION PWR
INSERT INTO power_token (token_id, token_name, token_symbol, total_supply) 
VALUES ('PWR', 'POWER Token', 'PWR', 1000000000000000000000000) -- 1 TRILLION PWR with 18 decimals
ON CONFLICT (token_id) DO NOTHING;

-- Initialize token supply allocations (Fixed 1 TRILLION PWR distribution)
INSERT INTO token_supply_allocations (allocation_type, allocation_percentage, allocation_amount, vesting_period, description) VALUES
('genesis_mining', 40.0, 400000000000000000000000, 48, 'Genesis mining rewards for early adopters'),
('staking_rewards', 25.0, 250000000000000000000000, 120, 'Staking rewards distribution'),
('governance', 10.0, 100000000000000000000000, 36, 'Governance participation rewards'),
('treasury', 15.0, 150000000000000000000000, 0, 'Treasury reserve for ecosystem development'),
('charity', 5.0, 50000000000000000000000, 24, 'Charity and social impact initiatives'),
('team_advisors', 3.0, 30000000000000000000000, 48, 'Team and advisors allocation'),
('partnerships', 2.0, 20000000000000000000000, 36, 'Strategic partnerships and ecosystem')
ON CONFLICT DO NOTHING;

-- Initialize anti-collapse mechanisms
INSERT INTO anti_collapse_mechanisms (mechanism_name, mechanism_type, activation_threshold, activation_parameters) VALUES
('dynamic_burning', 'burning', 0.05, '{"burn_rate": 0.01, "trigger_condition": "inflation_rate > 0.05"}'),
('staking_boost', 'demand_stimulation', 0.10, '{"boost_multiplier": 1.5, "trigger_condition": "staking_percentage < 0.10"}'),
('supply_control', 'supply_control', 0.15, '{"control_rate": 0.02, "trigger_condition": "circulation_percentage > 0.85"}'),
('liquidity_incentives', 'demand_stimulation', 0.08, '{"incentive_rate": 0.015, "trigger_condition": "volume_24h < 1000000"}')
ON CONFLICT DO NOTHING;
