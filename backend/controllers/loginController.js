const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // create token
    const token = jwt.sign(
      { id: user._id, type: user.userType }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );

    res.json({
      message: "✅ Login success",
      token,
      user: { _id: user._id, name: user.name, email: user.email, userType: user.userType }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

module.exports = { loginUser };