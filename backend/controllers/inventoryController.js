// controllers/inventoryController.js
const Inventory = require('../models/inventory');

// Get all inventory items with optional search and sort
exports.getInventoryItems = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { partId: { $regex: search, $options: 'i' } },
                    { category: { $regex: search, $options: 'i' } },
                ],
            };
        }
        const items = await Inventory.find(query).sort({ name: 1 });
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get a single inventory item
exports.getInventoryItemById = async (req, res) => {
    try {
        const item = await Inventory.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Inventory item not found.' });
        }
        res.status(200).json(item);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid inventory item ID format.' });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Create a new inventory item
exports.createInventoryItem = async (req, res) => {
    try {
        const newItem = new Inventory(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Part ID already exists.' });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update an inventory item
exports.updateInventoryItem = async (req, res) => {
    try {
        // Exclude quantity and price fields from direct update
        const { quantity, buyingPrice, ...updateData } = req.body;
        const updatedItem = await Inventory.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true, runValidators: true }
        );
        if (!updatedItem) {
            return res.status(404).json({ message: 'Inventory item not found.' });
        }
        res.status(200).json(updatedItem);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid inventory item ID format.' });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete an inventory item
exports.deleteInventoryItem = async (req, res) => {
    try {
        const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: 'Inventory item not found.' });
        }
        res.status(200).json({ message: 'Inventory item deleted successfully.' });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid inventory item ID format.' });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};