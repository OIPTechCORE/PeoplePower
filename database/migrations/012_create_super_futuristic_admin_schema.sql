-- ===================================
-- SUPER FUTURISTIC SUPER ADMIN DATABASE SCHEMA
-- ULTIMATE INFRASTRUCTURE COMMAND CENTER
-- ===================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ===================================
-- SUPER ADMIN AUTHENTICATION & ACCESS
-- ===================================

-- Enhanced super admin dashboard table
CREATE TABLE super_admin_dashboard (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    access_level VARCHAR(50) NOT NULL CHECK (access_level IN ('READ_ONLY', 'MODERATOR', 'ADMINISTRATOR', 'SUPER_ADMIN', 'SYSTEM_OWNER')),
    
    -- Multi-factor authentication
    password_hash VARCHAR(255) NOT NULL,
    session_token VARCHAR(500) UNIQUE,
    biometric_hash VARCHAR(500),
    two_factor_secret VARCHAR(100),
    
    -- Security settings
    is_active BOOLEAN DEFAULT true NOT NULL,
    account_locked BOOLEAN DEFAULT false NOT NULL,
    failed_login_attempts INTEGER DEFAULT 0,
    last_failed_login TIMESTAMP WITH TIME ZONE,
    
    -- Session management
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_duration INTEGER DEFAULT 0,
    ip_address INET,
    user_agent TEXT,
    
    -- Permissions and restrictions
    allowed_domains TEXT[],
    restricted_actions TEXT[],
    emergency_access BOOLEAN DEFAULT false NOT NULL,
    
    -- Audit trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES super_admin_dashboard(admin_id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES super_admin_dashboard(admin_id)
);

-- Admin action log
CREATE TABLE admin_action_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES super_admin_dashboard(admin_id),
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id UUID,
    old_values JSONB,
    new_values JSONB,
    reason TEXT,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id VARCHAR(100)
);

-- Failed login attempts
CREATE TABLE failed_login_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES super_admin_dashboard(admin_id),
    email VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    attempt_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    failure_reason VARCHAR(100)
);

-- ===================================
-- CIVILIZATION OVERVIEW DATA
-- ===================================

-- Real-time civilization metrics
CREATE TABLE civilization_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_date DATE UNIQUE NOT NULL,
    
    -- Population metrics
    total_citizens INTEGER NOT NULL DEFAULT 0,
    active_citizens INTEGER NOT NULL DEFAULT 0,
    new_citizens INTEGER NOT NULL DEFAULT 0,
    citizen_growth_rate DECIMAL(5,4) DEFAULT 0.0000,
    
    -- Economic metrics
    daily_revenue DECIMAL(15,4) NOT NULL DEFAULT 0.0000,
    total_token_supply DECIMAL(20,4) NOT NULL DEFAULT 0.0000,
    daily_transactions INTEGER NOT NULL DEFAULT 0,
    transaction_volume DECIMAL(15,4) NOT NULL DEFAULT 0.0000,
    
    -- System health metrics
    system_health_score DECIMAL(5,2) DEFAULT 100.00,
    error_count INTEGER DEFAULT 0,
    response_time_avg DECIMAL(8,2) DEFAULT 0.00,
    uptime_percentage DECIMAL(5,2) DEFAULT 100.00,
    
    -- Security metrics
    high_threat_count INTEGER DEFAULT 0,
    failed_logins INTEGER DEFAULT 0,
    security_incidents INTEGER DEFAULT 0,
    
    -- Governance metrics
    active_proposals INTEGER DEFAULT 0,
    council_members INTEGER DEFAULT 0,
    voter_participation DECIMAL(5,2) DEFAULT 0.00,
    
    -- Education metrics
    active_courses INTEGER DEFAULT 0,
    daily_enrollments INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.00,
    
    -- Infrastructure metrics
    total_countries INTEGER DEFAULT 0,
    total_communities INTEGER DEFAULT 0,
    global_citizens INTEGER DEFAULT 0,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time activity feed
