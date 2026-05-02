import { Router } from 'express';
import { regionController } from './region.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { CreateRegionDto, UpdateRegionDto, RegionPaginationDto } from './region.dto';

const router = Router();

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
router.get('/',    authenticate, validate(RegionPaginationDto, 'query'), regionController.getAll);
router.post('/',   authenticate, authorize('admin'), validate(CreateRegionDto), regionController.create);

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
router.get('/:id',    authenticate, regionController.getById);
router.patch('/:id',  authenticate, authorize('admin'), validate(UpdateRegionDto), regionController.update);
router.delete('/:id', authenticate, authorize('admin'), regionController.delete);

export default router;
