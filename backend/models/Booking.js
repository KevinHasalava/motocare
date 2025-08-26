const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
  date: { type: String, required: true }, // e.g., "2025-08-23"
  timeSlot: { type: String, required: true }, // e.g., "10:00 AM"
  status: { type: String, default: "booked" }
});

module.exports = mongoose.model("Booking", bookingSchema);
