import { emergency102Repository } from './emergency102.repository';
import { CreateEmergency102DtoType, UpdateEmergency102DtoType, Emergency102PaginationDtoType } from './emergency102.dto';
import { AppError } from '../../utils/AppError';

export const emergency102Service = {
  getAll:    (q: Emergency102PaginationDtoType) => emergency102Repository.findAll(q),
  getById:   async (id: string) => { const r = await emergency102Repository.findById(id); if (!r) throw AppError.notFound('Emergency102'); return r; },
  create:    (dto: CreateEmergency102DtoType) => emergency102Repository.create(dto),
  update:    async (id: string, dto: UpdateEmergency102DtoType) => { const r = await emergency102Repository.update(id, dto); if (!r) throw AppError.notFound('Emergency102'); return r; },
  delete:    async (id: string) => { const ok = await emergency102Repository.delete(id); if (!ok) throw AppError.notFound('Emergency102'); },
  bulkCreate:(dto: any) => emergency102Repository.bulkCreate(dto),
};
