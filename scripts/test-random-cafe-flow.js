// Test script for random cafe flow
// Run this in the browser console on the create page

console.log('🧪 Testing Random Cafe Flow...')

// Function to simulate random cafe selection
function testRandomCafeFlow() {
  console.log('🎯 Step 1: Navigate to create page')
  console.log('🎯 Step 2: Fill in name and email')
  console.log('🎯 Step 3: Select city')
  console.log('🎯 Step 4: Select dates and times')
  console.log('🎯 Step 5: Click "✅ Kies dit cafe" on random cafe')
  console.log('🎯 Expected: Invite modal should appear')
  
  // Check if we're on the create page
  if (window.location.pathname !== '/create') {
    console.log('❌ Not on create page. Navigate to /create first')
    return
  }
  
  // Look for the cafe choice step
  const cafeChoiceStep = document.querySelector('[data-testid="cafe-choice-step"]') || 
                        document.querySelector('.cafe-choice-step') ||
                        document.querySelector('button:contains("Kies dit cafe")')
  
  if (!cafeChoiceStep) {
    console.log('❌ Cafe choice step not found')
    console.log('💡 Make sure you\'ve completed the previous steps')
    return
  }
  
  console.log('✅ Cafe choice step found')
  
  // Look for the random cafe button
  const randomCafeButton = document.querySelector('button:contains("✅ Kies dit cafe")') ||
                          document.querySelector('button[onclick*="onCafeSelect"]')
  
  if (!randomCafeButton) {
    console.log('❌ Random cafe button not found')
    console.log('💡 Make sure a random cafe is displayed')
    return
  }
  
  console.log('✅ Random cafe button found')
  console.log('🎯 Click the button to test the flow...')
  
  // Add click listener to monitor what happens
  const originalOnClick = randomCafeButton.onclick
  randomCafeButton.onclick = function(e) {
    console.log('🎯 Random cafe button clicked!')
    console.log('🎯 Checking if onFinish() is called...')
    
    // Check if invite modal appears within 2 seconds
    setTimeout(() => {
      const inviteModal = document.querySelector('[data-testid="invite-modal"]') ||
                         document.querySelector('.invite-modal') ||
                         document.querySelector('[role="dialog"]')
      
      if (inviteModal) {
        console.log('✅ SUCCESS: Invite modal appeared!')
        console.log('✅ Random cafe flow is working correctly')
      } else {
        console.log('❌ FAILED: Invite modal did not appear')
        console.log('❌ Random cafe flow is still broken')
      }
    }, 2000)
    
    // Call original onclick
    if (originalOnClick) {
      originalOnClick.call(this, e)
    }
  }
  
  console.log('🎯 Ready to test! Click the "✅ Kies dit cafe" button')
}

// Function to check current step
function checkCurrentStep() {
  const stepIndicator = document.querySelector('.step-indicator') ||
                       document.querySelector('[data-testid="step-indicator"]')
  
  if (stepIndicator) {
    const currentStep = stepIndicator.textContent.match(/Step (\d+)/)
    if (currentStep) {
      console.log(`🎯 Current step: ${currentStep[1]}`)
      return parseInt(currentStep[1])
    }
  }
  
  console.log('❌ Could not determine current step')
  return null
}

// Function to check form data
function checkFormData() {
  const formData = {
    name: document.querySelector('input[name="name"]')?.value || '',
    email: document.querySelector('input[name="email"]')?.value || '',
    city: document.querySelector('select[name="city"]')?.value || '',
    dates: document.querySelectorAll('input[type="checkbox"]:checked').length,
    times: document.querySelectorAll('input[type="radio"]:checked').length
  }
  
  console.log('📋 Form data:', formData)
  return formData
}

// Export functions for manual testing
window.testRandomCafeFlow = testRandomCafeFlow
window.checkCurrentStep = checkCurrentStep
window.checkFormData = checkFormData

console.log('🧪 Test functions loaded:')
console.log('- testRandomCafeFlow() - Test the random cafe flow')
console.log('- checkCurrentStep() - Check current wizard step')
console.log('- checkFormData() - Check form data')

// Auto-run if on create page
if (window.location.pathname === '/create') {
  console.log('🎯 Auto-detected create page, ready for testing')
  console.log('💡 Run testRandomCafeFlow() to start testing')
} 