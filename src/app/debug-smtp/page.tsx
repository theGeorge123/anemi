'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function DebugSMTP() {
  const [debugData, setDebugData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [manualConfirmResult, setManualConfirmResult] = useState<any>(null)

  const testSMTP = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug-smtp')
      const data = await response.json()
      setDebugData(data)
    } catch (error) {
      setDebugData({ error: 'Failed to fetch debug data' })
    } finally {
      setLoading(false)
    }
  }

  const manualConfirm = async () => {
    if (!email) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/auth/manual-confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })
      const data = await response.json()
      setManualConfirmResult(data)
    } catch (error) {
      setManualConfirmResult({ error: 'Failed to confirm email' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">🔧 SMTP Debug Tool</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🧪 Test SMTP Settings</CardTitle>
          <CardDescription>
            Test your SMTP configuration and see what&apos;s happening
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={testSMTP}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Testing...' : 'Test SMTP Configuration'}
          </Button>
          
          {debugData && (
            <div className="mt-4 space-y-4">
              <div className="bg-gray-100 p-4 rounded">
                <h3 className="font-semibold mb-2">Debug Results:</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(debugData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📧 Manual Email Confirmation</CardTitle>
          <CardDescription>
            If SMTP is not working, manually confirm a user&apos;s email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </div>
          
          <Button 
            onClick={manualConfirm}
            disabled={loading || !email}
            className="w-full"
          >
            {loading ? 'Confirming...' : 'Manually Confirm Email'}
          </Button>
          
          {manualConfirmResult && (
            <div className="mt-4 bg-gray-100 p-4 rounded">
              <h3 className="font-semibold mb-2">Result:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(manualConfirmResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🔧 Troubleshooting Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-800 mb-2">🚨 Common SMTP Issues:</h3>
            <ul className="space-y-1 text-amber-700">
              <li>• <strong>Wrong credentials</strong> - Check Resend API key</li>
              <li>• <strong>Wrong host/port</strong> - Should be smtp.resend.com:587</li>
              <li>• <strong>Security settings</strong> - Use STARTTLS</li>
              <li>• <strong>Rate limiting</strong> - Check Resend dashboard</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">✅ Correct SMTP Settings:</h3>
            <pre className="text-sm text-blue-700 bg-white p-2 rounded">
{`Host: smtp.resend.com
Port: 587
Username: resend
Password: [Your Resend API Key]
Security: STARTTLS
Sender: team@anemimeets.com`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 