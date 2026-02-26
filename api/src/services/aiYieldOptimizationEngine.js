import { v4 as uuidv4 } from 'uuid';

// ===================================
// AI-POWERED YIELD OPTIMIZATION ENGINE
// "MAXIMIZE YOUR LEGACY, MINIMIZE YOUR RISK"
// ===================================

export class AIYieldOptimizationEngine {
    constructor(db, reputationService, stakingService) {
        this.db = db;
        this.reputationService = reputationService;
        this.stakingService = stakingService;
        
        // ML Model weights (simplified for production - replace with actual ML models)
        this.modelWeights = {
            reputationScore: 0.25,
            historicalPerformance: 0.20,
            communityActivity: 0.15,
            marketConditions: 0.15,
            riskTolerance: 0.15,
            timeHorizon: 0.10
        };
    }

    // ===================================
    // ADVANCED PORTFOLIO OPTIMIZATION
    // ===================================

    async generateAdvancedOptimization(playerId, options = {}) {
        const {
            riskTolerance = 'medium',
            investmentHorizon = 90, // days
            targetAPR = null,
            maxStakes = 5,
            rebalanceFrequency = 7 // days
        } = options;

        try {
            // Gather comprehensive player data
            const playerProfile = await this.buildPlayerProfile(playerId);
            
            // Analyze market conditions
            const marketAnalysis = await this.analyzeMarketConditions();
            
            // Generate optimization strategies
            const strategies = await this.generateOptimizationStrategies(
                playerProfile, 
                marketAnalysis, 
                { riskTolerance, investmentHorizon, targetAPR, maxStakes }
            );
            
            // Simulate performance
            const simulations = await this.runPortfolioSimulations(strategies, playerProfile);
            
            // Select optimal strategy
            const optimalStrategy = this.selectOptimalStrategy(simulations, playerProfile);
            
            // Generate actionable recommendations
            const recommendations = await this.generateActionableRecommendations(
                optimalStrategy, 
                playerProfile
            );
            
            // Save optimization results
            const optimizationId = await this.saveOptimizationResults(
                playerId, 
                playerProfile, 
                optimalStrategy, 
                recommendations
            );
            
            return {
                optimizationId,
                playerProfile,
                marketAnalysis,
                optimalStrategy,
                recommendations,
                expectedPerformance: optimalStrategy.expectedMetrics,
                riskAssessment: optimalStrategy.riskAnalysis,
                confidenceScore: optimalStrategy.confidence,
                validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            };
            
        } catch (error) {
            console.error('Error in advanced optimization:', error);
            throw new Error('Failed to generate advanced optimization');
        }
    }

    async buildPlayerProfile(playerId) {
        // Get basic player info
        const playerQuery = 'SELECT * FROM players WHERE id = $1';
        const playerResult = await this.db.query(playerQuery, [playerId]);
        const player = playerResult.rows[0];

        // Get reputation DNA
        const reputation = await this.reputationService.getPlayerReputationDNA(playerId);
        
        // Get current staking portfolio
        const portfolio = await this.stakingService.getPlayerStakingPortfolio(playerId);
        
        // Get historical performance
        const historicalData = await this.getHistoricalPerformance(playerId);
        
        // Get community involvement
        const communityData = await this.getCommunityInvolvement(playerId);
        
        // Get education achievements
        const educationData = await this.getEducationAchievements(playerId);
        
        // Calculate player metrics
        const metrics = this.calculatePlayerMetrics(
            player, 
            reputation, 
            portfolio, 
            historicalData, 
            communityData, 
            educationData
        );

        return {
            playerId,
            basicInfo: {
                level: player.level,
                rank: player.rank,
                generation: player.generation,
                permanentBonus: player.permanent_bonus,
                joinDate: player.joined_at
            },
            reputation: {
                score: reputation.overall_score,
                rank: reputation.civilization_rank,
                dna: reputation
            },
            portfolio: {
                currentStakes: portfolio,
                totalStaked: portfolio.reduce((sum, stake) => sum + stake.reputation_amount_staked, 0),
                totalWeight: portfolio.reduce((sum, stake) => sum + stake.stake_weight, 0),
                averageAPR: portfolio.length > 0 ? 
                    portfolio.reduce((sum, stake) => sum + (stake.base_apr + stake.community_bonus_apr), 0) / portfolio.length : 0
            },
            historical: historicalData,
            community: communityData,
            education: educationData,
            metrics,
            riskProfile: this.calculateRiskProfile(metrics, historicalData),
            preferences: await this.getPlayerPreferences(playerId)
        };
    }

