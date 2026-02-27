-- People Power Movement Token Ecosystem Migration
-- Creates tables for the People Power token ecosystem and movement economy

-- People Power Credits (PPC) - Platform Currency
CREATE TABLE IF NOT EXISTS people_power_credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES players(id) UNIQUE,
    balance DECIMAL(15,2) DEFAULT 0 CHECK (balance >= 0),
    reputation INTEGER DEFAULT 0 CHECK (reputation >= 0),
    impact_score INTEGER DEFAULT 0 CHECK (impact_score >= 0),
    is_premium BOOLEAN DEFAULT false,
    premium_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Movement Tokens - Community and Purpose-Driven Tokens
CREATE TABLE IF NOT EXISTS movement_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES players(id),
    name VARCHAR(100) NOT NULL,
    symbol VARCHAR(10) NOT NULL UNIQUE,
    purpose VARCHAR(50) NOT NULL CHECK (purpose IN ('education', 'freedom', 'leadership', 'community', 'governance', 'empowerment')),
    description TEXT NOT NULL,
    total_supply BIGINT NOT NULL CHECK (total_supply > 0),
    tags TEXT[] DEFAULT '{}',
    launch_type VARCHAR(20) DEFAULT 'basic' CHECK (launch_type IN ('basic', 'premium', 'enterprise')),
    is_verified BOOLEAN DEFAULT false,
    is_trending BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Movement Token Holders
CREATE TABLE IF NOT EXISTS movement_token_holders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_id UUID NOT NULL REFERENCES movement_tokens(id),
    user_id UUID NOT NULL REFERENCES players(id),
    amount BIGINT NOT NULL CHECK (amount > 0),
    is_creator BOOLEAN DEFAULT false,
    acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(token_id, user_id)
);

-- Movement Token Prices
CREATE TABLE IF NOT EXISTS movement_token_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_id UUID NOT NULL REFERENCES movement_tokens(id) UNIQUE,
    price DECIMAL(15,8) NOT NULL CHECK (price > 0),
    market_cap DECIMAL(20,2) NOT NULL CHECK (market_cap >= 0),
    volume_24h DECIMAL(20,2) DEFAULT 0 CHECK (volume_24h >= 0),
    change_24h DECIMAL(8,4) DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Movement Token Impact Scores
CREATE TABLE IF NOT EXISTS movement_token_impact (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_id UUID NOT NULL REFERENCES movement_tokens(id) UNIQUE,
    education INTEGER DEFAULT 0 CHECK (education >= 0),
    community INTEGER DEFAULT 0 CHECK (community >= 0),
    governance INTEGER DEFAULT 0 CHECK (governance >= 0),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Movement Token Transactions
CREATE TABLE IF NOT EXISTS movement_token_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_id UUID NOT NULL REFERENCES movement_tokens(id),
    buyer_id UUID NOT NULL REFERENCES players(id),
    amount BIGINT NOT NULL CHECK (amount > 0),
    price DECIMAL(15,8) NOT NULL CHECK (price > 0),
    total_cost DECIMAL(20,2) NOT NULL CHECK (total_cost > 0),
    payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('ton', 'ppc')),
    transaction_hash VARCHAR(66),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Movement Token Proposals (Governance)
CREATE TABLE IF NOT EXISTS movement_token_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_id UUID NOT NULL REFERENCES movement_tokens(id),
    proposer_id UUID NOT NULL REFERENCES players(id),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    proposal_type VARCHAR(50) NOT NULL CHECK (proposal_type IN ('funding', 'policy', 'partnership', 'impact')),
    voting_starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    voting_ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
    quorum_required INTEGER DEFAULT 100,
    approval_threshold DECIMAL(5,2) DEFAULT 50.0 CHECK (approval_threshold > 0 AND approval_threshold <= 100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'passed', 'rejected', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Movement Token Votes
CREATE TABLE IF NOT EXISTS movement_token_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID NOT NULL REFERENCES movement_token_proposals(id),
    voter_id UUID NOT NULL REFERENCES players(id),
    vote BOOLEAN NOT NULL,
    voting_power BIGINT NOT NULL CHECK (voting_power > 0),
    voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(proposal_id, voter_id)
);

