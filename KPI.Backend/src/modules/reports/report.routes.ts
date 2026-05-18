import { Router } from 'express';
import { reportController } from './report.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

const ReportQuerySchema = z.object({
  from:      z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to:        z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  region_id: z.string().uuid().optional(),
  sector:    z.coerce.number().int().min(1).max(10).optional(),
  search:    z.string().min(1).max(100).optional(),
});

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Mahalla kesimida to'liq xisobotlar
 */

/**
 * @swagger
 * /reports/mahalla:
 *   get:
 *     summary: Mahalla kesimida to'liq xisobot
 *     description: |
 *       `region_id` berilsa — faqat o'sha mahalla qaytadi.
 *       `region_id` berilmasa — barcha mahallalar qaytadi.
 *       `from`/`to` berilmasa — barcha vaqt uchun hisoblanadi.
 *     tags: [Reports]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date, example: '2025-01-01' }
 *         description: Boshlanish sanasi (optional)
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date, example: '2025-12-31' }
 *         description: Tugash sanasi (optional)
 *       - in: query
 *         name: region_id
 *         schema: { type: string, format: uuid }
 *         description: Mahalla UUID (optional)
 *       - in: query
 *         name: sector
 *         schema: { type: integer, example: 1 }
 *         description: Sektor bo'yicha filter (optional)
 *       - in: query
 *         name: search
 *         schema: { type: string, example: 'Chilonzor' }
 *         description: MFY nomi bo'yicha qidirish (optional)
 *     responses:
 *       200:
 *         description: Xisobot muvaffaqiyatli qaytdi
 *       404:
 *         description: Mahalla topilmadi
 */
router.get('/mahalla', authenticate, validate(ReportQuerySchema, 'query'), reportController.getMahallaReport);

/**
 * @swagger
 * /reports/export/excel:
 *   get:
 *     summary: Report jadvalini Excel formatida yuklab olish
 *     tags: [Reports]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date, example: '2025-01-01' }
 *         description: Boshlanish sanasi (optional)
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date, example: '2025-12-31' }
 *         description: Tugash sanasi (optional)
 *       - in: query
 *         name: sector
 *         schema: { type: integer }
 *         description: Sektor bo'yicha filter (optional)
 *     responses:
 *       200:
 *         description: Excel fayl (.xlsx)
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/export/excel', authenticate, validate(ReportQuerySchema, 'query'), reportController.exportExcel);

export default router;
