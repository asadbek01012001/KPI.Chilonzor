import { Request, Response, NextFunction } from 'express';
import { dashboardRepository } from './dashboard.repository';
import { sendSuccess } from '../../utils/response';

const dates = (req: Request) => ({
  from: req.query.from as string | undefined,
  to:   req.query.to   as string | undefined,
});

export const dashboardController = {

  getMahalla: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { from, to } = dates(req);
      const region_id = req.query.region_id as string | undefined;
      if (!region_id) {
        const sector = req.query.sector ? parseInt(req.query.sector as string) : undefined;
        sendSuccess(res, await dashboardRepository.getAllMahalla(from, to, sector), 'Barcha mahallalar');
        return;
      }
      const data = await dashboardRepository.getMahalla(region_id, from, to);
      if (!data) { res.status(404).json({ success: false, message: 'Mahalla topilmadi' }); return; }
      sendSuccess(res, data, 'Mahalla dashboard');
    } catch (err) { next(err); }
  },

  topCrimes: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { from, to } = dates(req);
      sendSuccess(res, await dashboardRepository.topCrimes(from, to), "Jinoyatchilik bo'yicha mahallalar reytingi");
    } catch (err) { next(err); }
  },

  top102: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { from, to } = dates(req);
      sendSuccess(res, await dashboardRepository.top102(from, to), "102 bo'yicha mahallalar reytingi");
    } catch (err) { next(err); }
  },

  sectorSummary: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { from, to } = dates(req);
      sendSuccess(res, await dashboardRepository.sectorSummary(from, to), 'Sektor statistikasi');
    } catch (err) { next(err); }
  },

  sectorRegions: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { from, to } = dates(req);
      sendSuccess(res, await dashboardRepository.sectorRegions(from, to), "Sektorlar bo'yicha MFYlar");
    } catch (err) { next(err); }
  },

  directionsWithCount: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { from, to } = dates(req);
      sendSuccess(res, await dashboardRepository.directionsWithCount(from, to), "Yo'nalishlar va indikatorlar soni");
    } catch (err) { next(err); }
  },

  regionsByDirection: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { from, to } = dates(req);
      const { directionId } = req.params;
      sendSuccess(res, await dashboardRepository.regionsByDirection(directionId, from, to), "Yo'nalish bo'yicha mahallalar reytingi");
    } catch (err) { next(err); }
  },

  indicatorsByDirectionAndRegion: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { from, to } = dates(req);
      const { directionId, regionId } = req.params;
      sendSuccess(res, await dashboardRepository.indicatorsByDirectionAndRegion(directionId, regionId, from, to), 'Indikatorlar bali');
    } catch (err) { next(err); }
  },

  regionSummary: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { from, to } = dates(req);
      const { regionId } = req.params;
      const data = await dashboardRepository.regionSummary(regionId, from, to);
      if (!data) { res.status(404).json({ success: false, message: 'Mahalla topilmadi' }); return; }
      sendSuccess(res, data, "Mahalla umumiy ko'rsatkichlari");
    } catch (err) { next(err); }
  },


  info: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { from, to } = dates(req);
      sendSuccess(res, await dashboardRepository.info(from, to), "Dashboard umumiy ma\'lumotlar");
    } catch (err) { next(err); }
  },


  chartRegion: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { from, to } = dates(req);
      const { regionId } = req.params;
      if (!from || !to) { res.status(400).json({ success: false, message: "'from' va 'to' majburiy" }); return; }
      sendSuccess(res, await dashboardRepository.chartRegion(regionId, from, to), 'MFY ball dinamikasi');
    } catch (err) { next(err); }
  },

  chartDirection: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { from, to } = dates(req);
      const { directionId } = req.params;
      if (!from || !to) { res.status(400).json({ success: false, message: "'from' va 'to' majburiy" }); return; }
      sendSuccess(res, await dashboardRepository.chartDirection(directionId, from, to), "Yo'nalish ball dinamikasi");
    } catch (err) { next(err); }
  },

  chartDistrict: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { from, to } = dates(req);
      if (!from || !to) { res.status(400).json({ success: false, message: "'from' va 'to' majburiy" }); return; }
      sendSuccess(res, await dashboardRepository.chartDistrict(from, to), "Tuman umumiy ball dinamikasi");
    } catch (err) { next(err); }
  },
};