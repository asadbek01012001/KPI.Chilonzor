"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crimeService = void 0;
const crime_repository_1 = require("./crime.repository");
const AppError_1 = require("../../utils/AppError");
const its_service_1 = require("../its/its.service");
exports.crimeService = {
    getAll: (q) => its_service_1.itsService.getAll(q),
    getById: async (id) => {
        const r = await crime_repository_1.crimeRepository.findById(id);
        if (!r)
            throw AppError_1.AppError.notFound("Crime");
        return r;
    },
    create: (dto) => crime_repository_1.crimeRepository.create(dto),
    update: async (id, dto) => {
        const r = await crime_repository_1.crimeRepository.update(id, dto);
        if (!r)
            throw AppError_1.AppError.notFound("Crime");
        return r;
    },
    delete: async (id) => {
        const ok = await crime_repository_1.crimeRepository.delete(id);
        if (!ok)
            throw AppError_1.AppError.notFound("Crime");
    },
    bulkCreate: (dto) => crime_repository_1.crimeRepository.bulkCreate(dto),
};
//# sourceMappingURL=crime.service.js.map