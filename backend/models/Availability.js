const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
  mechanic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false // if null → apply to whole garage (holiday/closed day)
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String, // "08:00"
    required: true
  },
  endTime: {
    type: String, // "17:00"
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Availability = mongoose.model("Availability", availabilitySchema);
module.exports = Availability;