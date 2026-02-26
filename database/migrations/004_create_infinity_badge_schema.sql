-- ========================================
-- INFINITY BADGE DESIGN SYSTEM SCHEMA
-- Migration: 004_create_infinity_badge_schema.sql
-- Description: Creates tables for the Infinity Badge Design System
-- ========================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- INFINITY BADGE SYSTEM TABLES
-- ========================================

-- Main Infinity Badge System
CREATE TABLE IF NOT EXISTS infinity_badge_system (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    version VARCHAR(50) DEFAULT '1.0',
    design_language_id UUID,
    evolution_engine_id UUID,
    living_badge_system_id UUID,
    item_system_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Design Language Configuration
CREATE TABLE IF NOT EXISTS design_language (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color_palette JSONB,
    animation_style JSONB,
    lighting JSONB,
    border_system JSONB,
    glow_system JSONB,
    particle_system JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Badge Categories
CREATE TABLE IF NOT EXISTS badge_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    system_id UUID REFERENCES infinity_badge_system(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    design_language JSONB,
    evolution_levels JSONB,
    unlock_requirements JSONB,
    visual_upgrade_rules JSONB,
    psychological_impact JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(system_id, type)
);

-- Evolution Levels
CREATE TABLE IF NOT EXISTS evolution_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES badge_categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    level INTEGER NOT NULL,
    visual_upgrades JSONB,
    animation_upgrades JSONB,
    particle_upgrades JSONB,
    glow_upgrades JSONB,
    unlock_requirements JSONB,
    prestige_value INTEGER DEFAULT 0,
    rarity VARCHAR(50) DEFAULT 'common',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category_id, level)
);

