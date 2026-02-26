import { v4 as uuidv4 } from 'uuid';

// ===================================
// CROSS-ECOSYSTEM BRIDGES SERVICE
## "CONNECT YOUR STAKING POWER TO THE ENTIRE CIVILIZATION"
// ===================================

export class CrossEcosystemBridgesService {
    constructor(db, reputationService, stakingService, educationService) {
        this.db = db;
        this.reputationService = reputationService;
        this.stakingService = stakingService;
        this.educationService = educationService;
        
        // Bridge conversion rates
        this.conversionRates = {
            reputationToTokens: 0.1,      // 1 reputation = 0.1 tokens
            reputationToCredits: 1.0,     // 1 reputation = 1 credit
            reputationToInfluence: 2.5,   // 1 reputation = 2.5 influence
            tokensToReputation: 10.0,     // 1 token = 10 reputation
            creditsToReputation: 1.0      // 1 credit = 1 reputation
        };
        
        // Bridge fees
        this.bridgeFees = {
            education: 0.02,              // 2% fee for education bridge
            infrastructure: 0.03,         // 3% fee for infrastructure bridge
            marketplace: 0.015,           // 1.5% fee for marketplace bridge
            governance: 0.01,             // 1% fee for governance bridge
            community: 0.005              // 0.5% fee for community bridge
        };
    }

    // ===================================
    // EDUCATION BRIDGE
    // ===================================

    async bridgeToEducation(playerId, courseId, stakeId, accessType = 'premium') {
        try {
            // Get stake details
            const stake = await this.stakingService.getStake(stakeId);
            if (!stake || stake.player_id !== playerId) {
                throw new Error('Invalid stake for education bridge');
            }

            // Calculate education access value
            const educationValue = this.calculateEducationAccessValue(stake, accessType);
            
            // Check if player has sufficient stake weight
            if (stake.stake_weight < educationValue.requiredStakeWeight) {
                throw new Error(`Insufficient stake weight. Required: ${educationValue.requiredStakeWeight}, Available: ${stake.stake_weight}`);
            }

            // Create bridge transaction
            const bridgeTransaction = await this.createBridgeTransaction({
                playerId,
                sourceType: 'staking',
                sourceId: stakeId,
                targetType: 'education',
                targetId: courseId,
                bridgeType: 'education_access',
                conversionRate: this.conversionRates.reputationToCredits,
                feeRate: this.bridgeFees.education,
                amount: stake.reputation_amount_staked,
                convertedAmount: educationValue.creditsGranted,
                metadata: {
                    accessType,
                    accessDuration: educationValue.accessDuration,
                    courseLevel: educationValue.courseLevel,
                    stakeWeight: stake.stake_weight
                }
            });

            // Grant education access
            const educationAccess = await this.grantEducationAccess(
                playerId, 
                courseId, 
                stakeId, 
                educationValue
            );

            // Lock portion of stake for education access
            await this.lockStakeForEducation(stakeId, educationValue.lockAmount);

            // Create achievement if first education bridge
            await this.checkEducationBridgeAchievement(playerId);

            return {
                bridgeTransaction,
                educationAccess,
                educationValue,
                nextBridgeBonus: this.calculateNextBridgeBonus(playerId, 'education')
            };

        } catch (error) {
            console.error('Error in education bridge:', error);
            throw new Error('Failed to bridge to education');
        }
    }

    calculateEducationAccessValue(stake, accessType) {
        const baseValue = stake.stake_weight * this.conversionRates.reputationToCredits;
        
        const accessMultipliers = {
            basic: { multiplier: 1.0, duration: 30, level: 'beginner' },
            premium: { multiplier: 1.5, duration: 90, level: 'intermediate' },
            exclusive: { multiplier: 2.0, duration: 180, level: 'advanced' },
            master: { multiplier: 3.0, duration: 365, level: 'expert' }
        };

        const accessConfig = accessMultipliers[accessType];
        const creditsGranted = baseValue * accessConfig.multiplier;
        const fee = creditsGranted * this.bridgeFees.education;
        const netCredits = creditsGranted - fee;

        return {
            creditsGranted: netCredits,
            accessDuration: accessConfig.duration,
            courseLevel: accessConfig.level,
            requiredStakeWeight: stake.stake_weight * 0.1, // 10% of stake weight minimum
            lockAmount: stake.reputation_amount_staked * 0.2, // Lock 20% of stake
            fee: fee,
            conversionRate: this.conversionRates.reputationToCredits
        };
    }

