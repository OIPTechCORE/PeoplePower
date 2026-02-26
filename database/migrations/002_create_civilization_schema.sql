-- ========================================
-- CIVILIZATION CONTROL MAP & PEOPLE POWER UNIVERSITY SCHEMA
-- Migration: 002_create_civilization_schema.sql
-- Description: Creates tables for People Power University and Civilization Control systems
-- ========================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- PEOPLE POWER UNIVERSITY TABLES
-- ========================================

-- People Power University main table
CREATE TABLE IF NOT EXISTS people_power_university (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    established_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_students INTEGER DEFAULT 0,
    total_graduates INTEGER DEFAULT 0,
    version VARCHAR(50) DEFAULT '1.0'
);

-- Faculties
CREATE TABLE IF NOT EXISTS faculties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID REFERENCES people_power_university(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(100) NOT NULL,
    head_id VARCHAR(255),
    total_students INTEGER DEFAULT 0,
    courses_offered INTEGER DEFAULT 0,
    skills_produced JSONB,
    economic_role JSONB,
    reputation_score INTEGER DEFAULT 0,
    established_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(university_id, name)
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_id UUID REFERENCES faculties(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL, -- in minutes
    difficulty VARCHAR(50) NOT NULL,
    learning_objectives TEXT[],
    skills JSONB,
    prerequisites TEXT[],
    completion_reward JSONB,
    is_public BOOLEAN DEFAULT TRUE,
    enrollment_count INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Degrees
CREATE TABLE IF NOT EXISTS degrees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    faculty_id UUID REFERENCES faculties(id) ON DELETE CASCADE,
    required_courses TEXT[],
    total_credits INTEGER NOT NULL,
    estimated_duration INTEGER NOT NULL, -- in weeks
    powers_unlocked JSONB,
    governance_eligibility JSONB,
    economic_bonus JSONB,
    prestige_level VARCHAR(50) NOT NULL,
    total_graduates INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mentorship Programs
CREATE TABLE IF NOT EXISTS mentorship_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    faculty_id UUID REFERENCES faculties(id) ON DELETE CASCADE,
    mentor_requirements JSONB,
    mentee_benefits JSONB,
    mentor_rewards JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    total_mentors INTEGER DEFAULT 0,
    total_mentees INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Research Projects
CREATE TABLE IF NOT EXISTS research_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    faculty_id UUID REFERENCES faculties(id) ON DELETE CASCADE,
    lead_researcher_id VARCHAR(255),
    team_members TEXT[],
    objectives TEXT[],
    methodology TEXT,
    expected_outcomes TEXT[],
    budget JSONB,
    timeline JSONB,
    status VARCHAR(50) DEFAULT 'planning',
    impact JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Course Enrollments
CREATE TABLE IF NOT EXISTS course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    student_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'enrolled',
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress INTEGER DEFAULT 0,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    UNIQUE(course_id, student_id)
);

-- Lesson Completions
CREATE TABLE IF NOT EXISTS lesson_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE CASCADE,
    lesson_id VARCHAR(255) NOT NULL,
    score INTEGER,
    time_spent INTEGER, -- in seconds
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(enrollment_id, lesson_id)
);

-- Degree Enrollments
CREATE TABLE IF NOT EXISTS degree_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    degree_id UUID REFERENCES degrees(id) ON DELETE CASCADE,
    student_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'enrolled',
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress INTEGER DEFAULT 0,
    credits_earned INTEGER DEFAULT 0,
    completed_at TIMESTAMP,
    UNIQUE(degree_id, student_id)
);

-- Mentor Applications
CREATE TABLE IF NOT EXISTS mentor_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES mentorship_programs(id) ON DELETE CASCADE,
    applicant_id VARCHAR(255) NOT NULL,
    qualifications JSONB,
    experience JSONB,
    availability JSONB,
    status VARCHAR(50) DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewer_id VARCHAR(255)
);

