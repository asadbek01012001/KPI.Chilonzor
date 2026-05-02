import { Router } from 'express';
import { directionController } from './direction.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { CreateDirectionDto, UpdateDirectionDto, DirectionPaginationDto } from './direction.dto';

const router = Router();

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
router.get('/',   authenticate, validate(DirectionPaginationDto, 'query'), directionController.getAll);
router.post('/',  authenticate, authorize('admin'), validate(CreateDirectionDto), directionController.create);

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
router.get('/:id',    authenticate, directionController.getById);
router.patch('/:id',  authenticate, authorize('admin'), validate(UpdateDirectionDto), directionController.update);
router.delete('/:id', authenticate, authorize('admin'), directionController.delete);

export default router;
