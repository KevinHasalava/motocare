const Job = require("../models/Job");
const Service = require("../models/Service");
const Booking = require("../models/Booking");
const User = require("../models/User");
const Vehicle = require("../models/Vehicle");

// 💡 NEW IMPORT: PDF Library
const PDFDocument = require("pdfkit");
const dayjs = require("dayjs");

// Import only the Email Service
const { sendBookingConfirmationEmail, sendJobUpdateEmail } = require('../utils/emailService');

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
      mechanic: assignedMechanic || null,
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

// ------------------- FRONTEND SCHEDULE CHECK -------------------

const getJobsByDateAndMechanic = async (req, res) => {
  try {
    const { date, mechanicId } = req.query;
    
    if (!date || !mechanicId) {
      return res.status(400).json({ message: "Date and mechanicId are required" });
    }
    
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0); 
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const jobs = await Job.find({
      mechanic: mechanicId,
      startTime: { $gte: dayStart, $lte: dayEnd },
      status: { $in: ["Booked", "Ongoing"] }
    }).select('startTime endTime status'); 

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

    // Validation: Check Business Hours
    const openHour = new Date(`${date}T08:00:00`);
    const closeHour = new Date(`${date}T17:00:00`);
    if (startTime < openHour || endTime > closeHour) {
      return res.status(400).json({ message: "Job must be scheduled between 08:00 - 17:00" });
    }

    // --- Mechanic ---
    let assignedMechanic = null;
    if (mechanic && mechanic !== "AUTO_ASSIGN") {
      const mechUser = await User.findById(mechanic);
      if (!mechUser || mechUser.userType !== "mechanic") {
        return res.status(400).json({ message: "Invalid mechanic ID"
    });
      }
      
      // Validation: Mechanic Overlap Check 
      const overlap = await Job.findOne({
        mechanic,
        status: { $in: ["Booked", "Ongoing"] },
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
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

    await job.save(); // jobId will be generated here by the pre-save hook

    // ----------------------------------------------------
    // Final Step: Send Email Confirmation
    // ----------------------------------------------------
    // 💡 Using job.jobId instead of job._id
    const jobDetails = { jobId: job.jobId }; 
    
    const emailData = { 
        user: customer, 
        vehicle, 
        service: serviceObj, 
        bookingDetails: dummyBooking, 
        jobDetails 
    };
    
    sendBookingConfirmationEmail(emailData); 
    // ----------------------------------------------------

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

    // Populate all related documents needed for the email
    const job = await Job.findById(jobId).populate('user').populate('vehicle').populate('service');
    if (!job) return res.status(404).json({ message: "Job not found" });

    // ----------------------------------------------------------------------
    // Saving old details for change detection - ✅ FIXED to handle null/undefined job.date
    const oldJobDetails = {
        oldDate: job.date ? job.date.toISOString().split('T')[0] : '', // FIX
        oldTime: job.date ? job.date.toISOString().split('T')[1].substring(0, 5) : '', // FIX
        oldStatus: job.status
    };
    // ----------------------------------------------------------------------

    job.service = service || job.service;
    
    let isTimeUpdated = false;
    if (date && time) {
        const newDate = new Date(`${date}T${time}:00`);
        // Check if job.date exists before getTime()
        if (!job.date || job.date.getTime() !== newDate.getTime()) {
             job.date = newDate;
             job.timeSlot = `${date} ${time}`;
             isTimeUpdated = true;
        }
    }
    
    job.mechanic = mechanic === "AUTO_ASSIGN" ? null : mechanic || job.mechanic;
    job.status = status || job.status;

    await job.save();

    // User details update
    if (job.user) {
      await User.findByIdAndUpdate(job.user, {
        name: customerName,
        email: customerEmail,
        phoneNumber: customerPhoneNumber,
      });
    }

    // Booking details update
    if (job.booking) {
      await Booking.findByIdAndUpdate(job.booking, {
        service: job.service,
        date: job.date,
        timeSlot: job.timeSlot,
        mechanic: job.mechanic,
      });
    }
    
    // ----------------------------------------------------------------------
    // Send Email Confirmation for Update - ✅ FIXED to handle null/undefined job.date
    // ----------------------------------------------------------------------
    const newDateStr = job.date ? job.date.toISOString().split('T')[0] : ''; // FIX
    const newTimeStr = job.date ? job.date.toISOString().split('T')[1].substring(0, 5) : ''; // FIX
    
    // Send email if Date/Time or Status has changed
    if (oldJobDetails.oldDate !== newDateStr || oldJobDetails.oldTime !== newTimeStr || oldJobDetails.oldStatus !== job.status) {
        
        const emailData = {
            user: job.user,
            vehicle: job.vehicle,
            service: job.service,
            jobDetails: { 
                jobId: job.jobId, // 💡 Using job.jobId
                date: job.date, 
                status: job.status 
            }
        };

        sendJobUpdateEmail(emailData);
    }
    // ----------------------------------------------------------------------

    res.status(200).json({ message: "✅ Job updated", job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------- NEW: PDF GENERATION CONTROLLER -------------------

/**
 * Generates and streams a PDF document containing the job details.
 * GET /api/jobs/:id/download-pdf
 */
const generateJobPdf = async (req, res) => {
    try {
        const jobId = req.params.id;

        const job = await Job.findById(jobId)
            .populate("service", "name duration price")
            .populate("mechanic", "name")
            .populate("user", "name email phoneNumber")
            .populate("vehicle", "vehicleNumber type brand model year");

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // --- PDF Setup ---
        const doc = new PDFDocument({ margin: 50 });
        const filename = `JobReport_${job.jobId}.pdf`;

        // Setting response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        // Pipe the PDF document stream to the response stream
        doc.pipe(res);

        // --- PDF Content Generation ---
        
        // Header
        doc.fontSize(20).fillColor('#3498db').text('Job Service Report', { align: 'center' });
        doc.fontSize(12).fillColor('#555').text(`Report Generated: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`, { align: 'center' });
        doc.moveDown(1);
        
        // Job Overview
        doc.fontSize(16).fillColor('#2c3e50').text(`JOB ID: ${job.jobId}`, { underline: true });
        doc.moveDown(0.5);
        
        // Use job.date with dayjs for formatting, dayjs handles null/undefined gracefully
        const jobDateFormatted = job.date ? dayjs(job.date).format('YYYY-MM-DD') : 'N/A';
        const jobTimeFormatted = job.date ? dayjs(job.date).format('hh:mm A') : 'N/A';

        doc.fontSize(12).fillColor('#333')
           .text(`Status: ${job.status}`, { continued: true })
           .text(` | Date: ${jobDateFormatted}`, { continued: true })
           .text(` | Time: ${jobTimeFormatted}`);
        doc.moveDown(1);
        
        // Customer Details (Conditional checks added for safety, though Mongoose populate usually ensures existence)
        doc.fontSize(14).fillColor('#2c3e50').text('Customer Details', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10)
           .text(`Name: ${job.user?.name || 'N/A'}`)
           .text(`Email: ${job.user?.email || 'N/A'}`)
           .text(`Phone: ${job.user?.phoneNumber || 'N/A'}`);
        doc.moveDown(1);
        
        // Vehicle Details
        doc.fontSize(14).fillColor('#2c3e50').text('Vehicle Details', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10)
           .text(`Number: ${job.vehicle?.vehicleNumber || 'N/A'}`)
           .text(`Brand / Model: ${job.vehicle?.brand || 'N/A'} ${job.vehicle?.model || 'N/A'}`)
           .text(`Type / Year: ${job.vehicle?.type || 'N/A'} (${job.vehicle?.year || 'N/A'})`);
        doc.moveDown(1);
        
        // Service Details
        doc.fontSize(14).fillColor('#2c3e50').text('Service & Assignment', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10)
           .text(`Service Name: ${job.service?.name || 'N/A'}`)
           .text(`Estimated Duration: ${job.service?.duration || 'N/A'} minutes`)
           .text(`Mechanic: ${job.mechanic ? job.mechanic.name : 'Auto Assign (TBD)'}`);
        doc.moveDown(1);

        // Footer
        doc.fontSize(8).fillColor('#888').text('This is an official Job Service Report. Please retain this document for your records.', 50, doc.page.height - 50, {
            align: 'center',
            width: doc.page.width - 100
        });

        // Finalize the PDF and end the stream
        doc.end();

    } catch (err) {
        console.error("Error generating PDF:", err.message);
        // Send a proper error response if anything fails
        res.status(500).json({ message: "PDF generation failed due to a server error." });
    }
};

// ------------------- MODULE EXPORTS -------------------

module.exports = {
  createJob,
  getJobs,
  updateJobStatus,
  updateJob,
  getJobsByMechanic,
  getJobsByDateAndMechanic, 
  createWalkInJob,
  deleteJobOnly,
  getJobDetails,
  updateJob,
  generateJobPdf,
};