    async analyzeMarketConditions() {
        // Get current pool statistics
        const poolStatsQuery = `
            SELECT 
                pool_type,
                COUNT(*) as pool_count,
                AVG(base_apr + community_bonus_apr) as average_apr,
                SUM(total_staked_reputation) as total_staked,
                SUM(total_stakers) as total_stakers,
                AVG(total_staked_reputation) as avg_pool_size
            FROM reputation_staking_pools 
            WHERE is_active = true
            GROUP BY pool_type
        `;
        
        const poolStats = await this.db.query(poolStatsQuery);
        
        // Get recent reward trends
        const rewardTrendsQuery = `
            SELECT 
                DATE_TRUNC('day', calculated_at) as date,
                reward_type,
                AVG(reward_amount) as avg_reward,
                COUNT(*) as reward_count
            FROM staking_rewards 
            WHERE calculated_at > NOW() - INTERVAL '30 days'
            GROUP BY DATE_TRUNC('day', calculated_at), reward_type
            ORDER BY date DESC
        `;
        
        const rewardTrends = await this.db.query(rewardTrendsQuery);
        
        // Get staking volume trends
        const volumeTrendsQuery = `
            SELECT 
                DATE_TRUNC('day', staked_at) as date,
                SUM(reputation_amount_staked) as daily_volume,
                COUNT(*) as new_stakes
            FROM reputation_stakes 
            WHERE staked_at > NOW() - INTERVAL '30 days'
            GROUP BY DATE_TRUNC('day', staked_at)
            ORDER BY date DESC
        `;
        
        const volumeTrends = await this.db.query(volumeTrendsQuery);
        
        // Calculate market indicators
        const marketIndicators = this.calculateMarketIndicators(
            poolStats.rows,
            rewardTrends.rows,
            volumeTrends.rows
        );
        
        return {
            timestamp: new Date(),
            poolStatistics: poolStats.rows,
            rewardTrends: rewardTrends.rows,
            volumeTrends: volumeTrends.rows,
            indicators: marketIndicators,
            sentiment: this.calculateMarketSentiment(marketIndicators),
            opportunities: this.identifyMarketOpportunities(marketIndicators),
            risks: this.identifyMarketRisks(marketIndicators)
        };
    }

    async generateOptimizationStrategies(playerProfile, marketAnalysis, options) {
        const strategies = [];
        
        // Strategy 1: Conservative - Low risk, stable returns
        if (options.riskTolerance === 'low' || options.riskTolerance === 'medium') {
            strategies.push(await this.generateConservativeStrategy(
                playerProfile, 
                marketAnalysis, 
                options
            ));
        }
        
        // Strategy 2: Balanced - Moderate risk, optimized returns
        if (options.riskTolerance === 'medium' || options.riskTolerance === 'high') {
            strategies.push(await this.generateBalancedStrategy(
                playerProfile, 
                marketAnalysis, 
                options
            ));
        }
        
        // Strategy 3: Aggressive - High risk, maximum returns
        if (options.riskTolerance === 'high') {
            strategies.push(await this.generateAggressiveStrategy(
                playerProfile, 
                marketAnalysis, 
                options
            ));
        }
        
        // Strategy 4: Hybrid - Custom risk/return profile
        strategies.push(await this.generateHybridStrategy(
            playerProfile, 
            marketAnalysis, 
            options
        ));
        
        // Strategy 5: Time-optimized - Based on investment horizon
        strategies.push(await this.generateTimeOptimizedStrategy(
            playerProfile, 
            marketAnalysis, 
            options
        ));
        
        return strategies;
    }

    async generateConservativeStrategy(playerProfile, marketAnalysis, options) {
        // Focus on stable, low-risk pools
        const conservativePools = marketAnalysis.poolStatistics
            .filter(pool => pool.pool_type === 'integrity' || pool.pool_type === 'social')
            .sort((a, b) => b.average_apr - a.average_apr)
            .slice(0, 3);

        const allocations = conservativePools.map((pool, index) => ({
            poolType: pool.pool_type,
            allocationPercentage: index === 0 ? 50 : 25, // 50%, 25%, 25%
            lockPeriod: 180, // 6 months for stability
            expectedAPR: pool.average_apr,
            riskScore: 2.5 // Low risk
        }));

        return {
            name: 'Conservative Growth',
            type: 'conservative',
            allocations,
            expectedMetrics: this.calculateExpectedMetrics(allocations, playerProfile),
            riskAnalysis: this.calculateRiskAnalysis(allocations, 'conservative'),
            confidence: 0.85,
            reasoning: 'Focus on stable, reputation-backed pools with lower volatility'
        };
    }

