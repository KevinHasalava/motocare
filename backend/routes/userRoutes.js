const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUsers, deleteUser, updateUser, getUserStats, } = require("../controllers/userController");
const { adminAuth } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", adminAuth, getUsers);
router.delete("/:id", adminAuth, deleteUser);
router.put("/:id", adminAuth, updateUser);
router.get('/stats', adminAuth, getUserStats);

module.exports = router;