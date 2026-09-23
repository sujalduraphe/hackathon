import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import routes from './routes/index.js';

const app = express();

app.use(cors({
  origin: (process.env.FRONTEND_URL || 'http://localhost:5173,http://localhost:5199').split(',').map(s => s.trim()),
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use((req, _res, next) => { console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`); next(); });
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected', timestamp: new Date().toISOString() });
});

app.use('/api', routes);

app.use((req, res) => res.status(404).json({ error: `Route ${req.method} ${req.path} not found` }));

app.use((err, _req, res, _next) => {
  // malformed ObjectId in a URL or body
  if (err.name === 'CastError') return res.status(404).json({ error: 'Not found' });
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'File is larger than 2 MB' });
  if (err.name === 'ValidationError') return res.status(422).json({ error: err.message });
  if (err.code === 11000) return res.status(409).json({ error: 'Duplicate record' });
  const status = err.status || 500;
  if (status >= 500) console.error('[ERROR]', err);
  res.status(status).json({ error: status >= 500 ? 'Internal Server Error' : err.message });
});

export default app;
