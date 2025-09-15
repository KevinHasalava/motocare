const Inventory = require('../models/inventory');
const RestockHistory = require('../models/restockHistory');
const asyncHandler = require('express-async-handler'); // Optional, for cleaner error handling

// Get all inventory items
const getAllInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.find().sort({ updatedAt: -1 });
  res.status(200).json(inventory);
});

// Get low stock items
const getLowStock = asyncHandler(async (req, res) => {
  const lowStock = await Inventory.find({ quantity: { $lte: '$lowStockThreshold' } });
  res.status(200).json(lowStock);
});

// Add new part
const addPart = asyncHandler(async (req, res) => {
  const { partId, name, description, quantity, lowStockThreshold, price } = req.body;
  if (!partId || !name || !quantity || !lowStockThreshold || !price) {
    res.status(400);
    throw new Error('Missing required fields');
  }
  const part = await Inventory.create({
    partId,
    name,
    description,
    quantity,
    lowStockThreshold,
    price,
  });
  res.status(201).json(part);
});

// Update part
const updatePart = asyncHandler(async (req, res) => {
  const part = await Inventory.findOne({ partId: req.params.partId });
  if (!part) {
    res.status(404);
    throw new Error('Part not found');
  }
  const updatedPart = await Inventory.findOneAndUpdate(
    { partId: req.params.partId },
    req.body,
    { new: true, runValidators: true }
  );
  res.status(200).json(updatedPart);
});

// Delete part
const deletePart = asyncHandler(async (req, res) => {
  const part = await Inventory.findOne({ partId: req.params.partId });
  if (!part) {
    res.status(404);
    throw new Error('Part not found');
  }
  await Inventory.deleteOne({ partId: req.params.partId });
  res.status(200).json({ message: 'Part deleted' });
});

// Deduct parts (used by workers during booking)
const deductPart = asyncHandler(async (req, res) => {
  const { partId, quantity, bookingId } = req.body;
  if (!partId || !quantity || !bookingId) {
    res.status(400);
    throw new Error('Missing required fields');
  }
  const part = await Inventory.findOne({ partId });
  if (!part) {
    res.status(404);
    throw new Error('Part not found');
  }
  if (part.quantity < quantity) {
    res.status(400);
    throw new Error('Insufficient stock');
  }
  part.quantity -= quantity;
  await part.save();
  res.status(200).json({ message: 'Stock updated', part });
});

// Add restock record
const addRestock = asyncHandler(async (req, res) => {
  const { partId, quantity, supplier } = req.body;
  if (!partId || !quantity) {
    res.status(400);
    throw new Error('Missing required fields');
  }
  const restock = await RestockHistory.create({
    partId,
    quantity,
    supplier,
    orderDate: new Date(),
  });
  // Optionally update inventory quantity if restock is received
  if (req.body.status === 'received') {
    const part = await Inventory.findOne({ partId });
    if (part) {
      part.quantity += quantity;
      await part.save();
    }
  }
  res.status(201).json(restock);
});

// Get restock history
const getRestockHistory = asyncHandler(async (req, res) => {
  const history = await RestockHistory.find().sort({ orderDate: -1 });
  res.status(200).json(history);
});

module.exports = {
  getAllInventory,
  getLowStock,
  addPart,
  updatePart,
  deletePart,
  deductPart,
  addRestock,
  getRestockHistory,
};