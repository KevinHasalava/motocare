const Inventory = require('../models/inventory');

// Get all items
const getInventory = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add item
const addItem = async (req, res) => {
  try {
    const { partId, name, quantity, price, description, category, unit, lowStockThreshold } = req.body;
    const newItem = new Inventory({ partId, name, quantity, price, description, category, unit, lowStockThreshold });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding item', error: error.message });
  }
};


// Update item
const updateItem = async (req, res) => {
  try {
    const updated = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating item' });
  }
};

// Delete item
const deleteItem = async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item' });
  }
};

module.exports = { getInventory, addItem, updateItem, deleteItem };