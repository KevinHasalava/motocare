// backend/routes/vehicleRoutes.js
const express = require('express');
const router = express.Router();
const {
  addVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  getVehicleStats,
} = require('../controllers/vehicleController');
const { auth, adminAuth } = require('../middleware/authMiddleware'); // Use auth and adminAuth

// Create new vehicle (admin-only)
router.post('/', auth, adminAuth, addVehicle);

// Get all vehicles
router.get('/', getVehicles);

// Get single vehicle
router.get('/:id', getVehicleById);

// Update vehicle (admin-only)
router.put('/:id', auth, adminAuth, updateVehicle);

// Delete vehicle (admin-only)
router.delete('/:id', auth, adminAuth, deleteVehicle);

// Get vehicle stats (admin-only)
router.get('/stats', auth, adminAuth, getVehicleStats);

module.exports = router;