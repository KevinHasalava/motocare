
const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");
const Service = require("../models/Service");
const User = require("../models/User"); // important to get mechanics
const Job = require("../models/Job");
const { sendBookingConfirmationEmail } = require('../utils/emailService');


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
      user, vehicle, service, date: startTime,
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

    try {
    // Email එකට අවශ්‍ය සම්පූර්ණ user සහ vehicle විස්තර ලබාගැනීම
    const bookingUser = await User.findById(user).select('name email');
    const bookingVehicle = await Vehicle.findById(vehicle).select('brand model vehicleNumber');

    // serviceObj එක අප සතුව දැනටමත් තිබේ.
    
    // Email යැවීමේ function එකට අවශ්‍ය සියලු දත්ත ලබා දීම
    // මෙහිදී 'job' object එක ලබා දෙන නිසා, Job ID එක email එකට ඇතුළත් වේ.
    await sendBookingConfirmationEmail({
        user: bookingUser,
        vehicle: bookingVehicle,
        service: serviceObj, // We already have the full service object from the top of the function
        bookingDetails: booking, // Pass the original booking document for date/time
        jobDetails: job // Pass the job document which contains the new jobId
    });

} catch (emailError) {
    // Log if the email fails, but don't fail the entire booking request
    console.error("Could not send confirmation email:", emailError);
}

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
      .populate("vehicle", "vehicleNumber brand model type") // 👈 'type' මෙතනට එකතු කරන්න
      .populate("service", "name price duration vehicleType")
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

// 1. UPDATE BOOKING AND ASSOCIATED JOB
const updateBookingAndJob = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { date, time, service, mechanic } = req.body;

    if (!date || !time || !service) {
      return res.status(400).json({ message: "Date, time, and service are required" });
    }

    const associatedJob = await Job.findOne({ booking: bookingId });
    if (!associatedJob) {
      return res.status(404).json({ message: "Associated job not found for this booking" });
    }

    const serviceObj = await Service.findById(service);
    if (!serviceObj) return res.status(400).json({ message: "Invalid service type" });

    const duration = serviceObj.duration || 60;
    const newStartTime = new Date(`${date}T${time}:00`);
    const newEndTime = new Date(newStartTime.getTime() + duration * 60000);

    const mechanicToAssign = mechanic;
    if (mechanicToAssign) {
      const overlap = await Job.findOne({
        _id: { $ne: associatedJob._id },
        mechanic: mechanicToAssign,
        startTime: { $lt: newEndTime },
        endTime: { $gt: newStartTime },
        status: { $in: ["Booked", "Ongoing"] }
      });

      if (overlap) {
        return res.status(400).json({ message: "The selected mechanic is not available at this new time." });
      }
    }

    await Booking.findByIdAndUpdate(bookingId, {
      service,
      date: newStartTime,
      timeSlot: `${date} ${time}`,
      mechanic: mechanicToAssign,
    });

    await Job.findByIdAndUpdate(associatedJob._id, {
      service,
      mechanic: mechanicToAssign,
      startTime: newStartTime,
      endTime: newEndTime,
    });

    res.status(200).json({ message: "✅ Booking and Job updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error during update: " + err.message });
  }
};

// 2. DELETE BOOKING AND ASSOCIATED JOB
const deleteBookingAndJob = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    await Job.findOneAndDelete({ booking: bookingId });
    await Booking.findByIdAndDelete(bookingId);
    res.status(200).json({ message: "🗑️ Booking and associated job deleted." });
  } catch (err) {
    res.status(500).json({ message: "Server error during deletion: " + err.message });
  }
};





module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  getBookingsByUser,
  getAvailableSlots,
  getUserVehicles,
  updateBookingAndJob,
  deleteBookingAndJob,
};