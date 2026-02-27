-- TON Transactions table
CREATE TABLE IF NOT EXISTS ton_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    amount DECIMAL(20,8) NOT NULL,
    fee DECIMAL(20,8) NOT NULL,
    payment_type VARCHAR(50) NOT NULL DEFAULT 'game_payment',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    payment_id VARCHAR(100) UNIQUE,
    transaction_hash VARCHAR(100),
    payout_processed BOOLEAN DEFAULT FALSE,
    payout_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TON Stakes table
CREATE TABLE IF NOT EXISTS ton_stakes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    amount DECIMAL(20,8) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    staked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unstaked_at TIMESTAMP,
    transaction_hash VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player Badges table
CREATE TABLE IF NOT EXISTS player_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    badge_id INTEGER NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_hash VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, badge_id)
);

-- Admin Logs table
CREATE TABLE IF NOT EXISTS admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES players(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_id VARCHAR(100),
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add diamond_tier column to players table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'diamond_tier') THEN
        ALTER TABLE players ADD COLUMN diamond_tier INTEGER DEFAULT 0;
    END IF;
END $$;

-- Add status column to players table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'status') THEN
        ALTER TABLE players ADD COLUMN status VARCHAR(20) DEFAULT 'active';
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ton_transactions_player_id ON ton_transactions(player_id);
CREATE INDEX IF NOT EXISTS idx_ton_transactions_status ON ton_transactions(status);
CREATE INDEX IF NOT EXISTS idx_ton_transactions_created_at ON ton_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_ton_transactions_payment_id ON ton_transactions(payment_id);

CREATE INDEX IF NOT EXISTS idx_ton_stakes_player_id ON ton_stakes(player_id);
CREATE INDEX IF NOT EXISTS idx_ton_stakes_is_active ON ton_stakes(is_active);
CREATE INDEX IF NOT EXISTS idx_ton_stakes_staked_at ON ton_stakes(staked_at);

CREATE INDEX IF NOT EXISTS idx_player_badges_player_id ON player_badges(player_id);
CREATE INDEX IF NOT EXISTS idx_player_badges_badge_id ON player_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_player_badges_unlocked_at ON player_badges(unlocked_at);

CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_players_diamond_tier ON players(diamond_tier);
CREATE INDEX IF NOT EXISTS idx_players_status ON players(status);
CREATE INDEX IF NOT EXISTS idx_players_last_active_at ON players(last_active_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_ton_transactions_updated_at BEFORE UPDATE ON ton_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ton_stakes_updated_at BEFORE UPDATE ON ton_stakes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial badge types
INSERT INTO badge_types (id, name, description, unlock_cost, tier, is_active)
VALUES 
    (1, 'Infinity Pioneer', 'First payment milestone', 100, 1, true),
    (2, 'Infinity Explorer', 'Active participant', 500, 2, true),
    (3, 'Infinity Master', 'Power user', 1000, 3, true),
    (4, 'Infinity Legend', 'Elite contributor', 5000, 4, true),
    (5, 'Infinity God', 'Ultimate achievement', 10000, 5, true)
ON CONFLICT (id) DO NOTHING;

-- Grant permissions to the application user
GRANT SELECT, INSERT, UPDATE, DELETE ON ton_transactions TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ton_stakes TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON player_badges TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_logs TO app_user;
GRANT SELECT, INSERT, UPDATE ON players TO app_user;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO app_user;
