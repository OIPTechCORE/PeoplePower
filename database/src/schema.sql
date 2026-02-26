-- PEOPLE POWER JOURNEY - DATABASE SCHEMA
-- Complete PostgreSQL schema for game infrastructure

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create custom types
CREATE TYPE player_rank AS ENUM (
    'VOICE_STARTER',
    'ORGANIZER', 
    'INFLUENCER',
    'MOVEMENT_LEADER',
    'LEGEND'
);

CREATE TYPE player_generation AS ENUM (
    'FOUNDERS',
    'BUILDERS', 
    'SUPPORTERS',
    'MASS_MOVEMENT'
);

CREATE TYPE mission_type AS ENUM (
    'DAILY_TAP',
    'RECRUIT_SUPPORTERS',
    'WATCH_EDUCATIONAL',
    'ANSWER_QUIZ',
    'ORGANIZE_RALLY',
    'DEBATE_CHALLENGE',
    'COMMUNITY_QUEST'
);

CREATE TYPE mini_game_type AS ENUM (
    'TAP_RHYTHM',
    'LYRICS_PUZZLE',
    'RESOURCE_STRATEGY',
    'DECISION_MAKING',
    'TEAM_MANAGEMENT'
);

CREATE TYPE badge_rarity AS ENUM (
    'common',
    'rare', 
    'epic',
    'legendary'
);

CREATE TYPE story_theme AS ENUM (
    'GHETTO_ROOTS',
    'VOICE_THROUGH_MUSIC',
    'RISING_POPULARITY',
    'CHALLENGES',
    'LEADERSHIP'
);

CREATE TYPE reward_type AS ENUM (
    'influence',
    'power_tokens',
    'supporters',
    'experience',
    'badge',
    'title'
);

CREATE TYPE transaction_type AS ENUM (
    'earned',
    'spent',
    'bonus',
    'penalty'
);

CREATE TYPE viral_event_type AS ENUM (
    'limited_time',
    'emergency',
    'double_rewards',
    'secret_drop'
);

CREATE TYPE leaderboard_type AS ENUM (
    'global',
    'regional',
    'community',
    'campus'
);

CREATE TYPE leaderboard_period AS ENUM (
    'daily',
    'weekly',
    'seasonal',
    'all_time'
);

-- =============================================
-- CORE PLAYER TABLES
-- =============================================

CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    telegram_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(255),
    display_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    
    -- Game Progress
    level INTEGER DEFAULT 1 NOT NULL,
    rank player_rank DEFAULT 'VOICE_STARTER' NOT NULL,
    experience BIGINT DEFAULT 0 NOT NULL,
    influence BIGINT DEFAULT 0 NOT NULL,
    supporters INTEGER DEFAULT 0 NOT NULL,
    
    -- Economy
    power_tokens BIGINT DEFAULT 0 NOT NULL,
    total_earned BIGINT DEFAULT 0 NOT NULL,
    
    -- Social
    referral_code VARCHAR(32) UNIQUE NOT NULL,
    referred_by UUID REFERENCES players(id),
    referrals_count INTEGER DEFAULT 0 NOT NULL,
    community_id UUID,
    
    -- Status
    is_active BOOLEAN DEFAULT true NOT NULL,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Genesis Era
    generation player_generation DEFAULT 'MASS_MOVEMENT' NOT NULL,
    permanent_bonus DECIMAL(3,2) DEFAULT 1.0 NOT NULL,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Indexes
    CONSTRAINT players_level_check CHECK (level >= 1),
    CONSTRAINT players_experience_check CHECK (experience >= 0),
    CONSTRAINT players_influence_check CHECK (influence >= 0),
    CONSTRAINT players_supporters_check CHECK (supporters >= 0),
    CONSTRAINT players_power_tokens_check CHECK (power_tokens >= 0),
    CONSTRAINT players_total_earned_check CHECK (total_earned >= 0),
    CONSTRAINT players_referrals_count_check CHECK (referrals_count >= 0),
    CONSTRAINT players_permanent_bonus_check CHECK (permanent_bonus >= 1.0)
);

