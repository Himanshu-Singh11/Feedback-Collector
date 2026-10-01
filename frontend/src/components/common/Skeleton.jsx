import React from 'react';
import styles from './Skeleton.module.css';



export const SkeletonTableRows = ({ rows = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <tr key={idx} aria-hidden="true">
          <td><div className={`${styles.skeleton} ${styles.text}`}></div></td>
          <td><div className={`${styles.skeleton} ${styles.text}`}></div></td>
          <td><div className={`${styles.skeleton} ${styles.text}`}></div></td>
          <td><div className={`${styles.skeleton} ${styles.text}`}></div></td>
          <td><div className={`${styles.skeleton} ${styles.text}`}></div></td>
        </tr>
      ))}
    </>
  );
};
