const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    invoiceId: {
        type: String,
        unique: true
        // Not required here since it's auto-generated in pre-save hook
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    serviceAmount: {
        type: Number,
        required: true,
        min: 0
    },
    extraItems: [{
        inventoryItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Inventory',
            required: true
        },
        itemName: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        unitPrice: {
            type: Number,
            required: true,
            min: 0
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0
    },
    discountPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Card', 'Bank Transfer', 'Online', 'Other'],
        default: 'Cash'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Refunded'],
        default: 'Pending'
    },
    cashier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notes: {
        type: String,
        default: ''
    },
    paymentSlip: {
        url: {
            type: String
        },
        uploadedAt: {
            type: Date
        },
        notes: {
            type: String,
            default: ''
        },
        status: {
            type: String,
            enum: ['Under Review', 'Approved', 'Rejected'],
            default: 'Under Review'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Generate unique invoice ID before saving
paymentSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            // Generate invoice ID in format: INV-YYYYMMDD-XXXX
            const today = new Date();
            const dateStr = today.getFullYear() + 
                           String(today.getMonth() + 1).padStart(2, '0') + 
                           String(today.getDate()).padStart(2, '0');
            
            // Count today's invoices
            const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const todayEnd = new Date(todayStart);
            todayEnd.setDate(todayEnd.getDate() + 1);
            
            const todayCount = await mongoose.models.Payment.countDocuments({
                createdAt: {
                    $gte: todayStart,
                    $lt: todayEnd
                }
            });
            
            const invoiceNumber = String(todayCount + 1).padStart(4, '0');
            this.invoiceId = `INV-${dateStr}-${invoiceNumber}`;
            
        } catch (error) {
            return next(error);
        }
    }
    
    // Update timestamp
    this.updatedAt = new Date();
    next();
});

// Calculate totals before saving (only if not already set)
paymentSchema.pre('save', function(next) {
    // Only recalculate if subtotal is not set or is zero
    if (!this.subtotal || this.subtotal === 0) {
        const extraItemsTotal = this.extraItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
        this.subtotal = (this.serviceAmount || 0) + extraItemsTotal;
    }
    
    // Only recalculate total if not already set
    if (!this.totalAmount || this.totalAmount === 0) {
        this.totalAmount = (this.subtotal || 0) - (this.discount || 0);
    }
    
    next();
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;