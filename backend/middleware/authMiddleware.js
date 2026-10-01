'use strict';

const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, jwtSecret);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return next(new ApiError(401, 'The user belonging to this token no longer exists.'));
      }
      next();
    } catch (err) {
      next(new ApiError(401, 'Not authorized, token failed'));
    }
  } else {
    next(new ApiError(401, 'Not authorized, no token'));
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, `User role ${req.user ? req.user.role : 'unknown'} is not authorized to access this route`));
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
