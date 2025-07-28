// Test script for improved error pages
// Run this in the browser console

console.log('🧪 Testing Error Pages...')

// Function to test 404 page
function test404Page() {
  console.log('🎯 Testing 404 Page...')
  
  // Check if we're on a 404 page
  const is404Page = window.location.pathname === '/404' || 
                   document.title.includes('404') ||
                   document.querySelector('[class*="404"]')
  
  if (is404Page) {
    console.log('✅ 404 page detected')
    
    // Check for 404 page elements
    const searchInput = document.querySelector('input[placeholder*="zoek"]')
    const popularLinks = document.querySelectorAll('a[href]')
    const homeButton = document.querySelector('button[class*="bg-amber-600"]')
    const helpSection = document.querySelector('[class*="bg-amber-50"]')
    
    console.log(`📋 404 Page elements: Search=${!!searchInput}, Popular links=${popularLinks.length}, Home button=${!!homeButton}, Help section=${!!helpSection}`)
    
    if (searchInput && popularLinks.length > 0 && homeButton && helpSection) {
      console.log('🎉 SUCCESS: 404 page has all expected elements!')
    } else {
      console.log('⚠️ Some 404 page elements missing')
    }
  } else {
    console.log('💡 Navigate to a non-existent page to test 404')
    console.log('💡 Try: /this-page-does-not-exist')
  }
}

// Function to test invite error pages
function testInviteErrorPages() {
  console.log('🎯 Testing Invite Error Pages...')
  
  // Check if we're on an invite page
  const isInvitePage = window.location.pathname.startsWith('/invite/')
  
  if (isInvitePage) {
    console.log('✅ Invite page detected')
    
    // Check for error state
    const errorMessage = document.querySelector('[class*="text-gray-600"]')
    const errorIcon = document.querySelector('[class*="text-4xl"]')
    const homeButton = document.querySelector('button[class*="bg-gradient"]')
    const helpSection = document.querySelector('[class*="bg-blue-50"]')
    const contactSection = document.querySelector('[class*="bg-amber-50"]')
    
    if (errorMessage && errorIcon) {
      console.log('⚠️ Error state detected on invite page')
      console.log('📋 Error elements: Icon=' + !!errorIcon + ', Message=' + !!errorMessage + ', Home button=' + !!homeButton + ', Help=' + !!helpSection + ', Contact=' + !!contactSection)
      
      if (homeButton && helpSection && contactSection) {
        console.log('🎉 SUCCESS: Invite error page has all expected elements!')
      } else {
        console.log('⚠️ Some invite error page elements missing')
      }
    } else {
      console.log('✅ No error state - invite page is working normally')
    }
  } else {
    console.log('💡 Navigate to an invalid invite URL to test error page')
    console.log('💡 Try: /invite/invalid-token-123')
  }
}

// Function to test different error types
function testErrorTypes() {
  console.log('🎯 Testing Different Error Types...')
  
  console.log('📝 Expected Error Types:')
  console.log('   1. 404 - Page not found')
  console.log('   2. 410 - Invite expired')
  console.log('   3. Invalid token - Invite not found')
  console.log('   4. Network error - Connection issues')
  
  console.log('💡 To test these errors:')
  console.log('   1. Go to /this-page-does-not-exist (404)')
  console.log('   2. Go to /invite/expired-token (410)')
  console.log('   3. Go to /invite/invalid-token (404)')
  console.log('   4. Disconnect internet and try to load a page (Network)')
}

// Function to test error page functionality
function testErrorPageFunctionality() {
  console.log('🎯 Testing Error Page Functionality...')
  
  // Check for buttons and links
  const buttons = document.querySelectorAll('button')
  const links = document.querySelectorAll('a[href]')
  
  console.log(`📋 Interactive elements: Buttons=${buttons.length}, Links=${links.length}`)
  
  // Test specific functionality
  const homeButton = Array.from(buttons).find(btn => 
    btn.textContent?.includes('Home') || btn.textContent?.includes('Terug')
  )
  const createButton = Array.from(buttons).find(btn => 
    btn.textContent?.includes('Meetup') || btn.textContent?.includes('Maken')
  )
  const contactButton = Array.from(buttons).find(btn => 
    btn.textContent?.includes('Contact') || btn.textContent?.includes('Hulp')
  )
  
  console.log(`📋 Action buttons: Home=${!!homeButton}, Create=${!!createButton}, Contact=${!!contactButton}`)
  
  if (homeButton) {
    console.log('✅ Home button found - click to test navigation')
  }
  if (createButton) {
    console.log('✅ Create button found - click to test meetup creation')
  }
  if (contactButton) {
    console.log('✅ Contact button found - click to test contact page')
  }
}

