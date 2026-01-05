import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import rateLimit from 'express-rate-limit';
import connectDatabase from './config/database';
import authRoutes from './routes/authRoutes';
import blogRoutes from './routes/blogRoutes';
import { errorHandler } from './middleware/errorHandler';
import { HttpStatus } from './enums/HttpStatus';
import { SYSTEM_MESSAGES } from './constants/Messages';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();

// Connect to database
connectDatabase();

// Security Middleware (Loosened for cross-origin image sharing)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:4200').replace(/\/$/, '');
app.use(cors({
  origin: frontendUrl,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: SYSTEM_MESSAGES.RATE_LIMIT_EXCEEDED
});

// Apply rate limiting to auth routes
app.use('/api/auth', limiter);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// Health check route
app.get('/health', (_req, res) => {
  res.status(HttpStatus.OK).json({
    success: true,
    message: SYSTEM_MESSAGES.SERVER_RUNNING,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(HttpStatus.NOT_FOUND).json({
    success: false,
    message: SYSTEM_MESSAGES.ROUTE_NOT_FOUND
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\x1b[32m[SERVER] Running on http://localhost:${PORT}\x1b[0m`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', () => {
  process.exit(1);
});

export default app;