    async grantEducationAccess(playerId, courseId, stakeId, educationValue) {
        const query = `
            INSERT INTO education_staking_access 
            (id, player_id, course_id, stake_id, access_level, access_granted_at, access_expires_at,
             reputation_required, stake_duration_required, pool_type_required, credits_granted)
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW() + INTERVAL '${educationValue.accessDuration} days', 
                    $6, $7, $8, $9)
            RETURNING *
        `;

        const result = await this.db.query(query, [
            uuidv4(),
            playerId,
            courseId,
            stakeId,
            educationValue.courseLevel,
            educationValue.requiredStakeWeight,
            30, // Default 30 days requirement
            'knowledge', // Default to knowledge pool
            educationValue.creditsGranted
        ]);

        return result.rows[0];
    }

    async lockStakeForEducation(stakeId, lockAmount) {
        const query = `
            UPDATE reputation_stakes 
            SET 
                reputation_amount_staked = reputation_amount_staked - $1,
                education_locked_amount = COALESCE(education_locked_amount, 0) + $1,
                updated_at = NOW()
            WHERE id = $2 AND reputation_amount_staked >= $1
            RETURNING *
        `;

        const result = await this.db.query(query, [lockAmount, stakeId]);
        
        if (result.rows.length === 0) {
            throw new Error('Insufficient stake amount to lock for education');
        }

        return result.rows[0];
    }

    // ===================================
    // INFRASTRUCTURE BRIDGE
    // ===================================

    async bridgeToInfrastructure(playerId, projectId, stakeId, contributionType = 'development') {
        try {
            // Get stake details
            const stake = await this.stakingService.getStake(stakeId);
            if (!stake || stake.player_id !== playerId) {
                throw new Error('Invalid stake for infrastructure bridge');
            }

            // Get project details
            const project = await this.getInfrastructureProject(projectId);
            if (!project || project.status !== 'active') {
                throw new Error('Project not found or not active');
            }

            // Calculate infrastructure contribution value
            const contributionValue = this.calculateInfrastructureContribution(stake, project, contributionType);
            
            // Create bridge transaction
            const bridgeTransaction = await this.createBridgeTransaction({
                playerId,
                sourceType: 'staking',
                sourceId: stakeId,
                targetType: 'infrastructure',
                targetId: projectId,
                bridgeType: 'infrastructure_contribution',
                conversionRate: this.conversionRates.reputationToTokens,
                feeRate: this.bridgeFees.infrastructure,
                amount: stake.reputation_amount_staked,
                convertedAmount: contributionValue.tokensGenerated,
                metadata: {
                    contributionType,
                    projectCategory: project.category,
                    impactScore: contributionValue.impactScore,
                    reputationReturn: contributionValue.reputationReturn
                }
            });

            // Record infrastructure contribution
            const contribution = await this.recordInfrastructureContribution(
                playerId, 
                projectId, 
                stakeId, 
                contributionValue
            );

            // Update project funding
            await this.updateProjectFunding(projectId, contributionValue.tokensGenerated);

            // Generate reputation return
            await this.generateInfrastructureReputationReturn(playerId, contributionValue);

            return {
                bridgeTransaction,
                contribution,
                contributionValue,
                projectProgress: await this.getProjectProgress(projectId)
            };

        } catch (error) {
            console.error('Error in infrastructure bridge:', error);
            throw new Error('Failed to bridge to infrastructure');
        }
    }

    calculateInfrastructureContribution(stake, project, contributionType) {
        const baseTokens = stake.stake_weight * this.conversionRates.reputationToTokens;
        
        const contributionMultipliers = {
            development: { multiplier: 1.2, impact: 0.8, return: 0.15 },
            research: { multiplier: 1.5, impact: 0.9, return: 0.20 },
            maintenance: { multiplier: 1.0, impact: 0.6, return: 0.10 },
            security: { multiplier: 1.3, impact: 0.85, return: 0.18 },
            community: { multiplier: 1.1, impact: 0.7, return: 0.12 }
        };

        const contributionConfig = contributionMultipliers[contributionType];
        const tokensGenerated = baseTokens * contributionConfig.multiplier;
        const fee = tokensGenerated * this.bridgeFees.infrastructure;
        const netTokens = tokensGenerated - fee;

        return {
            tokensGenerated: netTokens,
            impactScore: contributionConfig.impact,
            reputationReturn: contributionConfig.return,
            projectCategory: project.category,
            contributionType: contributionType,
            fee: fee,
            conversionRate: this.conversionRates.reputationToTokens
        };
    }

    async getInfrastructureProject(projectId) {
        const query = 'SELECT * FROM infrastructure_projects WHERE id = $1';
        const result = await this.db.query(query, [projectId]);
        return result.rows[0];
    }

