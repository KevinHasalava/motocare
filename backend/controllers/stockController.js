const mongoose = require('mongoose');
const Stock = require('../models/stock');
const Inventory = require('../models/inventory');
const { validateInventoryStock, validateSupplier, validatePricing } = require('../utils/inventoryValidationUtils');

// Helper function to find the latest buying and sales price for an inventory item
const getLatestPrices = async (inventoryId, session) => {
    const lastStockIn = await Stock.findOne({
        inventory: inventoryId,
        type: 'IN'
    }).sort({ date: -1 }).session(session).select('buyingPrice salesPrice');

    return {
        buyingPrice: lastStockIn ? lastStockIn.buyingPrice : 0,
        salesPrice: lastStockIn ? lastStockIn.salesPrice : 0,
    };
};

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
        const { inventory, supplier, type, quantity, buyingPrice, salesPrice } = req.body;

        // Validate inventory item exists
        const inv = await Inventory.findById(inventory).session(session);
        if (!inv) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Inventory item not found.' });
        }

        // Validate supplier for stock-in operations
        if (type === 'IN' && supplier) {
            const supplierValidation = await validateSupplier(supplier, session);
            if (!supplierValidation.isValid) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: supplierValidation.message });
            }
        }

        // Validate pricing
        if (type === 'IN') {
            const pricingValidation = validatePricing(buyingPrice, salesPrice, 'stock_in');
            if (!pricingValidation.isValid) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: pricingValidation.message });
            }
        }

        const stockData = { ...req.body };

        if (type === 'IN') {
            // Stock-in operation
            inv.quantity += Number(quantity);
            inv.buyingPrice = buyingPrice;
            inv.salesPrice = salesPrice;

        } else if (type === 'OUT') {
            // Validate sufficient stock for stock-out
            const stockValidation = await validateInventoryStock(inventory, quantity, session);
            if (!stockValidation.isValid) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: stockValidation.message });
            }

            // Get latest prices for stock-out
            const prices = await getLatestPrices(inventory, session);
            stockData.buyingPrice = prices.buyingPrice;
            stockData.salesPrice = prices.salesPrice;

            inv.quantity -= quantity;
        } else {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Invalid stock type. Must be IN or OUT.' });
        }

        const newStockMovement = new Stock(stockData);
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
        } else {
            inv.quantity += oldMovement.quantity;
        }

        // Apply new quantity
        if (type === 'IN') {
            inv.quantity += quantity;
        } else {
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
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid stock movement ID format.' });
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
        } else {
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
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid stock movement ID format.' });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Deduct parts from inventory based on a completed job
// @route   POST /api/stock/deduct
// @access  Public (or update with appropriate auth)
exports.deductParts = async (req, res) => {
    const { jobId, parts } = req.body;
    if (!jobId || !parts || !Array.isArray(parts) || parts.length === 0) {
        return res.status(400).json({ message: 'Invalid input. Please provide a jobId and an array of parts.' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Validate all parts before processing any
        const validationResults = [];
        for (const part of parts) {
            const { partId, qty } = part;

            // Find inventory item by partId
            const inventoryItem = await Inventory.findOne({ partId: partId.toUpperCase() }).session(session);
            if (!inventoryItem) {
                validationResults.push({
                    partId,
                    isValid: false,
                    message: 'Part not found in inventory'
                });
                continue;
            }

            if (inventoryItem.quantity < qty) {
                validationResults.push({
                    partId,
                    isValid: false,
                    message: `Insufficient stock. Available: ${inventoryItem.quantity}, Required: ${qty}`
                });
            } else {
                validationResults.push({
                    partId,
                    isValid: true,
                    item: inventoryItem
                });
            }
        }

        // Check if any validations failed
        const failedValidations = validationResults.filter(result => !result.isValid);
        if (failedValidations.length > 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                message: 'Stock validation failed for some parts.',
                failedParts: failedValidations
            });
        }

        const deductedParts = [];

        // Process all deductions
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const { partId, qty } = part;
            const validationResult = validationResults[i];

            const inventoryItem = validationResult.item;

            inventoryItem.quantity -= qty;
            await inventoryItem.save({ session });

            const prices = await getLatestPrices(inventoryItem._id, session);

            const stockMovement = new Stock({
                inventory: inventoryItem._id,
                partId: inventoryItem.partId,
                quantity: qty,
                type: 'deduction',
                jobId: jobId,
                date: new Date(),
                buyingPrice: prices.buyingPrice,
                salesPrice: prices.salesPrice,
            });

            await stockMovement.save({ session });
            deductedParts.push({ partId, qty });
        }

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message: 'Stock deducted successfully.',
            deductedParts: deductedParts,
            jobId: jobId
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error during stock deduction transaction:', error);
        res.status(500).json({ message: 'Failed to deduct stock due to a server error.' });
    }
};