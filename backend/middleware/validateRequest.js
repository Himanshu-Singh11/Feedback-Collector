'use strict';

const ApiError = require('../utils/ApiError');

/**
 * Factory that creates a middleware to validate the request body
 * against a plain rules object.
 *
 * Rules object shape:
 *   {
 *     fieldName: { required: true, type: 'string' | 'number', ... }
 *   }
 *
 * This is intentionally lightweight — for production use consider
 * integrating Joi or express-validator here.
 *
 * @param {object} rules
 * @returns {Function} Express middleware
 */
function validateRequest(rules) {
  return (req, res, next) => {
    const errors = [];

    for (const [field, constraints] of Object.entries(rules)) {
      const value = req.body[field];

      if (constraints.required && (value === undefined || value === null || value === '')) {
        errors.push(`'${field}' is required.`);
        continue;
      }

      if (value !== undefined && constraints.type && typeof value !== constraints.type) {
        errors.push(`'${field}' must be of type ${constraints.type}.`);
      }
    }

    if (errors.length > 0) {
      return next(new ApiError(400, errors.join(' ')));
    }

    next();
  };
}

module.exports = validateRequest;
