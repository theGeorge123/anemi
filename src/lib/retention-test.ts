export interface RetentionTestResult {
  feature: string
  status: 'PASS' | 'FAIL' | 'WARNING'
  message: string
  details?: any
}

export interface TestSuite {
  name: string
  tests: RetentionTestResult[]
  totalTests: number
  passedTests: number
  failedTests: number
}

export async function runRetentionTests(): Promise<TestSuite[]> {
  const testSuites: TestSuite[] = []
  
  // Test Suite 1: Engagement System
  const engagementTests: RetentionTestResult[] = []
  
  try {
    // Test achievement calculation
    const testStats = {
      totalMeetups: 5,
      totalInvites: 10,
      totalAccepted: 8,
      totalDeclined: 2,
      streakDays: 3,
      lastActiveDate: new Date(),
      favoriteCafes: 15,
      reviewsPosted: 3,
      level: 2,
      experiencePoints: 250
    }
    
    const achievements = getAchievementProgress(testStats)
    const unlockedCount = achievements.filter(a => a.unlockedAt).length
    
    engagementTests.push({
      feature: 'Achievement System',
      status: unlockedCount > 0 ? 'PASS' : 'FAIL',
      message: `Found ${unlockedCount} unlocked achievements`,
      details: { unlockedCount, totalAchievements: achievements.length }
    })
    
    // Test level calculation
    const calculatedLevel = calculateLevel(testStats.experiencePoints)
    engagementTests.push({
      feature: 'Level Calculation',
      status: calculatedLevel === testStats.level ? 'PASS' : 'FAIL',
      message: `Level calculation: ${calculatedLevel} (expected: ${testStats.level})`,
      details: { calculated: calculatedLevel, expected: testStats.level }
    })
    
    // Test experience points
    const xpForMeetup = calculateExperienceForAction('create_meetup')
    engagementTests.push({
      feature: 'Experience Points',
      status: xpForMeetup > 0 ? 'PASS' : 'FAIL',
      message: `XP for meetup creation: ${xpForMeetup}`,
      details: { xpForMeetup }
    })
    
  } catch (error) {
    engagementTests.push({
      feature: 'Engagement System',
      status: 'FAIL',
      message: `Error testing engagement system: ${error}`,
      details: { error }
    })
  }
  
  testSuites.push({
    name: 'Engagement System',
    tests: engagementTests,
    totalTests: engagementTests.length,
    passedTests: engagementTests.filter(t => t.status === 'PASS').length,
    failedTests: engagementTests.filter(t => t.status === 'FAIL').length
  })
  
  // Test Suite 2: Notification System
  const notificationTests: RetentionTestResult[] = []
  
  try {
    const testTemplate = NOTIFICATION_TEMPLATES.WELCOME_BACK
    if (!testTemplate) {
      throw new Error('WELCOME_BACK template not found')
    }
    
    const testUserData = {
      lastActiveDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
      streakDays: 5,
      totalMeetups: 10,
      isBirthday: false
    }
    
    const shouldSend = shouldSendNotification(testTemplate, testUserData)
    notificationTests.push({
      feature: 'Notification Logic',
      status: shouldSend ? 'PASS' : 'WARNING',
      message: `Welcome back notification: ${shouldSend ? 'Should send' : 'Should not send'}`,
      details: { shouldSend, daysInactive: 8 }
    })
    
    // Test personalized message
    const personalizedMessage = getPersonalizedMessage(testTemplate, {
      name: 'Test User',
      totalMeetups: 10,
      favoriteCafe: 'Test Cafe'
    })
    
    notificationTests.push({
      feature: 'Message Personalization',
      status: personalizedMessage.includes('Test User') ? 'PASS' : 'FAIL',
      message: 'Personalized message contains user name',
      details: { message: personalizedMessage }
    })
    
  } catch (error) {
    notificationTests.push({
      feature: 'Notification System',
      status: 'FAIL',
      message: `Error testing notification system: ${error}`,
      details: { error }
    })
  }
  
  testSuites.push({
    name: 'Notification System',
    tests: notificationTests,
    totalTests: notificationTests.length,
    passedTests: notificationTests.filter(t => t.status === 'PASS').length,
    failedTests: notificationTests.filter(t => t.status === 'FAIL').length
  })
  
  // Test Suite 3: Recommendation System
  const recommendationTests: RetentionTestResult[] = []
  
  try {
    // Test personalized greeting
    const greeting = getPersonalizedGreeting({
      name: 'Test User',
      totalMeetups: 5,
      lastActiveDate: new Date(),
      favoriteCafe: 'Test Cafe'
    })
    
    recommendationTests.push({
      feature: 'Personalized Greeting',
      status: greeting.includes('Test User') ? 'PASS' : 'FAIL',
      message: 'Greeting contains user name',
      details: { greeting }
    })
    
    // Test motivational message
    const motivationalMessage = getMotivationalMessage({
      totalMeetups: 5,
      streakDays: 3,
      level: 2,
      lastAchievement: 'Test Achievement'
    })
    
    recommendationTests.push({
      feature: 'Motivational Messages',
      status: motivationalMessage.length > 0 ? 'PASS' : 'FAIL',
      message: 'Motivational message generated',
      details: { message: motivationalMessage }
    })
    
    // Test distance calculation
    const distance = calculateDistance(52.3676, 4.9041, 52.3676, 4.9042) // Amsterdam coordinates
    recommendationTests.push({
      feature: 'Distance Calculation',
      status: distance > 0 && distance < 1 ? 'PASS' : 'FAIL',
      message: `Distance calculation: ${distance.toFixed(4)}km`,
      details: { distance }
    })
    
  } catch (error) {
    recommendationTests.push({
      feature: 'Recommendation System',
      status: 'FAIL',
      message: `Error testing recommendation system: ${error}`,
      details: { error }
    })
  }
  
  testSuites.push({
    name: 'Recommendation System',
    tests: recommendationTests,
    totalTests: recommendationTests.length,
    passedTests: recommendationTests.filter(t => t.status === 'PASS').length,
    failedTests: recommendationTests.filter(t => t.status === 'FAIL').length
  })
  
  // Test Suite 4: Email Templates
  const emailTests: RetentionTestResult[] = []
  
  try {
    const testTemplate = RETENTION_EMAILS.WELCOME_BACK_3_DAYS
    if (!testTemplate) {
      throw new Error('WELCOME_BACK_3_DAYS template not found')
    }
    
    const testUserData = {
      name: 'Test User',
      totalMeetups: 5,
      streakDays: 3,
      level: 2,
      experiencePoints: 250,
      reviewsPosted: 2,
      favoriteCafes: 10,
      cafe1: 'Test Cafe 1',
      cafe2: 'Test Cafe 2',
      cafe3: 'Test Cafe 3',
      distance1: 0.5,
      distance2: 1.2,
      distance3: 2.1
    }
    
    const personalizedContent = personalizeEmailContent(testTemplate, testUserData)
    
    emailTests.push({
      feature: 'Email Personalization',
      status: personalizedContent.includes('Test User') ? 'PASS' : 'FAIL',
      message: 'Email content personalized correctly',
      details: { contentLength: personalizedContent.length }
    })
    
    // Test template structure
    emailTests.push({
      feature: 'Email Template Structure',
      status: testTemplate.subject && testTemplate.content ? 'PASS' : 'FAIL',
      message: 'Email template has required fields',
      details: { hasSubject: !!testTemplate.subject, hasContent: !!testTemplate.content }
    })
    
  } catch (error) {
    emailTests.push({
      feature: 'Email System',
      status: 'FAIL',
      message: `Error testing email system: ${error}`,
      details: { error }
    })
  }
  
  testSuites.push({
    name: 'Email Templates',
    tests: emailTests,
    totalTests: emailTests.length,
    passedTests: emailTests.filter(t => t.status === 'PASS').length,
    failedTests: emailTests.filter(t => t.status === 'FAIL').length
  })
  
  return testSuites
}

