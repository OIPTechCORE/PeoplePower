import winston from 'winston';

const logLevel = process.env.LOG_LEVEL || 'info';
const isDevelopment = process.env.NODE_ENV === 'development';

// Custom format for development
const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    
    if (stack) {
      log += `\n${stack}`;
    }
    
    return log;
  })
);

// Custom format for production
const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create logger instance
export const logger = winston.createLogger({
  level: logLevel,
  format: isDevelopment ? developmentFormat : productionFormat,
  transports: [
    // Console transport
    new winston.transports.Console({
      silent: process.env.NODE_ENV === 'test',
    }),
    
    // File transport for errors (only in production)
    ...(process.env.NODE_ENV === 'production' ? [
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
      new winston.transports.File({
        filename: 'logs/combined.log',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
    ] : []),
  ],
  
  // Handle uncaught exceptions
  exceptionHandlers: [
    ...(process.env.NODE_ENV === 'production' ? [
      new winston.transports.File({ filename: 'logs/exceptions.log' })
    ] : [new winston.transports.Console()]),
  ],
  
  // Handle unhandled promise rejections
  rejectionHandlers: [
    ...(process.env.NODE_ENV === 'production' ? [
      new winston.transports.File({ filename: 'logs/rejections.log' })
    ] : [new winston.transports.Console()]),
  ],
});

// Create a stream object for Morgan HTTP logger
export const morganStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

// Helper functions for structured logging
export const logPlayerAction = (playerId: string, action: string, metadata?: any) => {
  logger.info('Player action', {
    playerId,
    action,
    timestamp: new Date().toISOString(),
    ...metadata,
  });
};

export const logGameEvent = (event: string, metadata?: any) => {
  logger.info('Game event', {
    event,
    timestamp: new Date().toISOString(),
    ...metadata,
  });
};

export const logApiError = (error: Error, req: any) => {
  logger.error('API error', {
    error: error.message,
    stack: error.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });
};

export const logSecurityEvent = (event: string, metadata?: any) => {
  logger.warn('Security event', {
    event,
    timestamp: new Date().toISOString(),
    ...metadata,
  });
};

export const logPerformance = (operation: string, duration: number, metadata?: any) => {
  logger.info('Performance metric', {
    operation,
    duration,
    timestamp: new Date().toISOString(),
    ...metadata,
  });
};
