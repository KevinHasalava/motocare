// controllers/supplierController.js
const Supplier = require('../models/supplier');

// 💡 NEW IMPORT: PDF Library for supplier report generation
const dayjs = require("dayjs");
const { createPDFWithLetterhead, addPDFFooter, finalizePDF } = require('../utils/pdfUtils');

// Get all suppliers with optional search
exports.getSuppliers = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { supplierId: { $regex: search, $options: 'i' } },
                ],
            };
        }
        const suppliers = await Supplier.find(query).sort({ createdAt: -1 });
        res.status(200).json(suppliers);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get a single supplier
exports.getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found.' });
        }
        res.status(200).json(supplier);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Create a new supplier
exports.createSupplier = async (req, res) => {
    try {
        const newSupplier = new Supplier(req.body);
        const savedSupplier = await newSupplier.save();
        res.status(201).json(savedSupplier);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Supplier ID or name already exists.' });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update a supplier
exports.updateSupplier = async (req, res) => {
    try {
        const updatedSupplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedSupplier) {
            return res.status(404).json({ message: 'Supplier not found.' });
        }
        res.status(200).json(updatedSupplier);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete a supplier
exports.deleteSupplier = async (req, res) => {
    try {
        const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!deletedSupplier) {
            return res.status(404).json({ message: 'Supplier not found.' });
        }
        res.status(200).json({ message: 'Supplier deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ------------------- PDF SUPPLIER REPORT GENERATION -------------------

/**
 * Generates and streams a PDF document containing the supplier report.
 * GET /api/suppliers/download-report-pdf
 */
exports.generateSupplierReportPdf = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { supplierId: { $regex: search, $options: 'i' } }
            ];
        }

        const suppliers = await Supplier.find(query).sort({ name: 1 });

        if (!suppliers || suppliers.length === 0) {
            return res.status(404).json({ message: "No suppliers found" });
        }

        // --- PDF Setup with Letterhead Template ---
        const doc = createPDFWithLetterhead({
            filename: `SupplierReport_${dayjs().format('YYYYMMDD')}.pdf`,
            res,
            useTemplateBackground: true
        });

        // --- PDF Content Generation ---
        
        // Content starts at Y=160 (set in pdfUtils) - closer to template header
        
        // Report Title Section
        doc.fontSize(20).fillColor('#1a365d').text('SUPPLIER DIRECTORY', { align: 'center' });
        doc.moveDown(0.2);
        
        // Decorative line under title
        doc.strokeColor('#1a365d').lineWidth(2);
        doc.moveTo(150, doc.y).lineTo(doc.page.width - 150, doc.y).stroke();
        doc.moveDown(0.4);
        
        // Report Information Box
        const infoBoxY = doc.y;
        doc.rect(50, infoBoxY, doc.page.width - 100, 70).fillAndStroke('#f8f9fa', '#e9ecef');
        
        // Report Details inside box - Left side
        doc.fillColor('#2c3e50').fontSize(11);
        doc.text(`Report Generated: ${dayjs().format('dddd, MMMM DD, YYYY')}`, 60, infoBoxY + 12);
        doc.text(`Generation Time: ${dayjs().format('hh:mm A')}`, 60, infoBoxY + 28);
        doc.text(`Total Active Suppliers: ${suppliers.length}`, 60, infoBoxY + 44);
        
        // Report Status - Right side with better alignment
        doc.fontSize(10).fillColor('#28a745');
        doc.text('✓ ACTIVE SUPPLIERS', doc.page.width - 180, infoBoxY + 12);
        doc.fillColor('#17a2b8');
        doc.text('✓ VERIFIED CONTACTS', doc.page.width - 180, infoBoxY + 28);
        doc.fillColor('#6c757d');
        doc.text('✓ OFFICIAL DIRECTORY', doc.page.width - 180, infoBoxY + 44);
        
        doc.y = infoBoxY + 80;
        doc.moveDown(0.3);

        // Professional Table Section
        doc.fontSize(14).fillColor('#1a365d').text('SUPPLIER DETAILS', 50);
        doc.moveDown(0.3);
        
        // Table Header with professional styling
        const startY = doc.y;
        const colWidths = {
            number: 25,
            supplierId: 85,
            name: 110,
            phone: 80,
            email: 120,
            address: 100
        };
        
        // Header background
        doc.rect(50, startY - 2, doc.page.width - 100, 18).fillAndStroke('#1a365d', '#1a365d');
        
        let xPos = 50;
        
        // Header text in white
        doc.fontSize(9).fillColor('#ffffff');
        doc.text('#', xPos + 2, startY + 2, { width: colWidths.number, continued: false });
        xPos += colWidths.number;
        doc.text('SUPPLIER ID', xPos + 2, startY + 2, { width: colWidths.supplierId, continued: false });
        xPos += colWidths.supplierId;
        doc.text('NAME', xPos + 2, startY + 2, { width: colWidths.name, continued: false });
        xPos += colWidths.name;
        doc.text('PHONE', xPos + 2, startY + 2, { width: colWidths.phone, continued: false });
        xPos += colWidths.phone;
        doc.text('EMAIL', xPos + 2, startY + 2, { width: colWidths.email, continued: false });
        xPos += colWidths.email;
        doc.text('ADDRESS', xPos + 2, startY + 2, { width: colWidths.address, continued: false });
        
        doc.y = startY + 20;
        doc.moveDown(0.2);

        // Table Rows with alternating colors for professional look
        doc.fontSize(9);
        suppliers.forEach((supplier, index) => {
            // Check if we need a new page BEFORE drawing anything
            if (doc.y > doc.page.height - 100) {
                doc.addPage();
                
                // Re-add background to new page
                const path = require('path');
                const fs = require('fs');
                const letterheadPngPath = path.join(__dirname, '../assets/pdftemp.png');
                
                if (fs.existsSync(letterheadPngPath)) {
                    try {
                        doc.image(letterheadPngPath, 0, 0, {
                            width: doc.page.width,
                            height: doc.page.height
                        });
                    } catch (error) {
                        console.error('Error adding template to new page:', error.message);
                    }
                    doc.x = 50;
                    doc.y = 160;
                }
            }
            
            const rowY = doc.y;
            
            // Alternating row background colors
            const rowColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
            doc.rect(50, rowY, doc.page.width - 100, 20).fillAndStroke(rowColor, '#e9ecef');
            
            let xPos = 50;
            
            // Set text color for data rows
            doc.fillColor('#2c3e50');
            
            // Number column
            doc.text(String(index + 1), xPos + 2, rowY + 6, { 
                width: colWidths.number - 4, 
                continued: false,
                lineBreak: false,
                align: 'center'
            });
            xPos += colWidths.number;
            
            // Supplier ID
            doc.text(supplier.supplierId || 'N/A', xPos + 2, rowY + 6, { 
                width: colWidths.supplierId - 4, 
                continued: false,
                lineBreak: false
            });
            xPos += colWidths.supplierId;
            
            // Name
            doc.text(supplier.name || 'N/A', xPos + 2, rowY + 6, { 
                width: colWidths.name - 4, 
                continued: false,
                lineBreak: false
            });
            xPos += colWidths.name;
            
            // Phone
            doc.text(supplier.contact?.phone || 'N/A', xPos + 2, rowY + 6, { 
                width: colWidths.phone - 4, 
                continued: false,
                lineBreak: false
            });
            xPos += colWidths.phone;
            
            // Email
            doc.text(supplier.contact?.email || 'N/A', xPos + 2, rowY + 6, { 
                width: colWidths.email - 4, 
                continued: false,
                lineBreak: false
            });
            xPos += colWidths.email;
            
            // Address
            doc.text(supplier.contact?.address || 'N/A', xPos + 2, rowY + 6, { 
                width: colWidths.address - 4, 
                continued: false,
                lineBreak: false
            });
            
            // Move to next row position with proper spacing
            doc.y = rowY + 20;
        });

        // Summary Section
        doc.moveDown(1);
        const summaryY = doc.y;
        
        // Calculate summary statistics
        const suppliersWithEmail = suppliers.filter(s => s.contact?.email).length;
        const suppliersWithPhone = suppliers.filter(s => s.contact?.phone).length;
        const suppliersWithAddress = suppliers.filter(s => s.contact?.address).length;
        
        // Summary box
        doc.rect(50, summaryY, doc.page.width - 100, 50).fillAndStroke('#e8f4fd', '#1a365d');
        
        // Summary content
        doc.fillColor('#1a365d').fontSize(12);
        doc.text('SUPPLIER DIRECTORY SUMMARY', 60, summaryY + 8);
        
        doc.fontSize(9).fillColor('#2c3e50');
        doc.text(`Total Suppliers: ${suppliers.length}`, 60, summaryY + 25);
        doc.text(`With Email: ${suppliersWithEmail}`, 220, summaryY + 25);
        doc.text(`With Phone: ${suppliersWithPhone}`, 360, summaryY + 25);
        doc.text(`With Address: ${suppliersWithAddress}`, 480, summaryY + 25);
        
        doc.y = summaryY + 60;
        doc.moveDown(0.5);

        // Footer
        addPDFFooter(doc, 'This is an official Supplier Report. Please retain this document for your records.');

        // Finalize the PDF and end the stream
        finalizePDF(doc);

    } catch (err) {
        console.error("Error generating supplier report PDF:", err.message);
        // Send a proper error response if anything fails
        res.status(500).json({ message: "Supplier report PDF generation failed due to a server error." });
    }
};