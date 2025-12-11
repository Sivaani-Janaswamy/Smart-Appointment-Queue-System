const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const ApiError = require('../utils/apiError');

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (excluding password)
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return next(new ApiError('No user found with this id', 401));
      }

      next();
    } catch (error) {
      console.error(error);
      return next(new ApiError('Not authorized, token failed', 401));
    }
  }

  if (!token) {
    return next(new ApiError('Not authorized, no token', 401));
  }
});

// Middleware to check for 'admin' role
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return next(new ApiError('Not authorized as an admin', 403));
  }
};

// Middleware to check for 'agent' or 'admin' role
const isAgent = (req, res, next) => {
    if (req.user && (req.user.role === 'agent' || req.user.role === 'admin')) {
        next();
    } else {
        return next(new ApiError('Not authorized as an agent or admin', 403));
    }
}

module.exports = { protect, isAdmin, isAgent };
