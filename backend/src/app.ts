import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import authRouter from './api/v1/auth.router';
import projectsRouter from './api/v1/projects.router';
import assetsRouter from './api/v1/assets.router';
import eventsRouter from './api/v1/events.router';
import chaptersRouter from './api/v1/chapters.router';
import { errorHandler, notFound } from './api/middleware/error.middleware';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));
app.use(morgan(config.isDev ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: '0.1.0', env: config.nodeEnv });
});

// API routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1', projectsRouter);
app.use('/api/v1', assetsRouter);
app.use('/api/v1', eventsRouter);
app.use('/api/v1', chaptersRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