-- Badge Evolution Engine
CREATE TABLE IF NOT EXISTS badge_evolution_engine (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    system_id UUID REFERENCES infinity_badge_system(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    evolution_stages JSONB,
    evolution_triggers JSONB,
    evolution_requirements JSONB,
    evolution_rewards JSONB,
    prestige_system JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Evolution Stages
CREATE TABLE IF NOT EXISTS evolution_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    badge_id UUID REFERENCES player_badges(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    stage VARCHAR(50) NOT NULL,
    visual_transformation JSONB,
    animation_transformation JSONB,
    particle_transformation JSONB,
    requirements JSONB,
    rewards JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Living Badge System
CREATE TABLE IF NOT EXISTS living_badge_system (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    system_id UUID REFERENCES infinity_badge_system(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    behavior_tracking JSONB,
    adaptation_rules JSONB,
    evolution_triggers JSONB,
    visual_feedback JSONB,
    player_recognition JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- PLAYER BADGE SYSTEM TABLES
-- ========================================

-- Player Badges
CREATE TABLE IF NOT EXISTS player_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES badge_categories(id) ON DELETE CASCADE,
    current_level UUID REFERENCES evolution_levels(id),
    current_evolution_stage UUID REFERENCES evolution_stages(id),
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    evolved_at TIMESTAMP,
    visual_upgrades JSONB,
    animation_upgrades JSONB,
    particle_upgrades JSONB,
    glow_upgrades JSONB,
    metadata JSONB,
    active BOOLEAN DEFAULT TRUE,
    UNIQUE(player_id, category_id)
);

-- Player Badge Evolution Progress
CREATE TABLE IF NOT EXISTS badge_evolution_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    badge_id UUID REFERENCES player_badges(id) ON DELETE CASCADE,
    current_stage INTEGER DEFAULT 0,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    requirements_met JSONB,
    next_stage_available BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, badge_id)
);

-- Player Behavior Tracking
CREATE TABLE IF NOT EXISTS player_behavior_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    behavior VARCHAR(100) NOT NULL,
    intensity INTEGER DEFAULT 0,
    context JSONB,
    tracked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    badge_impact JSONB
);

-- Badge Adaptations
CREATE TABLE IF NOT EXISTS badge_adaptations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    rule_id UUID,
    badge_id UUID REFERENCES player_badges(id) ON DELETE CASCADE,
    adaptation_type VARCHAR(100) NOT NULL,
    adaptation_value JSONB,
    adapted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Badge Visual Feedback
CREATE TABLE IF NOT EXISTS badge_visual_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    badge_id UUID REFERENCES player_badges(id) ON DELETE CASCADE,
    feedback_type VARCHAR(100) NOT NULL,
    visual_effect JSONB,
    timing JSONB,
    intensity INTEGER DEFAULT 0,
    personalization_level VARCHAR(50) DEFAULT 'minimal',
    feedback_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- INFINITY ITEMS SYSTEM TABLES
-- ========================================

-- Infinity Item System
CREATE TABLE IF NOT EXISTS infinity_item_system (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    system_id UUID REFERENCES infinity_badge_system(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    item_categories JSONB,
    item_effects JSONB,
    visual_design JSONB,
    rarity_system JSONB,
    crafting_system JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Infinity Items
CREATE TABLE IF NOT EXISTS infinity_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    rarity VARCHAR(50) NOT NULL,
    effects JSONB,
    visual_design JSONB,
    crafting_requirements JSONB,
    economic_value INTEGER DEFAULT 0,
    prestige_value INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player Items
CREATE TABLE IF NOT EXISTS player_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    item_id UUID REFERENCES infinity_items(id) ON DELETE CASCADE,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    active BOOLEAN DEFAULT TRUE,
    quantity INTEGER DEFAULT 1,
    UNIQUE(player_id, item_id)
);

-- Crafting Recipes
CREATE TABLE IF NOT EXISTS crafting_recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES infinity_items(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    materials JSONB,
    requirements JSONB,
    costs JSONB,
    success_rate DECIMAL(5,2) DEFAULT 100.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player Materials
CREATE TABLE IF NOT EXISTS player_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    material_id VARCHAR(255) NOT NULL,
    quantity INTEGER DEFAULT 0,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, material_id)
);

-- ========================================
-- RANK AND PRESTIGE SYSTEM TABLES
-- ========================================

-- Player Prestige
CREATE TABLE IF NOT EXISTS player_prestige (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) UNIQUE NOT NULL,
    total_prestige INTEGER DEFAULT 0,
    rank_level INTEGER DEFAULT 1,
    prestige_history JSONB,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rank Progress
CREATE TABLE IF NOT EXISTS rank_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) UNIQUE NOT NULL,
    experience INTEGER DEFAULT 0,
    contributions INTEGER DEFAULT 0,
    social_impact INTEGER DEFAULT 0,
    leadership_points INTEGER DEFAULT 0,
    economic_activity INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prestige Levels
CREATE TABLE IF NOT EXISTS prestige_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level INTEGER UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    requirements JSONB,
    rewards JSONB,
    visual_indicators JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- UNIVERSAL ACHIEVEMENTS TABLES
-- ========================================

-- Universal Achievements
CREATE TABLE IF NOT EXISTS universal_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    story TEXT,
    visual_elements JSONB,
    requirements JSONB,
    rewards JSONB,
    rarity VARCHAR(50) DEFAULT 'common',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player Achievements
CREATE TABLE IF NOT EXISTS player_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    achievement_id UUID REFERENCES universal_achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress JSONB,
    metadata JSONB,
    UNIQUE(player_id, achievement_id)
);

-- ========================================
-- ADAPTATION AND EVOLUTION TABLES
-- ========================================

-- Badge Adaptation Rules
CREATE TABLE IF NOT EXISTS badge_adaptation_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    behavior VARCHAR(100) NOT NULL,
    condition JSONB,
    adaptation JSONB,
    reversal JSONB,
    threshold INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Visual Upgrade Rules
CREATE TABLE IF NOT EXISTS visual_upgrade_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES badge_categories(id) ON DELETE CASCADE,
    condition JSONB,
    upgrade JSONB,
    timing JSONB,
    animation JSONB,
    feedback JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Animation Triggers
CREATE TABLE IF NOT EXISTS animation_triggers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    badge_id UUID REFERENCES player_badges(id) ON DELETE CASCADE,
    trigger_type VARCHAR(100) NOT NULL,
    animation_config JSONB,
    conditions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- ANALYTICS AND TRACKING TABLES
