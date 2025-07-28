// Direct API test voor account creation
// Run dit script met Node.js om de API direct te testen

const https = require('https');
const http = require('http');

console.log('🧪 Direct API Test voor Account Creation')
console.log('========================================')

// Test configuration
const BASE_URL = 'http://localhost:3000' // Change to your dev server URL
const API_ENDPOINT = '/api/auth/create-user'

// Test data
const testEmail = 'test-' + Date.now() + '@example.com'
const testPassword = 'testpassword123'

console.log('📝 Test Configuration:')
console.log('   Base URL:', BASE_URL)
console.log('   API Endpoint:', API_ENDPOINT)
console.log('   Test Email:', testEmail)
console.log('   Test Password:', testPassword)

// Function to make HTTP request
function makeRequest(url, options) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

// Test account creation API
async function testAccountCreation() {
  console.log('\n🎯 Testing Account Creation API...')
  
  const requestBody = JSON.stringify({
    email: testEmail,
    password: testPassword
  });
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody)
    },
    body: requestBody
  };
  
  try {
    console.log('📡 Making API request...')
    console.log('   URL:', BASE_URL + API_ENDPOINT)
    console.log('   Method:', options.method)
    console.log('   Headers:', options.headers)
    console.log('   Body:', requestBody)
    
    const response = await makeRequest(BASE_URL + API_ENDPOINT, options);
    
    console.log('\n📡 API Response:')
    console.log('   Status Code:', response.statusCode)
    console.log('   Headers:', response.headers)
    console.log('   Data:', JSON.stringify(response.data, null, 2))
    
    if (response.statusCode === 200) {
      console.log('\n✅ SUCCESS: Account creation successful!')
      console.log('✅ User should be able to login immediately')
      console.log('✅ No email verification required')
      
      if (response.data.user) {
        console.log('✅ User ID:', response.data.user.id)
        console.log('✅ User Email:', response.data.user.email)
        console.log('✅ Nickname:', response.data.nickname)
      }
    } else {
      console.log('\n❌ FAILED: Account creation failed')
      console.log('❌ Status Code:', response.statusCode)
      console.log('❌ Error:', response.data.error)
    }
    
  } catch (error) {
    console.error('\n❌ API call error:', error.message)
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the development server is running:')
      console.log('   npm run dev')
    }
  }
}

// Test error scenarios
async function testErrorScenarios() {
  console.log('\n🎯 Testing Error Scenarios...')
  
  const scenarios = [
    {
      name: 'Empty email and password',
      body: { email: '', password: '' }
    },
    {
      name: 'Invalid email format',
      body: { email: 'invalid-email', password: 'password123' }
    },
    {
      name: 'Password too short',
      body: { email: 'test@example.com', password: '123' }
    },
    {
      name: 'Missing email',
      body: { password: 'password123' }
    },
    {
      name: 'Missing password',
      body: { email: 'test@example.com' }
    }
  ];
  
  for (const scenario of scenarios) {
    console.log(`\n📝 Testing: ${scenario.name}`)
    
    const requestBody = JSON.stringify(scenario.body);
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody)
      },
      body: requestBody
    };
    
    try {
      const response = await makeRequest(BASE_URL + API_ENDPOINT, options);
      
      console.log('   Status Code:', response.statusCode)
      console.log('   Response:', response.data)
      
      if (response.statusCode === 400) {
        console.log('   ✅ Expected error response')
      } else {
        console.log('   ⚠️ Unexpected response')
      }
      
    } catch (error) {
      console.error('   ❌ Error:', error.message)
    }
  }
}

// Test duplicate email
async function testDuplicateEmail() {
  console.log('\n🎯 Testing Duplicate Email...')
  
  // First, create an account
  const firstAccount = await testAccountCreation();
  
  // Then try to create another account with the same email
  console.log('\n📝 Testing duplicate email scenario...')
  
  const requestBody = JSON.stringify({
    email: testEmail,
    password: 'anotherpassword123'
  });
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody)
    },
    body: requestBody
  };
  
  try {
    const response = await makeRequest(BASE_URL + API_ENDPOINT, options);
    
    console.log('📡 Duplicate Email Response:')
    console.log('   Status Code:', response.statusCode)
    console.log('   Response:', response.data)
    
    if (response.statusCode === 400 && response.data.error.includes('al geregistreerd')) {
      console.log('✅ Expected error for duplicate email')
    } else {
      console.log('⚠️ Unexpected response for duplicate email')
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

// Main test function
async function runAllTests() {
  console.log('🚀 Starting API Tests...\n')
  
  try {
    // Test successful account creation
    await testAccountCreation();
    
    // Test error scenarios
    await testErrorScenarios();
    
    // Test duplicate email
    await testDuplicateEmail();
    
    console.log('\n🎉 All tests completed!')
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error)
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testAccountCreation,
  testErrorScenarios,
  testDuplicateEmail,
  runAllTests
}; 