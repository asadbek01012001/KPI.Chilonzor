import { z } from 'zod';
export const CreateIndicatorValueDto = z.object({
  indicator_id: z.string().uuid(),
  direction_id: z.string().uuid(),
  region_id:    z.string().uuid(),
  score:        z.number().default(0),
  value:        z.number().default(0),
  date:         z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export const UpdateIndicatorValueDto = z.object({
  score: z.number().optional(),
  value: z.number().optional(),
  date:  z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
}).refine(d => Object.keys(d).length > 0, { message: 'At least one field required' });
export const IndicatorValuePaginationDto = z.object({
  page:         z.coerce.number().int().min(1).default(1),
  limit:        z.coerce.number().int().min(1).max(100).default(10),
  indicator_id: z.string().uuid().optional(),
  direction_id: z.string().uuid().optional(),
  region_id:    z.string().uuid().optional(),
  date:         z.string().optional(),
  from:         z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to:           z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});
export type CreateIndicatorValueDtoType    = z.infer<typeof CreateIndicatorValueDto>;
export type UpdateIndicatorValueDtoType    = z.infer<typeof UpdateIndicatorValueDto>;
export type IndicatorValuePaginationDtoType = z.infer<typeof IndicatorValuePaginationDto>;

export const BulkCreateIndicatorValueDto = z.object({
  items: z.array(z.object({
    indicator_id: z.string().uuid(),
    direction_id: z.string().uuid(),
    region_id:    z.string().uuid(),
    score:        z.number().default(0),
    value:        z.number().default(0),
    date:         z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  })).min(1).max(500),
});
export type BulkCreateIndicatorValueDtoType = z.infer<typeof BulkCreateIndicatorValueDto>;