-- Player achievements and badges
CREATE TABLE player_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    badge_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    rarity badge_rarity NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    UNIQUE(player_id, badge_id)
);

-- Player titles
CREATE TABLE player_titles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    UNIQUE(player_id, title)
);

-- =============================================
-- STORY SYSTEM
-- =============================================

CREATE TABLE story_chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chapter_id VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    theme story_theme NOT NULL,
    order_index INTEGER NOT NULL,
    is_unlocked BOOLEAN DEFAULT false NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    CONSTRAINT story_chapters_order_unique UNIQUE(order_index)
);

-- Player chapter progress
CREATE TABLE player_chapter_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES story_chapters(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    current_scene_index INTEGER DEFAULT 0 NOT NULL,
    
    UNIQUE(player_id, chapter_id),
    CONSTRAINT player_chapter_progress_scene_check CHECK (current_scene_index >= 0)
);

-- Story scenes
CREATE TABLE story_scenes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chapter_id UUID NOT NULL REFERENCES story_chapters(id) ON DELETE CASCADE,
    scene_id VARCHAR(255) NOT NULL,
    order_index INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'text', 'dialogue', 'choice', 'mini-game'
    content TEXT NOT NULL,
    mini_game_type mini_game_type,
    
    UNIQUE(chapter_id, scene_id),
    CONSTRAINT story_scenes_order_unique UNIQUE(chapter_id, order_index)
);

-- Story choices
CREATE TABLE story_choices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scene_id UUID NOT NULL REFERENCES story_scenes(id) ON DELETE CASCADE,
    choice_id VARCHAR(255) NOT NULL,
    text VARCHAR(255) NOT NULL,
    consequence TEXT,
    order_index INTEGER NOT NULL,
    
    UNIQUE(scene_id, choice_id),
    CONSTRAINT story_choices_order_unique UNIQUE(scene_id, order_index)
);

-- =============================================
-- MISSION SYSTEM
-- =============================================

CREATE TABLE missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type mission_type NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'daily', 'weekly', 'story', 'special'
    
    -- Requirements & Rewards
    requirements JSONB NOT NULL DEFAULT '[]',
    rewards JSONB NOT NULL DEFAULT '[]',
    
    -- Progress
    max_progress INTEGER DEFAULT 1 NOT NULL,
    
    -- Timing
    expires_at TIMESTAMP WITH TIME ZONE,
    reset_at TIMESTAMP WITH TIME ZONE,
    
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    CONSTRAINT missions_max_progress_check CHECK (max_progress > 0)
);

-- Player mission progress
CREATE TABLE player_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    
    -- Progress
    progress INTEGER DEFAULT 0 NOT NULL,
    is_completed BOOLEAN DEFAULT false NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Timing
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(player_id, mission_id),
    CONSTRAINT player_missions_progress_check CHECK (progress >= 0),
    CONSTRAINT player_missions_progress_max_check CHECK (progress <= (SELECT max_progress FROM missions WHERE id = mission_id))
);

-- =============================================
-- MINI-GAMES SYSTEM
-- =============================================

CREATE TABLE mini_game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    type mini_game_type NOT NULL,
    
    -- Session data
    session_data JSONB NOT NULL DEFAULT '{}',
    score BIGINT DEFAULT 0 NOT NULL,
    
    -- Timing
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Status
    is_completed BOOLEAN DEFAULT false NOT NULL,
    
    -- Rewards
    rewards JSONB NOT NULL DEFAULT '[]',
    
    CONSTRAINT mini_game_sessions_score_check CHECK (score >= 0)
);

-- =============================================
-- COMMUNITY SYSTEM
-- =============================================

