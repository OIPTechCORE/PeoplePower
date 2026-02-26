-- ===================================
-- LIVING WORLD MAP ENGINE (LWME) - THE CIVILIZATION NERVOUS SYSTEM
-- "WHERE EVERY PLAYER ACTION RESHAPES THE WORLD"
-- ===================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================
-- 1. THE WORLD AS A LIVING ENTITY
-- ===================================

-- Country nodes with dynamic attributes
CREATE TABLE world_countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Country identification
    country_code VARCHAR(3) UNIQUE NOT NULL, -- ISO 3166-1 alpha-3
    country_name VARCHAR(100) NOT NULL,
    
    -- Geographic data
    coordinates JSONB NOT NULL DEFAULT '{}', -- Map coordinates and boundaries
    region VARCHAR(50),
    continent VARCHAR(50),
    
    -- Dynamic attributes (update in real-time)
    activity_energy DECIMAL(8,4) NOT NULL DEFAULT 0.0000 CHECK (activity_energy >= 0 AND activity_energy <= 1),
    unity_level DECIMAL(8,4) NOT NULL DEFAULT 0.0000 CHECK (unity_level >= 0 AND unity_level <= 1),
    knowledge_index DECIMAL(8,4) NOT NULL DEFAULT 0.0000 CHECK (knowledge_index >= 0 AND knowledge_index <= 1),
    economy_strength DECIMAL(8,4) NOT NULL DEFAULT 0.0000 CHECK (economy_strength >= 0 AND economy_strength <= 1),
    stability_factor DECIMAL(8,4) NOT NULL DEFAULT 0.0000 CHECK (stability_factor >= 0 AND stability_factor <= 1),
    
    -- Composite metrics
    civilization_score DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
    global_influence DECIMAL(12,4) NOT NULL DEFAULT 0.0000,
    
    -- Visual evolution stage
    evolution_stage INTEGER NOT NULL DEFAULT 1 CHECK (evolution_stage >= 1 AND evolution_stage <= 5),
    
    -- Country DNA (personality)
    civilization_type VARCHAR(30) CHECK (civilization_type IN ('knowledge', 'expansion', 'cultural', 'governance', 'balanced')),
    
    -- Historical data
    total_players_ever BIGINT NOT NULL DEFAULT 0,
    total_actions_ever BIGINT NOT NULL DEFAULT 0,
    peak_influence DECIMAL(12,4) NOT NULL DEFAULT 0.0000,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity_pulse TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time country metrics (for fast updates)
CREATE TABLE country_realtime_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID NOT NULL REFERENCES world_countries(id) ON DELETE CASCADE,
    
    -- Current values
    current_energy DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    current_unity DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    current_knowledge DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    current_economy DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    current_stability DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    
    -- Activity tracking
    active_players_today INTEGER NOT NULL DEFAULT 0,
    actions_last_hour INTEGER NOT NULL DEFAULT 0,
    collaborations_last_day INTEGER NOT NULL DEFAULT 0,
    
    -- Visual state
    glow_intensity DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    pulse_frequency DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    border_harmony DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    
    -- Timestamp
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(country_id, calculated_at::date)
);

-- ===================================
-- 2. VISUAL EVOLUTION SYSTEM
-- ===================================

-- Evolution stages and requirements
CREATE TABLE evolution_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stage_number INTEGER UNIQUE NOT NULL,
    stage_name VARCHAR(50) NOT NULL,
    
    -- Requirements
    min_energy_threshold DECIMAL(8,4) NOT NULL,
    min_unity_threshold DECIMAL(8,4) NOT NULL,
    min_knowledge_threshold DECIMAL(8,4) NOT NULL,
    min_economy_threshold DECIMAL(8,4) NOT NULL,
    min_stability_threshold DECIMAL(8,4) NOT NULL,
    
    -- Visual characteristics
    glow_color VARCHAR(7) NOT NULL DEFAULT '#FFFFFF',
    particle_effects JSONB DEFAULT '[]' NOT NULL,
    structure_types JSONB DEFAULT '[]' NOT NULL,
    landmark_unlocks JSONB DEFAULT '[]' NOT NULL,
    
    -- Economic bonuses
    reward_multiplier DECIMAL(5,4) NOT NULL DEFAULT 1.0000,
    mission_bonus_rate DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Country visual assets
