const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    jobId: {
        type: String,
        unique: true
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
        enum: ["Booked", "Ongoing", "Completed", "Cancelled"],
        default: "Booked"
    },
    workHours: {
        type: String,
        default: ""
    },
    type: {
        type: String,
        enum: ["walkin", "booking"],
        default: "booking"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// This function runs automatically before a new job is saved.
jobSchema.pre("save", async function (next) {
    if (this.isNew) {
        try {
            // Start with the total document count as an initial guess for the next ID.
            let count = await mongoose.models.Job.countDocuments();
            
            // Loop indefinitely until a unique ID is found.
            while (true) {
                // Format the candidate ID string (e.g., "JOB-0036").
                const candidateId = `JOB-${String(count + 1).padStart(4, '0')}`;
                
                // Check if a job with this candidate ID already exists in the database.
                const existingJob = await mongoose.models.Job.findOne({ jobId: candidateId });

                if (!existingJob) {
                    // If no job is found, the ID is unique. Assign it and break the loop.
                    this.jobId = candidateId;
                    break;
                } else {
                    // If the ID already exists, increment the count and try the next number in the loop.
                    count++;
                }
            }
        } catch (error) {
            // If any error occurs during the process, pass it to the next middleware.
            return next(error);
        }
    }
    next();
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;