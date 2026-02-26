-- ===================================
-- GOVERNANCE PROPOSALS AND VOTING SYSTEM
-- "POWER TO THE PEOPLE, GOVERNANCE BY THE STAKERS"
-- ===================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================
-- GOVERNANCE PROPOSALS
-- ===================================
CREATE TABLE governance_proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES players(id) ON DELETE RESTRICT,
    
    -- Proposal details
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('pool_parameters', 'reward_rates', 'governance_rules', 'treasury', 'community_features', 'protocol_upgrade')),
    proposed_changes JSONB NOT NULL, -- Array of proposed changes
    
    -- Voting settings
    voting_period_days INTEGER NOT NULL DEFAULT 7 CHECK (voting_period_days >= 1 AND voting_period_days <= 30),
    quorum_required DECIMAL(5,4) NOT NULL DEFAULT 0.1000 CHECK (quorum_required >= 0.0100 AND quorum_required <= 1.0000),
    approval_threshold DECIMAL(5,4) NOT NULL DEFAULT 0.5000 CHECK (approval_threshold >= 0.2500 AND approval_threshold <= 0.7500),
    
    -- Voting timeline
    voting_starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    voting_ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Vote counts
    for_votes DECIMAL(15,8) NOT NULL DEFAULT 0.0000,
    against_votes DECIMAL(15,8) NOT NULL DEFAULT 0.0000,
    abstain_votes DECIMAL(15,8) NOT NULL DEFAULT 0.0000,
    total_voting_power DECIMAL(15,8) NOT NULL DEFAULT 0.0000,
    total_votes INTEGER NOT NULL DEFAULT 0 CHECK (total_votes >= 0),
    
    -- Status and outcome
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'passed', 'failed', 'executed', 'cancelled')),
    outcome VARCHAR(20) CHECK (outcome IN ('approved', 'rejected', 'quorum_not_met', 'cancelled')),
    quorum_met BOOLEAN DEFAULT false NOT NULL,
    executed_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- PROPOSAL VOTES
-- ===================================
CREATE TABLE proposal_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposal_id UUID NOT NULL REFERENCES governance_proposals(id) ON DELETE CASCADE,
    voter_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    
    -- Vote details
    vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('for', 'against', 'abstain')),
    voting_power DECIMAL(15,8) NOT NULL CHECK (voting_power >= 0),
    vote_reason TEXT,
    
    -- Timestamp
    voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one vote per proposal per voter
    UNIQUE(proposal_id, voter_id)
);

-- ===================================
-- GOVERNANCE CHANGE LOG
-- ===================================
CREATE TABLE governance_change_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposal_id UUID REFERENCES governance_proposals(id) ON DELETE SET NULL,
    executor_id UUID REFERENCES players(id) ON DELETE SET NULL,
    
    -- Change details
    change_type VARCHAR(50) NOT NULL,
    target_table VARCHAR(50) NOT NULL,
    target_record_id UUID,
    old_values JSONB,
    new_values JSONB,
    
    -- Execution details
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    execution_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (execution_status IN ('pending', 'success', 'failed')),
    error_message TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- TREASURY MANAGEMENT
-- ===================================
CREATE TABLE governance_treasury (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Treasury balances
    reputation_balance DECIMAL(15,2) NOT NULL DEFAULT 0.00 CHECK (reputation_balance >= 0),
    token_balance BIGINT NOT NULL DEFAULT 0 CHECK (token_balance >= 0),
    
    -- Allocation pools
    community_development_fund DECIMAL(15,2) NOT NULL DEFAULT 0.00 CHECK (community_development_fund >= 0),
    education_fund DECIMAL(15,2) NOT NULL DEFAULT 0.00 CHECK (education_fund >= 0),
    innovation_fund DECIMAL(15,2) NOT NULL DEFAULT 0.00 CHECK (innovation_fund >= 0),
    emergency_reserve DECIMAL(15,2) NOT NULL DEFAULT 0.00 CHECK (emergency_reserve >= 0),
    
    -- Treasury settings
    auto_replenish_rate DECIMAL(5,4) NOT NULL DEFAULT 0.0500 CHECK (auto_replenish_rate >= 0),
    last_replenished_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Governance
    managed_by_council BOOLEAN DEFAULT true NOT NULL,
    council_approval_required DECIMAL(5,4) NOT NULL DEFAULT 0.6000 CHECK (council_approval_required >= 0.5000),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- TREASURY TRANSACTIONS
-- ===================================
CREATE TABLE treasury_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    treasury_id UUID NOT NULL REFERENCES governance_treasury(id) ON DELETE RESTRICT,
    
    -- Transaction details
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('allocation', 'distribution', 'replenishment', 'refund', 'grant')),
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'reputation' CHECK (currency IN ('reputation', 'tokens')),
    
    -- Source and destination
    source_fund VARCHAR(50) CHECK (source_fund IN ('community_development', 'education', 'innovation', 'emergency_reserve', 'external')),
    destination_fund VARCHAR(50) CHECK (destination_fund IN ('community_development', 'education', 'innovation', 'emergency_reserve', 'external')),
    recipient_id UUID REFERENCES players(id) ON DELETE SET NULL,
    recipient_type VARCHAR(20) CHECK (recipient_type IN ('player', 'community', 'project', 'external')),
    
    -- Authorization
    authorized_by UUID REFERENCES players(id) ON DELETE SET NULL,
    proposal_id UUID REFERENCES governance_proposals(id) ON DELETE SET NULL,
    authorization_reason TEXT,
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'executed', 'failed', 'cancelled')),
    executed_at TIMESTAMP WITH TIME ZONE,
    failure_reason TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- COUNCIL MEMBERSHIP
