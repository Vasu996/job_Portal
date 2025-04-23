const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Get user profile
router.get('/profile', auth(['seeker', 'recruiter']), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile picture
router.put('/profile/picture', auth(['seeker', 'recruiter']), upload.single('profilePicture'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
      await user.save();
      res.json({ profilePicture: user.profilePicture });
    } else {
      res.status(400).json({ message: 'No file uploaded' });
    }
  } catch (err) {
    console.error('Error updating profile picture:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;