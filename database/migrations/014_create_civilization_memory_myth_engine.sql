-- ===================================
-- CIVILIZATION MEMORY & MYTH ENGINE DATABASE SCHEMA
-- THE CULTURAL SOUL OF DIGITAL CIVILIZATION
-- ===================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- ===================================
-- 1. LIVING HISTORY LAYER
-- ===================================

-- Civilization timeline - the master historical record
CREATE TABLE civilization_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_category VARCHAR(50) NOT NULL,
    title VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    
    -- Significance metrics
    significance DECIMAL(5,2) NOT NULL CHECK (significance >= 0 AND significance <= 1),
    impact_level VARCHAR(20) NOT NULL CHECK (impact_level IN ('minor', 'moderate', 'major', 'legendary', 'mythic')),
    emotional_weight DECIMAL(5,2) NOT NULL CHECK (emotional_weight >= 0 AND emotional_weight <= 1),
    cultural_importance DECIMAL(5,2) NOT NULL CHECK (cultural_importance >= 0 AND cultural_importance <= 1),
    
    -- Participants and context
    participants UUID[] DEFAULT '{}',
    countries VARCHAR(10)[] DEFAULT '{}',
    communities UUID[] DEFAULT '{}',
    location_data JSONB DEFAULT '{}',
    
    -- Narrative elements
    narrative JSONB DEFAULT '{}',
    visual_assets JSONB DEFAULT '{}',
    symbolic_elements JSONB DEFAULT '{}',
    
    -- Timeline placement
    timeline_position INTEGER NOT NULL,
    related_events UUID[] DEFAULT '{}',
    
    -- Memory status
    is_mythic BOOLEAN DEFAULT false NOT NULL,
    is_legendary BOOLEAN DEFAULT false NOT NULL,
    memory_strength DECIMAL(5,2) DEFAULT 1.0 CHECK (memory_strength >= 0 AND memory_strength <= 1),
    last_remembered TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event significance factors
CREATE TABLE event_significance_factors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES civilization_timeline(id) ON DELETE CASCADE,
    
    -- Impact factors
    participant_count INTEGER DEFAULT 0,
    country_count INTEGER DEFAULT 0,
    community_count INTEGER DEFAULT 0,
    
    -- Cooperation factors
    cross_community_participation DECIMAL(5,2) DEFAULT 0.00,
    unity_level DECIMAL(5,2) DEFAULT 0.00,
    
    -- Innovation factors
    is_first_occurrence BOOLEAN DEFAULT false NOT NULL,
    innovation_level DECIMAL(5,2) DEFAULT 0.00,
    
    -- Emotional factors
    emotional_intensity DECIMAL(5,2) DEFAULT 0.00,
    celebration_level DECIMAL(5,2) DEFAULT 0.00,
    
    -- Duration factors
    event_duration_minutes INTEGER DEFAULT 0,
    preparation_time_hours INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(event_id)
);

-- World map historical markers
CREATE TABLE world_map_historical_markers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES civilization_timeline(id) ON DELETE CASCADE,
    
    -- Marker properties
    marker_type VARCHAR(50) NOT NULL,
    marker_title VARCHAR(200) NOT NULL,
    marker_description TEXT,
    
    -- Location data
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    map_zoom_level INTEGER DEFAULT 5,
    
    -- Visual properties
    icon_design JSONB DEFAULT '{}',
    color_scheme VARCHAR(50),
    size_level VARCHAR(20) DEFAULT 'medium' CHECK (size_level IN ('small', 'medium', 'large', 'monumental')),
    
    -- Interaction
    is_clickable BOOLEAN DEFAULT true NOT NULL,
    popup_content JSONB DEFAULT '{}',
    related_timeline_entries UUID[] DEFAULT '{}',
    
    -- Visibility
    is_visible BOOLEAN DEFAULT true NOT NULL,
    visibility_radius INTEGER DEFAULT 100,
    min_zoom_level INTEGER DEFAULT 3,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 2. MYTH CREATION SYSTEM
-- ===================================

-- Cultural canon - collection of all myths
CREATE TABLE cultural_canon (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_event_id UUID REFERENCES civilization_timeline(id),
    
    -- Myth identification
    myth_title VARCHAR(300) NOT NULL,
    myth_category VARCHAR(50) NOT NULL,
    myth_type VARCHAR(50) NOT NULL,
    myth_tier VARCHAR(20) DEFAULT 'emerging' CHECK (myth_tier IN ('emerging', 'established', 'legendary', 'sacred')),
    
    -- Story elements
    story_chapters JSONB DEFAULT '[]',
    illustrated_summary JSONB DEFAULT '{}',
    narrative_recap TEXT,
    legendary_titles JSONB DEFAULT '[]',
    
    -- Cultural elements
    cultural_symbols JSONB DEFAULT '{}',
    moral_lessons JSONB DEFAULT '[]',
    ritual_elements JSONB DEFAULT '{}',
    
    -- Myth properties
    myth_potential DECIMAL(5,2) NOT NULL CHECK (myth_potential >= 0 AND myth_potential <= 1),
    emotional_resonance DECIMAL(5,2) DEFAULT 0.00,
    cultural_weight DECIMAL(5,2) DEFAULT 0.00,
    longevity_prediction DECIMAL(5,2) DEFAULT 0.00,
    
    -- Distribution and teaching
    is_public BOOLEAN DEFAULT true NOT NULL,
    teaching_level VARCHAR(20) DEFAULT 'basic' CHECK (teaching_level IN ('basic', 'intermediate', 'advanced', 'master')),
    adaptation_count INTEGER DEFAULT 0,
    last_adapted TIMESTAMP WITH TIME ZONE,
    
    -- Engagement metrics
    tell_count INTEGER DEFAULT 0,
    listener_count INTEGER DEFAULT 0,
    sharing_count INTEGER DEFAULT 0,
    emotional_impact_score DECIMAL(5,2) DEFAULT 0.00,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(source_event_id)
);

