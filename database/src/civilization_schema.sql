-- ===================================
-- PEOPLE POWER CENTER OF EXCELLENCE AND WALL OF FAME SCHEMA
-- ===================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================
-- CENTER OF EXCELLENCE SCHEMA
-- ===================================

-- Knowledge Academies
CREATE TABLE academies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- 'game_strategy', 'digital_skills', 'economic_intelligence', 'community_leadership', 'social_impact'
    icon_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Academy Courses
CREATE TABLE academy_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    academy_id UUID NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    difficulty_level INTEGER DEFAULT 1, -- 1-5
    duration_minutes INTEGER DEFAULT 30,
    prerequisites JSONB, -- Array of course IDs
    learning_outcomes JSONB, -- Array of strings
    rewards JSONB, -- Token rewards, NFTs, privileges
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Player Academy Progress
CREATE TABLE player_academy_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    academy_id UUID NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES academy_courses(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completion_date TIMESTAMP WITH TIME ZONE,
    progress_percentage INTEGER DEFAULT 0, -- 0-100
    assessment_score INTEGER, -- 0-100
    status VARCHAR(20) DEFAULT 'enrolled', -- 'enrolled', 'in_progress', 'completed', 'failed'
    UNIQUE(player_id, course_id)
);

-- AI Mentorship System
CREATE TABLE ai_mentors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    mentor_type VARCHAR(50) NOT NULL, -- 'skill_coach', 'career_guide', 'innovation_advisor'
    personality_traits JSONB, -- Mentor personality configuration
    expertise_areas JSONB, -- Array of expertise areas
    activation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_interaction TIMESTAMP WITH TIME ZONE,
    interaction_count INTEGER DEFAULT 0,
    effectiveness_score DECIMAL(3,2), -- 0.00-1.00
    UNIQUE(player_id, mentor_type)
);

-- Mentorship Sessions
CREATE TABLE mentorship_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID NOT NULL REFERENCES ai_mentors(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    session_type VARCHAR(50) NOT NULL, -- 'skill_assessment', 'personalized_mission', 'learning_path', 'career_advice'
    session_data JSONB, -- Session content and recommendations
    player_feedback INTEGER, -- 1-5 rating
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    outcomes JSONB -- What player achieved from session
);

-- Innovation Labs
CREATE TABLE innovation_labs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    focus_area VARCHAR(50) NOT NULL, -- 'mini_apps', 'game_tools', 'community_solutions', 'educational_content'
    submission_guidelines TEXT,
    evaluation_criteria JSONB,
    reward_pool DECIMAL(20,8), -- Tokens allocated for innovations
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Innovation Submissions
CREATE TABLE innovation_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lab_id UUID NOT NULL REFERENCES innovation_labs(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    submission_type VARCHAR(50) NOT NULL, -- 'mini_app', 'tool', 'solution', 'content'
    implementation_url VARCHAR(255),
    demo_video_url VARCHAR(255),
    technical_documentation TEXT,
    status VARCHAR(20) DEFAULT 'submitted', -- 'submitted', 'under_review', 'approved', 'rejected', 'implemented'
    review_score INTEGER, -- 0-100
    reviewer_feedback TEXT,
    reward_amount DECIMAL(20,8),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    implemented_at TIMESTAMP WITH TIME ZONE
);

-- ===================================
-- WALL OF FAME SCHEMA
-- ===================================

-- Legacy Halls
CREATE TABLE legacy_halls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- 'founders', 'genius', 'guardians', 'impact', 'diamond_hands'
    icon_url VARCHAR(255),
    entry_criteria JSONB, -- Requirements for entry
    max_capacity INTEGER, -- Maximum members per hall
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Wall of Fame Entries
CREATE TABLE wall_of_fame_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    hall_id UUID NOT NULL REFERENCES legacy_halls(id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL, -- 'top_earner', 'top_helper', 'innovator', 'educator', 'community_protector'
    achievement_description TEXT,
    achievement_value DECIMAL(20,8), -- Quantified achievement
    rank_position INTEGER, -- Position in hall
    induction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(player_id, hall_id, achievement_type)
);

-- Soulbound Reputation NFTs
CREATE TABLE soulbound_nfts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    nft_type VARCHAR(50) NOT NULL, -- 'achievement', 'reputation_level', 'special_recognition'
    nft_name VARCHAR(200) NOT NULL,
    description TEXT,
    metadata JSONB, -- NFT attributes and properties
    token_id VARCHAR(100) UNIQUE, -- Blockchain token identifier
    minted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_transferable BOOLEAN DEFAULT false, -- Always false for soulbound
    UNIQUE(player_id, nft_type, nft_name)
);