CREATE TABLE country_visual_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID NOT NULL REFERENCES world_countries(id) ON DELETE CASCADE,
    
    -- Asset types
    asset_type VARCHAR(30) NOT NULL CHECK (asset_type IN ('settlement', 'road', 'hub', 'tower', 'institution', 'landmark', 'energy_network')),
    asset_name VARCHAR(100) NOT NULL,
    
    -- Visual properties
    position JSONB NOT NULL DEFAULT '{}',
    size DECIMAL(8,4) NOT NULL DEFAULT 1.0000,
    color VARCHAR(7) NOT NULL DEFAULT '#FFFFFF',
    animation_type VARCHAR(30) CHECK (animation_type IN ('pulse', 'glow', 'rotate', 'float', 'expand')),
    
    -- Unlock conditions
    unlocked_at_stage INTEGER NOT NULL,
    is_unlocked BOOLEAN DEFAULT false NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE,
    
    -- Asset data
    asset_data JSONB DEFAULT '{}' NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(country_id, asset_type, asset_name)
);

-- ===================================
-- 3. REAL-TIME ACTIVITY FEED
-- ===================================

-- World events that affect the map
CREATE TABLE world_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES world_countries(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE SET NULL,
    
    -- Event classification
    event_type VARCHAR(30) NOT NULL CHECK (event_type IN (
        'daily_participation', 'recruitment', 'collaboration', 'voting', 'toxic_behavior', 
        'mission_completion', 'summit_participation', 'diplomatic_success', 'infrastructure_build'
    )),
    event_category VARCHAR(20) NOT NULL CHECK (event_category IN ('positive', 'negative', 'neutral')),
    
    -- Event data
    event_title VARCHAR(200) NOT NULL,
    event_description TEXT,
    event_magnitude DECIMAL(8,4) NOT NULL DEFAULT 0.0000, -- How much it affects the map
    
    -- Map effects
    visual_effect_type VARCHAR(30) CHECK (visual_effect_type IN ('pulse', 'storm', 'glow', 'expansion', 'bridge')),
    effect_duration_minutes INTEGER NOT NULL DEFAULT 60,
    effect_intensity DECIMAL(8,4) NOT NULL DEFAULT 0.5000,
    
    -- Attribute impacts
    energy_impact DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    unity_impact DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    knowledge_impact DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    economy_impact DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    stability_impact DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    
    -- Status
    is_active BOOLEAN DEFAULT true NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Active visual effects on the map
CREATE TABLE active_map_effects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID NOT NULL REFERENCES world_countries(id) ON DELETE CASCADE,
    world_event_id UUID NOT NULL REFERENCES world_events(id) ON DELETE CASCADE,
    
    -- Effect properties
    effect_type VARCHAR(30) NOT NULL,
    effect_position JSONB NOT NULL DEFAULT '{}',
    effect_radius DECIMAL(8,4) NOT NULL DEFAULT 1.0000,
    effect_intensity DECIMAL(8,4) NOT NULL DEFAULT 0.5000,
    
    -- Animation data
    animation_data JSONB DEFAULT '{}' NOT NULL,
    
    -- Timing
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 4. COUNTRY DNA SYSTEM
-- ===================================

-- Country personality analysis
CREATE TABLE country_dna_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID NOT NULL REFERENCES world_countries(id) ON DELETE CASCADE,
    
    -- Behavior patterns (last 30 days)
    educator_actions INTEGER NOT NULL DEFAULT 0,
    recruiter_actions INTEGER NOT NULL DEFAULT 0,
    creator_actions INTEGER NOT NULL DEFAULT 0,
    organizer_actions INTEGER NOT NULL DEFAULT 0,
    
    -- Personality scores
    knowledge_tendency DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    expansion_tendency DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    cultural_tendency DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    governance_tendency DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    
    -- Dominant traits
    primary_trait VARCHAR(30) CHECK (primary_trait IN ('knowledge', 'expansion', 'cultural', 'governance', 'balanced')),
    secondary_trait VARCHAR(30) CHECK (secondary_trait IN ('knowledge', 'expansion', 'cultural', 'governance', 'balanced')),
    
    -- Unique characteristics
    unique_visual_elements JSONB DEFAULT '[]' NOT NULL,
    special_abilities JSONB DEFAULT '[]' NOT NULL,
    
    -- Analysis period
    analysis_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    analysis_end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(country_id)
);

