import { Router, Request, Response } from 'express';
import { Pool } from 'pg';

export function create900MUserInfrastructureRoutes(pool: Pool): Router {
  const router = Router();

  // ==================== 900M USER INFRASTRUCTURE API ====================
  
  // Get global user statistics
  router.get('/infrastructure/global-stats', async (req: Request, res: Response) => {
    try {
      const query = `
        SELECT * FROM global_user_summary
      `;
      const result = await pool.query(query);
      
      res.json({ 
        success: true, 
        data: result.rows[0] || {
          total_users: 0,
          active_users_7d: 0,
          active_users_30d: 0,
          active_users_1d: 0,
          total_influence: 0,
          total_pwr: 0,
          new_users_7d: 0,
          new_users_30d: 0
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get shard utilization summary
  router.get('/infrastructure/shard-utilization', async (req: Request, res: Response) => {
    try {
      const query = `
        SELECT * FROM shard_utilization_summary
        ORDER BY utilization_percentage DESC
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

  // Get regional performance summary
  router.get('/infrastructure/regional-performance', async (req: Request, res: Response) => {
    try {
      const query = `
        SELECT * FROM regional_performance_summary
        ORDER BY total_users DESC
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

  // Get global performance metrics
  router.get('/infrastructure/performance-metrics', async (req: Request, res: Response) => {
    try {
      const { days = 7 } = req.query;
      
      const query = `
        SELECT * FROM global_performance_metrics 
        WHERE metric_date >= CURRENT_DATE - INTERVAL '${days} days'
        ORDER BY metric_date DESC
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

  // Get shard performance metrics
  router.get('/infrastructure/shard-performance', async (req: Request, res: Response) => {
    try {
      const { shardId, days = 7 } = req.query;
      
      let query = `
        SELECT * FROM shard_performance_metrics 
        WHERE metric_date >= CURRENT_DATE - INTERVAL '${days} days'
      `;
      
      const params = [];
      if (shardId) {
        query += ' AND shard_id = $1';
        params.push(shardId);
      }
      
      query += ' ORDER BY metric_date DESC';
      
      const result = await pool.query(query, params);
      
      res.json({ 
        success: true, 
        data: result.rows
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get global economic metrics
  router.get('/infrastructure/economic-metrics', async (req: Request, res: Response) => {
    try {
      const { days = 30 } = req.query;
      
      const query = `
        SELECT * FROM global_economic_metrics 
        WHERE metric_date >= CURRENT_DATE - INTERVAL '${days} days'
        ORDER BY metric_date DESC
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

  // Get regional economic metrics
  router.get('/infrastructure/regional-economic-metrics', async (req: Request, res: Response) => {
    try {
      const { region, country, days = 30 } = req.query;
      
      let query = `
        SELECT * FROM regional_economic_metrics 
        WHERE metric_date >= CURRENT_DATE - INTERVAL '${days} days'
      `;
      
      const params = [];
      if (region) {
        query += ' AND region = $1';
        params.push(region);
      }
      if (country) {
        query += ' AND country = $' + (params.length + 1);
        params.push(country);
      }
      
      query += ' ORDER BY metric_date DESC';
      
      const result = await pool.query(query, params);
      
      res.json({ 
        success: true, 
        data: result.rows
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get global content delivery metrics
  router.get('/infrastructure/content-metrics', async (req: Request, res: Response) => {
    try {
      const { days = 7 } = req.query;
      
      const query = `
        SELECT * FROM global_content_metrics 
        WHERE metric_date >= CURRENT_DATE - INTERVAL '${days} days'
        ORDER BY metric_date DESC
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

  // Get global security metrics
  router.get('/infrastructure/security-metrics', async (req: Request, res: Response) => {
    try {
      const { days = 7 } = req.query;
      
      const query = `
        SELECT * FROM global_security_metrics 
        WHERE metric_date >= CURRENT_DATE - INTERVAL '${days} days'
        ORDER BY metric_date DESC
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

  // Get global compliance metrics
  router.get('/infrastructure/compliance-metrics', async (req: Request, res: Response) => {
    try {
      const { days = 30 } = req.query;
      
      const query = `
        SELECT * FROM global_compliance_metrics 
        WHERE metric_date >= CURRENT_DATE - INTERVAL '${days} days'
        ORDER BY metric_date DESC
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

  // Get infrastructure health status
  router.get('/infrastructure/health-status', async (req: Request, res: Response) => {
    try {
      const { serviceType, region } = req.query;
      
      let query = `
        SELECT * FROM global_infrastructure_health 
        WHERE last_check >= CURRENT_TIMESTAMP - INTERVAL '5 minutes'
      `;
      
      const params = [];
      if (serviceType) {
        query += ' AND service_type = $1';
        params.push(serviceType);
      }
      if (region) {
        query += ' AND region = $' + (params.length + 1);
        params.push(region);
      }
      
      query += ' ORDER BY service_name';
      
      const result = await pool.query(query, params);
      
      res.json({ 
        success: true, 
        data: result.rows
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get cost tracking information
  router.get('/infrastructure/cost-tracking', async (req: Request, res: Response) => {
    try {
      const { startDate, endDate, category, region } = req.query;
      
      let query = `
        SELECT * FROM global_cost_tracking 
        WHERE cost_date >= $1 AND cost_date <= $2
      `;
      
      const params = [startDate || '2024-01-01', endDate || CURRENT_DATE];
      
      if (category) {
        query += ' AND service_category = $' + (params.length + 1);
        params.push(category);
      }
      if (region) {
        query += ' AND region = $' + (params.length + 1);
        params.push(region);
      }
      
      query += ' ORDER BY cost_date DESC';
      
      const result = await pool.query(query, params);
      
      res.json({ 
        success: true, 
        data: result.rows
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get capacity planning information
  router.get('/infrastructure/capacity-planning', async (req: Request, res: Response) => {
    try {
      const { service, region, urgencyLevel } = req.query;
      
      let query = `
        SELECT * FROM global_capacity_planning 
        WHERE planning_date >= CURRENT_DATE
      `;
      
      const params = [];
      if (service) {
        query += ' AND service_name = $1';
        params.push(service);
      }
      if (region) {
        query += ' AND region = $' + (params.length + 1);
        params.push(region);
      }
      if (urgencyLevel) {
        query += ' AND urgency_level = $' + (params.length + 1);
        params.push(urgencyLevel);
      }
      
      query += ' ORDER BY urgency_level DESC, planning_date ASC';
      
      const result = await pool.query(query, params);
      
      res.json({ 
        success: true, 
        data: result.rows
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get global leaderboard
  router.get('/infrastructure/global-leaderboard', async (req: Request, res: Response) => {
    try {
      const { type, category = 'all_time', limit = 100 } = req.query;
      
      const query = `
        SELECT * FROM global_leaderboard 
        WHERE leaderboard_type = $1 AND category = $2
        ORDER BY rank_position ASC
        LIMIT $3
      `;
      
      const result = await pool.query(query, [type, category, limit]);
      
      res.json({ 
        success: true, 
        data: result.rows
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Record analytics event
  router.post('/infrastructure/analytics-event', async (req: Request, res: Response) => {
    try {
      const { userId, eventType, eventData, region, country, deviceType, appVersion } = req.body;
      
      // Get user's shard ID
      const shardQuery = `
        SELECT shard_id FROM user_shard_map WHERE user_id = $1
      `;
      const shardResult = await pool.query(shardQuery, [userId]);
      
      const shardId = shardResult.rows[0]?.shard_id || null;
      
      // Insert analytics event
      const insertQuery = `
        INSERT INTO global_analytics_events 
        (user_id, event_type, event_data, shard_id, region, country, device_type, app_version)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      const result = await pool.query(insertQuery, [
        userId, eventType, eventData, shardId, region, country, deviceType, appVersion
      ]);
      
      res.json({ 
        success: true, 
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Update shard status
  router.post('/infrastructure/shard-status', async (req: Request, res: Response) => {
    try {
      const { shardId, status, currentUsers } = req.body;
      
      const updateQuery = `
        UPDATE shard_configuration 
        SET status = $1, current_users = $2, updated_at = NOW()
        WHERE shard_id = $3
        RETURNING *
      `;
      const result = await pool.query(updateQuery, [status, currentUsers, shardId]);
      
      res.json({ 
        success: true, 
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Update infrastructure health
  router.post('/infrastructure/health-update', async (req: Request, res: Response) => {
    try {
      const { serviceName, serviceType, region, status, uptimePercentage, responseTimeMs, errorRate } = req.body;
      
      const updateQuery = `
        INSERT INTO global_infrastructure_health 
        (service_name, service_type, region, status, uptime_percentage, response_time_ms, error_rate)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (service_name, service_type, region) 
        DO UPDATE SET 
          status = EXCLUDED.status,
          uptime_percentage = EXCLUDED.uptime_percentage,
          response_time_ms = EXCLUDED.response_time_ms,
          error_rate = EXCLUDED.error_rate,
          last_check = NOW(),
          updated_at = NOW()
        RETURNING *
      `;
      const result = await pool.query(updateQuery, [
        serviceName, serviceType, region, status, uptimePercentage, responseTimeMs, errorRate
      ]);
      
      res.json({ 
        success: true, 
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get infrastructure dashboard summary
  router.get('/infrastructure/dashboard', async (req: Request, res: Response) => {
    try {
      // Get global stats
      const globalStatsQuery = `SELECT * FROM global_user_summary`;
      const globalStats = await pool.query(globalStatsQuery);
      
      // Get shard utilization
      const shardUtilizationQuery = `
        SELECT 
          COUNT(*) as total_shards,
          COUNT(CASE WHEN utilization_percentage > 80 THEN 1 END) as high_utilization_shards,
          COUNT(CASE WHEN utilization_percentage > 90 THEN 1 END) as critical_utilization_shards,
          AVG(utilization_percentage) as avg_utilization
        FROM shard_utilization_summary
      `;
      const shardUtilization = await pool.query(shardUtilizationQuery);
      
      // Get infrastructure health
      const healthQuery = `
        SELECT 
          COUNT(*) as total_services,
          COUNT(CASE WHEN status = 'healthy' THEN 1 END) as healthy_services,
          COUNT(CASE WHEN status = 'degraded' THEN 1 END) as degraded_services,
          COUNT(CASE WHEN status = 'critical' THEN 1 END) as critical_services,
          AVG(uptime_percentage) as avg_uptime
        FROM global_infrastructure_health
      `;
      const health = await pool.query(healthQuery);
      
      // Get recent performance
      const performanceQuery = `
        SELECT * FROM global_performance_metrics 
        ORDER BY metric_date DESC 
        LIMIT 1
      `;
      const performance = await pool.query(performanceQuery);
      
      // Get cost summary
      const costQuery = `
        SELECT 
          SUM(cost_usd) as total_cost,
          AVG(cost_per_user) as avg_cost_per_user
        FROM global_cost_tracking 
        WHERE cost_date >= CURRENT_DATE - INTERVAL '30 days'
      `;
      const cost = await pool.query(costQuery);
      
      res.json({ 
        success: true, 
        data: {
          globalStats: globalStats.rows[0] || {},
          shardUtilization: shardUtilization.rows[0] || {},
          infrastructureHealth: health.rows[0] || {},
          recentPerformance: performance.rows[0] || {},
          costSummary: cost.rows[0] || {}
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  return router;
}
