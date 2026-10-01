/**
 * utils/validation.js
 *
 * Pure, framework-agnostic validation utilities.
 *
 * Design principles:
 *  - Each rule is a plain function (value) => boolean — easy to unit-test in isolation.
 *  - FIELD_RULES is the single source of truth: rules, messages, and constants live here.
 *  - validateField() short-circuits at the first failure so the user sees one error at a time.
 *  - Nothing in this file imports React — it can be reused in Node.js services or tests.
 */

// Primitive rule helpers
// Each returns true when the value PASSES the rule.

const isNonEmpty     = (value) => typeof value === 'string' && value.trim().length > 0;
const meetsMinLength = (value, min) => value.trim().length >= min;
const matchesPattern = (value, pattern) => pattern.test(value.trim());


// Shared constants — import these wherever you need them so
// they never drift out of sync with the validation rules.

export const FIELD_CONSTRAINTS = {
  message: { minLength: 5, maxLength: 2000 },
};


// Field rule definitions
//
// Each entry is an ordered array of { test, message } objects.
// validateField() walks the array and returns the first failure message.
// Order matters: "required" always comes before "min-length".

const VALID_RATINGS = ['needs-work', 'okay', 'good', 'amazing'];

const FIELD_RULES = {
  message: [
    {
      test:    (value) => isNonEmpty(value),
      message: 'Message is required.',
    },
    {
      test:    (value) => meetsMinLength(value, FIELD_CONSTRAINTS.message.minLength),
      message: `Message must be at least ${FIELD_CONSTRAINTS.message.minLength} characters.`,
    },
  ],
  rating: [
    {
      test:    (value) => VALID_RATINGS.includes(value),
      message: 'Please select a rating.',
    }
  ],
};


// Public API

/**
 * Validate a single field against its registered rules.
 * Stops at the first failing rule (short-circuit) so the user
 * sees one actionable error at a time rather than a pile of messages.
 *
 * @param {string} fieldName - must be a key in FIELD_RULES
 * @param {string} value     - current field value
 * @returns {string}  error message on failure, empty string when valid
 */
export function validateField(fieldName, value) {
  const rules = FIELD_RULES[fieldName];
  if (!rules) return '';

  for (const rule of rules) {
    if (!rule.test(value)) {
      return rule.message;
    }
  }

  return '';
}

/**
 * Validate every known field in formData.
 * Only fields that fail are included in the returned object,
 * so an empty return value means the form is fully valid.
 *
 * @param {object} formData - plain object with field values
 * @returns {{ [fieldName: string]: string }} map of field → error message
 */
export function validateForm(formData) {
  return Object.keys(FIELD_RULES).reduce((errorAccumulator, fieldName) => {
    const errorMessage = validateField(fieldName, formData[fieldName] ?? '');
    if (errorMessage) {
      errorAccumulator[fieldName] = errorMessage;
    }
    return errorAccumulator;
  }, {});
}

/**
 * Returns true only when every field in formData passes all of its rules.
 * Intended for gating a submit button without rendering error messages.
 *
 * @param {object} formData
 * @returns {boolean}
 */
export function isFormComplete(formData) {
  return Object.keys(FIELD_RULES).every(
    (fieldName) => validateField(fieldName, formData[fieldName] ?? '') === ''
  );
}
