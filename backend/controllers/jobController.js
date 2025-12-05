const Job = require("../models/Job");
const Service = require("../models/Service");
const Booking = require("../models/Booking");
const User = require("../models/User");
const Vehicle = require("../models/Vehicle");

// 💡 NEW IMPORT: PDF Library
const PDFDocument = require("pdfkit");
const dayjs = require("dayjs");
const fs = require("fs");
const path = require("path");
const { createPDFWithLetterhead, addPDFFooter, finalizePDF } = require('../utils/pdfUtils');

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
    }).select('_id startTime endTime status'); 

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
      !customerPhoneNumber ||
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
        phone: customerPhoneNumber,
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
      type: "walkin", // Mark as walk-in job
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

const updateJobDetails = async (req, res) => {
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
             
             // Also update startTime and endTime
             // Get service ID from populated object or string
             const serviceId = service || (job.service && job.service._id ? job.service._id : job.service);
             const selectedService = await Service.findById(serviceId);
             const duration = selectedService?.duration || 60;
             console.log('Backend updateJobDetails: Service lookup:', {
                 serviceId,
                 selectedService: selectedService ? { name: selectedService.name, duration: selectedService.duration } : null,
                 duration
             });
             job.startTime = newDate;
             job.endTime = new Date(newDate.getTime() + duration * 60000);
             console.log('Backend updateJobDetails: Time calculations:', {
                 newDate,
                 startTime: job.startTime,
                 endTime: job.endTime,
                 duration
             });
             
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
        phone: customerPhoneNumber,
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

// ------------------- AUTO COMPLETE PAST JOBS -------------------

const autoCompletePastJobs = async (req, res) => {
  try {
    const now = new Date();
    
    // Find all jobs that have ended and are still active
    const pastJobs = await Job.find({
      endTime: { $lt: now },
      status: { $in: ["Booked", "Ongoing"] }
    }).populate('service', 'name').populate('mechanic', 'name').populate('user', 'name email');

    if (pastJobs.length === 0) {
      return res.status(200).json({ 
        message: "No past jobs found to complete",
        updatedCount: 0 
      });
    }

    // Update all past jobs to completed
    const updateResult = await Job.updateMany(
      {
        endTime: { $lt: now },
        status: { $in: ["Booked", "Ongoing"] }
      },
      { 
        status: "Completed",
        workHours: "Auto-completed" // Optional: mark as auto-completed
      }
    );

    console.log(`Auto-completed ${updateResult.modifiedCount} past jobs`);

    // Log details of completed jobs
    const completedJobs = pastJobs.map(job => ({
      jobId: job.jobId,
      service: job.service?.name,
      mechanic: job.mechanic?.name,
      user: job.user?.name,
      endTime: job.endTime
    }));

    res.status(200).json({
      message: `✅ Successfully completed ${updateResult.modifiedCount} past jobs`,
      updatedCount: updateResult.modifiedCount,
      completedJobs: completedJobs
    });

  } catch (err) {
    console.error('Error auto-completing past jobs:', err);
    res.status(500).json({ message: "Error auto-completing past jobs: " + err.message });
  }
};

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

        // --- PDF Setup with Letterhead Template ---
        const doc = createPDFWithLetterhead({
            filename: `JobReport_${job.jobId}.pdf`,
            res,
            useTemplateBackground: true
        });

        // --- PDF Content Generation ---
        
        // Content starts at Y=160 (set in pdfUtils) - closer to template header
        
        // Report Title Section
        doc.fontSize(20).fillColor('#1a365d').text('JOB REPORT', { align: 'center' });
        doc.moveDown(0.2);
        
        // Decorative line under title
        doc.strokeColor('#1a365d').lineWidth(2);
        doc.moveTo(150, doc.y).lineTo(doc.page.width - 150, doc.y).stroke();
        doc.moveDown(0.4);
        
        // Job Information Box
        const infoBoxY = doc.y;
        doc.rect(50, infoBoxY, doc.page.width - 100, 70).fillAndStroke('#f8f9fa', '#e9ecef');
        
        // Job Details inside box - Left side
        doc.fillColor('#2c3e50').fontSize(11);
        doc.text(`Job ID: ${job.jobId}`, 60, infoBoxY + 12);
        doc.text(`Report Generated: ${dayjs().format('dddd, MMMM DD, YYYY')}`, 60, infoBoxY + 28);
        doc.text(`Generation Time: ${dayjs().format('hh:mm A')}`, 60, infoBoxY + 44);
        
        // Job Status - Right side with better alignment
        const statusColor = job.status === 'COMPLETED' ? '#28a745' : job.status === 'IN_PROGRESS' ? '#ffc107' : '#17a2b8';
        doc.fontSize(10).fillColor(statusColor);
        doc.text(`✓ STATUS: ${job.status}`, doc.page.width - 180, infoBoxY + 12);
        doc.fillColor('#17a2b8');
        doc.text('✓ OFFICIAL JOB REPORT', doc.page.width - 180, infoBoxY + 28);
        doc.fillColor('#6c757d');
        doc.text('✓ AUTOMATED GENERATION', doc.page.width - 180, infoBoxY + 44);
        
        doc.y = infoBoxY + 80;
        doc.moveDown(0.3);
        
        // Use job.startTime or job.date for formatting, dayjs handles null/undefined gracefully
        const jobDateFormatted = job.startTime ? dayjs(job.startTime).format('YYYY-MM-DD') : (job.date ? dayjs(job.date).format('YYYY-MM-DD') : 'N/A');
        const jobTimeFormatted = job.startTime ? dayjs(job.startTime).format('HH:mm') : (job.date ? dayjs(job.date).format('HH:mm') : 'N/A');

        // Determine job type from the type field
        const jobType = job.type === 'walkin' ? 'Walk-in Job' : 'System Booking';

        // Professional Job Details Section
        doc.fontSize(14).fillColor('#1a365d').text('JOB DETAILS', 50);
        doc.moveDown(0.3);
        
        // Job Overview Box
        const jobOverviewY = doc.y;
        doc.rect(50, jobOverviewY, doc.page.width - 100, 40).fillAndStroke('#e8f4fd', '#1a365d');
        doc.fillColor('#2c3e50').fontSize(10);
        doc.text(`Type: ${jobType}`, 60, jobOverviewY + 8);
        doc.text(`Date: ${jobDateFormatted}`, 200, jobOverviewY + 8);
        doc.text(`Time: ${jobTimeFormatted}`, 350, jobOverviewY + 8);
        doc.text(`Priority: ${job.priority || 'Normal'}`, 60, jobOverviewY + 24);
        doc.text(`Duration: ${job.service?.duration || 'N/A'}`, 200, jobOverviewY + 24);
        doc.text(`Mechanic: ${job.mechanic?.name || 'Unassigned'}`, 350, jobOverviewY + 24);
        
        doc.y = jobOverviewY + 50;
        doc.moveDown(0.5);
        
        // Customer Details Section
        doc.fontSize(12).fillColor('#1a365d').text('CUSTOMER INFORMATION', 50);
        doc.moveDown(0.2);
        const customerY = doc.y;
        doc.rect(50, customerY, (doc.page.width - 120) / 2, 50).fillAndStroke('#f8f9fa', '#e9ecef');
        doc.fillColor('#2c3e50').fontSize(10);
        doc.text(`Name: ${job.user?.name || 'N/A'}`, 60, customerY + 8);
        doc.text(`Email: ${job.user?.email || 'N/A'}`, 60, customerY + 22);
        doc.text(`Phone: ${job.user?.phoneNumber || 'N/A'}`, 60, customerY + 36);
        
        // Vehicle Details Section
        const vehicleX = 50 + (doc.page.width - 120) / 2 + 20;
        doc.fontSize(12).fillColor('#1a365d').text('VEHICLE INFORMATION', vehicleX);
        doc.rect(vehicleX, customerY, (doc.page.width - 120) / 2, 50).fillAndStroke('#f8f9fa', '#e9ecef');
        doc.fillColor('#2c3e50').fontSize(10);
        doc.text(`Number: ${job.vehicle?.vehicleNumber || 'N/A'}`, vehicleX + 10, customerY + 8);
        doc.text(`Brand: ${job.vehicle?.brand || 'N/A'}`, vehicleX + 10, customerY + 22);
        doc.text(`Model: ${job.vehicle?.model || 'N/A'}`, vehicleX + 10, customerY + 36);
        
        doc.y = customerY + 60;
        doc.moveDown(0.5);
        
        // Service Details Section
        doc.fontSize(12).fillColor('#1a365d').text('SERVICE INFORMATION', 50);
        doc.moveDown(0.2);
        doc.fontSize(10)
           .text(`Service Name: ${job.service?.name || 'N/A'}`)
           .text(`Estimated Duration: ${job.service?.duration || 'N/A'} minutes`)
           .text(`Mechanic: ${job.mechanic ? job.mechanic.name : 'Auto Assign (TBD)'}`);
        doc.moveDown(1);

        // Footer
        addPDFFooter(doc, 'This is an official Job Service Report. Please retain this document for your records.');

        // Finalize the PDF and end the stream
        finalizePDF(doc);

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
  updateJobDetails,
  autoCompletePastJobs,
  generateJobPdf,
};