    async generateBalancedStrategy(playerProfile, marketAnalysis, options) {
        // Mix of different pool types for balanced risk
        const balancedPools = marketAnalysis.poolStatistics
            .sort((a, b) => (b.average_apr * 0.6 + b.avg_pool_size / 1000 * 0.4) - 
                           (a.average_apr * 0.6 + a.avg_pool_size / 1000 * 0.4))
            .slice(0, 4);

        const allocations = balancedPools.map((pool, index) => ({
            poolType: pool.pool_type,
            allocationPercentage: index === 0 ? 35 : index === 1 ? 25 : 20, // 35%, 25%, 20%, 20%
            lockPeriod: 90 + (index * 30), // 90, 120, 150, 180 days
            expectedAPR: pool.average_apr,
            riskScore: 5.0 // Medium risk
        }));

        return {
            name: 'Balanced Portfolio',
            type: 'balanced',
            allocations,
            expectedMetrics: this.calculateExpectedMetrics(allocations, playerProfile),
            riskAnalysis: this.calculateRiskAnalysis(allocations, 'balanced'),
            confidence: 0.75,
            reasoning: 'Diversified across pool types to balance risk and return'
        };
    }

    async generateAggressiveStrategy(playerProfile, marketAnalysis, options) {
        // Focus on high-APR, higher-risk pools
        const aggressivePools = marketAnalysis.poolStatistics
            .filter(pool => pool.pool_type === 'legacy' || pool.pool_type === 'governance' || pool.pool_type === 'knowledge')
            .sort((a, b) => b.average_apr - a.average_apr)
            .slice(0, 3);

        const allocations = aggressivePools.map((pool, index) => ({
            poolType: pool.pool_type,
            allocationPercentage: index === 0 ? 50 : 25, // 50%, 25%, 25%
            lockPeriod: 30 + (index * 15), // Shorter lock periods for flexibility
            expectedAPR: pool.average_apr,
            riskScore: 7.5 // High risk
        }));

        return {
            name: 'Aggressive Growth',
            type: 'aggressive',
            allocations,
            expectedMetrics: this.calculateExpectedMetrics(allocations, playerProfile),
            riskAnalysis: this.calculateRiskAnalysis(allocations, 'aggressive'),
            confidence: 0.60,
            reasoning: 'Maximize returns through high-APR pools with higher volatility'
        };
    }

    async generateHybridStrategy(playerProfile, marketAnalysis, options) {
        // Custom strategy based on player's specific profile
        const playerRiskScore = playerProfile.riskProfile.score;
        const targetRiskScore = playerRiskScore + (options.riskTolerance === 'high' ? 2 : 
                                                  options.riskTolerance === 'low' ? -2 : 0);

        // Select pools that match target risk profile
        const hybridPools = marketAnalysis.poolStatistics
            .filter(pool => {
                const poolRisk = this.getPoolRiskScore(pool.pool_type);
                return Math.abs(poolRisk - targetRiskScore) <= 2;
            })
            .sort((a, b) => b.average_apr - a.average_apr)
            .slice(0, options.maxStakes);

        const allocationPerPool = 100 / hybridPools.length;
        const allocations = hybridPools.map((pool, index) => ({
            poolType: pool.pool_type,
            allocationPercentage: allocationPerPool,
            lockPeriod: 60 + (index * 20), // Varied lock periods
            expectedAPR: pool.average_apr,
            riskScore: this.getPoolRiskScore(pool.pool_type)
        }));

        return {
            name: 'Personalized Hybrid',
            type: 'hybrid',
            allocations,
            expectedMetrics: this.calculateExpectedMetrics(allocations, playerProfile),
            riskAnalysis: this.calculateRiskAnalysis(allocations, 'hybrid'),
            confidence: 0.80,
            reasoning: `Custom strategy tailored to your risk profile (${targetRiskScore.toFixed(1)}/10)`
        };
    }

