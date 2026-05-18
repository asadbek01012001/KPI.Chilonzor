"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportController = void 0;
const report_repository_1 = require("./report.repository");
const response_1 = require("../../utils/response");
const excelExport_1 = require("../../utils/excelExport");
const database_1 = require("../../config/database");
exports.reportController = {
    getMahallaReport: async (req, res, next) => {
        try {
            const from = req.query.from;
            const to = req.query.to;
            const region_id = req.query.region_id;
            const sector = req.query.sector ? parseInt(req.query.sector) : undefined;
            if (region_id) {
                const data = await report_repository_1.reportRepository.getMahallaReport(region_id, from, to);
                if (!data) {
                    res.status(404).json({ success: false, message: 'Mahalla topilmadi' });
                    return;
                }
                (0, response_1.sendSuccess)(res, data, "Mahalla bo'yicha xisobot");
                return;
            }
            const search = req.query.search;
            (0, response_1.sendSuccess)(res, await report_repository_1.reportRepository.getAllMahallaReport(from, to, sector, search), "Barcha mahallalar bo'yicha xisobot");
        }
        catch (err) {
            next(err);
        }
    },
    exportExcel: async (req, res, next) => {
        try {
            const from = req.query.from;
            const to = req.query.to;
            const sector = req.query.sector ? parseInt(req.query.sector) : undefined;
            // Barcha report ma'lumotlarini olamiz
            const tableData = await report_repository_1.reportRepository.getAllMahallaReport(from, to, sector);
            // Yo'nalishlar ro'yxatini olamiz
            const dirRes = await database_1.db.query('SELECT id, name FROM directions ORDER BY index ASC');
            const directions = dirRes.rows;
            const buffer = await (0, excelExport_1.generateReportExcel)(tableData, directions);
            const date = new Date().toISOString().slice(0, 10);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="report_${date}.xlsx"`);
            res.send(buffer);
        }
        catch (err) {
            next(err);
        }
    },
};
//# sourceMappingURL=report.controller.js.map