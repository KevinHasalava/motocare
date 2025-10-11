// routes/stockRoutes.js
const express = require('express');
const router = express.Router();
const {
    getStockMovements,
    createStockMovement,
    updateStockMovement,
    deleteStockMovement,
    deductParts // Add this to import the new function
} = require('../controllers/stockController');
const { validateStockMovementData, validateStockDeductionData } = require('../middleware/validationMiddleware');

// Existing routes
router.get('/', getStockMovements);
router.post('/', validateStockMovementData, createStockMovement);
router.put('/:id', validateStockMovementData, updateStockMovement);
router.delete('/:id', deleteStockMovement);

// New route for auto-deducting parts from a job
router.post('/deduct', validateStockDeductionData, deductParts);

module.exports = router;