-- Living History Timeline
CREATE TABLE civilization_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(50) NOT NULL, -- 'milestone', 'player_revolution', 'economic_achievement', 'governance_vote'
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_data JSONB, -- Detailed event information
    involved_players JSONB, -- Array of player IDs
    significance_level INTEGER DEFAULT 1, -- 1-10 importance scale
    event_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===================================
-- REPUTATION ECONOMY SCHEMA
-- ===================================

-- Reputation DNA Profiles
CREATE TABLE reputation_dna (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    knowledge_dna JSONB, -- Skills, courses, teaching contributions
    social_dna JSONB, -- Community help, conflict resolution, participation
    builder_dna JSONB, -- Tools created, innovations, economic contributions
    integrity_dna JSONB, -- Rule compliance, scam resistance, governance honesty
    overall_score DECIMAL(5,2), -- 0.00-100.00
    civilization_rank VARCHAR(20), -- 'explorer', 'contributor', 'builder', 'architect', 'elder'
    last_calculated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id)
);

-- Reputation Transactions
CREATE TABLE reputation_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL, -- 'teaching', 'helping', 'innovation', 'governance', 'integrity_action'
    reputation_change DECIMAL(5,2) NOT NULL, -- Positive or negative change
    dna_category VARCHAR(20) NOT NULL, -- 'knowledge', 'social', 'builder', 'integrity'
    reference_id UUID, -- Related entity (course, submission, etc.)
    description TEXT,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verified_by UUID, -- Player who verified this action
    verification_notes TEXT
);

-- Trust-Based Marketplace
CREATE TABLE marketplace_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_provider_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    service_type VARCHAR(50) NOT NULL, -- 'development', 'design', 'consulting', 'mentoring'
    service_description TEXT,
    base_price DECIMAL(20,8) NOT NULL,
    reputation_multiplier DECIMAL(3,2) DEFAULT 1.0, -- Price multiplier based on reputation
    final_price DECIMAL(20,8) GENERATED ALWAYS AS (base_price * reputation_multiplier) STORED,
    availability_status VARCHAR(20) DEFAULT 'available', -- 'available', 'busy', 'unavailable'
    portfolio_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Marketplace Contracts
CREATE TABLE marketplace_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    contract_terms JSONB NOT NULL,
    agreed_price DECIMAL(20,8) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'active', 'completed', 'disputed', 'cancelled'
    start_date TIMESTAMP WITH TIME ZONE,
    completion_date TIMESTAMP WITH TIME ZONE,
    review_rating INTEGER, -- 1-5
    review_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===================================
-- CIVILIZATION STABILITY ENGINE SCHEMA
-- ===================================

-- Economic Balance Core
CREATE TABLE economic_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_date DATE NOT NULL UNIQUE,
    token_velocity DECIMAL(20,8),
    inflation_rate DECIMAL(5,4), -- Percentage
    new_vs_old_player_ratio DECIMAL(5,4),
    earnings_distribution_gini DECIMAL(5,4), -- Gini coefficient
    active_player_count INTEGER,
    total_transaction_volume DECIMAL(20,8),
    average_daily_earnings DECIMAL(20,8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stability Interventions
CREATE TABLE stability_interventions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    intervention_type VARCHAR(50) NOT NULL, -- 'reward_adjustment', 'inflation_control', 'inequality_reduction'
    trigger_condition JSONB, -- What triggered this intervention
    intervention_parameters JSONB, -- Specific changes made
    expected_outcome JSONB,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'failed'
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP WITH TIME ZONE,
    effectiveness_score DECIMAL(3,2) -- 0.00-1.00
);

-- Three-Chamber Governance
CREATE TABLE governance_proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposer_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    proposal_type VARCHAR(50) NOT NULL, -- 'economic', 'governance', 'community', 'technical'
    proposal_data JSONB NOT NULL,
    citizen_votes JSONB, -- Vote counts and breakdown
    council_review JSONB, -- Builder council assessment
    guardian_approval JSONB, -- Guardian council decision
    final_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'implemented'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    voting_deadline TIMESTAMP WITH TIME ZONE
);

-- Reputation Immunity System
CREATE TABLE immunity_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_type VARCHAR(50) NOT NULL, -- 'manipulation', 'fake_accounts', 'vote_buying', 'reputation_farming'
    detected_players JSONB, -- Array of suspicious player IDs
    evidence_data JSONB, -- Detection evidence and metrics
    severity_level INTEGER DEFAULT 1, -- 1-10
    status VARCHAR(20) DEFAULT 'investigating', -- 'investigating', 'action_taken', 'resolved'
    detection_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolution_date TIMESTAMP WITH TIME ZONE,
    resolution_actions JSONB
);

