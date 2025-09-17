const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  partId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
    default: 'General',  // optional
  },
  unit: {
    type: String,
    trim: true,
    default: 'pcs',  // optional
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  lowStockThreshold: {
    type: Number,
    required: true,
    min: 0,
    default: 5,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

inventorySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Inventory', inventorySchema);