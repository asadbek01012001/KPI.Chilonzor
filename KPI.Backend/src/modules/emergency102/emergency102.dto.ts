import { z } from 'zod';

export const CreateEmergency102Dto = z.object({
  region_id:           z.string().uuid(),
  total_calls_102:     z.number().int().min(0).default(0),
  call_pi:             z.number().int().min(0).default(0),
  iio_complaint:       z.number().int().min(0).default(0),
  calls_102_score:     z.number().default(0),
  pi_call_score:       z.number().default(0),
  iio_complaint_score: z.number().default(0),
  date:                z.string().regex(/^\d{4}-\d{2}-\d{2}$/).default(new Date().toISOString().split('T')[0]),
});

export const UpdateEmergency102Dto = z.object({
  total_calls_102:     z.number().int().min(0).optional(),
  call_pi:             z.number().int().min(0).optional(),
  iio_complaint:       z.number().int().min(0).optional(),
  calls_102_score:     z.number().optional(),
  pi_call_score:       z.number().optional(),
  iio_complaint_score: z.number().optional(),
  date:                z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
}).refine(d => Object.keys(d).length > 0, { message: 'At least one field required' });

export const Emergency102PaginationDto = z.object({
  page:      z.coerce.number().int().min(1).default(1),
  limit:     z.coerce.number().int().min(1).max(100).default(10),
  region_id: z.string().uuid().optional(),
  date:      z.string().optional(),
  from:      z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to:        z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export type CreateEmergency102DtoType     = z.infer<typeof CreateEmergency102Dto>;
export type UpdateEmergency102DtoType     = z.infer<typeof UpdateEmergency102Dto>;
export type Emergency102PaginationDtoType = z.infer<typeof Emergency102PaginationDto>;

export const BulkCreateEmergency102Dto = z.object({
  items: z.array(z.object({
    region_id:           z.string().uuid(),
    total_calls_102:     z.number().int().min(0).default(0),
    call_pi:             z.number().int().min(0).default(0),
    iio_complaint:       z.number().int().min(0).default(0),
    calls_102_score:     z.number().default(0),
    pi_call_score:       z.number().default(0),
    iio_complaint_score: z.number().default(0),
    date:                z.string().regex(/^\d{4}-\d{2}-\d{2}$/).default(new Date().toISOString().split('T')[0]),
  })).min(1).max(500),
});
export type BulkCreateEmergency102DtoType = z.infer<typeof BulkCreateEmergency102Dto>;
