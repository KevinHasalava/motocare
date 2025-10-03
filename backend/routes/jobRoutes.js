// backend/routes/jobRoutes.js
const express = require("express");
const router = express.Router();
const {
  getJobs,
  updateJobStatus,
  updateJob,
  getJobsByMechanic,
  createWalkInJob, 
  deleteJobOnly,
  
  // 🚀 IMPORTS REQUIRED FOR VIEW/EDIT FUNCTIONALITY
  getJobDetails, // Handles GET /api/jobs/:id
  updateJob,     // Handles PUT /api/jobs/:id
  
  // 💡 NEW IMPORT: PDF Generation Function
  generateJobPdf // Handles GET /api/jobs/:id/download-pdf
} = require("../controllers/jobController");

const auth = require("../middleware/authMiddleware");

// All jobs (for Admin) - GET /api/jobs
router.get("/", getJobs);

// Mechanic-specific jobs - GET /api/jobs/mechanic/:mechanicId
router.get("/mechanic/:mechanicId", getJobsByMechanic);

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
router.put("/:id", updateJob);

// ------------------- 🚀 NEW: PDF DOWNLOAD ROUTE -------------------

// 📄 Download PDF - GET /api/jobs/:id/download-pdf
// (You might want to add 'auth' middleware here for security)
router.get("/:id/download-pdf", generateJobPdf); 

module.exports = router;