import { z } from 'zod';
export declare const CreateIndicatorDto: z.ZodObject<{
    direction_id: z.ZodString;
    parent_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    name: z.ZodString;
    score: z.ZodDefault<z.ZodNumber>;
    is_subtraction: z.ZodDefault<z.ZodBoolean>;
    index: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const UpdateIndicatorDto: z.ZodObject<{
    direction_id: z.ZodOptional<z.ZodString>;
    parent_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    name: z.ZodOptional<z.ZodString>;
    score: z.ZodOptional<z.ZodNumber>;
    is_subtraction: z.ZodOptional<z.ZodBoolean>;
    index: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const IndicatorPaginationDto: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    direction_id: z.ZodOptional<z.ZodString>;
    parent_id: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateIndicatorDtoType = z.infer<typeof CreateIndicatorDto>;
export type UpdateIndicatorDtoType = z.infer<typeof UpdateIndicatorDto>;
export type IndicatorPaginationDtoType = z.infer<typeof IndicatorPaginationDto>;
//# sourceMappingURL=indicator.dto.d.ts.map