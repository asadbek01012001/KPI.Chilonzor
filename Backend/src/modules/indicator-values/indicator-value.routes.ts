import { Router } from 'express';
import { indicatorValueController } from './indicator-value.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { CreateIndicatorValueDto, UpdateIndicatorValueDto, IndicatorValuePaginationDto, BulkCreateIndicatorValueDto } from './indicator-value.dto';

const router = Router();

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
router.get('/',  authenticate, validate(IndicatorValuePaginationDto, 'query'), indicatorValueController.getAll);
router.post('/', authenticate, authorize('admin'), validate(CreateIndicatorValueDto), indicatorValueController.create);

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
router.post('/bulk', authenticate, authorize('admin'), validate(BulkCreateIndicatorValueDto), indicatorValueController.bulkCreate);

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
router.get('/:id',    authenticate, indicatorValueController.getById);
router.patch('/:id',  authenticate, authorize('admin'), validate(UpdateIndicatorValueDto), indicatorValueController.update);
router.delete('/:id', authenticate, authorize('admin'), indicatorValueController.delete);

export default router;
