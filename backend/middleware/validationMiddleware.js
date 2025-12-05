// middleware/validationMiddleware.js
const mongoose = require('mongoose');

// Input sanitization utilities
const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.trim().replace(/[<>]/g, ''); // Basic XSS prevention
};

const sanitizeNumber = (num) => {
    const parsed = parseFloat(num);
    return isNaN(parsed) ? 0 : parsed;
};

// Validation helper functions
const validateRequired = (value, fieldName) => {
    if (value === null || value === undefined || value === '') {
        return `${fieldName} is required.`;
    }
    return null;
};

const validateStringLength = (value, fieldName, min = 1, max = 100) => {
    if (typeof value !== 'string') return null;
    if (value.length < min) {
        return `${fieldName} must be at least ${min} characters long.`;
    }
    if (value.length > max) {
        return `${fieldName} must not exceed ${max} characters.`;
    }
    return null;
};

const validatePositiveNumber = (value, fieldName) => {
    const num = Number(value);
    if (isNaN(num) || num < 0) {
        return `${fieldName} must be a non-negative number.`;
    }
    return null;
};

const validatePartId = (partId) => {
    if (!partId || typeof partId !== 'string') {
        return 'Part ID is required and must be a string.';
    }

    const sanitized = sanitizeString(partId);
    if (sanitized !== partId) {
        return 'Part ID contains invalid characters.';
    }

    // Allow alphanumeric characters, hyphens, underscores
    if (!/^[A-Z0-9\-_]+$/i.test(sanitized)) {
        return 'Part ID can only contain letters, numbers, hyphens, and underscores.';
    }

    return null;
};

const validateObjectId = (id, fieldName) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return `${fieldName} must be a valid ObjectId.`;
    }
    return null;
};

// Inventory validation middleware
const validateInventoryData = (req, res, next) => {
    const errors = [];
    const { partId, name, category, lowStockThreshold, quantity, buyingPrice, salesPrice } = req.body;

    // Sanitize inputs
    if (partId) req.body.partId = sanitizeString(partId).toUpperCase();
    if (name) req.body.name = sanitizeString(name);
    if (category) req.body.category = sanitizeString(category);
    if (lowStockThreshold !== undefined) req.body.lowStockThreshold = sanitizeNumber(lowStockThreshold);
    if (quantity !== undefined) req.body.quantity = sanitizeNumber(quantity);
    if (buyingPrice !== undefined) req.body.buyingPrice = sanitizeNumber(buyingPrice);
    if (salesPrice !== undefined) req.body.salesPrice = sanitizeNumber(salesPrice);

    // Validate required fields
    const partIdError = validateRequired(req.body.partId, 'Part ID');
    if (partIdError) errors.push(partIdError);

    const nameError = validateRequired(req.body.name, 'Item name');
    if (nameError) errors.push(nameError);

    // Validate partId format
    const partIdFormatError = validatePartId(req.body.partId);
    if (partIdFormatError) errors.push(partIdFormatError);

    // Validate string lengths
    const nameLengthError = validateStringLength(req.body.name, 'Item name', 1, 100);
    if (nameLengthError) errors.push(nameLengthError);

    if (req.body.category) {
        const categoryLengthError = validateStringLength(req.body.category, 'Category', 1, 50);
        if (categoryLengthError) errors.push(categoryLengthError);
    }

    // Validate numeric fields
    if (req.body.lowStockThreshold !== undefined) {
        const thresholdError = validatePositiveNumber(req.body.lowStockThreshold, 'Low stock threshold');
        if (thresholdError) errors.push(thresholdError);
    }

    if (req.body.quantity !== undefined) {
        const quantityError = validatePositiveNumber(req.body.quantity, 'Quantity');
        if (quantityError) errors.push(quantityError);
    }

    if (req.body.buyingPrice !== undefined) {
        const buyingPriceError = validatePositiveNumber(req.body.buyingPrice, 'Buying price');
        if (buyingPriceError) errors.push(buyingPriceError);
    }

    if (req.body.salesPrice !== undefined) {
        const salesPriceError = validatePositiveNumber(req.body.salesPrice, 'Sales price');
        if (salesPriceError) errors.push(salesPriceError);
    }

    // Business logic validations
    if (req.body.buyingPrice !== undefined && req.body.salesPrice !== undefined) {
        if (req.body.salesPrice < req.body.buyingPrice) {
            errors.push('Sales price cannot be lower than buying price.');
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            message: 'Validation failed.',
            errors: errors
        });
    }

    next();
};

