"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = exports.sendError = exports.sendCreated = exports.sendSuccess = void 0;
const sendSuccess = (res, data, message = 'Success', statusCode = 200, meta) => res.status(statusCode).json({ success: true, message, data, ...(meta && { meta }) });
exports.sendSuccess = sendSuccess;
const sendCreated = (res, data, message = 'Created') => (0, exports.sendSuccess)(res, data, message, 201);
exports.sendCreated = sendCreated;
const sendError = (res, message, statusCode = 400, errors) => res.status(statusCode).json({ success: false, message, ...(errors && { errors }) });
exports.sendError = sendError;
const paginate = (total, page, limit) => ({
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
});
exports.paginate = paginate;
//# sourceMappingURL=response.js.map