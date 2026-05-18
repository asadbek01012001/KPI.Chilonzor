"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const emergency102_controller_1 = require("./emergency102.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const emergency102_dto_1 = require("./emergency102.dto");
const router = (0, express_1.Router)();
/**
 * @openapi
 * tags:
 *   - name: Emergency102
 *     description: 102 emergency call statistics
 */
/**
 * @openapi
 * /emergency102:
 *   get:
 *     tags: [Emergency102]
 *     summary: Get all emergency 102 records
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: region_id
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: date
 *         schema: { type: string, format: date }
 *         description: Exact date filter (YYYY-MM-DD)
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
 *         description: List of emergency 102 records
 *   post:
 *     tags: [Emergency102]
 *     summary: Create emergency 102 record (admin)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEmergency102Dto'
 *     responses:
 *       201:
 *         description: Created
 */
router.get('/', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(emergency102_dto_1.Emergency102PaginationDto, 'query'), emergency102_controller_1.emergency102Controller.getAll);
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), (0, validate_middleware_1.validate)(emergency102_dto_1.CreateEmergency102Dto), emergency102_controller_1.emergency102Controller.create);
/**
 * @openapi
 * /emergency102/bulk:
 *   post:
 *     tags: [Emergency102]
 *     summary: Bulk insert/update emergency102 records (admin)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/CreateEmergency102Dto'
 *     responses:
 *       201:
 *         description: Bulk inserted/updated
 */
router.post('/bulk', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), (0, validate_middleware_1.validate)(emergency102_dto_1.BulkCreateEmergency102Dto), emergency102_controller_1.emergency102Controller.bulkCreate);
/**
 * @openapi
 * /emergency102/{id}:
 *   get:
 *     tags: [Emergency102]
 *     summary: Get emergency 102 record by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Emergency 102 record
 *       404:
 *         description: Not found
 *   patch:
 *     tags: [Emergency102]
 *     summary: Update emergency 102 record (admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEmergency102Dto'
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     tags: [Emergency102]
 *     summary: Delete emergency 102 record (admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Deleted
 */
router.get('/:id', auth_middleware_1.authenticate, emergency102_controller_1.emergency102Controller.getById);
router.patch('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), (0, validate_middleware_1.validate)(emergency102_dto_1.UpdateEmergency102Dto), emergency102_controller_1.emergency102Controller.update);
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), emergency102_controller_1.emergency102Controller.delete);
exports.default = router;
//# sourceMappingURL=emergency102.routes.js.map