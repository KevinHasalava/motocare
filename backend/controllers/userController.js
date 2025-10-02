const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");




const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, userType } = req.body;
    console.log("Registration attempt:", { name, email, userType });

    // Email duplicate check
    const exists = await User.findOne({ email });
    if (exists) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Don't hash password here - the User model pre-save hook will handle it
    const user = new User({ name, email, password, phone, userType: userType || "customer" });
    await user.save();
    console.log("User created successfully:", { id: user._id, email: user.email, userType: user.userType });

    res.status(201).json({ 
      message: "✅ Registered", 
      user: { _id: user._id, name: user.name, email: user.email, userType: user.userType }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// get all users (for testing)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email userType createdAt').sort({ createdAt: -1 });
    console.log("Fetching all users, count:", users.length);
    res.status(200).json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: err.message });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("User found:", { id: user._id, email: user.email, userType: user.userType });

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

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
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
    const labels = ['customer', 'admin', 'mechanic','cashier'];
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

// Get user profile 
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save();
    
    // Return user without password
    const updatedUser = await User.findById(user._id).select('-password');
    res.status(200).json({ message: "✅ Profile updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = { registerUser, getUsers, loginUser, deleteUser, updateUser, getUserStats, updatePassword, getUserProfile, updateUserProfile};
