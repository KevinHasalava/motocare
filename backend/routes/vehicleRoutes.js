const express = require("express");
const router = express.Router();
const { addVehicle, updateVehicle, deleteVehicle, getVehicles, getMyVehicles } = require("../controllers/vehicleController");
const auth = require("../middleware/authMiddleware");

// Only logged-in users can add/update/delete
router.post("/", auth, addVehicle);
router.put("/:id", auth, updateVehicle);
router.delete("/:id", auth, deleteVehicle);


// Everyone (or protected if needed)
router.get("/", auth, getVehicles);
router.get("/my", auth, getMyVehicles);


module.exports = router;