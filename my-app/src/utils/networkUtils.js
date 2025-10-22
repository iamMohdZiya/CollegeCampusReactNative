// Network utilities for development
import { Platform } from 'react-native';

// Common development IP addresses to try
export const COMMON_IP_ADDRESSES = [
  'http://10.0.2.2:5000/api', // Android emulator
  'http://localhost:5000/api', // iOS simulator
  'http://192.168.1.100:5000/api', // Common home network
  'http://192.168.0.100:5000/api', // Alternative home network
  'http://10.0.0.100:5000/api',
  'http://127.0.0.1:5000/api',
  'http://0.0.0.0:5000/api',
  'http://192.168.1.105:5000/api'
  
  
  
  
  

];

// Get the current platform-specific default
export const getDefaultAPIUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api'; // Android emulator
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:5000/api'; // iOS simulator
  }
  return 'http://192.168.1.100:5000/api'; // Physical device fallback
};

// Test API connection
export const testAPIConnection = async (apiUrl) => {
  try {
    const response = await fetch(`${apiUrl.replace('/api', '')}`, {
      method: 'GET',
      timeout: 5000,
    });
    return response.ok;
  } catch (error) {
    console.log(`Failed to connect to ${apiUrl}:`, error.message);
    return false;
  }
};
