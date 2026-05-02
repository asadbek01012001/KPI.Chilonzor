import { Request, Response, NextFunction } from 'express';
import { regionService } from './region.service';
import { sendSuccess } from '../../utils/response';

const handle = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  async (req: Request, res: Response, next: NextFunction) => { try { await fn(req, res, next); } catch (e) { next(e); } };

export const regionController = {
  getAll: handle(async (req, res) => {
    const q = req.query as any;
    const { rows, total } = await regionService.getAll(q);
    sendSuccess(res, rows, 'Regions retrieved', 200, { page: +q.page||1, limit: +q.limit||10, total, pages: Math.ceil(total / (+q.limit||10)) });
  }),
  getById: handle(async (req, res) => { sendSuccess(res, await regionService.getById(req.params.id)); }),
  create:  handle(async (req, res) => { sendSuccess(res, await regionService.create(req.body), 'Region created', 201); }),
  update:  handle(async (req, res) => { sendSuccess(res, await regionService.update(req.params.id, req.body), 'Region updated'); }),
  delete:  handle(async (req, res) => { await regionService.delete(req.params.id); sendSuccess(res, null, 'Region deleted'); }),
};
