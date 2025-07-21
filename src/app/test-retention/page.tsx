"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react'

interface TestResult {
  feature: string
  status: 'PASS' | 'FAIL' | 'WARNING'
  message: string
  details?: any
}

interface TestSuite {
  name: string
  tests: TestResult[]
  totalTests: number
  passedTests: number
  failedTests: number
}

export default function TestRetentionPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<TestSuite[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const runTests = async () => {
    setIsRunning(true)
    setError(null)
    
    try {
      const response = await fetch('/api/test/retention')
      const data = await response.json()
      
      if (data.success) {
        setTestResults(data.testSuites)
        setSummary(data.summary)
      } else {
        setError(data.error || 'Unknown error occurred')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run tests')
    } finally {
      setIsRunning(false)
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Retention Features Test
          </h1>
          <p className="text-gray-600">
            Test alle retention features om te controleren of ze correct werken
          </p>
        </div>

        {/* Test Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={runTests}
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Tests uitvoeren...
                </>
              ) : (
                '🧪 Run Retention Tests'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800">
                <XCircle className="w-5 h-5" />
                <span className="font-semibold">Error:</span>
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        {summary && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Test Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {summary.totalTests}
                  </div>
                  <div className="text-sm text-gray-600">Total Tests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {summary.passedTests}
                  </div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {summary.failedTests}
                  </div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {summary.successRate}
                  </div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-6">
            {testResults.map((suite, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{suite.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {suite.passedTests}/{suite.totalTests} passed
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {((suite.passedTests / suite.totalTests) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {suite.tests.map((test, testIndex) => (
                      <div
                        key={testIndex}
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
            ))}
          </div>
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
                Klik op "Run Retention Tests" om alle retention features te testen.
                Dit zal controleren of alle systemen correct werken.
              </p>
              <div className="text-sm text-gray-500">
                <p>✅ Engagement System</p>
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