"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indicatorService = void 0;
const indicator_repository_1 = require("./indicator.repository");
const AppError_1 = require("../../utils/AppError");
exports.indicatorService = {
    getAll: (q) => indicator_repository_1.indicatorRepository.findAll(q),
    getFlatList: (directionId) => indicator_repository_1.indicatorRepository.getFlatList(directionId),
    getById: async (id) => { const r = await indicator_repository_1.indicatorRepository.findById(id); if (!r)
        throw AppError_1.AppError.notFound('Indicator'); return r; },
    create: (dto) => indicator_repository_1.indicatorRepository.create(dto),
    update: async (id, dto) => { const r = await indicator_repository_1.indicatorRepository.update(id, dto); if (!r)
        throw AppError_1.AppError.notFound('Indicator'); return r; },
    delete: async (id) => { const ok = await indicator_repository_1.indicatorRepository.delete(id); if (!ok)
        throw AppError_1.AppError.notFound('Indicator'); },
};
//# sourceMappingURL=indicator.service.js.map