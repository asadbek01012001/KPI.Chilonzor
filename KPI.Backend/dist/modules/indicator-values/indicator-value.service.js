"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indicatorValueService = void 0;
const indicator_value_repository_1 = require("./indicator-value.repository");
const AppError_1 = require("../../utils/AppError");
exports.indicatorValueService = {
    getAll: (q) => indicator_value_repository_1.indicatorValueRepository.findAll(q),
    getById: async (id) => { const r = await indicator_value_repository_1.indicatorValueRepository.findById(id); if (!r)
        throw AppError_1.AppError.notFound('IndicatorValue'); return r; },
    create: (dto) => indicator_value_repository_1.indicatorValueRepository.create(dto),
    update: async (id, dto) => { const r = await indicator_value_repository_1.indicatorValueRepository.update(id, dto); if (!r)
        throw AppError_1.AppError.notFound('IndicatorValue'); return r; },
    delete: async (id) => { const ok = await indicator_value_repository_1.indicatorValueRepository.delete(id); if (!ok)
        throw AppError_1.AppError.notFound('IndicatorValue'); },
    bulkCreate: (dto) => indicator_value_repository_1.indicatorValueRepository.bulkCreate(dto),
    deleteByDate: async (date) => {
        const deleted = await indicator_value_repository_1.indicatorValueRepository.deleteByDate(date);
        return { deleted, date };
    },
};
//# sourceMappingURL=indicator-value.service.js.map