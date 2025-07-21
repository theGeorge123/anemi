"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function DebugConfirmEmailPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const confirmEmail = async () => {
    if (!email) {
      setError('Please enter an email address')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/auth/confirm-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
        setError(null)
      } else {
        setError(data.error || 'Failed to confirm email')
        setResult(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">🔧 Debug Email Confirmation</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📧 Manually Confirm Email</CardTitle>
          <CardDescription>
            Use this tool to manually confirm an email address for testing purposes.
            This bypasses the normal email verification flow.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email to confirm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <Button 
            onClick={confirmEmail}
            disabled={loading || !email}
            className="w-full"
          >
            {loading ? '🔄 Confirming...' : '✅ Confirm Email'}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">❌ Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">✅ Success</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700 mb-4">{result.message}</p>
            <div className="bg-white p-4 rounded border">
              <h3 className="font-semibold mb-2">User Details:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(result.user, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>📋 Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Enter the email address you want to confirm</li>
            <li>Click "Confirm Email"</li>
            <li>If successful, you can now sign in with that email</li>
            <li>Go to <a href="/auth/signin" className="text-blue-600 hover:underline">Sign In</a> to test</li>
          </ol>
          
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-800 text-sm">
              <strong>⚠️ Note:</strong> This is a debug tool for testing only. 
              In production, users should verify their email through the normal flow.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 