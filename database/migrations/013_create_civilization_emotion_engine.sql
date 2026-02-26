-- ===================================
-- CIVILIZATION EMOTION ENGINE DATABASE SCHEMA
-- THE INVISIBLE PSYCHOLOGICAL OPERATING SYSTEM
-- ===================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ===================================
-- PLAYER IDENTITY & MEANING SYSTEMS
-- ===================================

-- Player identity layers
CREATE TABLE player_identity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    
    -- Origin layer
    origin_type VARCHAR(50) NOT NULL DEFAULT 'citizen',
    origin_country VARCHAR(100),
    origin_community UUID REFERENCES diaspora_communities(id),
    join_date TIMESTAMP WITH TIME ZONE NOT NULL,
    pathway VARCHAR(50) DEFAULT 'standard',
    
    -- Story path
    story_theme VARCHAR(50) DEFAULT 'discovery',
    story_narrative TEXT,
    current_chapter INTEGER DEFAULT 1,
    total_chapters INTEGER DEFAULT 0,
    
    -- Contribution style
    primary_style VARCHAR(50) NOT NULL,
    secondary_style VARCHAR(50),
    style_confidence DECIMAL(5,2) DEFAULT 0.00,
    visual_signature VARCHAR(100),
    
    -- Reputation aura
    aura_intensity DECIMAL(5,2) DEFAULT 0.10,
    aura_color VARCHAR(20) DEFAULT 'gray',
    aura_pattern VARCHAR(50) DEFAULT 'simple',
    glow_radius INTEGER DEFAULT 5,
    pulse_frequency DECIMAL(5,2) DEFAULT 1.0,
    
    -- Evolution stage
    evolution_stage VARCHAR(50) DEFAULT 'awakening',
    identity_strength DECIMAL(5,2) DEFAULT 0.00,
    emotional_resonance DECIMAL(5,2) DEFAULT 0.00,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(player_id)
);

-- Player story chapters
CREATE TABLE player_story_chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL,
    chapter_title VARCHAR(200) NOT NULL,
    chapter_description TEXT,
    action_type VARCHAR(100),
    impact_score DECIMAL(5,2) DEFAULT 0.00,
    emotional_weight DECIMAL(5,2) DEFAULT 0.00,
    chapter_timestamp TIMESTAMP WITH TIME ZONE,
    is_completed BOOLEAN DEFAULT false NOT NULL,
    
    UNIQUE(player_id, chapter_number)
);

-- Player behavior patterns
CREATE TABLE player_behavior_patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL,
    frequency INTEGER NOT NULL DEFAULT 0,
    avg_impact DECIMAL(5,2) DEFAULT 0.00,
    last_action TIMESTAMP WITH TIME ZONE,
    pattern_strength DECIMAL(5,2) DEFAULT 0.00,
    
    analysis_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(player_id, action_type, analysis_date)
);

-- Social tendencies analysis
CREATE TABLE player_social_tendencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    
    -- Social metrics
    social_engagement DECIMAL(5,2) DEFAULT 0.00,
    collaboration_tendency DECIMAL(5,2) DEFAULT 0.00,
    leadership_propensity DECIMAL(5,2) DEFAULT 0.00,
    mentorship_inclination DECIMAL(5,2) DEFAULT 0.00,
    diplomatic_skill DECIMAL(5,2) DEFAULT 0.00,
    
    -- Communication style
    communication_frequency DECIMAL(5,2) DEFAULT 0.00,
    message_length_avg DECIMAL(5,2) DEFAULT 0.00,
    response_time_avg DECIMAL(5,2) DEFAULT 0.00,
    positive_sentiment DECIMAL(5,2) DEFAULT 0.00,
    
    -- Network analysis
    network_centrality DECIMAL(5,2) DEFAULT 0.00,
    influence_score DECIMAL(5,2) DEFAULT 0.00,
    bridge_score DECIMAL(5,2) DEFAULT 0.00,
    
    analysis_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(player_id, analysis_date)
);

-- ===================================
-- BELONGING & COMMUNITY SYSTEMS
-- ===================================

-- Community celebrations
CREATE TABLE community_celebrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id VARCHAR(10) NOT NULL,
    achievement_type VARCHAR(100) NOT NULL,
    achievement_description TEXT NOT NULL,
    
    -- Celebration details
    celebration_level VARCHAR(20) NOT NULL CHECK (celebration_level IN ('local', 'regional', 'national', 'global')),
    duration_seconds INTEGER NOT NULL DEFAULT 300,
    visual_effects JSONB DEFAULT '{}',
    
    -- Participation
    participant_count INTEGER DEFAULT 0,
    contributor_names TEXT[],
    
    -- Emotional impact
    belonging_boost DECIMAL(5,2) DEFAULT 0.00,
    pride_increase DECIMAL(5,2) DEFAULT 0.00,
    community_strength_gain DECIMAL(5,2) DEFAULT 0.00,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE
);

