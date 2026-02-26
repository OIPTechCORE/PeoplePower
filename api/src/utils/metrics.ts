import { register, Counter, Histogram, Gauge } from 'prom-client';

// Create metrics
export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.1, 0.5, 1, 2, 5, 10]
});

export const activeConnections = new Gauge({
  name: 'websocket_connections_active',
  help: 'Number of active WebSocket connections'
});

export const databaseConnections = new Gauge({
  name: 'database_connections_active',
  help: 'Number of active database connections'
});

export const cacheHits = new Counter({
  name: 'cache_hits_total',
  help: 'Total number of cache hits',
  labelNames: ['cache_type']
});

export const cacheMisses = new Counter({
  name: 'cache_misses_total',
  help: 'Total number of cache misses',
  labelNames: ['cache_type']
});

export const playerActions = new Counter({
  name: 'player_actions_total',
  help: 'Total number of player actions',
  labelNames: ['action_type', 'player_id']
});

export const gameErrors = new Counter({
  name: 'game_errors_total',
  help: 'Total number of game errors',
  labelNames: ['error_type', 'component']
});

export const memoryUsage = new Gauge({
  name: 'process_memory_bytes',
  help: 'Process memory usage in bytes',
  labelNames: ['type']
});

export const cpuUsage = new Gauge({
  name: 'process_cpu_usage',
  help: 'Process CPU usage percentage'
});

// Middleware to track HTTP requests
export function metricsMiddleware(req: any, res: any, next: any) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path || 'unknown';
    
    httpRequestsTotal.inc({
      method: req.method,
      route,
      status_code: res.statusCode
    });
    
    httpRequestDuration.observe({
      method: req.method,
      route
    }, duration);
  });
  
  next();
}

// Update system metrics
export function updateSystemMetrics() {
  const memUsage = process.memoryUsage();
  
  memoryUsage.set({ type: 'rss' }, memUsage.rss);
  memoryUsage.set({ type: 'heapTotal' }, memUsage.heapTotal);
  memoryUsage.set({ type: 'heapUsed' }, memUsage.heapUsed);
  memoryUsage.set({ type: 'external' }, memUsage.external);
  
  const cpuUsage = process.cpuUsage();
  const totalCpu = (cpuUsage.user + cpuUsage.system) / 1000000; // Convert to seconds
  
  cpuUsage.set(totalCpu);
}

// Metrics endpoint
export function getMetrics() {
  return register.metrics();
}
