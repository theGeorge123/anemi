// Test script voor password reset flow
// Run dit script in de browser console op de password reset pagina's

console.log('🔐 Password Reset Flow Test Script')
console.log('=====================================')

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
      
      // Check if submit button is enabled
      const isButtonEnabled = !submitButton.disabled
      console.log(`💡 Submit button enabled: ${isButtonEnabled}`)
      
      // Check for error handling
      const errorElements = document.querySelectorAll('.text-red-500, .bg-red-50')
      console.log(`💡 Error elements found: ${errorElements.length}`)
      
    } else {
      console.log('⚠️ WARNING: Some form elements might be missing')
    }
  } else {
    console.log('💡 Navigate to /auth/forgot-password to test forgot password page')
  }
}

// Function to test password reset API
function testPasswordResetAPI() {
  console.log('🎯 Testing Password Reset API...')
  
  console.log('📝 API Endpoint: /api/auth/send-password-reset')
  console.log('📝 Method: POST')
  console.log('📝 Expected Request Body: { email: "user@example.com" }')
  
  // Test API call
  const testAPI = async () => {
    try {
      const response = await fetch('/api/auth/send-password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'test@example.com' })
      })
      
      const data = await response.json()
      console.log('📡 API Response:', data)
      console.log('📡 Status Code:', response.status)
      
      if (response.ok) {
        console.log('✅ API call successful')
      } else {
        console.log('❌ API call failed')
      }
    } catch (error) {
      console.error('❌ API call error:', error)
    }
  }
  
  console.log('💡 Run testAPI() to test the API endpoint')
  window.testAPI = testAPI
}

