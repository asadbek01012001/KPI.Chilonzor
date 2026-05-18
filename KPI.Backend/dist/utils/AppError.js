"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode = 400, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
    static badRequest(msg) { return new AppError(msg, 400); }
    static unauthorized(msg = 'Unauthorized') { return new AppError(msg, 401); }
    static forbidden(msg = 'Forbidden') { return new AppError(msg, 403); }
    static notFound(msg) { return new AppError(msg, 404); }
    static conflict(msg) { return new AppError(msg, 409); }
    static internal(msg = 'Internal Server Error') { return new AppError(msg, 500, false); }
}
exports.AppError = AppError;
const NotFoundError = (msg) => new AppError(msg, 404);
exports.NotFoundError = NotFoundError;
exports.default = AppError;
//# sourceMappingURL=AppError.js.map