CREATE TABLE communities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    avatar_url TEXT,
    
    -- Leadership
    leader_id UUID NOT NULL REFERENCES players(id) ON DELETE RESTRICT,
    
    -- Members
    member_count INTEGER DEFAULT 1 NOT NULL,
    max_members INTEGER DEFAULT 100 NOT NULL,
    
    -- Progress
    level INTEGER DEFAULT 1 NOT NULL,
    experience BIGINT DEFAULT 0 NOT NULL,
    
    -- Social
    is_public BOOLEAN DEFAULT true NOT NULL,
    join_code VARCHAR(32) UNIQUE,
    required_level INTEGER DEFAULT 1 NOT NULL,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    CONSTRAINT communities_member_count_check CHECK (member_count >= 1),
    CONSTRAINT communities_max_members_check CHECK (max_members > 0),
    CONSTRAINT communities_level_check CHECK (level >= 1),
    CONSTRAINT communities_experience_check CHECK (experience >= 0),
    CONSTRAINT communities_required_level_check CHECK (required_level >= 1)
);

-- Community members
CREATE TABLE community_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    
    role VARCHAR(50) NOT NULL DEFAULT 'member', -- 'leader', 'officer', 'member'
    contribution BIGINT DEFAULT 0 NOT NULL,
    weekly_activity INTEGER DEFAULT 0 NOT NULL,
    
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    UNIQUE(community_id, player_id),
    CONSTRAINT community_members_role_check CHECK (role IN ('leader', 'officer', 'member')),
    CONSTRAINT community_members_contribution_check CHECK (contribution >= 0),
    CONSTRAINT community_members_weekly_activity_check CHECK (weekly_activity >= 0)
);

-- Community upgrades
CREATE TABLE community_upgrades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    upgrade_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cost BIGINT NOT NULL,
    effect JSONB NOT NULL,
    
    is_purchased BOOLEAN DEFAULT false NOT NULL,
    purchased_at TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(community_id, upgrade_id),
    CONSTRAINT community_upgrades_cost_check CHECK (cost >= 0)
);

-- =============================================
-- VIRAL MECHANICS
-- =============================================

-- Referrals
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    referred_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    referred_username VARCHAR(255),
    
    status VARCHAR(50) DEFAULT 'pending' NOT NULL, -- 'pending', 'active', 'completed'
    completed_at TIMESTAMP WITH TIME ZONE,
    
    rewards JSONB NOT NULL DEFAULT '[]',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    UNIQUE(referrer_id, referred_id),
    CONSTRAINT referrals_status_check CHECK (status IN ('pending', 'active', 'completed'))
);

-- Viral events
CREATE TABLE viral_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type viral_event_type NOT NULL,
    
    -- Timing
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Requirements & Rewards
    requirements JSONB NOT NULL DEFAULT '[]',
    rewards JSONB NOT NULL DEFAULT '[]',
    
    -- Status
    is_active BOOLEAN DEFAULT false NOT NULL,
    participant_count INTEGER DEFAULT 0 NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    CONSTRAINT viral_events_participant_count_check CHECK (participant_count >= 0),
    CONSTRAINT viral_events_timing_check CHECK (ends_at > starts_at)
);

-- Viral event participants
CREATE TABLE viral_event_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES viral_events(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    
    progress JSONB NOT NULL DEFAULT '{}',
    rewards_claimed JSONB NOT NULL DEFAULT '[]',
    
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    UNIQUE(event_id, player_id)
);

-- =============================================
-- LEADERBOARDS
-- =============================================

CREATE TABLE leaderboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type leaderboard_type NOT NULL,
    period leaderboard_period NOT NULL,
    
    -- Timing
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
    resets_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Status
    is_active BOOLEAN DEFAULT true NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    CONSTRAINT leaderboards_timing_check CHECK (ends_at > starts_at),
    CONSTRAINT leaderboards_reset_check CHECK (resets_at > ends_at)
);

-- Leaderboard entries
CREATE TABLE leaderboard_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leaderboard_id UUID NOT NULL REFERENCES leaderboards(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    
    rank INTEGER NOT NULL,
    score BIGINT NOT NULL,
    previous_rank INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    UNIQUE(leaderboard_id, player_id),
    CONSTRAINT leaderboard_entries_rank_check CHECK (rank > 0),
    CONSTRAINT leaderboard_entries_score_check CHECK (score >= 0)
);

