// routes/inventoryRoutes.js
const express = require('express');
const router = express.Router();
const {
  getInventory,
  addItem,
  updateItem,
  restockItem, // Import the new restock function
  getRestockHistoryByPart // Import function to get history
} = require('../controllers/inventoryController');

// --- Route to get all inventory items (with calculated quantities) ---
router.get('/', getInventory);

// --- Route to add a NEW inventory item (initial quantity will be 0) ---
router.post('/', addItem);

// --- Route to update details of an existing inventory item (e.g., name, price, threshold) ---
// Quantity is NOT updated here.
router.put('/:id', updateItem); // Using _id for the main inventory item

// --- NEW: Route to add stock (restock) for a specific part ---
// We'll use partId here as it's more descriptive for restocking.
// The frontend will need to send the partId in the URL or body.
// Let's assume partId is in the URL params for uniqueness.
router.post('/restock/:partId', restockItem);

// --- NEW: Route to get restock history for a specific part ---
router.get('/restock-history/:partId', getRestockHistoryByPart);


// --- Optional: If you want to delete entire inventory items (not just restock entries) ---
// const { deleteItem } = require('../controllers/inventoryController');
// router.delete('/:id', deleteItem);


module.exports = router;