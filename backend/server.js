const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const wasteRoutes = require('./routes/wasteRoutes');
const pickupRoutes = require('./routes/pickupRoutes');
const statsRoutes = require('./routes/statsRoutes');

dotenv.config();



const app = express();

// Better CORS Configuration - MUST BE FIRST
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin or allow any origin
    callback(null, true);
  },
  credentials: true
}));

// Basic middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
});
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));

// DB Connection Health Check Middleware
app.use((req, res, next) => {
  const mongoose = require('mongoose');
  // 1 = connected, 2 = connecting
  if (mongoose.connection.readyState !== 1 && req.path !== '/' && !req.path.startsWith('/api-docs')) {
    return res.status(503).json({ 
      message: 'Database is currently offline. Please ensure MongoDB is started.',
      error: 'DB_OFFLINE'
    });
  }
  next();
});

// Health Check Route
app.get('/', (req, res) => {
  res.send('Waste Management API is running...');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/waste', wasteRoutes);
app.use('/api/pickup', pickupRoutes);
app.use('/api/stats', statsRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start Server after DB is connected
const startServer = async () => {
  try {
    // Only start listening if DB is ready
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
