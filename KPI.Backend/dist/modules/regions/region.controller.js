"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regionController = void 0;
const region_service_1 = require("./region.service");
const response_1 = require("../../utils/response");
const handle = (fn) => async (req, res, next) => { try {
    await fn(req, res, next);
}
catch (e) {
    next(e);
} };
exports.regionController = {
    getAll: handle(async (req, res) => {
        const q = req.query;
        const { rows, total } = await region_service_1.regionService.getAll(q);
        (0, response_1.sendSuccess)(res, rows, 'Regions retrieved', 200, { page: +q.page || 1, limit: +q.limit || 10, total, pages: Math.ceil(total / (+q.limit || 10)) });
    }),
    getById: handle(async (req, res) => { (0, response_1.sendSuccess)(res, await region_service_1.regionService.getById(req.params.id)); }),
    create: handle(async (req, res) => { (0, response_1.sendSuccess)(res, await region_service_1.regionService.create(req.body), 'Region created', 201); }),
    update: handle(async (req, res) => { (0, response_1.sendSuccess)(res, await region_service_1.regionService.update(req.params.id, req.body), 'Region updated'); }),
    delete: handle(async (req, res) => { await region_service_1.regionService.delete(req.params.id); (0, response_1.sendSuccess)(res, null, 'Region deleted'); }),
};
//# sourceMappingURL=region.controller.js.map