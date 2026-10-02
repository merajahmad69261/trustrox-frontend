import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('trustrox_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('trustrox_token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await API.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;

      setToken(newToken);
      setUser(userData);
      localStorage.setItem('trustrox_token', newToken);
      localStorage.setItem('trustrox_user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0] || 'Login failed. Check credentials.';
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, address, password) => {
    setLoading(true);
    try {
      const response = await API.post('/auth/signup', { name, email, address, password });
      const { token: newToken, user: userData } = response.data;

      setToken(newToken);
      setUser(userData);
      localStorage.setItem('trustrox_token', newToken);
      localStorage.setItem('trustrox_user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (err) {
      const errors = err.response?.data?.errors || [err.response?.data?.message || 'Registration failed.'];
      return { success: false, errors };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('trustrox_token');
    localStorage.removeItem('trustrox_user');
  };

  const updatePassword = async (oldPassword, newPassword) => {
    setLoading(true);
    try {
      const response = await API.patch('/auth/update-password', { oldPassword, newPassword });
      return { success: true, message: response.data.message };
    } catch (err) {
      const errors = err.response?.data?.errors || [err.response?.data?.message || 'Failed to update password.'];
      return { success: false, errors };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        updatePassword,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