-- ===================================
CREATE TABLE governance_council (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    
    -- Council role
    council_role VARCHAR(30) NOT NULL CHECK (council_role IN ('chair', 'vice_chair', 'treasurer', 'secretary', 'member', 'observer')),
    committee VARCHAR(50) CHECK (committee IN ('executive', 'treasury', 'education', 'community', 'innovation', 'security')),
    
    -- Term details
    term_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    term_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    
    -- Election details
    elected_by VARCHAR(20) NOT NULL DEFAULT 'stakeholders' CHECK (elected_by IN ('stakeholders', 'council', 'appointment')),
    election_proposal_id UUID REFERENCES governance_proposals(id) ON DELETE SET NULL,
    vote_count INTEGER NOT NULL DEFAULT 0 CHECK (vote_count >= 0),
    
    -- Responsibilities and permissions
    can_create_proposals BOOLEAN DEFAULT true NOT NULL,
    can_approve_treasury BOOLEAN DEFAULT false NOT NULL,
    can_execute_changes BOOLEAN DEFAULT false NOT NULL,
    
    -- Performance metrics
    proposals_created INTEGER NOT NULL DEFAULT 0 CHECK (proposals_created >= 0),
    proposals_approved INTEGER NOT NULL DEFAULT 0 CHECK (proposals_approved >= 0),
    attendance_rate DECIMAL(5,4) NOT NULL DEFAULT 1.0000 CHECK (attendance_rate >= 0 AND attendance_rate <= 1),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(player_id, term_start_date)
);

-- ===================================
-- COUNCIL MEETINGS
-- ===================================
CREATE TABLE council_meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Meeting details
    title VARCHAR(200) NOT NULL,
    description TEXT,
    meeting_type VARCHAR(30) NOT NULL CHECK (meeting_type IN ('regular', 'special', 'emergency', 'committee')),
    committee VARCHAR(50),
    
    -- Schedule
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 60 CHECK (duration_minutes > 0),
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    
    -- Location/Platform
    meeting_location VARCHAR(100),
    meeting_platform VARCHAR(50) CHECK (meeting_platform IN ('discord', 'telegram', 'zoom', 'in_person')),
    meeting_link TEXT,
    
    -- Attendance
    required_attendees INTEGER NOT NULL DEFAULT 3 CHECK (required_attendees > 0),
    actual_attendees INTEGER NOT NULL DEFAULT 0 CHECK (actual_attendees >= 0),
    quorum_met BOOLEAN DEFAULT false NOT NULL,
    
    -- Agenda and outcomes
    agenda JSONB DEFAULT '[]' NOT NULL,
    meeting_minutes TEXT,
    decisions_made JSONB DEFAULT '[]' NOT NULL,
    action_items JSONB DEFAULT '[]' NOT NULL,
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    
    -- Metadata
    created_by UUID NOT NULL REFERENCES players(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- COUNCIL MEETING ATTENDANCE
-- ===================================
CREATE TABLE council_meeting_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID NOT NULL REFERENCES council_meetings(id) ON DELETE CASCADE,
    council_member_id UUID NOT NULL REFERENCES governance_council(id) ON DELETE CASCADE,
    
    -- Attendance details
    attendance_status VARCHAR(20) NOT NULL CHECK (attendance_status IN ('attended', 'absent', 'excused', 'late')),
    joined_at TIMESTAMP WITH TIME ZONE,
    left_at TIMESTAMP WITH TIME ZONE,
    absence_reason TEXT,
    
    -- Participation
    spoke BOOLEAN DEFAULT false NOT NULL,
    voted_on_proposals INTEGER DEFAULT 0 CHECK (voted_on_proposals >= 0),
    contributions_made JSONB DEFAULT '[]' NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(meeting_id, council_member_id)
);

