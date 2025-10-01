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

// Existing routes
router.get('/', getStockMovements);
router.post('/', createStockMovement);
router.put('/:id', updateStockMovement);
router.delete('/:id', deleteStockMovement);

// New route for auto-deducting parts from a job
router.post('/deduct', deductParts); 

module.exports = router;