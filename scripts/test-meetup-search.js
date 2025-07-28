// Test script voor verbeterde meetup zoekfunctie
// Run dit script in de browser console op de homepage

console.log('🔍 Verbeterde Meetup Zoekfunctie Test Script')
console.log('============================================')

// Function to test email search with status grouping
function testEmailSearchWithStatusGrouping() {
  console.log('🎯 Testing Email Search with Status Grouping...')
  
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
      console.log('🎯 Checking for status groups...')
      
      // Check if results appear within 3 seconds
      setTimeout(() => {
        const meetupCards = document.querySelectorAll('[class*="card"]')
        const statusGroups = document.querySelectorAll('[class*="bg-yellow-50"], [class*="bg-green-50"], [class*="bg-red-50"], [class*="bg-gray-50"]')
        const errorMessage = document.querySelector('[class*="red-50"]')
        
        if (meetupCards.length > 0) {
          console.log('✅ SUCCESS: Meetups found!')
          console.log(`📊 Found ${meetupCards.length} meetup(s)`)
          
          if (statusGroups.length > 0) {
            console.log('✅ SUCCESS: Status groups found!')
            console.log(`📊 Found ${statusGroups.length} status group(s)`)
            
            // Check each status group
            statusGroups.forEach((group, index) => {
              const title = group.querySelector('h5')?.textContent || 'Unknown'
              const description = group.querySelector('p')?.textContent || 'No description'
              const meetupsInGroup = group.querySelectorAll('[class*="card"]').length
              
              console.log(`📋 Group ${index + 1}: ${title}`)
              console.log(`   Description: ${description}`)
              console.log(`   Meetups in group: ${meetupsInGroup}`)
            })
            
            // Check for specific status groups
            const pendingGroup = document.querySelector('[class*="bg-yellow-50"]')
            const confirmedGroup = document.querySelector('[class*="bg-green-50"]')
            const declinedGroup = document.querySelector('[class*="bg-red-50"]')
            const expiredGroup = document.querySelector('[class*="bg-gray-50"]')
            
            if (pendingGroup) {
              console.log('✅ Pending meetups group found')
              console.log('✅ "In afwachting" status feedback working')
            }
            
            if (confirmedGroup) {
              console.log('✅ Confirmed meetups group found')
              console.log('✅ "Bevestigd" status feedback working')
            }
            
            if (declinedGroup) {
              console.log('✅ Declined meetups group found')
              console.log('✅ "Afgewezen" status feedback working')
            }
            
            if (expiredGroup) {
              console.log('✅ Expired meetups group found')
              console.log('✅ "Verlopen" status feedback working')
            }
            
          } else {
            console.log('⚠️ No status groups found')
            console.log('💡 This might mean all meetups have the same status')
          }
          
          // Check for status badges
          const badges = document.querySelectorAll('[class*="badge"]')
          const statuses = Array.from(badges).map(badge => badge.textContent)
          console.log('📋 Status badges found:', statuses)
          
          // Check for improved status text
          const hasImprovedStatus = statuses.some(status => 
            status.includes('In afwachting') || 
            status.includes('Bevestigd') || 
            status.includes('Afgewezen') || 
            status.includes('Verlopen')
          )
          
          if (hasImprovedStatus) {
            console.log('✅ SUCCESS: Improved status text found')
            console.log('✅ Status feedback is working correctly')
          } else {
            console.log('⚠️ No improved status text found')
          }
          
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

// Function to test status grouping functionality
function testStatusGrouping() {
  console.log('🎯 Testing Status Grouping Functionality...')
  
  console.log('📝 Expected Status Groups:')
  console.log('   1. ⏳ In Afwachting (Yellow background)')
  console.log('   2. ✅ Bevestigd (Green background)')
  console.log('   3. ❌ Afgewezen (Red background)')
  console.log('   4. ⏰ Verlopen (Gray background)')
  
  console.log('📝 Expected Features:')
  console.log('   - Meetups grouped by status')
  console.log('   - Clear status descriptions')
  console.log('   - Color-coded backgrounds')
  console.log('   - Status icons for each group')
  console.log('   - Count of meetups per status')
  
  console.log('💡 To test:')
  console.log('   1. Search for an email with multiple meetups')
  console.log('   2. Check if meetups are grouped by status')
  console.log('   3. Verify status descriptions are clear')
  console.log('   4. Confirm color coding is correct')
}

// Function to test status feedback
function testStatusFeedback() {
  console.log('🎯 Testing Status Feedback...')
  
  console.log('📝 Expected Status Badges:')
  console.log('   - ⏳ In afwachting (Yellow)')
  console.log('   - ✅ Bevestigd! (Green)')
  console.log('   - ✅ Geaccepteerd! (Green)')
  console.log('   - ❌ Afgewezen (Red)')
  console.log('   - ⏰ Verlopen (Gray)')
  
  console.log('📝 Expected Status Information:')
  console.log('   - Expiration date for pending meetups')
  console.log('   - Chosen date/time for confirmed meetups')
  console.log('   - Clear status descriptions')
  
  console.log('💡 To test:')
  console.log('   1. Search for meetups with different statuses')
  console.log('   2. Check if status badges are clear')
  console.log('   3. Verify status information is helpful')
  console.log('   4. Confirm expiration dates are shown')
}

// Function to test all meetup statuses are shown
function testAllStatusesShown() {
  console.log('🎯 Testing All Statuses Are Shown...')
  
  console.log('📝 Expected Behavior:')
  console.log('   - ALL meetup statuses should be shown')
  console.log('   - Including pending, confirmed, declined, expired')
  console.log('   - No meetups should be hidden')
  console.log('   - Clear feedback for each status')
  
  console.log('💡 To test:')
  console.log('   1. Search for an email with various meetup statuses')
  console.log('   2. Verify all statuses are displayed')
  console.log('   3. Check that no meetups are missing')
  console.log('   4. Confirm status descriptions are helpful')
}

// Function to test improved user experience
function testImprovedUX() {
  console.log('🎯 Testing Improved User Experience...')
  
  console.log('📝 Expected Improvements:')
  console.log('   - Clear status grouping')
  console.log('   - Helpful status descriptions')
  console.log('   - Visual status indicators')
  console.log('   - Easy to understand feedback')
  console.log('   - Actionable information')
  
  console.log('💡 To test:')
  console.log('   1. Search for meetups')
  console.log('   2. Check if grouping is helpful')
  console.log('   3. Verify descriptions are clear')
  console.log('   4. Confirm actions are obvious')
  console.log('   5. Test that UX is improved')
}

// Auto-detect current page and show relevant tests
const currentPath = window.location.pathname
if (currentPath === '/') {
  console.log('🎯 Auto-detected homepage')
  console.log('💡 Run testEmailSearchWithStatusGrouping() to test email search')
  console.log('💡 Run testStatusGrouping() to see expected status groups')
  console.log('💡 Run testStatusFeedback() to test status feedback')
  console.log('💡 Run testAllStatusesShown() to verify all statuses shown')
  console.log('💡 Run testImprovedUX() to test improved user experience')
} else {
  console.log('💡 Navigate to homepage to test meetup search')
  console.log('💡 Run testEmailSearchWithStatusGrouping() to test search')
}

// Make functions globally available
window.testEmailSearchWithStatusGrouping = testEmailSearchWithStatusGrouping
window.testStatusGrouping = testStatusGrouping
window.testStatusFeedback = testStatusFeedback
window.testAllStatusesShown = testAllStatusesShown
window.testImprovedUX = testImprovedUX

console.log('✅ All test functions are now available globally')
console.log('💡 Use the functions above to test the improved meetup search functionality') 