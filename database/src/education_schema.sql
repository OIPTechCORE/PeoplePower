-- People Power University Database Schema
-- Supports 100M+ courses with AI generation, community contribution, and quality control

-- Faculties
CREATE TABLE faculties (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO faculties (id, name, description) VALUES
('leadership_governance', 'Leadership & Governance', 'Develop leadership skills and understanding of governance systems'),
('digital_entrepreneurship', 'Digital Entrepreneurship', 'Build digital businesses and entrepreneurial skills'),
('technology_ai_literacy', 'Technology & AI Literacy', 'Master technology and artificial intelligence concepts'),
('creative_arts_media', 'Creative Arts & Media', 'Express creativity through digital arts and media'),
('civic_community_development', 'Civic & Community Development', 'Drive community development and civic engagement');

-- Courses Table (Designed for 100M+ courses)
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    faculty VARCHAR(50) NOT NULL REFERENCES faculties(id),
    level VARCHAR(20) NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert', 'professional')),
    duration INTEGER NOT NULL CHECK (duration > 0), -- minutes
    difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 10),
    tags TEXT[] DEFAULT '{}',
    learning_objectives TEXT[] DEFAULT '{}',
    prerequisites TEXT[] DEFAULT '{}',
    content JSONB DEFAULT '[]',
    assessments JSONB DEFAULT '[]',
    creator_id UUID NOT NULL,
    creator_type VARCHAR(30) NOT NULL CHECK (creator_type IN ('community_creator', 'certified_contributor', 'expert_contributor', 'institutional_partner')),
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'published', 'suspended', 'archived')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quality_score DECIMAL(5,2) DEFAULT 0 CHECK (quality_score BETWEEN 0 AND 100),
    completion_rate DECIMAL(5,2) DEFAULT 0 CHECK (completion_rate BETWEEN 0 AND 100),
    average_rating DECIMAL(3,2) DEFAULT 0 CHECK (average_rating BETWEEN 0 AND 5),
    enrollment_count INTEGER DEFAULT 0,
    language VARCHAR(10) DEFAULT 'en',
    region VARCHAR(50) DEFAULT 'global',
    cultural_context TEXT DEFAULT 'general',
    is_ai_generated BOOLEAN DEFAULT FALSE,
    is_community_created BOOLEAN DEFAULT TRUE,
    revenue_share DECIMAL(5,2) DEFAULT 10.00 CHECK (revenue_share BETWEEN 0 AND 100),
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0
);

-- Indexes for Course Discovery (Critical for 100M+ courses)
CREATE INDEX idx_courses_faculty ON courses(faculty);
CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_courses_language ON courses(language);
CREATE INDEX idx_courses_region ON courses(region);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_quality_score ON courses(quality_score DESC);
CREATE INDEX idx_courses_average_rating ON courses(average_rating DESC);
CREATE INDEX idx_courses_created_at ON courses(created_at DESC);
CREATE INDEX idx_courses_tags ON courses USING GIN(tags);
CREATE INDEX idx_courses_title ON courses USING GIN(to_tsvector('english', title));
CREATE INDEX idx_courses_description ON courses USING GIN(to_tsvector('english', description));
CREATE INDEX idx_courses_creator ON courses(creator_id, creator_type);

-- User Progress Tracking
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_content TEXT[] DEFAULT '{}',
    current_content VARCHAR(255),
    progress DECIMAL(5,2) DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    time_spent INTEGER DEFAULT 0, -- minutes
    assessment_attempts JSONB DEFAULT '[]',
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    certificate_id UUID,
    UNIQUE(user_id, course_id)
);

CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_course_id ON user_progress(course_id);
CREATE INDEX idx_user_progress_progress ON user_progress(progress);
CREATE INDEX idx_user_progress_last_accessed ON user_progress(last_accessed_at DESC);

-- Certificates
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    course_id UUID NOT NULL REFERENCES courses(id),
    type VARCHAR(20) NOT NULL CHECK (type IN ('completion', 'achievement', 'skill', 'professional', 'certification', 'diploma')),
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    verification_code VARCHAR(50) UNIQUE NOT NULL,
    credential_level VARCHAR(20) NOT NULL CHECK (credential_level IN ('basic', 'intermediate', 'advanced', 'expert', 'master')),
    skills TEXT[] DEFAULT '{}',
    issuer_id VARCHAR(100) DEFAULT 'people-power-university',
    blockchain_verified BOOLEAN DEFAULT FALSE,
    blockchain_tx_hash VARCHAR(255),
    is_revoked BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_certificates_course_id ON certificates(course_id);
