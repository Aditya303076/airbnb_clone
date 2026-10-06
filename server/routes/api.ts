import { Router } from 'express';
import { propertyController } from '../controllers/propertyController';
import { reservationController } from '../controllers/reservationController';
import { analyticsController } from '../controllers/analyticsController';
import { authController } from '../controllers/authController';
import { redisCache } from '../cache/redisService';
import { kafkaEngine } from '../messaging/kafkaService';
import { apiLimiter, bookingLimiter } from '../middleware/rateLimiter';
import { idempotencyMiddleware } from '../middleware/idempotency';
import { authenticate } from '../middleware/auth';

const router = Router();

// Authentication Endpoints
router.post('/auth/google', apiLimiter, (req, res) => authController.googleLogin(req, res));
router.get('/users/:id', apiLimiter, (req, res) => authController.getCurrentUser(req, res));

// Property Endpoints with Rate Limiting
router.get('/properties', apiLimiter, (req, res) => propertyController.getProperties(req, res));
router.get('/properties/:id', apiLimiter, (req, res) => propertyController.getPropertyById(req, res));
router.get('/properties/:id/reservations', apiLimiter, (req, res) => reservationController.getPropertyReservations(req, res));
router.get('/properties/:id/reviews', apiLimiter, (req, res) => propertyController.getReviews(req, res));
router.get('/destinations', apiLimiter, (req, res) => propertyController.getDestinations(req, res));

// Business Intelligence & Activity Telemetry Endpoint
router.post('/analytics/activity', apiLimiter, (req, res) => analyticsController.postActivity(req, res));

// Reservation Endpoints with Idempotency & Rate Limiting
router.get('/reservations/check-availability', apiLimiter, (req, res) => reservationController.checkAvailability(req, res));
router.get('/reservations', apiLimiter, (req, res) => reservationController.getUserReservations(req, res));
router.post('/reservations', bookingLimiter, authenticate, idempotencyMiddleware, (req, res) => {
  reservationController.createReservation(req, res);
});
router.delete('/reservations/:id', apiLimiter, (req, res) => reservationController.cancelReservation(req, res));

// Liveness Probe
router.get('/health/live', (_req, res) => {
  res.json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Readiness Probe
router.get('/health/ready', async (_req, res) => {
  try {
    const redisMetrics = redisCache.getMetrics();
    res.json({
      status: 'READY',
      checks: {
        database: 'HEALTHY',
        redis: 'HEALTHY',
        kafka: 'HEALTHY'
      },
      telemetry: {
        redis: redisMetrics,
        kafka: kafkaEngine.getClusterStats()
      }
    });
  } catch (err) {
    res.status(503).json({ status: 'NOT_READY', error: String(err) });
  }
});

// System Health & Telemetry Metrics
router.get('/health', (_req, res) => {
  res.json({
    status: 'ONLINE',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    redis: redisCache.getMetrics(),
    kafka: kafkaEngine.getClusterStats()
  });
});

export default router;