export function generateTestReport(testSuites: TestSuite[]): string {
  let report = '# Retention Features Test Report\n\n'
  
  const totalTests = testSuites.reduce((sum, suite) => sum + suite.totalTests, 0)
  const totalPassed = testSuites.reduce((sum, suite) => sum + suite.passedTests, 0)
  const totalFailed = testSuites.reduce((sum, suite) => sum + suite.failedTests, 0)
  
  report += `## Summary\n`
  report += `- **Total Tests**: ${totalTests}\n`
  report += `- **Passed**: ${totalPassed}\n`
  report += `- **Failed**: ${totalFailed}\n`
  report += `- **Success Rate**: ${((totalPassed / totalTests) * 100).toFixed(1)}%\n\n`
  
  testSuites.forEach(suite => {
    report += `## ${suite.name}\n`
    report += `- Tests: ${suite.passedTests}/${suite.totalTests} passed\n\n`
    
    suite.tests.forEach(test => {
      const statusIcon = test.status === 'PASS' ? '✅' : test.status === 'FAIL' ? '❌' : '⚠️'
      report += `### ${statusIcon} ${test.feature}\n`
      report += `${test.message}\n`
      if (test.details) {
        report += `\`\`\`json\n${JSON.stringify(test.details, null, 2)}\n\`\`\`\n`
      }
      report += '\n'
    })
  })
  
  return report
}

// Import the functions we're testing
import { 
  getAchievementProgress, 
  calculateLevel, 
  calculateExperienceForAction 
} from './engagement'
import { 
  NOTIFICATION_TEMPLATES, 
  shouldSendNotification, 
  getPersonalizedMessage 
} from './notifications'
import { 
  getPersonalizedGreeting, 
  getMotivationalMessage, 
  calculateDistance 
} from './recommendations'
import { 
  RETENTION_EMAILS, 
  personalizeEmailContent 
} from './retention-emails' 