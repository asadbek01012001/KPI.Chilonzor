import { z } from 'zod';
export declare const CreateEmergency102Dto: z.ZodObject<{
    region_id: z.ZodString;
    total_calls_102: z.ZodDefault<z.ZodNumber>;
    call_pi: z.ZodDefault<z.ZodNumber>;
    iio_complaint: z.ZodDefault<z.ZodNumber>;
    calls_102_score: z.ZodDefault<z.ZodNumber>;
    pi_call_score: z.ZodDefault<z.ZodNumber>;
    iio_complaint_score: z.ZodDefault<z.ZodNumber>;
    date: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export declare const UpdateEmergency102Dto: z.ZodObject<{
    total_calls_102: z.ZodOptional<z.ZodNumber>;
    call_pi: z.ZodOptional<z.ZodNumber>;
    iio_complaint: z.ZodOptional<z.ZodNumber>;
    calls_102_score: z.ZodOptional<z.ZodNumber>;
    pi_call_score: z.ZodOptional<z.ZodNumber>;
    iio_complaint_score: z.ZodOptional<z.ZodNumber>;
    date: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const Emergency102PaginationDto: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    region_id: z.ZodOptional<z.ZodString>;
    date: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateEmergency102DtoType = z.infer<typeof CreateEmergency102Dto>;
export type UpdateEmergency102DtoType = z.infer<typeof UpdateEmergency102Dto>;
export type Emergency102PaginationDtoType = z.infer<typeof Emergency102PaginationDto>;
export declare const BulkCreateEmergency102Dto: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        region_id: z.ZodString;
        total_calls_102: z.ZodDefault<z.ZodNumber>;
        call_pi: z.ZodDefault<z.ZodNumber>;
        iio_complaint: z.ZodDefault<z.ZodNumber>;
        calls_102_score: z.ZodDefault<z.ZodNumber>;
        pi_call_score: z.ZodDefault<z.ZodNumber>;
        iio_complaint_score: z.ZodDefault<z.ZodNumber>;
        date: z.ZodDefault<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type BulkCreateEmergency102DtoType = z.infer<typeof BulkCreateEmergency102Dto>;
//# sourceMappingURL=emergency102.dto.d.ts.map