import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export interface RequestWithId extends Request {
  id?: string;
}

export const requestIdMiddleware = (req: RequestWithId, res: Response, next: NextFunction): void => {
  const existingId = req.headers['x-request-id'] as string;
  const requestId = existingId || `req_${randomUUID().substring(0, 12)}`;
  
  req.id = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
};

