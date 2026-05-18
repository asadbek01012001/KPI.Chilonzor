import { z } from "zod";
export declare const CreateRegionDto: z.ZodObject<{
    name: z.ZodString;
    sector: z.ZodNumber;
}, z.core.$strip>;
export declare const UpdateRegionDto: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    sector: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const RegionPaginationDto: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    search: z.ZodOptional<z.ZodString>;
    sector: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type CreateRegionDtoType = z.infer<typeof CreateRegionDto>;
export type UpdateRegionDtoType = z.infer<typeof UpdateRegionDto>;
export type RegionPaginationDtoType = z.infer<typeof RegionPaginationDto>;
//# sourceMappingURL=region.dto.d.ts.map