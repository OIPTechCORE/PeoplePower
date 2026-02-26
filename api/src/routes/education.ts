import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import EducationService, { 
  Course, 
  UserProgress, 
  AIGenerationRequest, 
  CreatorProfile,
  Faculty,
  CourseLevel,
  CreatorType,
  CourseStatus 
} from '../services/educationService';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

export function createEducationRoutes(pool: Pool): Router {
  const router = Router();
  const educationService = new EducationService(pool);

  // Course Discovery Routes
  router.get('/courses', async (req: Request, res: Response) => {
    try {
      const {
        query = '',
        faculty,
        level,
        language,
        region,
        duration_min,
        duration_max,
        tags,
        page = 1,
        limit = 20
      } = req.query;

      const filters: any = {};
      if (faculty) filters.faculty = faculty;
      if (level) filters.level = level;
      if (language) filters.language = language;
      if (region) filters.region = region;
      if (duration_min || duration_max) {
        filters.duration = {};
        if (duration_min) filters.duration.min = parseInt(duration_min as string);
        if (duration_max) filters.duration.max = parseInt(duration_max as string);
      }
      if (tags) {
        filters.tags = Array.isArray(tags) ? tags : [tags];
      }

      const courses = await educationService.searchCourses(
        query as string, 
        filters
      );

      // Pagination
      const startIndex = (parseInt(page as string) - 1) * parseInt(limit as string);
      const endIndex = startIndex + parseInt(limit as string);
      const paginatedCourses = courses.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: {
          courses: paginatedCourses,
          pagination: {
            page: parseInt(page as string),
            limit: parseInt(limit as string),
            total: courses.length,
            pages: Math.ceil(courses.length / parseInt(limit as string))
          }
        }
      });
    } catch (error) {
      console.error('Error searching courses:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search courses'
      });
    }
  });

  router.get('/courses/recommended', authenticateToken, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { limit = 10 } = req.query;
      
      const courses = await educationService.getRecommendedCourses(
        userId, 
        parseInt(limit as string)
      );

      res.json({
        success: true,
        data: courses
      });
    } catch (error) {
      console.error('Error getting recommended courses:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get recommended courses'
      });
    }
  });

  router.get('/courses/:courseId', async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;
      const course = await educationService.getCourse(courseId);

      if (!course) {
        return res.status(404).json({
          success: false,
          error: 'Course not found'
        });
      }

      res.json({
        success: true,
        data: course
      });
    } catch (error) {
      console.error('Error getting course:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get course'
      });
    }
  });

  // Course Enrollment and Progress
  router.post('/courses/:courseId/enroll', authenticateToken, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { courseId } = req.params;

      const progress = await educationService.enrollUser(userId, courseId);

      res.json({
        success: true,
        data: progress
      });
    } catch (error) {
      console.error('Error enrolling in course:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to enroll in course'
      });
    }
  });

  router.put('/courses/:courseId/progress', authenticateToken, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { courseId } = req.params;
      const { contentId, timeSpent } = req.body;

      if (!contentId || !timeSpent) {
        return res.status(400).json({
          success: false,
          error: 'contentId and timeSpent are required'
        });
      }

      const progress = await educationService.updateProgress(
        userId, 
        courseId, 
        contentId, 
        timeSpent
      );

      res.json({
        success: true,
        data: progress
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update progress'
      });
    }
  });

  router.get('/courses/:courseId/progress', authenticateToken, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { courseId } = req.params;

      const progress = await educationService.getUserProgress(userId, courseId);

      if (!progress) {
        return res.status(404).json({
          success: false,
          error: 'Progress not found - user not enrolled'
        });
      }

      res.json({
        success: true,
        data: progress
      });
    } catch (error) {
      console.error('Error getting progress:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get progress'
      });
    }
  });

  // Course Creation Routes
  router.post('/courses', authenticateToken, validateRequest, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const courseData = req.body;

      // Validate required fields
      const requiredFields = ['title', 'description', 'faculty', 'level', 'duration'];
      for (const field of requiredFields) {
        if (!courseData[field]) {
          return res.status(400).json({
            success: false,
            error: `${field} is required`
          });
        }
      }

      const course = await educationService.createCourse(courseData, userId);

      res.status(201).json({
        success: true,
        data: course
      });
    } catch (error) {
      console.error('Error creating course:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create course'
      });
    }
  });

  // AI Course Generation Routes
  router.post('/courses/generate', authenticateToken, validateRequest, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const generationRequest: AIGenerationRequest = {
        id: require('uuid').v4(),
        topic: req.body.topic,
        faculty: req.body.faculty,
        level: req.body.level,
        duration: req.body.duration,
        language: req.body.language || 'en',
        region: req.body.region || 'global',
        culturalContext: req.body.culturalContext || 'general',
        targetAudience: req.body.targetAudience,
        learningObjectives: req.body.learningObjectives || [],
        specialRequirements: req.body.specialRequirements,
        status: 'pending' as any,
        createdAt: new Date()
      };

      // Validate required fields
      const requiredFields = ['topic', 'faculty', 'level', 'duration'];
      for (const field of requiredFields) {
        if (!generationRequest[field as keyof AIGenerationRequest]) {
          return res.status(400).json({
            success: false,
            error: `${field} is required for AI generation`
          });
        }
      }

      // Start AI generation in background
      educationService.generateCourseWithAI(generationRequest)
        .then(course => {
          console.log(`AI course generated successfully: ${course.id}`);
        })
        .catch(error => {
          console.error(`AI course generation failed: ${error}`);
        });

      res.status(202).json({
        success: true,
        message: 'Course generation started',
        requestId: generationRequest.id
      });
    } catch (error) {
      console.error('Error starting course generation:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to start course generation'
      });
    }
  });

  router.post('/courses/generate/batch', authenticateToken, validateRequest, async (req: Request, res: Response) => {
    try {
      const { requests } = req.body;

      if (!Array.isArray(requests) || requests.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'requests must be a non-empty array'
        });
      }

      // Validate each request
      for (const request of requests) {
        const requiredFields = ['topic', 'faculty', 'level', 'duration'];
        for (const field of requiredFields) {
          if (!request[field]) {
            return res.status(400).json({
              success: false,
              error: `${field} is required for each generation request`
            });
          }
        }
      }

      const generationRequests: AIGenerationRequest[] = requests.map(req => ({
        id: require('uuid').v4(),
        topic: req.topic,
        faculty: req.faculty,
        level: req.level,
        duration: req.duration,
        language: req.language || 'en',
        region: req.region || 'global',
        culturalContext: req.culturalContext || 'general',
        targetAudience: req.targetAudience,
        learningObjectives: req.learningObjectives || [],
        specialRequirements: req.specialRequirements,
        status: 'pending' as any,
        createdAt: new Date()
      }));

      // Start batch generation in background
      educationService.batchGenerateCourses(generationRequests)
        .then(courses => {
          console.log(`Batch AI course generation completed: ${courses.length} courses`);
        })
        .catch(error => {
          console.error(`Batch AI course generation failed: ${error}`);
        });

      res.status(202).json({
        success: true,
        message: 'Batch course generation started',
        requestCount: generationRequests.length
      });
    } catch (error) {
      console.error('Error starting batch course generation:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to start batch course generation'
      });
    }
  });

  // Regional Adaptation Routes
  router.post('/courses/:courseId/adapt', authenticateToken, validateRequest, async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;
      const { targetRegion, targetLanguage } = req.body;

      if (!targetRegion || !targetLanguage) {
        return res.status(400).json({
          success: false,
          error: 'targetRegion and targetLanguage are required'
        });
      }

      const adaptedCourse = await educationService.batchAdaptCourses(
        [courseId], 
        targetRegion, 
        targetLanguage
      );

      res.status(201).json({
        success: true,
        data: adaptedCourse[0]
      });
    } catch (error) {
      console.error('Error adapting course:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to adapt course'
      });
    }
  });

  // Quality Control Routes
  router.post('/courses/:courseId/review', authenticateToken, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { courseId } = req.params;

      await educationService.submitForPeerReview(courseId, userId);

      res.json({
        success: true,
        message: 'Course submitted for peer review'
      });
    } catch (error) {
      console.error('Error submitting for review:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to submit for review'
      });
    }
  });

  router.put('/courses/:courseId/review', authenticateToken, validateRequest, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { courseId } = req.params;
      const { rating, feedback, recommendations } = req.body;

      if (!rating || !feedback) {
        return res.status(400).json({
          success: false,
          error: 'rating and feedback are required'
        });
      }

      await educationService.submitPeerReview(courseId, userId, {
        rating,
        feedback,
        recommendations: recommendations || []
      });

      res.json({
        success: true,
        message: 'Peer review submitted successfully'
      });
    } catch (error) {
      console.error('Error submitting peer review:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to submit peer review'
      });
    }
  });

  // Analytics Routes
  router.get('/courses/:courseId/analytics', authenticateToken, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { courseId } = req.params;

      // Check if user is course creator or admin
      const course = await educationService.getCourse(courseId);
      if (!course || course.creatorId !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Access denied - only course creators can view analytics'
        });
      }

      const analytics = await educationService.getCourseAnalytics(courseId);

      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      console.error('Error getting course analytics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get course analytics'
      });
    }
  });

  router.get('/analytics/faculties', authenticateToken, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      
      // Check if user is admin
      // This would typically check user roles/permissions
      const isAdmin = true; // Simplified for now

      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          error: 'Access denied - admin only'
        });
      }

      const analytics = await educationService.getFacultyAnalytics();

      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      console.error('Error getting faculty analytics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get faculty analytics'
      });
    }
  });

  // Faculty and Metadata Routes
  router.get('/faculties', async (req: Request, res: Response) => {
    try {
      const faculties = Object.values(Faculty);
      
      res.json({
        success: true,
        data: faculties.map(faculty => ({
          id: faculty,
          name: faculty.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: getFacultyDescription(faculty)
        }))
      });
    } catch (error) {
      console.error('Error getting faculties:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get faculties'
      });
    }
  });

  router.get('/levels', async (req: Request, res: Response) => {
    try {
      const levels = Object.values(CourseLevel);
      
      res.json({
        success: true,
        data: levels.map(level => ({
          id: level,
          name: level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: getLevelDescription(level)
        }))
      });
    } catch (error) {
      console.error('Error getting levels:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get levels'
      });
    }
  });

  router.get('/creator-types', async (req: Request, res: Response) => {
    try {
      const creatorTypes = Object.values(CreatorType);
      
      res.json({
        success: true,
        data: creatorTypes.map(type => ({
          id: type,
          name: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: getCreatorTypeDescription(type)
        }))
      });
    } catch (error) {
      console.error('Error getting creator types:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get creator types'
      });
    }
  });

  // Helper functions
  function getFacultyDescription(faculty: Faculty): string {
    const descriptions = {
      [Faculty.LEADERSHIP_GOVERNANCE]: 'Develop leadership skills and understanding of governance systems',
      [Faculty.DIGITAL_ENTREPRENEURSHIP]: 'Build digital businesses and entrepreneurial skills',
      [Faculty.TECHNOLOGY_AI_LITERACY]: 'Master technology and artificial intelligence concepts',
      [Faculty.CREATIVE_ARTS_MEDIA]: 'Express creativity through digital arts and media',
      [Faculty.CIVIC_COMMUNITY_DEVELOPMENT]: 'Drive community development and civic engagement'
    };
    return descriptions[faculty] || '';
  }

  function getLevelDescription(level: CourseLevel): string {
    const descriptions = {
      [CourseLevel.BEGINNER]: 'Introduction to fundamental concepts',
      [CourseLevel.INTERMEDIATE]: 'Build on foundational knowledge',
      [CourseLevel.ADVANCED]: 'Deep dive into complex topics',
      [CourseLevel.EXPERT]: 'Mastery-level content for professionals',
      [CourseLevel.PROFESSIONAL]: 'Industry-standard professional development'
    };
    return descriptions[level] || '';
  }

  function getCreatorTypeDescription(type: CreatorType): string {
    const descriptions = {
      [CreatorType.COMMUNITY_CREATOR]: 'Basic content creator with community privileges',
      [CreatorType.CERTIFIED_CONTRIBUTOR]: 'Certified contributor with advanced privileges',
      [CreatorType.EXPERT_CONTRIBUTOR]: 'Expert contributor with professional recognition',
      [CreatorType.INSTITUTIONAL_PARTNER]: 'Institutional partner with highest privileges'
    };
    return descriptions[type] || '';
  }

  return router;
}
