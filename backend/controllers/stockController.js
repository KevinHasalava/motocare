const mongoose = require('mongoose');
const Stock = require('../models/stock');
const Inventory = require('../models/inventory');
const { validateInventoryStock, validateSupplier, validatePricing } = require('../utils/inventoryValidationUtils');

// 💡 NEW IMPORT: PDF Library for stock report generation
const dayjs = require("dayjs");
const { createPDFWithLetterhead, addPDFFooter, finalizePDF } = require('../utils/pdfUtils');

// Helper function to find the latest buying and sales price for an inventory item
const getLatestPrices = async (inventoryId, session) => {
    const lastStockIn = await Stock.findOne({
        inventory: inventoryId,
        type: 'IN'
    }).sort({ date: -1 }).session(session).select('buyingPrice salesPrice');

    return {
        buyingPrice: lastStockIn ? lastStockIn.buyingPrice : 0,
        salesPrice: lastStockIn ? lastStockIn.salesPrice : 0,
    };
};

// Get all stock movements
exports.getStockMovements = async (req, res) => {
    try {
        const { inventoryId, supplierId } = req.query;
        let query = {};
        if (inventoryId) {
            query.inventory = inventoryId;
        }
        if (supplierId) {
            query.supplier = supplierId;
        }
        const movements = await Stock.find(query)
            .populate('inventory', 'partId name')
            .populate('supplier', 'name')
            .sort({ date: -1 });
        res.status(200).json(movements);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Create a new stock movement (IN or OUT)
exports.createStockMovement = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { inventory, supplier, type, quantity, buyingPrice, salesPrice } = req.body;

        // Validate inventory item exists
        const inv = await Inventory.findById(inventory).session(session);
        if (!inv) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Inventory item not found.' });
        }

        // Validate supplier for stock-in operations
        if (type === 'IN' && supplier) {
            const supplierValidation = await validateSupplier(supplier, session);
            if (!supplierValidation.isValid) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: supplierValidation.message });
            }
        }

        // Validate pricing
        if (type === 'IN') {
            const pricingValidation = validatePricing(buyingPrice, salesPrice, 'stock_in');
            if (!pricingValidation.isValid) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: pricingValidation.message });
            }
        }

        const stockData = { ...req.body };

        if (type === 'IN') {
            // Stock-in operation
            inv.quantity += Number(quantity);
            inv.buyingPrice = buyingPrice;
            inv.salesPrice = salesPrice;

        } else if (type === 'OUT') {
            // Validate sufficient stock for stock-out
            const stockValidation = await validateInventoryStock(inventory, quantity, session);
            if (!stockValidation.isValid) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: stockValidation.message });
            }

            // Get latest prices for stock-out
            const prices = await getLatestPrices(inventory, session);
            stockData.buyingPrice = prices.buyingPrice;
            stockData.salesPrice = prices.salesPrice;

            inv.quantity -= quantity;
        } else {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Invalid stock type. Must be IN or OUT.' });
        }

        const newStockMovement = new Stock(stockData);
        await newStockMovement.save({ session });
        await inv.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json(newStockMovement);

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update a stock movement and adjust inventory
exports.updateStockMovement = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { quantity, type } = req.body;
        const oldMovement = await Stock.findById(req.params.id).session(session);
        if (!oldMovement) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Stock movement not found.' });
        }

        const inv = await Inventory.findById(oldMovement.inventory).session(session);
        if (!inv) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Referenced inventory item not found.' });
        }

        // Revert old quantity
        if (oldMovement.type === 'IN') {
            inv.quantity -= oldMovement.quantity;
        } else {
            inv.quantity += oldMovement.quantity;
        }

        // Apply new quantity
        if (type === 'IN') {
            inv.quantity += quantity;
        } else {
            inv.quantity -= quantity;
        }

        if (inv.quantity < 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Update would result in a negative stock quantity.' });
        }

        const updatedMovement = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, session });
        await inv.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json(updatedMovement);

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid stock movement ID format.' });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete a stock movement and adjust inventory
exports.deleteStockMovement = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const deletedMovement = await Stock.findByIdAndDelete(req.params.id, { session });
        if (!deletedMovement) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Stock movement not found.' });
        }
        
        const inv = await Inventory.findById(deletedMovement.inventory).session(session);
        if (!inv) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Referenced inventory item not found.' });
        }

        if (deletedMovement.type === 'IN') {
            inv.quantity -= deletedMovement.quantity;
        } else {
            inv.quantity += deletedMovement.quantity;
        }

        if (inv.quantity < 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Deletion would result in a negative stock quantity.' });
        }

        await inv.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Stock movement deleted successfully.' });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid stock movement ID format.' });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Deduct parts from inventory based on a completed job
