-- Influence Gameplay Integration Database Schema
-- Deep implementation of all gameplay mechanics for Influence currency

-- Extended Influence Earning Events Table (already exists in main schema)
-- This table will store all gameplay-related influence earnings

-- Daily Login Tracking
CREATE TABLE IF NOT EXISTS daily_login_tracker (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    login_date DATE NOT NULL,
    login_time TIMESTAMP DEFAULT NOW(),
    bonus_claimed BOOLEAN DEFAULT false,
    bonus_amount INTEGER DEFAULT 100,
    streak_days INTEGER DEFAULT 1,
    last_login_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, login_date)
);

-- Achievement Definitions
CREATE TABLE IF NOT EXISTS achievement_definitions (
    id SERIAL PRIMARY KEY,
    achievement_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- onboarding, social, competitive, referral, progression
    difficulty VARCHAR(20) NOT NULL, -- bronze, silver, gold, platinum, diamond
    reward_min INTEGER NOT NULL,
    reward_max INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    requirements JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User Achievement Progress
CREATE TABLE IF NOT EXISTS user_achievement_progress (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    achievement_id VARCHAR(100) REFERENCES achievement_definitions(achievement_id),
    progress_data JSONB,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP,
    reward_claimed BOOLEAN DEFAULT false,
    reward_claimed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Social Interaction Tracking
CREATE TABLE IF NOT EXISTS social_interactions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    interaction_type VARCHAR(50) NOT NULL, -- like, comment, share, follow, gift, collaborate, mentor
    target_user_id VARCHAR(50),
    target_content_id VARCHAR(100),
    interaction_data JSONB,
    influence_earned INTEGER NOT NULL,
    interaction_time TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Referral Tracking
CREATE TABLE IF NOT EXISTS referral_tracking (
    id SERIAL PRIMARY KEY,
    referral_code VARCHAR(100) UNIQUE NOT NULL,
    referrer_id VARCHAR(50) NOT NULL,
    referred_user_id VARCHAR(50),
    referral_type VARCHAR(20) DEFAULT 'basic', -- basic, premium, vip, ambassador
    referral_status VARCHAR(20) DEFAULT 'pending', -- pending, completed, expired
    bonus_amount INTEGER,
    referral_date TIMESTAMP,
    completion_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tournament Definitions
CREATE TABLE IF NOT EXISTS tournament_definitions (
    id SERIAL PRIMARY KEY,
    tournament_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL, -- casual, competitive, professional, championship, world_championship
    entry_fee INTEGER NOT NULL,
    reward_min INTEGER NOT NULL,
    reward_max INTEGER NOT NULL,
    max_participants INTEGER NOT NULL,
    current_participants INTEGER DEFAULT 0,
    start_time TIMESTAMP NOT NULL,
    duration_hours INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'upcoming', -- upcoming, active, completed, cancelled
    tournament_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tournament Participants
CREATE TABLE IF NOT EXISTS tournament_participants (
    id SERIAL PRIMARY KEY,
    tournament_id VARCHAR(100) REFERENCES tournament_definitions(tournament_id),
    user_id VARCHAR(50) NOT NULL,
    registration_time TIMESTAMP DEFAULT NOW(),
    entry_fee_paid BOOLEAN DEFAULT false,
    final_position INTEGER,
    reward_earned INTEGER,
    reward_claimed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tournament_id, user_id)
);

-- Tournament Results
CREATE TABLE IF NOT EXISTS tournament_results (
    id SERIAL PRIMARY KEY,
    tournament_id VARCHAR(100) REFERENCES tournament_definitions(tournament_id),
    user_id VARCHAR(50) NOT NULL,
    position INTEGER NOT NULL,
    base_reward INTEGER NOT NULL,
    position_multiplier DECIMAL(3,2) NOT NULL,
    final_reward INTEGER NOT NULL,
    completion_time TIMESTAMP,
    result_data JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Gameplay Session Tracking
CREATE TABLE IF NOT EXISTS gameplay_sessions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    session_start TIMESTAMP DEFAULT NOW(),
    session_end TIMESTAMP,
    session_duration INTEGER, -- in seconds
    activities JSONB,
    influence_earned INTEGER DEFAULT 0,
    achievements_unlocked JSONB,
    social_interactions_count INTEGER DEFAULT 0,
    tournaments_played JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Daily Gameplay Stats
CREATE TABLE IF NOT EXISTS daily_gameplay_stats (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    stat_date DATE NOT NULL,
    login_count INTEGER DEFAULT 0,
    total_influence_earned INTEGER DEFAULT 0,
    achievements_completed INTEGER DEFAULT 0,
    social_interactions INTEGER DEFAULT 0,
    referrals_made INTEGER DEFAULT 0,
    tournaments_played INTEGER DEFAULT 0,
    tournament_wins INTEGER DEFAULT 0,
    session_time_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, stat_date)
);

-- Leaderboard Rankings
CREATE TABLE IF NOT EXISTS influence_leaderboard (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    ranking_type VARCHAR(50) NOT NULL, -- daily, weekly, monthly, all_time
    rank_position INTEGER NOT NULL,
    total_influence INTEGER NOT NULL,
    ranking_period DATE,
    additional_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_daily_login_tracker_user ON daily_login_tracker(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_login_tracker_date ON daily_login_tracker(login_date);
CREATE INDEX IF NOT EXISTS idx_achievement_definitions_category ON achievement_definitions(category);
CREATE INDEX IF NOT EXISTS idx_achievement_definitions_difficulty ON achievement_definitions(difficulty);
CREATE INDEX IF NOT EXISTS idx_user_achievement_progress_user ON user_achievement_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievement_progress_achievement ON user_achievement_progress(achievement_id);
CREATE INDEX IF NOT EXISTS idx_social_interactions_user ON social_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_social_interactions_type ON social_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_social_interactions_time ON social_interactions(interaction_time);
CREATE INDEX IF NOT EXISTS idx_referral_tracking_referrer ON referral_tracking(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_tracking_code ON referral_tracking(referral_code);
CREATE INDEX IF NOT EXISTS idx_tournament_definitions_type ON tournament_definitions(type);
CREATE INDEX IF NOT EXISTS idx_tournament_definitions_status ON tournament_definitions(status);
CREATE INDEX IF NOT EXISTS idx_tournament_definitions_start ON tournament_definitions(start_time);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_tournament ON tournament_participants(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_user ON tournament_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_tournament_results_tournament ON tournament_results(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_results_user ON tournament_results(user_id);
CREATE INDEX IF NOT EXISTS idx_tournament_results_position ON tournament_results(position);
CREATE INDEX IF NOT EXISTS idx_gameplay_sessions_user ON gameplay_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_gameplay_sessions_start ON gameplay_sessions(session_start);
CREATE INDEX IF NOT EXISTS idx_daily_gameplay_stats_user ON daily_gameplay_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_gameplay_stats_date ON daily_gameplay_stats(stat_date);
CREATE INDEX IF NOT EXISTS idx_influence_leaderboard_user ON influence_leaderboard(user_id);
CREATE INDEX IF NOT EXISTS idx_influence_leaderboard_type ON influence_leaderboard(ranking_type);
CREATE INDEX IF NOT EXISTS idx_influence_leaderboard_period ON influence_leaderboard(ranking_period);

-- Create triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_achievement_progress_updated_at BEFORE UPDATE ON user_achievement_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tournament_definitions_updated_at BEFORE UPDATE ON tournament_definitions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_gameplay_stats_updated_at BEFORE UPDATE ON daily_gameplay_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_influence_leaderboard_updated_at BEFORE UPDATE ON influence_leaderboard FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create views for comprehensive gameplay analytics
CREATE OR REPLACE VIEW user_gameplay_summary AS
SELECT 
    u.user_id,
    ic.influence_balance,
    ic.influence_earned,
    ic.influence_spent,
    COALESCE(dls.total_sessions, 0) as total_sessions,
    COALESCE(dls.total_influence_earned, 0) as total_gameplay_influence,
    COALESCE(dls.total_achievements, 0) as total_achievements,
    COALESCE(dls.total_social_interactions, 0) as total_social_interactions,
    COALESCE(dls.total_referrals, 0) as total_referrals,
    COALESCE(dls.total_tournament_wins, 0) as total_tournament_wins,
    COALESCE(dls.total_session_time, 0) as total_session_time_seconds,
    uap.completed_achievements_count,
    rt.referrals_count,
    tr.tournaments_participated_count,
    tr.tournaments_won_count
FROM influence_currency ic
LEFT JOIN (
    SELECT 
        user_id,
        COUNT(*) as total_sessions,
        SUM(total_influence_earned) as total_influence_earned,
        SUM(achievements_completed) as total_achievements,
        SUM(social_interactions) as total_social_interactions,
        SUM(referrals_made) as total_referrals,
        SUM(tournament_wins) as total_tournament_wins,
        SUM(session_time_seconds) as total_session_time_seconds
    FROM daily_gameplay_stats
    GROUP BY user_id
) dls ON ic.user_id = dls.user_id
LEFT JOIN (
    SELECT 
        user_id,
        COUNT(*) as completed_achievements_count
    FROM user_achievement_progress
    WHERE is_completed = true
    GROUP BY user_id
) uap ON ic.user_id = uap.user_id
LEFT JOIN (
    SELECT 
        referrer_id as user_id,
        COUNT(*) as referrals_count
    FROM referral_tracking
    WHERE referral_status = 'completed'
    GROUP BY referrer_id
) rt ON ic.user_id = rt.user_id
LEFT JOIN (
    SELECT 
        user_id,
        COUNT(*) as tournaments_participated_count,
        SUM(CASE WHEN final_position = 1 THEN 1 ELSE 0 END) as tournaments_won_count
    FROM tournament_participants
    WHERE entry_fee_paid = true
    GROUP BY user_id
) tr ON ic.user_id = tr.user_id;

CREATE OR REPLACE VIEW tournament_analytics AS
SELECT 
    td.tournament_id,
    td.name,
    td.type,
    td.entry_fee,
    td.reward_min,
    td.reward_max,
    td.max_participants,
    td.current_participants,
    td.start_time,
    td.status,
    COALESCE(tp.participant_count, 0) as actual_participants,
    COALESCE(tr.total_rewards_paid, 0) as total_rewards_paid,
    COALESCE(tr.average_reward, 0) as average_reward,
    COALESCE(tr.total_positions, 0) as total_positions
FROM tournament_definitions td
LEFT JOIN (
    SELECT 
        tournament_id,
        COUNT(*) as participant_count
    FROM tournament_participants
    WHERE entry_fee_paid = true
    GROUP BY tournament_id
) tp ON td.tournament_id = tp.tournament_id
LEFT JOIN (
    SELECT 
        tournament_id,
        COUNT(*) as total_positions,
        SUM(final_reward) as total_rewards_paid,
        AVG(final_reward) as average_reward
    FROM tournament_results
    GROUP BY tournament_id
) tr ON td.tournament_id = tr.tournament_id
ORDER BY td.start_time DESC;

CREATE OR REPLACE VIEW achievement_analytics AS
SELECT 
    ad.category,
    ad.difficulty,
    COUNT(*) as total_achievements,
    COUNT(CASE WHEN uap.is_completed = true THEN 1 END) as completed_count,
    COUNT(CASE WHEN uap.is_completed = false THEN 1 END) as pending_count,
    AVG(ad.reward_min) as average_min_reward,
    AVG(ad.reward_max) as average_max_reward,
    COUNT(CASE WHEN uap.reward_claimed = true THEN 1 END) as rewards_claimed_count
FROM achievement_definitions ad
LEFT JOIN user_achievement_progress uap ON ad.achievement_id = uap.achievement_id
WHERE ad.is_active = true
GROUP BY ad.category, ad.difficulty
ORDER BY ad.category, ad.difficulty;

-- Insert initial achievement definitions
INSERT INTO achievement_definitions (achievement_id, name, description, category, difficulty, reward_min, reward_max, requirements) VALUES
('first_login', 'First Steps', 'Log in for the first time', 'onboarding', 'bronze', 50, 150, '{"login_count": 1}'),
('daily_warrior', 'Daily Warrior', 'Log in for 7 consecutive days', 'onboarding', 'silver', 100, 300, '{"consecutive_days": 7}'),
('social_butterfly', 'Social Butterfly', 'Make 10 social interactions', 'social', 'silver', 100, 300, '{"interactions_required": 10}'),
('social_influencer', 'Social Influencer', 'Make 50 social interactions', 'social', 'gold', 200, 500, '{"interactions_required": 50}'),
('first_referral', 'First Referral', 'Refer your first user', 'referral', 'bronze', 50, 150, '{"referrals_required": 1}'),
('referral_master', 'Referral Master', 'Refer 5 new users', 'referral', 'platinum', 400, 750, '{"referrals_required": 5}'),
('tournament_participant', 'Tournament Participant', 'Participate in your first tournament', 'competitive', 'bronze', 50, 150, '{"tournaments_required": 1}'),
('tournament_champion', 'Tournament Champion', 'Win a competitive tournament', 'competitive', 'gold', 200, 500, '{"tournament_type": "competitive", "position": 1}'),
('level_10', 'Rising Star', 'Reach level 10', 'progression', 'bronze', 50, 150, '{"level_required": 10}'),
('level_25', 'Experienced Player', 'Reach level 25', 'progression', 'silver', 100, 300, '{"level_required": 25}'),
('level_50', 'Legendary Player', 'Reach level 50', 'progression', 'diamond', 600, 1000, '{"level_required": 50}')
ON CONFLICT (achievement_id) DO NOTHING;

-- Insert sample tournament definitions
INSERT INTO tournament_definitions (tournament_id, name, type, entry_fee, reward_min, reward_max, max_participants, start_time, duration_hours, status) VALUES
('daily_casual_001', 'Daily Casual Tournament', 'casual', 100, 1000, 2500, 100, NOW() + INTERVAL '1 hour', 2, 'upcoming'),
('weekly_competitive_001', 'Weekly Competitive Tournament', 'competitive', 500, 2000, 5000, 500, NOW() + INTERVAL '24 hours', 4, 'upcoming'),
('monthly_professional_001', 'Monthly Professional Tournament', 'professional', 2000, 5000, 15000, 1000, NOW() + INTERVAL '3 days', 6, 'upcoming'),
('quarterly_championship_001', 'Quarterly Championship', 'championship', 5000, 10000, 25000, 2000, NOW() + INTERVAL '7 days', 8, 'upcoming')
ON CONFLICT (tournament_id) DO NOTHING;
