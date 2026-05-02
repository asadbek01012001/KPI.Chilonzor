import { dashboardRepository } from './dashboard.repository';
import { AppError } from '../../utils/AppError';

export const dashboardService = {
  getMahalla: async (regionId: string, from?: string, to?: string) => {
    const result = await dashboardRepository.getMahalla(regionId, from, to);
    if (!result) throw new AppError('Region not found', 404);
    return result;
  },

  getAllMahalla: async (from?: string, to?: string, sector?: number) => {
    return dashboardRepository.getAllMahalla(from, to, sector);
  },
};
