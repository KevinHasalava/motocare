const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");
const Service = require("../models/Service");
const User = require("../models/User"); // important to get mechanics
const Job = require("../models/Job");

// ----------------- CREATE -----------------
const createBooking = async (req, res) => {
  try {
    const { user, vehicle, date, time, service, mechanic } = req.body;

    if (!user || !vehicle || !date || !time || !service) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // validate service
    const serviceObj = await Service.findById(service);
    if (!serviceObj) return res.status(400).json({ message: "Invalid service type" });

    const duration = serviceObj.duration || 60; // min
    const startTime = new Date(`${date}T${time}:00`);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    // business hours
    const openHour = new Date(`${date}T08:00:00`);
    const closeHour = new Date(`${date}T17:00:00`);
    if (startTime < openHour || endTime > closeHour) {
      return res.status(400).json({ message: "Booking allowed between 08:00 - 17:00" });
    }

    // ✅ Mechanic assign
    let assignedMechanic = null;

    if (mechanic) {
      // case: user passed mechanic manually
      const mech = await User.findById(mechanic);
      if (!mech || mech.userType !== "mechanic") {
        return res.status(400).json({ message: "Invalid mechanic" });
      }
      assignedMechanic = mech._id;
    } else {
      // case: auto assign → find all mechanics
      const allMechs = await User.find({ userType: "mechanic" });

      // count each mechanic jobs that day
      let mechWorkload = [];
      for (const m of allMechs) {
        const jobsCount = await Job.countDocuments({
          mechanic: m._id,
          startTime: { $gte: new Date(`${date}T00:00:00`), $lt: new Date(`${date}T23:59:59`) },
          status: { $in: ["Booked", "Ongoing"] }
        });
        mechWorkload.push({ mech: m._id, count: jobsCount });
      }

      // pick mechanic with lowest jobs
      mechWorkload.sort((a, b) => a.count - b.count);
      if (mechWorkload.length > 0) {
        assignedMechanic = mechWorkload[0].mech;
      }
    }

    // Availability check for chosen mechanic
    if (assignedMechanic) {
      const overlap = await Job.findOne({
        mechanic: assignedMechanic,
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
        status: { $in: ["Booked", "Ongoing"] }
      });
      if (overlap) {
        return res.status(400).json({ message: "Chosen mechanic not free at this time" });
      }
    }

    // Save booking
    const booking = new Booking({
      user, vehicle, service, date,
      timeSlot: `${date} ${time}`,
      mechanic: assignedMechanic
    });
    await booking.save();

    // Save job
    const job = new Job({
      booking: booking._id,
      user, vehicle, service,
      mechanic: assignedMechanic,
      startTime, endTime,
      status: "Booked"
    });
    await job.save();

    res.status(201).json({ message: "✅ Booking + Job created", booking, job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ----------------- READ ALL -----------------
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("vehicle", "vehicleNumber brand model type")
      .populate("service", "name price duration")
      .populate("mechanic", "name email");
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----------------- READ ONE -----------------
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("vehicle", "vehicleNumber brand model type")
      .populate("service", "name price duration")
      .populate("mechanic", "name email");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----------------- BOOKINGS BY USER -----------------
const getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .populate("vehicle", "vehicleNumber brand model")
      .populate("service", "name price")
      .populate("mechanic", "name email");
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----------------- AVAILABLE SLOTS -----------------
// Get available slots for given date
const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    // Normalize date range
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    const SLOTS = ["09:00-10:00", "10:00-11:00", "11:00-12:00", "14:00-15:00"];

    // find bookings within that date range
    const bookings = await Booking.find({
      date: { $gte: start, $lt: end }
    });

    const bookedSlots = bookings.map((b) => b.timeSlot);

    const available = SLOTS.filter((s) => !bookedSlots.includes(s));
    res.status(200).json({ available });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----------------- GET VEHICLES OF USER -----------------
const getUserVehicles = async (req, res) => {
  try {
    const { userId } = req.params;
    const vehicles = await Vehicle.find({ owner: userId });
    res.status(200).json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----------------- UPDATE BOOKING -----------------
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("user", "name email")
      .populate("vehicle", "vehicleNumber brand model")
      .populate("service", "name price duration")
      .populate("mechanic", "name email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "✅ Booking updated", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----------------- DELETE BOOKING -----------------
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



module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  getBookingsByUser,
  getAvailableSlots,
  getUserVehicles,
  updateBooking,
  deleteBooking,
};