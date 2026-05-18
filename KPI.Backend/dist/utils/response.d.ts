import { Response } from 'express';
export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    meta?: PaginationMeta;
}
export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    pages: number;
    totals?: Record<string, number> | null;
}
export declare const sendSuccess: <T>(res: Response, data: T, message?: string, statusCode?: number, meta?: PaginationMeta) => Response;
export declare const sendCreated: <T>(res: Response, data: T, message?: string) => Response;
export declare const sendError: (res: Response, message: string, statusCode?: number, errors?: unknown[]) => Response;
export declare const paginate: (total: number, page: number, limit: number) => PaginationMeta;
//# sourceMappingURL=response.d.ts.map