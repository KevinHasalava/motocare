const mongoose = require('mongoose');

const purchaseRequestSchema = new mongoose.Schema({
    // Link to the Supplier who will receive the order
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: [true, 'Supplier is required for the request.'],
    },
    // Array of parts included in this request
    requestedItems: [
        {
            inventoryItem: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Inventory',
                required: true,
            },
            partName: {
                type: String, // Denormalized name for easy history viewing
                required: true,
            },
            currentStock: {
                type: Number,
                required: true,
                min: 0,
            },
            quantityNeeded: {
                type: Number,
                required: [true, 'Order quantity is required.'],
                min: [1, 'Order quantity must be at least 1.'],
            },
        },
    ],
    requestDate: {
        type: Date,
        default: Date.now,
    },
    notes: {
        type: String,
        trim: true,
        default: '',
    },
    status: {
        type: String,
        enum: ['Pending', 'Sent', 'Received', 'Cancelled'],
        default: 'Pending',
    },
    sentBy: {
        type: String, // You might want to link this to a User ID in a full system
        default: 'System User',
    }
});

const PurchaseRequest = mongoose.model('PurchaseRequest', purchaseRequestSchema);

module.exports = PurchaseRequest;
