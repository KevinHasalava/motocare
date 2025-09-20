const Job = require("../models/Job");
const Service = require("../models/Service");
const Booking = require("../models/Booking");
const User = require("../models/User");

// Create Job from booking
const createJob = async (req, res) => {
  try {
    const { bookingId, mechanic } = req.body;

    // Find booking
    const booking = await Booking.findById(bookingId)
      .populate("service")
      .populate("vehicle")
      .populate("user");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Service duration
    const duration = booking.service.duration;

    let assignedMechanic = null;

    if (mechanic) {
      const mech = await User.findById(mechanic);
      if (!mech || mech.userType !== "mechanic") {
        return res.status(400).json({ message: "Invalid mechanic selected" });
      }

      // Mechanic availability check
      const overlapJob = await Job.findOne({
        mechanic: mech._id,
        date: booking.date,
        status: { $in: ["Booked", "Ongoing"] },
        timeSlot: booking.timeSlot
      });

      if (overlapJob) {
        return res.status(400).json({ message: "Mechanic not available at this time" });
      }

      assignedMechanic = mech._id;
    } else {
      // AUTO ASSIGN mechanic (first free mechanic)
      const freeMech = await User.findOne({ userType: "mechanic" });
      if (freeMech) {
        assignedMechanic = freeMech._id;
      }
    }

    const job = new Job({
      booking: booking._id,
      user: booking.user._id,
      vehicle: booking.vehicle._id,
      service: booking.service._id,
      date: booking.date,
      timeSlot: booking.timeSlot,
      duration,
      mechanic: assignedMechanic
    });

    await job.save();
    res.status(201).json({ message: "✅ Job created", job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}, "jobId user vehicle service mechanic startTime endTime status")
      .populate("user", "name email")
      .populate("vehicle", "vehicleNumber brand model")
      .populate("service", "name duration price")
      .populate("mechanic", "name email")
      .populate("booking", "_id");
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update job status (Complete, Ongoing, Booked)
const updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const job = await Job.findByIdAndUpdate(id, { status }, { new: true })
      .populate("user")
      .populate("vehicle")
      .populate("service")
      .populate("mechanic");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "✅ Status updated", job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get jobs by mechanic
const getJobsByMechanic = async (req, res) => {
  try {
    const jobs = await Job.find({ mechanic: req.params.mechanicId })
      .populate("user", "name")
      .populate("vehicle", "vehicleNumber")
      .populate("service", "name duration");
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  updateJobStatus,
  getJobsByMechanic
};