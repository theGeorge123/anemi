// Test script for password reset flow
// Run this in the browser console

console.log('🧪 Testing Password Reset Flow...')

// Function to test the complete password reset flow
function testPasswordResetFlow() {
  console.log('🎯 Step 1: Navigate to forgot password page')
  console.log('🎯 Step 2: Enter email and submit')
  console.log('🎯 Step 3: Check email for reset link')
  console.log('🎯 Step 4: Click reset link')
  console.log('🎯 Step 5: Set new password')
  console.log('🎯 Expected: Password reset success')
  
  // Check if we're on the forgot password page
  if (window.location.pathname !== '/auth/forgot-password') {
    console.log('❌ Not on forgot password page. Navigate to /auth/forgot-password first')
    return
  }
  
  console.log('✅ On forgot password page')
  
  // Look for the email input
  const emailInput = document.querySelector('input[type="email"]')
  if (!emailInput) {
    console.log('❌ Email input not found')
    return
  }
  
  console.log('✅ Email input found')
  
  // Look for the submit button
  const submitButton = document.querySelector('button[type="submit"]')
  if (!submitButton) {
    console.log('❌ Submit button not found')
    return
  }
  
  console.log('✅ Submit button found')
  console.log('🎯 Ready to test! Enter an email and click submit')
  
  // Add submit listener to monitor what happens
  const form = emailInput.closest('form')
  if (form) {
    const originalSubmit = form.onsubmit
    form.onsubmit = function(e) {
      console.log('🎯 Form submitted!')
      console.log('🎯 Email:', emailInput.value)
      console.log('🎯 Checking if reset email is sent...')
      
      // Check if success message appears within 3 seconds
      setTimeout(() => {
        const successMessage = document.querySelector('.text-green-700') ||
                              document.querySelector('[class*="green"]')
        
        if (successMessage && successMessage.textContent.includes('Email Verzonden')) {
          console.log('✅ SUCCESS: Password reset email sent!')
          console.log('💡 Check your email for the reset link')
          console.log('💡 The link should go to /auth/reset-password')
        } else {
          console.log('❌ FAILED: No success message found')
          console.log('❌ Check for error messages')
        }
      }, 3000)
      
      // Call original submit
      if (originalSubmit) {
        originalSubmit.call(this, e)
      }
    }
  }
}

// Function to test the reset password page
function testResetPasswordPage() {
  console.log('🎯 Testing Reset Password Page...')
  
  // Check if we're on the reset password page
  if (window.location.pathname !== '/auth/reset-password') {
    console.log('❌ Not on reset password page. Navigate to /auth/reset-password first')
    return
  }
  
  console.log('✅ On reset password page')
  
  // Check for URL parameters
  const urlParams = new URLSearchParams(window.location.search)
  const accessToken = urlParams.get('access_token')
  const refreshToken = urlParams.get('refresh_token')
  
  if (!accessToken || !refreshToken) {
    console.log('❌ Missing reset tokens in URL')
    console.log('💡 This page should be accessed via a reset email link')
    return
  }
  
  console.log('✅ Reset tokens found in URL')
  console.log('🎯 Ready to test password reset!')
  
  // Look for password inputs
  const passwordInput = document.querySelector('input[type="password"]')
  const confirmPasswordInput = document.querySelectorAll('input[type="password"]')[1]
  
  if (!passwordInput || !confirmPasswordInput) {
    console.log('❌ Password inputs not found')
    return
  }
  
  console.log('✅ Password inputs found')
  
  // Look for submit button
  const submitButton = document.querySelector('button[type="submit"]')
  if (!submitButton) {
    console.log('❌ Submit button not found')
    return
  }
  
  console.log('✅ Submit button found')
  console.log('🎯 Ready to test! Enter a new password and submit')
  
  // Add submit listener
  const form = passwordInput.closest('form')
  if (form) {
    const originalSubmit = form.onsubmit
    form.onsubmit = function(e) {
      console.log('🎯 Password reset form submitted!')
      console.log('🎯 Checking if password is updated...')
      
      // Check if success message appears within 3 seconds
      setTimeout(() => {
        const successMessage = document.querySelector('.text-green-700') ||
                              document.querySelector('[class*="green"]')
        
        if (successMessage && successMessage.textContent.includes('Wachtwoord Gewijzigd')) {
          console.log('✅ SUCCESS: Password reset completed!')
          console.log('💡 You can now login with your new password')
        } else {
          console.log('❌ FAILED: No success message found')
          console.log('❌ Check for error messages')
        }
      }, 3000)
      
      // Call original submit
      if (originalSubmit) {
        originalSubmit.call(this, e)
      }
    }
  }
}

// Function to simulate the complete flow
function simulatePasswordResetFlow() {
  console.log('🎯 Simulating Complete Password Reset Flow...')
  
  // Step 1: Go to forgot password page
  console.log('📝 Step 1: Navigate to /auth/forgot-password')
  
  // Step 2: Fill in email
  console.log('📝 Step 2: Enter your email address')
  
  // Step 3: Submit form
  console.log('📝 Step 3: Click "Reset Link Versturen"')
  
  // Step 4: Check email
  console.log('📝 Step 4: Check your email for reset link')
  console.log('📝 Step 5: Click the reset link in the email')
  console.log('📝 Step 6: Enter new password on reset page')
  console.log('📝 Step 7: Confirm new password')
  console.log('📝 Step 8: Click "Wachtwoord Wijzigen"')
  
  console.log('💡 Expected Flow:')
  console.log('   - Email sent with reset link')
  console.log('   - Reset link goes to /auth/reset-password')
  console.log('   - Reset page shows password form')
  console.log('   - Password update succeeds')
  console.log('   - Success message appears')
}

// Export functions for manual testing
window.testPasswordResetFlow = testPasswordResetFlow
window.testResetPasswordPage = testResetPasswordPage
window.simulatePasswordResetFlow = simulatePasswordResetFlow

console.log('🧪 Password Reset Test Functions Loaded:')
console.log('- testPasswordResetFlow() - Test forgot password page')
console.log('- testResetPasswordPage() - Test reset password page')
console.log('- simulatePasswordResetFlow() - Show complete flow steps')

// Auto-detect current page and show relevant test
if (window.location.pathname === '/auth/forgot-password') {
  console.log('🎯 Auto-detected forgot password page')
  console.log('💡 Run testPasswordResetFlow() to start testing')
} else if (window.location.pathname === '/auth/reset-password') {
  console.log('🎯 Auto-detected reset password page')
  console.log('💡 Run testResetPasswordPage() to start testing')
} else {
  console.log('💡 Navigate to /auth/forgot-password to test password reset flow')
} 