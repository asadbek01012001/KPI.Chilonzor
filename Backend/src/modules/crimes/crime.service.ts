import { crimeRepository } from "./crime.repository";
import {
  CreateCrimeDtoType,
  UpdateCrimeDtoType,
  CrimePaginationDtoType,
} from "./crime.dto";
import { AppError } from "../../utils/AppError";
import { itsService } from "../its/its.service";

export const crimeService = {
  getAll: (q: CrimePaginationDtoType) => itsService.getAll(q),
  getById: async (id: string) => {
    const r = await crimeRepository.findById(id);
    if (!r) throw AppError.notFound("Crime");
    return r;
  },
  create: (dto: CreateCrimeDtoType) => crimeRepository.create(dto),
  update: async (id: string, dto: UpdateCrimeDtoType) => {
    const r = await crimeRepository.update(id, dto);
    if (!r) throw AppError.notFound("Crime");
    return r;
  },
  delete: async (id: string) => {
    const ok = await crimeRepository.delete(id);
    if (!ok) throw AppError.notFound("Crime");
  },
  bulkCreate: (dto: any) => crimeRepository.bulkCreate(dto),
};
