"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const indicator_value_controller_1 = require("./indicator-value.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const indicator_value_dto_1 = require("./indicator-value.dto");
const router = (0, express_1.Router)();
/**
 * @openapi
 * tags:
 *   - name: IndicatorValues
 *     description: Indicator value management
 */
/**
 * @openapi
 * /indicator-values:
 *   get:
 *     tags: [IndicatorValues]
 *     summary: Get all indicator values
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: indicator_id
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: direction_id
 *         schema: { type: string, format: uuid }
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
 *         description: List of indicator values
 *   post:
 *     tags: [IndicatorValues]
 *     summary: Create indicator value (admin)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateIndicatorValueDto'
 *     responses:
 *       201:
 *         description: Created
 */
router.get('/', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(indicator_value_dto_1.IndicatorValuePaginationDto, 'query'), indicator_value_controller_1.indicatorValueController.getAll);
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), (0, validate_middleware_1.validate)(indicator_value_dto_1.CreateIndicatorValueDto), indicator_value_controller_1.indicatorValueController.create);
/**
 * @openapi
 * /indicator-values/bulk:
 *   post:
 *     tags: [IndicatorValues]
 *     summary: Bulk upsert indicator values (admin)
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
 *                   $ref: '#/components/schemas/CreateIndicatorValueDto'
 *     responses:
 *       201:
 *         description: Bulk inserted/updated
 */
router.post('/bulk', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), (0, validate_middleware_1.validate)(indicator_value_dto_1.BulkCreateIndicatorValueDto), indicator_value_controller_1.indicatorValueController.bulkCreate);
router.delete('/by-date', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), indicator_value_controller_1.indicatorValueController.deleteByDate);
/**
 * @openapi
 * /indicator-values/{id}:
 *   get:
 *     tags: [IndicatorValues]
 *     summary: Get indicator value by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Indicator value
 *       404:
 *         description: Not found
 *   patch:
 *     tags: [IndicatorValues]
 *     summary: Update indicator value (admin)
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
 *             $ref: '#/components/schemas/UpdateIndicatorValueDto'
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     tags: [IndicatorValues]
 *     summary: Delete indicator value (admin)
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
router.get('/:id', auth_middleware_1.authenticate, indicator_value_controller_1.indicatorValueController.getById);
router.patch('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), (0, validate_middleware_1.validate)(indicator_value_dto_1.UpdateIndicatorValueDto), indicator_value_controller_1.indicatorValueController.update);
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), indicator_value_controller_1.indicatorValueController.delete);
exports.default = router;
//# sourceMappingURL=indicator-value.routes.js.map