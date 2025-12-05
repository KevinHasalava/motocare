// routes/supplierRoutes.js
const express = require('express');
const router = express.Router();
const {
    getSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    generateSupplierReportPdf
} = require('../controllers/supplierController');

// PDF Report route (must be before :id route)
router.get('/download-report-pdf', generateSupplierReportPdf);

router.get('/', getSuppliers);
router.get('/:id', getSupplierById);
router.post('/', createSupplier);
router.put('/:id', updateSupplier);
router.delete('/:id', deleteSupplier);

module.exports = router;