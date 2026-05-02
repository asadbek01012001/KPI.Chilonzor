import { reportRepository } from './report.repository';

export const reportService = {
  getAllMahallaReport: (from?: string, to?: string, sector?: number, search?: string) =>
    reportRepository.getAllMahallaReport(from, to, sector, search),

  getMahallaReport: (regionId: string, from?: string, to?: string) =>
    reportRepository.getMahallaReport(regionId, from, to),
};