-- ========================================

-- Badge Analytics
CREATE TABLE IF NOT EXISTS badge_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    badge_type VARCHAR(100) NOT NULL,
    badges_unlocked INTEGER DEFAULT 0,
    badges_evolved INTEGER DEFAULT 0,
    total_prestige INTEGER DEFAULT 0,
    active_players INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, badge_type)
);

-- Behavior Analytics
CREATE TABLE IF NOT EXISTS behavior_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    behavior VARCHAR(100) NOT NULL,
    occurrences INTEGER DEFAULT 0,
    avg_intensity DECIMAL(5,2) DEFAULT 0,
    impact_score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, behavior)
);

-- Item Analytics
CREATE TABLE IF NOT EXISTS item_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    item_type VARCHAR(100) NOT NULL,
    items_crafted INTEGER DEFAULT 0,
    items_used INTEGER DEFAULT 0,
    total_value INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, item_type)
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Player badge indexes
CREATE INDEX IF NOT EXISTS idx_player_badges_player_id ON player_badges(player_id);
CREATE INDEX IF NOT EXISTS idx_player_badges_category_id ON player_badges(category_id);
CREATE INDEX IF NOT EXISTS idx_player_badges_current_level ON player_badges(current_level);
CREATE INDEX IF NOT EXISTS idx_player_badges_unlocked_at ON player_badges(unlocked_at DESC);

-- Evolution progress indexes
CREATE INDEX IF NOT EXISTS idx_badge_evolution_progress_player_id ON badge_evolution_progress(player_id);
CREATE INDEX IF NOT EXISTS idx_badge_evolution_progress_badge_id ON badge_evolution_progress(badge_id);
CREATE INDEX IF NOT EXISTS idx_badge_evolution_progress_progress ON badge_evolution_progress(progress_percentage DESC);

-- Behavior tracking indexes
CREATE INDEX IF NOT EXISTS idx_player_behavior_tracking_player_id ON player_behavior_tracking(player_id);
CREATE INDEX IF NOT EXISTS idx_player_behavior_tracking_behavior ON player_behavior_tracking(behavior);
CREATE INDEX IF NOT EXISTS idx_player_behavior_tracking_tracked_at ON player_behavior_tracking(tracked_at DESC);

-- Badge adaptations indexes
CREATE INDEX IF NOT EXISTS idx_badge_adaptations_player_id ON badge_adaptations(player_id);
CREATE INDEX IF NOT EXISTS idx_badge_adaptations_badge_id ON badge_adaptations(badge_id);
CREATE INDEX IF NOT EXISTS idx_badge_adaptations_adapted_at ON badge_adaptations(adapted_at DESC);

-- Player items indexes
CREATE INDEX IF NOT EXISTS idx_player_items_player_id ON player_items(player_id);
CREATE INDEX IF NOT EXISTS idx_player_items_item_id ON player_items(item_id);
CREATE INDEX IF NOT EXISTS idx_player_items_acquired_at ON player_items(acquired_at DESC);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_badge_analytics_date ON badge_analytics(date DESC);
CREATE INDEX IF NOT EXISTS idx_badge_analytics_badge_type ON badge_analytics(badge_type);
CREATE INDEX IF NOT EXISTS idx_behavior_analytics_date ON behavior_analytics(date DESC);
CREATE INDEX IF NOT EXISTS idx_behavior_analytics_behavior ON behavior_analytics(behavior);
CREATE INDEX IF NOT EXISTS idx_item_analytics_date ON item_analytics(date DESC);
CREATE INDEX IF NOT EXISTS idx_item_analytics_item_type ON item_analytics(item_type);

-- ========================================
-- TRIGGERS FOR UPDATED_AT
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for tables with updated_at
CREATE TRIGGER update_infinity_badge_system_updated_at BEFORE UPDATE ON infinity_badge_system 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rank_progress_updated_at BEFORE UPDATE ON rank_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_player_prestige_updated_at BEFORE UPDATE ON player_prestige 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_badge_evolution_progress_updated_at BEFORE UPDATE ON badge_evolution_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- INITIAL DATA SEEDING
-- ========================================

