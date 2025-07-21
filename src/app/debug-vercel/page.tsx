"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface DebugInfo {
  timestamp: string
  environment: {
    NODE_ENV: string
    VERCEL: string
    VERCEL_URL: string
    VERCEL_ENV: string
  }
  supabase: {
    url: string
    anonKey: string
    serviceKey: string
  }
  other: {
    databaseUrl: string
    resendApiKey: string
    emailFrom: string
    googleMapsKey: string
    siteUrl: string
  }
  connection: {
    supabaseClient: string
    validationResult: any
    authTestResult: any
  }
}

export default function DebugVercelPage() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDebugInfo = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/debug-vercel')
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      setDebugInfo(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDebugInfo()
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">🔍 Vercel Debug Info</h1>
      
      <div className="mb-6">
        <Button onClick={fetchDebugInfo} disabled={loading}>
          {loading ? '🔄 Loading...' : '🔄 Refresh Debug Info'}
        </Button>
      </div>

      {error && (
        <Card className="p-6 mb-6 bg-red-50 border-red-200">
          <h2 className="text-xl font-semibold text-red-800 mb-2">❌ Error</h2>
          <p className="text-red-700">{error}</p>
        </Card>
      )}

      {debugInfo && (
        <div className="space-y-6">
          {/* Environment Info */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">🌍 Environment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong>NODE_ENV:</strong> {debugInfo.environment.NODE_ENV || 'Not set'}
              </div>
              <div>
                <strong>VERCEL:</strong> {debugInfo.environment.VERCEL || 'Not set'}
              </div>
              <div>
                <strong>VERCEL_URL:</strong> {debugInfo.environment.VERCEL_URL || 'Not set'}
              </div>
              <div>
                <strong>VERCEL_ENV:</strong> {debugInfo.environment.VERCEL_ENV || 'Not set'}
              </div>
            </div>
          </Card>

          {/* Supabase Variables */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">🔑 Supabase Variables</h2>
            <div className="space-y-2">
              <div>URL: {debugInfo.supabase.url}</div>
              <div>Anon Key: {debugInfo.supabase.anonKey}</div>
              <div>Service Key: {debugInfo.supabase.serviceKey}</div>
            </div>
          </Card>

          {/* Other Variables */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">⚙️ Other Variables</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>Database URL: {debugInfo.other.databaseUrl}</div>
              <div>Resend API Key: {debugInfo.other.resendApiKey}</div>
              <div>Email From: {debugInfo.other.emailFrom}</div>
              <div>Google Maps Key: {debugInfo.other.googleMapsKey}</div>
              <div>Site URL: {debugInfo.other.siteUrl}</div>
            </div>
          </Card>

          {/* Connection Tests */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">🔌 Connection Tests</h2>
            <div className="space-y-4">
              <div>
                <strong>Supabase Client:</strong> {debugInfo.connection.supabaseClient}
              </div>
              
              {debugInfo.connection.validationResult && (
                <div>
                  <strong>Connection Test:</strong>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-auto">
                    {JSON.stringify(debugInfo.connection.validationResult, null, 2)}
                  </pre>
                </div>
              )}
              
              {debugInfo.connection.authTestResult && (
                <div>
                  <strong>Auth Test:</strong>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-auto">
                    {JSON.stringify(debugInfo.connection.authTestResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </Card>

          {/* Timestamp */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">⏰ Last Updated</h2>
            <p>{debugInfo.timestamp}</p>
          </Card>
        </div>
      )}
    </div>
  )
} 