const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// New addition for OTP storage
let otpStore = {};

// Token function
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }

    // 2. Role-based approval logic
    const needsApproval = role === 'agent' || role === 'owner';

    // 3. Create new user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role || 'customer',
      termsAccepted: true,
      isApproved: !needsApproval 
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: needsApproval 
          ? 'Registration successful! Please wait for admin approval.' 
          : 'Registration completed successfully!',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isApproved: user.isApproved
        }
      });
    }
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server Error' 
    });
  }
});

// @desc    Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all details' });
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if ((user.role === 'agent' || user.role === 'owner') && !user.isApproved) {
      return res.status(403).json({ 
        success: false, 
        message: 'Your account is pending admin approval. Please contact admin.' 
      });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Get Current User Profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching profile data' });
  }
});

// ============================================================
// ADMIN ROUTES
// ============================================================

// 1. Get Pending Users List
router.get('/pending-users', async (req, res) => {
  try {
    const users = await User.find({ isApproved: false }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching pending users' });
  }
});

// 2. Approve User
router.put('/approve-user/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.status(200).json({ success: true, message: 'User approved successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Approval process failed' });
  }
});

// 3. Reject/Delete User
router.delete('/reject-user/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'User registration rejected' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error rejecting user' });
  }
});

// 4. Update Admin Profile
router.put('/update-admin', protect, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updateData = {};
    if (email) updateData.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Admin credentials updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error during update' });
  }
});

// ============================================================
// OTP ROUTES (UPDATED TO MATCH FRONTEND)
// ============================================================

// Frontend uses /api/auth/send-admin-otp
router.post('/send-admin-otp', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Unauthorized' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[req.user.id] = { otp, expires: Date.now() + 300000 }; 
    console.log(`OTP for Admin (${req.user.email}): ${otp}`);
    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error sending OTP' });
  }
});

// Frontend uses /api/auth/update-admin-secure
router.put('/update-admin-secure', protect, async (req, res) => {
  try {
    const { email, password, otp } = req.body;
    const adminId = req.user.id;
    if (!otpStore[adminId] || otpStore[adminId].otp !== otp || Date.now() > otpStore[adminId].expires) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
    const updateData = {};
    if (email) updateData.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    const user = await User.findByIdAndUpdate(adminId, { $set: updateData }, { new: true }).select('-password');
    delete otpStore[adminId];
    res.status(200).json({ success: true, message: 'Admin credentials updated successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error during update' });
  }
});

// ============================================================
// USER MANAGEMENT ROUTES
// ============================================================

// @desc    Get all users list
router.get('/all-users', async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).select('-password');
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
});

// @desc    Update user role
router.put('/update-role/:id', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
});

// @desc    Delete a specific user
router.delete('/delete-user/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
});

module.exports = router;