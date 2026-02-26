-- Infinity Items Database Schema
-- Complete item system for 900M users with badge integration

-- Item categories and types
CREATE TYPE ItemCategory AS ENUM (
  'weapon',
  'armor',
  'tool',
  'consumable',
  'material',
  'artifact',
  'relic',
  'treasure',
  'cosmetic',
  'special',
  'legendary',
  'mythic',
  'transcendent'
);

-- Item rarity levels
CREATE TYPE ItemRarity AS ENUM (
  'common',
  'uncommon',
  'rare',
  'epic',
  'legendary',
  'mythic',
  'transcendent'
);

-- Item types
CREATE TYPE ItemType AS ENUM (
  'sword',
  'shield',
  'staff',
  'bow',
  'helmet',
  'chestplate',
  'boots',
  'gloves',
  'ring',
  'amulet',
  'potion',
  'scroll',
  'crystal',
  'gem',
  'artifact',
  'relic',
  'treasure',
  'cosmetic',
  'special',
  'legendary',
  'mythic',
  'transcendent'
);

-- Item quality levels
CREATE TYPE ItemQuality AS ENUM (
  'poor',
  'common',
  'uncommon',
  'rare',
  'epic',
  'legendary',
  'mythic',
  'transcendent'
);

-- Item binding types
CREATE TYPE ItemBinding AS ENUM (
  'none',
  'bind_on_pickup',
  'bind_on_equip',
  'bind_on_use',
  'account_bound',
  'character_bound'
);

-- Item definitions and properties
CREATE TABLE IF NOT EXISTS infinity_items (
    id SERIAL PRIMARY KEY,
    item_id VARCHAR(100) UNIQUE NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    item_category ItemCategory NOT NULL,
    item_type ItemType NOT NULL,
    item_rarity ItemRarity DEFAULT 'common',
    item_quality ItemQuality DEFAULT 'common',
    item_binding ItemBinding DEFAULT 'none',
    level_requirement INTEGER DEFAULT 1,
    badge_requirement VARCHAR(100),
    economic_power INTEGER DEFAULT 0,
    governance_power INTEGER DEFAULT 0,
    visual_effects JSONB,
    properties JSONB,
    requirements JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Item ownership and inventory
CREATE TABLE IF NOT EXISTS player_item_ownership (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    item_id VARCHAR(100) REFERENCES infinity_items(item_id),
    item_instance_id UUID DEFAULT gen_random_uuid(),
    quantity INTEGER DEFAULT 1,
    item_level INTEGER DEFAULT 1,
    item_quality ItemQuality DEFAULT 'common',
    enchantments JSONB,
    custom_properties JSONB,
    acquired_date TIMESTAMP DEFAULT NOW(),
    last_used TIMESTAMP,
    equipped BOOLEAN DEFAULT false,
    slot_position INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, item_instance_id)
);

