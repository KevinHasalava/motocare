const express = require('express');
const dotenv = require('dotenv');

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


// app.use('/api/bookings', require('./routes/bookingRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


