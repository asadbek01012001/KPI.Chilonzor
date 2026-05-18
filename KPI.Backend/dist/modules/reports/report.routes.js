"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const report_controller_1 = require("./report.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const ReportQuerySchema = zod_1.z.object({
    from: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    to: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    region_id: zod_1.z.string().uuid().optional(),
    sector: zod_1.z.coerce.number().int().min(1).max(10).optional(),
    search: zod_1.z.string().min(1).max(100).optional(),
});
/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Mahalla kesimida to'liq xisobotlar
 */
/**
 * @swagger
 * /reports/mahalla:
 *   get:
 *     summary: Mahalla kesimida to'liq xisobot
 *     description: |
 *       `region_id` berilsa — faqat o'sha mahalla qaytadi.
 *       `region_id` berilmasa — barcha mahallalar qaytadi.
 *       `from`/`to` berilmasa — barcha vaqt uchun hisoblanadi.
 *     tags: [Reports]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date, example: '2025-01-01' }
 *         description: Boshlanish sanasi (optional)
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date, example: '2025-12-31' }
 *         description: Tugash sanasi (optional)
 *       - in: query
 *         name: region_id
 *         schema: { type: string, format: uuid }
 *         description: Mahalla UUID (optional)
 *       - in: query
 *         name: sector
 *         schema: { type: integer, example: 1 }
 *         description: Sektor bo'yicha filter (optional)
 *       - in: query
 *         name: search
 *         schema: { type: string, example: 'Chilonzor' }
 *         description: MFY nomi bo'yicha qidirish (optional)
 *     responses:
 *       200:
 *         description: Xisobot muvaffaqiyatli qaytdi
 *       404:
 *         description: Mahalla topilmadi
 */
router.get('/mahalla', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(ReportQuerySchema, 'query'), report_controller_1.reportController.getMahallaReport);
/**
 * @swagger
 * /reports/export/excel:
 *   get:
 *     summary: Report jadvalini Excel formatida yuklab olish
 *     tags: [Reports]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date, example: '2025-01-01' }
 *         description: Boshlanish sanasi (optional)
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date, example: '2025-12-31' }
 *         description: Tugash sanasi (optional)
 *       - in: query
 *         name: sector
 *         schema: { type: integer }
 *         description: Sektor bo'yicha filter (optional)
 *     responses:
 *       200:
 *         description: Excel fayl (.xlsx)
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/export/excel', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(ReportQuerySchema, 'query'), report_controller_1.reportController.exportExcel);
exports.default = router;
//# sourceMappingURL=report.routes.js.map