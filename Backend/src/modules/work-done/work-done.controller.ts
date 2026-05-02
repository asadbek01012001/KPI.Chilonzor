import { Request, Response, NextFunction } from 'express';
import { workDoneRepository } from './work-done.repository';
import { sendSuccess } from '../../utils/response';
import { db } from '../../config/database';
import { generateWorkDoneExcel } from '../../utils/generateWorkDoneExcel';

const dates = (req: Request) => ({
  from: req.query.from as string | undefined,
  to:   req.query.to   as string | undefined,
});

export const workDoneController = {

  // GET /work-done/:directionId
  getByDirection: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { directionId } = req.params;
      const { from, to } = dates(req);
      const data = await workDoneRepository.getByDirection(directionId, from, to);
      sendSuccess(res, data, "Yo'nalish bo'yicha bajarilgan ishlar");
    } catch (err) { next(err); }
  },

  // GET /work-done/:directionId/indicators/:indicatorId
  getByDirectionAndIndicator: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { directionId, indicatorId } = req.params;
      const { from, to } = dates(req);
      const data = await workDoneRepository.getByDirectionAndIndicator(directionId, indicatorId, from, to);
      if (!data) { res.status(404).json({ success: false, message: 'Indicator topilmadi' }); return; }
      sendSuccess(res, data, "Indicator bo'yicha mahallalar bali");
    } catch (err) { next(err); }
  },

  // GET /work-done/:directionId/export?from=&to=
  exportExcel: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { directionId } = req.params;
      const { from, to } = dates(req);

      // Yo'nalish nomini olish
      const dirRes = await db.query<any>('SELECT name FROM directions WHERE id = $1', [directionId]);
      const directionName = dirRes.rows[0]?.name ?? "Yo'nalish";

      // Barcha regionlarni olish (table header uchun)
      const regRes = await db.query<any>(
        `SELECT id AS region_id, name AS region_name FROM regions WHERE index != 56 ORDER BY index ASC`
      );
      const regions = regRes.rows;

      // Indikatorlar va qiymatlar
      const indicators = await workDoneRepository.getByDirection(directionId, from, to);

      const fromStr = from ?? '';
      const toStr   = to   ?? '';

      const buffer = await generateWorkDoneExcel(directionName, indicators, regions, fromStr, toStr);

      // Fayl nomiga yo'nalish nomini qo'shish
      const safeFileName = encodeURIComponent(`${directionName}-${fromStr}-${toStr}.xlsx`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${safeFileName}"; filename*=UTF-8''${safeFileName}`);
      res.send(buffer);
    } catch (err) { next(err); }
  },
};
