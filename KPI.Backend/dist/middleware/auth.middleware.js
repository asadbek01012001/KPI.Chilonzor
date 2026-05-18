"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const AppError_1 = require("../utils/AppError");
const authenticate = (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer '))
            throw AppError_1.AppError.unauthorized('No token provided');
        const token = authHeader.split(' ')[1];
        req.user = (0, jwt_1.verifyAccessToken)(token);
        next();
    }
    catch (err) {
        if (err instanceof AppError_1.AppError)
            return next(err);
        next(AppError_1.AppError.unauthorized('Invalid or expired token'));
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role))
        return next(AppError_1.AppError.forbidden('Access denied'));
    next();
};
exports.authorize = authorize;
//# sourceMappingURL=auth.middleware.js.map