    async recordInfrastructureContribution(playerId, projectId, stakeId, contributionValue) {
        const query = `
            INSERT INTO infrastructure_contributions 
            (id, player_id, project_id, stake_id, contribution_type, tokens_contributed, 
             impact_score, reputation_return, contributed_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
            RETURNING *
        `;

        const result = await this.db.query(query, [
            uuidv4(),
            playerId,
            projectId,
            stakeId,
            contributionValue.contributionType,
            contributionValue.tokensGenerated,
            contributionValue.impactScore,
            contributionValue.reputationReturn
        ]);

        return result.rows[0];
    }

    async updateProjectFunding(projectId, tokensGenerated) {
        const query = `
            UPDATE infrastructure_projects 
            SET 
                total_funding = total_funding + $1,
                current_progress = LEAST(current_progress + ($1 * 0.01), 100),
                updated_at = NOW()
            WHERE id = $2
            RETURNING *
        `;

        const result = await this.db.query(query, [tokensGenerated, projectId]);
        return result.rows[0];
    }

    async generateInfrastructureReputationReturn(playerId, contributionValue) {
        const reputationReturn = contributionValue.tokensGenerated * contributionValue.reputationReturn;
        
        await this.reputationService.addReputationTransaction(
            playerId,
            'infrastructure_contribution',
            reputationReturn,
            'builder',
            `Infrastructure contribution reputation return`,
            uuidv4()
        );
    }

    // ===================================
    // MARKETPLACE BRIDGE
    // ===================================

    async bridgeToMarketplace(playerId, serviceId, stakeId, serviceType = 'premium') {
        try {
            // Get stake details
            const stake = await this.stakingService.getStake(stakeId);
            if (!stake || stake.player_id !== playerId) {
                throw new Error('Invalid stake for marketplace bridge');
            }

            // Get service details
            const service = await this.getMarketplaceService(serviceId);
            if (!service || service.status !== 'available') {
                throw new Error('Service not found or not available');
            }

            // Calculate marketplace access value
            const marketplaceValue = this.calculateMarketplaceAccess(stake, service, serviceType);
            
            // Create bridge transaction
            const bridgeTransaction = await this.createBridgeTransaction({
                playerId,
                sourceType: 'staking',
                sourceId: stakeId,
                targetType: 'marketplace',
                targetId: serviceId,
                bridgeType: 'marketplace_access',
                conversionRate: this.conversionRates.reputationToTokens,
                feeRate: this.bridgeFees.marketplace,
                amount: stake.reputation_amount_staked,
                convertedAmount: marketplaceValue.creditsProvided,
                metadata: {
                    serviceType,
                    serviceCategory: service.category,
                    discountRate: marketplaceValue.discountRate,
                    accessLevel: marketplaceValue.accessLevel
                }
            });

            // Grant marketplace access
            const marketplaceAccess = await this.grantMarketplaceAccess(
                playerId, 
                serviceId, 
                stakeId, 
                marketplaceValue
            );

            // Update service provider reputation
            await this.updateServiceProviderReputation(service.provider_id, marketplaceValue);

            return {
                bridgeTransaction,
                marketplaceAccess,
                marketplaceValue,
                serviceDetails: service
            };

        } catch (error) {
            console.error('Error in marketplace bridge:', error);
            throw new Error('Failed to bridge to marketplace');
        }
    }

    calculateMarketplaceAccess(stake, service, serviceType) {
        const baseCredits = stake.stake_weight * this.conversionRates.reputationToTokens;
        
        const serviceMultipliers = {
            basic: { multiplier: 1.0, discount: 0.1, level: 'standard' },
            premium: { multiplier: 1.5, discount: 0.2, level: 'enhanced' },
            exclusive: { multiplier: 2.0, discount: 0.3, level: 'vip' },
            enterprise: { multiplier: 3.0, discount: 0.4, level: 'enterprise' }
        };

        const serviceConfig = serviceMultipliers[serviceType];
        const creditsProvided = baseCredits * serviceConfig.multiplier;
        const fee = creditsProvided * this.bridgeFees.marketplace;
        const netCredits = creditsProvided - fee;

        return {
            creditsProvided: netCredits,
            discountRate: serviceConfig.discount,
            accessLevel: serviceConfig.level,
            serviceCategory: service.category,
            fee: fee,
            conversionRate: this.conversionRates.reputationToTokens
        };
    }

    async getMarketplaceService(serviceId) {
        const query = `
            SELECT ml.*, p.username as provider_username, p.display_name as provider_name
            FROM marketplace_listings ml
            JOIN players p ON ml.service_provider_id = p.id
            WHERE ml.id = $1
        `;
        
        const result = await this.db.query(query, [serviceId]);
        return result.rows[0];
    }