-- ===================================
-- 5. AI CIVILIZATION BRAIN
-- ===================================

-- AI balancing decisions
CREATE TABLE ai_civilization_decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Decision metadata
    decision_type VARCHAR(30) NOT NULL CHECK (decision_type IN (
        'balance_dominance', 'boost_underdog', 'detect_manipulation', 'slow_artificial_growth', 'promote_collaboration'
    )),
    decision_reason TEXT NOT NULL,
    
    -- Target countries
    affected_countries JSONB DEFAULT '[]' NOT NULL,
    primary_country_id UUID REFERENCES world_countries(id) ON DELETE SET NULL,
    
    -- Balancing actions
    energy_adjustment DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    unity_adjustment DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    knowledge_adjustment DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    economy_adjustment DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    stability_adjustment DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    
    -- Decision parameters
    confidence_score DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    intervention_strength DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    duration_hours INTEGER NOT NULL DEFAULT 24,
    
    -- Status
    is_active BOOLEAN DEFAULT true NOT NULL,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Civilization balance metrics
CREATE TABLE civilization_balance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Global balance indicators
    total_countries INTEGER NOT NULL DEFAULT 0,
    dominant_countries JSONB DEFAULT '[]' NOT NULL,
    underperforming_countries JSONB DEFAULT '[]' NOT NULL,
    
    -- Distribution metrics
    energy_distribution_entropy DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    influence_gini_coefficient DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    collaboration_index DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    
    -- Health indicators
    system_stability DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    manipulation_risk DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    artificial_growth_risk DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    
    -- AI interventions needed
    interventions_required INTEGER NOT NULL DEFAULT 0,
    last_intervention_type VARCHAR(30),
    
    -- Timestamp
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(calculated_at::date)
);

-- ===================================
-- 6. GLOBAL INFLUENCE NETWORK
-- ===================================

-- Diplomatic connections between countries
CREATE TABLE country_influence_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_country_id UUID NOT NULL REFERENCES world_countries(id) ON DELETE CASCADE,
    target_country_id UUID NOT NULL REFERENCES world_countries(id) ON DELETE CASCADE,
    
    -- Connection strength
    influence_strength DECIMAL(8,4) NOT NULL DEFAULT 0.0000 CHECK (influence_strength >= 0 AND influence_strength <= 1),
    collaboration_level INTEGER NOT NULL DEFAULT 0 CHECK (collaboration_level >= 0 AND collaboration_level <= 10),
    
    -- Connection types
    connection_types JSONB DEFAULT '[]' NOT NULL, -- ['diplomatic', 'economic', 'cultural', 'educational']
    
    -- Visual properties
    bridge_visual_type VARCHAR(30) CHECK (bridge_visual_type IN ('glow', 'energy', 'data', 'cultural')),
    bridge_intensity DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    bridge_color VARCHAR(7) NOT NULL DEFAULT '#FFFFFF',
    
    -- Benefits
    shared_bonus_active BOOLEAN DEFAULT false NOT NULL,
    joint_missions_unlocked INTEGER NOT NULL DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true NOT NULL,
    established_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(source_country_id, target_country_id)
);

