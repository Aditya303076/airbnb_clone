import { Request, Response, NextFunction } from 'express';
import { redisCache } from '../cache/redisService';
import { AppError } from './errorHandler';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export const createRateLimiter = (config: RateLimitConfig) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `rate_limit:${req.path}:${clientIp}`;

    try {
      const { data: requestCount } = await redisCache.get<number>(key);
      const currentCount = (requestCount || 0) + 1;

      if (currentCount > config.maxRequests) {
        return next(new AppError('Too many requests. Please try again later.', 429, 'RATE_LIMIT_EXCEEDED'));
      }

      await redisCache.set(key, currentCount, Math.ceil(config.windowMs / 1000));
      next();
    } catch (err) {
      console.error('[RATE LIMITER ERROR]', err);
      next();
    }
  };
};

// Presets
export const apiLimiter = createRateLimiter({ windowMs: 60 * 1000, maxRequests: 100 });
export const authLimiter = createRateLimiter({ windowMs: 60 * 1000, maxRequests: 10 });
export const bookingLimiter = createRateLimiter({ windowMs: 60 * 1000, maxRequests: 20 });