-- Meaning Regeneration Engine
CREATE TABLE civilization_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    mission_type VARCHAR(50) NOT NULL, -- 'seasonal_challenge', 'cooperative_goal', 'crisis_simulation'
    objectives JSONB NOT NULL,
    rewards JSONB NOT NULL,
    participation_requirements JSONB,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    current_progress JSONB, -- Real-time progress tracking
    status VARCHAR(20) DEFAULT 'upcoming', -- 'upcoming', 'active', 'completed', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Mission Participations
CREATE TABLE mission_participations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES civilization_missions(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    contribution_data JSONB,
    progress_percentage INTEGER DEFAULT 0,
    rewards_earned JSONB,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(mission_id, player_id)
);

-- ===================================
-- INDEXES FOR PERFORMANCE
-- ===================================

-- Academy indexes
CREATE INDEX idx_academy_courses_academy_id ON academy_courses(academy_id);
CREATE INDEX idx_player_academy_progress_player_id ON player_academy_progress(player_id);
CREATE INDEX idx_player_academy_progress_academy_id ON player_academy_progress(academy_id);

-- Innovation indexes
CREATE INDEX idx_innovation_submissions_lab_id ON innovation_submissions(lab_id);
CREATE INDEX idx_innovation_submissions_player_id ON innovation_submissions(player_id);
CREATE INDEX idx_innovation_submissions_status ON innovation_submissions(status);

-- Wall of Fame indexes
CREATE INDEX idx_wall_of_fame_entries_player_id ON wall_of_fame_entries(player_id);
CREATE INDEX idx_wall_of_fame_entries_hall_id ON wall_of_fame_entries(hall_id);
CREATE INDEX idx_soulbound_nfts_player_id ON soulbound_nfts(player_id);

-- Reputation indexes
CREATE INDEX idx_reputation_dna_player_id ON reputation_dna(player_id);
CREATE INDEX idx_reputation_transactions_player_id ON reputation_transactions(player_id);
CREATE INDEX idx_reputation_transactions_date ON reputation_transactions(transaction_date);

-- Marketplace indexes
CREATE INDEX idx_marketplace_listings_provider_id ON marketplace_listings(service_provider_id);
CREATE INDEX idx_marketplace_contracts_client_id ON marketplace_contracts(client_id);

-- Stability Engine indexes
CREATE INDEX idx_economic_metrics_date ON economic_metrics(metric_date);
CREATE INDEX idx_stability_interventions_status ON stability_interventions(status);
CREATE INDEX idx_governance_proposals_status ON governance_proposals(final_status);
CREATE INDEX idx_immunity_alerts_status ON immunity_alerts(status);

-- ===================================
-- TRIGGERS AND FUNCTIONS
-- ===================================

-- Update reputation DNA when transactions occur
CREATE OR REPLACE FUNCTION update_reputation_dna()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE reputation_dna
    SET 
        overall_score = (
            SELECT COALESCE(AVG(reputation_change), 0) + 
                   (SELECT COALESCE(overall_score, 0) FROM reputation_dna WHERE player_id = NEW.player_id)
            FROM reputation_transactions 
            WHERE player_id = NEW.player_id 
            AND transaction_date > COALESCE((SELECT last_calculated FROM reputation_dna WHERE player_id = NEW.player_id), '1970-01-01'::timestamp)
        ),
        last_calculated = CURRENT_TIMESTAMP
    WHERE player_id = NEW.player_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_reputation_dna
    AFTER INSERT ON reputation_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_reputation_dna();

-- Update marketplace final price when reputation changes
CREATE OR REPLACE FUNCTION update_marketplace_prices()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE marketplace_listings
    SET reputation_multiplier = CASE 
        WHEN r.overall_score >= 90 THEN 2.0
        WHEN r.overall_score >= 75 THEN 1.5
        WHEN r.overall_score >= 50 THEN 1.2
        ELSE 1.0
    END
    FROM reputation_dna r
    WHERE marketplace_listings.service_provider_id = r.player_id
    AND marketplace_listings.service_provider_id = NEW.player_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_marketplace_prices
    AFTER UPDATE ON reputation_dna
    FOR EACH ROW
    EXECUTE FUNCTION update_marketplace_prices();

-- ===================================
-- VIEWS FOR COMPLEX QUERIES
-- ===================================

-- Player Civilization Profile View
CREATE VIEW player_civilization_profile AS
SELECT 
    p.id,
    p.username,
    p.display_name,
    p.level,
    p.rank,
    rd.overall_score as reputation_score,
    rd.civilization_rank,
    COUNT(DISTINCT pap.course_id) as courses_completed,
    COUNT(DISTINCT isub.id) as innovations_submitted,
    COUNT(DISTINCT wofe.id) as wall_of_fame_entries,
    COUNT(DISTINCT snft.id) as soulbound_nfts,
    COALESCE(ml.total_participations, 0) as mission_participations
