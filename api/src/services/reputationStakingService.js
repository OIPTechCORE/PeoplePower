import { v4 as uuidv4 } from 'uuid';

// ===================================
// REVOLUTIONARY REPUTATION STAKING SERVICE
// "STAKE YOUR INFLUENCE, EARN YOUR LEGACY"
// ===================================

export class ReputationStakingService {
    constructor(db, reputationService) {
        this.db = db;
        this.reputationService = reputationService;
    }

    // ===================================
    // CORE STAKING MECHANICS
    // ===================================

    async createStake(playerId, poolId, reputationAmount, lockPeriodDays) {
        // Validate player reputation
        const reputation = await this.reputationService.getPlayerReputationDNA(playerId);
        if (!reputation) {
            throw new Error('Player reputation not found');
        }

        // Get pool details
        const pool = await this.getStakingPool(poolId);
        if (!pool || !pool.is_active) {
            throw new Error('Staking pool not available');
        }

        // Validate staking requirements
        if (reputation.overall_score < pool.min_reputation_score) {
            throw new Error(`Insufficient reputation score. Required: ${pool.min_reputation_score}, Current: ${reputation.overall_score}`);
        }

        if (reputationAmount < pool.min_stake_amount) {
            throw new Error(`Insufficient stake amount. Minimum: ${pool.min_stake_amount}`);
        }

        if (pool.max_stake_amount && reputationAmount > pool.max_stake_amount) {
            throw new Error(`Stake amount exceeds maximum. Maximum: ${pool.max_stake_amount}`);
        }

        if (lockPeriodDays < pool.min_lock_period_days || lockPeriodDays > pool.max_lock_period_days) {
            throw new Error(`Invalid lock period. Must be between ${pool.min_lock_period_days} and ${pool.max_lock_period_days} days`);
        }

        // Calculate stake weight with multipliers
        const stakeWeight = await this.calculateStakeWeight(
            reputationAmount,
            reputation.overall_score,
            pool,
            lockPeriodDays,
            playerId
        );

        // Create the stake
        const stakeQuery = `
            INSERT INTO reputation_stakes 
            (id, player_id, pool_id, reputation_amount_staked, stake_weight, 
             lock_period_days, unlocks_at, reputation_multiplier_applied, 
             community_multiplier_applied, lock_multiplier_applied, special_multiplier_applied)
            VALUES ($1, $2, $3, $4, $5, $6, NOW() + INTERVAL '${lockPeriodDays} days', $7, $8, $9, $10)
            RETURNING *
        `;

        const result = await this.db.query(stakeQuery, [
            uuidv4(),
            playerId,
            poolId,
            reputationAmount,
            stakeWeight.totalWeight,
            lockPeriodDays,
            stakeWeight.reputationMultiplier,
            stakeWeight.communityMultiplier,
            stakeWeight.lockMultiplier,
            stakeWeight.specialMultiplier
        ]);

        const stake = result.rows[0];

        // Check for achievements
        await this.checkStakingAchievements(playerId, stake);

        // Create initial reward calculation
        await this.calculateRewards(stake.id);

        return stake;
    }

    async calculateStakeWeight(reputationAmount, playerScore, pool, lockPeriodDays, playerId) {
        // Base reputation multiplier
        const reputationMultiplier = 1 + (playerScore / 100) * pool.reputation_multiplier;

        // Community bonus
        const communityMultiplier = await this.calculateCommunityBonus(playerId, pool);

        // Lock period bonus
        const lockMultiplier = 1 + ((lockPeriodDays - pool.min_lock_period_days) / 
            (pool.max_lock_period_days - pool.min_lock_period_days)) * (pool.lock_bonus_multiplier - 1);

        // Special multipliers (Genesis players, long-term reputation, etc.)
        const specialMultiplier = await this.calculateSpecialMultiplier(playerId, pool);

        // Total weight calculation
        const totalWeight = reputationAmount * reputationMultiplier * communityMultiplier * lockMultiplier * specialMultiplier;

        return {
            totalWeight,
            reputationMultiplier,
            communityMultiplier,
            lockMultiplier,
            specialMultiplier
        };
    }

