"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndicatorPaginationDto = exports.UpdateIndicatorDto = exports.CreateIndicatorDto = void 0;
const zod_1 = require("zod");
exports.CreateIndicatorDto = zod_1.z.object({
    direction_id: zod_1.z.string().uuid(),
    parent_id: zod_1.z.string().uuid().nullable().optional(),
    name: zod_1.z.string().min(1).max(300),
    score: zod_1.z.number().default(0),
    is_subtraction: zod_1.z.boolean().default(false),
    index: zod_1.z.number().int().optional(),
});
exports.UpdateIndicatorDto = zod_1.z.object({
    direction_id: zod_1.z.string().uuid().optional(),
    parent_id: zod_1.z.string().uuid().nullable().optional(),
    name: zod_1.z.string().min(1).max(300).optional(),
    score: zod_1.z.number().optional(),
    is_subtraction: zod_1.z.boolean().optional(),
    index: zod_1.z.number().int().optional(),
}).refine(d => Object.keys(d).length > 0, { message: 'At least one field required' });
exports.IndicatorPaginationDto = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
    direction_id: zod_1.z.string().uuid().optional(),
    parent_id: zod_1.z.string().uuid().optional(),
});
//# sourceMappingURL=indicator.dto.js.map