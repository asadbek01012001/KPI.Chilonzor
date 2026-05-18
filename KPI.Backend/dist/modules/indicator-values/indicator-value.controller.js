"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indicatorValueController = void 0;
const indicator_value_service_1 = require("./indicator-value.service");
const response_1 = require("../../utils/response");
const handle = (fn) => async (req, res, next) => { try {
    await fn(req, res);
}
catch (e) {
    next(e);
} };
exports.indicatorValueController = {
    getAll: handle(async (req, res) => {
        const q = req.query;
        const { rows, total } = await indicator_value_service_1.indicatorValueService.getAll(q);
        (0, response_1.sendSuccess)(res, rows, 'Indicator values retrieved', 200, { page: +q.page || 1, limit: +q.limit || 10, total, pages: Math.ceil(total / (+q.limit || 10)) });
    }),
    getById: handle(async (req, res) => { (0, response_1.sendSuccess)(res, await indicator_value_service_1.indicatorValueService.getById(req.params.id)); }),
    create: handle(async (req, res) => { (0, response_1.sendSuccess)(res, await indicator_value_service_1.indicatorValueService.create(req.body), 'Indicator value created', 201); }),
    update: handle(async (req, res) => { (0, response_1.sendSuccess)(res, await indicator_value_service_1.indicatorValueService.update(req.params.id, req.body), 'Indicator value updated'); }),
    delete: handle(async (req, res) => { await indicator_value_service_1.indicatorValueService.delete(req.params.id); (0, response_1.sendSuccess)(res, null, 'Indicator value deleted'); }),
    bulkCreate: handle(async (req, res) => { (0, response_1.sendSuccess)(res, await indicator_value_service_1.indicatorValueService.bulkCreate(req.body), 'Indicator values bulk created', 201); }),
    deleteByDate: handle(async (req, res) => {
        const { date } = req.query;
        if (!date) {
            res.status(422).json({ success: false, message: 'date query param required' });
            return;
        }
        const result = await indicator_value_service_1.indicatorValueService.deleteByDate(date);
        (0, response_1.sendSuccess)(res, result, `Deleted ${result.deleted} indicator values for ${date}`);
    }),
};
//# sourceMappingURL=indicator-value.controller.js.map