    async grantMarketplaceAccess(playerId, serviceId, stakeId, marketplaceValue) {
        const query = `
            INSERT INTO marketplace_staking_access 
            (id, player_id, service_id, stake_id, access_level, access_granted_at, access_expires_at,
             credits_granted, discount_rate)
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW() + INTERVAL '30 days', $6, $7)
            RETURNING *
        `;

        const result = await this.db.query(query, [
            uuidv4(),
            playerId,
            serviceId,
            stakeId,
            marketplaceValue.accessLevel,
            marketplaceValue.creditsProvided,
            marketplaceValue.discountRate
        ]);

        return result.rows[0];
    }

    // ===================================
    // COMMUNITY BRIDGE
    // ===================================

    async bridgeToCommunity(playerId, communityId, stakeId, contributionType = 'development') {
        try {
            // Get stake details
            const stake = await this.stakingService.getStake(stakeId);
            if (!stake || stake.player_id !== playerId) {
                throw new Error('Invalid stake for community bridge');
            }

            // Get community details
            const community = await this.getCommunityDetails(communityId);
            if (!community) {
                throw new Error('Community not found');
            }

            // Calculate community contribution value
            const communityValue = this.calculateCommunityContribution(stake, community, contributionType);
            
            // Create bridge transaction
            const bridgeTransaction = await this.createBridgeTransaction({
                playerId,
                sourceType: 'staking',
                sourceId: stakeId,
                targetType: 'community',
                targetId: communityId,
                bridgeType: 'community_contribution',
                conversionRate: this.conversionRates.reputationToInfluence,
                feeRate: this.bridgeFees.community,
                amount: stake.reputation_amount_staked,
                convertedAmount: communityValue.influenceGenerated,
                metadata: {
                    contributionType,
                    communityLevel: community.level,
                    memberBonus: communityValue.memberBonus,
                    leadershipPoints: communityValue.leadershipPoints
                }
            });

            // Record community contribution
            const contribution = await this.recordCommunityContribution(
                playerId, 
                communityId, 
                stakeId, 
                communityValue
            );

            // Update community resources
            await this.updateCommunityResources(communityId, communityValue);

            // Generate community reputation
            await this.generateCommunityReputation(playerId, communityValue);

            return {
                bridgeTransaction,
                contribution,
                communityValue,
                communityStatus: await this.getCommunityStatus(communityId)
            };

        } catch (error) {
            console.error('Error in community bridge:', error);
            throw new Error('Failed to bridge to community');
        }
    }

    calculateCommunityContribution(stake, community, contributionType) {
        const baseInfluence = stake.stake_weight * this.conversionRates.reputationToInfluence;
        
        const contributionMultipliers = {
            development: { multiplier: 1.2, bonus: 0.1, leadership: 5 },
            events: { multiplier: 1.3, bonus: 0.15, leadership: 8 },
            mentorship: { multiplier: 1.4, bonus: 0.2, leadership: 10 },
            security: { multiplier: 1.25, bonus: 0.12, leadership: 6 },
            governance: { multiplier: 1.5, bonus: 0.25, leadership: 15 }
        };

        const contributionConfig = contributionMultipliers[contributionType];
        const influenceGenerated = baseInfluence * contributionConfig.multiplier;
        const fee = influenceGenerated * this.bridgeFees.community;
        const netInfluence = influenceGenerated - fee;

        // Community level bonus
        const levelBonus = 1 + (community.level * 0.05); // 5% per level
        const finalInfluence = netInfluence * levelBonus;

        return {
            influenceGenerated: finalInfluence,
            memberBonus: contributionConfig.bonus,
            leadershipPoints: contributionConfig.leadership,
            communityLevel: community.level,
            contributionType: contributionType,
            fee: fee,
            conversionRate: this.conversionRates.reputationToInfluence
        };
    }

    async getCommunityDetails(communityId) {
        const query = 'SELECT * FROM communities WHERE id = $1';
        const result = await this.db.query(query, [communityId]);
        return result.rows[0];
    }

    async recordCommunityContribution(playerId, communityId, stakeId, communityValue) {
        const query = `
            INSERT INTO community_staking_contributions 
            (id, player_id, community_id, stake_id, contribution_type, influence_contributed, 
             leadership_points, member_bonus, contributed_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
            RETURNING *
        `;

        const result = await this.db.query(query, [
            uuidv4(),
            playerId,
            communityId,
            stakeId,
            communityValue.contributionType,
            communityValue.influenceGenerated,
            communityValue.leadershipPoints,
            communityValue.memberBonus
        ]);

        return result.rows[0];
    }

