const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  duration: {
    type: Number, // in minutes (e.g. oil change 30, body wash 45)
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;