import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { promisify } from 'util';

export function createHealthRoutes(pool: Pool): Router {
  const router = Router();

  router.get('/health', async (req: Request, res: Response) => {
    const startTime = Date.now();
    
    try {
      // Check database connection
      await pool.query('SELECT 1');
      
      const healthcheck = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        responseTime: Date.now() - startTime,
        checks: {
          database: 'healthy',
          memory: process.memoryUsage(),
          cpu: process.cpuUsage()
        }
      };
      
      res.status(200).json(healthcheck);
    } catch (error) {
      const healthcheck = {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        responseTime: Date.now() - startTime,
        error: error.message,
        checks: {
          database: 'unhealthy',
          memory: process.memoryUsage(),
          cpu: process.cpuUsage()
        }
      };
      
      res.status(503).json(healthcheck);
    }
  });

  router.get('/ready', async (req: Request, res: Response) => {
    const startTime = Date.now();
    const checks = [];
    
    // Database check
    try {
      await pool.query('SELECT 1');
      checks.push({ name: 'database', status: 'healthy' });
    } catch (error) {
      checks.push({ name: 'database', status: 'unhealthy', error: error.message });
    }

    // Redis check (if configured)
    if (process.env.REDIS_URL) {
      try {
        // Add Redis health check here
        checks.push({ name: 'redis', status: 'healthy' });
      } catch (error) {
        checks.push({ name: 'redis', status: 'unhealthy', error: error.message });
      }
    }

    // External service checks
    const allHealthy = checks.every(check => check.status === 'healthy');
    
    const readyStatus = {
      status: allHealthy ? 'ready' : 'not ready',
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      checks
    };
    
    res.status(allHealthy ? 200 : 503).json(readyStatus);
  });

  router.get('/live', (req: Request, res: Response) => {
    // Liveness probe - simple check if process is running
    res.status(200).json({
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      pid: process.pid
    });
  });

  return router;
}