    async calculateCommunityBonus(playerId, pool) {
        // Get player's community
        const playerQuery = 'SELECT community_id FROM players WHERE id = $1';
        const playerResult = await this.db.query(playerQuery, [playerId]);
        const player = playerResult.rows[0];

        if (!player.community_id) {
            return 1.0; // No community bonus
        }

        // Check if community has a staking pool
        const communityPoolQuery = `
            SELECT community_bonus_apr, member_activity_multiplier 
            FROM community_staking_pools 
            WHERE community_id = $1 AND base_pool_id = $2 AND is_active = true
        `;
        const communityPoolResult = await this.db.query(communityPoolQuery, [player.community_id, pool.id]);

        if (communityPoolResult.rows.length === 0) {
            return 1.0;
        }

        const communityPool = communityPoolResult.rows[0];
        
        // Calculate member activity bonus
        const activityBonus = await this.calculateMemberActivityBonus(playerId, player.community_id);
        
        return 1 + (communityPool.community_bonus_apr + activityBonus) / 100;
    }

    async calculateMemberActivityBonus(playerId, communityId) {
        // Calculate member's contribution to community
        const activityQuery = `
            SELECT contribution, weekly_activity 
            FROM community_members 
            WHERE player_id = $1 AND community_id = $2
        `;
        const activityResult = await this.db.query(activityQuery, [playerId, communityId]);
        
        if (activityResult.rows.length === 0) {
            return 0;
        }

        const member = activityResult.rows[0];
        
        // Activity bonus based on contribution and weekly activity
        const contributionScore = Math.min(member.contribution / 1000, 1); // Cap at 1000 contribution
        const activityScore = Math.min(member.weekly_activity / 50, 1); // Cap at 50 weekly activities
        
        return (contributionScore + activityScore) * 0.02; // Max 4% bonus
    }

    async calculateSpecialMultiplier(playerId, pool) {
        let multiplier = 1.0;

        // Genesis player bonus
        const playerQuery = 'SELECT generation, permanent_bonus FROM players WHERE id = $1';
        const playerResult = await this.db.query(playerQuery, [playerId]);
        const player = playerResult.rows[0];

        if (player.generation === 'FOUNDER') {
            multiplier += 0.4; // 40% bonus for founders
        } else if (player.generation === 'BUILDER') {
            multiplier += 0.2; // 20% bonus for builders
        }

        // Long-term reputation bonus
        const reputationHistoryQuery = `
            SELECT COUNT(*) as transaction_count, 
                   AVG(reputation_change) as avg_change
            FROM reputation_transactions 
            WHERE player_id = $1 
            AND transaction_date > NOW() - INTERVAL '90 days'
        `;
        const historyResult = await this.db.query(reputationHistoryQuery, [playerId]);
        const history = historyResult.rows[0];

        if (history.transaction_count > 50) {
            multiplier += 0.1; // 10% bonus for active reputation builders
        }

        // Integrity bonus (high trust score)
        const integrityQuery = `
            SELECT integrity_dna->>'trust_score' as trust_score
            FROM reputation_dna 
            WHERE player_id = $1
        `;
        const integrityResult = await this.db.query(integrityQuery, [playerId]);
        
        if (integrityResult.rows.length > 0) {
            const trustScore = parseFloat(integrityResult.rows[0].trust_score);
            if (trustScore >= 90) {
                multiplier += 0.15; // 15% bonus for high integrity
            }
        }

        return multiplier;
    }

    // ===================================
    // REWARD CALCULATION ENGINE
    // ===================================