-- Collaborative missions between countries
CREATE TABLE collaborative_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_name VARCHAR(200) NOT NULL,
    mission_description TEXT NOT NULL,
    
    -- Participating countries
    participating_countries JSONB NOT NULL DEFAULT '[]',
    lead_country_id UUID NOT NULL REFERENCES world_countries(id) ON DELETE RESTRICT,
    
    -- Mission details
    mission_type VARCHAR(30) NOT NULL CHECK (mission_type IN ('infrastructure', 'education', 'cultural_exchange', 'diplomatic', 'crisis_response')),
    difficulty_level INTEGER NOT NULL DEFAULT 1 CHECK (difficulty_level >= 1 AND difficulty_level <= 10),
    
    -- Objectives and rewards
    objectives JSONB NOT NULL DEFAULT '[]',
    shared_rewards JSONB NOT NULL DEFAULT '{}',
    influence_bonus DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'active', 'completed', 'failed', 'cancelled')),
    
    -- Timestamps
    proposed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 7. HISTORICAL MEMORY LAYER
-- ===================================

-- Historical world events (permanent)
CREATE TABLE historical_world_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES world_countries(id) ON DELETE SET NULL,
    
    -- Event classification
    event_type VARCHAR(30) NOT NULL CHECK (event_type IN (
        'first_summit', 'legendary_mission', 'historic_leader', 'community_victory', 
        'civilization_milestone', 'global_crisis', 'technological_breakthrough'
    )),
    significance_level INTEGER NOT NULL DEFAULT 1 CHECK (significance_level >= 1 AND significance_level <= 10),
    
    -- Event details
    event_title VARCHAR(200) NOT NULL,
    event_description TEXT NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Participants
    key_players JSONB DEFAULT '[]' NOT NULL,
    communities_involved JSONB DEFAULT '[]' NOT NULL,
    
    -- Impact data
    world_impact_description TEXT,
    lasting_effects JSONB DEFAULT '[]' NOT NULL,
    
    -- Visual markers
    map_marker_type VARCHAR(30) CHECK (map_marker_type IN ('monument', 'plaque', 'beacon', 'memorial', 'landmark')),
    marker_position JSONB NOT NULL DEFAULT '{}',
    is_permanent_marker BOOLEAN DEFAULT true NOT NULL,
    
    -- Media
    event_images JSONB DEFAULT '[]' NOT NULL,
    event_videos JSONB DEFAULT '[]' NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Country evolution timeline
CREATE TABLE country_evolution_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID NOT NULL REFERENCES world_countries(id) ON DELETE CASCADE,
    
    -- Timeline event
    timeline_date TIMESTAMP WITH TIME ZONE NOT NULL,
    event_type VARCHAR(30) NOT NULL CHECK (event_type IN (
        'evolution_stage_up', 'milestone_reached', 'leader_elected', 'crisis_overcome', 
        'achievement_unlocked', 'connection_established', 'infrastructure_built'
    )),
    
    -- Event data
    event_title VARCHAR(200) NOT NULL,
    event_description TEXT NOT NULL,
    before_state JSONB NOT NULL DEFAULT '{}',
    after_state JSONB NOT NULL DEFAULT '{}',
    
    -- Visual changes
    visual_changes JSONB DEFAULT '[]' NOT NULL,
    new_assets_unlocked JSONB DEFAULT '[]' NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 8. ECONOMIC LINKAGE
-- ===================================

-- Economic conditions based on map state
CREATE TABLE map_economic_conditions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID NOT NULL REFERENCES world_countries(id) ON DELETE CASCADE,
    
    -- Current conditions
    stability_multiplier DECIMAL(5,4) NOT NULL DEFAULT 1.0000,
    collaboration_multiplier DECIMAL(5,4) NOT NULL DEFAULT 1.0000,
    knowledge_multiplier DECIMAL(5,4) NOT NULL DEFAULT 1.0000,
    unity_multiplier DECIMAL(5,4) NOT NULL DEFAULT 1.0000,
    
    -- Economic effects
    earnings_bonus_rate DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    reputation_decay_rate DECIMAL(5,4) NOT NULL DEFAULT 0.0100,
    mission_success_bonus DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    
    -- Unlock conditions
    premium_quests_unlocked BOOLEAN DEFAULT false NOT NULL,
    special_rewards_active BOOLEAN DEFAULT false NOT NULL,
    
    -- Duration
    condition_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    condition_end TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(country_id)
);

