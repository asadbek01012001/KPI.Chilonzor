"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("./auth.service");
const response_1 = require("../../utils/response");
exports.authController = {
    register: async (req, res, next) => {
        try {
            const { name, email, password } = req.body;
            const result = await auth_service_1.authService.register(name, email, password);
            (0, response_1.sendCreated)(res, result, 'Registered successfully');
        }
        catch (err) {
            next(err);
        }
    },
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const result = await auth_service_1.authService.login(email, password);
            (0, response_1.sendSuccess)(res, result, 'Logged in successfully');
        }
        catch (err) {
            next(err);
        }
    },
    refresh: async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            const result = await auth_service_1.authService.refresh(refreshToken);
            (0, response_1.sendSuccess)(res, result, 'Tokens refreshed');
        }
        catch (err) {
            next(err);
        }
    },
    logout: async (req, res, next) => {
        try {
            await auth_service_1.authService.logout(req.user.userId);
            (0, response_1.sendSuccess)(res, null, 'Logged out successfully');
        }
        catch (err) {
            next(err);
        }
    },
    me: async (req, res, next) => {
        try {
            const user = await auth_service_1.authService.me(req.user.userId);
            (0, response_1.sendSuccess)(res, user, 'Profile fetched');
        }
        catch (err) {
            next(err);
        }
    },
};
//# sourceMappingURL=auth.controller.js.map