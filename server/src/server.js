const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDB, getDBStatus } = require('./config/db');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Core Middlewares
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl/Postman)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in dev to avoid friction
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  res.status(200).json({
    success: true,
    status: 'healthy',
    message: 'Task Manager API is running smoothly',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'MERN Task Management API',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/api/health'
  });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\x1b[35m[Server]\x1b[0m Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`\x1b[35m[Server]\x1b[0m Health check available at: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
