import { z } from 'zod';
const scoreFields = { total_crimes: z.number().int().min(0).default(0), minor_crimes: z.number().int().min(0).default(0), medium_crimes: z.number().int().min(0).default(0), serious_crimes: z.number().int().min(0).default(0), critical_crimes: z.number().int().min(0).default(0), total_crimes_score: z.number().default(0), minor_crimes_score: z.number().default(0), medium_crimes_score: z.number().default(0), serious_crimes_score: z.number().default(0), critical_crimes_score: z.number().default(0), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).default(new Date().toISOString().split('T')[0]) };
export const CreateCrimeDto = z.object({ region_id: z.string().uuid(), ...scoreFields });
export const UpdateCrimeDto = z.object({ total_crimes: z.number().int().min(0).optional(), minor_crimes: z.number().int().min(0).optional(), medium_crimes: z.number().int().min(0).optional(), serious_crimes: z.number().int().min(0).optional(), critical_crimes: z.number().int().min(0).optional(), total_crimes_score: z.number().optional(), minor_crimes_score: z.number().optional(), medium_crimes_score: z.number().optional(), serious_crimes_score: z.number().optional(), critical_crimes_score: z.number().optional(), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() }).refine(d => Object.keys(d).length > 0, { message: 'At least one field required' });
export const CrimePaginationDto = z.object({ page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(100).default(10), region_id: z.string().uuid().optional(), date: z.string().optional(), from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() });
export type CreateCrimeDtoType  = z.infer<typeof CreateCrimeDto>;
export type UpdateCrimeDtoType  = z.infer<typeof UpdateCrimeDto>;
export type CrimePaginationDtoType = z.infer<typeof CrimePaginationDto>;

export const BulkCreateCrimeDto = z.object({
  items: z.array(z.object({
    region_id:            z.string().uuid(),
    total_crimes:         z.number().int().min(0).default(0),
    minor_crimes:         z.number().int().min(0).default(0),
    medium_crimes:        z.number().int().min(0).default(0),
    serious_crimes:       z.number().int().min(0).default(0),
    critical_crimes:      z.number().int().min(0).default(0),
    total_crimes_score:   z.number().default(0),
    minor_crimes_score:   z.number().default(0),
    medium_crimes_score:  z.number().default(0),
    serious_crimes_score: z.number().default(0),
    critical_crimes_score:z.number().default(0),
    date:                 z.string().regex(/^\d{4}-\d{2}-\d{2}$/).default(new Date().toISOString().split('T')[0]),
  })).min(1).max(500),
});
export type BulkCreateCrimeDtoType = z.infer<typeof BulkCreateCrimeDto>;
