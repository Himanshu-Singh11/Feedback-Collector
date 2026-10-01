'use strict';

const ApiError = require('../utils/ApiError');

/**
 * Catches requests to routes that do not exist and forwards
 * a 404 ApiError to the global error handler.
 *
 * Must be registered AFTER all routes and BEFORE errorHandler in app.js.
 */
function notFound(req, res, next) {
  next(new ApiError(404, `Route '${req.originalUrl}' not found.`));
}

module.exports = notFound;
