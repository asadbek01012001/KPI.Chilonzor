"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkCreateIndicatorValueDto = exports.IndicatorValuePaginationDto = exports.UpdateIndicatorValueDto = exports.CreateIndicatorValueDto = void 0;
const zod_1 = require("zod");
exports.CreateIndicatorValueDto = zod_1.z.object({
    indicator_id: zod_1.z.string().uuid(),
    direction_id: zod_1.z.string().uuid(),
    region_id: zod_1.z.string().uuid(),
    score: zod_1.z.number().default(0),
    value: zod_1.z.number().default(0),
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
exports.UpdateIndicatorValueDto = zod_1.z.object({
    score: zod_1.z.number().optional(),
    value: zod_1.z.number().optional(),
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
}).refine(d => Object.keys(d).length > 0, { message: 'At least one field required' });
exports.IndicatorValuePaginationDto = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
    indicator_id: zod_1.z.string().uuid().optional(),
    direction_id: zod_1.z.string().uuid().optional(),
    region_id: zod_1.z.string().uuid().optional(),
    date: zod_1.z.string().optional(),
    from: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    to: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});
exports.BulkCreateIndicatorValueDto = zod_1.z.object({
    items: zod_1.z.array(zod_1.z.object({
        indicator_id: zod_1.z.string().uuid(),
        direction_id: zod_1.z.string().uuid(),
        region_id: zod_1.z.string().uuid(),
        score: zod_1.z.number().default(0),
        value: zod_1.z.number().default(0),
        date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    })).min(1).max(500),
});
//# sourceMappingURL=indicator-value.dto.js.map