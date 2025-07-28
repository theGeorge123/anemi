// Test script for password reset flow
// Run this in the browser console

console.log('🧪 Testing Password Reset Flow...')

// Function to test forgot password page
function testForgotPasswordPage() {
  console.log('🎯 Testing Forgot Password Page...')
  
  // Check if we're on the forgot password page
  const isForgotPasswordPage = window.location.pathname === '/auth/forgot-password'
  
  if (isForgotPasswordPage) {
    console.log('✅ Forgot password page detected')
    
    // Check for form elements
    const emailInput = document.querySelector('input[type="email"]')
    const submitButton = document.querySelector('button[type="submit"]')
    const form = document.querySelector('form')
    
    console.log(`📋 Form elements: Email input=${!!emailInput}, Submit button=${!!submitButton}, Form=${!!form}`)
    
    if (emailInput && submitButton && form) {
      console.log('🎉 SUCCESS: Forgot password form elements found!')
      
      // Test form validation
      const testEmail = 'test@example.com'
      emailInput.value = testEmail
      emailInput.dispatchEvent(new Event('input', { bubbles: true }))
      
      console.log('💡 Test email entered:', testEmail)
      console.log('💡 You can now test the submit functionality')
    } else {
      console.log('⚠️ WARNING: Some form elements might be missing')
    }
  } else {
    console.log('💡 Navigate to /auth/forgot-password to test forgot password page')
  }
}

// Function to test reset password page
function testResetPasswordPage() {
  console.log('🎯 Testing Reset Password Page...')
  
  // Check if we're on the reset password page
  const isResetPasswordPage = window.location.pathname === '/auth/reset-password'
  
  if (isResetPasswordPage) {
    console.log('✅ Reset password page detected')
    
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const accessToken = urlParams.get('access_token')
    const refreshToken = urlParams.get('refresh_token')
    const type = urlParams.get('type')
    
    console.log('📋 URL Parameters:')
    console.log(`   Access Token: ${accessToken ? 'Present' : 'Missing'}`)
    console.log(`   Refresh Token: ${refreshToken ? 'Present' : 'Missing'}`)
    console.log(`   Type: ${type || 'Missing'}`)
    
    if (accessToken && refreshToken) {
      console.log('✅ Reset tokens present')
      
      // Check for form elements
      const passwordInput = document.querySelector('input[type="password"]')
      const confirmPasswordInput = document.querySelectorAll('input[type="password"]')[1]
      const submitButton = document.querySelector('button[type="submit"]')
      
      console.log(`📋 Form elements: Password input=${!!passwordInput}, Confirm input=${!!confirmPasswordInput}, Submit button=${!!submitButton}`)
      
      if (passwordInput && confirmPasswordInput && submitButton) {
        console.log('🎉 SUCCESS: Reset password form elements found!')
        
        // Test password validation
        const testPassword = 'newpassword123'
        passwordInput.value = testPassword
        passwordInput.dispatchEvent(new Event('input', { bubbles: true }))
        
        confirmPasswordInput.value = testPassword
        confirmPasswordInput.dispatchEvent(new Event('input', { bubbles: true }))
        
        console.log('💡 Test password entered:', testPassword)
        console.log('💡 You can now test the password reset functionality')
      } else {
        console.log('⚠️ WARNING: Some form elements might be missing')
      }
    } else {
      console.log('⚠️ WARNING: Reset tokens missing - check email link')
    }
  } else {
    console.log('💡 Navigate to /auth/reset-password to test reset password page')
  }
}

// Function to test email flow
function testEmailFlow() {
  console.log('🎯 Testing Email Flow...')
  
  console.log('📝 Expected Email Flow:')
  console.log('   1. User requests password reset on /auth/forgot-password')
  console.log('   2. API sends password reset email with recovery link')
  console.log('   3. User clicks link in email')
  console.log('   4. User lands on /auth/reset-password with tokens')
  console.log('   5. User sets new password')
  console.log('   6. User is redirected to /auth/signin')
  
  console.log('💡 To test this flow:')
  console.log('   1. Go to /auth/forgot-password')
  console.log('   2. Enter a valid email address')
  console.log('   3. Submit the form')
  console.log('   4. Check your email for the reset link')
  console.log('   5. Click the link to test the reset page')
}

// Function to test API endpoint
function testPasswordResetAPI() {
  console.log('🎯 Testing Password Reset API...')
  
  // Test the API endpoint
  fetch('/api/auth/send-password-reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: 'test@example.com' }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('📋 API Response:', data)
    
    if (data.success) {
      console.log('✅ Password reset email sent successfully')
    } else {
      console.log('❌ Password reset email failed:', data.error)
    }
  })
  .catch(error => {
    console.error('❌ API Error:', error)
  })
}