-- ===================================
-- GOVERNANCE NOTIFICATIONS
-- ===================================
CREATE TABLE governance_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    
    -- Notification details
    notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('proposal_created', 'voting_started', 'voting_ending', 'proposal_passed', 'proposal_failed', 'council_meeting', 'treasury_allocation')),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    
    -- Related entities
    proposal_id UUID REFERENCES governance_proposals(id) ON DELETE SET NULL,
    meeting_id UUID REFERENCES council_meetings(id) ON DELETE SET NULL,
    transaction_id UUID REFERENCES treasury_transactions(id) ON DELETE SET NULL,
    
    -- Status
    is_read BOOLEAN DEFAULT false NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE,
    is_action_required BOOLEAN DEFAULT false NOT NULL,
    action_taken BOOLEAN DEFAULT false NOT NULL,
    
    -- Metadata
    priority VARCHAR(10) NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- PERFORMANCE INDEXES
-- ===================================

-- Proposal performance
CREATE INDEX idx_governance_proposals_creator_id ON governance_proposals(creator_id);
CREATE INDEX idx_governance_proposals_status ON governance_proposals(status);
CREATE INDEX idx_governance_proposals_category ON governance_proposals(category);
CREATE INDEX idx_governance_proposals_voting_ends_at ON governance_proposals(voting_ends_at);
CREATE INDEX idx_governance_proposals_created_at ON governance_proposals(created_at);

-- Vote performance
CREATE INDEX idx_proposal_votes_proposal_id ON proposal_votes(proposal_id);
CREATE INDEX idx_proposal_votes_voter_id ON proposal_votes(voter_id);
CREATE INDEX idx_proposal_votes_vote_type ON proposal_votes(vote_type);
CREATE INDEX idx_proposal_votes_voted_at ON proposal_votes(voted_at);

-- Change log performance
CREATE INDEX idx_governance_change_log_proposal_id ON governance_change_log(proposal_id);
CREATE INDEX idx_governance_change_log_change_type ON governance_change_log(change_type);
CREATE INDEX idx_governance_change_log_executed_at ON governance_change_log(executed_at);

-- Treasury performance
CREATE INDEX idx_treasury_transactions_treasury_id ON treasury_transactions(treasury_id);
CREATE INDEX idx_treasury_transactions_status ON treasury_transactions(status);
CREATE INDEX idx_treasury_transactions_transaction_type ON treasury_transactions(transaction_type);
CREATE INDEX idx_treasury_transactions_created_at ON treasury_transactions(created_at);

-- Council performance
CREATE INDEX idx_governance_council_player_id ON governance_council(player_id);
CREATE INDEX idx_governance_council_council_role ON governance_council(council_role);
CREATE INDEX idx_governance_council_is_active ON governance_council(is_active);
CREATE INDEX idx_governance_council_committee ON governance_council(committee);

-- Meeting performance
CREATE INDEX idx_council_meetings_scheduled_at ON council_meetings(scheduled_at);
CREATE INDEX idx_council_meetings_status ON council_meetings(status);
CREATE INDEX idx_council_meetings_committee ON council_meetings(committee);
CREATE INDEX idx_council_meetings_created_by ON council_meetings(created_by);

-- Attendance performance
CREATE INDEX idx_council_meeting_attendance_meeting_id ON council_meeting_attendance(meeting_id);
CREATE INDEX idx_council_meeting_attendance_council_member_id ON council_meeting_attendance(council_member_id);
CREATE INDEX idx_council_meeting_attendance_attendance_status ON council_meeting_attendance(attendance_status);

-- Notification performance
CREATE INDEX idx_governance_notifications_player_id ON governance_notifications(player_id);
CREATE INDEX idx_governance_notifications_is_read ON governance_notifications(is_read);
CREATE INDEX idx_governance_notifications_notification_type ON governance_notifications(notification_type);
CREATE INDEX idx_governance_notifications_created_at ON governance_notifications(created_at);

-- ===================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ===================================

