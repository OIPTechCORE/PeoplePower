const express = require('express');
const router = express.Router();
const { TONRevenueEngine } = require('../services/tonRevenueEngine');

// Initialize TON Revenue Engine
const tonRevenueEngine = new TONRevenueEngine(
    require('../db'),
    require('../services/tonWalletService') // TON wallet integration service
);

// ===================================
// PRODUCT CATALOG ENDPOINTS
// ===================================

// Get all product catalogs
router.get('/catalog', async (req, res) => {
    try {
        const { category, userCategory } = req.query;
        
        if (category) {
            const catalog = await tonRevenueEngine.getProductCatalog(category, userCategory || 'all');
            res.json({
                success: true,
                data: catalog
            });
        } else {
            // Return all categories
            const allCatalogs = {};
            const categories = ['reputationBoost', 'educationTokens', 'civilizationAssets', 'governancePower'];
            
            for (const cat of categories) {
                allCatalogs[cat] = await tonRevenueEngine.getProductCatalog(cat, 'all');
            }
            
            res.json({
                success: true,
                data: allCatalogs
            });
        }
        
    } catch (error) {
        console.error('Error getting product catalog:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get reputation boost products
router.get('/catalog/reputation-boost', async (req, res) => {
    try {
        const { userCategory = 'casual' } = req.query;
        const catalog = await tonRevenueEngine.getProductCatalog('reputationBoost', userCategory);
        
        res.json({
            success: true,
            data: catalog
        });
        
    } catch (error) {
        console.error('Error getting reputation boost catalog:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get education token products
router.get('/catalog/education-tokens', async (req, res) => {
    try {
        const { userCategory = 'learners' } = req.query;
        const catalog = await tonRevenueEngine.getProductCatalog('educationTokens', userCategory);
        
        res.json({
            success: true,
            data: catalog
        });
        
    } catch (error) {
        console.error('Error getting education tokens catalog:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get civilization asset products
router.get('/catalog/civilization-assets', async (req, res) => {
    try {
        const { userCategory = 'countryInfluence' } = req.query;
        const catalog = await tonRevenueEngine.getProductCatalog('civilizationAssets', userCategory);
        
        res.json({
            success: true,
            data: catalog
        });
        
    } catch (error) {
        console.error('Error getting civilization assets catalog:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get governance power products
router.get('/catalog/governance-power', async (req, res) => {
    try {
        const { userCategory = 'voting' } = req.query;
        const catalog = await tonRevenueEngine.getProductCatalog('governancePower', userCategory);
        
        res.json({
            success: true,
            data: catalog
        });
        
    } catch (error) {
        console.error('Error getting governance power catalog:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===================================
// PURCHASE PROCESSING ENDPOINTS
// ===================================

// Process a purchase
router.post('/purchase', async (req, res) => {
    try {
        const { userId, category, productId, userCategory } = req.body;
        
        if (!userId || !category || !productId) {
            return res.status(400).json({ 
                error: 'userId, category, and productId are required' 
            });
        }
        
        const result = await tonRevenueEngine.processPurchase(
            userId, 
            category, 
            productId, 
            userCategory || 'casual'
        );
        
        res.json({
            success: true,
            data: result,
            message: 'Purchase processed successfully'
        });
        
    } catch (error) {
        console.error('Error processing purchase:', error);
        res.status(500).json({ error: error.message });
    }
});

// Verify TON payment (for frontend integration)
router.post('/verify-payment', async (req, res) => {
    try {
        const { userId, amount, transactionHash } = req.body;
        
        if (!userId || !amount || !transactionHash) {
            return res.status(400).json({ 
                error: 'userId, amount, and transactionHash are required' 
            });
        }
        
        // This would integrate with actual TON blockchain verification
        const paymentResult = await tonRevenueEngine.verifyTONPayment(userId, amount);
        
        res.json({
            success: paymentResult.success,
            data: paymentResult,
            message: paymentResult.success ? 'Payment verified' : 'Payment verification failed'
        });
        
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===================================
// USER PURCHASE HISTORY ENDPOINTS
// ===================================

// Get user purchase history
router.get('/user/:userId/purchases', async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 50 } = req.query;
        
        const purchases = await tonRevenueEngine.getUserPurchaseHistory(userId, parseInt(limit));
        
        res.json({
            success: true,
            data: purchases
        });
        
    } catch (error) {
        console.error('Error getting user purchase history:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user active benefits
router.get('/user/:userId/benefits', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const benefits = await tonRevenueEngine.getUserActiveBenefits(userId);
        
        res.json({
            success: true,
            data: benefits
        });
        
    } catch (error) {
        console.error('Error getting user benefits:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===================================
// SUPER ADMIN DASHBOARD ENDPOINTS
// ===================================

// Get Super Admin dashboard data
router.get('/admin/dashboard', async (req, res) => {
    try {
        // Add authentication middleware in production
        const dashboardData = await tonRevenueEngine.getSuperAdminDashboard();
        
        res.json({
            success: true,
            data: dashboardData
        });
        
    } catch (error) {
        console.error('Error getting dashboard data:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get revenue metrics
router.get('/admin/revenue', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        // Default to last 30 days if not specified
        const end = endDate ? new Date(endDate) : new Date();
        const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        const revenueMetrics = await tonRevenueEngine.getRevenueMetrics(start, end);
        
        res.json({
            success: true,
            data: revenueMetrics
        });
        
    } catch (error) {
        console.error('Error getting revenue metrics:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get daily revenue breakdown
router.get('/admin/daily-revenue', async (req, res) => {
    try {
        const { date } = req.query;
        const targetDate = date ? new Date(date) : new Date();
        
        const query = `
            SELECT 
                category,
                SUM(amount) as total_revenue,
                COUNT(*) as transaction_count,
                AVG(amount) as average_transaction
            FROM super_admin_revenue 
            WHERE DATE(recorded_at) = DATE($1)
            GROUP BY category
            ORDER BY total_revenue DESC
        `;
        
        const result = await tonRevenueEngine.db.query(query, [targetDate]);
        
        res.json({
            success: true,
            data: result.rows,
            date: targetDate
        });
        
    } catch (error) {
        console.error('Error getting daily revenue:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get top selling products
router.get('/admin/top-products', async (req, res) => {
    try {
        const { period = '7days', limit = 20 } = req.query;
        
        let dateFilter;
        switch (period) {
            case '1day':
                dateFilter = "purchase_date >= CURRENT_DATE";
                break;
            case '7days':
                dateFilter = "purchase_date >= CURRENT_DATE - INTERVAL '7 days'";
                break;
            case '30days':
                dateFilter = "purchase_date >= CURRENT_DATE - INTERVAL '30 days'";
                break;
            default:
                dateFilter = "purchase_date >= CURRENT_DATE - INTERVAL '7 days'";
        }
        
        const query = `
            SELECT 
                product_id,
                product_name,
                category,
                COUNT(*) as purchase_count,
                SUM(price) as total_revenue,
                AVG(price) as average_price
            FROM user_purchase_history 
            WHERE ${dateFilter}
            GROUP BY product_id, product_name, category
            ORDER BY total_revenue DESC
            LIMIT $1
        `;
        
        const result = await tonRevenueEngine.db.query(query, [parseInt(limit)]);
        
        res.json({
            success: true,
            data: result.rows,
            period
        });
        
    } catch (error) {
        console.error('Error getting top products:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user segmentation analytics
router.get('/admin/user-segments', async (req, res) => {
    try {
        const query = `
            SELECT 
                CASE 
                    WHEN total_spent < 100 THEN 'casual'
                    WHEN total_spent < 1000 THEN 'power'
                    WHEN total_spent < 10000 THEN 'investor'
                    ELSE 'institutional'
                END as user_segment,
                COUNT(*) as user_count,
                SUM(total_spent) as segment_revenue,
                AVG(total_spent) as avg_spent
            FROM (
                SELECT 
                    user_id,
                    SUM(price) as total_spent
                FROM user_purchase_history 
                WHERE purchase_date >= CURRENT_DATE - INTERVAL '30 days'
                GROUP BY user_id
            ) user_spending
            GROUP BY user_segment
            ORDER BY segment_revenue DESC
        `;
        
        const result = await tonRevenueEngine.db.query(query);
        
        res.json({
            success: true,
            data: result.rows
        });
        
    } catch (error) {
        console.error('Error getting user segments:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===================================
// REVENUE PROJECTIONS ENDPOINTS
// ===================================

// Get revenue projections
router.get('/admin/projections', async (req, res) => {
    try {
        const projections = await tonRevenueEngine.getRevenueProjections();
        
        res.json({
            success: true,
            data: projections
        });
        
    } catch (error) {
        console.error('Error getting projections:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get target achievement status
router.get('/admin/target-status', async (req, res) => {
    try {
        const { target = 100000 } = req.query; // Default 100,000 TON/day
        
        const todayQuery = `
            SELECT 
                COALESCE(SUM(amount), 0) as current_total,
                COUNT(*) as transaction_count,
                (COALESCE(SUM(amount), 0) / $1) * 100 as achievement_percentage
            FROM super_admin_revenue 
            WHERE DATE(recorded_at) = CURRENT_DATE
        `;
        
        const result = await tonRevenueEngine.db.query(todayQuery, [parseFloat(target)]);
        const todayData = result.rows[0];
        
        // Get hourly breakdown for today
        const hourlyQuery = `
            SELECT 
                EXTRACT(HOUR FROM recorded_at) as hour,
                SUM(amount) as hourly_revenue
            FROM super_admin_revenue 
            WHERE DATE(recorded_at) = CURRENT_DATE
            GROUP BY EXTRACT(HOUR FROM recorded_at)
            ORDER BY hour
        `;
        
        const hourlyResult = await tonRevenueEngine.db.query(hourlyQuery);
        
        res.json({
            success: true,
            data: {
                target: parseFloat(target),
                current: parseFloat(todayData.current_total),
                percentage: parseFloat(todayData.achievement_percentage),
                transactions: parseInt(todayData.transaction_count),
                hourly: hourlyResult.rows,
                status: parseFloat(todayData.achievement_percentage) >= 100 ? 'achieved' : 'in_progress'
            }
        });
        
    } catch (error) {
        console.error('Error getting target status:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===================================
// ANALYTICS ENDPOINTS
// ===================================

// Get revenue by category
router.get('/analytics/revenue-by-category', async (req, res) => {
    try {
        const { period = '7days' } = req.query;
        
        let dateFilter;
        switch (period) {
            case '1day':
                dateFilter = "recorded_at >= CURRENT_DATE";
                break;
            case '7days':
                dateFilter = "recorded_at >= CURRENT_DATE - INTERVAL '7 days'";
                break;
            case '30days':
                dateFilter = "recorded_at >= CURRENT_DATE - INTERVAL '30 days'";
                break;
            default:
                dateFilter = "recorded_at >= CURRENT_DATE - INTERVAL '7 days'";
        }
        
        const query = `
            SELECT 
                category,
                SUM(amount) as total_revenue,
                COUNT(*) as transaction_count,
                AVG(amount) as average_transaction,
                (SUM(amount) / (SELECT SUM(amount) FROM super_admin_revenue WHERE ${dateFilter}) * 100) as percentage_of_total
            FROM super_admin_revenue 
            WHERE ${dateFilter}
            GROUP BY category
            ORDER BY total_revenue DESC
        `;
        
        const result = await tonRevenueEngine.db.query(query);
        
        res.json({
            success: true,
            data: result.rows,
            period
        });
        
    } catch (error) {
        console.error('Error getting revenue by category:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user lifetime value analytics
router.get('/analytics/user-ltv', async (req, res) => {
    try {
        const query = `
            SELECT 
                user_id,
                COUNT(*) as total_purchases,
                SUM(price) as total_spent,
                AVG(price) as avg_purchase,
                MIN(purchase_date) as first_purchase,
                MAX(purchase_date) as last_purchase,
                (MAX(purchase_date) - MIN(purchase_date)) as customer_lifetime_days
            FROM user_purchase_history 
            GROUP BY user_id
            ORDER BY total_spent DESC
            LIMIT 100
        `;
        
        const result = await tonRevenueEngine.db.query(query);
        
        // Calculate overall LTV metrics
        const ltvMetrics = {
            averageLTV: result.rows.reduce((sum, row) => sum + parseFloat(row.total_spent), 0) / result.rows.length,
            totalUsers: result.rows.length,
            topSpenders: result.rows.slice(0, 10)
        };
        
        res.json({
            success: true,
            data: ltvMetrics
        });
        
    } catch (error) {
        console.error('Error getting user LTV:', error);
        res.status(500).json({ error: error.message });
    }
});

// ===================================
// HEALTH CHECK ENDPOINT
// ===================================

// Health check for TON revenue engine
router.get('/health', async (req, res) => {
    try {
        // Check database connection
        const dbCheck = await tonRevenueEngine.db.query('SELECT 1');
        
        // Check today's revenue
        const revenueCheck = await tonRevenueEngine.getSuperAdminDashboard();
        
        res.json({
            success: true,
            status: 'healthy',
            timestamp: new Date(),
            database: dbCheck.rows.length > 0 ? 'connected' : 'disconnected',
            todayRevenue: revenueCheck.today.totalRevenue,
            targetProgress: revenueCheck.today.targetProgress
        });
        
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(500).json({
            success: false,
            status: 'unhealthy',
            error: error.message
        });
    }
});

// ===================================
// ERROR HANDLING MIDDLEWARE
// ===================================

// Global error handler
router.use((error, req, res, next) => {
    console.error('TON Revenue Engine route error:', error);
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
