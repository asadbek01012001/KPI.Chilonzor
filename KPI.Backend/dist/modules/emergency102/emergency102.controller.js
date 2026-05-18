"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emergency102Controller = void 0;
const emergency102_service_1 = require("./emergency102.service");
const response_1 = require("../../utils/response");
const handle = (fn) => async (req, res, next) => { try {
    await fn(req, res);
}
catch (e) {
    next(e);
} };
exports.emergency102Controller = {
    getAll: handle(async (req, res) => {
        const q = req.query;
        const { rows, total, totals } = await emergency102_service_1.emergency102Service.getAll(q);
        (0, response_1.sendSuccess)(res, rows, 'Emergency102 retrieved', 200, {
            page: +q.page || 1, limit: +q.limit || 10, total,
            pages: Math.ceil(total / (+q.limit || 10)),
            totals,
        });
    }),
    getById: handle(async (req, res) => { (0, response_1.sendSuccess)(res, await emergency102_service_1.emergency102Service.getById(req.params.id)); }),
    create: handle(async (req, res) => { (0, response_1.sendSuccess)(res, await emergency102_service_1.emergency102Service.create(req.body), 'Emergency102 record created', 201); }),
    update: handle(async (req, res) => { (0, response_1.sendSuccess)(res, await emergency102_service_1.emergency102Service.update(req.params.id, req.body), 'Emergency102 record updated'); }),
    delete: handle(async (req, res) => { await emergency102_service_1.emergency102Service.delete(req.params.id); (0, response_1.sendSuccess)(res, null, 'Emergency102 record deleted'); }),
    bulkCreate: handle(async (req, res) => { (0, response_1.sendSuccess)(res, await emergency102_service_1.emergency102Service.bulkCreate(req.body), 'Emergency102 bulk created', 201); }),
};
//# sourceMappingURL=emergency102.controller.js.map