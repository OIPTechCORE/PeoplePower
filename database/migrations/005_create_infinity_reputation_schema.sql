-- ========================================
-- INFINITY REPUTATION ENGINE SCHEMA
-- Migration: 005_create_infinity_reputation_schema.sql
-- Description: Creates tables for the Infinity Reputation Engine
-- ========================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- INFINITY REPUTATION ENGINE TABLES
-- ========================================

-- Main Infinity Reputation Engine
CREATE TABLE IF NOT EXISTS infinity_reputation_engine (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    version VARCHAR(50) DEFAULT '1.0',
    reputation_physics_layer_id UUID,
    reputation_ai_brain_id UUID,
    badge_economic_power_id UUID,
    governance_power_id UUID,
    soulbound_civilization_id_id UUID,
    anti_exploit_architecture_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reputation Layers (Multi-Dimensional Identity)
CREATE TABLE IF NOT EXISTS reputation_layers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    engine_id UUID REFERENCES infinity_reputation_engine(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    measurement_method VARCHAR(50) NOT NULL,
    calculation_formula TEXT,
    weight DECIMAL(5,2) DEFAULT 1.0,
    decay_function VARCHAR(50) DEFAULT 'exponential',
    social_validation VARCHAR(50) DEFAULT 'peer_review',
    economic_impact JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(engine_id, type)
);

-- Reputation Physics Layer
CREATE TABLE IF NOT EXISTS reputation_physics_layer (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    engine_id UUID REFERENCES infinity_reputation_engine(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    master_equation TEXT,
    parameters JSONB,
    simulation_engine JSONB,
    stability_metrics JSONB,
    crisis_prevention JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reputation AI Brain
CREATE TABLE IF NOT EXISTS reputation_ai_brain (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    engine_id UUID REFERENCES infinity_reputation_engine(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    architecture JSONB,
    observation_layer_id UUID,
    understanding_layer_id UUID,
    prediction_engine_id UUID,
    intervention_engine_id UUID,
    ethical_constraints JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Badge Economic Power
CREATE TABLE IF NOT EXISTS badge_economic_power (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    badge_types JSONB,
    economic_multipliers JSONB,
    earning_mechanics JSONB,
    authority_levels JSONB,
    evolution_system JSONB,
    reputation_costs JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Governance Power
CREATE TABLE IF NOT EXISTS governance_power (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    voting_system JSONB,
    voting_power JSONB,
    decision_making JSONB,
    anti_manipulation JSONB,
    meritocratic_principles JSONB,
    crisis_management JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reputation Markets
CREATE TABLE IF NOT EXISTS reputation_markets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    market_type VARCHAR(50) NOT NULL,
    participants JSONB,
    instruments JSONB,
    pricing_mechanism JSONB,
    risk_management JSONB,
    settlement_system JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Soulbound Civilization ID
CREATE TABLE IF NOT EXISTS soulbound_civilization_id (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    identity_components JSONB,
    non_transferable_assets JSONB,
    cross_game_persistence JSONB,
    historical_record JSONB,
    sacred_properties JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Anti-Exploit Architecture
CREATE TABLE IF NOT EXISTS anti_exploit_architecture (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    behavior_proof JSONB,
    reputation_cost_system JSONB,
    anti_collusion JSONB,
    anti_farming JSONB,
    reputation_risk JSONB,
    protective_mechanisms JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- PLAYER REPUTATION SYSTEM TABLES
-- ========================================

-- Player Reputation (Multi-dimensional)
CREATE TABLE IF NOT EXISTS player_reputation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    layer_id UUID REFERENCES reputation_layers(id) ON DELETE CASCADE,
    score INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, layer_id)
);

-- Reputation Transactions
CREATE TABLE IF NOT EXISTS reputation_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    layer_id UUID REFERENCES reputation_layers(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    amount INTEGER NOT NULL,
    reason TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    decay_rate DECIMAL(5,4) DEFAULT 0.0100,
    expires_at TIMESTAMP
);

-- Reputation Stakes
CREATE TABLE IF NOT EXISTS reputation_stakes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staker_id VARCHAR(255) NOT NULL,
    stakee_id VARCHAR(255) NOT NULL,
    amount INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    conditions JSONB,
    rewards JSONB,
    risk_factors JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Reputation Costs
CREATE TABLE IF NOT EXISTS reputation_costs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    current_cost INTEGER DEFAULT 1,
    risk_multiplier DECIMAL(5,2) DEFAULT 1.0,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id)
);

-- ========================================
-- BADGE ECONOMIC POWER TABLES
-- ========================================

-- Player Badges (Extended with Economic Power)
CREATE TABLE IF NOT EXISTS player_badges_extended (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    badge_power_id UUID REFERENCES badge_economic_power(id) ON DELETE CASCADE,
    unlocked_powers JSONB,
    economic_multipliers JSONB,
    earning_mechanics JSONB,
    authority_level INTEGER DEFAULT 1,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT TRUE,
    UNIQUE(player_id, badge_power_id)
);

-- Economic Multipliers
CREATE TABLE IF NOT EXISTS economic_multipliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    badge_power_id UUID REFERENCES badge_economic_power(id) ON DELETE CASCADE,
    multiplier_formula TEXT NOT NULL,
    reputation_threshold INTEGER NOT NULL,
    civilization_health_index DECIMAL(5,2) DEFAULT 1.0,
    conditions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Earning Mechanics
CREATE TABLE IF NOT EXISTS earning_mechanics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    badge_power_id UUID REFERENCES badge_economic_power(id) ON DELETE CASCADE,
    mechanism VARCHAR(100) NOT NULL,
    reputation_requirement INTEGER NOT NULL,
    earning_rate DECIMAL(10,2) DEFAULT 1.0,
    risk_factors JSONB,
    sustainability VARCHAR(50) DEFAULT 'sustainable',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Authority Levels
CREATE TABLE IF NOT EXISTS authority_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    badge_power_id UUID REFERENCES badge_economic_power(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    level INTEGER NOT NULL,
    required_reputation INTEGER NOT NULL,
    governance_rights JSONB,
    economic_privileges JSONB,
    social_obligations JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(badge_power_id, level)
);

-- ========================================
-- GOVERNANCE POWER TABLES
-- ========================================

-- Governance Votes
CREATE TABLE IF NOT EXISTS governance_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    proposal_id VARCHAR(255) NOT NULL,
    vote VARCHAR(50) NOT NULL,
    voting_power INTEGER DEFAULT 1,
    reasoning TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    anti_manipulation_check JSONB
);

-- Voting Power Calculations
CREATE TABLE IF NOT EXISTS voting_power_calculations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    governance_reputation INTEGER DEFAULT 0,
    historical_accuracy DECIMAL(5,4) DEFAULT 1.0,
    community_trust DECIMAL(5,4) DEFAULT 1.0,
    weight DECIMAL(5,2) DEFAULT 1.0,
    final_voting_power INTEGER DEFAULT 1,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id)
);

-- Governance Rights
CREATE TABLE IF NOT EXISTS governance_rights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    authority_level_id UUID REFERENCES authority_levels(id) ON DELETE CASCADE,
    right_type VARCHAR(100) NOT NULL,
    description TEXT,
    power_level INTEGER DEFAULT 1,
    conditions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Anti-Manipulation Records
CREATE TABLE IF NOT EXISTS anti_manipulation_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    proposal_id VARCHAR(255) NOT NULL,
    manipulation_type VARCHAR(100) NOT NULL,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confidence DECIMAL(5,4) DEFAULT 0.0,
    evidence JSONB,
    resolution VARCHAR(255),
    resolved_at TIMESTAMP
);

-- ========================================
-- REPUTATION MARKETS TABLES
-- ========================================

-- Market Participants
CREATE TABLE IF NOT EXISTS market_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    market_id UUID REFERENCES reputation_markets(id) ON DELETE CASCADE,
    participant_id VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    reputation_staked INTEGER DEFAULT 0,
    participation_history JSONB,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(market_id, participant_id)
);

