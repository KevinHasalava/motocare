const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUsers, getUserProfile, updateUserProfile } = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

// register
router.post("/register", registerUser);

// get users
router.get("/", getUsers);
// login
router.post("/login", loginUser);

// 🆕 User Profile Routes
router.get("/profile", auth, getUserProfile);
router.put("/profile", auth, updateUserProfile);
router.delete("/:id", auth, deleteUser);
router.put("/:id", auth, updateUser);
router.get("/stats/data", auth, getUserStats);
router.put("/:id/password", auth, updatePassword);

module.exports = router;