-- Movement Token Impact Projects
CREATE TABLE IF NOT EXISTS movement_token_impact_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_id UUID NOT NULL REFERENCES movement_tokens(id),
    project_name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('education', 'healthcare', 'infrastructure', 'environment', 'economic')),
    target_amount DECIMAL(20,2) NOT NULL CHECK (target_amount > 0),
    current_amount DECIMAL(20,2) DEFAULT 0 CHECK (current_amount >= 0),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Movement Token Project Donations
CREATE TABLE IF NOT EXISTS movement_token_donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES movement_token_impact_projects(id),
    donor_id UUID NOT NULL REFERENCES players(id),
    amount DECIMAL(20,2) NOT NULL CHECK (amount > 0),
    donation_type VARCHAR(20) NOT NULL CHECK (donation_type IN ('token', 'ton', 'ppc')),
    transaction_hash VARCHAR(66),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Movement Token Events
CREATE TABLE IF NOT EXISTS movement_token_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_id UUID NOT NULL REFERENCES movement_tokens(id),
    event_name VARCHAR(200) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('meetup', 'workshop', 'conference', 'webinar', 'fundraiser')),
    location VARCHAR(200),
    is_virtual BOOLEAN DEFAULT false,
    max_participants INTEGER,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    registration_fee DECIMAL(10,2) DEFAULT 0 CHECK (registration_fee >= 0),
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Movement Token Event Registrations
CREATE TABLE IF NOT EXISTS movement_token_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES movement_token_events(id),
    participant_id UUID NOT NULL REFERENCES players(id),
    registration_fee_paid BOOLEAN DEFAULT false,
    transaction_hash VARCHAR(66),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, participant_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_people_power_credits_user_id ON people_power_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_people_power_credits_balance ON people_power_credits(balance);
CREATE INDEX IF NOT EXISTS idx_people_power_credits_reputation ON people_power_credits(reputation);

CREATE INDEX IF NOT EXISTS idx_movement_tokens_creator_id ON movement_tokens(creator_id);
CREATE INDEX IF NOT EXISTS idx_movement_tokens_purpose ON movement_tokens(purpose);
CREATE INDEX IF NOT EXISTS idx_movement_tokens_symbol ON movement_tokens(symbol);
CREATE INDEX IF NOT EXISTS idx_movement_tokens_verified ON movement_tokens(is_verified);
CREATE INDEX IF NOT EXISTS idx_movement_tokens_trending ON movement_tokens(is_trending);
CREATE INDEX IF NOT EXISTS idx_movement_tokens_active ON movement_tokens(is_active);
CREATE INDEX IF NOT EXISTS idx_movement_tokens_created_at ON movement_tokens(created_at);
CREATE INDEX IF NOT EXISTS idx_movement_tokens_tags ON movement_tokens USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_movement_token_holders_token_id ON movement_token_holders(token_id);
CREATE INDEX IF NOT EXISTS idx_movement_token_holders_user_id ON movement_token_holders(user_id);
CREATE INDEX IF NOT EXISTS idx_movement_token_holders_amount ON movement_token_holders(amount);
CREATE INDEX IF NOT EXISTS idx_movement_token_holders_creator ON movement_token_holders(is_creator);

CREATE INDEX IF NOT EXISTS idx_movement_token_prices_token_id ON movement_token_prices(token_id);
CREATE INDEX IF NOT EXISTS idx_movement_token_prices_price ON movement_token_prices(price);
CREATE INDEX IF NOT EXISTS idx_movement_token_prices_market_cap ON movement_token_prices(market_cap);
CREATE INDEX IF NOT EXISTS idx_movement_token_prices_updated_at ON movement_token_prices(updated_at);

