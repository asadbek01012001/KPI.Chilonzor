import { Request, Response, NextFunction } from 'express';
import { indicatorService } from './indicator.service';
import { sendSuccess } from '../../utils/response';

const handle = (fn: (req: Request, res: Response) => Promise<void>) =>
  async (req: Request, res: Response, next: NextFunction) => { try { await fn(req, res); } catch (e) { next(e); } };

export const indicatorController = {
  getAll: handle(async (req, res) => {
    const q = req.query as any;
    const { rows, total } = await indicatorService.getAll(q);
    sendSuccess(res, rows, 'Indicators retrieved', 200, { page: +q.page||1, limit: +q.limit||10, total, pages: Math.ceil(total/(+q.limit||10)) });
  }),
  getFlatList: handle(async (req, res) => {
    const { direction_id } = req.query as any;
    if (!direction_id) { res.status(400).json({ success: false, message: 'direction_id required' }); return; }
    const rows = await indicatorService.getFlatList(direction_id);
    sendSuccess(res, rows, 'Indicators flat list');
  }),
  getById: handle(async (req, res) => { sendSuccess(res, await indicatorService.getById(req.params.id)); }),
  create:  handle(async (req, res) => { sendSuccess(res, await indicatorService.create(req.body), 'Indicator created', 201); }),
  update:  handle(async (req, res) => { sendSuccess(res, await indicatorService.update(req.params.id, req.body), 'Indicator updated'); }),
  delete:  handle(async (req, res) => { await indicatorService.delete(req.params.id); sendSuccess(res, null, 'Indicator deleted'); }),
};
