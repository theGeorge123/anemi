// Test script for wizard validation of required steps
// Run this in the browser console

console.log('🧪 Testing Wizard Validation...')

// Function to test step validation
function testStepValidation() {
  console.log('🎯 Testing Step Validation...')
  
  // Check if we're on the create page
  const isCreatePage = window.location.pathname === '/create'
  
  if (isCreatePage) {
    console.log('✅ Create page detected')
    
    // Check for wizard elements
    const stepIndicator = document.querySelector('[class*="StepIndicator"]')
    const stepContent = document.querySelector('[class*="StepContent"]')
    const navigation = document.querySelector('[class*="StepNavigation"]')
    
    console.log(`📋 Wizard elements: Step indicator=${!!stepIndicator}, Step content=${!!stepContent}, Navigation=${!!navigation}`)
    
    if (stepIndicator && stepContent && navigation) {
      console.log('🎉 SUCCESS: Wizard elements found!')
    } else {
      console.log('⚠️ WARNING: Some wizard elements might be missing')
    }
  } else {
    console.log('💡 Navigate to /create to test wizard validation')
  }
}

// Function to test date/time preferences validation
function testDateTimePreferencesValidation() {
  console.log('🎯 Testing Date/Time Preferences Validation...')
  
  // Check if we're on step 4 (dateTimePreferences)
  const stepElements = document.querySelectorAll('[class*="step"], [class*="Step"]')
  const isStep4 = Array.from(stepElements).some(el => 
    el.textContent?.includes('dateTimePreferences') || 
    el.textContent?.includes('Set specific times')
  )
  
  if (isStep4) {
    console.log('✅ Date/Time preferences step detected')
    
    // Check for validation elements
    const validationSummary = document.querySelector('[class*="bg-green-50"], [class*="bg-amber-50"]')
    const dateCards = document.querySelectorAll('[class*="border rounded-lg"]')
    const timeButtons = document.querySelectorAll('button[class*="p-2"]')
    
    console.log(`📋 Validation elements: Summary=${!!validationSummary}, Date cards=${dateCards.length}, Time buttons=${timeButtons.length}`)
    
    if (validationSummary && dateCards.length > 0 && timeButtons.length > 0) {
      console.log('🎉 SUCCESS: Date/Time validation elements found!')
      
      // Check validation status
      const isComplete = validationSummary.classList.contains('bg-green-50')
      console.log(`📊 Validation status: ${isComplete ? 'Complete' : 'Incomplete'}`)
      
      if (isComplete) {
        console.log('✅ All dates have time preferences selected')
      } else {
        console.log('⚠️ Some dates still need time preferences')
      }
    } else {
      console.log('⚠️ WARNING: Some validation elements might be missing')
    }
  } else {
    console.log('💡 Navigate to step 4 (dateTimePreferences) to test validation')
  }
}

// Function to test navigation button states
function testNavigationButtonStates() {
  console.log('🎯 Testing Navigation Button States...')
  
  const nextButton = document.querySelector('button[class*="bg-amber-600"], button[class*="bg-gray-300"]')
  const backButton = document.querySelector('button[class*="variant-outline"]')
  
  if (nextButton && backButton) {
    console.log('✅ Navigation buttons found')
    
    const isNextDisabled = nextButton.classList.contains('bg-gray-300') || nextButton.disabled
    const isBackDisabled = backButton.disabled
    
    console.log(`📋 Button states: Next disabled=${isNextDisabled}, Back disabled=${isBackDisabled}`)
    
    if (isNextDisabled) {
      console.log('⚠️ Next button is disabled - check validation requirements')
    } else {
      console.log('✅ Next button is enabled')
    }
  } else {
    console.log('⚠️ Navigation buttons not found')
  }
}

// Function to test validation messages
function testValidationMessages() {
  console.log('🎯 Testing Validation Messages...')
  
  const validationMessage = document.querySelector('[class*="bg-green-50"], [class*="bg-amber-50"]')
  
  if (validationMessage) {
    const messageText = validationMessage.textContent
    const isSuccess = validationMessage.classList.contains('bg-green-50')
    
    console.log(`📋 Validation message: "${messageText?.trim()}"`)
    console.log(`📊 Message type: ${isSuccess ? 'Success' : 'Warning'}`)
    
    if (messageText?.includes('✅')) {
      console.log('🎉 SUCCESS: Validation passed!')
    } else if (messageText?.includes('⚠️')) {
      console.log('⚠️ WARNING: Validation incomplete')
    }
  } else {
    console.log('💡 No validation message found')
  }
}

