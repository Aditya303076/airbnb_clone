import { Response, NextFunction } from 'express';
import { RequestWithId } from './requestId';

export class AppError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: RequestWithId,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  const statusCode = (err as AppError).statusCode || 500;
  const code = (err as AppError).code || 'INTERNAL_SERVER_ERROR';
  const requestId = req.id || 'unknown';

  // Structured Log Output
  console.error(`[ERROR] [${req.method} ${req.url}] RequestId: ${requestId} Code: ${code} Error: ${err.message}`);
  if (statusCode === 500) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    error: {
      code,
      message: statusCode === 500 ? 'An unexpected server error occurred' : err.message,
      requestId,
      timestamp: new Date().toISOString()
    }
  });
};