CREATE TABLE real_time_activity_feed (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_type VARCHAR(50) NOT NULL,
    user_id UUID REFERENCES players(id),
    username VARCHAR(100),
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- AI insights and predictions
CREATE TABLE ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    insight_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    confidence_score DECIMAL(5,2) DEFAULT 0.00,
    data_source VARCHAR(100),
    recommendation TEXT,
    action_taken BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    acknowledged_by UUID REFERENCES super_admin_dashboard(admin_id)
);

-- ===================================
-- POPULATION CONTROL ANALYTICS
-- ===================================

-- User behavior analytics
CREATE TABLE user_behavior_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    behavior_pattern VARCHAR(100) NOT NULL,
    user_count INTEGER NOT NULL DEFAULT 0,
    frequency DECIMAL(8,2) DEFAULT 0.00,
    avg_session_duration DECIMAL(8,2) DEFAULT 0.00,
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    revenue_impact DECIMAL(15,4) DEFAULT 0.0000,
    risk_score DECIMAL(5,2) DEFAULT 0.00,
    analysis_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User journey mapping
CREATE TABLE user_journey_mapping (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journey_stage VARCHAR(50) NOT NULL,
    stage_name VARCHAR(100) NOT NULL,
    stage_order INTEGER NOT NULL,
    user_count INTEGER NOT NULL DEFAULT 0,
    avg_time_in_stage DECIMAL(8,2) DEFAULT 0.00,
    dropoff_rate DECIMAL(5,2) DEFAULT 0.00,
    completion_rate DECIMAL(5,2) DEFAULT 0.00,
    next_stage_conversion DECIMAL(5,2) DEFAULT 0.00,
    analysis_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Churn prediction model
CREATE TABLE churn_prediction_model (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES players(id),
    churn_probability DECIMAL(5,4) NOT NULL,
    risk_factors JSONB DEFAULT '[]',
    recommended_actions JSONB DEFAULT '[]',
    prediction_confidence DECIMAL(5,2) DEFAULT 0.00,
    model_version VARCHAR(20),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    prediction_date DATE NOT NULL
);

-- User lifecycle analytics
CREATE TABLE user_lifecycle_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lifecycle_stage VARCHAR(50) NOT NULL,
    user_count INTEGER NOT NULL DEFAULT 0,
    avg_days_in_stage DECIMAL(8,2) DEFAULT 0.00,
    avg_revenue_per_user DECIMAL(15,4) DEFAULT 0.0000,
    churn_rate DECIMAL(5,2) DEFAULT 0.00,
    retention_rate DECIMAL(5,2) DEFAULT 0.00,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- ECONOMIC COMMAND CENTER
-- ===================================

-- Economic projections
CREATE TABLE economic_projections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    projection_period VARCHAR(50) NOT NULL,
    projected_revenue DECIMAL(15,4) NOT NULL,
    confidence_level DECIMAL(5,2) DEFAULT 0.00,
    key_assumptions JSONB DEFAULT '[]',
    risk_factors JSONB DEFAULT '[]',
    model_version VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actual_revenue DECIMAL(15,4),
    accuracy_score DECIMAL(5,2)
);

-- Token economy analytics
CREATE TABLE token_economy_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_date DATE UNIQUE NOT NULL,
    
    -- Supply metrics
    total_supply DECIMAL(20,4) NOT NULL DEFAULT 0.0000,
    circulating_supply DECIMAL(20,4) NOT NULL DEFAULT 0.0000,
    daily_minted DECIMAL(15,4) NOT NULL DEFAULT 0.0000,
    daily_burned DECIMAL(15,4) NOT NULL DEFAULT 0.0000,
    
    -- Demand metrics
    daily_volume DECIMAL(15,4) NOT NULL DEFAULT 0.0000,
    active_holders INTEGER NOT NULL DEFAULT 0,
    holder_growth_rate DECIMAL(5,4) DEFAULT 0.0000,
    
    -- Value metrics
    market_cap DECIMAL(20,4) NOT NULL DEFAULT 0.0000,
    price_usd DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
    price_change_24h DECIMAL(5,4) DEFAULT 0.0000,
    
    -- Distribution metrics
    top_10_holder_percentage DECIMAL(5,2) DEFAULT 0.00,
    gini_coefficient DECIMAL(5,4) DEFAULT 0.0000,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketplace performance analytics
