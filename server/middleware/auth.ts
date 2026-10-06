import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'GUEST' | 'HOST' | 'ADMIN';
  hostId?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticate = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Default to guest context for development simulation
    req.user = {
      id: 'usr-guest-001',
      email: 'guest@example.com',
      role: 'GUEST'
    };
    return next();
  }

  const token = authHeader.split(' ')[1];

  if (token === 'invalid_token') {
    return next(new AppError('Invalid authentication token', 401, 'INVALID_TOKEN'));
  }

  // Simulated decoded token user
  req.user = {
    id: 'usr-guest-001',
    email: 'guest@example.com',
    role: 'GUEST'
  };

  next();
};

export const requireRole = (...allowedRoles: Array<'GUEST' | 'HOST' | 'ADMIN'>) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AppError('Forbidden: Insufficient permissions', 403, 'FORBIDDEN'));
    }
    next();
  };
};