-- Shared memories
CREATE TABLE shared_memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID NOT NULL,
    memory_type VARCHAR(50) NOT NULL,
    memory_title VARCHAR(200) NOT NULL,
    memory_description TEXT NOT NULL,
    
    -- Memory context
    participants UUID[] DEFAULT '{}',
    location_data JSONB DEFAULT '{}',
    emotional_significance DECIMAL(5,2) DEFAULT 0.00,
    
    -- Memory persistence
    is_historic BOOLEAN DEFAULT false NOT NULL,
    remembrance_count INTEGER DEFAULT 0,
    last_remembered TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community bonds
CREATE TABLE community_bonds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    community_id UUID NOT NULL,
    bond_type VARCHAR(50) NOT NULL,
    bond_strength DECIMAL(5,2) DEFAULT 0.00,
    
    -- Emotional components
    belonging_score DECIMAL(5,2) DEFAULT 0.00,
    trust_level DECIMAL(5,2) DEFAULT 0.00,
    commitment_level DECIMAL(5,2) DEFAULT 0.00,
    emotional_investment DECIMAL(5,2) DEFAULT 0.00,
    
    -- Bond dynamics
    formation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_strengthened TIMESTAMP WITH TIME ZONE,
    weakening_factors JSONB DEFAULT '{}',
    
    UNIQUE(player_id, community_id)
);

-- ===================================
-- RECOGNITION CASCADE SYSTEM
-- ===================================

-- Recognition events
CREATE TABLE recognition_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    action_id UUID,
    
    -- Recognition classification
    recognition_level VARCHAR(20) NOT NULL CHECK (recognition_level IN ('micro', 'social', 'historical')),
    recognition_type VARCHAR(100) NOT NULL,
    
    -- Impact assessment
    impact_score DECIMAL(5,2) NOT NULL,
    emotional_weight DECIMAL(5,2) NOT NULL,
    community_value DECIMAL(5,2) DEFAULT 0.00,
    historical_significance DECIMAL(5,2) DEFAULT 0.00,
    
    -- Recognition details
    description TEXT NOT NULL,
    public_visibility BOOLEAN DEFAULT true,
    audience_type VARCHAR(50) DEFAULT 'community',
    
    -- Temporal aspects
    recognition_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_permanent BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Historical records
CREATE TABLE civilization_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    
    -- Historical event details
    event_type VARCHAR(100) NOT NULL,
    event_description TEXT NOT NULL,
    event_category VARCHAR(50) NOT NULL,
    
    -- Significance assessment
    historical_significance VARCHAR(20) NOT NULL CHECK (historical_significance IN ('minor', 'notable', 'significant', 'legendary', 'mythic')),
    impact_score DECIMAL(5,2) NOT NULL,
    cultural_importance DECIMAL(5,2) DEFAULT 0.00,
    
    -- Context
    location_data JSONB DEFAULT '{}',
    participants UUID[] DEFAULT '{}',
    witnesses UUID[] DEFAULT '{}',
    
    -- Historical record
    recorded_by UUID REFERENCES players(id),
    recording_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Verification
    is_verified BOOLEAN DEFAULT false NOT NULL,
    verification_sources JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monuments and memorials
CREATE TABLE civilization_monuments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    monument_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    
    -- Honored individual(s)
    honored_players UUID[] NOT NULL,
    primary_player_id UUID NOT NULL REFERENCES players(id),
    
    -- Monument properties
    location_data JSONB DEFAULT '{}',
    visual_design JSONB DEFAULT '{}',
    monument_tier VARCHAR(20) DEFAULT 'bronze' CHECK (monument_tier IN ('bronze', 'silver', 'gold', 'platinum', 'legendary')),
    
    -- Historical context
    commemoration_reason TEXT NOT NULL,
    historical_period VARCHAR(100),
    significance_score DECIMAL(5,2) NOT NULL,
    
    -- Visitor interaction
    visit_count INTEGER DEFAULT 0,
    last_visit TIMESTAMP WITH TIME ZONE,
    visitor_emotions JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    dedicated_at TIMESTAMP WITH TIME ZONE
);

