-- ===================================
-- PEOPLE POWER GLOBAL CIVILIZATION LAYER
-- "DIGITAL NATION WITHOUT BORDERS"
-- ===================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================
-- A. PEOPLE POWER GLOBAL NETWORK (PPGN) - FOUNDATION LAYER
-- ===================================

-- Global citizen registry
CREATE TABLE global_citizens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    
    -- Citizenship details
    citizen_id VARCHAR(20) UNIQUE NOT NULL, -- Format: PPGN-XXXXX
    citizenship_level VARCHAR(20) NOT NULL DEFAULT 'citizen' CHECK (citizenship_level IN ('citizen', 'resident', 'ambassador', 'diplomat', 'leader')),
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Global identity
    global_reputation_score DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    contribution_points BIGINT NOT NULL DEFAULT 0,
    network_influence DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    
    -- Skills and roles
    primary_skill VARCHAR(30) CHECK (primary_skill IN ('organizer', 'educator', 'creator', 'diplomat', 'builder', 'leader')),
    secondary_skills JSONB DEFAULT '[]' NOT NULL,
    specialization_tags JSONB DEFAULT '[]' NOT NULL,
    
    -- Status
    is_active BOOLEAN DEFAULT true NOT NULL,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_sessions INTEGER NOT NULL DEFAULT 0,
    
    -- Global achievements
    global_achievements JSONB DEFAULT '[]' NOT NULL,
    civilization_contributions JSONB DEFAULT '[]' NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(player_id)
);

-- Global network statistics
CREATE TABLE global_network_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Network metrics
    total_citizens BIGINT NOT NULL DEFAULT 0,
    active_citizens_today BIGINT NOT NULL DEFAULT 0,
    active_citizens_week BIGINT NOT NULL DEFAULT 0,
    active_citizens_month BIGINT NOT NULL DEFAULT 0,
    
    -- Reputation distribution
    avg_reputation_score DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    top_reputation_score DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    
    -- Geographic distribution
    countries_represented INTEGER NOT NULL DEFAULT 0,
    regions_active INTEGER NOT NULL DEFAULT 0,
    
    -- Economic metrics
    total_contribution_points BIGINT NOT NULL DEFAULT 0,
    daily_contribution_growth DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    
    -- Timestamps
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(calculated_at::date)
);

-- ===================================
-- B. PEOPLE POWER DIASPORA COMMUNITIES (PPDC) - REGIONAL HUBS
-- ===================================

-- Community registry
CREATE TABLE diaspora_communities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Community identification
    community_name VARCHAR(100) NOT NULL,
    community_code VARCHAR(10) UNIQUE NOT NULL, -- Format: UG, EA, EU, NA
    community_type VARCHAR(20) NOT NULL CHECK (community_type IN ('country', 'regional', 'continental', 'global')),
    
    -- Geographic scope
    primary_country VARCHAR(50),
    covered_countries JSONB DEFAULT '[]' NOT NULL,
    region VARCHAR(50),
    continent VARCHAR(50),
    
    -- Community leadership
    founder_id UUID REFERENCES players(id) ON DELETE RESTRICT,
    current_leader_id UUID REFERENCES players(id) ON DELETE RESTRICT,
    leadership_council JSONB DEFAULT '[]' NOT NULL,
    
    -- Community metrics
    member_count INTEGER NOT NULL DEFAULT 0,
    active_members_today INTEGER NOT NULL DEFAULT 0,
    community_reputation DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    
    -- Community resources
    shared_reward_pool DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    community_treasury DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    infrastructure_points BIGINT NOT NULL DEFAULT 0,
    
    -- Status and settings
    is_active BOOLEAN DEFAULT true NOT NULL,
    is_public BOOLEAN DEFAULT true NOT NULL,
    join_requirements JSONB DEFAULT '{}' NOT NULL,
    
    -- Timestamps
    founded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community memberships
CREATE TABLE community_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    community_id UUID NOT NULL REFERENCES diaspora_communities(id) ON DELETE CASCADE,
    
    -- Membership details
    membership_type VARCHAR(20) NOT NULL DEFAULT 'member' CHECK (membership_type IN ('member', 'officer', 'moderator', 'leader')),
    join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contribution metrics
    community_contribution_points BIGINT NOT NULL DEFAULT 0,
    community_reputation_earned DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    missions_completed INTEGER NOT NULL DEFAULT 0,
    
    -- Roles and permissions
    community_roles JSONB DEFAULT '[]' NOT NULL,
    permissions JSONB DEFAULT '[]' NOT NULL,
    
    -- Status
    is_active BOOLEAN DEFAULT true NOT NULL,
    last_community_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint
    UNIQUE(player_id, community_id)
);

