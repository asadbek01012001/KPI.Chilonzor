"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crimeController = void 0;
const crime_service_1 = require("./crime.service");
const response_1 = require("../../utils/response");
const handle = (fn) => async (req, res, next) => {
    try {
        await fn(req, res);
    }
    catch (e) {
        next(e);
    }
};
exports.crimeController = {
    getAll: handle(async (req, res) => {
        const q = req.query;
        const data = await crime_service_1.crimeService.getAll(q);
        const { rows, total, totals } = await crime_service_1.crimeService.getAll(q);
        (0, response_1.sendSuccess)(res, data, "Crimes retrieved", 200, {
            page: +q.page || 1,
            limit: +q.limit || 10,
            total,
            pages: Math.ceil(total / (+q.limit || 10)),
            totals,
        });
    }),
    getById: handle(async (req, res) => {
        (0, response_1.sendSuccess)(res, await crime_service_1.crimeService.getById(req.params.id));
    }),
    create: handle(async (req, res) => {
        (0, response_1.sendSuccess)(res, await crime_service_1.crimeService.create(req.body), "Crime record created", 201);
    }),
    update: handle(async (req, res) => {
        (0, response_1.sendSuccess)(res, await crime_service_1.crimeService.update(req.params.id, req.body), "Crime record updated");
    }),
    delete: handle(async (req, res) => {
        await crime_service_1.crimeService.delete(req.params.id);
        (0, response_1.sendSuccess)(res, null, "Crime record deleted");
    }),
    bulkCreate: handle(async (req, res) => {
        (0, response_1.sendSuccess)(res, await crime_service_1.crimeService.bulkCreate(req.body), "Crimes bulk created", 201);
    }),
};
//# sourceMappingURL=crime.controller.js.map