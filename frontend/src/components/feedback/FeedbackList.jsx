import React from 'react';
import FeedbackItem from './FeedbackItem';
import EmptyState from '../common/EmptyState';
import styles from './FeedbackList.module.css';

/**
 * Renders loading skeleton → empty state → ordered list of FeedbackItem cards.
 *
 * @param {Array}    feedbacks
 * @param {boolean}  isLoading
 * @param {boolean}  isSearching - true when search/filter is active (changes EmptyState copy)
 * @param {Function} onDelete    - (id) => void
 */
function FeedbackList({ feedbacks = [], isLoading = false, isSearching = false, onDelete }) {
  if (isLoading) {
    return (
      <ul className={styles.list} aria-busy="true" aria-live="polite">
        {[1, 2, 3].map((key) => (
          <li key={key} className={styles.skeletonItem}>
            <div className={styles.skeletonTop}>
              <div className={styles.skeletonAvatar} />
              <div className={styles.skeletonIdentity}>
                <div className={styles.skeletonText} style={{ width: '120px' }} />
                <div className={styles.skeletonText} style={{ width: '160px', height: '12px' }} />
              </div>
            </div>
            <div className={styles.skeletonText} style={{ width: '90%' }} />
            <div className={styles.skeletonText} style={{ width: '80%' }} />
            <div className={styles.skeletonText} style={{ width: '60%' }} />
          </li>
        ))}
      </ul>
    );
  }

  if (feedbacks.length === 0) {
    return <EmptyState isSearching={isSearching} />;
  }

  return (
    <ul className={styles.list}>
      {feedbacks.map((fb) => (
        <li key={fb._id}>
          <FeedbackItem feedback={fb} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}

export default FeedbackList;
