const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  ownerName: {
    type: String,
    required: true
  },
  vehicleNumber: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['Car', 'Three Wheel' , 'Bike', 'Van'],
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