    async generateTimeOptimizedStrategy(playerProfile, marketAnalysis, options) {
        // Strategy optimized for specific time horizon
        const { investmentHorizon } = options;
        
        let optimalLockPeriod;
        if (investmentHorizon <= 30) {
            optimalLockPeriod = 7; // Very short term
        } else if (investmentHorizon <= 90) {
            optimalLockPeriod = 30; // Short term
        } else if (investmentHorizon <= 180) {
            optimalLockPeriod = 90; // Medium term
        } else {
            optimalLockPeriod = 180; // Long term
        }

        // Select pools that perform well for this time horizon
        const timeOptimizedPools = marketAnalysis.poolStatistics
            .filter(pool => this.isPoolSuitableForTimeHorizon(pool.pool_type, optimalLockPeriod))
            .sort((a, b) => b.average_apr - a.average_apr)
            .slice(0, 3);

        const allocations = timeOptimizedPools.map((pool, index) => ({
            poolType: pool.pool_type,
            allocationPercentage: index === 0 ? 50 : 25, // 50%, 25%, 25%
            lockPeriod: optimalLockPeriod,
            expectedAPR: pool.average_apr,
            riskScore: this.getPoolRiskScore(pool.pool_type)
        }));

        return {
            name: `Time-Optimized (${investmentHorizon} days)`,
            type: 'time_optimized',
            allocations,
            expectedMetrics: this.calculateExpectedMetrics(allocations, playerProfile),
            riskAnalysis: this.calculateRiskAnalysis(allocations, 'time_optimized'),
            confidence: 0.70,
            reasoning: `Optimized for ${investmentHorizon}-day investment horizon with ${optimalLockPeriod}-day lock periods`
        };
    }

    // ===================================
    // PORTFOLIO SIMULATION ENGINE
    // ===================================

    async runPortfolioSimulations(strategies, playerProfile) {
        const simulations = [];
        
        for (const strategy of strategies) {
            const simulation = await this.runMonteCarloSimulation(strategy, playerProfile);
            simulations.push({
                strategy: strategy.name,
                type: strategy.type,
                simulation,
                confidence: strategy.confidence
            });
        }
        
        return simulations;
    }

    async runMonteCarloSimulation(strategy, playerProfile) {
        const numSimulations = 1000;
        const timeHorizon = 90; // 90 days
        
        const results = [];
        
        for (let i = 0; i < numSimulations; i++) {
            const result = await this.simulatePortfolioPerformance(
                strategy, 
                playerProfile, 
                timeHorizon,
                this.generateRandomMarketConditions()
            );
            results.push(result);
        }
        
        // Calculate statistics
        const finalValues = results.map(r => r.finalValue);
        const totalReturns = results.map(r => r.totalReturn);
        const maxDrawdowns = results.map(r => r.maxDrawdown);
        
        return {
            iterations: numSimulations,
            timeHorizon,
            statistics: {
                finalValue: {
                    mean: this.mean(finalValues),
                    median: this.median(finalValues),
                    percentile5: this.percentile(finalValues, 5),
                    percentile95: this.percentile(finalValues, 95),
                    standardDeviation: this.standardDeviation(finalValues)
                },
                totalReturn: {
                    mean: this.mean(totalReturns),
                    median: this.median(totalReturns),
                    percentile5: this.percentile(totalReturns, 5),
                    percentile95: this.percentile(totalReturns, 95),
                    standardDeviation: this.standardDeviation(totalReturns)
                },
                maxDrawdown: {
                    mean: this.mean(maxDrawdowns),
                    median: this.median(maxDrawdowns),
                    worst: Math.max(...maxDrawdowns),
                    best: Math.min(...maxDrawdowns)
                },
                successProbability: totalReturns.filter(r => r > 0).length / numSimulations,
                probabilityOfLoss: totalReturns.filter(r => r < 0).length / numSimulations
            },
            samplePaths: results.slice(0, 10) // Store sample paths for analysis
        };
    }

