import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { GameError } from '@people-power/shared';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error
  logger.error('Error occurred:', {
    error: error.message,
    stack: error.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.method !== 'GET' ? req.body : undefined,
  });

  // Handle custom GameError
  if (error instanceof GameError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.code,
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Invalid input data',
      details: error.message,
      timestamp: new Date().toISOString(),
    });
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Invalid authentication token',
      timestamp: new Date().toISOString(),
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'TOKEN_EXPIRED',
      message: 'Authentication token has expired',
      timestamp: new Date().toISOString(),
    });
  }

  // Handle database errors
  if (error.name === 'QueryFailedError') {
    return res.status(500).json({
      success: false,
      error: 'DATABASE_ERROR',
      message: 'Database operation failed',
      timestamp: new Date().toISOString(),
    });
  }

  // Handle rate limiting
  if (error.message?.includes('Too many requests')) {
    return res.status(429).json({
      success: false,
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later',
      timestamp: new Date().toISOString(),
    });
  }

  // Default error response
  const statusCode = (error as any).statusCode || 500;
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(statusCode).json({
    success: false,
    error: 'INTERNAL_ERROR',
    message: isDevelopment ? error.message : 'An unexpected error occurred',
    ...(isDevelopment && { stack: error.stack }),
    timestamp: new Date().toISOString(),
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
  });
};
