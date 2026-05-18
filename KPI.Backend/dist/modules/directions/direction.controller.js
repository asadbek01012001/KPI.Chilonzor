"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.directionController = void 0;
const direction_service_1 = require("./direction.service");
const response_1 = require("../../utils/response");
const handle = (fn) => async (req, res, next) => { try {
    await fn(req, res);
}
catch (e) {
    next(e);
} };
exports.directionController = {
    getAll: handle(async (req, res) => {
        const q = req.query;
        const { rows, total } = await direction_service_1.directionService.getAll(q);
        (0, response_1.sendSuccess)(res, rows, 'Directions retrieved', 200, { page: +q.page || 1, limit: +q.limit || 10, total, pages: Math.ceil(total / (+q.limit || 10)) });
    }),
    getById: handle(async (req, res) => { (0, response_1.sendSuccess)(res, await direction_service_1.directionService.getById(req.params.id)); }),
    create: handle(async (req, res) => { (0, response_1.sendSuccess)(res, await direction_service_1.directionService.create(req.body), 'Direction created', 201); }),
    update: handle(async (req, res) => { (0, response_1.sendSuccess)(res, await direction_service_1.directionService.update(req.params.id, req.body), 'Direction updated'); }),
    delete: handle(async (req, res) => { await direction_service_1.directionService.delete(req.params.id); (0, response_1.sendSuccess)(res, null, 'Direction deleted'); }),
};
//# sourceMappingURL=direction.controller.js.map