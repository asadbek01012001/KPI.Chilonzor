import { regionRepository } from './region.repository';
import { CreateRegionDtoType, UpdateRegionDtoType, RegionPaginationDtoType } from './region.dto';
import { AppError } from '../../utils/AppError';

export const regionService = {
  getAll: (q: RegionPaginationDtoType) => regionRepository.findAll(q),
  getById: async (id: string) => { const r = await regionRepository.findById(id); if (!r) throw AppError.notFound('Region'); return r; },
  create: (dto: CreateRegionDtoType) => regionRepository.create(dto),
  update: async (id: string, dto: UpdateRegionDtoType) => { const r = await regionRepository.update(id, dto); if (!r) throw AppError.notFound('Region'); return r; },
  delete: async (id: string) => { const ok = await regionRepository.delete(id); if (!ok) throw AppError.notFound('Region'); },
};
