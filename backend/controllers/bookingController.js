const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");

// Get available slots for a date
const getAvailableSlots = async (req, res) => {
  const { date } = req.query;
  const allSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"];
  
  try {
    const bookings = await Booking.find({ date }).select("timeSlot");
    const bookedSlots = bookings.map(b => b.timeSlot);
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
    
    res.json({ date, availableSlots, bookedSlots });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a booking
const createBooking = async (req, res) => {
  const { userId, vehicleId, date, timeSlot } = req.body;

  try {
    // check if slot is already booked
    const exists = await Booking.findOne({ date, timeSlot });
    if (exists) {
      return res.status(400).json({ error: "This time slot is already booked." });
    }

    const booking = new Booking({ userId, vehicleId, date, timeSlot });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get bookings by user
const getUserBookings = async (req, res) => {
  const { userId } = req.params;
  try {
    const bookings = await Booking.find({ userId }).populate("vehicleId");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAvailableSlots, createBooking, getUserBookings };