-- Story chapters
CREATE TABLE myth_story_chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    myth_id UUID NOT NULL REFERENCES cultural_canon(id) ON DELETE CASCADE,
    
    chapter_number INTEGER NOT NULL,
    chapter_title VARCHAR(200) NOT NULL,
    chapter_content TEXT NOT NULL,
    
    -- Chapter elements
    moral_lesson TEXT,
    symbolism JSONB DEFAULT '{}',
    visual_elements JSONB DEFAULT '[]',
    key_characters UUID[] DEFAULT '{}',
    
    -- Chapter properties
    emotional_arc VARCHAR(50),
    tension_level DECIMAL(5,2) DEFAULT 0.00,
    resolution_type VARCHAR(50),
    
    -- Reading metrics
    read_count INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.00,
    average_reading_time INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(myth_id, chapter_number)
);

-- Myth adaptations
CREATE TABLE myth_adaptations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_myth_id UUID NOT NULL REFERENCES cultural_canon(id),
    
    -- Adaptation details
    adapter_id UUID NOT NULL REFERENCES players(id),
    adaptation_type VARCHAR(50) NOT NULL,
    adaptation_title VARCHAR(300),
    
    -- Content changes
    modified_chapters JSONB DEFAULT '[]',
    added_elements JSONB DEFAULT '{}',
    cultural_context JSONB DEFAULT '{}',
    
    -- Adaptation quality
    community_rating DECIMAL(3,2) DEFAULT 0.00,
    authenticity_score DECIMAL(5,2) DEFAULT 0.00,
    cultural_appropriateness DECIMAL(5,2) DEFAULT 0.00,
    
    -- Usage metrics
    usage_count INTEGER DEFAULT 0,
    sharing_count INTEGER DEFAULT 0,
    teaching_usage INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 3. LEGENDARY PLAYER ASCENSION
-- ===================================

-- Hall of legends
CREATE TABLE hall_of_legends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id),
    
    -- Legendary identity
    legendary_title VARCHAR(200) NOT NULL,
    legendary_tier VARCHAR(20) NOT NULL CHECK (legendary_tier IN ('rare', 'epic', 'legendary', 'mythic')),
    legendary_domain VARCHAR(50) NOT NULL,
    
    -- Physical monuments
    engravings JSONB DEFAULT '{}',
    world_map_marker_id UUID REFERENCES world_map_historical_markers(id),
    statue_design JSONB DEFAULT '{}',
    
    -- Story integration
    story_arcs JSONB DEFAULT '[]',
    teaching_material JSONB DEFAULT '{}',
    cultural_references JSONB DEFAULT '[]',
    
    -- Legacy properties
    legendary_score DECIMAL(5,2) NOT NULL CHECK (legendary_score >= 0 AND legendary_score <= 1),
    ascension_date TIMESTAMP WITH TIME ZONE NOT NULL,
    contribution_summary JSONB DEFAULT '{}',
    legendary_powers JSONB DEFAULT '{}',
    
    -- Recognition
    ceremony_planned BOOLEAN DEFAULT false NOT NULL,
    ceremony_date TIMESTAMP WITH TIME ZONE,
    invited_participants UUID[] DEFAULT '{}',
    ceremony_attendees UUID[] DEFAULT '{}',
    
    -- Ongoing influence
    current_influence DECIMAL(5,2) DEFAULT 0.00,
    mentorship_tree_size INTEGER DEFAULT 0,
    cultural_impact_score DECIMAL(10,2) DEFAULT 0.00,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(player_id)
);

-- Legendary contributions
CREATE TABLE legendary_contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    legend_id UUID NOT NULL REFERENCES hall_of_legends(id) ON DELETE CASCADE,
    
    -- Contribution details
    contribution_type VARCHAR(50) NOT NULL,
    contribution_title VARCHAR(200) NOT NULL,
    contribution_description TEXT NOT NULL,
    
    -- Impact metrics
    impact_score DECIMAL(5,2) NOT NULL,
    cultural_value DECIMAL(5,2) DEFAULT 0.00,
    historical_significance DECIMAL(5,2) DEFAULT 0.00,
    
    -- Recognition
    recognition_level VARCHAR(20) DEFAULT 'legendary',
    associated_myths UUID[] DEFAULT '{}',
    referenced_in_stories JSONB DEFAULT '[]',
    
    -- Temporal data
    contribution_date TIMESTAMP WITH TIME ZONE NOT NULL,
    recognition_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ascension ceremonies
CREATE TABLE ascension_ceremonies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    legend_id UUID NOT NULL REFERENCES hall_of_legends(id) ON DELETE CASCADE,
    
    -- Ceremony details
    ceremony_name VARCHAR(200) NOT NULL,
    ceremony_description TEXT NOT NULL,
    ceremony_type VARCHAR(50) DEFAULT 'ascension',
    
    -- Schedule
    planned_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    
    -- Participants
    invited_players UUID[] DEFAULT '{}',
    confirmed_attendees UUID[] DEFAULT '{}',
    speakers JSONB DEFAULT '[]',
    
    -- Ceremony elements
    ritual_elements JSONB DEFAULT '{}',
    visual_effects JSONB DEFAULT '{}',
    speeches JSONB DEFAULT '[]',
    awards JSONB DEFAULT '[]',
    
    -- Status
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
    actual_start_time TIMESTAMP WITH TIME ZONE,
    actual_end_time TIMESTAMP WITH TIME ZONE,
    
    -- Outcomes
    attendance_count INTEGER DEFAULT 0,
    emotional_impact DECIMAL(5,2) DEFAULT 0.00,
    cultural_significance DECIMAL(5,2) DEFAULT 0.00,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 4. CULTURAL EVOLUTION SYSTEM
-- ===================================

