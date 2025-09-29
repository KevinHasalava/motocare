const express = require('express');
const dotenv = require('dotenv');
require('dotenv').config();

const cors = require('cors');
const connectDB = require('./config/db');

// Environment variables configuration
dotenv.config();

// Connect to MongoDB database
connectDB();

const app = express();

// --- Middleware ---
app.use(cors()); // Enable CORS for cross-origin requests (e.g., from frontend)
app.use(express.json()); // Enable body parser for JSON requests

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
// 🛠️ NEW IMPORT: For fetching services, mechanics, and user vehicle data
const dataRoutes = require('./routes/dataRoutes'); 



// --- API Endpoints ---

// Standard Routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/availability", availabilityRoutes); 
app.use('/api/admin', require('./routes/adminRoutes'));


// 🎯 NEW ENDPOINT: Route for general data fetching required by the frontend forms
app.use('/api/data', dataRoutes); 


// --- Server Listener ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));