CREATE INDEX idx_certificates_verification_code ON certificates(verification_code);
CREATE INDEX idx_certificates_issued_at ON certificates(issued_at DESC);

-- Creator Profiles
CREATE TABLE creator_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    type VARCHAR(30) NOT NULL CHECK (type IN ('community_creator', 'certified_contributor', 'expert_contributor', 'institutional_partner')),
    tier VARCHAR(10) NOT NULL CHECK (tier IN ('tier_1', 'tier_2', 'tier_3', 'tier_4')),
    specializations TEXT[] DEFAULT '{}',
    bio TEXT,
    qualifications JSONB DEFAULT '[]',
    courses_created INTEGER DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    reputation_score DECIMAL(5,2) DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_documents TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_creator_profiles_type ON creator_profiles(type);
CREATE INDEX idx_creator_profiles_tier ON creator_profiles(tier);
CREATE INDEX idx_creator_profiles_reputation ON creator_profiles(reputation_score DESC);
CREATE INDEX idx_creator_profiles_verified ON creator_profiles(is_verified);

-- AI Generation Requests Queue
CREATE TABLE ai_generation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic VARCHAR(255) NOT NULL,
    faculty VARCHAR(50) NOT NULL REFERENCES faculties(id),
    level VARCHAR(20) NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert', 'professional')),
    duration INTEGER NOT NULL CHECK (duration > 0),
    language VARCHAR(10) DEFAULT 'en',
    region VARCHAR(50) DEFAULT 'global',
    cultural_context TEXT DEFAULT 'general',
    target_audience TEXT,
    learning_objectives TEXT[] DEFAULT '{}',
    special_requirements TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'quality_review')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    generated_course_id UUID REFERENCES courses(id),
    quality_score DECIMAL(5,2),
    processing_priority INTEGER DEFAULT 5 CHECK (processing_priority BETWEEN 1 AND 10),
    retry_count INTEGER DEFAULT 0,
    error_message TEXT
);

CREATE INDEX idx_ai_generation_requests_status ON ai_generation_requests(status);
CREATE INDEX idx_ai_generation_requests_priority ON ai_generation_requests(processing_priority DESC);
CREATE INDEX idx_ai_generation_requests_created_at ON ai_generation_requests(created_at);

-- Quality Metrics
CREATE TABLE quality_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id),
    accuracy_score DECIMAL(5,2) CHECK (accuracy_score BETWEEN 0 AND 100),
    educational_value_score DECIMAL(5,2) CHECK (educational_value_score BETWEEN 0 AND 100),
    engagement_score DECIMAL(5,2) CHECK (engagement_score BETWEEN 0 AND 100),
    cultural_fit_score DECIMAL(5,2) CHECK (cultural_fit_score BETWEEN 0 AND 100),
    technical_quality_score DECIMAL(5,2) CHECK (technical_quality_score BETWEEN 0 AND 100),
    overall_score DECIMAL(5,2) CHECK (overall_score BETWEEN 0 AND 100),
    reviewed_by VARCHAR(100) NOT NULL,
    reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    feedback TEXT,
    approved BOOLEAN DEFAULT FALSE,
    recommendations TEXT[] DEFAULT '{}'
);

CREATE INDEX idx_quality_metrics_course_id ON quality_metrics(course_id);
CREATE INDEX idx_quality_metrics_overall_score ON quality_metrics(overall_score DESC);
CREATE INDEX idx_quality_metrics_approved ON quality_metrics(approved);

-- Peer Reviews
CREATE TABLE peer_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id),
    reviewer_id UUID NOT NULL,
    rating DECIMAL(3,2) CHECK (rating BETWEEN 0 AND 5),
    feedback TEXT,
    recommendations TEXT[] DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    UNIQUE(course_id, reviewer_id)
);

CREATE INDEX idx_peer_reviews_course_id ON peer_reviews(course_id);
CREATE INDEX idx_peer_reviews_reviewer_id ON peer_reviews(reviewer_id);
CREATE INDEX idx_peer_reviews_rating ON peer_reviews(rating DESC);
CREATE INDEX idx_peer_reviews_status ON peer_reviews(status);

