import React from 'react';
import styles from './EmptyState.module.css';

/**
 * Displayed when the filtered feedback list has no results.
 *
 * @param {boolean} isSearching - true when filters/search are active
 */
function EmptyState({ isSearching = false }) {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrap} aria-hidden="true">
        {isSearching ? (
          /* No-results icon */
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        ) : (
          /* Empty inbox icon */
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
          </svg>
        )}
      </div>

      <p className={styles.title}>
        {isSearching ? 'No results found' : 'No feedback yet'}
      </p>
      <p className={styles.subtitle}>
        {isSearching
          ? 'Try adjusting your search or date filter.'
          : 'Submit the first entry using the form on the left.'}
      </p>
    </div>
  );
}

export default EmptyState;