    async updateCommunityResources(communityId, communityValue) {
        const query = `
            UPDATE communities 
            SET 
                experience = experience + $1,
                member_count = member_count + 1,
                updated_at = NOW()
            WHERE id = $2
            RETURNING *
        `;

        const result = await this.db.query(query, [
            Math.floor(communityValue.influenceGenerated),
            communityId
        ]);

        return result.rows[0];
    }

    // ===================================
    // UTILITY METHODS
    // ===================================

    async createBridgeTransaction(bridgeData) {
        const query = `
            INSERT INTO ecosystem_bridge_transactions 
            (id, player_id, source_type, source_id, target_type, target_id, bridge_type,
             conversion_rate, fee_rate, amount, converted_amount, fee_amount, metadata, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
            RETURNING *
        `;

        const feeAmount = bridgeData.convertedAmount * bridgeData.feeRate;

        const result = await this.db.query(query, [
            uuidv4(),
            bridgeData.playerId,
            bridgeData.sourceType,
            bridgeData.sourceId,
            bridgeData.targetType,
            bridgeData.targetId,
            bridgeData.bridgeType,
            bridgeData.conversionRate,
            bridgeData.feeRate,
            bridgeData.amount,
            bridgeData.convertedAmount,
            feeAmount,
            JSON.stringify(bridgeData.metadata)
        ]);

        return result.rows[0];
    }

    async checkEducationBridgeAchievement(playerId) {
        const query = `
            SELECT COUNT(*) as bridge_count 
            FROM ecosystem_bridge_transactions 
            WHERE player_id = $1 AND bridge_type = 'education_access'
        `;
        
        const result = await this.db.query(query, [playerId]);
        const bridgeCount = parseInt(result.rows[0].bridge_count);

        if (bridgeCount === 1) {
            await this.grantBridgeAchievement(playerId, 'education_bridge', 'Education Pioneer', 'First education bridge transaction', 'rare');
        } else if (bridgeCount === 10) {
            await this.grantBridgeAchievement(playerId, 'education_master', 'Education Master', '10 education bridge transactions', 'epic');
        }
    }

    async grantBridgeAchievement(playerId, type, name, description, rarity) {
        const query = `
            INSERT INTO ecosystem_bridge_achievements 
            (id, player_id, achievement_type, achievement_name, achievement_description, rarity)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (player_id, achievement_type, achievement_name) 
            DO NOTHING
            RETURNING *
        `;

        const result = await this.db.query(query, [uuidv4(), playerId, type, name, description, rarity]);
        return result.rows[0];
    }

    calculateNextBridgeBonus(playerId, bridgeType) {
        // Calculate bonus for next bridge based on usage history
        const bonusMultiplier = Math.min(1 + (0.05 * Math.floor(Math.random() * 3)), 1.15); // Max 15% bonus
        return {
            bonusMultiplier,
            bonusDescription: `${Math.floor((bonusMultiplier - 1) * 100)}% bonus on next ${bridgeType} bridge`
        };
    }

    async getPlayerBridgeHistory(playerId, limit = 50) {
        const query = `
            SELECT ebt.*, 
                   CASE 
                       WHEN ebt.target_type = 'education' THEN (SELECT course_name FROM courses WHERE id = ebt.target_id)
                       WHEN ebt.target_type = 'infrastructure' THEN (SELECT project_name FROM infrastructure_projects WHERE id = ebt.target_id)
                       WHEN ebt.target_type = 'marketplace' THEN (SELECT title FROM marketplace_listings WHERE id = ebt.target_id)
                       WHEN ebt.target_type = 'community' THEN (SELECT name FROM communities WHERE id = ebt.target_id)
                   END as target_name
            FROM ecosystem_bridge_transactions ebt
            WHERE ebt.player_id = $1
            ORDER BY ebt.created_at DESC
            LIMIT $2
        `;

        const result = await this.db.query(query, [playerId, limit]);
        return result.rows;
    }

    async getBridgeAnalytics() {
        const query = `
            SELECT 
                bridge_type,
                COUNT(*) as total_transactions,
                SUM(amount) as total_amount_staked,
                SUM(converted_amount) as total_converted_amount,
                SUM(fee_amount) as total_fees_collected,
                AVG(conversion_rate) as average_conversion_rate,
                COUNT(DISTINCT player_id) as unique_users
            FROM ecosystem_bridge_transactions 
            WHERE created_at > NOW() - INTERVAL '30 days'
            GROUP BY bridge_type
            ORDER BY total_transactions DESC
        `;

        const result = await this.db.query(query);
        return result.rows;
    }
}
