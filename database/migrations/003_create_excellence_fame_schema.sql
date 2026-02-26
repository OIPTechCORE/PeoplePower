-- ========================================
-- PEOPLE POWER CENTER OF EXCELLENCE & WALL OF FAME SCHEMA
-- Migration: 003_create_excellence_fame_schema.sql
-- Description: Creates tables for Center of Excellence and Wall of Fame systems
-- ========================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- CENTER OF EXCELLENCE TABLES
-- ========================================

-- People Power Center of Excellence main table
CREATE TABLE IF NOT EXISTS people_power_center_of_excellence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    established_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_academies INTEGER DEFAULT 0,
    total_graduates INTEGER DEFAULT 0,
    active_students INTEGER DEFAULT 0,
    version VARCHAR(50) DEFAULT '1.0'
);

-- Academies
CREATE TABLE IF NOT EXISTS academies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    center_of_excellence_id UUID REFERENCES people_power_center_of_excellence(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    requirements JSONB,
    rewards JSONB,
    courses JSONB,
    graduates INTEGER DEFAULT 0,
    active_students INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0,
    established_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(center_of_excellence_id, name)
);

-- Academy Courses
CREATE TABLE IF NOT EXISTS academy_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    academy_id UUID REFERENCES academies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL, -- in hours
    difficulty VARCHAR(50) NOT NULL,
    skills JSONB,
    earning_power INTEGER DEFAULT 0,
    prerequisites TEXT[],
    completion_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Innovation Labs
CREATE TABLE IF NOT EXISTS innovation_labs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    center_of_excellence_id UUID REFERENCES people_power_center_of_excellence(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    focus_area VARCHAR(100) NOT NULL,
    player_submissions JSONB,
    approved_innovations JSONB,
    revenue_sharing JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    established_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(center_of_excellence_id, name)
);

-- AI Mentorship Systems
CREATE TABLE IF NOT EXISTS ai_mentorship_systems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    center_of_excellence_id UUID REFERENCES people_power_center_of_excellence(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    ai_coaches JSONB,
    skill_paths JSONB,
    personalized_missions JSONB,
    earning_connections JSONB,
    player_progress JSONB,
    established_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(center_of_excellence_id, name)
);

-- AI Coaches
CREATE TABLE IF NOT EXISTS ai_coaches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentorship_system_id UUID REFERENCES ai_mentorship_systems(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    personality_type VARCHAR(50) NOT NULL,
    teaching_style VARCHAR(50) NOT NULL,
    capabilities JSONB,
    use_cases TEXT[],
    effectiveness INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skill Paths
CREATE TABLE IF NOT EXISTS skill_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentorship_system_id UUID REFERENCES ai_mentorship_systems(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    levels JSONB,
    prerequisites TEXT[],
    rewards JSONB,
    estimated_duration INTEGER DEFAULT 0, -- in weeks
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Personalized Missions
CREATE TABLE IF NOT EXISTS personalized_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    mentorship_system_id UUID REFERENCES ai_mentorship_systems(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    objectives JSONB,
    adaptive_difficulty BOOLEAN DEFAULT TRUE,
    completion_bonus JSONB,
    time_limit INTEGER DEFAULT 3600, -- 1 hour in seconds
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active'
);

-- Player Assignments
CREATE TABLE IF NOT EXISTS player_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    coach_id UUID REFERENCES ai_coaches(id) ON DELETE CASCADE,
    assignment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress INTEGER DEFAULT 0,
    performance INTEGER DEFAULT 0,
    feedback TEXT[],
    UNIQUE(player_id, coach_id)
);

-- Player Mentorship Progress
CREATE TABLE IF NOT EXISTS player_mentorship_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    mentorship_system_id UUID REFERENCES ai_mentorship_systems(id) ON DELETE CASCADE,
    current_path VARCHAR(255),
    completed_levels INTEGER DEFAULT 0,
    total_levels INTEGER DEFAULT 0,
    skill_points INTEGER DEFAULT 0,
    mentorship_score INTEGER DEFAULT 0,
    last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, mentorship_system_id)
);

-- ========================================
-- WALL OF FAME TABLES
-- ========================================

