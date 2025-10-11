// routes/inventoryRoutes.js
const express = require('express');
const router = express.Router();
const {
    getInventoryItems,
    getInventoryItemById,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
} = require('../controllers/inventoryController');
const { validateInventoryData } = require('../middleware/validationMiddleware');

router.get('/', getInventoryItems);
router.get('/:id', getInventoryItemById);
router.post('/', validateInventoryData, createInventoryItem);
router.put('/:id', validateInventoryData, updateInventoryItem);
router.delete('/:id', deleteInventoryItem);

module.exports = router;