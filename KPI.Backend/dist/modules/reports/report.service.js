"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportService = void 0;
const report_repository_1 = require("./report.repository");
exports.reportService = {
    getAllMahallaReport: (from, to, sector, search) => report_repository_1.reportRepository.getAllMahallaReport(from, to, sector, search),
    getMahallaReport: (regionId, from, to) => report_repository_1.reportRepository.getMahallaReport(regionId, from, to),
};
//# sourceMappingURL=report.service.js.map