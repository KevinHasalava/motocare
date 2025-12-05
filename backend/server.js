const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Environment variables configuration
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// --- Middleware ---
app.use(cors({
  origin: [
    'http://localhost:3000', // Local development
    'https://mtcr.vercel.app' // Production frontend
  ],
  credentials: true
})); // Enable CORS for cross-origin requests (e.g., from frontend)
app.use(express.json()); // Enable body parser for JSON requests

// Serve static files (uploaded payment slips) - only for local development
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static('uploads'));
}

// --- Basic Routes ---
app.get("/", (req, res) => {
  res.status(200).json({ 
    success: true,
    message: 'Moto-Care API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    success: true,
    status: 'healthy',
    database: 'not checked',
    timestamp: new Date().toISOString()
  });
});

// Database health check
app.get("/health/db", async (req, res) => {
  try {
    await connectDB();
    const mongoose = require('mongoose');
    const dbState = mongoose.connection.readyState;
    res.status(200).json({ 
      success: true,
      database: dbState === 1 ? 'connected' : 'disconnected',
      readyState: dbState,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ 
      success: false,
      database: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// --- Route Imports (Ensure these files exist in your routes folder) ---
let vehicleRoutes, bookingRoutes, serviceRoutes, userRoutes, jobRoutes, 
    availabilityRoutes, dataRoutes, purchaseRequestRoutes, adminRoutes,
    inventoryRoutes, supplierRoutes, stockRoutes, paymentRoutes;

try {
  vehicleRoutes = require('./routes/vehicleRoutes');
  bookingRoutes = require('./routes/bookingRoutes');
  serviceRoutes = require('./routes/serviceRoutes');
  userRoutes = require('./routes/userRoutes');
  jobRoutes = require('./routes/jobRoutes');
  availabilityRoutes = require('./routes/availabilityRoutes');
  dataRoutes = require('./routes/dataRoutes'); 
  purchaseRequestRoutes = require('./routes/purchaseRequestRoutes');
  adminRoutes = require('./routes/adminRoutes');
  inventoryRoutes = require('./routes/inventoryRoutes');
  supplierRoutes = require('./routes/supplierRoutes');
  stockRoutes = require('./routes/stockRoutes');
  paymentRoutes = require('./routes/paymentRoutes');
} catch (error) {
  console.error('Error loading routes:', error);
  throw error;
}

// Database connection middleware for API routes
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(503).json({ 
      success: false, 
      message: 'Database connection failed. Please try again later.' 
    });
  }
});

// --- API Endpoints ---

// Standard Routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/availability", availabilityRoutes); 
app.use('/api/admin', adminRoutes);


app.use('/api/inventory', inventoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/payments', paymentRoutes);

// NEW ENDPOINT: Route for Purchase Requests
app.use('/api/purchase-requests', purchaseRequestRoutes);

// Route for general data fetching required by the frontend forms
app.use('/api/data', dataRoutes); 

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV !== 'production' ? err.message : undefined
  });
});

// --- Server Listener ---
const PORT = process.env.PORT || 5000;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// Export for Vercel serverless
module.exports = app;