// Function to test error page design
function testErrorPageDesign() {
  console.log('🎯 Testing Error Page Design...')
  
  // Check for design elements
  const gradientBg = document.querySelector('[class*="bg-gradient"]')
  const card = document.querySelector('[class*="shadow"]')
  const icon = document.querySelector('[class*="text-4xl"]')
  const title = document.querySelector('h1, h2')
  const description = document.querySelector('p')
  
  console.log(`📋 Design elements: Gradient background=${!!gradientBg}, Card=${!!card}, Icon=${!!icon}, Title=${!!title}, Description=${!!description}`)
  
  if (gradientBg && card && icon && title && description) {
    console.log('🎉 SUCCESS: Error page has good design!')
  } else {
    console.log('⚠️ Some design elements missing')
  }
  
  // Check for responsive design
  const isMobile = window.innerWidth < 768
  const hasResponsiveClasses = document.querySelector('[class*="sm:"]') || document.querySelector('[class*="md:"]')
  
  console.log(`📋 Responsive design: Mobile=${isMobile}, Responsive classes=${!!hasResponsiveClasses}`)
}

// Function to test development features
function testDevelopmentFeatures() {
  console.log('🎯 Testing Development Features...')
  
  // Check for technical details section
  const technicalDetails = document.querySelector('details')
  const tokenInfo = document.querySelector('[class*="font-mono"]')
  
  if (technicalDetails && tokenInfo) {
    console.log('✅ Development features found')
    console.log('📋 Technical details section available for debugging')
  } else {
    console.log('ℹ️ No development features (normal for production)')
  }
}

// Function to simulate error scenarios
function simulateErrorScenarios() {
  console.log('🎯 Simulating Error Scenarios...')
  
  console.log('📝 Error Scenarios to Test:')
  console.log('   1. Invalid invite token:')
  console.log('      - Go to /invite/invalid-token-123')
  console.log('      - Should show "Uitnodiging Niet Gevonden"')
  console.log('      - Should have helpful action buttons')
  
  console.log('   2. Expired invite token:')
  console.log('      - Go to /invite/expired-token-456')
  console.log('      - Should show "Uitnodiging Verlopen"')
  console.log('      - Should explain why invites expire')
  
  console.log('   3. Non-existent page:')
  console.log('      - Go to /this-page-does-not-exist')
  console.log('      - Should show 404 page with search and popular links')
  
  console.log('   4. Network error:')
  console.log('      - Disconnect internet')
  console.log('      - Try to load any page')
  console.log('      - Should show network error message')
  
  console.log('💡 Expected Results:')
  console.log('   - Friendly error messages')
  console.log('   - Clear action buttons')
  console.log('   - Helpful suggestions')
  console.log('   - Easy navigation back to working pages')
}

// Function to test error page accessibility
function testErrorPageAccessibility() {
  console.log('🎯 Testing Error Page Accessibility...')
  
  // Check for semantic HTML
  const headings = document.querySelectorAll('h1, h2, h3')
  const buttons = document.querySelectorAll('button')
  const links = document.querySelectorAll('a')
  
  console.log(`📋 Semantic elements: Headings=${headings.length}, Buttons=${buttons.length}, Links=${links.length}`)
  
  // Check for proper contrast and readability
  const hasGoodContrast = document.querySelector('[class*="text-gray-900"]') || document.querySelector('[class*="text-gray-800"]')
  const hasReadableFont = document.querySelector('[class*="font-semibold"]') || document.querySelector('[class*="font-bold"]')
  
  console.log(`📋 Accessibility: Good contrast=${!!hasGoodContrast}, Readable font=${!!hasReadableFont}`)
  
  if (headings.length > 0 && buttons.length > 0 && hasGoodContrast) {
    console.log('✅ Error page has good accessibility')
  } else {
    console.log('⚠️ Some accessibility features missing')
  }
}

// Export functions for manual testing
window.test404Page = test404Page
window.testInviteErrorPages = testInviteErrorPages
window.testErrorTypes = testErrorTypes
window.testErrorPageFunctionality = testErrorPageFunctionality
window.testErrorPageDesign = testErrorPageDesign
window.testDevelopmentFeatures = testDevelopmentFeatures
window.simulateErrorScenarios = simulateErrorScenarios
window.testErrorPageAccessibility = testErrorPageAccessibility

console.log('🧪 Error Page Test Functions Loaded:')
console.log('- test404Page() - Test 404 page functionality')
console.log('- testInviteErrorPages() - Test invite error pages')
console.log('- testErrorTypes() - Show expected error types')
console.log('- testErrorPageFunctionality() - Test error page buttons and links')
console.log('- testErrorPageDesign() - Test error page design elements')
console.log('- testDevelopmentFeatures() - Test development debugging features')
console.log('- simulateErrorScenarios() - Show error testing scenarios')
console.log('- testErrorPageAccessibility() - Test accessibility features')

// Auto-detect current page and show relevant tests
const currentPath = window.location.pathname
if (currentPath.startsWith('/invite/')) {
  console.log('🎯 Auto-detected invite page')
  console.log('💡 Run testInviteErrorPages() to test invite error handling')
  console.log('💡 Try an invalid token to see error page')
} else if (currentPath === '/404' || document.title.includes('404')) {
  console.log('🎯 Auto-detected 404 page')
  console.log('💡 Run test404Page() to test 404 functionality')
  console.log('💡 Run testErrorPageDesign() to test design')
} else {
  console.log('💡 Navigate to error pages to test error handling')
  console.log('💡 Run simulateErrorScenarios() to see testing guide')
} 