-- Regional Adaptations
CREATE TABLE regional_adaptations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_course_id UUID NOT NULL REFERENCES courses(id),
    adapted_course_id UUID NOT NULL REFERENCES courses(id),
    target_region VARCHAR(50) NOT NULL,
    target_language VARCHAR(10) NOT NULL,
    cultural_modifications TEXT[] DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'approved', 'rejected')),
    adapted_by VARCHAR(100) NOT NULL,
    adapted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by VARCHAR(100),
    approved_at TIMESTAMP
);

CREATE INDEX idx_regional_adaptations_original ON regional_adaptations(original_course_id);
CREATE INDEX idx_regional_adaptations_adapted ON regional_adaptations(adapted_course_id);
CREATE INDEX idx_regional_adaptations_region ON regional_adaptations(target_region);
CREATE INDEX idx_regional_adaptations_status ON regional_adaptations(status);

-- Learning Analytics
CREATE TABLE learning_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    course_id UUID NOT NULL REFERENCES courses(id),
    content_id VARCHAR(255),
    event_type VARCHAR(50) NOT NULL, -- 'start', 'complete', 'pause', 'assessment_start', 'assessment_complete'
    event_data JSONB DEFAULT '{}',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR(100),
    time_spent INTEGER, -- seconds
    device_type VARCHAR(50),
    location_country VARCHAR(2)
);

CREATE INDEX idx_learning_analytics_user_id ON learning_analytics(user_id);
CREATE INDEX idx_learning_analytics_course_id ON learning_analytics(course_id);
CREATE INDEX idx_learning_analytics_timestamp ON learning_analytics(timestamp DESC);
CREATE INDEX idx_learning_analytics_event_type ON learning_analytics(event_type);

-- Course Revenue Tracking
CREATE TABLE course_revenue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id),
    creator_id UUID NOT NULL,
    revenue_type VARCHAR(50) NOT NULL, -- 'enrollment', 'premium_content', 'certificate', 'subscription'
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    platform_fee DECIMAL(10,2) NOT NULL,
    creator_earnings DECIMAL(10,2) NOT NULL,
    transaction_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_course_revenue_course_id ON course_revenue(course_id);
CREATE INDEX idx_course_revenue_creator_id ON course_revenue(creator_id);
CREATE INDEX idx_course_revenue_created_at ON course_revenue(created_at DESC);

-- Content Storage for Large Media Files
CREATE TABLE course_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id),
    content_id VARCHAR(255) NOT NULL,
    media_type VARCHAR(50) NOT NULL, -- 'video', 'audio', 'image', 'document'
    file_url VARCHAR(500) NOT NULL,
    file_size BIGINT,
    duration INTEGER, -- for video/audio in seconds
    thumbnail_url VARCHAR(500),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_course_media_course_id ON course_media(course_id);
CREATE INDEX idx_course_media_type ON course_media(media_type);

-- Skills and Competencies Framework
CREATE TABLE skills_framework (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    level INTEGER CHECK (level BETWEEN 1 AND 10),
    parent_skill_id UUID REFERENCES skills_framework(id),
    faculty VARCHAR(50) REFERENCES faculties(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_skills_framework_category ON skills_framework(category);
CREATE INDEX idx_skills_framework_faculty ON skills_framework(faculty);
CREATE INDEX idx_skills_framework_parent ON skills_framework(parent_skill_id);

-- Course Skills Mapping
CREATE TABLE course_skills_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id),
    skill_id UUID NOT NULL REFERENCES skills_framework(id),
    proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 10),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, skill_id)
);

CREATE INDEX idx_course_skills_mapping_course_id ON course_skills_mapping(course_id);
CREATE INDEX idx_course_skills_mapping_skill_id ON course_skills_mapping(skill_id);

-- User Skills Tracking
CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    skill_id UUID NOT NULL REFERENCES skills_framework(id),
    proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 10),
    source_type VARCHAR(50) NOT NULL, -- 'course_completion', 'assessment', 'peer_review'
    source_id UUID,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, skill_id, source_type, source_id)
);

CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill_id ON user_skills(skill_id);
CREATE INDEX idx_user_skills_proficiency ON user_skills(proficiency_level DESC);

