import { Pool, PoolClient } from 'pg';
import { logger } from '../utils/logger';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'people_power',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // how long to wait when connecting a new client
};

// Create connection pool
export const pool = new Pool(dbConfig);

// Database connection helper
export const connectDatabase = async (): Promise<void> => {
  try {
    // Test the connection
    const client = await pool.connect();
    
    // Test query
    await client.query('SELECT NOW()');
    
    client.release();
    
    logger.info('Database connected successfully', {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
    });
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    throw error;
  }
};

// Transaction helper
export const withTransaction = async <T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Query helper with error handling
export const query = async (text: string, params?: any[]): Promise<any> => {
  const start = Date.now();
  
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    logger.debug('Database query executed', {
      query: text,
      duration: `${duration}ms`,
      rows: result.rowCount,
    });
    
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    
    logger.error('Database query failed', {
      query: text,
      duration: `${duration}ms`,
      error: error.message,
    });
    
    throw error;
  }
};

// Health check for database
export const checkDatabaseHealth = async (): Promise<{
  status: 'healthy' | 'unhealthy';
  latency?: number;
  error?: string;
}> => {
  try {
    const start = Date.now();
    const result = await query('SELECT 1 as health_check');
    const latency = Date.now() - start;
    
    return {
      status: 'healthy',
      latency,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
    };
  }
};

// Graceful shutdown
export const closeDatabaseConnection = async (): Promise<void> => {
  try {
    await pool.end();
    logger.info('Database connection pool closed');
  } catch (error) {
    logger.error('Error closing database connection:', error);
    throw error;
  }
};

// Handle process termination
process.on('SIGTERM', closeDatabaseConnection);
process.on('SIGINT', closeDatabaseConnection);