-- Community missions and challenges
CREATE TABLE community_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID NOT NULL REFERENCES diaspora_communities(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES players(id) ON DELETE RESTRICT,
    
    -- Mission details
    mission_title VARCHAR(200) NOT NULL,
    mission_description TEXT NOT NULL,
    mission_type VARCHAR(30) NOT NULL CHECK (mission_type IN ('recruitment', 'cultural', 'educational', 'infrastructure', 'diplomatic')),
    
    -- Mission objectives
    objectives JSONB NOT NULL DEFAULT '[]',
    success_criteria JSONB NOT NULL DEFAULT '{}',
    
    -- Rewards and incentives
    community_reward_pool DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    individual_rewards JSONB NOT NULL DEFAULT '{}',
    reputation_rewards JSONB NOT NULL DEFAULT '{}',
    
    -- Participation
    max_participants INTEGER,
    current_participants INTEGER NOT NULL DEFAULT 0,
    participation_deadline TIMESTAMP WITH TIME ZONE,
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'failed', 'cancelled')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ends_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ===================================
-- C. PEOPLE POWER GLOBAL COUNTRY PRESIDENTS (PPGCP) - LEADERSHIP ROLES
-- ===================================

-- Country presidency registry
CREATE TABLE country_presidencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Country identification
    country_code VARCHAR(3) UNIQUE NOT NULL, -- ISO 3166-1 alpha-3
    country_name VARCHAR(100) NOT NULL,
    
    -- Current president
    current_president_id UUID REFERENCES players(id) ON DELETE RESTRICT,
    presidency_term_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    presidency_term_end TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Election data
    last_election_date TIMESTAMP WITH TIME ZONE,
    total_votes_cast BIGINT NOT NULL DEFAULT 0,
    winning_vote_percentage DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    
    -- President metrics
    presidential_reputation DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    leadership_score DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    integrity_rating DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    
    -- Presidential powers and limitations
    can_propose_missions BOOLEAN DEFAULT true NOT NULL,
    can_appoint_officers BOOLEAN DEFAULT true NOT NULL,
    veto_power_count INTEGER NOT NULL DEFAULT 3,
    used_veto_power INTEGER NOT NULL DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true NOT NULL,
    impeachment_votes INTEGER NOT NULL DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Presidential actions and decisions
CREATE TABLE presidential_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    presidency_id UUID NOT NULL REFERENCES country_presidencies(id) ON DELETE CASCADE,
    president_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    
    -- Action details
    action_type VARCHAR(30) NOT NULL CHECK (action_type IN ('mission_proposal', 'officer_appointment', 'veto', 'diplomatic_action', 'emergency_decree')),
    action_title VARCHAR(200) NOT NULL,
    action_description TEXT NOT NULL,
    
    -- Action data
    action_parameters JSONB NOT NULL DEFAULT '{}',
    affected_players JSONB DEFAULT '[]' NOT NULL,
    
    -- Voting and approval
    requires_approval BOOLEAN DEFAULT false NOT NULL,
    approval_votes INTEGER NOT NULL DEFAULT 0,
    rejection_votes INTEGER NOT NULL DEFAULT 0,
    
    -- Impact assessment
    reputation_impact DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    community_impact DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'approved', 'rejected', 'executed', 'cancelled')),
    
    -- Timestamps
    proposed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    executed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- D. PEOPLE POWER GLOBAL COUNTRY AMBASSADORS (PPGCA) - DIPLOMACY ROLES
-- ===================================

-- Ambassador registry
CREATE TABLE global_ambassadors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    
    -- Ambassador credentials
    ambassador_id VARCHAR(20) UNIQUE NOT NULL, -- Format: PPGCA-XXXXX
    representing_country VARCHAR(3) NOT NULL, -- ISO country code
    assigned_regions JSONB DEFAULT '[]' NOT NULL,
    
    -- Ambassador rank and specialization
    ambassador_rank VARCHAR(20) NOT NULL DEFAULT 'junior' CHECK (ambassador_rank IN ('junior', 'senior', 'executive', 'chief')),
    diplomatic_specialization VARCHAR(30) CHECK (diplomatic_specialization IN ('recruitment', 'cultural_exchange', 'trade', 'education', 'infrastructure')),
    
    -- Performance metrics
    recruitment_count INTEGER NOT NULL DEFAULT 0,
    diplomatic_missions INTEGER NOT NULL DEFAULT 0,
    cross_community_collaborations INTEGER NOT NULL DEFAULT 0,
    cultural_contributions INTEGER NOT NULL DEFAULT 0,
    
    -- Diplomatic influence
    influence_score DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    trust_rating DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    network_reach INTEGER NOT NULL DEFAULT 0,
    
    -- Rewards and recognition
    diplomatic_badges JSONB DEFAULT '[]' NOT NULL,
    expansion_bonuses DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    
    -- Status
    is_active BOOLEAN DEFAULT true NOT NULL,
    commission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_diplomatic_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Term limits
    term_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    term_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    renewable BOOLEAN DEFAULT true NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(player_id)
);

