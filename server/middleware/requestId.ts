import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export interface RequestWithId extends Request {
  id?: string;
}

export const requestIdMiddleware = (req: RequestWithId, res: Response, next: NextFunction): void => {
  const existingId = req.headers['x-request-id'] as string;
  const requestId = existingId || `req_${uuidv4().substring(0, 12)}`;
  
  req.id = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
};
