const express = require('express');
const router = express.Router();
const {
    searchVehicles,
    getJobByVehicle,
    searchInventoryItems,
    getInventoryItem,
    calculatePayment,
    createPayment,
    getPayment,
    getPaymentByInvoiceId,
    getAllPayments
} = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Vehicle search routes
router.get('/vehicles/search', searchVehicles);
router.get('/vehicles/:vehicleNumber/job', getJobByVehicle);

// Inventory search routes
router.get('/inventory/search', searchInventoryItems);
router.get('/inventory/:itemId', getInventoryItem);

// Payment calculation and processing
router.post('/calculate', calculatePayment);
router.post('/create', createPayment);

// Payment retrieval routes
router.get('/all', getAllPayments);
router.get('/invoice/:invoiceId', getPaymentByInvoiceId);
router.get('/:paymentId', getPayment);

module.exports = router;