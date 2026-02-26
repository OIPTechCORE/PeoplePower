import { v4 as uuidv4 } from 'uuid';

// ===================================
// GOVERNANCE INTEGRATION SERVICE
// "POWER TO THE PEOPLE, GOVERNANCE BY THE STAKERS"
// ===================================

export class GovernanceIntegrationService {
    constructor(db, reputationService, stakingService) {
        this.db = db;
        this.reputationService = reputationService;
        this.stakingService = stakingService;
        
        // Governance power calculation weights
        this.powerWeights = {
            stakedReputation: 0.4,
            communityLeadership: 0.2,
            integrityScore: 0.15,
            longTermCommitment: 0.15,
            educationAchievement: 0.1
        };
        
        // Voting thresholds
        this.votingThresholds = {
            basic: { power: 0, votes: 1 },
            enhanced: { power: 100, votes: 3 },
            premium: { power: 1000, votes: 5 },
            supreme: { power: 10000, votes: 10 }
        };
    }

    // ===================================
    // GOVERNANCE POWER CALCULATION
    // ===================================

    async calculateGovernancePower(playerId) {
        try {
            // Get player's staking portfolio
            const portfolio = await this.stakingService.getPlayerStakingPortfolio(playerId);
            
            // Get player's reputation DNA
            const reputation = await this.reputationService.getPlayerReputationDNA(playerId);
            
            // Get community leadership data
            const communityData = await this.getCommunityLeadershipData(playerId);
            
            // Get education achievements
            const educationData = await this.getEducationAchievements(playerId);
            
            // Calculate power components
            const powerComponents = {
                stakedReputationPower: this.calculateStakedReputationPower(portfolio),
                communityLeadershipBonus: this.calculateCommunityLeadershipBonus(communityData),
                integrityVoterBonus: this.calculateIntegrityVoterBonus(reputation),
                longTermStakerBonus: this.calculateLongTermStakerBonus(portfolio),
                educationAchievementBonus: this.calculateEducationAchievementBonus(educationData)
            };
            
            // Calculate total governance power
            const totalPower = this.calculateTotalGovernancePower(powerComponents);
            
            // Determine voting tier
            const votingTier = this.determineVotingTier(totalPower);
            
            // Update governance power record
            await this.updateGovernancePowerRecord(playerId, powerComponents, totalPower, votingTier);
            
            return {
                playerId,
                powerComponents,
                totalGovernancePower: totalPower,
                votingTier,
                votingWeight: this.votingThresholds[votingTier].votes,
                canCreateProposals: totalPower >= this.votingThresholds.enhanced.power,
                canVote: totalPower >= this.votingThresholds.basic.power
            };
            
        } catch (error) {
            console.error('Error calculating governance power:', error);
            throw new Error('Failed to calculate governance power');
        }
    }

    calculateStakedReputationPower(portfolio) {
        return portfolio.reduce((totalPower, stake) => {
            // Base power from stake weight
            let stakePower = stake.stake_weight;
            
            // Bonus for longer lock periods
            const lockBonus = Math.min(stake.lock_period_days / 365, 1) * 0.5; // Max 50% bonus
            stakePower *= (1 + lockBonus);
            
            // Bonus for pool type (governance pools get extra)
            const poolTypeBonus = this.getPoolTypeGovernanceBonus(stake.pool_type);
            stakePower *= (1 + poolTypeBonus);
            
            return totalPower + stakePower;
        }, 0);
    }

    getPoolTypeGovernanceBonus(poolType) {
        const bonuses = {
            governance: 0.5,    // 50% bonus
            integrity: 0.3,     // 30% bonus
            legacy: 0.25,       // 25% bonus
            knowledge: 0.2,     // 20% bonus
            social: 0.15,       // 15% bonus
            builder: 0.1        // 10% bonus
        };
        return bonuses[poolType] || 0;
    }

