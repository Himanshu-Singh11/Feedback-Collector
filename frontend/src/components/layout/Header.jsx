import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import Logo from '../common/Logo';
import ThemeToggle from '../common/ThemeToggle';
import styles from './Header.module.css';

function Header({ totalCount, title = 'User Dashboard', onShowToast }) {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    logout();
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>

          <div className={styles.brand}>
            <div className={styles.logoMark}>
              <Logo size={32} />
            </div>
            <span className={styles.brandName}>Feedback Collector</span>
            <span className={styles.brandDivider} aria-hidden="true" />
            <span className={styles.brandLabel}>{title}</span>
          </div>

          <div className={styles.meta}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{totalCount}</span>
              <span className={styles.statLabel}>Total Entries</span>
            </div>

            <ThemeToggle className={styles.themeToggle} />

            <div className={styles.userSection}>
              {user && <ProfileDropdown onShowToast={onShowToast} />}
              <button onClick={() => setShowLogoutModal(true)} className={styles.logoutBtn}>
                Logout
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className={styles.logoutOverlay} onClick={() => setShowLogoutModal(false)}>
          <div className={styles.logoutModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.logoutModalIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>
            <h3 className={styles.logoutModalTitle}>Sign Out</h3>
            <p className={styles.logoutModalText}>
              Are you sure you want to log out, <strong>{user?.name}</strong>?
            </p>
            <div className={styles.logoutModalActions}>
              <button className={styles.logoutModalCancel} onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>
              <button className={styles.logoutModalConfirm} onClick={handleLogoutConfirm}>
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Header;
