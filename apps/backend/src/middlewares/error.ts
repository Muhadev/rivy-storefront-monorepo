import { Request, Response, NextFunction } from 'express';
import { log } from './logging';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export function notFound(req: Request, res: Response) {
  log.warn('Route not found', { 
    method: req.method, 
    url: req.url,
    ip: req.ip 
  });
  res.status(404).json({ 
    error: 'NOT_FOUND',
    message: 'The requested resource was not found',
    path: req.url 
  });
}

export function errorHandler(err: ApiError, req: Request, res: Response, _next: NextFunction) {
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_ERROR';
  
  log.error('Request error', {
    error: err.message,
    stack: err.stack,
    statusCode,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    details: err.details
  });

  // Don't leak internal errors in production
  const message = statusCode === 500 && process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;

  res.status(statusCode).json({ 
    error: errorCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}
