// Test script voor user creation debugging
// Run dit script om te testen of users correct worden aangemaakt

const https = require('https');
const http = require('http');

console.log('🧪 User Creation Debug Test')
console.log('============================')

// Test configuration
const BASE_URL = 'http://localhost:3000'
const API_ENDPOINT = '/api/auth/create-user'

// Test data
const testEmail = 'test-debug-' + Date.now() + '@example.com'
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

// Test user creation API
async function testUserCreation() {
  console.log('\n🎯 Testing User Creation API...')
  
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
      console.log('\n✅ SUCCESS: User creation successful!')
      console.log('✅ User ID:', response.data.user?.id)
      console.log('✅ User Email:', response.data.user?.email)
      console.log('✅ Nickname:', response.data.nickname)
      console.log('✅ User Created Flag:', response.data.userCreated)
      
      // Test if user can be found in database
      await testUserInDatabase(response.data.user?.id);
    } else {
      console.log('\n❌ FAILED: User creation failed')
      console.log('❌ Status Code:', response.statusCode)
      console.log('❌ Error:', response.data.error)
      console.log('❌ Details:', response.data.details)
    }
    
  } catch (error) {
    console.error('\n❌ API call error:', error.message)
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the development server is running:')
      console.log('   npm run dev')
    }
  }
}

// Test if user exists in database
async function testUserInDatabase(userId) {
  console.log('\n🎯 Testing if user exists in database...')
  
  try {
    const response = await fetch(`${BASE_URL}/api/test-db?userId=${userId}`);
    const data = await response.json();
    
    console.log('📊 Database Test Result:')
    console.log('   User ID:', userId)
    console.log('   User Found:', data.userFound)
    console.log('   User Data:', data.user)
    
    if (data.userFound) {
      console.log('✅ SUCCESS: User found in database!')
    } else {
      console.log('❌ FAILED: User not found in database!')
      console.log('❌ This means the user was created in Supabase Auth but not in the database')
    }
  } catch (error) {
    console.error('❌ Database test error:', error.message)
  }
}

// Test environment variables
async function testEnvironmentVariables() {
  console.log('\n🎯 Testing Environment Variables...')
  
  try {
    const response = await fetch(`${BASE_URL}/api/debug-env`);
    const data = await response.json();
    
    console.log('📊 Environment Variables Status:')
    console.log('   Supabase URL:', data.variables?.NEXT_PUBLIC_SUPABASE_URL?.set ? '✅ Set' : '❌ Missing')
    console.log('   Supabase Anon Key:', data.variables?.NEXT_PUBLIC_SUPABASE_ANON_KEY?.set ? '✅ Set' : '❌ Missing')
    console.log('   Supabase Service Role Key:', data.variables?.SUPABASE_SERVICE_ROLE_KEY?.set ? '✅ Set' : '❌ Missing')
    console.log('   Database URL:', data.variables?.DATABASE_URL?.set ? '✅ Set' : '❌ Missing')
    
  } catch (error) {
    console.error('❌ Environment test error:', error.message)
  }
}

// Main test function
async function runAllTests() {
  console.log('🚀 Starting User Creation Debug Tests...\n')
  
  try {
    // Test environment variables first
    await testEnvironmentVariables();
    
    // Test user creation
    await testUserCreation();
    
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
  testUserCreation,
  testUserInDatabase,
  testEnvironmentVariables,
  runAllTests
}; 