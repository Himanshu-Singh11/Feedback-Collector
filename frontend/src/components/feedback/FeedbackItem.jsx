import React, { useState } from 'react';
import Modal from '../common/Modal';
import styles from './FeedbackItem.module.css';

/* ── Helpers ─────────────────────────────────────────────── */
function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

const AVATAR_PALETTE = [
  '#2563eb', '#7c3aed', '#db2777',
  '#059669', '#d97706', '#0891b2',
];

function getAvatarColor(name = '') {
  const code = name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_PALETTE[code % AVATAR_PALETTE.length];
}

function formatDate(isoString) {
  const date = new Date(isoString);
  const now   = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffDays === 0) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7)  return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* ── Main component ──────────────────────────────────────── */
function FeedbackItem({ feedback, onDelete }) {
  const { _id: itemId, name, email, message, createdAt } = feedback;
  const [expanded, setExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const MAX_CHARS = 160;
  const isLong    = message.length > MAX_CHARS;
  const displayed = isLong && !expanded ? `${message.slice(0, MAX_CHARS).trimEnd()}…` : message;

  const initials = getInitials(name);
  const avatarBg = getAvatarColor(name);

  const handleDeleteRequest = () => {
    if (!onDelete) return;
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteModal(false);
    setIsDeleting(true);
    await onDelete(itemId);
    // If the parent didn't unmount us (e.g. error), reset loading state
    setIsDeleting(false);
  };

  return (
    <>
      <article className={`${styles.item} ${isDeleting ? styles.itemDeleting : ''}`}>
        <div className={styles.topRow}>
          <div
            className={styles.avatar}
            style={{ backgroundColor: avatarBg }}
            aria-hidden="true"
          >
            {initials}
          </div>

          <div className={styles.identity}>
            <span className={styles.name}>{name}</span>
            <span className={styles.email}>{email}</span>
            <span className={styles.statusBadge}>Status: Submitted</span>
          </div>

          <div className={styles.rightMeta}>
            <time className={styles.date} dateTime={createdAt}>
              {formatDate(createdAt)}
            </time>
            {onDelete && (
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={handleDeleteRequest}
                disabled={isDeleting}
                aria-label="Delete feedback"
                title="Delete feedback"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <p className={styles.message}>{displayed}</p>

        {isLong && (
          <button
            type="button"
            className={styles.expandBtn}
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </article>

      {/* ── Delete Confirmation Modal ────────────────────── */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Feedback"
        footer={
          <>
            <button 
              className={styles.cancelBtn} 
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
            <button 
              className={styles.confirmDeleteBtn} 
              onClick={handleConfirmDelete}
            >
              Delete
            </button>
          </>
        }
      >
        <p style={{ margin: 0 }}>Are you sure you want to delete this feedback?</p>
      </Modal>
    </>
  );
}

export default FeedbackItem;