    async calculateRewards(stakeId) {
        const stakeQuery = `
            SELECT rs.*, rsp.base_apr, rsp.community_bonus_apr, rsp.pool_type,
                   p.permanent_bonus
            FROM reputation_stakes rs
            JOIN reputation_staking_pools rsp ON rs.pool_id = rsp.id
            JOIN players p ON rs.player_id = p.id
            WHERE rs.id = $1 AND rs.is_active = true
        `;
        const stakeResult = await this.db.query(stakeQuery, [stakeId]);
        
        if (stakeResult.rows.length === 0) {
            throw new Error('Active stake not found');
        }

        const stake = stakeResult.rows[0];
        
        // Calculate time since last reward
        const timeDiff = new Date() - new Date(stake.last_reward_calculation);
        const daysPassed = timeDiff / (1000 * 60 * 60 * 24);

        if (daysPassed < 1) {
            return; // Less than 1 day, no rewards yet
        }

        // Calculate effective APR
        const effectiveAPR = this.calculateEffectiveAPR(stake);

        // Calculate rewards for the period
        const dailyReward = (stake.stake_weight * effectiveAPR) / 365;
        const periodReward = dailyReward * daysPassed;

        // Break down reward components
        const rewardBreakdown = this.calculateRewardBreakdown(stake, periodReward, daysPassed);

        // Create reward record
        const rewardQuery = `
            INSERT INTO staking_rewards 
            (id, stake_id, reward_type, reward_amount, reward_rate_apr,
             base_reward, reputation_bonus, community_bonus, lock_bonus, special_bonus,
             reward_period_start, reward_period_end)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *
        `;

        const rewardResult = await this.db.query(rewardQuery, [
            uuidv4(),
            stakeId,
            this.getRewardType(stake.pool_type),
            periodReward,
            effectiveAPR,
            rewardBreakdown.base,
            rewardBreakdown.reputation,
            rewardBreakdown.community,
            rewardBreakdown.lock,
            rewardBreakdown.special,
            stake.last_reward_calculation,
            new Date()
        ]);

        // Update stake's last calculation time
        await this.db.query(
            'UPDATE reputation_stakes SET last_reward_calculation = NOW() WHERE id = $1',
            [stakeId]
        );

        // Update governance power
        await this.updateGovernancePower(stake.player_id, periodReward);

        return rewardResult.rows[0];
    }

    calculateEffectiveAPR(stake) {
        let apr = stake.base_apr;

        // Add community bonus
        apr += stake.community_bonus_apr;

        // Add player permanent bonus
        apr += stake.permanent_bonus;

        // Pool type bonuses
        switch (stake.pool_type) {
            case 'knowledge':
                apr += 0.02; // +2% for knowledge staking
                break;
            case 'integrity':
                apr += 0.03; // +3% for integrity staking
                break;
            case 'legacy':
                apr += 0.05; // +5% for legacy staking
                break;
        }

        return apr;
    }

    calculateRewardBreakdown(stake, totalReward, daysPassed) {
        const dailyBaseRate = stake.base_apr / 365;
        const baseReward = stake.stake_weight * dailyBaseRate * daysPassed;
        
        const reputationBonus = totalReward * (stake.reputation_multiplier_applied - 1);
        const communityBonus = totalReward * (stake.community_multiplier_applied - 1);
        const lockBonus = totalReward * (stake.lock_multiplier_applied - 1);
        const specialBonus = totalReward * (stake.special_multiplier_applied - 1);

        return {
            base: baseReward,
            reputation: reputationBonus,
            community: communityBonus,
            lock: lockBonus,
            special: specialBonus
        };
    }

    getRewardType(poolType) {
        switch (poolType) {
            case 'knowledge':
                return 'education';
            case 'governance':
                return 'governance';
            case 'legacy':
            case 'integrity':
                return 'exclusive';
            default:
                return 'reputation';
        }
    }

    // ===================================
    // GOVERNANCE POWER INTEGRATION
    // ===================================