CREATE TABLE marketplace_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    performance_date DATE UNIQUE NOT NULL,
    
    -- Volume metrics
    total_volume DECIMAL(15,4) NOT NULL DEFAULT 0.0000,
    transaction_count INTEGER NOT NULL DEFAULT 0,
    active_listings INTEGER NOT NULL DEFAULT 0,
    
    -- Price metrics
    avg_price DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
    median_price DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
    price_volatility DECIMAL(5,4) DEFAULT 0.0000,
    
    -- Category performance
    category_breakdown JSONB DEFAULT '{}',
    
    -- User metrics
    unique_buyers INTEGER NOT NULL DEFAULT 0,
    unique_sellers INTEGER NOT NULL DEFAULT 0,
    seller_success_rate DECIMAL(5,2) DEFAULT 0.00,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- INFRASTRUCTURE MONITORING
-- ===================================

-- Server metrics
CREATE TABLE server_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    server_name VARCHAR(100) NOT NULL,
    server_type VARCHAR(50) NOT NULL,
    
    -- Resource metrics
    cpu_usage DECIMAL(5,2) DEFAULT 0.00,
    memory_usage DECIMAL(5,2) DEFAULT 0.00,
    disk_usage DECIMAL(5,2) DEFAULT 0.00,
    disk_io_read DECIMAL(10,2) DEFAULT 0.00,
    disk_io_write DECIMAL(10,2) DEFAULT 0.00,
    
    -- Network metrics
    network_in DECIMAL(12,2) DEFAULT 0.00,
    network_out DECIMAL(12,2) DEFAULT 0.00,
    network_connections INTEGER DEFAULT 0,
    
    -- System metrics
    load_average DECIMAL(5,2) DEFAULT 0.00,
    uptime INTEGER DEFAULT 0,
    process_count INTEGER DEFAULT 0,
    
    -- Health metrics
    temperature DECIMAL(5,2) DEFAULT 0.00,
    power_consumption DECIMAL(8,2) DEFAULT 0.00,
    
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(server_name, last_updated)
);

-- API performance metrics
CREATE TABLE api_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    endpoint VARCHAR(200) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER NOT NULL,
    response_time INTEGER NOT NULL,
    request_size INTEGER DEFAULT 0,
    response_size INTEGER DEFAULT 0,
    user_id UUID REFERENCES players(id),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Database performance metrics
CREATE TABLE database_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Connection metrics
    active_connections INTEGER DEFAULT 0,
    max_connections INTEGER DEFAULT 0,
    connection_utilization DECIMAL(5,2) DEFAULT 0.00,
    
    -- Query metrics
    queries_per_second DECIMAL(8,2) DEFAULT 0.00,
    avg_query_time DECIMAL(8,2) DEFAULT 0.00,
    slow_queries INTEGER DEFAULT 0,
    
    -- Lock metrics
    lock_waits INTEGER DEFAULT 0,
    deadlocks INTEGER DEFAULT 0,
    lock_timeouts INTEGER DEFAULT 0,
    
    -- Cache metrics
    cache_hit_ratio DECIMAL(5,2) DEFAULT 0.00,
    index_usage_ratio DECIMAL(5,2) DEFAULT 0.00,
    
    -- Storage metrics
    database_size BIGINT DEFAULT 0,
    table_size BIGINT DEFAULT 0,
    index_size BIGINT DEFAULT 0
);

-- ===================================
-- SECURITY COMMAND CENTER
-- ===================================