-- Research Applications
CREATE TABLE IF NOT EXISTS research_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES research_projects(id) ON DELETE CASCADE,
    applicant_id VARCHAR(255) NOT NULL,
    skills JSONB,
    motivation TEXT,
    availability JSONB,
    status VARCHAR(50) DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewer_id VARCHAR(255)
);

-- ========================================
-- CIVILIZATION CONTROL MAP TABLES
-- ========================================

-- Civilization Control Map
CREATE TABLE IF NOT EXISTS civilization_control_map (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    established_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Power Pillars
CREATE TABLE IF NOT EXISTS power_pillars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    civilization_id UUID REFERENCES civilization_control_map(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    responsibilities TEXT[],
    powers TEXT[],
    limitations TEXT[],
    current_holders TEXT[],
    election_cycle JSONB,
    checks_and_balances JSONB,
    UNIQUE(civilization_id, name)
);

-- Safety Structures
CREATE TABLE IF NOT EXISTS safety_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    civilization_id UUID REFERENCES civilization_control_map(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    mechanisms JSONB,
    activation_conditions JSONB,
    enforcement_methods TEXT[],
    effectiveness INTEGER DEFAULT 0,
    last_activated TIMESTAMP,
    activation_count INTEGER DEFAULT 0,
    UNIQUE(civilization_id, name)
);

-- Governance Layers
CREATE TABLE IF NOT EXISTS governance_layers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    civilization_id UUID REFERENCES civilization_control_map(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    authority VARCHAR(50) NOT NULL,
    decision_making_process JSONB,
    voting_mechanism JSONB,
    term_limits JSONB,
    accountability JSONB,
    UNIQUE(civilization_id, name)
);

-- Power Balance Metrics
CREATE TABLE IF NOT EXISTS power_balance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    civilization_id UUID REFERENCES civilization_control_map(id) ON DELETE CASCADE,
    centralization_score DECIMAL(5,2) DEFAULT 0,
    participation_rate DECIMAL(5,2) DEFAULT 0,
    turnover_rate DECIMAL(5,2) DEFAULT 0,
    corruption_index DECIMAL(5,2) DEFAULT 0,
    stability_index DECIMAL(5,2) DEFAULT 0,
    last_calculated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- DIGITAL CITIZEN SYSTEM TABLES
-- ========================================

-- Digital Citizens
CREATE TABLE IF NOT EXISTS digital_citizens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id VARCHAR(255) UNIQUE NOT NULL,
    citizen_id VARCHAR(255) UNIQUE NOT NULL,
    reputation_score INTEGER DEFAULT 0,
    skills JSONB,
    contributions JSONB,
    community_roles JSONB,
    governance_history JSONB,
    education_history JSONB,
    economic_activity JSONB,
    cultural_participation JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Citizen Skills
CREATE TABLE IF NOT EXISTS citizen_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id UUID REFERENCES digital_citizens(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    max_level INTEGER DEFAULT 100,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    certifications JSONB,
    UNIQUE(citizen_id, name)
);

-- Citizen Contributions
CREATE TABLE IF NOT EXISTS citizen_contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id UUID REFERENCES digital_citizens(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    impact INTEGER DEFAULT 0,
    community_benefit TEXT,
    recognition TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified BOOLEAN DEFAULT FALSE,
    verified_by VARCHAR(255)
);

-- Reputation History
CREATE TABLE IF NOT EXISTS reputation_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id UUID REFERENCES digital_citizens(id) ON DELETE CASCADE,
    change_amount INTEGER NOT NULL,
    new_score INTEGER NOT NULL,
    reason TEXT,
    contributor_id VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- COMMUNITY SYSTEM TABLES
-- ========================================

-- Communities
CREATE TABLE IF NOT EXISTS communities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    type VARCHAR(100) NOT NULL,
    founding_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    members INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'active',
    reputation JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Community Treasuries
CREATE TABLE IF NOT EXISTS community_treasuries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    balance INTEGER DEFAULT 0,
    currency VARCHAR(20) DEFAULT 'PWR_TOKEN',
    income_sources JSONB,
    expenses JSONB,
    budget_allocations JSONB,
    last_audit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_transparent BOOLEAN DEFAULT TRUE
);

