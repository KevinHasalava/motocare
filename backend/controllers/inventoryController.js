// controllers/inventoryController.js
const Inventory = require('../models/inventory'); // Assuming inventory.js is in ../models
const RestockHistory = require('../models/restockHistory'); // Assuming restockHistory.js is in ../models

// --- NEW: Restock Function ---
exports.restockItem = async (req, res) => {
  const { partId } = req.params; // Get partId from URL params
  const { quantity, supplier, orderDate, receivedDate } = req.body;

  // Validate input
  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be a positive number.' });
  }
  if (!partId) {
      return res.status(400).json({ message: 'Part ID is required for restocking.' });
  }

  try {
    // Find the inventory item to ensure it exists
    const inventoryItem = await Inventory.findOne({ partId: partId }); // Use partId for lookup
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found.' });
    }

    // Create a new restock history entry
    const newRestock = new RestockHistory({
      partId: partId, // Link to the inventory item
      quantity: quantity,
      supplier: supplier || '', // Optional
      orderDate: orderDate || Date.now(), // Default to now if not provided
      receivedDate: receivedDate || Date.now(), // Default to now if not provided
      status: 'received', // Assuming it's received when the restock record is made
    });

    await newRestock.save();

    // Note: We are NOT updating the quantity in the Inventory table here directly.
    // The total quantity will be calculated on demand (e.g., in getInventory).

    res.status(201).json({ message: 'Item restocked successfully.', restockEntry: newRestock });

  } catch (error) {
    console.error("Error restocking item:", error);
    res.status(500).json({ message: 'Server error during restocking.' });
  }
};


// --- MODIFIED: Get Inventory with Calculated Quantity ---
exports.getInventory = async (req, res) => {
  try {
    const inventoryItems = await Inventory.find();

    // Fetch all restock histories
    const restockHistories = await RestockHistory.find();

    // Map to store current stock for each partId
    const stockMap = new Map();

    // Populate stockMap from restock histories
    restockHistories.forEach(history => {
      const currentStock = stockMap.get(history.partId) || 0;
      // Only add quantities if status is 'received'
      if (history.status === 'received') {
          stockMap.set(history.partId, currentStock + history.quantity);
      }
    });

    // Enrich inventory items with calculated total quantity and add history link
    const enrichedInventory = inventoryItems.map(item => {
      const calculatedQuantity = stockMap.get(item.partId) || 0;
      return {
        ...item.toObject(), // Convert Mongoose document to plain JS object
        quantity: calculatedQuantity, // Override with calculated quantity
        // You might want to add a link to view restock history for this item
        // e.g., restockHistoryUrl: `/api/inventory/restock-history/${item.partId}`
      };
    });

    res.status(200).json(enrichedInventory);

  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ message: 'Server error fetching inventory.' });
  }
};

// --- MODIFIED: Add New Item ---
// This will add the part details, but initial stock will be 0 until restocked.
exports.addItem = async (req, res) => {
  const { partId, name, description, category, unit, lowStockThreshold, price } = req.body;

  if (!partId || !name || !price || !lowStockThreshold) {
    return res.status(400).json({ message: 'Part ID, Name, Price, and Low Stock Threshold are required.' });
  }

  try {
    // Check if item already exists
    const existingItem = await Inventory.findOne({ partId });
    if (existingItem) {
      return res.status(409).json({ message: 'Item with this Part ID already exists.' });
    }

    // Create new inventory item with initial quantity of 0
    const newItem = new Inventory({
      partId,
      name,
      description: description || '',
      category: category || 'General',
      unit: unit || 'pcs',
      quantity: 0, // Initial quantity is 0, stock is managed by restocks
      lowStockThreshold,
      price,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newItem.save();
    res.status(201).json(newItem);

  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ message: 'Server error adding item.' });
  }
};

// --- MODIFIED: Update Item ---
// This function will only update item details (name, description, price, etc.), NOT quantity.
exports.updateItem = async (req, res) => {
  const { id } = req.params; // ID of the inventory item to update
  const { name, description, category, unit, lowStockThreshold, price } = req.body;

  try {
    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      {
        name,
        description,
        category,
        unit,
        lowStockThreshold,
        price,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Inventory item not found.' });
    }

    res.status(200).json(updatedItem);

  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: 'Server error updating item.' });
  }
};

// --- NEW: Get Restock History for a specific part ---
exports.getRestockHistoryByPart = async (req, res) => {
  const { partId } = req.params;
  if (!partId) {
    return res.status(400).json({ message: 'Part ID is required.' });
  }

  try {
    const histories = await RestockHistory.find({ partId: partId }).sort({ orderDate: -1 }); // Sort by date descending
    res.status(200).json(histories);
  } catch (error) {
    console.error("Error fetching restock history:", error);
    res.status(500).json({ message: 'Server error fetching restock history.' });
  }
};


// --- You might also need a DELETE function for RestockHistory entries if needed for corrections ---
// exports.deleteRestockEntry = async (req, res) => { ... }

// --- And a DELETE function for Inventory items if you want to remove a part entirely ---
// exports.deleteItem = async (req, res) => { ... }