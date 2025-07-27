// Test script for error handling functionality
// Run this in the browser console

console.log('🧪 Testing Error Handling Functionality...')

// Function to test network error simulation
function testNetworkError() {
  console.log('🎯 Testing Network Error Simulation...')
  
  // Simulate a network error
  const networkError = new Error('Failed to fetch: NetworkError when attempting to fetch resource.')
  
  // Import and use the error service
  if (typeof window !== 'undefined' && window.errorService) {
    const errorInfo = window.errorService.handleError(networkError)
    console.log('✅ Network error handled:', errorInfo)
    return errorInfo
  } else {
    console.log('❌ Error service not available globally')
    console.log('💡 Error should be handled by GlobalErrorHandler component')
    return null
  }
}

// Function to test server error simulation
function testServerError() {
  console.log('🎯 Testing Server Error Simulation...')
  
  // Simulate a server error
  const serverError = new Error('500 Internal Server Error')
  
  if (typeof window !== 'undefined' && window.errorService) {
    const errorInfo = window.errorService.handleError(serverError)
    console.log('✅ Server error handled:', errorInfo)
    return errorInfo
  } else {
    console.log('❌ Error service not available globally')
    console.log('💡 Error should be handled by GlobalErrorHandler component')
    return null
  }
}

// Function to test auth error simulation
function testAuthError() {
  console.log('🎯 Testing Auth Error Simulation...')
  
  // Simulate an auth error
  const authError = new Error('401 Unauthorized: Invalid token')
  
  if (typeof window !== 'undefined' && window.errorService) {
    const errorInfo = window.errorService.handleError(authError)
    console.log('✅ Auth error handled:', errorInfo)
    return errorInfo
  } else {
    console.log('❌ Error service not available globally')
    console.log('💡 Error should be handled by GlobalErrorHandler component')
    return null
  }
}

// Function to test validation error simulation
function testValidationError() {
  console.log('🎯 Testing Validation Error Simulation...')
  
  // Simulate a validation error
  const validationError = new Error('400 Bad Request: Validation failed')
  
  if (typeof window !== 'undefined' && window.errorService) {
    const errorInfo = window.errorService.handleError(validationError)
    console.log('✅ Validation error handled:', errorInfo)
    return errorInfo
  } else {
    console.log('❌ Error service not available globally')
    console.log('💡 Error should be handled by GlobalErrorHandler component')
    return null
  }
}

// Function to test error boundary
function testErrorBoundary() {
  console.log('🎯 Testing Error Boundary...')
  
  // Look for error boundary component
  const errorBoundary = document.querySelector('[class*="error-boundary"]') ||
                       document.querySelector('[data-testid="error-boundary"]')
  
  if (errorBoundary) {
    console.log('✅ Error boundary component found')
  } else {
    console.log('⚠️ Error boundary component not found')
    console.log('💡 Error boundary should be wrapping the app')
  }
}

// Function to test global error handler
function testGlobalErrorHandler() {
  console.log('🎯 Testing Global Error Handler...')
  
  // Look for global error handler component
  const globalErrorHandler = document.querySelector('[class*="global-error-handler"]') ||
                            document.querySelector('[data-testid="global-error-handler"]')
  
  if (globalErrorHandler) {
    console.log('✅ Global error handler component found')
  } else {
    console.log('⚠️ Global error handler component not found')
    console.log('💡 Global error handler should be wrapping the app')
  }
}

// Function to test error modal
function testErrorModal() {
  console.log('🎯 Testing Error Modal...')
  
  // Look for error modal
  const errorModal = document.querySelector('[class*="fixed inset-0"]') ||
                    document.querySelector('[class*="bg-black/50"]')
  
  if (errorModal) {
    console.log('✅ Error modal found')
    
    // Check for modal content
    const modalContent = errorModal.querySelector('[class*="card"]')
    if (modalContent) {
      console.log('✅ Modal content found')
      
      // Check for specific elements
      const title = modalContent.querySelector('h1, h2, h3')
      const buttons = modalContent.querySelectorAll('button')
      const closeButton = modalContent.querySelector('[class*="absolute"]')
      
      console.log(`📋 Modal elements: Title=${!!title}, Buttons=${buttons.length}, Close=${!!closeButton}`)
    }
  } else {
    console.log('⚠️ Error modal not found (this is normal if no error occurred)')
  }
}

