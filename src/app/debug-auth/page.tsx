"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useSupabase } from '@/components/SupabaseProvider'

export default function DebugAuthPage() {
  const { supabase } = useSupabase()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testSignIn = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      console.log('🔍 Testing sign in with:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      console.log('📊 Sign in result:', { data, error })

      if (error) {
        setError(error.message)
        setResult({
          error: error.message,
          code: error.status,
          name: error.name,
          details: error
        })
      } else {
        setResult({
          success: true,
          user: data.user,
          session: data.session
        })
      }
    } catch (err) {
      console.error('❌ Unexpected error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const testSignUp = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      console.log('🔍 Testing sign up with:', email)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      console.log('📊 Sign up result:', { data, error })

      if (error) {
        setError(error.message)
        setResult({
          error: error.message,
          code: error.status,
          name: error.name,
          details: error
        })
      } else {
        setResult({
          success: true,
          user: data.user,
          session: data.session
        })
      }
    } catch (err) {
      console.error('❌ Unexpected error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const getErrorExplanation = (code: number) => {
    const explanations: { [key: number]: string } = {
      400: 'Bad Request - Invalid credentials or malformed request',
      401: 'Unauthorized - Invalid login credentials',
      422: 'Unprocessable Entity - Email not confirmed or invalid data',
      429: 'Too Many Requests - Rate limited, wait 15 minutes',
      500: 'Internal Server Error - Supabase server issue'
    }
    return explanations[code] || 'Unknown error code'
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">🔍 Auth Debug Tool</h1>
      
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">🧪 Test Authentication</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="test@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="password"
            />
          </div>
          
          <div className="flex space-x-4">
            <Button 
              onClick={testSignIn} 
              disabled={loading || !email || !password}
            >
              {loading ? '🔄 Testing...' : '🔐 Test Sign In'}
            </Button>
            
            <Button 
              onClick={testSignUp} 
              disabled={loading || !email || !password}
              variant="outline"
            >
              {loading ? '🔄 Testing...' : '📝 Test Sign Up'}
            </Button>
          </div>
        </div>
      </Card>

      {error && (
        <Card className="p-6 mb-6 bg-red-50 border-red-200">
          <h2 className="text-xl font-semibold text-red-800 mb-2">❌ Error</h2>
          <p className="text-red-700">{error}</p>
        </Card>
      )}

      {result && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">📊 Result</h2>
          
          {result.success ? (
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <h3 className="font-semibold text-green-800 mb-2">✅ Success!</h3>
              <p className="text-green-700">Authentication successful</p>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Error Details</h3>
              <div className="space-y-2">
                <p><strong>Message:</strong> {result.error}</p>
                <p><strong>Code:</strong> {result.code}</p>
                <p><strong>Type:</strong> {result.name}</p>
                <p><strong>Explanation:</strong> {getErrorExplanation(result.code)}</p>
              </div>
            </div>
          )}
          
          <div className="mt-4">
            <h3 className="font-semibold mb-2">🔍 Raw Response:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </Card>
      )}

      <Card className="p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">📋 Common Error Codes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>400:</strong> Bad Request - Invalid credentials
          </div>
          <div>
            <strong>401:</strong> Unauthorized - Invalid login
          </div>
          <div>
            <strong>422:</strong> Email not confirmed
          </div>
          <div>
            <strong>429:</strong> Too many requests
          </div>
        </div>
      </Card>
    </div>
  )
} 