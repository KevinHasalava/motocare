const express = require('express');
const router = express.Router();
const { getInventory, addItem, updateItem, deleteItem } = require('../controllers/inventoryController');

// Routes
router.get('/', getInventory);
router.post('/', addItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports = router;
