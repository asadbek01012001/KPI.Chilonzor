import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

const DateRange = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to:   z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});
const DateRangeWithOpts = DateRange.extend({
  region_id: z.string().uuid().optional(),
  sector:    z.coerce.number().int().min(1).max(10).optional(),
});
const DateRangeWithLimit = DateRange.extend({
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// Swagger shared param definitions
// from/to params snippet (not required)
/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard endpointlari
 */

/**
 * @swagger
 * /dashboard/mahalla:
 *   get:
 *     summary: Mahalla kesimida dashboard
 *     tags: [Dashboard]
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
 *         description: Berilsa bitta mahalla, berilmasa barchasi
 *       - in: query
 *         name: sector
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli
 */
router.get('/mahalla', authenticate, validate(DateRangeWithOpts, 'query'), dashboardController.getMahalla);

/**
 * @swagger
 * /dashboard/top-crimes:
 *   get:
 *     summary: Jinoyatchilik bo'yicha top mahallalar
 *     tags: [Dashboard]
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
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Top mahallalar ro'yxati
 */
router.get('/top-crimes', authenticate, validate(DateRangeWithLimit, 'query'), dashboardController.topCrimes);

/**
 * @swagger
 * /dashboard/top-102:
 *   get:
 *     summary: 102 xizmati bo'yicha top mahallalar
 *     tags: [Dashboard]
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
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Top mahallalar ro'yxati
 */
router.get('/top-102', authenticate, validate(DateRangeWithLimit, 'query'), dashboardController.top102);

/**
 * @swagger
 * /dashboard/sectors:
 *   get:
 *     summary: Sektorlar bo'yicha umumiy hisobot (4 ta element)
 *     tags: [Dashboard]
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
 *     responses:
 *       200:
 *         description: 4 ta sektor uchun kpi, crime, 102 ballari
 */
router.get('/sectors', authenticate, validate(DateRange, 'query'), dashboardController.sectorSummary);

/**
 * @swagger
 * /dashboard/sector-regions:
 *   get:
 *     summary: "Sektorlar bo'yicha MFYlar ro'yxati (total_score, rank bilan)"
 *     tags: [Dashboard]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date, example: '2025-01-01' }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date, example: '2025-12-31' }
 *     responses:
 *       200:
 *         description: "4 ta sektor, har birida MFYlar ro'yxati"
 */
router.get('/sector-regions', authenticate, validate(DateRange, 'query'), dashboardController.sectorRegions);

/**
 * @swagger
 * /dashboard/directions:
 *   get:
 *     summary: Yo'nalishlar va har birida nechta indicator
 *     tags: [Dashboard]
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
 *     responses:
 *       200:
 *         description: Yo'nalishlar ro'yxati (indicator_count bilan)
 */
router.get('/directions', authenticate, validate(DateRange, 'query'), dashboardController.directionsWithCount);

/**
 * @swagger
 * /dashboard/directions/{directionId}/regions:
 *   get:
 *     summary: Berilgan yo'nalish bo'yicha mahallalar reytingi
 *     tags: [Dashboard]
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
 *         description: Mahallalar ro'yxati (total_score, rank bilan)
 */
router.get('/directions/:directionId/regions', authenticate, validate(DateRange, 'query'), dashboardController.regionsByDirection);

/**
 * @swagger
 * /dashboard/directions/{directionId}/regions/{regionId}/indicators:
 *   get:
 *     summary: Yo'nalish + mahalla uchun indikatorlar va ballari
 *     tags: [Dashboard]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: directionId
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: path
 *         name: regionId
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
 *         description: Indikatorlar (achieved_score, max_score, total_value bilan)
 */
router.get('/directions/:directionId/regions/:regionId/indicators', authenticate, validate(DateRange, 'query'), dashboardController.indicatorsByDirectionAndRegion);

/**
 * @swagger
 * /dashboard/regions/{regionId}/summary:
 *   get:
 *     summary: Mahalla uchun umumiy ko'rsatkichlar (crime + 102 + directions)
 *     tags: [Dashboard]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: regionId
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
 *         description: Crime, 102, va yo'nalishlar bo'yicha umumiy balllar
 *       404:
 *         description: Mahalla topilmadi
 */
router.get('/regions/:regionId/summary', authenticate, validate(DateRange, 'query'), dashboardController.regionSummary);

/**
 * @swagger
 * /dashboard/info:
 *   get:
 *     summary: Dashboard umumiy ma'lumotlar (indikatorlar, regionlar, directions, o'rtacha, lider)
 *     tags: [Dashboard]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date, example: '2025-01-01' }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date, example: '2025-12-31' }
 *     responses:
 *       200:
 *         description: Umumiy statistika
 */
router.get('/info', authenticate, validate(DateRange, 'query'), dashboardController.info);

/**
 * @swagger
 * /dashboard/chart/region/{regionId}/timeline:
 *   get:
 *     summary: "MFY umumiy ball dinamikasi — vaqt bo'yicha (max 10 interval)"
 *     tags: [Dashboard]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: regionId
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: from
 *         required: true
 *         schema: { type: string, format: date, example: '2025-02-01' }
 *       - in: query
 *         name: to
 *         required: true
 *         schema: { type: string, format: date, example: '2025-03-01' }
 *     responses:
 *       200:
 *         description: "interval_days, data[]: label, from, to, kpi_score, total_score"
 */
router.get('/chart/region/:regionId/timeline', authenticate, validate(DateRange, 'query'), dashboardController.chartRegion);

/**
 * @swagger
 * /dashboard/chart/direction/{directionId}:
 *   get:
 *     summary: "Yo'nalish bo'yicha barcha MFYlar bali — snapshot"
 *     tags: [Dashboard]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: directionId
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date, example: '2025-01-01' }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date, example: '2025-12-31' }
 *     responses:
 *       200:
 *         description: "direction_name, data[]: region_name, score, rank"
 */
router.get('/chart/direction/:directionId', authenticate, validate(DateRange, 'query'), dashboardController.chartDirection);

/**
 * @swagger
 * /dashboard/chart/district:
 *   get:
 *     summary: "Tuman umumiy — barcha MFYlar total_score bo'yicha reyting"
 *     tags: [Dashboard]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date, example: '2025-01-01' }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date, example: '2025-12-31' }
 *     responses:
 *       200:
 *         description: "data[]: region_name, kpi_score, total_score, rank — rank bo'yicha tartiblangan"
 */
router.get('/chart/district', authenticate, validate(DateRange, 'query'), dashboardController.chartDistrict);

export default router;
