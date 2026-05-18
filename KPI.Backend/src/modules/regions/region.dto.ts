import { z } from "zod";
export const CreateRegionDto = z.object({
  name: z.string().min(1).max(200),
  sector: z.number().int().min(1),
});
export const UpdateRegionDto = z
  .object({
    name: z.string().min(1).max(200).optional(),
    sector: z.number().int().min(1).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "At least one field required",
  });
export const RegionPaginationDto = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sector: z.coerce.number().int().optional(),
});
export type CreateRegionDtoType = z.infer<typeof CreateRegionDto>;
export type UpdateRegionDtoType = z.infer<typeof UpdateRegionDto>;
export type RegionPaginationDtoType = z.infer<typeof RegionPaginationDto>;
