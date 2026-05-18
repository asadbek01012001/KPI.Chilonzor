"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crime_controller_1 = require("./crime.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const crime_dto_1 = require("./crime.dto");
const router = (0, express_1.Router)();
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
router.get("/", auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(crime_dto_1.CrimePaginationDto, "query"), crime_controller_1.crimeController.getAll);
router.post("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("admin"), (0, validate_middleware_1.validate)(crime_dto_1.CreateCrimeDto), crime_controller_1.crimeController.create);
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
router.post("/bulk", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("admin"), (0, validate_middleware_1.validate)(crime_dto_1.BulkCreateCrimeDto), crime_controller_1.crimeController.bulkCreate);
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
router.get("/:id", auth_middleware_1.authenticate, crime_controller_1.crimeController.getById);
router.patch("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("admin"), (0, validate_middleware_1.validate)(crime_dto_1.UpdateCrimeDto), crime_controller_1.crimeController.update);
router.delete("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("admin"), crime_controller_1.crimeController.delete);
exports.default = router;
//# sourceMappingURL=crime.routes.js.map