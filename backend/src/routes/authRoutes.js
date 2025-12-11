const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  refreshToken,
} = require('../controllers/authController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
// @desc    Register a new user (admin or agent)
// @access  Private (Admin)
// NOTE: Temporarily remove 'protect, isAdmin' to register the first admin user.
router.post('/register', protect, isAdmin, registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user and get tokens
// @access  Public
router.post('/login', loginUser);

// @route   POST /api/auth/refresh
// @desc    Get a new access token using a refresh token
// @access  Public
router.post('/refresh', refreshToken);

// @route   GET /api/auth/me
// @desc    Get current logged-in user's profile
// @access  Private
router.get('/me', protect, getMe);

module.exports = router;