    async updateGovernancePower(playerId, additionalPower) {
        const governanceQuery = `
            INSERT INTO governance_power 
            (id, player_id, staked_reputation_power, total_governance_power, voting_weight_tier)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (player_id) 
            DO UPDATE SET
                staked_reputation_power = governance_power.staked_reputation_power + $3,
                total_governance_power = governance_power.total_governance_power + $3,
                voting_weight_tier = $5,
                last_calculated = NOW()
            RETURNING *
        `;

        const votingTier = this.calculateVotingTier(additionalPower);
        
        const result = await this.db.query(governanceQuery, [
            uuidv4(),
            playerId,
            additionalPower,
            additionalPower,
            votingTier
        ]);

        return result.rows[0];
    }

    calculateVotingTier(power) {
        if (power >= 10000) return 'supreme';
        if (power >= 5000) return 'premium';
        if (power >= 1000) return 'enhanced';
        return 'basic';
    }

    // ===================================
    // AI YIELD OPTIMIZATION
    // ===================================

    async generateYieldOptimization(playerId) {
        // Get current staking portfolio
        const currentPortfolio = await this.getPlayerStakingPortfolio(playerId);
        
        if (currentPortfolio.length === 0) {
            throw new Error('No active stakes found for optimization');
        }

        // Get available pools
        const availablePools = await this.getAvailableStakingPools(playerId);

        // AI optimization algorithm
        const optimization = await this.calculateOptimalPortfolio(currentPortfolio, availablePools, playerId);

        // Save optimization suggestion
        const suggestionQuery = `
            INSERT INTO yield_optimization_suggestions 
            (id, player_id, current_portfolio, optimal_portfolio, expected_apr_improvement,
             recommendations, risk_assessment, confidence_score, expires_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW() + INTERVAL '7 days')
            RETURNING *
        `;

        const result = await this.db.query(suggestionQuery, [
            uuidv4(),
            playerId,
            JSON.stringify(currentPortfolio),
            JSON.stringify(optimization.optimalPortfolio),
            optimization.expectedImprovement,
            JSON.stringify(optimization.recommendations),
            optimization.riskAssessment,
            optimization.confidenceScore
        ]);

        return result.rows[0];
    }

    async calculateOptimalPortfolio(currentPortfolio, availablePools, playerId) {
        // This is a simplified AI optimization - in production, use machine learning
        const reputation = await this.reputationService.getPlayerReputationDNA(playerId);
        
        // Calculate current APR
        const currentAPR = this.calculatePortfolioAPR(currentPortfolio);

        // Generate optimal allocation
        const optimalAllocation = this.generateOptimalAllocation(availablePools, reputation.overall_score);

        // Calculate expected improvement
        const optimalAPR = this.calculatePortfolioAPR(optimalAllocation);
        const improvement = ((optimalAPR - currentAPR) / currentAPR) * 100;

        // Generate recommendations
        const recommendations = this.generateRecommendations(currentPortfolio, optimalAllocation);

        return {
            optimalPortfolio: optimalAllocation,
            expectedImprovement: improvement,
            recommendations: recommendations,
            riskAssessment: this.assessRisk(optimalAllocation),
            confidenceScore: this.calculateConfidence(improvement, reputation.overall_score)
        };
    }

    generateOptimalAllocation(pools, reputationScore) {
        // Simplified optimization - balance high APR with stability
        return pools
            .filter(pool => pool.min_reputation_score <= reputationScore)
            .sort((a, b) => (b.base_apr + b.community_bonus_apr) - (a.base_apr + a.community_bonus_apr))
            .slice(0, 5) // Top 5 pools
            .map(pool => ({
                poolId: pool.id,
                poolType: pool.pool_type,
                recommendedAmount: pool.max_stake_amount || pool.min_stake_amount * 2,
                recommendedLockPeriod: Math.floor((pool.min_lock_period_days + pool.max_lock_period_days) / 2),
                expectedAPR: pool.base_apr + pool.community_bonus_apr
            }));
    }

