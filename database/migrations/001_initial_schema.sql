-- Initial schema for People Power Journey
-- Created: 2026-02-22

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Players table
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    telegram_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(32),
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    
    -- Game progress
    level INTEGER DEFAULT 1 NOT NULL CHECK (level >= 1),
    rank VARCHAR(50) DEFAULT 'VOICE_STARTER' NOT NULL,
    experience BIGINT DEFAULT 0 NOT NULL CHECK (experience >= 0),
    influence BIGINT DEFAULT 0 NOT NULL CHECK (influence >= 0),
    supporters BIGINT DEFAULT 0 NOT NULL CHECK (supporters >= 0),
    
    -- Economy
    power_tokens BIGINT DEFAULT 0 NOT NULL CHECK (power_tokens >= 0),
    total_earned BIGINT DEFAULT 0 NOT NULL CHECK (total_earned >= 0),
    
    -- Social
    referral_code VARCHAR(8) UNIQUE NOT NULL,
    referred_by UUID REFERENCES players(id),
    referrals_count INTEGER DEFAULT 0 NOT NULL CHECK (referrals_count >= 0),
    community_id UUID,
    
    -- Status
    is_active BOOLEAN DEFAULT true NOT NULL,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Genesis Era
    generation VARCHAR(50) DEFAULT 'MASS_MOVEMENT' NOT NULL,
    permanent_bonus DECIMAL(5,4) DEFAULT 0.0000 NOT NULL CHECK (permanent_bonus >= 0 AND permanent_bonus <= 1),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Player badges
CREATE TABLE player_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    badge_name VARCHAR(100) NOT NULL,
    badge_description TEXT,
    badge_icon VARCHAR(50),
    rarity VARCHAR(20) DEFAULT 'common' NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(player_id, badge_name)
);

-- Player titles
CREATE TABLE player_titles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    title_name VARCHAR(100) NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(player_id, title_name)
);

-- Story chapters
CREATE TABLE story_chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    theme VARCHAR(50) NOT NULL,
    chapter_order INTEGER NOT NULL,
    narrative JSONB NOT NULL,
    missions JSONB NOT NULL,
    completion_rewards JSONB NOT NULL,
    unlock_requirements JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Player story progress
CREATE TABLE player_story_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES story_chapters(id) ON DELETE CASCADE,
    is_unlocked BOOLEAN DEFAULT false NOT NULL,
    is_completed BOOLEAN DEFAULT false NOT NULL,
    progress_data JSONB DEFAULT '{}' NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(player_id, chapter_id)
);

-- Missions
CREATE TABLE missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    mission_type VARCHAR(50) NOT NULL,
    category VARCHAR(20) DEFAULT 'daily' NOT NULL CHECK (category IN ('daily', 'weekly', 'story', 'special')),
    requirements JSONB NOT NULL,
    rewards JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Player missions
CREATE TABLE player_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    is_available BOOLEAN DEFAULT false NOT NULL,
    is_completed BOOLEAN DEFAULT false NOT NULL,
    progress INTEGER DEFAULT 0 NOT NULL CHECK (progress >= 0),
    max_progress INTEGER DEFAULT 1 NOT NULL CHECK (max_progress > 0),
    completed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(player_id, mission_id)
);

-- Communities
CREATE TABLE communities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    avatar_url TEXT,
    leader_id UUID NOT NULL REFERENCES players(id) ON DELETE RESTRICT,
    member_count INTEGER DEFAULT 1 NOT NULL CHECK (member_count >= 1),
    level INTEGER DEFAULT 1 NOT NULL CHECK (level >= 1),
    experience BIGINT DEFAULT 0 NOT NULL CHECK (experience >= 0),
    upgrades JSONB DEFAULT '[]' NOT NULL,
    is_public BOOLEAN DEFAULT true NOT NULL,
    join_code VARCHAR(10) UNIQUE,
    required_level INTEGER DEFAULT 1 NOT NULL CHECK (required_level >= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community members
CREATE TABLE community_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' NOT NULL CHECK (role IN ('leader', 'officer', 'member')),
    contribution BIGINT DEFAULT 0 NOT NULL CHECK (contribution >= 0),
    weekly_activity INTEGER DEFAULT 0 NOT NULL CHECK (weekly_activity >= 0),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(community_id, player_id)
);

