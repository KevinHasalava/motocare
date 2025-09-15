const express = require('express');
const router = express.Router();
const { addVehicle, getVehicles, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');

// Add vehicle
router.post('/', addVehicle);

// Get all vehicles
router.get('/', getVehicles);

// Update vehicle
router.put('/:id', updateVehicle);

// Delete vehicle
router.delete('/:id', deleteVehicle);

module.exports = router;