-- Security events
CREATE TABLE security_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    description TEXT NOT NULL,
    source_ip INET,
    target_system VARCHAR(100),
    user_id UUID REFERENCES players(id),
    admin_id UUID REFERENCES super_admin_dashboard(admin_id),
    
    -- Event details
    event_data JSONB DEFAULT '{}',
    affected_assets JSONB DEFAULT '[]',
    impact_assessment TEXT,
    
    -- Resolution
    status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'INVESTIGATING', 'RESOLVED', 'FALSE_POSITIVE')),
    resolution_time INTEGER, -- in minutes
    resolved_by UUID REFERENCES super_admin_dashboard(admin_id),
    resolution_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Vulnerability assessments
CREATE TABLE vulnerability_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vulnerability_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    description TEXT NOT NULL,
    
    -- Technical details
    affected_system VARCHAR(100) NOT NULL,
    cve_id VARCHAR(50),
    cvss_score DECIMAL(3,1),
    exploitability DECIMAL(3,1),
    impact DECIMAL(3,1),
    
    -- Discovery and assessment
    discovered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    discovered_by VARCHAR(100),
    assessment_tool VARCHAR(100),
    
    -- Resolution
    status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'ACCEPTED')),
    priority INTEGER DEFAULT 1,
    assigned_to UUID REFERENCES super_admin_dashboard(admin_id),
    resolution_plan TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES super_admin_dashboard(admin_id),
    
    -- Risk metrics
    risk_score DECIMAL(5,2) DEFAULT 0.00,
    business_impact TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fraud detection events
CREATE TABLE fraud_detection_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fraud_type VARCHAR(50) NOT NULL,
    detection_method VARCHAR(50) NOT NULL,
    confidence_score DECIMAL(5,2) NOT NULL,
    
    -- Event details
    user_id UUID REFERENCES players(id),
    transaction_id UUID,
    amount_lost DECIMAL(15,4) DEFAULT 0.0000,
    prevented_loss DECIMAL(15,4) DEFAULT 0.0000,
    
    -- Detection details
    detection_rules JSONB DEFAULT '[]',
    risk_factors JSONB DEFAULT '[]',
    behavioral_anomalies JSONB DEFAULT '[]',
    
    -- Action taken
    status VARCHAR(20) DEFAULT 'DETECTED' CHECK (status IN ('DETECTED', 'INVESTIGATING', 'BLOCKED', 'ALLOWED', 'FALSE_POSITIVE')),
    action_taken TEXT,
    blocked BOOLEAN DEFAULT false NOT NULL,
    
    -- Resolution
    resolved_by UUID REFERENCES super_admin_dashboard(admin_id),
    resolution_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Compliance status
CREATE TABLE compliance_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    compliance_area VARCHAR(50) NOT NULL,
    regulation_framework VARCHAR(100),
    
    -- Assessment details
    status VARCHAR(20) NOT NULL CHECK (status IN ('COMPLIANT', 'NON_COMPLIANT', 'PARTIALLY_COMPLIANT', 'ASSESSMENT_PENDING')),
    compliance_score DECIMAL(5,2) NOT NULL,
    
    -- Audit information
    last_audit_date DATE,
    next_audit_date DATE,
    auditor_name VARCHAR(100),
    audit_report_url TEXT,
    
    -- Issues and recommendations
    critical_issues JSONB DEFAULT '[]',
    recommendations JSONB DEFAULT '[]',
    remediation_plan TEXT,
    
    -- Documentation
    compliance_documentation JSONB DEFAULT '{}',
    evidence_files JSONB DEFAULT '[]',
    
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES super_admin_dashboard(admin_id)
);

-- ===================================
-- AI INSIGHTS ENGINE
-- ===================================

-- AI predictions
CREATE TABLE ai_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prediction_type VARCHAR(50) NOT NULL,
    prediction_value DECIMAL(15,4) NOT NULL,
    confidence_score DECIMAL(5,2) NOT NULL,
    time_horizon VARCHAR(50) NOT NULL,
    
    -- Prediction details
    key_factors JSONB DEFAULT '[]',
    model_version VARCHAR(20),
    training_data_period VARCHAR(50),
    
    -- Recommendations
    recommended_actions JSONB DEFAULT '[]',
    potential_outcomes JSONB DEFAULT '{}',
    
    -- Validation
    actual_value DECIMAL(15,4),
    accuracy_score DECIMAL(5,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    validated_at TIMESTAMP WITH TIME ZONE
);

