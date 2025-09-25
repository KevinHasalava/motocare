const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { name, email, password, userType } = req.body;

  // Restrict admin registration
  if (userType === "admin" && (!req.user || req.user.type !== "admin")) {
    return res.status(403).json({ message: "Cannot register as admin" });
  }

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User already exists" });

  const salt = await bcrypt.genSalt(10);
  const hashedPw = await bcrypt.hash(password, salt);

  const user = new User({ name, email, password: hashedPw, userType });
  await user.save();

  res.status(201).json({ message: "✅ Registered", user });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid email or password" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

  const token = jwt.sign(
    { id: user._id, type: user.userType },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    message: "✅ Login success",
    token,
    user: { _id: user._id, name: user.name, email: user.email, userType: user.userType },
  });
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "🗑️ User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, userType } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (userType) user.userType = userType;

    await user.save();
    res.status(200).json({ message: "✅ User updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$userType',
          count: { $sum: 1 },
        },
      },
    ]);
    const labels = ['customer', 'admin', 'mechanic'];
    const data = Array(labels.length).fill(0);
    stats.forEach((s) => {
      const index = labels.indexOf(s._id);
      if (index !== -1) data[index] = s.count;
    });
    res.status(200).json({ labels, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, getUsers, loginUser, deleteUser, updateUser, getUserStats, };