// @route   POST /api/stock/deduct
// @access  Public (or update with appropriate auth)
exports.deductParts = async (req, res) => {
    const { jobId, parts } = req.body;
    if (!jobId || !parts || !Array.isArray(parts) || parts.length === 0) {
        return res.status(400).json({ message: 'Invalid input. Please provide a jobId and an array of parts.' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Validate all parts before processing any
        const validationResults = [];
        for (const part of parts) {
            const { partId, qty } = part;

            // Find inventory item by partId
            const inventoryItem = await Inventory.findOne({ partId: partId.toUpperCase() }).session(session);
            if (!inventoryItem) {
                validationResults.push({
                    partId,
                    isValid: false,
                    message: 'Part not found in inventory'
                });
                continue;
            }

            if (inventoryItem.quantity < qty) {
                validationResults.push({
                    partId,
                    isValid: false,
                    message: `Insufficient stock. Available: ${inventoryItem.quantity}, Required: ${qty}`
                });
            } else {
                validationResults.push({
                    partId,
                    isValid: true,
                    item: inventoryItem
                });
            }
        }

        // Check if any validations failed
        const failedValidations = validationResults.filter(result => !result.isValid);
        if (failedValidations.length > 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                message: 'Stock validation failed for some parts.',
                failedParts: failedValidations
            });
        }

        const deductedParts = [];

        // Process all deductions
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const { partId, qty } = part;
            const validationResult = validationResults[i];

            const inventoryItem = validationResult.item;

            inventoryItem.quantity -= qty;
            await inventoryItem.save({ session });

            const prices = await getLatestPrices(inventoryItem._id, session);

            const stockMovement = new Stock({
                inventory: inventoryItem._id,
                partId: inventoryItem.partId,
                quantity: qty,
                type: 'deduction',
                jobId: jobId,
                date: new Date(),
                buyingPrice: prices.buyingPrice,
                salesPrice: prices.salesPrice,
            });

            await stockMovement.save({ session });
            deductedParts.push({ partId, qty });
        }

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message: 'Stock deducted successfully.',
            deductedParts: deductedParts,
            jobId: jobId
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error during stock deduction transaction:', error);
        res.status(500).json({ message: 'Failed to deduct stock due to a server error.' });
    }
};

// ------------------- PDF STOCK REPORT GENERATION -------------------

/**
 * Generates and streams a PDF document containing the stock movements report.
 * GET /api/stock/download-report-pdf
 */