-- Diplomatic missions
CREATE TABLE diplomatic_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ambassador_id UUID NOT NULL REFERENCES global_ambassadors(id) ON DELETE CASCADE,
    
    -- Mission details
    mission_type VARCHAR(30) NOT NULL CHECK (mission_type IN ('recruitment_drive', 'cultural_exchange', 'community_partnership', 'infrastructure_collaboration', 'educational_exchange')),
    mission_title VARCHAR(200) NOT NULL,
    mission_description TEXT NOT NULL,
    
    -- Target regions/communities
    target_countries JSONB DEFAULT '[]' NOT NULL,
    target_communities JSONB DEFAULT '[]' NOT NULL,
    
    -- Mission objectives
    primary_objective VARCHAR(200) NOT NULL,
    secondary_objectives JSONB DEFAULT '[]' NOT NULL,
    success_metrics JSONB NOT NULL DEFAULT '{}',
    
    -- Mission timeline
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    extension_possible BOOLEAN DEFAULT true NOT NULL,
    
    -- Resources allocated
    budget_allocated DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    diplomatic_points_allocated INTEGER NOT NULL DEFAULT 0,
    
    -- Results
    recruitment_achieved INTEGER NOT NULL DEFAULT 0,
    partnerships_established INTEGER NOT NULL DEFAULT 0,
    cultural_impact_score DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('planning', 'active', 'completed', 'failed', 'extended')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ===================================
-- E. PEOPLE POWER GLOBAL SUMMIT (PPGS) - GLOBAL EVENTS
-- ===================================

-- Summit registry
CREATE TABLE global_summits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Summit identification
    summit_name VARCHAR(200) NOT NULL,
    summit_number INTEGER NOT NULL,
    summit_theme VARCHAR(100) NOT NULL,
    summit_type VARCHAR(20) NOT NULL CHECK (summit_type IN ('monthly', 'quarterly', 'special', 'emergency')),
    
    -- Summit schedule
    summit_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_hours INTEGER NOT NULL DEFAULT 24,
    registration_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Summit content
    agenda_items JSONB NOT NULL DEFAULT '[]',
    keynote_speakers JSONB NOT NULL DEFAULT '[]',
    voting_sessions JSONB NOT NULL DEFAULT '[]',
    
    -- Global participation
    registered_countries INTEGER NOT NULL DEFAULT 0,
    registered_participants BIGINT NOT NULL DEFAULT 0,
    actual_participants BIGINT NOT NULL DEFAULT 0,
    
    -- Summit decisions
    global_decisions JSONB NOT NULL DEFAULT '[]',
    civilization_updates JSONB NOT NULL DEFAULT '[]',
    policy_changes JSONB NOT NULL DEFAULT '[]',
    
    -- Rewards and recognition
    total_reward_pool DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    participation_rewards JSONB NOT NULL DEFAULT '{}',
    achievement_unlocks JSONB NOT NULL DEFAULT '[]',
    
    -- Story integration
    story_chapter_released INTEGER,
    major_plot_points JSONB NOT NULL DEFAULT '[]',
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'registration', 'active', 'completed', 'cancelled')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Summit participation
CREATE TABLE summit_participations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    summit_id UUID NOT NULL REFERENCES global_summits(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    
    -- Participation details
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    attendance_duration_minutes INTEGER NOT NULL DEFAULT 0,
    sessions_attended JSONB DEFAULT '[]' NOT NULL,
    
    -- Voting activity
    votes_cast INTEGER NOT NULL DEFAULT 0,
    voting_power_used DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    
    -- Contributions
    questions_asked INTEGER NOT NULL DEFAULT 0,
    contributions_made JSONB DEFAULT '[]' NOT NULL,
    networking_connections INTEGER NOT NULL DEFAULT 0,
    
    -- Rewards earned
    reputation_earned DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    tokens_earned DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    achievements_earned JSONB DEFAULT '[]' NOT NULL,
    
    -- Status
    attended BOOLEAN DEFAULT false NOT NULL,
    
    UNIQUE(summit_id, player_id)
);