-- Triggers for Automatic Updates
CREATE OR REPLACE FUNCTION update_course_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE courses 
        SET enrollment_count = (
            SELECT COUNT(*) FROM user_progress 
            WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
        ),
        completion_rate = (
            SELECT CASE 
                WHEN COUNT(*) > 0 THEN (COUNT(CASE WHEN is_completed = true THEN 1 END) * 100.0 / COUNT(*))
                ELSE 0 
            END
            FROM user_progress 
            WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
        )
        WHERE id = COALESCE(NEW.course_id, OLD.course_id);
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_course_stats
    AFTER INSERT OR UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_course_stats();

-- Function for Course Quality Score Calculation
CREATE OR REPLACE FUNCTION calculate_course_quality_score(course_uuid UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    quality_score DECIMAL(5,2);
BEGIN
    SELECT COALESCE(
        (accuracy_score * 0.3 + 
         educational_value_score * 0.3 + 
         engagement_score * 0.2 + 
         cultural_fit_score * 0.1 + 
         technical_quality_score * 0.1), 0
    ) INTO quality_score
    FROM quality_metrics 
    WHERE course_id = course_uuid 
    AND approved = true 
    ORDER BY reviewed_at DESC 
    LIMIT 1;
    
    RETURN COALESCE(quality_score, 0);
END;
$$ LANGUAGE plpgsql;

-- Partitioning for Learning Analytics (for high-volume data)
CREATE TABLE learning_analytics_y2024m01 PARTITION OF learning_analytics
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE learning_analytics_y2024m02 PARTITION OF learning_analytics
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Add more partitions as needed for each month

-- Views for Common Queries
CREATE VIEW course_catalog AS
SELECT 
    c.id,
    c.title,
    c.description,
    c.faculty,
    f.name as faculty_name,
    c.level,
    c.duration,
    c.difficulty,
    c.tags,
    c.average_rating,
    c.quality_score,
    c.enrollment_count,
    c.completion_rate,
    c.language,
    c.region,
    c.creator_id,
    cp.type as creator_type,
    cp.tier as creator_tier,
    cp.is_verified as creator_verified,
    c.created_at,
    c.view_count,
    c.like_count,
    c.share_count
FROM courses c
JOIN faculties f ON c.faculty = f.id
LEFT JOIN creator_profiles cp ON c.creator_id = cp.user_id
WHERE c.status = 'published';

CREATE VIEW user_learning_summary AS
SELECT 
    up.user_id,
    COUNT(DISTINCT up.course_id) as courses_enrolled,
    COUNT(CASE WHEN up.is_completed = true THEN 1 END) as courses_completed,
    AVG(up.progress) as average_progress,
    SUM(up.time_spent) as total_time_spent,
    COUNT(DISTINCT cert.id) as certificates_earned,
    MAX(up.last_accessed_at) as last_activity
FROM user_progress up
LEFT JOIN certificates cert ON up.user_id = cert.user_id
GROUP BY up.user_id;

-- Materialized Views for Performance (refresh periodically)
CREATE MATERIALIZED VIEW popular_courses AS
SELECT 
    c.*,
    (c.enrollment_count * 0.4 + c.average_rating * 20 * 0.3 + c.quality_score * 0.2 + c.view_count * 0.1) as popularity_score
FROM courses c
WHERE c.status = 'published'
  AND c.enrollment_count > 0
ORDER BY popularity_score DESC;

CREATE INDEX idx_popular_courses_score ON popular_courses(popularity_score DESC);

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_popular_courses()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY popular_courses;
END;
$$ LANGUAGE plpgsql;

-- Schedule refresh (requires pg_cron extension)
-- SELECT cron.schedule('refresh-popular-courses', '0 */6 * * *', 'SELECT refresh_popular_courses();');

-- Comments for documentation
COMMENT ON TABLE courses IS 'Main courses table designed to handle 100M+ courses with proper indexing';
COMMENT ON TABLE user_progress IS 'Tracks user learning progress across all courses';
COMMENT ON TABLE certificates IS 'Stores certificates and credentials earned by users';
COMMENT ON TABLE creator_profiles IS 'Creator profiles with tier system and revenue tracking';
COMMENT ON TABLE ai_generation_requests IS 'Queue for AI-powered course generation requests';
COMMENT ON TABLE quality_metrics IS 'Quality assessment metrics for all courses';
COMMENT ON TABLE peer_reviews IS 'Community peer review system for quality control';
COMMENT ON TABLE learning_analytics IS 'Detailed learning analytics for personalization and improvement';
COMMENT ON TABLE course_revenue IS 'Financial tracking for creator revenue sharing';
