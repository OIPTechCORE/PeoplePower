import express from 'express';
import { ReputationStakingService } from '../services/reputationStakingService.js';

const router = express.Router();

// ===================================
// REPUTATION STAKING API ENDPOINTS
// "STAKE YOUR INFLUENCE, EARN YOUR LEGACY"
// ===================================

// GET /api/staking/pools - Get available staking pools
router.get('/pools', async (req, res) => {
    try {
        const { playerId } = req.query;
        
        if (!playerId) {
            return res.status(400).json({ error: 'Player ID required' });
        }

        const stakingService = new ReputationStakingService(req.db, req.reputationService);
        const pools = await stakingService.getAvailableStakingPools(playerId);
        
        res.json({
            success: true,
            data: {
                pools: pools.map(pool => ({
                    id: pool.id,
                    name: pool.pool_name,
                    type: pool.pool_type,
                    baseAPR: pool.base_apr,
                    communityBonusAPR: pool.community_bonus_apr,
                    totalAPR: pool.base_apr + pool.community_bonus_apr,
                    minReputation: pool.min_reputation_score,
                    minStake: pool.min_stake_amount,
                    maxStake: pool.max_stake_amount,
                    lockPeriodRange: {
                        min: pool.min_lock_period_days,
                        max: pool.max_lock_period_days
                    },
                    governanceEnabled: pool.governance_power_enabled,
                    missionAccessLevel: pool.mission_access_level,
                    totalStaked: pool.total_staked_reputation,
                    totalStakers: pool.total_stakers
                }))
            }
        });
    } catch (error) {
        console.error('Error fetching staking pools:', error);
        res.status(500).json({ error: 'Failed to fetch staking pools' });
    }
});

// POST /api/staking/create - Create new reputation stake
router.post('/create', async (req, res) => {
    try {
        const { playerId, poolId, reputationAmount, lockPeriodDays } = req.body;
        
        if (!playerId || !poolId || !reputationAmount || !lockPeriodDays) {
            return res.status(400).json({ 
                error: 'Missing required fields: playerId, poolId, reputationAmount, lockPeriodDays' 
            });
        }

        const stakingService = new ReputationStakingService(req.db, req.reputationService);
        const stake = await stakingService.createStake(playerId, poolId, reputationAmount, lockPeriodDays);
        
        res.json({
            success: true,
            data: {
                stake: {
                    id: stake.id,
                    poolId: stake.pool_id,
                    reputationAmount: stake.reputation_amount_staked,
                    stakeWeight: stake.stake_weight,
                    lockPeriodDays: stake.lock_period_days,
                    unlocksAt: stake.unlocks_at,
                    multipliers: {
                        reputation: stake.reputation_multiplier_applied,
                        community: stake.community_multiplier_applied,
                        lock: stake.lock_multiplier_applied,
                        special: stake.special_multiplier_applied
                    },
                    governancePower: stake.governance_power_generated,
                    isActive: stake.is_active
                }
            }
        });
    } catch (error) {
        console.error('Error creating stake:', error);
        res.status(400).json({ error: error.message });
    }
});

// GET /api/staking/portfolio/:playerId - Get player's staking portfolio
router.get('/portfolio/:playerId', async (req, res) => {
    try {
        const { playerId } = req.params;
        
        const stakingService = new ReputationStakingService(req.db, req.reputationService);
        const portfolio = await stakingService.getPlayerStakingPortfolio(playerId);
        const stats = await stakingService.getPlayerStakingStats(playerId);
        
        res.json({
            success: true,
            data: {
                portfolio: portfolio.map(stake => ({
                    id: stake.id,
                    poolId: stake.pool_id,
                    poolType: stake.pool_type,
                    reputationAmount: stake.reputation_amount_staked,
                    stakeWeight: stake.stake_weight,
                    lockPeriodDays: stake.lock_period_days,
                    stakedAt: stake.staked_at,
                    unlocksAt: stake.unlocks_at,
                    multipliers: {
                        reputation: stake.reputation_multiplier_applied,
                        community: stake.community_multiplier_applied,
                        lock: stake.lock_multiplier_applied,
                        special: stake.special_multiplier_applied
                    },
                    apr: stake.base_apr + stake.community_bonus_apr,
                    isActive: stake.is_active,
                    governancePower: stake.governance_power_generated
                })),
                stats: {
                    totalStakes: parseInt(stats.total_stakes),
                    totalReputationStaked: parseFloat(stats.total_reputation_staked),
                    totalStakeWeight: parseFloat(stats.total_stake_weight),
                    totalRewardsEarned: parseFloat(stats.total_rewards_earned),
                    activeStakes: parseInt(stats.active_stakes),
                    governancePower: parseFloat(stats.total_governance_power),
                    votingTier: stats.voting_weight_tier,
                    educationAccessGranted: parseInt(stats.education_access_granted)
                }
            }
        });
    } catch (error) {
        console.error('Error fetching portfolio:', error);
        res.status(500).json({ error: 'Failed to fetch staking portfolio' });
    }
});

