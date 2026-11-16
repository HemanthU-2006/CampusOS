import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { ApiResponse } from './utils/ApiResponse.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route Imports
import authRoutes from './routes/auth.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import eventRoutes from './routes/event.routes.js';
import maintenanceRoutes from './routes/maintenance.routes.js';
import communityRoutes from './routes/community.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import aiRoutes from './routes/ai.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. Helmet security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// 2. CORS configuration with credentials
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// 3. Body & Cookie Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 4. Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});
app.use('/api', limiter);

// 5. Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 6. Health check route
app.get('/api/health', (_req: Request, res: Response) => {
  ApiResponse.success(
    res,
    {
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    },
    'CampusOS Backend is running smoothly'
  );
});

// 7. Mount Module Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api', communityRoutes);
app.use('/api', analyticsRoutes);
app.use('/api', bookingRoutes);
app.use('/api/ai', aiRoutes);

// 8. Global 404 handler for unmatched API routes
app.use('/api/*', (req: Request, res: Response) => {
  ApiResponse.error(res, `Endpoint not found: ${req.method} ${req.originalUrl}`, 404);
});

// 9. Serve Client build for non-API routes when available in production
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req: Request, res: Response, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// 10. Centralized Error Handler
app.use(errorHandler);

// Connect to Database & Start Server
const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`🚀 CampusOS Server is running on http://localhost:${env.PORT}`);
    console.log(`📡 Health Check: http://localhost:${env.PORT}/api/health`);
  });
};

startServer();

export default app;