-- People Power Wall of Fame main table
CREATE TABLE IF NOT EXISTS people_power_wall_of_fame (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    established_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_honored INTEGER DEFAULT 0,
    version VARCHAR(50) DEFAULT '1.0'
);

-- Achievement Halls
CREATE TABLE IF NOT EXISTS achievement_halls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wall_of_fame_id UUID REFERENCES people_power_wall_of_fame(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    honored_members JSONB,
    recognition_criteria JSONB,
    display_format JSONB,
    updated_frequency VARCHAR(50) DEFAULT 'weekly',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(wall_of_fame_id, name)
);

-- Legacy Categories
CREATE TABLE IF NOT EXISTS legacy_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wall_of_fame_id UUID REFERENCES people_power_wall_of_fame(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    criteria JSONB,
    members JSONB,
    historical_significance TEXT,
    cultural_impact TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(wall_of_fame_id, name)
);

-- Honored Members
CREATE TABLE IF NOT EXISTS honored_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hall_id UUID REFERENCES achievement_halls(id) ON DELETE CASCADE,
    player_id VARCHAR(255) NOT NULL,
    honored_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    achievement VARCHAR(255),
    contribution_summary TEXT,
    UNIQUE(hall_id, player_id)
);

-- Soulbound Reputation NFTs
CREATE TABLE IF NOT EXISTS soulbound_reputation_nfts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_id VARCHAR(255) UNIQUE NOT NULL,
    owner_player_id VARCHAR(255) NOT NULL,
    reputation_score INTEGER NOT NULL,
    achievement VARCHAR(255),
    visual_traits JSONB,
    governance_influence INTEGER DEFAULT 0,
    transferability VARCHAR(50) DEFAULT 'soulbound',
    minted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(token_id)
);

-- Living History Timeline
CREATE TABLE IF NOT EXISTS timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    participants TEXT[],
    impact JSONB,
    media JSONB,
    significance VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Civilization Milestones
CREATE TABLE IF NOT EXISTS civilization_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    contributors TEXT[],
    rewards JSONB,
    historical_importance VARCHAR(50) NOT NULL
);

-- Player Revolutions
CREATE TABLE IF NOT EXISTS player_revolutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    participants TEXT[],
    outcome VARCHAR(50) NOT NULL,
    impact JSONB,
    methods JSONB
);

-- Economic Achievements
CREATE TABLE IF NOT EXISTS economic_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    achievement_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    value INTEGER DEFAULT 0,
    currency VARCHAR(20) DEFAULT 'PWR_TOKEN'
);

-- Governance Votes
CREATE TABLE IF NOT EXISTS governance_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    proposal_id VARCHAR(255) NOT NULL,
    vote VARCHAR(100) NOT NULL,
    reasoning TEXT,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    weight DECIMAL(5,2) DEFAULT 1.0
);

-- Scrollable Content
CREATE TABLE IF NOT EXISTS scrollable_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    author VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    views INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    bookmarks INTEGER DEFAULT 0,
    tags TEXT[]
);

-- ========================================
-- REPUTATION DNA SYSTEM TABLES
-- ========================================

-- Reputation DNA
CREATE TABLE IF NOT EXISTS reputation_dna (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) UNIQUE NOT NULL,
    knowledge_dna JSONB,
    social_dna JSONB,
    builder_dna JSONB,
    integrity_dna JSONB,
    overall_score INTEGER DEFAULT 0,
    genetic_markers JSONB,
    evolution_history JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Genetic Markers
CREATE TABLE IF NOT EXISTS genetic_markers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reputation_dna_id UUID REFERENCES reputation_dna(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    rarity VARCHAR(50) NOT NULL,
    effect JSONB,
    inheritance_pattern VARCHAR(50) NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(reputation_dna_id, name)
);

-- Evolution History
CREATE TABLE IF NOT EXISTS evolution_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reputation_dna_id UUID REFERENCES reputation_dna(id) ON DELETE CASCADE,
    evolution_type VARCHAR(100) NOT NULL,
    previous_score INTEGER NOT NULL,
    new_score INTEGER NOT NULL,
    trigger TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- CIVILIZATION RANK SYSTEM TABLES