-- Community Governance
CREATE TABLE IF NOT EXISTS community_governance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    structure JSONB,
    voting_rules JSONB,
    proposal_process JSONB,
    dispute_resolution JSONB,
    leadership JSONB
);

-- Community Projects
CREATE TABLE IF NOT EXISTS community_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    proposed_by VARCHAR(255),
    budget JSONB,
    timeline JSONB,
    status VARCHAR(50) DEFAULT 'planning',
    team_members JSONB,
    milestones JSONB,
    impact JSONB,
    community_benefit TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Community Members
CREATE TABLE IF NOT EXISTS community_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    player_id VARCHAR(255) NOT NULL,
    role VARCHAR(100) DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    contribution INTEGER DEFAULT 0,
    reputation INTEGER DEFAULT 0,
    UNIQUE(community_id, player_id)
);

-- Community Roles
CREATE TABLE IF NOT EXISTS community_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id UUID REFERENCES digital_citizens(id) ON DELETE CASCADE,
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    responsibilities TEXT[],
    authority VARCHAR(50) NOT NULL,
    term_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    term_end TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    performance JSONB,
    UNIQUE(citizen_id, community_id)
);

-- ========================================
-- GOVERNANCE SYSTEM TABLES
-- ========================================

-- Governance Proposals
CREATE TABLE IF NOT EXISTS governance_proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(100) NOT NULL,
    proposer_id VARCHAR(255) NOT NULL,
    community_id UUID REFERENCES communities(id) ON DELETE SET NULL,
    institution_id UUID,
    voting_period JSONB,
    options JSONB,
    status VARCHAR(50) DEFAULT 'active',
    vote_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Proposal Votes
CREATE TABLE IF NOT EXISTS proposal_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposal_id UUID REFERENCES governance_proposals(id) ON DELETE CASCADE,
    voter_id VARCHAR(255) NOT NULL,
    vote VARCHAR(100) NOT NULL,
    reasoning TEXT,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(proposal_id, voter_id)
);

-- Governance History
CREATE TABLE IF NOT EXISTS governance_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id UUID REFERENCES digital_citizens(id) ON DELETE CASCADE,
    position VARCHAR(255) NOT NULL,
    term_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    term_end TIMESTAMP,
    achievements TEXT[],
    challenges TEXT[],
    approval INTEGER DEFAULT 0,
    reason_for_leaving TEXT
);

-- ========================================
-- ECONOMIC SYSTEM TABLES
-- ========================================

-- Economic System
CREATE TABLE IF NOT EXISTS economic_system (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    currency JSONB,
    production_methods JSONB,
    exchange_markets JSONB,
    opportunity_networks JSONB,
    stability_metrics JSONB,
    governance JSONB
);

-- Production Methods
CREATE TABLE IF NOT EXISTS production_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    economic_system_id UUID REFERENCES economic_system(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    requirements JSONB,
    outputs JSONB,
    efficiency_rating DECIMAL(3,2) DEFAULT 1.0,
    is_active BOOLEAN DEFAULT TRUE
);

