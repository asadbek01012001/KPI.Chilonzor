import { Request, Response, NextFunction } from 'express';
export declare const rateLimiter: (maxRequests: number, windowMs: number) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=rateLimiter.middleware.d.ts.map