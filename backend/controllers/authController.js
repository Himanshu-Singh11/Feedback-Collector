'use strict';

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpire } = require('../config/env');
const { sendSuccess } = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

/**
 * Helper to generate JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, { expiresIn: jwtExpire });
};

/**
 * Register a new user
 */
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new ApiError(400, 'User already exists');
    }

    const user = await User.create({ 
      name, 
      email, 
      password,
      role: email.includes('admin') ? 'admin' : 'user'
    });
    const token = generateToken(user._id);

    sendSuccess(res, 201, 'User registered successfully', {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Authenticate a user
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, 'Please provide email and password');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const token = generateToken(user._id);

    sendSuccess(res, 200, 'Logged in successfully', {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get current user profile
 */
async function getProfile(req, res, next) {
  try {
    sendSuccess(res, 200, 'Profile retrieved successfully', {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Change password for the logged-in user
 */
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw new ApiError(400, 'Please provide current and new password');
    }
    if (newPassword.length < 6) {
      throw new ApiError(400, 'New password must be at least 6 characters');
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(currentPassword))) {
      throw new ApiError(401, 'Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    sendSuccess(res, 200, 'Password changed successfully', {});
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  getProfile,
  changePassword,
};
