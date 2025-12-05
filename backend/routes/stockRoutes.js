// routes/stockRoutes.js
const express = require('express');
const router = express.Router();
const {
    getStockMovements,
    createStockMovement,
    updateStockMovement,
    deleteStockMovement,
    deductParts,
    generateStockReportPdf
} = require('../controllers/stockController');
const { validateStockMovementData, validateStockDeductionData } = require('../middleware/validationMiddleware');

// PDF Report route (must be before :id route)
router.get('/download-report-pdf', generateStockReportPdf);

// Existing routes
router.get('/', getStockMovements);
router.post('/', validateStockMovementData, createStockMovement);
router.put('/:id', validateStockMovementData, updateStockMovement);
router.delete('/:id', deleteStockMovement);

// New route for auto-deducting parts from a job
router.post('/deduct', validateStockDeductionData, deductParts);

module.exports = router;