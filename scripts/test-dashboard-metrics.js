// Test script for dashboard metrics functionality
// Run this in the browser console on the dashboard page

console.log('🧪 Testing Dashboard Metrics Functionality...')

// Function to test dashboard metrics
function testDashboardMetrics() {
  console.log('🎯 Testing Dashboard Metrics...')
  
  // Check if we're on the dashboard page
  const dashboardTitle = document.querySelector('h1')
  if (!dashboardTitle || !dashboardTitle.textContent.includes('Mijn Meetups')) {
    console.log('❌ Not on dashboard page')
    console.log('💡 Navigate to /dashboard to test')
    return
  }
  
  console.log('✅ Dashboard page detected')
  
  // Check for statistics cards
  const statCards = document.querySelectorAll('[class*="card"]')
  console.log(`📊 Found ${statCards.length} statistic cards`)
  
  // Look for specific metrics
  const metrics = {
    'Uitnodigingen Verzonden': false,
    'Geaccepteerd': false,
    'Afgewezen': false,
    'In Afwachting': false,
    'Response Rate': false,
    'Gem. Response Tijd': false,
    'Totaal Deelnemers': false,
    'Populairste Stad': false
  }
  
  statCards.forEach(card => {
    const text = card.textContent
    Object.keys(metrics).forEach(metric => {
      if (text.includes(metric)) {
        metrics[metric] = true
        console.log(`✅ Found metric: ${metric}`)
      }
    })
  })
  
  // Report on found metrics
  const foundMetrics = Object.values(metrics).filter(Boolean).length
  console.log(`📈 Found ${foundMetrics}/8 expected metrics`)
  
  if (foundMetrics >= 6) {
    console.log('🎉 SUCCESS: Most metrics are present!')
  } else {
    console.log('⚠️ WARNING: Some metrics might be missing')
  }
}

// Function to test participants list
function testParticipantsList() {
  console.log('🎯 Testing Participants List...')
  
  // Look for participants sections
  const participantSections = document.querySelectorAll('h4')
  const participantHeaders = Array.from(participantSections)
    .filter(h4 => h4.textContent.includes('Deelnemers'))
  
  if (participantHeaders.length > 0) {
    console.log(`✅ Found ${participantHeaders.length} participant sections`)
    
    participantHeaders.forEach((header, index) => {
      const participantCount = header.textContent.match(/\((\d+)\)/)
      if (participantCount) {
        console.log(`📊 Section ${index + 1}: ${participantCount[1]} participants`)
      }
    })
  } else {
    console.log('⚠️ No participant sections found')
    console.log('💡 This might mean no meetups have participants yet')
  }
}

// Function to test quick stats
function testQuickStats() {
  console.log('🎯 Testing Quick Stats...')
  
  // Look for quick stats in meetup cards
  const quickStats = document.querySelectorAll('[class*="text-blue-600"], [class*="text-green-600"], [class*="text-red-600"], [class*="text-amber-600"]')
  
  if (quickStats.length > 0) {
    console.log(`✅ Found ${quickStats.length} quick stat elements`)
    
    quickStats.forEach(stat => {
      const text = stat.textContent
      if (text.includes('uitnodigingen') || text.includes('geaccepteerd') || text.includes('afgewezen') || text.includes('afwachting')) {
        console.log(`📊 Quick stat: ${text}`)
      }
    })
  } else {
    console.log('⚠️ No quick stats found')
  }
}

