import { Request, Response } from 'express';
import { kafkaEngine } from '../messaging/kafkaService';
import { redisCache } from '../cache/redisService';

export class AnalyticsController {
  /**
   * Process Business Intelligence Indicators & Customer Growth Activity
   */
  public async postActivity(req: Request, res: Response): Promise<void> {
    try {
      const { userId, sessionId, events, userAgent, timestamp } = req.body;

      if (!Array.isArray(events) || events.length === 0) {
        res.json({ success: true, processedEvents: 0 });
        return;
      }

      // 1. Stream Business Indicators to Kafka Analytics Topic
      kafkaEngine.produce('analytics-events', {
        action: 'BUSINESS_INDICATOR_FLUSH',
        userId: userId || 'anonymous',
        sessionId,
        eventCount: events.length,
        events,
        userAgent,
        flushedAt: timestamp || new Date().toISOString()
      });

      // 2. Increment Redis Business Metrics Counter
      const cacheKey = `business_metrics:${userId || 'global'}`;
      await redisCache.set(cacheKey, { lastFlushed: new Date().toISOString(), totalEvents: events.length }, 3600);

      res.json({
        success: true,
        processedEvents: events.length,
        status: 'FLUSHED_TO_BUSINESS_INTELLIGENCE_STREAM'
      });
    } catch (err) {
      console.error('[ANALYTICS CONTROLLER ERROR]', err);
      res.status(500).json({ success: false, error: 'Failed to process activity telemetry' });
    }
  }
}

export const analyticsController = new AnalyticsController();
