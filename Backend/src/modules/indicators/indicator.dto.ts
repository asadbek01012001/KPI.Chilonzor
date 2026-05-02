import { z } from 'zod';
export const CreateIndicatorDto = z.object({
  direction_id: z.string().uuid(),
  parent_id:    z.string().uuid().nullable().optional(),
  name:         z.string().min(1).max(300),
  score:          z.number().default(0),
  is_subtraction: z.boolean().default(false),
  index: z.number().int().optional(),
});
export const UpdateIndicatorDto = z.object({
  direction_id: z.string().uuid().optional(),
  parent_id:    z.string().uuid().nullable().optional(),
  name:         z.string().min(1).max(300).optional(),
  score:          z.number().optional(),
  is_subtraction: z.boolean().optional(),
  index: z.number().int().optional(),
}).refine(d => Object.keys(d).length > 0, { message: 'At least one field required' });
export const IndicatorPaginationDto = z.object({
  page:         z.coerce.number().int().min(1).default(1),
  limit:        z.coerce.number().int().min(1).max(100).default(10),
  direction_id: z.string().uuid().optional(),
  parent_id:    z.string().uuid().optional(),
});
export type CreateIndicatorDtoType    = z.infer<typeof CreateIndicatorDto>;
export type UpdateIndicatorDtoType    = z.infer<typeof UpdateIndicatorDto>;
export type IndicatorPaginationDtoType = z.infer<typeof IndicatorPaginationDto>;