-- ========================================

-- Civilization Rankings
CREATE TABLE IF NOT EXISTS civilization_rankings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) UNIQUE NOT NULL,
    economic_power INTEGER DEFAULT 0,
    civilization_contribution INTEGER DEFAULT 0,
    balance_score DECIMAL(5,2) DEFAULT 0,
    rank VARCHAR(100) NOT NULL,
    privileges JSONB,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Anti-Whale Mechanics
CREATE TABLE IF NOT EXISTS anti_whale_mechanics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(100) NOT NULL,
    description TEXT,
    mechanics TEXT[],
    effectiveness INTEGER DEFAULT 0,
    implementation TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reputation-Based Governance
CREATE TABLE IF NOT EXISTS reputation_based_governance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    voting_power JSONB,
    proposal_threshold JSONB,
    decision_weighting JSONB,
    reputation_requirements JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- PLAYER SKILLS & ACADEMY ENROLLMENTS
-- ========================================

-- Academy Enrollments
CREATE TABLE IF NOT EXISTS academy_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    academy_id UUID REFERENCES academies(id) ON DELETE CASCADE,
    player_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress INTEGER DEFAULT 0,
    completed_at TIMESTAMP,
    UNIQUE(academy_id, player_id)
);

-- Academy Enrollment Courses
CREATE TABLE IF NOT EXISTS academy_enrollment_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_id UUID REFERENCES academy_enrollments(id) ON DELETE CASCADE,
    course_id UUID REFERENCES academy_courses(id) ON DELETE CASCADE,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    score INTEGER DEFAULT 0,
    UNIQUE(enrollment_id, course_id)
);

-- Player Skills
CREATE TABLE IF NOT EXISTS player_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    skill_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    max_level INTEGER DEFAULT 100,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, skill_name)
);

-- Player Submissions
CREATE TABLE IF NOT EXISTS player_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) NOT NULL,
    lab_id UUID REFERENCES innovation_labs(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    content JSONB,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    review_status VARCHAR(50) DEFAULT 'pending',
    reviewer_feedback TEXT[]
);

-- ========================================
-- INNOVATION & REVENUE SHARING
-- ========================================

