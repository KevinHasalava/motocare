const Job = require("../models/Job");
const Service = require("../models/Service");
const Booking = require("../models/Booking");
const User = require("../models/User");
const Vehicle = require("../models/Vehicle");

// ------------------- STANDARD JOB MANAGEMENT -------------------

// 1. Create Job from booking
const createJob = async (req, res) => {
  try {
    const { bookingId, mechanic } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate("service")
      .populate("vehicle")
      .populate("user");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const duration = booking.service.duration;
    let assignedMechanic = null;

    if (mechanic) {
      const mech = await User.findById(mechanic);
      if (!mech || mech.userType !== "mechanic") {
        return res.status(400).json({ message: "Invalid mechanic selected" });
      }

      const overlapJob = await Job.findOne({
        mechanic: mech._id,
        date: booking.date,
        status: { $in: ["Booked", "Ongoing"] },
        timeSlot: booking.timeSlot,
      });
      if (overlapJob) {
        return res.status(400).json({ message: "Mechanic not available at this time" });
      }

      assignedMechanic = mech._id;
    } else {
      // If no mechanic given, leave null instead of breaking
      const freeMech = await User.findOne({ userType: "mechanic" });
      if (freeMech) assignedMechanic = freeMech._id;
    }

    const job = new Job({
      booking: booking._id,
      user: booking.user._id,
      vehicle: booking.vehicle._id,
      service: booking.service._id,
      date: booking.date,
      timeSlot: booking.timeSlot,
      duration,
      mechanic: assignedMechanic || null, // ✅ safe default
    });

    await job.save();
    res.status(201).json({ message: "✅ Job created", job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Get all jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
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

// 3. Update job status
const updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const job = await Job.findByIdAndUpdate(id, { status }, { new: true })
      .populate("user")
      .populate("vehicle")
      .populate("service")
      .populate("mechanic");

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.status(200).json({ message: "✅ Status updated", job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. Get jobs by mechanic
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

// ------------------- WALK-IN JOB MANAGEMENT -------------------

const createWalkInJob = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhoneNumber,
      vehicleNumber,
      type,
      brand,
      model,
      year,
      service,
      date,
      time,
      mechanic,
    } = req.body;

    if (
      !customerEmail ||
      !customerName ||
      !service ||
      !date ||
      !time ||
      !vehicleNumber ||
      !type ||
      !brand ||
      !model ||
      !year
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // --- User ---
    let customer = await User.findOne({ email: customerEmail });
    if (!customer) {
      customer = new User({
        name: customerName,
        email: customerEmail,
        phoneNumber: customerPhoneNumber,
        password: "WalkInUser_" + Date.now(),
        userType: "customer",
      });
      await customer.save();
    }

    // --- Vehicle ---
    let vehicle = await Vehicle.findOne({ vehicleNumber });
    if (!vehicle) {
      vehicle = new Vehicle({
        owner: customer._id,
        ownerName: customerName,
        vehicleNumber,
        type,
        brand,
        model,
        year,
      });
      await vehicle.save();
    }

    // --- Service + Time ---
    const serviceObj = await Service.findById(service);
    if (!serviceObj) return res.status(400).json({ message: "Invalid service ID" });

    const duration = serviceObj.duration || 60;
    const startTime = new Date(`${date}T${time}:00`);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    if (startTime < new Date()) {
      return res.status(400).json({ message: "Cannot schedule in the past" });
    }

    // --- Mechanic ---
    let assignedMechanic = null;
    if (mechanic && mechanic !== "AUTO_ASSIGN") {
      const overlap = await Job.findOne({
        mechanic,
        status: { $in: ["Booked", "In Progress"] },
        $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
      });
      if (overlap) {
        return res.status(400).json({ message: "Mechanic busy during this slot" });
      }
      assignedMechanic = mechanic;
    }

    // --- Dummy Booking ---
    const dummyBooking = new Booking({
      user: customer._id,
      vehicle: vehicle._id,
      service,
      date: startTime,
      timeSlot: `${date} ${time}`,
      mechanic: assignedMechanic,
    });
    await dummyBooking.save();

    // --- Job ---
    const job = new Job({
      booking: dummyBooking._id,
      user: customer._id,
      vehicle: vehicle._id,
      service,
      date: startTime,
      timeSlot: `${date} ${time}`,
      duration,
      mechanic: assignedMechanic || null,
      startTime,
      endTime,
      status: "Booked",
    });

    await job.save();

    res.status(201).json({ message: "✅ Walk-in job created", job });
  } catch (err) {
    res.status(500).json({ message: "Error creating walk-in job: " + err.message });
  }
};

// Delete job + dummy booking
const deleteJobOnly = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.booking) await Booking.findByIdAndDelete(job.booking);
    await Job.findByIdAndDelete(id);

    res.status(200).json({ message: "🗑️ Job + booking deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------- VIEW/EDIT -------------------

const getJobDetails = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("service", "name duration price")
      .populate("mechanic", "name email")
      .populate("user", "name email phoneNumber")
      .populate("vehicle", "vehicleNumber type brand model year");

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { customerName, customerEmail, customerPhoneNumber, service, date, time, mechanic, status } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    job.service = service || job.service;
    job.date = date || job.date;
    job.timeSlot = date && time ? `${date} ${time}` : job.timeSlot;
    job.mechanic = mechanic === "AUTO_ASSIGN" ? null : mechanic || job.mechanic;
    job.status = status || job.status;

    await job.save();

    if (job.user) {
      await User.findByIdAndUpdate(job.user, {
        name: customerName,
        email: customerEmail,
        phoneNumber: customerPhoneNumber,
      });
    }

    if (job.booking) {
      await Booking.findByIdAndUpdate(job.booking, {
        service,
        date,
        timeSlot: date && time ? `${date} ${time}` : job.timeSlot,
        mechanic: job.mechanic,
      });
    }

    res.status(200).json({ message: "✅ Job updated", job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  updateJobStatus,
  getJobsByMechanic,
  createWalkInJob,
  deleteJobOnly,
  getJobDetails,
  updateJob,
};
