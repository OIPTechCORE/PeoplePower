import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { 
  TasksBoardEcosystem, 
  TaskCategoryType,
  TaskPriority,
  TaskComplexity,
  TaskStatus,
  CollaboratorRole,
  StreakType
} from '../../../shared/types/ecosystems-final';

export function createTasksBoardRoutes(pool: Pool): Router {
  const router = Router();

  // ==================== TASKSBOARD ECOSYSTEM ====================
  
  // Get or create tasksboard ecosystem for a player
  router.get('/ecosystem/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      
      let result = await pool.query(
        'SELECT * FROM tasksboard_ecosystems WHERE player_id = $1',
        [playerId]
      );

      if (result.rows.length === 0) {
        // Create new tasksboard ecosystem
        result = await pool.query(
          `INSERT INTO tasksboard_ecosystems (
            player_id, total_tasks_completed, completion_rate, 
            average_completion_time, productivity_score, joined_at, last_task_completed_at
          ) VALUES ($1, 0, 0, 0, 0, NOW(), NULL) 
          RETURNING *`,
          [playerId]
        );
      }

      // Get active tasks
      const activeTasksResult = await pool.query(
        'SELECT * FROM tasks WHERE assigned_to = $1 AND status IN ($2, $3) ORDER BY priority DESC, created_at ASC',
        [playerId, TaskStatus.TODO, TaskStatus.IN_PROGRESS]
      );

      // Get completed tasks
      const completedTasksResult = await pool.query(
        'SELECT * FROM tasks WHERE assigned_to = $1 AND status = $2 ORDER BY completed_at DESC LIMIT 50',
        [playerId, TaskStatus.COMPLETED]
      );

      // Get task categories
      const categoriesResult = await pool.query(
        'SELECT * FROM task_categories WHERE player_id = $1 ORDER BY task_count DESC',
        [playerId]
      );

      // Get automated tasks
      const automatedTasksResult = await pool.query(
        'SELECT * FROM automated_tasks WHERE player_id = $1 AND is_active = true',
        [playerId]
      );

      // Get task streaks
      const streaksResult = await pool.query(
        'SELECT * FROM task_streaks WHERE player_id = $1',
        [playerId]
      );

      res.json({ 
        success: true, 
        data: {
          ecosystem: result.rows[0],
          activeTasks: activeTasksResult.rows,
          completedTasks: completedTasksResult.rows,
          categories: categoriesResult.rows,
          automatedTasks: automatedTasksResult.rows,
          streaks: streaksResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== TASKS ====================
  
  // Create new task
  router.post('/tasks', async (req: Request, res: Response) => {
    try {
      const { 
        title, description, category, priority, complexity, 
        estimatedDuration, assignedTo, assignedBy, tags, 
        dependencies, dueDate, subtasks
      } = req.body;

      const result = await pool.query(
        `INSERT INTO tasks (
          title, description, category, priority, complexity,
          estimated_duration, assigned_to, assigned_by, tags,
          dependencies, due_date, status, progress, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 0, NOW()) 
        RETURNING *`,
        [
          title, description, category, priority, complexity,
          estimatedDuration, assignedTo, assignedBy, JSON.stringify(tags),
          JSON.stringify(dependencies), dueDate, TaskStatus.TODO
        ]
      );

      // Add subtasks if provided
      if (subtasks && subtasks.length > 0) {
        const taskId = result.rows[0].id;
        for (const subtask of subtasks) {
          await pool.query(
            'INSERT INTO subtasks (task_id, text, is_completed, order_index) VALUES ($1, $2, $3, $4)',
            [taskId, subtask.text, false, subtask.order || 0]
          );
        }
      }

      // Update category count
      await updateCategoryCount(assignedTo, category, pool);

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get tasks with filters
  router.get('/tasks', async (req: Request, res: Response) => {
    try {
      const { 
        playerId, status, category, priority, complexity, 
        limit = 50, offset = 0, search 
      } = req.query;
      
      let query = 'SELECT * FROM tasks WHERE assigned_to = $1';
      const params: any[] = [playerId];

      if (status) {
        query += ' AND status = $' + (params.length + 1);
        params.push(status);
      }

      if (category) {
        query += ' AND category = $' + (params.length + 1);
        params.push(category);
      }

      if (priority) {
        query += ' AND priority = $' + (params.length + 1);
        params.push(priority);
      }

      if (complexity) {
        query += ' AND complexity = $' + (params.length + 1);
        params.push(complexity);
      }

      if (search) {
        query += ' AND (title ILIKE $' + (params.length + 1) + ' OR description ILIKE $' + (params.length + 1) + ')';
        params.push(`%${search}%`);
      }

      query += ' ORDER BY priority DESC, created_at ASC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
      params.push(limit, offset);

      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get task details
  router.get('/tasks/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const result = await pool.query(
        'SELECT * FROM tasks WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Task not found' });
      }

      // Get subtasks
      const subtasksResult = await pool.query(
        'SELECT * FROM subtasks WHERE task_id = $1 ORDER BY order_index ASC',
        [id]
      );

      // Get collaborators
      const collaboratorsResult = await pool.query(
        `SELECT tc.*, p.username as player_name 
         FROM task_collaborators tc
         JOIN players p ON tc.player_id = p.id
         WHERE tc.task_id = $1`,
        [id]
      );

      // Get comments
      const commentsResult = await pool.query(
        `SELECT tc.*, p.username as player_name 
         FROM task_comments tc
         JOIN players p ON tc.player_id = p.id
         WHERE tc.task_id = $1
         ORDER BY tc.created_at ASC`,
        [id]
      );

      // Get attachments
      const attachmentsResult = await pool.query(
        'SELECT * FROM task_attachments WHERE task_id = $1 ORDER BY uploaded_at DESC',
        [id]
      );

      res.json({ 
        success: true, 
        data: {
          task: result.rows[0],
          subtasks: subtasksResult.rows,
          collaborators: collaboratorsResult.rows,
          comments: commentsResult.rows,
          attachments: attachmentsResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Update task
  router.patch('/tasks/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { playerId } = req.body;
      
      // Verify ownership or collaboration
      const taskResult = await pool.query(
        'SELECT * FROM tasks WHERE id = $1 AND (assigned_to = $2 OR assigned_by = $2)',
        [id, playerId]
      );

      if (taskResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Task not found or unauthorized' });
      }

      const updateFields = [];
      const updateValues = [];
      let paramIndex = 1;

      // Dynamic field updates
      const allowedFields = ['title', 'description', 'category', 'priority', 'complexity', 'status', 'progress', 'due_date'];
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updateFields.push(`${field} = $${paramIndex++}`);
          updateValues.push(req.body[field]);
        }
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ success: false, error: 'No valid fields to update' });
      }

      updateFields.push(`updated_at = NOW()`);
      updateValues.push(id);

      const updateQuery = `
        UPDATE tasks 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await pool.query(updateQuery, updateValues);

      // If task was completed, update ecosystem
      if (req.body.status === TaskStatus.COMPLETED) {
        await updateTaskEcosystem(playerId, pool);
        await updateTaskStreaks(playerId, pool);
      }

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Delete task
  router.delete('/tasks/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { playerId } = req.body;
      
      const result = await pool.query(
        'DELETE FROM tasks WHERE id = $1 AND (assigned_to = $2 OR assigned_by = $2) RETURNING *',
        [id, playerId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Task not found or unauthorized' });
      }

      res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== COLLABORATION ====================
  
  // Add collaborator
  router.post('/tasks/:id/collaborators', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { playerId, collaboratorId, role } = req.body;

      // Verify task ownership
      const taskResult = await pool.query(
        'SELECT * FROM tasks WHERE id = $1 AND assigned_by = $2',
        [id, playerId]
      );

      if (taskResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Task not found or unauthorized' });
      }

      const result = await pool.query(
        `INSERT INTO task_collaborators (
          task_id, player_id, role, joined_at, last_active_at
        ) VALUES ($1, $2, $3, NOW(), NOW()) 
        RETURNING *`,
        [id, collaboratorId, role]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Add comment
  router.post('/tasks/:id/comments', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { playerId, comment } = req.body;

      const result = await pool.query(
        'INSERT INTO task_comments (task_id, player_id, comment, created_at, is_edited) VALUES ($1, $2, $3, NOW(), false) RETURNING *',
        [id, playerId, comment]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== AUTOMATION ====================
  
  // Create automated task
  router.post('/automated-tasks', async (req: Request, res: Response) => {
    try {
      const { 
        playerId, templateId, schedule, isActive 
      } = req.body;

      // Get template details
      const templateResult = await pool.query(
        'SELECT * FROM task_templates WHERE id = $1',
        [templateId]
      );

      if (templateResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Template not found' });
      }

      const template = templateResult.rows[0];

      // Calculate next run time
      const nextRun = calculateNextRun(schedule);

      const result = await pool.query(
        `INSERT INTO automated_tasks (
          player_id, template_id, schedule, next_run, is_active, created_at
        ) VALUES ($1, $2, $3, $4, $5, NOW()) 
        RETURNING *`,
        [playerId, templateId, JSON.stringify(schedule), nextRun, isActive]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get task templates
  router.get('/templates', async (req: Request, res: Response) => {
    try {
      const { category, isPublic } = req.query;
      
      let query = 'SELECT * FROM task_templates WHERE 1=1';
      const params: any[] = [];

      if (category) {
        query += ' AND category = $' + (params.length + 1);
        params.push(category);
      }

      if (isPublic !== undefined) {
        query += ' AND is_public = $' + (params.length + 1);
        params.push(isPublic === 'true');
      }

      query += ' ORDER BY usage_count DESC, name ASC';

      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Create task template
  router.post('/templates', async (req: Request, res: Response) => {
    try {
      const { 
        playerId, name, description, category, defaultPriority,
        defaultComplexity, estimatedDuration, checklist, tags, isPublic
      } = req.body;

      const result = await pool.query(
        `INSERT INTO task_templates (
          name, description, category, default_priority, default_complexity,
          estimated_duration, checklist, tags, usage_count, is_public, created_by, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, $9, $10, NOW()) 
        RETURNING *`,
        [
          name, description, category, defaultPriority, defaultComplexity,
          estimatedDuration, JSON.stringify(checklist), JSON.stringify(tags),
          isPublic || false, playerId
        ]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== TEAM PROJECTS ====================
  
  // Create team project
  router.post('/projects', async (req: Request, res: Response) => {
    try {
      const { 
        name, description, members, status, startDate, endDate, budget
      } = req.body;

      const result = await pool.query(
        `INSERT INTO team_projects (
          name, description, status, start_date, end_date, budget, progress, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, 0, NOW()) 
        RETURNING *`,
        [name, description, status, startDate, endDate, JSON.stringify(budget)]
      );

      const projectId = result.rows[0].id;

      // Add members
      for (const member of members) {
        await pool.query(
          `INSERT INTO team_members (
            project_id, player_id, role, joined_at, contribution
          ) VALUES ($1, $2, $3, NOW(), 0)`,
          [projectId, member.playerId, member.role]
        );
      }

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get team projects
  router.get('/projects/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      const { status } = req.query;
      
      let query = `
        SELECT tp.*, tm.role as player_role
        FROM team_projects tp
        JOIN team_members tm ON tp.id = tm.project_id
        WHERE tm.player_id = $1
      `;
      const params: any[] = [playerId];

      if (status) {
        query += ' AND tp.status = $' + (params.length + 1);
        params.push(status);
      }

      query += ' ORDER BY tp.created_at DESC';

      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== ANALYTICS ====================
  
  // Get tasksboard analytics
  router.get('/analytics/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      const { period = '30d' } = req.query;
      
      // Get ecosystem stats
      const ecosystemResult = await pool.query(
        'SELECT * FROM tasksboard_ecosystems WHERE player_id = $1',
        [playerId]
      );

      // Get task statistics
      const taskStats = await pool.query(
        `SELECT 
          status,
          COUNT(*) as count,
          AVG(estimated_duration) as avg_estimated,
          AVG(actual_duration) as avg_actual
        FROM tasks 
        WHERE assigned_to = $1
        GROUP BY status`,
        [playerId]
      );

      // Get category breakdown
      const categoryBreakdown = await pool.query(
        `SELECT 
          category,
          COUNT(*) as task_count,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count,
          AVG(CASE WHEN actual_duration IS NOT NULL THEN actual_duration ELSE NULL END) as avg_completion_time
        FROM tasks 
        WHERE assigned_to = $1
        GROUP BY category
        ORDER BY task_count DESC`,
        [playerId]
      );

      // Get productivity trends
      const productivityTrends = await pool.query(
        `SELECT 
          DATE_TRUNC('day', completed_at) as date,
          COUNT(*) as tasks_completed,
          AVG(actual_duration) as avg_time
        FROM tasks 
        WHERE assigned_to = $1 AND status = 'completed' 
          AND completed_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE_TRUNC('day', completed_at)
        ORDER BY date DESC`,
        [playerId]
      );

      // Get streak information
      const streakInfo = await pool.query(
        `SELECT 
          type,
          current_streak,
          best_streak,
          last_activity
        FROM task_streaks 
        WHERE player_id = $1`,
        [playerId]
      );

      res.json({ 
        success: true, 
        data: {
          ecosystem: ecosystemResult.rows[0],
          taskStats: taskStats.rows,
          categoryBreakdown: categoryBreakdown.rows,
          productivityTrends: productivityTrends.rows,
          streakInfo: streakInfo.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  return router;
}

// Helper functions
async function updateCategoryCount(playerId: string, category: TaskCategoryType, pool: Pool): Promise<void> {
  await pool.query(
    `INSERT INTO task_categories (player_id, name, task_count, completion_rate)
     VALUES ($1, $2, 1, 0)
     ON CONFLICT (player_id, name) DO UPDATE SET
       task_count = task_categories.task_count + 1`,
    [playerId, category]
  );
}

async function updateTaskEcosystem(playerId: string, pool: Pool): Promise<void> {
  // Get completed tasks count
  const completedResult = await pool.query(
    'SELECT COUNT(*) as count, AVG(actual_duration) as avg_duration FROM tasks WHERE assigned_to = $1 AND status = $2',
    [playerId, TaskStatus.COMPLETED]
  );

  // Get total tasks count
  const totalResult = await pool.query(
    'SELECT COUNT(*) as count FROM tasks WHERE assigned_to = $1',
    [playerId]
  );

  const completedCount = parseInt(completedResult.rows[0].count);
  const totalCount = parseInt(totalResult.rows[0].count);
  const avgDuration = parseFloat(completedResult.rows[0].avg_duration) || 0;
  const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Calculate productivity score
  const productivityScore = calculateProductivityScore(completionRate, avgDuration);

  await pool.query(
    `UPDATE tasksboard_ecosystems SET 
      total_tasks_completed = $1,
      completion_rate = $2,
      average_completion_time = $3,
      productivity_score = $4,
      last_task_completed_at = NOW(),
      updated_at = NOW()
    WHERE player_id = $5`,
    [completedCount, completionRate, avgDuration, productivityScore, playerId]
  );
}

async function updateTaskStreaks(playerId: string, pool: Pool): Promise<void> {
  const today = new Date().toDateString();
  
  // Update daily streak
  await pool.query(
    `INSERT INTO task_streaks (player_id, type, current_streak, best_streak, last_activity, start_date)
     VALUES ($1, $2, 1, 1, NOW(), NOW())
     ON CONFLICT (player_id, type) DO UPDATE SET
       current_streak = CASE 
         WHEN DATE(streaks.last_activity) = CURRENT_DATE - INTERVAL '1 day' 
         THEN streaks.current_streak + 1
         WHEN DATE(streaks.last_activity) = CURRENT_DATE 
         THEN streaks.current_streak
         ELSE 1
       END,
       best_streak = GREATEST(streaks.best_streak, 
         CASE 
           WHEN DATE(streaks.last_activity) = CURRENT_DATE - INTERVAL '1 day' 
           THEN streaks.current_streak + 1
           WHEN DATE(streaks.last_activity) = CURRENT_DATE 
           THEN streaks.current_streak
           ELSE 1
         END
       ),
       last_activity = NOW()`,
    [playerId, StreakType.DAILY]
  );
}

function calculateNextRun(schedule: any): Date {
  const now = new Date();
  const nextRun = new Date(now);

  switch (schedule.type) {
    case 'daily':
      nextRun.setDate(nextRun.getDate() + schedule.frequency);
      break;
    case 'weekly':
      nextRun.setDate(nextRun.getDate() + (schedule.frequency * 7));
      break;
    case 'monthly':
      nextRun.setMonth(nextRun.getMonth() + schedule.frequency);
      break;
    case 'yearly':
      nextRun.setFullYear(nextRun.getFullYear() + schedule.frequency);
      break;
  }

  return nextRun;
}

function calculateProductivityScore(completionRate: number, avgDuration: number): number {
  // Base score from completion rate (0-50 points)
  const completionScore = (completionRate / 100) * 50;
  
  // Bonus for speed (0-50 points)
  // Assuming ideal average duration is 60 minutes
  const speedScore = Math.max(0, Math.min(50, (60 - Math.min(avgDuration, 60)) / 60 * 50));
  
  return Math.round(completionScore + speedScore);
}
