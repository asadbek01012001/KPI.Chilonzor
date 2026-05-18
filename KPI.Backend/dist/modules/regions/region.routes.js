"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const region_controller_1 = require("./region.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const region_dto_1 = require("./region.dto");
const router = (0, express_1.Router)();
/**
 * @openapi
 * tags:
 *   - name: Regions
 *     description: Region management
 */
/**
 * @openapi
 * /regions:
 *   get:
 *     tags: [Regions]
 *     summary: Get all regions
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: sector
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of regions
 *   post:
 *     tags: [Regions]
 *     summary: Create region (admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRegionDto'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegionResponse'
 */
router.get('/', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(region_dto_1.RegionPaginationDto, 'query'), region_controller_1.regionController.getAll);
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), (0, validate_middleware_1.validate)(region_dto_1.CreateRegionDto), region_controller_1.regionController.create);
/**
 * @openapi
 * /regions/{id}:
 *   get:
 *     tags: [Regions]
 *     summary: Get region by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Region
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegionResponse'
 *       404:
 *         description: Not found
 *   patch:
 *     tags: [Regions]
 *     summary: Update region (admin)
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
 *             $ref: '#/components/schemas/UpdateRegionDto'
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 *   delete:
 *     tags: [Regions]
 *     summary: Delete region (admin)
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
router.get('/:id', auth_middleware_1.authenticate, region_controller_1.regionController.getById);
router.patch('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), (0, validate_middleware_1.validate)(region_dto_1.UpdateRegionDto), region_controller_1.regionController.update);
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), region_controller_1.regionController.delete);
exports.default = router;
//# sourceMappingURL=region.routes.js.map