-- Item crafting system
CREATE TABLE IF NOT EXISTS item_crafting_recipes (
    id SERIAL PRIMARY KEY,
    recipe_id VARCHAR(100) UNIQUE NOT NULL,
    recipe_name VARCHAR(255) NOT NULL,
    result_item_id VARCHAR(100) REFERENCES infinity_items(item_id),
    result_quantity INTEGER DEFAULT 1,
    crafting_level_requirement INTEGER DEFAULT 1,
    badge_requirement VARCHAR(100),
    crafting_cost INTEGER DEFAULT 0,
    crafting_time_minutes INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 100.0,
    materials_required JSONB,
    tools_required JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Item marketplace
CREATE TABLE IF NOT EXISTS item_marketplace (
    id SERIAL PRIMARY KEY,
    listing_id UUID DEFAULT gen_random_uuid(),
    seller_id VARCHAR(50) NOT NULL,
    item_id VARCHAR(100) REFERENCES infinity_items(item_id),
    item_instance_id UUID,
    quantity INTEGER DEFAULT 1,
    price_influence BIGINT DEFAULT 0,
    price_pwr BIGINT DEFAULT 0,
    listing_type VARCHAR(20) DEFAULT 'sale', -- sale, auction, trade
    auction_end_time TIMESTAMP,
    buyout_price_influence BIGINT,
    buyout_price_pwr BIGINT,
    current_bidder_id VARCHAR(50),
    current_bid_influence BIGINT,
    current_bid_pwr BIGINT,
    listing_status VARCHAR(20) DEFAULT 'active', -- active, sold, cancelled, expired
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Item evolution and enhancement
CREATE TABLE IF NOT EXISTS item_evolution (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    item_instance_id UUID NOT NULL,
    evolution_level INTEGER DEFAULT 1,
    evolution_progress INTEGER DEFAULT 0,
    evolution_history JSONB,
    next_evolution_requirements JSONB,
    visual_evolution JSONB,
    last_evolution TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, item_instance_id)
);

-- Item stats and performance
CREATE TABLE IF NOT EXISTS item_stats (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    item_id VARCHAR(100) REFERENCES infinity_items(item_id),
    item_instance_id UUID,
    times_used INTEGER DEFAULT 0,
    total_damage_dealt BIGINT DEFAULT 0,
    total_damage_blocked BIGINT DEFAULT 0,
    total_healing BIGINT DEFAULT 0,
    total_resources_gathered BIGINT DEFAULT 0,
    total_crafting_success INTEGER DEFAULT 0,
    total_crafting_failures INTEGER DEFAULT 0,
    performance_rating DECIMAL(5,2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, item_instance_id)
);

-- Item social validation
CREATE TABLE IF NOT EXISTS item_social_validation (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    item_instance_id UUID NOT NULL,
    validator_id VARCHAR(50) NOT NULL,
    validation_type VARCHAR(50) NOT NULL, -- endorsement, review, rating
    validation_score INTEGER DEFAULT 0,
    validation_comment TEXT,
    validation_weight DECIMAL(5,4) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, item_instance_id, validator_id)
);

-- Item anti-exploit tracking
CREATE TABLE IF NOT EXISTS item_anti_exploit_tracking (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    item_instance_id UUID,
    exploit_type VARCHAR(50) NOT NULL, -- duplication, exploit, bot, fake_market
    exploit_severity VARCHAR(20) DEFAULT 'low', -- low, medium, high, critical
    exploit_data JSONB,
    detected_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending', -- pending, investigating, resolved, dismissed
    created_at TIMESTAMP DEFAULT NOW()
);

-- Item analytics
CREATE TABLE IF NOT EXISTS item_analytics (
    id SERIAL PRIMARY KEY,
    item_id VARCHAR(100) REFERENCES infinity_items(item_id),
    analytics_date DATE NOT NULL,
    total_crafted INTEGER DEFAULT 0,
    total_traded INTEGER DEFAULT 0,
    total_used INTEGER DEFAULT 0,
    total_evolved INTEGER DEFAULT 0,
    average_price_influence BIGINT DEFAULT 0,
    average_price_pwr BIGINT DEFAULT 0,
    total_economic_impact BIGINT DEFAULT 0,
    social_validations INTEGER DEFAULT 0,
    exploit_attempts INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(item_id, analytics_date)
);