// Function to test step progression
function testStepProgression() {
  console.log('🎯 Testing Step Progression...')
  
  // Check current step
  const stepIndicators = document.querySelectorAll('[class*="step"], [class*="Step"]')
  const activeStep = Array.from(stepIndicators).find(el => 
    el.classList.contains('active') || 
    el.classList.contains('bg-amber') ||
    el.classList.contains('text-amber')
  )
  
  if (activeStep) {
    const stepText = activeStep.textContent
    console.log(`📋 Current step: ${stepText?.trim()}`)
    
    // Check if we can proceed
    const nextButton = document.querySelector('button[class*="bg-amber-600"], button[class*="bg-gray-300"]')
    const canProceed = nextButton && !nextButton.disabled && !nextButton.classList.contains('bg-gray-300')
    
    console.log(`📊 Can proceed to next step: ${canProceed ? 'Yes' : 'No'}`)
    
    if (!canProceed) {
      console.log('💡 Complete current step requirements to proceed')
    }
  } else {
    console.log('⚠️ Could not determine current step')
  }
}

// Function to test specific validation scenarios
function testValidationScenarios() {
  console.log('🎯 Testing Validation Scenarios...')
  
  console.log('📝 Test Scenarios:')
  console.log('   1. Step 1: Name and email required')
  console.log('   2. Step 2: City selection required')
  console.log('   3. Step 3: At least 1 date and 1 time required')
  console.log('   4. Step 4: All selected dates must have time preferences')
  console.log('   5. Step 5: Cafe selection required')
  
  console.log('💡 To test these scenarios:')
  console.log('   - Try to proceed without filling required fields')
  console.log('   - Check that Next button is disabled')
  console.log('   - Verify validation messages appear')
  console.log('   - Complete requirements and check that Next button enables')
}

// Function to simulate validation flow
function simulateValidationFlow() {
  console.log('🎯 Simulating Validation Flow...')
  
  console.log('📝 Expected Validation Flow:')
  console.log('   1. Start at step 1 - Next button should be disabled until name/email filled')
  console.log('   2. Step 2 - Next button should be disabled until city selected')
  console.log('   3. Step 3 - Next button should be disabled until dates and times selected')
  console.log('   4. Step 4 - Next button should be disabled until ALL dates have time preferences')
  console.log('   5. Step 5 - Next button should be disabled until cafe selected')
  console.log('   6. Final step - "Genereer Invite Code!" button should be enabled')
  
  console.log('💡 Test Steps:')
  console.log('   1. Go to /create')
  console.log('   2. Try to proceed without filling required fields')
  console.log('   3. Check validation messages and button states')
  console.log('   4. Complete each step and verify progression')
  console.log('   5. Test date/time preferences validation specifically')
}

// Export functions for manual testing
window.testStepValidation = testStepValidation
window.testDateTimePreferencesValidation = testDateTimePreferencesValidation
window.testNavigationButtonStates = testNavigationButtonStates
window.testValidationMessages = testValidationMessages
window.testStepProgression = testStepProgression
window.testValidationScenarios = testValidationScenarios
window.simulateValidationFlow = simulateValidationFlow

console.log('🧪 Wizard Validation Test Functions Loaded:')
console.log('- testStepValidation() - Test overall step validation')
console.log('- testDateTimePreferencesValidation() - Test date/time preferences validation')
console.log('- testNavigationButtonStates() - Test navigation button states')
console.log('- testValidationMessages() - Test validation messages')
console.log('- testStepProgression() - Test step progression')
console.log('- testValidationScenarios() - Show validation scenarios')
console.log('- simulateValidationFlow() - Show expected validation flow')

// Auto-detect current page and show relevant tests
const currentPath = window.location.pathname
if (currentPath === '/create') {
  console.log('🎯 Auto-detected create page')
  console.log('💡 Run testStepValidation() to test overall validation')
  console.log('💡 Run testNavigationButtonStates() to test button states')
  console.log('💡 Run testValidationMessages() to test validation messages')
  console.log('💡 Run testStepProgression() to test step progression')
} else {
  console.log('💡 Navigate to /create to test wizard validation')
  console.log('💡 Run simulateValidationFlow() to see expected flow')
} 