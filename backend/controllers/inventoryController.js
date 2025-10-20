// controllers/inventoryController.js
const Inventory = require('../models/inventory');

// 💡 NEW IMPORT: PDF Library for inventory report generation
const dayjs = require("dayjs");
const { createPDFWithLetterhead, addPDFFooter, finalizePDF } = require('../utils/pdfUtils');

// Get all inventory items with optional search and sort
exports.getInventoryItems = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { partId: { $regex: search, $options: 'i' } },
                    { category: { $regex: search, $options: 'i' } },
                ],
            };
        }
        const items = await Inventory.find(query).sort({ name: 1 });
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get a single inventory item
exports.getInventoryItemById = async (req, res) => {
    try {
        const item = await Inventory.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Inventory item not found.' });
        }
        res.status(200).json(item);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid inventory item ID format.' });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Create a new inventory item
exports.createInventoryItem = async (req, res) => {
    try {
        const newItem = new Inventory(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Part ID already exists.' });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update an inventory item
exports.updateInventoryItem = async (req, res) => {
    try {
        // Exclude quantity and price fields from direct update
        const { quantity, buyingPrice, ...updateData } = req.body;
        const updatedItem = await Inventory.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true, runValidators: true }
        );
        if (!updatedItem) {
            return res.status(404).json({ message: 'Inventory item not found.' });
        }
        res.status(200).json(updatedItem);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid inventory item ID format.' });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete an inventory item
exports.deleteInventoryItem = async (req, res) => {
    try {
        const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: 'Inventory item not found.' });
        }
        res.status(200).json({ message: 'Inventory item deleted successfully.' });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid inventory item ID format.' });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ------------------- PDF INVENTORY REPORT GENERATION -------------------

/**
 * Generates and streams a PDF document containing the inventory report.
 * GET /api/inventory/download-report-pdf
 */
exports.generateInventoryReportPdf = async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = {};
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { partId: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }

        const items = await Inventory.find(query).sort({ name: 1 });

        if (!items || items.length === 0) {
            return res.status(404).json({ message: "No inventory items found" });
        }

        // --- PDF Setup with Letterhead Template ---
        const doc = createPDFWithLetterhead({
            filename: `InventoryReport_${dayjs().format('YYYYMMDD')}.pdf`,
            res,
            useTemplateBackground: true
        });

        // --- PDF Content Generation ---
        
        // Content starts at Y=160 (set in pdfUtils) - closer to template header
        
        // Report Title Section
        doc.fontSize(20).fillColor('#1a365d').text('INVENTORY STOCK REPORT', { align: 'center' });
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
        doc.text(`Total Inventory Items: ${items.length}`, 60, infoBoxY + 44);
        
        // Report Status - Right side with better alignment
        doc.fontSize(10).fillColor('#28a745');
        doc.text('✓ LIVE INVENTORY STATUS', doc.page.width - 180, infoBoxY + 12);
        doc.fillColor('#17a2b8');
        doc.text('✓ REAL-TIME STOCK DATA', doc.page.width - 180, infoBoxY + 28);
        doc.fillColor('#6c757d');
        doc.text('✓ AUTOMATED REPORT', doc.page.width - 180, infoBoxY + 44);
        
        doc.y = infoBoxY + 80;
        doc.moveDown(0.3);

        // Professional Table Section
        doc.fontSize(14).fillColor('#1a365d').text('INVENTORY DETAILS', 50);
        doc.moveDown(0.3);
        
        // Table Header with professional styling
        const startY = doc.y;
        const colWidths = {
            number: 25,
            partId: 90,
            name: 100,
            category: 65,
            quantity: 35,
            buying: 70,
            sales: 70
        };
        
        // Header background
        doc.rect(50, startY - 2, doc.page.width - 100, 18).fillAndStroke('#1a365d', '#1a365d');
        
        let xPos = 50;
        
        // Header text in white
        doc.fontSize(9).fillColor('#ffffff');
        doc.text('#', xPos + 2, startY + 2, { width: colWidths.number, continued: false });
        xPos += colWidths.number;
        doc.text('PART ID', xPos + 2, startY + 2, { width: colWidths.partId, continued: false });
        xPos += colWidths.partId;
        doc.text('ITEM NAME', xPos + 2, startY + 2, { width: colWidths.name, continued: false });
        xPos += colWidths.name;
        doc.text('CATEGORY', xPos + 2, startY + 2, { width: colWidths.category, continued: false });
        xPos += colWidths.category;
        doc.text('QTY', xPos + 2, startY + 2, { width: colWidths.quantity, continued: false, align: 'center' });
        xPos += colWidths.quantity;
        doc.text('BUYING PRICE', xPos + 2, startY + 2, { width: colWidths.buying, continued: false, align: 'center' });
        xPos += colWidths.buying;
        doc.text('SALES PRICE', xPos + 2, startY + 2, { width: colWidths.sales, continued: false, align: 'center' });
        
        doc.y = startY + 20;
        doc.moveDown(0.2);

        // Table Rows with alternating colors for professional look
        doc.fontSize(9);
        items.forEach((item, index) => {
            const rowY = doc.y;
            
            // Alternating row background colors
            const rowColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
            doc.rect(50, rowY, doc.page.width - 100, 20).fillAndStroke(rowColor, '#e9ecef');
            
            // Check if we need a new page
            if (rowY > doc.page.height - 100) {
                doc.addPage();
                
                // Re-add background to new page - using PNG template
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
            
            xPos = 50;
            
            // Set text color for data rows
            doc.fillColor('#2c3e50');
            
            // Number column
            doc.text(String(index + 1), xPos + 2, rowY + 6, { 
                width: colWidths.number - 4, 
                continued: false,
                align: 'center'
            });
            xPos += colWidths.number;
            
            // Part ID (display full text)
            doc.text(item.partId || 'N/A', xPos + 2, rowY + 6, { 
                width: colWidths.partId - 4, 
                continued: false
            });
            xPos += colWidths.partId;
            
            // Name (truncate if too long)
            const itemName = (item.name || 'N/A').length > 10 ? 
                (item.name || 'N/A').substring(0, 10) + '...' : 
                (item.name || 'N/A');
            doc.text(itemName, xPos + 2, rowY + 6, { 
                width: colWidths.name - 4, 
                continued: false
            });
            xPos += colWidths.name;
            
            // Category (truncate if too long)
            const categoryName = (item.category || 'N/A').length > 7 ? 
                (item.category || 'N/A').substring(0, 7) + '...' : 
                (item.category || 'N/A');
            doc.text(categoryName, xPos + 2, rowY + 6, { 
                width: colWidths.category - 4, 
                continued: false
            });
            xPos += colWidths.category;
            
            // Quantity with stock status color
            const qtyColor = (item.quantity || 0) <= (item.lowStockThreshold || 0) ? '#dc3545' : '#28a745';
            doc.fillColor(qtyColor);
            doc.text(String(item.quantity || 0), xPos + 2, rowY + 6, { 
                width: colWidths.quantity - 4, 
                continued: false,
                align: 'center'
            });
            
            // Reset color for prices
            doc.fillColor('#2c3e50');
            xPos += colWidths.quantity;
            
            // Buying Price
            doc.text(`Rs. ${(item.buyingPrice || 0).toFixed(2)}`, xPos + 2, rowY + 6, { 
                width: colWidths.buying - 4, 
                continued: false,
                align: 'right'
            });
            xPos += colWidths.buying;
            
            // Sales Price
            doc.text(`Rs. ${(item.salesPrice || 0).toFixed(2)}`, xPos + 2, rowY + 6, { 
                width: colWidths.sales - 4, 
                continued: false,
                align: 'right'
            });
            
            // Move to next row position with proper spacing
            doc.y = rowY + 20;
        });

        // Summary Section
        doc.moveDown(1);
        const summaryY = doc.y;
        
        // Calculate summary statistics
        const totalValue = items.reduce((sum, item) => sum + ((item.quantity || 0) * (item.buyingPrice || 0)), 0);
        const lowStockItems = items.filter(item => (item.quantity || 0) <= (item.lowStockThreshold || 0));
        const categories = [...new Set(items.map(item => item.category))].length;
        
        // Summary box
        doc.rect(50, summaryY, doc.page.width - 100, 50).fillAndStroke('#e8f4fd', '#1a365d');
        
        // Summary content
        doc.fillColor('#1a365d').fontSize(12);
        doc.text('INVENTORY SUMMARY', 60, summaryY + 8);
        
        doc.fontSize(10).fillColor('#2c3e50');
        doc.text(`Total Inventory Value: Rs. ${totalValue.toFixed(2)}`, 60, summaryY + 25);
        doc.text(`Low Stock Items: ${lowStockItems.length}`, 250, summaryY + 25);
        doc.text(`Categories: ${categories}`, 400, summaryY + 25);
        
        doc.y = summaryY + 60;
        doc.moveDown(0.5);

        // Footer
        addPDFFooter(doc, 'This is an official MOTOCARE Inventory Report. Please retain this document for your records.');

        // Finalize the PDF and end the stream
        finalizePDF(doc);

    } catch (err) {
        console.error("Error generating inventory report PDF:", err.message);
        // Send a proper error response if anything fails
        res.status(500).json({ message: "Inventory report PDF generation failed due to a server error." });
    }
};