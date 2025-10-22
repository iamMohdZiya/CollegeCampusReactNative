import { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import apiClient from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await SecureStore.getItemAsync('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await apiClient.post('/auth/login', { email, password });
      await SecureStore.setItemAsync('authToken', data.token);
      await SecureStore.setItemAsync('user', JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw 'Cannot connect to server. Please check your internet connection and make sure the backend is running.';
      }
      throw error.response?.data?.message || error.message || 'Login failed';
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await apiClient.post('/auth/register', userData);
      await SecureStore.setItemAsync('authToken', data.token);
      await SecureStore.setItemAsync('user', JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw 'Cannot connect to server. Please check your internet connection and make sure the backend is running.';
      }
      throw error.response?.data?.message || error.message || 'Registration failed';
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('authToken');
    await SecureStore.deleteItemAsync('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};