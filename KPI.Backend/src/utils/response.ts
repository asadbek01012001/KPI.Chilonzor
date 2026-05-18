import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?:   T;
  meta?:   PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page:  number;
  limit: number;
  pages: number;
  totals?: Record<string, number> | null;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  meta?: PaginationMeta
): Response =>
  res.status(statusCode).json({ success: true, message, data, ...(meta && { meta }) });

export const sendCreated = <T>(res: Response, data: T, message = 'Created'): Response =>
  sendSuccess(res, data, message, 201);

export const sendError = (
  res: Response,
  message: string,
  statusCode = 400,
  errors?: unknown[]
): Response =>
  res.status(statusCode).json({ success: false, message, ...(errors && { errors }) });

export const paginate = (total: number, page: number, limit: number): PaginationMeta => ({
  total,
  page,
  limit,
  pages: Math.ceil(total / limit),
});