-- Exchange Markets
CREATE TABLE IF NOT EXISTS exchange_markets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    economic_system_id UUID REFERENCES economic_system(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    trading_pairs JSONB,
    fees JSONB,
    volume_24h INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- Opportunity Networks
CREATE TABLE IF NOT EXISTS opportunity_networks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    economic_system_id UUID REFERENCES economic_system(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    opportunity_types JSONB,
    requirements JSONB,
    rewards JSONB,
    is_active BOOLEAN DEFAULT TRUE
);

-- ========================================
-- TREASURY SYSTEM TABLES
-- ========================================

-- Treasury System
CREATE TABLE IF NOT EXISTS treasury_system (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    total_funds INTEGER DEFAULT 0,
    currency VARCHAR(20) DEFAULT 'PWR_TOKEN',
    fund_sources JSONB,
    expenditure_categories JSONB,
    controls JSONB,
    reporting JSONB,
    audits JSONB
);

-- Fund Sources
CREATE TABLE IF NOT EXISTS fund_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    treasury_id UUID REFERENCES treasury_system(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    amount INTEGER NOT NULL,
    frequency VARCHAR(50),
    reliability INTEGER DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Treasury Expenditures
CREATE TABLE IF NOT EXISTS treasury_expenditures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    treasury_id UUID REFERENCES treasury_system(id) ON DELETE CASCADE,
    player_id VARCHAR(255),
    category VARCHAR(100) NOT NULL,
    amount INTEGER NOT NULL,
    description TEXT,
    approval VARCHAR(255),
    justification TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Treasury Controls
CREATE TABLE IF NOT EXISTS treasury_controls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    treasury_id UUID REFERENCES treasury_system(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    parameters JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- SAFETY & MONITORING TABLES
-- ========================================

-- Safety Structure Activations
CREATE TABLE IF NOT EXISTS safety_structure_activations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    structure_id UUID REFERENCES safety_structures(id) ON DELETE CASCADE,
    activator_id VARCHAR(255) NOT NULL,
    reason TEXT,
    evidence JSONB,
    activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Safety Triggers
CREATE TABLE IF NOT EXISTS safety_triggers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    evidence JSONB,
    auto_response BOOLEAN DEFAULT FALSE,
    triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Safety Notifications
CREATE TABLE IF NOT EXISTS safety_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    authority_id UUID REFERENCES digital_citizens(id) ON DELETE CASCADE,
    trigger_id UUID REFERENCES safety_triggers(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    message TEXT,
    notified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);

-- Manipulation Analysis
CREATE TABLE IF NOT EXISTS manipulation_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_type VARCHAR(100) NOT NULL,
    detected_patterns JSONB,
    risk_level VARCHAR(50) NOT NULL,
    affected_entities JSONB,
    recommendations JSONB,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Governance Action Log
CREATE TABLE IF NOT EXISTS governance_action_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    target_type VARCHAR(100) NOT NULL,
    target_id VARCHAR(255),
    reason TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transparency Reports
CREATE TABLE IF NOT EXISTS transparency_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(100) NOT NULL,
    total_actions INTEGER DEFAULT 0,
    public_actions INTEGER DEFAULT 0,
    explained_actions INTEGER DEFAULT 0,
    transparency_score DECIMAL(5,2) DEFAULT 0,
    report_period_start TIMESTAMP,
    report_period_end TIMESTAMP,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- University indexes
CREATE INDEX IF NOT EXISTS idx_faculties_university_id ON faculties(university_id);
CREATE INDEX IF NOT EXISTS idx_courses_faculty_id ON courses(faculty_id);
CREATE INDEX IF NOT EXISTS idx_degrees_faculty_id ON degrees(faculty_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_student_id ON course_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_degree_enrollments_student_id ON degree_enrollments(student_id);

-- Civilization indexes
CREATE INDEX IF NOT EXISTS idx_power_pillars_civilization_id ON power_pillars(civilization_id);
CREATE INDEX IF NOT EXISTS idx_safety_structures_civilization_id ON safety_structures(civilization_id);
CREATE INDEX IF NOT EXISTS idx_governance_layers_civilization_id ON governance_layers(civilization_id);
CREATE INDEX IF NOT EXISTS idx_power_balance_metrics_civilization_id ON power_balance_metrics(civilization_id);

-- Citizen indexes
CREATE INDEX IF NOT EXISTS idx_digital_citizens_player_id ON digital_citizens(player_id);
CREATE INDEX IF NOT EXISTS idx_citizen_skills_citizen_id ON citizen_skills(citizen_id);
CREATE INDEX IF NOT EXISTS idx_citizen_contributions_citizen_id ON citizen_contributions(citizen_id);

-- Community indexes
CREATE INDEX IF NOT EXISTS idx_communities_type ON communities(type);
CREATE INDEX IF NOT EXISTS idx_community_members_community_id ON community_members(community_id);
CREATE INDEX IF NOT EXISTS idx_community_members_player_id ON community_members(player_id);
CREATE INDEX IF NOT EXISTS idx_community_roles_citizen_id ON community_roles(citizen_id);

-- Governance indexes
CREATE INDEX IF NOT EXISTS idx_governance_proposals_status ON governance_proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposal_votes_proposal_id ON proposal_votes(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_votes_voter_id ON proposal_votes(voter_id);

-- Economic indexes
CREATE INDEX IF NOT EXISTS idx_economic_system_type ON economic_system(type);
CREATE INDEX IF NOT EXISTS idx_production_methods_economic_system_id ON production_methods(economic_system_id);
CREATE INDEX IF NOT EXISTS idx_exchange_markets_economic_system_id ON exchange_markets(economic_system_id);

-- Treasury indexes
CREATE INDEX IF NOT EXISTS idx_treasury_expenditures_date ON treasury_expenditures(date);
CREATE INDEX IF NOT EXISTS idx_treasury_expenditures_category ON treasury_expenditures(category);
CREATE INDEX IF NOT EXISTS idx_fund_sources_treasury_id ON fund_sources(treasury_id);

-- Safety indexes
CREATE INDEX IF NOT EXISTS idx_safety_structure_activations_structure_id ON safety_structure_activations(structure_id);
CREATE INDEX IF NOT EXISTS idx_safety_triggers_type ON safety_triggers(type);
CREATE INDEX IF NOT EXISTS idx_safety_notifications_authority_id ON safety_notifications(authority_id);

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
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_research_projects_updated_at BEFORE UPDATE ON research_projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communities_updated_at BEFORE UPDATE ON communities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_projects_updated_at BEFORE UPDATE ON community_projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_governance_proposals_updated_at BEFORE UPDATE ON governance_proposals 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- INITIAL DATA SEEDING
-- ========================================

-- Insert main university
INSERT INTO people_power_university (id, name, description, established_at) 
VALUES ('main-university', 'People Power University', 'The knowledge engine of our digital civilization', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert main civilization
INSERT INTO civilization_control_map (id, name, version, established_at) 
VALUES ('main-civilization', 'People Power Digital Civilization', '1.0', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert main economic system
INSERT INTO economic_system (id, name, type, currency) 
VALUES ('main-economy', 'People Power Economy', 'mixed', '{"name": "PWR_TOKEN", "symbol": "PWR"}')
ON CONFLICT (id) DO NOTHING;

-- Insert main treasury system
INSERT INTO treasury_system (id, name, type, total_funds, currency) 
VALUES ('main-treasury', 'People Power Treasury', 'hybrid', 0, 'PWR_TOKEN')
ON CONFLICT (id) DO NOTHING;

-- Create initial faculties
INSERT INTO faculties (id, university_id, name, description, type, established_at) VALUES
  ('faculty-leadership', 'main-university', 'Leadership & Governance', 'Teaching negotiation, ethics, and community leadership', 'leadership_governance', NOW()),
  ('faculty-entrepreneurship', 'main-university', 'Digital Entrepreneurship', 'Building online businesses and digital creators', 'digital_entrepreneurship', NOW()),
  ('faculty-technology', 'main-university', 'Technology & AI Literacy', 'Coding basics and digital building', 'technology_ai_literacy', NOW()),
  ('faculty-creative', 'main-university', 'Creative Arts & Media', 'Storytelling, design, and cultural creation', 'creative_arts_media', NOW()),
  ('faculty-civic', 'main-university', 'Civic & Community Development', 'Organization and coordination skills', 'civic_community_development', NOW())
ON CONFLICT (university_id, name) DO NOTHING;

-- Create initial power pillars
INSERT INTO power_pillars (civilization_id, name, description, responsibilities, powers, limitations) VALUES
  ('main-citizens', 'main-civilization', 'Citizens', 'All players in the digital civilization', ARRAY['Participate', 'Earn', 'Learn', 'Vote'], ARRAY['Cannot control treasury alone', 'Cannot change rules individually'], ARRAY['Mass participation without instability']),
  ('main-communities', 'main-civilization', 'Communities', 'Guild governments and local groups', ARRAY['Organize missions', 'Allocate small rewards', 'Elect representatives'], ARRAY['Treasury spending capped', 'Transparent activity logs'], ARRAY['Local governance without central risk']),
  ('main-institutions', 'main-civilization', 'Institutions', 'PPU and economic bodies', ARRAY['Certify leaders', 'Train moderators', 'Approve permissions'], ARRAY['No education = no leadership authority'], ARRAY['Stabilize civilization']),
  ('main-councils', 'main-civilization', 'Councils', 'Elected governance bodies', ARRAY['Propose updates', 'Review economic changes', 'Approve policies'], ARRAY['Power is temporary', 'Rotation prevents elites'], ARRAY['Distributed responsibility']),
  ('main-guardians', 'main-civilization', 'Protocol Guardians', 'Core safety layer', ARRAY['Enforce safety rules', 'Stop fraud', 'Prevent abuse'], ARRAY['Cannot control economy directly'], ARRAY['Protect system, not rule it'])
ON CONFLICT (civilization_id, name) DO NOTHING;

-- Create initial safety structures
INSERT INTO safety_structures (civilization_id, name, type, description, mechanisms) VALUES
  ('main-transparency', 'main-civilization', 'Transparency Engine', 'Records all major actions publicly', ARRAY['Public logging', 'Audit trails', 'Open decision records']),
  ('main-reputation', 'main-civilization', 'Reputation-Based Authority', 'Power comes from contribution history', ARRAY['Reputation scoring', 'Merit-based permissions', 'Contribution tracking']),
  ('main-stability', 'main-civilization', 'Economic Stability Board', 'Monitors and prevents economic crashes', ARRAY['Inflation monitoring', 'Reward balancing', 'Market manipulation detection']),
  ('main-anti-manipulation', 'main-civilization', 'Anti-Manipulation Systems', 'Prevents coordinated takeovers', ARRAY['Vote weighting', 'Bot detection', 'Cooldown periods'])
ON CONFLICT (civilization_id, name) DO NOTHING;

-- Create initial governance layers
INSERT INTO governance_layers (civilization_id, name, description, authority, decision_making_process) VALUES
  ('main-citizens', 'main-civilization', 'Citizens', 'All players with basic rights', 'citizen', '{"steps": ["Participate", "Vote"], "timeframes": [30], "requiredConsensus": 0.5}'),
  ('main-communities', 'main-civilization', 'Communities', 'Local governance bodies', 'community_member', '{"steps": ["Discuss", "Vote locally"], "timeframes": [7], "requiredConsensus": 0.6}'),
  ('main-institutions', 'main-civilization', 'Institutions', 'Educational and economic bodies', 'institutional_member', '{"steps": ["Review", "Approve"], "timeframes": [14], "requiredConsensus": 0.7}'),
  ('main-councils', 'main-civilization', 'Councils', 'Elected representatives', 'council_member', '{"steps": ["Propose", "Vote"], "timeframes": [21], "requiredConsensus": 0.65}'),
  ('main-guardians', 'main-civilization', 'Protocol Guardians', 'Core safety and infrastructure team', 'protocol_guardian', '{"steps": ["Monitor", "Enforce"], "timeframes": [1], "requiredConsensus": 0.9}')
ON CONFLICT (civilization_id, name) DO NOTHING;

COMMIT;
