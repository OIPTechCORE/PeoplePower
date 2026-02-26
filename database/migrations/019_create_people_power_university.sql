-- People Power University (PPU) Database Schema
-- The Knowledge Engine Inside Your Digital Civilization

-- PPU Faculties (Schools)
CREATE TABLE IF NOT EXISTS ppu_faculties (
    id SERIAL PRIMARY KEY,
    faculty_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    skills JSONB, -- Array of skills taught
    economic_role VARCHAR(100), -- community_leaders, creators_founders, builders, cultural_creators, coordinators
    duration_weeks INTEGER NOT NULL,
    difficulty VARCHAR(20) NOT NULL, -- beginner, intermediate, advanced
    prerequisites JSONB, -- Required skills/certificates
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- PPU Courses
CREATE TABLE IF NOT EXISTS ppu_courses (
    id SERIAL PRIMARY KEY,
    course_id VARCHAR(100) UNIQUE NOT NULL,
    faculty_id VARCHAR(100) REFERENCES ppu_faculties(faculty_id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_weeks INTEGER NOT NULL,
    lesson_count INTEGER NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    skills JSONB, -- Skills taught in this course
    prerequisites JSONB, -- Required courses/skills
    rewards JSONB, -- influence, reputation, certificates
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- PPU Lessons
CREATE TABLE IF NOT EXISTS ppu_lessons (
    id SERIAL PRIMARY KEY,
    lesson_id VARCHAR(100) UNIQUE NOT NULL,
    course_id VARCHAR(100) REFERENCES ppu_courses(course_id),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    lesson_type VARCHAR(50) NOT NULL, -- video, text, interactive, simulation, quiz
    duration_minutes INTEGER NOT NULL,
    order_index INTEGER NOT NULL,
    skills_taught JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- PPU Enrollments
CREATE TABLE IF NOT EXISTS ppu_enrollments (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    course_id VARCHAR(100) REFERENCES ppu_courses(course_id),
    faculty_id VARCHAR(100) REFERENCES ppu_faculties(faculty_id),
    enrollment_date TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active', -- active, completed, dropped, paused
    completion_date TIMESTAMP,
    progress_percentage INTEGER DEFAULT 0,
    last_accessed TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- PPU Lesson Progress
CREATE TABLE IF NOT EXISTS ppu_lesson_progress (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    course_id VARCHAR(100) REFERENCES ppu_courses(course_id),
    lesson_id VARCHAR(100) REFERENCES ppu_lessons(lesson_id),
    completion_date TIMESTAMP DEFAULT NOW(),
    score INTEGER, -- 0-100
    time_spent_seconds INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 1,
    rewards_earned INTEGER DEFAULT 0,
    feedback_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, course_id, lesson_id)
);

-- PPU Academic Certificates
CREATE TABLE IF NOT EXISTS ppu_academic_certificates (
    id SERIAL PRIMARY KEY,
    certificate_id VARCHAR(100) UNIQUE NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    course_id VARCHAR(100) REFERENCES ppu_courses(course_id),
    certificate_type VARCHAR(50) NOT NULL, -- course_completion, skill_mastery, faculty_honor
    title VARCHAR(255) NOT NULL,
    description TEXT,
    skills_earned JSONB,
    awarded_date TIMESTAMP DEFAULT NOW(),
    verification_code VARCHAR(50) UNIQUE,
    is_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- PPU Mentorship Programs
CREATE TABLE IF NOT EXISTS ppu_mentorship_programs (
    id SERIAL PRIMARY KEY,
    program_id VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    requirements JSONB, -- min_reputation, completed_courses, certificates, time_commitment
    rewards JSONB, -- influence_per_hour, reputation_bonus, special_badges
    availability VARCHAR(20) DEFAULT 'always_open', -- always_open, limited, seasonal
    max_mentors INTEGER,
    current_mentors INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- PPU Mentorship Applications
CREATE TABLE IF NOT EXISTS ppu_mentorship_applications (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    program_id VARCHAR(100) REFERENCES ppu_mentorship_programs(program_id),
    application_data JSONB,
    application_date TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, active, completed
    review_date TIMESTAMP,
    reviewer_notes TEXT,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- PPU Mentorship Sessions
CREATE TABLE IF NOT EXISTS ppu_mentorship_sessions (
    id SERIAL PRIMARY KEY,
    mentor_id VARCHAR(50) NOT NULL,
    mentee_id VARCHAR(50) NOT NULL,
    program_id VARCHAR(100) REFERENCES ppu_mentorship_programs(program_id),
    session_date TIMESTAMP DEFAULT NOW(),
    duration_minutes INTEGER NOT NULL,
    session_type VARCHAR(50), -- tutoring, guidance, review, feedback
    topics_covered JSONB,
    influence_earned INTEGER DEFAULT 0,
    reputation_earned INTEGER DEFAULT 0,
    feedback_rating INTEGER, -- 1-5
    feedback_text TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- PPU Academic Progress Tracking
CREATE TABLE IF NOT EXISTS user_academic_progress (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    total_courses_enrolled INTEGER DEFAULT 0,
    total_courses_completed INTEGER DEFAULT 0,
    total_lessons_completed INTEGER DEFAULT 0,
    total_learning_rewards INTEGER DEFAULT 0,
    total_certificates_earned INTEGER DEFAULT 0,
    current_gpa DECIMAL(3,2),
    academic_rank VARCHAR(50), -- freshman, sophomore, junior, senior, graduate
    faculty_specializations JSONB, -- Array of faculty IDs where user has excelled
    mentorship_hours INTEGER DEFAULT 0,
    last_academic_activity TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);

-- PPU Knowledge Contributions
CREATE TABLE IF NOT EXISTS ppu_knowledge_contributions (
    id SERIAL PRIMARY KEY,
    contributor_id VARCHAR(50) NOT NULL,
    contribution_type VARCHAR(50) NOT NULL, -- course_material, tutorial, article, video, quiz
        title VARCHAR(255) NOT NULL,
    content TEXT,
    faculty_id VARCHAR(100) REFERENCES ppu_faculties(faculty_id),
    course_id VARCHAR(100) REFERENCES ppu_courses(course_id),
    quality_rating DECIMAL(3,2),
    student_feedback JSONB,
    usage_count INTEGER DEFAULT 0,
    influence_earned INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending_review', -- pending_review, approved, rejected
    created_at TIMESTAMP DEFAULT NOW()
);

-- PPU Community Learning Groups
CREATE TABLE IF NOT EXISTS ppu_learning_groups (
    id SERIAL PRIMARY KEY,
    group_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
        faculty_id VARCHAR(100) REFERENCES ppu_faculties(faculty_id),
    course_id VARCHAR(100) REFERENCES ppu_courses(course_id),
    group_type VARCHAR(50) DEFAULT 'study', -- study, project, research, discussion
    max_members INTEGER DEFAULT 50,
    current_members INTEGER DEFAULT 0,
    leader_id VARCHAR(50),
        meeting_schedule JSONB, -- Regular meeting times
        resources_shared JSONB,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
);

-- PPU Learning Group Memberships
CREATE TABLE IF NOT EXISTS ppu_learning_group_memberships (
    id SERIAL PRIMARY KEY,
    group_id VARCHAR(100) REFERENCES ppu_learning_groups(group_id),
    user_id VARCHAR(50) NOT NULL,
    role VARCHAR(20) DEFAULT 'member', -- leader, moderator, member
    joined_date TIMESTAMP DEFAULT NOW(),
    last_active TIMESTAMP DEFAULT NOW(),
    contribution_score INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'active', -- active, inactive, removed
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- PPU Academic Leaderboard
CREATE TABLE IF NOT EXISTS ppu_academic_leaderboard (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    leaderboard_type VARCHAR(50) NOT NULL, -- weekly_learning, monthly_completion, mentorship, contributions
    rank_position INTEGER NOT NULL,
    score_value INTEGER NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    additional_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- PPU Research Projects
CREATE TABLE IF NOT EXISTS ppu_research_projects (
    id SERIAL PRIMARY KEY,
    project_id VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    faculty_id VARCHAR(100) REFERENCES ppu_faculties(faculty_id),
    lead_researcher_id VARCHAR(50),
    team_members JSONB, -- Array of user IDs
    research_type VARCHAR(50), -- academic, applied, community, experimental
    status VARCHAR(20) DEFAULT 'proposed', -- proposed, active, completed, published
    start_date TIMESTAMP,
    expected_completion_date TIMESTAMP,
    actual_completion_date TIMESTAMP,
    findings TEXT,
    influence_funding INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ppu_faculties_active ON ppu_faculties(is_active);
CREATE INDEX IF NOT EXISTS idx_ppu_faculties_economic_role ON ppu_faculties(economic_role);
CREATE INDEX IF NOT EXISTS idx_ppu_courses_faculty ON ppu_courses(faculty_id);
CREATE INDEX IF NOT EXISTS idx_ppu_courses_active ON ppu_courses(is_active);
CREATE INDEX IF NOT EXISTS idx_ppu_courses_difficulty ON ppu_courses(difficulty);
CREATE INDEX IF NOT EXISTS idx_ppu_lessons_course ON ppu_lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_ppu_lessons_order ON ppu_lessons(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_ppu_enrollments_user ON ppu_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_ppu_enrollments_course ON ppu_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_ppu_enrollments_status ON ppu_enrollments(status);
CREATE INDEX IF NOT EXISTS idx_ppu_lesson_progress_user ON ppu_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_ppu_lesson_progress_course ON ppu_lesson_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_ppu_certificates_user ON ppu_academic_certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_ppu_certificates_course ON ppu_academic_certificates(course_id);
CREATE INDEX IF NOT EXISTS idx_ppu_mentorship_programs_active ON ppu_mentorship_programs(is_active);
CREATE INDEX IF NOT EXISTS idx_ppu_mentorship_applications_user ON ppu_mentorship_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_ppu_mentorship_applications_status ON ppu_mentorship_applications(status);
CREATE INDEX IF NOT EXISTS idx_ppu_mentorship_sessions_mentor ON ppu_mentorship_sessions(mentor_id);
CREATE INDEX IF NOT EXISTS idx_ppu_mentorship_sessions_mentee ON ppu_mentorship_sessions(mentee_id);
CREATE INDEX IF NOT EXISTS idx_user_academic_progress_user ON user_academic_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_ppu_knowledge_contributions_contributor ON ppu_knowledge_contributions(contributor_id);
CREATE INDEX IF NOT EXISTS idx_ppu_knowledge_contributions_status ON ppu_knowledge_contributions(status);
CREATE INDEX IF NOT EXISTS idx_ppu_learning_groups_faculty ON ppu_learning_groups(faculty_id);
CREATE INDEX IF NOT EXISTS idx_ppu_learning_groups_active ON ppu_learning_groups(is_active);
CREATE INDEX IF NOT EXISTS idx_ppu_group_memberships_group ON ppu_learning_group_memberships(group_id);
CREATE INDEX IF NOT EXISTS idx_ppu_group_memberships_user ON ppu_learning_group_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_ppu_leaderboard_user ON ppu_academic_leaderboard(user_id);
CREATE INDEX IF NOT EXISTS idx_ppu_leaderboard_type ON ppu_academic_leaderboard(leaderboard_type);
CREATE INDEX IF NOT EXISTS idx_ppu_leaderboard_period ON ppu_academic_leaderboard(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_ppu_research_projects_faculty ON ppu_research_projects(faculty_id);
CREATE INDEX IF NOT EXISTS idx_ppu_research_projects_status ON ppu_research_projects(status);

-- Create triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ppu_faculties_updated_at BEFORE UPDATE ON ppu_faculties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ppu_courses_updated_at BEFORE UPDATE ON ppu_courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_academic_progress_updated_at BEFORE UPDATE ON user_academic_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ppu_academic_leaderboard_updated_at BEFORE UPDATE ON ppu_academic_leaderboard FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create views for comprehensive academic analytics
CREATE OR REPLACE VIEW ppu_faculty_overview AS
SELECT 
    pf.faculty_id,
    pf.name,
    pf.description,
    pf.economic_role,
    pf.duration_weeks,
    pf.difficulty,
    COUNT(DISTINCT pc.course_id) as course_count,
    COUNT(DISTINCT pe.user_id) as enrolled_students,
    COUNT(DISTINCT CASE WHEN pe.status = 'completed' THEN pe.user_id END) as completed_students,
    AVG(CASE WHEN pe.status = 'completed' THEN pe.progress_percentage END) as average_completion_rate,
    COUNT(DISTINCT pac.certificate_id) as certificates_issued
FROM ppu_faculties pf
LEFT JOIN ppu_courses pc ON pf.faculty_id = pc.faculty_id
LEFT JOIN ppu_enrollments pe ON pc.course_id = pe.course_id
LEFT JOIN ppu_academic_certificates pac ON pc.course_id = pac.course_id
WHERE pf.is_active = true
GROUP BY pf.faculty_id, pf.name, pf.description, pf.economic_role, pf.duration_weeks, pf.difficulty
ORDER BY pf.name;

CREATE OR REPLACE VIEW ppu_student_academic_summary AS
SELECT 
    uap.user_id,
    uap.total_courses_enrolled,
    uap.total_courses_completed,
    uap.total_lessons_completed,
    uap.total_learning_rewards,
    uap.total_certificates_earned,
    uap.current_gpa,
    uap.academic_rank,
    uap.mentorship_hours,
    ic.influence_balance,
    ic.reputation_score,
    CASE 
        WHEN uap.total_courses_completed >= 10 THEN 'Graduate'
        WHEN uap.total_courses_completed >= 7 THEN 'Senior'
        WHEN uap.total_courses_completed >= 4 THEN 'Junior'
        WHEN uap.total_courses_completed >= 2 THEN 'Sophomore'
        ELSE 'Freshman'
    END as calculated_rank
FROM user_academic_progress uap
JOIN influence_currency ic ON uap.user_id = ic.user_id
ORDER BY uap.total_learning_rewards DESC;

CREATE OR REPLACE VIEW ppu_mentorship_impact AS
SELECT 
    pmp.program_id,
    pmp.title,
    COUNT(DISTINCT pma.user_id) as total_applications,
    COUNT(DISTINCT CASE WHEN pma.status = 'active' THEN pma.user_id END) as active_mentors,
    COUNT(DISTINCT pms.mentee_id) as total_mentees,
    SUM(pms.influence_earned) as total_influence_distributed,
    SUM(pms.reputation_earned) as total_reputation_distributed,
    AVG(pms.feedback_rating) as average_feedback_rating,
    SUM(pms.duration_minutes) as total_mentoring_hours
FROM ppu_mentorship_programs pmp
LEFT JOIN ppu_mentorship_applications pma ON pmp.program_id = pma.program_id
LEFT JOIN ppu_mentorship_sessions pms ON pma.user_id = pms.mentor_id AND pma.status = 'active'
WHERE pmp.is_active = true
GROUP BY pmp.program_id, pmp.title
ORDER BY total_influence_distributed DESC;

-- Insert initial PPU faculties
INSERT INTO ppu_faculties (faculty_id, name, description, skills, economic_role, duration_weeks, difficulty, prerequisites) VALUES
('leadership_governance', 'Leadership & Governance', 'Develop negotiation, ethics, and community leadership skills', 
 '["negotiation", "ethics", "public_speaking", "conflict_resolution", "strategic_thinking"]', 
 'community_leaders', 8, 'intermediate', 
 '["basic_citizenship", "community_participation"]'),
('digital_entrepreneurship', 'Digital Entrepreneurship', 'Learn to build and scale online businesses and digital ventures', 
 '["business_planning", "digital_marketing", "financial_literacy", "product_development", "scaling_strategies"]', 
 'creators_founders', 10, 'advanced', 
 '["basic_economics", "digital_literacy"]'),
('technology_ai_literacy', 'Technology & AI Literacy', 'Master coding basics, AI tools, and digital technology fundamentals', 
 '["coding_basics", "ai_tools", "data_analysis", "digital_security", "automation"]', 
 'builders', 12, 'intermediate', 
 '["basic_computer_skills"]'),
('creative_arts_media', 'Creative Arts & Media', 'Develop storytelling, design, and content creation skills', 
 '["storytelling", "graphic_design", "video_production", "content_strategy", "brand_building"]', 
 'cultural_creators', 6, 'beginner', 
 '[]'),
('civic_community_development', 'Civic & Community Development', 'Learn community organization, civic engagement, and social impact', 
 '["community_organization", "civic_engagement", "social_impact", "project_management", "fundraising"]', 
 'coordinators', 8, 'intermediate', 
 '["basic_citizenship"]')
ON CONFLICT (faculty_id) DO NOTHING;

-- Insert sample courses for each faculty
INSERT INTO ppu_courses (course_id, faculty_id, title, description, duration_weeks, lesson_count, difficulty, skills, rewards) VALUES
('lg_101', 'leadership_governance', 'Introduction to Community Leadership', 'Learn the fundamentals of leading communities and movements', 2, 10, 'beginner', 
 '["leadership_basics", "team_building", "motivation"]', 
 '{"influence": 500, "reputation": 100, "certificate": "basic_leadership"}'),
('lg_102', 'leadership_governance', 'Ethical Decision Making', 'Master ethical frameworks for leadership decisions', 3, 15, 'intermediate', 
 '["ethics", "moral_reasoning", "decision_making"]', 
 '{"influence": 750, "reputation": 150, "certificate": "ethical_leadership"}'),
('lg_201', 'leadership_governance', 'Advanced Governance Systems', 'Design and implement governance structures for digital communities', 4, 20, 'advanced', 
 '["governance_design", "policy_development", "constitutional_law"]', 
 '{"influence": 1000, "reputation": 250, "certificate": "governance_specialist"}'),
('de_101', 'digital_entrepreneurship', 'Digital Business Foundations', 'Build your first online business from scratch', 3, 12, 'beginner', 
 '["business_planning", "market_research", "value_proposition"]', 
 '{"influence": 600, "reputation": 120, "certificate": "digital_business"}'),
('de_202', 'digital_entrepreneurship', 'Scaling Digital Ventures', 'Learn strategies to scale your online business exponentially', 4, 16, 'advanced', 
 '["scaling_strategies", "growth_hacking", "automation"]', 
 '{"influence": 1200, "reputation": 300, "certificate": "scaling_expert"}'),
('ta_101', 'technology_ai_literacy', 'Coding Fundamentals', 'Learn programming basics and build your first applications', 6, 24, 'beginner', 
 '["programming_basics", "problem_solving", "debugging"]', 
 '{"influence": 800, "reputation": 200, "certificate": "junior_developer"}'),
('ta_102', 'technology_ai_literacy', 'AI Tools for Everyone', 'Master AI tools for productivity and creativity', 2, 8, 'beginner', 
 '["ai_tools", "prompt_engineering", "automation"]', 
 '{"influence": 400, "reputation": 100, "certificate": "ai_specialist"}'),
('ca_101', 'creative_arts_media', 'Storytelling for Digital Media', 'Master the art of compelling storytelling for digital platforms', 2, 8, 'beginner', 
 '["narrative_techniques", "digital_storytelling", "content_creation"]', 
 '{"influence": 300, "reputation": 75, "certificate": "digital_storyteller"}'),
('cc_101', 'civic_community_development', 'Community Organization Basics', 'Learn how to organize and mobilize communities for positive change', 3, 12, 'beginner', 
 '["community_building", "mobilization", "organizational_skills"]', 
 '{"influence": 450, "reputation": 90, "certificate": "community_organizer"}')
ON CONFLICT (course_id) DO NOTHING;

-- Insert initial mentorship programs
INSERT INTO ppu_mentorship_programs (program_id, title, description, requirements, rewards, availability, max_mentors) VALUES
('course_mentor', 'Course Mentor', 'Help guide students through their learning journey', 
 '{"minReputation": 500, "completedCourses": 3, "certificates": ["basic_leadership", "ethical_leadership"], "timeCommitment": "5 hours/week"}', 
 '{"influencePerHour": 100, "reputationBonus": 50, "mentorCertificate": true}', 
 'always_open', 1000),
('faculty_assistant', 'Faculty Assistant', 'Assist in course development and student support', 
 '{"minReputation": 1000, "completedCourses": 5, "certificates": ["governance_specialist"], "timeCommitment": "10 hours/week"}', 
 '{"influencePerHour": 150, "reputationBonus": 100, "facultyBadge": true}', 
 'limited', 100),
('community_educator', 'Community Educator', 'Create educational content for the community', 
 '{"minReputation": 750, "completedCourses": 4, "certificates": ["digital_business", "ai_specialist"], "timeCommitment": "flexible"}', 
 '{"influencePerContent": 200, "reputationBonus": 75, "creatorBadge": true}', 
 'always_open', 500)
ON CONFLICT (program_id) DO NOTHING;