-- Titles and honors
CREATE TABLE player_titles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    title_name VARCHAR(100) NOT NULL,
    title_category VARCHAR(50) NOT NULL,
    
    -- Title properties
    title_tier VARCHAR(20) NOT NULL CHECK (title_tier IN ('common', 'rare', 'epic', 'legendary', 'mythic')),
    title_prefix VARCHAR(50),
    title_suffix VARCHAR(50),
    visual_badge JSONB DEFAULT '{}',
    
    -- Award context
    awarded_by UUID REFERENCES players(id),
    awarded_for TEXT NOT NULL,
    awarded_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Title status
    is_active BOOLEAN DEFAULT true NOT NULL,
    is_hereditary BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(player_id, title_name)
);

-- ===================================
-- PURPOSE GENERATION SYSTEM
-- ===================================

-- Player purpose assignments
CREATE TABLE player_purpose (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    
    -- Purpose classification
    purpose_type VARCHAR(50) NOT NULL,
    purpose_title VARCHAR(100) NOT NULL,
    purpose_description TEXT NOT NULL,
    
    -- Purpose metrics
    confidence_score DECIMAL(5,2) NOT NULL,
    purpose_score DECIMAL(5,2) NOT NULL,
    alignment_score DECIMAL(5,2) DEFAULT 0.00,
    
    -- Discovery context
    discovery_method VARCHAR(50) NOT NULL,
    discovery_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    behavior_evidence JSONB DEFAULT '{}',
    
    -- Purpose features
    unlocked_features JSONB DEFAULT '[]',
    special_permissions JSONB DEFAULT '[]',
    purpose_tools JSONB DEFAULT '{}',
    
    -- Purpose evolution
    current_level INTEGER DEFAULT 1,
    max_level INTEGER DEFAULT 10,
    experience_points INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true NOT NULL,
    accepted_at TIMESTAMP WITH TIME ZONE,
    last_pursued TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(player_id)
);

-- Purpose progression
CREATE TABLE purpose_progression (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    purpose_type VARCHAR(50) NOT NULL,
    
    -- Progress metrics
    current_level INTEGER NOT NULL DEFAULT 1,
    experience_gained INTEGER DEFAULT 0,
    experience_required INTEGER DEFAULT 100,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    
    -- Milestone achievements
    milestones_completed JSONB DEFAULT '[]',
    current_milestone INTEGER DEFAULT 0,
    total_milestones INTEGER DEFAULT 10,
    
    -- Skill development
    skill_levels JSONB DEFAULT '{}',
    mastery_areas JSONB DEFAULT '[]',
    
    -- Impact tracking
    total_impact_score DECIMAL(10,2) DEFAULT 0.00,
    community_beneficiaries INTEGER DEFAULT 0,
    legacy_contributions INTEGER DEFAULT 0,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(player_id, purpose_type)
);

-- ===================================
-- IMPACT VISUALIZATION SYSTEM
-- ===================================

-- Impact visualizations
CREATE TABLE impact_visualizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    action_id UUID NOT NULL,
    
    -- Visualization properties
    visualization_type VARCHAR(50) NOT NULL,
    visual_effect VARCHAR(100) NOT NULL,
    duration_ms INTEGER NOT NULL,
    intensity DECIMAL(5,2) NOT NULL,
    
    -- Visual parameters
    color_code VARCHAR(20) NOT NULL,
    effect_size DECIMAL(5,2) DEFAULT 1.0,
    animation_pattern VARCHAR(50) DEFAULT 'pulse',
    particle_count INTEGER DEFAULT 50,
    
    -- Location data
    location_coordinates JSONB DEFAULT '{}',
    affected_area JSONB DEFAULT '{}',
    
    -- Emotional response
    emotional_response VARCHAR(50) NOT NULL,
    satisfaction_gain DECIMAL(5,2) DEFAULT 0.00,
    purpose_fulfillment DECIMAL(5,2) DEFAULT 0.00,
    
    -- Visibility
    visibility_radius INTEGER DEFAULT 100,
    audience_type VARCHAR(50) DEFAULT 'community',
    is_public BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- World effects
CREATE TABLE world_effects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    effect_type VARCHAR(50) NOT NULL,
    trigger_action VARCHAR(100) NOT NULL,
    
    -- Effect properties
    effect_name VARCHAR(100) NOT NULL,
    effect_description TEXT,
    visual_representation JSONB DEFAULT '{}',
    
    -- Geographic scope
    scope_type VARCHAR(20) NOT NULL CHECK (scope_type IN ('local', 'regional', 'national', 'global')),
    affected_countries VARCHAR(10)[],
    affected_communities UUID[],
    
    -- Temporal properties
    duration_minutes INTEGER DEFAULT 5,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    
    -- Impact metrics
    player_impact_score DECIMAL(5,2) DEFAULT 0.00,
    community_impact_score DECIMAL(5,2) DEFAULT 0.00,
    civilization_impact_score DECIMAL(5,2) DEFAULT 0.00,
    
    -- Status
    is_active BOOLEAN DEFAULT true NOT NULL,
    is_permanent BOOLEAN DEFAULT false NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- LEGACY ENGINE
