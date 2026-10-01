import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

/**
 * Reusable Modal component using React Portals.
 * Can be reused across the application for any confirmation or dialog.
 * 
 * @param {boolean} isOpen   - Controls modal visibility
 * @param {function} onClose - Function to call when dismissing the modal
 * @param {string} title     - Header title of the modal
 * @param {node} children    - Main body content
 * @param {node} footer      - Optional action buttons area
 */
function Modal({ isOpen, onClose, title, children, footer }) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Render into the DOM body directly so it sits above all other stacking contexts
  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div 
        className={styles.modal} 
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
      >
        <div className={styles.header}>
          <h3 id="modal-title" className={styles.title}>{title}</h3>
          <button 
            type="button" 
            className={styles.closeBtn} 
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        
        <div className={styles.body}>
          {children}
        </div>
        
        {footer && (
          <div className={styles.footer}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
