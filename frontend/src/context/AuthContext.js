import React, { createContext, useState, useEffect } from 'react';
import API from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (!token || !savedUser) {
      setLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setLoading(false);
      
      // Background verification
      verifyTokenInBackground();
      
    } catch (error) {
      console.error('Error in initializeAuth:', error);
      setLoading(false);
    }
  };

  const verifyTokenInBackground = async () => {
    try {
      const { data } = await API.get('/auth/me');
      
      if (data?.user) {
        // Check if status field exists and is not active
        // Only logout if status is explicitly set and not active (exclude customers)
        if (data.user.status && data.user.status !== 'active' && data.user.role !== 'customer') {
          logout();
        } else {
          // Update user with fresh data
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
    } catch (error) {
      console.error('Token verification error:', error);
      // Only logout on auth errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
      }
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      
      if (data?.user?.status === 'pending') {
        throw new Error("Your account is pending admin approval.");
      }

      if (data?.token && data?.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      }
      return data;
    } catch (error) {
      throw error; 
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await API.post('/auth/register', userData);
      
      if (data?.needsApproval) {
        return data;
      }

      if (data?.token && data?.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
