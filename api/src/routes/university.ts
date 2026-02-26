import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { 
  PeoplePowerUniversity,
  Faculty,
  Course,
  Degree,
  MentorshipProgram,
  ResearchProject,
  CourseDifficulty,
  PrestigeLevel,
  FacultyType,
  ProjectStatus
} from '../../../shared/types/civilization';

export function createUniversityRoutes(pool: Pool): Router {
  const router = Router();

  // ==================== UNIVERSITY OVERVIEW ====================
  
  // Get university overview
  router.get('/overview', async (req: Request, res: Response) => {
    try {
      const result = await pool.query(
        `SELECT 
          u.*,
          COUNT(DISTINCT f.id) as faculty_count,
          COUNT(DISTINCT c.id) as course_count,
          COUNT(DISTINCT d.id) as degree_count,
          COUNT(DISTINCT mp.id) as mentorship_count,
          COUNT(DISTINCT rp.id) as research_count
        FROM people_power_university u
        LEFT JOIN faculties f ON u.id = f.university_id
        LEFT JOIN courses c ON f.id = c.faculty_id
        LEFT JOIN degrees d ON f.id = d.faculty_id
        LEFT JOIN mentorship_programs mp ON f.id = mp.faculty_id
        LEFT JOIN research_projects rp ON f.id = rp.faculty_id
        WHERE u.id = 'main'
        GROUP BY u.id`
      );

      // Get faculty details
      const facultyResult = await pool.query(
        'SELECT * FROM faculties WHERE university_id = $1 ORDER BY established_at ASC',
        ['main']
      );

      res.json({ 
        success: true, 
        data: {
          university: result.rows[0],
          faculties: facultyResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== FACULTIES ====================
  
  // Get all faculties
  router.get('/faculties', async (req: Request, res: Response) => {
    try {
      const { type } = req.query;
      
      let query = 'SELECT * FROM faculties WHERE university_id = $1';
      const params: any[] = ['main'];

      if (type) {
        query += ' AND type = $2';
        params.push(type);
      }

      query += ' ORDER BY established_at ASC';

      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get faculty details
  router.get('/faculties/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const result = await pool.query(
        'SELECT * FROM faculties WHERE id = $1 AND university_id = $2',
        [id, 'main']
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Faculty not found' });
      }

      // Get courses in this faculty
      const coursesResult = await pool.query(
        'SELECT * FROM courses WHERE faculty_id = $1 ORDER BY difficulty, title',
        [id]
      );

      // Get degrees offered
      const degreesResult = await pool.query(
        'SELECT * FROM degrees WHERE faculty_id = $1 ORDER BY prestige_level, total_credits',
        [id]
      );

      // Get mentorship programs
      const mentorshipResult = await pool.query(
        'SELECT * FROM mentorship_programs WHERE faculty_id = $1',
        [id]
      );

      res.json({ 
        success: true, 
        data: {
          faculty: result.rows[0],
          courses: coursesResult.rows,
          degrees: degreesResult.rows,
          mentorshipPrograms: mentorshipResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== COURSES ====================
  
  // Get available courses
  router.get('/courses', async (req: Request, res: Response) => {
    try {
      const { 
        facultyId, difficulty, isPublic, limit = 50, offset = 0 
      } = req.query;
      
      let query = `
        SELECT c.*, f.name as faculty_name, f.type as faculty_type
        FROM courses c
        JOIN faculties f ON c.faculty_id = f.id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (facultyId) {
        query += ' AND c.faculty_id = $' + (params.length + 1);
        params.push(facultyId);
      }

      if (difficulty) {
        query += ' AND c.difficulty = $' + (params.length + 1);
        params.push(difficulty);
      }

      if (isPublic !== undefined) {
        query += ' AND c.is_public = $' + (params.length + 1);
        params.push(isPublic === 'true');
      }

      query += ' ORDER BY c.enrollment_count DESC, c.title ASC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
      params.push(limit, offset);

      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Enroll in course
  router.post('/courses/:id/enroll', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { playerId } = req.body;

      // Verify course exists and is public
      const courseResult = await pool.query(
        'SELECT * FROM courses WHERE id = $1 AND is_public = true',
        [id]
      );

      if (courseResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Course not found or not available' });
      }

      const course = courseResult.rows[0];

      // Check if already enrolled
      const existingEnrollment = await pool.query(
        'SELECT * FROM course_enrollments WHERE course_id = $1 AND student_id = $2',
        [id, playerId]
      );

      if (existingEnrollment.rows.length > 0) {
        return res.status(400).json({ success: false, error: 'Already enrolled in this course' });
      }

      // Check prerequisites
      if (course.prerequisites && course.prerequisites.length > 0) {
        const completedCourses = await pool.query(
          `SELECT course_id FROM course_enrollments 
           WHERE student_id = $1 AND status = 'completed'`,
          [playerId]
        );

        const completedIds = completedCourses.rows.map(row => row.course_id);
        const hasPrerequisites = course.prerequisites.every((prereq: string) => completedIds.includes(prereq));

        if (!hasPrerequisites) {
          return res.status(400).json({ 
            success: false, 
            error: 'Prerequisites not met',
            prerequisites: course.prerequisites
          });
        }
      }

      // Create enrollment
      const enrollmentResult = await pool.query(
        `INSERT INTO course_enrollments (
          course_id, student_id, status, enrolled_at, progress, last_accessed
        ) VALUES ($1, $2, $3, NOW(), 0, NOW()) 
        RETURNING *`,
        [id, playerId, 'enrolled']
      );

      // Update course enrollment count
      await pool.query(
        'UPDATE courses SET enrollment_count = enrollment_count + 1 WHERE id = $1',
        [id]
      );

      res.json({ success: true, data: enrollmentResult.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get course progress
  router.get('/courses/:id/progress/:playerId', async (req: Request, res: Response) => {
    try {
      const { id, playerId } = req.params;
      
      const result = await pool.query(
        `SELECT 
          ce.*,
          c.title as course_title,
          c.duration as course_duration,
          c.difficulty as course_difficulty
        FROM course_enrollments ce
        JOIN courses c ON ce.course_id = c.id
        WHERE ce.course_id = $1 AND ce.student_id = $2`,
        [id, playerId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Enrollment not found' });
      }

      // Get completed lessons
      const lessonsResult = await pool.query(
        'SELECT * FROM lesson_completions WHERE enrollment_id = $1 ORDER BY completed_at ASC',
        [result.rows[0].id]
      );

      res.json({ 
        success: true, 
        data: {
          enrollment: result.rows[0],
          completedLessons: lessonsResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Complete course lesson
  router.post('/courses/:id/lessons/:lessonId/complete', async (req: Request, res: Response) => {
    try {
      const { id, lessonId } = req.params;
      const { playerId, score, timeSpent } = req.body;

      // Get enrollment
      const enrollmentResult = await pool.query(
        'SELECT * FROM course_enrollments WHERE course_id = $1 AND student_id = $2',
        [id, playerId]
      );

      if (enrollmentResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Enrollment not found' });
      }

      // Check if lesson already completed
      const existingCompletion = await pool.query(
        'SELECT * FROM lesson_completions WHERE enrollment_id = $1 AND lesson_id = $2',
        [enrollmentResult.rows[0].id, lessonId]
      );

      if (existingCompletion.rows.length > 0) {
        return res.status(400).json({ success: false, error: 'Lesson already completed' });
      }

      // Record lesson completion
      const completionResult = await pool.query(
        `INSERT INTO lesson_completions (
          enrollment_id, lesson_id, score, time_spent, completed_at
        ) VALUES ($1, $2, $3, $4, NOW()) 
        RETURNING *`,
        [enrollmentResult.rows[0].id, lessonId, score, timeSpent]
      );

      // Update enrollment progress
      await pool.query(
        `UPDATE course_enrollments SET 
          progress = progress + 1,
          last_accessed = NOW()
        WHERE id = $1`,
        [enrollmentResult.rows[0].id]
      );

      // Check if course is completed
      const courseResult = await pool.query(
        'SELECT * FROM courses WHERE id = $1',
        [id]
      );

      const totalLessons = 10; // This would come from course data
      const newProgress = enrollmentResult.rows[0].progress + 1;

      if (newProgress >= totalLessons) {
        await pool.query(
          `UPDATE course_enrollments SET 
            status = 'completed',
            completed_at = NOW()
          WHERE id = $1`,
          [enrollmentResult.rows[0].id]
        );

        // Award course completion rewards
        await awardCourseRewards(playerId, courseResult.rows[0], pool);
      }

      res.json({ success: true, data: completionResult.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== DEGREES ====================
  
  // Get available degrees
  router.get('/degrees', async (req: Request, res: Response) => {
    try {
      const { facultyId, prestigeLevel } = req.query;
      
      let query = `
        SELECT d.*, f.name as faculty_name
        FROM degrees d
        JOIN faculties f ON d.faculty_id = f.id
        WHERE d.is_active = true
      `;
      const params: any[] = [];

      if (facultyId) {
        query += ' AND d.faculty_id = $' + (params.length + 1);
        params.push(facultyId);
      }

      if (prestigeLevel) {
        query += ' AND d.prestige_level = $' + (params.length + 1);
        params.push(prestigeLevel);
      }

      query += ' ORDER BY d.prestige_level, d.total_credits';

      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Enroll in degree program
  router.post('/degrees/:id/enroll', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { playerId } = req.body;

      // Verify degree exists and is active
      const degreeResult = await pool.query(
        'SELECT * FROM degrees WHERE id = $1 AND is_active = true',
        [id]
      );

      if (degreeResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Degree not found or not available' });
      }

      const degree = degreeResult.rows[0];

      // Check if already enrolled
      const existingEnrollment = await pool.query(
        'SELECT * FROM degree_enrollments WHERE degree_id = $1 AND student_id = $2',
        [id, playerId]
      );

      if (existingEnrollment.rows.length > 0) {
        return res.status(400).json({ success: false, error: 'Already enrolled in this degree' });
      }

      // Check prerequisites
      if (degree.required_courses && degree.required_courses.length > 0) {
        const completedCourses = await pool.query(
          `SELECT course_id FROM course_enrollments 
           WHERE student_id = $1 AND status = 'completed'`,
          [playerId]
        );

        const completedIds = completedCourses.rows.map(row => row.course_id);
        const hasPrerequisites = degree.required_courses.every((prereq: string) => completedIds.includes(prereq));

        if (!hasPrerequisites) {
          return res.status(400).json({ 
            success: false, 
            error: 'Required courses not completed',
            requiredCourses: degree.required_courses
          });
        }
      }

      // Create degree enrollment
      const enrollmentResult = await pool.query(
        `INSERT INTO degree_enrollments (
          degree_id, student_id, status, enrolled_at, progress, credits_earned
        ) VALUES ($1, $2, $3, NOW(), 0, 0) 
        RETURNING *`,
        [id, playerId, 'enrolled']
      );

      // Update degree graduate count
      await pool.query(
        'UPDATE degrees SET total_graduates = total_graduates + 1 WHERE id = $1',
        [id]
      );

      res.json({ success: true, data: enrollmentResult.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== MENTORSHIP PROGRAMS ====================
  
  // Get mentorship programs
  router.get('/mentorship', async (req: Request, res: Response) => {
    try {
      const { facultyId, isActive } = req.query;
      
      let query = `
        SELECT mp.*, f.name as faculty_name
        FROM mentorship_programs mp
        JOIN faculties f ON mp.faculty_id = f.id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (facultyId) {
        query += ' AND mp.faculty_id = $' + (params.length + 1);
        params.push(facultyId);
      }

      if (isActive !== undefined) {
        query += ' AND mp.is_active = $' + (params.length + 1);
        params.push(isActive === 'true');
      }

      query += ' ORDER BY mp.success_rate DESC, mp.name ASC';

      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Apply to become mentor
  router.post('/mentorship/:id/apply', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { playerId, qualifications, experience, availability } = req.body;

      // Verify program exists and is active
      const programResult = await pool.query(
        'SELECT * FROM mentorship_programs WHERE id = $1 AND is_active = true',
        [id]
      );

      if (programResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Mentorship program not found' });
      }

      // Check if already applied
      const existingApplication = await pool.query(
        'SELECT * FROM mentor_applications WHERE program_id = $1 AND applicant_id = $2',
        [id, playerId]
      );

      if (existingApplication.rows.length > 0) {
        return res.status(400).json({ success: false, error: 'Already applied to this program' });
      }

      // Create application
      const applicationResult = await pool.query(
        `INSERT INTO mentor_applications (
          program_id, applicant_id, qualifications, experience, 
          availability, status, applied_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
        RETURNING *`,
        [id, playerId, JSON.stringify(qualifications), JSON.stringify(experience), 
         JSON.stringify(availability), 'pending']
      );

      res.json({ success: true, data: applicationResult.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== RESEARCH PROJECTS ====================
  
  // Get research projects
  router.get('/research', async (req: Request, res: Response) => {
    try {
      const { facultyId, status, limit = 50 } = req.query;
      
      let query = `
        SELECT rp.*, f.name as faculty_name, p.username as lead_researcher_name
        FROM research_projects rp
        JOIN faculties f ON rp.faculty_id = f.id
        JOIN players p ON rp.lead_researcher_id = p.id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (facultyId) {
        query += ' AND rp.faculty_id = $' + (params.length + 1);
        params.push(facultyId);
      }

      if (status) {
        query += ' AND rp.status = $' + (params.length + 1);
        params.push(status);
      }

      query += ' ORDER BY rp.created_at DESC LIMIT $' + (params.length + 1);
      params.push(limit);

      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Apply for research project
  router.post('/research/:id/apply', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { playerId, skills, motivation, availability } = req.body;

      // Verify project exists
      const projectResult = await pool.query(
        'SELECT * FROM research_projects WHERE id = $1',
        [id]
      );

      if (projectResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Research project not found' });
      }

      // Check if already applied
      const existingApplication = await pool.query(
        'SELECT * FROM research_applications WHERE project_id = $1 AND applicant_id = $2',
        [id, playerId]
      );

      if (existingApplication.rows.length > 0) {
        return res.status(400).json({ success: false, error: 'Already applied to this project' });
      }

      // Create application
      const applicationResult = await pool.query(
        `INSERT INTO research_applications (
          project_id, applicant_id, skills, motivation, 
          availability, status, applied_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
        RETURNING *`,
        [id, playerId, JSON.stringify(skills), motivation, 
         JSON.stringify(availability), 'pending']
      );

      res.json({ success: true, data: applicationResult.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== STUDENT PROGRESS ====================
  
  // Get student's university profile
  router.get('/students/:playerId/profile', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      
      // Get course enrollments
      const coursesResult = await pool.query(
        `SELECT 
          ce.*,
          c.title as course_title,
          c.difficulty,
          f.name as faculty_name
        FROM course_enrollments ce
        JOIN courses c ON ce.course_id = c.id
        JOIN faculties f ON c.faculty_id = f.id
        WHERE ce.student_id = $1
        ORDER BY ce.enrolled_at DESC`,
        [playerId]
      );

      // Get degree enrollments
      const degreesResult = await pool.query(
        `SELECT 
          de.*,
          d.name as degree_name,
          d.prestige_level,
          f.name as faculty_name
        FROM degree_enrollments de
        JOIN degrees d ON de.degree_id = d.id
        JOIN faculties f ON d.faculty_id = f.id
        WHERE de.student_id = $1
        ORDER BY de.enrolled_at DESC`,
        [playerId]
      );

      // Get mentorship applications
      const mentorshipResult = await pool.query(
        `SELECT 
          ma.*,
          mp.name as program_name,
          f.name as faculty_name
        FROM mentor_applications ma
        JOIN mentorship_programs mp ON ma.program_id = mp.id
        JOIN faculties f ON mp.faculty_id = f.id
        WHERE ma.applicant_id = $1
        ORDER BY ma.applied_at DESC`,
        [playerId]
      );

      // Get research applications
      const researchResult = await pool.query(
        `SELECT 
          ra.*,
          rp.title as project_title,
          f.name as faculty_name
        FROM research_applications ra
        JOIN research_projects rp ON ra.project_id = rp.id
        JOIN faculties f ON rp.faculty_id = f.id
        WHERE ra.applicant_id = $1
        ORDER BY ra.applied_at DESC`,
        [playerId]
      );

      // Get earned skills and certifications
      const skillsResult = await pool.query(
        `SELECT 
          s.*,
          c.name as certification_name,
          c.issuing_institution
        FROM skills s
        LEFT JOIN certifications c ON s.id = c.skill_id AND c.holder_id = s.player_id
        WHERE s.player_id = $1
        ORDER BY s.acquired_at DESC`,
        [playerId]
      );

      res.json({ 
        success: true, 
        data: {
          courses: coursesResult.rows,
          degrees: degreesResult.rows,
          mentorshipApplications: mentorshipResult.rows,
          researchApplications: researchResult.rows,
          skills: skillsResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== ANALYTICS ====================
  
  // Get university analytics
  router.get('/analytics', async (req: Request, res: Response) => {
    try {
      const { period = '30d' } = req.query;
      
      // Get enrollment trends
      const enrollmentTrends = await pool.query(
        `SELECT 
          DATE_TRUNC('day', enrolled_at) as date,
          COUNT(*) as course_enrollments,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completions
        FROM course_enrollments 
        WHERE enrolled_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE_TRUNC('day', enrolled_at)
        ORDER BY date DESC`,
        []
      );

      // Get faculty performance
      const facultyPerformance = await pool.query(
        `SELECT 
          f.name,
          f.type,
          COUNT(DISTINCT c.id) as courses,
          COUNT(DISTINCT ce.student_id) as students,
          AVG(CASE WHEN ce.status = 'completed' THEN ce.progress ELSE NULL END) as avg_completion
        FROM faculties f
        LEFT JOIN courses c ON f.id = c.faculty_id
        LEFT JOIN course_enrollments ce ON c.id = ce.course_id
        WHERE f.university_id = $1
        GROUP BY f.id, f.name, f.type`,
        ['main']
      );

      // Get degree statistics
      const degreeStats = await pool.query(
        `SELECT 
          d.prestige_level,
          COUNT(*) as total_enrollments,
          COUNT(CASE WHEN de.status = 'completed' THEN 1 END) as completions,
          AVG(de.credits_earned) as avg_credits
        FROM degrees d
        LEFT JOIN degree_enrollments de ON d.id = de.degree_id
        WHERE d.is_active = true
        GROUP BY d.prestige_level
        ORDER BY d.prestige_level`,
        []
      );

      res.json({ 
        success: true, 
        data: {
          enrollmentTrends: enrollmentTrends.rows,
          facultyPerformance: facultyPerformance.rows,
          degreeStats: degreeStats.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  return router;
}

// Helper functions
async function awardCourseRewards(playerId: string, course: any, pool: Pool): Promise<void> {
  try {
    // Award influence
    await pool.query(
      `UPDATE players SET 
        influence = influence + $1,
        experience = experience + $2
      WHERE id = $3`,
      [course.completion_reward?.influence || 10, course.completion_reward?.experience || 5, playerId]
    );

    // Award skills if specified
    if (course.skills && course.skills.length > 0) {
      for (const skill of course.skills) {
        await pool.query(
          `INSERT INTO skills (player_id, name, category, level, experience, acquired_at)
           VALUES ($1, $2, $3, $4, $5, NOW())
           ON CONFLICT (player_id, name) DO UPDATE SET
           experience = skills.experience + EXCLUDED.experience,
           last_used = NOW()`,
          [playerId, skill.name, skill.category, 1, 50]
        );
      }
    }

    // Log the reward
    await pool.query(
      `INSERT INTO reward_history (
        player_id, type, source, amount, description, awarded_at
      ) VALUES ($1, $2, $3, $4, $5, NOW())`,
      [playerId, 'course_completion', 'university', course.completion_reward?.influence || 10, 
       `Completed course: ${course.title}`]
    );
  } catch (error) {
    console.error('Error awarding course rewards:', error);
  }
}