CREATE INDEX IF NOT EXISTS idx_movement_token_impact_token_id ON movement_token_impact(token_id);
CREATE INDEX IF NOT EXISTS idx_movement_token_impact_education ON movement_token_impact(education);
CREATE INDEX IF NOT EXISTS idx_movement_token_impact_community ON movement_token_impact(community);
CREATE INDEX IF NOT EXISTS idx_movement_token_impact_governance ON movement_token_impact(governance);

CREATE INDEX IF NOT EXISTS idx_movement_token_transactions_token_id ON movement_token_transactions(token_id);
CREATE INDEX IF NOT EXISTS idx_movement_token_transactions_buyer_id ON movement_token_transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_movement_token_transactions_status ON movement_token_transactions(status);
CREATE INDEX IF NOT EXISTS idx_movement_token_transactions_created_at ON movement_token_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_movement_token_transactions_payment_type ON movement_token_transactions(payment_type);

CREATE INDEX IF NOT EXISTS idx_movement_token_proposals_token_id ON movement_token_proposals(token_id);
CREATE INDEX IF NOT EXISTS idx_movement_token_proposals_proposer_id ON movement_token_proposals(proposer_id);
CREATE INDEX IF NOT EXISTS idx_movement_token_proposals_status ON movement_token_proposals(status);
CREATE INDEX IF NOT EXISTS idx_movement_token_proposals_voting_period ON movement_token_proposals(voting_starts_at, voting_ends_at);

CREATE INDEX IF NOT EXISTS idx_movement_token_votes_proposal_id ON movement_token_votes(proposal_id);
CREATE INDEX IF NOT EXISTS idx_movement_token_votes_voter_id ON movement_token_votes(voter_id);
CREATE INDEX IF NOT EXISTS idx_movement_token_votes_voted_at ON movement_token_votes(voted_at);