// GET /api/staking/rewards/:stakeId - Get rewards for specific stake
router.get('/rewards/:stakeId', async (req, res) => {
    try {
        const { stakeId } = req.params;
        
        const query = `
            SELECT * FROM staking_rewards 
            WHERE stake_id = $1 
            ORDER BY calculated_at DESC
        `;
        
        const result = await req.db.query(query, [stakeId]);
        
        res.json({
            success: true,
            data: {
                rewards: result.rows.map(reward => ({
                    id: reward.id,
                    type: reward.reward_type,
                    amount: parseFloat(reward.reward_amount),
                    apr: parseFloat(reward.reward_rate_apr),
                    breakdown: {
                        base: parseFloat(reward.base_reward),
                        reputation: parseFloat(reward.reputation_bonus),
                        community: parseFloat(reward.community_bonus),
                        lock: parseFloat(reward.lock_bonus),
                        special: parseFloat(reward.special_bonus)
                    },
                    period: {
                        start: reward.reward_period_start,
                        end: reward.reward_period_end
                    },
                    isClaimed: reward.is_claimed,
                    claimedAt: reward.claimed_at,
                    autoCompounded: reward.auto_compounded
                }))
            }
        });
    } catch (error) {
        console.error('Error fetching rewards:', error);
        res.status(500).json({ error: 'Failed to fetch rewards' });
    }
});