-- Country cultural identities
CREATE TABLE country_cultural_identities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_code VARCHAR(10) NOT NULL,
    
    -- Cultural traits
    primary_tradition VARCHAR(50) NOT NULL,
    cultural_values JSONB DEFAULT '[]',
    ritual_types JSONB DEFAULT '[]',
    artistic_style VARCHAR(50),
    communication_style VARCHAR(50),
    
    -- Visual identity
    color_scheme JSONB DEFAULT '{}',
    symbol_set JSONB DEFAULT '{}',
    architectural_style VARCHAR(50),
    musical_elements JSONB DEFAULT '{}',
    
    -- Behavioral patterns
    cooperation_tendency DECIMAL(5,2) DEFAULT 0.00,
    education_focus DECIMAL(5,2) DEFAULT 0.00,
    recruitment_style VARCHAR(50),
    creativity_expression DECIMAL(5,2) DEFAULT 0.00,
    defense_posture VARCHAR(50),
    
    -- Evolution tracking
    evolution_stage VARCHAR(20) DEFAULT 'emerging',
    evolution_score DECIMAL(5,2) DEFAULT 0.00,
    last_evolution TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    evolution_count INTEGER DEFAULT 0,
    
    -- Cultural metrics
    uniqueness_score DECIMAL(5,2) DEFAULT 0.00,
    influence_radius INTEGER DEFAULT 0,
    cultural_exports JSONB DEFAULT '[]',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(country_code)
);

-- Cultural traditions
CREATE TABLE cultural_traditions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID NOT NULL REFERENCES country_cultural_identities(id) ON DELETE CASCADE,
    
    -- Tradition details
    tradition_name VARCHAR(200) NOT NULL,
    tradition_type VARCHAR(50) NOT NULL,
    tradition_description TEXT NOT NULL,
    
    -- Origins
    origin_event_id UUID REFERENCES civilization_timeline(id),
    origin_date TIMESTAMP WITH TIME ZONE,
    founder_players UUID[] DEFAULT '{}',
    
    -- Practice details
    frequency VARCHAR(50),
    duration_minutes INTEGER DEFAULT 0,
    participant_requirements JSONB DEFAULT '{}',
    ritual_steps JSONB DEFAULT '[]',
    
    -- Cultural significance
    meaning JSONB DEFAULT '{}',
    symbolism JSONB DEFAULT '{}',
    moral_lessons JSONB DEFAULT '[]',
    
    -- Practice metrics
    practice_count INTEGER DEFAULT 0,
    participant_count INTEGER DEFAULT 0,
    satisfaction_score DECIMAL(5,2) DEFAULT 0.00,
    cultural_importance DECIMAL(5,2) DEFAULT 0.00,
    
    -- Status
    is_active BOOLEAN DEFAULT true NOT NULL,
    is_mandatory BOOLEAN DEFAULT false NOT NULL,
    adaptation_allowed BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Behavior pattern analysis
CREATE TABLE behavior_pattern_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID NOT NULL REFERENCES country_cultural_identities(id) ON DELETE CASCADE,
    
    -- Analysis period
    analysis_date DATE NOT NULL,
    analysis_period_days INTEGER DEFAULT 30,
    
    -- Pattern metrics
    action_type VARCHAR(100) NOT NULL,
    frequency INTEGER NOT NULL DEFAULT 0,
    avg_impact DECIMAL(5,2) DEFAULT 0.00,
    participant_diversity INTEGER DEFAULT 0,
    
    -- Cooperation metrics
    cross_community_frequency INTEGER DEFAULT 0,
    unity_formation_count INTEGER DEFAULT 0,
    collaboration_success_rate DECIMAL(5,2) DEFAULT 0.00,
    
    -- Cultural indicators
    innovation_count INTEGER DEFAULT 0,
    creative_expressions INTEGER DEFAULT 0,
    educational_activities INTEGER DEFAULT 0,
    defensive_actions INTEGER DEFAULT 0,
    
    -- Trend analysis
    trend_direction VARCHAR(20) DEFAULT 'stable',
    trend_strength DECIMAL(5,2) DEFAULT 0.00,
    seasonal_variation DECIMAL(5,2) DEFAULT 0.00,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(country_id, analysis_date, action_type)
);

-- ===================================
-- 5. MEMORY REACTIVATION EVENTS
-- ===================================

-- Anniversary celebrations
CREATE TABLE anniversary_celebrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    historical_event_id UUID NOT NULL REFERENCES civilization_timeline(id) ON DELETE CASCADE,
    
    -- Anniversary details
    anniversary_number INTEGER NOT NULL,
    celebration_name VARCHAR(200) NOT NULL,
    celebration_type VARCHAR(50) NOT NULL,
    
    -- Schedule
    anniversary_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_days INTEGER DEFAULT 1,
    
    -- Activities
    historical_missions JSONB DEFAULT '[]',
    memory_sharing_sessions JSONB DEFAULT '[]',
    ceremonial_elements JSONB DEFAULT '{}',
    
    -- Participants
    original_participants UUID[] DEFAULT '{}',
    invited_community UUID[] DEFAULT '{}',
    new_player_activities JSONB DEFAULT '{}',
    
    -- Rewards and recognition
    anniversary_rewards JSONB DEFAULT '[]',
    commemorative_items JSONB DEFAULT '[]',
    special_titles JSONB DEFAULT '[]',
    
    -- Outcomes
    participation_count INTEGER DEFAULT 0,
    emotional_impact DECIMAL(5,2) DEFAULT 0.00,
    cultural_reinforcement DECIMAL(5,2) DEFAULT 0.00,
    
    -- Status
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),
    actual_start_date TIMESTAMP WITH TIME ZONE,
    actual_end_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(historical_event_id, anniversary_number)
);

