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

// Routes
// app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));