"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emergency102Service = void 0;
const emergency102_repository_1 = require("./emergency102.repository");
const AppError_1 = require("../../utils/AppError");
exports.emergency102Service = {
    getAll: (q) => emergency102_repository_1.emergency102Repository.findAll(q),
    getById: async (id) => { const r = await emergency102_repository_1.emergency102Repository.findById(id); if (!r)
        throw AppError_1.AppError.notFound('Emergency102'); return r; },
    create: (dto) => emergency102_repository_1.emergency102Repository.create(dto),
    update: async (id, dto) => { const r = await emergency102_repository_1.emergency102Repository.update(id, dto); if (!r)
        throw AppError_1.AppError.notFound('Emergency102'); return r; },
    delete: async (id) => { const ok = await emergency102_repository_1.emergency102Repository.delete(id); if (!ok)
        throw AppError_1.AppError.notFound('Emergency102'); },
    bulkCreate: (dto) => emergency102_repository_1.emergency102Repository.bulkCreate(dto),
};
//# sourceMappingURL=emergency102.service.js.map