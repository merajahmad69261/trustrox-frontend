import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect user to their designated portal if attempting to access forbidden route
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'owner') return <Navigate to="/owner" replace />;
    if (user.role === 'user') return <Navigate to="/user" replace />;
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
