"use client"

import { useState } from 'react';
import { useBackgroundAgentContext } from '@/components/BackgroundAgentProvider';
import { BackgroundAgentStatus } from '@/components/BackgroundAgentStatus';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TestBackgroundAgent() {
  const {
    state,
    isActive,
    isSupported,
    isInitialized,
    requestSync,
    requestNotification,
    onMessage,
    offMessage,
  } = useBackgroundAgentContext();

  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  // Test notification
  const testNotification = async () => {
    setIsTesting(true);
    try {
      const success = await requestNotification({
        title: '🧪 Test Notification',
        body: 'This is a test notification from the background agent!',
        icon: '/logo-simple.svg',
        options: {
          data: {
            type: 'test_notification',
            timestamp: new Date().toISOString(),
          },
        },
      });

      if (success) {
        addTestResult('✅ Test notification sent successfully');
      } else {
        addTestResult('❌ Test notification failed');
      }
    } catch (error) {
      addTestResult(`❌ Test notification error: ${error}`);
    } finally {
      setIsTesting(false);
    }
  };

  // Test sync
  const testSync = async () => {
    setIsTesting(true);
    try {
      const success = await requestSync({
        type: 'meetup-sync',
        data: { test: true },
      });

      if (success) {
        addTestResult('✅ Test sync requested successfully');
      } else {
        addTestResult('❌ Test sync failed');
      }
    } catch (error) {
      addTestResult(`❌ Test sync error: ${error}`);
    } finally {
      setIsTesting(false);
    }
  };

  // Test message handling
  const testMessageHandling = () => {
    const testHandler = (data: any) => {
      addTestResult(`📨 Received message: ${JSON.stringify(data)}`);
    };

    onMessage('background-agent:test-message', testHandler);

    // Send a test message to the service worker
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'background-agent:test-message',
        data: { test: true, timestamp: new Date().toISOString() },
      });
    }

    // Clean up after 5 seconds
    setTimeout(() => {
      offMessage('background-agent:test-message');
      addTestResult('🧹 Test message handler cleaned up');
    }, 5000);
  };

  // Add test result
  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  // Clear test results
  const clearTestResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-background to-orange-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🧪 Background Agent Test</h1>
          <p className="text-gray-600">
            Test the background agent functionality and notifications
          </p>
        </div>

        {/* Status */}
        <BackgroundAgentStatus />

        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle>🧪 Test Controls</CardTitle>
            <CardDescription>
              Test various background agent features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={testNotification}
                disabled={isTesting || !isActive}
                variant="outline"
              >
                📱 Test Notification
              </Button>
              
              <Button
                onClick={testSync}
                disabled={isTesting || !isActive}
                variant="outline"
              >
                🔄 Test Sync
              </Button>
              
              <Button
                onClick={testMessageHandling}
                disabled={isTesting || !isActive}
                variant="outline"
              >
                📨 Test Messages
              </Button>
              
              <Button
                onClick={clearTestResults}
                variant="outline"
              >
                🧹 Clear Results
              </Button>
            </div>

            {/* Agent State */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Agent State</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Supported:</span>
                  <Badge variant={isSupported ? "default" : "secondary"}>
                    {isSupported ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Active:</span>
                  <Badge variant={isActive ? "default" : "secondary"}>
                    {isActive ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Initialized:</span>
                  <Badge variant={isInitialized ? "default" : "secondary"}>
                    {isInitialized ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Last Sync:</span>
                  <span className="text-muted-foreground">
                    {state.lastSync ? new Date(state.lastSync).toLocaleTimeString() : "Never"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Test Results</CardTitle>
            <CardDescription>
              Results from background agent tests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {testResults.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No test results yet. Run some tests to see results here.
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className="text-sm p-2 bg-muted rounded border-l-4 border-amber-500"
                  >
                    {result}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <Card>
            <CardHeader>
              <CardTitle>🐛 Debug Information</CardTitle>
              <CardDescription>
                Detailed state information for debugging
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-64">
                {JSON.stringify({
                  state,
                  isActive,
                  isSupported,
                  isInitialized,
                  userAgent: navigator.userAgent,
                  serviceWorker: 'serviceWorker' in navigator,
                  pushManager: 'PushManager' in window,
                  notifications: 'Notification' in window,
                }, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 