-- =============================================
-- ECONOMY SYSTEM
-- =============================================

-- Token transactions
CREATE TABLE token_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    amount BIGINT NOT NULL,
    source VARCHAR(255) NOT NULL, -- mission, referral, upgrade, etc.
    description TEXT,
    
    -- Reference to related entity
    reference_id UUID,
    reference_type VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    CONSTRAINT token_transactions_amount_check CHECK (amount != 0)
);

-- Economy state tracking
CREATE TABLE economy_state (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE UNIQUE NOT NULL,
    
    total_players INTEGER DEFAULT 0 NOT NULL,
    active_players INTEGER DEFAULT 0 NOT NULL,
    total_tokens_minted BIGINT DEFAULT 0 NOT NULL,
    total_tokens_burned BIGINT DEFAULT 0 NOT NULL,
    circulating_supply BIGINT DEFAULT 0 NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    CONSTRAINT economy_state_total_players_check CHECK (total_players >= 0),
    CONSTRAINT economy_state_active_players_check CHECK (active_players >= 0),
    CONSTRAINT economy_state_total_minted_check CHECK (total_tokens_minted >= 0),
    CONSTRAINT economy_state_total_burned_check CHECK (total_tokens_burned >= 0),
    CONSTRAINT economy_state_circulating_check CHECK (circulating_supply >= 0)
);

-- =============================================
-- SESSION MANAGEMENT
-- =============================================

CREATE TABLE game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    
    -- Timing
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE,
    
    -- Metrics
    session_duration INTEGER DEFAULT 0 NOT NULL, -- seconds
    influence_gained BIGINT DEFAULT 0 NOT NULL,
    missions_completed INTEGER DEFAULT 0 NOT NULL,
    tokens_earned BIGINT DEFAULT 0 NOT NULL,
    
    -- Session data
    actions JSONB NOT NULL DEFAULT '[]',
    
    CONSTRAINT game_sessions_duration_check CHECK (session_duration >= 0),
    CONSTRAINT game_sessions_influence_check CHECK (influence_gained >= 0),
    CONSTRAINT game_sessions_missions_check CHECK (missions_completed >= 0),
    CONSTRAINT game_sessions_tokens_check CHECK (tokens_earned >= 0)
);

-- =============================================
-- ANALYTICS & IMPACT
-- =============================================

CREATE TABLE impact_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE UNIQUE NOT NULL,
    
    active_users INTEGER DEFAULT 0 NOT NULL,
    new_users INTEGER DEFAULT 0 NOT NULL,
    missions_completed INTEGER DEFAULT 0 NOT NULL,
    learning_sessions_completed INTEGER DEFAULT 0 NOT NULL,
    communities_formed INTEGER DEFAULT 0 NOT NULL,
    
    geographic_distribution JSONB NOT NULL DEFAULT '{}',
    age_demographics JSONB NOT NULL DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    CONSTRAINT impact_metrics_active_users_check CHECK (active_users >= 0),
    CONSTRAINT impact_metrics_new_users_check CHECK (new_users >= 0),
    CONSTRAINT impact_metrics_missions_check CHECK (missions_completed >= 0),
    CONSTRAINT impact_metrics_learning_check CHECK (learning_sessions_completed >= 0),
    CONSTRAINT impact_metrics_communities_check CHECK (communities_formed >= 0)
);

-- =============================================
-- ENDLESS SYSTEMS TABLES
-- =============================================

