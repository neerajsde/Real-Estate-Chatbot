import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import fileUpload from 'express-fileupload';
import connectToDatabase from './config/database.js';
import connectRedis from './config/redis.js';
import dotenv from 'dotenv';
dotenv.config();
// Import API routes
import apiV1Routes from './api/v1.js';

const app = express();
const PORT = process.env.PORT || 4040;

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security headers
app.use(helmet());

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Cookie parser
app.use(cookieParser());

// File upload
app.use(fileUpload());

// Sanitize only req.body and req.params (avoid req.query mutation)
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  // Do NOT sanitize req.query here to avoid the mutation error
  next();
});

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
});
app.use('/api', limiter);

// DB connections
connectToDatabase();
await connectRedis();

// Serve static files
const buildPath = path.join(__dirname, 'public');
app.use(express.static(buildPath));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(buildPath, 'index.html'));
});

// app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
}));
app.use('/api/v1', apiV1Routes);

// 404 handler
app.use((req, res) => {
  res.sendFile(path.resolve(buildPath, 'notFoundPage.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err.message);
  res.sendFile(path.resolve(buildPath, 'error.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});