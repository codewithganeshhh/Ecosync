import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await api.get('/user/profile');
          setUser(data);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data);
    return data;
  };

  const adminLogin = async (email, password) => {
    const { data } = await api.post('/auth/admin/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data);
    return data;
  };

  const signup = async (name, email, password, role = 'user') => {
    const { data } = await api.post('/auth/signup', { name, email, password, role });
    localStorage.setItem('token', data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Updates local user state without a full page reload
  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider value={{ user, login, adminLogin, signup, logout, loading, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
