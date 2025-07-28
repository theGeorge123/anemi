// Test script voor account creation flow
// Run dit script in de browser console op de signup pagina

console.log('👤 Account Creation Test Script')
console.log('================================')

// Function to test signup page
function testSignupPage() {
  console.log('🎯 Testing Signup Page...')
  
  // Check if we're on the signup page
  const isSignupPage = window.location.pathname === '/auth/signup'
  
  if (isSignupPage) {
    console.log('✅ Signup page detected')
    
    // Check for form elements
    const emailInput = document.querySelector('input[type="email"]')
    const passwordInput = document.querySelector('input[type="password"]')
    const submitButton = document.querySelector('button[type="submit"]')
    const form = document.querySelector('form')
    
    console.log(`📋 Form elements: Email input=${!!emailInput}, Password input=${!!passwordInput}, Submit button=${!!submitButton}, Form=${!!form}`)
    
    if (emailInput && passwordInput && submitButton && form) {
      console.log('🎉 SUCCESS: Signup form elements found!')
      
      // Test form validation
      const testEmail = 'test-' + Date.now() + '@example.com'
      const testPassword = 'testpassword123'
      
      console.log('💡 Test credentials:')
      console.log('   Email:', testEmail)
      console.log('   Password:', testPassword)
      
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
    console.log('💡 Navigate to /auth/signup to test signup page')
  }
}

// Function to test account creation API
function testAccountCreationAPI() {
  console.log('🎯 Testing Account Creation API...')
  
  console.log('📝 API Endpoint: /api/auth/create-user')
  console.log('📝 Method: POST')
  console.log('📝 Expected Request Body: { email: "test@example.com", password: "password123" }')
  
  // Test API call
  const testAPI = async () => {
    try {
      const testEmail = 'test-' + Date.now() + '@example.com'
      const testPassword = 'testpassword123'
      
      console.log('📡 Testing with email:', testEmail)
      
      const response = await fetch('/api/auth/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: testEmail,
          password: testPassword
        })
      })
      
      const data = await response.json()
      console.log('📡 API Response:', data)
      console.log('📡 Status Code:', response.status)
      
      if (response.ok) {
        console.log('✅ Account creation successful!')
        console.log('✅ User should be able to login immediately')
        console.log('✅ No email verification required')
      } else {
        console.log('❌ Account creation failed')
        console.log('❌ Error:', data.error)
      }
    } catch (error) {
      console.error('❌ API call error:', error)
    }
  }
  
  console.log('💡 Run testAPI() to test the account creation API')
  window.testAPI = testAPI
}

// Function to test complete signup flow
function testCompleteSignupFlow() {
  console.log('🎯 Testing Complete Signup Flow...')
  
  console.log('📝 Expected Signup Flow:')
  console.log('   1. User goes to /auth/signup')
  console.log('   2. User enters email and password')
  console.log('   3. User submits form')
  console.log('   4. API calls supabaseAdmin.auth.admin.createUser()')
  console.log('   5. API calls confirm_user_email RPC')
  console.log('   6. User email is confirmed in database')
  console.log('   7. User is redirected to /auth/signin')
  console.log('   8. User can login immediately')
  console.log('   9. No email verification required')
  
  console.log('💡 To test this flow:')
  console.log('   1. Go to /auth/signup')
  console.log('   2. Enter a new email address')
  console.log('   3. Enter a password (min 8 characters)')
  console.log('   4. Submit the form')
  console.log('   5. Should redirect to signin page')
  console.log('   6. Try logging in with the new account')
}

// Function to test error scenarios
function testErrorScenarios() {
  console.log('🎯 Testing Error Scenarios...')
  
  console.log('📝 Error Scenarios to Test:')
  console.log('   1. Email already exists')
  console.log('   2. Invalid email format')
  console.log('   3. Password too short')
  console.log('   4. Network errors')
  console.log('   5. Server errors')
  
  console.log('💡 Expected Error Messages:')
  console.log('   - "Dit email adres is al geregistreerd"')
  console.log('   - "Voer een geldig email adres in"')
  console.log('   - "Wachtwoord moet minimaal 8 karakters lang zijn"')
  console.log('   - "Er ging iets mis bij het aanmaken van je account"')
}

// Function to test database integration
function testDatabaseIntegration() {
  console.log('🎯 Testing Database Integration...')
  
  console.log('📝 Database Checks:')
  console.log('   1. User created in auth.users table')
  console.log('   2. email_confirmed_at is set')
  console.log('   3. User record in public.User table')
  console.log('   4. nickname generated and saved')
  console.log('   5. Identity data updated')
  
  console.log('💡 To verify database integration:')
  console.log('   1. Create a test account')
  console.log('   2. Check Supabase dashboard > Authentication > Users')
  console.log('   3. Verify email_confirmed_at is set')
  console.log('   4. Check public.User table for nickname')
}

// Function to test Supabase configuration
function checkSupabaseConfig() {
  console.log('🎯 Checking Supabase Configuration...')
  
  console.log('📝 Required Supabase Settings:')
  console.log('   1. Service Role Key configured')
  console.log('   2. confirm_user_email RPC function exists')
  console.log('   3. Email confirmations can be bypassed')
  console.log('   4. Database permissions for RPC function')
  
  console.log('💡 To check these settings:')
  console.log('   1. Go to Supabase Dashboard')
  console.log('   2. Navigate to SQL Editor')
  console.log('   3. Check if confirm_user_email function exists')
  console.log('   4. Verify service role key in environment')
}

// Function to simulate account creation
function simulateAccountCreation() {
  console.log('🎯 Simulating Account Creation...')
  
  const testEmail = 'test-' + Date.now() + '@example.com'
  const testPassword = 'testpassword123'
  
  console.log('📝 Test Account:')
  console.log('   Email:', testEmail)
  console.log('   Password:', testPassword)
  
  console.log('💡 Steps to test:')
  console.log('   1. Go to /auth/signup')
  console.log('   2. Enter the test email and password')
  console.log('   3. Submit the form')
  console.log('   4. Check if redirects to signin')
  console.log('   5. Try logging in with the account')
  console.log('   6. Verify no email verification needed')
}

// Auto-detect current page and show relevant tests
const currentPath = window.location.pathname
if (currentPath === '/auth/signup') {
  console.log('🎯 Auto-detected signup page')
  console.log('💡 Run testSignupPage() to test signup form')
  console.log('💡 Run testAPI() to test account creation API')
  console.log('💡 Run testCompleteSignupFlow() to see expected flow')
} else {
  console.log('💡 Navigate to /auth/signup to test account creation')
  console.log('💡 Run simulateAccountCreation() to see test account')
  console.log('💡 Run checkSupabaseConfig() to check Supabase settings')
}

// Make functions globally available
window.testSignupPage = testSignupPage
window.testAccountCreationAPI = testAccountCreationAPI
window.testCompleteSignupFlow = testCompleteSignupFlow
window.testErrorScenarios = testErrorScenarios
window.testDatabaseIntegration = testDatabaseIntegration
window.checkSupabaseConfig = checkSupabaseConfig
window.simulateAccountCreation = simulateAccountCreation

console.log('✅ All test functions are now available globally')
console.log('💡 Use the functions above to test different aspects of account creation') 