const express = require('express');
const router = express.Router();
const {
    getLowStockParts,
    createPurchaseRequest,
    getPurchaseRequestById,
    getAllPurchaseRequests
} = require('../controllers/purchaseRequestController');

router.get('/low-stock-parts', getLowStockParts);
router.get('/', getAllPurchaseRequests);
router.get('/:id', getPurchaseRequestById);
router.post('/', createPurchaseRequest);

module.exports = router;