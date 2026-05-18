"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const direction_controller_1 = require("./direction.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const direction_dto_1 = require("./direction.dto");
const router = (0, express_1.Router)();
/**
 * @openapi
 * tags:
 *   - name: Directions
 *     description: Direction management
 */
/**
 * @openapi
 * /directions:
 *   get:
 *     tags: [Directions]
 *     summary: Get all directions
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
 *     responses:
 *       200:
 *         description: List of directions
 *   post:
 *     tags: [Directions]
 *     summary: Create direction (admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDirectionDto'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DirectionResponse'
 */
router.get('/', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(direction_dto_1.DirectionPaginationDto, 'query'), direction_controller_1.directionController.getAll);
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), (0, validate_middleware_1.validate)(direction_dto_1.CreateDirectionDto), direction_controller_1.directionController.create);
/**
 * @openapi
 * /directions/{id}:
 *   get:
 *     tags: [Directions]
 *     summary: Get direction by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Direction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DirectionResponse'
 *       404:
 *         description: Not found
 *   patch:
 *     tags: [Directions]
 *     summary: Update direction (admin)
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
 *             $ref: '#/components/schemas/UpdateDirectionDto'
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 *   delete:
 *     tags: [Directions]
 *     summary: Delete direction (admin)
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
router.get('/:id', auth_middleware_1.authenticate, direction_controller_1.directionController.getById);
router.patch('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), (0, validate_middleware_1.validate)(direction_dto_1.UpdateDirectionDto), direction_controller_1.directionController.update);
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), direction_controller_1.directionController.delete);
exports.default = router;
//# sourceMappingURL=direction.routes.js.map