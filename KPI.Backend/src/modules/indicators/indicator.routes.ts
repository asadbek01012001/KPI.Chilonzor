import { Router } from 'express';
import { indicatorController } from './indicator.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { CreateIndicatorDto, UpdateIndicatorDto, IndicatorPaginationDto } from './indicator.dto';

const router = Router();

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
router.get('/flat', authenticate, indicatorController.getFlatList);
router.get('/',   authenticate, validate(IndicatorPaginationDto, 'query'), indicatorController.getAll);
router.post('/',  authenticate, authorize('admin'), validate(CreateIndicatorDto), indicatorController.create);

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
router.get('/:id',    authenticate, indicatorController.getById);
router.patch('/:id',  authenticate, authorize('admin'), validate(UpdateIndicatorDto), indicatorController.update);
router.delete('/:id', authenticate, authorize('admin'), indicatorController.delete);

export default router;