    calculateCommunityLeadershipBonus(communityData) {
        if (!communityData) return 0;
        
        let bonus = 0;
        
        // Leadership role bonus
        if (communityData.role === 'leader') {
            bonus += 50;
        } else if (communityData.role === 'officer') {
            bonus += 25;
        }
        
        // Community size bonus
        const communitySizeBonus = Math.min(communityData.memberCount / 100, 1) * 20;
        bonus += communitySizeBonus;
        
        // Contribution bonus
        const contributionBonus = Math.min(communityData.contribution / 1000, 1) * 30;
        bonus += contributionBonus;
        
        return bonus;
    }

    calculateIntegrityVoterBonus(reputation) {
        const integrityScore = reputation.integrity_dna.trust_score;
        const ruleCompliance = reputation.integrity_dna.rule_compliance_score;
        const ethicalBehavior = reputation.integrity_dna.ethical_behavior_score;
        
        // Average integrity metrics
        const avgIntegrity = (integrityScore + ruleCompliance + ethicalBehavior) / 3;
        
        // Convert to power bonus (max 50 points)
        return (avgIntegrity / 100) * 50;
    }

    calculateLongTermStakerBonus(portfolio) {
        if (portfolio.length === 0) return 0;
        
        const oldestStake = Math.min(...portfolio.map(stake => 
            new Date(stake.staked_at).getTime()
        ));
        const daysSinceFirstStake = (Date.now() - oldestStake) / (1000 * 60 * 60 * 24);
        
        // Bonus increases over time (max 100 points after 1 year)
        return Math.min(daysSinceFirstStake / 365, 1) * 100;
    }

    calculateEducationAchievementBonus(educationData) {
        if (!educationData) return 0;
        
        let bonus = 0;
        
        // Courses completed bonus
        bonus += Math.min(educationData.coursesCompleted * 2, 20);
        
        // Teaching contributions bonus
        bonus += Math.min(educationData.teachingContributions * 5, 30);
        
        // Degree achievement bonus
        if (educationData.highestDegree === 'master') {
            bonus += 50;
        } else if (educationData.highestDegree === 'bachelor') {
            bonus += 25;
        }
        
        return bonus;
    }

    calculateTotalGovernancePower(components) {
        return (
            components.stakedReputationPower * this.powerWeights.stakedReputation +
            components.communityLeadershipBonus * this.powerWeights.communityLeadership +
            components.integrityVoterBonus * this.powerWeights.integrityScore +
            components.longTermStakerBonus * this.powerWeights.longTermCommitment +
            components.educationAchievementBonus * this.powerWeights.educationAchievement
        );
    }

    determineVotingTier(totalPower) {
        if (totalPower >= this.votingThresholds.supreme.power) return 'supreme';
        if (totalPower >= this.votingThresholds.premium.power) return 'premium';
        if (totalPower >= this.votingThresholds.enhanced.power) return 'enhanced';
        return 'basic';
    }

    async updateGovernancePowerRecord(playerId, components, totalPower, votingTier) {
        const query = `
            INSERT INTO governance_power 
            (id, player_id, staked_reputation_power, community_leadership_bonus, 
             integrity_voter_bonus, long_term_staker_bonus, total_governance_power, 
             voting_weight_tier, last_calculated)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
            ON CONFLICT (player_id) 
            DO UPDATE SET
                staked_reputation_power = EXCLUDED.staked_reputation_power,
                community_leadership_bonus = EXCLUDED.community_leadership_bonus,
                integrity_voter_bonus = EXCLUDED.integrity_voter_bonus,
                long_term_staker_bonus = EXCLUDED.long_term_staker_bonus,
                total_governance_power = EXCLUDED.total_governance_power,
                voting_weight_tier = EXCLUDED.voting_weight_tier,
                last_calculated = NOW()
            RETURNING *
        `;
        
        await this.db.query(query, [
            uuidv4(),
            playerId,
            components.stakedReputationPower,
            components.communityLeadershipBonus,
            components.integrityVoterBonus,
            components.longTermStakerBonus,
            totalPower,
            votingTier
        ]);
    }

    // ===================================
    // PROPOSAL MANAGEMENT
    // ===================================

