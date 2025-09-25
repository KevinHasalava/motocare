const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");
const Service = require("../models/Service");

// ----------------- CREATE -----------------
const createBooking = async (req, res) => {
  try {
    const { user, vehicle, date, timeSlot, service } = req.body;

    if (!user || !vehicle || !date || !timeSlot || !service) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // validate service exists
    const serviceObj = await Service.findById(service);
    if (!serviceObj) {
      return res.status(400).json({ message: "Invalid service type" });
    }

    // avoid duplicate slot booking for same vehicle
    const existing = await Booking.findOne({ date, timeSlot, vehicle });
    if (existing) {
      return res.status(400).json({ message: "Time slot already taken" });
    }

    const booking = new Booking({ user, vehicle, date, timeSlot, service });
    await booking.save();

    res.status(201).json({ message: "✅ Booking created", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----------------- READ -----------------

// Get all bookings
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("vehicle", "vehicleNumber brand model type")
      .populate("service", "name price duration");
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single booking
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("vehicle", "vehicleNumber brand model type")
      .populate("service", "name price duration");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get bookings by user
const getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .populate("vehicle", "vehicleNumber brand model")
      .populate("service", "name price");
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Available slots for given date
const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const SLOTS = ["09:00-10:00", "10:00-11:00", "11:00-12:00", "14:00-15:00"];
    const bookings = await Booking.find({ date });
    const bookedSlots = bookings.map((b) => b.timeSlot);

    const available = SLOTS.filter((s) => !bookedSlots.includes(s));
    res.status(200).json({ available });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get vehicles for a user (for dropdown)
const getUserVehicles = async (req, res) => {
  try {
    const { userId } = req.params;
    const vehicles = await Vehicle.find({ owner: userId });
    res.status(200).json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----------------- UPDATE -----------------
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("user", "name email")
      .populate("vehicle", "vehicleNumber brand model")
      .populate("service", "name price duration");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "✅ Booking updated", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----------------- DELETE -----------------
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "🗑️ Booking deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getBookingStats = async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: { $month: '$date' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } },
    ]);
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = Array(12).fill(0);
    stats.forEach((s) => {
      data[s._id - 1] = s.count;
    });
    res.status(200).json({ labels, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  getBookingsByUser,
  getAvailableSlots,
  getUserVehicles,
  updateBooking,
  deleteBooking,
  getBookingStats,
};