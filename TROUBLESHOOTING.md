# Campus Bazaar - Troubleshooting Guide

## 🚨 Common Issues and Solutions

### 1. Network Connection Issues

#### Problem: "Network Error" or "Cannot connect to server"

**Step 1: Verify Backend is Running**
```bash
cd backend
npm run dev
```
You should see:
```
🚀 Server running on port 5000
📱 Local: http://localhost:5000
🌐 Network: http://0.0.0.0:5000
📋 API Base: http://localhost:5000/api
🔍 Health Check: http://localhost:5000/health
```

**Step 2: Test Backend Locally**
```bash
cd backend
node test-server.js
```

**Step 3: Check Your IP Address**
- **Windows:** `ipconfig`
- **Mac/Linux:** `ifconfig`
- Look for your local network IP (192.168.x.x or 10.x.x.x)

**Step 4: Update API Configuration**
Open `my-app/src/config/api.js` and update the IP address:
```javascript
BASE_URL: 'http://YOUR_IP_ADDRESS:5000/api',
```

### 2. Port Issues

#### Problem: "Connection refused" or "Port not accessible"

**Check if port 5000 is available:**
```bash
# Windows
netstat -an | findstr :5000

# Mac/Linux
lsof -i :5000
```

**If port is in use, change it:**
1. Update `backend/app.js`:
```javascript
const PORT = process.env.PORT || 5001; // Change to 5001
```

2. Update `my-app/src/config/api.js`:
```javascript
BASE_URL: 'http://YOUR_IP:5001/api',
```

### 3. Database Connection Issues

#### Problem: "MongoDB connection failed"

**Check MongoDB URI in `backend/config/keys.js`:**
```javascript
MONGO_URI: 'mongodb+srv://username:password@cluster.mongodb.net/database'
```

**Test MongoDB connection:**
```bash
cd backend
node -e "require('./config/db')()"
```

### 4. CORS Issues

#### Problem: "CORS error" or "Access blocked"

The backend now has enhanced CORS configuration. If you still get CORS errors:

1. Make sure you're using the updated `backend/app.js`
2. Check that the server is listening on `0.0.0.0:5000` (not just localhost)

### 5. Mobile Device Connection

#### Problem: App works on emulator but not on physical device

**For Physical Device:**
1. Find your computer's IP address
2. Make sure both devices are on the same WiFi network
3. Update the API URL with your computer's IP
4. Test with the network test tool in the app

**For Android Emulator:**
- Use: `http://10.0.2.2:5000/api`

**For iOS Simulator:**
- Use: `http://localhost:5000/api`

### 6. Testing Steps

#### Step 1: Test Backend
```bash
# Start backend
cd backend
npm run dev

# In another terminal, test it
curl http://localhost:5000
curl http://localhost:5000/health
```

#### Step 2: Test from Mobile
1. Open the app
2. Tap "Test Network Connection"
3. Check which URLs work

#### Step 3: Test Registration
1. Try registering a new account
2. Check backend console for any errors
3. Check mobile app console for network errors

### 7. Debug Information

#### Backend Logs
The backend now logs all requests:
```
2024-01-01T12:00:00.000Z - GET /
2024-01-01T12:00:01.000Z - POST /api/auth/register
```

#### Mobile App Logs
Check Expo console for:
- Network errors
- API response errors
- Authentication errors

### 8. Quick Fixes

#### If nothing works:
1. **Restart everything:**
   ```bash
   # Stop backend (Ctrl+C)
   # Stop Expo (Ctrl+C)
   
   # Restart backend
   cd backend
   npm run dev
   
   # Restart Expo
   cd my-app
   npx expo start
   ```

2. **Clear cache:**
   ```bash
   # Clear Expo cache
   npx expo start --clear
   
   # Clear npm cache
   npm cache clean --force
   ```

3. **Check firewall:**
   - Make sure Windows Firewall allows Node.js
   - Check if antivirus is blocking connections

### 9. Alternative Solutions

#### Use ngrok for testing:
```bash
# Install ngrok
npm install -g ngrok

# Start backend
cd backend
npm run dev

# In another terminal, expose port 5000
ngrok http 5000

# Use the ngrok URL in your app
# Example: https://abc123.ngrok.io/api
```

#### Use a different port:
If port 5000 is blocked, try 3000, 8000, or 8080.

### 10. Success Indicators

#### Backend is working when you see:
- Server starts without errors
- MongoDB connection successful
- Health check returns 200 OK
- API endpoints respond correctly

#### Mobile app is working when:
- Network test finds a working connection
- Registration/login succeeds
- No network errors in console
- App navigates to correct screens

## 📞 Still Having Issues?

1. Check the backend console for error messages
2. Check the Expo console for mobile app errors
3. Verify your IP address is correct
4. Make sure both devices are on the same network
5. Try the network test tool in the app
6. Test with curl or Postman first