    async createProposal(playerId, proposalData) {
        const governancePower = await this.getGovernancePower(playerId);
        
        if (!governancePower.canCreateProposals) {
            throw new Error('Insufficient governance power to create proposals');
        }
        
        const {
            title,
            description,
            category,
            proposedChanges,
            votingPeriodDays = 7,
            quorumRequired = 0.1 // 10% of total governance power
        } = proposalData;
        
        const proposalQuery = `
            INSERT INTO governance_proposals 
            (id, creator_id, title, description, category, proposed_changes, 
             voting_period_days, quorum_required, status, created_at, voting_starts_at, voting_ends_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active', NOW(), NOW(), NOW() + INTERVAL '${votingPeriodDays} days')
            RETURNING *
        `;
        
        const result = await this.db.query(proposalQuery, [
            uuidv4(),
            playerId,
            title,
            description,
            category,
            JSON.stringify(proposedChanges),
            votingPeriodDays,
            quorumRequired
        ]);
        
        const proposal = result.rows[0];
        
        // Notify eligible voters
        await this.notifyEligibleVoters(proposal);
        
        return proposal;
    }

    async voteOnProposal(playerId, proposalId, vote, reason = null) {
        const governancePower = await this.getGovernancePower(playerId);
        
        if (!governancePower.canVote) {
            throw new Error('Insufficient governance power to vote');
        }
        
        // Check if proposal is active
        const proposalQuery = 'SELECT * FROM governance_proposals WHERE id = $1 AND status = \'active\'';
        const proposalResult = await this.db.query(proposalQuery, [proposalId]);
        
        if (proposalResult.rows.length === 0) {
            throw new Error('Proposal not found or not active for voting');
        }
        
        const proposal = proposalResult.rows[0];
        
        // Check if player has already voted
        const existingVoteQuery = 'SELECT * FROM proposal_votes WHERE proposal_id = $1 AND voter_id = $2';
        const existingVoteResult = await this.db.query(existingVoteQuery, [proposalId, playerId]);
        
        if (existingVoteResult.rows.length > 0) {
            throw new Error('Player has already voted on this proposal');
        }
        
        // Record the vote
        const voteQuery = `
            INSERT INTO proposal_votes 
            (id, proposal_id, voter_id, vote_type, voting_power, vote_reason, voted_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING *
        `;
        
        const voteResult = await this.db.query(voteQuery, [
            uuidv4(),
            proposalId,
            playerId,
            vote,
            governancePower.totalGovernancePower,
            reason
        ]);
        
        // Update proposal vote counts
        await this.updateProposalVoteCounts(proposalId);
        
        return voteResult.rows[0];
    }

    async updateProposalVoteCounts(proposalId) {
        const voteCountsQuery = `
            SELECT 
                vote_type,
                SUM(voting_power) as total_power,
                COUNT(*) as vote_count
            FROM proposal_votes 
            WHERE proposal_id = $1
            GROUP BY vote_type
        `;
        
        const voteCountsResult = await this.db.query(voteCountsQuery, [proposalId]);
        const voteCounts = voteCountsResult.rows;
        
        // Calculate totals
        const forVotes = voteCounts.find(v => v.vote_type === 'for') || { total_power: 0, vote_count: 0 };
        const againstVotes = voteCounts.find(v => v.vote_type === 'against') || { total_power: 0, vote_count: 0 };
        const abstainVotes = voteCounts.find(v => v.vote_type === 'abstain') || { total_power: 0, vote_count: 0 };
        
        const totalVotingPower = forVotes.total_power + againstVotes.total_power + abstainVotes.total_power;
        const totalVotes = forVotes.vote_count + againstVotes.vote_count + abstainVotes.vote_count;
        
        // Get proposal details for quorum calculation
        const proposalQuery = 'SELECT * FROM governance_proposals WHERE id = $1';
        const proposalResult = await this.db.query(proposalQuery, [proposalId]);
        const proposal = proposalResult.rows[0];
        
        // Calculate quorum
        const totalGovernancePower = await this.getTotalGovernancePower();
        const quorumMet = (totalVotingPower / totalGovernancePower) >= proposal.quorum_required;
        
        // Determine outcome if voting period has ended
        let status = 'active';
        let outcome = null;
        
        if (new Date() > new Date(proposal.voting_ends_at)) {
            if (quorumMet) {
                const forPercentage = forVotes.total_power / totalVotingPower;
                if (forPercentage >= 0.5) {
                    status = 'passed';
                    outcome = 'approved';
                } else {
                    status = 'passed';
                    outcome = 'rejected';
                }
            } else {
                status = 'failed';
                outcome = 'quorum_not_met';
            }
        }
        
        // Update proposal
        const updateQuery = `
            UPDATE governance_proposals 
            SET 
                for_votes = $1,
                against_votes = $2,
                abstain_votes = $3,
                total_voting_power = $4,
                total_votes = $5,
                quorum_met = $6,
                status = $7,
                outcome = $8,
                updated_at = NOW()
            WHERE id = $9
        `;
        
        await this.db.query(updateQuery, [
            forVotes.total_power,
            againstVotes.total_power,
            abstainVotes.total_power,
            totalVotingPower,
            totalVotes,
            quorumMet,
            status,
            outcome,
            proposalId
        ]);
        
        // If proposal passed, execute changes
        if (status === 'passed' && outcome === 'approved') {
            await this.executeProposalChanges(proposalId);
        }
    }

