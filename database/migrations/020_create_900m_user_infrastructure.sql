-- 900M User Infrastructure Database Schema
-- Enterprise-grade database architecture for 900 million users

-- Database Sharding Configuration
CREATE TABLE IF NOT EXISTS shard_configuration (
    id SERIAL PRIMARY KEY,
    shard_id INTEGER NOT NULL UNIQUE,
    shard_type VARCHAR(50) NOT NULL, -- user, reputation, transaction, game_state, analytics
    database_host VARCHAR(255) NOT NULL,
    database_port INTEGER DEFAULT 5432,
    database_name VARCHAR(100) NOT NULL,
    region VARCHAR(50) NOT NULL,
    capacity_users INTEGER NOT NULL,
    current_users INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active', -- active, readonly, maintenance, offline
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User Sharding Map - Routes users to appropriate shards
CREATE TABLE IF NOT EXISTS user_shard_map (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL UNIQUE,
    shard_id INTEGER NOT NULL REFERENCES shard_configuration(shard_id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Global User Index - Tracks all users across shards
CREATE TABLE IF NOT EXISTS global_user_index (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    telegram_id VARCHAR(50),
    shard_id INTEGER NOT NULL REFERENCES shard_configuration(shard_id),
    status VARCHAR(20) DEFAULT 'active', -- active, suspended, deleted
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    total_influence BIGINT DEFAULT 0,
    total_pwr BIGINT DEFAULT 0
);

-- Regional User Statistics
CREATE TABLE IF NOT EXISTS regional_user_stats (
    id SERIAL PRIMARY KEY,
    region VARCHAR(50) NOT NULL,
    country VARCHAR(100) NOT NULL,
    total_users BIGINT DEFAULT 0,
    active_users BIGINT DEFAULT 0,
    new_users_today BIGINT DEFAULT 0,
    new_users_week BIGINT DEFAULT 0,
    new_users_month BIGINT DEFAULT 0,
    avg_session_duration INTEGER DEFAULT 0, -- seconds
    retention_rate DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(region, country)
);

-- Global Performance Metrics
CREATE TABLE IF NOT EXISTS global_performance_metrics (
    id SERIAL PRIMARY KEY,
    metric_date TIMESTAMP NOT NULL,
    total_users BIGINT DEFAULT 0,
    active_users BIGINT DEFAULT 0,
    concurrent_users BIGINT DEFAULT 0,
    api_requests_per_second BIGINT DEFAULT 0,
    database_queries_per_second BIGINT DEFAULT 0,
    websocket_connections BIGINT DEFAULT 0,
    avg_response_time_ms INTEGER DEFAULT 0,
    cpu_utilization DECIMAL(5,2) DEFAULT 0.00,
    memory_utilization DECIMAL(5,2) DEFAULT 0.00,
    storage_utilization DECIMAL(5,2) DEFAULT 0.00,
    network_bandwidth_mbps BIGINT DEFAULT 0,
    error_rate DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(metric_date)
);

-- Shard Performance Metrics
CREATE TABLE IF NOT EXISTS shard_performance_metrics (
    id SERIAL PRIMARY KEY,
    shard_id INTEGER NOT NULL REFERENCES shard_configuration(shard_id),
    metric_date TIMESTAMP NOT NULL,
    current_users BIGINT DEFAULT 0,
    active_users BIGINT DEFAULT 0,
    queries_per_second BIGINT DEFAULT 0,
    avg_response_time_ms INTEGER DEFAULT 0,
    cpu_utilization DECIMAL(5,2) DEFAULT 0.00,
    memory_utilization DECIMAL(5,2) DEFAULT 0.00,
    storage_utilization DECIMAL(5,2) DEFAULT 0.00,
    network_latency_ms INTEGER DEFAULT 0,
    error_rate DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(shard_id, metric_date)
);

-- Global Analytics Events
CREATE TABLE IF NOT EXISTS global_analytics_events (
    id SERIAL PRIMARY KEY,
    event_id UUID DEFAULT gen_random_uuid() UNIQUE,
    user_id VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL, -- login, game_action, purchase, social, educational
    event_data JSONB,
    shard_id INTEGER REFERENCES shard_configuration(shard_id),
    region VARCHAR(50),
    country VARCHAR(100),
    device_type VARCHAR(50),
    app_version VARCHAR(20),
    timestamp TIMESTAMP DEFAULT NOW(),
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- High-Frequency Event Partitioning (by date)
CREATE TABLE IF NOT EXISTS global_analytics_events_y2024m01 PARTITION OF global_analytics_events
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE IF NOT EXISTS global_analytics_events_y2024m02 PARTITION OF global_analytics_events
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Add more partitions as needed...

-- Global Leaderboard (Top 1000 per category)
CREATE TABLE IF NOT EXISTS global_leaderboard (
    id SERIAL PRIMARY KEY,
    leaderboard_type VARCHAR(50) NOT NULL, -- influence, pwr, reputation, achievements, social
    rank_position INTEGER NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    username VARCHAR(100) NOT NULL,
    score_value BIGINT NOT NULL,
    category VARCHAR(50), -- daily, weekly, monthly, all_time
    region VARCHAR(50),
    country VARCHAR(100),
    last_updated TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(leaderboard_type, category, rank_position)
);

-- Global Economic Metrics
CREATE TABLE IF NOT EXISTS global_economic_metrics (
    id SERIAL PRIMARY KEY,
    metric_date TIMESTAMP NOT NULL,
    total_influence_earned BIGINT DEFAULT 0,
    total_pwr_earned BIGINT DEFAULT 0,
    total_transactions BIGINT DEFAULT 0,
    total_volume_usd BIGINT DEFAULT 0,
    avg_transaction_size DECIMAL(18,8) DEFAULT 0.00,
    active_merchants INTEGER DEFAULT 0,
    active_mentors INTEGER DEFAULT 0,
    certificates_issued INTEGER DEFAULT 0,
    courses_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(metric_date)
);

-- Regional Economic Metrics
CREATE TABLE IF NOT EXISTS regional_economic_metrics (
    id SERIAL PRIMARY KEY,
    region VARCHAR(50) NOT NULL,
    country VARCHAR(100) NOT NULL,
    metric_date TIMESTAMP NOT NULL,
    total_influence_earned BIGINT DEFAULT 0,
    total_pwr_earned BIGINT DEFAULT 0,
    total_transactions BIGINT DEFAULT 0,
    total_volume_usd BIGINT DEFAULT 0,
    active_merchants INTEGER DEFAULT 0,
    active_mentors INTEGER DEFAULT 0,
    certificates_issued INTEGER DEFAULT 0,
    courses_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(region, country, metric_date)
);

-- Global Content Delivery Metrics
CREATE TABLE IF NOT EXISTS global_content_metrics (
    id SERIAL PRIMARY KEY,
    metric_date TIMESTAMP NOT NULL,
    total_requests BIGINT DEFAULT 0,
    cdn_hits BIGINT DEFAULT 0,
    cdn_misses BIGINT DEFAULT 0,
    avg_response_time_ms INTEGER DEFAULT 0,
    bandwidth_used_gb BIGINT DEFAULT 0,
    cache_hit_ratio DECIMAL(5,2) DEFAULT 0.00,
    popular_content JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(metric_date)
);

-- Global Security Metrics
CREATE TABLE IF NOT EXISTS global_security_metrics (
    id SERIAL PRIMARY KEY,
    metric_date TIMESTAMP NOT NULL,
    total_requests BIGINT DEFAULT 0,
    blocked_requests BIGINT DEFAULT 0,
    suspicious_ips BIGINT DEFAULT 0,
    ddos_attacks INTEGER DEFAULT 0,
    security_incidents INTEGER DEFAULT 0,
    fraud_attempts INTEGER DEFAULT 0,
        account_lockouts INTEGER DEFAULT 0,
    avg_threat_score DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(metric_date)
);

-- Global Compliance Metrics
CREATE TABLE IF NOT EXISTS global_compliance_metrics (
    id SERIAL PRIMARY KEY,
    metric_date TIMESTAMP NOT NULL,
    gdpr_requests INTEGER DEFAULT 0,
    ccpa_requests INTEGER DEFAULT 0,
    data_deletion_requests INTEGER DEFAULT 0,
    content_moderation_actions INTEGER DEFAULT 0,
    regulatory_reports INTEGER DEFAULT 0,
    compliance_score DECIMAL(5,2) DEFAULT 0.00,
    active_investigations INTEGER DEFAULT 0,
    resolved_investigations INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(metric_date)
);

-- Global Infrastructure Health
CREATE TABLE IF NOT EXISTS global_infrastructure_health (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    service_type VARCHAR(50) NOT NULL, -- database, api, websocket, cdn, payment, analytics
    region VARCHAR(50),
    status VARCHAR(20) NOT NULL, -- healthy, degraded, critical, offline
    uptime_percentage DECIMAL(5,2) DEFAULT 100.00,
    response_time_ms INTEGER DEFAULT 0,
    error_rate DECIMAL(5,2) DEFAULT 0.00,
    last_check TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Global Cost Tracking
CREATE TABLE IF NOT EXISTS global_cost_tracking (
    id SERIAL PRIMARY KEY,
    cost_date DATE NOT NULL,
    service_category VARCHAR(50) NOT NULL, -- infrastructure, cdn, database, security, analytics, team
    service_name VARCHAR(100) NOT NULL,
    region VARCHAR(50),
    cost_usd DECIMAL(18,2) NOT NULL,
    cost_per_user DECIMAL(10,4) DEFAULT 0.00,
        billing_unit VARCHAR(50), -- hourly, daily, monthly, annual
        currency VARCHAR(3) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(cost_date, service_category, service_name, region)
);

-- Global Capacity Planning
CREATE TABLE IF NOT EXISTS global_capacity_planning (
    id SERIAL PRIMARY KEY,
    planning_date DATE NOT NULL,
    service_name VARCHAR(100) NOT NULL,
    current_capacity BIGINT NOT NULL,
    projected_capacity BIGINT NOT NULL,
    required_capacity BIGINT NOT NULL,
    capacity_type VARCHAR(50) NOT NULL, -- users, requests, storage, bandwidth, compute
    region VARCHAR(50),
    urgency_level VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    action_required TEXT,
    estimated_cost DECIMAL(18,2),
    timeline_months INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(planning_date, service_name, capacity_type, region)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_shard_map_user ON user_shard_map(user_id);
CREATE INDEX IF NOT EXISTS idx_user_shard_map_shard ON user_shard_map(shard_id);
CREATE INDEX IF NOT EXISTS idx_global_user_index_telegram ON global_user_index(telegram_id);
CREATE INDEX IF NOT EXISTS idx_global_user_index_shard ON global_user_index(shard_id);
CREATE INDEX IF NOT EXISTS idx_global_user_index_status ON global_user_index(status);
CREATE INDEX IF NOT EXISTS idx_regional_user_stats_region ON regional_user_stats(region);
CREATE INDEX IF NOT EXISTS idx_regional_user_stats_country ON regional_user_stats(country);
CREATE INDEX IF NOT EXISTS idx_global_performance_metrics_date ON global_performance_metrics(metric_date);
CREATE INDEX IF NOT EXISTS idx_shard_performance_metrics_shard ON shard_performance_metrics(shard_id);
CREATE INDEX IF NOT EXISTS idx_shard_performance_metrics_date ON shard_performance_metrics(metric_date);
CREATE INDEX IF NOT EXISTS idx_global_analytics_events_user ON global_analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_global_analytics_events_type ON global_analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_global_analytics_events_timestamp ON global_analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_global_analytics_events_processed ON global_analytics_events(processed);
CREATE INDEX IF NOT EXISTS idx_global_leaderboard_type ON global_leaderboard(leaderboard_type);
CREATE INDEX IF NOT EXISTS idx_global_leaderboard_category ON global_leaderboard(category);
CREATE INDEX IF NOT EXISTS idx_global_leaderboard_rank ON global_leaderboard(rank_position);
CREATE INDEX IF NOT EXISTS idx_global_economic_metrics_date ON global_economic_metrics(metric_date);
CREATE INDEX IF NOT EXISTS idx_regional_economic_metrics_region ON regional_economic_metrics(region);
CREATE INDEX IF NOT EXISTS idx_regional_economic_metrics_country ON regional_economic_metrics(country);
CREATE INDEX IF NOT EXISTS idx_global_content_metrics_date ON global_content_metrics(metric_date);
CREATE INDEX IF NOT EXISTS idx_global_security_metrics_date ON global_security_metrics(metric_date);
CREATE INDEX IF NOT EXISTS idx_global_compliance_metrics_date ON global_compliance_metrics(metric_date);
CREATE INDEX IF NOT EXISTS idx_global_infrastructure_health_service ON global_infrastructure_health(service_name);
CREATE INDEX IF NOT EXISTS idx_global_infrastructure_health_status ON global_infrastructure_health(status);
CREATE INDEX IF NOT EXISTS idx_global_cost_tracking_date ON global_cost_tracking(cost_date);
CREATE INDEX IF NOT EXISTS idx_global_cost_tracking_category ON global_cost_tracking(service_category);
CREATE INDEX IF NOT EXISTS idx_global_capacity_planning_date ON global_capacity_planning(planning_date);
CREATE INDEX IF NOT EXISTS idx_global_capacity_planning_service ON global_capacity_planning(service_name);
CREATE INDEX IF NOT EXISTS idx_shard_configuration_type ON shard_configuration(shard_type);
CREATE INDEX IF NOT EXISTS idx_shard_configuration_region ON shard_configuration(region);
CREATE INDEX IF NOT EXISTS idx_shard_configuration_status ON shard_configuration(status);

-- Create triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_shard_configuration_updated_at BEFORE UPDATE ON shard_configuration FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_shard_map_updated_at BEFORE UPDATE ON user_shard_map FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_global_user_index_updated_at BEFORE UPDATE ON global_user_index FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_regional_user_stats_updated_at BEFORE UPDATE ON regional_user_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_global_infrastructure_health_updated_at BEFORE UPDATE ON global_infrastructure_health FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create views for comprehensive analytics
CREATE OR REPLACE VIEW global_user_summary AS
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN last_login >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as active_users_7d,
    COUNT(CASE WHEN last_login >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as active_users_30d,
    COUNT(CASE WHEN last_login >= CURRENT_DATE - INTERVAL '1 day' THEN 1 END) as active_users_1d,
    SUM(total_influence) as total_influence,
    SUM(total_pwr) as total_pwr,
    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as new_users_7d,
    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as new_users_30d
FROM global_user_index
WHERE status = 'active';

CREATE OR REPLACE VIEW shard_utilization_summary AS
SELECT 
    sc.shard_id,
    sc.shard_type,
    sc.region,
    sc.capacity_users,
    sc.current_users,
    ROUND((sc.current_users::DECIMAL / sc.capacity_users) * 100, 2) as utilization_percentage,
    sc.status,
    COUNT(gui.user_id) as confirmed_users
FROM shard_configuration sc
LEFT JOIN global_user_index gui ON sc.shard_id = gui.shard_id
WHERE sc.status = 'active'
GROUP BY sc.shard_id, sc.shard_type, sc.region, sc.capacity_users, sc.current_users, sc.status
ORDER BY utilization_percentage DESC;

CREATE OR REPLACE VIEW regional_performance_summary AS
SELECT 
    rus.region,
    rus.country,
    rus.total_users,
    rus.active_users,
    rus.new_users_today,
    rus.avg_session_duration,
    rus.retention_rate,
    gpm.avg_response_time_ms,
    gpm.error_rate
FROM regional_user_stats rus
LEFT JOIN global_performance_metrics gpm ON DATE_TRUNC('day', gpm.metric_date) = DATE_TRUNC('day', rus.updated_at)
ORDER BY rus.total_users DESC;

-- Initialize shard configuration for 900M users
INSERT INTO shard_configuration (shard_id, shard_type, database_host, database_name, region, capacity_users) VALUES
-- User shards (10K users per shard = 90K shards)
(1, 'user', 'us-east-1.cluster1.amazonaws.com', 'people_power_users_001', 'us-east-1', 10000),
(2, 'user', 'us-east-1.cluster1.amazonaws.com', 'people_power_users_002', 'us-east-1', 10000),
(3, 'user', 'us-east-1.cluster1.amazonaws.com', 'people_power_users_003', 'us-east-1', 10000),
(4, 'user', 'us-east-1.cluster1.amazonaws.com', 'people_power_users_004', 'us-east-1', 10000),
(5, 'user', 'us-east-1.cluster1.amazonaws.com', 'people_power_users_005', 'us-east-1', 10000),
-- Reputation shards (5K users per shard = 180K shards)
(100001, 'reputation', 'us-east-1.cluster2.amazonaws.com', 'people_power_reputation_001', 'us-east-1', 5000),
(100002, 'reputation', 'us-east-1.cluster2.amazonaws.com', 'people_power_reputation_002', 'us-east-1', 5000),
(100003, 'reputation', 'us-east-1.cluster2.amazonaws.com', 'people_power_reputation_003', 'us-east-1', 5000),
(100004, 'reputation', 'us-east-1.cluster2.amazonaws.com', 'people_power_reputation_004', 'us-east-1', 5000),
(100005, 'reputation', 'us-east-1.cluster2.amazonaws.com', 'people_power_reputation_005', 'us-east-1', 5000),
-- Transaction shards (20K users per shard = 45K shards)
(200001, 'transaction', 'us-east-1.cluster3.amazonaws.com', 'people_power_transactions_001', 'us-east-1', 20000),
(200002, 'transaction', 'us-east-1.cluster3.amazonaws.com', 'people_power_transactions_002', 'us-east-1', 20000),
(200003, 'transaction', 'us-east-1.cluster3.amazonaws.com', 'people_power_transactions_003', 'us-east-1', 20000),
(200004, 'transaction', 'us-east-1.cluster3.amazonaws.com', 'people_power_transactions_004', 'us-east-1', 20000),
(200005, 'transaction', 'us-east-1.cluster3.amazonaws.com', 'people_power_transactions_005', 'us-east-1', 20000),
-- Game state shards (15K users per shard = 60K shards)
(300001, 'game_state', 'us-east-1.cluster4.amazonaws.com', 'people_power_gamestate_001', 'us-east-1', 15000),
(300002, 'game_state', 'us-east-1.cluster4.amazonaws.com', 'people_power_gamestate_002', 'us-east-1', 15000),
(300003, 'game_state', 'us-east-1.cluster4.amazonaws.com', 'people_power_gamestate_003', 'us-east-1', 15000),
(300004, 'game_state', 'us-east-1.cluster4.amazonaws.com', 'people_power_gamestate_004', 'us-east-1', 15000),
(300005, 'game_state', 'us-east-1.cluster4.amazonaws.com', 'people_power_gamestate_005', 'us-east-1', 15000),
-- Analytics shards (50K users per shard = 18K shards)
(400001, 'analytics', 'us-east-1.cluster5.amazonaws.com', 'people_power_analytics_001', 'us-east-1', 50000),
(400002, 'analytics', 'us-east-1.cluster5.amazonaws.com', 'people_power_analytics_002', 'us-east-1', 50000),
(400003, 'analytics', 'us-east-1.cluster5.amazonaws.com', 'people_power_analytics_003', 'us-east-1', 50000),
(400004, 'analytics', 'us-east-1.cluster5.amazonaws.com', 'people_power_analytics_004', 'us-east-1', 50000),
(400005, 'analytics', 'us-east-1.cluster5.amazonaws.com', 'people_power_analytics_005', 'us-east-1', 50000)
ON CONFLICT DO NOTHING;

-- Initialize regional user statistics
INSERT INTO regional_user_stats (region, country, total_users, active_users) VALUES
('africa', 'nigeria', 50000000, 35000000),
('africa', 'south_africa', 25000000, 17500000),
('africa', 'kenya', 20000000, 14000000),
('africa', 'ghana', 15000000, 10500000),
('africa', 'egypt', 30000000, 21000000),
('asia', 'india', 200000000, 140000000),
('asia', 'pakistan', 80000000, 56000000),
('asia', 'bangladesh', 60000000, 42000000),
('asia', 'indonesia', 100000000, 70000000),
('asia', 'philippines', 50000000, 35000000),
('europe', 'united_kingdom', 40000000, 28000000),
('europe', 'germany', 30000000, 21000000),
('europe', 'france', 25000000, 17500000),
('europe', 'italy', 20000000, 14000000),
('europe', 'spain', 15000000, 10500000),
('americas', 'united_states', 100000000, 70000000),
('americas', 'brazil', 80000000, 56000000),
('americas', 'mexico', 40000000, 28000000),
('americas', 'canada', 20000000, 14000000),
('americas', 'argentina', 15000000, 10500000)
ON CONFLICT DO NOTHING;

-- Initialize global infrastructure health
INSERT INTO global_infrastructure_health (service_name, service_type, region, status, uptime_percentage, response_time_ms) VALUES
('api-gateway-1', 'api', 'us-east-1', 'healthy', 99.99, 45),
('api-gateway-2', 'api', 'eu-west-1', 'healthy', 99.98, 52),
('api-gateway-3', 'api', 'ap-southeast-1', 'healthy', 99.97, 48),
('database-cluster-1', 'database', 'us-east-1', 'healthy', 99.99, 35),
('database-cluster-2', 'database', 'eu-west-1', 'healthy', 99.98, 42),
('database-cluster-3', 'database', 'ap-southeast-1', 'healthy', 99.97, 38),
('websocket-cluster-1', 'websocket', 'us-east-1', 'healthy', 99.99, 25),
('websocket-cluster-2', 'websocket', 'eu-west-1', 'healthy', 99.98, 28),
('websocket-cluster-3', 'websocket', 'ap-southeast-1', 'healthy', 99.97, 30),
('cdn-cloudflare', 'cdn', 'global', 'healthy', 99.99, 15),
('payment-stripe', 'payment', 'global', 'healthy', 99.99, 120),
('analytics-clickhouse', 'analytics', 'global', 'healthy', 99.98, 85)
ON CONFLICT DO NOTHING;
