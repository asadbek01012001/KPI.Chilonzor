"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const rateLimiter_middleware_1 = require("../../middleware/rateLimiter.middleware");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const RegisterSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').trim(),
    email: zod_1.z.string().email('Invalid email').trim(),
    password: zod_1.z.string().min(6, 'Min 6 characters'),
});
const LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email').trim(),
    password: zod_1.z.string().min(1, 'Password is required'),
});
const RefreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1, 'Refresh token is required'),
});
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterDto'
 *     responses:
 *       201:
 *         description: Registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       409:
 *         description: Email already in use
 */
router.post('/register', (0, rateLimiter_middleware_1.rateLimiter)(5, 15 * 60 * 1000), (0, validate_middleware_1.validate)(RegisterSchema), auth_controller_1.authController.register);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', (0, rateLimiter_middleware_1.rateLimiter)(10, 15 * 60 * 1000), (0, validate_middleware_1.validate)(LoginSchema), auth_controller_1.authController.login);
/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: Tokens refreshed
 */
router.post('/refresh', (0, validate_middleware_1.validate)(RefreshSchema), auth_controller_1.authController.refresh);
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Logged out
 */
router.post('/logout', auth_middleware_1.authenticate, auth_controller_1.authController.logout);
/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Current user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 */
router.get('/me', auth_middleware_1.authenticate, auth_controller_1.authController.me);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map