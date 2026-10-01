import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import styles from './ProfileDropdown.module.css';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

function ProfileDropdown({ onShowToast }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success'|'error', msg }
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setShowChangePassword(false);
        setStatus(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const initial = user?.name?.charAt(0).toUpperCase() || '?';

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setStatus({ type: 'error', msg: 'New passwords do not match.' });
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${BASE_URL}/auth/change-password`,
        { currentPassword: form.currentPassword, newPassword: form.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (onShowToast) {
        onShowToast('success', 'Your password has been updated.');
      } else {
        setStatus({ type: 'success', msg: 'Password changed successfully!' });
      }
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowChangePassword(false);
      setOpen(false);
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.message || 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper} ref={dropdownRef}>
      {/* Trigger */}
      <button
        className={styles.trigger}
        onClick={() => { setOpen((o) => !o); setShowChangePassword(false); setStatus(null); }}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <div className={styles.avatar}>{initial}</div>
        <span className={styles.name}>{user?.name}</span>
        <svg className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className={styles.panel}>
          {!showChangePassword ? (
            <>
              {/* Profile info */}
              <div className={styles.profileSection}>
                <div className={styles.bigAvatar}>{initial}</div>
                <div>
                  <div className={styles.profileName}>{user?.name}</div>
                  <div className={styles.profileEmail}>{user?.email}</div>
                  <span className={styles.roleBadge}>{user?.role}</span>
                </div>
              </div>

              <div className={styles.divider} />

              {/* Actions */}
              <button className={styles.menuItem} onClick={() => setShowChangePassword(true)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Change Password
              </button>
            </>
          ) : (
            <>
              {/* Change password form */}
              <div className={styles.cpHeader}>
                <button className={styles.backBtn} onClick={() => { setShowChangePassword(false); setStatus(null); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <span className={styles.cpTitle}>Change Password</span>
              </div>
              <div className={styles.divider} />

              <form className={styles.cpForm} onSubmit={handleSubmit}>
                {/* Current Password */}
                <div className={styles.cpField}>
                  <label className={styles.cpLabel}>Current Password</label>
                  <div className={styles.pwWrap}>
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      name="currentPassword"
                      value={form.currentPassword}
                      onChange={handleChange}
                      className={styles.cpInput}
                      placeholder="Enter current password"
                      required
                    />
                    <button type="button" className={styles.eyeBtn} onClick={() => setShowCurrent(v => !v)}>
                      {showCurrent
                        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className={styles.cpField}>
                  <label className={styles.cpLabel}>New Password</label>
                  <div className={styles.pwWrap}>
                    <input
                      type={showNew ? 'text' : 'password'}
                      name="newPassword"
                      value={form.newPassword}
                      onChange={handleChange}
                      className={styles.cpInput}
                      placeholder="Min 6 characters"
                      required
                    />
                    <button type="button" className={styles.eyeBtn} onClick={() => setShowNew(v => !v)}>
                      {showNew
                        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className={styles.cpField}>
                  <label className={styles.cpLabel}>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className={styles.cpInput}
                    placeholder="Repeat new password"
                    required
                  />
                </div>

                {status && (
                  <div className={`${styles.statusMsg} ${status.type === 'success' ? styles.statusSuccess : styles.statusError}`}>
                    {status.msg}
                  </div>
                )}

                <button type="submit" className={styles.cpSubmit} disabled={loading}>
                  {loading ? 'Saving…' : 'Update Password'}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
