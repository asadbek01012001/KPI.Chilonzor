"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indicatorController = void 0;
const indicator_service_1 = require("./indicator.service");
const response_1 = require("../../utils/response");
const handle = (fn) => async (req, res, next) => { try {
    await fn(req, res);
}
catch (e) {
    next(e);
} };
exports.indicatorController = {
    getAll: handle(async (req, res) => {
        const q = req.query;
        const { rows, total } = await indicator_service_1.indicatorService.getAll(q);
        (0, response_1.sendSuccess)(res, rows, 'Indicators retrieved', 200, { page: +q.page || 1, limit: +q.limit || 10, total, pages: Math.ceil(total / (+q.limit || 10)) });
    }),
    getFlatList: handle(async (req, res) => {
        const { direction_id } = req.query;
        if (!direction_id) {
            res.status(400).json({ success: false, message: 'direction_id required' });
            return;
        }
        const rows = await indicator_service_1.indicatorService.getFlatList(direction_id);
        (0, response_1.sendSuccess)(res, rows, 'Indicators flat list');
    }),
    getById: handle(async (req, res) => { (0, response_1.sendSuccess)(res, await indicator_service_1.indicatorService.getById(req.params.id)); }),
    create: handle(async (req, res) => { (0, response_1.sendSuccess)(res, await indicator_service_1.indicatorService.create(req.body), 'Indicator created', 201); }),
    update: handle(async (req, res) => { (0, response_1.sendSuccess)(res, await indicator_service_1.indicatorService.update(req.params.id, req.body), 'Indicator updated'); }),
    delete: handle(async (req, res) => { await indicator_service_1.indicatorService.delete(req.params.id); (0, response_1.sendSuccess)(res, null, 'Indicator deleted'); }),
};
//# sourceMappingURL=indicator.controller.js.map