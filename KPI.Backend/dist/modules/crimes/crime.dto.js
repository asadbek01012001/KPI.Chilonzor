"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkCreateCrimeDto = exports.CrimePaginationDto = exports.UpdateCrimeDto = exports.CreateCrimeDto = void 0;
const zod_1 = require("zod");
const scoreFields = { total_crimes: zod_1.z.number().int().min(0).default(0), minor_crimes: zod_1.z.number().int().min(0).default(0), medium_crimes: zod_1.z.number().int().min(0).default(0), serious_crimes: zod_1.z.number().int().min(0).default(0), critical_crimes: zod_1.z.number().int().min(0).default(0), total_crimes_score: zod_1.z.number().default(0), minor_crimes_score: zod_1.z.number().default(0), medium_crimes_score: zod_1.z.number().default(0), serious_crimes_score: zod_1.z.number().default(0), critical_crimes_score: zod_1.z.number().default(0), date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).default(new Date().toISOString().split('T')[0]) };
exports.CreateCrimeDto = zod_1.z.object({ region_id: zod_1.z.string().uuid(), ...scoreFields });
exports.UpdateCrimeDto = zod_1.z.object({ total_crimes: zod_1.z.number().int().min(0).optional(), minor_crimes: zod_1.z.number().int().min(0).optional(), medium_crimes: zod_1.z.number().int().min(0).optional(), serious_crimes: zod_1.z.number().int().min(0).optional(), critical_crimes: zod_1.z.number().int().min(0).optional(), total_crimes_score: zod_1.z.number().optional(), minor_crimes_score: zod_1.z.number().optional(), medium_crimes_score: zod_1.z.number().optional(), serious_crimes_score: zod_1.z.number().optional(), critical_crimes_score: zod_1.z.number().optional(), date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() }).refine(d => Object.keys(d).length > 0, { message: 'At least one field required' });
exports.CrimePaginationDto = zod_1.z.object({ page: zod_1.z.coerce.number().int().min(1).default(1), limit: zod_1.z.coerce.number().int().min(1).max(100).default(10), region_id: zod_1.z.string().uuid().optional(), date: zod_1.z.string().optional(), from: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), to: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() });
exports.BulkCreateCrimeDto = zod_1.z.object({
    items: zod_1.z.array(zod_1.z.object({
        region_id: zod_1.z.string().uuid(),
        total_crimes: zod_1.z.number().int().min(0).default(0),
        minor_crimes: zod_1.z.number().int().min(0).default(0),
        medium_crimes: zod_1.z.number().int().min(0).default(0),
        serious_crimes: zod_1.z.number().int().min(0).default(0),
        critical_crimes: zod_1.z.number().int().min(0).default(0),
        total_crimes_score: zod_1.z.number().default(0),
        minor_crimes_score: zod_1.z.number().default(0),
        medium_crimes_score: zod_1.z.number().default(0),
        serious_crimes_score: zod_1.z.number().default(0),
        critical_crimes_score: zod_1.z.number().default(0),
        date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).default(new Date().toISOString().split('T')[0]),
    })).min(1).max(500),
});
//# sourceMappingURL=crime.dto.js.map