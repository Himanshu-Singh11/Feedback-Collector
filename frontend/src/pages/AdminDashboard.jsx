import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Header from '../components/layout/Header';
import SearchBar from '../components/common/SearchBar';
import DateFilter from '../components/common/DateFilter';
import Toast from '../components/common/Toast';
import { useFeedbackAPI } from '../hooks/useFeedbackAPI';
import { filterFeedbacks } from '../utils/filterFeedback';
import { SkeletonTableRows } from '../components/common/Skeleton';
import styles from './AdminDashboard.module.css';

function AdminDashboard() {
  const { 
    feedbacks, 
    isLoading, 
    error, 
    clearError,
    getFeedback, 
    deleteFeedback
  } = useFeedbackAPI();

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter]   = useState('all');
  const [toast, setToast] = useState(null);
  const [viewingFeedback, setViewingFeedback] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  }, []);

  useEffect(() => {
    if (error) {
      showToast('error', error);
      clearError();
    }
  }, [error, showToast, clearError]);

  useEffect(() => {
    getFeedback();
  }, [getFeedback]);

  const filteredFeedbacks = useMemo(() => {
    return filterFeedbacks(feedbacks, searchQuery, dateFilter);
  }, [feedbacks, searchQuery, dateFilter]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingId) return;
    const result = await deleteFeedback(deletingId);
    setDeletingId(null);
    if (result.success) {
      showToast('success', 'Feedback deleted successfully.');
    }
  }, [deletingId, deleteFeedback, showToast]);

  // Metrics calculations
  const todayCount = useMemo(() => {
    const today = new Date();
    return feedbacks.filter(f => {
      const fd = new Date(f.createdAt);
      return fd.getDate() === today.getDate() && 
             fd.getMonth() === today.getMonth() && 
             fd.getFullYear() === today.getFullYear();
    }).length;
  }, [feedbacks]);


  const recentActivity = feedbacks.slice(0, 5); // Assuming newest first

  return (
    <div className={styles.adminDashboard}>
      <Header totalCount={feedbacks.length} title="Admin Dashboard" onShowToast={showToast} />

      <main className={styles.main}>
        {/* Metrics Row */}
        <div className={styles.metricsRow}>
          <div className={styles.metricCard}>
            <span className={styles.metricTitle}>Total Feedback</span>
            <span className={styles.metricValue}>{feedbacks.length}</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricTitle}>Today's Feedback</span>
            <span className={styles.metricValue}>{todayCount}</span>
          </div>
        </div>

        {/* Content Row */}
        <div className={styles.contentRow}>
          
          {/* Main Table Section */}
          <section className={styles.tableSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Manage Feedback</h2>
              <div className={styles.filterRow}>
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search feedback..."
                />
                <DateFilter value={dateFilter} onChange={setDateFilter} />
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.feedbackTable}>
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">User</th>
                    <th scope="col">Email</th>
                    <th scope="col">Rating</th>
                    <th scope="col">Message</th>
                    <th scope="col" className={styles.actionsCell}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <SkeletonTableRows rows={5} />
                  ) : filteredFeedbacks.length === 0 ? (
                    <tr><td colSpan="5" style={{textAlign: 'center', padding: '1rem'}}>No feedback found.</td></tr>
                  ) : (
                    filteredFeedbacks.map(f => (
                      <tr key={f._id}>
                        <td>{new Date(f.createdAt).toLocaleDateString()}</td>
                        <td>{f.name}</td>
                        <td>{f.email}</td>
                        <td>
                          <span className={styles.ratingBadge}>
                            {{
                              'needs-work': '😞 Needs work',
                              'okay': '😐 Okay',
                              'good': '😃 Good',
                              'amazing': '🤩 Amazing'
                            }[f.rating] || f.rating || 'N/A'}
                          </span>
                        </td>
                        <td className={styles.messageCell} title={f.message}>{f.message}</td>
                        <td className={styles.actionsCell}>
                          <button 
                            onClick={() => setViewingFeedback(f)} 
                            className={styles.viewBtn}
                            title="View full feedback"
                            aria-label={`View feedback from ${f.name}`}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => setDeletingId(f._id)} 
                            className={styles.deleteBtn}
                            title="Delete Feedback"
                            aria-label={`Delete feedback from ${f.name}`}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Activity Section */}
          <aside className={styles.activitySection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recent Activity</h2>
            </div>
            <div className={styles.activityList}>
              {recentActivity.length === 0 ? (
                <span className={styles.activityText}>No recent activity.</span>
              ) : (
                recentActivity.map(act => (
                  <div key={act._id} className={styles.activityItem}>
                    <span className={styles.activityText}>
                      <strong>{act.name}</strong> submitted feedback.
                    </span>
                    <span className={styles.activityTime}>
                      {new Date(act.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      </main>

      {toast && (
        <div style={{position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000}}>
          <Toast 
            type={toast.type} 
            message={toast.message} 
            onClose={() => setToast(null)} 
          />
        </div>
      )}

      {viewingFeedback && (
        <div className={styles.modalOverlay} onClick={() => setViewingFeedback(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Feedback from {viewingFeedback.name}</h3>
              <button className={styles.closeBtn} onClick={() => setViewingFeedback(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalMeta}>
                <div><strong>Email:</strong> {viewingFeedback.email}</div>
                <div><strong>Date:</strong> {new Date(viewingFeedback.createdAt).toLocaleString()}</div>
                <div>
                  <strong>Rating:</strong>{' '}
                  <span className={styles.ratingBadge}>
                    {{
                      'needs-work': '😞 Needs work',
                      'okay': '😐 Okay',
                      'good': '😃 Good',
                      'amazing': '🤩 Amazing'
                    }[viewingFeedback.rating] || viewingFeedback.rating || 'N/A'}
                  </span>
                </div>
              </div>
              <div className={styles.modalMessageBlock}>
                <strong>Message:</strong>
                <p className={styles.modalMessage}>{viewingFeedback.message}</p>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.modalCloseBtn} onClick={() => setViewingFeedback(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
      {deletingId && (
        <div className={styles.modalOverlay} onClick={() => setDeletingId(null)}>
          <div className={styles.deleteModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.deleteModalIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <h3 className={styles.deleteModalTitle}>Delete Feedback</h3>
            <p className={styles.deleteModalText}>
              Are you sure you want to delete this feedback? This action cannot be undone.
            </p>
            <div className={styles.deleteModalActions}>
              <button className={styles.deleteModalCancel} onClick={() => setDeletingId(null)}>
                Cancel
              </button>
              <button className={styles.deleteModalConfirm} onClick={handleDeleteConfirm}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