    calculatePortfolioAPR(portfolio) {
        if (portfolio.length === 0) return 0;
        
        const totalWeight = portfolio.reduce((sum, item) => sum + (item.stake_weight || item.expectedAPR), 0);
        const weightedAPR = portfolio.reduce((sum, item) => {
            const apr = item.expectedAPR || (item.base_apr + item.community_bonus_apr);
            const weight = item.stake_weight || 1;
            return sum + (apr * weight);
        }, 0);
        
        return totalWeight > 0 ? weightedAPR / totalWeight : 0;
    }

    generateRecommendations(current, optimal) {
        const recommendations = [];

        // Find underperforming stakes
        current.forEach(stake => {
            const optimalMatch = optimal.find(opt => opt.poolId === stake.pool_id);
            if (optimalMatch && optimalMatch.expectedAPR > (stake.base_apr + stake.community_bonus_apr)) {
                recommendations.push({
                    type: 'increase_stake',
                    poolId: stake.pool_id,
                    poolType: stake.pool_type,
                    reason: `Higher APR available (${optimalMatch.expectedAPR.toFixed(2)}% vs current)`,
                    action: `Increase stake in ${stake.pool_type} pool`
                });
            }
        });

        // Find new opportunities
        optimal.forEach(opt => {
            const currentMatch = current.find(cur => cur.pool_id === opt.poolId);
            if (!currentMatch) {
                recommendations.push({
                    type: 'new_stake',
                    poolId: opt.poolId,
                    poolType: opt.poolType,
                    reason: `New high-APR opportunity (${opt.expectedAPR.toFixed(2)}%)`,
                    action: `Create new stake in ${opt.poolType} pool`
                });
            }
        });

        return recommendations;
    }

    assessRisk(portfolio) {
        // Simplified risk assessment
        const highRiskPools = portfolio.filter(p => p.pool_type === 'legacy' || p.pool_type === 'governance').length;
        const totalPools = portfolio.length;

        if (highRiskPools / totalPools > 0.5) return 'high';
        if (highRiskPools / totalPools > 0.25) return 'medium';
        return 'low';
    }

    calculateConfidence(improvement, reputationScore) {
        // Higher confidence for bigger improvements and higher reputation
        const improvementConfidence = Math.min(improvement / 10, 1); // Cap at 10% improvement
        const reputationConfidence = reputationScore / 100;
        
        return (improvementConfidence + reputationConfidence) / 2;
    }

    // ===================================
    // EDUCATION ACCESS BRIDGE
    // ===================================

    async grantEducationAccess(playerId, courseId, stakeId) {
        const stake = await this.getStake(stakeId);
        if (!stake || stake.player_id !== playerId) {
            throw new Error('Invalid stake for education access');
        }

        // Determine access level based on stake
        const accessLevel = this.calculateEducationAccessLevel(stake);

        // Calculate access duration
        const accessDuration = this.calculateEducationAccessDuration(stake);

        const accessQuery = `
            INSERT INTO education_staking_access 
            (id, player_id, course_id, stake_id, access_level, access_granted_at, access_expires_at,
             reputation_required, stake_duration_required, pool_type_required)
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW() + INTERVAL '${accessDuration} days', $6, $7, $8)
            RETURNING *
        `;

        const result = await this.db.query(accessQuery, [
            uuidv4(),
            playerId,
            courseId,
            stakeId,
            accessLevel,
            stake.reputation_amount_staked,
            stake.lock_period_days,
            stake.pool_type
        ]);

        return result.rows[0];
    }

    calculateEducationAccessLevel(stake) {
        if (stake.pool_type === 'knowledge' && stake.reputation_amount_staked >= 50) return 'master';
        if (stake.pool_type === 'knowledge' && stake.reputation_amount_staked >= 25) return 'exclusive';
        if (stake.reputation_amount_staked >= 20) return 'premium';
        return 'basic';
    }

    calculateEducationAccessDuration(stake) {
        // Longer stakes = longer access
        return Math.min(stake.lock_period_days * 2, 365); // Max 1 year
    }

    // ===================================
    // UTILITY METHODS
    // ===================================

