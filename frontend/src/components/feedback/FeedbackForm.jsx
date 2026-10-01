import React, { useReducer, useMemo, useCallback } from 'react';
import { validateForm, isFormComplete, FIELD_CONSTRAINTS } from '../../utils/validation';
import LoadingSpinner from '../common/LoadingSpinner';
import styles from './FeedbackForm.module.css';

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

const { minLength: MESSAGE_MIN_LENGTH, maxLength: MESSAGE_MAX_LENGTH } =
  FIELD_CONSTRAINTS.message;

const INITIAL_FORM_DATA = { message: '', rating: '' };

// Tracks which fields the user has interacted with.
// Errors are only displayed for touched fields — prevents showing
// red borders on a freshly opened form.
const INITIAL_TOUCHED = { message: false, rating: false };

const INITIAL_STATE = {
  formData:    INITIAL_FORM_DATA,
  touched:     INITIAL_TOUCHED,
  isSubmitting: false,
  isSubmitted:  false,
};

const RATING_OPTIONS = [
  { value: 'terrible',   emoji: '😞', label: 'Terrible' },
  { value: 'needs-work', emoji: '😕', label: 'Needs work' },
  { value: 'okay',       emoji: '😐', label: "It's okay" },
  { value: 'good',       emoji: '😃', label: 'Pretty good' },
  { value: 'amazing',    emoji: '🤩', label: 'Amazing!' },
];

// ─────────────────────────────────────────────────────────────
// Reducer — all state transitions in one place.
// useReducer is used instead of multiple useState calls to
// batch related updates into a single re-render cycle and make
// state transitions explicit and predictable.
// ─────────────────────────────────────────────────────────────

