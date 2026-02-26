import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { 
  CharityEcosystem, 
  GiverRank, 
  GenerosityLevel,
  DonationFrequency,
  CauseCategory,
  BadgeRarity,
  GrantStatus
} from '../../../shared/types/ecosystems-extended';

export function createCharityRoutes(pool: Pool): Router {
  const router = Router();

  // ==================== CHARITY ECOSYSTEM ====================
  
  // Get or create charity ecosystem for a player
  router.get('/ecosystem/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      
      let result = await pool.query(
        'SELECT * FROM charity_ecosystems WHERE player_id = $1',
        [playerId]
      );

      if (result.rows.length === 0) {
        // Create new charity ecosystem
        result = await pool.query(
          `INSERT INTO charity_ecosystems (
            player_id, giver_rank, impact_score, generosity_level,
            total_donated, lives_impacted, projects_funded, communities_helped,
            joined_at, last_donation_at
          ) VALUES ($1, $2, 0, $3, 0, 0, 0, 0, NOW(), NULL) 
          RETURNING *`,
          [playerId, GiverRank.HELPER, GenerosityLevel.EMERGING]
        );
      }

      // Get donation history
      const historyResult = await pool.query(
        `SELECT dh.*, c.name as charity_name, c.logo as charity_logo
         FROM donation_history dh
         LEFT JOIN charities c ON dh.charity_id = c.id
         WHERE dh.player_id = $1
         ORDER BY dh.timestamp DESC`,
        [playerId]
      );

      // Get recurring donations
      const recurringResult = await pool.query(
        `SELECT rd.*, c.name as charity_name
         FROM recurring_donations rd
         LEFT JOIN charities c ON rd.charity_id = c.id
         WHERE rd.player_id = $1 AND rd.is_active = true`,
        [playerId]
      );

      // Get supported causes
      const causesResult = await pool.query(
        'SELECT * FROM supported_causes WHERE player_id = $1 ORDER BY total_donated DESC',
        [playerId]
      );

      // Get charity badges
      const badgesResult = await pool.query(
        'SELECT * FROM charity_badges WHERE player_id = $1 ORDER BY earned_at DESC',
        [playerId]
      );

      res.json({ 
        success: true, 
        data: {
          ecosystem: result.rows[0],
          donationHistory: historyResult.rows,
          recurringDonations: recurringResult.rows,
          supportedCauses: causesResult.rows,
          badges: badgesResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== DONATIONS ====================
  
  // Make donation
  router.post('/donate', async (req: Request, res: Response) => {
    try {
      const { 
        playerId, charityId, amount, currency, cause, isAnonymous, message 
      } = req.body;

      // Verify charity exists
      const charityResult = await pool.query(
        'SELECT * FROM charities WHERE id = $1 AND is_verified = true',
        [charityId]
      );

      if (charityResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Charity not found or not verified' });
      }

      // Create donation record
      const donationResult = await pool.query(
        `INSERT INTO donation_history (
          player_id, charity_id, amount, currency, cause, is_anonymous, 
          message, impact_description, timestamp
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) 
        RETURNING *`,
        [
          playerId, charityId, amount, currency, cause, isAnonymous, message,
          generateImpactDescription(amount, cause)
        ]
      );

      // Update ecosystem
      await pool.query(
        `UPDATE charity_ecosystems SET 
          total_donated = total_donated + $1,
          impact_score = impact_score + $2,
          lives_impacted = lives_impacted + $3,
          last_donation_at = NOW(),
          updated_at = NOW()
        WHERE player_id = $4`,
        [amount, calculateImpactScore(amount), calculateLivesImpacted(amount), playerId]
      );

      // Update supported causes
      await pool.query(
        `INSERT INTO supported_causes (
          player_id, cause_id, name, category, total_donated, 
          donation_count, first_donated_at, last_donated_at
        ) VALUES ($1, $2, $3, $4, $5, 1, NOW(), NOW())
        ON CONFLICT (player_id, cause_id) DO UPDATE SET
          total_donated = supported_causes.total_donated + EXCLUDED.total_donated,
          donation_count = supported_causes.donation_count + 1,
          last_donated_at = NOW()`,
        [playerId, charityId, charityResult.rows[0].name, cause, amount]
      );

      // Check for rank up
      const ecosystemResult = await pool.query(
        'SELECT total_donated FROM charity_ecosystems WHERE player_id = $1',
        [playerId]
      );

      const newRank = calculateGiverRank(ecosystemResult.rows[0].total_donated);
      const newLevel = calculateGenerosityLevel(ecosystemResult.rows[0].total_donated);

      await pool.query(
        'UPDATE charity_ecosystems SET giver_rank = $1, generosity_level = $2 WHERE player_id = $3',
        [newRank, newLevel, playerId]
      );

      // Check for achievements
      await checkCharityAchievements(playerId, pool);

      res.json({ 
        success: true, 
        data: {
          donation: donationResult.rows[0],
          newRank,
          newLevel
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Set up recurring donation
  router.post('/recurring', async (req: Request, res: Response) => {
    try {
      const { 
        playerId, charityId, amount, currency, frequency, 
        nextDonationDate, endDate 
      } = req.body;

      // Verify charity exists
      const charityResult = await pool.query(
        'SELECT * FROM charities WHERE id = $1 AND is_verified = true',
        [charityId]
      );

      if (charityResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Charity not found or not verified' });
      }

      const result = await pool.query(
        `INSERT INTO recurring_donations (
          player_id, charity_id, amount, currency, frequency,
          next_donation_date, is_active, start_date, end_date
        ) VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), $7) 
        RETURNING *`,
        [playerId, charityId, amount, currency, frequency, nextDonationDate, endDate]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Update recurring donation
  router.patch('/recurring/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { playerId, isActive, amount, frequency } = req.body;

      // Verify ownership
      const recurringResult = await pool.query(
        'SELECT * FROM recurring_donations WHERE id = $1 AND player_id = $2',
        [id, playerId]
      );

      if (recurringResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Recurring donation not found' });
      }

      const updateFields = [];
      const updateValues = [];
      let paramIndex = 1;

      if (isActive !== undefined) {
        updateFields.push(`is_active = $${paramIndex++}`);
        updateValues.push(isActive);
      }

      if (amount !== undefined) {
        updateFields.push(`amount = $${paramIndex++}`);
        updateValues.push(amount);
      }

      if (frequency !== undefined) {
        updateFields.push(`frequency = $${paramIndex++}`);
        updateValues.push(frequency);
      }

      updateFields.push(`updated_at = NOW()`);
      updateValues.push(id);

      const updateQuery = `
        UPDATE recurring_donations 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await pool.query(updateQuery, updateValues);
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== CHARITIES ====================
  
  // Get verified charities
  router.get('/charities', async (req: Request, res: Response) => {
    try {
      const { category, search } = req.query;
      
      let query = 'SELECT * FROM charities WHERE is_verified = true';
      const params: any[] = [];

      if (category) {
        query += ' AND category = $' + (params.length + 1);
        params.push(category);
      }

      if (search) {
        query += ' AND (name ILIKE $' + (params.length + 1) + ' OR description ILIKE $' + (params.length + 1) + ')';
        params.push(`%${search}%`);
      }

      query += ' ORDER BY rating DESC, total_donations_received DESC';

      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get charity details
  router.get('/charities/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const result = await pool.query(
        'SELECT * FROM charities WHERE id = $1 AND is_verified = true',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Charity not found' });
      }

      // Get charity projects
      const projectsResult = await pool.query(
        'SELECT * FROM charity_projects WHERE charity_id = $1 ORDER BY created_at DESC',
        [id]
      );

      // Get recent donations
      const donationsResult = await pool.query(
        `SELECT dh.*, p.username as donor_name
         FROM donation_history dh
         JOIN players p ON dh.player_id = p.id
         WHERE dh.charity_id = $1 AND dh.is_anonymous = false
         ORDER BY dh.timestamp DESC LIMIT 10`,
        [id]
      );

      res.json({ 
        success: true, 
        data: {
          charity: result.rows[0],
          projects: projectsResult.rows,
          recentDonations: donationsResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Add to favorite charities
  router.post('/favorites', async (req: Request, res: Response) => {
    try {
      const { playerId, charityId } = req.body;

      // Verify charity exists
      const charityResult = await pool.query(
        'SELECT * FROM charities WHERE id = $1 AND is_verified = true',
        [charityId]
      );

      if (charityResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Charity not found' });
      }

      const result = await pool.query(
        `INSERT INTO favorite_charities (
          player_id, charity_id, name, description, logo, verified, rating, added_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
        ON CONFLICT (player_id, charity_id) DO NOTHING
        RETURNING *`,
        [
          playerId, charityId, charityResult.rows[0].name, 
          charityResult.rows[0].description, charityResult.rows[0].logo,
          charityResult.rows[0].verified, charityResult.rows[0].rating
        ]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== CHALLENGES ====================
  
  // Get charity challenges
  router.get('/challenges', async (req: Request, res: Response) => {
    try {
      const { active, category } = req.query;
      
      let query = 'SELECT * FROM charity_challenges WHERE 1=1';
      const params: any[] = [];

      if (active !== undefined) {
        query += ' AND is_completed = $' + (params.length + 1);
        params.push(active === 'false');
      }

      if (category) {
        query += ' AND category = $' + (params.length + 1);
        params.push(category);
      }

      query += ' ORDER BY deadline ASC';

      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Join charity challenge
  router.post('/challenges/:id/join', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { playerId } = req.body;

      // Verify challenge exists and is active
      const challengeResult = await pool.query(
        'SELECT * FROM charity_challenges WHERE id = $1 AND deadline > NOW()',
        [id]
      );

      if (challengeResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Challenge not found or expired' });
      }

      // Check if already joined
      const existingParticipant = await pool.query(
        'SELECT * FROM charity_challenge_participants WHERE challenge_id = $1 AND player_id = $2',
        [id, playerId]
      );

      if (existingParticipant.rows.length > 0) {
        return res.status(400).json({ success: false, error: 'Already joined this challenge' });
      }

      // Add participant
      await pool.query(
        'INSERT INTO charity_challenge_participants (challenge_id, player_id, joined_at) VALUES ($1, $2, NOW())',
        [id, playerId]
      );

      res.json({ success: true, message: 'Joined challenge successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== GRANTS ====================
  
  // Apply for grant
  router.post('/grants', async (req: Request, res: Response) => {
    try {
      const { 
        playerId, grantId, title, description, requestedAmount 
      } = req.body;

      // Verify grant exists
      const grantResult = await pool.query(
        'SELECT * FROM grants WHERE id = $1 AND deadline > NOW()',
        [grantId]
      );

      if (grantResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Grant not found or expired' });
      }

      const result = await pool.query(
        `INSERT INTO grant_applications (
          player_id, grant_id, title, description, requested_amount, 
          status, submitted_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
        RETURNING *`,
        [playerId, grantId, title, description, requestedAmount, GrantStatus.SUBMITTED]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get grant applications
  router.get('/grants/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      const { status } = req.query;
      
      let query = `
        SELECT ga.*, g.name as grant_name, g.organization as grant_organization
        FROM grant_applications ga
        JOIN grants g ON ga.grant_id = g.id
        WHERE ga.player_id = $1
      `;
      const params: any[] = [playerId];

      if (status) {
        query += ' AND ga.status = $' + (params.length + 1);
        params.push(status);
      }

      query += ' ORDER BY ga.submitted_at DESC';

      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== ANALYTICS ====================
  
  // Get charity analytics
  router.get('/analytics/:playerId', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.params;
      
      // Get ecosystem stats
      const ecosystemResult = await pool.query(
        'SELECT * FROM charity_ecosystems WHERE player_id = $1',
        [playerId]
      );

      // Get donation statistics
      const donationStats = await pool.query(
        `SELECT 
          currency,
          COUNT(*) as donation_count,
          SUM(amount) as total_amount,
          AVG(amount) as average_amount
        FROM donation_history 
        WHERE player_id = $1
        GROUP BY currency`,
        [playerId]
      );

      // Get cause breakdown
      const causeBreakdown = await pool.query(
        `SELECT 
          cause,
          COUNT(*) as donation_count,
          SUM(amount) as total_amount
        FROM donation_history 
        WHERE player_id = $1
        GROUP BY cause
        ORDER BY total_amount DESC`,
        [playerId]
      );

      // Get monthly trends
      const monthlyTrends = await pool.query(
        `SELECT 
          DATE_TRUNC('month', timestamp) as month,
          COUNT(*) as donation_count,
          SUM(amount) as total_amount,
          COUNT(DISTINCT charity_id) as unique_charities
        FROM donation_history 
        WHERE player_id = $1 AND timestamp >= NOW() - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', timestamp)
        ORDER BY month DESC`,
        [playerId]
      );

      // Get impact metrics
      const impactMetrics = await pool.query(
        `SELECT 
          SUM(CASE WHEN amount >= 1000 THEN 1 ELSE 0 END) as major_donations,
          SUM(CASE WHEN is_anonymous = false THEN 1 ELSE 0 END) as public_donations,
          COUNT(DISTINCT charity_id) as supported_charities,
          COUNT(DISTINCT cause) as supported_causes
        FROM donation_history 
        WHERE player_id = $1`,
        [playerId]
      );

      res.json({ 
        success: true, 
        data: {
          ecosystem: ecosystemResult.rows[0],
          donationStats: donationStats.rows,
          causeBreakdown: causeBreakdown.rows,
          monthlyTrends: monthlyTrends.rows,
          impactMetrics: impactMetrics.rows[0]
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  return router;
}

// Helper functions
function generateImpactDescription(amount: number, cause: string): string {
  const impacts = {
    [CauseCategory.EDUCATION]: {
      10: 'Provides school supplies for 1 student',
      50: 'Funds 1 week of education for 1 student',
      100: 'Provides 1 month of education for 1 student',
      500: 'Funds 1 semester of education for 1 student',
      1000: 'Provides 1 year of education for 1 student'
    },
    [CauseCategory.HEALTHCARE]: {
      10: 'Provides basic medical supplies',
      50: 'Funds 1 medical consultation',
      100: 'Provides vaccination for 5 children',
      500: 'Funds 1 minor surgery',
      1000: 'Provides life-saving treatment'
    },
    [CauseCategory.ENVIRONMENT]: {
      10: 'Plants 1 tree',
      50: 'Plants 5 trees',
      100: 'Protects 1 acre of forest',
      500: 'Funds renewable energy project',
      1000: 'Protects 10 acres of wildlife habitat'
    },
    [CauseCategory.POVERTY]: {
      10: 'Provides 1 meal for a family',
      50: 'Provides food for 1 week',
      100: 'Provides food for 1 month',
      500: 'Provides housing support for 1 month',
      1000: 'Funds vocational training'
    }
  };

  const causeImpacts = impacts[cause] || impacts[CauseCategory.POVERTY];
  
  let description = 'Makes a positive impact';
  for (const [threshold, desc] of Object.entries(causeImpacts)) {
    if (amount >= parseInt(threshold)) {
      description = desc;
    }
  }

  return description;
}

function calculateImpactScore(amount: number): number {
  return Math.floor(amount / 10); // 1 point per $10 donated
}

function calculateLivesImpacted(amount: number): number {
  return Math.ceil(amount / 100); // Rough estimate
}

function calculateGiverRank(totalDonated: number): GiverRank {
  if (totalDonated >= 10000) return GiverRank.LEGEND;
  if (totalDonated >= 5000) return GiverRank.CHAMPION;
  if (totalDonated >= 2000) return GiverRank.HUMANITARIAN;
  if (totalDonated >= 1000) return GiverRank.BENEFACTOR;
  if (totalDonated >= 500) return GiverRank.PHILANTHROPIST;
  if (totalDonated >= 100) return GiverRank.CONTRIBUTOR;
  if (totalDonated >= 25) return GiverRank.SUPPORTER;
  return GiverRank.HELPER;
}

function calculateGenerosityLevel(totalDonated: number): GenerosityLevel {
  if (totalDonated >= 5000) return GenerosityLevel.LEGENDARY;
  if (totalDonated >= 2000) return GenerosityLevel.EXTRAORDINARY;
  if (totalDonated >= 1000) return GenerosityLevel.EXCEPTIONAL;
  if (totalDonated >= 500) return GenerosityLevel.ESTABLISHED;
  if (totalDonated >= 100) return GenerosityLevel.GROWING;
  return GenerosityLevel.EMERGING;
}

async function checkCharityAchievements(playerId: string, pool: Pool): Promise<void> {
  // Get player's donation stats
  const statsResult = await pool.query(
    `SELECT 
      COUNT(*) as total_donations,
      SUM(amount) as total_amount,
      COUNT(DISTINCT charity_id) as unique_charities,
      COUNT(DISTINCT cause) as unique_causes
    FROM donation_history 
    WHERE player_id = $1`,
    [playerId]
  );

  const stats = statsResult.rows[0];

  // Check for various achievements
  const achievements = [
    { name: 'First Donation', condition: stats.total_donations >= 1 },
    { name: 'Generous Giver', condition: stats.total_amount >= 100 },
    { name: 'Philanthropist', condition: stats.total_amount >= 1000 },
    { name: 'Variety Giver', condition: stats.unique_charities >= 5 },
    { name: 'Cause Champion', condition: stats.unique_causes >= 3 },
    { name: 'Consistent Giver', condition: stats.total_donations >= 10 }
  ];

  for (const achievement of achievements) {
    if (achievement.condition) {
      // Check if already earned
      const hasAchievement = await pool.query(
        'SELECT * FROM charity_badges WHERE player_id = $1 AND name = $2',
        [playerId, achievement.name]
      );

      if (hasAchievement.rows.length === 0) {
        // Award achievement
        await pool.query(
          `INSERT INTO charity_badges (
            player_id, name, description, icon, rarity, earned_at, criteria
          ) VALUES ($1, $2, $3, $4, $5, NOW(), $6)`,
          [
            playerId, achievement.name, `${achievement.name} achievement`,
            '🏆', BadgeRarity.COMMON, achievement.name
          ]
        );
      }
    }
  }
}