// Function to test meetup cards
function testMeetupCards() {
  console.log('🎯 Testing Meetup Cards...')
  
  // Look for meetup cards
  const meetupCards = document.querySelectorAll('[class*="card"]')
  const actualMeetupCards = Array.from(meetupCards).filter(card => 
    card.textContent.includes('☕') && card.textContent.includes('📍')
  )
  
  console.log(`📋 Found ${actualMeetupCards.length} meetup cards`)
  
  if (actualMeetupCards.length > 0) {
    console.log('✅ Meetup cards are present')
    
    // Check for action buttons
    actualMeetupCards.forEach((card, index) => {
      const buttons = card.querySelectorAll('button')
      const hasCopyButton = Array.from(buttons).some(btn => btn.textContent.includes('Kopieer'))
      const hasEditButton = Array.from(buttons).some(btn => btn.textContent.includes('Bewerken'))
      
      console.log(`📋 Card ${index + 1}: ${buttons.length} buttons`)
      console.log(`   - Copy button: ${hasCopyButton ? '✅' : '❌'}`)
      console.log(`   - Edit button: ${hasEditButton ? '✅' : '❌'}`)
    })
  } else {
    console.log('⚠️ No meetup cards found')
    console.log('💡 This might mean no meetups exist yet')
  }
}

// Function to check data loading
function checkDataLoading() {
  console.log('🎯 Checking Data Loading...')
  
  // Look for loading state
  const loadingSpinner = document.querySelector('[class*="animate-spin"]')
  if (loadingSpinner) {
    console.log('⏳ Dashboard is still loading...')
    return
  }
  
  // Look for error state
  const errorMessage = document.querySelector('[class*="text-red-600"]')
  if (errorMessage) {
    console.log('❌ Error detected:', errorMessage.textContent)
    return
  }
  
  // Look for empty state
  const emptyState = document.querySelector('h3')
  if (emptyState && emptyState.textContent.includes('Nog geen meetups')) {
    console.log('📭 Empty state: No meetups yet')
    console.log('💡 Create some meetups to see the full dashboard')
    return
  }
  
  console.log('✅ Dashboard loaded successfully')
}

// Function to simulate complete dashboard flow
function simulateDashboardFlow() {
  console.log('🎯 Simulating Complete Dashboard Flow...')
  
  console.log('📝 Step 1: Navigate to dashboard (/dashboard)')
  console.log('📝 Step 2: Check authentication')
  console.log('📝 Step 3: Load meetups data')
  console.log('📝 Step 4: Display metrics cards')
  console.log('📝 Step 5: Show meetup cards with participants')
  
  console.log('💡 Expected Results:')
  console.log('   - Should show 8 metric cards (4 main + 4 insights)')
  console.log('   - Should display meetup cards with quick stats')
  console.log('   - Should show participant lists for each meetup')
  console.log('   - Should have copy/edit/delete buttons')
  console.log('   - Should show response rates and totals')
}

// Export functions for manual testing
window.testDashboardMetrics = testDashboardMetrics
window.testParticipantsList = testParticipantsList
window.testQuickStats = testQuickStats
window.testMeetupCards = testMeetupCards
window.checkDataLoading = checkDataLoading
window.simulateDashboardFlow = simulateDashboardFlow

console.log('🧪 Dashboard Metrics Test Functions Loaded:')
console.log('- testDashboardMetrics() - Test metric cards')
console.log('- testParticipantsList() - Test participant sections')
console.log('- testQuickStats() - Test quick stats in meetup cards')
console.log('- testMeetupCards() - Test meetup card functionality')
console.log('- checkDataLoading() - Check loading/error states')
console.log('- simulateDashboardFlow() - Show complete flow steps')

// Auto-detect and show relevant test
const isDashboard = document.querySelector('h1')?.textContent.includes('Mijn Meetups')
if (isDashboard) {
  console.log('🎯 Auto-detected dashboard page')
  console.log('💡 Run checkDataLoading() first to verify data loaded')
  console.log('💡 Run testDashboardMetrics() to test metric cards')
  console.log('💡 Run testParticipantsList() to test participant lists')
  console.log('💡 Run testQuickStats() to test quick stats')
  console.log('💡 Run testMeetupCards() to test meetup cards')
} else {
  console.log('💡 Navigate to /dashboard to test dashboard functionality')
} 