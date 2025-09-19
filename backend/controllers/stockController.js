// controllers/stockController.js
const mongoose = require('mongoose');
const Stock = require('../models/stock');
const Inventory = require('../models/inventory');

// Get all stock movements
exports.getStockMovements = async (req, res) => {
    try {
        const { inventoryId, supplierId } = req.query;
        let query = {};
        if (inventoryId) {
            query.inventory = inventoryId;
        }
        if (supplierId) {
            query.supplier = supplierId;
        }
        const movements = await Stock.find(query)
            .populate('inventory', 'partId name')
            .populate('supplier', 'name')
            .sort({ date: -1 });
        res.status(200).json(movements);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Create a new stock movement (IN or OUT)
exports.createStockMovement = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { inventory, supplier, type, quantity } = req.body;
        
        const inv = await Inventory.findById(inventory).session(session);
        if (!inv) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Inventory item not found.' });
        }

        if (type === 'IN') {
            if (!supplier) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: 'Supplier is required for a stock-in transaction.' });
            }
            inv.quantity += quantity;
        } else if (type === 'OUT') {
            if (inv.quantity < quantity) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: 'Not enough stock to fulfill this request.' });
            }
            inv.quantity -= quantity;
        } else {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Invalid stock type. Must be IN or OUT.' });
        }
        
        const newStockMovement = new Stock(req.body);
        await newStockMovement.save({ session });
        await inv.save({ session });
        
        await session.commitTransaction();
        session.endSession();
        
        res.status(201).json(newStockMovement);

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update a stock movement and adjust inventory
exports.updateStockMovement = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { quantity, type } = req.body;
        const oldMovement = await Stock.findById(req.params.id).session(session);
        if (!oldMovement) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Stock movement not found.' });
        }

        const inv = await Inventory.findById(oldMovement.inventory).session(session);
        if (!inv) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Referenced inventory item not found.' });
        }

        // Revert old quantity
        if (oldMovement.type === 'IN') {
            inv.quantity -= oldMovement.quantity;
        } else { // 'OUT'
            inv.quantity += oldMovement.quantity;
        }

        // Apply new quantity
        if (type === 'IN') {
            inv.quantity += quantity;
        } else { // 'OUT'
            inv.quantity -= quantity;
        }

        if (inv.quantity < 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Update would result in a negative stock quantity.' });
        }

        const updatedMovement = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, session });
        await inv.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json(updatedMovement);

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete a stock movement and adjust inventory
exports.deleteStockMovement = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const deletedMovement = await Stock.findByIdAndDelete(req.params.id, { session });
        if (!deletedMovement) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Stock movement not found.' });
        }
        
        const inv = await Inventory.findById(deletedMovement.inventory).session(session);
        if (!inv) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Referenced inventory item not found.' });
        }

        if (deletedMovement.type === 'IN') {
            inv.quantity -= deletedMovement.quantity;
        } else { // 'OUT'
            inv.quantity += deletedMovement.quantity;
        }

        if (inv.quantity < 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Deletion would result in a negative stock quantity.' });
        }

        await inv.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Stock movement deleted successfully.' });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Deduct parts from inventory based on a completed job
// @route   POST /api/stock/deduct
// @access  Public (or update with appropriate auth)
exports.deductParts = async (req, res) => {
    // Get the job ID and the array of parts from the request body
    const { jobId, parts } = req.body;

    // Validate the input
    if (!jobId || !parts || !Array.isArray(parts) || parts.length === 0) {
        return res.status(400).json({ message: 'Invalid input. Please provide a jobId and an array of parts.' });
    }

    // Start a Mongoose session for a transaction to ensure data consistency
    // This is crucial to prevent partial deductions if an error occurs mid-way
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const deductedParts = [];

        // Iterate through each part in the request
        for (const part of parts) {
            const { partId, qty } = part;

            // Find the inventory item by its partId
            const inventoryItem = await Inventory.findOne({ partId: partId }).session(session);

            // Check if the part exists
            if (!inventoryItem) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: `Part with ID '${partId}' not found.` });
            }

            // Check if there is enough stock
            if (inventoryItem.quantity < qty) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: `Insufficient stock for part '${partId}'. Available: ${inventoryItem.quantity}, Requested: ${qty}` });
            }

            // Deduct the quantity from the inventory item
            inventoryItem.quantity -= qty;
            await inventoryItem.save({ session });

            // Create a record in the StockMovement collection
            const stockMovement = new Stock({
                inventory: inventoryItem._id, // Use the MongoDB object ID
                partId: inventoryItem.partId,
                quantity: qty,
                type: 'deduction',
                jobId: jobId,
                date: new Date(),
                // updatedBy: req.user._id, // Uncomment this line if you have user authentication
            });

            await stockMovement.save({ session });
            deductedParts.push({ partId, qty });
        }

        // If all operations were successful, commit the transaction
        await session.commitTransaction();
        session.endSession();

        // Return a success response
        res.status(200).json({
            message: 'Stock deducted successfully.',
            deductedParts: deductedParts,
            jobId: jobId
        });

    } catch (error) {
        // If an error occurred, abort the transaction and end the session
        await session.abortTransaction();
        session.endSession();
        console.error('Error during stock deduction transaction:', error);
        res.status(500).json({ message: 'Failed to deduct stock due to a server error.' });
    }
};