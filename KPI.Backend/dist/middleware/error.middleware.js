"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const AppError_1 = require("../utils/AppError");
const logger_1 = require("../utils/logger");
const env_1 = require("../config/env");
const errorHandler = (err, req, res, _next) => {
    if (err instanceof AppError_1.AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            ...(env_1.env.isDev && { stack: err.stack }),
        });
        return;
    }
    // PostgreSQL unique violation
    if (err.code === '23505') {
        res.status(409).json({ success: false, message: 'Resource already exists' });
        return;
    }
    logger_1.logger.error(`Unhandled error on ${req.method} ${req.path}`, err);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        ...(env_1.env.isDev && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=error.middleware.js.map