-- Referrals
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    referred_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    referred_username VARCHAR(32) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'active', 'completed')),
    completed_at TIMESTAMP WITH TIME ZONE,
    rewards JSONB DEFAULT '[]' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(referrer_id, referred_id)
);

-- Leaderboards
CREATE TABLE leaderboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('global', 'regional', 'community', 'campus')),
    period VARCHAR(20) NOT NULL CHECK (period IN ('daily', 'weekly', 'seasonal', 'all_time')),
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
    resets_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaderboard entries
CREATE TABLE leaderboard_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leaderboard_id UUID NOT NULL REFERENCES leaderboards(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    rank_position INTEGER NOT NULL CHECK (rank_position > 0),
    score BIGINT NOT NULL,
    previous_rank INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(leaderboard_id, player_id)
);

-- Token transactions
CREATE TABLE token_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('earned', 'spent', 'bonus', 'penalty')),
    amount BIGINT NOT NULL,
    source VARCHAR(100) NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game sessions
CREATE TABLE game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_duration INTEGER DEFAULT 0 NOT NULL CHECK (session_duration >= 0),
    influence_gained BIGINT DEFAULT 0 NOT NULL CHECK (influence_gained >= 0),
    missions_completed INTEGER DEFAULT 0 NOT NULL CHECK (missions_completed >= 0),
    tokens_earned BIGINT DEFAULT 0 NOT NULL CHECK (tokens_earned >= 0),
    actions JSONB DEFAULT '[]' NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics events
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}' NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Viral events
CREATE TABLE viral_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) NOT NULL,
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
    rewards JSONB NOT NULL,
    requirements JSONB DEFAULT '{}' NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    participant_count INTEGER DEFAULT 0 NOT NULL CHECK (participant_count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seasonal achievements
CREATE TABLE seasonal_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    season INTEGER NOT NULL CHECK (season > 0),
    achievements JSONB DEFAULT '[]' NOT NULL,
    rewards JSONB DEFAULT '[]' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(player_id, season)
);

-- Create indexes for performance
CREATE INDEX idx_players_telegram_id ON players(telegram_id);
CREATE INDEX idx_players_referral_code ON players(referral_code);
CREATE INDEX idx_players_referred_by ON players(referred_by);
CREATE INDEX idx_players_community_id ON players(community_id);
CREATE INDEX idx_players_level ON players(level);
CREATE INDEX idx_players_influence ON players(influence);
CREATE INDEX idx_players_last_active_at ON players(last_active_at);

CREATE INDEX idx_player_missions_player_id ON player_missions(player_id);
CREATE INDEX idx_player_missions_mission_id ON player_missions(mission_id);
CREATE INDEX idx_player_missions_is_completed ON player_missions(is_completed);
CREATE INDEX idx_player_missions_expires_at ON player_missions(expires_at);

CREATE INDEX idx_community_members_community_id ON community_members(community_id);
CREATE INDEX idx_community_members_player_id ON community_members(player_id);
CREATE INDEX idx_community_members_role ON community_members(role);

CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred_id ON referrals(referred_id);
CREATE INDEX idx_referrals_status ON referrals(status);

CREATE INDEX idx_leaderboard_entries_leaderboard_id ON leaderboard_entries(leaderboard_id);
CREATE INDEX idx_leaderboard_entries_player_id ON leaderboard_entries(player_id);
CREATE INDEX idx_leaderboard_entries_rank_position ON leaderboard_entries(rank_position);

CREATE INDEX idx_token_transactions_player_id ON token_transactions(player_id);
CREATE INDEX idx_token_transactions_created_at ON token_transactions(created_at);
CREATE INDEX idx_token_transactions_transaction_type ON token_transactions(transaction_type);

CREATE INDEX idx_game_sessions_player_id ON game_sessions(player_id);
CREATE INDEX idx_game_sessions_started_at ON game_sessions(started_at);
CREATE INDEX idx_game_sessions_is_active ON game_sessions(is_active);

CREATE INDEX idx_analytics_events_player_id ON analytics_events(player_id);
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

-- Create trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_story_chapters_updated_at BEFORE UPDATE ON story_chapters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_player_story_progress_updated_at BEFORE UPDATE ON player_story_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_missions_updated_at BEFORE UPDATE ON missions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_player_missions_updated_at BEFORE UPDATE ON player_missions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communities_updated_at BEFORE UPDATE ON communities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leaderboard_entries_updated_at BEFORE UPDATE ON leaderboard_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_viral_events_updated_at BEFORE UPDATE ON viral_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
