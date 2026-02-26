import { performance } from 'perf_hooks';

export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private slowQueries: Array<{ query: string; duration: number; timestamp: Date }> = [];
  private memorySnapshots: Array<{ timestamp: Date; usage: NodeJS.MemoryUsage }> = [];

  startTimer(name: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
    };
  }

  private recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // Keep only last 1000 measurements to prevent memory leaks
    if (values.length > 1000) {
      values.shift();
    }
  }

  getMetrics(name: string): { avg: number; min: number; max: number; count: number; p95: number; p99: number } {
    const values = this.metrics.get(name) || [];
    if (values.length === 0) {
      return { avg: 0, min: 0, max: 0, count: 0, p95: 0, p99: 0 };
    }

    const sorted = [...values].sort((a, b) => a - b);
    const count = sorted.length;
    
    return {
      avg: values.reduce((a, b) => a + b, 0) / count,
      min: sorted[0],
      max: sorted[count - 1],
      count,
      p95: sorted[Math.floor(count * 0.95)],
      p99: sorted[Math.floor(count * 0.99)]
    };
  }

  getAllMetrics(): Record<string, any> {
    const result: Record<string, any> = {};
    
    for (const [name] of this.metrics.entries()) {
      result[name] = this.getMetrics(name);
    }
    
    return result;
  }

  recordSlowQuery(query: string, duration: number): void {
    this.slowQueries.push({
      query: query.substring(0, 200), // Limit query length
      duration,
      timestamp: new Date()
    });
    
    // Keep only last 100 slow queries
    if (this.slowQueries.length > 100) {
      this.slowQueries.shift();
    }
  }

  getSlowQueries(threshold: number = 1000): Array<{ query: string; duration: number; timestamp: Date }> {
    return this.slowQueries.filter(sq => sq.duration > threshold);
  }

  recordMemorySnapshot(): void {
    this.memorySnapshots.push({
      timestamp: new Date(),
      usage: process.memoryUsage()
    });
    
    // Keep only last 100 snapshots
    if (this.memorySnapshots.length > 100) {
      this.memorySnapshots.shift();
    }
  }

  getMemoryStats(): {
    current: NodeJS.MemoryUsage;
    peak: NodeJS.MemoryUsage;
    average: NodeJS.MemoryUsage;
    trend: 'increasing' | 'decreasing' | 'stable';
  } {
    if (this.memorySnapshots.length === 0) {
      const current = process.memoryUsage();
      return {
        current,
        peak: current,
        average: current,
        trend: 'stable'
      };
    }

    const current = process.memoryUsage();
    const snapshots = this.memorySnapshots.map(s => s.usage);
    
    const peak = {
      rss: Math.max(...snapshots.map(s => s.rss)),
      heapTotal: Math.max(...snapshots.map(s => s.heapTotal)),
      heapUsed: Math.max(...snapshots.map(s => s.heapUsed)),
      external: Math.max(...snapshots.map(s => s.external)),
      arrayBuffers: Math.max(...snapshots.map(s => s.arrayBuffers || 0))
    };

    const average = {
      rss: snapshots.reduce((sum, s) => sum + s.rss, 0) / snapshots.length,
      heapTotal: snapshots.reduce((sum, s) => sum + s.heapTotal, 0) / snapshots.length,
      heapUsed: snapshots.reduce((sum, s) => sum + s.heapUsed, 0) / snapshots.length,
      external: snapshots.reduce((sum, s) => sum + s.external, 0) / snapshots.length,
      arrayBuffers: snapshots.reduce((sum, s) => sum + (s.arrayBuffers || 0), 0) / snapshots.length
    };

    // Determine trend
    const recent = snapshots.slice(-10);
    const older = snapshots.slice(-20, -10);
    
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (recent.length > 0 && older.length > 0) {
      const recentAvg = recent.reduce((sum, s) => sum + s.heapUsed, 0) / recent.length;
      const olderAvg = older.reduce((sum, s) => sum + s.heapUsed, 0) / older.length;
      
      if (recentAvg > olderAvg * 1.1) {
        trend = 'increasing';
      } else if (recentAvg < olderAvg * 0.9) {
        trend = 'decreasing';
      }
    }

    return {
      current,
      peak,
      average,
      trend
    };
  }

  getPerformanceReport(): {
    metrics: Record<string, any>;
    slowQueries: Array<{ query: string; duration: number; timestamp: Date }>;
    memoryStats: any;
    uptime: number;
    timestamp: Date;
  } {
    return {
      metrics: this.getAllMetrics(),
      slowQueries: this.getSlowQueries(),
      memoryStats: this.getMemoryStats(),
      uptime: process.uptime(),
      timestamp: new Date()
    };
  }

  // Performance monitoring middleware
  static createMiddleware() {
    const monitor = new PerformanceMonitor();
    
    return (req: any, res: any, next: any) => {
      const endTimer = monitor.startTimer(`${req.method} ${req.route?.path || req.path}`);
      
      res.on('finish', () => {
        endTimer();
      });
      
      next();
    };
  }

  // Automatic memory monitoring
  startMemoryMonitoring(intervalMs: number = 30000): void {
    setInterval(() => {
      this.recordMemorySnapshot();
    }, intervalMs);
  }

  // Performance alerting
  checkPerformanceThresholds(): {
    alerts: Array<{ type: string; message: string; severity: 'low' | 'medium' | 'high' }>;
    status: 'healthy' | 'warning' | 'critical';
  } {
    const alerts: Array<{ type: string; message: string; severity: 'low' | 'medium' | 'high' }> = [];
    
    // Check memory usage
    const memoryStats = this.getMemoryStats();
    const memoryUsagePercent = (memoryStats.current.heapUsed / memoryStats.current.heapTotal) * 100;
    
    if (memoryUsagePercent > 90) {
      alerts.push({
        type: 'memory',
        message: `Memory usage critical: ${memoryUsagePercent.toFixed(1)}%`,
        severity: 'high'
      });
    } else if (memoryUsagePercent > 75) {
      alerts.push({
        type: 'memory',
        message: `Memory usage high: ${memoryUsagePercent.toFixed(1)}%`,
        severity: 'medium'
      });
    }
    
    // Check slow queries
    const slowQueries = this.getSlowQueries(2000); // Queries over 2 seconds
    if (slowQueries.length > 10) {
      alerts.push({
        type: 'database',
        message: `High number of slow queries: ${slowQueries.length} queries over 2s`,
        severity: 'high'
      });
    }
    
    // Check response times
    const apiMetrics = this.getMetrics('GET /api/players');
    if (apiMetrics.avg > 1000) {
      alerts.push({
        type: 'response_time',
        message: `API response time high: ${apiMetrics.avg.toFixed(0)}ms average`,
        severity: 'medium'
      });
    }
    
    // Determine overall status
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (alerts.some(a => a.severity === 'high')) {
      status = 'critical';
    } else if (alerts.some(a => a.severity === 'medium')) {
      status = 'warning';
    }
    
    return { alerts, status };
  }
}
