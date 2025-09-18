const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");




const registerUser = async (req, res) => {
  const { name, email, password, userType } = req.body;

  // Email duplicate check
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User already exists" });

  // Password hash
  const salt = await bcrypt.genSalt(10);
  const hashedPw = await bcrypt.hash(password, salt);

  const user = new User({ name, email, password: hashedPw, userType });
  await user.save();

  res.status(201).json({ message: "✅ Registered", user });
};

// get all users (for testing)
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const loginUser = async (req, res) => {
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
};

module.exports = { registerUser, getUsers, loginUser };