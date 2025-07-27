// Test script for separated email verification and password reset routes
// Run this in the browser console

console.log('🧪 Testing Email Routes Separation...')

// Function to test email verification route
function testEmailVerificationRoute() {
  console.log('🎯 Testing Email Verification Route...')
  
  // Check if we're on the email verification page
  const isEmailVerificationPage = window.location.pathname === '/auth/verify-email'
  
  if (isEmailVerificationPage) {
    console.log('✅ Email verification page detected')
    
    // Check for email verification specific elements
    const title = document.querySelector('h1, h2, h3')?.textContent
    const hasEmailVerificationContent = title?.includes('Email') || title?.includes('Verifi')
    
    if (hasEmailVerificationContent) {
      console.log('✅ Email verification content found')
      
      // Check for specific elements
      const successIcon = document.querySelector('[class*="CheckCircle"]')
      const errorIcon = document.querySelector('[class*="XCircle"]')
      const resendButton = document.querySelector('button')?.textContent?.includes('Verificatie')
      
      console.log(`📋 Email verification elements: Success icon=${!!successIcon}, Error icon=${!!errorIcon}, Resend button=${!!resendButton}`)
      
      if (successIcon || errorIcon || resendButton) {
        console.log('🎉 SUCCESS: Email verification page has correct elements!')
      } else {
        console.log('⚠️ WARNING: Some email verification elements might be missing')
      }
    } else {
      console.log('❌ ERROR: Email verification content not found')
    }
  } else {
    console.log('💡 Navigate to /auth/verify-email to test email verification')
  }
}

// Function to test password reset route
function testPasswordResetRoute() {
  console.log('🎯 Testing Password Reset Route...')
  
  // Check if we're on the password reset verification page
  const isPasswordResetPage = window.location.pathname === '/auth/verify'
  
  if (isPasswordResetPage) {
    console.log('✅ Password reset verification page detected')
    
    // Check for password reset specific elements
    const title = document.querySelector('h1, h2, h3')?.textContent
    const hasPasswordResetContent = title?.includes('Password') || title?.includes('Reset') || title?.includes('Wachtwoord')
    
    if (hasPasswordResetContent) {
      console.log('✅ Password reset content found')
      
      // Check for specific elements
      const successIcon = document.querySelector('[class*="CheckCircle"]')
      const errorIcon = document.querySelector('[class*="XCircle"]')
      const resetButton = document.querySelector('button')?.textContent?.includes('Reset')
      
      console.log(`📋 Password reset elements: Success icon=${!!successIcon}, Error icon=${!!errorIcon}, Reset button=${!!resetButton}`)
      
      if (successIcon || errorIcon || resetButton) {
        console.log('🎉 SUCCESS: Password reset page has correct elements!')
      } else {
        console.log('⚠️ WARNING: Some password reset elements might be missing')
      }
    } else {
      console.log('❌ ERROR: Password reset content not found')
    }
  } else {
    console.log('💡 Navigate to /auth/verify to test password reset verification')
  }
}

// Function to test route separation
function testRouteSeparation() {
  console.log('🎯 Testing Route Separation...')
  
  const currentPath = window.location.pathname
  
  if (currentPath === '/auth/verify-email') {
    console.log('✅ Email verification route (/auth/verify-email)')
    console.log('💡 This route should handle email verification only')
    testEmailVerificationRoute()
  } else if (currentPath === '/auth/verify') {
    console.log('✅ Password reset route (/auth/verify)')
    console.log('💡 This route should handle password reset verification only')
    testPasswordResetRoute()
  } else if (currentPath === '/auth/reset-password') {
    console.log('✅ Password reset form route (/auth/reset-password)')
    console.log('💡 This route should handle password reset form')
  } else {
    console.log('💡 Navigate to one of these routes to test:')
    console.log('   - /auth/verify-email (email verification)')
    console.log('   - /auth/verify (password reset verification)')
    console.log('   - /auth/reset-password (password reset form)')
  }
}