-- Market Instruments
CREATE TABLE IF NOT EXISTS market_instruments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    market_id UUID REFERENCES reputation_markets(id) ON DELETE CASCADE,
    instrument_type VARCHAR(100) NOT NULL,
    terms JSONB,
    risk_level VARCHAR(50) DEFAULT 'medium',
    returns JSONB,
    liquidity_provided INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pricing Mechanism
CREATE TABLE IF NOT EXISTS pricing_mechanism (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    market_id UUID REFERENCES reputation_markets(id) ON DELETE CASCADE,
    mechanism_type VARCHAR(100) NOT NULL,
    formula TEXT,
    parameters JSONB,
    oracle_data JSONB,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Risk Management
CREATE TABLE IF NOT EXISTS risk_management (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    market_id UUID REFERENCES reputation_markets(id) ON DELETE CASCADE,
    risk_type VARCHAR(100) NOT NULL,
    assessment_method VARCHAR(100) NOT NULL,
    mitigation_strategies JSONB,
    monitoring_metrics JSONB,
    last_assessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settlement System
CREATE TABLE IF NOT EXISTS settlement_system (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    market_id UUID REFERENCES reputation_markets(id) ON DELETE CASCADE,
    settlement_type VARCHAR(100) NOT NULL,
    settlement_frequency VARCHAR(50) DEFAULT 'daily',
    calculation_method VARCHAR(100) NOT NULL,
    dispute_resolution JSONB,
    automated BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- SOULBOUND CIVILIZATION ID TABLES
-- ========================================

-- Identity Components
CREATE TABLE IF NOT EXISTS identity_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    civilization_id UUID REFERENCES soulbound_civilization_id(id) ON DELETE CASCADE,
    component_type VARCHAR(100) NOT NULL,
    value JSONB,
    verified_at TIMESTAMP,
    verification_method VARCHAR(100) NOT NULL,
    sacred BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Non-Transferable Assets
CREATE TABLE IF NOT EXISTS non_transferable_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    civilization_id UUID REFERENCES soulbound_civilization_id(id) ON DELETE CASCADE,
    asset_type VARCHAR(100) NOT NULL,
    asset_data JSONB,
    transfer_lock VARCHAR(50) DEFAULT 'soulbound',
    historical_significance TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cross-Game Persistence
CREATE TABLE IF NOT EXISTS cross_game_persistence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    civilization_id UUID REFERENCES soulbound_civilization_id(id) ON DELETE CASCADE,
    game_platform VARCHAR(100) NOT NULL,
    persistence_data JSONB,
    verification_signature VARCHAR(255),
    last_synced TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Historical Records
CREATE TABLE IF NOT EXISTS historical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    civilization_id UUID REFERENCES soulbound_civilization_id(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    importance VARCHAR(50) DEFAULT 'normal',
    verified BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    blockchain_hash VARCHAR(255)
);

-- Sacred Properties
CREATE TABLE IF NOT EXISTS sacred_properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    civilization_id UUID REFERENCES soulbound_civilization_id(id) ON DELETE CASCADE,
    property_name VARCHAR(255) NOT NULL,
    property_value JSONB,
    protection_level VARCHAR(50) DEFAULT 'high',
    modification_rules JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- ANTI-EXPLOIT ARCHITECTURE TABLES
-- ========================================

-- Behavior Proof
CREATE TABLE IF NOT EXISTS behavior_proof (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    proof_type VARCHAR(100) NOT NULL,
    analysis_data JSONB,
    risk_score INTEGER DEFAULT 0,
    confidence DECIMAL(5,4) DEFAULT 0.0,
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Anti-Collusion Detection
CREATE TABLE IF NOT EXISTS anti_collusion (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    cluster_analysis JSONB,
    anomaly_score DECIMAL(5,4) DEFAULT 0.0,
    cluster_risk VARCHAR(50) DEFAULT 'low',
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mitigation_applied VARCHAR(255),
    resolved_at TIMESTAMP
);

-- Anti-Farming Detection
CREATE TABLE IF NOT EXISTS anti_farming (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    farming_pattern JSONB,
    bot_likelihood DECIMAL(5,4) DEFAULT 0.0,
    action_taken VARCHAR(255),
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Reputation Risk
CREATE TABLE IF NOT EXISTS reputation_risk (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    risk_type VARCHAR(100) NOT NULL,
    risk_level VARCHAR(50) DEFAULT 'low',
    mitigation JSONB,
    monitoring_active BOOLEAN DEFAULT TRUE,
    last_assessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Protective Mechanisms
CREATE TABLE IF NOT EXISTS protective_mechanisms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mechanism_type VARCHAR(100) NOT NULL,
    description TEXT,
    implementation JSONB,
    effectiveness DECIMAL(5,4) DEFAULT 0.0,
    active BOOLEAN DEFAULT TRUE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- AI BRAIN TABLES
-- ========================================

-- AI Observations
CREATE TABLE IF NOT EXISTS ai_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brain_id UUID REFERENCES reputation_ai_brain(id) ON DELETE CASCADE,
    sensor_type VARCHAR(100) NOT NULL,
    observation_data JSONB,
    confidence DECIMAL(5,4) DEFAULT 0.0,
    observed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed BOOLEAN DEFAULT FALSE
);

-- AI Predictions
CREATE TABLE IF NOT EXISTS ai_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brain_id UUID REFERENCES reputation_ai_brain(id) ON DELETE CASCADE,
    model_type VARCHAR(100) NOT NULL,
    prediction_data JSONB,
    confidence_interval JSONB,
    time_horizon INTEGER DEFAULT 30,
    predicted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actual_outcome JSONB,
    accuracy DECIMAL(5,4),
    resolved_at TIMESTAMP
);

-- AI Interventions
CREATE TABLE IF NOT EXISTS ai_interventions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brain_id UUID REFERENCES reputation_ai_brain(id) ON DELETE CASCADE,
    intervention_type VARCHAR(100) NOT NULL,
    parameters JSONB,
    reasoning TEXT,
    intervened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    effectiveness DECIMAL(5,4),
    outcome JSONB,
    ethical_validation JSONB
);

-- Learning Loops
CREATE TABLE IF NOT EXISTS learning_loops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brain_id UUID REFERENCES reputation_ai_brain(id) ON DELETE CASCADE,
    loop_type VARCHAR(100) NOT NULL,
    input_data JSONB,
    learning_algorithm VARCHAR(100) NOT NULL,
    outcome JSONB,
    improvement DECIMAL(5,4) DEFAULT 0.0,
    iteration INTEGER DEFAULT 1,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Player reputation indexes
CREATE INDEX IF NOT EXISTS idx_player_reputation_player_id ON player_reputation(player_id);
CREATE INDEX IF NOT EXISTS idx_player_reputation_layer_id ON player_reputation(layer_id);
CREATE INDEX IF NOT EXISTS idx_player_reputation_score ON player_reputation(score DESC);
CREATE INDEX IF NOT EXISTS idx_player_reputation_updated_at ON player_reputation(updated_at DESC);

-- Reputation transactions indexes
CREATE INDEX IF NOT EXISTS idx_reputation_transactions_player_id ON reputation_transactions(player_id);
CREATE INDEX IF NOT EXISTS idx_reputation_transactions_timestamp ON reputation_transactions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_reputation_transactions_type ON reputation_transactions(type);

-- Reputation stakes indexes
CREATE INDEX IF NOT EXISTS idx_reputation_stakes_staker_id ON reputation_stakes(staker_id);
CREATE INDEX IF NOT EXISTS idx_reputation_stakes_stakee_id ON reputation_stakes(stakee_id);
CREATE INDEX IF NOT EXISTS idx_reputation_stakes_expires_at ON reputation_stakes(expires_at);

-- Governance votes indexes
CREATE INDEX IF NOT EXISTS idx_governance_votes_player_id ON governance_votes(player_id);
CREATE INDEX IF NOT EXISTS idx_governance_votes_proposal_id ON governance_votes(proposal_id);
CREATE INDEX IF NOT EXISTS idx_governance_votes_timestamp ON governance_votes(timestamp DESC);

-- AI brain indexes
CREATE INDEX IF NOT EXISTS idx_ai_observations_brain_id ON ai_observations(brain_id);
CREATE INDEX IF NOT EXISTS idx_ai_observations_observed_at ON ai_observations(observed_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_brain_id ON ai_predictions(brain_id);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_predicted_at ON ai_predictions(predicted_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_interventions_brain_id ON ai_interventions(brain_id);
CREATE INDEX IF NOT EXISTS idx_ai_interventions_intervened_at ON ai_interventions(intervened_at DESC);

-- Market indexes
CREATE INDEX IF NOT EXISTS idx_market_participants_market_id ON market_participants(market_id);
CREATE INDEX IF NOT EXISTS idx_market_participants_participant_id ON market_participants(participant_id);
CREATE INDEX IF NOT EXISTS idx_market_instruments_market_id ON market_instruments(market_id);
CREATE INDEX IF NOT EXISTS idx_pricing_mechanism_market_id ON pricing_mechanism(market_id);

-- ========================================
-- TRIGGERS FOR UPDATED_AT
-- ========================================

-- Create triggers for tables with updated_at
CREATE TRIGGER update_infinity_reputation_engine_updated_at BEFORE UPDATE ON infinity_reputation_engine 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_player_reputation_updated_at BEFORE UPDATE ON player_reputation 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reputation_costs_updated_at BEFORE UPDATE ON reputation_costs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_voting_power_calculations_updated_at BEFORE UPDATE ON voting_power_calculations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_interventions_intervened_at BEFORE UPDATE ON ai_interventions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- FUNCTIONS FOR REPUTATION CALCULATIONS
-- ========================================

-- Function to calculate effective reputation
CREATE OR REPLACE FUNCTION calculate_effective_reputation(player_uuid VARCHAR(255))
RETURNS DECIMAL(10,2) AS $$
DECLARE
    effective_rep DECIMAL(10,2) := 0;
    layer_record RECORD;
BEGIN
    -- Sum weighted reputation scores with decay
    FOR layer_record IN 
        SELECT pr.score, rl.weight, rl.decay_function, pr.updated_at
        FROM player_reputation pr
        JOIN reputation_layers rl ON pr.layer_id = rl.id
        WHERE pr.player_id = player_uuid
    LOOP
        -- Apply decay based on layer's decay function
        CASE layer_record.decay_function
            WHEN 'exponential' THEN
                effective_rep := effective_rep + (layer_record.score * EXP(-0.01 * EXTRACT(DAY FROM NOW() - layer_record.updated_at)) * layer_record.weight);
            WHEN 'linear' THEN
                effective_rep := effective_rep + (GREATEST(0, layer_record.score - 0.1 * EXTRACT(DAY FROM NOW() - layer_record.updated_at)) * layer_record.weight);
            WHEN 'logarithmic' THEN
                effective_rep := effective_rep + (layer_record.score / (1 + LN(EXTRACT(DAY FROM NOW() - layer_record.updated_at) + 1)) * layer_record.weight);
            ELSE
                effective_rep := effective_rep + (layer_record.score * layer_record.weight);
        END CASE;
    END LOOP;
    
    RETURN effective_rep;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate voting power
CREATE OR REPLACE FUNCTION calculate_voting_power(player_uuid VARCHAR(255))
RETURNS INTEGER AS $$
DECLARE
    governance_rep DECIMAL(10,2) := 0;
    historical_acc DECIMAL(5,4) := 1.0;
    community_trust DECIMAL(5,4) := 1.0;
    weight DECIMAL(5,2) := 1.0;
    voting_power INTEGER := 1;
BEGIN
    -- Get governance reputation
    SELECT pr.score, rl.weight INTO governance_rep, weight
    FROM player_reputation pr
    JOIN reputation_layers rl ON pr.layer_id = rl.id
    WHERE pr.player_id = player_uuid AND rl.type = 'governance';
    
    -- Get historical accuracy and community trust (simplified for this example)
    SELECT COALESCE(AVG(accuracy), 1.0) INTO historical_acc
    FROM voting_power_calculations vpc
    WHERE vpc.player_id = player_uuid;
    
    -- Calculate voting power: Governance Reputation × Historical Accuracy × Community Trust
    voting_power := ROUND(governance_rep * historical_acc * community_trust * weight);
    
    RETURN voting_power;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- INITIAL DATA SEEDING
-- ========================================

-- Insert main Infinity Reputation Engine
INSERT INTO infinity_reputation_engine (id, name, description, version) 
VALUES ('main-reputation-engine', 'Infinity Reputation Engine', 'Where badges become economic power, governance rights, and earning multipliers', '1.0')
ON CONFLICT (id) DO NOTHING;

-- Create reputation layers
INSERT INTO reputation_layers (id, engine_id, name, description, type, measurement_method, calculation_formula, weight, decay_function, social_validation, economic_impact) 
VALUES 
  ('contribution-layer', 'main-reputation-engine', 'Contribution Reputation', 'contribution', 'automatic', 'SUM(validated_contributions * weight)', 0.3, 'exponential', 'peer_review', '{"economic_impact": "high", "governance_impact": "medium"}'),
  ('trust-layer', 'main-reputation-engine', 'Trust Reputation', 'trust', 'peer_validation', 'AVG(honesty_score * fairness_score * verification_score) * weight', 0.25, 'exponential', 'community_validation', '{"economic_impact": "medium", "governance_impact": "high"}'),
  ('governance-layer', 'main-reputation-engine', 'Governance Reputation', 'governance', 'ai_analysis', 'AVG(voting_accuracy * proposal_success_rate * policy_impact) * weight', 0.2, 'exponential', 'expert_validation', '{"economic_impact": "low", "governance_impact": "high"}'),
  ('social-layer', 'main-reputation-engine', 'Social Reputation', 'social', 'peer_review', 'AVG(mentoring_score * conflict_resolution * positive_engagement) * weight', 0.15, 'exponential', 'peer_validation', '{"economic_impact": "low", "governance_impact": "medium"}'),
  ('economic-layer', 'main-reputation-engine', 'Economic Reputation', 'economic', 'automatic', 'AVG(long_term_holding * market_stabilizing * liquidity_support * sustainability) * weight', 0.1, 'exponential', 'automatic', '{"economic_impact": "high", "governance_impact": "low"}')
ON CONFLICT (engine_id, type) DO NOTHING;

-- Insert badge economic power
INSERT INTO badge_economic_power (id, name, description, badge_types, economic_multipliers, earning_mechanics, authority_levels) 
VALUES 
  ('main-badge-power', 'Badge Economic Power', 'Economic power unlocked through badges', 
   '{"builder": {"unlocked_powers": ["revenue_share", "early_feature_access"], "economic_multipliers": 1.2}, "guardian": {"unlocked_powers": ["moderation_power", "security_bonuses"], "economic_multipliers": 1.5}}',
   '{"base_reward": 100, "multiplier_formula": "1.0 + (reputation / 1000)", "civilization_health_index": 1.0}',
   '{"direct_earning": {"mechanism": "direct_earning", "reputation_requirement": 0, "earning_rate": 1.0}, "revenue_sharing": {"mechanism": "revenue_sharing", "reputation_requirement": 500, "earning_rate": 1.1}}',
   '{"level_1": {"required_reputation": 100, "governance_rights": ["basic_voting"]}, "level_2": {"required_reputation": 500, "governance_rights": ["advanced_voting"]}, "level_3": {"required_reputation": 2000, "governance_rights": ["proposal_creation"]}}')
ON CONFLICT (id) DO NOTHING;

-- Insert governance power
INSERT INTO governance_power (id, name, description, voting_system, voting_power, decision_making, anti_manipulation, meritocratic_principles, crisis_management) 
VALUES 
  ('main-governance-power', 'Governance Power', 'Governance power derived from reputation', 
   '{"type": "weighted_consensus", "description": "Voting power based on reputation metrics"}',
   '{"formula": "governance_reputation * historical_accuracy * community_trust", "description": "Reputation-based voting power calculation"}',
   '{"process": "multi_chamber", "description": "Three-chamber decision making process"}',
   '{"methods": ["voting_pattern_analysis", "collusion_detection", "reputation_weighting"], "description": "Anti-manipulation measures"}',
   '{"principles": ["merit_based", "reputation_weighted", "anti_oligarchy"], "description": "Meritocratic governance principles"}',
   '{"protocols": ["crisis_response", "emergency_intervention", "stabilization"], "description": "Crisis management protocols"}')
ON CONFLICT (id) DO NOTHING;

-- Insert reputation markets
INSERT INTO reputation_markets (id, name, description, market_type, participants, instruments, pricing_mechanism, risk_management, settlement_system) 
VALUES 
  ('reputation-backing-market', 'Reputation Backing Market', 'Market for staking reputation on newcomers', 'reputation_backing', 
   '{"roles": ["staker", "stakee"], "mechanisms": ["reputation_staking", "risk_sharing"]}',
   '{"types": ["reputation_futures", "reputation_options"], "terms": ["30_day", "90_day"]}',
   '{"mechanism": "reputation_weighted_pricing", "formula": "base_price * (1 + risk_premium)"}',
   '{"methods": ["reputation_scoring", "behavioral_analysis"], "strategies": ["diversification", "hedging"]}',
   '{"type": "automated_settlement", "frequency": "daily", "method": "reputation_based"}')
ON CONFLICT (id) DO NOTHING;

-- Insert soulbound civilization ID
INSERT INTO soulbound_civilization_id (id, name, description, identity_components, non_transferable_assets, cross_game_persistence, historical_record, sacred_properties) 
VALUES 
  ('main-civilization-id', 'Soulbound Civilization ID', 'Non-transferable digital identity', 
   '{"components": ["reputation_history", "achievement_record", "governance_participation"], "verification": "blockchain_based"}',
   '{"assets": ["reputation_score", "badge_collection", "governance_rights"], "transfer_lock": "soulbound"}',
   '{"platforms": ["telegram", "web", "mobile"], "persistence": "unified_identity"}',
   '{"storage": "on_chain", "verification": "cryptographic", "immutability": "permanent"}',
   '{"protections": ["identity_theft_prevention", "unauthorized_transfer_block", "sacred_status"]}')
ON CONFLICT (id) DO NOTHING;

-- Insert anti-exploit architecture
INSERT INTO anti_exploit_architecture (id, name, description, behavior_proof, reputation_cost_system, anti_collusion, anti_farming, reputation_risk, protective_mechanisms) 
VALUES 
  ('main-anti-exploit', 'Anti-Exploit Architecture', 'System to prevent reputation exploitation', 
   '{"methods": ["behavioral_analysis", "pattern_detection", "anomaly_scoring"], "risk_scoring": "multi_dimensional"}',
   '{"cost_calculation": "dynamic_risk_pricing", "risk_multiplier": "reputation_based", "cost_increases": "exponential"}',
   '{"detection": ["graph_analysis", "clustering", "temporal_pattern"], "response": ["automatic_penalties", "manual_review"]}',
   '{"detection": ["bot_detection", "repetitive_action", "unnatural_timing"], "response": ["rate_limiting", "captcha_challenge"]}',
   '{"types": ["manipulation_risk", "exploitation_risk", "concentration_risk"], "mitigation": ["automatic_dampening", "manual_review"]}',
   '{"mechanisms": ["rate_limiting", "reputation_cost_scaling", "behavioral_verification"], "effectiveness": "high"}')
ON CONFLICT (id) DO NOTHING;

COMMIT;