-- Anomaly detection
CREATE TABLE anomaly_detection (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anomaly_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    
    -- Detection details
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    detection_algorithm VARCHAR(100),
    confidence_score DECIMAL(5,2) NOT NULL,
    
    -- Impact assessment
    affected_systems JSONB DEFAULT '[]',
    impact_assessment TEXT,
    business_impact DECIMAL(5,2) DEFAULT 0.00,
    
    -- Resolution
    status VARCHAR(20) DEFAULT 'DETECTED' CHECK (status IN ('DETECTED', 'INVESTIGATING', 'RESOLVED', 'FALSE_POSITIVE')),
    auto_resolved BOOLEAN DEFAULT false NOT NULL,
    resolution_notes TEXT,
    resolved_by UUID REFERENCES super_admin_dashboard(admin_id),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- AI recommendations
CREATE TABLE ai_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recommendation_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    
    -- Impact assessment
    expected_impact TEXT,
    implementation_effort VARCHAR(20) CHECK (implementation_effort IN ('LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH')),
    priority VARCHAR(20) CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    estimated_roi DECIMAL(10,2) DEFAULT 0.00,
    
    -- Recommendation details
    recommendation_data JSONB DEFAULT '{}',
    implementation_steps JSONB DEFAULT '[]',
    required_resources JSONB DEFAULT '[]',
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED')),
    approved_by UUID REFERENCES super_admin_dashboard(admin_id),
    approved_at TIMESTAMP WITH TIME ZONE,
    implemented_by UUID REFERENCES super_admin_dashboard(admin_id),
    implemented_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deadline TIMESTAMP WITH TIME ZONE
);

-- AI model performance
CREATE TABLE ai_model_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(20) NOT NULL,
    
    -- Performance metrics
    accuracy DECIMAL(5,2) DEFAULT 0.00,
    precision DECIMAL(5,2) DEFAULT 0.00,
    recall DECIMAL(5,2) DEFAULT 0.00,
    f1_score DECIMAL(5,2) DEFAULT 0.00,
    
    -- Training metrics
    training_data_size INTEGER DEFAULT 0,
    training_time INTEGER DEFAULT 0, -- in minutes
    convergence_epochs INTEGER DEFAULT 0,
    
    -- Validation metrics
    validation_accuracy DECIMAL(5,2) DEFAULT 0.00,
    cross_validation_score DECIMAL(5,2) DEFAULT 0.00,
    
    -- Deployment metrics
    deployment_date TIMESTAMP WITH TIME ZONE,
    prediction_count BIGINT DEFAULT 0,
    avg_prediction_time DECIMAL(8,2) DEFAULT 0.00,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- EMERGENCY CONTROLS
-- ===================================

-- Emergency activations
CREATE TABLE emergency_activations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    emergency_type VARCHAR(50) NOT NULL,
    reason TEXT NOT NULL,
    scope VARCHAR(50) NOT NULL,
    
    -- Activation details
    activated_by UUID NOT NULL REFERENCES super_admin_dashboard(admin_id),
    activated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_minutes INTEGER,
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'RESOLVED', 'CANCELLED')),
    resolved_by UUID REFERENCES super_admin_dashboard(admin_id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_summary TEXT,
    
    -- Impact assessment
    affected_systems JSONB DEFAULT '[]',
    user_impact JSONB DEFAULT '{}',
    business_impact TEXT,
    
    -- Communication
    notification_sent BOOLEAN DEFAULT false NOT NULL,
    stakeholder_notified BOOLEAN DEFAULT false NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System overrides
CREATE TABLE system_overrides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    system_name VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    parameters JSONB DEFAULT '{}',
    
    -- Authorization
    initiated_by UUID NOT NULL REFERENCES super_admin_dashboard(admin_id),
    approved_by UUID REFERENCES super_admin_dashboard(admin_id),
    justification TEXT NOT NULL,
    
    -- Execution details
    initiated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    executed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'EXECUTING', 'COMPLETED', 'FAILED', 'CANCELLED')),
    execution_result JSONB DEFAULT '{}',
    error_message TEXT,
    
    -- Impact assessment
    system_impact TEXT,
    user_impact TEXT,
    rollback_plan TEXT,
    
    -- Audit trail
    execution_log JSONB DEFAULT '[]',
    affected_components JSONB DEFAULT '[]'
);

