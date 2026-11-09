import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDbStatus } from './db.js';
import authRoutes from './routes/authRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import scamRoutes from './routes/scamRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import transitRoutes from './routes/transitRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for Netlify, Vite dev server, and local clients
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Initialize Database connection (MongoDB Atlas with fallback)
connectDB();

// Root & Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'Campus Scout Bengaluru API',
    version: '2.0.0',
    database: getDbStatus() ? 'MongoDB Atlas Connected' : 'In-Memory Pre-Seeded Store (Ready for MONGODB_URI)',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/scams', scamRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/transit', transitRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.path });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`🚀 Campus Scout Backend running on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌤️ Weather API: http://localhost:${PORT}/api/weather`);
  console.log(`🚇 Transit API: http://localhost:${PORT}/api/transit/metro`);
  console.log(`🛡️ Scam Ledger: http://localhost:${PORT}/api/scams`);
  console.log(`🏠 Listings:    http://localhost:${PORT}/api/listings`);
  console.log(`=================================================\n`);
});