    // ===================================
    // PROPOSAL EXECUTION
    // ===================================

    async executeProposalChanges(proposalId) {
        const proposalQuery = 'SELECT * FROM governance_proposals WHERE id = $1';
        const proposalResult = await this.db.query(proposalQuery, [proposalId]);
        const proposal = proposalResult.rows[0];
        
        const proposedChanges = JSON.parse(proposal.proposed_changes);
        
        for (const change of proposedChanges) {
            await this.executeGovernanceChange(change);
        }
        
        // Record execution
        await this.db.query(
            'UPDATE governance_proposals SET executed_at = NOW() WHERE id = $1',
            [proposalId]
        );
    }

    async executeGovernanceChange(change) {
        switch (change.type) {
            case 'pool_parameter_update':
                await this.updatePoolParameters(change.poolId, change.parameters);
                break;
            case 'reward_rate_adjustment':
                await this.adjustRewardRates(change.adjustments);
                break;
            case 'governance_rule_change':
                await this.updateGovernanceRules(change.rules);
                break;
            case 'treasury_allocation':
                await this.allocateTreasuryFunds(change.allocation);
                break;
            case 'community_feature':
                await this.enableCommunityFeature(change.feature);
                break;
            default:
                console.warn(`Unknown change type: ${change.type}`);
        }
    }

    async updatePoolParameters(poolId, parameters) {
        const setClause = Object.keys(parameters)
            .map((key, index) => `${key} = $${index + 2}`)
            .join(', ');
        
        const values = [poolId, ...Object.values(parameters)];
        
        const query = `
            UPDATE reputation_staking_pools 
            SET ${setClause}, updated_at = NOW()
            WHERE id = $1
        `;
        
        await this.db.query(query, values);
    }

    async adjustRewardRates(adjustments) {
        for (const adjustment of adjustments) {
            await this.updatePoolParameters(adjustment.poolId, {
                base_apr: adjustment.newAPR
            });
        }
    }

    // ===================================
    // UTILITY METHODS
    // ===================================

    async getGovernancePower(playerId) {
        const query = 'SELECT * FROM governance_power WHERE player_id = $1';
        const result = await this.db.query(query, [playerId]);
        
        if (result.rows.length === 0) {
            return await this.calculateGovernancePower(playerId);
        }
        
        const governance = result.rows[0];
        return {
            playerId,
            totalGovernancePower: governance.total_governance_power,
            votingTier: governance.voting_weight_tier,
            votingWeight: this.votingThresholds[governance.voting_weight_tier].votes,
            canCreateProposals: governance.total_governance_power >= this.votingThresholds.enhanced.power,
            canVote: governance.total_governance_power >= this.votingThresholds.basic.power,
            components: {
                stakedReputationPower: governance.staked_reputation_power,
                communityLeadershipBonus: governance.community_leadership_bonus,
                integrityVoterBonus: governance.integrity_voter_bonus,
                longTermStakerBonus: governance.long_term_staker_bonus
            }
        };
    }

