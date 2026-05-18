import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { sendSuccess, sendCreated } from '../../utils/response';

export const authController = {
  register: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password } = req.body;
      const result = await authService.register(name, email, password);
      sendCreated(res, result, 'Registered successfully');
    } catch (err) { next(err); }
  },

  login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      sendSuccess(res, result, 'Logged in successfully');
    } catch (err) { next(err); }
  },

  refresh: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refresh(refreshToken);
      sendSuccess(res, result, 'Tokens refreshed');
    } catch (err) { next(err); }
  },

  logout: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await authService.logout(req.user!.userId);
      sendSuccess(res, null, 'Logged out successfully');
    } catch (err) { next(err); }
  },

  me: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await authService.me(req.user!.userId);
      sendSuccess(res, user, 'Profile fetched');
    } catch (err) { next(err); }
  },
};