-- Item capacity planning
CREATE TABLE IF NOT EXISTS item_capacity_planning (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    current_capacity BIGINT NOT NULL,
    projected_capacity BIGINT NOT NULL,
    required_capacity BIGINT NOT NULL,
    urgency_level VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    estimated_cost DECIMAL(18,2),
    timeline_months INTEGER,
    action_required TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_infinity_items_category ON infinity_items(item_category);
CREATE INDEX IF NOT EXISTS idx_infinity_items_type ON infinity_items(item_type);
CREATE INDEX IF NOT EXISTS idx_infinity_items_rarity ON infinity_items(item_rarity);
CREATE INDEX IF NOT EXISTS idx_infinity_items_active ON infinity_items(is_active);
CREATE INDEX IF NOT EXISTS idx_player_item_ownership_user ON player_item_ownership(user_id);
CREATE INDEX IF NOT EXISTS idx_player_item_ownership_item ON player_item_ownership(item_id);
CREATE INDEX IF NOT EXISTS idx_player_item_ownership_instance ON player_item_ownership(item_instance_id);
CREATE INDEX IF NOT EXISTS idx_player_item_ownership_equipped ON player_item_ownership(equipped);
CREATE INDEX IF NOT EXISTS idx_item_crafting_recipes_result ON item_crafting_recipes(result_item_id);
CREATE INDEX IF NOT EXISTS idx_item_crafting_recipes_active ON item_crafting_recipes(is_active);
CREATE INDEX IF NOT EXISTS idx_item_marketplace_seller ON item_marketplace(seller_id);
CREATE INDEX IF NOT EXISTS idx_item_marketplace_item ON item_marketplace(item_id);
CREATE INDEX IF NOT EXISTS idx_item_marketplace_status ON item_marketplace(listing_status);
CREATE INDEX IF NOT EXISTS idx_item_evolution_user ON item_evolution(user_id);
CREATE INDEX IF NOT EXISTS idx_item_evolution_instance ON item_evolution(item_instance_id);
CREATE INDEX IF NOT EXISTS idx_item_stats_user ON item_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_item_stats_item ON item_stats(item_id);
CREATE INDEX IF NOT EXISTS idx_item_social_validation_user ON item_social_validation(user_id);
CREATE INDEX IF NOT EXISTS idx_item_social_validation_validator ON item_social_validation(validator_id);
CREATE INDEX IF NOT EXISTS idx_item_anti_exploit_user ON item_anti_exploit_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_item_anti_exploit_type ON item_anti_exploit_tracking(exploit_type);
CREATE INDEX IF NOT EXISTS idx_item_analytics_date ON item_analytics(analytics_date);
CREATE INDEX IF NOT EXISTS idx_item_analytics_item ON item_analytics(item_id);
CREATE INDEX IF NOT EXISTS idx_item_capacity_planning_service ON item_capacity_planning(service_name);
CREATE INDEX IF NOT EXISTS idx_item_capacity_planning_urgency ON item_capacity_planning(urgency_level);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_infinity_items_updated_at BEFORE UPDATE ON infinity_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_item_crafting_recipes_updated_at BEFORE UPDATE ON item_crafting_recipes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_item_marketplace_updated_at BEFORE UPDATE ON item_marketplace FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_item_evolution_updated_at BEFORE UPDATE ON item_evolution FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_item_stats_updated_at BEFORE UPDATE ON item_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_item_capacity_planning_updated_at BEFORE UPDATE ON item_capacity_planning FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create views for comprehensive analytics
CREATE OR REPLACE VIEW item_summary_view AS
SELECT 
    ii.item_id,
    ii.item_name,
    ii.item_category,
    ii.item_type,
    ii.item_rarity,
    ii.item_quality,
    ii.economic_power,
    ii.governance_power,
    COUNT(pio.user_id) as total_owners,
    COUNT(pio.item_instance_id) as total_instances,
    AVG(pio.item_level) as avg_level,
    COUNT(im.listing_id) as marketplace_listings,
    AVG(im.price_influence) as avg_price_influence,
    COUNT(isv.validator_id) as total_validations,
    COUNT(iaet.user_id) as total_exploit_attempts
FROM infinity_items ii
LEFT JOIN player_item_ownership pio ON ii.item_id = pio.item_id
LEFT JOIN item_marketplace im ON ii.item_id = im.item_id
LEFT JOIN item_social_validation isv ON pio.item_instance_id = isv.item_instance_id
LEFT JOIN item_anti_exploit_tracking iaet ON pio.item_instance_id = iaet.item_instance_id
WHERE ii.is_active = true
GROUP BY ii.item_id, ii.item_name, ii.item_category, ii.item_type, ii.item_rarity, ii.item_quality, ii.economic_power, ii.governance_power
ORDER BY ii.economic_power DESC, ii.item_name ASC;

CREATE OR REPLACE VIEW user_item_summary_view AS
SELECT 
    pio.user_id,
    COUNT(*) as total_items,
    SUM(pio.quantity) as total_quantity,
    AVG(pio.item_level) as avg_level,
    COUNT(CASE WHEN ii.item_rarity = 'legendary' THEN 1 END) as legendary_items,
    COUNT(CASE WHEN ii.item_rarity = 'mythic' THEN 1 END) as mythic_items,
    COUNT(CASE WHEN ii.item_rarity = 'transcendent' THEN 1 END) as transcendent_items,
    SUM(ii.economic_power) as total_economic_power,
    SUM(ii.governance_power) as total_governance_power,
    COUNT(CASE WHEN pio.equipped = true THEN 1 END) as equipped_items,
    COUNT(isv.validator_id) as total_validations,
    COUNT(iaet.user_id) as total_exploit_attempts,
    MAX(pio.acquired_date) as latest_item_acquired
FROM player_item_ownership pio
JOIN infinity_items ii ON pio.item_id = ii.item_id
LEFT JOIN item_social_validation isv ON pio.item_instance_id = isv.item_instance_id
LEFT JOIN item_anti_exploit_tracking iaet ON pio.item_instance_id = iaet.item_instance_id
GROUP BY pio.user_id
ORDER BY total_economic_power DESC, total_governance_power DESC;

CREATE OR REPLACE VIEW item_analytics_view AS
SELECT 
    DATE_TRUNC('day', pio.acquired_date) as date,
    COUNT(*) as items_acquired,
    COUNT(DISTINCT pio.user_id) as unique_users,
    SUM(ii.economic_power) as total_economic_power,
    SUM(ii.governance_power) as total_governance_power,
    COUNT(CASE WHEN ii.item_rarity = 'legendary' THEN 1 END) as legendary_items,
    COUNT(CASE WHEN ii.item_rarity = 'mythic' THEN 1 END) as mythic_items,
    COUNT(CASE WHEN ii.item_rarity = 'transcendent' THEN 1 END) as transcendent_items,
    COUNT(im.listing_id) as marketplace_transactions,
    AVG(im.price_influence) as avg_price_influence,
    COUNT(isv.validator_id) as total_validations,
    COUNT(iaet.user_id) as total_exploit_attempts
FROM player_item_ownership pio
JOIN infinity_items ii ON pio.item_id = ii.item_id
LEFT JOIN item_marketplace im ON pio.item_instance_id = im.item_instance_id
LEFT JOIN item_social_validation isv ON pio.item_instance_id = isv.item_instance_id
LEFT JOIN item_anti_exploit_tracking iaet ON pio.item_instance_id = iaet.item_instance_id
GROUP BY DATE_TRUNC('day', pio.acquired_date)
ORDER BY date DESC;

-- Initialize item categories and types
INSERT INTO infinity_items (item_id, item_name, item_category, item_type, item_rarity, item_quality, item_binding, level_requirement, badge_requirement, economic_power, governance_power, visual_effects, properties, requirements) VALUES
-- Weapons
('weapon_sword_novice', 'Novice Sword', 'weapon', 'sword', 'common', 'common', 'bind_on_equip', 1, 'leadership_novice', 50, 5,
 '{"blade": "bronze", "hilt": "wood", "glow": "warm"}',
 '{"damage": 10, "speed": 1.0, "durability": 100}',
 '{"strength": 10, "dexterity": 5}'),

('weapon_sword_apprentice', 'Apprentice Sword', 'weapon', 'sword', 'uncommon', 'uncommon', 'bind_on_equip', 5, 'leadership_apprentice', 100, 10,
 '{"blade": "silver", "hilt": "leather", "glow": "cool"}',
 '{"damage": 20, "speed": 1.1, "durability": 150}',
 '{"strength": 20, "dexterity": 10}'),

('weapon_sword_journeyman', 'Journeyman Sword', 'weapon', 'sword', 'rare', 'rare', 'bind_on_equip', 10, 'leadership_journeyman', 200, 20,
 '{"blade": "gold", "hilt": "steel", "glow": "bright"}',
 '{"damage": 40, "speed": 1.2, "durability": 200}',
 '{"strength": 40, "dexterity": 20}'),

('weapon_sword_mentor', 'Mentor Sword', 'weapon', 'sword', 'epic', 'epic', 'bind_on_equip', 20, 'leadership_mentor', 400, 40,
 '{"blade": "platinum", "hilt": "mithril", "glow": "intense"}',
 '{"damage": 80, "speed": 1.3, "durability": 300}',
 '{"strength": 80, "dexterity": 40}'),

('weapon_sword_guide', 'Guide Sword', 'weapon', 'sword', 'legendary', 'legendary', 'bind_on_equip', 40, 'leadership_guide', 800, 80,
 '{"blade": "diamond", "hilt": "adamantite", "glow": "cosmic"}',
 '{"damage": 160, "speed": 1.4, "durability": 500}',
 '{"strength": 160, "dexterity": 80}'),

-- Armor
('armor_helmet_novice', 'Novice Helmet', 'armor', 'helmet', 'common', 'common', 'bind_on_equip', 1, 'rank_citizen', 30, 3,
 '{"material": "bronze", "visor": "open", "plume": "none"}',
 '{"defense": 5, "magic_resistance": 2, "durability": 100}',
 '{"constitution": 5, "wisdom": 2}'),

('armor_helmet_apprentice', 'Apprentice Helmet', 'armor', 'helmet', 'uncommon', 'uncommon', 'bind_on_equip', 5, 'rank_resident', 60, 6,
 '{"material": "iron", "visor": "closed", "plume": "blue"}',
 '{"defense": 10, "magic_resistance": 4, "durability": 150}',
 '{"constitution": 10, "wisdom": 4}'),

('armor_helmet_journeyman', 'Journeyman Helmet', 'armor', 'helmet', 'rare', 'rare', 'bind_on_equip', 10, 'rank_contributor', 120, 12,
 '{"material": "steel", "visor": "enchanted", "plume": "red"}',
 '{"defense": 20, "magic_resistance": 8, "durability": 200}',
 '{"constitution": 20, "wisdom": 8}'),

('armor_helmet_mentor', 'Mentor Helmet', 'armor', 'helmet', 'epic', 'epic', 'bind_on_equip', 20, 'rank_innovator', 240, 24,
 '{"material": "mithril", "visor": "magical", "plume": "purple"}',
 '{"defense": 40, "magic_resistance": 16, "durability": 300}',
 '{"constitution": 40, "wisdom": 16}'),

('armor_helmet_guide', 'Guide Helmet', 'armor', 'helmet', 'legendary', 'legendary', 'bind_on_equip', 40, 'rank_pioneer', 480, 48,
 '{"material": "adamantite", "visor": "divine", "plume": "gold"}',
 '{"defense": 80, "magic_resistance": 32, "durability": 500}',
 '{"constitution": 80, "wisdom": 32}'),

-- Tools
('tool_crafting_hammer', 'Crafting Hammer', 'tool', 'hammer', 'common', 'common', 'bind_on_pickup', 1, 'organizer_community_builder', 40, 4,
 '{"head": "bronze", "handle": "wood", "grip": "leather"}',
 '{"crafting_speed": 1.1, "success_rate": 1.05, "durability": 100}',
 '{"crafting": 10, "strength": 5}'),

('tool_crafting_hammer_advanced', 'Advanced Crafting Hammer', 'tool', 'hammer', 'uncommon', 'uncommon', 'bind_on_pickup', 10, 'organizer_event_organizer', 80, 8,
 '{"head": "steel", "handle": "oak", "grip": "enchanted"}',
 '{"crafting_speed": 1.2, "success_rate": 1.1, "durability": 150}',
 '{"crafting": 20, "strength": 10}'),

('tool_crafting_hammer_master', 'Master Crafting Hammer', 'tool', 'hammer', 'rare', 'rare', 'bind_on_pickup', 20, 'organizer_tournament_manager', 160, 16,
 '{"head": "mithril", "handle": "ebony", "grip": "magical"}',
 '{"crafting_speed": 1.3, "success_rate": 1.15, "durability": 200}',
 '{"crafting": 40, "strength": 20}'),

('tool_crafting_hammer_grandmaster', 'Grandmaster Crafting Hammer', 'tool', 'hammer', 'epic', 'epic', 'bind_on_pickup', 40, 'organizer_mentor_coordinator', 320, 32,
 '{"head": "adamantite", "handle": "obsidian", "grip": "divine"}',
 '{"crafting_speed": 1.4, "success_rate": 1.2, "durability": 300}',
 '{"crafting": 80, "strength": 40}'),

-- Consumables
('consumable_health_potion', 'Health Potion', 'consumable', 'potion', 'common', 'common', 'none', 1, null, 10, 1,
 '{"color": "red", "bottle": "glass", "glow": "faint"}',
 '{"healing": 50, "effect_duration": 0, "stack_size": 10}',
 '{"alchemy": 1}'),

('consumable_mana_potion', 'Mana Potion', 'consumable', 'potion', 'common', 'common', 'none', 1, null, 10, 1,
 '{"color": "blue", "bottle": "glass", "glow": "faint"}',
 '{"mana_restore": 50, "effect_duration": 0, "stack_size": 10}',
 '{"alchemy": 1}'),

('consumable_strength_potion', 'Strength Potion', 'consumable', 'potion', 'uncommon', 'uncommon', 'none', 5, null, 25, 2,
 '{"color": "orange", "bottle": "crystal", "glow": "moderate"}',
 '{"strength_bonus": 10, "effect_duration": 300, "stack_size": 5}',
 '{"alchemy": 5}'),

('consumable_wisdom_potion', 'Wisdom Potion', 'consumable', 'potion', 'uncommon', 'uncommon', 'none', 5, null, 25, 2,
 '{"color": "purple", "bottle": "crystal", "glow": "moderate"}',
 '{"wisdom_bonus": 10, "effect_duration": 300, "stack_size": 5}',
 '{"alchemy": 5}'),

-- Materials
('material_iron_ore', 'Iron Ore', 'material', 'ore', 'common', 'common', 'none', 1, null, 5, 0,
 '{"color": "gray", "texture": "rough", "glow": "none"}',
 '{"crafting_value": 10, "smelting_time": 60, "stack_size": 50}',
 '{"mining": 1}'),

('material_gold_ore', 'Gold Ore', 'material', 'ore', 'uncommon', 'uncommon', 'none', 5, null, 15, 1,
 '{"color": "gold", "texture": "shiny", "glow": "faint"}',
 '{"crafting_value": 25, "smelting_time": 90, "stack_size": 25}',
 '{"mining": 5}'),

('material_mithril_ore', 'Mithril Ore', 'material', 'ore', 'rare', 'rare', 'none', 10, null, 40, 3,
 '{"color": "silver", "texture": "smooth", "glow": "moderate"}',
 '{"crafting_value": 50, "smelting_time": 120, "stack_size": 10}',
 '{"mining": 10}'),

('material_adamantite_ore', 'Adamantite Ore', 'material', 'ore', 'epic', 'epic', 'none', 20, null, 80, 6,
 '{"color": "black", "texture": "metallic", "glow": "intense"}',
 '{"crafting_value": 100, "smelting_time": 180, "stack_size": 5}',
 '{"mining": 20}'),

-- Artifacts
('artifact_crown_of_wisdom', 'Crown of Wisdom', 'artifact', 'crown', 'legendary', 'legendary', 'bind_on_equip', 50, 'governance_legend', 1000, 100,
 '{"material": "gold", "gems": "diamond", "glow": "divine"}',
 '{"wisdom": 50, "intelligence": 50, "governance_power": 100}',
 '{"wisdom": 50, "intelligence": 50, "leadership": 25}'),

('artifact_scepter_of_power', 'Scepter of Power', 'artifact', 'scepter', 'legendary', 'legendary', 'bind_on_equip', 50, 'governance_legend', 1000, 100,
 '{"material": "platinum", "gems": "ruby", "glow": "divine"}',
 '{"power": 100, "leadership": 50, "governance_power": 100}',
 '{"power": 100, "leadership": 50, "charisma": 25}'),

-- Relics
('relic_ancient_tablet', 'Ancient Tablet', 'relic', 'tablet', 'mythic', 'mythic', 'bind_on_pickup', 60, 'profile_expert', 2000, 200,
 '{"material": "stone", "runes": "glowing", "glow": "ancient"}',
 '{"knowledge": 100, "experience_bonus": 1.5, "governance_power": 200}',
 '{"knowledge": 100, "wisdom": 50, "intelligence": 50}'),

-- Treasures
('treasure_dragon_egg', 'Dragon Egg', 'treasure', 'egg', 'transcendent', 'transcendent', 'account_bound', 100, 'profile_expert', 5000, 500,
 '{"shell": "crystal", "core": "glowing", "glow": "cosmic"}',
 '{"mystery": 1000, "potential": 1000, "governance_power": 500}',
 '{"mystery": 1000, "potential": 1000, "destiny": 100}'),

-- Cosmetics
('cosmetic_rainbow_cape', 'Rainbow Cape', 'cosmetic', 'cape', 'rare', 'rare', 'account_bound', 1, null, 100, 10,
 '{"colors": "rainbow", "material": "silk", "glow": "shimmer"}',
 '{"appearance_only": true, "visual_effect": "rainbow_trail"}',
 '{"style": 100, "creativity": 50}'),

('cosmetic_phoenix_wings', 'Phoenix Wings', 'cosmetic', 'wings', 'legendary', 'legendary', 'account_bound', 50, 'profile_expert', 500, 50,
 '{"colors": "fire", "material": "ethereal", "glow": "intense"}',
 '{"appearance_only": true, "visual_effect": "fire_trail"}',
 '{"style": 500, "creativity": 250}'),

-- Special items
('special_infinity_key', 'Infinity Key', 'special', 'key', 'transcendent', 'transcendent', 'account_bound', 100, 'profile_expert', 10000, 1000,
 '{"material": "crystal", "shape": "infinity", "glow": "cosmic"}',
 '{"unlock_potential": 10000, "mastery": 1000, "governance_power": 1000}',
 '{"infinity": 10000, "mastery": 1000, "destiny": 1000}')
ON CONFLICT (item_id) DO NOTHING;

-- Initialize crafting recipes
INSERT INTO item_crafting_recipes (recipe_id, recipe_name, result_item_id, result_quantity, crafting_level_requirement, badge_requirement, crafting_cost, crafting_time_minutes, success_rate, materials_required, tools_required) VALUES
('craft_sword_novice', 'Novice Sword Crafting', 'weapon_sword_novice', 1, 1, 'organizer_community_builder', 100, 10, 95.0,
 '{"iron_ore": 5, "wood": 2}',
 '{"tool_crafting_hammer": 1}'),

('craft_sword_apprentice', 'Apprentice Sword Crafting', 'weapon_sword_apprentice', 1, 5, 'organizer_event_organizer', 250, 20, 90.0,
 '{"iron_ore": 10, "leather": 2}',
 '{"tool_crafting_hammer_advanced": 1}'),

('craft_sword_journeyman', 'Journeyman Sword Crafting', 'weapon_sword_journeyman', 1, 10, 'organizer_tournament_manager', 500, 30, 85.0,
 '{"steel_ingot": 5, "leather": 3}',
 '{"tool_crafting_hammer_master": 1}'),

('craft_sword_mentor', 'Mentor Sword Crafting', 'weapon_sword_mentor', 1, 20, 'organizer_mentor_coordinator', 1000, 60, 80.0,
 '{"mithril_ingot": 3, "enchanted_leather": 2}',
 '{"tool_crafting_hammer_grandmaster": 1}'),

('craft_health_potion', 'Health Potion Brewing', 'consumable_health_potion', 3, 1, null, 50, 5, 98.0,
 '{"herbs": 2, "water": 1}',
 '{"tool_alchemy_kit": 1}'),

('craft_mana_potion', 'Mana Potion Brewing', 'consumable_mana_potion', 3, 1, null, 50, 5, 98.0,
 '{"magic_herbs": 2, "water": 1}',
 '{"tool_alchemy_kit": 1}'),

('craft_strength_potion', 'Strength Potion Brewing', 'consumable_strength_potion', 1, 5, null, 200, 15, 85.0,
 '{"rare_herbs": 3, "fire_essence": 1}',
 '{"tool_advanced_alchemy_kit": 1}'),

('craft_wisdom_potion', 'Wisdom Potion Brewing', 'consumable_wisdom_potion', 1, 5, null, 200, 15, 85.0,
 '{"wisdom_herbs": 3, "mind_essence": 1}',
 '{"tool_advanced_alchemy_kit": 1}')
ON CONFLICT (recipe_id) DO NOTHING;

-- Initialize capacity planning
INSERT INTO item_capacity_planning (service_name, current_capacity, projected_capacity, required_capacity, urgency_level, estimated_cost, timeline_months, action_required) VALUES
('item_minting', 500000, 750000, 1000000, 'high', 250000, 4, 'Increase item minting capacity to handle 900M users'),
('item_crafting', 250000, 375000, 500000, 'medium', 150000, 3, 'Upgrade crafting system for high-volume production'),
('item_marketplace', 100000, 150000, 200000, 'medium', 100000, 3, 'Enhance marketplace for item trading'),
('item_evolution', 50000, 75000, 100000, 'low', 75000, 2, 'Improve item evolution system'),
('item_analytics', 25000, 37500, 50000, 'low', 50000, 2, 'Enhance analytics for item tracking'),
('item_anti_exploit', 15000, 22500, 30000, 'high', 100000, 3, 'Strengthen anti-exploit detection for items')
ON CONFLICT DO NOTHING;
