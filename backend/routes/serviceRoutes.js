const express = require("express");
const router = express.Router();
const {
  addService,
  getServices,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

// Service CRUD
router.post("/", addService);         // Add service
router.get("/", getServices);         // Get all
router.put("/:id", updateService);    // Edit
router.delete("/:id", deleteService); // Delete

module.exports = router;