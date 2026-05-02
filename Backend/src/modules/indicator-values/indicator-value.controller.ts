import { Request, Response, NextFunction } from 'express';
import { indicatorValueService } from './indicator-value.service';
import { sendSuccess } from '../../utils/response';

const handle = (fn: (req: Request, res: Response) => Promise<void>) =>
  async (req: Request, res: Response, next: NextFunction) => { try { await fn(req, res); } catch (e) { next(e); } };

export const indicatorValueController = {
  getAll: handle(async (req, res) => {
    const q = req.query as any;
    const { rows, total } = await indicatorValueService.getAll(q);
    sendSuccess(res, rows, 'Indicator values retrieved', 200, { page: +q.page||1, limit: +q.limit||10, total, pages: Math.ceil(total/(+q.limit||10)) });
  }),
  getById: handle(async (req, res) => { sendSuccess(res, await indicatorValueService.getById(req.params.id)); }),
  create:  handle(async (req, res) => { sendSuccess(res, await indicatorValueService.create(req.body), 'Indicator value created', 201); }),
  update:  handle(async (req, res) => { sendSuccess(res, await indicatorValueService.update(req.params.id, req.body), 'Indicator value updated'); }),
  delete:  handle(async (req, res) => { await indicatorValueService.delete(req.params.id); sendSuccess(res, null, 'Indicator value deleted'); }),

  bulkCreate: handle(async (req, res) => { sendSuccess(res, await indicatorValueService.bulkCreate(req.body), 'Indicator values bulk created', 201); }),
};