-- ===================================

-- Player legacy records
CREATE TABLE player_legacy (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    
    -- Legacy classification
    legacy_type VARCHAR(50) NOT NULL,
    legacy_tier VARCHAR(20) NOT NULL CHECK (legacy_tier IN ('local', 'regional', 'national', 'global', 'civilizational')),
    legacy_score DECIMAL(10,2) NOT NULL,
    
    -- Legacy components
    founding_member BOOLEAN DEFAULT false NOT NULL,
    historic_missions INTEGER DEFAULT 0,
    diplomatic_achievements INTEGER DEFAULT 0,
    cultural_contributions INTEGER DEFAULT 0,
    mentorship_impact INTEGER DEFAULT 0,
    leadership_roles INTEGER DEFAULT 0,
    total_impact DECIMAL(15,2) DEFAULT 0.00,
    
    -- Legacy narrative
    legacy_summary TEXT,
    legacy_highlights JSONB DEFAULT '[]',
    memorable_moments JSONB DEFAULT '[]',
    
    -- Immortality status
    is_immortal BOOLEAN DEFAULT false NOT NULL,
    remembrance_frequency DECIMAL(5,2) DEFAULT 0.00,
    cultural_significance DECIMAL(5,2) DEFAULT 0.00,
    
    -- Historical context
    legacy_period VARCHAR(100),
    civilization_era VARCHAR(50),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(player_id)
);

-- Mentorship trees
CREATE TABLE mentorship_trees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    root_mentor_id UUID NOT NULL REFERENCES players(id),
    
    -- Tree structure
    tree_depth INTEGER DEFAULT 0,
    total_descendants INTEGER DEFAULT 0,
    active_mentees INTEGER DEFAULT 0,
    graduated_mentees INTEGER DEFAULT 0,
    
    -- Legacy metrics
    knowledge_transferred DECIMAL(10,2) DEFAULT 0.00,
    careers_launched INTEGER DEFAULT 0,
    leaders_developed INTEGER DEFAULT 0,
    community_impact DECIMAL(10,2) DEFAULT 0.00,
    
    -- Tree visualization
    tree_layout JSONB DEFAULT '{}',
    branch_strengths JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mentorship relationships
CREATE TABLE mentorship_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID NOT NULL REFERENCES players(id),
    mentee_id UUID NOT NULL REFERENCES players(id),
    tree_id UUID REFERENCES mentorship_trees(id),
    
    -- Relationship details
    relationship_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    relationship_end TIMESTAMP WITH TIME ZONE,
    relationship_status VARCHAR(20) DEFAULT 'active' CHECK (relationship_status IN ('active', 'completed', 'paused', 'terminated')),
    
    -- Mentorship quality
    mentorship_rating DECIMAL(3,2) DEFAULT 0.00,
    knowledge_transfer_score DECIMAL(5,2) DEFAULT 0.00,
    skill_development_score DECIMAL(5,2) DEFAULT 0.00,
    personal_growth_score DECIMAL(5,2) DEFAULT 0.00,
    
    -- Outcomes
    mentee_achievements JSONB DEFAULT '[]',
    career_advancement BOOLEAN DEFAULT false,
    leadership_development BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(mentor_id, mentee_id)
);

-- ===================================
-- SHARED STRUGGLE MECHANIC
-- ===================================

-- Shared challenges
CREATE TABLE shared_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_name VARCHAR(200) NOT NULL,
    challenge_type VARCHAR(50) NOT NULL,
    challenge_description TEXT NOT NULL,
    
    -- Challenge properties
    difficulty_level VARCHAR(20) NOT NULL CHECK (difficulty_level IN ('easy', 'moderate', 'hard', 'extreme', 'legendary')),
    scope_type VARCHAR(20) NOT NULL CHECK (scope_type IN ('local', 'regional', 'national', 'global')),
    
    -- Participation
    participating_countries VARCHAR(10)[],
    participating_communities UUID[],
    participant_count INTEGER DEFAULT 0,
    
    -- Challenge dynamics
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    duration_hours INTEGER,
    
    -- Success metrics
    success_threshold DECIMAL(5,2) DEFAULT 0.80,
    current_progress DECIMAL(5,2) DEFAULT 0.00,
    cooperation_score DECIMAL(5,2) DEFAULT 0.00,
    
    -- Outcomes
    is_successful BOOLEAN DEFAULT false NOT NULL,
    victory_bonus DECIMAL(5,2) DEFAULT 0.00,
    community_bonding_gain DECIMAL(5,2) DEFAULT 0.00,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Challenge participation