    async getCommunityLeadershipData(playerId) {
        const query = `
            SELECT cm.*, c.member_count, c.level as community_level
            FROM community_members cm
            JOIN communities c ON cm.community_id = c.id
            WHERE cm.player_id = $1
        `;
        
        const result = await this.db.query(query, [playerId]);
        return result.rows[0] || null;
    }

    async getEducationAchievements(playerId) {
        const query = `
            SELECT 
                COUNT(DISTINCT course_id) as courses_completed,
                COUNT(DISTINCT CASE WHEN access_level = 'master' THEN course_id END) as master_courses,
                MAX(CASE WHEN access_level = 'master' THEN 'master' 
                         WHEN access_level = 'exclusive' THEN 'bachelor' 
                         ELSE 'associate' END) as highest_degree
            FROM education_staking_access 
            WHERE player_id = $1 AND is_active = true
        `;
        
        const result = await this.db.query(query, [playerId]);
        return result.rows[0] || null;
    }

    async getTotalGovernancePower() {
        const query = 'SELECT SUM(total_governance_power) as total FROM governance_power';
        const result = await this.db.query(query);
        return parseFloat(result.rows[0].total) || 0;
    }

    async notifyEligibleVoters(proposal) {
        // Get all players with voting power
        const votersQuery = `
            SELECT player_id FROM governance_power 
            WHERE total_governance_power >= $1
        `;
        
        const votersResult = await this.db.query(votersQuery, [this.votingThresholds.basic.power]);
        const voters = votersResult.rows;
        
        // Send notifications (implementation depends on notification system)
        for (const voter of voters) {
            await this.sendNotification(voter.player_id, {
                type: 'governance_proposal',
                title: 'New Proposal Available',
                message: `Proposal "${proposal.title}" is now open for voting`,
                data: { proposalId: proposal.id }
            });
        }
    }

    async sendNotification(playerId, notification) {
        // This would integrate with your notification system
        console.log(`Notification sent to player ${playerId}:`, notification);
    }

    // ===================================
    // GOVERNANCE ANALYTICS
    // ===================================

    async getGovernanceAnalytics() {
        const analyticsQuery = `
            SELECT 
                COUNT(DISTINCT gp.player_id) as total_governance_participants,
                SUM(gp.total_governance_power) as total_governance_power,
                AVG(gp.total_governance_power) as average_governance_power,
                COUNT(DISTINCT CASE WHEN gp.voting_weight_tier = 'supreme' THEN gp.player_id END) as supreme_voters,
                COUNT(DISTINCT CASE WHEN gp.voting_weight_tier = 'premium' THEN gp.player_id END) as premium_voters,
                COUNT(DISTINCT CASE WHEN gp.voting_weight_tier = 'enhanced' THEN gp.player_id END) as enhanced_voters,
                COUNT(DISTINCT CASE WHEN gp.voting_weight_tier = 'basic' THEN gp.player_id END) as basic_voters,
                COUNT(DISTINCT gprop.id) as total_proposals,
                COUNT(DISTINCT CASE WHEN gprop.status = 'passed' AND gprop.outcome = 'approved' THEN gprop.id END) as approved_proposals,
                COUNT(DISTINCT CASE WHEN gprop.status = 'passed' AND gprop.outcome = 'rejected' THEN gprop.id END) as rejected_proposals,
                COUNT(DISTINCT pv.id) as total_votes_cast
            FROM governance_power gp
            LEFT JOIN governance_proposals gprop ON 1=1
            LEFT JOIN proposal_votes pv ON 1=1
        `;
        
        const result = await this.db.query(analyticsQuery);
        return result.rows[0];
    }

    async getProposalVotingBreakdown(proposalId) {
        const breakdownQuery = `
            SELECT 
                pv.vote_type,
                pv.voting_power,
                p.display_name,
                gp.voting_weight_tier,
                pv.voted_at,
                pv.vote_reason
            FROM proposal_votes pv
            JOIN players p ON pv.voter_id = p.id
            JOIN governance_power gp ON pv.voter_id = gp.player_id
            WHERE pv.proposal_id = $1
            ORDER BY pv.voting_power DESC
        `;
        
        const result = await this.db.query(breakdownQuery, [proposalId]);
        return result.rows;
    }
}
