import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Header from '../components/layout/Header';
import FeedbackForm from '../components/feedback/FeedbackForm';
import FeedbackList from '../components/feedback/FeedbackList';
import SearchBar from '../components/common/SearchBar';
import DateFilter from '../components/common/DateFilter';
import Toast from '../components/common/Toast';
import { useFeedbackAPI } from '../hooks/useFeedbackAPI';
import { filterFeedbacks } from '../utils/filterFeedback';
import styles from './Dashboard.module.css';

function Dashboard() {
  const { 
    feedbacks, 
    isLoading, 
    error, 
    clearError,
    getFeedback, 
    createFeedback,
    deleteFeedback
  } = useFeedbackAPI();

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter]   = useState('all');
  const [toast, setToast] = useState(null);

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

  const handleSubmit = useCallback(
    async (formData) => {
      const result = await createFeedback(formData);
      if (!result.success) {
        throw new Error(result.error);
      }
      showToast('success', 'Feedback submitted successfully!');
    },
    [createFeedback, showToast]
  );
  
  const handleDelete = useCallback(
    async (id) => {
      const result = await deleteFeedback(id);
      if (result.success) {
        showToast('success', 'Feedback deleted successfully.');
      }
    },
    [deleteFeedback, showToast]
  );

  return (
    <div className={styles.dashboard}>
      <Header totalCount={feedbacks.length} onShowToast={showToast} />

      <main className={styles.main}>
        <aside className={styles.leftPanel}>
          <FeedbackForm onSubmit={handleSubmit} />
        </aside>

        <section className={styles.rightPanel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <h2 className={styles.panelHeading}>My Feedback</h2>
              <span className={styles.countBadge}>{filteredFeedbacks.length}</span>
            </div>
          </div>

          <div className={styles.filterRow}>
            <div className={styles.searchWrapper}>
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by name, email or keyword…"
              />
            </div>
            <DateFilter value={dateFilter} onChange={setDateFilter} />
          </div>

          <div className={styles.listArea}>
            <FeedbackList
              feedbacks={filteredFeedbacks}
              isLoading={isLoading && feedbacks.length === 0} 
              isSearching={searchQuery.trim() !== '' || dateFilter !== 'all'}
            />
          </div>
        </section>
      </main>

      {toast && (
        <div className={styles.toastContainer}>
          <Toast 
            type={toast.type} 
            message={toast.message} 
            onClose={() => setToast(null)} 
          />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
