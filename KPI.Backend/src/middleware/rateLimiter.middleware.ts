import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: { count: number; resetAt: number };
}

const store: RateLimitStore = {};

export const rateLimiter = (maxRequests: number, windowMs: number) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip || 'unknown';
    const now = Date.now();

    if (!store[key] || store[key].resetAt < now) {
      store[key] = { count: 1, resetAt: now + windowMs };
      next();
      return;
    }

    store[key].count++;
    if (store[key].count > maxRequests) {
      res.status(429).json({ success: false, message: 'Too many requests, please try again later' });
      return;
    }

    next();
  };
