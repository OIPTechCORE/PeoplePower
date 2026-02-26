const express = require('express');
const router = express.Router();
const { LivingWorldMapEngine } = require('../services/livingWorldMapEngine');

// Initialize engine
const livingWorldMapEngine = new LivingWorldMapEngine(
    require('../db'),
    require('./globalCivilization'),
    require('./reputationEconomyService')
);

// Start real-time updates
livingWorldMapEngine.startRealTimeUpdates();

// ===================================
// 1. PLAYER ACTION PROCESSING
// ===================================

// Process player action that affects the world map
router.post('/actions/process', async (req, res) => {
    try {
        const { playerId, actionData } = req.body;
        
        if (!playerId || !actionData) {
            return res.status(400).json({ error: 'Player ID and action data are required' });
        }
        
        const result = await livingWorldMapEngine.processPlayerAction(playerId, actionData);
        
        res.json({
            success: true,
            data: result,
            message: 'Player action processed successfully'
        });
        
    } catch (error) {
        console.error('Error processing player action:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===================================
// 2. WORLD MAP STATE
// ===================================

// Get complete world map state
router.get('/world/state', async (req, res) => {
    try {
        const worldState = await livingWorldMapEngine.getWorldMapState();
        
        res.json({
            success: true,
            data: worldState
        });
        
    } catch (error) {
        console.error('Error getting world map state:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get specific country state
router.get('/country/:countryCode', async (req, res) => {
    try {
        const { countryCode } = req.params;
        
        const country = await livingWorldMapEngine.getCountryByCode(countryCode);
        
        if (!country) {
            return res.status(404).json({ error: 'Country not found' });
        }
        
        const metrics = await livingWorldMapEngine.getCountryMetrics(country.id);
        const visualEffects = await livingWorldMapEngine.getActiveVisualEffects(country.id);
        
        res.json({
            success: true,
            data: {
                country,
                metrics,
                visualEffects
            }
        });
        
    } catch (error) {
        console.error('Error getting country state:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===================================
// 3. VISUAL EVOLUTION SYSTEM
// ===================================

// Get evolution stages
router.get('/evolution/stages', async (req, res) => {
    try {
        const query = `
            SELECT * FROM evolution_stages 
            ORDER BY stage_number ASC
        `;
        
        const result = await livingWorldMapEngine.db.query(query);
        
        res.json({
            success: true,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error getting evolution stages:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get country visual assets
router.get('/country/:countryCode/assets', async (req, res) => {
    try {
        const { countryCode } = req.params;
        
        const country = await livingWorldMapEngine.getCountryByCode(countryCode);
        if (!country) {
            return res.status(404).json({ error: 'Country not found' });
        }
        
        const query = `
            SELECT * FROM country_visual_assets 
            WHERE country_id = $1 AND is_unlocked = true
            ORDER BY unlocked_at_stage ASC, asset_name ASC
        `;
        
        const result = await livingWorldMapEngine.db.query(query, [country.id]);
        
        res.json({
            success: true,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error getting country visual assets:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===================================
// 4. REAL-TIME ACTIVITY FEED
// ===================================

// Get recent world events
router.get('/events/recent', async (req, res) => {
    try {
        const { limit = 50, countryCode } = req.query;
        
        let query = `
            SELECT we.*, wc.country_name, wc.country_code, p.username, p.display_name
            FROM world_events we
            LEFT JOIN world_countries wc ON we.country_id = wc.id
            LEFT JOIN players p ON we.player_id = p.id
            WHERE we.created_at >= NOW() - INTERVAL '24 hours'
        `;
        const params = [];
        
        if (countryCode) {
            query += ` AND wc.country_code = $${params.length + 1}`;
            params.push(countryCode);
        }
        
        query += ` ORDER BY we.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        
        const result = await livingWorldMapEngine.db.query(query, params);
        
        res.json({
            success: true,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error getting recent world events:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get active visual effects
router.get('/effects/active', async (req, res) => {
    try {
        const { countryCode } = req.query;
        
        let query = `
            SELECT ame.*, wc.country_name, wc.country_code
            FROM active_map_effects ame
            JOIN world_countries wc ON ame.country_id = wc.id
            WHERE ame.expires_at > NOW()
        `;
        const params = [];
        
        if (countryCode) {
            query += ` AND wc.country_code = $${params.length + 1}`;
            params.push(countryCode);
        }
        
        query += ` ORDER BY ame.started_at DESC`;
        
        const result = await livingWorldMapEngine.db.query(query, params);
        
        res.json({
            success: true,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error getting active visual effects:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===================================
// 5. COUNTRY DNA SYSTEM
// ===================================

// Get country DNA analysis
router.get('/country/:countryCode/dna', async (req, res) => {
    try {
        const { countryCode } = req.params;
        
        const country = await livingWorldMapEngine.getCountryByCode(countryCode);
        if (!country) {
            return res.status(404).json({ error: 'Country not found' });
        }
        
        const dna = await livingWorldMapEngine.analyzeCountryDNA(country.id);
        
        res.json({
            success: true,
            data: dna
        });
        
    } catch (error) {
        console.error('Error getting country DNA:', error);
        res.status(500).json({ error: error.message });
    }
});

// Trigger DNA analysis for all countries
router.post('/dna/analyze-all', async (req, res) => {
    try {
        const countriesQuery = 'SELECT id FROM world_countries';
        const countriesResult = await livingWorldMapEngine.db.query(countriesQuery);
        
        const analyses = [];
        for (const country of countriesResult.rows) {
            const dna = await livingWorldMapEngine.analyzeCountryDNA(country.id);
            analyses.push({ countryId: country.id, dna });
        }
        
        res.json({
            success: true,
            data: analyses,
            message: 'DNA analysis completed for all countries'
        });
        
    } catch (error) {
        console.error('Error analyzing all country DNA:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===================================
// 6. AI CIVILIZATION BRAIN
// ===================================

// Get civilization balance metrics
router.get('/ai/balance-metrics', async (req, res) => {
    try {
        const balanceMetrics = await livingWorldMapEngine.calculateCivilizationBalance();
        
        res.json({
            success: true,
            data: balanceMetrics
        });
        
    } catch (error) {
        console.error('Error getting balance metrics:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get AI decisions
router.get('/ai/decisions', async (req, res) => {
    try {
        const query = `
            SELECT * FROM ai_civilization_decisions 
            WHERE is_active = true 
            ORDER BY applied_at DESC
        `;
        
        const result = await livingWorldMapEngine.db.query(query);
        
        res.json({
            success: true,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error getting AI decisions:', error);
        res.status(500).json({ error: error.message });
    }
});

// Trigger AI balancing
router.post('/ai/balance', async (req, res) => {
    try {
        const balanceMetrics = await livingWorldMapEngine.calculateCivilizationBalance();
        const decisions = await livingWorldMapEngine.executeAIBalancing(balanceMetrics);
        
        res.json({
            success: true,
            data: decisions,
            message: 'AI balancing executed'
        });
        
    } catch (error) {
        console.error('Error triggering AI balancing:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===================================
// 7. GLOBAL INFLUENCE NETWORK
// ===================================

// Get influence connections
router.get('/network/connections', async (req, res) => {
    try {
        const { countryCode } = req.query;
        
        let query = `
            SELECT 
                cic.*, 
                source_wc.country_name as source_country_name,
                source_wc.country_code as source_country_code,
                target_wc.country_name as target_country_name,
                target_wc.country_code as target_country_code
            FROM country_influence_connections cic
            JOIN world_countries source_wc ON cic.source_country_id = source_wc.id
            JOIN world_countries target_wc ON cic.target_country_id = target_wc.id
            WHERE cic.is_active = true
        `;
        const params = [];
        
        if (countryCode) {
            query += ` AND (source_wc.country_code = $${params.length + 1} OR target_wc.country_code = $${params.length + 1})`;
            params.push(countryCode);
        }
        
        query += ` ORDER BY cic.influence_strength DESC`;
        
        const result = await livingWorldMapEngine.db.query(query, params);
        
        res.json({
            success: true,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error getting influence connections:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create influence connection
router.post('/network/connect', async (req, res) => {
    try {
        const { sourceCountryCode, targetCountryCode, connectionType, strength } = req.body;
        
        if (!sourceCountryCode || !targetCountryCode || !connectionType) {
            return res.status(400).json({ error: 'Source country, target country, and connection type are required' });
        }
        
        const sourceCountry = await livingWorldMapEngine.getCountryByCode(sourceCountryCode);
        const targetCountry = await livingWorldMapEngine.getCountryByCode(targetCountryCode);
        
        if (!sourceCountry || !targetCountry) {
            return res.status(404).json({ error: 'One or both countries not found' });
        }
        
        const connection = await livingWorldMapEngine.createInfluenceConnection(
            sourceCountry.id, 
            targetCountry.id, 
            connectionType, 
            strength
        );
        
        res.json({
            success: true,
            data: connection,
            message: 'Influence connection created successfully'
        });
        
    } catch (error) {
        console.error('Error creating influence connection:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get collaborative missions
router.get('/missions/collaborative', async (req, res) => {
    try {
        const query = `
            SELECT 
                cm.*,
                source_wc.country_name as lead_country_name,
                source_wc.country_code as lead_country_code
            FROM collaborative_missions cm
            JOIN world_countries source_wc ON cm.lead_country_id = source_wc.id
            WHERE cm.status IN ('proposed', 'active')
            ORDER BY cm.proposed_at DESC
        `;
        
        const result = await livingWorldMapEngine.db.query(query);
        
        res.json({
            success: true,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error getting collaborative missions:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===================================
// 8. HISTORICAL MEMORY LAYER
// ===================================

// Get historical world events
router.get('/history/events', async (req, res) => {
    try {
        const { limit = 20, countryCode, significance } = req.query;
        
        let query = `
            SELECT hwe.*, wc.country_name, wc.country_code
            FROM historical_world_events hwe
            LEFT JOIN world_countries wc ON hwe.country_id = wc.id
            WHERE 1=1
        `;
        const params = [];
        
        if (countryCode) {
            query += ` AND wc.country_code = $${params.length + 1}`;
            params.push(countryCode);
        }
        
        if (significance) {
            query += ` AND hwe.significance_level >= $${params.length + 1}`;
            params.push(parseInt(significance));
        }
        
        query += ` ORDER BY hwe.event_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        
        const result = await livingWorldMapEngine.db.query(query, params);
        
        res.json({
            success: true,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error getting historical events:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get country evolution timeline
router.get('/country/:countryCode/timeline', async (req, res) => {
    try {
        const { countryCode } = req.params;
        
        const country = await livingWorldMapEngine.getCountryByCode(countryCode);
        if (!country) {
            return res.status(404).json({ error: 'Country not found' });
        }
        
        const query = `
            SELECT * FROM country_evolution_timeline 
            WHERE country_id = $1 
            ORDER BY timeline_date DESC 
            LIMIT 50
        `;
        
        const result = await livingWorldMapEngine.db.query(query, [country.id]);
        
        res.json({
            success: true,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error getting country timeline:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create historical event
router.post('/history/create', async (req, res) => {
    try {
        const eventData = req.body;
        
        const historicalEvent = await livingWorldMapEngine.createHistoricalEvent(eventData);
        
        res.json({
            success: true,
            data: historicalEvent,
            message: 'Historical event created successfully'
        });
        
    } catch (error) {
        console.error('Error creating historical event:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===================================
// 9. ECONOMIC LINKAGE
// ===================================

// Get economic conditions
router.get('/economy/conditions', async (req, res) => {
    try {
        const { countryCode } = req.query;
        
        let query = `
            SELECT mec.*, wc.country_name, wc.country_code
            FROM map_economic_conditions mec
            JOIN world_countries wc ON mec.country_id = wc.id
        `;
        const params = [];
        
        if (countryCode) {
            query += ` WHERE wc.country_code = $${params.length + 1}`;
            params.push(countryCode);
        }
        
        const result = await livingWorldMapEngine.db.query(query, params);
        
        res.json({
            success: true,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error getting economic conditions:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get regional economic bonuses
router.get('/economy/regional-bonuses', async (req, res) => {
    try {
        const { region } = req.query;
        
        let query = `
            SELECT * FROM regional_economic_bonuses 
            WHERE is_active = true
        `;
        const params = [];
        
        if (region) {
            query += ` AND region_name = $${params.length + 1}`;
            params.push(region);
        }
        
        query += ` ORDER BY calculated_at DESC`;
        
        const result = await livingWorldMapEngine.db.query(query, params);
        
        res.json({
            success: true,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error getting regional bonuses:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===================================
// 10. EMOTIONAL ATTACHMENT ENGINE
// ===================================

// Get player attachments
router.get('/attachments/player/:playerId', async (req, res) => {
    try {
        const { playerId } = req.params;
        
        const query = `
            SELECT 
                pca.*, 
                wc.country_name, 
                wc.country_code,
                wc.evolution_stage,
                wc.global_influence
            FROM player_country_attachments pca
            JOIN world_countries wc ON pca.country_id = wc.id
            WHERE pca.player_id = $1 AND pca.is_active = true
            ORDER BY pca.emotional_bond_strength DESC
        `;
        
        const result = await livingWorldMapEngine.db.query(query, [playerId]);
        
        res.json({
            success: true,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error getting player attachments:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get country attachments (players attached to a country)
router.get('/attachments/country/:countryCode', async (req, res) => {
    try {
        const { countryCode } = req.params;
        
        const country = await livingWorldMapEngine.getCountryByCode(countryCode);
        if (!country) {
            return res.status(404).json({ error: 'Country not found' });
        }
        
        const query = `
            SELECT 
                pca.*, 
                p.username, 
                p.display_name
            FROM player_country_attachments pca
            JOIN players p ON pca.player_id = p.id
            WHERE pca.country_id = $1 AND pca.is_active = true
            ORDER BY pca.emotional_bond_strength DESC
            LIMIT 50
        `;
        
        const result = await livingWorldMapEngine.db.query(query, [country.id]);
        
        res.json({
            success: true,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error getting country attachments:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get homeland protection actions
router.get('/attachments/protection-actions/:countryCode', async (req, res) => {
    try {
        const { countryCode } = req.params;
        
        const country = await livingWorldMapEngine.getCountryByCode(countryCode);
        if (!country) {
            return res.status(404).json({ error: 'Country not found' });
        }
        
        const query = `
            SELECT 
                hpa.*, 
                p.username, 
                p.display_name
            FROM homeland_protection_actions hpa
            JOIN players p ON hpa.player_id = p.id
            WHERE hpa.country_id = $1
            ORDER BY hpa.created_at DESC
            LIMIT 20
        `;
        
        const result = await livingWorldMapEngine.db.query(query, [country.id]);
        
        res.json({
            success: true,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error getting protection actions:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===================================
// ANALYTICS AND DASHBOARD ENDPOINTS
// ===================================

// Get world statistics dashboard
router.get('/analytics/dashboard', async (req, res) => {
    try {
        const query = `
            SELECT 
                COUNT(*) as total_countries,
                AVG(activity_energy) as avg_energy,
                AVG(unity_level) as avg_unity,
                AVG(knowledge_index) as avg_knowledge,
                AVG(economy_strength) as avg_economy,
                AVG(stability_factor) as avg_stability,
                AVG(global_influence) as avg_influence,
                SUM(total_actions_ever) as total_actions,
                COUNT(CASE WHEN evolution_stage = 5 THEN 1 END) as beacon_nations,
                COUNT(CASE WHEN evolution_stage >= 3 THEN 1 END) as civilization_nodes
            FROM world_countries
        `;
        
        const result = await livingWorldMapEngine.db.query(query);
        
        res.json({
            success: true,
            data: result.rows[0]
        });
        
    } catch (error) {
        console.error('Error getting dashboard analytics:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get top countries by influence
router.get('/analytics/top-countries', async (req, res) => {
    try {
        const { limit = 10, metric = 'global_influence' } = req.query;
        
        const query = `
            SELECT 
                id, country_code, country_name, evolution_stage, 
                activity_energy, unity_level, knowledge_index, economy_strength, 
                stability_factor, global_influence, total_actions_ever
            FROM world_countries 
            ORDER BY ${metric} DESC 
            LIMIT $1
        `;
        
        const result = await livingWorldMapEngine.db.query(query, [parseInt(limit)]);
        
        res.json({
            success: true,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error getting top countries:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get evolution stage distribution
router.get('/analytics/evolution-distribution', async (req, res) => {
    try {
        const query = `
            SELECT 
                evolution_stage,
                COUNT(*) as country_count,
                AVG(global_influence) as avg_influence
            FROM world_countries 
            GROUP BY evolution_stage 
            ORDER BY evolution_stage ASC
        `;
        
        const result = await livingWorldMapEngine.db.query(query);
        
        res.json({
            success: true,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error getting evolution distribution:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===================================
// ERROR HANDLING MIDDLEWARE
// ===================================

// Global error handler
router.use((error, req, res, next) => {
    console.error('Living World Map route error:', error);
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