CREATE INDEX IF NOT EXISTS idx_movement_token_impact_projects_token_id ON movement_token_impact_projects(token_id);
CREATE INDEX IF NOT EXISTS idx_movement_token_impact_projects_status ON movement_token_impact_projects(status);
CREATE INDEX IF NOT EXISTS idx_movement_token_impact_projects_category ON movement_token_impact_projects(category);
CREATE INDEX IF NOT EXISTS idx_movement_token_impact_projects_dates ON movement_token_impact_projects(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_movement_token_donations_project_id ON movement_token_donations(project_id);
CREATE INDEX IF NOT EXISTS idx_movement_token_donations_donor_id ON movement_token_donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_movement_token_donations_amount ON movement_token_donations(amount);
CREATE INDEX IF NOT EXISTS idx_movement_token_donations_created_at ON movement_token_donations(created_at);

CREATE INDEX IF NOT EXISTS idx_movement_token_events_token_id ON movement_token_events(token_id);
CREATE INDEX IF NOT EXISTS idx_movement_token_events_status ON movement_token_events(status);
CREATE INDEX IF NOT EXISTS idx_movement_token_events_start_time ON movement_token_events(start_time);
CREATE INDEX IF NOT EXISTS idx_movement_token_events_event_type ON movement_token_events(event_type);

CREATE INDEX IF NOT EXISTS idx_movement_token_registrations_event_id ON movement_token_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_movement_token_registrations_participant_id ON movement_token_registrations(participant_id);
CREATE INDEX IF NOT EXISTS idx_movement_token_registrations_registered_at ON movement_token_registrations(registered_at);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_people_power_credits_updated_at 
    BEFORE UPDATE ON people_power_credits 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_movement_tokens_updated_at 
    BEFORE UPDATE ON movement_tokens 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Views for common queries
CREATE OR REPLACE VIEW movement_tokens_with_details AS
SELECT 
    mt.*,
    p.username as creator_username,
    p.display_name as creator_display_name,
    p.avatar as creator_avatar,
    COALESCE(holders.holders_count, 0) as holders,
    COALESCE(holders.total_supply, 0) as current_supply,
    COALESCE(mtp.price, 0) as price,
    COALESCE(mtp.market_cap, 0) as market_cap,
    COALESCE(mtp.volume_24h, 0) as volume_24h,
    COALESCE(mtp.change_24h, 0) as change_24h,
    COALESCE(mti.education, 0) as education_impact,
    COALESCE(mti.community, 0) as community_impact,
    COALESCE(mti.governance, 0) as governance_impact
FROM movement_tokens mt
JOIN players p ON mt.creator_id = p.id
LEFT JOIN (
    SELECT 
        token_id,
        COUNT(*) as holders_count,
        SUM(amount) as total_supply
    FROM movement_token_holders
    GROUP BY token_id
) holders ON mt.id = holders.token_id
LEFT JOIN movement_token_prices mtp ON mt.id = mtp.token_id
LEFT JOIN movement_token_impact mti ON mt.id = mti.token_id
WHERE mt.is_active = true;

CREATE OR REPLACE VIEW user_portfolio_summary AS
SELECT 
    ppc.user_id,
    p.username,
    p.display_name,
    ppc.balance as ppc_balance,
    ppc.reputation,
    ppc.impact_score,
    ppc.is_premium,
    COALESCE(portfolio.token_count, 0) as tokens_owned,
    COALESCE(portfolio.total_value, 0) as portfolio_value,
    COALESCE(created_tokens.created_count, 0) as tokens_created
FROM people_power_credits ppc
JOIN players p ON ppc.user_id = p.id
LEFT JOIN (
    SELECT 
        mth.user_id,
        COUNT(*) as token_count,
        SUM(mth.amount * mtp.price) as total_value
    FROM movement_token_holders mth
    JOIN movement_token_prices mtp ON mth.token_id = mtp.token_id
    GROUP BY mth.user_id
) portfolio ON ppc.user_id = portfolio.user_id
LEFT JOIN (
    SELECT 
        mt.creator_id as user_id,
        COUNT(*) as created_count
    FROM movement_tokens mt
    WHERE mt.is_active = true
    GROUP BY mt.creator_id
) created_tokens ON ppc.user_id = created_tokens.user_id;

-- Functions for ecosystem operations
CREATE OR REPLACE FUNCTION calculate_token_impact_score(token_uuid UUID)
RETURNS TABLE(
    education_impact INTEGER,
    community_impact INTEGER,
    governance_impact INTEGER,
    total_impact INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(mti.education, 0) as education_impact,
        COALESCE(mti.community, 0) as community_impact,
        COALESCE(mti.governance, 0) as governance_impact,
        COALESCE(mti.education, 0) + COALESCE(mti.community, 0) + COALESCE(mti.governance, 0) as total_impact
    FROM movement_token_impact mti
    WHERE mti.token_id = token_uuid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_marketplace_stats()
RETURNS TABLE(
    total_tokens BIGINT,
    active_tokens BIGINT,
    total_market_cap DECIMAL,
    total_volume_24h DECIMAL,
    total_holders BIGINT,
    average_price DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_tokens,
        COUNT(CASE WHEN mt.is_active = true THEN 1 END) as active_tokens,
        COALESCE(SUM(mtp.market_cap), 0) as total_market_cap,
        COALESCE(SUM(mtp.volume_24h), 0) as total_volume_24h,
        COALESCE(SUM(holders.holders_count), 0) as total_holders,
        COALESCE(AVG(mtp.price), 0) as average_price
    FROM movement_tokens mt
    JOIN movement_token_prices mtp ON mt.id = mtp.token_id
    LEFT JOIN (
        SELECT 
            token_id,
            COUNT(*) as holders_count
        FROM movement_token_holders
        GROUP BY token_id
    ) holders ON mt.id = holders.token_id;
END;
$$ LANGUAGE plpgsql;
