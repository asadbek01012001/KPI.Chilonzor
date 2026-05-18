"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = void 0;
const dashboard_repository_1 = require("./dashboard.repository");
const AppError_1 = require("../../utils/AppError");
exports.dashboardService = {
    getMahalla: async (regionId, from, to) => {
        const result = await dashboard_repository_1.dashboardRepository.getMahalla(regionId, from, to);
        if (!result)
            throw new AppError_1.AppError('Region not found', 404);
        return result;
    },
    getAllMahalla: async (from, to, sector) => {
        return dashboard_repository_1.dashboardRepository.getAllMahalla(from, to, sector);
    },
};
//# sourceMappingURL=dashboard.service.js.map