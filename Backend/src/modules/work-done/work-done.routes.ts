import { Router } from 'express';
import { workDoneController } from './work-done.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

const QuerySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to:   z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
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
router.get(
  '/:directionId/export',
  authenticate,
  validate(QuerySchema, 'query'),
  workDoneController.exportExcel
);

router.get(
  '/:directionId',
  authenticate,
  validate(QuerySchema, 'query'),
  workDoneController.getByDirection
);

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
router.get(
  '/:directionId/indicators/:indicatorId',
  authenticate,
  validate(QuerySchema, 'query'),
  workDoneController.getByDirectionAndIndicator
);

export default router;
