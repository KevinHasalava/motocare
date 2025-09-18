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
router.get("/", auth, getJobs);

// Mechanic-specific jobs
router.get("/mechanic/:mechanicId", auth, getJobsByMechanic);

// Update job → status change Complete/Ongoing
router.put("/:id/status", auth, updateJobStatus);

module.exports = router;