const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");




const registerUser = async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;
    console.log("Registration attempt:", { name, email, userType });

    // Email duplicate check
    const exists = await User.findOne({ email });
    if (exists) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Don't hash password here - the User model pre-save hook will handle it
    const user = new User({ name, email, password, userType: userType || "customer" });
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

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("Password match successful for user:", email);

    // create token
    const token = jwt.sign(
      { id: user._id, type: user.userType }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );

    console.log("Login successful for user:", { email: user.email, userType: user.userType });

    res.json({
      message: "✅ Login success",
      token,
      user: { _id: user._id, name: user.name, email: user.email, userType: user.userType }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// 🆕 Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🆕 Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;
    const userId = req.user.id;

    // Check if email is being changed and if it's already taken
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // Check if phone number is being changed and if it's already taken
    if (phoneNumber) {
      const existingPhone = await User.findOne({ phoneNumber, _id: { $ne: userId } });
      if (existingPhone) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "✅ Profile updated successfully",
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, getUsers, loginUser, getUserProfile, updateUserProfile };