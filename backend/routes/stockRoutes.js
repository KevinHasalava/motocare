// routes/stockRoutes.js
const express = require('express');
const router = express.Router();
const {
    getStockMovements,
    createStockMovement,
    updateStockMovement,
    deleteStockMovement,
} = require('../controllers/stockController');

router.get('/', getStockMovements);
router.post('/', createStockMovement);
router.put('/:id', updateStockMovement);
router.delete('/:id', deleteStockMovement);

module.exports = router;