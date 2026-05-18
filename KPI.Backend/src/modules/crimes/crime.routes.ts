import { Router } from "express";
import { crimeController } from "./crime.controller";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import {
  CreateCrimeDto,
  UpdateCrimeDto,
  CrimePaginationDto,
  BulkCreateCrimeDto,
} from "./crime.dto";

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Crimes
 *     description: Crime statistics
 */

/**
 * @openapi
 * /crimes:
 *   get:
 *     tags: [Crimes]
 *     summary: Get all crime records
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
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
 *         description: Start date (optional)
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date, example: '2025-12-31' }
 *         description: End date (optional)
 *     responses:
 *       200:
 *         description: List of crime records
 *   post:
 *     tags: [Crimes]
 *     summary: Create crime record (admin)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCrimeDto'
 *     responses:
 *       201:
 *         description: Created
 */
router.get(
  "/",
  authenticate,
  validate(CrimePaginationDto, "query"),
  crimeController.getAll,
);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(CreateCrimeDto),
  crimeController.create,
);

/**
 * @openapi
 * /crimes/bulk:
 *   post:
 *     tags: [Crimes]
 *     summary: Bulk insert/update crime records (admin)
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
 *                   $ref: '#/components/schemas/CreateCrimeDto'
 *     responses:
 *       201:
 *         description: Bulk inserted/updated
 */
router.post(
  "/bulk",
  authenticate,
  authorize("admin"),
  validate(BulkCreateCrimeDto),
  crimeController.bulkCreate,
);

/**
 * @openapi
 * /crimes/{id}:
 *   get:
 *     tags: [Crimes]
 *     summary: Get crime record by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Crime record
 *       404:
 *         description: Not found
 *   patch:
 *     tags: [Crimes]
 *     summary: Update crime record (admin)
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
 *             $ref: '#/components/schemas/UpdateCrimeDto'
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     tags: [Crimes]
 *     summary: Delete crime record (admin)
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

router.get("/:id", authenticate, crimeController.getById);
router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(UpdateCrimeDto),
  crimeController.update,
);
router.delete("/:id", authenticate, authorize("admin"), crimeController.delete);

export default router;