// Function to test token handling
function testTokenHandling() {
  console.log('🎯 Testing Token Handling...')
  
  const urlParams = new URLSearchParams(window.location.search)
  const allParams = Object.fromEntries(urlParams.entries())
  
  console.log('📋 Current URL Parameters:', allParams)
  
  // Check for expected parameters
  const expectedParams = ['access_token', 'refresh_token', 'type']
  const missingParams = expectedParams.filter(param => !urlParams.get(param))
  
  if (missingParams.length === 0) {
    console.log('✅ All expected parameters present')
  } else {
    console.log('⚠️ Missing parameters:', missingParams)
  }
  
  // Test token validation
  const accessToken = urlParams.get('access_token')
  const refreshToken = urlParams.get('refresh_token')
  
  if (accessToken && refreshToken) {
    console.log('✅ Valid tokens detected')
    console.log('💡 Tokens should be used to set Supabase session')
  } else {
    console.log('⚠️ Invalid or missing tokens')
  }
}

// Function to test email templates
function testEmailTemplates() {
  console.log('🎯 Testing Email Templates...')
  
  console.log('📝 Expected Email Templates:')
  console.log('   1. Password Reset Email:')
  console.log('      - Subject: "Password Reset - Anemi Meets"')
  console.log('      - Contains: Reset link with access_token and refresh_token')
  console.log('      - Redirect: /auth/reset-password')
  console.log('   2. Email Verification Email:')
  console.log('      - Subject: "Verify your email - Anemi Meets"')
  console.log('      - Contains: Verification link with token_hash')
  console.log('      - Redirect: /auth/verify-email')
  
  console.log('💡 To test email templates:')
  console.log('   1. Request password reset and check email')
  console.log('   2. Register new account and check verification email')
  console.log('   3. Verify links point to correct pages')
  console.log('   4. Check that tokens are properly passed')
}

// Function to simulate complete password reset flow
function simulatePasswordResetFlow() {
  console.log('🎯 Simulating Complete Password Reset Flow...')
  
  console.log('📝 Complete Flow Steps:')
  console.log('   1. User forgets password')
  console.log('   2. User goes to /auth/forgot-password')
  console.log('   3. User enters email and submits')
  console.log('   4. API sends password reset email')
  console.log('   5. User receives email with reset link')
  console.log('   6. User clicks link and lands on /auth/reset-password')
  console.log('   7. Page extracts tokens from URL')
  console.log('   8. Page sets Supabase session with tokens')
  console.log('   9. User enters new password')
  console.log('   10. API updates user password')
  console.log('   11. User is redirected to /auth/signin')
  console.log('   12. User can login with new password')
  
  console.log('💡 Test this flow manually:')
  console.log('   1. Start at /auth/forgot-password')
  console.log('   2. Follow the steps above')
  console.log('   3. Check each step works correctly')
  console.log('   4. Verify email templates are correct')
  console.log('   5. Confirm tokens are handled properly')
}

// Export functions for manual testing
window.testForgotPasswordPage = testForgotPasswordPage
window.testResetPasswordPage = testResetPasswordPage
window.testEmailFlow = testEmailFlow
window.testPasswordResetAPI = testPasswordResetAPI
window.testTokenHandling = testTokenHandling
window.testEmailTemplates = testEmailTemplates
window.simulatePasswordResetFlow = simulatePasswordResetFlow

console.log('🧪 Password Reset Flow Test Functions Loaded:')
console.log('- testForgotPasswordPage() - Test forgot password page')
console.log('- testResetPasswordPage() - Test reset password page')
console.log('- testEmailFlow() - Show expected email flow')
console.log('- testPasswordResetAPI() - Test password reset API')
console.log('- testTokenHandling() - Test token handling')
console.log('- testEmailTemplates() - Show email template info')
console.log('- simulatePasswordResetFlow() - Show complete flow')

// Auto-detect current page and show relevant tests
const currentPath = window.location.pathname
if (currentPath === '/auth/forgot-password') {
  console.log('🎯 Auto-detected forgot password page')
  console.log('💡 Run testForgotPasswordPage() to test forgot password')
  console.log('💡 Run testPasswordResetAPI() to test API')
} else if (currentPath === '/auth/reset-password') {
  console.log('🎯 Auto-detected reset password page')
  console.log('💡 Run testResetPasswordPage() to test reset password')
  console.log('💡 Run testTokenHandling() to test token handling')
} else {
  console.log('💡 Navigate to /auth/forgot-password to test password reset')
  console.log('💡 Run simulatePasswordResetFlow() to see complete flow')
} 