-- ===================================
-- REAL-TIME COLLABORATION
-- ===================================

-- Admin collaboration sessions
CREATE TABLE admin_collaboration_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_name VARCHAR(200) NOT NULL,
    session_type VARCHAR(50) NOT NULL,
    
    -- Participants
    created_by UUID NOT NULL REFERENCES super_admin_dashboard(admin_id),
    participants JSONB DEFAULT '[]', -- Array of admin IDs
    active_participants JSONB DEFAULT '[]',
    
    -- Session details
    domain_focus VARCHAR(50),
    agenda JSONB DEFAULT '{}',
    shared_screen BOOLEAN DEFAULT false NOT NULL,
    
    -- Timing
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    
    -- Status
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAUSED', 'ENDED', 'CANCELLED')),
    
    -- Collaboration data
    chat_messages JSONB DEFAULT '[]',
    shared_documents JSONB DEFAULT '[]',
    decisions_made JSONB DEFAULT '[]',
    action_items JSONB DEFAULT '[]'
);

-- Real-time notifications
CREATE TABLE admin_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES super_admin_dashboard(admin_id),
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    
    -- Notification details
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    category VARCHAR(50),
    action_required BOOLEAN DEFAULT false NOT NULL,
    
    -- Display settings
    is_read BOOLEAN DEFAULT false NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE,
    dismissed_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    expires_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- PERFORMANCE INDEXES
-- ===================================

-- Super admin authentication indexes
CREATE INDEX idx_super_admin_dashboard_admin_id ON super_admin_dashboard(admin_id);
CREATE INDEX idx_super_admin_dashboard_session_token ON super_admin_dashboard(session_token);
CREATE INDEX idx_super_admin_dashboard_last_activity ON super_admin_dashboard(last_activity_at DESC);
CREATE INDEX idx_super_admin_dashboard_access_level ON super_admin_dashboard(access_level);

-- Admin action log indexes
CREATE INDEX idx_admin_action_log_admin_id ON admin_action_log(admin_id);
CREATE INDEX idx_admin_action_log_timestamp ON admin_action_log(timestamp DESC);
CREATE INDEX idx_admin_action_log_action ON admin_action_log(action);

-- Civilization metrics indexes
CREATE INDEX idx_civilization_metrics_metric_date ON civilization_metrics(metric_date DESC);
CREATE INDEX idx_real_time_activity_feed_created_at ON real_time_activity_feed(created_at DESC);
CREATE INDEX idx_real_time_activity_feed_priority ON real_time_activity_feed(priority DESC);

-- AI insights indexes
CREATE INDEX idx_ai_insights_created_at ON ai_insights(created_at DESC);
CREATE INDEX idx_ai_insights_priority ON ai_insights(priority DESC);
CREATE INDEX idx_ai_insights_type ON ai_insights(insight_type);

-- User analytics indexes
CREATE INDEX idx_user_behavior_analytics_date ON user_behavior_analytics(analysis_date DESC);
CREATE INDEX idx_churn_prediction_probability ON churn_prediction_model(churn_probability DESC);
CREATE INDEX idx_user_journey_stage ON user_journey_mapping(journey_stage, stage_order);

-- Economic analytics indexes
CREATE INDEX idx_economic_projections_period ON economic_projections(projection_period);
CREATE INDEX idx_token_economy_date ON token_economy_analytics(metric_date DESC);
CREATE INDEX idx_marketplace_performance_date ON marketplace_performance(performance_date DESC);

