const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUsers } = require("../controllers/userController");

// register
router.post("/register", registerUser);

// get users
router.get("/", getUsers);
// login
router.post("/login", loginUser);

module.exports = router;