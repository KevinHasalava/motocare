// backend/routes/jobRoutes.js
const express = require("express");
const router = express.Router();
const {
  getJobs,
  updateJobStatus,
  updateJob,
  getJobsByMechanic,
  getJobsByDateAndMechanic,
  createWalkInJob, 
  deleteJobOnly,
  
  // 🚀 IMPORTS REQUIRED FOR VIEW/EDIT FUNCTIONALITY
  getJobDetails, // Handles GET /api/jobs/:id
  updateJobDetails, // Handles PUT /api/jobs/:id
  
  // 💡 NEW IMPORT: PDF Generation Function
  generateJobPdf, // Handles GET /api/jobs/:id/download-pdf

  // 🔄 AUTO COMPLETE PAST JOBS
  autoCompletePastJobs // Handles POST /api/jobs/auto-complete-past
} = require("../controllers/jobController");

const auth = require("../middleware/authMiddleware");

// All jobs (for Admin) - GET /api/jobs
router.get("/", getJobs);

// Mechanic-specific jobs - GET /api/jobs/mechanic/:mechanicId
router.get("/mechanic/:mechanicId", getJobsByMechanic);

// Schedule check for date and mechanic - GET /api/jobs/schedule?date=...&mechanicId=...
router.get("/schedule", getJobsByDateAndMechanic);

// ------------------- NEW ADMIN/CASHIER ROUTES (CRUD) -------------------

// ✅ Create (Manual) - POST /api/jobs/walkin
router.post("/walkin", createWalkInJob); 

// 🗑️ Delete - DELETE /api/jobs/:id
router.delete("/:id", deleteJobOnly); 

// Update (Status) - PUT /api/jobs/:id/status
router.put("/:id/status", updateJobStatus);

// ------------------- JOB DETAILS & FULL EDIT -------------------

// 👁️ Get Job Details - GET /api/jobs/:id
router.get("/:id", getJobDetails); 

// ✏️ Update Job (Full Edit) - PUT /api/jobs/:id
router.put("/:id", updateJobDetails);

// ------------------- AUTO COMPLETE PAST JOBS -------------------

// 🔄 Auto Complete Past Jobs - POST /api/jobs/auto-complete-past
router.post("/auto-complete-past", autoCompletePastJobs);

// ------------------- 🚀 NEW: PDF DOWNLOAD ROUTE -------------------

// 📄 Download PDF - GET /api/jobs/:id/download-pdf
// (You might want to add 'auth' middleware here for security)
router.get("/:id/download-pdf", generateJobPdf); 

module.exports = router;