    async simulatePortfolioPerformance(strategy, playerProfile, timeHorizon, marketConditions) {
        let currentValue = playerProfile.portfolio.totalStaked || 1000; // Default 1000 if no stakes
        let maxValue = currentValue;
        let maxDrawdown = 0;
        const dailyValues = [currentValue];
        
        for (let day = 0; day < timeHorizon; day++) {
            // Calculate daily return based on strategy allocations
            let dailyReturn = 0;
            
            for (const allocation of strategy.allocations) {
                const poolReturn = this.calculatePoolReturn(
                    allocation.poolType,
                    allocation.expectedAPR,
                    marketConditions.volatility,
                    marketConditions.trend
                );
                
                dailyReturn += (allocation.allocationPercentage / 100) * poolReturn;
            }
            
            // Apply daily return
            currentValue *= (1 + dailyReturn / 36500); // Daily compounding
            dailyValues.push(currentValue);
            
            // Track max drawdown
            if (currentValue > maxValue) {
                maxValue = currentValue;
            } else {
                const drawdown = (maxValue - currentValue) / maxValue;
                maxDrawdown = Math.max(maxDrawdown, drawdown);
            }
        }
        
        const totalReturn = (currentValue - (playerProfile.portfolio.totalStaked || 1000)) / (playerProfile.portfolio.totalStaked || 1000);
        
        return {
            finalValue: currentValue,
            totalReturn,
            maxDrawdown,
            dailyValues,
            volatility: this.calculateVolatility(dailyValues)
        };
    }

    // ===================================
    // UTILITY METHODS
    // ===================================

    calculatePlayerMetrics(player, reputation, portfolio, historical, community, education) {
        return {
            reputationScore: reputation.overall_score,
            stakingExperience: portfolio.length,
            totalStaked: portfolio.reduce((sum, stake) => sum + stake.reputation_amount_staked, 0),
            averageLockPeriod: portfolio.length > 0 ? 
                portfolio.reduce((sum, stake) => sum + stake.lock_period_days, 0) / portfolio.length : 0,
            historicalReturns: historical.averageReturn || 0,
            communityEngagement: community.contributionScore || 0,
            educationLevel: education.coursesCompleted || 0,
            riskTolerance: this.calculateRiskTolerance(player, historical),
            loyaltyScore: this.calculateLoyaltyScore(player, portfolio),
            diversificationScore: this.calculateDiversificationScore(portfolio)
        };
    }

    calculateRiskProfile(metrics, historical) {
        const riskFactors = {
            reputationStability: metrics.reputationScore / 100,
            experienceLevel: Math.min(metrics.stakingExperience / 10, 1),
            historicalVolatility: historical.volatility || 0.5,
            communityStability: metrics.communityEngagement / 100,
            educationMaturity: Math.min(metrics.educationLevel / 20, 1)
        };
        
        const riskScore = (
            riskFactors.reputationStability * 0.3 +
            riskFactors.experienceLevel * 0.2 +
            (1 - riskFactors.historicalVolatility) * 0.2 +
            riskFactors.communityStability * 0.15 +
            riskFactors.educationMaturity * 0.15
        ) * 10;
        
        return {
            score: Math.max(1, Math.min(10, riskScore)),
            factors: riskFactors,
            classification: this.classifyRiskProfile(riskScore)
        };
    }

    classifyRiskProfile(score) {
        if (score <= 3) return 'conservative';
        if (score <= 6) return 'moderate';
        if (score <= 8) return 'aggressive';
        return 'speculative';
    }

    getPoolRiskScore(poolType) {
        const riskScores = {
            integrity: 2.0,
            social: 3.0,
            builder: 4.0,
            knowledge: 5.0,
            governance: 6.5,
            legacy: 8.0
        };
        return riskScores[poolType] || 5.0;
    }

    isPoolSuitableForTimeHorizon(poolType, lockPeriod) {
        const suitability = {
            integrity: lockPeriod >= 90,
            social: lockPeriod >= 60,
            builder: lockPeriod >= 45,
            knowledge: lockPeriod >= 30,
            governance: lockPeriod >= 120,
            legacy: lockPeriod >= 180
        };
        return suitability[poolType] || false;
    }

    calculateExpectedMetrics(allocations, playerProfile) {
        const weightedAPR = allocations.reduce((sum, allocation) => {
            return sum + (allocation.expectedAPR * (allocation.allocationPercentage / 100));
        }, 0);
        
        const weightedRisk = allocations.reduce((sum, allocation) => {
            return sum + (allocation.riskScore * (allocation.allocationPercentage / 100));
        }, 0);
        
        const expectedAnnualReturn = playerProfile.portfolio.totalStaked * weightedAPR;
        const expected90DayReturn = expectedAnnualReturn * (90 / 365);
        
        return {
            expectedAPR: weightedAPR,
            expectedRiskScore: weightedRisk,
            expectedAnnualReturn,
            expected90DayReturn,
            riskAdjustedReturn: weightedAPR / weightedRisk,
            diversificationRatio: allocations.length / 6, // Max 6 pool types
            liquidityScore: this.calculateLiquidityScore(allocations)
        };
    }