-- Daily Habits
CREATE TABLE daily_habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    habit_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    difficulty VARCHAR(50) NOT NULL,
    
    -- Requirements & Rewards
    requirements JSONB NOT NULL DEFAULT '[]',
    rewards JSONB NOT NULL DEFAULT '[]',
    streak_bonus JSONB NOT NULL DEFAULT '{}',
    
    -- Visual & Emotional
    visual_theme JSONB NOT NULL DEFAULT '{}',
    emotional_impact JSONB NOT NULL DEFAULT '{}',
    
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Player habit progress
CREATE TABLE player_habit_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    habit_id UUID NOT NULL REFERENCES daily_habits(id) ON DELETE CASCADE,
    
    -- Progress
    current_streak INTEGER DEFAULT 0 NOT NULL,
    longest_streak INTEGER DEFAULT 0 NOT NULL,
    total_completed INTEGER DEFAULT 0 NOT NULL,
    
    -- Timing
    last_completed_at TIMESTAMP WITH TIME ZONE,
    streak_started_at TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(player_id, habit_id),
    CONSTRAINT player_habit_progress_current_streak_check CHECK (current_streak >= 0),
    CONSTRAINT player_habit_progress_longest_streak_check CHECK (longest_streak >= 0),
    CONSTRAINT player_habit_progress_total_completed_check CHECK (total_completed >= 0)
);

-- Competitions
CREATE TABLE competitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    
    -- Duration
    duration_type VARCHAR(50) NOT NULL,
    duration_hours INTEGER NOT NULL,
    starts_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    
    -- Requirements & Rewards
    requirements JSONB NOT NULL DEFAULT '[]',
    rewards JSONB NOT NULL DEFAULT '[]',
    
    -- Mechanics
    mechanics JSONB NOT NULL DEFAULT '{}',
    
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    CONSTRAINT competitions_duration_hours_check CHECK (duration_hours > 0)
);

-- Player competition participation
CREATE TABLE player_competitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    
    -- Performance
    score BIGINT DEFAULT 0 NOT NULL,
    rank INTEGER,
    
    -- Progress
    progress JSONB NOT NULL DEFAULT '{}',
    rewards_claimed JSONB NOT NULL DEFAULT '[]',
    
    -- Timing
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(player_id, competition_id),
    CONSTRAINT player_competitions_score_check CHECK (score >= 0),
    CONSTRAINT player_competitions_rank_check CHECK (rank IS NULL OR rank > 0)
);

-- Social Sharing
CREATE TABLE social_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    share_type VARCHAR(100) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    
    -- Content
    content JSONB NOT NULL DEFAULT '{}',
    share_url TEXT,
    
    -- Metrics
    views INTEGER DEFAULT 0 NOT NULL,
    engagements INTEGER DEFAULT 0 NOT NULL,
    conversions INTEGER DEFAULT 0 NOT NULL,
    
    -- Rewards
    rewards JSONB NOT NULL DEFAULT '[]',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    CONSTRAINT social_shares_views_check CHECK (views >= 0),
    CONSTRAINT social_shares_engagements_check CHECK (engagements >= 0),
    CONSTRAINT social_shares_conversions_check CHECK (conversions >= 0)
);

-- Emotional Investment
CREATE TABLE emotional_investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    investment_type VARCHAR(100) NOT NULL,
    
    -- Investment details
    amount INTEGER NOT NULL,
    description TEXT,
    risk_level INTEGER DEFAULT 1 NOT NULL,
    expected_return INTEGER DEFAULT 0 NOT NULL,
    
    -- Outcome
    actual_return INTEGER,
    outcome VARCHAR(50), -- 'success', 'partial', 'failure'
    
    -- Timing
    invested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT emotional_investments_amount_check CHECK (amount > 0),
    CONSTRAINT emotional_investments_risk_check CHECK (risk_level >= 1 AND risk_level <= 10),
    CONSTRAINT emotional_investments_expected_return_check CHECK (expected_return >= 0)
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Players indexes
CREATE INDEX idx_players_telegram_id ON players(telegram_id);
CREATE INDEX idx_players_referral_code ON players(referral_code);
CREATE INDEX idx_players_rank ON players(rank);
CREATE INDEX idx_players_level ON players(level);
CREATE INDEX idx_players_last_active ON players(last_active_at);
CREATE INDEX idx_players_generation ON players(generation);

-- Game sessions indexes
CREATE INDEX idx_game_sessions_player_id ON game_sessions(player_id);
CREATE INDEX idx_game_sessions_started_at ON game_sessions(started_at);
CREATE INDEX idx_game_sessions_last_activity ON game_sessions(last_activity_at);