-- Regional economic bonuses
CREATE TABLE regional_economic_bonuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_name VARCHAR(50) NOT NULL,
    countries_in_region JSONB NOT NULL DEFAULT '[]',
    
    -- Regional metrics
    regional_unity DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    regional_collaboration DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    regional_stability DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    
    -- Shared rewards
    shared_reward_pool DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    bonus_distribution_rate DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    
    -- Status
    is_active BOOLEAN DEFAULT true NOT NULL,
    
    -- Timestamps
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_distributed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(region_name, calculated_at::date)
);

-- ===================================
-- 9. EMOTIONAL ATTACHMENT ENGINE
-- ===================================

-- Player emotional connections to countries
CREATE TABLE player_country_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    country_id UUID NOT NULL REFERENCES world_countries(id) ON DELETE CASCADE,
    
    -- Attachment metrics
    emotional_bond_strength DECIMAL(8,4) NOT NULL DEFAULT 0.0000 CHECK (emotional_bond_strength >= 0 AND emotional_bond_strength <= 1),
    sense_of_ownership DECIMAL(8,4) NOT NULL DEFAULT 0.0000 CHECK (sense_of_ownership >= 0 AND sense_of_ownership <= 1),
    pride_level DECIMAL(8,4) NOT NULL DEFAULT 0.0000 CHECK (pride_level >= 0 AND pride_level <= 1),
    
    -- Contribution tracking
    total_contributions BIGINT NOT NULL DEFAULT 0,
    visible_impact_actions BIGINT NOT NULL DEFAULT 0,
    leadership_moments INTEGER NOT NULL DEFAULT 0,
    
    -- Memory formation
    significant_memories JSONB DEFAULT '[]' NOT NULL,
    attachment_milestones JSONB DEFAULT '[]' NOT NULL,
    
    -- Behavioral patterns
    daily_check_in_streak INTEGER NOT NULL DEFAULT 0,
    protection_behaviors INTEGER NOT NULL DEFAULT 0, -- Actions to defend/help country
    mentorship_activities INTEGER NOT NULL DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true NOT NULL,
    first_attached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(player_id, country_id)
);

-- Homeland protection behaviors
CREATE TABLE homeland_protection_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    country_id UUID NOT NULL REFERENCES world_countries(id) ON DELETE CASCADE,
    
    -- Protection action
    action_type VARCHAR(30) NOT NULL CHECK (action_type IN (
        'defend_reputation', 'mentor_new_player', 'organize_community', 'crisis_response', 
        'knowledge_sharing', 'infrastructure_support', 'diplomatic_aid'
    )),
    
    -- Action details
    action_description TEXT NOT NULL,
    impact_magnitude DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    
    -- Context
    trigger_event VARCHAR(200),
    beneficiaries JSONB DEFAULT '[]' NOT NULL,
    
    -- Recognition
    community_recognition INTEGER NOT NULL DEFAULT 0,
    homeland_points_earned INTEGER NOT NULL DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 10. PERFORMANCE INDEXES
-- ===================================

-- World countries indexes
CREATE INDEX idx_world_countries_country_code ON world_countries(country_code);
CREATE INDEX idx_world_countries_evolution_stage ON world_countries(evolution_stage);
CREATE INDEX idx_world_countries_civilization_type ON world_countries(civilization_type);
CREATE INDEX idx_world_countries_global_influence ON world_countries(global_influence);
CREATE INDEX idx_world_countries_updated_at ON world_countries(updated_at);

-- Real-time metrics indexes
CREATE INDEX idx_country_realtime_metrics_country_id ON country_realtime_metrics(country_id);
CREATE INDEX idx_country_realtime_metrics_calculated_at ON country_realtime_metrics(calculated_at);

-- World events indexes
CREATE INDEX idx_world_events_country_id ON world_events(country_id);
CREATE INDEX idx_world_events_player_id ON world_events(player_id);
CREATE INDEX idx_world_events_event_type ON world_events(event_type);
CREATE INDEX idx_world_events_created_at ON world_events(created_at);
CREATE INDEX idx_world_events_is_active ON world_events(is_active);

