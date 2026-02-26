-- Charity Revenue Mechanisms Database Schema
-- Supporting TRILLION-DOLLAR charity ecosystem revenue generation

-- Charity Revenue Mechanisms Configuration
CREATE TABLE IF NOT EXISTS charity_revenue_mechanisms (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    potential_value VARCHAR(50),
    beneficiaries TEXT[], -- Array of beneficiary types
    mechanism_type VARCHAR(50),
    risk_level VARCHAR(20),
    expected_returns VARCHAR(50),
    implementation_details JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Revenue Projections and Tracking
CREATE TABLE IF NOT EXISTS charity_revenue_projections (
    id SERIAL PRIMARY KEY,
    mechanism_id VARCHAR(50) REFERENCES charity_revenue_mechanisms(id),
    year_number INTEGER NOT NULL,
    projected_revenue BIGINT NOT NULL,
    actual_revenue BIGINT DEFAULT 0,
    assumptions TEXT,
    risk_factors TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Beneficiary Revenue Distribution
CREATE TABLE IF NOT EXISTS beneficiary_revenue_shares (
    id SERIAL PRIMARY KEY,
    mechanism_id VARCHAR(50) REFERENCES charity_revenue_mechanisms(id),
    beneficiary_type VARCHAR(50) NOT NULL, -- ALL_USERS, CHARITY_TREASURY, POWER_TOKEN, FOUNDERS
    share_percentage DECIMAL(5,2) NOT NULL,
    distribution_method VARCHAR(100),
    conditions JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Charity Treasury Yield Farming
CREATE TABLE IF NOT EXISTS charity_treasury_positions (
    id SERIAL PRIMARY KEY,
    protocol VARCHAR(100) NOT NULL,
    asset_address VARCHAR(255),
    amount_deposited BIGINT NOT NULL,
    current_value BIGINT NOT NULL,
    apy DECIMAL(5,2),
    last_yield_withdrawal TIMESTAMP,
    auto_compound BOOLEAN DEFAULT true,
    risk_score INTEGER DEFAULT 1, -- 1-5 risk score
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Impact Bonds
CREATE TABLE IF NOT EXISTS impact_bonds (
    id SERIAL PRIMARY KEY,
    bond_name VARCHAR(255) NOT NULL,
    charity_id VARCHAR(50),
    principal_amount BIGINT NOT NULL,
    interest_rate DECIMAL(5,2),
    maturity_date DATE,
    impact_metrics JSONB,
    is_verified BOOLEAN DEFAULT false,
    trading_address VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- NFT Marketplace
CREATE TABLE IF NOT EXISTS charity_nft_listings (
    id SERIAL PRIMARY KEY,
    nft_address VARCHAR(255) NOT NULL,
    token_id BIGINT NOT NULL,
    charity_id VARCHAR(50),
    seller_address VARCHAR(255),
    price BIGINT NOT NULL,
    royalty_percentage DECIMAL(5,2) DEFAULT 2.5,
    is_sold BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Social Impact Derivatives
CREATE TABLE IF NOT EXISTS impact_derivatives_contracts (
    id SERIAL PRIMARY KEY,
    contract_type VARCHAR(100) NOT NULL, -- futures, swaps, options
    underlying_metric VARCHAR(100),
    notional_value BIGINT NOT NULL,
    strike_price BIGINT,
    maturity_date DATE,
    counterparty VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Charity Staking Pools
CREATE TABLE IF NOT EXISTS charity_staking_pools (
    id SERIAL PRIMARY KEY,
    pool_name VARCHAR(255) NOT NULL,
    cause_category VARCHAR(50),
    total_staked BIGINT DEFAULT 0,
    apy DECIMAL(5,2),
    lock_period_days INTEGER,
    reward_token VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User Staking Positions
CREATE TABLE IF NOT EXISTS user_staking_positions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    pool_id INTEGER REFERENCES charity_staking_pools(id),
    amount_staked BIGINT NOT NULL,
    staked_at TIMESTAMP DEFAULT NOW(),
    unlock_at TIMESTAMP,
    rewards_earned BIGINT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Carbon Credits
CREATE TABLE IF NOT EXISTS carbon_credits (
    id SERIAL PRIMARY KEY,
    project_id VARCHAR(100),
    charity_id VARCHAR(50),
    credit_amount BIGINT NOT NULL,
    verification_standard VARCHAR(50), -- Verra, Gold Standard
    vintage_year INTEGER,
    is_retired BOOLEAN DEFAULT false,
    retirement_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Microinsurance Policies
CREATE TABLE IF NOT EXISTS microinsurance_policies (
    id SERIAL PRIMARY KEY,
    policy_type VARCHAR(100), -- health, crop, life
    user_id VARCHAR(50) NOT NULL,
    coverage_amount BIGINT NOT NULL,
    premium_amount BIGINT NOT NULL,
    deductible_amount BIGINT,
    policy_start DATE,
    policy_end DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Venture Fund Investments
CREATE TABLE IF NOT EXISTS charity_venture_investments (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    sector VARCHAR(100),
    investment_amount BIGINT NOT NULL,
    equity_percentage DECIMAL(5,2),
    investment_date DATE,
    current_valuation BIGINT,
    exit_status VARCHAR(50), -- active, exited, failed
    social_impact_score INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Social Impact Tokens
CREATE TABLE IF NOT EXISTS social_impact_tokens (
    id SERIAL PRIMARY KEY,
    token_name VARCHAR(255) NOT NULL,
    token_symbol VARCHAR(20),
    underlying_impact VARCHAR(100),
    total_supply BIGINT NOT NULL,
    backing_mechanism TEXT,
    current_price BIGINT,
    market_cap BIGINT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Data Licensing Agreements
CREATE TABLE IF NOT EXISTS data_licensing_agreements (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    data_type VARCHAR(100),
    license_fee BIGINT NOT NULL,
    subscription_start DATE,
    subscription_end DATE,
    usage_restrictions TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Revenue Distribution Ledger
CREATE TABLE IF NOT EXISTS revenue_distribution_ledger (
    id SERIAL PRIMARY KEY,
    mechanism_id VARCHAR(50) REFERENCES charity_revenue_mechanisms(id),
    beneficiary_type VARCHAR(50) NOT NULL,
    beneficiary_id VARCHAR(50),
    amount BIGINT NOT NULL,
    distribution_date TIMESTAMP DEFAULT NOW(),
    transaction_hash VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed
    created_at TIMESTAMP DEFAULT NOW()
);

-- Performance Metrics
CREATE TABLE IF NOT EXISTS charity_revenue_metrics (
    id SERIAL PRIMARY KEY,
    metric_date DATE NOT NULL,
    total_revenue BIGINT DEFAULT 0,
    active_mechanisms INTEGER DEFAULT 0,
    total_users INTEGER DEFAULT 0,
    total_tvl BIGINT DEFAULT 0,
    impact_score BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Risk Management
CREATE TABLE IF NOT EXISTS risk_assessments (
    id SERIAL PRIMARY KEY,
    mechanism_id VARCHAR(50) REFERENCES charity_revenue_mechanisms(id),
    risk_type VARCHAR(100),
    risk_level VARCHAR(20), -- LOW, MEDIUM, HIGH, CRITICAL
    mitigation_strategy TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert initial revenue mechanisms
INSERT INTO charity_revenue_mechanisms (id, name, description, category, potential_value, beneficiaries, mechanism_type, risk_level, expected_returns, implementation_details) VALUES
('charity_treasury_yield', 'Charity Treasury Yield Farming', 'Generate passive income from charity treasury through DeFi protocols', 'TREASURY', 'Billions', ARRAY['CHARITY_TREASURY', 'POWER_TOKEN', 'FOUNDERS'], 'defi_yield_farming', 'LOW', '15-25%', '{"protocols": ["Aave", "Compound", "Yearn Finance"], "allocation": {"stablecoins": "60%", "blue_chip_defi": "30%", "experimental": "10%"}}'),
('impact_bond_issuance', 'Impact Bond Issuance Platform', 'Create and trade social impact bonds backed by charity outcomes', 'FINANCIAL_INSTRUMENTS', 'Hundreds of Billions', ARRAY['ALL_USERS', 'CHARITY_TREASURY', 'POWER_TOKEN', 'FOUNDERS'], 'impact_bonds', 'MEDIUM', '8-15%', '{"bondTypes": ["Education Bonds", "Healthcare Bonds", "Environment Bonds"], "verification": "Smart Contract Audits"}'),
('charity_nft_marketplace', 'Charity NFT Marketplace', 'NFT marketplace where proceeds go to verified charities', 'DIGITAL_ASSETS', 'Tens of Billions', ARRAY['ALL_USERS', 'CHARITY_TREASURY', 'POWER_TOKEN', 'FOUNDERS'], 'nft_marketplace', 'LOW', '5-15%', '{"platform": "Custom NFT Marketplace", "royaltyStructure": "10% primary, 2.5% secondary"}'),
('social_impact_derivatives', 'Social Impact Derivatives', 'Derivatives trading on social impact metrics and outcomes', 'FINANCIAL_DERIVATIVES', 'Hundreds of Billions', ARRAY['POWER_TOKEN', 'FOUNDERS', 'CHARITY_TREASURY'], 'impact_derivatives', 'HIGH', '20-50%', '{"products": ["Impact Futures", "Charity Outcome Swaps", "Social Good Options"], "oracles": "Chainlink-based"}'),
('charity_staking_pools', 'Charity Staking Pools', 'Stake PWR tokens to support charity operations and earn rewards', 'STAKING', 'Billions', ARRAY['ALL_USERS', 'CHARITY_TREASURY', 'POWER_TOKEN'], 'charity_staking', 'LOW', '8-20%', '{"poolTypes": ["Education Pool", "Healthcare Pool", "Environment Pool"], "rewards": "PWR tokens + impact credits"}'),
('carbon_credit_trading', 'Carbon Credit Trading Platform', 'Trade verified carbon credits from charity environmental projects', 'ENVIRONMENTAL_MARKETS', 'Hundreds of Billions', ARRAY['ALL_USERS', 'CHARITY_TREASURY', 'POWER_TOKEN', 'FOUNDERS'], 'carbon_trading', 'LOW', '10-30%', '{"verification": "Verra and Gold Standard certified", "marketplace": "Automated trading platform"}'),
('microinsurance_platform', 'Microinsurance Platform', 'Provide microinsurance products to underserved communities', 'INSURANCE', 'Tens of Billions', ARRAY['ALL_USERS', 'CHARITY_TREASURY', 'POWER_TOKEN'], 'microinsurance', 'MEDIUM', '15-25%', '{"products": ["Health Microinsurance", "Crop Insurance", "Life Insurance"], "distribution": "Mobile-first"}'),
('charity_venture_fund', 'Charity Venture Fund', 'Invest in startups that create social impact', 'VENTURE_CAPITAL', 'Hundreds of Billions', ARRAY['CHARITY_TREASURY', 'POWER_TOKEN', 'FOUNDERS'], 'impact_venture', 'HIGH', '50-200%', '{"focus": ["EdTech", "HealthTech", "CleanTech", "FinTech"], "stage": "Seed to Series A"}'),
('social_impact_tokens', 'Social Impact Tokens', 'Tokenize social impact outcomes and create tradable impact assets', 'TOKENIZATION', 'Hundreds of Billions', ARRAY['ALL_USERS', 'CHARITY_TREASURY', 'POWER_TOKEN', 'FOUNDERS'], 'impact_tokenization', 'MEDIUM', '25-75%', '{"tokenTypes": ["Education Tokens", "Health Tokens", "Environment Tokens"], "backing": "Verified impact outcomes"}'),
('charity_data_monetization', 'Charity Data Monetization', 'Monetize anonymized charity impact data for research and insights', 'DATA_MONETIZATION', 'Tens of Billions', ARRAY['CHARITY_TREASURY', 'POWER_TOKEN', 'FOUNDERS'], 'data_licensing', 'LOW', '10-20%', '{"dataTypes": ["Impact metrics", "Donation patterns", "Social outcomes"], "privacy": "Fully anonymized"}')
ON CONFLICT (id) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_charity_revenue_mechanisms_category ON charity_revenue_mechanisms(category);
CREATE INDEX IF NOT EXISTS idx_charity_revenue_projections_mechanism ON charity_revenue_projections(mechanism_id);
CREATE INDEX IF NOT EXISTS idx_beneficiary_revenue_shares_beneficiary ON beneficiary_revenue_shares(beneficiary_type);
CREATE INDEX IF NOT EXISTS idx_charity_treasury_positions_protocol ON charity_treasury_positions(protocol);
CREATE INDEX IF NOT EXISTS idx_user_staking_positions_user ON user_staking_positions(user_id);
CREATE INDEX IF NOT EXISTS idx_revenue_distribution_ledger_date ON revenue_distribution_ledger(distribution_date);
CREATE INDEX IF NOT EXISTS idx_charity_revenue_metrics_date ON charity_revenue_metrics(metric_date);

-- Create triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_charity_revenue_mechanisms_updated_at BEFORE UPDATE ON charity_revenue_mechanisms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_charity_revenue_projections_updated_at BEFORE UPDATE ON charity_revenue_projections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_charity_treasury_positions_updated_at BEFORE UPDATE ON charity_treasury_positions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_charity_staking_pools_updated_at BEFORE UPDATE ON charity_staking_pools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_charity_venture_investments_updated_at BEFORE UPDATE ON charity_venture_investments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_social_impact_tokens_updated_at BEFORE UPDATE ON social_impact_tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for revenue summary
CREATE OR REPLACE VIEW charity_revenue_summary AS
SELECT 
    crm.id,
    crm.name,
    crm.category,
    crm.potential_value,
    COALESCE(SUM(crp.projected_revenue), 0) as total_projected_revenue,
    COALESCE(SUM(crp.actual_revenue), 0) as total_actual_revenue,
    COUNT(brs.beneficiary_type) as beneficiary_count,
    crm.risk_level,
    crm.expected_returns
FROM charity_revenue_mechanisms crm
LEFT JOIN charity_revenue_projections crp ON crm.id = crp.mechanism_id
LEFT JOIN beneficiary_revenue_shares brs ON crm.id = brs.mechanism_id
WHERE crm.is_active = true
GROUP BY crm.id, crm.name, crm.category, crm.potential_value, crm.risk_level, crm.expected_returns;

-- Create view for beneficiary impact
CREATE OR REPLACE VIEW beneficiary_impact_summary AS
SELECT 
    brs.beneficiary_type,
    COUNT(DISTINCT brs.mechanism_id) as mechanism_count,
    SUM(brs.share_percentage) as total_share_percentage,
    ARRAY_AGG(DISTINCT crm.category) as involved_categories,
    COALESCE(SUM(crp.projected_revenue * (brs.share_percentage / 100)), 0) as projected_beneficiary_revenue
FROM beneficiary_revenue_shares brs
JOIN charity_revenue_mechanisms crm ON brs.mechanism_id = crm.id
LEFT JOIN charity_revenue_projections crp ON crm.id = crp.mechanism_id
WHERE crm.is_active = true
GROUP BY brs.beneficiary_type;
