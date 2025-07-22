'use client'

import { useState } from 'react'
import { useSupabase } from '@/components/SupabaseProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function DebugVercelEmail() {
  const { supabase } = useSupabase()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [envInfo, setEnvInfo] = useState<any>(null)

  const checkEnvironment = async () => {
    try {
      const response = await fetch('/api/debug-vercel')
      const data = await response.json()
      setEnvInfo(data)
    } catch (error) {
      setEnvInfo({ error: 'Failed to fetch environment info' })
    }
  }

  const testSignUp = async () => {
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

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">🔍 Vercel Email Verification Debug</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🌍 Environment Check</CardTitle>
          <CardDescription>
            Check if all environment variables are set correctly on Vercel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={checkEnvironment} className="mb-4">
            🔍 Check Environment
          </Button>
          
          {envInfo && (
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded">
                <h3 className="font-semibold mb-2">Environment Variables:</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(envInfo, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📧 Test Email Signup</CardTitle>
          <CardDescription>
            Test the signup process on Vercel deployment
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
            onClick={testSignUp} 
            disabled={loading || !email}
            className="w-full"
          >
            {loading ? 'Signing up...' : 'Test Sign Up on Vercel'}
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
          <CardTitle>🔧 Vercel Email Troubleshooting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-800 mb-2">🚨 Common Vercel Email Issues:</h3>
            <ul className="space-y-1 text-amber-700">
              <li>• <strong>Missing environment variables</strong> - Check Vercel dashboard</li>
              <li>• <strong>Wrong Site URL</strong> - Should be your Vercel domain</li>
              <li>• <strong>SMTP not configured</strong> - Use custom SMTP provider</li>
              <li>• <strong>Email templates wrong</strong> - Check Supabase dashboard</li>
              <li>• <strong>Redirect URLs incorrect</strong> - Must include Vercel domain</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">✅ Required Vercel Environment Variables:</h3>
            <ul className="space-y-1 text-blue-700">
              <li>• <code>NEXT_PUBLIC_SUPABASE_URL</code></li>
              <li>• <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
              <li>• <code>SUPABASE_SERVICE_ROLE_KEY</code></li>
              <li>• <code>RESEND_API_KEY</code> (if using Resend)</li>
              <li>• <code>NEXT_PUBLIC_SITE_URL</code></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 