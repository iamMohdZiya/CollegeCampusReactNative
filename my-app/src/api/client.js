import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '../config/api';

const API_URL = API_CONFIG.BASE_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration and connection errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('authToken');
      // Redirect to login - implement using your navigation logic
    }
    
    // Log connection errors for debugging
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      console.error('Network Error: Make sure the backend server is running and accessible');
      console.error('Current API URL:', API_URL);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;