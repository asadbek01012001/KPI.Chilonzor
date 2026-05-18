"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workDoneController = void 0;
const work_done_repository_1 = require("./work-done.repository");
const response_1 = require("../../utils/response");
const database_1 = require("../../config/database");
const generateWorkDoneExcel_1 = require("../../utils/generateWorkDoneExcel");
const dates = (req) => ({
    from: req.query.from,
    to: req.query.to,
});
exports.workDoneController = {
    // GET /work-done/:directionId
    getByDirection: async (req, res, next) => {
        try {
            const { directionId } = req.params;
            const { from, to } = dates(req);
            const data = await work_done_repository_1.workDoneRepository.getByDirection(directionId, from, to);
            (0, response_1.sendSuccess)(res, data, "Yo'nalish bo'yicha bajarilgan ishlar");
        }
        catch (err) {
            next(err);
        }
    },
    // GET /work-done/:directionId/indicators/:indicatorId
    getByDirectionAndIndicator: async (req, res, next) => {
        try {
            const { directionId, indicatorId } = req.params;
            const { from, to } = dates(req);
            const data = await work_done_repository_1.workDoneRepository.getByDirectionAndIndicator(directionId, indicatorId, from, to);
            if (!data) {
                res.status(404).json({ success: false, message: 'Indicator topilmadi' });
                return;
            }
            (0, response_1.sendSuccess)(res, data, "Indicator bo'yicha mahallalar bali");
        }
        catch (err) {
            next(err);
        }
    },
    // GET /work-done/:directionId/export?from=&to=
    exportExcel: async (req, res, next) => {
        try {
            const { directionId } = req.params;
            const { from, to } = dates(req);
            // Yo'nalish nomini olish
            const dirRes = await database_1.db.query('SELECT name FROM directions WHERE id = $1', [directionId]);
            const directionName = dirRes.rows[0]?.name ?? "Yo'nalish";
            // Barcha regionlarni olish (table header uchun)
            const regRes = await database_1.db.query(`SELECT id AS region_id, name AS region_name FROM regions WHERE index != 56 ORDER BY index ASC`);
            const regions = regRes.rows;
            // Indikatorlar va qiymatlar
            const indicators = await work_done_repository_1.workDoneRepository.getByDirection(directionId, from, to);
            const fromStr = from ?? '';
            const toStr = to ?? '';
            const buffer = await (0, generateWorkDoneExcel_1.generateWorkDoneExcel)(directionName, indicators, regions, fromStr, toStr);
            // Fayl nomiga yo'nalish nomini qo'shish
            const safeFileName = encodeURIComponent(`${directionName}-${fromStr}-${toStr}.xlsx`);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="${safeFileName}"; filename*=UTF-8''${safeFileName}`);
            res.send(buffer);
        }
        catch (err) {
            next(err);
        }
    },
};
//# sourceMappingURL=work-done.controller.js.map