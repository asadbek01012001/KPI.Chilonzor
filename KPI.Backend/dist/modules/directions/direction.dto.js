"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectionPaginationDto = exports.UpdateDirectionDto = exports.CreateDirectionDto = void 0;
const zod_1 = require("zod");
exports.CreateDirectionDto = zod_1.z.object({ name: zod_1.z.string().min(1).max(300) });
exports.UpdateDirectionDto = zod_1.z.object({ name: zod_1.z.string().min(1).max(300).optional() }).refine(d => Object.keys(d).length > 0, { message: 'At least one field required' });
exports.DirectionPaginationDto = zod_1.z.object({ page: zod_1.z.coerce.number().int().min(1).default(1), limit: zod_1.z.coerce.number().int().min(1).max(100).default(10), search: zod_1.z.string().optional() });
//# sourceMappingURL=direction.dto.js.map