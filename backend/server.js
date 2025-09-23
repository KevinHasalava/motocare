const express = require('express');
const dotenv = require('dotenv');
require('dotenv').config();

const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());


app.get("/", (req,res) => {
  res.status(200).send('Api is working..5');
});


// app.use("/api/bookings", bookingRoutes);

// Routes
// Vehicle routes
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));   // 👈 මේක add කරන්න
app.use("/api/availability", require("./routes/availabilityRoutes")); // optional if you made it





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