-- Historical mission replays
CREATE TABLE historical_mission_replays (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_event_id UUID NOT NULL REFERENCES civilization_timeline(id) ON DELETE CASCADE,
    anniversary_id UUID REFERENCES anniversary_celebrations(id) ON DELETE CASCADE,
    
    -- Mission recreation
    mission_title VARCHAR(200) NOT NULL,
    mission_description TEXT NOT NULL,
    recreation_fidelity VARCHAR(20) DEFAULT 'accurate' CHECK (recreation_fidelity IN ('symbolic', 'adapted', 'accurate', 'enhanced')),
    
    -- Mission parameters
    participant_requirements JSONB DEFAULT '{}',
    success_conditions JSONB DEFAULT '{}',
    time_limit_minutes INTEGER DEFAULT 0,
    
    -- Historical context
    historical_context JSONB DEFAULT '{}',
    original_participants UUID[] DEFAULT '{}',
    learning_objectives JSONB DEFAULT '[]',
    
    -- Replay metrics
    replay_count INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    average_completion_time INTEGER DEFAULT 0,
    participant_satisfaction DECIMAL(5,2) DEFAULT 0.00,
    
    -- Educational value
    historical_understanding_gain DECIMAL(5,2) DEFAULT 0.00,
    cultural_appreciation_increase DECIMAL(5,2) DEFAULT 0.00,
    emotional_connection_score DECIMAL(5,2) DEFAULT 0.00,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Memory sharing sessions
CREATE TABLE memory_sharing_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anniversary_id UUID REFERENCES anniversary_celebrations(id) ON DELETE CASCADE,
    
    -- Session details
    session_title VARCHAR(200) NOT NULL,
    session_type VARCHAR(50) NOT NULL,
    session_description TEXT NOT NULL,
    
    -- Schedule
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    
    -- Participants
    hosts UUID[] DEFAULT '{}',
    speakers UUID[] DEFAULT '{}',
    attendees UUID[] DEFAULT '{}',
    
    -- Content
    shared_memories JSONB DEFAULT '[]',
    personal_stories JSONB DEFAULT '[]',
    historical_artifacts JSONB DEFAULT '[]',
    
    -- Interaction
    discussion_topics JSONB DEFAULT '[]',
    collaborative_activities JSONB DEFAULT '[]',
    emotional_support_elements JSONB DEFAULT '{}',
    
    -- Outcomes
    attendance_count INTEGER DEFAULT 0,
    emotional_impact DECIMAL(5,2) DEFAULT 0.00,
    community_bonding_score DECIMAL(5,2) DEFAULT 0.00,
    memory_preservation_value DECIMAL(5,2) DEFAULT 0.00,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 6. GENERATIONAL HANDOFF SYSTEM
-- ===================================

-- Ongoing stories
CREATE TABLE ongoing_stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_title VARCHAR(200) NOT NULL,
    story_description TEXT NOT NULL,
    
    -- Story origins
    origin_event_id UUID REFERENCES civilization_timeline(id),
    founding_players UUID[] DEFAULT '{}',
    creation_date TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Story status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    needs_continuation BOOLEAN DEFAULT true NOT NULL,
    
    -- Story requirements
    required_skills JSONB DEFAULT '[]',
    player_requirements JSONB DEFAULT '{}',
    continuation_tasks JSONB DEFAULT '[]',
    
    -- Generational data
    current_generation INTEGER DEFAULT 1,
    total_contributors INTEGER DEFAULT 0,
    generation_handoffs JSONB DEFAULT '[]',
    
    -- Story impact
    cultural_significance DECIMAL(5,2) DEFAULT 0.00,
    participant_count INTEGER DEFAULT 0,
    completion_time_years INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Story inheritances
CREATE TABLE story_inheritances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL REFERENCES ongoing_stories(id) ON DELETE CASCADE,
    inheritor_player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    
    -- Inheritance details
    inherited_role VARCHAR(50) NOT NULL,
    inheritance_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    mentor_player_id UUID REFERENCES players(id),
    
    -- Story context
    story_context JSONB DEFAULT '{}',
    continuation_tasks JSONB DEFAULT '[]',
    expected_contributions JSONB DEFAULT '[]',
    
    -- Progress tracking
    tasks_completed INTEGER DEFAULT 0,
    total_tasks INTEGER DEFAULT 0,
    contribution_quality DECIMAL(5,2) DEFAULT 0.00,
    
    -- Generational connection
    generation_number INTEGER NOT NULL,
    predecessor_players UUID[] DEFAULT '{}',
    successor_players UUID[] DEFAULT '{}',
    
    -- Status
    inheritance_status VARCHAR(20) DEFAULT 'active' CHECK (inheritance_status IN ('active', 'completed', 'transferred', 'abandoned')),
    completion_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(story_id, inheritor_player_id)
);

-- Generational roles
CREATE TABLE generational_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_name VARCHAR(100) NOT NULL,
    role_description TEXT NOT NULL,
    
    -- Role characteristics
    role_type VARCHAR(50) NOT NULL,
    responsibility_level VARCHAR(20) NOT NULL,
    skill_requirements JSONB DEFAULT '[]',
    
    -- Generational position
    generation_order INTEGER NOT NULL,
    transitions_to JSONB DEFAULT '[]',
    prerequisites JSONB DEFAULT '{}',
    
    -- Role evolution
    role_evolution JSONB DEFAULT '{}',
    adaptation_capabilities JSONB DEFAULT '[]',
    legacy_potential DECIMAL(5,2) DEFAULT 0.00,
    
    -- Cultural significance
    cultural_importance DECIMAL(5,2) DEFAULT 0.00,
    traditional_elements JSONB DEFAULT '{}',
    ritual_associations JSONB DEFAULT '[]',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 7. SYMBOLIC ARTIFACTS
-- ===================================