// Function to test reset password page
function testResetPasswordPage() {
  console.log('🎯 Testing Reset Password Page...')
  
  // Check if we're on the reset password page
  const isResetPasswordPage = window.location.pathname === '/auth/reset-password'
  
  if (isResetPasswordPage) {
    console.log('✅ Reset password page detected')
    
    // Check for form elements
    const passwordInput = document.querySelector('input[type="password"]')
    const confirmPasswordInput = document.querySelectorAll('input[type="password"]')[1]
    const submitButton = document.querySelector('button[type="submit"]')
    const form = document.querySelector('form')
    
    console.log(`📋 Form elements: Password input=${!!passwordInput}, Confirm password input=${!!confirmPasswordInput}, Submit button=${!!submitButton}, Form=${!!form}`)
    
    if (passwordInput && confirmPasswordInput && submitButton && form) {
      console.log('🎉 SUCCESS: Reset password form elements found!')
      
      // Check if page shows invalid link error
      const invalidLinkError = document.querySelector('.text-red-700')
      if (invalidLinkError) {
        console.log('⚠️ WARNING: Page shows invalid reset link error')
        console.log('💡 This might be expected if accessed without a valid reset link')
      }
      
      // Check for session validation
      console.log('💡 Page should validate session automatically')
      console.log('💡 If session is valid, form should be shown')
      console.log('💡 If session is invalid, error should be shown')
      
    } else {
      console.log('⚠️ WARNING: Some form elements might be missing')
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
  console.log('   2. API calls supabase.auth.resetPasswordForEmail()')
  console.log('   3. Supabase sends password reset email with recovery link')
  console.log('   4. User clicks link in email')
  console.log('   5. User lands on /auth/reset-password with valid session')
  console.log('   6. User sets new password')
  console.log('   7. User is redirected to /auth/signin')
  
  console.log('💡 To test this flow:')
  console.log('   1. Go to /auth/forgot-password')
  console.log('   2. Enter a valid email address')
  console.log('   3. Submit the form')
  console.log('   4. Check your email for the reset link')
  console.log('   5. Click the link to test the reset page')
}

// Function to test session handling
function testSessionHandling() {
  console.log('🎯 Testing Session Handling...')
  
  // Check current session
  const checkSession = async () => {
    try {
      // This would need to be run in a context with Supabase client
      console.log('💡 Session should be checked automatically by the page')
      console.log('💡 If session is valid, user can reset password')
      console.log('💡 If session is invalid, show error message')
    } catch (error) {
      console.error('❌ Session check error:', error)
    }
  }
  
  console.log('💡 Session validation happens automatically on page load')
}

// Function to simulate complete password reset flow
function simulatePasswordResetFlow() {
  console.log('🎯 Simulating Complete Password Reset Flow...')
  
  console.log('📝 Complete Flow Steps:')
  console.log('   1. User forgets password')
  console.log('   2. User goes to /auth/forgot-password')
  console.log('   3. User enters email and submits')
  console.log('   4. API calls supabase.auth.resetPasswordForEmail()')
  console.log('   5. Supabase sends password reset email')
  console.log('   6. User receives email with reset link')
  console.log('   7. User clicks link and lands on /auth/reset-password')
  console.log('   8. Page validates session automatically')
  console.log('   9. If valid session, show password reset form')
  console.log('   10. User enters new password')
  console.log('   11. API updates user password')
  console.log('   12. User is redirected to /auth/signin')
  console.log('   13. User can login with new password')
  
  console.log('💡 Test this flow manually:')
  console.log('   1. Start at /auth/forgot-password')
  console.log('   2. Follow the steps above')
  console.log('   3. Check each step works correctly')
  console.log('   4. Verify email templates are correct')
  console.log('   5. Confirm session handling works properly')
}

// Function to test error handling
function testErrorHandling() {
  console.log('🎯 Testing Error Handling...')
  
  console.log('📝 Error Scenarios to Test:')
  console.log('   1. Non-existent email address')
  console.log('   2. Invalid reset link')
  console.log('   3. Expired reset link')
  console.log('   4. Network errors')
  console.log('   5. Server errors')
  
  console.log('💡 Expected Error Messages:')
  console.log('   - "Geen account gevonden met dit email adres"')
  console.log('   - "Ongeldige of ontbrekende reset link"')
  console.log('   - "Er ging iets mis. Probeer opnieuw."')
}

// Function to check Supabase configuration
function checkSupabaseConfig() {
  console.log('🎯 Checking Supabase Configuration...')
  
  console.log('📝 Required Supabase Settings:')
  console.log('   1. Email Templates > Reset Password template configured')
  console.log('   2. URL Configuration > Site URL set correctly')
  console.log('   3. URL Configuration > Redirect URLs include /auth/reset-password')
  console.log('   4. Authentication Settings > Email confirmations enabled')
  
  console.log('💡 To check these settings:')
  console.log('   1. Go to Supabase Dashboard')
  console.log('   2. Navigate to Authentication > Email Templates')
  console.log('   3. Check "Reset Password" template')
  console.log('   4. Navigate to Authentication > URL Configuration')
  console.log('   5. Verify Site URL and Redirect URLs')
}

// Auto-detect current page and show relevant tests
const currentPath = window.location.pathname
if (currentPath === '/auth/forgot-password') {
  console.log('🎯 Auto-detected forgot password page')
  console.log('💡 Run testForgotPasswordPage() to test forgot password')
  console.log('💡 Run testPasswordResetAPI() to test API')
  console.log('💡 Run testEmailFlow() to see expected email flow')
} else if (currentPath === '/auth/reset-password') {
  console.log('🎯 Auto-detected reset password page')
  console.log('💡 Run testResetPasswordPage() to test reset password')
  console.log('💡 Run testSessionHandling() to test session handling')
} else {
  console.log('💡 Navigate to /auth/forgot-password to test password reset')
  console.log('💡 Run simulatePasswordResetFlow() to see complete flow')
  console.log('💡 Run checkSupabaseConfig() to check Supabase settings')
}

// Make functions globally available
window.testForgotPasswordPage = testForgotPasswordPage
window.testPasswordResetAPI = testPasswordResetAPI
window.testResetPasswordPage = testResetPasswordPage
window.testEmailFlow = testEmailFlow
window.testSessionHandling = testSessionHandling
window.simulatePasswordResetFlow = simulatePasswordResetFlow
window.testErrorHandling = testErrorHandling
window.checkSupabaseConfig = checkSupabaseConfig

console.log('✅ All test functions are now available globally')
console.log('💡 Use the functions above to test different aspects of the password reset flow') 