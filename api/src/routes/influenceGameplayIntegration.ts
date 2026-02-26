import { Router, Request, Response } from 'express';
import { Pool } from 'pg';

export function createInfluenceGameplayIntegrationRoutes(pool: Pool): Router {
  const router = Router();

  // ==================== INFLUENCE GAMEPLAY INTEGRATION ====================
  
  // Daily Login Bonus
  router.post('/gameplay/daily-login', async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      
      // Check if user already claimed daily bonus today
      const dailyCheckQuery = `
        SELECT COUNT(*) as claimed_today
        FROM influence_earning_events 
        WHERE user_id = $1 
        AND event_type = 'daily_login'
        AND DATE(earned_date) = CURRENT_DATE
      `;
      const dailyCheck = await pool.query(dailyCheckQuery, [userId]);
      
      if (parseInt(dailyCheck.rows[0].claimed_today) > 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Daily login bonus already claimed today',
          nextClaimTime: new Date(new Date().setHours(24, 0, 0, 0)).toISOString()
        });
      }
      
      // Award daily login bonus
      const bonusAmount = 100; // Fixed 100 Influence for daily login
      
      // Create earning event
      const earnQuery = `
        INSERT INTO influence_earning_events (user_id, event_type, amount_earned, event_data)
        VALUES ($1, 'daily_login', $2, $3)
        RETURNING *
      `;
      const earnResult = await pool.query(earnQuery, [userId, bonusAmount, {
        loginTime: new Date().toISOString(),
        bonusType: 'daily_login',
        streakDays: 1 // Could be enhanced to track streak
      }]);
      
      // Update user's influence balance
      const updateQuery = `
        UPDATE influence_currency 
        SET influence_balance = influence_balance + $1,
            influence_earned = influence_earned + $1,
            last_earned = NOW()
        WHERE user_id = $2
        RETURNING *
      `;
      const updateResult = await pool.query(updateQuery, [bonusAmount, userId]);
      
      res.json({ 
        success: true, 
        data: {
          bonusAmount,
          earningEvent: earnResult.rows[0],
          updatedBalance: updateResult.rows[0],
          nextClaimTime: new Date(new Date().setHours(24, 0, 0, 0)).toISOString()
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Gameplay Achievements
  router.post('/gameplay/achievement', async (req: Request, res: Response) => {
    try {
      const { userId, achievementId, achievementType, difficulty, metadata } = req.body;
      
      // Calculate reward based on achievement type and difficulty
      const rewardMap = {
        'bronze': { min: 50, max: 150 },
        'silver': { min: 100, max: 300 },
        'gold': { min: 200, max: 500 },
        'platinum': { min: 400, max: 750 },
        'diamond': { min: 600, max: 1000 }
      };
      
      const rewardRange = rewardMap[difficulty] || rewardMap.bronze;
      const rewardAmount = Math.floor(Math.random() * (rewardRange.max - rewardRange.min + 1)) + rewardRange.min;
      
      // Check if user already earned this achievement
      const achievementCheckQuery = `
        SELECT COUNT(*) as already_earned
        FROM influence_earning_events 
        WHERE user_id = $1 
        AND event_type = 'achievement'
        AND event_data->>'achievementId' = $2
      `;
      const achievementCheck = await pool.query(achievementCheckQuery, [userId, achievementId]);
      
      if (parseInt(achievementCheck.rows[0].already_earned) > 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Achievement already earned',
          achievementId
        });
      }
      
      // Create achievement earning event
      const earnQuery = `
        INSERT INTO influence_earning_events (user_id, event_type, amount_earned, event_data)
        VALUES ($1, 'achievement', $2, $3)
        RETURNING *
      `;
      const earnResult = await pool.query(earnQuery, [userId, rewardAmount, {
        achievementId,
        achievementType,
        difficulty,
        earnedAt: new Date().toISOString(),
        ...metadata
      }]);
      
      // Update user's influence balance
      const updateQuery = `
        UPDATE influence_currency 
        SET influence_balance = influence_balance + $1,
            influence_earned = influence_earned + $1,
            last_earned = NOW()
        WHERE user_id = $2
        RETURNING *
      `;
      const updateResult = await pool.query(updateQuery, [rewardAmount, userId]);
      
      res.json({ 
        success: true, 
        data: {
          rewardAmount,
          achievementType,
          difficulty,
          earningEvent: earnResult.rows[0],
          updatedBalance: updateResult.rows[0]
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Social Interactions
  router.post('/gameplay/social-interaction', async (req: Request, res: Response) => {
    try {
      const { userId, interactionType, targetUserId, interactionData } = req.body;
      
      // Calculate reward based on interaction type
      const rewardMap = {
        'like': { min: 10, max: 25 },
        'comment': { min: 20, max: 40 },
        'share': { min: 30, max: 50 },
        'follow': { min: 15, max: 35 },
        'gift': { min: 25, max: 60 },
        'collaborate': { min: 40, max: 80 },
        'mentor': { min: 50, max: 100 }
      };
      
      const rewardRange = rewardMap[interactionType] || rewardMap.like;
      const rewardAmount = Math.floor(Math.random() * (rewardRange.max - rewardRange.min + 1)) + rewardRange.min;
      
      // Check daily social interaction limits
      const dailyCheckQuery = `
        SELECT COUNT(*) as daily_interactions
        FROM influence_earning_events 
        WHERE user_id = $1 
        AND event_type = 'social_interaction'
        AND DATE(earned_date) = CURRENT_DATE
      `;
      const dailyCheck = await pool.query(dailyCheckQuery, [userId]);
      
      const dailyLimit = 50; // Maximum 50 social interactions per day
      if (parseInt(dailyCheck.rows[0].daily_interactions) >= dailyLimit) {
        return res.status(400).json({ 
          success: false, 
          error: 'Daily social interaction limit reached',
          dailyLimit,
          nextResetTime: new Date(new Date().setHours(24, 0, 0, 0)).toISOString()
        });
      }
      
      // Create social interaction earning event
      const earnQuery = `
        INSERT INTO influence_earning_events (user_id, event_type, amount_earned, event_data)
        VALUES ($1, 'social_interaction', $2, $3)
        RETURNING *
      `;
      const earnResult = await pool.query(earnQuery, [userId, rewardAmount, {
        interactionType,
        targetUserId,
        interactionTime: new Date().toISOString(),
        ...interactionData
      }]);
      
      // Update user's influence balance
      const updateQuery = `
        UPDATE influence_currency 
        SET influence_balance = influence_balance + $1,
            influence_earned = influence_earned + $1,
            last_earned = NOW()
        WHERE user_id = $2
        RETURNING *
      `;
      const updateResult = await pool.query(updateQuery, [rewardAmount, userId]);
      
      res.json({ 
        success: true, 
        data: {
          rewardAmount,
          interactionType,
          earningEvent: earnResult.rows[0],
          updatedBalance: updateResult.rows[0],
          remainingInteractions: dailyLimit - parseInt(dailyCheck.rows[0].daily_interactions) - 1
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Referral Bonuses
  router.post('/gameplay/referral-bonus', async (req: Request, res: Response) => {
    try {
      const { referrerId, referredUserId, referralType } = req.body;
      
      // Calculate reward based on referral type
      const rewardMap = {
        'basic': { min: 500, max: 1000 },
        'premium': { min: 1000, max: 2500 },
        'vip': { min: 2000, max: 3500 },
        'ambassador': { min: 3000, max: 5000 }
      };
      
      const rewardRange = rewardMap[referralType] || rewardMap.basic;
      const rewardAmount = Math.floor(Math.random() * (rewardRange.max - rewardRange.min + 1)) + rewardRange.min;
      
      // Check if this referral was already processed
      const referralCheckQuery = `
        SELECT COUNT(*) as already_processed
        FROM influence_earning_events 
        WHERE user_id = $1 
        AND event_type = 'referral_bonus'
        AND event_data->>'referredUserId' = $2
      `;
      const referralCheck = await pool.query(referralCheckQuery, [referrerId, referredUserId]);
      
      if (parseInt(referralCheck.rows[0].already_processed) > 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Referral bonus already processed',
          referredUserId
        });
      }
      
      // Create referral bonus earning event for referrer
      const earnQuery = `
        INSERT INTO influence_earning_events (user_id, event_type, amount_earned, event_data)
        VALUES ($1, 'referral_bonus', $2, $3)
        RETURNING *
      `;
      const earnResult = await pool.query(earnQuery, [referrerId, rewardAmount, {
        referredUserId,
        referralType,
        referralTime: new Date().toISOString()
      }]);
      
      // Update referrer's influence balance
      const updateQuery = `
        UPDATE influence_currency 
        SET influence_balance = influence_balance + $1,
            influence_earned = influence_earned + $1,
            last_earned = NOW()
        WHERE user_id = $2
        RETURNING *
      `;
      const updateResult = await pool.query(updateQuery, [rewardAmount, referrerId]);
      
      // Also give a welcome bonus to the referred user
      const welcomeBonusAmount = 250; // Fixed welcome bonus
      const welcomeEarnQuery = `
        INSERT INTO influence_earning_events (user_id, event_type, amount_earned, event_data)
        VALUES ($1, 'welcome_bonus', $2, $3)
        RETURNING *
      `;
      const welcomeEarnResult = await pool.query(welcomeEarnQuery, [referredUserId, welcomeBonusAmount, {
        referrerId,
        referralType,
        welcomeTime: new Date().toISOString()
      }]);
      
      // Update referred user's influence balance
      const welcomeUpdateQuery = `
        UPDATE influence_currency 
        SET influence_balance = influence_balance + $1,
            influence_earned = influence_earned + $1,
            last_earned = NOW()
        WHERE user_id = $2
        RETURNING *
      `;
      const welcomeUpdateResult = await pool.query(welcomeUpdateQuery, [welcomeBonusAmount, referredUserId]);
      
      res.json({ 
        success: true, 
        data: {
          referrerBonus: {
            rewardAmount,
            referralType,
            earningEvent: earnResult.rows[0],
            updatedBalance: updateResult.rows[0]
          },
          referredBonus: {
            rewardAmount: welcomeBonusAmount,
            earningEvent: welcomeEarnResult.rows[0],
            updatedBalance: welcomeUpdateResult.rows[0]
          }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Tournament Wins
  router.post('/gameplay/tournament-win', async (req: Request, res: Response) => {
    try {
      const { userId, tournamentId, tournamentType, position, totalParticipants, metadata } = req.body;
      
      // Calculate reward based on tournament type and position
      const positionMultipliers = {
        1: 1.0,      // 1st place
        2: 0.7,      // 2nd place
        3: 0.5,      // 3rd place
        4: 0.3,      // 4th place
        5: 0.2,      // 5th place
        10: 0.1      // 10th place and below
      };
      
      const tournamentBaseRewards = {
        'casual': { min: 1000, max: 2500 },
        'competitive': { min: 2000, max: 5000 },
        'professional': { min: 5000, max: 15000 },
        'championship': { min: 10000, max: 25000 },
        'world_championship': { min: 20000, max: 50000 }
      };
      
      const baseRewardRange = tournamentBaseRewards[tournamentType] || tournamentBaseRewards.casual;
      const baseReward = Math.floor(Math.random() * (baseRewardRange.max - baseRewardRange.min + 1)) + baseRewardRange.min;
      
      // Apply position multiplier
      const positionKey = Object.keys(positionMultipliers).find(key => parseInt(key) >= position) || '10';
      const multiplier = positionMultipliers[positionKey];
      const finalRewardAmount = Math.floor(baseReward * multiplier);
      
      // Check if user already received reward for this tournament
      const tournamentCheckQuery = `
        SELECT COUNT(*) as already_rewarded
        FROM influence_earning_events 
        WHERE user_id = $1 
        AND event_type = 'tournament_win'
        AND event_data->>'tournamentId' = $2
      `;
      const tournamentCheck = await pool.query(tournamentCheckQuery, [userId, tournamentId]);
      
      if (parseInt(tournamentCheck.rows[0].already_rewarded) > 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Tournament reward already claimed',
          tournamentId
        });
      }
      
      // Create tournament win earning event
      const earnQuery = `
        INSERT INTO influence_earning_events (user_id, event_type, amount_earned, event_data)
        VALUES ($1, 'tournament_win', $2, $3)
        RETURNING *
      `;
      const earnResult = await pool.query(earnQuery, [userId, finalRewardAmount, {
        tournamentId,
        tournamentType,
        position,
        totalParticipants,
        baseReward,
        multiplier,
        finalRewardAmount,
        winTime: new Date().toISOString(),
        ...metadata
      }]);
      
      // Update user's influence balance
      const updateQuery = `
        UPDATE influence_currency 
        SET influence_balance = influence_balance + $1,
            influence_earned = influence_earned + $1,
            last_earned = NOW()
        WHERE user_id = $2
        RETURNING *
      `;
      const updateResult = await pool.query(updateQuery, [finalRewardAmount, userId]);
      
      res.json({ 
        success: true, 
        data: {
          rewardAmount: finalRewardAmount,
          tournamentType,
          position,
          baseReward,
          multiplier,
          earningEvent: earnResult.rows[0],
          updatedBalance: updateResult.rows[0]
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get user's gameplay earnings summary
  router.get('/gameplay/earnings-summary/:userId', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      
      // Get earnings by type
      const earningsQuery = `
        SELECT 
          event_type,
          COUNT(*) as event_count,
          SUM(amount_earned) as total_earned,
          AVG(amount_earned) as average_earned,
          MAX(amount_earned) as max_earned,
          MIN(amount_earned) as min_earned,
          DATE_TRUNC('day', earned_date) as earning_day
        FROM influence_earning_events 
        WHERE user_id = $1
        AND earned_date >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY event_type, DATE_TRUNC('day', earned_date)
        ORDER BY earning_day DESC
      `;
      const earningsResult = await pool.query(earningsQuery, [userId]);
      
      // Get today's earnings
      const todayEarningsQuery = `
        SELECT 
          event_type,
          COUNT(*) as event_count,
          SUM(amount_earned) as total_earned
        FROM influence_earning_events 
        WHERE user_id = $1
        AND DATE(earned_date) = CURRENT_DATE
        GROUP BY event_type
      `;
      const todayEarningsResult = await pool.query(todayEarningsQuery, [userId]);
      
      // Get user's current balance
      const balanceQuery = `
        SELECT * FROM influence_currency WHERE user_id = $1
      `;
      const balanceResult = await pool.query(balanceQuery, [userId]);
      
      res.json({ 
        success: true, 
        data: {
          currentBalance: balanceResult.rows[0] || {
            influence_balance: 0,
            influence_earned: 0,
            influence_spent: 0
          },
          todayEarnings: todayEarningsResult.rows,
          thirtyDayEarnings: earningsResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get available achievements and their rewards
  router.get('/gameplay/achievements', async (req: Request, res: Response) => {
    try {
      // Mock achievement data - in production, this would come from a database
      const achievements = [
        {
          id: 'first_login',
          name: 'First Steps',
          description: 'Log in for the first time',
          type: 'bronze',
          rewardRange: { min: 50, max: 150 },
          category: 'onboarding'
        },
        {
          id: 'social_butterfly',
          name: 'Social Butterfly',
          description: 'Make 10 social interactions',
          type: 'silver',
          rewardRange: { min: 100, max: 300 },
          category: 'social'
        },
        {
          id: 'tournament_champion',
          name: 'Tournament Champion',
          description: 'Win a competitive tournament',
          type: 'gold',
          rewardRange: { min: 200, max: 500 },
          category: 'competitive'
        },
        {
          id: 'referral_master',
          name: 'Referral Master',
          description: 'Refer 5 new users',
          type: 'platinum',
          rewardRange: { min: 400, max: 750 },
          category: 'referral'
        },
        {
          id: 'legendary_player',
          name: 'Legendary Player',
          description: 'Reach level 50',
          type: 'diamond',
          rewardRange: { min: 600, max: 1000 },
          category: 'progression'
        }
      ];
      
      res.json({ 
        success: true, 
        data: achievements
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get tournament information and rewards
  router.get('/gameplay/tournaments', async (req: Request, res: Response) => {
    try {
      // Mock tournament data - in production, this would come from a database
      const tournaments = [
        {
          id: 'daily_casual_001',
          name: 'Daily Casual Tournament',
          type: 'casual',
          entryFee: 100,
          rewardRange: { min: 1000, max: 2500 },
          maxParticipants: 100,
          currentParticipants: 45,
          startTime: new Date(Date.now() + 3600000).toISOString(),
          duration: 2 // hours
        },
        {
          id: 'weekly_competitive_001',
          name: 'Weekly Competitive Tournament',
          type: 'competitive',
          entryFee: 500,
          rewardRange: { min: 2000, max: 5000 },
          maxParticipants: 500,
          currentParticipants: 234,
          startTime: new Date(Date.now() + 86400000).toISOString(),
          duration: 4 // hours
        },
        {
          id: 'monthly_professional_001',
          name: 'Monthly Professional Tournament',
          type: 'professional',
          entryFee: 2000,
          rewardRange: { min: 5000, max: 15000 },
          maxParticipants: 1000,
          currentParticipants: 567,
          startTime: new Date(Date.now() + 2592000000).toISOString(),
          duration: 6 // hours
        },
        {
          id: 'quarterly_championship_001',
          name: 'Quarterly Championship',
          type: 'championship',
          entryFee: 5000,
          rewardRange: { min: 10000, max: 25000 },
          maxParticipants: 2000,
          currentParticipants: 1234,
          startTime: new Date(Date.now() + 7776000000).toISOString(),
          duration: 8 // hours
        }
      ];
      
      res.json({ 
        success: true, 
        data: tournaments
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  return router;
}
