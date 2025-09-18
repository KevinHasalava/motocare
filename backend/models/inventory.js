// models/inventory.js
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    partId: {
        type: String,
        required: [true, 'Part ID is required.'],
        unique: true,
        trim: true,
        uppercase: true,
    },
    name: {
        type: String,
        required: [true, 'Item name is required.'],
        trim: true,
    },
    category: {
        type: String,
        trim: true,
        default: 'General',
    },
    lowStockThreshold: {
        type: Number,
        default: 0,
        min: [0, 'Low stock threshold cannot be negative.'],
    },
    quantity: {
        type: Number,
        default: 0,
        min: [0, 'Quantity cannot be negative.'],
    },
    price: {
        type: Number,
        default: 0,
        min: [0, 'Price cannot be negative.'],
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

// Update the updatedAt field on every save
inventorySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;