import { v4 as uuidv4 } from 'uuid';

// ===================================
// PEOPLE POWER GLOBAL CIVILIZATION LAYER SERVICE
// "DIGITAL NATION WITHOUT BORDERS"
// ===================================

export class GlobalCivilizationService {
    constructor(db, reputationService, stakingService) {
        this.db = db;
        this.reputationService = reputationService;
        this.stakingService = stakingService;
        
        // Civilization configuration
        this.civilizationConfig = {
            maxPresidentsPerCountry: 1,
            maxAmbassadorsPerCountry: 10,
            presidentialTermDays: 90,
            ambassadorTermDays: 180,
            worldPresidentTermDays: 365,
            summitFrequencyDays: 30,
            minReputationForLeadership: 1000,
            minContributionForAmbassador: 500
        };
        
        // Power balance limits
        this.powerLimits = {
            citizen: { votingPower: 1, governanceControl: 0 },
            ambassador: { votingPower: 10, governanceControl: 5 },
            president: { votingPower: 100, governanceControl: 20 },
            worldPresident: { votingPower: 1000, governanceControl: 0 } // Symbolic only
        };
    }

    // ===================================
    // A. PEOPLE POWER GLOBAL NETWORK (PPGN) - FOUNDATION LAYER
    // ===================================

    async registerGlobalCitizen(playerId) {
        try {
            // Check if already registered
            const existingCitizen = await this.getGlobalCitizen(playerId);
            if (existingCitizen) {
                return existingCitizen;
            }

            // Get player's reputation DNA
            const reputation = await this.reputationService.getPlayerReputationDNA(playerId);
            
            // Generate citizen ID
            const citizenId = `PPGN-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
            
            // Determine citizenship level based on reputation
            const citizenshipLevel = this.determineCitizenshipLevel(reputation.overall_score);
            
            // Determine primary skill based on DNA strengths
            const primarySkill = this.determinePrimarySkill(reputation);
            
            // Create global citizen record
            const query = `
                INSERT INTO global_citizens 
                (id, player_id, citizen_id, citizenship_level, global_reputation_score, 
                 primary_skill, secondary_skills, specialization_tags)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *
            `;
            
            const result = await this.db.query(query, [
                uuidv4(),
                playerId,
                citizenId,
                citizenshipLevel,
                reputation.overall_score,
                primarySkill,
                JSON.stringify(this.getSecondarySkills(reputation)),
                JSON.stringify(this.getSpecializationTags(reputation))
            ]);
            
            const citizen = result.rows[0];
            
            // Grant citizenship achievements
            await this.grantCitizenshipAchievements(playerId, citizenshipLevel);
            
            return citizen;
            
        } catch (error) {
            console.error('Error registering global citizen:', error);
            throw new Error('Failed to register global citizen');
        }
    }

    determineCitizenshipLevel(reputationScore) {
        if (reputationScore >= 10000) return 'leader';
        if (reputationScore >= 5000) return 'diplomat';
        if (reputationScore >= 2000) return 'ambassador';
        if (reputationScore >= 500) return 'resident';
        return 'citizen';
    }

    determinePrimarySkill(reputation) {
        const skills = {
            knowledge: reputation.knowledge_dna.overall_score,
            social: reputation.social_dna.overall_score,
            builder: reputation.builder_dna.overall_score,
            integrity: reputation.integrity_dna.overall_score
        };
        
        return Object.keys(skills).reduce((a, b) => skills[a] > skills[b] ? a : b);
    }

    getSecondarySkills(reputation) {
        const skills = {
            knowledge: reputation.knowledge_dna.overall_score,
            social: reputation.social_dna.overall_score,
            builder: reputation.builder_dna.overall_score,
            integrity: reputation.integrity_dna.overall_score
        };
        
        return Object.entries(skills)
            .sort(([,a], [,b]) => b - a)
            .slice(1, 3)
            .map(([skill]) => skill);
    }

    getSpecializationTags(reputation) {
        const tags = [];
        
        // Knowledge specializations
        if (reputation.knowledge_dna.learning_score > 80) tags.push('fast_learner');
        if (reputation.knowledge_dna.teaching_score > 80) tags.push('educator');
        if (reputation.knowledge_dna.research_score > 80) tags.push('researcher');
        
        // Social specializations
        if (reputation.social_dna.leadership_score > 80) tags.push('leader');
        if (reputation.social_dna.collaboration_score > 80) tags.push('collaborator');
        if (reputation.social_dna.communication_score > 80) tags.push('communicator');
        
        // Builder specializations
        if (reputation.builder_dna.innovation_score > 80) tags.push('innovator');
        if (reputation.builder_dna.execution_score > 80) tags.push('executor');
        if (reputation.builder_dna.quality_score > 80) tags.push('quality_focused');
        
        // Integrity specializations
        if (reputation.integrity_dna.trust_score > 80) tags.push('trustworthy');
        if (reputation.integrity_dna.ethical_behavior_score > 80) tags.push('ethical');
        if (reputation.integrity_dna.rule_compliance_score > 80) tags.push('lawful');
        
        return tags;
    }

    async getGlobalCitizen(playerId) {
        const query = 'SELECT * FROM global_citizens WHERE player_id = $1 AND is_active = true';
        const result = await this.db.query(query, [playerId]);
        return result.rows[0] || null;
    }

    async updateGlobalCitizenStats(playerId) {
        const query = `
            UPDATE global_citizens 
            SET 
                global_reputation_score = $1,
                contribution_points = $2,
                network_influence = $3,
                last_active = NOW(),
                total_sessions = total_sessions + 1
            WHERE player_id = $4
            RETURNING *
        `;
        
        // Calculate updated stats
        const reputation = await this.reputationService.getPlayerReputationDNA(playerId);
        const contributionPoints = await this.calculateContributionPoints(playerId);
        const networkInfluence = await this.calculateNetworkInfluence(playerId);
        
        const result = await this.db.query(query, [
            reputation.overall_score,
            contributionPoints,
            networkInfluence,
            playerId
        ]);
        
        return result.rows[0];
    }

    // ===================================
    // B. PEOPLE POWER DIASPORA COMMUNITIES (PPDC) - REGIONAL HUBS
    // ===================================

    async createDiasporaCommunity(playerId, communityData) {
        try {
            const citizen = await this.getGlobalCitizen(playerId);
            if (!citizen) {
                throw new Error('Player must be a global citizen to create community');
            }

            const {
                communityName,
                communityType,
                primaryCountry,
                coveredCountries,
                region,
                continent
            } = communityData;

            // Generate community code
            const communityCode = this.generateCommunityCode(primaryCountry, communityType);
            
            // Create community
            const query = `
                INSERT INTO diaspora_communities 
                (id, community_name, community_code, community_type, primary_country, 
                 covered_countries, region, continent, founder_id, current_leader_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING *
            `;
            
            const result = await this.db.query(query, [
                uuidv4(),
                communityName,
                communityCode,
                communityType,
                primaryCountry,
                JSON.stringify(coveredCountries || []),
                region,
                continent,
                playerId,
                playerId
            ]);
            
            const community = result.rows[0];
            
            // Auto-join founder as leader
            await this.joinCommunity(playerId, community.id, 'leader');
            
            // Grant community creation achievement
            await this.grantCommunityAchievement(playerId, 'community_founder', 'Community Founder');
            
            return community;
            
        } catch (error) {
            console.error('Error creating diaspora community:', error);
            throw new Error('Failed to create diaspora community');
        }
    }

    generateCommunityCode(country, type) {
        const typeCodes = {
            country: 'CTRY',
            regional: 'REG',
            continental: 'CONT',
            global: 'GLOBAL'
        };
        
        return `${country || 'INT'}-${typeCodes[type] || 'COMM'}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    }

    async joinCommunity(playerId, communityId, membershipType = 'member') {
        try {
            // Check if already a member
            const existingMembership = await this.getCommunityMembership(playerId, communityId);
            if (existingMembership) {
                return existingMembership;
            }

            // Create membership
            const query = `
                INSERT INTO community_memberships 
                (id, player_id, community_id, membership_type, join_date)
                VALUES ($1, $2, $3, $4, NOW())
                RETURNING *
            `;
            
            const result = await this.db.query(query, [
                uuidv4(),
                playerId,
                communityId,
                membershipType
            ]);
            
            const membership = result.rows[0];
            
            // Update community member count (trigger handles this)
            
            return membership;
            
        } catch (error) {
            console.error('Error joining community:', error);
            throw new Error('Failed to join community');
        }
    }

    async getCommunityMembership(playerId, communityId) {
        const query = 'SELECT * FROM community_memberships WHERE player_id = $1 AND community_id = $2 AND is_active = true';
        const result = await this.db.query(query, [playerId, communityId]);
        return result.rows[0] || null;
    }

    async createCommunityMission(creatorId, communityId, missionData) {
        try {
            const membership = await this.getCommunityMembership(creatorId, communityId);
            if (!membership || !['leader', 'officer'].includes(membership.membership_type)) {
                throw new Error('Insufficient permissions to create community mission');
            }

            const {
                missionTitle,
                missionDescription,
                missionType,
                objectives,
                successCriteria,
                communityRewardPool,
                individualRewards,
                reputationRewards,
                maxParticipants,
                participationDeadline
            } = missionData;

            const query = `
                INSERT INTO community_missions 
                (id, community_id, creator_id, mission_title, mission_description, mission_type,
                 objectives, success_criteria, community_reward_pool, individual_rewards, 
                 reputation_rewards, max_participants, participation_deadline, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'active')
                RETURNING *
            `;
            
            const result = await this.db.query(query, [
                uuidv4(),
                communityId,
                creatorId,
                missionTitle,
                missionDescription,
                missionType,
                JSON.stringify(objectives),
                JSON.stringify(successCriteria),
                communityRewardPool || 0,
                JSON.stringify(individualRewards || {}),
                JSON.stringify(reputationRewards || {}),
                maxParticipants,
                participationDeadline
            ]);
            
            return result.rows[0];
            
        } catch (error) {
            console.error('Error creating community mission:', error);
            throw new Error('Failed to create community mission');
        }
    }

    // ===================================
    // C. PEOPLE POWER GLOBAL COUNTRY PRESIDENTS (PPGCP) - LEADERSHIP ROLES
    // ===================================

    async electCountryPresident(countryCode, candidateId) {
        try {
            // Check if candidate meets requirements
            const citizen = await this.getGlobalCitizen(candidateId);
            if (!citizen || citizen.global_reputation_score < this.civilizationConfig.minReputationForLeadership) {
                throw new Error('Candidate does not meet leadership requirements');
            }

            // Check if country already has active president
            const existingPresident = await this.getCurrentCountryPresident(countryCode);
            if (existingPresident && existingPresident.is_active) {
                throw new Error('Country already has an active president');
            }

            // Get election data (simplified - in real implementation would involve voting)
            const electionData = await this.simulatePresidentialElection(countryCode, candidateId);
            
            // Create presidency
            const query = `
                INSERT INTO country_presidencies 
                (id, country_code, country_name, current_president_id, presidency_term_start,
                 presidency_term_end, last_election_date, total_votes_cast, winning_vote_percentage)
                VALUES ($1, $2, $3, $4, NOW(), NOW() + INTERVAL '${this.civilizationConfig.presidentialTermDays} days',
                        NOW(), $5, $6)
                RETURNING *
            `;
            
            const result = await this.db.query(query, [
                uuidv4(),
                countryCode,
                this.getCountryName(countryCode),
                candidateId,
                electionData.totalVotes,
                electionData.winPercentage
            ]);
            
            const presidency = result.rows[0];
            
            // Update citizen's role
            await this.updateCitizenshipLevel(candidateId, 'leader');
            
            // Grant presidency achievement
            await this.grantLeadershipAchievement(candidateId, 'country_president', 'Country President');
            
            // Schedule term end
            await this.schedulePresidentialTermEnd(presidency.id);
            
            return presidency;
            
        } catch (error) {
            console.error('Error electing country president:', error);
            throw new Error('Failed to elect country president');
        }
    }

    async getCurrentCountryPresident(countryCode) {
        const query = 'SELECT * FROM country_presidencies WHERE country_code = $1 AND is_active = true';
        const result = await this.db.query(query, [countryCode]);
        return result.rows[0] || null;
    }

    async simulatePresidentialElection(countryCode, candidateId) {
        // Get all eligible voters from the country
        const votersQuery = `
            SELECT gc.player_id, gc.global_reputation_score
            FROM global_citizens gc
            JOIN players p ON gc.player_id = p.id
            WHERE p.country_code = $1 AND gc.is_active = true
        `;
        
        const votersResult = await this.db.query(votersQuery, [countryCode]);
        const voters = votersResult.rows;
        
        // Simulate voting based on reputation and candidate appeal
        let votesForCandidate = 0;
        const totalReputation = voters.reduce((sum, voter) => sum + voter.global_reputation_score, 0);
        
        // Candidate gets votes proportional to their reputation share
        const candidateReputation = voters.find(v => v.player_id === candidateId)?.global_reputation_score || 0;
        const voteShare = Math.min(candidateReputation / totalReputation * 2, 0.8); // Max 80%
        
        votesForCandidate = Math.floor(voters.length * voteShare);
        
        return {
            totalVotes: voters.length,
            votesForCandidate,
            winPercentage: voters.length > 0 ? (votesForCandidate / voters.length) : 0
        };
    }

    async schedulePresidentialTermEnd(presidencyId) {
        // This would be handled by a job scheduler in production
        console.log(`Presidential term end scheduled for presidency ${presidencyId}`);
    }

    // ===================================
    // D. PEOPLE POWER GLOBAL COUNTRY AMBASSADORS (PPGCA) - DIPLOMACY ROLES
    // ===================================

    async appointCountryAmbassador(playerId, countryCode, specialization) {
        try {
            const citizen = await this.getGlobalCitizen(playerId);
            if (!citizen || citizen.global_reputation_score < this.civilizationConfig.minContributionForAmbassador) {
                throw new Error('Player does not meet ambassador requirements');
            }

            // Check ambassador count limits
            const currentAmbassadors = await this.getCountryAmbassadors(countryCode);
            if (currentAmbassadors.length >= this.civilizationConfig.maxAmbassadorsPerCountry) {
                throw new Error('Maximum ambassador count reached for this country');
            }

            // Generate ambassador ID
            const ambassadorId = `PPGCA-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
            
            // Determine ambassador rank
            const ambassadorRank = this.determineAmbassadorRank(citizen.global_reputation_score);
            
            // Create ambassador record
            const query = `
                INSERT INTO global_ambassadors 
                (id, player_id, ambassador_id, representing_country, diplomatic_specialization,
                 ambassador_rank, term_start_date, term_end_date)
                VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW() + INTERVAL '${this.civilizationConfig.ambassadorTermDays} days')
                RETURNING *
            `;
            
            const result = await this.db.query(query, [
                uuidv4(),
                playerId,
                ambassadorId,
                countryCode,
                specialization,
                ambassadorRank
            ]);
            
            const ambassador = result.rows[0];
            
            // Update citizenship level if needed
            if (citizen.citizenship_level === 'citizen' || citizen.citizenship_level === 'resident') {
                await this.updateCitizenshipLevel(playerId, 'ambassador');
            }
            
            // Grant ambassador achievement
            await this.grantDiplomaticAchievement(playerId, 'country_ambassador', 'Country Ambassador');
            
            return ambassador;
            
        } catch (error) {
            console.error('Error appointing country ambassador:', error);
            throw new Error('Failed to appoint country ambassador');
        }
    }

    determineAmbassadorRank(reputationScore) {
        if (reputationScore >= 10000) return 'chief';
        if (reputationScore >= 5000) return 'executive';
        if (reputationScore >= 2000) return 'senior';
        return 'junior';
    }

    async getCountryAmbassadors(countryCode) {
        const query = 'SELECT * FROM global_ambassadors WHERE representing_country = $1 AND is_active = true';
        const result = await this.db.query(query, [countryCode]);
        return result.rows;
    }

    async createDiplomaticMission(ambassadorId, missionData) {
        try {
            const ambassador = await this.getAmbassador(ambassadorId);
            if (!ambassador || !ambassador.is_active) {
                throw new Error('Ambassador not found or inactive');
            }

            const {
                missionType,
                missionTitle,
                missionDescription,
                targetCountries,
                targetCommunities,
                primaryObjective,
                secondaryObjectives,
                successMetrics,
                endDate,
                budgetAllocated
            } = missionData;

            const query = `
                INSERT INTO diplomatic_missions 
                (id, ambassador_id, mission_type, mission_title, mission_description,
                 target_countries, target_communities, primary_objective, secondary_objectives,
                 success_metrics, end_date, budget_allocated)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING *
            `;
            
            const result = await this.db.query(query, [
                uuidv4(),
                ambassadorId,
                missionType,
                missionTitle,
                missionDescription,
                JSON.stringify(targetCountries || []),
                JSON.stringify(targetCommunities || []),
                primaryObjective,
                JSON.stringify(secondaryObjectives || []),
                JSON.stringify(successMetrics || {}),
                endDate,
                budgetAllocated || 0
            ]);
            
            return result.rows[0];
            
        } catch (error) {
            console.error('Error creating diplomatic mission:', error);
            throw new Error('Failed to create diplomatic mission');
        }
    }

    async getAmbassador(ambassadorId) {
        const query = 'SELECT * FROM global_ambassadors WHERE id = $1';
        const result = await this.db.query(query, [ambassadorId]);
        return result.rows[0] || null;
    }

    // ===================================
    // E. PEOPLE POWER GLOBAL SUMMIT (PPGS) - GLOBAL EVENTS
    // ===================================

    async createGlobalSummit(summitData) {
        try {
            const {
                summitName,
                summitNumber,
                summitTheme,
                summitType,
                summitDate,
                durationHours,
                registrationDeadline,
                agendaItems,
                keynoteSpeakers,
                votingSessions,
                totalRewardPool
            } = summitData;

            const query = `
                INSERT INTO global_summits 
                (id, summit_name, summit_number, summit_theme, summit_type, summit_date,
                 duration_hours, registration_deadline, agenda_items, keynote_speakers,
                 voting_sessions, total_reward_pool, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'planned')
                RETURNING *
            `;
            
            const result = await this.db.query(query, [
                uuidv4(),
                summitName,
                summitNumber,
                summitTheme,
                summitType,
                summitDate,
                durationHours,
                registrationDeadline,
                JSON.stringify(agendaItems || []),
                JSON.stringify(keynoteSpeakers || []),
                JSON.stringify(votingSessions || []),
                totalRewardPool || 0
            ]);
            
            const summit = result.rows[0];
            
            // Schedule summit notifications
            await this.scheduleSummitNotifications(summit.id);
            
            return summit;
            
        } catch (error) {
            console.error('Error creating global summit:', error);
            throw new Error('Failed to create global summit');
        }
    }

    async registerForSummit(playerId, summitId) {
        try {
            const citizen = await this.getGlobalCitizen(playerId);
            if (!citizen) {
                throw new Error('Player must be a global citizen to register for summit');
            }

            // Check if summit registration is still open
            const summit = await this.getSummit(summitId);
            if (!summit || new Date() > new Date(summit.registration_deadline)) {
                throw new Error('Summit registration is closed');
            }

            // Check if already registered
            const existingRegistration = await this.getSummitRegistration(playerId, summitId);
            if (existingRegistration) {
                return existingRegistration;
            }

            // Create registration
            const query = `
                INSERT INTO summit_participations 
                (id, summit_id, player_id, registration_date)
                VALUES ($1, $2, $3, NOW())
                RETURNING *
            `;
            
            const result = await this.db.query(query, [
                uuidv4(),
                summitId,
                playerId
            ]);
            
            const registration = result.rows[0];
            
            // Update summit registration count
            await this.updateSummitRegistrationCount(summitId);
            
            return registration;
            
        } catch (error) {
            console.error('Error registering for summit:', error);
            throw new Error('Failed to register for summit');
        }
    }

    async getSummit(summitId) {
        const query = 'SELECT * FROM global_summits WHERE id = $1';
        const result = await this.db.query(query, [summitId]);
        return result.rows[0] || null;
    }

    async getSummitRegistration(playerId, summitId) {
        const query = 'SELECT * FROM summit_participations WHERE player_id = $1 AND summit_id = $2';
        const result = await this.db.query(query, [playerId, summitId]);
        return result.rows[0] || null;
    }

    async updateSummitRegistrationCount(summitId) {
        const query = `
            UPDATE global_summits 
            SET registered_participants = (
                SELECT COUNT(*) FROM summit_participations WHERE summit_id = $1
            )
            WHERE id = $1
        `;
        
        await this.db.query(query, [summitId]);
    }

    async scheduleSummitNotifications(summitId) {
        // This would be handled by a notification scheduler in production
        console.log(`Summit notifications scheduled for summit ${summitId}`);
    }

    // ===================================
    // F. PEOPLE POWER WORLD PRESIDENT (PPWP) - SYMBOLIC LEADERSHIP
    // ===================================

    async electWorldPresident(candidateId) {
        try {
            const citizen = await this.getGlobalCitizen(candidateId);
            if (!citizen || citizen.global_reputation_score < 10000) {
                throw new Error('Candidate does not meet world president requirements');
            }

            // Check if there's already an active world president
            const existingWorldPresident = await this.getCurrentWorldPresident();
            if (existingWorldPresident && existingWorldPresident.is_active) {
                throw new Error('World president position is already occupied');
            }

            // Calculate global election results
            const electionData = await this.simulateWorldPresidentialElection(candidateId);
            
            // Create world presidency
            const query = `
                INSERT INTO world_presidency 
                (id, world_president_id, presidency_number, election_date, term_start_date,
                 term_end_date, global_reputation_score, cross_country_contributions, 
                 trust_score, ethical_behavior_rating)
                VALUES ($1, $2, $3, NOW(), NOW(), NOW() + INTERVAL '${this.civilizationConfig.worldPresidentTermDays} days',
                        $4, $5, $6, $7)
                RETURNING *
            `;
            
            const result = await this.db.query(query, [
                uuidv4(),
                candidateId,
                await this.getNextPresidencyNumber(),
                citizen.global_reputation_score,
                await this.getCrossCountryContributions(candidateId),
                await this.calculateTrustScore(candidateId),
                await this.calculateEthicalRating(candidateId)
            ]);
            
            const presidency = result.rows[0];
            
            // Grant world president achievement
            await this.grantLeadershipAchievement(candidateId, 'world_president', 'World President');
            
            // Schedule term end
            await this.scheduleWorldPresidentTermEnd(presidency.id);
            
            return presidency;
            
        } catch (error) {
            console.error('Error electing world president:', error);
            throw new Error('Failed to elect world president');
        }
    }

    async getCurrentWorldPresident() {
        const query = 'SELECT * FROM world_presidency WHERE is_active = true';
        const result = await this.db.query(query);
        return result.rows[0] || null;
    }

    async simulateWorldPresidentialElection(candidateId) {
        // Get all global citizens
        const votersQuery = 'SELECT player_id, global_reputation_score FROM global_citizens WHERE is_active = true';
        const votersResult = await this.db.query(votersQuery);
        const voters = votersResult.rows;
        
        // Calculate global support based on reputation and cross-country contributions
        let totalVotes = 0;
        let votesForCandidate = 0;
        
        for (const voter of voters) {
            totalVotes += voter.global_reputation_score;
            
            if (voter.player_id === candidateId) {
                votesForCandidate += voter.global_reputation_score;
            } else {
                // Simulate support based on reputation similarity and global appeal
                const supportProbability = Math.min(voter.global_reputation_score / 10000, 0.7);
                if (Math.random() < supportProbability) {
                    votesForCandidate += voter.global_reputation_score * supportProbability;
                }
            }
        }
        
        return {
            totalVotes,
            votesForCandidate,
            winPercentage: totalVotes > 0 ? (votesForCandidate / totalVotes) : 0
        };
    }

    async proposeWorldPresidentialAction(presidencyId, actionData) {
        try {
            const presidency = await this.getWorldPresidency(presidencyId);
            if (!presidency || !presidency.is_active) {
                throw new Error('World presidency not found or inactive');
            }

            const {
                actionType,
                actionTitle,
                actionDescription,
                actionParameters,
                affectedRegions,
                expectedImpact
            } = actionData;

            const query = `
                INSERT INTO world_presidential_actions 
                (id, presidency_id, action_type, action_title, action_description,
                 action_parameters, affected_regions, expected_impact, requires_global_approval)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *
            `;
            
            const result = await this.db.query(query, [
                uuidv4(),
                presidencyId,
                actionType,
                actionTitle,
                actionDescription,
                JSON.stringify(actionParameters || {}),
                JSON.stringify(affectedRegions || []),
                JSON.stringify(expectedImpact || {}),
                true // All world president actions require global approval
            ]);
            
            return result.rows[0];
            
        } catch (error) {
            console.error('Error proposing world presidential action:', error);
            throw new Error('Failed to propose world presidential action');
        }
    }

    async getWorldPresidency(presidencyId) {
        const query = 'SELECT * FROM world_presidency WHERE id = $1';
        const result = await this.db.query(query, [presidencyId]);
        return result.rows[0] || null;
    }

    // ===================================
    // UTILITY METHODS
    // ===================================

    async calculateContributionPoints(playerId) {
        // Calculate from various activities
        const missionsQuery = `
            SELECT COUNT(*) as count FROM community_missions 
            WHERE creator_id = $1 AND status = 'completed'
        `;
        const missionsResult = await this.db.query(missionsQuery, [playerId]);
        
        const diplomaticQuery = `
            SELECT COUNT(*) as count FROM diplomatic_missions 
            WHERE ambassador_id IN (SELECT id FROM global_ambassadors WHERE player_id = $1)
            AND status = 'completed'
        `;
        const diplomaticResult = await this.db.query(diplomaticQuery, [playerId]);
        
        return (missionsResult.rows[0].count * 100) + (diplomaticResult.rows[0].count * 200);
    }

    async calculateNetworkInfluence(playerId) {
        // Calculate based on connections, leadership roles, and community impact
        const citizen = await this.getGlobalCitizen(playerId);
        if (!citizen) return 0;
        
        let influence = citizen.global_reputation_score * 0.1;
        
        // Add leadership bonuses
        if (citizen.citizenship_level === 'leader') influence += 1000;
        if (citizen.citizenship_level === 'diplomat') influence += 500;
        if (citizen.citizenship_level === 'ambassador') influence += 250;
        
        return influence;
    }

    async updateCitizenshipLevel(playerId, newLevel) {
        const query = `
            UPDATE global_citizens 
            SET citizenship_level = $1, updated_at = NOW()
            WHERE player_id = $2
            RETURNING *
        `;
        
        const result = await this.db.query(query, [newLevel, playerId]);
        return result.rows[0];
    }

    async grantCitizenshipAchievements(playerId, level) {
        // Grant achievements based on citizenship level
        const achievements = {
            citizen: ['global_citizen'],
            resident: ['active_resident'],
            ambassador: ['diplomatic_corps'],
            diplomat: ['senior_diplomat'],
            leader: ['global_leader']
        };
        
        for (const achievement of achievements[level] || []) {
            await this.grantAchievement(playerId, achievement, `Achievement: ${achievement}`);
        }
    }

    async grantCommunityAchievement(playerId, type, name) {
        await this.grantAchievement(playerId, type, name);
    }

    async grantLeadershipAchievement(playerId, type, name) {
        await this.grantAchievement(playerId, type, name);
    }

    async grantDiplomaticAchievement(playerId, type, name) {
        await this.grantAchievement(playerId, type, name);
    }

    async grantAchievement(playerId, type, name) {
        // This would integrate with the achievement system
        console.log(`Achievement granted to player ${playerId}: ${name} (${type})`);
    }

    getCountryName(countryCode) {
        // Simplified country name mapping
        const countries = {
            'UG': 'Uganda',
            'KE': 'Kenya',
            'TZ': 'Tanzania',
            'US': 'United States',
            'GB': 'United Kingdom',
            'CA': 'Canada'
        };
        return countries[countryCode] || countryCode;
    }

    async getNextPresidencyNumber() {
        const query = 'SELECT COALESCE(MAX(presidency_number), 0) + 1 as next_number FROM world_presidency';
        const result = await this.db.query(query);
        return result.rows[0].next_number;
    }

    async getCrossCountryContributions(playerId) {
        // Calculate cross-country contributions
        const query = `
            SELECT COUNT(DISTINCT dm.target_countries) as country_count
            FROM diplomatic_missions dm
            JOIN global_ambassadors ga ON dm.ambassador_id = ga.id
            WHERE ga.player_id = $1 AND dm.status = 'completed'
        `;
        
        const result = await this.db.query(query, [playerId]);
        return result.rows[0].country_count || 0;
    }

    async calculateTrustScore(playerId) {
        const reputation = await this.reputationService.getPlayerReputationDNA(playerId);
        return reputation.integrity_dna.trust_score;
    }

    async calculateEthicalRating(playerId) {
        const reputation = await this.reputationService.getPlayerReputationDNA(playerId);
        return (reputation.integrity_dna.ethical_behavior_score + reputation.integrity_dna.rule_compliance_score) / 2;
    }

    async scheduleWorldPresidentTermEnd(presidencyId) {
        // This would be handled by a job scheduler in production
        console.log(`World president term end scheduled for presidency ${presidencyId}`);
    }

    // ===================================
    // POWER BALANCE AND SAFETY
    // ===================================

    async checkPowerBalance() {
        const metrics = {
            citizenParticipation: await this.calculateCitizenParticipation(),
            ambassadorInfluence: await this.calculateAmbassadorInfluence(),
            presidentialPower: await this.calculatePresidentialPower(),
            worldPresidentSymbolic: await this.calculateWorldPresidentSymbolic()
        };
        
        // Store balance metrics
        await this.storePowerBalanceMetrics(metrics);
        
        return metrics;
    }

    async calculateCitizenParticipation() {
        const query = `
            SELECT COUNT(*) as active_citizens, 
                   (SELECT COUNT(*) FROM global_citizens WHERE is_active = true) as total_citizens
            FROM global_citizens 
            WHERE is_active = true AND last_active >= NOW() - INTERVAL '7 days'
        `;
        
        const result = await this.db.query(query);
        const { active_citizens, total_citizens } = result.rows[0];
        
        return total_citizens > 0 ? active_citizens / total_citizens : 0;
    }

    async calculateAmbassadorInfluence() {
        const query = `
            SELECT COUNT(*) as active_ambassadors,
                   AVG(influence_score) as avg_influence
            FROM global_ambassadors 
            WHERE is_active = true
        `;
        
        const result = await this.db.query(query);
        const { active_ambassadors, avg_influence } = result.rows[0];
        
        return (active_ambassadors * (avg_influence || 0)) / 10000; // Normalize
    }

    async calculatePresidentialPower() {
        const query = `
            SELECT COUNT(*) as active_presidents,
                   AVG(presidential_reputation) as avg_reputation
            FROM country_presidencies 
            WHERE is_active = true
        `;
        
        const result = await this.db.query(query);
        const { active_presidents, avg_reputation } = result.rows[0];
        
        return (active_presidents * (avg_reputation || 0)) / 10000; // Normalize
    }

    async calculateWorldPresidentSymbolic() {
        const query = `
            SELECT leadership_effectiveness 
            FROM world_presidency 
            WHERE is_active = true
        `;
        
        const result = await this.db.query(query);
        return result.rows[0]?.leadership_effectiveness || 0;
    }

    async storePowerBalanceMetrics(metrics) {
        const query = `
            INSERT INTO power_balance_metrics 
            (citizen_participation_rate, ambassador_influence_ratio, 
             presidential_power_index, world_president_symbolic_score, calculated_at)
            VALUES ($1, $2, $3, $4, NOW())
        `;
        
        await this.db.query(query, [
            metrics.citizenParticipation,
            metrics.ambassadorInfluence,
            metrics.presidentialPower,
            metrics.worldPresidentSymbolic
        ]);
    }
}
