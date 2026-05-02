import { Request, Response, NextFunction } from "express";
import { crimeService } from "./crime.service";
import { sendSuccess } from "../../utils/response";

const handle =
  (fn: (req: Request, res: Response) => Promise<void>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res);
    } catch (e) {
      next(e);
    }
  };

export const crimeController = {
  getAll: handle(async (req, res) => {
    const q = req.query as any;
    const data = await crimeService.getAll(q);
    const { rows, total, totals } = await crimeService.getAll(q);
    sendSuccess(res, data, "Crimes retrieved", 200, {
      page: +q.page || 1,
      limit: +q.limit || 10,
      total,
      pages: Math.ceil(total / (+q.limit || 10)),
      totals,
    });
  }),
  getById: handle(async (req, res) => {
    sendSuccess(res, await crimeService.getById(req.params.id));
  }),
  create: handle(async (req, res) => {
    sendSuccess(
      res,
      await crimeService.create(req.body),
      "Crime record created",
      201,
    );
  }),
  update: handle(async (req, res) => {
    sendSuccess(
      res,
      await crimeService.update(req.params.id, req.body),
      "Crime record updated",
    );
  }),
  delete: handle(async (req, res) => {
    await crimeService.delete(req.params.id);
    sendSuccess(res, null, "Crime record deleted");
  }),
  bulkCreate: handle(async (req, res) => {
    sendSuccess(
      res,
      await crimeService.bulkCreate(req.body),
      "Crimes bulk created",
      201,
    );
  }),
};
