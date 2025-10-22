// API Configuration
// Update this file with your computer's IP address for development

import { Platform } from 'react-native';

// For development, replace with your computer's IP address
// To find your IP address:
// Windows: Run 'ipconfig' in command prompt
// Mac/Linux: Run 'ifconfig' in terminal
// Look for your local network IP (usually starts with 192.168.x.x or 10.x.x.x)

export const API_CONFIG = {
  // Try these URLs in order until one works:
  // 1. Android emulator
  // 2. iOS simulator  
  // 3. Physical device (replace with your actual IP)
  // 4. Alternative IPs
  
  BASE_URL: Platform.OS === 'android' 
    ? 'http://10.114.5.50:5000/api'  // Your local IP
    : Platform.OS === 'ios'
    ? 'http://10.114.5.50:5000/api'  // Your local IP
    : 'http://10.114.5.50:5000/api', // Your local IP
  
  // Alternative URLs to try if the above doesn't work:
  ALTERNATIVE_URLS: [
    'http://10.114.5.50:5000/api',  // Your local IP - Primary
    'http://10.0.2.2:5000/api',     // Android emulator fallback
    'http://localhost:5000/api',    // Local fallback
    'http://172.17.128.1:5000/api', // Your vEthernet IP
    'http://10.114.5.86:5000/api',  // Your gateway
  ],
  
  // If you're using a physical device, replace the IP above with your computer's IP
  // Find your IP by running: ipconfig (Windows) or ifconfig (Mac/Linux)
  // Look for something like: 192.168.1.XXX or 192.168.0.XXX
};

export default API_CONFIG;
