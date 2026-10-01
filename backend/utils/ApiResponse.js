'use strict';

/**
 * Standard API success response shape.
 *
 * @param {object} res        - Express response object
 * @param {number} statusCode
 * @param {string} message
 * @param {*}      data
 */
function sendSuccess(res, statusCode = 200, message = 'OK', data = {}) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

module.exports = { sendSuccess };
