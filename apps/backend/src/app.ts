import express from 'express';
import helmet from 'helmet';
import { router as api } from './routes';
import { errorHandler, notFound } from './middlewares/error';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import logger from './middlewares/logging';
import cors from './middlewares/cors';
import rateLimit from './middlewares/rateLimit';
import { correlationId, securityHeaders } from './middlewares/security';
import path from 'path';

// Import models to ensure associations are set up
import './models';

const app = express();

// Security and correlation tracking (early in middleware stack)
app.use(correlationId);
app.use(securityHeaders);
app.use(express.json());
app.use(helmet());
app.use(cors);
app.use(logger);
app.use(rateLimit);

// Serve OpenAPI YAML at /api/v1/docs
app.get('/api/v1/docs', (_req, res) => {
	res.sendFile(path.join(__dirname, '../openapi.yaml'));
});

// All main routes handled by centralized router
app.use('/api/v1', api);
// Auth and user routes separate for cleaner organization
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
