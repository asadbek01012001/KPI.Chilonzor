import { z } from 'zod';
export declare const CreateDirectionDto: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
export declare const UpdateDirectionDto: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const DirectionPaginationDto: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateDirectionDtoType = z.infer<typeof CreateDirectionDto>;
export type UpdateDirectionDtoType = z.infer<typeof UpdateDirectionDto>;
export type DirectionPaginationDtoType = z.infer<typeof DirectionPaginationDto>;
//# sourceMappingURL=direction.dto.d.ts.map