// Function to test email flow separation
function testEmailFlowSeparation() {
  console.log('🎯 Testing Email Flow Separation...')
  
  console.log('📝 Expected Flow Separation:')
  console.log('   1. Signup → /auth/verify-email (email verification)')
  console.log('   2. Forgot Password → /auth/verify (password reset verification)')
  console.log('   3. Password Reset → /auth/reset-password (password reset form)')
  
  console.log('💡 Test Steps:')
  console.log('   1. Go to /auth/signup and create account')
  console.log('   2. Check that you are redirected to /auth/verify-email')
  console.log('   3. Go to /auth/forgot-password and request reset')
  console.log('   4. Check that you are redirected to /auth/verify')
  console.log('   5. Verify that each route has appropriate content')
}

// Function to test URL parameters
function testUrlParameters() {
  console.log('🎯 Testing URL Parameters...')
  
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token_hash') || urlParams.get('token')
  const email = urlParams.get('email')
  const type = urlParams.get('type')
  
  console.log('📋 Current URL Parameters:')
  console.log(`   Token: ${token ? 'Present' : 'Missing'}`)
  console.log(`   Email: ${email || 'Missing'}`)
  console.log(`   Type: ${type || 'Missing'}`)
  
  if (token && email) {
    console.log('✅ Required parameters present')
  } else {
    console.log('⚠️ Missing required parameters')
  }
}

// Function to test error handling
function testErrorHandling() {
  console.log('🎯 Testing Error Handling...')
  
  // Check for error states
  const errorElements = document.querySelectorAll('[class*="error"], [class*="Error"]')
  const successElements = document.querySelectorAll('[class*="success"], [class*="Success"]')
  
  console.log(`📋 Error/Success Elements: Errors=${errorElements.length}, Success=${successElements.length}`)
  
  if (errorElements.length > 0) {
    console.log('⚠️ Error state detected')
    console.log('💡 Check error message and retry options')
  } else if (successElements.length > 0) {
    console.log('✅ Success state detected')
    console.log('💡 Check redirect behavior')
  } else {
    console.log('💡 No error/success state detected')
  }
}

// Function to simulate different scenarios
function simulateScenarios() {
  console.log('🎯 Simulating Different Scenarios...')
  
  console.log('📝 Test Scenarios:')
  console.log('   1. Valid email verification link')
  console.log('   2. Invalid/expired email verification link')
  console.log('   3. Valid password reset link')
  console.log('   4. Invalid/expired password reset link')
  console.log('   5. Missing parameters')
  
  console.log('💡 To test these scenarios:')
  console.log('   - Use valid links from actual emails')
  console.log('   - Modify URL parameters manually')
  console.log('   - Test with expired tokens')
  console.log('   - Test with missing email/token parameters')
}

// Export functions for manual testing
window.testEmailVerificationRoute = testEmailVerificationRoute
window.testPasswordResetRoute = testPasswordResetRoute
window.testRouteSeparation = testRouteSeparation
window.testEmailFlowSeparation = testEmailFlowSeparation
window.testUrlParameters = testUrlParameters
window.testErrorHandling = testErrorHandling
window.simulateScenarios = simulateScenarios

console.log('🧪 Email Routes Test Functions Loaded:')
console.log('- testEmailVerificationRoute() - Test email verification page')
console.log('- testPasswordResetRoute() - Test password reset verification page')
console.log('- testRouteSeparation() - Test route separation')
console.log('- testEmailFlowSeparation() - Show expected flow separation')
console.log('- testUrlParameters() - Test URL parameters')
console.log('- testErrorHandling() - Test error handling')
console.log('- simulateScenarios() - Show test scenarios')

// Auto-detect current route and show relevant tests
const currentPath = window.location.pathname
if (currentPath === '/auth/verify-email') {
  console.log('🎯 Auto-detected email verification page')
  console.log('💡 Run testEmailVerificationRoute() to test email verification')
} else if (currentPath === '/auth/verify') {
  console.log('🎯 Auto-detected password reset verification page')
  console.log('💡 Run testPasswordResetRoute() to test password reset')
} else if (currentPath === '/auth/reset-password') {
  console.log('🎯 Auto-detected password reset form page')
  console.log('💡 Run testUrlParameters() to test parameters')
} else {
  console.log('💡 Run testRouteSeparation() to check current route')
  console.log('💡 Run testEmailFlowSeparation() to see expected flows')
} 