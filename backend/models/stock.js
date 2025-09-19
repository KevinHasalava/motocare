// models/stock.js
const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    inventory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
        required: [true, 'Inventory item reference is required.'],
    },
    partId: {
        type: String,
        required: true,
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: [
            function() { return this.type === 'IN'; }, 
            'Supplier is required for stock type IN.'
        ],
    },
    date: {
        type: Date,
        default: Date.now,
    },
    type: {
        type: String,
        // The new "deduction" type is added here
        enum: ['IN', 'OUT', 'deduction'],
        required: [true, 'Stock type (IN, OUT, or deduction) is required.'],
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required.'],
        min: [1, 'Quantity must be a positive number.'],
    },
    jobId: {
        type: String,
        trim: true,
        required: [
            function() { return this.type === 'deduction'; },
            'Job ID is required for a deduction type.'
        ],
    },
    buyingPrice: {
        type: Number,
        default: 0,
    },
    salesPrice: {
        type: Number,
        default: 0,
    },
    notes: {
        type: String,
        trim: true,
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
stockSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;