const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");




const registerUser = async (req, res) => {
  const { name, email, phone, password, userType } = req.body;

  // Email duplicate check
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User already exists" });

  // Password hash
  //const salt = await bcrypt.genSalt(10);
  //const hashedPw = await bcrypt.hash(password, salt);

  const user = new User({ name, email, phone, password, userType });
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
    { 
      user: {           // ← Added 'user' wrapper
        id: user._id,   // ← Changed from just 'id'
        userType: user.userType  // ← Changed from 'type'
      }
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: "1d" }
  );
  res.json({
    message: "✅ Login success",
    token,
    user: { _id: user._id, name: user.name, email: user.email, userType: user.userType },
  });
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
    const { name, email, phone, password, userType } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
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

const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check old password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "❌ Current password is incorrect" });
    }

    // change password (hashing happens in schema pre-save hook)
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "✅ Password updated successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, getUsers, loginUser, deleteUser, updateUser, getUserStats, updatePassword};