FROM players p
LEFT JOIN reputation_dna rd ON p.id = rd.player_id
LEFT JOIN player_academy_progress pap ON p.id = pap.player_id AND pap.status = 'completed'
LEFT JOIN innovation_submissions isub ON p.id = isub.player_id AND isub.status = 'approved'
LEFT JOIN wall_of_fame_entries wofe ON p.id = wofe.player_id AND wofe.is_active = true
LEFT JOIN soulbound_nfts snft ON p.id = snft.player_id
LEFT JOIN (
    SELECT player_id, COUNT(*) as total_participations
    FROM mission_participations
    GROUP BY player_id
) ml ON p.id = ml.player_id
GROUP BY p.id, p.username, p.display_name, p.level, p.rank, rd.overall_score, rd.civilization_rank;

-- Academy Performance View
CREATE VIEW academy_performance AS
SELECT 
    a.id as academy_id,
    a.name as academy_name,
    COUNT(DISTINCT pap.player_id) as total_enrollments,
    COUNT(DISTINCT CASE WHEN pap.status = 'completed' THEN pap.player_id END) as total_completions,
    AVG(CASE WHEN pap.assessment_score IS NOT NULL THEN pap.assessment_score END) as average_score,
    COUNT(DISTINCT isub.id) as innovations_generated
FROM academies a
LEFT JOIN academy_courses ac ON a.id = ac.academy_id
LEFT JOIN player_academy_progress pap ON ac.id = pap.course_id
LEFT JOIN innovation_submissions isub ON pap.player_id = isub.player_id
GROUP BY a.id, a.name;

-- Economic Stability Dashboard View
CREATE VIEW economic_stability_dashboard AS
SELECT 
    em.metric_date,
    em.token_velocity,
    em.inflation_rate,
    em.earnings_distribution_gini,
    em.active_player_count,
    COUNT(CASE WHEN si.status = 'active' THEN 1 END) as active_interventions,
    COUNT(CASE WHEN gp.final_status = 'pending' THEN 1 END) as pending_proposals,
    COUNT(CASE WHEN ia.status = 'investigating' THEN 1 END) as active_investigations
FROM economic_metrics em
LEFT JOIN stability_interventions si ON em.metric_date = si.start_date::date
LEFT JOIN governance_proposals gp ON em.metric_date = gp.created_at::date
LEFT JOIN immunity_alerts ia ON em.metric_date = ia.detection_date::date
GROUP BY em.metric_date, em.token_velocity, em.inflation_rate, em.earnings_distribution_gini, em.active_player_count;

-- ===================================
-- INITIAL DATA SEEDING
-- ===================================

-- Insert default academies
INSERT INTO academies (name, description, category, icon_url) VALUES
('Game Strategy Institute', 'Master advanced gameplay mechanics and strategies', 'game_strategy', '/icons/game-strategy.png'),
('Digital Skills Lab', 'Learn coding, AI, and Web3 fundamentals', 'digital_skills', '/icons/digital-skills.png'),
('Economic Intelligence School', 'Understand trading, tokenomics, and market dynamics', 'economic_intelligence', '/icons/economic-intel.png'),
('Community Leadership Academy', 'Develop governance and leadership skills', 'community_leadership', '/icons/leadership.png'),
('Social Impact Lab', 'Create real-world change through digital action', 'social_impact', '/icons/social-impact.png');

-- Insert default legacy halls
INSERT INTO legacy_halls (name, description, category, entry_criteria) VALUES
('Founders Hall', 'Honoring the pioneers who built our civilization', 'founders', '{"joined_before": "2025-01-01", "minimum_reputation": 50}'),
('Genius Hall', 'Celebrating our greatest innovators and creators', 'genius', '{"innovations_approved": 5, "average_score": 85}'),
('Guardians Hall', 'Protecting the integrity and safety of our community', 'guardians', '{"moderation_actions": 100, "integrity_score": 95}'),
('Impact Hall', 'Recognizing those who create real-world change', 'impact', '{"social_impact_score": 90, "missions_completed": 10}'),
('Diamond Hands Hall', 'Honoring long-term commitment and loyalty', 'diamond_hands', '{"days_active": 365, "continuous_streak": 180}');

-- Insert default innovation labs
INSERT INTO innovation_labs (name, description, focus_area, reward_pool) VALUES
('Mini-App Factory', 'Create new mini-apps for the ecosystem', 'mini_apps', 10000.0),
('Game Tools Workshop', 'Build tools that enhance gameplay', 'game_tools', 5000.0),
('Community Solutions Lab', 'Solve community challenges with technology', 'community_solutions', 7500.0),
('Educational Content Studio', 'Create learning materials for others', 'educational_content', 3000.0);

COMMIT;
