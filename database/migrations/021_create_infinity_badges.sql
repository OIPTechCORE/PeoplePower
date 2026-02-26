-- Infinity Badges Database Schema
-- Complete badge system for 900M users with economic power and governance rights

-- Badge categories and types
CREATE TYPE BadgeCategory AS ENUM (
  'achievement',
  'leadership',
  'organizer',
  'rank',
  'profile',
  'social',
  'economic',
  'governance',
  'special',
  'seasonal',
  'legendary',
  'mythic',
  'transcendent'
);

-- Badge rarity levels
CREATE TYPE BadgeRarity AS ENUM (
  'common',
  'uncommon',
  'rare',
  'epic',
  'legendary',
  'mythic',
  'transcendent'
);

-- Leadership levels
CREATE TYPE LeadershipLevel AS ENUM (
  'novice',
  'apprentice',
  'journeyman',
  'mentor',
  'guide',
  'leader',
  'master',
  'grandmaster',
  'legendary',
  'mythic',
  'transcendent'
);

-- Organizer types
CREATE TYPE OrganizerType AS ENUM (
  'community_builder',
  'event_organizer',
  'tournament_manager',
  'mentor_coordinator',
  'content_creator',
  'moderator',
  'administrator',
  'governance_member',
  'infrastructure_builder',
  'cultural_ambassador',
  'economic_stabilizer'
);

-- Rank tiers
CREATE TYPE RankTier AS ENUM (
  'citizen',
  'resident',
  'contributor',
  'innovator',
  'pioneer',
  'visionary',
  'builder',
  'creator',
  'master_builder',
  'grand_master',
  'legendary',
  'mythic',
  'transcendent'
);

-- Profile types
CREATE TYPE ProfileType AS ENUM (
  'novice',
  'explorer',
  'achiever',
  'specialist',
  'expert',
  'master',
  'veteran',
  'grand_master',
  'influencer',
  'icon',
  'legendary',
  'mythic',
  'transcendent'
);