CREATE TABLE challenge_participation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID NOT NULL REFERENCES shared_challenges(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    community_id UUID,
    
    -- Participation details
    role_type VARCHAR(50) DEFAULT 'participant',
    contribution_score DECIMAL(5,2) DEFAULT 0.00,
    cooperation_actions INTEGER DEFAULT 0,
    
    -- Experience
    emotional_impact DECIMAL(5,2) DEFAULT 0.00,
    belonging_increase DECIMAL(5,2) DEFAULT 0.00,
    pride_achievement DECIMAL(5,2) DEFAULT 0.00,
    
    -- Recognition
    recognition_earned VARCHAR(100),
    badge_awarded VARCHAR(100),
    
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(challenge_id, player_id)
);

-- ===================================
-- SYMBOL & MYTH CREATION
-- ===================================

-- Community symbols
CREATE TABLE community_symbols (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID NOT NULL,
    symbol_type VARCHAR(50) NOT NULL,
    symbol_name VARCHAR(100) NOT NULL,
    
    -- Symbol properties
    visual_design JSONB DEFAULT '{}',
    color_scheme VARCHAR(50),
    symbolic_meaning TEXT,
    cultural_significance DECIMAL(5,2) DEFAULT 0.00,
    
    -- Evolution
    evolution_stage VARCHAR(20) DEFAULT 'emerging',
    creation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_evolved TIMESTAMP WITH TIME ZONE,
    evolution_count INTEGER DEFAULT 0,
    
    -- Usage
    usage_frequency DECIMAL(5,2) DEFAULT 0.00,
    recognition_level DECIMAL(5,2) DEFAULT 0.00,
    emotional_resonance DECIMAL(5,2) DEFAULT 0.00,
    
    -- Creator attribution
    created_by UUID REFERENCES players(id),
    contributors UUID[] DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cultural myths
CREATE TABLE cultural_myths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID NOT NULL,
    myth_title VARCHAR(200) NOT NULL,
    myth_story TEXT NOT NULL,
    
    -- Myth properties
    myth_category VARCHAR(50) NOT NULL,
    moral_lesson TEXT,
    cultural_importance DECIMAL(5,2) DEFAULT 0.00,
    
    -- Myth elements
    heroes JSONB DEFAULT '[]',
    legendary_events JSONB DEFAULT '[]',
    symbolic_elements JSONB DEFAULT '[]',
    
    -- Myth dynamics
    origin_date TIMESTAMP WITH TIME ZONE,
    teller_count INTEGER DEFAULT 0,
    adaptation_count INTEGER DEFAULT 0,
    
    -- Emotional impact
    inspiration_score DECIMAL(5,2) DEFAULT 0.00,
    unity_fostering DECIMAL(5,2) DEFAULT 0.00,
    identity_reinforcement DECIMAL(5,2) DEFAULT 0.00,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_told TIMESTAMP WITH TIME ZONE
);

-- Cultural artifacts
CREATE TABLE cultural_artifacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artifact_name VARCHAR(200) NOT NULL,
    artifact_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    
    -- Creation context
    creator_id UUID NOT NULL REFERENCES players(id),
    community_id UUID NOT NULL,
    creation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cultural_movement VARCHAR(100),
    
    -- Artifact properties
    visual_representation JSONB DEFAULT '{}',
    symbolic_value DECIMAL(5,2) DEFAULT 0.00,
    artistic_merit DECIMAL(5,2) DEFAULT 0.00,
    historical_significance DECIMAL(5,2) DEFAULT 0.00,
    
    -- Cultural impact
    influence_score DECIMAL(5,2) DEFAULT 0.00,
    adoption_rate DECIMAL(5,2) DEFAULT 0.00,
    longevity_prediction DECIMAL(5,2) DEFAULT 0.00,
    
    -- Display and preservation
    is_displayed BOOLEAN DEFAULT true NOT NULL,
    display_location JSONB DEFAULT '{}',
    preservation_status VARCHAR(20) DEFAULT 'active',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- EMOTIONAL RHYTHM SYSTEM
