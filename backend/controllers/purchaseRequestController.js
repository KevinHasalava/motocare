const Inventory = require('../models/inventory');
const Supplier = require('../models/supplier');
const PurchaseRequest = require('../models/PurchaseRequest');
// NOTE: Make sure you have the correct path to your email service utility
const { sendLowStockRequestEmail } = require('../utils/emailService'); 
const mongoose = require('mongoose');

// Helper function to safely fetch inventory details
const fetchInventoryDetails = async (inventoryIds) => {
    return Inventory.find({ _id: { $in: inventoryIds } })
        .select('name quantity lowStockThreshold');
};

// 1. Get all low stock inventory items
exports.getLowStockParts = async (req, res) => {
    try {
        // Use Aggregation Pipeline to find items where quantity <= lowStockThreshold
        const lowStockItems = await Inventory.aggregate([
            {
                $match: {
                    $expr: {
                        $lte: ["$quantity", "$lowStockThreshold"] 
                    }
                }
            },
            {
                // Project necessary fields for the frontend
                $project: {
                    _id: 1,
                    name: 1,
                    quantity: 1,
                    lowStockThreshold: 1,
                    partId: 1
                }
            }
        ]);

        res.status(200).json(lowStockItems);
    } catch (err) {
        console.error("Low Stock Fetch Error:", err);
        res.status(500).json({ message: 'Server error fetching low stock parts', error: err.message });
    }
};

// 2. Create a new Purchase Request, save it, and send the email
exports.createPurchaseRequest = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { supplierId, requestedParts, notes } = req.body;

        if (!supplierId || !requestedParts || requestedParts.length === 0) {
            return res.status(400).json({ message: 'Supplier and at least one requested part are required.' });
        }

        // 1. Fetch Supplier details
        const supplier = await Supplier.findById(supplierId).session(session);
        if (!supplier) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Selected supplier not found.' });
        }
        
        // FIX: Validation check using the correct nested path (supplier.contact.email)
        if (!supplier.contact || !supplier.contact.email) {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Selected supplier does not have a contact email address for sending the request.' });
        }

        const inventoryIds = requestedParts.map(p => p.inventoryId);
        const inventoryDetails = await fetchInventoryDetails(inventoryIds);

        // Map request body to final request items and structure for email
        const finalRequestedItems = requestedParts.map(reqPart => {
            const itemDetail = inventoryDetails.find(d => d._id.toString() === reqPart.inventoryId);
            
            if (!itemDetail) {
                // If any item is missing, throw an error to stop the transaction
                throw new Error(`Inventory item ID ${reqPart.inventoryId} not found.`); 
            }

            // Data structure for the DB storage
            const dbItem = {
                inventoryItem: itemDetail._id,
                partName: itemDetail.name,
                currentStock: itemDetail.quantity,
                quantityNeeded: reqPart.quantityNeeded,
            };

            // Data structure for the Email sending
            const emailItem = {
                partName: itemDetail.name,
                currentStock: itemDetail.quantity,
                quantityNeeded: reqPart.quantityNeeded,
            };

            return { dbItem, emailItem };
        });

        const dbItems = finalRequestedItems.map(f => f.dbItem);
        const emailItems = finalRequestedItems.map(f => f.emailItem);

        // 2. Store the Request in the Database
        const newRequest = new PurchaseRequest({
            supplier: supplier._id,
            requestedItems: dbItems,
            notes: notes,
            status: 'Sent', 
            // Assume req.user exists from middleware, default if not
            sentBy: req.user ? req.user.name : 'System/Admin', 
        });

        const savedRequest = await newRequest.save({ session });

        // 3. Send the Email
        // FIX: Use the correct nested email path (supplier.contact.email)
        await sendLowStockRequestEmail(
            { name: supplier.name, email: supplier.contact.email }, 
            emailItems, 
            notes
        );

        await session.commitTransaction();

        res.status(201).json({ 
            message: 'Purchase request created and email sent successfully.', 
            request: savedRequest 
        });

    } catch (err) {
        await session.abortTransaction();
        console.error('Purchase Request failed:', err);

        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: `Validation Error: ${err.message}` });
        }
        
        // Custom check to return user-friendly email service error messages
        res.status(500).json({ 
            message: err.message.includes("Email service failed") 
                ? err.message 
                : 'Server error during request creation.', 
            error: err.message 
        });
    } finally {
        session.endSession();
    }
};
