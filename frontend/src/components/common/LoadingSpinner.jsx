import React from 'react';
import styles from './LoadingSpinner.module.css';

/**
 * A circular loading indicator.
 *
 * @param {'sm'|'md'|'lg'} size
 * @param {'blue'|'white'|'gray'} color
 */
function LoadingSpinner({ size = 'md', color = 'blue' }) {
  return (
    <span
      className={`${styles.ring} ${styles[size]} ${styles[color]}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export default LoadingSpinner;
