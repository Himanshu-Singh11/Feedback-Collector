'use strict';

const mongoose = require('mongoose');
const ApiError  = require('../utils/ApiError');

/**
 * Global Express error-handling middleware.
 * Must be registered LAST in app.js (after all routes).
 *
 * Handles:
 *  - ApiError  → operational errors with a known status code
 *  - Mongoose ValidationError → maps to 400
 *  - Mongoose CastError (bad ObjectId) → maps to 400
 *  - Everything else → 500 Internal Server Error
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  let statusCode = err.statusCode || 500;
  let message    = err.message    || 'Internal Server Error';

  // Mongoose document validation failure
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(' ');
  }

  // Mongoose invalid ObjectId (e.g. GET /api/feedbacks/not-a-valid-id)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'Invalid resource identifier.';
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value for '${field}'.`;
  }

  // Only log stack traces in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[Error] ${statusCode} — ${message}`);
    if (!(err instanceof ApiError)) console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    data: {},
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
