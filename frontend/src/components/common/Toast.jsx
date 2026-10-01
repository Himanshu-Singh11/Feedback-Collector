import React from 'react';
import styles from './Toast.module.css';

/**
 * Simple toast notification.
 *
 * @param {'success'|'error'|'info'} type
 * @param {string} message
 * @param {function} onClose
 */
function Toast({ type = 'info', message, onClose }) {
  return (
    <div className={`${styles.toast} ${styles[type]}`} role="alert">
      <span className={styles.message}>{message}</span>
      <button
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Dismiss notification"
      >
        &times;
      </button>
    </div>
  );
}

export default Toast;
