import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ children }) {
  const { token, user } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Prevent Admins from accessing the regular User dashboard
  if (user && user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ProtectedRoute;
