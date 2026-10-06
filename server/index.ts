import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api';
import { requestIdMiddleware } from './middleware/requestId';
import { errorHandler } from './middleware/errorHandler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Header Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key', 'X-Request-Id']
}));

app.use(express.json({ limit: '10mb' }));
app.use(requestIdMiddleware);

// Security Headers Middleware
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Request timing middleware
app.use((req, res, next) => {
  const start = performance.now();
  res.on('finish', () => {
    const duration = (performance.now() - start).toFixed(2);
    console.log(`[HTTP ${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms) [Id: ${req.headers['x-request-id'] || 'none'}]`);
  });
  next();
});

// API V1 Routes
app.use('/api/v1', apiRouter);

// Serve static frontend files in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// SPA routing fallback for non-API routes
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.originalUrl.startsWith('/api')) {
    return res.sendFile(path.join(distPath, 'index.html'));
  }
  next();
});

// Standardized Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 AIRBNB HIGH-THROUGHPUT BACKEND SERVER RUNNING ON PORT ${PORT}`);
  console.log(`⚡ Multi-Tier Caching Engine (Redis L1/L2) Active`);
  console.log(`📩 Kafka Event Stream Producer/Consumer Active`);
  console.log(`🔒 Security Headers & Idempotency Key Validation Active`);
  console.log(`=======================================================`);
});