// Stock movement validation middleware
const validateStockMovementData = (req, res, next) => {
    const errors = [];
    const { inventory, supplier, type, quantity, buyingPrice, salesPrice, jobId } = req.body;

    // Sanitize inputs
    if (quantity !== undefined) req.body.quantity = sanitizeNumber(quantity);
    if (buyingPrice !== undefined) req.body.buyingPrice = sanitizeNumber(buyingPrice);
    if (salesPrice !== undefined) req.body.salesPrice = sanitizeNumber(salesPrice);
    if (jobId) req.body.jobId = sanitizeString(jobId);

    // Validate required fields
    const inventoryError = validateRequired(inventory, 'Inventory item');
    if (inventoryError) errors.push(inventoryError);

    const typeError = validateRequired(type, 'Stock type');
    if (typeError) errors.push(typeError);

    const quantityError = validateRequired(quantity, 'Quantity');
    if (quantityError) errors.push(quantityError);

    // Validate ObjectIds
    if (inventory) {
        const inventoryIdError = validateObjectId(inventory, 'Inventory item');
        if (inventoryIdError) errors.push(inventoryIdError);
    }

    if (supplier) {
        const supplierIdError = validateObjectId(supplier, 'Supplier');
        if (supplierIdError) errors.push(supplierIdError);
    }

    // Validate type enum
    if (type && !['IN', 'OUT', 'deduction'].includes(type)) {
        errors.push('Stock type must be one of: IN, OUT, deduction.');
    }

    // Validate quantity
    if (quantity !== undefined) {
        const qtyNumError = validatePositiveNumber(quantity, 'Quantity');
        if (qtyNumError) errors.push(qtyNumError);

        if (quantity < 1) {
            errors.push('Quantity must be at least 1.');
        }
    }

    // Conditional validations based on type
    if (type === 'IN') {
        if (!supplier) {
            errors.push('Supplier is required for stock-in transactions.');
        }
        if (buyingPrice === undefined || salesPrice === undefined) {
            errors.push('Buying price and sales price are required for stock-in transactions.');
        }
    }

    if (type === 'deduction') {
        if (!jobId) {
            errors.push('Job ID is required for deduction transactions.');
        }
    }

    // Validate prices
    if (buyingPrice !== undefined) {
        const buyingPriceError = validatePositiveNumber(buyingPrice, 'Buying price');
        if (buyingPriceError) errors.push(buyingPriceError);
    }

    if (salesPrice !== undefined) {
        const salesPriceError = validatePositiveNumber(salesPrice, 'Sales price');
        if (salesPriceError) errors.push(salesPriceError);
    }

    // Business logic validations
    if (buyingPrice !== undefined && salesPrice !== undefined && type === 'IN') {
        if (salesPrice < buyingPrice) {
            errors.push('Sales price cannot be lower than buying price for stock-in transactions.');
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            message: 'Validation failed.',
            errors: errors
        });
    }

    next();
};

// Stock deduction validation middleware
const validateStockDeductionData = (req, res, next) => {
    const errors = [];
    const { jobId, parts } = req.body;

    // Sanitize jobId
    if (jobId) req.body.jobId = sanitizeString(jobId);

    // Validate required fields
    const jobIdError = validateRequired(jobId, 'Job ID');
    if (jobIdError) errors.push(jobIdError);

    const partsError = validateRequired(parts, 'Parts array');
    if (partsError) errors.push(partsError);

    // Validate parts array
    if (!Array.isArray(parts)) {
        errors.push('Parts must be an array.');
    } else {
        if (parts.length === 0) {
            errors.push('Parts array cannot be empty.');
        }

        parts.forEach((part, index) => {
            if (!part.partId || typeof part.partId !== 'string') {
                errors.push(`Part ${index + 1}: Part ID is required and must be a string.`);
            } else {
                const partIdError = validatePartId(part.partId);
                if (partIdError) errors.push(`Part ${index + 1}: ${partIdError}`);
            }

            if (part.qty === undefined || part.qty === null) {
                errors.push(`Part ${index + 1}: Quantity is required.`);
            } else {
                const qtyNum = sanitizeNumber(part.qty);
                if (qtyNum <= 0) {
                    errors.push(`Part ${index + 1}: Quantity must be a positive number.`);
                }
                part.qty = qtyNum; // Update sanitized value
            }
        });
    }

    if (errors.length > 0) {
        return res.status(400).json({
            message: 'Validation failed.',
            errors: errors
        });
    }

    next();
};

module.exports = {
    validateInventoryData,
    validateStockMovementData,
    validateStockDeductionData
};
