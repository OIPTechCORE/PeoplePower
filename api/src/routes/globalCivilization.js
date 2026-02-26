const express = require('express');
const router = express.Router();
const { GlobalCivilizationService } = require('../services/globalCivilizationService');

// Initialize service
const globalCivilizationService = new GlobalCivilizationService(
    require('../db'),
    require('./reputationEconomyService'),
    require('./reputationStakingService')
);

// ===================================
// A. PEOPLE POWER GLOBAL NETWORK (PPGN) ENDPOINTS
// ===================================

// Register as global citizen
router.post('/network/register', async (req, res) => {
    try {
        const { playerId } = req.body;
        
        if (!playerId) {
            return res.status(400).json({ error: 'Player ID is required' });
        }
        
        const citizen = await globalCivilizationService.registerGlobalCitizen(playerId);
        
        res.json({
            success: true,
            data: citizen,
            message: 'Successfully registered as global citizen'
        });
        
    } catch (error) {
        console.error('Error registering global citizen:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get global citizen profile
router.get('/network/citizen/:playerId', async (req, res) => {
    try {
        const { playerId } = req.params;
        
        const citizen = await globalCivilizationService.getGlobalCitizen(playerId);
        
        if (!citizen) {
            return res.status(404).json({ error: 'Global citizen not found' });
        }
        
        res.json({
            success: true,
            data: citizen
        });
        
    } catch (error) {
        console.error('Error getting global citizen:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update global citizen stats
router.post('/network/citizen/:playerId/update', async (req, res) => {
    try {
        const { playerId } = req.params;
        
        const updatedCitizen = await globalCivilizationService.updateGlobalCitizenStats(playerId);
        
        res.json({
            success: true,
            data: updatedCitizen,
            message: 'Global citizen stats updated'
        });
        
    } catch (error) {
        console.error('Error updating global citizen stats:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===================================
// B. PEOPLE POWER DIASPORA COMMUNITIES (PPDC) ENDPOINTS
// ===================================

// Create diaspora community
router.post('/communities/create', async (req, res) => {
    try {
        const { playerId, communityData } = req.body;
        
        if (!playerId || !communityData) {
            return res.status(400).json({ error: 'Player ID and community data are required' });
        }
        
        const community = await globalCivilizationService.createDiasporaCommunity(playerId, communityData);
        
        res.json({
            success: true,
            data: community,
            message: 'Diaspora community created successfully'
        });
        
    } catch (error) {
        console.error('Error creating diaspora community:', error);
        res.status(500).json({ error: error.message });
    }
});

// Join community
router.post('/communities/join', async (req, res) => {
    try {
        const { playerId, communityId, membershipType } = req.body;
        
        if (!playerId || !communityId) {
            return res.status(400).json({ error: 'Player ID and community ID are required' });
        }
        
        const membership = await globalCivilizationService.joinCommunity(playerId, communityId, membershipType);
        
        res.json({
            success: true,
            data: membership,
            message: 'Successfully joined community'
        });
        
    } catch (error) {
        console.error('Error joining community:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get community membership
router.get('/communities/membership/:playerId/:communityId', async (req, res) => {
    try {
        const { playerId, communityId } = req.params;
        
        const membership = await globalCivilizationService.getCommunityMembership(playerId, communityId);
        
        res.json({
            success: true,
            data: membership
        });
        
    } catch (error) {
        console.error('Error getting community membership:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create community mission
router.post('/communities/missions/create', async (req, res) => {
    try {
        const { creatorId, communityId, missionData } = req.body;
        
        if (!creatorId || !communityId || !missionData) {
            return res.status(400).json({ error: 'Creator ID, community ID, and mission data are required' });
        }
        
        const mission = await globalCivilizationService.createCommunityMission(creatorId, communityId, missionData);
        
        res.json({
            success: true,
            data: mission,
            message: 'Community mission created successfully'
        });
        
    } catch (error) {
        console.error('Error creating community mission:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===================================
// C. PEOPLE POWER GLOBAL COUNTRY PRESIDENTS (PPGCP) ENDPOINTS
// ===================================

// Elect country president
router.post('/presidents/elect', async (req, res) => {
    try {
        const { countryCode, candidateId } = req.body;
        
        if (!countryCode || !candidateId) {
            return res.status(400).json({ error: 'Country code and candidate ID are required' });
        }
        
        const presidency = await globalCivilizationService.electCountryPresident(countryCode, candidateId);
        
        res.json({
            success: true,
            data: presidency,
            message: 'Country president elected successfully'
        });
        
    } catch (error) {
        console.error('Error electing country president:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get current country president
router.get('/presidents/current/:countryCode', async (req, res) => {
    try {
        const { countryCode } = req.params;
        
        const president = await globalCivilizationService.getCurrentCountryPresident(countryCode);
        
        res.json({
            success: true,
            data: president
        });
        
    } catch (error) {
        console.error('Error getting current country president:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===================================
// D. PEOPLE POWER GLOBAL COUNTRY AMBASSADORS (PPGCA) ENDPOINTS
// ===================================

// Appoint country ambassador
router.post('/ambassadors/appoint', async (req, res) => {
    try {
        const { playerId, countryCode, specialization } = req.body;
        
        if (!playerId || !countryCode || !specialization) {
            return res.status(400).json({ error: 'Player ID, country code, and specialization are required' });
        }
        
        const ambassador = await globalCivilizationService.appointCountryAmbassador(playerId, countryCode, specialization);
        
        res.json({
            success: true,
            data: ambassador,
            message: 'Country ambassador appointed successfully'
        });
        
    } catch (error) {
        console.error('Error appointing country ambassador:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get country ambassadors
router.get('/ambassadors/country/:countryCode', async (req, res) => {
    try {
        const { countryCode } = req.params;
        
        const ambassadors = await globalCivilizationService.getCountryAmbassadors(countryCode);
        
        res.json({
            success: true,
            data: ambassadors
        });
        
    } catch (error) {
        console.error('Error getting country ambassadors:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create diplomatic mission
router.post('/ambassadors/missions/create', async (req, res) => {
    try {
        const { ambassadorId, missionData } = req.body;
        
        if (!ambassadorId || !missionData) {
            return res.status(400).json({ error: 'Ambassador ID and mission data are required' });
        }
        
        const mission = await globalCivilizationService.createDiplomaticMission(ambassadorId, missionData);
        
        res.json({
            success: true,
            data: mission,
            message: 'Diplomatic mission created successfully'
        });
        
    } catch (error) {
        console.error('Error creating diplomatic mission:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===================================
// E. PEOPLE POWER GLOBAL SUMMIT (PPGS) ENDPOINTS
// ===================================

// Create global summit
router.post('/summits/create', async (req, res) => {
    try {
        const { summitData } = req.body;
        
        if (!summitData) {
            return res.status(400).json({ error: 'Summit data is required' });
        }
        
        const summit = await globalCivilizationService.createGlobalSummit(summitData);
        
        res.json({
            success: true,
            data: summit,
            message: 'Global summit created successfully'
        });
        
    } catch (error) {
        console.error('Error creating global summit:', error);
        res.status(500).json({ error: error.message });
    }
});

// Register for summit
router.post('/summits/register', async (req, res) => {
    try {
        const { playerId, summitId } = req.body;
        
        if (!playerId || !summitId) {
            return res.status(400).json({ error: 'Player ID and summit ID are required' });
        }
        
        const registration = await globalCivilizationService.registerForSummit(playerId, summitId);
        
        res.json({
            success: true,
            data: registration,
            message: 'Successfully registered for summit'
        });
        
    } catch (error) {
        console.error('Error registering for summit:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get summit details
router.get('/summits/:summitId', async (req, res) => {
    try {
        const { summitId } = req.params;
        
        const summit = await globalCivilizationService.getSummit(summitId);
        
        if (!summit) {
            return res.status(404).json({ error: 'Summit not found' });
        }
        
        res.json({
            success: true,
            data: summit
        });
        
    } catch (error) {
        console.error('Error getting summit:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get summit registration
router.get('/summits/registration/:playerId/:summitId', async (req, res) => {
    try {
        const { playerId, summitId } = req.params;
        
        const registration = await globalCivilizationService.getSummitRegistration(playerId, summitId);
        
        res.json({
            success: true,
            data: registration
        });
        
    } catch (error) {
        console.error('Error getting summit registration:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===================================
// F. PEOPLE POWER WORLD PRESIDENT (PPWP) ENDPOINTS
// ===================================

// Elect world president
router.post('/world-president/elect', async (req, res) => {
    try {
        const { candidateId } = req.body;
        
        if (!candidateId) {
            return res.status(400).json({ error: 'Candidate ID is required' });
        }
        
        const presidency = await globalCivilizationService.electWorldPresident(candidateId);
        
        res.json({
            success: true,
            data: presidency,
            message: 'World president elected successfully'
        });
        
    } catch (error) {
        console.error('Error electing world president:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get current world president
router.get('/world-president/current', async (req, res) => {
    try {
        const president = await globalCivilizationService.getCurrentWorldPresident();
        
        res.json({
            success: true,
            data: president
        });
        
    } catch (error) {
        console.error('Error getting current world president:', error);
        res.status(500).json({ error: error.message });
    }
});

// Propose world presidential action
router.post('/world-president/actions/propose', async (req, res) => {
    try {
        const { presidencyId, actionData } = req.body;
        
        if (!presidencyId || !actionData) {
            return res.status(400).json({ error: 'Presidency ID and action data are required' });
        }
        
        const action = await globalCivilizationService.proposeWorldPresidentialAction(presidencyId, actionData);
        
        res.json({
            success: true,
            data: action,
            message: 'World presidential action proposed successfully'
        });
        
    } catch (error) {
        console.error('Error proposing world presidential action:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===================================
// POWER BALANCE AND SAFETY ENDPOINTS
// ===================================

// Check power balance
router.get('/power-balance/check', async (req, res) => {
    try {
        const metrics = await globalCivilizationService.checkPowerBalance();
        
        res.json({
            success: true,
            data: metrics,
            message: 'Power balance metrics calculated'
        });
        
    } catch (error) {
        console.error('Error checking power balance:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===================================
// ANALYTICS AND REPORTING ENDPOINTS
// ===================================

// Get global network statistics
router.get('/analytics/network-stats', async (req, res) => {
    try {
        // This would typically query the global_network_stats table
        const query = `
            SELECT * FROM global_network_stats 
            ORDER BY calculated_at DESC 
            LIMIT 30
        `;
        
        const result = await globalCivilizationService.db.query(query);
        
        res.json({
            success: true,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error getting network stats:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get community statistics
router.get('/analytics/community-stats', async (req, res) => {
    try {
        const query = `
            SELECT 
                community_type,
                COUNT(*) as total_communities,
                SUM(member_count) as total_members,
                AVG(community_reputation) as avg_reputation,
                SUM(shared_reward_pool) as total_rewards
            FROM diaspora_communities 
            WHERE is_active = true
            GROUP BY community_type
            ORDER BY total_members DESC
        `;
        
        const result = await globalCivilizationService.db.query(query);
        
        res.json({
            success: true,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error getting community stats:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get leadership statistics
router.get('/analytics/leadership-stats', async (req, res) => {
    try {
        const query = `
            SELECT 
                'presidents' as role_type,
                COUNT(*) as total_count,
                AVG(presidential_reputation) as avg_reputation
            FROM country_presidencies WHERE is_active = true
            
            UNION ALL
            
            SELECT 
                'ambassadors' as role_type,
                COUNT(*) as total_count,
                AVG(influence_score) as avg_reputation
            FROM global_ambassadors WHERE is_active = true
            
            UNION ALL
            
            SELECT 
                'world_president' as role_type,
                COUNT(*) as total_count,
                global_reputation_score as avg_reputation
            FROM world_presidency WHERE is_active = true
        `;
        
        const result = await globalCivilizationService.db.query(query);
        
        res.json({
            success: true,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error getting leadership stats:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get summit analytics
router.get('/analytics/summit-stats', async (req, res) => {
    try {
        const query = `
            SELECT 
                summit_type,
                COUNT(*) as total_summits,
                SUM(registered_participants) as total_registrations,
                SUM(actual_participants) as total_attendees,
                AVG(total_reward_pool) as avg_reward_pool
            FROM global_summits
            GROUP BY summit_type
            ORDER BY total_summits DESC
        `;
        
        const result = await globalCivilizationService.db.query(query);
        
        res.json({
            success: true,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error getting summit stats:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===================================
// SEARCH AND DISCOVERY ENDPOINTS
// ===================================

// Search communities
router.get('/search/communities', async (req, res) => {
    try {
        const { 
            type, 
            country, 
            region, 
            minMembers, 
            maxMembers,
            limit = 20 
        } = req.query;
        
        let query = `
            SELECT * FROM diaspora_communities 
            WHERE is_active = true AND is_public = true
        `;
        const params = [];
        let paramIndex = 1;
        
        if (type) {
            query += ` AND community_type = $${paramIndex++}`;
            params.push(type);
        }
        
        if (country) {
            query += ` AND primary_country = $${paramIndex++}`;
            params.push(country);
        }
        
        if (region) {
            query += ` AND region = $${paramIndex++}`;
            params.push(region);
        }
        
        if (minMembers) {
            query += ` AND member_count >= $${paramIndex++}`;
            params.push(parseInt(minMembers));
        }
        
        if (maxMembers) {
            query += ` AND member_count <= $${paramIndex++}`;
            params.push(parseInt(maxMembers));
        }
        
        query += ` ORDER BY member_count DESC, community_reputation DESC LIMIT $${paramIndex}`;
        params.push(parseInt(limit));
        
        const result = await globalCivilizationService.db.query(query, params);
        
        res.json({
            success: true,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error searching communities:', error);
        res.status(500).json({ error: error.message });
    }
});

// Search global citizens
router.get('/search/citizens', async (req, res) => {
    try {
        const { 
            skill, 
            level, 
            minReputation,
            maxReputation,
            limit = 20 
        } = req.query;
        
        let query = `
            SELECT gc.*, p.username, p.display_name 
            FROM global_citizens gc
            JOIN players p ON gc.player_id = p.id
            WHERE gc.is_active = true
        `;
        const params = [];
        let paramIndex = 1;
        
        if (skill) {
            query += ` AND (gc.primary_skill = $${paramIndex++} OR $${paramIndex} = ANY(gc.secondary_skills))`;
            params.push(skill);
            paramIndex++;
        }
        
        if (level) {
            query += ` AND gc.citizenship_level = $${paramIndex++}`;
            params.push(level);
        }
        
        if (minReputation) {
            query += ` AND gc.global_reputation_score >= $${paramIndex++}`;
            params.push(parseFloat(minReputation));
        }
        
        if (maxReputation) {
            query += ` AND gc.global_reputation_score <= $${paramIndex++}`;
            params.push(parseFloat(maxReputation));
        }
        
        query += ` ORDER BY gc.global_reputation_score DESC LIMIT $${paramIndex}`;
        params.push(parseInt(limit));
        
        const result = await globalCivilizationService.db.query(query, params);
        
        res.json({
            success: true,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error searching citizens:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===================================
// ERROR HANDLING MIDDLEWARE
// ===================================

// Global error handler
router.use((error, req, res, next) => {
    console.error('Global civilization route error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
    });
});

// 404 handler
router.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

module.exports = router;