-- ===================================

-- Emotional cycles
CREATE TABLE emotional_cycles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    
    -- Cycle properties
    current_phase VARCHAR(20) NOT NULL CHECK (current_phase IN ('exploration', 'challenge', 'cooperation', 'celebration', 'reflection')),
    cycle_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    phase_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cycle_number INTEGER DEFAULT 1,
    
    -- Phase metrics
    phase_satisfaction DECIMAL(5,2) DEFAULT 0.00,
    phase_engagement DECIMAL(5,2) DEFAULT 0.00,
    phase_completion DECIMAL(5,2) DEFAULT 0.00,
    
    -- Transition triggers
    transition_reason VARCHAR(100),
    transition_data JSONB DEFAULT '{}',
    
    -- Predictions
    next_phase_prediction VARCHAR(20),
    transition_confidence DECIMAL(5,2) DEFAULT 0.00,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Phase features
CREATE TABLE phase_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phase_name VARCHAR(20) NOT NULL,
    feature_name VARCHAR(100) NOT NULL,
    feature_type VARCHAR(50) NOT NULL,
    
    -- Feature properties
    is_active BOOLEAN DEFAULT true NOT NULL,
    feature_description TEXT,
    emotional_benefit VARCHAR(50),
    
    -- Activation rules
    activation_conditions JSONB DEFAULT '{}',
    deactivation_conditions JSONB DEFAULT '{}',
    
    -- Feature metrics
    usage_frequency DECIMAL(5,2) DEFAULT 0.00,
    satisfaction_score DECIMAL(5,2) DEFAULT 0.00,
    effectiveness_rating DECIMAL(5,2) DEFAULT 0.00,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(phase_name, feature_name)
);

-- ===================================
-- EMOTIONAL STATE TRACKING
-- ===================================

-- Player emotional state
CREATE TABLE player_emotional_state (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    emotion_type VARCHAR(50) NOT NULL,
    intensity DECIMAL(5,2) NOT NULL CHECK (intensity >= 0 AND intensity <= 1),
    
    -- Emotional context
    trigger_event VARCHAR(100),
    trigger_source VARCHAR(50),
    context_data JSONB DEFAULT '{}',
    
    -- Temporal aspects
    duration_minutes INTEGER DEFAULT 0,
    peak_intensity DECIMAL(5,2) DEFAULT 0.00,
    decay_rate DECIMAL(5,2) DEFAULT 0.00,
    
    -- Impact assessment
    behavior_influence DECIMAL(5,2) DEFAULT 0.00,
    decision_impact DECIMAL(5,2) DEFAULT 0.00,
    social_effect DECIMAL(5,2) DEFAULT 0.00,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(player_id, emotion_type)
);

-- Psychological effects
CREATE TABLE psychological_effects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    effect_type VARCHAR(50) NOT NULL,
    intensity DECIMAL(5,2) NOT NULL,
    
    -- Effect properties
    duration_seconds INTEGER NOT NULL,
    decay_rate DECIMAL(5,2) DEFAULT 0.00,
    peak_time TIMESTAMP WITH TIME ZONE,
    
    -- Behavioral influence
    motivation_boost DECIMAL(5,2) DEFAULT 0.00,
    engagement_increase DECIMAL(5,2) DEFAULT 0.00,
    satisfaction_gain DECIMAL(5,2) DEFAULT 0.00,
    
    -- Context
    trigger_event VARCHAR(100),
    associated_emotions JSONB DEFAULT '[]',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- ===================================
-- ETHICAL SAFETY CORE
-- ===================================

-- Session monitoring
CREATE TABLE player_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_end TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER DEFAULT 0,
    
    -- Session quality
    engagement_score DECIMAL(5,2) DEFAULT 0.00,
    satisfaction_score DECIMAL(5,2) DEFAULT 0.00,
    emotional_state JSONB DEFAULT '{}',
    
    -- Safety metrics
    break_count INTEGER DEFAULT 0,
    break_duration_total INTEGER DEFAULT 0,
    warning_count INTEGER DEFAULT 0,
    
    -- Session context
    device_type VARCHAR(50),
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health monitoring
CREATE TABLE emotional_health_monitoring (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    
    -- Health metrics
    overall_health_score DECIMAL(5,2) NOT NULL,
    emotional_balance DECIMAL(5,2) DEFAULT 0.00,
    stress_level DECIMAL(5,2) DEFAULT 0.00,
    burnout_risk DECIMAL(5,2) DEFAULT 0.00,
    
    -- Behavioral indicators
    session_frequency DECIMAL(5,2) DEFAULT 0.00,
    avg_session_duration DECIMAL(5,2) DEFAULT 0.00,
    social_engagement DECIMAL(5,2) DEFAULT 0.00,
    achievement_rate DECIMAL(5,2) DEFAULT 0.00,
    
    -- Risk factors
    addiction_indicators JSONB DEFAULT '[]',
    negative_patterns JSONB DEFAULT '[]',
    warning_triggers JSONB DEFAULT '[]',
    
    -- Interventions
    interventions_needed JSONB DEFAULT '[]',
    support_resources_offered JSONB DEFAULT '[]',
    follow_up_required BOOLEAN DEFAULT false NOT NULL,
    
    monitoring_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(player_id, monitoring_date)
);

