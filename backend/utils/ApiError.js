'use strict';

/**
 * Custom error class that carries an HTTP status code.
 * Thrown from service/controller layers and caught by the global
 * error-handler middleware, which maps it to the correct HTTP response.
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (e.g. 400, 404, 500)
   * @param {string} message    - Human-readable error description
   */
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name       = 'ApiError';

    // Preserve a clean stack trace in V8 environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

module.exports = ApiError;
