// routes/inventoryRoutes.js
const express = require('express');
const router = express.Router();
const {
    getInventoryItems,
    getInventoryItemById,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    generateInventoryReportPdf
} = require('../controllers/inventoryController');
const { validateInventoryData } = require('../middleware/validationMiddleware');

// PDF Report route (must be before :id route)
router.get('/download-report-pdf', generateInventoryReportPdf);

router.get('/', getInventoryItems);
router.get('/:id', getInventoryItemById);
router.post('/', validateInventoryData, createInventoryItem);
router.put('/:id', validateInventoryData, updateInventoryItem);
router.delete('/:id', deleteInventoryItem);

module.exports = router;