-- Insert main Infinity Badge System
INSERT INTO infinity_badge_system (id, name, description, version) 
VALUES ('main-badge-system', 'Infinity Badge Design System', 'Beautiful + Addictive + Status-Driven + Impossible to Copy Easily', '1.0')
ON CONFLICT (id) DO NOTHING;

-- Insert design language
INSERT INTO design_language (id, name, description, color_palette, animation_style, lighting, border_system, glow_system, particle_system) 
VALUES ('main-design-language', 'Infinity Design Language', 'Unified visual language for all badges', 
  '{"primary": ["gold", "crimson", "blue"], "secondary": ["silver", "platinum", "diamond"], "accent": ["neon", "cosmic"], "glow": ["ethereal", "transcendent"], "particle": ["energy", "light", "cosmic"]}',
  '{"duration": 2000, "easing": "ease-in-out", "loop": true, "trigger": "continuous", "complexity": "advanced"}',
  '{"direction": "top-left", "intensity": 0.8, "shadows": true, "reflections": true, "ambient": 0.3}',
  '{"thickness": 2, "style": "solid", "color": "gold", "glow": true, "animation": true}',
  '{"intensity": 0.7, "radius": 20, "color": "gold", "pulse": true, "spread": 1.5}',
  '{"count": 50, "behavior": "orbital", "emission": "continuous", "lifetime": 3000, "size": 2}'
) ON CONFLICT (id) DO NOTHING;

-- Create badge categories
INSERT INTO badge_categories (id, system_id, name, description, type) VALUES
  ('leadership-badges', 'main-badge-system', 'Infinity Leadership Badges', 'Authority & Governance Power', 'leadership'),
  ('organizer-badges', 'main-badge-system', 'Infinity Organizer Badges', 'Builders & coordinators of the ecosystem', 'organizer'),
  ('rank-badges', 'main-badge-system', 'Infinity Rank Badges', 'Progress & Achievement', 'rank'),
  ('profile-badges', 'main-badge-system', 'Infinity Profile Badges', 'Identity personalization', 'profile'),
  ('universal-badges', 'main-badge-system', 'Infinity Universal Badges', 'Special achievements across the civilization', 'universal')
ON CONFLICT (system_id, type) DO NOTHING;

-- Insert evolution levels for leadership badges
INSERT INTO evolution_levels (id, category_id, name, description, level, prestige_value, rarity) VALUES
  ('community-voice', 'leadership-badges', 'Community Voice', 'Basic leadership recognition', 1, 100, 'common'),
  ('squad-leader', 'leadership-badges', 'Squad Leader', 'Leading small groups', 2, 500, 'uncommon'),
  ('city-leader', 'leadership-badges', 'City Leader', 'Managing city-level operations', 3, 2000, 'rare'),
  ('nation-builder', 'leadership-badges', 'Nation Builder', 'Building entire nations', 4, 10000, 'epic'),
  ('civilization-architect', 'leadership-badges', 'Civilization Architect', 'Designing civilization systems', 5, 50000, 'legendary'),
  ('eternal-leader', 'leadership-badges', 'Eternal Leader (∞)', 'Ultimate leadership authority', 6, 100000, 'mythic')
ON CONFLICT (category_id, level) DO NOTHING;

-- Insert evolution levels for rank badges
INSERT INTO evolution_levels (id, category_id, name, description, level, prestige_value, rarity) VALUES
  ('bronze-citizen', 'rank-badges', 'Bronze Citizen', 'Starting citizen rank', 1, 50, 'common'),
  ('silver-contributor', 'rank-badges', 'Silver Contributor', 'Active contributor', 2, 200, 'uncommon'),
  ('gold-influencer', 'rank-badges', 'Gold Influencer', 'Influential community member', 3, 800, 'rare'),
  ('platinum-commander', 'rank-badges', 'Platinum Commander', 'Command-level authority', 4, 3000, 'epic'),
  ('diamond-architect', 'rank-badges', 'Diamond Architect', 'Master architect', 5, 10000, 'legendary'),
  ('cosmic-rank', 'rank-badges', 'Cosmic Rank ∞', 'Transcendent achievement', 6, 50000, 'mythic')
