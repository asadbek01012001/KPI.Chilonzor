import { directionRepository } from './direction.repository';
import { CreateDirectionDtoType, UpdateDirectionDtoType, DirectionPaginationDtoType } from './direction.dto';
import { AppError } from '../../utils/AppError';

export const directionService = {
  getAll: (q: DirectionPaginationDtoType) => directionRepository.findAll(q),
  getById: async (id: string) => { const r = await directionRepository.findById(id); if (!r) throw AppError.notFound('Direction'); return r; },
  create: (dto: CreateDirectionDtoType) => directionRepository.create(dto),
  update: async (id: string, dto: UpdateDirectionDtoType) => { const r = await directionRepository.update(id, dto); if (!r) throw AppError.notFound('Direction'); return r; },
  delete: async (id: string) => { const ok = await directionRepository.delete(id); if (!ok) throw AppError.notFound('Direction'); },
};