-- Infrastructure monitoring indexes
CREATE INDEX idx_server_metrics_updated ON server_metrics(last_updated DESC);
CREATE INDEX idx_api_metrics_created_at ON api_metrics(created_at DESC);
CREATE INDEX idx_api_metrics_endpoint ON api_metrics(endpoint);
CREATE INDEX idx_database_performance_timestamp ON database_performance(metric_timestamp DESC);

-- Security indexes
CREATE INDEX idx_security_events_created_at ON security_events(created_at DESC);
CREATE INDEX idx_security_events_severity ON security_events(severity DESC);
CREATE INDEX idx_vulnerability_assessments_severity ON vulnerability_assessments(severity DESC);
CREATE INDEX idx_fraud_detection_created_at ON fraud_detection_events(created_at DESC);

-- AI model indexes
CREATE INDEX idx_ai_predictions_created_at ON ai_predictions(created_at DESC);
CREATE INDEX idx_anomaly_detection_severity ON anomaly_detection(severity DESC);
CREATE INDEX idx_ai_recommendations_priority ON ai_recommendations(priority DESC);

-- Emergency controls indexes
CREATE INDEX idx_emergency_activations_created_at ON emergency_activations(activated_at DESC);
CREATE INDEX idx_system_overrides_status ON system_overrides(status);
CREATE INDEX idx_system_overrides_created_at ON system_overrides(initiated_at DESC);

-- Collaboration indexes
CREATE INDEX idx_admin_collaboration_sessions_created_at ON admin_collaboration_sessions(created_at DESC);
CREATE INDEX idx_admin_notifications_admin_id ON admin_notifications(admin_id);
CREATE INDEX idx_admin_notifications_read ON admin_notifications(is_read, created_at DESC);

-- ===================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ===================================

-- Update civilization metrics daily
CREATE OR REPLACE FUNCTION update_civilization_metrics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO civilization_metrics (
        metric_date,
        total_citizens,
        active_citizens,
        new_citizens,
        daily_revenue,
        total_token_supply,
        daily_transactions,
        system_health_score,
        error_count,
        high_threat_count,
        failed_logins,
        active_proposals,
        council_members,
        active_courses,
        daily_enrollments,
        total_countries,
        total_communities,
        global_citizens
    )
    SELECT 
        CURRENT_DATE,
        (SELECT COUNT(*) FROM players),
        (SELECT COUNT(*) FROM players WHERE last_active_at > NOW() - INTERVAL '24 hours'),
        (SELECT COUNT(*) FROM players WHERE created_at > CURRENT_DATE),
        (SELECT COALESCE(SUM(amount), 0) FROM super_admin_revenue WHERE DATE(recorded_at) = CURRENT_DATE),
        (SELECT COALESCE(SUM(power_tokens), 0) FROM player_economy),
        (SELECT COUNT(*) FROM transactions WHERE DATE(created_at) = CURRENT_DATE),
        (SELECT AVG(CASE WHEN response_time < 1000 THEN 100 ELSE (response_time / 10) END) FROM api_metrics WHERE created_at > NOW() - INTERVAL '1 hour'),
        (SELECT COUNT(*) FROM system_logs WHERE level = 'ERROR' AND created_at > NOW() - INTERVAL '1 hour'),
        (SELECT COUNT(*) FROM security_events WHERE severity = 'HIGH' AND created_at > NOW() - INTERVAL '24 hours'),
        (SELECT COUNT(*) FROM failed_login_attempts WHERE attempt_time > NOW() - INTERVAL '1 hour'),
        (SELECT COUNT(*) FROM governance_proposals WHERE status = 'ACTIVE'),
        (SELECT COUNT(*) FROM governance_council WHERE is_active = true),
        (SELECT COUNT(*) FROM education_courses WHERE is_active = true),
        (SELECT COUNT(*) FROM course_enrollments WHERE DATE(created_at) = CURRENT_DATE),
        (SELECT COUNT(*) FROM world_countries),
        (SELECT COUNT(*) FROM diaspora_communities),
        (SELECT COUNT(*) FROM global_citizens)
    ON CONFLICT (metric_date) 
    DO UPDATE SET
        total_citizens = EXCLUDED.total_citizens,
        active_citizens = EXCLUDED.active_citizens,
        new_citizens = EXCLUDED.new_citizens,
        daily_revenue = EXCLUDED.daily_revenue,
        total_token_supply = EXCLUDED.total_token_supply,
        daily_transactions = EXCLUDED.daily_transactions,
        system_health_score = EXCLUDED.system_health_score,
        error_count = EXCLUDED.error_count,
        high_threat_count = EXCLUDED.high_threat_count,
        failed_logins = EXCLUDED.failed_logins,
        active_proposals = EXCLUDED.active_proposals,
        council_members = EXCLUDED.council_members,
        active_courses = EXCLUDED.active_courses,
        daily_enrollments = EXCLUDED.daily_enrollments,
        total_countries = EXCLUDED.total_countries,
        total_communities = EXCLUDED.total_communities,
        global_citizens = EXCLUDED.global_citizens,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for daily metrics update
