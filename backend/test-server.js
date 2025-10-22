// Simple test script to verify backend server is working
const axios = require('axios');

const testUrls = [
  'http://localhost:5000',
  'http://localhost:5000/health',
  'http://localhost:5000/api',
];

async function testServer() {
  console.log('🧪 Testing Backend Server...\n');
  
  for (const url of testUrls) {
    try {
      console.log(`Testing: ${url}`);
      const response = await axios.get(url, { timeout: 5000 });
      console.log(`✅ SUCCESS - Status: ${response.status}`);
      console.log(`   Response:`, response.data);
    } catch (error) {
      console.log(`❌ FAILED - ${error.message}`);
    }
    console.log('');
  }
  
  console.log('🔍 Server Test Complete!');
}

testServer();
