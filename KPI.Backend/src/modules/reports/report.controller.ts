import { Request, Response, NextFunction } from 'express';
import { reportRepository } from './report.repository';
import { sendSuccess } from '../../utils/response';
import { generateReportExcel } from '../../utils/excelExport';
import { db } from '../../config/database';

export const reportController = {

  getMahallaReport: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const from      = req.query.from      as string | undefined;
      const to        = req.query.to        as string | undefined;
      const region_id = req.query.region_id as string | undefined;
      const sector    = req.query.sector ? parseInt(req.query.sector as string) : undefined;

      if (region_id) {
        const data = await reportRepository.getMahallaReport(region_id, from, to);
        if (!data) { res.status(404).json({ success: false, message: 'Mahalla topilmadi' }); return; }
        sendSuccess(res, data, "Mahalla bo'yicha xisobot");
        return;
      }

      const search = req.query.search as string | undefined;
      sendSuccess(res, await reportRepository.getAllMahallaReport(from, to, sector, search), "Barcha mahallalar bo'yicha xisobot");
    } catch (err) { next(err); }
  },


  exportExcel: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const from   = req.query.from   as string | undefined;
      const to     = req.query.to     as string | undefined;
      const sector = req.query.sector ? parseInt(req.query.sector as string) : undefined;

      // Barcha report ma'lumotlarini olamiz
      const tableData = await reportRepository.getAllMahallaReport(from, to, sector);

      // Yo'nalishlar ro'yxatini olamiz
      const dirRes = await db.query<any>('SELECT id, name FROM directions ORDER BY index ASC');
      const directions = dirRes.rows;

      const buffer = await generateReportExcel(tableData, directions);

      const date = new Date().toISOString().slice(0, 10);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="report_${date}.xlsx"`);
      res.send(buffer);
    } catch (err) { next(err); }
  },
};