    calculateRiskAnalysis(allocations, strategyType) {
        const concentrationRisk = Math.max(...allocations.map(a => a.allocationPercentage)) / 100;
        const poolTypeRisk = this.calculatePoolTypeConcentrationRisk(allocations);
        const lockPeriodRisk = this.calculateLockPeriodRisk(allocations);
        const marketRisk = this.calculateMarketRisk(allocations);
        
        const overallRisk = (concentrationRisk + poolTypeRisk + lockPeriodRisk + marketRisk) / 4;
        
        return {
            overallRisk,
            concentrationRisk,
            poolTypeRisk,
            lockPeriodRisk,
            marketRisk,
            riskFactors: {
                concentration: concentrationRisk > 0.5 ? 'high' : concentrationRisk > 0.3 ? 'medium' : 'low',
                poolDiversity: poolTypeRisk > 0.5 ? 'high' : poolTypeRisk > 0.3 ? 'medium' : 'low',
                liquidity: lockPeriodRisk > 0.5 ? 'high' : lockPeriodRisk > 0.3 ? 'medium' : 'low',
                marketExposure: marketRisk > 0.5 ? 'high' : marketRisk > 0.3 ? 'medium' : 'low'
            },
            mitigationStrategies: this.generateRiskMitigationStrategies(allocations, overallRisk)
        };
    }

    // Statistical utility methods
    mean(arr) {
        return arr.reduce((sum, val) => sum + val, 0) / arr.length;
    }

    median(arr) {
        const sorted = arr.slice().sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    }

    percentile(arr, p) {
        const sorted = arr.slice().sort((a, b) => a - b);
        const index = (p / 100) * (sorted.length - 1);
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        const weight = index % 1;
        return sorted[lower] * (1 - weight) + sorted[upper] * weight;
    }

    standardDeviation(arr) {
        const mean = this.mean(arr);
        const squaredDiffs = arr.map(val => Math.pow(val - mean, 2));
        const avgSquaredDiff = this.mean(squaredDiffs);
        return Math.sqrt(avgSquaredDiff);
    }

    generateRandomMarketConditions() {
        return {
            volatility: Math.random() * 0.3 + 0.1, // 10% to 40%
            trend: (Math.random() - 0.5) * 0.2, // -10% to +10%
            sentiment: Math.random() // 0 to 1
        };
    }

    calculatePoolReturn(poolType, baseAPR, volatility, trend) {
        const poolVolatility = this.getPoolVolatility(poolType);
        const randomShock = (Math.random() - 0.5) * 2 * poolVolatility * volatility;
        const trendEffect = trend * this.getPoolTrendSensitivity(poolType);
        
        return baseAPR + randomShock + trendEffect;
    }

    getPoolVolatility(poolType) {
        const volatilities = {
            integrity: 0.05,
            social: 0.08,
            builder: 0.12,
            knowledge: 0.15,
            governance: 0.20,
            legacy: 0.25
        };
        return volatilities[poolType] || 0.10;
    }

    getPoolTrendSensitivity(poolType) {
        const sensitivities = {
            integrity: 0.5,
            social: 0.7,
            builder: 1.0,
            knowledge: 1.2,
            governance: 1.5,
            legacy: 2.0
        };
        return sensitivities[poolType] || 1.0;
    }

    async saveOptimizationResults(playerId, playerProfile, optimalStrategy, recommendations) {
        const optimizationId = uuidv4();
        
        const query = `
            INSERT INTO yield_optimization_suggestions 
            (id, player_id, current_portfolio, optimal_portfolio, expected_apr_improvement,
             recommendations, risk_assessment, confidence_score, expires_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW() + INTERVAL '7 days')
            RETURNING id
        `;
        
        await this.db.query(query, [
            optimizationId,
            playerId,
            JSON.stringify(playerProfile.portfolio),
            JSON.stringify(optimalStrategy.allocations),
            optimalStrategy.expectedMetrics.expectedAPR * 100,
            JSON.stringify(recommendations),
            optimalStrategy.riskAnalysis.overallRisk,
            optimalStrategy.confidence
        ]);
        
        return optimizationId;
    }
}
