"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const indicator_controller_1 = require("./indicator.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const indicator_dto_1 = require("./indicator.dto");
const router = (0, express_1.Router)();
/**
 * @openapi
 * tags:
 *   - name: Indicators
 *     description: Indicator management
 */
/**
 * @openapi
 * /indicators:
 *   get:
 *     tags: [Indicators]
 *     summary: Get all indicators
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: direction_id
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: parent_id
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: List of indicators
 *   post:
 *     tags: [Indicators]
 *     summary: Create indicator (admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateIndicatorDto'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IndicatorResponse'
 */
router.get('/flat', auth_middleware_1.authenticate, indicator_controller_1.indicatorController.getFlatList);
router.get('/', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(indicator_dto_1.IndicatorPaginationDto, 'query'), indicator_controller_1.indicatorController.getAll);
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), (0, validate_middleware_1.validate)(indicator_dto_1.CreateIndicatorDto), indicator_controller_1.indicatorController.create);
/**
 * @openapi
 * /indicators/{id}:
 *   get:
 *     tags: [Indicators]
 *     summary: Get indicator by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Indicator
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IndicatorResponse'
 *       404:
 *         description: Not found
 *   patch:
 *     tags: [Indicators]
 *     summary: Update indicator (admin)
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
 *             $ref: '#/components/schemas/UpdateIndicatorDto'
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 *   delete:
 *     tags: [Indicators]
 *     summary: Delete indicator (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.get('/:id', auth_middleware_1.authenticate, indicator_controller_1.indicatorController.getById);
router.patch('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), (0, validate_middleware_1.validate)(indicator_dto_1.UpdateIndicatorDto), indicator_controller_1.indicatorController.update);
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), indicator_controller_1.indicatorController.delete);
exports.default = router;
//# sourceMappingURL=indicator.routes.js.map