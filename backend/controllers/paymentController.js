const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const Job = require('../models/Job');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const Service = require('../models/Service');
const Inventory = require('../models/inventory');

// Search vehicles by vehicle number (autocomplete)
const searchVehicles = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const vehicles = await Vehicle.find({
            vehicleNumber: { $regex: query, $options: 'i' }
        })
        .populate('owner', 'name email phone')
        .limit(10)
        .sort({ vehicleNumber: 1 });

        res.status(200).json(vehicles);
    } catch (error) {
        console.error('Error searching vehicles:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get job details by vehicle number
const getJobByVehicle = async (req, res) => {
    try {
        const { vehicleNumber } = req.params;

        // Find vehicle
        const vehicle = await Vehicle.findOne({ vehicleNumber })
            .populate('owner', 'name email phone');
        
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Find active job for this vehicle
        const job = await Job.findOne({
            vehicle: vehicle._id,
            status: { $in: ['Booked', 'Ongoing', 'Completed'] }
        })
        .populate('user', 'name email phone')
        .populate('service', 'name description price duration')
        .populate('vehicle', 'vehicleNumber type brand model year ownerName')
        .populate('mechanic', 'name')
        .sort({ createdAt: -1 });

        if (!job) {
            return res.status(404).json({ 
                message: 'No active job found for this vehicle',
                vehicle: vehicle
            });
        }

        res.status(200).json({
            job: job,
            vehicle: vehicle
        });
    } catch (error) {
        console.error('Error fetching job by vehicle:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Search inventory items (autocomplete)
const searchInventoryItems = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const items = await Inventory.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { partId: { $regex: query, $options: 'i' } }
            ],
            quantity: { $gt: 0 } // Only show items in stock
        })
        .limit(10)
        .sort({ name: 1 });

        res.status(200).json(items);
    } catch (error) {
        console.error('Error searching inventory items:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get inventory item by ID
const getInventoryItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        
        const item = await Inventory.findById(itemId);
        
        if (!item) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        res.status(200).json(item);
    } catch (error) {
        console.error('Error fetching inventory item:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Calculate payment totals
const calculatePayment = async (req, res) => {
    try {
        const { jobId, extraItems, discount, discountPercentage } = req.body;

        // Get job details
        const job = await Job.findById(jobId)
            .populate('service', 'price')
            .populate('vehicle')
            .populate('user');

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const serviceAmount = job.service.price;
        let extraItemsTotal = 0;

        // Calculate extra items total
        const calculatedExtraItems = [];
        for (const item of extraItems || []) {
            const inventoryItem = await Inventory.findById(item.inventoryItem);
            if (!inventoryItem) {
                return res.status(404).json({ message: `Inventory item not found: ${item.inventoryItem}` });
            }

            if (inventoryItem.quantity < item.quantity) {
                return res.status(400).json({ 
                    message: `Insufficient stock for ${inventoryItem.name}. Available: ${inventoryItem.quantity}` 
                });
            }

            const totalPrice = item.quantity * inventoryItem.salesPrice;
            extraItemsTotal += totalPrice;

            calculatedExtraItems.push({
                inventoryItem: item.inventoryItem,
                itemName: inventoryItem.name,
                quantity: item.quantity,
                unitPrice: inventoryItem.salesPrice,
                totalPrice: totalPrice
            });
        }

        const subtotal = serviceAmount + extraItemsTotal;
        const discountAmount = discount || (subtotal * (discountPercentage || 0) / 100);
        const totalAmount = subtotal - discountAmount;

        res.status(200).json({
            serviceAmount,
            extraItems: calculatedExtraItems,
            extraItemsTotal,
            subtotal,
            discount: discountAmount,
            discountPercentage: discountPercentage || 0,
            totalAmount,
            job
        });
    } catch (error) {
        console.error('Error calculating payment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create payment and generate invoice
const createPayment = async (req, res) => {
    try {
        console.log('Payment request received:', {
            body: req.body,
            user: req.user
        });
        
        const { 
            jobId, 
            extraItems, 
            discount, 
            discountPercentage, 
            paymentMethod, 
            notes 
        } = req.body;

        // Validate required fields
        if (!jobId) {
            return res.status(400).json({ message: 'Job ID is required' });
        }

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ message: 'Invalid Job ID format' });
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User authentication required' });
        }

        // Check if user exists and has proper role
        const cashierUser = await User.findById(req.user.id);
        if (!cashierUser) {
            return res.status(404).json({ message: 'Cashier user not found' });
        }
        
        console.log('Cashier user:', { id: cashierUser._id, name: cashierUser.name, type: cashierUser.userType });

        // Get job details
        console.log('Fetching job with ID:', jobId);
        const job = await Job.findById(jobId)
            .populate('service')
            .populate('vehicle')
            .populate('user');

        if (!job) {
            console.log('Job not found with ID:', jobId);
            return res.status(404).json({ message: 'Job not found' });
        }

        console.log('Job found:', job.jobId);

        // Check if payment already exists for this job
        const existingPayment = await Payment.findOne({ job: jobId });
        if (existingPayment) {
            return res.status(400).json({ message: 'Payment already exists for this job' });
        }

        const serviceAmount = job.service.price;
        let extraItemsTotal = 0;

        // Process extra items and update inventory
        const processedExtraItems = [];
        console.log('Processing extra items:', extraItems);
        
        if (!Array.isArray(extraItems)) {
            console.log('Extra items is not an array:', typeof extraItems);
        }
        
        for (const item of extraItems || []) {
            // Validate inventory item ID format
            if (!mongoose.Types.ObjectId.isValid(item.inventoryItem)) {
                return res.status(400).json({ message: `Invalid inventory item ID format: ${item.inventoryItem}` });
            }
            
            const inventoryItem = await Inventory.findById(item.inventoryItem);
            if (!inventoryItem) {
                return res.status(404).json({ message: `Inventory item not found: ${item.inventoryItem}` });
            }

            if (inventoryItem.quantity < item.quantity) {
                return res.status(400).json({ 
                    message: `Insufficient stock for ${inventoryItem.name}. Available: ${inventoryItem.quantity}` 
                });
            }

            const totalPrice = item.quantity * inventoryItem.salesPrice;
            extraItemsTotal += totalPrice;

            // Update inventory quantity
            inventoryItem.quantity -= item.quantity;
            await inventoryItem.save();

            // Validate all required fields for extra items
            if (!inventoryItem.name) {
                return res.status(400).json({ message: `Item name is missing for inventory item: ${item.inventoryItem}` });
            }
            
            if (typeof item.quantity !== 'number' || item.quantity < 1) {
                return res.status(400).json({ message: `Invalid quantity for item: ${inventoryItem.name}` });
            }
            
            if (typeof inventoryItem.salesPrice !== 'number' || inventoryItem.salesPrice < 0) {
                return res.status(400).json({ message: `Invalid sales price for item: ${inventoryItem.name}` });
            }

            processedExtraItems.push({
                inventoryItem: item.inventoryItem,
                itemName: String(inventoryItem.name),
                quantity: Number(item.quantity),
                unitPrice: Number(inventoryItem.salesPrice),
                totalPrice: Number(totalPrice)
            });
        }

        const subtotal = serviceAmount + extraItemsTotal;
        const discountAmount = discount || (subtotal * (discountPercentage || 0) / 100);
        const totalAmount = subtotal - discountAmount;

        // Validate required data before creating payment
        if (!job.vehicle || !job.vehicle._id) {
            return res.status(400).json({ message: 'Vehicle information is missing from job' });
        }
        
        if (!job.user || !job.user._id) {
            return res.status(400).json({ message: 'Customer information is missing from job' });
        }
        
        if (!job.service || !job.service._id) {
            return res.status(400).json({ message: 'Service information is missing from job' });
        }
        
        if (typeof serviceAmount !== 'number' || serviceAmount < 0) {
            return res.status(400).json({ message: 'Invalid service amount' });
        }

        // Create payment record
        console.log('Creating payment record with data:', {
            jobId,
            vehicleId: job.vehicle._id,
            customerId: job.user._id,
            serviceId: job.service._id,
            serviceAmount,
            extraItemsCount: processedExtraItems.length,
            subtotal,
            discountAmount,
            totalAmount,
            paymentMethod: paymentMethod || 'Cash',
            cashierId: req.user.id
        });

        const paymentData = {
            job: jobId,
            vehicle: job.vehicle._id,
            customer: job.user._id,
            service: job.service._id,
            serviceAmount: Number(serviceAmount),
            extraItems: processedExtraItems || [],
            subtotal: Number(subtotal),
            discount: Number(discountAmount) || 0,
            discountPercentage: Number(discountPercentage) || 0,
            totalAmount: Number(totalAmount),
            paymentMethod: paymentMethod || 'Cash',
            paymentStatus: 'Paid',
            cashier: req.user.id,
            notes: String(notes || '')
        };

        console.log('Payment data to save:', paymentData);
        const payment = new Payment(paymentData);

        console.log('Saving payment...');
        await payment.save();
        console.log('Payment saved successfully:', payment.invoiceId);

        // Update job status to completed
        job.status = 'Completed';
        await job.save();

        // Populate payment for response
        console.log('Populating payment data...');
        try {
            await payment.populate([
                { 
                    path: 'job', 
                    populate: [
                        { path: 'service' },
                        { path: 'vehicle' },
                        { path: 'user' }
                    ]
                },
                { path: 'vehicle' },
                { path: 'customer', select: 'name email phone' },
                { path: 'service' },
                { path: 'cashier', select: 'name' },
                { path: 'extraItems.inventoryItem' }
            ]);
            console.log('Population completed successfully');
        } catch (populateError) {
            console.error('Error during population:', populateError);
            // Continue without full population if there's an error
        }

        res.status(201).json({
            message: 'Payment created successfully',
            payment
        });
    } catch (error) {
        console.error('Error creating payment:', error);
        console.error('Error stack:', error.stack);
        
        // Handle specific error types
        if (error.name === 'ValidationError') {
            const validationErrors = Object.keys(error.errors).map(key => ({
                field: key,
                message: error.errors[key].message,
                value: error.errors[key].value
            }));
            
            return res.status(400).json({ 
                message: 'Validation error - Please check the following fields', 
                error: error.message,
                validationErrors: validationErrors
            });
        }
        
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                message: 'Invalid ID format', 
                error: error.message 
            });
        }
        
        res.status(500).json({ 
            message: 'Server error occurred while processing payment', 
            error: error.message,
            type: error.name 
        });
    }
};

// Get payment/invoice by ID
const getPayment = async (req, res) => {
    try {
        const { paymentId } = req.params;

        const payment = await Payment.findById(paymentId)
            .populate({
                path: 'job',
                populate: {
                    path: 'service vehicle user',
                    select: 'name email phone vehicleNumber type brand model year ownerName price duration'
                }
            })
            .populate('vehicle')
            .populate('customer', 'name email phone')
            .populate('service')
            .populate('cashier', 'name')
            .populate('extraItems.inventoryItem');

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json(payment);
    } catch (error) {
        console.error('Error fetching payment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get payment by invoice ID
const getPaymentByInvoiceId = async (req, res) => {
    try {
        const { invoiceId } = req.params;

        const payment = await Payment.findOne({ invoiceId })
            .populate({
                path: 'job',
                populate: {
                    path: 'service vehicle user',
                    select: 'name email phone vehicleNumber type brand model year ownerName price duration'
                }
            })
            .populate('vehicle')
            .populate('customer', 'name email phone')
            .populate('service')
            .populate('cashier', 'name')
            .populate('extraItems.inventoryItem');

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json(payment);
    } catch (error) {
        console.error('Error fetching payment by invoice ID:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all payments with pagination
const getAllPayments = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        if (status) {
            query.paymentStatus = status;
        }

        if (search) {
            query.$or = [
                { invoiceId: { $regex: search, $options: 'i' } },
                // Add more search fields as needed
            ];
        }

        const payments = await Payment.find(query)
            .populate('customer', 'name email')
            .populate('vehicle', 'vehicleNumber type brand model')
            .populate('service', 'name price')
            .populate('cashier', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Payment.countDocuments(query);

        res.status(200).json({
            payments,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    searchVehicles,
    getJobByVehicle,
    searchInventoryItems,
    getInventoryItem,
    calculatePayment,
    createPayment,
    getPayment,
    getPaymentByInvoiceId,
    getAllPayments
};