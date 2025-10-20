const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const dayjs = require('dayjs');

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

// 🆕 Generate PDF for all users
const generateAllUsersPDF = async (req, res) => {
  try {
    const users = await User.find({}, 'name email phone userType createdAt').sort({ createdAt: -1 });
    
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=AllUsers_${dayjs().format('YYYY-MM-DD')}.pdf`);
    
    doc.pipe(res);
    
    // Add letterhead template
    const letterheadPngPath = path.join(__dirname, '../assets/pdftemp.png');
    if (fs.existsSync(letterheadPngPath)) {
      try {
        doc.image(letterheadPngPath, 0, 0, {
          width: doc.page.width,
          height: doc.page.height
        });
      } catch (error) {
        console.error('Error adding template:', error.message);
      }
    }
    
    // Set initial position
    doc.x = 50;
    doc.y = 160;
    
    // Title
    doc.fontSize(20).fillColor('#1a365d').text('USER DIRECTORY', { align: 'center' });
    doc.moveDown(0.5);
    
    // Report Info Box
    const infoBoxY = doc.y;
    doc.rect(50, infoBoxY, doc.page.width - 100, 60).fillAndStroke('#e8f4fd', '#1a365d');
    
    doc.fontSize(10).fillColor('#1a365d');
    doc.text(`Report Generated: ${dayjs().format('dddd, MMMM D, YYYY')}`, 60, infoBoxY + 12);
    doc.text(`Generation Time: ${dayjs().format('hh:mm A')}`, 60, infoBoxY + 28);
    doc.text(`Total Users: ${users.length}`, 60, infoBoxY + 44);
    
    // Status indicators
    doc.fontSize(10).fillColor('#28a745');
    doc.text('✓ ACTIVE DIRECTORY', doc.page.width - 180, infoBoxY + 12);
    doc.fillColor('#17a2b8');
    doc.text('✓ VERIFIED DATA', doc.page.width - 180, infoBoxY + 28);
    doc.fillColor('#6c757d');
    doc.text('✓ OFFICIAL REPORT', doc.page.width - 180, infoBoxY + 44);
    
    doc.y = infoBoxY + 80;
    doc.moveDown(0.3);
    
    // Table Header
    doc.fontSize(14).fillColor('#1a365d').text('USER DETAILS', 50);
    doc.moveDown(0.3);
    
    const startY = doc.y;
    const colWidths = {
      number: 25,
      name: 120,
      email: 140,
      phone: 80,
      userType: 70,
      joined: 75
    };
    
    // Header background
    doc.rect(50, startY - 2, doc.page.width - 100, 18).fillAndStroke('#1a365d', '#1a365d');
    
    let xPos = 50;
    doc.fontSize(9).fillColor('#ffffff');
    doc.text('#', xPos + 2, startY + 2, { width: colWidths.number, continued: false });
    xPos += colWidths.number;
    doc.text('NAME', xPos + 2, startY + 2, { width: colWidths.name, continued: false });
    xPos += colWidths.name;
    doc.text('EMAIL', xPos + 2, startY + 2, { width: colWidths.email, continued: false });
    xPos += colWidths.email;
    doc.text('PHONE', xPos + 2, startY + 2, { width: colWidths.phone, continued: false });
    xPos += colWidths.phone;
    doc.text('TYPE', xPos + 2, startY + 2, { width: colWidths.userType, continued: false });
    xPos += colWidths.userType;
    doc.text('JOINED', xPos + 2, startY + 2, { width: colWidths.joined, continued: false });
    
    doc.y = startY + 20;
    doc.moveDown(0.2);
    
    // Table Rows
    doc.fontSize(9);
    users.forEach((user, index) => {
      if (doc.y > doc.page.height - 100) {
        doc.addPage();
        const letterheadPngPath = path.join(__dirname, '../assets/pdftemp.png');
        if (fs.existsSync(letterheadPngPath)) {
          try {
            doc.image(letterheadPngPath, 0, 0, {
              width: doc.page.width,
              height: doc.page.height
            });
          } catch (error) {
            console.error('Error adding template to new page:', error.message);
          }
        }
        doc.x = 50;
        doc.y = 160;
      }
      
      const rowY = doc.y;
      const rowColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
      doc.rect(50, rowY, doc.page.width - 100, 20).fillAndStroke(rowColor, '#e9ecef');
      
      let xPos = 50;
      doc.fillColor('#2c3e50');
      
      doc.text(String(index + 1), xPos + 2, rowY + 6, { 
        width: colWidths.number - 4, 
        continued: false,
        lineBreak: false,
        align: 'center'
      });
      xPos += colWidths.number;
      
      doc.text(user.name || 'N/A', xPos + 2, rowY + 6, { 
        width: colWidths.name - 4, 
        continued: false,
        lineBreak: false
      });
      xPos += colWidths.name;
      
      doc.text(user.email || 'N/A', xPos + 2, rowY + 6, { 
        width: colWidths.email - 4, 
        continued: false,
        lineBreak: false
      });
      xPos += colWidths.email;
      
      doc.text(user.phone || 'N/A', xPos + 2, rowY + 6, { 
        width: colWidths.phone - 4, 
        continued: false,
        lineBreak: false
      });
      xPos += colWidths.phone;
      
      doc.text(user.userType || 'N/A', xPos + 2, rowY + 6, { 
        width: colWidths.userType - 4, 
        continued: false,
        lineBreak: false
      });
      xPos += colWidths.userType;
      
      doc.text(dayjs(user.createdAt).format('MM/DD/YYYY'), xPos + 2, rowY + 6, { 
        width: colWidths.joined - 4, 
        continued: false,
        lineBreak: false
      });
      
      doc.y = rowY + 20;
    });
    
    // Summary Section
    doc.moveDown(1);
    const summaryY = doc.y;
    
    const customerCount = users.filter(u => u.userType === 'customer').length;
    const adminCount = users.filter(u => u.userType === 'admin').length;
    const mechanicCount = users.filter(u => u.userType === 'mechanic').length;
    const cashierCount = users.filter(u => u.userType === 'cashier').length;
    
    doc.rect(50, summaryY, doc.page.width - 100, 50).fillAndStroke('#e8f4fd', '#1a365d');
    
    doc.fillColor('#1a365d').fontSize(12);
    doc.text('USER SUMMARY', 60, summaryY + 8);
    
    doc.fontSize(9).fillColor('#2c3e50');
    doc.text(`Total: ${users.length}`, 60, summaryY + 25);
    doc.text(`Customers: ${customerCount}`, 180, summaryY + 25);
    doc.text(`Admins: ${adminCount}`, 300, summaryY + 25);
    doc.text(`Mechanics: ${mechanicCount}`, 400, summaryY + 25);
    doc.text(`Cashiers: ${cashierCount}`, 500, summaryY + 25);
    
    doc.y = summaryY + 60;
    doc.moveDown(0.5);
    
    // Footer
    doc.fontSize(9).fillColor('#6c757d');
    doc.text('This is an official User Directory Report. Please retain this document for your records.', 50, doc.y, {
      align: 'center',
      width: doc.page.width - 100
    });
    
    doc.end();
  } catch (err) {
    console.error("Error generating all users PDF:", err.message);
    res.status(500).json({ message: "PDF generation failed due to a server error." });
  }
};

// 🆕 Generate PDF for single user
const generateSingleUserPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=User_${user.name.replace(/\s+/g, '_')}_${dayjs().format('YYYY-MM-DD')}.pdf`);
    
    doc.pipe(res);
    
    // Add letterhead template
    const letterheadPngPath = path.join(__dirname, '../assets/pdftemp.png');
    if (fs.existsSync(letterheadPngPath)) {
      try {
        doc.image(letterheadPngPath, 0, 0, {
          width: doc.page.width,
          height: doc.page.height
        });
      } catch (error) {
        console.error('Error adding template:', error.message);
      }
    }
    
    doc.x = 50;
    doc.y = 160;
    
    // Title
    doc.fontSize(20).fillColor('#1a365d').text('USER PROFILE REPORT', { align: 'center' });
    doc.moveDown(0.5);
    
    // Report Info Box
    const infoBoxY = doc.y;
    doc.rect(50, infoBoxY, doc.page.width - 100, 60).fillAndStroke('#e8f4fd', '#1a365d');
    
    doc.fontSize(10).fillColor('#1a365d');
    doc.text(`Report Generated: ${dayjs().format('dddd, MMMM D, YYYY')}`, 60, infoBoxY + 12);
    doc.text(`Generation Time: ${dayjs().format('hh:mm A')}`, 60, infoBoxY + 28);
    doc.text(`User ID: ${user._id}`, 60, infoBoxY + 44);
    
    doc.fontSize(10).fillColor('#28a745');
    doc.text('✓ VERIFIED USER', doc.page.width - 180, infoBoxY + 12);
    doc.fillColor('#17a2b8');
    doc.text('✓ OFFICIAL RECORD', doc.page.width - 180, infoBoxY + 28);
    doc.fillColor('#6c757d');
    doc.text('✓ CONFIDENTIAL', doc.page.width - 180, infoBoxY + 44);
    
    doc.y = infoBoxY + 80;
    doc.moveDown(1);
    
    // User Details Section
    doc.fontSize(14).fillColor('#1a365d').text('USER INFORMATION', 50);
    doc.moveDown(0.5);
    
    const detailsY = doc.y;
    doc.rect(50, detailsY, doc.page.width - 100, 140).fillAndStroke('#ffffff', '#1a365d');
    
    doc.fontSize(11).fillColor('#2c3e50');
    let currentY = detailsY + 15;
    
    const details = [
      { label: 'Full Name:', value: user.name },
      { label: 'Email Address:', value: user.email },
      { label: 'Phone Number:', value: user.phone },
      { label: 'User Type:', value: user.userType.toUpperCase() },
      { label: 'Account Created:', value: dayjs(user.createdAt).format('MMMM D, YYYY [at] hh:mm A') },
      { label: 'Last Updated:', value: dayjs(user.updatedAt).format('MMMM D, YYYY [at] hh:mm A') }
    ];
    
    details.forEach((detail) => {
      doc.fillColor('#6c757d').text(detail.label, 70, currentY, { width: 150 });
      doc.fillColor('#2c3e50').text(detail.value, 230, currentY, { width: 300 });
      currentY += 20;
    });
    
    doc.y = detailsY + 160;
    doc.moveDown(1);
    
    // Account Status Section
    doc.fontSize(14).fillColor('#1a365d').text('ACCOUNT STATUS', 50);
    doc.moveDown(0.5);
    
    const statusY = doc.y;
    doc.rect(50, statusY, doc.page.width - 100, 60).fillAndStroke('#e8f4fd', '#1a365d');
    
    doc.fontSize(10).fillColor('#28a745');
    doc.text('✓ Active Account', 70, statusY + 15);
    doc.text('✓ Verified Email', 70, statusY + 35);
    
    doc.fillColor('#17a2b8');
    doc.text('✓ Valid Phone Number', 250, statusY + 15);
    doc.text(`✓ ${user.userType.charAt(0).toUpperCase() + user.userType.slice(1)} Access`, 250, statusY + 35);
    
    doc.y = statusY + 80;
    doc.moveDown(1);
    
    // Footer
    doc.fontSize(9).fillColor('#6c757d');
    doc.text('This is an official User Profile Report. This document contains confidential information.', 50, doc.y, {
      align: 'center',
      width: doc.page.width - 100
    });
    
    doc.end();
  } catch (err) {
    console.error("Error generating single user PDF:", err.message);
    res.status(500).json({ message: "PDF generation failed due to a server error." });
  }
};

module.exports = { 
  registerUser, 
  getUsers, 
  loginUser, 
  getUserProfile, 
  updateUserProfile, 
  deleteUser, 
  updateUser, 
  getUserStats, 
  updatePassword,
  generateAllUsersPDF,
  generateSingleUserPDF
};
