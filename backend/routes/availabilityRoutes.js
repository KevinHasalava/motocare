// backend/routes/availabilityRoutes.js
const express = require("express");
const router = express.Router();
const { setAvailability, getAvailability } = require("../controllers/availabilityController");
const auth = require("../middleware/authMiddleware");

// Admin set mechanic/garage availability
router.post("/", auth, setAvailability);

// Get slots available for a mechanic/date
router.get("/", auth, getAvailability);

module.exports = router;