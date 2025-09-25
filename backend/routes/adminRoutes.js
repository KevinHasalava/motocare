// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");
const Service = require("../models/Service");
const { adminAuth } = require("../middleware/authMiddleware");

// 📊 Dashboard stats endpoint
router.get("/stats", adminAuth, async (req, res) => {
  try {
    const users = await User.countDocuments();
    const bookings = await Booking.countDocuments();
    const vehicles = await Vehicle.countDocuments();
    const services = await Service.countDocuments();

    // Optional: extend later
    const tasks = 0;
    const payments = 0;

    res.json({
      users,
      bookings,
      vehicles,
      services,
      tasks,
      payments,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
