#!/usr/bin/env node

/**
 * Basic functionality test script
 * Run with: node scripts/test-basic-functionality.js
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Anemi-Test-Script/1.0'
      }
    };

    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
    }

    const client = urlObj.protocol === 'https:' ? https : http;
    const req = client.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testEndpoint(path, expectedStatus = 200, description = '') {
  try {
    const url = `${BASE_URL}${path}`;
    const response = await makeRequest(url);
    
    if (response.statusCode === expectedStatus) {
      log(`✅ ${description || path} - Status: ${response.statusCode}`, 'green');
      return true;
    } else {
      log(`❌ ${description || path} - Expected ${expectedStatus}, got ${response.statusCode}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ ${description || path} - Error: ${error.message}`, 'red');
    return false;
  }
}

async function testEmailEndpoint() {
  try {
    const testData = {
      testType: 'welcome',
      to: 'test@example.com',
      userName: 'Test User'
    };

    const response = await makeRequest(`${BASE_URL}/api/debug-email`, 'POST', testData);
    
    if (response.statusCode === 200) {
      log('✅ Email debug endpoint working', 'green');
      return true;
    } else {
      log(`❌ Email debug endpoint failed - Status: ${response.statusCode}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Email debug endpoint error: ${error.message}`, 'red');
    return false;
  }
}

async function runTests() {
  log('🧪 Starting Anemi Meets Basic Functionality Tests', 'bold');
  log('='.repeat(60), 'blue');
  
  const tests = [
    { path: '/', description: 'Homepage' },
    { path: '/auth/signup', description: 'Sign Up Page' },
    { path: '/auth/signin', description: 'Sign In Page' },
    { path: '/create', description: 'Create Meetup Page' },
    { path: '/dashboard', description: 'Dashboard Page' },
    { path: '/api/health', description: 'Health Check API' },
    { path: '/api/cafes', description: 'Cafes API' },
    { path: '/api/debug-email', description: 'Debug Email API' }
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  log('\n📋 Testing Basic Endpoints:', 'blue');
  for (const test of tests) {
    const passed = await testEndpoint(test.path, 200, test.description);
    if (passed) passedTests++;
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between tests
  }

  log('\n📧 Testing Email Functionality:', 'blue');
  const emailTestPassed = await testEmailEndpoint();
  if (emailTestPassed) passedTests++;
  totalTests++;

  log('\n' + '='.repeat(60), 'blue');
  log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`, passedTests === totalTests ? 'green' : 'yellow');
  
  if (passedTests === totalTests) {
    log('🎉 All basic tests passed!', 'green');
  } else {
    log('⚠️  Some tests failed. Check the issues above.', 'yellow');
  }

  log('\n📝 Next Steps:', 'blue');
  log('1. Run manual tests using the checklist in TESTING_CHECKLIST.md');
  log('2. Test user flows (signup, create meetup, accept invite)');
  log('3. Test email functionality at /debug-email');
  log('4. Test responsive design on mobile devices');
  log('5. Test all user types from the checklist');
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, testEndpoint, testEmailEndpoint }; 