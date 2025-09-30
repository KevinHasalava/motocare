// backend/routes/jobRoutes.js
const express = require("express");
const router = express.Router();
const {
  getJobs,
  updateJobStatus,
  updateJob,
  getJobsByMechanic,
  // Import the new functions
  createWalkInJob, 
  deleteJobOnly
} = require("../controllers/jobController");

const auth = require("../middleware/authMiddleware");

// All jobs (for Admin)
router.get("/", getJobs);

// Mechanic-specific jobs
router.get("/mechanic/:mechanicId", getJobsByMechanic);

// ------------------- NEW ADMIN/CASHIER ROUTES (CRUD) -------------------

// ✅ Create (Manual) - Manually create a Walk-In Job
// POST /api/jobs/walkin
router.post("/walkin", createWalkInJob); 

// 🗑️ Delete - Delete a Job (and its associated dummy booking)
// DELETE /api/jobs/:id
router.delete("/:id", deleteJobOnly); 

// Update (Status) - Update job → status change (Used for Admin/Cashier to mark Ongoing/Complete/Cancel)
// PUT /api/jobs/:id/status (Existing Update functionality)
router.put("/:id/status", updateJobStatus);

// Update (Complete) - Update job with all fields including work hours and notes
// PUT /api/jobs/:id (New functionality for mechanics)
router.put("/:id", updateJob);

module.exports = router;