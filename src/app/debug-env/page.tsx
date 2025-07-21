"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { validateSupabaseConnection, testSupabaseAuth } from '@/lib/supabase-browser'

export default function DebugEnvPage() {
  const [envVars, setEnvVars] = useState<Record<string, string | undefined>>({})
  const [supabaseStatus, setSupabaseStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkEnvironment = async () => {
      setIsLoading(true)
      
      // Check environment variables
      const env = {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
        DATABASE_URL: process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
        RESEND_API_KEY: process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing',
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      }
      setEnvVars(env)

      // Log detailed information for debugging
      console.log('🔍 Environment Debug Info:')
      console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length)
      console.log('NODE_ENV:', process.env.NODE_ENV)
      console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL)

      // Test Supabase connection
      try {
        const status = await validateSupabaseConnection()
        setSupabaseStatus(status)
        console.log('🔍 Supabase connection result:', status)
      } catch (error) {
        console.error('❌ Supabase connection error:', error)
        setSupabaseStatus({ valid: false, error: 'Failed to validate connection' })
      }
      
      setIsLoading(false)
    }

    checkEnvironment()
  }, [])

  const testSupabaseConnection = async () => {
    setIsLoading(true)
    try {
      console.log('🔍 Starting comprehensive Supabase tests...')
      
      // Test 1: Basic connection
      const connectionStatus = await validateSupabaseConnection()
      console.log('Connection test result:', connectionStatus)
      
      // Test 2: Auth specific test
      const authStatus = await testSupabaseAuth()
      console.log('Auth test result:', authStatus)
      
      // Use the more detailed auth test result
      setSupabaseStatus(authStatus)
    } catch (error) {
      console.error('❌ Test failed:', error)
      setSupabaseStatus({ valid: false, error: 'Test failed' })
    }
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Checking environment configuration...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🔧 Environment Debug</h1>
          <p className="text-gray-600">Check your environment configuration</p>
        </div>

        <div className="grid gap-6">
          {/* Environment Variables */}
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(envVars).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-mono text-sm">{key}</span>
                    <span className={`text-sm ${value ? 'text-green-600' : 'text-red-600'}`}>
                      {typeof value === 'string' && value.length > 50 
                        ? `${value.substring(0, 20)}...${value.substring(value.length - 10)}`
                        : value || '❌ Not set'
                      }
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Supabase Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Supabase Connection</CardTitle>
                <Button onClick={testSupabaseConnection} disabled={isLoading}>
                  {isLoading ? 'Testing...' : 'Test Connection'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {supabaseStatus ? (
                <div className={`p-4 rounded-lg ${supabaseStatus.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-lg ${supabaseStatus.valid ? 'text-green-600' : 'text-red-600'}`}>
                      {supabaseStatus.valid ? '✅' : '❌'}
                    </span>
                    <span className="font-semibold">
                      {supabaseStatus.valid ? 'Connected' : 'Connection Failed'}
                    </span>
                  </div>
                  {supabaseStatus.error && (
                    <div className="space-y-2">
                      <p className="text-sm text-red-600 font-semibold">Error: {supabaseStatus.error}</p>
                      {supabaseStatus.details && (
                        <div className="text-xs text-red-500 bg-red-50 p-2 rounded">
                          <p><strong>Code:</strong> {supabaseStatus.details.code}</p>
                          <p><strong>Name:</strong> {supabaseStatus.details.name}</p>
                          <p><strong>Message:</strong> {supabaseStatus.details.message}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {supabaseStatus.session && (
                    <p className="text-sm text-green-600">
                      Session: {supabaseStatus.session.user?.email || 'No user'}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Click &quot;Test Connection&quot; to check Supabase status</p>
              )}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>🔧 Troubleshooting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">If Supabase is not working:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Check if NEXT_PUBLIC_SUPABASE_URL is set correctly</li>
                    <li>• Verify NEXT_PUBLIC_SUPABASE_ANON_KEY is valid</li>
                    <li>• Ensure your Supabase project is active</li>
                    <li>• Check if your domain is allowed in Supabase settings</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">For Vercel deployment:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Add environment variables in Vercel dashboard</li>
                    <li>• Redeploy after adding environment variables</li>
                    <li>• Check Vercel function logs for errors</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 