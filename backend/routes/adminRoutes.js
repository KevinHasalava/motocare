const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");
const Service = require("../models/Service");
const auth = require("../middleware/authMiddleware"); // ✅ import matches

// 📊 Dashboard stats endpoint
router.get("/stats", auth, async (req, res) => {
  try {
    // Count documents in collections
    const users = await User.countDocuments();
    const bookings = await Booking.countDocuments();
    const vehicles = await Vehicle.countDocuments();
    const services = await Service.countDocuments();

    // Placeholders until Task/Payment models exist
    const tasks = 0;
    const payments = 0;

    res.json({
      success: true,
      data: {
        users,
        bookings,
        vehicles,
        services,
        tasks,
        payments,
      },
    });
  } catch (err) {
    console.error("❌ Error fetching admin stats:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;