-- ===================================
-- F. PEOPLE POWER WORLD PRESIDENT (PPWP) - SYMBOLIC LEADERSHIP
-- ===================================

-- World presidency registry
CREATE TABLE world_presidency (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- World president identification
    world_president_id UUID NOT NULL REFERENCES players(id) ON DELETE RESTRICT,
    presidency_number INTEGER NOT NULL,
    presidency_title VARCHAR(100) NOT NULL,
    
    -- Election data
    election_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    term_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    term_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Selection criteria
    global_reputation_score DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    cross_country_contributions INTEGER NOT NULL DEFAULT 0,
    trust_score DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    ethical_behavior_rating DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    
    -- Symbolic powers (limited)
    can_propose_global_missions BOOLEAN DEFAULT true NOT NULL,
    can_unlock_story_arcs BOOLEAN DEFAULT true NOT NULL,
    can_speak_for_community BOOLEAN DEFAULT true NOT NULL,
    
    -- Restrictions (very important)
    cannot_control_economy BOOLEAN DEFAULT true NOT NULL,
    cannot_change_rewards BOOLEAN DEFAULT true NOT NULL,
    cannot_override_ai_governance BOOLEAN DEFAULT true NOT NULL,
    veto_power_count INTEGER NOT NULL DEFAULT 1,
    
    -- Presidential metrics
    global_approval_rating DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    unity_score DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    leadership_effectiveness DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    
    -- Status
    is_active BOOLEAN DEFAULT true NOT NULL,
    impeachment_proceedings BOOLEAN DEFAULT false NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- World presidential actions
CREATE TABLE world_presidential_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    presidency_id UUID NOT NULL REFERENCES world_presidency(id) ON DELETE CASCADE,
    
    -- Action details
    action_type VARCHAR(30) NOT NULL CHECK (action_type IN ('global_mission', 'story_arc_unlock', 'community_speech', 'unity_initiative', 'symbolic_decree')),
    action_title VARCHAR(200) NOT NULL,
    action_description TEXT NOT NULL,
    
    -- Action parameters
    action_parameters JSONB NOT NULL DEFAULT '{}',
    affected_regions JSONB DEFAULT '[]' NOT NULL,
    expected_impact JSONB NOT NULL DEFAULT '{}',
    
    -- Global approval
    requires_global_approval BOOLEAN DEFAULT true NOT NULL,
    approval_votes BIGINT NOT NULL DEFAULT 0,
    rejection_votes BIGINT NOT NULL DEFAULT 0,
    abstain_votes BIGINT NOT NULL DEFAULT 0,
    
    -- Implementation
    implemented BOOLEAN DEFAULT false NOT NULL,
    implementation_date TIMESTAMP WITH TIME ZONE,
    implementation_results JSONB NOT NULL DEFAULT '{}',
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'approved', 'rejected', 'implemented', 'failed')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    implemented_at TIMESTAMP WITH TIME ZONE
);

-- ===================================
-- POWER BALANCE AND SAFETY SYSTEMS
-- ===================================

-- AI governance oversight
CREATE TABLE ai_governance_oversight (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Oversight target
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('president', 'ambassador', 'community', 'summit', 'world_president')),
    target_id UUID NOT NULL,
    
    -- Monitoring metrics
    integrity_score DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    abuse_probability DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    manipulation_detected BOOLEAN DEFAULT false NOT NULL,
    
    -- Automated actions
    auto_restrictions_applied JSONB DEFAULT '[]' NOT NULL,
    warnings_issued INTEGER NOT NULL DEFAULT 0,
    manual_review_required BOOLEAN DEFAULT false NOT NULL,
    
    -- Audit trail
    monitoring_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_assessment TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assessment_frequency_hours INTEGER NOT NULL DEFAULT 24,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Power balance metrics
CREATE TABLE power_balance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Balance indicators
    citizen_participation_rate DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    ambassador_influence_ratio DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    presidential_power_index DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    world_president_symbolic_score DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    
    -- System health
    governance_stability_index DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    user_satisfaction_score DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    economic_fairness_index DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    
    -- Risk indicators
    centralization_risk DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    manipulation_risk DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    abuse_incidents INTEGER NOT NULL DEFAULT 0,
    
    -- Timestamps
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(calculated_at::date)
);

-- ===================================
-- PERFORMANCE INDEXES
-- ===================================

-- Global network indexes
CREATE INDEX idx_global_citizens_player_id ON global_citizens(player_id);
CREATE INDEX idx_global_citizens_citizenship_level ON global_citizens(citizenship_level);
CREATE INDEX idx_global_citizens_global_reputation_score ON global_citizens(global_reputation_score);
CREATE INDEX idx_global_citizens_primary_skill ON global_citizens(primary_skill);
CREATE INDEX idx_global_citizens_is_active ON global_citizens(is_active);