-- Cultural artifacts
CREATE TABLE cultural_artifacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artifact_name VARCHAR(200) NOT NULL,
    artifact_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    
    -- Creation context
    creator_id UUID NOT NULL REFERENCES players(id),
    creation_event_id UUID REFERENCES civilization_timeline(id),
    community_id UUID REFERENCES diaspora_communities(id),
    creation_date TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Visual design
    visual_design JSONB DEFAULT '{}',
    cultural_symbols JSONB DEFAULT '{}',
    artistic_style VARCHAR(50),
    color_scheme JSONB DEFAULT '{}',
    
    -- Placement and access
    location_data JSONB DEFAULT '{}',
    world_map_marker_id UUID REFERENCES world_map_historical_markers(id),
    access_level VARCHAR(20) DEFAULT 'public',
    unlock_requirements JSONB DEFAULT '{}',
    
    -- Cultural significance
    cultural_significance DECIMAL(5,2) NOT NULL,
    emotional_weight DECIMAL(5,2) DEFAULT 0.00,
    historical_context JSONB DEFAULT '{}',
    symbolic_meaning JSONB DEFAULT '{}',
    
    -- Interaction
    interaction_type VARCHAR(50) NOT NULL,
    artifact_powers JSONB DEFAULT '{}',
    memory_connections UUID[] DEFAULT '{}',
    
    -- Usage metrics
    interaction_count INTEGER DEFAULT 0,
    visitor_count INTEGER DEFAULT 0,
    emotional_impact_score DECIMAL(5,2) DEFAULT 0.00,
    
    -- Status
    is_displayed BOOLEAN DEFAULT true NOT NULL,
    is_preserved BOOLEAN DEFAULT true NOT NULL,
    preservation_status VARCHAR(20) DEFAULT 'active',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artifact interactions
CREATE TABLE artifact_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artifact_id UUID NOT NULL REFERENCES cultural_artifacts(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    
    -- Interaction details
    interaction_type VARCHAR(50) NOT NULL,
    interaction_data JSONB DEFAULT '{}',
    interaction_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Emotional response
    emotional_reaction VARCHAR(50),
    emotional_intensity DECIMAL(5,2) DEFAULT 0.00,
    personal_significance DECIMAL(5,2) DEFAULT 0.00,
    
    -- Learning outcomes
    historical_understanding_gain DECIMAL(5,2) DEFAULT 0.00,
    cultural_appreciation_increase DECIMAL(5,2) DEFAULT 0.00,
    memory_formation_strength DECIMAL(5,2) DEFAULT 0.00,
    
    -- Social aspects
    shared_with_players UUID[] DEFAULT '{}',
    discussion_generated BOOLEAN DEFAULT false,
    teaching_moments JSONB DEFAULT '[]',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artifact collections
CREATE TABLE artifact_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_name VARCHAR(200) NOT NULL,
    collection_description TEXT NOT NULL,
    
    -- Collection properties
    collection_type VARCHAR(50) NOT NULL,
    theme VARCHAR(100),
    time_period VARCHAR(100),
    cultural_origin VARCHAR(100),
    
    -- Artifacts
    artifact_ids UUID[] DEFAULT '{}',
    primary_artifact_id UUID REFERENCES cultural_artifacts(id),
    
    -- Curation
    curator_id UUID REFERENCES players(id),
    curation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    curation_rationale TEXT,
    
    -- Collection metrics
    total_artifacts INTEGER DEFAULT 0,
    cultural_significance_total DECIMAL(10,2) DEFAULT 0.00,
    visitor_count INTEGER DEFAULT 0,
    
    -- Status
    is_public BOOLEAN DEFAULT true NOT NULL,
    is_featured BOOLEAN DEFAULT false NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 8. MEMORY AI CURATOR
-- ===================================

-- AI curation decisions
CREATE TABLE ai_curation_decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    curation_date DATE NOT NULL,
    
    -- Curation scope
    events_evaluated INTEGER DEFAULT 0,
    events_selected INTEGER DEFAULT 0,
    events_archived INTEGER DEFAULT 0,
    
    -- Curation criteria
    impact_threshold DECIMAL(5,2) DEFAULT 0.00,
    cooperation_threshold DECIMAL(5,2) DEFAULT 0.00,
    emotional_threshold DECIMAL(5,2) DEFAULT 0.00,
    uniqueness_threshold DECIMAL(5,2) DEFAULT 0.00,
    
    -- Quality metrics
    curation_accuracy DECIMAL(5,2) DEFAULT 0.00,
    cultural_alignment DECIMAL(5,2) DEFAULT 0.00,
    community_satisfaction DECIMAL(5,2) DEFAULT 0.00,
    
    -- AI model performance
    model_version VARCHAR(50),
    processing_time_ms INTEGER DEFAULT 0,
    confidence_score DECIMAL(5,2) DEFAULT 0.00,
    
    -- Outcomes
    cultural_canon_updated BOOLEAN DEFAULT false,
    new_myths_created INTEGER DEFAULT 0,
    legendary_figures_identified INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(curation_date)
);

-- Legend score calculations
CREATE TABLE legend_score_calculations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES civilization_timeline(id) ON DELETE CASCADE,
    
    -- Score factors
    impact_score DECIMAL(5,2) DEFAULT 0.00,
    cooperation_score DECIMAL(5,2) DEFAULT 0.00,
    emotional_response_score DECIMAL(5,2) DEFAULT 0.00,
    longevity_score DECIMAL(5,2) DEFAULT 0.00,
    uniqueness_score DECIMAL(5,2) DEFAULT 0.00,
    cultural_significance_score DECIMAL(5,2) DEFAULT 0.00,
    
    -- Calculations
    legend_score DECIMAL(5,2) NOT NULL,
    calculation_method VARCHAR(50) DEFAULT 'standard',
    confidence_level DECIMAL(5,2) DEFAULT 0.00,
    
    -- Temporal aspects
    calculation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    score_stability DECIMAL(5,2) DEFAULT 0.00,
    prediction_horizon_days INTEGER DEFAULT 365,
    
    -- AI metadata
    model_version VARCHAR(50),
    training_data_cutoff DATE,
    feature_importance JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(event_id)
);

-- Cultural canon updates
CREATE TABLE cultural_canon_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    update_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Update details
    update_type VARCHAR(50) NOT NULL,
    update_reason TEXT NOT NULL,
    affected_myths UUID[] DEFAULT '{}',
    
    -- Changes made
    myths_added INTEGER DEFAULT 0,
    myths_modified INTEGER DEFAULT 0,
    myths_removed INTEGER DEFAULT 0,
    myths_promoted INTEGER DEFAULT 0,
    
    -- Quality assurance
    reviewer_id UUID REFERENCES players(id),
    approval_status VARCHAR(20) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'revised')),
    review_notes TEXT,
    
    -- Impact assessment
    community_reception DECIMAL(5,2) DEFAULT 0.00,
    cultural_impact DECIMAL(5,2) DEFAULT 0.00,
    educational_value DECIMAL(5,2) DEFAULT 0.00,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 9. SHARED STORY PARTICIPATION
