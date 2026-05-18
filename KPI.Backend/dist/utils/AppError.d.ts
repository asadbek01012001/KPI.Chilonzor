export declare class AppError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;
    constructor(message: string, statusCode?: number, isOperational?: boolean);
    static badRequest(msg: string): AppError;
    static unauthorized(msg?: string): AppError;
    static forbidden(msg?: string): AppError;
    static notFound(msg: string): AppError;
    static conflict(msg: string): AppError;
    static internal(msg?: string): AppError;
}
export declare const NotFoundError: (msg: string) => AppError;
export default AppError;
//# sourceMappingURL=AppError.d.ts.map