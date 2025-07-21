"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

export default function SimpleRetentionTestPage() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runSimpleTests = async () => {
    setIsRunning(true)
    const results = []

    try {
      // Test 1: Import retention modules
      const { getAchievementProgress, calculateLevel, calculateExperienceForAction } = await import('@/lib/engagement')
      const { NOTIFICATION_TEMPLATES, shouldSendNotification } = await import('@/lib/notifications')
      const { getPersonalizedGreeting, getMotivationalMessage } = await import('@/lib/recommendations')
      const { RETENTION_EMAILS, personalizeEmailContent } = await import('@/lib/retention-emails')

      results.push({
        feature: 'Module Imports',
        status: 'PASS',
        message: 'All retention modules imported successfully'
      })

      // Test 2: Achievement System
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
      const unlockedCount = achievements.filter((a: any) => a.unlockedAt).length

      results.push({
        feature: 'Achievement System',
        status: unlockedCount > 0 ? 'PASS' : 'FAIL',
        message: `Found ${unlockedCount} unlocked achievements`,
        details: { unlockedCount, totalAchievements: achievements.length }
      })

      // Test 3: Level Calculation
      const calculatedLevel = calculateLevel(testStats.experiencePoints)
      results.push({
        feature: 'Level Calculation',
        status: calculatedLevel === testStats.level ? 'PASS' : 'FAIL',
        message: `Level calculation: ${calculatedLevel} (expected: ${testStats.level})`,
        details: { calculated: calculatedLevel, expected: testStats.level }
      })

      // Test 4: Experience Points
      const xpForMeetup = calculateExperienceForAction('create_meetup')
      results.push({
        feature: 'Experience Points',
        status: xpForMeetup > 0 ? 'PASS' : 'FAIL',
        message: `XP for meetup creation: ${xpForMeetup}`,
        details: { xpForMeetup }
      })

      // Test 5: Notification System
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
      results.push({
        feature: 'Notification Logic',
        status: shouldSend ? 'PASS' : 'WARNING',
        message: `Welcome back notification: ${shouldSend ? 'Should send' : 'Should not send'}`,
        details: { shouldSend, daysInactive: 8 }
      })

      // Test 6: Personalized Greeting
      const greeting = getPersonalizedGreeting({
        name: 'Test User',
        totalMeetups: 5,
        lastActiveDate: new Date()
      })

      results.push({
        feature: 'Personalized Greeting',
        status: greeting.includes('Test User') ? 'PASS' : 'FAIL',
        message: 'Greeting contains user name',
        details: { greeting }
      })

      // Test 7: Motivational Message
      const motivationalMessage = getMotivationalMessage({
        totalMeetups: 5,
        streakDays: 3,
        level: 2,
        lastAchievement: 'Test Achievement'
      })

      results.push({
        feature: 'Motivational Messages',
        status: motivationalMessage.length > 0 ? 'PASS' : 'FAIL',
        message: 'Motivational message generated',
        details: { message: motivationalMessage }
      })

      // Test 8: Email Templates
      const testEmailTemplate = RETENTION_EMAILS.WELCOME_BACK_3_DAYS
      if (!testEmailTemplate) {
        throw new Error('WELCOME_BACK_3_DAYS template not found')
      }
      
      const testEmailUserData = {
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

      const personalizedContent = personalizeEmailContent(testEmailTemplate, testEmailUserData)

      results.push({
        feature: 'Email Personalization',
        status: personalizedContent.includes('Test User') ? 'PASS' : 'FAIL',
        message: 'Email content personalized correctly',
        details: { contentLength: personalizedContent.length }
      })

    } catch (error) {
      results.push({
        feature: 'Test Execution',
        status: 'FAIL',
        message: `Error running tests: ${error}`,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      })
    }

    setTestResults(results)
    setIsRunning(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'FAIL':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASS':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'FAIL':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const totalTests = testResults.length
  const passedTests = testResults.filter(t => t.status === 'PASS').length
  const failedTests = testResults.filter(t => t.status === 'FAIL').length
  const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : '0'

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Simple Retention Test
          </h1>
          <p className="text-gray-600">
            Test retention features zonder complexe dependencies
          </p>
        </div>

        {/* Test Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={runSimpleTests}
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? 'Tests uitvoeren...' : '🧪 Run Simple Tests'}
            </Button>
          </CardContent>
        </Card>

        {/* Summary */}
        {testResults.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Test Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {totalTests}
                  </div>
                  <div className="text-sm text-gray-600">Total Tests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {passedTests}
                  </div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {failedTests}
                  </div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {successRate}%
                  </div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults.map((test, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${getStatusColor(test.status)}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(test.status)}
                      <span className="font-semibold">{test.feature}</span>
                    </div>
                    <p className="text-sm">{test.message}</p>
                    {test.details && (
                      <details className="mt-2">
                        <summary className="text-sm cursor-pointer">
                          View Details
                        </summary>
                        <pre className="text-xs mt-2 p-2 bg-white rounded border overflow-auto">
                          {JSON.stringify(test.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        {testResults.length === 0 && !isRunning && (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-6xl mb-4">🧪</div>
              <h3 className="text-xl font-semibold mb-2">
                Klaar om te testen!
              </h3>
              <p className="text-gray-600 mb-4">
                Klik op "Run Simple Tests" om de retention features te testen.
                Dit test alleen de core functionaliteit zonder complexe dependencies.
              </p>
              <div className="text-sm text-gray-500">
                <p>✅ Module Imports</p>
                <p>✅ Achievement System</p>
                <p>✅ Notification System</p>
                <p>✅ Recommendation System</p>
                <p>✅ Email Templates</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 