import { Request, Response, NextFunction } from 'express';
import { performance } from 'perf_hooks';
import { logger } from '../utils/logger';

// Enhanced performance monitoring middleware
export function enhancedPerformanceMonitor(req: Request, res: Response, next: NextFunction) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const startTime = performance.now();
  const startMemory = process.memoryUsage();
  const startCpu = process.cpuUsage();

  // Store performance data in request
  (req as any).performance = {
    requestId,
    startTime,
    startMemory,
    startCpu,
    databaseQueries: [],
    cacheHits: 0,
    cacheMisses: 0,
    errors: []
  };

  // Override res.json to capture response time
  const originalJson = res.json;
  res.json = function(data: any) {
    const endTime = performance.now();
    const endMemory = process.memoryUsage();
    const endCpu = process.cpuUsage(startCpu);

    const duration = endTime - startTime;
    const memoryDelta = {
      rss: endMemory.rss - startMemory.rss,
      heapUsed: endMemory.heapUsed - startMemory.heapUsed,
      heapTotal: endMemory.heapTotal - startMemory.heapTotal,
      external: endMemory.external - startMemory.external,
      arrayBuffers: endMemory.arrayBuffers - startMemory.arrayBuffers
    };

    // Log performance metrics
    logger.info('Request performance', {
      requestId,
      method: req.method,
      url: req.originalUrl,
      duration,
      memoryDelta,
      cpuUsage: endCpu,
      dbQueries: (req as any).performance.databaseQueries.length,
      cacheHits: (req as any).performance.cacheHits,
      cacheMisses: (req as any).performance.cacheMisses,
      errors: (req as any).performance.errors.length
    });

    // Check for performance issues
    if (duration > 5000) {
      logger.warn('Slow response detected', {
        requestId,
        url: req.originalUrl,
        duration,
        threshold: 5000
      });
    }

    if (memoryDelta.heapUsed > 50 * 1024 * 1024) { // 50MB
      logger.warn('High memory usage detected', {
        requestId,
        memoryIncrease: memoryDelta.heapUsed / 1024 / 1024,
        threshold: 50
      });
    }

    return originalJson.call(this, data);
  };

  next();
}

// Database connection pool monitoring
export function monitorDatabasePool(pool: any) {
  setInterval(() => {
    const poolStats = {
      totalCount: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount
    };

    logger.info('Database pool status', poolStats);

    // Alert if pool is under stress
    if (pool.waitingCount > 5) {
      logger.warn('Database pool under stress', {
        waitingCount: pool.waitingCount,
        totalCount: pool.totalCount
      });
    }

    if (pool.idleCount === 0) {
      logger.warn('Database pool exhausted', {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount
      });
    }
  }, 30000); // Check every 30 seconds
}

// Request queuing monitoring
export function monitorRequestQueue() {
  const activeRequests = new Set<string>();

  return (req: Request, res: Response, next: NextFunction) => {
    const requestId = (req as any).performance?.requestId || `req_${Date.now()}`;
    
    activeRequests.add(requestId);

    // Log queue size
    if (activeRequests.size > 50) {
      logger.warn('High request queue detected', {
        queueSize: activeRequests.size,
        threshold: 50
      });
    }

    // Clean up on response finish
    res.on('finish', () => {
      activeRequests.delete(requestId);
    });

    next();
  };
}

// Event loop lag monitoring
export function monitorEventLoopLag() {
  setInterval(() => {
    const start = process.hrtime.bigint();
    
    setImmediate(() => {
      const lag = Number(process.hrtime.bigint() - start) / 1000000; // Convert to milliseconds
      
      logger.debug('Event loop lag', { lag });

      if (lag > 100) { // 100ms threshold
        logger.warn('High event loop lag detected', {
          lag,
          threshold: 100
        });
      }
    });
  }, 5000); // Check every 5 seconds
}

// Garbage collection monitoring
export function monitorGarbageCollection() {
  const gcStats = {
    total: 0,
    scavange: 0,
    markSweepCompact: 0,
    incrementalMarking: 0,
    weakPhantom: 0
  };

  // Override GC if available
  if (global.gc) {
    const originalGC = global.gc;
    
    (global as any).gc = function(): void {
      const start = performance.now();
      originalGC();
      const duration = performance.now() - start;
      
      gcStats.total++;
      logger.debug('Garbage collection completed', {
        duration,
        memoryBefore: process.memoryUsage(),
        memoryAfter: process.memoryUsage()
      });

      if (duration > 100) {
        logger.warn('Long garbage collection pause', {
          duration,
          threshold: 100
        });
      }
    };
  }

  return gcStats;
}

// Performance bottleneck detection
export function detectPerformanceBottlenecks() {
  const metrics = {
    slowRequests: 0,
    memoryLeaks: 0,
    dbOverload: 0,
    cacheMisses: 0
  };

  return {
    recordSlowRequest: () => { metrics.slowRequests++; },
    recordMemoryLeak: () => { metrics.memoryLeaks++; },
    recordDbOverload: () => { metrics.dbOverload++; },
    recordCacheMiss: () => { metrics.cacheMisses++; },
    
    getReport: () => {
      const totalIssues = Object.values(metrics).reduce((sum, count) => sum + count, 0);
      
      if (totalIssues > 0) {
        logger.warn('Performance bottlenecks detected', {
          ...metrics,
          totalIssues,
          recommendations: generateRecommendations(metrics)
        });
      }

      return metrics;
    }
  };
}

function generateRecommendations(metrics: any): string[] {
  const recommendations: string[] = [];

  if (metrics.slowRequests > 10) {
    recommendations.push('Consider implementing response caching');
    recommendations.push('Optimize database queries and add indexes');
  }

  if (metrics.memoryLeaks > 5) {
    recommendations.push('Investigate potential memory leaks');
    recommendations.push('Review object lifecycle management');
  }

  if (metrics.dbOverload > 20) {
    recommendations.push('Scale database connection pool');
    recommendations.push('Implement database query optimization');
  }

  if (metrics.cacheMisses > 100) {
    recommendations.push('Review caching strategy');
    recommendations.push('Implement cache warming');
  }

  return recommendations;
}

// Performance optimization middleware
export function performanceOptimization(req: Request, res: Response, next: NextFunction) {
  // Add performance headers
  res.setHeader('X-Response-Time', 'pending');
  
  const startTime = Date.now();
  
  // Override res.end to add timing header
  const originalEnd = res.end;
  res.end = function(...args: any[]) {
    const responseTime = Date.now() - startTime;
    res.setHeader('X-Response-Time', `${responseTime}ms`);
    
    // Add cache control headers for static content
    if (req.url.includes('/static/') || req.url.includes('/assets/')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
    }
    
    return (originalEnd as any).apply(this, args);
  };

  next();
}
