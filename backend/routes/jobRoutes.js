// backend/routes/jobRoutes.js
const express = require("express");
const router = express.Router();
const {
  getJobs,
  updateJobStatus,
  getJobsByMechanic,
} = require("../controllers/jobController");

const auth = require("../middleware/authMiddleware");

// All jobs (for Admin)
router.get("/",getJobs);

// Mechanic-specific jobs
router.get("/mechanic/:mechanicId", getJobsByMechanic);

// Update job → status change Complete/Ongoing
router.put("/:id/status", updateJobStatus);

module.exports = router;