exports.generateStockReportPdf = async (req, res) => {
    try {
        const { inventoryId, supplierId, type, startDate, endDate } = req.query;
        let query = {};
        
        if (inventoryId) {
            query.inventory = inventoryId;
        }
        
        if (supplierId) {
            query.supplier = supplierId;
        }
        
        if (type) {
            query.type = type;
        }
        
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const movements = await Stock.find(query)
            .populate('inventory', 'partId name')
            .populate('supplier', 'name')
            .sort({ date: -1 });

        if (!movements || movements.length === 0) {
            return res.status(404).json({ message: "No stock movements found" });
        }

        // --- PDF Setup with Letterhead Template ---
        const doc = createPDFWithLetterhead({
            filename: `StockMovementReport_${dayjs().format('YYYYMMDD')}.pdf`,
            res,
            useTemplateBackground: true
        });

        // --- PDF Content Generation ---
        
        // Content starts at Y=160 (set in pdfUtils) - closer to template header
        
        // Report Title Section
        doc.fontSize(20).fillColor('#1a365d').text('STOCK MOVEMENT REPORT', { align: 'center' });
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
        doc.text(`Total Stock Movements: ${movements.length}`, 60, infoBoxY + 44);
        
        // Report Status - Right side with better alignment
        doc.fontSize(10).fillColor('#28a745');
        doc.text('✓ LIVE STOCK TRACKING', doc.page.width - 180, infoBoxY + 12);
        doc.fillColor('#17a2b8');
        doc.text('✓ REAL-TIME MOVEMENTS', doc.page.width - 180, infoBoxY + 28);
        doc.fillColor('#6c757d');
        doc.text('✓ AUTOMATED REPORT', doc.page.width - 180, infoBoxY + 44);
        
        doc.y = infoBoxY + 80;
        doc.moveDown(0.3);

        // Professional Table Section
        doc.fontSize(14).fillColor('#1a365d').text('STOCK MOVEMENT DETAILS', 50);
        doc.moveDown(0.3);
        
        // Table Header with professional styling
        const startY = doc.y;
        const colWidths = {
            number: 25,
            date: 50,
            partId: 90,
            name: 70,
            type: 35,
            quantity: 30,
            supplier: 100,
            price: 60
        };
        
        // Header background
        doc.rect(50, startY - 2, doc.page.width - 100, 18).fillAndStroke('#1a365d', '#1a365d');
        
        let xPos = 50;
        
        // Header text in white
        doc.fontSize(9).fillColor('#ffffff');
        doc.text('#', xPos + 2, startY + 2, { width: colWidths.number, continued: false });
        xPos += colWidths.number;
        doc.text('DATE', xPos + 2, startY + 2, { width: colWidths.date, continued: false });
        xPos += colWidths.date;
        doc.text('PART ID', xPos + 2, startY + 2, { width: colWidths.partId, continued: false });
        xPos += colWidths.partId;
        doc.text('ITEM NAME', xPos + 2, startY + 2, { width: colWidths.name, continued: false });
        xPos += colWidths.name;
        doc.text('TYPE', xPos + 2, startY + 2, { width: colWidths.type, continued: false });
        xPos += colWidths.type;
        doc.text('QTY', xPos + 2, startY + 2, { width: colWidths.quantity, continued: false, align: 'center' });
        xPos += colWidths.quantity;
        doc.text('SUPPLIER', xPos + 2, startY + 2, { width: colWidths.supplier, continued: false });
        xPos += colWidths.supplier;
        doc.text('PRICE', xPos + 2, startY + 2, { width: colWidths.price, continued: false, align: 'center' });
        
        doc.y = startY + 20;
        doc.moveDown(0.2);

        // Table Rows with alternating colors for professional look
        doc.fontSize(9);
        movements.forEach((movement, index) => {
            // Check if we need a new page BEFORE drawing anything
            if (doc.y > doc.page.height - 100) {
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
            
            // Date
            doc.text(dayjs(movement.date).format('MM-DD'), xPos + 2, rowY + 6, { 
                width: colWidths.date - 4, 
                continued: false,
                lineBreak: false
            });
            xPos += colWidths.date;
            
            // Part ID (display full text)
            doc.text(movement.inventory?.partId || 'N/A', xPos + 2, rowY + 6, { 
                width: colWidths.partId - 4, 
                continued: false,
                lineBreak: false
            });
            xPos += colWidths.partId;
            
            // Name (truncate if too long)
            const itemName = (movement.inventory?.name || 'N/A').length > 6 ? 
                (movement.inventory?.name || 'N/A').substring(0, 6) + '...' : 
                (movement.inventory?.name || 'N/A');
            doc.text(itemName, xPos + 2, rowY + 6, { 
                width: colWidths.name - 4, 
                continued: false,
                lineBreak: false
            });
            xPos += colWidths.name;
            
            // Type with color coding - handle IN, OUT, and deduction types
            const movementType = movement.type === 'IN' || movement.type === 'in' ? 'IN' : 
                                 movement.type === 'OUT' || movement.type === 'out' || movement.type === 'deduction' ? 'OUT' : 
                                 'N/A';
            const typeColor = movementType === 'IN' ? '#28a745' : '#dc3545';
            doc.fillColor(typeColor);
            doc.text(movementType, xPos + 2, rowY + 6, { 
                width: colWidths.type - 4, 
                continued: false,
                lineBreak: false,
                align: 'center'
            });
            
            // Reset color
            doc.fillColor('#2c3e50');
            xPos += colWidths.type;
            
            // Quantity
            doc.text(String(movement.quantity || 0), xPos + 2, rowY + 6, { 
                width: colWidths.quantity - 4, 
                continued: false,
                lineBreak: false,
                align: 'center'
            });
            xPos += colWidths.quantity;
            
            // Supplier (display full name)
            doc.text(movement.supplier?.name || 'N/A', xPos + 2, rowY + 6, { 
                width: colWidths.supplier - 4, 
                continued: false,
                lineBreak: false
            });
            xPos += colWidths.supplier;
            
            // Price (use buyingPrice from stock model)
            const price = movement.buyingPrice || movement.salesPrice || 0;
            doc.text(`Rs.${price.toFixed(2)}`, xPos + 2, rowY + 6, { 
                width: colWidths.price - 4, 
                continued: false,
                lineBreak: false,
                align: 'right'
            });
            
            // Move to next row position with proper spacing
            doc.y = rowY + 20;
        });

        // Summary Section
        doc.moveDown(1);
        const summaryY = doc.y;
        
        // Calculate summary statistics
        const inMovements = movements.filter(m => m.type === 'IN');
        const outMovements = movements.filter(m => m.type === 'OUT' || m.type === 'deduction');
        const totalInQuantity = inMovements.reduce((sum, m) => sum + (m.quantity || 0), 0);
        const totalOutQuantity = outMovements.reduce((sum, m) => sum + (m.quantity || 0), 0);
        const totalInValue = inMovements.reduce((sum, m) => sum + ((m.quantity || 0) * (m.buyingPrice || m.salesPrice || 0)), 0);
        const totalOutValue = outMovements.reduce((sum, m) => sum + ((m.quantity || 0) * (m.buyingPrice || m.salesPrice || 0)), 0);
        const uniqueSuppliers = [...new Set(movements.filter(m => m.supplier).map(m => m.supplier.name))].length;
        
        // Summary box
        doc.rect(50, summaryY, doc.page.width - 100, 50).fillAndStroke('#e8f4fd', '#1a365d');
        
        // Summary content
        doc.fillColor('#1a365d').fontSize(12);
        doc.text('STOCK MOVEMENT SUMMARY', 60, summaryY + 8);
        
        doc.fontSize(9).fillColor('#2c3e50');
        doc.text(`Stock In: ${totalInQuantity} items (Rs.${totalInValue.toFixed(2)})`, 60, summaryY + 25);
        doc.text(`Stock Out: ${totalOutQuantity} items (Rs.${totalOutValue.toFixed(2)})`, 280, summaryY + 25);
        doc.text(`Suppliers: ${uniqueSuppliers}`, 480, summaryY + 25);
        
        doc.y = summaryY + 60;
        doc.moveDown(0.5);

        // Footer
        addPDFFooter(doc, 'This is an official Stock Movement Report. Please retain this document for your records.');

// ... (rest of the code remains the same)
        finalizePDF(doc);

    } catch (err) {
        console.error("Error generating stock report PDF:", err.message);
        // Send a proper error response if anything fails
        res.status(500).json({ message: "Stock report PDF generation failed due to a server error." });
    }
};