-- Missions indexes
CREATE INDEX idx_player_missions_player_id ON player_missions(player_id);
CREATE INDEX idx_player_missions_mission_id ON player_missions(mission_id);
CREATE INDEX idx_player_missions_completed ON player_missions(is_completed);
CREATE INDEX idx_missions_type ON missions(type);
CREATE INDEX idx_missions_category ON missions(category);

-- Story indexes
CREATE INDEX idx_player_chapter_progress_player_id ON player_chapter_progress(player_id);
CREATE INDEX idx_player_chapter_progress_chapter_id ON player_chapter_progress(chapter_id);
CREATE INDEX idx_story_scenes_chapter_id ON story_scenes(chapter_id);

-- Community indexes
CREATE INDEX idx_community_members_community_id ON community_members(community_id);
CREATE INDEX idx_community_members_player_id ON community_members(player_id);
CREATE INDEX idx_communities_leader_id ON communities(leader_id);
CREATE INDEX idx_communities_is_public ON communities(is_public);

-- Leaderboard indexes
CREATE INDEX idx_leaderboard_entries_leaderboard_id ON leaderboard_entries(leaderboard_id);
CREATE INDEX idx_leaderboard_entries_player_id ON leaderboard_entries(player_id);
CREATE INDEX idx_leaderboard_entries_rank ON leaderboard_entries(rank);
CREATE INDEX idx_leaderboard_entries_score ON leaderboard_entries(score DESC);

-- Economy indexes
CREATE INDEX idx_token_transactions_player_id ON token_transactions(player_id);
CREATE INDEX idx_token_transactions_type ON token_transactions(type);
CREATE INDEX idx_token_transactions_created_at ON token_transactions(created_at);

-- Viral indexes
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred_id ON referrals(referred_id);
CREATE INDEX idx_viral_event_participants_event_id ON viral_event_participants(event_id);
CREATE INDEX idx_viral_event_participants_player_id ON viral_event_participants(player_id);

-- Endless systems indexes
CREATE INDEX idx_player_habit_progress_player_id ON player_habit_progress(player_id);
CREATE INDEX idx_player_habit_progress_current_streak ON player_habit_progress(current_streak DESC);
CREATE INDEX idx_player_competitions_player_id ON player_competitions(player_id);
CREATE INDEX idx_player_competitions_score ON player_competitions(score DESC);
CREATE INDEX idx_social_shares_player_id ON social_shares(player_id);
CREATE INDEX idx_social_shares_platform ON social_shares(platform);
CREATE INDEX idx_emotional_investments_player_id ON emotional_investments(player_id);

-- =============================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =============================================

-- Update player's updated_at timestamp
CREATE OR REPLACE FUNCTION update_player_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_player_updated_at
    BEFORE UPDATE ON players
    FOR EACH ROW
    EXECUTE FUNCTION update_player_updated_at();

-- Update community member count
CREATE OR REPLACE FUNCTION update_community_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE communities 
        SET member_count = member_count + 1 
        WHERE id = NEW.community_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE communities 
        SET member_count = member_count - 1 
        WHERE id = OLD.community_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_community_member_count
    AFTER INSERT OR DELETE ON community_members
    FOR EACH ROW
    EXECUTE FUNCTION update_community_member_count();

-- Update referral count
CREATE OR REPLACE FUNCTION update_referral_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE players 
        SET referrals_count = referrals_count + 1 
        WHERE id = NEW.referrer_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE players 
        SET referrals_count = referrals_count - 1 
        WHERE id = OLD.referrer_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_referral_count
    AFTER INSERT OR DELETE ON referrals
    FOR EACH ROW
    EXECUTE FUNCTION update_referral_count();

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- Player summary view
CREATE VIEW player_summary AS
SELECT 
    p.id,
    p.telegram_id,
    p.username,
    p.display_name,
    p.level,
    p.rank,
    p.experience,
    p.influence,
    p.supporters,
    p.power_tokens,
    p.referral_code,
    p.referrals_count,
    p.is_active,
    p.last_active_at,
    p.joined_at,
    p.generation,
    COUNT(pb.id) as badge_count,
    COUNT(pt.id) as title_count,
    COALESCE(cm.community_id, NULL) as community_id,
    cm.role as community_role
