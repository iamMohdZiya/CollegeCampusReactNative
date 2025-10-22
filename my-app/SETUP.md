# Campus Bazaar - Setup Guide

## Backend Setup

1. **Start the Backend Server**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   The backend should start on `http://localhost:5000`

2. **Check Backend is Running**
   Open `http://localhost:5000` in your browser
   You should see: "Campus Bazaar API is running..."

## Frontend Setup

1. **Find Your Computer's IP Address**
   
   **Windows:**
   ```cmd
   ipconfig
   ```
   Look for "IPv4 Address" under your network adapter (usually starts with 192.168.x.x)
   
   **Mac/Linux:**
   ```bash
   ifconfig
   ```
   Look for "inet" under your network adapter

2. **Update API Configuration**
   
   Open `my-app/src/config/api.js`
   
   Replace `192.168.1.100` with your actual IP address:
   ```javascript
   BASE_URL: 'http://YOUR_IP_ADDRESS:5000/api',
   ```

3. **Start the Expo App**
   ```bash
   cd my-app
   npm install
   npx expo start
   ```

4. **Test the Connection**
   - Try to register a new account
   - If it fails, check the console for network errors
   - Make sure both devices (computer and phone) are on the same WiFi network

## Troubleshooting

### Common Issues:

1. **"Network Error" or "Cannot connect to server"**
   - Make sure backend is running on port 5000
   - Check that your IP address is correct in `api.js`
   - Ensure both devices are on the same WiFi network
   - Try restarting both backend and Expo

2. **"Connection refused"**
   - Backend might not be running
   - Check if port 5000 is available
   - Try a different port if needed

3. **"Invalid credentials"**
   - This means connection is working but user doesn't exist
   - Try registering a new account first

### Alternative API URLs to try:

- `http://10.0.2.2:5000/api` (for Android emulator)
- `http://localhost:5000/api` (for iOS simulator)
- `http://YOUR_IP:5000/api` (for physical device)

## Testing the App

1. **Register as Student:**
   - Fill out the registration form
   - Select "Student" role
   - Should redirect to student dashboard

2. **Register as Vendor:**
   - Fill out the registration form
   - Select "Vendor" role
   - Should redirect to vendor dashboard (may need admin approval)

3. **Login:**
   - Use the same credentials you registered with
   - Should redirect to appropriate dashboard based on role

## Backend API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/products` - Get all products
- `POST /api/products` - Add new product (vendor only)
- `POST /api/orders` - Create new order (student only)
- `GET /api/orders/history` - Get order history
- `PUT /api/orders/:id/confirm` - Confirm payment (vendor only)
- `GET /api/admin/vendors` - Get all vendors (admin only)
- `PUT /api/admin/vendors/:id/approve` - Approve vendor (admin only)
