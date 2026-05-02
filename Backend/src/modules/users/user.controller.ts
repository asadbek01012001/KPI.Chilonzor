import { Request, Response, NextFunction } from 'express';
import { userService } from './user.service';
import { sendSuccess, sendCreated } from '../../utils/response';

export const userController = {
  getAll: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page   = parseInt(req.query.page  as string || '1', 10);
      const limit  = parseInt(req.query.limit as string || '10', 10);
      const search = req.query.search as string | undefined;
      const { data, meta } = await userService.getAll(page, limit, search);
      sendSuccess(res, data, 'Users fetched', 200, meta);
    } catch (err) { next(err); }
  },

  getById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await userService.getById(req.params.id);
      sendSuccess(res, user, 'User fetched');
    } catch (err) { next(err); }
  },

  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await userService.create(req.body);
      sendCreated(res, user, 'User created');
    } catch (err) { next(err); }
  },

  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await userService.update(
        req.params.id,
        req.body,
        req.user!.userId,
        req.user!.role
      );
      sendSuccess(res, user, 'User updated');
    } catch (err) { next(err); }
  },

  delete: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await userService.delete(req.params.id, req.user!.userId, req.user!.role);
      sendSuccess(res, null, 'User deleted');
    } catch (err) { next(err); }
  },
};
