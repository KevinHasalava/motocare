// models/stock.js
const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    inventory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
        required: [true, 'Inventory item reference is required.'],
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
        enum: ['IN', 'OUT'],
        required: [true, 'Stock type (IN or OUT) is required.'],
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required.'],
        min: [1, 'Quantity must be a positive number.'],
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