// POST /api/staking/claim/:rewardId - Claim staking reward
router.post('/claim/:rewardId', async (req, res) => {
    try {
        const { rewardId } = req.params;
        const { playerId } = req.body;
        
        if (!playerId) {
            return res.status(400).json({ error: 'Player ID required' });
        }

        // Update reward as claimed
        const query = `
            UPDATE staking_rewards 
            SET is_claimed = true, claimed_at = NOW() 
            WHERE id = $1 AND is_claimed = false
            RETURNING *
        `;
        
        const result = await req.db.query(query, [rewardId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Reward not found or already claimed' });
        }

        const reward = result.rows[0];
        
        // Add reward to player's reputation or tokens based on type
        if (reward.reward_type === 'reputation') {
            await req.reputationService.addReputationTransaction(
                playerId,
                'staking_reward',
                Math.floor(reward.reward_amount),
                'builder',
                'Reputation staking reward claimed',
                reward.id
            );
        } else if (reward.reward_type === 'tokens') {
            // Add PWR tokens to player
            await req.db.query(
                'UPDATE players SET power_tokens = power_tokens + $1 WHERE id = $2',
                [Math.floor(reward.reward_amount * 10), playerId] // Convert reputation to tokens
            );
        }
        
        res.json({
            success: true,
            data: {
                claimed: {
                    id: reward.id,
                    type: reward.reward_type,
                    amount: parseFloat(reward.reward_amount),
                    claimedAt: reward.claimed_at
                }
            }
        });
    } catch (error) {
        console.error('Error claiming reward:', error);
        res.status(500).json({ error: 'Failed to claim reward' });
    }
});

// POST /api/staking/optimize - Generate AI yield optimization
router.post('/optimize', async (req, res) => {
    try {
        const { playerId } = req.body;
        
        if (!playerId) {
            return res.status(400).json({ error: 'Player ID required' });
        }

        const stakingService = new ReputationStakingService(req.db, req.reputationService);
        const optimization = await stakingService.generateYieldOptimization(playerId);
        
        res.json({
            success: true,
            data: {
                optimization: {
                    id: optimization.id,
                    currentPortfolio: JSON.parse(optimization.current_portfolio),
                    optimalPortfolio: JSON.parse(optimization.optimal_portfolio),
                    expectedAPRImprovement: parseFloat(optimization.expected_apr_improvement),
                    recommendations: JSON.parse(optimization.recommendations),
                    riskAssessment: optimization.risk_assessment,
                    confidenceScore: parseFloat(optimization.confidence_score),
                    expiresAt: optimization.expires_at
                }
            }
        });
    } catch (error) {
        console.error('Error generating optimization:', error);
        res.status(500).json({ error: 'Failed to generate yield optimization' });
    }
});

// POST /api/staking/education/grant - Grant education access through staking
router.post('/education/grant', async (req, res) => {
    try {
        const { playerId, courseId, stakeId } = req.body;
        
        if (!playerId || !courseId || !stakeId) {
            return res.status(400).json({ 
                error: 'Missing required fields: playerId, courseId, stakeId' 
            });
        }

        const stakingService = new ReputationStakingService(req.db, req.reputationService);
        const access = await stakingService.grantEducationAccess(playerId, courseId, stakeId);
        
        res.json({
            success: true,
            data: {
                access: {
                    id: access.id,
                    courseId: access.course_id,
                    accessLevel: access.access_level,
                    grantedAt: access.access_granted_at,
                    expiresAt: access.access_expires_at,
                    requirements: {
                        reputationRequired: parseFloat(access.reputation_required),
                        stakeDurationRequired: access.stake_duration_required,
                        poolTypeRequired: access.pool_type_required
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error granting education access:', error);
        res.status(500).json({ error: 'Failed to grant education access' });
    }
});

// GET /api/staking/education/:playerId - Get player's education access
router.get('/education/:playerId', async (req, res) => {
    try {
        const { playerId } = req.params;
        
        const query = `
            SELECT esa.*, rsp.pool_type, rs.reputation_amount_staked, rs.lock_period_days
            FROM education_staking_access esa
            JOIN reputation_stakes rs ON esa.stake_id = rs.id
            JOIN reputation_staking_pools rsp ON rs.pool_id = rsp.id
            WHERE esa.player_id = $1 AND esa.is_active = true
            ORDER BY esa.access_granted_at DESC
        `;
        
        const result = await req.db.query(query, [playerId]);
        
        res.json({
            success: true,
            data: {
                educationAccess: result.rows.map(access => ({
                    id: access.id,
                    courseId: access.course_id,
                    accessLevel: access.access_level,
                    grantedAt: access.access_granted_at,
                    expiresAt: access.access_expires_at,
                    stakeInfo: {
                        poolType: access.pool_type,
                        reputationAmount: parseFloat(access.reputation_amount_staked),
                        lockPeriodDays: access.stake_duration_required
                    },
                    requirements: {
                        reputationRequired: parseFloat(access.reputation_required),
                        stakeDurationRequired: access.stake_duration_required,
                        poolTypeRequired: access.pool_type_required
                    }
                }))
            }
        });
    } catch (error) {
        console.error('Error fetching education access:', error);
        res.status(500).json({ error: 'Failed to fetch education access' });
    }
});

// GET /api/staking/governance/:playerId - Get governance power
router.get('/governance/:playerId', async (req, res) => {
    try {
        const { playerId } = req.params;
        
        const query = `
            SELECT gp.*, 
                   COUNT(DISTINCT rs.id) as active_stakes,
                   COALESCE(SUM(rs.stake_weight), 0) as total_staked_weight
            FROM governance_power gp
            LEFT JOIN reputation_stakes rs ON gp.player_id = rs.player_id AND rs.is_active = true
            WHERE gp.player_id = $1
            GROUP BY gp.id
        `;
        
        const result = await req.db.query(query, [playerId]);
        
        if (result.rows.length === 0) {
            return res.json({
                success: true,
                data: { governancePower: null }
            });
        }
        
        const governance = result.rows[0];
        
        res.json({
            success: true,
            data: {
                governancePower: {
                    playerId: playerId,
                    stakedReputationPower: parseFloat(governance.staked_reputation_power),
                    communityLeadershipBonus: parseFloat(governance.community_leadership_bonus),
                    integrityVoterBonus: parseFloat(governance.integrity_voter_bonus),
                    longTermStakerBonus: parseFloat(governance.long_term_staker_bonus),
                    totalGovernancePower: parseFloat(governance.total_governance_power),
                    votingWeightTier: governance.voting_weight_tier,
                    votingStats: {
                        proposalsVoted: governance.proposals_voted,
                        proposalsCreated: governance.proposals_created,
                        votingAlignmentScore: parseFloat(governance.voting_alignment_score)
                    },
                    stakeStats: {
                        activeStakes: parseInt(governance.active_stakes),
                        totalStakedWeight: parseFloat(governance.total_staked_weight)
                    },
                    lastCalculated: governance.last_calculated
                }
            }
        });
    } catch (error) {
        console.error('Error fetching governance power:', error);
        res.status(500).json({ error: 'Failed to fetch governance power' });
    }
});

// GET /api/staking/achievements/:playerId - Get staking achievements
router.get('/achievements/:playerId', async (req, res) => {
    try {
        const { playerId } = req.params;
        
        const query = `
            SELECT * FROM staking_achievements 
            WHERE player_id = $1 
            ORDER BY earned_at DESC
        `;
        
        const result = await req.db.query(query, [playerId]);
        
        res.json({
            success: true,
            data: {
                achievements: result.rows.map(achievement => ({
                    id: achievement.id,
                    type: achievement.achievement_type,
                    name: achievement.achievement_name,
                    description: achievement.achievement_description,
                    rarity: achievement.rarity,
                    iconUrl: achievement.icon_url,
                    badgeColor: achievement.badge_color,
                    earnedAt: achievement.earned_at,
                    isDisplayed: achievement.is_displayed
                }))
            }
        });
    } catch (error) {
        console.error('Error fetching achievements:', error);
        res.status(500).json({ error: 'Failed to fetch achievements' });
    }
});

// POST /api/staking/compound/:stakeId - Compound rewards (auto-reinvest)
router.post('/compound/:stakeId', async (req, res) => {
    try {
        const { stakeId } = req.params;
        const { playerId } = req.body;
        
        if (!playerId) {
            return res.status(400).json({ error: 'Player ID required' });
        }

        // Get stake details
        const stakeQuery = `
            SELECT rs.*, rsp.pool_type
            FROM reputation_stakes rs
            JOIN reputation_staking_pools rsp ON rs.pool_id = rsp.id
            WHERE rs.id = $1 AND rs.player_id = $2 AND rs.is_active = true
        `;
        
        const stakeResult = await req.db.query(stakeQuery, [stakeId, playerId]);
        
        if (stakeResult.rows.length === 0) {
            return res.status(404).json({ error: 'Stake not found or not active' });
        }

        const stake = stakeResult.rows[0];

        // Get unclaimed rewards
        const rewardsQuery = `
            SELECT COALESCE(SUM(reward_amount), 0) as total_unclaimed
            FROM staking_rewards 
            WHERE stake_id = $1 AND is_claimed = false AND reward_type = 'reputation'
        `;
        
        const rewardsResult = await req.db.query(rewardsQuery, [stakeId]);
        const unclaimedRewards = parseFloat(rewardsResult.rows[0].total_unclaimed);

        if (unclaimedRewards < 1) {
            return res.status(400).json({ error: 'Insufficient rewards to compound' });
        }

        // Mark rewards as compounded
        await req.db.query(
            'UPDATE staking_rewards SET auto_compounded = true WHERE stake_id = $1 AND is_claimed = false',
            [stakeId]
        );

        // Add compounded amount to stake
        await req.db.query(
            'UPDATE reputation_stakes SET reputation_amount_staked = reputation_amount_staked + $1 WHERE id = $2',
            [unclaimedRewards, stakeId]
        );

        // Recalculate stake weight
        const stakingService = new ReputationStakingService(req.db, req.reputationService);
        const newWeight = await stakingService.calculateStakeWeight(
            stake.reputation_amount_staked + unclaimedRewards,
            0, // Will be recalculated
            { pool_type: stake.pool_type },
            stake.lock_period_days,
            playerId
        );

        await req.db.query(
            'UPDATE reputation_stakes SET stake_weight = $1 WHERE id = $2',
            [newWeight.totalWeight, stakeId]
        );
        
        res.json({
            success: true,
            data: {
                compounded: {
                    stakeId: stakeId,
                    amountCompounded: unclaimedRewards,
                    newStakeAmount: stake.reputation_amount_staked + unclaimedRewards,
                    newStakeWeight: newWeight.totalWeight
                }
            }
        });
    } catch (error) {
        console.error('Error compounding rewards:', error);
        res.status(500).json({ error: 'Failed to compound rewards' });
    }
});

export default router;
