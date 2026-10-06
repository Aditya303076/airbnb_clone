import { Request, Response } from 'express';
import { dbEngine } from '../db/database';
import { redisCache } from '../cache/redisService';
import { kafkaEngine } from '../messaging/kafkaService';
import { APIResponse, IUser } from '../types/backend';

export class AuthController {
  /**
   * Google One Tap & OAuth Authentication Handler for Hosts & Guests
   */
  public async googleLogin(req: Request, res: Response): Promise<void> {
    const startTime = performance.now();
    const { email, name, avatarUrl, googleId, role } = req.body;

    if (!email || !name) {
      res.status(400).json({
        success: false,
        data: null,
        error: 'Email and name are required for Google Authentication'
      });
      return;
    }

    try {
      // 1. Upsert User in DB
      const user = await dbEngine.upsertGoogleUser({
        email,
        name,
        avatarUrl,
        googleId: googleId || `google-${Date.now()}`,
        role: role || 'GUEST'
      });

      // 2. Cache User Session in Redis
      const sessionToken = `token_${user.id}_${Date.now()}`;
      await redisCache.set(`session:${sessionToken}`, user, 86400); // 24hr TTL

      // 3. Emit Kafka Security Event
      kafkaEngine.produce('analytics-events', {
        action: 'USER_GOOGLE_LOGIN',
        userId: user.id,
        email: user.email,
        role: user.role
      });

      const executionTimeMs = Number((performance.now() - startTime).toFixed(2));
      const response: APIResponse<{ token: string; user: IUser }> = {
        success: true,
        data: {
          token: sessionToken,
          user
        },
        meta: {
          total: 1,
          page: 1,
          limit: 1,
          executionTimeMs,
          cacheHit: false,
          cacheLayer: 'DATABASE'
        }
      };

      res.status(200).json(response);
    } catch (err) {
      console.error('[GOOGLE AUTH ERROR]', err);
      res.status(500).json({
        success: false,
        data: null,
        error: 'Google authentication failed'
      });
    }
  }

  /**
   * Fetch Authenticated User Details
   */
  public async getCurrentUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.id || 'usr-guest-001';
    const user = await dbEngine.getUserById(userId);

    res.json({
      success: true,
      data: user || {
        id: 'usr-guest-001',
        email: 'guest@example.com',
        name: 'Guest User',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        role: 'GUEST',
        authProvider: 'GOOGLE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
  }
}

export const authController = new AuthController();
