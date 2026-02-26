import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { 
  LeaderboardEcosystem, 
  LeaderboardCategory,
  LeaderboardTier,
  CompetitionHistory,
  LeaderboardBadge,
  LeaderboardTitle
} from '../../../shared/types/ecosystems-final';

export function createLeaderboardRoutes(pool: Pool): Router {
  const router = Router();

  // ==================== LEADERBOARD ECOSYSTEM ====================
  
  // Get or create leaderboard ecosystem for a player
  router.get('/ecosystem/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      
      let result = await pool.query(
        'SELECT * FROM leaderboard_ecosystems WHERE player_id = $1',
        [playerId]
      );

      if (result.rows.length === 0) {
        // Create new leaderboard ecosystem
        result = await pool.query(
          `INSERT INTO leaderboard_ecosystems (
            player_id, global_rank, regional_rank, community_rank,
            total_points, weekly_points, monthly_points, all_time_points,
            win_rate, best_streak, current_streak, joined_at, last_competed_at
          ) VALUES ($1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NOW(), NULL) 
          RETURNING *`,
          [playerId]
        );
      }

      // Get category ranks
      const categoryRanksResult = await pool.query(
        'SELECT * FROM category_ranks WHERE player_id = $1 ORDER BY points DESC',
        [playerId]
      );

      // Get achievements
      const achievementsResult = await pool.query(
        'SELECT * FROM leaderboard_achievements WHERE player_id = $1 ORDER BY earned_at DESC',
        [playerId]
      );

      // Get milestones
      const milestonesResult = await pool.query(
        'SELECT * FROM leaderboard_milestones WHERE player_id = $1 ORDER BY level ASC',
        [playerId]
      );

      // Get competition history
      const historyResult = await pool.query(
        'SELECT * FROM competition_history WHERE player_id = $1 ORDER BY competed_at DESC LIMIT 20',
        [playerId]
      );

      // Get badges
      const badgesResult = await pool.query(
        'SELECT * FROM leaderboard_badges WHERE player_id = $1 ORDER BY earned_at DESC',
        [playerId]
      );

      // Get current title
      const titleResult = await pool.query(
        'SELECT * FROM leaderboard_titles WHERE player_id = $1 AND is_active = true',
        [playerId]
      );

      res.json({ 
        success: true, 
        data: {
          ecosystem: result.rows[0],
          categoryRanks: categoryRanksResult.rows,
          achievements: achievementsResult.rows,
          milestones: milestonesResult.rows,
          competitionHistory: historyResult.rows,
          badges: badgesResult.rows,
          currentTitle: titleResult.rows[0] || null
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== GLOBAL LEADERBOARDS ====================
  
  // Get global leaderboard
  router.get('/global', async (req: Request, res: Response) => {
    try {
      const { category = LeaderboardCategory.OVERALL, limit = 100, offset = 0 } = req.query;
      
      const query = `
        SELECT 
          le.*,
          p.username,
          p.avatar,
          p.level as player_level,
          cr.tier,
          cr.points as category_points
        FROM leaderboard_ecosystems le
        JOIN players p ON le.player_id = p.id
        LEFT JOIN category_ranks cr ON le.player_id = cr.player_id AND cr.category = $1
        ORDER BY 
          CASE 
            WHEN $1 = 'overall' THEN le.all_time_points
            ELSE cr.points
          END DESC,
          le.total_points DESC
        LIMIT $2 OFFSET $3
      `;
      
      const result = await pool.query(query, [category, limit, offset]);
      
      // Add rank numbers
      const leaderboardWithRanks = result.rows.map((row, index) => ({
        ...row,
        rank: parseInt(offset as string) + index + 1
      }));

      res.json({ success: true, data: leaderboardWithRanks });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get regional leaderboard
  router.get('/regional', async (req: Request, res: Response) => {
    try {
      const { region, category = LeaderboardCategory.OVERALL, limit = 100 } = req.query;
      
      const query = `
        SELECT 
          le.*,
          p.username,
          p.avatar,
          p.level as player_level,
          cr.tier,
          cr.points as category_points
        FROM leaderboard_ecosystems le
        JOIN players p ON le.player_id = p.id
        LEFT JOIN category_ranks cr ON le.player_id = cr.player_id AND cr.category = $1
        WHERE p.region = $2
        ORDER BY 
          CASE 
            WHEN $1 = 'overall' THEN le.all_time_points
            ELSE cr.points
          END DESC,
          le.total_points DESC
        LIMIT $3
      `;
      
      const result = await pool.query(query, [category, region, limit]);
      
      // Add rank numbers
      const leaderboardWithRanks = result.rows.map((row, index) => ({
        ...row,
        rank: index + 1
      }));

      res.json({ success: true, data: leaderboardWithRanks });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get community leaderboard
  router.get('/community/:communityId', async (req: Request, res: Response) => {
    try {
      const { communityId } = req.params;
      const { category = LeaderboardCategory.OVERALL, limit = 100 } = req.query;
      
      const query = `
        SELECT 
          le.*,
          p.username,
          p.avatar,
          p.level as player_level,
          cr.tier,
          cr.points as category_points
        FROM leaderboard_ecosystems le
        JOIN players p ON le.player_id = p.id
        LEFT JOIN category_ranks cr ON le.player_id = cr.player_id AND cr.category = $1
        WHERE p.community_id = $2
        ORDER BY 
          CASE 
            WHEN $1 = 'overall' THEN le.all_time_points
            ELSE cr.points
          END DESC,
          le.total_points DESC
        LIMIT $3
      `;
      
      const result = await pool.query(query, [category, communityId, limit]);
      
      // Add rank numbers
      const leaderboardWithRanks = result.rows.map((row, index) => ({
        ...row,
        rank: index + 1
      }));

      res.json({ success: true, data: leaderboardWithRanks });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== COMPETITIONS ====================
  
  // Get active competitions
  router.get('/competitions', async (req: Request, res: Response) => {
    try {
      const { category, status = 'active' } = req.query;
      
      let query = 'SELECT * FROM competitions WHERE 1=1';
      const params: any[] = [];

      if (category) {
        query += ' AND category = $' + (params.length + 1);
        params.push(category);
      }

      if (status === 'active') {
        query += ' AND start_time <= NOW() AND end_time > NOW()';
      } else if (status === 'upcoming') {
        query += ' AND start_time > NOW()';
      } else if (status === 'completed') {
        query += ' AND end_time <= NOW()';
      }

      query += ' ORDER BY start_time ASC';

      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Join competition
  router.post('/competitions/:id/join', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { playerId } = req.body;

      // Verify competition exists and is active
      const competitionResult = await pool.query(
        'SELECT * FROM competitions WHERE id = $1 AND start_time <= NOW() AND end_time > NOW()',
        [id]
      );

      if (competitionResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Competition not found or not active' });
      }

      // Check if already joined
      const existingParticipant = await pool.query(
        'SELECT * FROM competition_participants WHERE competition_id = $1 AND player_id = $2',
        [id, playerId]
      );

      if (existingParticipant.rows.length > 0) {
        return res.status(400).json({ success: false, error: 'Already joined this competition' });
      }

      // Add participant
      await pool.query(
        'INSERT INTO competition_participants (competition_id, player_id, joined_at, current_points) VALUES ($1, $2, NOW(), 0)',
        [id, playerId]
      );

      // Update ecosystem
      await pool.query(
        'UPDATE leaderboard_ecosystems SET last_competed_at = NOW() WHERE player_id = $1',
        [playerId]
      );

      res.json({ success: true, message: 'Joined competition successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get competition results
  router.get('/competitions/:id/results', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const result = await pool.query(
        `SELECT 
          cp.*,
          p.username,
          p.avatar,
          le.global_rank
        FROM competition_participants cp
        JOIN players p ON cp.player_id = p.id
        LEFT JOIN leaderboard_ecosystems le ON cp.player_id = le.player_id
        WHERE cp.competition_id = $1
        ORDER BY cp.current_points DESC, cp.joined_at ASC`,
        [id]
      );

      // Add rank numbers
      const resultsWithRanks = result.rows.map((row, index) => ({
        ...row,
        rank: index + 1
      }));

      res.json({ success: true, data: resultsWithRanks });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== ACHIEVEMENTS ====================
  
  // Get available achievements
  router.get('/achievements', async (req: Request, res: Response) => {
    try {
      const { category } = req.query;
      
      let query = 'SELECT * FROM leaderboard_achievement_definitions WHERE 1=1';
      const params: any[] = [];

      if (category) {
        query += ' AND category = $' + (params.length + 1);
        params.push(category);
      }

      query += ' ORDER BY requirement ASC';

      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Check and award achievements
  router.post('/achievements/check/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      
      // Get player's current stats
      const ecosystemResult = await pool.query(
        'SELECT * FROM leaderboard_ecosystems WHERE player_id = $1',
        [playerId]
      );

      if (ecosystemResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Leaderboard ecosystem not found' });
      }

      const ecosystem = ecosystemResult.rows[0];
      const newAchievements = [];

      // Get all available achievements
      const achievementsResult = await pool.query(
        'SELECT * FROM leaderboard_achievement_definitions'
      );

      for (const achievement of achievementsResult.rows) {
        // Check if player already has this achievement
        const hasAchievement = await pool.query(
          'SELECT * FROM leaderboard_achievements WHERE player_id = $1 AND achievement_id = $2',
          [playerId, achievement.id]
        );

        if (hasAchievement.rows.length > 0) continue;

        // Check if player meets requirements
        let meetsRequirement = false;
        switch (achievement.requirement_type) {
          case 'global_rank':
            meetsRequirement = ecosystem.global_rank <= achievement.requirement;
            break;
          case 'total_points':
            meetsRequirement = ecosystem.total_points >= achievement.requirement;
            break;
          case 'win_rate':
            meetsRequirement = ecosystem.win_rate >= achievement.requirement;
            break;
          case 'streak':
            meetsRequirement = ecosystem.best_streak >= achievement.requirement;
            break;
        }

        if (meetsRequirement) {
          // Award achievement
          await pool.query(
            `INSERT INTO leaderboard_achievements (
              player_id, achievement_id, name, description, category, 
              requirement, reward, earned_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
            [
              playerId, achievement.id, achievement.name, achievement.description,
              achievement.category, achievement.requirement, 
              JSON.stringify(achievement.reward)
            ]
          );
          newAchievements.push(achievement);
        }
      }

      res.json({ success: true, data: newAchievements });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== MILESTONES ====================
  
  // Get available milestones
  router.get('/milestones', async (req: Request, res: Response) => {
    try {
      const result = await pool.query(
        'SELECT * FROM leaderboard_milestone_definitions ORDER BY level ASC'
      );
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Check and unlock milestones
  router.post('/milestones/check/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      
      // Get player's current points
      const ecosystemResult = await pool.query(
        'SELECT total_points FROM leaderboard_ecosystems WHERE player_id = $1',
        [playerId]
      );

      if (ecosystemResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Leaderboard ecosystem not found' });
      }

      const totalPoints = ecosystemResult.rows[0].total_points;
      const newMilestones = [];

      // Get all milestones
      const milestonesResult = await pool.query(
        'SELECT * FROM leaderboard_milestone_definitions'
      );

      for (const milestone of milestonesResult.rows) {
        // Check if player already has this milestone
        const hasMilestone = await pool.query(
          'SELECT * FROM leaderboard_milestones WHERE player_id = $1 AND milestone_id = $2',
          [playerId, milestone.id]
        );

        if (hasMilestone.rows.length > 0) continue;

        // Check if player meets requirements
        if (totalPoints >= milestone.required_points) {
          // Award milestone
          await pool.query(
            `INSERT INTO leaderboard_milestones (
              player_id, milestone_id, level, required_points, rewards, unlocked_at
            ) VALUES ($1, $2, $3, $4, $5, NOW())`,
            [
              playerId, milestone.id, milestone.level, milestone.required_points,
              JSON.stringify(milestone.rewards)
            ]
          );
          newMilestones.push(milestone);
        }
      }

      res.json({ success: true, data: newMilestones });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== BADGES & TITLES ====================
  
  // Get available badges
  router.get('/badges', async (req: Request, res: Response) => {
    try {
      const { category } = req.query;
      
      let query = 'SELECT * FROM leaderboard_badge_definitions WHERE 1=1';
      const params: any[] = [];

      if (category) {
        query += ' AND category = $' + (params.length + 1);
        params.push(category);
      }

      query += ' ORDER BY rarity DESC, name ASC';

      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Equip badge
  router.post('/badges/:id/equip', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { playerId } = req.body;

      // Verify ownership
      const badgeResult = await pool.query(
        'SELECT * FROM leaderboard_badges WHERE id = $1 AND player_id = $2',
        [id, playerId]
      );

      if (badgeResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Badge not found' });
      }

      // Unequip all other badges
      await pool.query(
        'UPDATE leaderboard_badges SET is_equipped = false WHERE player_id = $1',
        [playerId]
      );

      // Equip selected badge
      await pool.query(
        'UPDATE leaderboard_badges SET is_equipped = true WHERE id = $1',
        [id]
      );

      res.json({ success: true, message: 'Badge equipped successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get available titles
  router.get('/titles', async (req: Request, res: Response) => {
    try {
      const { category } = req.query;
      
      let query = 'SELECT * FROM leaderboard_title_definitions WHERE 1=1';
      const params: any[] = [];

      if (category) {
        query += ' AND category = $' + (params.length + 1);
        params.push(category);
      }

      query += ' ORDER BY rarity DESC, name ASC';

      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Activate title
  router.post('/titles/:id/activate', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { playerId } = req.body;

      // Verify ownership
      const titleResult = await pool.query(
        'SELECT * FROM leaderboard_titles WHERE id = $1 AND player_id = $2',
        [id, playerId]
      );

      if (titleResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Title not found' });
      }

      // Deactivate all other titles
      await pool.query(
        'UPDATE leaderboard_titles SET is_active = false WHERE player_id = $1',
        [playerId]
      );

      // Activate selected title
      await pool.query(
        'UPDATE leaderboard_titles SET is_active = true WHERE id = $1',
        [id]
      );

      res.json({ success: true, message: 'Title activated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== ANALYTICS ====================
  
  // Get leaderboard analytics
  router.get('/analytics/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      const { period = '30d' } = req.query;
      
      // Get ecosystem stats
      const ecosystemResult = await pool.query(
        'SELECT * FROM leaderboard_ecosystems WHERE player_id = $1',
        [playerId]
      );

      // Get performance trends
      const performanceTrends = await pool.query(
        `SELECT 
          DATE_TRUNC('day', recorded_at) as date,
          AVG(global_rank) as avg_rank,
          AVG(total_points) as avg_points,
          COUNT(*) as data_points
        FROM leaderboard_performance_history 
        WHERE player_id = $1 AND recorded_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE_TRUNC('day', recorded_at)
        ORDER BY date DESC`,
        [playerId]
      );

      // Get competition statistics
      const competitionStats = await pool.query(
        `SELECT 
          COUNT(*) as total_competitions,
          COUNT(CASE WHEN position <= 3 THEN 1 END) as top_3_finishes,
          COUNT(CASE WHEN position = 1 THEN 1 END) as wins,
          AVG(position) as average_position
        FROM competition_history 
        WHERE player_id = $1`,
        [playerId]
      );

      // Get category performance
      const categoryPerformance = await pool.query(
        `SELECT 
          cr.category,
          cr.points,
          cr.rank,
          cr.tier,
          COUNT(*) as category_competitions
        FROM category_ranks cr
        LEFT JOIN competition_history ch ON cr.player_id = ch.player_id AND cr.category = ch.category
        WHERE cr.player_id = $1
        GROUP BY cr.category, cr.points, cr.rank, cr.tier
        ORDER BY cr.points DESC`,
        [playerId]
      );

      res.json({ 
        success: true, 
        data: {
          ecosystem: ecosystemResult.rows[0],
          performanceTrends: performanceTrends.rows,
          competitionStats: competitionStats.rows[0],
          categoryPerformance: categoryPerformance.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  return router;
}
