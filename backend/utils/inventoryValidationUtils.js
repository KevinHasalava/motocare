// utils/inventoryValidationUtils.js
const Inventory = require('../models/inventory');
const Supplier = require('../models/supplier');

/**
 * Validate if inventory item exists and has sufficient stock
 * @param {string} inventoryId - Inventory item ID
 * @param {number} requiredQuantity - Required quantity
 * @param {Object} session - MongoDB session for transactions
 * @returns {Object} - { isValid: boolean, message: string, item: Object }
 */
const validateInventoryStock = async (inventoryId, requiredQuantity, session = null) => {
    try {
        const query = Inventory.findById(inventoryId);
        if (session) query.session(session);

        const item = await query;

        if (!item) {
            return {
                isValid: false,
                message: 'Inventory item not found.',
                item: null
            };
        }

        if (item.quantity < requiredQuantity) {
            return {
                isValid: false,
                message: `Insufficient stock. Available: ${item.quantity}, Required: ${requiredQuantity}`,
                item: item
            };
        }

        return {
            isValid: true,
            message: 'Stock validation passed.',
            item: item
        };
    } catch (error) {
        return {
            isValid: false,
            message: 'Error validating inventory stock.',
            item: null
        };
    }
};

/**
 * Validate supplier exists and is active
 * @param {string} supplierId - Supplier ID
 * @param {Object} session - MongoDB session for transactions
 * @returns {Object} - { isValid: boolean, message: string, supplier: Object }
 */
const validateSupplier = async (supplierId, session = null) => {
    try {
        const query = Supplier.findById(supplierId);
        if (session) query.session(session);

        const supplier = await query;

        if (!supplier) {
            return {
                isValid: false,
                message: 'Supplier not found.',
                supplier: null
            };
        }

        // Assuming suppliers have an 'active' field
        if (supplier.active === false) {
            return {
                isValid: false,
                message: 'Supplier is not active.',
                supplier: supplier
            };
        }

        return {
            isValid: true,
            message: 'Supplier validation passed.',
            supplier: supplier
        };
    } catch (error) {
        return {
            isValid: false,
            message: 'Error validating supplier.',
            supplier: null
        };
    }
};

/**
 * Validate part ID uniqueness (excluding current item for updates)
 * @param {string} partId - Part ID to check
 * @param {string} excludeId - ID to exclude from uniqueness check (for updates)
 * @returns {Object} - { isValid: boolean, message: string }
 */
const validatePartIdUniqueness = async (partId, excludeId = null) => {
    try {
        const query = { partId: partId.toUpperCase() };
        if (excludeId) {
            query._id = { $ne: excludeId };
        }

        const existingItem = await Inventory.findOne(query);

        if (existingItem) {
            return {
                isValid: false,
                message: 'Part ID already exists.'
            };
        }

        return {
            isValid: true,
            message: 'Part ID is unique.'
        };
    } catch (error) {
        return {
            isValid: false,
            message: 'Error checking part ID uniqueness.'
        };
    }
};

/**
 * Validate pricing logic
 * @param {number} buyingPrice - Buying price
 * @param {number} salesPrice - Sales price
 * @param {string} operation - Operation type ('create', 'update', 'stock_in')
 * @returns {Object} - { isValid: boolean, message: string }
 */
const validatePricing = (buyingPrice, salesPrice, operation = 'create') => {
    const errors = [];

    // Basic validation
    if (buyingPrice < 0) {
        errors.push('Buying price cannot be negative.');
    }

    if (salesPrice < 0) {
        errors.push('Sales price cannot be negative.');
    }

    // Business logic validation
    if (salesPrice < buyingPrice) {
        errors.push('Sales price cannot be lower than buying price.');
    }

    // For stock operations, prices are required
    if (operation === 'stock_in') {
        if (buyingPrice === undefined || buyingPrice === null) {
            errors.push('Buying price is required for stock-in operations.');
        }
        if (salesPrice === undefined || salesPrice === null) {
            errors.push('Sales price is required for stock-in operations.');
        }
    }

    return {
        isValid: errors.length === 0,
        message: errors.length > 0 ? errors.join(' ') : 'Pricing validation passed.'
    };
};

/**
 * Validate low stock threshold logic
 * @param {number} lowStockThreshold - Low stock threshold
 * @param {number} currentQuantity - Current quantity (optional)
 * @returns {Object} - { isValid: boolean, message: string, warning: string }
 */
const validateLowStockThreshold = (lowStockThreshold, currentQuantity = null) => {
    const result = {
        isValid: true,
        message: 'Low stock threshold validation passed.',
        warning: null
    };

    if (lowStockThreshold < 0) {
        result.isValid = false;
        result.message = 'Low stock threshold cannot be negative.';
        return result;
    }

    // Warning if threshold is higher than current stock
    if (currentQuantity !== null && lowStockThreshold >= currentQuantity) {
        result.warning = `Low stock threshold (${lowStockThreshold}) is higher than or equal to current quantity (${currentQuantity}). Consider adjusting the threshold.`;
    }

    return result;
};

/**
 * Validate bulk inventory operations
 * @param {Array} operations - Array of operations with partId and quantity
 * @param {Object} session - MongoDB session for transactions
 * @returns {Object} - { isValid: boolean, message: string, invalidItems: Array }
 */
const validateBulkInventoryOperations = async (operations, session = null) => {
    const invalidItems = [];

    for (const operation of operations) {
        const { partId, quantity } = operation;

        if (!partId || !quantity) {
            invalidItems.push({
                partId: partId || 'Unknown',
                reason: 'Missing partId or quantity'
            });
            continue;
        }

        const item = await Inventory.findOne({ partId: partId.toUpperCase() });
        if (!item) {
            invalidItems.push({
                partId,
                reason: 'Part not found in inventory'
            });
            continue;
        }

        if (item.quantity < quantity) {
            invalidItems.push({
                partId,
                reason: `Insufficient stock. Available: ${item.quantity}, Required: ${quantity}`
            });
        }
    }

    return {
        isValid: invalidItems.length === 0,
        message: invalidItems.length > 0 ? `${invalidItems.length} items failed validation.` : 'Bulk validation passed.',
        invalidItems
    };
};

module.exports = {
    validateInventoryStock,
    validateSupplier,
    validatePartIdUniqueness,
    validatePricing,
    validateLowStockThreshold,
    validateBulkInventoryOperations
};