-- Update proposal vote counts when votes are cast
CREATE OR REPLACE FUNCTION update_proposal_vote_counts_on_vote()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        -- Update vote counts
        UPDATE governance_proposals 
        SET 
            for_votes = COALESCE((SELECT SUM(voting_power) FROM proposal_votes WHERE proposal_id = NEW.proposal_id AND vote_type = 'for'), 0),
            against_votes = COALESCE((SELECT SUM(voting_power) FROM proposal_votes WHERE proposal_id = NEW.proposal_id AND vote_type = 'against'), 0),
            abstain_votes = COALESCE((SELECT SUM(voting_power) FROM proposal_votes WHERE proposal_id = NEW.proposal_id AND vote_type = 'abstain'), 0),
            total_votes = (SELECT COUNT(*) FROM proposal_votes WHERE proposal_id = NEW.proposal_id),
            total_voting_power = COALESCE((SELECT SUM(voting_power) FROM proposal_votes WHERE proposal_id = NEW.proposal_id), 0),
            updated_at = NOW()
        WHERE id = NEW.proposal_id;
        
        -- Check if voting period has ended and update status
        PERFORM check_proposal_voting_completion(NEW.proposal_id);
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Update vote counts after vote deletion
        UPDATE governance_proposals 
        SET 
            for_votes = COALESCE((SELECT SUM(voting_power) FROM proposal_votes WHERE proposal_id = OLD.proposal_id AND vote_type = 'for'), 0),
            against_votes = COALESCE((SELECT SUM(voting_power) FROM proposal_votes WHERE proposal_id = OLD.proposal_id AND vote_type = 'against'), 0),
            abstain_votes = COALESCE((SELECT SUM(voting_power) FROM proposal_votes WHERE proposal_id = OLD.proposal_id AND vote_type = 'abstain'), 0),
            total_votes = (SELECT COUNT(*) FROM proposal_votes WHERE proposal_id = OLD.proposal_id),
            total_voting_power = COALESCE((SELECT SUM(voting_power) FROM proposal_votes WHERE proposal_id = OLD.proposal_id), 0),
            updated_at = NOW()
        WHERE id = OLD.proposal_id;
        
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_proposal_vote_counts_on_vote
    AFTER INSERT OR UPDATE OR DELETE ON proposal_votes
    FOR EACH ROW EXECUTE FUNCTION update_proposal_vote_counts_on_vote();

-- Function to check proposal voting completion
CREATE OR REPLACE FUNCTION check_proposal_voting_completion(proposal_id UUID)
RETURNS VOID AS $$
DECLARE
    proposal_record RECORD;
    total_governance_power DECIMAL;
    quorum_met BOOLEAN;
    voting_ended BOOLEAN;
BEGIN
    -- Get proposal details
    SELECT * INTO proposal_record 
    FROM governance_proposals 
    WHERE id = proposal_id;
    
    IF NOT FOUND THEN
        RETURN;
    END IF;
    
    -- Check if voting period has ended
    voting_ended := NOW() > proposal_record.voting_ends_at;
    
    IF NOT voting_ended THEN
        RETURN;
    END IF;
    
    -- Calculate total governance power for quorum
    SELECT SUM(total_governance_power) INTO total_governance_power
    FROM governance_power;
    
    -- Check if quorum is met
    quorum_met := (proposal_record.total_voting_power / total_governance_power) >= proposal_record.quorum_required;
    
    -- Update proposal status
    UPDATE governance_proposals 
    SET 
        quorum_met = quorum_met,
        status = CASE 
            WHEN quorum_met THEN 'passed'
            ELSE 'failed'
        END,
        outcome = CASE 
            WHEN NOT quorum_met THEN 'quorum_not_met'
            WHEN (proposal_record.for_votes / proposal_record.total_voting_power) >= proposal_record.approval_threshold THEN 'approved'
            ELSE 'rejected'
        END,
        updated_at = NOW()
    WHERE id = proposal_id;
    
    -- If proposal was approved, schedule execution
    IF quorum_met AND (proposal_record.for_votes / proposal_record.total_voting_power) >= proposal_record.approval_threshold THEN
        -- Notify execution service (this would be handled by application code)
        INSERT INTO governance_change_log (proposal_id, change_type, target_table, execution_status)
        VALUES (proposal_id, 'proposal_execution', 'multiple', 'pending');
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_governance_proposals_updated_at 
    BEFORE UPDATE ON governance_proposals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_governance_treasury_updated_at 
    BEFORE UPDATE ON governance_treasury
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treasury_transactions_updated_at 
    BEFORE UPDATE ON treasury_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_governance_council_updated_at 
    BEFORE UPDATE ON governance_council
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_council_meetings_updated_at 
    BEFORE UPDATE ON council_meetings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- INITIAL TREASURY SETUP
-- ===================================

INSERT INTO governance_treasury (id, reputation_balance, token_balance)
VALUES (uuid_generate_v4(), 100000.00, 1000000);
