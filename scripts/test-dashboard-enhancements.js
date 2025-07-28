// Test script for dashboard enhancements
// Run this in the browser console

console.log('🧪 Testing Dashboard Enhancements...')

// Function to test participant interaction
function testParticipantInteraction() {
  console.log('🎯 Testing Participant Interaction...')
  
  // Check if we're on the dashboard
  const isDashboard = window.location.pathname === '/dashboard'
  
  if (isDashboard) {
    console.log('✅ Dashboard page detected')
    
    // Check for "Bekijk Reacties" buttons
    const viewResponsesButtons = document.querySelectorAll('button[class*="bg-blue-50"]')
    console.log(`📋 View Responses buttons found: ${viewResponsesButtons.length}`)
    
    if (viewResponsesButtons.length > 0) {
      console.log('🎉 SUCCESS: View Responses buttons found!')
      
      // Test clicking a button
      const firstButton = viewResponsesButtons[0]
      console.log('💡 Click a "Bekijk Reacties" button to test the modal')
    } else {
      console.log('⚠️ No View Responses buttons found - check if meetups have participants')
    }
  } else {
    console.log('💡 Navigate to /dashboard to test participant interaction')
  }
}

// Function to test sorting functionality
function testSortingFunctionality() {
  console.log('🎯 Testing Sorting Functionality...')
  
  // Check if we're on the dashboard
  const isDashboard = window.location.pathname === '/dashboard'
  
  if (isDashboard) {
    console.log('✅ Dashboard page detected')
    
    // Check for sorting buttons
    const sortButtons = document.querySelectorAll('button[class*="text-xs"]')
    const dateSortButton = Array.from(sortButtons).find(btn => 
      btn.textContent?.includes('Datum')
    )
    const statusSortButton = Array.from(sortButtons).find(btn => 
      btn.textContent?.includes('Status')
    )
    const responsesSortButton = Array.from(sortButtons).find(btn => 
      btn.textContent?.includes('Reacties')
    )
    
    console.log(`📋 Sort buttons found: Date=${!!dateSortButton}, Status=${!!statusSortButton}, Responses=${!!responsesSortButton}`)
    
    if (dateSortButton && statusSortButton && responsesSortButton) {
      console.log('🎉 SUCCESS: All sorting buttons found!')
      console.log('💡 Click sorting buttons to test functionality')
    } else {
      console.log('⚠️ Some sorting buttons missing')
    }
  } else {
    console.log('💡 Navigate to /dashboard to test sorting')
  }
}

// Function to test filtering functionality
function testFilteringFunctionality() {
  console.log('🎯 Testing Filtering Functionality...')
  
  // Check if we're on the dashboard
  const isDashboard = window.location.pathname === '/dashboard'
  
  if (isDashboard) {
    console.log('✅ Dashboard page detected')
    
    // Check for filter controls
    const statusFilter = document.querySelector('select[class*="border-gray-300"]')
    const urgentFilter = document.querySelector('button[class*="text-xs"]')
    
    console.log(`📋 Filter controls found: Status filter=${!!statusFilter}, Urgent filter=${!!urgentFilter}`)
    
    if (statusFilter && urgentFilter) {
      console.log('🎉 SUCCESS: Filter controls found!')
      console.log('💡 Test status filter dropdown and urgent filter button')
    } else {
      console.log('⚠️ Some filter controls missing')
    }
  } else {
    console.log('💡 Navigate to /dashboard to test filtering')
  }
}

// Function to test session management
function testSessionManagement() {
  console.log('🎯 Testing Session Management...')
  
  // Check for session warning modal
  const sessionWarning = document.querySelector('[class*="bg-amber-50"]')
  const sessionExpiry = document.querySelector('[class*="text-gray-600"]')
  
  if (sessionWarning) {
    console.log('⚠️ Session warning detected')
    console.log('📋 Session warning text:', sessionWarning.textContent?.trim())
  } else {
    console.log('✅ No session warnings - session is healthy')
  }
  
  // Test session persistence
  console.log('💡 To test session persistence:')
  console.log('   1. Login to the application')
  console.log('   2. Refresh the page (F5)')
  console.log('   3. Check if you remain logged in')
  console.log('   4. Close and reopen browser')
  console.log('   5. Check if session persists')
}

// Function to test View Responses modal
function testViewResponsesModal() {
  console.log('🎯 Testing View Responses Modal...')
  
  // Check if modal is open
  const modal = document.querySelector('[class*="fixed inset-0"]')
  
  if (modal) {
    console.log('✅ Modal is open')
    
    // Check modal content
    const modalTitle = modal.querySelector('h2')
    const participantsList = modal.querySelectorAll('[class*="bg-gray-50"]')
    const statisticsCards = modal.querySelectorAll('[class*="bg-green-50"], [class*="bg-red-50"], [class*="bg-yellow-50"]')
    
    console.log(`📋 Modal content: Title=${!!modalTitle}, Participants=${participantsList.length}, Statistics=${statisticsCards.length}`)
    
    if (modalTitle && participantsList.length > 0 && statisticsCards.length > 0) {
      console.log('🎉 SUCCESS: Modal content is complete!')
    } else {
      console.log('⚠️ Some modal content missing')
    }
  } else {
    console.log('💡 Click "Bekijk Reacties" button to open modal')
  }
}

