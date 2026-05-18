"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPaginationSchema = exports.UpdateUserSchema = exports.CreateUserSchema = void 0;
const zod_1 = require("zod");
exports.CreateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(100).trim(),
    email: zod_1.z.string().email('Valid email required').trim(),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    role: zod_1.z.enum(['admin', 'user']).optional(),
});
exports.UpdateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100).trim().optional(),
    email: zod_1.z.string().email().trim().optional(),
    password: zod_1.z.string().min(6).optional(),
    role: zod_1.z.enum(['admin', 'user']).optional(),
    is_active: zod_1.z.boolean().optional(),
}).refine(d => Object.keys(d).length > 0, { message: 'At least one field required' });
exports.UserPaginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
    search: zod_1.z.string().optional(),
});
//# sourceMappingURL=user.dto.js.map