import React from 'react';
import styles from './DateFilter.module.css';

const OPTIONS = [
  { value: 'all',   label: 'All' },
  { value: 'today', label: 'Today' },
  { value: 'week',  label: 'Last 7 Days' },
  { value: 'month', label: 'Last 30 Days' },
];

/**
 * Dropdown filter for constraining feedbacks by submission date.
 *
 * @param {string}   value    - current filter key
 * @param {function} onChange - (string) => void
 */
function DateFilter({ value, onChange }) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.icon} aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </span>

      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Filter by date"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <span className={styles.chevron} aria-hidden="true">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </div>
  );
}

export default DateFilter;
