const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Register a new user with plain text password.
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, userType } = req.body;
    console.log("Registration attempt:", { name, email, phone, userType });

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Email duplicate check
    const exists = await User.findOne({ email });
    if (exists) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Phone duplicate check
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      console.log("Phone already exists:", phone);
      return res.status(400).json({ message: "Phone number already exists" });
    }

    // Don't hash password here - the User model pre-save hook will handle it
    const user = new User({ name, email, phone, password, userType: userType || "customer" });
    await user.save();
    console.log("User created successfully:", { id: user._id, email: user.email, userType: user.userType });

    res.status(201).json({ 
      message: "✅ Registered", 
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, userType: user.userType }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

/**
 * Get all users (for testing)
 */
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email phone userType createdAt').sort({ createdAt: -1 });
    console.log("Fetching all users, count:", users.length);
    res.status(200).json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Login user by comparing plain text password.
 */
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
    console.log('Getting profile for user ID:', req.user.id);
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      console.log('User not found with ID:', req.user.id);
      return res.status(404).json({ message: "User not found" });
    }
    console.log('User profile found:', user.name, user.email);
    res.status(200).json({ data: user, message: "Profile retrieved successfully" });
  } catch (err) {
    console.error('Error getting user profile:', err);
    res.status(500).json({ message: err.message });
  }
};

// 🆕 Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const userId = req.user.id;

    // Check if email is being changed and if it's already taken
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // Check if phone number is being changed and if it's already taken
    if (phone) {
      const existingPhone = await User.findOne({ phone, _id: { $ne: userId } });
      if (existingPhone) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;

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

// 🆕 Delete user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ message: "✅ User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🆕 Update user (Admin only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, userType } = req.body;
    
    // Check if email is being changed and if it's already taken
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: id } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }
    
    // Check if phone is being changed and if it's already taken
    if (phone) {
      const existingPhone = await User.findOne({ phone, _id: { $ne: id } });
      if (existingPhone) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
    }
    
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (userType) updateData.userType = userType;
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({
      message: "✅ User updated successfully",
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🆕 Get user stats (Admin only)
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ userType: 'admin' });
    const customerUsers = await User.countDocuments({ userType: 'customer' });
    const mechanicUsers = await User.countDocuments({ userType: 'mechanic' });
    const cashierUsers = await User.countDocuments({ userType: 'cashier' });
    
    const stats = {
      total: totalUsers,
      admin: adminUsers,
      customer: customerUsers,
      mechanic: mechanicUsers,
      cashier: cashierUsers
    };
    
    res.status(200).json({ data: stats, message: "User stats retrieved successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🆕 Update user password (Admin only)
const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Update password (pre-save hook will hash it)
    user.password = password;
    await user.save();
    
    res.status(200).json({ message: "✅ Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, getUsers, loginUser, getUserProfile, updateUserProfile, deleteUser, updateUser, getUserStats, updatePassword };
