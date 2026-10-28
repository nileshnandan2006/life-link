import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { requestsRouter } from './routes/requests';
import { donorsRouter } from './routes/donors';
import { hospitalsRouter } from './routes/hospitals';
import { adminRouter } from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Security & Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'LifeLink Emergency Blood Donation API',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/requests', requestsRouter);
app.use('/api/donors', donorsRouter);
app.use('/api/hospitals', hospitalsRouter);
app.use('/api/admin', adminRouter);

app.listen(PORT, () => {
  console.log(`🚑 LifeLink API service running on port ${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});
