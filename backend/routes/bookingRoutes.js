const express = require("express");
const router = express.Router();
const {
  createBooking,
  getAvailableSlots,
  getUserVehicles,
  getBookings,
  getBookingById,
  getBookingsByUser
} = require("../controllers/bookingController");

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

module.exports = router;