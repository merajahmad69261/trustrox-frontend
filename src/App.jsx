import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminPortal from './pages/AdminPortal';
import UserPortal from './pages/UserPortal';
import OwnerPortal from './pages/OwnerPortal';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

// Default route redirect logic based on active user role
const DefaultRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'owner') return <Navigate to="/owner" replace />;
  return <Navigate to="/user" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Root Redirection */}
      <Route path="/" element={<DefaultRedirect />} />

      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Routes by Role */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminPortal />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['user']} />}>
        <Route path="/user" element={<UserPortal />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
        <Route path="/owner" element={<OwnerPortal />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
