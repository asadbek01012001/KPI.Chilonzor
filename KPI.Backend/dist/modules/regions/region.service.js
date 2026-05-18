"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regionService = void 0;
const region_repository_1 = require("./region.repository");
const AppError_1 = require("../../utils/AppError");
exports.regionService = {
    getAll: (q) => region_repository_1.regionRepository.findAll(q),
    getById: async (id) => { const r = await region_repository_1.regionRepository.findById(id); if (!r)
        throw AppError_1.AppError.notFound('Region'); return r; },
    create: (dto) => region_repository_1.regionRepository.create(dto),
    update: async (id, dto) => { const r = await region_repository_1.regionRepository.update(id, dto); if (!r)
        throw AppError_1.AppError.notFound('Region'); return r; },
    delete: async (id) => { const ok = await region_repository_1.regionRepository.delete(id); if (!ok)
        throw AppError_1.AppError.notFound('Region'); },
};
//# sourceMappingURL=region.service.js.map