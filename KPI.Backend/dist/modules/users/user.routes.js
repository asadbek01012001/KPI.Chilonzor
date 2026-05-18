"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const user_dto_1 = require("./user.dto");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
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
 *         description: List of users
 *   post:
 *     summary: Create a new user (admin only)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterDto'
 *     responses:
 *       201:
 *         description: User created
 *       409:
 *         description: Email already in use
 */
router.get('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), (0, validate_middleware_1.validate)(user_dto_1.UserPaginationSchema, 'query'), user_controller_1.userController.getAll);
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), (0, validate_middleware_1.validate)(user_dto_1.CreateUserSchema), user_controller_1.userController.create);
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: User data
 *       404:
 *         description: User not found
 *   patch:
 *     summary: Update user
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserDto'
 *     responses:
 *       200:
 *         description: User updated
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.get('/:id', auth_middleware_1.authenticate, user_controller_1.userController.getById);
router.patch('/:id', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(user_dto_1.UpdateUserSchema), user_controller_1.userController.update);
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin'), user_controller_1.userController.delete);
exports.default = router;
//# sourceMappingURL=user.routes.js.map