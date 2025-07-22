'use client'

import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useSupabase } from '@/components/SupabaseProvider'
import { useState, Suspense } from 'react'

function DebugVerificationUrlContent() {
  const searchParams = useSearchParams()
  const { supabase } = useSupabase()
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Get all URL parameters
  const allParams = Object.fromEntries(searchParams.entries())
  
  const token = searchParams.get('token_hash') || searchParams.get('token')
  const type = searchParams.get('type')
  const email = searchParams.get('email')

  const testVerification = async () => {
    if (!token) return

    setLoading(true)
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: type || 'email'
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
      <h1 className="text-3xl font-bold mb-6">🔍 Debug Verification URL</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📋 URL Parameters</CardTitle>
          <CardDescription>
            All parameters from the verification URL
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-semibold mb-2">All Parameters:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(allParams, null, 2)}
              </pre>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded">
                <h4 className="font-semibold text-blue-800">Token:</h4>
                <p className="text-sm text-blue-700 break-all">
                  {token || '❌ Missing'}
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded">
                <h4 className="font-semibold text-green-800">Type:</h4>
                <p className="text-sm text-green-700">
                  {type || '❌ Missing'}
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded">
                <h4 className="font-semibold text-purple-800">Email:</h4>
                <p className="text-sm text-purple-700">
                  {email || '❌ Missing'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {token && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>🧪 Test Verification</CardTitle>
            <CardDescription>
              Test the verification with the current parameters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testVerification}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Testing...' : 'Test Verification'}
            </Button>
            
            {result && (
              <div className="mt-4 bg-gray-100 p-4 rounded">
                <h3 className="font-semibold mb-2">Result:</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>🔧 Troubleshooting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-800 mb-2">🚨 Common Issues:</h3>
            <ul className="space-y-1 text-amber-700">
              <li>• <strong>Missing token_hash</strong> - Email template might be wrong</li>
              <li>• <strong>Missing type</strong> - Should be &quot;email&quot; for verification</li>
              <li>• <strong>Wrong SiteURL</strong> - Check Supabase email template</li>
              <li>• <strong>Expired token</strong> - Tokens expire after 1 hour</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">✅ Correct Email Template:</h3>
            <pre className="text-sm text-blue-700 bg-white p-2 rounded">
{`<a href="{{ .SiteURL }}/auth/verify?token_hash={{ .TokenHash }}&type=email">Verify Email</a>`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function DebugVerificationUrl() {
  return (
    <Suspense fallback={
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">🔍 Debug Verification URL</h1>
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Loading debug information...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <DebugVerificationUrlContent />
    </Suspense>
  )
} 