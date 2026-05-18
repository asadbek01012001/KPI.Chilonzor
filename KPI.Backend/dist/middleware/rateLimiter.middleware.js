"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const store = {};
const rateLimiter = (maxRequests, windowMs) => (req, res, next) => {
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
exports.rateLimiter = rateLimiter;
//# sourceMappingURL=rateLimiter.middleware.js.map