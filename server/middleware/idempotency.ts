import { Request, Response, NextFunction } from 'express';
import { redisCache } from '../cache/redisService';

export const idempotencyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const idempotencyKey = req.headers['idempotency-key'] as string;

  if (!idempotencyKey || req.method === 'GET') {
    return next();
  }

  const cacheKey = `idempotency:${idempotencyKey}`;

  try {
    const { data: cachedResponse } = await redisCache.get<{ status: number; body: unknown }>(cacheKey);

    if (cachedResponse) {
      console.log(`[IDEMPOTENCY HIT] Returning cached result for key '${idempotencyKey}'`);
      res.status(cachedResponse.status).json(cachedResponse.body);
      return;
    }

    // Intercept res.json to capture and cache response
    const originalJson = res.json.bind(res);
    res.json = (body: unknown) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        redisCache.set(cacheKey, { status: res.statusCode, body }, 86400); // 24 hours
      }
      return originalJson(body);
    };

    next();
  } catch (err) {
    console.error('[IDEMPOTENCY MIDDLEWARE ERROR]', err);
    next();
  }
};
