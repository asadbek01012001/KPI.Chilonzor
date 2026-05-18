import { Request, Response, NextFunction } from 'express';
import { emergency102Service } from './emergency102.service';
import { sendSuccess } from '../../utils/response';

const handle = (fn: (req: Request, res: Response) => Promise<void>) =>
  async (req: Request, res: Response, next: NextFunction) => { try { await fn(req, res); } catch (e) { next(e); } };

export const emergency102Controller = {
  getAll: handle(async (req, res) => {
    const q = req.query as any;
    const { rows, total, totals } = await emergency102Service.getAll(q);
    sendSuccess(res, rows, 'Emergency102 retrieved', 200, {
      page: +q.page||1, limit: +q.limit||10, total,
      pages: Math.ceil(total/(+q.limit||10)),
      totals,
    });
  }),
  getById:    handle(async (req, res) => { sendSuccess(res, await emergency102Service.getById(req.params.id)); }),
  create:     handle(async (req, res) => { sendSuccess(res, await emergency102Service.create(req.body), 'Emergency102 record created', 201); }),
  update:     handle(async (req, res) => { sendSuccess(res, await emergency102Service.update(req.params.id, req.body), 'Emergency102 record updated'); }),
  delete:     handle(async (req, res) => { await emergency102Service.delete(req.params.id); sendSuccess(res, null, 'Emergency102 record deleted'); }),
  bulkCreate: handle(async (req, res) => { sendSuccess(res, await emergency102Service.bulkCreate(req.body), 'Emergency102 bulk created', 201); }),
};
