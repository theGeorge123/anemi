'use client'

import { useState } from 'react'
import { useSupabase } from '@/components/SupabaseProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function TestEmailVerification() {
  const { supabase } = useSupabase()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [tokenHash, setTokenHash] = useState('')
  const [verifying, setVerifying] = useState(false)

  const handleSignUp = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: 'testpassword123',
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`
        }
      })
      
      setResult({ data, error })
    } catch (err) {
      setResult({ error: err })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyToken = async () => {
    setVerifying(true)
    setResult(null)
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: 'email'
      })
      
      setResult({ data, error })
    } catch (err) {
      setResult({ error: err })
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">🔍 Email Verification Test</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📧 Test Sign Up</CardTitle>
          <CardDescription>
            Test the signup process and email verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>
          <Button 
            onClick={handleSignUp} 
            disabled={loading || !email}
            className="w-full"
          >
            {loading ? 'Signing up...' : 'Test Sign Up'}
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🔑 Test Token Verification</CardTitle>
          <CardDescription>
            Test verifying a token manually
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="token">Token Hash</Label>
            <Input
              id="token"
              value={tokenHash}
              onChange={(e) => setTokenHash(e.target.value)}
              placeholder="Paste token hash from email"
            />
          </div>
          <Button 
            onClick={handleVerifyToken} 
            disabled={verifying || !tokenHash}
            className="w-full"
          >
            {verifying ? 'Verifying...' : 'Test Verify Token'}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>📊 Result</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>🔧 Troubleshooting Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>1.</strong> Check if email is sent to your inbox</p>
          <p><strong>2.</strong> Check spam folder</p>
          <p><strong>3.</strong> Verify Supabase email settings</p>
          <p><strong>4.</strong> Check Site URL configuration</p>
          <p><strong>5.</strong> Verify email template uses correct redirect URL</p>
        </CardContent>
      </Card>
    </div>
  )
} 