function formReducer(state, action) {
  switch (action.type) {

    // User typed into a field
    case 'FIELD_CHANGE':
      return {
        ...state,
        formData: { ...state.formData, [action.field]: action.value },
      };

    // User left a field — mark it touched so its error becomes visible
    case 'FIELD_BLUR':
      return {
        ...state,
        touched: { ...state.touched, [action.field]: true },
      };

    // Form submitted — mark all fields touched and begin loading
    case 'SUBMIT_START':
      return {
        ...state,
        isSubmitting: true,
        touched: { message: true, rating: true },
      };

    // Submission succeeded — reset everything, show success banner
    case 'SUBMIT_SUCCESS':
      return { ...INITIAL_STATE, isSubmitted: true };

    // Submission failed — stop loading, keep form data intact
    case 'SUBMIT_FAILURE':
      return { ...state, isSubmitting: false };

    // Auto-hide the success banner after a delay
    case 'DISMISS_SUCCESS':
      return { ...state, isSubmitted: false };

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

/**
 * Controlled feedback form with three fields: Name, Email, Message.
 *
 * @param {function} onSubmit - async (formData: object) => void
 *   Called only when all fields pass validation.
 *   Must return a Promise; the form awaits it before resetting.
 */
function FeedbackForm({ onSubmit }) {
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE);
  const { formData, touched, isSubmitting, isSubmitted } = state;

  // ── Derived state ─────────────────────────────────────────

  // Full error map — recomputed only when formData changes.
  // validateForm() is a pure function so this is safe to memoize.
  const errors = useMemo(() => validateForm(formData), [formData]);

  // Only expose errors for fields the user has already left.
  // This prevents the form from looking broken before any interaction.
  const visibleErrors = useMemo(
    () => ({
      message: touched.message ? (errors.message ?? '') : '',
      rating: touched.rating ? (errors.rating ?? '') : '',
    }),
    [errors, touched]
  );

  // True only when every field passes every rule — drives the submit button.
  const isFormValid = useMemo(() => isFormComplete(formData), [formData]);

  // Character count helpers for the message field
  const messageCharCount   = formData.message.length;
  const messageCharsNeeded = Math.max(0, MESSAGE_MIN_LENGTH - messageCharCount);
  const isNearCharLimit    = messageCharCount >= MESSAGE_MAX_LENGTH * 0.9;

  // ── Handlers ─────────────────────────────────────────────
  // useCallback prevents child re-renders caused by new function references
  // on every render cycle — relevant when the form grows more fields.

  const handleChange = useCallback((e) => {
    dispatch({ type: 'FIELD_CHANGE', field: e.target.name, value: e.target.value });
  }, []);

  const handleRatingSelect = useCallback((value) => {
    // Toggle rating: if clicking the currently selected rating, deselect it
    const newValue = formData.rating === value ? '' : value;
    dispatch({ type: 'FIELD_CHANGE', field: 'rating', value: newValue });
    dispatch({ type: 'FIELD_BLUR', field: 'rating' });
  }, [formData.rating]);

  const handleBlur = useCallback((e) => {
    dispatch({ type: 'FIELD_BLUR', field: e.target.name });
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Mark all fields touched so every error becomes visible on submit
      dispatch({ type: 'SUBMIT_START' });

      // Guard: re-validate on submit in case the button was somehow triggered
      if (!isFormComplete(formData)) {
        dispatch({ type: 'SUBMIT_FAILURE' });
        
        // Show an explicit screen popup (alert) if missing required fields
        if (!formData.rating) {
          window.alert("Please select a rating before submitting!");
        } else if (formData.message.trim().length < 5) {
          window.alert("Please write a message (at least 5 characters) before submitting!");
        }
        
        return;
      }

      try {
        await onSubmit(formData);
        dispatch({ type: 'SUBMIT_SUCCESS' });
        // Auto-dismiss the success banner after 4 seconds
        setTimeout(() => dispatch({ type: 'DISMISS_SUCCESS' }), 4000);
      } catch {
        dispatch({ type: 'SUBMIT_FAILURE' });
      }
    },
    // formData and onSubmit are the only values read inside the callback
    [formData, onSubmit]
  );

  // ── Render ────────────────────────────────────────────────

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} noValidate className={styles.masonryGrid}>
        
        {/* Rating Module */}
        <div className={styles.moduleCard}>
          <h3 className={styles.moduleTitle}>How satisfied are you with our service?</h3>
          <p className={styles.moduleSubtitle}>Vote to let us know how we are doing.</p>
          <div className={styles.ratingGroup}>
            {RATING_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`${styles.ratingBtn} ${formData.rating === opt.value ? styles.ratingBtnActive : ''}`}
                onClick={() => handleRatingSelect(opt.value)}
                aria-pressed={formData.rating === opt.value}
              >
                <span className={styles.emoji}>{opt.emoji}</span>
              </button>
            ))}
          </div>
          <div className={styles.ratingLabelsRow}>
            <span>Very dissatisfied</span>
            <span>Very satisfied</span>
          </div>
          {visibleErrors.rating && (
            <span className={styles.errorMessage} role="alert">
              {visibleErrors.rating}
            </span>
          )}
        </div>

        {/* Message Module */}
        <div className={styles.moduleCard}>
          <h3 className={styles.moduleTitle}>What could we do better?</h3>
          <p className={styles.moduleSubtitle}>Is there anything we could do to make the app better for you?</p>
          
          <textarea
            id="fc-message"
            name="message"
            rows={5}
            maxLength={MESSAGE_MAX_LENGTH}
            placeholder="Type your answer here..."
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-describedby={
              [
                visibleErrors.message ? 'error-message' : null,
                'message-hint',
              ]
                .filter(Boolean)
                .join(' ') || undefined
            }
            aria-invalid={!!visibleErrors.message}
            className={`${styles.textarea} ${visibleErrors.message ? styles.inputError : ''}`}
          />

          <div className={styles.messageFooter}>
            {visibleErrors.message ? (
              <span id="error-message" className={styles.errorMessage} role="alert">
                {visibleErrors.message}
              </span>
            ) : (
              messageCharsNeeded > 0 ? (
                <span id="message-hint" className={styles.hint}>
                  {messageCharsNeeded} more character{messageCharsNeeded !== 1 ? 's' : ''} needed
                </span>
              ) : (
                <span id="message-hint" className={styles.hintValid}>
                  ✓ Minimum length reached
                </span>
              )
            )}
          </div>
        </div>

        {/* Submit Module */}
        <div className={styles.moduleCard}>
          <h3 className={styles.moduleTitle}>Send Feedback</h3>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" color="white" />
                Submitting…
              </>
            ) : (
              'Submit answer'
            )}
          </button>
        </div>

      </form>
    </div>
  );
}

export default FeedbackForm;
