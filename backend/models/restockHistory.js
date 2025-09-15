const mongoose = require('mongoose');

const restockHistorySchema = new mongoose.Schema({
  partId: {
    type: String, // keep String ID since you’re using custom partId
    ref: 'Inventory',
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  supplier: {
    type: String,
    trim: true,
  },
  orderDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  receivedDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['ordered', 'received', 'cancelled'],
    default: 'ordered',
  },
});

module.exports = mongoose.model('RestockHistory', restockHistorySchema);
