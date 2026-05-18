"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.directionService = void 0;
const direction_repository_1 = require("./direction.repository");
const AppError_1 = require("../../utils/AppError");
exports.directionService = {
    getAll: (q) => direction_repository_1.directionRepository.findAll(q),
    getById: async (id) => { const r = await direction_repository_1.directionRepository.findById(id); if (!r)
        throw AppError_1.AppError.notFound('Direction'); return r; },
    create: (dto) => direction_repository_1.directionRepository.create(dto),
    update: async (id, dto) => { const r = await direction_repository_1.directionRepository.update(id, dto); if (!r)
        throw AppError_1.AppError.notFound('Direction'); return r; },
    delete: async (id) => { const ok = await direction_repository_1.directionRepository.delete(id); if (!ok)
        throw AppError_1.AppError.notFound('Direction'); },
};
//# sourceMappingURL=direction.service.js.map