-- Approved Innovations
CREATE TABLE IF NOT EXISTS approved_innovations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES player_submissions(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    implementation_status VARCHAR(50) DEFAULT 'pending',
    revenue_generated INTEGER DEFAULT 0,
    creator_royalty DECIMAL(5,2) DEFAULT 0.10,
    adoption_rate DECIMAL(5,2) DEFAULT 0,
    approved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Center of Excellence indexes
CREATE INDEX IF NOT EXISTS idx_academies_center_id ON academies(center_of_excellence_id);
CREATE INDEX IF NOT EXISTS idx_innovation_labs_center_id ON innovation_labs(center_of_excellence_id);
CREATE INDEX IF NOT EXISTS idx_ai_mentorship_systems_center_id ON ai_mentorship_systems(center_of_excellence_id);

-- Academy indexes
CREATE INDEX IF NOT EXISTS idx_academy_courses_academy_id ON academy_courses(academy_id);
CREATE INDEX IF NOT EXISTS idx_academy_enrollments_player_id ON academy_enrollments(player_id);
CREATE INDEX IF NOT EXISTS idx_academy_enrollments_academy_id ON academy_enrollments(academy_id);

-- Innovation indexes
CREATE INDEX IF NOT EXISTS idx_player_submissions_player_id ON player_submissions(player_id);
CREATE INDEX IF NOT EXISTS idx_player_submissions_lab_id ON player_submissions(lab_id);
CREATE INDEX IF NOT EXISTS idx_player_submissions_status ON player_submissions(review_status);

-- AI Mentorship indexes
CREATE INDEX IF NOT EXISTS idx_ai_coaches_mentorship_id ON ai_coaches(mentorship_system_id);
CREATE INDEX IF NOT EXISTS idx_skill_paths_mentorship_id ON skill_paths(mentorship_system_id);
CREATE INDEX IF NOT EXISTS idx_personalized_missions_player_id ON personalized_missions(player_id);
CREATE INDEX IF NOT EXISTS idx_player_assignments_player_id ON player_assignments(player_id);
CREATE INDEX IF NOT EXISTS idx_player_mentorship_progress_player_id ON player_mentorship_progress(player_id);

-- Wall of Fame indexes
CREATE INDEX IF NOT EXISTS idx_achievement_halls_wall_id ON achievement_halls(wall_of_fame_id);
CREATE INDEX IF NOT EXISTS idx_legacy_categories_wall_id ON legacy_categories(wall_of_fame_id);
CREATE INDEX IF NOT EXISTS idx_honored_members_hall_id ON honored_members(hall_id);
CREATE INDEX IF NOT EXISTS idx_honored_members_player_id ON honored_members(player_id);

-- Reputation DNA indexes
CREATE INDEX IF NOT EXISTS idx_reputation_dna_player_id ON reputation_dna(player_id);
CREATE INDEX IF NOT EXISTS idx_genetic_markers_dna_id ON genetic_markers(reputation_dna_id);
CREATE INDEX IF NOT EXISTS idx_evolution_history_dna_id ON evolution_history(reputation_dna_id);

-- Civilization indexes
CREATE INDEX IF NOT EXISTS idx_civilization_rankings_player_id ON civilization_rankings(player_id);
CREATE INDEX IF NOT EXISTS idx_civilization_rankings_balance_score ON civilization_rankings(balance_score DESC);

-- Timeline indexes
CREATE INDEX IF NOT EXISTS idx_timeline_events_player_id ON timeline_events(player_id);
CREATE INDEX IF NOT EXISTS idx_timeline_events_timestamp ON timeline_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_timeline_events_event_type ON timeline_events(event_type);

-- Soulbound NFT indexes
CREATE INDEX IF NOT EXISTS idx_soulbound_nfts_owner ON soulbound_reputation_nfts(owner_player_id);
CREATE INDEX IF NOT EXISTS idx_soulbound_nfts_token_id ON soulbound_reputation_nfts(token_id);
CREATE INDEX IF NOT EXISTS idx_soulbound_nfts_reputation ON soulbound_reputation_nfts(reputation_score DESC);

-- Scrollable content indexes
CREATE INDEX IF NOT EXISTS idx_scrollable_content_type ON scrollable_content(content_type);
CREATE INDEX IF NOT EXISTS idx_scrollable_content_created_at ON scrollable_content(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scrollable_content_views ON scrollable_content(views DESC);

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
CREATE TRIGGER update_reputation_dna_updated_at BEFORE UPDATE ON reputation_dna 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_civilization_rankings_updated_at BEFORE UPDATE ON civilization_rankings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- INITIAL DATA SEEDING
-- ========================================

-- Insert main Center of Excellence
INSERT INTO people_power_center_of_excellence (id, name, description, established_at) 
VALUES ('main-coe', 'People Power Center of Excellence', 'The institutional phase of our digital civilization', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert main Wall of Fame
INSERT INTO people_power_wall_of_fame (id, name, description, established_at) 
VALUES ('main-wof', 'People Power Wall of Fame', 'The historical record of our civilization achievements and legends', NOW())
ON CONFLICT (id) DO NOTHING;

-- Create initial academies
INSERT INTO academies (id, center_of_excellence_id, name, type, description, established_at) VALUES
  ('academy-game-strategy', 'main-coe', 'Game Strategy Institute', 'Teaches advanced gameplay and strategic thinking', NOW()),
  ('academy-digital-skills', 'main-coe', 'Digital Skills Lab', 'Coding, AI, Web3 basics and digital creation tools', NOW()),
  ('academy-economic-intelligence', 'main-coe', 'Economic Intelligence School', 'Trading, token economy, and financial systems', NOW()),
  ('academy-community-leadership', 'main-coe', 'Community Leadership Academy', 'Governance training and community organization skills', NOW()),
  ('academy-social-impact', 'main-coe', 'Social Impact Lab', 'Real-world missions and community problem solving', NOW())
ON CONFLICT (center_of_excellence_id, name) DO NOTHING;

-- Create initial innovation labs
INSERT INTO innovation_labs (id, center_of_excellence_id, name, description, focus_area, established_at) VALUES
  ('lab-mini-apps', 'main-coe', 'Mini-App Development Lab', 'Player-created mini-apps and tools', 'mini_apps'),
  ('lab-game-tools', 'main-coe', 'Game Tools Lab', 'Gameplay enhancements and utilities', 'game_tools'),
  ('lab-community-solutions', 'main-coe', 'Community Solutions Lab', 'Community-driven innovations and solutions', 'community_solutions'),
  ('lab-educational-content', 'main-coe', 'Educational Content Lab', 'Educational materials and learning systems', 'educational_content')
ON CONFLICT (center_of_excellence_id, name) DO NOTHING;

-- Create initial AI mentorship systems
INSERT INTO ai_mentorship_systems (id, center_of_excellence_id, name, description, established_at) VALUES
  ('ai-mentorship-main', 'main-coe', 'Primary AI Mentorship System', 'Comprehensive AI coaching and skill development', NOW())
ON CONFLICT (center_of_excellence_id, name) DO NOTHING;

-- Create initial achievement halls
INSERT INTO achievement_halls (id, wall_of_fame_id, name, category, description, created_at) VALUES
  ('hall-founders', 'main-wof', 'Founders Hall', 'Honoring early adopters and pioneers', 'founders'),
  ('hall-genius', 'main-wof', 'Genius Hall', 'Recognizing top innovators and creators', 'genius'),
  ('hall-guardians', 'main-wof', 'Guardians Hall', 'Honoring protectors and moderators', 'guardians'),
  ('hall-impact', 'main-wof', 'Impact Hall', 'Recognizing real-world changemakers', 'impact'),
  ('hall-diamond-hands', 'main-wof', 'Diamond Hands Hall', 'Honoring long-term contributors and holders', 'diamond_hands')
ON CONFLICT (wall_of_fame_id, name) DO NOTHING;

-- Create initial legacy categories
INSERT INTO legacy_categories (id, wall_of_fame_id, name, description, criteria, historical_significance, created_at) VALUES
  ('legacy-founder', 'main-wof', 'Founder', 'Early adopters who joined in the first wave', 'founder', 'legendary'),
  ('legacy-top-earner', 'main-wof', 'Top Earner', 'Highest earning players in the ecosystem', 'top_earner', 'historical'),
  ('legacy-innovator', 'main-wof', 'Innovator', 'Creators of popular features and content', 'innovator', 'historical'),
  ('legacy-educator', 'main-wof', 'Educator', 'Top mentors and teachers', 'educator', 'historical'),
  ('legacy-community-protector', 'main-wof', 'Community Protector', 'Defenders of community values and safety', 'community_protector', 'historical'),
  ('legacy-long-term-holder', 'main-wof', 'Long-term Holder', 'Dedicated long-time participants', 'long_term_holder', 'historical')
ON CONFLICT (wall_of_fame_id, name) DO NOTHING;

-- Create initial anti-whale mechanics
INSERT INTO anti_whale_mechanics (id, type, description, mechanics, effectiveness, implementation, is_active) VALUES
  ('anti-whale-reputation-locks', 'reputation_lock', 'Reputation-based privilege locks', 'ARRAY[''Reputation cannot be bought - only earned'', 95, 'Privileges require high reputation scores, not just tokens'),
  ('anti-whale-earning-connections', 'earning_connections', 'Earning connection requirements', 'ARRAY[''High-reputation players unlock earning abilities'', 90, 'Earning multipliers tied to reputation and contribution'),
  ('anti-whale-governance-weighting', 'governance_weighting', 'Reputation-weighted voting', 'ARRAY[''Voting power scales with reputation, not tokens'', 85, 'Voting influence calculated from contribution history'),
  ('anti-whale-mentorship-gates', 'mentorship_gates', 'Mentorship privilege gates', 'ARRAY[''Teaching requires reputation and proven contribution'', 88, 'Only qualified players can mentor others'),
  ('anti-whale-innovation-access', 'innovation_access', 'Innovation access controls', 'ARRAY[''Lab access requires reputation and skill prerequisites'', 92, 'Innovation labs and advanced features require proven expertise')
ON CONFLICT (type) DO NOTHING;

COMMIT;
