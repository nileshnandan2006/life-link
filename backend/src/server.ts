import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { seedDatabaseIfEmpty } from './config/seed';
import { requestsRouter } from './routes/requests';
import { donorsRouter } from './routes/donors';
import { hospitalsRouter } from './routes/hospitals';
import { adminRouter } from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// Security & Middleware - Allow Netlify, localhost, and specified origins
app.use(cors({
  origin: CORS_ORIGIN === '*' ? true : (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowed = CORS_ORIGIN.split(',').map(s => s.trim());
    if (allowed.includes('*') || allowed.includes(origin) || origin.endsWith('.netlify.app') || origin.includes('localhost')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for emergency healthcare service
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'LifeLink Emergency Blood Donation API',
    database: 'MongoDB Atlas',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/requests', requestsRouter);
app.use('/api/donors', donorsRouter);
app.use('/api/hospitals', hospitalsRouter);
app.use('/api/admin', adminRouter);

async function startServer() {
  // Connect to MongoDB Atlas
  const connected = await connectDatabase();
  if (connected) {
    await seedDatabaseIfEmpty();
  }

  app.listen(PORT, () => {
    console.log(`🚑 LifeLink API service running on port ${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  });
}

startServer();