CREATE TRIGGER trigger_update_civilization_metrics
    AFTER INSERT ON players
    FOR EACH ROW EXECUTE FUNCTION update_civilization_metrics();

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp update triggers
CREATE TRIGGER update_super_admin_dashboard_updated_at 
    BEFORE UPDATE ON super_admin_dashboard
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER update_vulnerability_assessments_updated_at 
    BEFORE UPDATE ON vulnerability_assessments
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER update_compliance_status_updated_at 
    BEFORE UPDATE ON compliance_status
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER update_ai_model_performance_updated_at 
    BEFORE UPDATE ON ai_model_performance
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- ===================================
-- INITIAL DATA SETUP
-- ===================================

-- Insert default super admin accounts
INSERT INTO super_admin_dashboard (id, admin_id, username, email, access_level, password_hash, session_token) VALUES
(uuid_generate_v4(), uuid_generate_v4(), 'superadmin', 'superadmin@peoplepower.game', 'SYSTEM_OWNER', '$2b$12$hashed_password_here', 'initial_session_token'),
(uuid_generate_v4(), uuid_generate_v4(), 'admin_alpha', 'admin.alpha@peoplepower.game', 'SUPER_ADMIN', '$2b$12$hashed_password_here', 'alpha_session_token'),
(uuid_generate_v4(), uuid_generate_v4(), 'admin_beta', 'admin.beta@peoplepower.game', 'SUPER_ADMIN', '$2b$12$hashed_password_here', 'beta_session_token');

-- Initialize civilization metrics for today
INSERT INTO civilization_metrics (metric_date) VALUES (CURRENT_DATE);

-- Initialize AI model performance records
INSERT INTO ai_model_performance (model_name, model_version, accuracy, precision, recall, f1_score) VALUES
('Churn Prediction Model', 'v2.1', 94.2, 91.8, 89.6, 90.7),
('Revenue Forecast Model', 'v1.8', 92.5, 90.3, 88.9, 89.6),
('Security Threat Detection', 'v3.2', 96.1, 94.7, 93.2, 93.9),
('User Behavior Analysis', 'v1.5', 88.7, 86.4, 85.1, 85.7);

-- Initialize compliance status
INSERT INTO compliance_status (compliance_area, regulation_framework, status, compliance_score, last_audit_date, next_audit_date) VALUES
('Data Privacy', 'GDPR', 'COMPLIANT', 98.5, CURRENT_DATE - INTERVAL '90 days', CURRENT_DATE + INTERVAL '275 days'),
('Financial Regulations', 'AML/KYC', 'COMPLIANT', 96.2, CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE + INTERVAL '305 days'),
('Security Standards', 'ISO 27001', 'PARTIALLY_COMPLIANT', 87.3, CURRENT_DATE - INTERVAL '120 days', CURRENT_DATE + INTERVAL '245 days'),
('Consumer Protection', 'FTC Guidelines', 'COMPLIANT', 94.8, CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE + INTERVAL '320 days');
