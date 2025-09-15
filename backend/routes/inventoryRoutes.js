const express = require('express');
const router = express.Router();
const {
  getAllInventory,
  getLowStock,
  addPart,
  updatePart,
  deletePart,
  deductPart,
  addRestock,
  getRestockHistory,
} = require('../controllers/inventoryController');
const { protect, restrictTo } = require('../middleware/auth'); // Adjust if no auth middleware exists

// Admin-only routes (CRUD)
router.route('/')
  .get(protect, getAllInventory)
  .post(protect, restrictTo('admin'), addPart);

router.route('/low')
  .get(protect, getLowStock);

router.route('/:partId')
  .put(protect, restrictTo('admin'), updatePart)
  .delete(protect, restrictTo('admin'), deletePart);

router.route('/deduct')
  .post(protect, restrictTo('admin', 'worker'), deductPart);

router.route('/restock')
  .get(protect, getRestockHistory)
  .post(protect, restrictTo('admin'), addRestock);

module.exports = router;