-- Badge definitions and requirements
CREATE TABLE IF NOT EXISTS infinity_badges (
    id SERIAL PRIMARY KEY,
    badge_id VARCHAR(100) UNIQUE NOT NULL,
    badge_name VARCHAR(255) NOT NULL,
    badge_category BadgeCategory NOT NULL,
    badge_rarity BadgeRarity DEFAULT 'common',
    economic_multiplier DECIMAL(5,2) DEFAULT 1.0,
    governance_power INTEGER DEFAULT 0,
    visual_effects JSONB,
    requirements JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Badge ownership and progression
CREATE TABLE IF NOT EXISTS player_badge_ownership (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    badge_id VARCHAR(100) REFERENCES infinity_badges(badge_id),
    badge_level INTEGER DEFAULT 1,
    progress_percentage INTEGER DEFAULT 0,
    earned_date TIMESTAMP DEFAULT NOW(),
    last_used TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Badge economic power tracking
CREATE TABLE IF NOT EXISTS badge_economic_power (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    badge_id VARCHAR(100) REFERENCES infinity_badges(badge_id),
    economic_power INTEGER DEFAULT 0,
    governance_power INTEGER DEFAULT 0,
    daily_earnings BIGINT DEFAULT 0,
    total_earnings BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Badge visual evolution
CREATE TABLE IF NOT EXISTS badge_visual_evolution (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    badge_id VARCHAR(100) REFERENCES infinity_badges(badge_id),
    visual_state JSONB,
    evolution_history JSONB,
    current_level INTEGER DEFAULT 1,
    evolution_count INTEGER DEFAULT 0,
    last_evolution TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Leadership badges
CREATE TABLE IF NOT EXISTS infinity_leadership_badges (
    id SERIAL PRIMARY KEY,
    badge_id VARCHAR(100) REFERENCES infinity_badges(badge_id),
    leadership_level LeadershipLevel NOT NULL,
    requirements JSONB,
    economic_power INTEGER DEFAULT 0,
    governance_power INTEGER DEFAULT 0,
    visual_effects JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Organizer badges
CREATE TABLE IF NOT EXISTS infinity_organizer_badges (
    id SERIAL PRIMARY KEY,
    badge_id VARCHAR(100) REFERENCES infinity_badges(badge_id),
    organizer_type OrganizerType NOT NULL,
    requirements JSONB,
    economic_power INTEGER DEFAULT 0,
    governance_power INTEGER DEFAULT 0,
    visual_effects JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Rank badges
CREATE TABLE IF NOT EXISTS infinity_rank_badges (
    id SERIAL PRIMARY KEY,
    badge_id VARCHAR(100) REFERENCES infinity_badges(badge_id),
    rank_tier RankTier NOT NULL,
    requirements JSONB,
    economic_power INTEGER DEFAULT 0,
    governance_power INTEGER DEFAULT 0,
    visual_effects JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Profile badges
CREATE TABLE IF NOT EXISTS infinity_profile_badges (
    id SERIAL PRIMARY KEY,
    badge_id VARCHAR(100) REFERENCES infinity_badges(badge_id),
    profile_type ProfileType NOT NULL,
    requirements JSONB,
    economic_power INTEGER DEFAULT 0,
    governance_power INTEGER DEFAULT 0,
    visual_effects JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Badge social validation
CREATE TABLE IF NOT EXISTS badge_social_validation (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    badge_id VARCHAR(100) REFERENCES infinity_badges(badge_id),
    validator_id VARCHAR(50) NOT NULL,
    validation_weight DECIMAL(5,4) DEFAULT 0.0,
    validation_type VARCHAR(50) NOT NULL, -- endorsement, recommendation, verification
    validation_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, badge_id, validator_id)
);

-- Badge anti-exploit tracking
CREATE TABLE IF NOT EXISTS badge_anti_exploit_tracking (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    badge_id VARCHAR(100) REFERENCES infinity_badges(badge_id),
    exploit_type VARCHAR(50) NOT NULL, -- collusion, bot, fake_account, rapid_growth
    exploit_severity VARCHAR(20) DEFAULT 'low', -- low, medium, high, critical
    exploit_data JSONB,
    detected_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending', -- pending, investigating, resolved, dismissed
    created_at TIMESTAMP DEFAULT NOW()
);

-- Badge analytics
CREATE TABLE IF NOT EXISTS badge_analytics (
    id SERIAL PRIMARY KEY,
    badge_id VARCHAR(100) REFERENCES infinity_badges(badge_id),
    analytics_date DATE NOT NULL,
    total_issued INTEGER DEFAULT 0,
    total_upgraded INTEGER DEFAULT 0,
    economic_power_generated BIGINT DEFAULT 0,
    governance_power_generated INTEGER DEFAULT 0,
    social_validations INTEGER DEFAULT 0,
    exploit_attempts INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(badge_id, analytics_date)
);

-- Badge capacity planning
CREATE TABLE IF NOT EXISTS badge_capacity_planning (
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
CREATE INDEX IF NOT EXISTS idx_infinity_badges_category ON infinity_badges(badge_category);
CREATE INDEX IF NOT EXISTS idx_infinity_badges_rarity ON infinity_badges(badge_rarity);
CREATE INDEX IF NOT EXISTS idx_infinity_badges_active ON infinity_badges(is_active);
CREATE INDEX IF NOT EXISTS idx_player_badge_ownership_user ON player_badge_ownership(user_id);
CREATE INDEX IF NOT EXISTS idx_player_badge_ownership_badge ON player_badge_ownership(badge_id);
CREATE INDEX IF NOT EXISTS idx_player_badge_ownership_earned ON player_badge_ownership(earned_date);
CREATE INDEX IF NOT EXISTS idx_badge_economic_power_user ON badge_economic_power(user_id);
CREATE INDEX IF NOT EXISTS idx_badge_economic_power_badge ON badge_economic_power(badge_id);
CREATE INDEX IF NOT EXISTS idx_badge_visual_evolution_user ON badge_visual_evolution(user_id);
CREATE INDEX IF NOT EXISTS idx_badge_visual_evolution_badge ON badge_visual_evolution(badge_id);
CREATE INDEX IF NOT EXISTS idx_badge_social_validation_user ON badge_social_validation(user_id);
CREATE INDEX IF NOT EXISTS idx_badge_social_validation_validator ON badge_social_validation(validator_id);
CREATE INDEX IF NOT EXISTS idx_badge_anti_exploit_user ON badge_anti_exploit_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_badge_anti_exploit_type ON badge_anti_exploit_tracking(exploit_type);
CREATE INDEX IF NOT EXISTS idx_badge_analytics_date ON badge_analytics(analytics_date);
CREATE INDEX IF NOT EXISTS idx_badge_analytics_badge ON badge_analytics(badge_id);
CREATE INDEX IF NOT EXISTS idx_badge_capacity_planning_service ON badge_capacity_planning(service_name);
CREATE INDEX IF NOT EXISTS idx_badge_capacity_planning_urgency ON badge_capacity_planning(urgency_level);

-- Create triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_infinity_badges_updated_at BEFORE UPDATE ON infinity_badges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_badge_economic_power_updated_at BEFORE UPDATE ON badge_economic_power FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_badge_visual_evolution_updated_at BEFORE UPDATE ON badge_visual_evolution FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_infinity_leadership_badges_updated_at BEFORE UPDATE ON infinity_leadership_badges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_infinity_organizer_badges_updated_at BEFORE UPDATE ON infinity_organizer_badges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_infinity_rank_badges_updated_at BEFORE UPDATE ON infinity_rank_badges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_infinity_profile_badges_updated_at BEFORE UPDATE ON infinity_profile_badges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_badge_capacity_planning_updated_at BEFORE UPDATE ON badge_capacity_planning FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create views for comprehensive analytics
CREATE OR REPLACE VIEW badge_summary_view AS
SELECT 
    ib.badge_id,
    ib.badge_name,
    ib.badge_category,
    ib.badge_rarity,
    ib.economic_multiplier,
    ib.governance_power,
    COUNT(pbo.user_id) as total_owners,
    AVG(pbo.badge_level) as avg_level,
    SUM(be.economic_power) as total_economic_power,
    SUM(bg.governance_power) as total_governance_power,
    COUNT(bsv.validator_id) as total_validations,
    COUNT(baet.user_id) as total_exploit_attempts
FROM infinity_badges ib
LEFT JOIN player_badge_ownership pbo ON ib.badge_id = pbo.badge_id
LEFT JOIN badge_economic_power be ON ib.badge_id = be.badge_id
LEFT JOIN badge_governance bg ON ib.badge_id = bg.badge_id
LEFT JOIN badge_social_validation bsv ON ib.badge_id = bsv.badge_id
LEFT JOIN badge_anti_exploit_tracking baet ON ib.badge_id = baet.badge_id
WHERE ib.is_active = true
GROUP BY ib.badge_id, ib.badge_name, ib.badge_category, ib.badge_rarity, ib.economic_multiplier, ib.governance_power
ORDER BY ib.economic_multiplier DESC, ib.badge_name ASC;

CREATE OR REPLACE VIEW user_badge_summary_view AS
SELECT 
    pbo.user_id,
    COUNT(*) as total_badges,
    SUM(pbo.badge_level) as total_levels,
    AVG(pbo.progress_percentage) as avg_progress,
    SUM(be.economic_power) as total_economic_power,
    SUM(bg.governance_power) as total_governance_power,
    COUNT(CASE WHEN ib.badge_rarity = 'legendary' THEN 1 END) as legendary_badges,
    COUNT(CASE WHEN ib.badge_rarity = 'mythic' THEN 1 END) as mythic_badges,
    COUNT(CASE WHEN ib.badge_rarity = 'transcendent' THEN 1 END) as transcendent_badges,
    COUNT(bsv.validator_id) as total_validations,
    COUNT(baet.user_id) as total_exploit_attempts,
    MAX(pbo.earned_date) as latest_badge_earned
FROM player_badge_ownership pbo
JOIN infinity_badges ib ON pbo.badge_id = ib.badge_id
LEFT JOIN badge_economic_power be ON pbo.badge_id = be.badge_id AND pbo.user_id = be.user_id
LEFT JOIN badge_governance bg ON pbo.badge_id = bg.badge_id AND pbo.user_id = bg.user_id
LEFT JOIN badge_social_validation bsv ON pbo.badge_id = bsv.badge_id AND pbo.user_id = bsv.user_id
LEFT JOIN badge_anti_exploit_tracking baet ON pbo.badge_id = baet.badge_id AND pbo.user_id = baet.user_id
GROUP BY pbo.user_id
ORDER BY total_economic_power DESC, total_governance_power DESC;

CREATE OR REPLACE VIEW badge_analytics_view AS
SELECT 
    DATE_TRUNC('day', pbo.earned_date) as date,
    COUNT(*) as badges_issued,
    COUNT(DISTINCT pbo.user_id) as unique_users,
    SUM(be.economic_power) as total_economic_power,
    SUM(bg.governance_power) as total_governance_power,
    COUNT(CASE WHEN ib.badge_rarity = 'legendary' THEN 1 END) as legendary_badges,
    COUNT(CASE WHEN ib.badge_rarity = 'mythic' THEN 1 END) as mythic_badges,
    COUNT(CASE WHEN ib.badge_rarity = 'transcendent' THEN 1 END) as transcendent_badges,
    COUNT(bsv.validator_id) as total_validations,
    COUNT(baet.user_id) as total_exploit_attempts
FROM player_badge_ownership pbo
JOIN infinity_badges ib ON pbo.badge_id = ib.badge_id
LEFT JOIN badge_economic_power be ON pbo.badge_id = be.badge_id AND pbo.user_id = be.user_id
LEFT JOIN badge_governance bg ON pbo.badge_id = bg.badge_id AND pbo.user_id = bg.user_id
LEFT JOIN badge_social_validation bsv ON pbo.badge_id = bsv.badge_id AND pbo.user_id = bsv.user_id
LEFT JOIN badge_anti_exploit_tracking baet ON pbo.badge_id = baet.badge_id AND pbo.user_id = baet.user_id
GROUP BY DATE_TRUNC('day', pbo.earned_date)
ORDER BY date DESC;

-- Initialize badge categories and types
INSERT INTO infinity_badges (badge_id, badge_name, badge_category, badge_rarity, economic_multiplier, governance_power, requirements, visual_effects) VALUES
-- Leadership badges
('leadership_novice', 'Novice Leader', 'leadership', 'common', 1.2, 10, 
 '{"reputationScore": 100, "mentorshipHours": 5, "communityImpact": 50}',
 '{"aura": "bronze", "symbol": "star", "glow": "warm"}'),
('leadership_apprentice', 'Apprentice Leader', 'leadership', 'uncommon', 1.4, 25,
 '{"reputationScore": 250, "mentorshipHours": 15, "communityImpact": 150}',
 '{"aura": "silver", "symbol": "crown", "glow": "cool"}'),
('leadership_journeyman', 'Journeyman Leader', 'leadership', 'rare', 1.6, 50,
 '{"reputationScore": 500, "mentorshipHours": 30, "communityImpact": 300}',
 '{"aura": "gold", "symbol": "crown", "glow": "bright"}'),
('leadership_mentor', 'Mentor Leader', 'leadership', 'epic', 1.8, 100,
 '{"reputationScore": 1000, "mentorshipHours": 60, "communityImpact": 600}',
 '{"aura": "platinum", "symbol": "gem", "glow": "intense"}'),
('leadership_guide', 'Guide Leader', 'leadership', 'legendary', 2.0, 200,
 '{"reputationScore": 2000, "mentorshipHours": 120, "communityImpact": 1200}',
 '{"aura": "diamond", "symbol": "infinity", "glow": "cosmic"}'),

-- Organizer badges
('organizer_community_builder', 'Community Builder', 'organizer', 'common', 1.2, 15,
 '{"eventsOrganized": 5, "participantsServed": 50, "communityImpact": 100}',
 '{"aura": "community", "symbol": "house", "glow": "warm"}'),
('organizer_event_organizer', 'Event Organizer', 'organizer', 'uncommon', 1.4, 30,
 '{"eventsOrganized": 10, "participantsServed": 200, "communityImpact": 400}',
 '{"aura": "event", "symbol": "calendar", "glow": "cool"}'),
('organizer_tournament_manager', 'Tournament Manager', 'organizer', 'rare', 1.6, 60,
 '{"eventsOrganized": 20, "participantsServed": 500, "communityImpact": 800}',
 '{"aura": "tournament", "symbol": "trophy", "glow": "bright"}'),
('organizer_mentor_coordinator', 'Mentor Coordinator', 'organizer', 'epic', 1.8, 120,
 '{"eventsOrganized": 40, "participantsServed": 1000, "communityImpact": 1600}',
 '{"aura": "mentor", "symbol": "graduation", "glow": "intense"}'),
('organizer_content_creator', 'Content Creator', 'organizer', 'legendary', 2.0, 240,
 '{"eventsOrganized": 80, "participantsServed": 2000, "communityImpact": 3200}',
 '{"aura": "content", "symbol": "video", "glow": "cosmic"}'),

-- Rank badges
('rank_citizen', 'Citizen', 'rank', 'common', 1.1, 5,
 '{"reputationScore": 50, "contributionsCount": 10, "communityImpact": 25}',
 '{"frame": "bronze", "symbol": "star", "glow": "warm"}'),
('rank_resident', 'Resident', 'rank', 'uncommon', 1.3, 15,
 '{"reputationScore": 150, "contributionsCount": 30, "communityImpact": 75}',
 '{"frame": "silver", "symbol": "star", "glow": "cool"}'),
('rank_contributor', 'Contributor', 'rank', 'rare', 1.5, 35,
 '{"reputationScore": 300, "contributionsCount": 60, "communityImpact": 150}',
 '{"frame": "gold", "symbol": "star", "glow": "bright"}'),
('rank_innovator', 'Innovator', 'rank', 'epic', 1.7, 70,
 '{"reputationScore": 600, "contributionsCount": 120, "communityImpact": 300}',
 '{"frame": "platinum", "symbol": "star", "glow": "intense"}'),
('rank_pioneer', 'Pioneer', 'rank', 'legendary', 1.9, 140,
 '{"reputationScore": 1200, "contributionsCount": 240, "communityImpact": 600}',
 '{"frame": "diamond", "symbol": "star", "glow": "cosmic"}'),

-- Profile badges
('profile_novice', 'Novice', 'profile', 'common', 1.1, 8,
 '{"reputationScore": 75, "specializationAreas": 1, "expertiseLevel": 1}',
 '{"aura": "professional", "symbol": "badge", "glow": "warm"}'),
('profile_explorer', 'Explorer', 'profile', 'uncommon', 1.3, 20,
 '{"reputationScore": 200, "specializationAreas": 2, "expertiseLevel": 2}',
 '{"aura": "professional", "symbol": "compass", "glow": "cool"}'),
('profile_achiever', 'Achiever', 'profile', 'rare', 1.5, 45,
 '{"reputationScore": 400, "specializationAreas": 3, "expertiseLevel": 3}',
 '{"aura": "professional", "symbol": "trophy", "glow": "bright"}'),
('profile_specialist', 'Specialist', 'profile', 'epic', 1.7, 90,
 '{"reputationScore": 800, "specializationAreas": 4, "expertiseLevel": 4}',
 '{"aura": "professional", "symbol": "star", "glow": "intense"}'),
('profile_expert', 'Expert', 'profile', 'legendary', 1.9, 180,
 '{"reputationScore": 1600, "specializationAreas": 5, "expertiseLevel": 5}',
 '{"aura": "professional", "symbol": "crown", "glow": "cosmic"}'),

-- Economic badges
('economic_trader', 'Trader', 'economic', 'common', 1.2, 12,
 '{"economicActivity": 1000, "transactionsCount": 50, "profitGenerated": 500}',
 '{"aura": "economic", "symbol": "coins", "glow": "warm"}'),
('economic_merchant', 'Merchant', 'economic', 'uncommon', 1.4, 30,
 '{"economicActivity": 5000, "transactionsCount": 150, "profitGenerated": 2500}',
 '{"aura": "economic", "symbol": "store", "glow": "cool"}'),
('economic_trader_elite', 'Elite Trader', 'economic', 'rare', 1.6, 60,
 '{"economicActivity": 10000, "transactionsCount": 300, "profitGenerated": 5000}',
 '{"aura": "economic", "symbol": "diamond", "glow": "bright"}'),
('economic_merchant_master', 'Master Merchant', 'economic', 'epic', 1.8, 120,
 '{"economicActivity": 50000, "transactionsCount": 600, "profitGenerated": 25000}',
 '{"aura": "economic", "symbol": "crown", "glow": "intense"}'),
('economic_trader_legend', 'Trader Legend', 'economic', 'legendary', 2.0, 240,
 '{"economicActivity": 100000, "transactionsCount": 1200, "profitGenerated": 50000}',
 '{"aura": "economic", "symbol": "infinity", "glow": "cosmic"}'),

-- Governance badges
('governance_participant', 'Governance Participant', 'governance', 'common', 1.1, 10,
 '{"governanceParticipation": 10, "votingAccuracy": 0.8, "proposalSuccess": 5}',
 '{"aura": "governance", "symbol": "vote", "glow": "warm"}'),
('governance_council_member', 'Council Member', 'governance', 'uncommon', 1.3, 25,
 '{"governanceParticipation": 25, "votingAccuracy": 0.85, "proposalSuccess": 15}',
 '{"aura": "governance", "symbol": "gavel", "glow": "cool"}'),
('governance_leader', 'Governance Leader', 'governance', 'rare', 1.5, 50,
 '{"governanceParticipation": 50, "votingAccuracy": 0.9, "proposalSuccess": 30}',
 '{"aura": "governance", "symbol": "crown", "glow": "bright"}'),
('governance_master', 'Governance Master', 'governance', 'epic', 1.7, 100,
 '{"governanceParticipation": 100, "votingAccuracy": 0.95, "proposalSuccess": 60}',
 '{"aura": "governance", "symbol": "scepter", "glow": "intense"}'),
('governance_legend', 'Governance Legend', 'governance', 'legendary', 1.9, 200,
 '{"governanceParticipation": 200, "votingAccuracy": 0.98, "proposalSuccess": 120}',
 '{"aura": "governance", "symbol": "throne", "glow": "cosmic"}')
ON CONFLICT (badge_id) DO NOTHING;

-- Initialize capacity planning
INSERT INTO badge_capacity_planning (service_name, current_capacity, projected_capacity, required_capacity, urgency_level, estimated_cost, timeline_months, action_required) VALUES
('badge_minting', 1000000, 1500000, 2000000, 'high', 500000, 6, 'Increase badge minting capacity to handle 900M users'),
('badge_validation', 500000, 750000, 1000000, 'medium', 250000, 4, 'Upgrade validation system for social proof'),
('badge_analytics', 100000, 150000, 200000, 'low', 100000, 3, 'Enhance analytics for badge tracking'),
('badge_visual_evolution', 50000, 75000, 100000, 'medium', 200000, 5, 'Improve visual evolution rendering'),
('badge_anti_exploit', 25000, 37500, 50000, 'high', 150000, 4, 'Strengthen anti-exploit detection'),
('badge_governance', 10000, 15000, 20000, 'medium', 75000, 3, 'Enhance governance power calculation')
ON CONFLICT DO NOTHING;
