import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import { env } from '../config/env';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(env.isDev && { stack: err.stack }),
    });
    return;
  }

  // PostgreSQL unique violation
  if ((err as any).code === '23505') {
    res.status(409).json({ success: false, message: 'Resource already exists' });
    return;
  }

  logger.error(`Unhandled error on ${req.method} ${req.path}`, err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    ...(env.isDev && { stack: err.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
};