-- ===================================

-- Story participation sessions
CREATE TABLE story_participation_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES civilization_timeline(id) ON DELETE CASCADE,
    
    -- Session details
    session_name VARCHAR(200) NOT NULL,
    session_type VARCHAR(50) NOT NULL,
    session_description TEXT NOT NULL,
    
    -- Schedule
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    
    -- Participation mechanics
    voting_enabled BOOLEAN DEFAULT true NOT NULL,
    message_preservation_enabled BOOLEAN DEFAULT true NOT NULL,
    co_authorship_enabled BOOLEAN DEFAULT false NOT NULL,
    cultural_contribution_enabled BOOLEAN DEFAULT true NOT NULL,
    
    -- Participation data
    participants UUID[] DEFAULT '{}',
    contributions JSONB DEFAULT '[]',
    votes_cast JSONB DEFAULT '[]',
    messages_preserved JSONB DEFAULT '[]',
    
    -- Outcomes
    final_decisions JSONB DEFAULT '{}',
    created_content JSONB DEFAULT '[]',
    cultural_elements_added JSONB DEFAULT '[]',
    
    -- Quality metrics
    participation_quality DECIMAL(5,2) DEFAULT 0.00,
    cultural_authenticity DECIMAL(5,2) DEFAULT 0.00,
    community_satisfaction DECIMAL(5,2) DEFAULT 0.00,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Player story contributions
CREATE TABLE player_story_contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES story_participation_sessions(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    
    -- Contribution details
    contribution_type VARCHAR(50) NOT NULL,
    contribution_content TEXT NOT NULL,
    contribution_data JSONB DEFAULT '{}',
    
    -- Contribution context
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    parent_contribution_id UUID REFERENCES player_story_contributions(id),
    
    -- Community response
    votes_received INTEGER DEFAULT 0,
    community_rating DECIMAL(3,2) DEFAULT 0.00,
    emotional_impact DECIMAL(5,2) DEFAULT 0.00,
    
    -- Cultural significance
    cultural_value DECIMAL(5,2) DEFAULT 0.00,
    authenticity_score DECIMAL(5,2) DEFAULT 0.00,
    innovation_level DECIMAL(5,2) DEFAULT 0.00,
    
    -- Status
    is_incorporated BOOLEAN DEFAULT false NOT NULL,
    incorporation_method VARCHAR(50),
    incorporation_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Symbolic choices voting
CREATE TABLE symbolic_choices_voting (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES story_participation_sessions(id) ON DELETE CASCADE,
    
    -- Vote details
    choice_question VARCHAR(500) NOT NULL,
    choice_options JSONB DEFAULT '[]',
    choice_category VARCHAR(50) NOT NULL,
    
    -- Voting rules
    voting_method VARCHAR(20) DEFAULT 'majority',
    weight_distribution JSONB DEFAULT '{}',
    minimum_participation INTEGER DEFAULT 0,
    
    -- Results
    total_votes INTEGER DEFAULT 0,
    winning_option VARCHAR(200),
    vote_distribution JSONB DEFAULT '{}',
    participation_rate DECIMAL(5,2) DEFAULT 0.00,
    
    -- Cultural impact
    symbolic_significance DECIMAL(5,2) DEFAULT 0.00,
    community_acceptance DECIMAL(5,2) DEFAULT 0.00,
    longevity_prediction DECIMAL(5,2) DEFAULT 0.00,
    
    -- Implementation
    is_implemented BOOLEAN DEFAULT false NOT NULL,
    implementation_date TIMESTAMP WITH TIME ZONE,
    implementation_method VARCHAR(50),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 10. ANTI-COPY DEFENSE METRICS
-- ===================================

-- Competitive advantage tracking
CREATE TABLE competitive_advantage_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    measurement_date DATE NOT NULL,
    
    -- Historical depth
    total_historical_events INTEGER DEFAULT 0,
    years_of_history DECIMAL(5,2) DEFAULT 0.00,
    unique_participants INTEGER DEFAULT 0,
    cultural_complexity_score DECIMAL(5,2) DEFAULT 0.00,
    
    -- Legendary elements
    legendary_figures_count INTEGER DEFAULT 0,
    unique_traditions_count INTEGER DEFAULT 0,
    cultural_artifacts_count INTEGER DEFAULT 0,
    myths_in_canon INTEGER DEFAULT 0,
    
    -- Emotional assets
    emotional_attachments_count INTEGER DEFAULT 0,
    community_bonds_strength DECIMAL(5,2) DEFAULT 0.00,
    cultural_identity_strength DECIMAL(5,2) DEFAULT 0.00,
    
    -- Imitation difficulty
    imitation_difficulty_score DECIMAL(5,2) DEFAULT 0.00,
    time_to_replicate_years DECIMAL(5,2) DEFAULT 0.00,
    unique_cultural_elements JSONB DEFAULT '[]',
    
    -- Market position
    competitive_moat_strength DECIMAL(5,2) DEFAULT 0.00,
    market_uniqueness_score DECIMAL(5,2) DEFAULT 0.00,
    user_loyalty_score DECIMAL(5,2) DEFAULT 0.00,
    
    -- Growth metrics
    monthly_cultural_growth DECIMAL(5,2) DEFAULT 0.00,
    memory_accumulation_rate DECIMAL(5,2) DEFAULT 0.00,
    tradition_formation_rate DECIMAL(5,2) DEFAULT 0.00,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(measurement_date)
);

-- Uncopyable elements registry
CREATE TABLE uncopyable_elements_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    element_name VARCHAR(200) NOT NULL,
    element_type VARCHAR(50) NOT NULL,
    element_description TEXT NOT NULL,
    
    -- Uncopyability factors
    time_required_years DECIMAL(5,2) NOT NULL,
    participant_count_required INTEGER DEFAULT 0,
    cultural_context_needed JSONB DEFAULT '{}',
    emotional_investment_required DECIMAL(5,2) DEFAULT 0.00,
    
    -- Current status
    development_stage VARCHAR(20) DEFAULT 'emerging',
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    uniqueness_score DECIMAL(5,2) DEFAULT 0.00,
    
    -- Competitive value
    competitive_advantage_score DECIMAL(5,2) DEFAULT 0.00,
    imitation_cost_estimate DECIMAL(10,2) DEFAULT 0.00,
    market_differentiation JSONB DEFAULT '{}',
    
    -- Protection mechanisms
    natural_protection JSONB DEFAULT '[]',
    technical_protection JSONB DEFAULT '[]',
    cultural_protection JSONB DEFAULT '[]',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cultural asset valuation
CREATE TABLE cultural_asset_valuation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    valuation_date DATE NOT NULL,
    
    -- Asset categories
    historical_events_value DECIMAL(15,2) DEFAULT 0.00,
    myths_stories_value DECIMAL(15,2) DEFAULT 0.00,
    legendary_figures_value DECIMAL(15,2) DEFAULT 0.00,
    traditions_rituals_value DECIMAL(15,2) DEFAULT 0.00,
    artifacts_symbols_value DECIMAL(15,2) DEFAULT 0.00,
    
    -- Intangible assets
    cultural_identity_value DECIMAL(15,2) DEFAULT 0.00,
    emotional_attachments_value DECIMAL(15,2) DEFAULT 0.00,
    community_bonds_value DECIMAL(15,2) DEFAULT 0.00,
    shared_memories_value DECIMAL(15,2) DEFAULT 0.00,
    
    -- Total valuation
    total_cultural_assets DECIMAL(15,2) DEFAULT 0.00,
    monthly_appreciation_rate DECIMAL(5,2) DEFAULT 0.00,
    competitive_moat_value DECIMAL(15,2) DEFAULT 0.00,
    
    -- Market comparison
    industry_average_cultural_assets DECIMAL(15,2) DEFAULT 0.00,
    cultural_advantage_multiple DECIMAL(5,2) DEFAULT 1.00,
    market_position_ranking INTEGER DEFAULT 0,
    
    -- Future projections
    projected_5_year_value DECIMAL(15,2) DEFAULT 0.00,
    projected_10_year_value DECIMAL(15,2) DEFAULT 0.00,
    sustainable_advantage_years INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(valuation_date)
);