// Function to test urgent filtering
function testUrgentFiltering() {
  console.log('🎯 Testing Urgent Filtering...')
  
  // Check if we're on the dashboard
  const isDashboard = window.location.pathname === '/dashboard'
  
  if (isDashboard) {
    console.log('✅ Dashboard page detected')
    
    // Find urgent filter button
    const urgentButton = Array.from(document.querySelectorAll('button')).find(btn => 
      btn.textContent?.includes('Urgent')
    )
    
    if (urgentButton) {
      console.log('✅ Urgent filter button found')
      
      // Check if button shows count
      const buttonText = urgentButton.textContent
      const hasCount = buttonText?.includes('(') && buttonText?.includes(')')
      
      if (hasCount) {
        console.log('🎉 SUCCESS: Urgent filter shows count!')
        console.log('💡 Click urgent filter to test functionality')
      } else {
        console.log('⚠️ Urgent filter missing count')
      }
    } else {
      console.log('⚠️ Urgent filter button not found')
    }
  } else {
    console.log('💡 Navigate to /dashboard to test urgent filtering')
  }
}

// Function to test meetup cards with new features
function testMeetupCards() {
  console.log('🎯 Testing Meetup Cards...')
  
  // Check if we're on the dashboard
  const isDashboard = window.location.pathname === '/dashboard'
  
  if (isDashboard) {
    console.log('✅ Dashboard page detected')
    
    // Check for meetup cards
    const meetupCards = document.querySelectorAll('[class*="bg-white"]')
    console.log(`📋 Meetup cards found: ${meetupCards.length}`)
    
    if (meetupCards.length > 0) {
      console.log('🎉 SUCCESS: Meetup cards found!')
      
      // Check for new features in cards
      const firstCard = meetupCards[0]
      const hasViewResponsesButton = firstCard.querySelector('button[class*="bg-blue-50"]')
      const hasQuickStats = firstCard.querySelector('[class*="text-blue-600"]')
      const hasParticipantsList = firstCard.querySelector('[class*="bg-gray-50"]')
      
      console.log(`📋 Card features: View Responses=${!!hasViewResponsesButton}, Quick Stats=${!!hasQuickStats}, Participants=${!!hasParticipantsList}`)
      
      if (hasViewResponsesButton) {
        console.log('✅ View Responses button found in cards')
      }
      if (hasQuickStats) {
        console.log('✅ Quick stats found in cards')
      }
      if (hasParticipantsList) {
        console.log('✅ Participants list found in cards')
      }
    } else {
      console.log('⚠️ No meetup cards found')
    }
  } else {
    console.log('💡 Navigate to /dashboard to test meetup cards')
  }
}

// Function to simulate complete dashboard testing
function simulateDashboardTesting() {
  console.log('🎯 Simulating Complete Dashboard Testing...')
  
  console.log('📝 Test Steps:')
  console.log('   1. Navigate to /dashboard')
  console.log('   2. Test sorting buttons (Date, Status, Responses)')
  console.log('   3. Test status filter dropdown')
  console.log('   4. Test urgent filter button')
  console.log('   5. Click "Bekijk Reacties" on a meetup')
  console.log('   6. Test modal content and functionality')
  console.log('   7. Test session persistence (refresh page)')
  console.log('   8. Test session expiry warnings')
  
  console.log('💡 Expected Results:')
  console.log('   - Sorting should change meetup order')
  console.log('   - Filtering should show/hide meetups')
  console.log('   - Modal should show participant details')
  console.log('   - Session should persist after refresh')
  console.log('   - Warnings should appear before expiry')
}

// Export functions for manual testing
window.testParticipantInteraction = testParticipantInteraction
window.testSortingFunctionality = testSortingFunctionality
window.testFilteringFunctionality = testFilteringFunctionality
window.testSessionManagement = testSessionManagement
window.testViewResponsesModal = testViewResponsesModal
window.testUrgentFiltering = testUrgentFiltering
window.testMeetupCards = testMeetupCards
window.simulateDashboardTesting = simulateDashboardTesting

console.log('🧪 Dashboard Enhancement Test Functions Loaded:')
console.log('- testParticipantInteraction() - Test participant interaction')
console.log('- testSortingFunctionality() - Test sorting functionality')
console.log('- testFilteringFunctionality() - Test filtering functionality')
console.log('- testSessionManagement() - Test session management')
console.log('- testViewResponsesModal() - Test view responses modal')
console.log('- testUrgentFiltering() - Test urgent filtering')
console.log('- testMeetupCards() - Test meetup cards with new features')
console.log('- simulateDashboardTesting() - Show complete testing guide')

// Auto-detect current page and show relevant tests
const currentPath = window.location.pathname
if (currentPath === '/dashboard') {
  console.log('🎯 Auto-detected dashboard page')
  console.log('💡 Run testParticipantInteraction() to test participant features')
  console.log('💡 Run testSortingFunctionality() to test sorting')
  console.log('💡 Run testFilteringFunctionality() to test filtering')
  console.log('💡 Run testSessionManagement() to test session management')
  console.log('💡 Run testMeetupCards() to test card features')
} else {
  console.log('💡 Navigate to /dashboard to test enhancements')
  console.log('💡 Run simulateDashboardTesting() to see complete testing guide')
} 