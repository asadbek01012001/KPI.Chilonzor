"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_service_1 = require("./user.service");
const response_1 = require("../../utils/response");
exports.userController = {
    getAll: async (req, res, next) => {
        try {
            const page = parseInt(req.query.page || '1', 10);
            const limit = parseInt(req.query.limit || '10', 10);
            const search = req.query.search;
            const { data, meta } = await user_service_1.userService.getAll(page, limit, search);
            (0, response_1.sendSuccess)(res, data, 'Users fetched', 200, meta);
        }
        catch (err) {
            next(err);
        }
    },
    getById: async (req, res, next) => {
        try {
            const user = await user_service_1.userService.getById(req.params.id);
            (0, response_1.sendSuccess)(res, user, 'User fetched');
        }
        catch (err) {
            next(err);
        }
    },
    create: async (req, res, next) => {
        try {
            const user = await user_service_1.userService.create(req.body);
            (0, response_1.sendCreated)(res, user, 'User created');
        }
        catch (err) {
            next(err);
        }
    },
    update: async (req, res, next) => {
        try {
            const user = await user_service_1.userService.update(req.params.id, req.body, req.user.userId, req.user.role);
            (0, response_1.sendSuccess)(res, user, 'User updated');
        }
        catch (err) {
            next(err);
        }
    },
    delete: async (req, res, next) => {
        try {
            await user_service_1.userService.delete(req.params.id, req.user.userId, req.user.role);
            (0, response_1.sendSuccess)(res, null, 'User deleted');
        }
        catch (err) {
            next(err);
        }
    },
};
//# sourceMappingURL=user.controller.js.map