// Function to simulate API error
function simulateApiError() {
  console.log('🎯 Simulating API Error...')
  
  // Create a fake fetch that throws an error
  const originalFetch = window.fetch
  window.fetch = function() {
    return Promise.reject(new Error('Failed to fetch: NetworkError when attempting to fetch resource.'))
  }
  
  // Try to fetch something to trigger the error
  fetch('/api/health')
    .catch(error => {
      console.log('✅ API error caught:', error.message)
      
      // Restore original fetch
      window.fetch = originalFetch
      
      // The error should be handled by the GlobalErrorHandler
      console.log('💡 Error should trigger the global error handler')
    })
}

// Function to test 404 page
function test404Page() {
  console.log('🎯 Testing 404 Page...')
  
  // Check if we're on a 404 page
  const is404Page = document.querySelector('h1')?.textContent.includes('404') ||
                   window.location.pathname === '/404' ||
                   document.title.includes('404')
  
  if (is404Page) {
    console.log('✅ 404 page detected')
    
    // Check for 404 page elements
    const searchSection = document.querySelector('input[placeholder*="zoek"]')
    const popularLinks = document.querySelectorAll('a[href="/"], a[href="/create"], a[href="/contact"]')
    const quickActions = document.querySelectorAll('button')
    
    console.log(`📋 404 page elements: Search=${!!searchSection}, Popular links=${popularLinks.length}, Quick actions=${quickActions.length}`)
    
    if (searchSection && popularLinks.length > 0 && quickActions.length > 0) {
      console.log('🎉 SUCCESS: 404 page has all expected elements!')
    } else {
      console.log('⚠️ WARNING: Some 404 page elements might be missing')
    }
  } else {
    console.log('💡 Navigate to a non-existent page to test 404 functionality')
  }
}

// Function to simulate complete error flow
function simulateErrorFlow() {
  console.log('🎯 Simulating Complete Error Flow...')
  
  console.log('📝 Step 1: Error occurs (network, server, auth, validation)')
  console.log('📝 Step 2: Error service detects error type')
  console.log('📝 Step 3: Global error handler shows modal')
  console.log('📝 Step 4: User sees user-friendly message')
  console.log('📝 Step 5: User can retry, go home, or contact support')
  
  console.log('💡 Expected Results:')
  console.log('   - Error type detection (network/server/auth/validation)')
  console.log('   - User-friendly error messages')
  console.log('   - Troubleshooting tips')
  console.log('   - Quick action buttons')
  console.log('   - Help links (contact, system status)')
  console.log('   - Error details (type, code, timestamp)')
}

// Export functions for manual testing
window.testNetworkError = testNetworkError
window.testServerError = testServerError
window.testAuthError = testAuthError
window.testValidationError = testValidationError
window.testErrorBoundary = testErrorBoundary
window.testGlobalErrorHandler = testGlobalErrorHandler
window.testErrorModal = testErrorModal
window.simulateApiError = simulateApiError
window.test404Page = test404Page
window.simulateErrorFlow = simulateErrorFlow

console.log('🧪 Error Handling Test Functions Loaded:')
console.log('- testNetworkError() - Test network error handling')
console.log('- testServerError() - Test server error handling')
console.log('- testAuthError() - Test auth error handling')
console.log('- testValidationError() - Test validation error handling')
console.log('- testErrorBoundary() - Test error boundary component')
console.log('- testGlobalErrorHandler() - Test global error handler')
console.log('- testErrorModal() - Test error modal display')
console.log('- simulateApiError() - Simulate API error')
console.log('- test404Page() - Test 404 page functionality')
console.log('- simulateErrorFlow() - Show complete error flow steps')

// Auto-detect and show relevant tests
const is404Page = document.querySelector('h1')?.textContent.includes('404')
if (is404Page) {
  console.log('🎯 Auto-detected 404 page')
  console.log('💡 Run test404Page() to test 404 functionality')
} else {
  console.log('💡 Run simulateApiError() to test error handling')
  console.log('💡 Navigate to a non-existent page to test 404')
} 