import { Router, Request, Response } from 'express';
import { Pool } from 'pg';

export function createPowerTokenEconomyRoutes(pool: Pool): Router {
  const router = Router();

  // ==================== POWER TOKEN (PWR) CORE OPERATIONS ====================
  
  // Get PWR token total supply and distribution
  router.get('/token-supply', async (req: Request, res: Response) => {
    try {
      const query = `
        SELECT * FROM token_supply_overview
      `;
      const result = await pool.query(query);
      
      res.json({ 
        success: true, 
        data: {
          tokenName: 'POWER Token',
          symbol: 'PWR',
          totalSupply: '1,000,000,000,000 PWR', // 1 TRILLION
          totalSupplyRaw: 1000000000000000, // With 18 decimals
          ...result.rows[0]
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get user's PWR and Influence balances
  router.get('/user-balance/:userId', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      
      const query = `
        SELECT * FROM user_token_summary 
        WHERE user_id = $1
      `;
      const result = await pool.query(query, [userId]);
      
      if (result.rows.length === 0) {
        // Create new user entries if not exist
        await pool.query('INSERT INTO influence_currency (user_id) VALUES ($1)', [userId]);
        await pool.query('INSERT INTO pwr_holdings (user_id) VALUES ($1)', [userId]);
        
        const newUserQuery = `
          SELECT * FROM user_token_summary 
          WHERE user_id = $1
        `;
        const newUserResult = await pool.query(newUserQuery, [userId]);
        res.json({ success: true, data: newUserResult.rows[0] });
      } else {
        res.json({ success: true, data: result.rows[0] });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== INFLUENCE CURRENCY OPERATIONS ====================
  
  // Earn Influence through gameplay
  router.post('/influence/earn', async (req: Request, res: Response) => {
    try {
      const { userId, eventType, amount, eventData } = req.body;
      
      // Check daily earning limit
      const dailyCheckQuery = `
        SELECT COUNT(*) as daily_count, COALESCE(SUM(amount_earned), 0) as daily_total
        FROM influence_earning_events 
        WHERE user_id = $1 AND DATE(earned_date) = CURRENT_DATE
      `;
      const dailyCheck = await pool.query(dailyCheckQuery, [userId]);
      
      const userLimitsQuery = `
        SELECT daily_earn_limit FROM influence_currency WHERE user_id = $1
      `;
      const userLimits = await pool.query(userLimitsQuery, [userId]);
      
      const dailyLimit = userLimits.rows[0]?.daily_earn_limit || 10000;
      const currentDailyTotal = parseInt(dailyCheck.rows[0].daily_total);
      
      if (currentDailyTotal + amount > dailyLimit) {
        return res.status(400).json({ 
          success: false, 
          error: 'Daily earning limit exceeded',
          currentDailyTotal,
          dailyLimit,
          remainingLimit: dailyLimit - currentDailyTotal
        });
      }
      
      // Add influence earning event
      const earnQuery = `
        INSERT INTO influence_earning_events (user_id, event_type, amount_earned, event_data)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const earnResult = await pool.query(earnQuery, [userId, eventType, amount, eventData]);
      
      // Update user's influence balance
      const updateQuery = `
        UPDATE influence_currency 
        SET influence_balance = influence_balance + $1,
            influence_earned = influence_earned + $1,
            last_earned = NOW()
        WHERE user_id = $2
        RETURNING *
      `;
      const updateResult = await pool.query(updateQuery, [amount, userId]);
      
      res.json({ 
        success: true, 
        data: {
          earningEvent: earnResult.rows[0],
          updatedBalance: updateResult.rows[0]
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Spend Influence on in-game items/features
  router.post('/influence/spend', async (req: Request, res: Response) => {
    try {
      const { userId, eventType, amount, eventData } = req.body;
      
      // Check user's influence balance
      const balanceQuery = `
        SELECT influence_balance, daily_spent_limit FROM influence_currency WHERE user_id = $1
      `;
      const balanceResult = await pool.query(balanceQuery, [userId]);
      
      if (balanceResult.rows.length === 0 || balanceResult.rows[0].influence_balance < amount) {
        return res.status(400).json({ 
          success: false, 
          error: 'Insufficient influence balance',
          currentBalance: balanceResult.rows[0]?.influence_balance || 0,
          requiredAmount: amount
        });
      }
      
      // Check daily spending limit
      const dailyCheckQuery = `
        SELECT COALESCE(SUM(amount_spent), 0) as daily_total
        FROM influence_spending_events 
        WHERE user_id = $1 AND DATE(spent_date) = CURRENT_DATE
      `;
      const dailyCheck = await pool.query(dailyCheckQuery, [userId]);
      
      const dailyLimit = balanceResult.rows[0].daily_spent_limit;
      const currentDailyTotal = parseInt(dailyCheck.rows[0].daily_total);
      
      if (currentDailyTotal + amount > dailyLimit) {
        return res.status(400).json({ 
          success: false, 
          error: 'Daily spending limit exceeded',
          currentDailyTotal,
          dailyLimit,
          remainingLimit: dailyLimit - currentDailyTotal
        });
      }
      
      // Add influence spending event
      const spendQuery = `
        INSERT INTO influence_spending_events (user_id, event_type, amount_spent, event_data)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const spendResult = await pool.query(spendQuery, [userId, eventType, amount, eventData]);
      
      // Update user's influence balance
      const updateQuery = `
        UPDATE influence_currency 
        SET influence_balance = influence_balance - $1,
            influence_spent = influence_spent + $1
        WHERE user_id = $2
        RETURNING *
      `;
      const updateResult = await pool.query(updateQuery, [amount, userId]);
      
      res.json({ 
        success: true, 
        data: {
          spendingEvent: spendResult.rows[0],
          updatedBalance: updateResult.rows[0]
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== PWR TOKEN OPERATIONS ====================
  
  // Mine PWR tokens through various activities
  router.post('/pwr/mine', async (req: Request, res: Response) => {
    try {
      const { userId, miningType, amount, difficulty, energyConsumed } = req.body;
      
      // Check mining limits and difficulty
      const miningQuery = `
        INSERT INTO pwr_mining (user_id, mining_type, amount_mined, difficulty_level, energy_consumed)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const miningResult = await pool.query(miningQuery, [userId, miningType, amount, difficulty, energyConsumed]);
      
      // Update user's PWR holdings
      const updateQuery = `
        UPDATE pwr_holdings 
        SET pwr_balance = pwr_balance + $1,
            total_earned = total_earned + $1,
            last_transaction = NOW()
        WHERE user_id = $2
        RETURNING *
      `;
      const updateResult = await pool.query(updateQuery, [amount, userId]);
      
      // Update total circulating supply
      const supplyQuery = `
        UPDATE power_token 
        SET circulating_supply = circulating_supply + $1
        RETURNING *
      `;
      const supplyResult = await pool.query(supplyQuery, [amount]);
      
      res.json({ 
        success: true, 
        data: {
          miningEvent: miningResult.rows[0],
          updatedHoldings: updateResult.rows[0],
          updatedSupply: supplyResult.rows[0]
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Stake PWR tokens for rewards
  router.post('/pwr/stake', async (req: Request, res: Response) => {
    try {
      const { userId, stakingPoolId, amount, stakingPeriod, apyRate, autoCompound } = req.body;
      
      // Check user's PWR balance
      const balanceQuery = `
        SELECT pwr_balance FROM pwr_holdings WHERE user_id = $1
      `;
      const balanceResult = await pool.query(balanceQuery, [userId]);
      
      if (balanceResult.rows.length === 0 || balanceResult.rows[0].pwr_balance < amount) {
        return res.status(400).json({ 
          success: false, 
          error: 'Insufficient PWR balance for staking',
          currentBalance: balanceResult.rows[0]?.pwr_balance || 0,
          requiredAmount: amount
        });
      }
      
      // Create staking record
      const stakeQuery = `
        INSERT INTO pwr_staking (user_id, staking_pool_id, amount_staked, staking_period, apy_rate, auto_compound, end_date)
        VALUES ($1, $2, $3, $4, $5, $6, NOW() + INTERVAL '$4 days')
        RETURNING *
      `;
      const stakeResult = await pool.query(stakeQuery, [userId, stakingPoolId, amount, stakingPeriod, apyRate, autoCompound]);
      
      // Update user's PWR holdings (move to staked)
      const updateQuery = `
        UPDATE pwr_holdings 
        SET pwr_balance = pwr_balance - $1,
            pwr_staked = pwr_staked + $1,
            last_transaction = NOW()
        WHERE user_id = $2
        RETURNING *
      `;
      const updateResult = await pool.query(updateQuery, [amount, userId]);
      
      // Update total staked supply
      const supplyQuery = `
        UPDATE power_token 
        SET staked_supply = staked_supply + $1
        RETURNING *
      `;
      const supplyResult = await pool.query(supplyQuery, [amount]);
      
      res.json({ 
        success: true, 
        data: {
          stakingRecord: stakeResult.rows[0],
          updatedHoldings: updateResult.rows[0],
          updatedSupply: supplyResult.rows[0]
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Transfer PWR tokens between users
  router.post('/pwr/transfer', async (req: Request, res: Response) => {
    try {
      const { fromUserId, toUserId, amount, feeAmount, transactionType } = req.body;
      
      // Check sender's balance
      const balanceQuery = `
        SELECT pwr_balance FROM pwr_holdings WHERE user_id = $1
      `;
      const balanceResult = await pool.query(balanceQuery, [fromUserId]);
      
      const totalRequired = amount + (feeAmount || 0);
      if (balanceResult.rows.length === 0 || balanceResult.rows[0].pwr_balance < totalRequired) {
        return res.status(400).json({ 
          success: false, 
          error: 'Insufficient PWR balance for transfer',
          currentBalance: balanceResult.rows[0]?.pwr_balance || 0,
          requiredAmount: totalRequired
        });
      }
      
      // Create transaction record
      const transactionQuery = `
        INSERT INTO pwr_transactions (transaction_id, from_user_id, to_user_id, amount, fee_amount, transaction_type)
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
        RETURNING *
      `;
      const transactionResult = await pool.query(transactionQuery, [fromUserId, toUserId, amount, feeAmount, transactionType]);
      
      // Update sender's balance
      const senderUpdateQuery = `
        UPDATE pwr_holdings 
        SET pwr_balance = pwr_balance - $1,
            total_spent = total_spent + $1,
            last_transaction = NOW()
        WHERE user_id = $2
        RETURNING *
      `;
      const senderUpdateResult = await pool.query(senderUpdateQuery, [totalRequired, fromUserId]);
      
      // Update recipient's balance
      const recipientUpdateQuery = `
        UPDATE pwr_holdings 
        SET pwr_balance = pwr_balance + $1,
            total_earned = total_earned + $1,
            last_transaction = NOW()
        WHERE user_id = $2
        RETURNING *
      `;
      const recipientUpdateResult = await pool.query(recipientUpdateQuery, [amount, toUserId]);
      
      // Burn transaction fees
      if (feeAmount > 0) {
        const burnQuery = `
          INSERT INTO pwr_burning (user_id, amount_burned, burn_reason)
          VALUES ($1, $2, 'transaction_fee')
          RETURNING *
        `;
        const burnResult = await pool.query(burnQuery, ['system', feeAmount]);
        
        // Update burned supply
        const supplyUpdateQuery = `
          UPDATE power_token 
          SET circulating_supply = circulating_supply - $1,
              burned_supply = burned_supply + $1
          RETURNING *
        `;
        await pool.query(supplyUpdateQuery, [feeAmount]);
      }
      
      res.json({ 
        success: true, 
        data: {
          transaction: transactionResult.rows[0],
          senderUpdated: senderUpdateResult.rows[0],
          recipientUpdated: recipientUpdateResult.rows[0]
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== GOVERNANCE OPERATIONS ====================
  
  // Create governance proposal
  router.post('/governance/proposal', async (req: Request, res: Response) => {
    try {
      const { proposerId, title, description, votingPowerRequired, votingPeriod, executionDelay } = req.body;
      
      // Check proposer's governance power
      const governanceQuery = `
        SELECT pwr_governance FROM pwr_holdings WHERE user_id = $1
      `;
      const governanceResult = await pool.query(governanceQuery, [proposerId]);
      
      if (governanceResult.rows.length === 0 || governanceResult.rows[0].pwr_governance <= 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Insufficient governance power to create proposal',
          requiredGovernancePower: 1000,
          currentGovernancePower: governanceResult.rows[0]?.pwr_governance || 0
        });
      }
      
      // Create proposal
      const proposalQuery = `
        INSERT INTO pwr_governance (proposal_id, proposer_id, title, description, voting_power_required, voting_period, execution_delay)
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const proposalResult = await pool.query(proposalQuery, [proposerId, title, description, votingPowerRequired, votingPeriod, executionDelay]);
      
      res.json({ 
        success: true, 
        data: proposalResult.rows[0]
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Vote on governance proposal
  router.post('/governance/vote', async (req: Request, res: Response) => {
    try {
      const { proposalId, voterId, voteDirection } = req.body;
      
      // Check voter's governance power
      const governanceQuery = `
        SELECT pwr_governance FROM pwr_holdings WHERE user_id = $1
      `;
      const governanceResult = await pool.query(governanceQuery, [voterId]);
      
      if (governanceResult.rows.length === 0 || governanceResult.rows[0].pwr_governance <= 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Insufficient governance power to vote',
          currentGovernancePower: governanceResult.rows[0]?.pwr_governance || 0
        });
      }
      
      // Check if proposal is still active
      const proposalQuery = `
        SELECT status FROM pwr_governance WHERE proposal_id = $1
      `;
      const proposalResult = await pool.query(proposalQuery, [proposalId]);
      
      if (proposalResult.rows.length === 0 || proposalResult.rows[0].status !== 'active') {
        return res.status(400).json({ 
          success: false, 
          error: 'Proposal is not active for voting',
          proposalStatus: proposalResult.rows[0]?.status || 'not_found'
        });
      }
      
      // Create vote record
      const voteQuery = `
        INSERT INTO pwr_voting (proposal_id, voter_id, voting_power, vote_direction)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const voteResult = await pool.query(voteQuery, [proposalId, voterId, governanceResult.rows[0].pwr_governance, voteDirection]);
      
      // Update proposal voting power
      const updateQuery = `
        UPDATE pwr_governance 
        SET voting_power_for = voting_power_for + $1,
            voting_power_against = voting_power_against + $2
        WHERE proposal_id = $3
        RETURNING *
      `;
      const updateResult = await pool.query(updateQuery, [
        voteDirection === 'for' ? governanceResult.rows[0].pwr_governance : 0,
        voteDirection === 'against' ? governanceResult.rows[0].pwr_governance : 0,
        proposalId
      ]);
      
      res.json({ 
        success: true, 
        data: {
          vote: voteResult.rows[0],
          updatedProposal: updateResult.rows[0]
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== ANTI-COLLAPSE MECHANISMS ====================
  
  // Get anti-collapse mechanism status
  router.get('/anti-collapse/status', async (req: Request, res: Response) => {
    try {
      const query = `
        SELECT * FROM anti_collapse_mechanisms WHERE is_active = true
      `;
      const result = await pool.query(query);
      
      res.json({ 
        success: true, 
        data: result.rows
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Trigger anti-collapse mechanism
  router.post('/anti-collapse/trigger', async (req: Request, res: Response) => {
    try {
      const { mechanismName, triggerData } = req.body;
      
      // Get mechanism details
      const mechanismQuery = `
        SELECT * FROM anti_collapse_mechanisms WHERE mechanism_name = $1
      `;
      const mechanismResult = await pool.query(mechanismQuery, [mechanismName]);
      
      if (mechanismResult.rows.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: 'Anti-collapse mechanism not found',
          mechanismName
        });
      }
      
      const mechanism = mechanismResult.rows[0];
      
      // Execute mechanism based on type
      let executionResult;
      switch (mechanism.mechanism_type) {
        case 'burning':
          // Execute burning mechanism
          const burnRate = mechanism.activation_parameters?.burn_rate || 0.01;
          const burnQuery = `
            UPDATE power_token 
            SET circulating_supply = circulating_supply * (1 - $1),
                burned_supply = burned_supply + (circulating_supply * $1)
            RETURNING *
          `;
          executionResult = await pool.query(burnQuery, [burnRate]);
          break;
          
        case 'demand_stimulation':
          // Execute demand stimulation (e.g., staking boost)
          const boostMultiplier = mechanism.activation_parameters?.boost_multiplier || 1.5;
          // Implementation would depend on specific stimulation type
          executionResult = { message: `Demand stimulation triggered with ${boostMultiplier}x multiplier` };
          break;
          
        case 'supply_control':
          // Execute supply control
          const controlRate = mechanism.activation_parameters?.control_rate || 0.02;
          executionResult = { message: `Supply control triggered with ${controlRate} control rate` };
          break;
          
        default:
          return res.status(400).json({ 
            success: false, 
            error: 'Unknown anti-collapse mechanism type',
            mechanismType: mechanism.mechanism_type
          });
      }
      
      // Update mechanism activation
      const updateQuery = `
        UPDATE anti_collapse_mechanisms 
        SET is_active = true, last_activated = NOW()
        WHERE mechanism_name = $1
        RETURNING *
      `;
      const updateResult = await pool.query(updateQuery, [mechanismName]);
      
      res.json({ 
        success: true, 
        data: {
          mechanism: updateResult.rows[0],
          executionResult
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== ECONOMICS ANALYTICS ====================
  
  // Get comprehensive economics metrics
  router.get('/economics/metrics', async (req: Request, res: Response) => {
    try {
      const query = `
        SELECT * FROM pwr_economics_metrics 
        ORDER BY metric_date DESC 
        LIMIT 30
      `;
      const result = await pool.query(query);
      
      res.json({ 
        success: true, 
        data: result.rows
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get mining statistics
  router.get('/mining/statistics', async (req: Request, res: Response) => {
    try {
      const query = `
        SELECT * FROM mining_statistics 
        ORDER BY mining_day DESC 
        LIMIT 7
      `;
      const result = await pool.query(query);
      
      res.json({ 
        success: true, 
        data: result.rows
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get staking overview
  router.get('/staking/overview', async (req: Request, res: Response) => {
    try {
      const query = `
        SELECT * FROM staking_overview
      `;
      const result = await pool.query(query);
      
      res.json({ 
        success: true, 
        data: result.rows
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  return router;
}