-- Active map effects indexes
CREATE INDEX idx_active_map_effects_country_id ON active_map_effects(country_id);
CREATE INDEX idx_active_map_effects_expires_at ON active_map_effects(expires_at);
CREATE INDEX idx_active_map_effects_effect_type ON active_map_effects(effect_type);

-- Country DNA indexes
CREATE INDEX idx_country_dna_analysis_country_id ON country_dna_analysis(country_id);
CREATE INDEX idx_country_dna_analysis_primary_trait ON country_dna_analysis(primary_trait);

-- AI decisions indexes
CREATE INDEX idx_ai_civilization_decisions_decision_type ON ai_civilization_decisions(decision_type);
CREATE INDEX idx_ai_civilization_decisions_is_active ON ai_civilization_decisions(is_active);
CREATE INDEX idx_ai_civilization_decisions_expires_at ON ai_civilization_decisions(expires_at);

-- Influence connections indexes
CREATE INDEX idx_country_influence_connections_source_country_id ON country_influence_connections(source_country_id);
CREATE INDEX idx_country_influence_connections_target_country_id ON country_influence_connections(target_country_id);
CREATE INDEX idx_country_influence_connections_is_active ON country_influence_connections(is_active);

-- Historical events indexes
CREATE INDEX idx_historical_world_events_country_id ON historical_world_events(country_id);
CREATE INDEX idx_historical_world_events_event_type ON historical_world_events(event_type);
CREATE INDEX idx_historical_world_events_significance_level ON historical_world_events(significance_level);
CREATE INDEX idx_historical_world_events_event_date ON historical_world_events(event_date);

-- Player attachments indexes
CREATE INDEX idx_player_country_attachments_player_id ON player_country_attachments(player_id);
CREATE INDEX idx_player_country_attachments_country_id ON player_country_attachments(country_id);
CREATE INDEX idx_player_country_attachments_emotional_bond_strength ON player_country_attachments(emotional_bond_strength);

-- ===================================
-- TRIGGERS FOR REAL-TIME UPDATES
-- ===================================

-- Update country metrics when world events occur
CREATE OR REPLACE FUNCTION update_country_metrics_from_event()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Update country attributes based on event impacts
        UPDATE world_countries 
        SET 
            activity_energy = LEAST(activity_energy + NEW.energy_impact, 1.0),
            unity_level = LEAST(unity_level + NEW.unity_impact, 1.0),
            knowledge_index = LEAST(knowledge_index + NEW.knowledge_impact, 1.0),
            economy_strength = LEAST(economy_strength + NEW.economy_impact, 1.0),
            stability_factor = LEAST(stability_factor + NEW.stability_impact, 1.0),
            total_actions_ever = total_actions_ever + 1,
            last_activity_pulse = NOW(),
            updated_at = NOW()
        WHERE id = NEW.country_id;
        
        -- Check for evolution stage upgrade
        PERFORM check_evolution_stage_upgrade(NEW.country_id);
        
        -- Create active map effect if needed
        IF NEW.visual_effect_type IS NOT NULL THEN
            INSERT INTO active_map_effects 
            (id, country_id, world_event_id, effect_type, effect_intensity, started_at, expires_at)
            VALUES (
                uuid_generate_v4(), 
                NEW.country_id, 
                NEW.id, 
                NEW.visual_effect_type, 
                NEW.effect_intensity,
                NOW(),
                NOW() + INTERVAL '1 minute' * NEW.effect_duration_minutes
            );
        END IF;
        
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_country_metrics_from_event
    AFTER INSERT ON world_events
    FOR EACH ROW EXECUTE FUNCTION update_country_metrics_from_event();

-- Evolution stage check function
CREATE OR REPLACE FUNCTION check_evolution_stage_upgrade(countryId UUID)
RETURNS VOID AS $$
DECLARE
    currentCountry RECORD;
    nextStage RECORD;
    newStage INTEGER;
