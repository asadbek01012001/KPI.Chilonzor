import { z } from 'zod';
export declare const CreateCrimeDto: z.ZodObject<{
    total_crimes: z.ZodDefault<z.ZodNumber>;
    minor_crimes: z.ZodDefault<z.ZodNumber>;
    medium_crimes: z.ZodDefault<z.ZodNumber>;
    serious_crimes: z.ZodDefault<z.ZodNumber>;
    critical_crimes: z.ZodDefault<z.ZodNumber>;
    total_crimes_score: z.ZodDefault<z.ZodNumber>;
    minor_crimes_score: z.ZodDefault<z.ZodNumber>;
    medium_crimes_score: z.ZodDefault<z.ZodNumber>;
    serious_crimes_score: z.ZodDefault<z.ZodNumber>;
    critical_crimes_score: z.ZodDefault<z.ZodNumber>;
    date: z.ZodDefault<z.ZodString>;
    region_id: z.ZodString;
}, z.core.$strip>;
export declare const UpdateCrimeDto: z.ZodObject<{
    total_crimes: z.ZodOptional<z.ZodNumber>;
    minor_crimes: z.ZodOptional<z.ZodNumber>;
    medium_crimes: z.ZodOptional<z.ZodNumber>;
    serious_crimes: z.ZodOptional<z.ZodNumber>;
    critical_crimes: z.ZodOptional<z.ZodNumber>;
    total_crimes_score: z.ZodOptional<z.ZodNumber>;
    minor_crimes_score: z.ZodOptional<z.ZodNumber>;
    medium_crimes_score: z.ZodOptional<z.ZodNumber>;
    serious_crimes_score: z.ZodOptional<z.ZodNumber>;
    critical_crimes_score: z.ZodOptional<z.ZodNumber>;
    date: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const CrimePaginationDto: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    region_id: z.ZodOptional<z.ZodString>;
    date: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateCrimeDtoType = z.infer<typeof CreateCrimeDto>;
export type UpdateCrimeDtoType = z.infer<typeof UpdateCrimeDto>;
export type CrimePaginationDtoType = z.infer<typeof CrimePaginationDto>;
export declare const BulkCreateCrimeDto: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        region_id: z.ZodString;
        total_crimes: z.ZodDefault<z.ZodNumber>;
        minor_crimes: z.ZodDefault<z.ZodNumber>;
        medium_crimes: z.ZodDefault<z.ZodNumber>;
        serious_crimes: z.ZodDefault<z.ZodNumber>;
        critical_crimes: z.ZodDefault<z.ZodNumber>;
        total_crimes_score: z.ZodDefault<z.ZodNumber>;
        minor_crimes_score: z.ZodDefault<z.ZodNumber>;
        medium_crimes_score: z.ZodDefault<z.ZodNumber>;
        serious_crimes_score: z.ZodDefault<z.ZodNumber>;
        critical_crimes_score: z.ZodDefault<z.ZodNumber>;
        date: z.ZodDefault<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type BulkCreateCrimeDtoType = z.infer<typeof BulkCreateCrimeDto>;
//# sourceMappingURL=crime.dto.d.ts.map