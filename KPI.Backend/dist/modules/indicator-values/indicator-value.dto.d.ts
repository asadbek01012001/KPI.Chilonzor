import { z } from 'zod';
export declare const CreateIndicatorValueDto: z.ZodObject<{
    indicator_id: z.ZodString;
    direction_id: z.ZodString;
    region_id: z.ZodString;
    score: z.ZodDefault<z.ZodNumber>;
    value: z.ZodDefault<z.ZodNumber>;
    date: z.ZodString;
}, z.core.$strip>;
export declare const UpdateIndicatorValueDto: z.ZodObject<{
    score: z.ZodOptional<z.ZodNumber>;
    value: z.ZodOptional<z.ZodNumber>;
    date: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const IndicatorValuePaginationDto: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    indicator_id: z.ZodOptional<z.ZodString>;
    direction_id: z.ZodOptional<z.ZodString>;
    region_id: z.ZodOptional<z.ZodString>;
    date: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateIndicatorValueDtoType = z.infer<typeof CreateIndicatorValueDto>;
export type UpdateIndicatorValueDtoType = z.infer<typeof UpdateIndicatorValueDto>;
export type IndicatorValuePaginationDtoType = z.infer<typeof IndicatorValuePaginationDto>;
export declare const BulkCreateIndicatorValueDto: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        indicator_id: z.ZodString;
        direction_id: z.ZodString;
        region_id: z.ZodString;
        score: z.ZodDefault<z.ZodNumber>;
        value: z.ZodDefault<z.ZodNumber>;
        date: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type BulkCreateIndicatorValueDtoType = z.infer<typeof BulkCreateIndicatorValueDto>;
//# sourceMappingURL=indicator-value.dto.d.ts.map