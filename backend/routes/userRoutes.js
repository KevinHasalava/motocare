const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUsers, deleteUser, updateUser, getUserStats } = require("../controllers/userController");
const auth = require("../middleware/authMiddleware"); 

// register
router.post("/register", registerUser);

// get users
router.get("/", getUsers);
// login
router.post("/login", loginUser);

router.delete("/:id", auth, deleteUser);
router.put("/:id", auth, updateUser);
router.get("/stats/data", auth, getUserStats);

module.exports = router;