-- Rest bonuses
CREATE TABLE rest_bonuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    bonus_type VARCHAR(50) NOT NULL,
    
    -- Bonus properties
    bonus_value DECIMAL(5,2) NOT NULL,
    bonus_duration INTEGER DEFAULT 1440, -- 24 hours
    bonus_description TEXT,
    
    -- Eligibility
    rest_duration_minutes INTEGER NOT NULL,
    last_session_end TIMESTAMP WITH TIME ZONE NOT NULL,
    consecutive_rest_days INTEGER DEFAULT 0,
    
    -- Claim status
    is_claimed BOOLEAN DEFAULT false NOT NULL,
    claimed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- AI INSIGHTS & ANALYTICS
-- ===================================

-- Emotion AI insights
CREATE TABLE emotion_ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    
    -- Insight classification
    insight_type VARCHAR(50) NOT NULL,
    insight_category VARCHAR(50) NOT NULL,
    confidence_score DECIMAL(5,2) NOT NULL,
    
    -- Insight content
    insight_summary TEXT NOT NULL,
    detailed_analysis JSONB DEFAULT '{}',
    recommendations JSONB DEFAULT '[]',
    
    -- Predictive elements
    predicted_behavior VARCHAR(100),
    behavior_probability DECIMAL(5,2) DEFAULT 0.00,
    time_horizon_days INTEGER DEFAULT 7,
    
    -- Impact assessment
    potential_impact DECIMAL(5,2) DEFAULT 0.00,
    urgency_level VARCHAR(20) DEFAULT 'medium',
    
    -- Status
    is_reviewed BOOLEAN DEFAULT false NOT NULL,
    reviewed_by UUID REFERENCES players(id),
    implemented_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- PERFORMANCE INDEXES
-- ===================================

-- Identity system indexes
CREATE INDEX idx_player_identity_player_id ON player_identity(player_id);
CREATE INDEX idx_player_identity_evolution_stage ON player_identity(evolution_stage);
CREATE INDEX idx_player_identity_style ON player_identity(primary_style);

-- Story system indexes
CREATE INDEX idx_player_story_chapters_player_id ON player_story_chapters(player_id);
CREATE INDEX idx_player_story_chapters_chapter ON player_story_chapters(chapter_number);

-- Behavior analysis indexes
CREATE INDEX idx_player_behavior_patterns_player_id ON player_behavior_patterns(player_id);
CREATE INDEX idx_player_behavior_patterns_analysis_date ON player_behavior_patterns(analysis_date);
CREATE INDEX idx_player_social_tendencies_player_id ON player_social_tendencies(player_id);

-- Community system indexes
CREATE INDEX idx_community_celebrations_country_id ON community_celebrations(country_id);
CREATE INDEX idx_shared_memories_community_id ON shared_memories(community_id);
CREATE INDEX idx_community_bonds_player_id ON community_bonds(player_id);

-- Recognition system indexes
CREATE INDEX idx_recognition_events_player_id ON recognition_events(player_id);
CREATE INDEX idx_recognition_events_level ON recognition_events(recognition_level);
CREATE INDEX idx_civilization_history_player_id ON civilization_history(player_id);
CREATE INDEX idx_civilization_history_significance ON civilization_history(historical_significance);

-- Legacy system indexes
CREATE INDEX idx_player_legacy_player_id ON player_legacy(player_id);
CREATE INDEX idx_player_legacy_score ON player_legacy(legacy_score);
CREATE INDEX idx_mentorship_trees_root_mentor ON mentorship_trees(root_mentor_id);

-- Emotional system indexes
CREATE INDEX idx_player_emotional_state_player_id ON player_emotional_state(player_id);
CREATE INDEX idx_emotional_cycles_player_id ON emotional_cycles(player_id);
CREATE INDEX idx_psychological_effects_player_id ON psychological_effects(player_id);

