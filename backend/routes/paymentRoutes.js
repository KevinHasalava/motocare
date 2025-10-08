const express = require('express');
const router = express.Router();
const {
    searchVehicles,
    getJobByVehicle,
    searchInventoryItems,
    getInventoryItem,
    calculatePayment,
    createPayment,
    updatePayment,
    deletePayment,
    getPayment,
    getPaymentByInvoiceId,
    getAllPayments,
    getUserPayments,
    uploadPaymentSlip,
    getPaymentsWithSlips,
    verifyPaymentSlip
} = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

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
router.put('/:paymentId', updatePayment);
router.delete('/:paymentId', deletePayment);

// Payment retrieval routes
router.get('/all', getAllPayments);
router.get('/user/my-payments', getUserPayments);
router.get('/invoice/:invoiceId', getPaymentByInvoiceId);
router.get('/:paymentId', getPayment);

// Payment slip upload (with file upload middleware)
router.post('/upload-slip', upload.single('slip'), uploadPaymentSlip);

// Payment slip verification (cashier only)
router.get('/slips/pending', getPaymentsWithSlips);
router.put('/:paymentId/verify-slip', verifyPaymentSlip);

module.exports = router;