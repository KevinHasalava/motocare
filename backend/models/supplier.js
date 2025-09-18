// models/supplier.js
const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    supplierId: {
        type: String,
        unique: true,
        trim: true,
        uppercase: true,
    },
    name: {
        type: String,
        required: [true, 'Supplier name is required.'],
        trim: true,
    },
    contact: {
        phone: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            // Simple email validation regex
            match: [/\S+@\S+\.\S+/, 'Please use a valid email address.'],
        },
        address: {
            type: String,
            trim: true,
        },
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
supplierSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;