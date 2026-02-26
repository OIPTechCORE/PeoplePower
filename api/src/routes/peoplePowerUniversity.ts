import { Router, Request, Response } from 'express';
import { Pool } from 'pg';

export function createPeoplePowerUniversityRoutes(pool: Pool): Router {
  const router = Router();

  // ==================== PEOPLE POWER UNIVERSITY (PPU) ====================
  
  // Get PPU faculties and programs
  router.get('/ppu/faculties', async (req: Request, res: Response) => {
    try {
      const faculties = [
        {
          id: 'leadership_governance',
          name: 'Leadership & Governance',
          description: 'Develop negotiation, ethics, and community leadership skills',
          skills: ['negotiation', 'ethics', 'public_speaking', 'conflict_resolution', 'strategic_thinking'],
          economicRole: 'community_leaders',
          duration: '8 weeks',
          difficulty: 'intermediate',
          prerequisites: ['basic_citizenship', 'community_participation']
        },
        {
          id: 'digital_entrepreneurship',
          name: 'Digital Entrepreneurship',
          description: 'Learn to build and scale online businesses and digital ventures',
          skills: ['business_planning', 'digital_marketing', 'financial_literacy', 'product_development', 'scaling_strategies'],
          economicRole: 'creators_founders',
          duration: '10 weeks',
          difficulty: 'advanced',
          prerequisites: ['basic_economics', 'digital_literacy']
        },
        {
          id: 'technology_ai_literacy',
          name: 'Technology & AI Literacy',
          description: 'Master coding basics, AI tools, and digital technology fundamentals',
          skills: ['coding_basics', 'ai_tools', 'data_analysis', 'digital_security', 'automation'],
          economicRole: 'builders',
          duration: '12 weeks',
          difficulty: 'intermediate',
          prerequisites: ['basic_computer_skills']
        },
        {
          id: 'creative_arts_media',
          name: 'Creative Arts & Media',
          description: 'Develop storytelling, design, and content creation skills',
          skills: ['storytelling', 'graphic_design', 'video_production', 'content_strategy', 'brand_building'],
          economicRole: 'cultural_creators',
          duration: '6 weeks',
          difficulty: 'beginner',
          prerequisites: []
        },
        {
          id: 'civic_community_development',
          name: 'Civic & Community Development',
          description: 'Learn community organization, civic engagement, and social impact',
          skills: ['community_organization', 'civic_engagement', 'social_impact', 'project_management', 'fundraising'],
          economicRole: 'coordinators',
          duration: '8 weeks',
          difficulty: 'intermediate',
          prerequisites: ['basic_citizenship']
        }
      ];

      res.json({ 
        success: true, 
        data: faculties
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get available courses in a faculty
  router.get('/ppu/courses/:facultyId', async (req: Request, res: Response) => {
    try {
      const { facultyId } = req.params;
      
      // Mock courses data - in production, this would come from database
      const courses = {
        leadership_governance: [
          {
            id: 'lg_101',
            title: 'Introduction to Community Leadership',
            description: 'Learn the fundamentals of leading communities and movements',
            duration: '2 weeks',
            lessons: 10,
            difficulty: 'beginner',
            skills: ['leadership_basics', 'team_building', 'motivation'],
            rewards: { influence: 500, reputation: 100, certificate: 'basic_leadership' }
          },
          {
            id: 'lg_102',
            title: 'Ethical Decision Making',
            description: 'Master ethical frameworks for leadership decisions',
            duration: '3 weeks',
            lessons: 15,
            difficulty: 'intermediate',
            skills: ['ethics', 'moral_reasoning', 'decision_making'],
            rewards: { influence: 750, reputation: 150, certificate: 'ethical_leadership' }
          },
          {
            id: 'lg_201',
            title: 'Advanced Governance Systems',
            description: 'Design and implement governance structures for digital communities',
            duration: '4 weeks',
            lessons: 20,
            difficulty: 'advanced',
            skills: ['governance_design', 'policy_development', 'constitutional_law'],
            rewards: { influence: 1000, reputation: 250, certificate: 'governance_specialist' }
          }
        ],
        digital_entrepreneurship: [
          {
            id: 'de_101',
            title: 'Digital Business Foundations',
            description: 'Build your first online business from scratch',
            duration: '3 weeks',
            lessons: 12,
            difficulty: 'beginner',
            skills: ['business_planning', 'market_research', 'value_proposition'],
            rewards: { influence: 600, reputation: 120, certificate: 'digital_business' }
          },
          {
            id: 'de_202',
            title: 'Scaling Digital Ventures',
            description: 'Learn strategies to scale your online business exponentially',
            duration: '4 weeks',
            lessons: 16,
            difficulty: 'advanced',
            skills: ['scaling_strategies', 'growth_hacking', 'automation'],
            rewards: { influence: 1200, reputation: 300, certificate: 'scaling_expert' }
          }
        ],
        technology_ai_literacy: [
          {
            id: 'ta_101',
            title: 'Coding Fundamentals',
            description: 'Learn programming basics and build your first applications',
            duration: '6 weeks',
            lessons: 24,
            difficulty: 'beginner',
            skills: ['programming_basics', 'problem_solving', 'debugging'],
            rewards: { influence: 800, reputation: 200, certificate: 'junior_developer' }
          },
          {
            id: 'ta_102',
            title: 'AI Tools for Everyone',
            description: 'Master AI tools for productivity and creativity',
            duration: '2 weeks',
            lessons: 8,
            difficulty: 'beginner',
            skills: ['ai_tools', 'prompt_engineering', 'automation'],
            rewards: { influence: 400, reputation: 100, certificate: 'ai_specialist' }
          }
        ]
      };

      const facultyCourses = courses[facultyId] || [];
      
      res.json({ 
        success: true, 
        data: facultyCourses
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Enroll in a course
  router.post('/ppu/enroll', async (req: Request, res: Response) => {
    try {
      const { userId, courseId, facultyId } = req.body;
      
      // Check if user is eligible to enroll
      const eligibilityQuery = `
        SELECT 
          ic.influence_balance,
          ic.reputation_score,
          uap.completed_courses
        FROM influence_currency ic
        LEFT JOIN user_academic_progress uap ON ic.user_id = uap.user_id
        WHERE ic.user_id = $1
      `;
      const eligibilityResult = await pool.query(eligibilityQuery, [userId]);
      
      if (eligibilityResult.rows.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'User not found or insufficient academic progress'
        });
      }

      const userBalance = eligibilityResult.rows[0];
      
      // Check prerequisites (mock logic - in production, this would be more complex)
      const completedCourses = userBalance.completed_courses || [];
      const hasPrerequisites = true; // Simplified for now
      
      if (!hasPrerequisites) {
        return res.status(400).json({ 
          success: false, 
          error: 'Prerequisites not met',
          completedCourses
        });
      }
      
      // Create enrollment record
      const enrollmentQuery = `
        INSERT INTO ppu_enrollments (user_id, course_id, faculty_id, enrollment_date, status)
        VALUES ($1, $2, $3, NOW(), 'active')
        RETURNING *
      `;
      const enrollmentResult = await pool.query(enrollmentQuery, [userId, courseId, facultyId]);
      
      res.json({ 
        success: true, 
        data: {
          enrollment: enrollmentResult.rows[0],
          message: 'Successfully enrolled in course'
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Complete a lesson
  router.post('/ppu/lesson/complete', async (req: Request, res: Response) => {
    try {
      const { userId, courseId, lessonId, lessonScore, timeSpent } = req.body;
      
      // Check if user is enrolled in the course
      const enrollmentCheckQuery = `
        SELECT * FROM ppu_enrollments 
        WHERE user_id = $1 AND course_id = $2 AND status = 'active'
      `;
      const enrollmentCheck = await pool.query(enrollmentCheckQuery, [userId, courseId]);
      
      if (enrollmentCheck.rows.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Not enrolled in this course'
        });
      }
      
      // Check if lesson already completed
      const lessonCheckQuery = `
        SELECT * FROM ppu_lesson_progress 
        WHERE user_id = $1 AND course_id = $2 AND lesson_id = $3
      `;
      const lessonCheck = await pool.query(lessonCheckQuery, [userId, courseId, lessonId]);
      
      if (lessonCheck.rows.length > 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Lesson already completed'
        });
      }
      
      // Calculate rewards based on performance
      const baseReward = 50; // Base influence reward per lesson
      const performanceBonus = Math.floor(lessonScore * 0.5); // Bonus based on score
      const timeBonus = timeSpent > 300 ? 25 : 0; // Bonus for spending time
      const totalReward = baseReward + performanceBonus + timeBonus;
      
      // Create lesson completion record
      const lessonCompleteQuery = `
        INSERT INTO ppu_lesson_progress (user_id, course_id, lesson_id, completion_date, score, time_spent_seconds, rewards_earned)
        VALUES ($1, $2, $3, NOW(), $4, $5, $6)
        RETURNING *
      `;
      const lessonResult = await pool.query(lessonCompleteQuery, [userId, courseId, lessonId, lessonScore, timeSpent, totalReward]);
      
      // Update user's influence and reputation
      const updateQuery = `
        UPDATE influence_currency 
        SET influence_balance = influence_balance + $1,
            influence_earned = influence_earned + $1,
            reputation_score = reputation_score + $2,
            last_earned = NOW()
        WHERE user_id = $3
        RETURNING *
      `;
      const updateResult = await pool.query(updateQuery, [totalReward, Math.floor(lessonScore * 0.2), userId]);
      
      // Check if course is now complete
      const courseProgressQuery = `
        SELECT 
          COUNT(*) as completed_lessons,
          (SELECT lesson_count FROM ppu_courses WHERE course_id = $1) as total_lessons
        FROM ppu_lesson_progress 
        WHERE user_id = $2 AND course_id = $1
      `;
      const courseProgress = await pool.query(courseProgressQuery, [courseId, userId]);
      
      const completedLessons = parseInt(courseProgress.rows[0].completed_lessons);
      const totalLessons = courseProgress.rows[0].total_lessons;
      const isCourseComplete = completedLessons >= totalLessons;
      
      let courseCompletionReward = null;
      if (isCourseComplete) {
        // Award course completion bonus
        courseCompletionReward = 500; // Influence bonus for completing course
        
        const courseCompleteQuery = `
          UPDATE ppu_enrollments 
          SET status = 'completed', completion_date = NOW()
          WHERE user_id = $1 AND course_id = $2
          RETURNING *
        `;
        await pool.query(courseCompleteQuery, [userId, courseId]);
        
        // Update user balance with completion bonus
        await pool.query(updateQuery, [courseCompletionReward, 50, userId]);
      }
      
      res.json({ 
        success: true, 
        data: {
          lessonCompletion: lessonResult.rows[0],
          updatedBalance: updateResult.rows[0],
          courseProgress: {
            completedLessons,
            totalLessons,
            isCourseComplete
          },
          courseCompletionReward
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get user's academic progress
  router.get('/ppu/progress/:userId', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      
      // Get user's academic summary
      const progressQuery = `
        SELECT 
          ic.user_id,
          ic.influence_balance,
          ic.reputation_score,
          COUNT(DISTINCT pe.course_id) as enrolled_courses,
          COUNT(DISTINCT CASE WHEN pe.status = 'completed' THEN pe.course_id END) as completed_courses,
          COUNT(plp.lesson_id) as completed_lessons,
          SUM(plp.rewards_earned) as total_learning_rewards,
          COUNT(DISTINCT pac.certificate_id) as certificates_earned
        FROM influence_currency ic
        LEFT JOIN ppu_enrollments pe ON ic.user_id = pe.user_id
        LEFT JOIN ppu_lesson_progress plp ON ic.user_id = plp.user_id
        LEFT JOIN ppu_academic_certificates pac ON ic.user_id = pac.user_id
        WHERE ic.user_id = $1
        GROUP BY ic.user_id, ic.influence_balance, ic.reputation_score
      `;
      const progressResult = await pool.query(progressQuery, [userId]);
      
      // Get user's certificates
      const certificatesQuery = `
        SELECT * FROM ppu_academic_certificates WHERE user_id = $1 ORDER BY awarded_date DESC
      `;
      const certificatesResult = await pool.query(certificatesQuery, [userId]);
      
      // Get user's current enrollments
      const enrollmentsQuery = `
        SELECT 
          pe.*,
          pc.title as course_title,
          pc.faculty_id,
          pc.duration_weeks,
          pc.lesson_count
        FROM ppu_enrollments pe
        JOIN ppu_courses pc ON pe.course_id = pc.course_id
        WHERE pe.user_id = $1 AND pe.status = 'active'
      `;
      const enrollmentsResult = await pool.query(enrollmentsQuery, [userId]);
      
      res.json({ 
        success: true, 
        data: {
          academicSummary: progressResult.rows[0] || {
            enrolled_courses: 0,
            completed_courses: 0,
            completed_lessons: 0,
            total_learning_rewards: 0,
            certificates_earned: 0
          },
          certificates: certificatesResult.rows,
          activeEnrollments: enrollmentsResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get mentorship opportunities
  router.get('/ppu/mentorship', async (req: Request, res: Response) => {
    try {
      const mentorshipOpportunities = [
        {
          id: 'course_mentor',
          title: 'Course Mentor',
          description: 'Help guide students through their learning journey',
          requirements: {
            minReputation: 500,
            completedCourses: 3,
            certificates: ['basic_leadership', 'ethical_leadership'],
            timeCommitment: '5 hours/week'
          },
          rewards: {
            influencePerHour: 100,
            reputationBonus: 50,
            mentorCertificate: true
          },
          availability: 'always_open'
        },
        {
          id: 'faculty_assistant',
          title: 'Faculty Assistant',
          description: 'Assist in course development and student support',
          requirements: {
            minReputation: 1000,
            completedCourses: 5,
            certificates: ['governance_specialist'],
            timeCommitment: '10 hours/week'
          },
          rewards: {
            influencePerHour: 150,
            reputationBonus: 100,
            facultyBadge: true
          },
          availability: 'limited'
        },
        {
          id: 'community_educator',
          title: 'Community Educator',
          description: 'Create educational content for the community',
          requirements: {
            minReputation: 750,
            completedCourses: 4,
            certificates: ['digital_business', 'ai_specialist'],
            timeCommitment: 'flexible'
          },
          rewards: {
            influencePerContent: 200,
            reputationBonus: 75,
            creatorBadge: true
          },
          availability: 'always_open'
        }
      ];

      res.json({ 
        success: true, 
        data: mentorshipOpportunities
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Apply for mentorship position
  router.post('/ppu/mentorship/apply', async (req: Request, res: Response) => {
    try {
      const { userId, mentorshipId, applicationData } = req.body;
      
      // Check user eligibility
      const eligibilityQuery = `
        SELECT 
          ic.reputation_score,
          COUNT(DISTINCT pe.course_id) as completed_courses,
          COUNT(DISTINCT pac.certificate_id) as certificates_count
        FROM influence_currency ic
        LEFT JOIN ppu_enrollments pe ON ic.user_id = pe.user_id AND pe.status = 'completed'
        LEFT JOIN ppu_academic_certificates pac ON ic.user_id = pac.user_id
        WHERE ic.user_id = $1
        GROUP BY ic.reputation_score
      `;
      const eligibilityResult = await pool.query(eligibilityQuery, [userId]);
      
      if (eligibilityResult.rows.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'User not found or insufficient progress'
        });
      }
      
      const userStats = eligibilityResult.rows[0];
      
      // Create mentorship application
      const applicationQuery = `
        INSERT INTO ppu_mentorship_applications (user_id, mentorship_id, application_data, application_date, status)
        VALUES ($1, $2, $3, NOW(), 'pending')
        RETURNING *
      `;
      const applicationResult = await pool.query(applicationQuery, [userId, mentorshipId, applicationData]);
      
      res.json({ 
        success: true, 
        data: {
          application: applicationResult.rows[0],
          message: 'Mentorship application submitted successfully'
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  return router;
}
