// Test script for meetup search functionality
// Run this in the browser console

console.log('🧪 Testing Meetup Search Functionality...')

// Function to test email search
function testEmailSearch() {
  console.log('🎯 Testing Email Search...')
  
  // Check if we're on the homepage or a page with FindMyMeetups
  const findMyMeetups = document.querySelector('[data-testid="find-my-meetups"]') ||
                       document.querySelector('form[action*="find-by-email"]') ||
                       document.querySelector('input[placeholder*="email"]')
  
  if (!findMyMeetups) {
    console.log('❌ FindMyMeetups component not found')
    console.log('💡 Navigate to the homepage or a page with the search functionality')
    return
  }
  
  console.log('✅ FindMyMeetups component found')
  
  // Look for email input
  const emailInput = document.querySelector('input[type="email"]')
  if (!emailInput) {
    console.log('❌ Email input not found')
    return
  }
  
  console.log('✅ Email input found')
  
  // Look for search button
  const searchButton = document.querySelector('button[type="submit"]')
  if (!searchButton) {
    console.log('❌ Search button not found')
    return
  }
  
  console.log('✅ Search button found')
  console.log('🎯 Ready to test! Enter an email and click search')
  
  // Add submit listener to monitor what happens
  const form = emailInput.closest('form')
  if (form) {
    const originalSubmit = form.onsubmit
    form.onsubmit = function(e) {
      console.log('🎯 Search form submitted!')
      console.log('🎯 Email:', emailInput.value)
      console.log('🎯 Checking if meetups are found...')
      
      // Check if results appear within 3 seconds
      setTimeout(() => {
        const meetupCards = document.querySelectorAll('[class*="card"]')
        const pendingSection = document.querySelector('[class*="yellow-50"]')
        const errorMessage = document.querySelector('[class*="red-50"]')
        
        if (meetupCards.length > 0) {
          console.log('✅ SUCCESS: Meetups found!')
          console.log(`📊 Found ${meetupCards.length} meetup(s)`)
          
          if (pendingSection) {
            console.log('✅ Pending meetups section found')
            console.log('✅ Search is showing ALL statuses including pending')
          } else {
            console.log('⚠️ No pending meetups section found')
            console.log('💡 This might mean no pending meetups exist for this email')
          }
          
          // Check for different status badges
          const badges = document.querySelectorAll('[class*="badge"]')
          const statuses = Array.from(badges).map(badge => badge.textContent)
          console.log('📋 Status badges found:', statuses)
          
        } else if (errorMessage) {
          console.log('❌ FAILED: Error message found')
          console.log('❌ Error:', errorMessage.textContent)
        } else {
          console.log('❌ FAILED: No meetups found and no error message')
        }
      }, 3000)
      
      // Call original submit
      if (originalSubmit) {
        originalSubmit.call(this, e)
      }
    }
  }
}

// Function to test invite code search
function testInviteCodeSearch() {
  console.log('🎯 Testing Invite Code Search...')
  
  // Look for search type toggle
  const toggleButtons = document.querySelectorAll('button[class*="bg-gray-100"]')
  if (toggleButtons.length >= 2) {
    console.log('✅ Search type toggle found')
    
    // Click on invite code search
    const codeButton = Array.from(toggleButtons).find(btn => 
      btn.textContent.includes('Code') || btn.textContent.includes('code')
    )
    
    if (codeButton) {
      console.log('✅ Invite code search button found')
      codeButton.click()
      console.log('🎯 Switched to invite code search')
      
      // Look for invite code input
      setTimeout(() => {
        const codeInput = document.querySelector('input[placeholder*="uitnodigingscode"]') ||
                         document.querySelector('input[placeholder*="code"]')
        
        if (codeInput) {
          console.log('✅ Invite code input found')
          console.log('🎯 Ready to test! Enter an invite code and click search')
        } else {
          console.log('❌ Invite code input not found')
        }
      }, 500)
    } else {
      console.log('❌ Invite code search button not found')
    }
  } else {
    console.log('❌ Search type toggle not found')
  }
}

// Function to check if all statuses are supported
function checkStatusSupport() {
  console.log('🎯 Checking Status Support...')
  
  // Look for status badges
  const badges = document.querySelectorAll('[class*="badge"]')
  if (badges.length > 0) {
    const statuses = Array.from(badges).map(badge => badge.textContent)
    console.log('📋 Current status badges:', statuses)
    
    // Check for specific statuses
    const hasPending = statuses.some(s => s.includes('Wachten') || s.includes('pending'))
    const hasConfirmed = statuses.some(s => s.includes('Bevestigd') || s.includes('confirmed'))
    const hasDeclined = statuses.some(s => s.includes('Afgewezen') || s.includes('declined'))
    const hasExpired = statuses.some(s => s.includes('Verlopen') || s.includes('expired'))
    
    console.log('✅ Pending status support:', hasPending)
    console.log('✅ Confirmed status support:', hasConfirmed)
    console.log('✅ Declined status support:', hasDeclined)
    console.log('✅ Expired status support:', hasExpired)
    
    if (hasPending && hasConfirmed && hasDeclined) {
      console.log('🎉 SUCCESS: All major statuses are supported!')
    } else {
      console.log('⚠️ WARNING: Some statuses might not be supported')
    }
  } else {
    console.log('❌ No status badges found')
  }
}

// Function to simulate complete search flow
function simulateSearchFlow() {
  console.log('🎯 Simulating Complete Search Flow...')
  
  console.log('📝 Step 1: Navigate to homepage or search page')
  console.log('📝 Step 2: Choose search type (email or invite code)')
  console.log('📝 Step 3: Enter search criteria')
  console.log('📝 Step 4: Click search button')
  console.log('📝 Step 5: Check results')
  
  console.log('💡 Expected Results:')
  console.log('   - Should show ALL meetups (pending, confirmed, declined, expired)')
  console.log('   - Pending meetups should be highlighted')
  console.log('   - Results should be sorted (pending first)')
  console.log('   - Each meetup should have correct status badge')
  console.log('   - Should show cafe details and organizer info')
}

// Export functions for manual testing
window.testEmailSearch = testEmailSearch
window.testInviteCodeSearch = testInviteCodeSearch
window.checkStatusSupport = checkStatusSupport
window.simulateSearchFlow = simulateSearchFlow

console.log('🧪 Meetup Search Test Functions Loaded:')
console.log('- testEmailSearch() - Test email search functionality')
console.log('- testInviteCodeSearch() - Test invite code search')
console.log('- checkStatusSupport() - Check if all statuses are supported')
console.log('- simulateSearchFlow() - Show complete search flow steps')

// Auto-detect and show relevant test
const hasSearchForm = document.querySelector('input[type="email"]') || document.querySelector('input[placeholder*="code"]')
if (hasSearchForm) {
  console.log('🎯 Auto-detected search functionality')
  console.log('💡 Run testEmailSearch() to test email search')
  console.log('💡 Run testInviteCodeSearch() to test invite code search')
  console.log('💡 Run checkStatusSupport() to check status support')
} else {
  console.log('💡 Navigate to a page with search functionality to test')
} 