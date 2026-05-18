import { z } from 'zod';
export const CreateDirectionDto = z.object({ name: z.string().min(1).max(300) });
export const UpdateDirectionDto = z.object({ name: z.string().min(1).max(300).optional() }).refine(d => Object.keys(d).length > 0, { message: 'At least one field required' });
export const DirectionPaginationDto = z.object({ page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(100).default(10), search: z.string().optional() });
export type CreateDirectionDtoType = z.infer<typeof CreateDirectionDto>;
export type UpdateDirectionDtoType = z.infer<typeof UpdateDirectionDto>;
export type DirectionPaginationDtoType = z.infer<typeof DirectionPaginationDto>;
