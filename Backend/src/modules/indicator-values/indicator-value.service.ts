import { indicatorValueRepository } from './indicator-value.repository';
import { CreateIndicatorValueDtoType, UpdateIndicatorValueDtoType, IndicatorValuePaginationDtoType, BulkCreateIndicatorValueDtoType } from './indicator-value.dto';
import { AppError } from '../../utils/AppError';

export const indicatorValueService = {
  getAll: (q: IndicatorValuePaginationDtoType) => indicatorValueRepository.findAll(q),
  getById: async (id: string) => { const r = await indicatorValueRepository.findById(id); if (!r) throw AppError.notFound('IndicatorValue'); return r; },
  create: (dto: CreateIndicatorValueDtoType) => indicatorValueRepository.create(dto),
  update: async (id: string, dto: UpdateIndicatorValueDtoType) => { const r = await indicatorValueRepository.update(id, dto); if (!r) throw AppError.notFound('IndicatorValue'); return r; },
  delete: async (id: string) => { const ok = await indicatorValueRepository.delete(id); if (!ok) throw AppError.notFound('IndicatorValue'); },

  bulkCreate: (dto: any) => indicatorValueRepository.bulkCreate(dto),
};