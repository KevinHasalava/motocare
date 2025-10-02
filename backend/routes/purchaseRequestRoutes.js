const express = require('express');
const router = express.Router();
const {
    getLowStockParts,
    createPurchaseRequest,
} = require('../controllers/purchaseRequestController.js');

// Route to get items that are below their lowStockThreshold
router.get('/low-stock-parts', getLowStockParts);

// Route to create a new request, save it, and send the email
router.post('/', createPurchaseRequest);

module.exports = router;
