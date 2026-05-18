"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkCreateEmergency102Dto = exports.Emergency102PaginationDto = exports.UpdateEmergency102Dto = exports.CreateEmergency102Dto = void 0;
const zod_1 = require("zod");
exports.CreateEmergency102Dto = zod_1.z.object({
    region_id: zod_1.z.string().uuid(),
    total_calls_102: zod_1.z.number().int().min(0).default(0),
    call_pi: zod_1.z.number().int().min(0).default(0),
    iio_complaint: zod_1.z.number().int().min(0).default(0),
    calls_102_score: zod_1.z.number().default(0),
    pi_call_score: zod_1.z.number().default(0),
    iio_complaint_score: zod_1.z.number().default(0),
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).default(new Date().toISOString().split('T')[0]),
});
exports.UpdateEmergency102Dto = zod_1.z.object({
    total_calls_102: zod_1.z.number().int().min(0).optional(),
    call_pi: zod_1.z.number().int().min(0).optional(),
    iio_complaint: zod_1.z.number().int().min(0).optional(),
    calls_102_score: zod_1.z.number().optional(),
    pi_call_score: zod_1.z.number().optional(),
    iio_complaint_score: zod_1.z.number().optional(),
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
}).refine(d => Object.keys(d).length > 0, { message: 'At least one field required' });
exports.Emergency102PaginationDto = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
    region_id: zod_1.z.string().uuid().optional(),
    date: zod_1.z.string().optional(),
    from: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    to: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});
exports.BulkCreateEmergency102Dto = zod_1.z.object({
    items: zod_1.z.array(zod_1.z.object({
        region_id: zod_1.z.string().uuid(),
        total_calls_102: zod_1.z.number().int().min(0).default(0),
        call_pi: zod_1.z.number().int().min(0).default(0),
        iio_complaint: zod_1.z.number().int().min(0).default(0),
        calls_102_score: zod_1.z.number().default(0),
        pi_call_score: zod_1.z.number().default(0),
        iio_complaint_score: zod_1.z.number().default(0),
        date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).default(new Date().toISOString().split('T')[0]),
    })).min(1).max(500),
});
//# sourceMappingURL=emergency102.dto.js.map