-- Community indexes
CREATE INDEX idx_diaspora_communities_community_type ON diaspora_communities(community_type);
CREATE INDEX idx_diaspora_communities_primary_country ON diaspora_communities(primary_country);
CREATE INDEX idx_diaspora_communities_is_active ON diaspora_communities(is_active);
CREATE INDEX idx_diaspora_communities_member_count ON diaspora_communities(member_count);

-- Community membership indexes
CREATE INDEX idx_community_memberships_player_id ON community_memberships(player_id);
CREATE INDEX idx_community_memberships_community_id ON community_memberships(community_id);
CREATE INDEX idx_community_memberships_membership_type ON community_memberships(membership_type);
CREATE INDEX idx_community_memberships_is_active ON community_memberships(is_active);

-- Country presidency indexes
CREATE INDEX idx_country_presidencies_country_code ON country_presidencies(country_code);
CREATE INDEX idx_country_presidencies_current_president_id ON country_presidencies(current_president_id);
CREATE INDEX idx_country_presidencies_is_active ON country_presidencies(is_active);

-- Ambassador indexes
CREATE INDEX idx_global_ambassadors_player_id ON global_ambassadors(player_id);
CREATE INDEX idx_global_ambassadors_representing_country ON global_ambassadors(representing_country);
CREATE INDEX idx_global_ambassadors_ambassador_rank ON global_ambassadors(ambassador_rank);
CREATE INDEX idx_global_ambassadors_is_active ON global_ambassadors(is_active);

-- Summit indexes
CREATE INDEX idx_global_summits_summit_type ON global_summits(summit_type);
CREATE INDEX idx_global_summits_status ON global_summits(status);
CREATE INDEX idx_global_summits_summit_date ON global_summits(summit_date);
CREATE INDEX idx_summit_participations_summit_id ON summit_participations(summit_id);
CREATE INDEX idx_summit_participations_player_id ON summit_participations(player_id);

-- World presidency indexes
CREATE INDEX idx_world_presidency_world_president_id ON world_presidency(world_president_id);
CREATE INDEX idx_world_presidency_is_active ON world_presidency(is_active);

-- AI governance indexes
CREATE INDEX idx_ai_governance_oversight_target_type ON ai_governance_oversight(target_type);
CREATE INDEX idx_ai_governance_oversight_target_id ON ai_governance_oversight(target_id);
CREATE INDEX idx_ai_governance_oversight_manipulation_detected ON ai_governance_oversight(manipulation_detected);

-- ===================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ===================================

-- Update global network stats
CREATE OR REPLACE FUNCTION update_global_network_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        -- Update daily stats
        INSERT INTO global_network_stats (total_citizens, active_citizens_today, calculated_at)
        VALUES (
            (SELECT COUNT(*) FROM global_citizens WHERE is_active = true),
            (SELECT COUNT(*) FROM global_citizens WHERE is_active = true AND last_active >= CURRENT_DATE),
            NOW()
        )
        ON CONFLICT (calculated_at::date) 
        DO UPDATE SET
            total_citizens = EXCLUDED.total_citizens,
            active_citizens_today = EXCLUDED.active_citizens_today;
        
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_global_network_stats
    AFTER INSERT OR UPDATE ON global_citizens
    FOR EACH ROW EXECUTE FUNCTION update_global_network_stats();

-- Update community member count
CREATE OR REPLACE FUNCTION update_community_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE diaspora_communities 
        SET member_count = member_count + 1, last_activity = NOW()
        WHERE id = NEW.community_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE diaspora_communities 
        SET member_count = member_count - 1
        WHERE id = OLD.community_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_community_member_count
    AFTER INSERT OR DELETE ON community_memberships
    FOR EACH ROW EXECUTE FUNCTION update_community_member_count();

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_global_citizens_updated_at 
    BEFORE UPDATE ON global_citizens
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diaspora_communities_updated_at 
    BEFORE UPDATE ON diaspora_communities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_country_presidencies_updated_at 
    BEFORE UPDATE ON country_presidencies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_global_ambassadors_updated_at 
    BEFORE UPDATE ON global_ambassadors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_global_summits_updated_at 
    BEFORE UPDATE ON global_summits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_world_presidency_updated_at 
    BEFORE UPDATE ON world_presidency
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- INITIAL DATA SETUP
-- ===================================

-- Create default global network stats
INSERT INTO global_network_stats (total_citizens, active_citizens_today, calculated_at)
VALUES (0, 0, NOW());
