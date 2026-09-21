import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Route imports
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/students.js';
import jobRoutes from './routes/jobs.js';
import applicationRoutes from './routes/applications.js';
import assessmentRoutes from './routes/assessments.js';
import skillGapRoutes from './routes/skillGap.js';
import facultyProgramRoutes from './routes/facultyPrograms.js';
import analyticsRoutes from './routes/analytics.js';
import portfolioRoutes from './routes/portfolio.js';
import notificationRoutes from './routes/notifications.js';
import mentorshipRoutes from './routes/mentorships.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
  ],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',             authRoutes);
app.use('/api/students',         studentRoutes);
app.use('/api/jobs',             jobRoutes);
app.use('/api/applications',     applicationRoutes);
app.use('/api/assessments',      assessmentRoutes);
app.use('/api/skill-gap',        skillGapRoutes);
app.use('/api/faculty-programs', facultyProgramRoutes);
app.use('/api/analytics',        analyticsRoutes);
app.use('/api/portfolio',        portfolioRoutes);
app.use('/api/notifications',    notificationRoutes);
app.use('/api/mentorships',      mentorshipRoutes);

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'SkillBridge API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ─── Global error handler ────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║   SkillBridge API Server               ║
  ║   Running on  http://localhost:${PORT}   ║
  ║   Environment: ${process.env.NODE_ENV?.padEnd(22)}║
  ╚════════════════════════════════════════╝
  `);
});

export default app;