FROM players p
LEFT JOIN player_badges pb ON p.id = pb.player_id
LEFT JOIN player_titles pt ON p.id = pt.player_id
LEFT JOIN community_members cm ON p.id = cm.player_id
GROUP BY p.id, p.telegram_id, p.username, p.display_name, p.level, p.rank, 
         p.experience, p.influence, p.supporters, p.power_tokens, p.referral_code,
         p.referrals_count, p.is_active, p.last_active_at, p.joined_at, 
         p.generation, cm.community_id, cm.role;

-- Active players view (last 7 days)
CREATE VIEW active_players AS
SELECT 
    p.*,
    COUNT(gs.id) as session_count_7d,
    SUM(gs.session_duration) as total_time_7d,
    SUM(gs.missions_completed) as missions_completed_7d
FROM players p
LEFT JOIN game_sessions gs ON p.id = gs.player_id 
    AND gs.started_at >= NOW() - INTERVAL '7 days'
WHERE p.is_active = true
    AND p.last_active_at >= NOW() - INTERVAL '7 days'
GROUP BY p.id;

-- Leaderboard rankings view
CREATE VIEW leaderboard_rankings AS
SELECT 
    le.*,
    p.display_name,
    p.username,
    p.avatar_url,
    l.name as leaderboard_name,
    l.type as leaderboard_type,
    l.period as leaderboard_period
FROM leaderboard_entries le
JOIN players p ON le.player_id = p.id
JOIN leaderboards l ON le.leaderboard_id = l.id
WHERE l.is_active = true;

-- =============================================
-- INITIAL DATA SEEDING
-- =============================================

-- Create default economy state
INSERT INTO economy_state (date, total_players, active_players, total_tokens_minted, total_tokens_burned, circulating_supply)
VALUES (CURRENT_DATE, 0, 0, 0, 0, 0);

-- Create default impact metrics
INSERT INTO impact_metrics (date, active_users, new_users, missions_completed, learning_sessions_completed, communities_formed)
VALUES (CURRENT_DATE, 0, 0, 0, 0, 0);

-- =============================================
-- DATABASE PERFORMANCE OPTIMIZATION
-- =============================================

-- Set up partitioning for large tables (if needed in future)
-- This is a placeholder for future partitioning strategy

-- Create function to clean up old sessions
CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM game_sessions 
    WHERE started_at < NOW() - INTERVAL '30 days';
    
    DELETE FROM token_transactions 
    WHERE created_at < NOW() - INTERVAL '90 days';
    
    DELETE FROM social_shares 
    WHERE created_at < NOW() - INTERVAL '60 days';
END;
$$ LANGUAGE plpgsql;

-- Create index for JSONB queries
CREATE INDEX idx_players_metadata ON players USING gin((to_jsonb(players)));
CREATE INDEX idx_missions_requirements ON missions USING gin(requirements);
CREATE INDEX idx_missions_rewards ON missions USING gin(rewards);

-- =============================================
-- SECURITY AND AUDIT
-- =============================================

-- Create audit trigger for sensitive tables
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- This would log to an audit table in production
    -- For now, it's a placeholder
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Add audit triggers to sensitive tables
CREATE TRIGGER audit_players
    AFTER INSERT OR UPDATE OR DELETE ON players
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_token_transactions
    AFTER INSERT OR UPDATE ON token_transactions
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

-- =============================================
-- SCHEMA VERSION
-- =============================================

CREATE TABLE schema_version (
    version VARCHAR(50) PRIMARY KEY,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    description TEXT
);

INSERT INTO schema_version (version, description) 
VALUES ('1.0.0', 'Initial complete schema for People Power Journey');

-- =============================================
-- PERFORMANCE MONITORING
-- =============================================

-- Create view for table sizes
CREATE VIEW table_sizes AS
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Create view for index usage
CREATE VIEW index_usage AS
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
