const express = require("express");
const router = express.Router();
const {
  getVehiclesByEmail,
  getAvailableMechanics,
  getAllServices
} = require("../controllers/dataController");

// ------------------- Job Creation Support Routes -------------------

// GET all services to populate dropdown
router.get("/services", getAllServices);

// GET all mechanics to populate assignment dropdown
router.get("/mechanics", getAvailableMechanics);

// GET registered vehicles for a specific user email
// Note: Email is passed as a URL parameter
router.get("/vehicles/:email", getVehiclesByEmail);

module.exports = router;
