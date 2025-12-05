const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Environment variables configuration
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Connect to MongoDB database (for serverless, this will be called on each request)
connectDB().catch(err => console.error('Database connection error:', err));

// --- Middleware ---
app.use(cors({
  origin: [
    'http://localhost:3000', // Local development
    'https://mtcr.vercel.app' // Production frontend
  ],
  credentials: true
})); // Enable CORS for cross-origin requests (e.g., from frontend)
app.use(express.json()); // Enable body parser for JSON requests

// Serve static files (uploaded payment slips)
app.use('/uploads', express.static('uploads'));

// --- Basic Route ---
app.get("/", (req,res) => {
  res.status(200).send('Api is working..5');
});


// --- Route Imports (Ensure these files exist in your routes folder) ---
const vehicleRoutes = require('./routes/vehicleRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const dataRoutes = require('./routes/dataRoutes'); 
const purchaseRequestRoutes = require('./routes/purchaseRequestRoutes');


// --- API Endpoints ---

// Standard Routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/availability", availabilityRoutes); 
app.use('/api/admin', require('./routes/adminRoutes'));


app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/suppliers', require('./routes/supplierRoutes'));
app.use('/api/stock', require('./routes/stockRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

// NEW ENDPOINT: Route for Purchase Requests
app.use('/api/purchase-requests', purchaseRequestRoutes);

// Route for general data fetching required by the frontend forms
app.use('/api/data', dataRoutes); 


// --- Server Listener ---
const PORT = process.env.PORT || 5000;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// Export for Vercel serverless
module.exports = app;