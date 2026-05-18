"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionPaginationDto = exports.UpdateRegionDto = exports.CreateRegionDto = void 0;
const zod_1 = require("zod");
exports.CreateRegionDto = zod_1.z.object({
    name: zod_1.z.string().min(1).max(200),
    sector: zod_1.z.number().int().min(1),
});
exports.UpdateRegionDto = zod_1.z
    .object({
    name: zod_1.z.string().min(1).max(200).optional(),
    sector: zod_1.z.number().int().min(1).optional(),
})
    .refine((d) => Object.keys(d).length > 0, {
    message: "At least one field required",
});
exports.RegionPaginationDto = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
    search: zod_1.z.string().optional(),
    sector: zod_1.z.coerce.number().int().optional(),
});
//# sourceMappingURL=region.dto.js.map