    async getStakingPool(poolId) {
        const query = 'SELECT * FROM reputation_staking_pools WHERE id = $1';
        const result = await this.db.query(query, [poolId]);
        return result.rows[0];
    }

    async getAvailableStakingPools(playerId) {
        const reputation = await this.reputationService.getPlayerReputationDNA(playerId);
        
        const query = `
            SELECT * FROM reputation_staking_pools 
            WHERE is_active = true 
            AND min_reputation_score <= $1
            ORDER BY (base_apr + community_bonus_apr) DESC
        `;
        
        const result = await this.db.query(query, [reputation.overall_score]);
        return result.rows;
    }

    async getPlayerStakingPortfolio(playerId) {
        const query = `
            SELECT rs.*, rsp.base_apr, rsp.community_bonus_apr, rsp.pool_type
            FROM reputation_stakes rs
            JOIN reputation_staking_pools rsp ON rs.pool_id = rsp.id
            WHERE rs.player_id = $1 AND rs.is_active = true
            ORDER BY rs.stake_weight DESC
        `;
        
        const result = await this.db.query(query, [playerId]);
        return result.rows;
    }

    async getStake(stakeId) {
        const query = `
            SELECT rs.*, rsp.base_apr, rsp.community_bonus_apr, rsp.pool_type
            FROM reputation_stakes rs
            JOIN reputation_staking_pools rsp ON rs.pool_id = rsp.id
            WHERE rs.id = $1
        `;
        
        const result = await this.db.query(query, [stakeId]);
        return result.rows[0];
    }

    async checkStakingAchievements(playerId, stake) {
        // First stake achievement
        const stakeCountQuery = 'SELECT COUNT(*) as count FROM reputation_stakes WHERE player_id = $1';
        const stakeCountResult = await this.db.query(stakeCountQuery, [playerId]);
        const stakeCount = parseInt(stakeCountResult.rows[0].count);

        if (stakeCount === 1) {
            await this.grantAchievement(playerId, 'first_stake', 'First Stake', 'Made your first reputation stake', 'common');
        }

        // High staker achievement
        if (stake.reputation_amount_staked >= 100) {
            await this.grantAchievement(playerId, 'high_staker', 'High Staker', 'Staked 100+ reputation points', 'rare');
        }

        // Long-term staker
        if (stake.lock_period_days >= 180) {
            await this.grantAchievement(playerId, 'long_term_staker', 'Long Term Staker', 'Staked for 6+ months', 'epic');
        }
    }

    async grantAchievement(playerId, type, name, description, rarity) {
        const query = `
            INSERT INTO staking_achievements 
            (id, player_id, achievement_type, achievement_name, achievement_description, rarity)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (player_id, achievement_type, achievement_name) 
            DO NOTHING
            RETURNING *
        `;

        const result = await this.db.query(query, [uuidv4(), playerId, type, name, description, rarity]);
        return result.rows[0];
    }

    async getPlayerStakingStats(playerId) {
        const query = `
            SELECT 
                COUNT(DISTINCT rs.id) as total_stakes,
                COALESCE(SUM(rs.reputation_amount_staked), 0) as total_reputation_staked,
                COALESCE(SUM(rs.stake_weight), 0) as total_stake_weight,
                COALESCE(SUM(sreward.reward_amount), 0) as total_rewards_earned,
                COUNT(DISTINCT CASE WHEN rs.is_active THEN rs.id END) as active_stakes,
                gp.total_governance_power,
                gp.voting_weight_tier,
                COUNT(DISTINCT sa.id) as education_access_granted
            FROM reputation_stakes rs
            LEFT JOIN staking_rewards sreward ON rs.id = sreward.stake_id
            LEFT JOIN governance_power gp ON rs.player_id = gp.player_id
            LEFT JOIN education_staking_access sa ON rs.player_id = sa.player_id AND sa.is_active = true
            WHERE rs.player_id = $1
        `;

        const result = await this.db.query(query, [playerId]);
        return result.rows[0];
    }
}
