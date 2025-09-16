const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  jobId: {
    type: String,
    unique: true,
    required: false
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true
  },
  mechanic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["Booked", "Ongoing", "Complete"],
    default: "Booked"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 👇 Auto-generate jobId
jobSchema.pre("save", async function (next) {
  if (!this.jobId) {
    const count = await mongoose.models.Job.countDocuments();
    this.jobId = "JOB-" + String(count + 1).padStart(4, "0");
  }
  next();
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;