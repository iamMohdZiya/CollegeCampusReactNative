// index.js

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

// Initialize Express app
const app = express();

// Connect Database
connectDB();

// Enhanced CORS configuration for mobile development
const corsOptions = {
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
};

// Middleware
app.use(express.json()); // Allows parsing of JSON request bodies
app.use(cors(corsOptions)); // Enhanced CORS for mobile/frontend access

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});


// --- 📦 Mount Routes ---

// 1. Auth Routes (Login/Register)
app.use('/api/auth', require('./routes/auth'));

// 2. Student/Public Routes (Browse Products, requires authentication)
// The protect middleware will be used directly on the routes file
app.use('/api/products', require('./routes/products')); 

// 3. Order Routes (Student checkout, history)
app.use('/api/orders', require('./routes/orders')); 

// 4. Vendor Routes (Manage products, confirm payments)
app.use('/api/vendors', require('./routes/vendors')); 

// 5. Admin Routes (Manage vendors, commissions)
app.use('/api/admin', require('./routes/admin')); 

// Basic Welcome Route
app.get('/', (req, res) => {
    res.json({
        message: 'Campus Bazaar API is running...',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// 404 handler


// Set port
const PORT = process.env.PORT || 5000;

// Start Server - Listen on all interfaces (0.0.0.0) for mobile access
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Local: http://localhost:${PORT}`);
    console.log(`🌐 Network: http://0.0.0.0:${PORT}`);
    console.log(`📋 API Base: http://localhost:${PORT}/api`);
    console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
});