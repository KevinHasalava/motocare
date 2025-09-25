const express = require("express");
const router = express.Router();
const {
  createBooking,
  getAvailableSlots,
  getUserVehicles,
  getBookings,
  getBookingById,
  getBookingsByUser,
  getBookingStats,
} = require("../controllers/bookingController");
const { auth, adminAuth } = require("../middleware/authMiddleware");

// ✅ Create new booking
router.post("/", createBooking);

// ✅ Get all bookings
router.get("/", getBookings);

// ✅ Get single booking
router.get("/:id", getBookingById);

// ✅ Get bookings by user
router.get("/user/:userId", getBookingsByUser);

// ✅ Get available slots
router.get("/available", getAvailableSlots);

// ✅ Get vehicles of user
router.get("/vehicles/:userId", getUserVehicles);

router.get('/stats', auth, adminAuth, getBookingStats);

module.exports = router;