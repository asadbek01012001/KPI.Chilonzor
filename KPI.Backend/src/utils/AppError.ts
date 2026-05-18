export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 400, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(msg: string)  { return new AppError(msg, 400); }
  static unauthorized(msg = 'Unauthorized') { return new AppError(msg, 401); }
  static forbidden(msg = 'Forbidden')       { return new AppError(msg, 403); }
  static notFound(msg: string)    { return new AppError(msg, 404); }
  static conflict(msg: string)    { return new AppError(msg, 409); }
  static internal(msg = 'Internal Server Error') { return new AppError(msg, 500, false); }
}

export const NotFoundError = (msg: string) => new AppError(msg, 404);
export default AppError;
