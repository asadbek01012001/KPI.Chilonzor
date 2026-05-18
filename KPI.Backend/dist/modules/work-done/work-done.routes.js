"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const work_done_controller_1 = require("./work-done.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const QuerySchema = zod_1.z.object({
    from: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    to: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});
/**
 * @swagger
 * tags:
 *   name: WorkDone
 *   description: Bajarilgan ishlar — direction bo'yicha indicatorlar va mahallalar bali
 */
/**
 * @swagger
 * /work-done/{directionId}:
 *   get:
 *     summary: Yo'nalish bo'yicha barcha indicatorlar va har mahalla uchun ball
 *     tags: [WorkDone]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: directionId
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date, example: '2025-01-01' }
 *         description: Boshlanish sanasi (optional)
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date, example: '2025-12-31' }
 *         description: Tugash sanasi (optional)
 *     responses:
 *       200:
 *         description: Indicatorlar va mahallalar bali
 */
router.get('/:directionId/export', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(QuerySchema, 'query'), work_done_controller_1.workDoneController.exportExcel);
router.get('/:directionId', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(QuerySchema, 'query'), work_done_controller_1.workDoneController.getByDirection);
/**
 * @swagger
 * /work-done/{directionId}/indicators/{indicatorId}:
 *   get:
 *     summary: Bitta indicator bo'yicha barcha mahallalar bali
 *     tags: [WorkDone]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: directionId
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: path
 *         name: indicatorId
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date, example: '2025-01-01' }
 *         description: Boshlanish sanasi (optional)
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date, example: '2025-12-31' }
 *         description: Tugash sanasi (optional)
 *     responses:
 *       200:
 *         description: Indicator ma'lumotlari va barcha mahallalar bali
 *       404:
 *         description: Indicator topilmadi
 */
router.get('/:directionId/indicators/:indicatorId', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(QuerySchema, 'query'), work_done_controller_1.workDoneController.getByDirectionAndIndicator);
exports.default = router;
//# sourceMappingURL=work-done.routes.js.map