-- Safety system indexes
CREATE INDEX idx_player_sessions_player_id ON player_sessions(player_id);
CREATE INDEX idx_emotional_health_monitoring_player_id ON emotional_health_monitoring(player_id);
CREATE INDEX idx_emotional_health_monitoring_date ON emotional_health_monitoring(monitoring_date);

-- AI insights indexes
CREATE INDEX idx_emotion_ai_insights_player_id ON emotion_ai_insights(player_id);
CREATE INDEX idx_emotion_ai_insights_type ON emotion_ai_insights(insight_type);

-- ===================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ===================================

-- Update identity strength based on actions
CREATE OR REPLACE FUNCTION update_identity_strength()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE player_identity 
    SET 
        identity_strength = LEAST(1.0, identity_strength + 0.01),
        updated_at = NOW()
    WHERE player_id = NEW.player_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_identity_strength
    AFTER INSERT ON player_actions
    FOR EACH ROW EXECUTE FUNCTION update_identity_strength();

-- Update emotional state based on recognition
CREATE OR REPLACE FUNCTION update_emotional_state_from_recognition()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO player_emotional_state (
        player_id, emotion_type, intensity, trigger_event, updated_at
    ) VALUES (
        NEW.player_id, 'recognition', NEW.emotional_weight, 'recognition_event', NOW()
    )
    ON CONFLICT (player_id, emotion_type) 
    DO UPDATE SET
        intensity = LEAST(1.0, player_emotional_state.intensity + NEW.emotional_weight),
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_emotional_state_from_recognition
    AFTER INSERT ON recognition_events
    FOR EACH ROW EXECUTE FUNCTION update_emotional_state_from_recognition();

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp update triggers
CREATE TRIGGER update_player_identity_updated_at 
    BEFORE UPDATE ON player_identity
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER update_emotional_cycles_updated_at 
    BEFORE UPDATE ON emotional_cycles
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER update_player_legacy_updated_at 
    BEFORE UPDATE ON player_legacy
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- ===================================
-- INITIAL DATA SETUP
-- ===================================

-- Initialize phase features
INSERT INTO phase_features (phase_name, feature_name, feature_type, feature_description, emotional_benefit) VALUES
('exploration', 'discovery_tools', 'tool_access', 'Access to discovery and exploration features', 'curiosity'),
('exploration', 'new_opportunities', 'content', 'Fresh opportunities and challenges', 'excitement'),
('challenge', 'appropriate_challenges', 'content', 'Challenges matched to skill level', 'achievement'),
('challenge', 'support_tools', 'tool_access', 'Tools to help overcome challenges', 'confidence'),
('cooperation', 'social_features', 'tool_access', 'Enhanced social and collaboration tools', 'connection'),
('cooperation', 'teamwork_facilitation', 'system', 'Features that enable effective teamwork', 'belonging'),
('celebration', 'achievement_recognition', 'system', 'Recognition and celebration of achievements', 'pride'),
('celebration', 'sharing_features', 'tool_access', 'Tools for sharing success with others', 'joy'),
('reflection', 'journaling_tools', 'tool_access', 'Personal reflection and journaling features', 'insight'),
('reflection', 'progress_summary', 'content', 'Comprehensive progress and growth summaries', 'satisfaction');

-- Initialize community symbols
INSERT INTO community_symbols (id, community_id, symbol_type, symbol_name, visual_design, cultural_significance) VALUES
(uuid_generate_v4(), uuid_generate_v4(), 'flag', 'Unity Banner', '{"colors": ["blue", "gold"], "pattern": "waves"}', 0.8),
(uuid_generate_v4(), uuid_generate_v4(), 'emblem', 'Community Shield', '{"shape": "shield", "icon": "hands"}', 0.7),
(uuid_generate_v4(), uuid_generate_v4(), 'mascot', 'Wisdom Owl', '{"style": "minimalist", "colors": ["purple", "white"]}', 0.6);

-- Initialize cultural myths
INSERT INTO cultural_myths (id, community_id, myth_title, myth_story, myth_category, cultural_importance) VALUES
(uuid_generate_v4(), uuid_generate_v4(), 'The Great Unity', 'A tale of how disparate communities came together...', 'foundation', 0.9),
(uuid_generate_v4(), uuid_generate_v4(), 'The First Mentor', 'The story of the first teacher who shared knowledge...', 'education', 0.8),
(uuid_generate_v4(), uuid_generate_v4(), 'The Bridge Builders', 'How the first diplomatic connections were forged...', 'diplomacy', 0.7);
