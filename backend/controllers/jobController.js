const Job = require("../models/Job");
const Service = require("../models/Service");
const Booking = require("../models/Booking");
const User = require("../models/User");
const Vehicle = require('../models/Vehicle'); // Vehicle Model is required for walk-in flow

// ------------------- STANDARD JOB MANAGEMENT (Original Functions) -------------------

// 1. Create Job from booking
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

// 2. Get all jobs
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

// 3. Update job status (Complete, Ongoing, Booked)
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

// 3.1. Update job with all fields (for mechanic portal)
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, workHours, notes } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (workHours !== undefined) updateData.workHours = workHours;
    if (notes !== undefined) updateData.notes = notes;

    const job = await Job.findByIdAndUpdate(id, updateData, { new: true })
      .populate("user", "name email")
      .populate("vehicle", "vehicleNumber brand model type year")
      .populate("service", "name duration price")
      .populate("mechanic", "name email")
      .populate("booking", "date");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "✅ Job updated successfully", job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. Get jobs by mechanic
const getJobsByMechanic = async (req, res) => {
  try {
    const jobs = await Job.find({ mechanic: req.params.mechanicId })
      .populate("user", "name email")
      .populate("vehicle", "vehicleNumber brand model type year")
      .populate("service", "name duration price")
      .populate("booking", "date");
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------- MANUAL WALK-IN JOB FUNCTIONS (NEW LOGIC ADDED) -------------------

// 5. NEW FUNCTION: Handles manual job creation (Find/Create User & Vehicle)
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
      mechanic         
    } = req.body;

    // Combined validation check
    if (!customerEmail || !customerName || !service || !date || !time || !vehicleNumber || !type || !brand || !model || !year) {
      return res.status(400).json({ message: "All required fields are missing. Please provide customer, vehicle, service, date, and time details." });
    }
    
    // --- Phase 1: FIND OR CREATE USER ---
    let customer = await User.findOne({ email: customerEmail });
    let userId;

    if (customer) {
      userId = customer._id;
    } else {
      // Create new user (password auto-hashed by User model's pre-save hook)
      const newCustomer = new User({
        name: customerName,
        email: customerEmail,
        phoneNumber: customerPhoneNumber, 
        password: "WalkInUser_Temp" + Date.now(),
        userType: "customer"
      });
      await newCustomer.save();
      userId = newCustomer._id;
    }
    
    // --- Phase 2: FIND OR CREATE VEHICLE ---
    let vehicleRecord = await Vehicle.findOne({ vehicleNumber });
    let vehicleId;
    
    if (vehicleRecord) {
        // Vehicle already exists, use its ID
        vehicleId = vehicleRecord._id;
    } else {
        // Vehicle Type validation 
        const allowedTypes = ['Car', 'Three Wheel', 'Motorcycle', 'Van','SUV'];
        if (!allowedTypes.includes(type)) {
            return res.status(400).json({ message: `Invalid vehicle type. Allowed: ${allowedTypes.join(', ')}` });
        }

        // Create a new vehicle linked to the resolved userId
        const newVehicle = new Vehicle({
            owner: userId,
            ownerName: customerName, 
            vehicleNumber,
            type,
            brand,
            model,
            year
        });
        await newVehicle.save();
        vehicleId = newVehicle._id;
    }

    // --- Phase 3: ASSIGN MECHANIC AND CREATE JOB ---

    // 1. Time Calculation and Service Validation
    const serviceObj = await Service.findById(service); 
    if (!serviceObj) return res.status(400).json({ message: "Invalid service ID provided." });

    const duration = serviceObj.duration || 60; 
    const startTime = new Date(`${date}T${time}:00`);
    const endTime = new Date(startTime.getTime() + duration * 60000);
    
    // Simple check to ensure time is not in the past
    if (startTime < new Date()) {
        return res.status(400).json({ message: "Cannot schedule a job in the past." });
    }

    // 2. Mechanic Assignment and Availability Check
    let assignedMechanic = mechanic; 

    if (assignedMechanic === 'AUTO_ASSIGN' || assignedMechanic === null) {
        // If AUTO_ASSIGN is selected or mechanic is null, we set the mechanic to null 
        // in the database and expect manual assignment later.
        assignedMechanic = null; 
        
    } else {
        // If a specific mechanic is chosen, check their availability (overlap check)
        const overlapJob = await Job.findOne({
            mechanic: assignedMechanic,
            status: { $in: ['Booked', 'In Progress'] },
            $or: [
                { startTime: { $lt: endTime, $gte: startTime } }, 
                { endTime: { $gt: startTime, $lte: endTime } },  
                { startTime: { $lte: startTime }, endTime: { $gte: endTime } } 
            ]
        });

        if (overlapJob) {
            return res.status(400).json({ message: "The selected mechanic is busy during this time slot." });
        }
    }


    // 3. Create Dummy Booking & Job
    const dummyBooking = new Booking({
        user: userId,
        vehicle: vehicleId,
        service,
        date: startTime, 
        timeSlot: `${date} ${time}`,
        mechanic: assignedMechanic 
    });
    await dummyBooking.save();

    const job = new Job({
      booking: dummyBooking._id, 
      user: userId, 
      vehicle: vehicleId, 
      service,
      date: startTime, 
      timeSlot: `${date} ${time}`,
      duration,
      mechanic: assignedMechanic,
      startTime, 
      endTime,
      status: "Booked"
    });

    await job.save();

    res.status(201).json({ message: "✅ Walk-In Job created successfully", job });
  } catch (err) {
    console.error("Walk-In Job Creation Error:", err);
    res.status(500).json({ message: "Error creating walk-in job: " + err.message });
  }
};

// 6. NEW FUNCTION: Deletes a manual job and its associated dummy booking
const deleteJobOnly = async (req, res) => {
  try {
    const { id } = req.params; // Job ID

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const bookingId = job.booking; 
    await Job.findByIdAndDelete(id);
    await Booking.findByIdAndDelete(bookingId); 

    res.status(200).json({ message: "🗑️ Job and associated booking deleted." });
  } catch (err) {
    res.status(500).json({ message: "Server error during deletion: " + err.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  updateJobStatus,
  updateJob,
  getJobsByMechanic,
  createWalkInJob, 
  deleteJobOnly 
};