-- ===================================
-- PERFORMANCE INDEXES
-- ===================================

-- Timeline and history indexes
CREATE INDEX idx_civilization_timeline_timestamp ON civilization_timeline(timestamp DESC);
CREATE INDEX idx_civilization_timeline_event_type ON civilization_timeline(event_type);
CREATE INDEX idx_civilization_timeline_significance ON civilization_timeline(significance DESC);
CREATE INDEX idx_civilization_timeline_is_mythic ON civilization_timeline(is_mythic);
CREATE INDEX idx_civilization_timeline_is_legendary ON civilization_timeline(is_legendary);
CREATE INDEX idx_civilization_timeline_countries ON civilization_timeline USING GIN(countries);
CREATE INDEX idx_civilization_timeline_participants ON civilization_timeline USING GIN(participants);

-- Myth and cultural canon indexes
CREATE INDEX idx_cultural_canon_myth_potential ON cultural_canon(myth_potential DESC);
CREATE INDEX idx_cultural_canon_myth_tier ON cultural_canon(myth_tier);
CREATE INDEX idx_cultural_canon_is_public ON cultural_canon(is_public);
CREATE INDEX idx_cultural_canon_teaching_level ON cultural_canon(teaching_level);
CREATE INDEX idx_myth_story_chapters_myth_id ON myth_story_chapters(myth_id);

-- Legendary figures indexes
CREATE INDEX idx_hall_of_legends_player_id ON hall_of_legends(player_id);
CREATE INDEX idx_hall_of_legends_legendary_tier ON hall_of_legends(legendary_tier);
CREATE INDEX idx_hall_of_legends_legendary_score ON hall_of_legends(legendary_score DESC);
CREATE INDEX idx_hall_of_legends_ascension_date ON hall_of_legends(ascension_date DESC);

-- Cultural evolution indexes
CREATE INDEX idx_country_cultural_identities_country_code ON country_cultural_identities(country_code);
CREATE INDEX idx_country_cultural_identities_evolution_stage ON country_cultural_identities(evolution_stage);
CREATE INDEX idx_cultural_traditions_country_id ON cultural_traditions(country_id);
CREATE INDEX idx_cultural_traditions_is_active ON cultural_traditions(is_active);
CREATE INDEX idx_behavior_pattern_analysis_country_id ON behavior_pattern_analysis(country_id);

-- Memory reactivation indexes
CREATE INDEX idx_anniversary_celebrations_event_id ON anniversary_celebrations(historical_event_id);
CREATE INDEX idx_anniversary_celebrations_anniversary_date ON anniversary_celebrations(anniversary_date);
CREATE INDEX idx_historical_mission_replays_original_event_id ON historical_mission_replays(original_event_id);

-- Artifact indexes
CREATE INDEX idx_cultural_artifacts_creator_id ON cultural_artifacts(creator_id);
CREATE INDEX idx_cultural_artifacts_artifact_type ON cultural_artifacts(artifact_type);
CREATE INDEX idx_cultural_artifacts_cultural_significance ON cultural_artifacts(cultural_significance DESC);
CREATE INDEX idx_cultural_artifacts_is_displayed ON cultural_artifacts(is_displayed);