BEGIN
    -- Get current country data
    SELECT * INTO currentCountry 
    FROM world_countries 
    WHERE id = countryId;
    
    IF NOT FOUND THEN
        RETURN;
    END IF;
    
    -- Find next evolution stage
    SELECT * INTO nextStage
    FROM evolution_stages 
    WHERE stage_number = currentCountry.evolution_stage + 1;
    
    IF NOT FOUND THEN
        RETURN; -- Already at max stage
    END IF;
    
    -- Check if requirements are met
    IF (currentCountry.activity_energy >= nextStage.min_energy_threshold AND
        currentCountry.unity_level >= nextStage.min_unity_threshold AND
        currentCountry.knowledge_index >= nextStage.min_knowledge_threshold AND
        currentCountry.economy_strength >= nextStage.min_economy_threshold AND
        currentCountry.stability_factor >= nextStage.min_stability_threshold) THEN
        
        -- Upgrade evolution stage
        UPDATE world_countries 
        SET 
            evolution_stage = nextStage.stage_number,
            updated_at = NOW()
        WHERE id = countryId;
        
        -- Create timeline event
        INSERT INTO country_evolution_timeline 
        (id, country_id, timeline_date, event_type, event_title, event_description, before_state, after_state)
        VALUES (
            uuid_generate_v4(),
            countryId,
            NOW(),
            'evolution_stage_up',
            'Evolution Stage ' || nextStage.stage_number || ': ' || nextStage.stage_name,
            'Country has evolved to ' || nextStage.stage_name,
            json_build_object('stage', currentCountry.evolution_stage),
            json_build_object('stage', nextStage.stage_number)
        );
        
        -- Unlock visual assets for new stage
        INSERT INTO country_visual_assets 
        (id, country_id, asset_type, asset_name, unlocked_at_stage, is_unlocked, unlocked_at)
        SELECT 
            uuid_generate_v4(),
            countryId,
            asset_type,
            asset_name || ' - Stage ' || nextStage.stage_number,
            nextStage.stage_number,
            true,
            NOW()
        FROM unnest(nextStage.structure_types) as asset_type;
    END IF;
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

CREATE TRIGGER update_world_countries_updated_at 
    BEFORE UPDATE ON world_countries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_country_dna_analysis_updated_at 
    BEFORE UPDATE ON country_dna_analysis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_player_country_attachments_updated_at 
    BEFORE UPDATE ON player_country_attachments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- INITIAL DATA SETUP
-- ===================================

-- Insert evolution stages
INSERT INTO evolution_stages (stage_number, stage_name, min_energy_threshold, min_unity_threshold, min_knowledge_threshold, min_economy_threshold, min_stability_threshold, glow_color, reward_multiplier) VALUES
(1, 'Awakening', 0.1, 0.1, 0.1, 0.1, 0.1, '#FFFF99', 1.0000),
(2, 'Organization', 0.3, 0.3, 0.3, 0.3, 0.3, '#99FF99', 1.1000),
(3, 'Influence', 0.5, 0.5, 0.5, 0.5, 0.5, '#9999FF', 1.2500),
(4, 'Civilization Node', 0.7, 0.7, 0.7, 0.7, 0.7, '#FF99FF', 1.5000),
(5, 'Beacon Nation', 0.9, 0.9, 0.9, 0.9, 0.9, '#FFD700', 2.0000);

-- Create initial world countries (simplified - would include all countries)
INSERT INTO world_countries (id, country_code, country_name, coordinates, region, continent) VALUES
(uuid_generate_v4(), 'UGA', 'Uganda', '{"lat": 1.3733, "lng": 32.2903}', 'East Africa', 'Africa'),
(uuid_generate_v4(), 'KEN', 'Kenya', '{"lat": -0.0236, "lng": 37.9062}', 'East Africa', 'Africa'),
(uuid_generate_v4(), 'TZA', 'Tanzania', '{"lat": -6.3690, "lng": 34.8888}', 'East Africa', 'Africa'),
(uuid_generate_v4(), 'USA', 'United States', '{"lat": 39.8283, "lng": -98.5795}', 'North America', 'North America'),
(uuid_generate_v4(), 'GBR', 'United Kingdom', '{"lat": 55.3781, "lng": -3.4360}', 'Europe', 'Europe');
