import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer '))
      throw AppError.unauthorized('No token provided');

    const token = authHeader.split(' ')[1];
    req.user = verifyAccessToken(token);
    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(AppError.unauthorized('Invalid or expired token'));
  }
};

export const authorize = (...roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role))
      return next(AppError.forbidden('Access denied'));
    next();
  };