-- Story participation indexes
CREATE INDEX idx_story_participation_sessions_event_id ON story_participation_sessions(event_id);
CREATE INDEX idx_story_participation_sessions_start_time ON story_participation_sessions(start_time);
CREATE INDEX idx_player_story_contributions_session_id ON player_story_contributions(session_id);
CREATE INDEX idx_player_story_contributions_player_id ON player_story_contributions(player_id);

-- Competitive advantage indexes
CREATE INDEX idx_competitive_advantage_tracking_measurement_date ON competitive_advantage_tracking(measurement_date);
CREATE INDEX idx_uncopyable_elements_registry_element_type ON uncopyable_elements_registry(element_type);
CREATE INDEX idx_cultural_asset_valuation_valuation_date ON cultural_asset_valuation(valuation_date);

-- AI curation indexes
CREATE INDEX idx_ai_curation_decisions_curation_date ON ai_curation_decisions(curation_date);
CREATE INDEX idx_legend_score_calculations_event_id ON legend_score_calculations(event_id);
CREATE INDEX idx_legend_score_calculations_legend_score ON legend_score_calculations(legend_score DESC);

-- ===================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ===================================

-- Update timeline position on new events
CREATE OR REPLACE FUNCTION update_timeline_position()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE civilization_timeline 
    SET timeline_position = (
        SELECT COUNT(*) + 1 
        FROM civilization_timeline 
        WHERE timestamp < NEW.timestamp
    )
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_timeline_position
    AFTER INSERT ON civilization_timeline
    FOR EACH ROW EXECUTE FUNCTION update_timeline_position();

-- Update myth adaptation count
CREATE OR REPLACE FUNCTION update_myth_adaptation_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE cultural_canon 
    SET 
        adaptation_count = adaptation_count + 1,
        last_adapted = NOW()
    WHERE id = NEW.original_myth_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_myth_adaptation_count
    AFTER INSERT ON myth_adaptations
    FOR EACH ROW EXECUTE FUNCTION update_myth_adaptation_count();

-- Update artifact interaction count
CREATE OR REPLACE FUNCTION update_artifact_interaction_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE cultural_artifacts 
    SET 
        interaction_count = interaction_count + 1,
        updated_at = NOW()
    WHERE id = NEW.artifact_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_artifact_interaction_count
    AFTER INSERT ON artifact_interactions
    FOR EACH ROW EXECUTE FUNCTION update_artifact_interaction_count();

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp update triggers
CREATE TRIGGER update_country_cultural_identities_updated_at 
    BEFORE UPDATE ON country_cultural_identities
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER update_cultural_traditions_updated_at 
    BEFORE UPDATE ON cultural_traditions
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER update_ongoing_stories_updated_at 
    BEFORE UPDATE ON ongoing_stories
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER update_story_inheritances_updated_at 
    BEFORE UPDATE ON story_inheritances
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER update_cultural_artifacts_updated_at 
    BEFORE UPDATE ON cultural_artifacts
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER update_legend_score_calculations_updated_at 
    BEFORE UPDATE ON legend_score_calculations
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- ===================================
-- INITIAL DATA SETUP
-- ===================================

-- Initialize cultural identity templates
INSERT INTO country_cultural_identities (id, country_code, primary_tradition, cultural_values, artistic_style, communication_style) VALUES
(uuid_generate_v4(), 'UG', 'unity', ['cooperation', 'growth', 'education'], 'vibrant', 'community-focused'),
(uuid_generate_v4(), 'KE', 'innovation', ['creativity', 'technology', 'progress'], 'modern', 'forward-thinking'),
(uuid_generate_v4(), 'NG', 'resilience', ['strength', 'perseverance', 'community'], 'bold', 'determined'),
(uuid_generate_v4(), 'GH', 'wisdom', ['knowledge', 'tradition', 'leadership'], 'classical', 'respectful'),
(uuid_generate_v4(), 'ZA', 'diversity', ['inclusion', 'harmony', 'balance'], 'eclectic', 'open');

-- Initialize generational roles
INSERT INTO generational_roles (role_name, role_description, role_type, responsibility_level, generation_order) VALUES
('Founder', 'Original creators who establish the foundation', 'leadership', 'strategic', 1),
('Builder', 'Those who expand and develop the foundation', 'development', 'tactical', 2),
('Protector', 'Guardians who preserve and defend achievements', 'defense', 'operational', 3),
('Historian', 'Storytellers who document and share memories', 'cultural', 'strategic', 4),
('Innovator', 'Visionaries who create new chapters', 'creative', 'tactical', 5);

-- Initialize uncopyable elements
INSERT INTO uncopyable_elements_registry (element_name, element_type, element_description, time_required_years, participant_count_required) VALUES
('Civilization Timeline', 'historical', 'Complete chronological record of all significant events', 3.0, 1000),
('Cultural Canon', 'mythological', 'Collection of all myths and stories', 2.5, 500),
('Hall of Legends', 'recognition', 'Legendary player achievements and monuments', 2.0, 100),
('Cultural Traditions', 'behavioral', 'Evolved community practices and rituals', 1.5, 200),
('Symbolic Artifacts', 'physical', 'Culturally significant objects and markers', 1.0, 50);

-- Initialize artifact types
INSERT INTO cultural_artifacts (id, artifact_name, artifact_type, description, creator_id, cultural_significance, artifact_powers) VALUES
(uuid_generate_v4(), 'Unity Banner', 'flag', 'Symbol of community cooperation and harmony', uuid_generate_v4(), 0.9, '{"cooperation_bonus": 0.1}'),
(uuid_generate_v4(), 'Founding Emblem', 'emblem', 'Mark of original community members', uuid_generate_v4(), 0.8, '{"recognition_bonus": 0.15}'),
(uuid_generate_v4(), 'Wisdom Stone', 'monument', 'Representation of accumulated knowledge', uuid_generate_v4(), 0.7, '{"learning_bonus": 0.12}'),
(uuid_generate_v4(), 'Harmony Crystal', 'artifact', 'Symbol of balanced cultural development', uuid_generate_v4(), 0.6, '{"balance_bonus": 0.08}');
