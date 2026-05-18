import { Request, Response, NextFunction } from 'express';
import { directionService } from './direction.service';
import { sendSuccess } from '../../utils/response';

const handle = (fn: (req: Request, res: Response) => Promise<void>) =>
  async (req: Request, res: Response, next: NextFunction) => { try { await fn(req, res); } catch (e) { next(e); } };

export const directionController = {
  getAll: handle(async (req, res) => {
    const q = req.query as any;
    const { rows, total } = await directionService.getAll(q);
    sendSuccess(res, rows, 'Directions retrieved', 200, { page: +q.page||1, limit: +q.limit||10, total, pages: Math.ceil(total/(+q.limit||10)) });
  }),
  getById: handle(async (req, res) => { sendSuccess(res, await directionService.getById(req.params.id)); }),
  create:  handle(async (req, res) => { sendSuccess(res, await directionService.create(req.body), 'Direction created', 201); }),
  update:  handle(async (req, res) => { sendSuccess(res, await directionService.update(req.params.id, req.body), 'Direction updated'); }),
  delete:  handle(async (req, res) => { await directionService.delete(req.params.id); sendSuccess(res, null, 'Direction deleted'); }),
};