ON CONFLICT (category_id, level) DO NOTHING;

-- Insert infinity items
INSERT INTO infinity_items (id, name, description, type, category, rarity, effects, economic_value, prestige_value) VALUES
  ('leadership-jacket', 'Leadership Jacket', 'Enhances leadership abilities and authority', 'leadership_jacket', 'Leadership Items', 'epic', '{"type": "leadership_boost", "magnitude": 25, "duration": 86400}', 1000, 500),
  ('digital-flag', 'Digital Flag', 'Shows allegiance and provides governance bonuses', 'digital_flag', 'Leadership Items', 'rare', '{"type": "governance_power", "magnitude": 15, "duration": 86400}', 500, 250),
  ('energy-booster', 'Energy Booster', 'Increases daily energy and activity limits', 'energy_booster', 'Utility Items', 'uncommon', '{"type": "energy_boost", "magnitude": 50, "duration": 86400}', 100, 50),
  ('reputation-amplifier', 'Reputation Amplifier', 'Amplifies reputation gains from activities', 'reputation_amplifier', 'Utility Items', 'rare', '{"type": "reputation_boost", "magnitude": 30, "duration": 86400}', 750, 300),
  ('civilization-relic', 'Civilization Relic', 'Ancient artifact with mysterious powers', 'civilization_relic', 'Legendary Items', 'legendary', '{"type": "mystery_power", "magnitude": 100, "duration": 604800}', 5000, 2000),
  ('legendary-artifact', 'Legendary Artifact', 'Ultimate power item with unique abilities', 'legendary_artifact', 'Legendary Items', 'mythic', '{"type": "ultimate_power", "magnitude": 200, "duration": 1209600}', 10000, 5000)
ON CONFLICT DO NOTHING;

-- Insert universal achievements
INSERT INTO universal_achievements (id, name, description, category, story, rarity) VALUES
  ('100-day-streak', '🔥 100-Day Streak', 'Consistent daily participation for 100 days', 'consistency', 'Your dedication burns bright like a star that never fades.', 'epic'),
  ('global-ambassador', '🌍 Global Ambassador', 'Representing the civilization across multiple platforms', 'representation', 'Your voice echoes across the digital realm, carrying our civilization''s banner to new horizons.', 'legendary'),
  ('knowledge-master', '🧠 Knowledge Master', 'Completing advanced educational achievements', 'education', 'Your mind is a library of wisdom, a beacon of learning for all who follow.', 'epic'),
  ('justice-keeper', '⚖️ Justice Keeper', 'Maintaining fairness and justice in the community', 'governance', 'Your scales of justice balance the very fabric of our digital society.', 'rare'),
  ('whale-supporter', '💎 Whale Supporter', 'Significant economic contribution to the ecosystem', 'economic', 'Your economic power flows like mighty rivers, nourishing the civilization''s growth.', 'legendary')
ON CONFLICT DO NOTHING;

-- Insert prestige levels
INSERT INTO prestige_levels (id, level, name, description, requirements, rewards) VALUES
  ('prestige-1', 1, 'Rising Star', 'Beginning your prestige journey', '{"total_prestige": 100}', '{"title": "Rising Star", "bonus": 1.1}'),
  ('prestige-2', 2, 'Community Leader', 'Recognized community figure', '{"total_prestige": 500}', '{"title": "Community Leader", "bonus": 1.2}'),
  ('prestige-3', 3, 'Civilization Builder', 'Major contributor to civilization', '{"total_prestige": 2000}', '{"title": "Civilization Builder", "bonus": 1.3}'),
  ('prestige-4', 4, 'Digital Legend', 'Legendary status in the digital realm', '{"total_prestige": 10000}', '{"title": "Digital Legend", "bonus": 1.5}'),
  ('prestige-5', 5, 'Eternal Icon', 'Transcendent legendary status', '{"total_prestige": 50000}', '{"title": "Eternal Icon", "bonus": 2.0}')
ON CONFLICT (level) DO NOTHING;

COMMIT;
