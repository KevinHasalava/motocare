const Inventory = require('../models/inventory');
const Supplier = require('../models/supplier');
const PurchaseRequest = require('../models/PurchaseRequest');
const mongoose = require('mongoose');
const { sendLowStockRequestEmail } = require('../utils/emailService');

// Helper function to safely fetch inventory details
const fetchInventoryDetails = async (inventoryIds) => {
  return Inventory.find({ _id: { $in: inventoryIds } })
    .select('name quantity lowStockThreshold');
};

// -------------------------- 1. Get low stock parts --------------------------
exports.getLowStockParts = async (req, res) => {
  try {
    const lowStockItems = await Inventory.aggregate([
      {
        $match: {
          $expr: { $lte: ["$quantity", "$lowStockThreshold"] }
        }
      },
      {
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

// -------------------------- 2. Create a new purchase request --------------------------
exports.createPurchaseRequest = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { supplierId, requestedParts, notes } = req.body;

    if (!supplierId || !requestedParts || requestedParts.length === 0) {
      return res.status(400).json({ message: 'Supplier and at least one requested part are required.' });
    }

    const supplier = await Supplier.findById(supplierId).session(session);
    if (!supplier) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Selected supplier not found.' });
    }

    if (!supplier.contact || !supplier.contact.email) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Selected supplier does not have a contact email.' });
    }

    const inventoryIds = requestedParts.map(p => p.inventoryId);
    const inventoryDetails = await fetchInventoryDetails(inventoryIds);

    const finalRequestedItems = requestedParts.map(reqPart => {
      const itemDetail = inventoryDetails.find(d => d._id.toString() === reqPart.inventoryId);
      if (!itemDetail) {
        throw new Error(`Inventory item ID ${reqPart.inventoryId} not found.`); 
      }

      const dbItem = {
        inventoryItem: itemDetail._id,
        partName: itemDetail.name,
        currentStock: itemDetail.quantity,
        quantityNeeded: reqPart.quantityNeeded,
      };

      const emailItem = {
        partName: itemDetail.name,
        currentStock: itemDetail.quantity,
        quantityNeeded: reqPart.quantityNeeded,
      };

      return { dbItem, emailItem };
    });

    const dbItems = finalRequestedItems.map(f => f.dbItem);
    const emailItems = finalRequestedItems.map(f => f.emailItem);

    const newRequest = new PurchaseRequest({
      supplier: supplier._id,
      requestedItems: dbItems,
      notes: notes,
      status: 'Sent',
      sentBy: req.user ? req.user.name : 'System/Admin',
    });

    const savedRequest = await newRequest.save({ session });

    // populate before sending back
    const populatedRequest = await PurchaseRequest.findById(savedRequest._id)
      .populate('supplier', 'name contact')
      .lean();

    await sendLowStockRequestEmail(
      { name: supplier.name, email: supplier.contact.email }, 
      emailItems, 
      notes
    );

    await session.commitTransaction();

    res.status(201).json({ 
      message: 'Purchase request created and email sent successfully.', 
      request: populatedRequest 
    });

  } catch (err) {
    await session.abortTransaction();
    console.error('Purchase Request failed:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: `Validation Error: ${err.message}` });
    }
    res.status(500).json({ 
      message: err.message.includes("Email service failed") ? err.message : 'Server error during request creation.', 
      error: err.message 
    });
  } finally {
    session.endSession();
  }
};

// -------------------------- 3. Get a single purchase request by ID --------------------------
exports.getPurchaseRequestById = async (req, res) => {
  try {
    const request = await PurchaseRequest.findById(req.params.id)
      .populate('supplier', 'name contact')
      .lean();

    if (!request) {
      return res.status(404).json({ message: 'Purchase request not found.' });
    }

    res.status(200).json(request);

  } catch (err) {
    console.error("Fetch Single Request Error:", err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid request ID format.' });
    }
    res.status(500).json({ message: 'Server error fetching request.', error: err.message });
  }
};

// -------------------------- 4. Get all purchase requests (List View) --------------------------
exports.getAllPurchaseRequests = async (req, res) => {
  try {
    const requests = await PurchaseRequest.find({})
      .populate('supplier', 'name contact')
      .sort({ requestDate: -1 })
      .lean();

    // Normalize fields for frontend
    const safeRequests = requests.map(req => ({
      _id: req._id,
      // Fix for N/A supplier if population fails
      supplier: req.supplier || { name: 'MISSING SUPPLIER', _id: '0' },
      requestedItems: (req.requestedItems || []).map(i => ({
        partName: i.partName,
        currentStock: Number(i.currentStock),
        quantityNeeded: Number(i.quantityNeeded)
      })),
      // *** CORRECTION 1: Robust Date Handling ***
      requestDate: req.requestDate 
        ? (req.requestDate instanceof Date 
            ? req.requestDate.toISOString() 
            : new Date(req.requestDate).toISOString()) 
        : null,
      // **********************************
      // Fix for '—' notes if the field is empty
      notes: req.notes || '', 
      status: req.status || 'Pending',
      sentBy: req.sentBy || 'System'
    }));

    res.status(200).json(safeRequests);

  } catch (err) {
    console.error("Fetch All Requests Error:", err);
    res.status(500).json({
      message: 'Server error fetching purchase requests list.',
      error: err.message
    });
  }
};