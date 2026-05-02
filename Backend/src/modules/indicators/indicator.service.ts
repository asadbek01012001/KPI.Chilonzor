import { indicatorRepository } from './indicator.repository';
import { CreateIndicatorDtoType, UpdateIndicatorDtoType, IndicatorPaginationDtoType } from './indicator.dto';
import { AppError } from '../../utils/AppError';

export const indicatorService = {
  getAll: (q: IndicatorPaginationDtoType) => indicatorRepository.findAll(q),
  getFlatList: (directionId: string) => indicatorRepository.getFlatList(directionId),
  getById: async (id: string) => { const r = await indicatorRepository.findById(id); if (!r) throw AppError.notFound('Indicator'); return r; },
  create: (dto: CreateIndicatorDtoType) => indicatorRepository.create(dto),
  update: async (id: string, dto: UpdateIndicatorDtoType) => { const r = await indicatorRepository.update(id, dto); if (!r) throw AppError.notFound('Indicator'); return r; },
  delete: async (id: string) => { const ok = await indicatorRepository.delete(id); if (!ok) throw AppError.notFound('Indicator'); },
};
