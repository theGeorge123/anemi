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
  domain: {
    currentDomain: string
    customDomain: string
    vercelUrl: string
    siteUrlEnv: string
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
      
      // Add domain information
      const domainInfo = {
        currentDomain: window.location.hostname,
        customDomain: 'www.anemimeets.com',
        vercelUrl: data.environment?.VERCEL_URL || 'Not set',
        siteUrlEnv: data.other?.siteUrl || 'Not set'
      }
      
      setDebugInfo({
        ...data,
        domain: domainInfo
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDebugInfo()
  }, [])

  const getConnectionStatus = () => {
    if (!debugInfo) return 'unknown'
    if (debugInfo.connection.supabaseClient.includes('✅')) return 'success'
    return 'failed'
  }

  const getTroubleshootingSteps = (): string[] => {
    const steps: string[] = []
    
    if (!debugInfo) return steps

    // Check Supabase URL
    if (debugInfo.supabase.url.includes('❌')) {
      steps.push('❌ NEXT_PUBLIC_SUPABASE_URL is missing in Vercel environment variables')
    }

    // Check Supabase Key
    if (debugInfo.supabase.anonKey.includes('❌')) {
      steps.push('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing in Vercel environment variables')
    }

    // Check connection
    if (debugInfo.connection.supabaseClient.includes('❌')) {
      steps.push('❌ Supabase client creation failed - check your Supabase project is online')
    }

    // Check auth test
    if (debugInfo.connection.authTestResult && !debugInfo.connection.authTestResult.valid) {
      steps.push(`❌ Auth test failed: ${debugInfo.connection.authTestResult.error}`)
    }

    // Check site URL
    if (debugInfo.domain.siteUrlEnv === '❌ Missing') {
      steps.push('❌ NEXT_PUBLIC_SITE_URL is missing - critical for email verification')
    }

    return steps
  }

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
          {/* Connection Status */}
          <Card className={`p-6 ${getConnectionStatus() === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <h2 className="text-xl font-semibold mb-4">🔌 Connection Status</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Supabase Client:</span>
                <span className={`font-mono ${getConnectionStatus() === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                  {debugInfo.connection.supabaseClient}
                </span>
              </div>
              {debugInfo.connection.validationResult && (
                <div className="mt-4 p-3 bg-gray-100 rounded">
                  <h3 className="font-semibold mb-2">Validation Details:</h3>
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(debugInfo.connection.validationResult, null, 2)}
                  </pre>
                </div>
              )}
              {debugInfo.connection.authTestResult && (
                <div className="mt-4 p-3 bg-gray-100 rounded">
                  <h3 className="font-semibold mb-2">Auth Test Details:</h3>
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(debugInfo.connection.authTestResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </Card>

          {/* Troubleshooting Steps */}
          {getTroubleshootingSteps().length > 0 && (
            <Card className="p-6 bg-yellow-50 border-yellow-200">
              <h2 className="text-xl font-semibold text-yellow-800 mb-4">🔧 Troubleshooting Steps</h2>
              <div className="space-y-2">
                {getTroubleshootingSteps().map((step, index) => (
                  <div key={index} className="text-sm text-yellow-700">
                    {step}
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-white rounded border">
                <h3 className="font-semibold mb-2">📋 Quick Fixes:</h3>
                <ol className="text-sm space-y-1">
                  <li>1. Go to <a href="https://vercel.com/dashboard" target="_blank" className="text-blue-600 underline">Vercel Dashboard</a></li>
                  <li>2. Select your project</li>
                  <li>3. Go to Settings → Environment Variables</li>
                  <li>4. Add/update these variables:</li>
                  <li className="ml-4">• NEXT_PUBLIC_SUPABASE_URL</li>
                  <li className="ml-4">• NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                  <li className="ml-4">• NEXT_PUBLIC_SITE_URL = https://www.anemimeets.com</li>
                  <li>5. Redeploy your project</li>
                </ol>
              </div>
            </Card>
          )}

          {/* Supabase Variables */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">🔑 Supabase Variables</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>NEXT_PUBLIC_SUPABASE_URL:</span>
                <span className="font-mono">{debugInfo.supabase.url}</span>
              </div>
              <div className="flex justify-between">
                <span>NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                <span className="font-mono">{debugInfo.supabase.anonKey}</span>
              </div>
              <div className="flex justify-between">
                <span>SUPABASE_SERVICE_ROLE_KEY:</span>
                <span className="font-mono">{debugInfo.supabase.serviceKey}</span>
              </div>
            </div>
          </Card>

          {/* Domain Info */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">🌐 Domain Information</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Current Domain:</span>
                <span className="font-mono">{debugInfo.domain.currentDomain}</span>
              </div>
              <div className="flex justify-between">
                <span>Custom Domain:</span>
                <span className="font-mono">{debugInfo.domain.customDomain}</span>
              </div>
              <div className="flex justify-between">
                <span>Vercel URL:</span>
                <span className="font-mono">{debugInfo.domain.vercelUrl}</span>
              </div>
              <div className="flex justify-between">
                <span>Site URL Env:</span>
                <span className="font-mono">{debugInfo.domain.siteUrlEnv}</span>
              </div>
            </div>
          </Card>

          {/* Environment Info */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">🌍 Environment</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>NODE_ENV:</span>
                <span className="font-mono">{debugInfo.environment.NODE_ENV}</span>
              </div>
              <div className="flex justify-between">
                <span>VERCEL:</span>
                <span className="font-mono">{debugInfo.environment.VERCEL}</span>
              </div>
              <div className="flex justify-between">
                <span>VERCEL_URL:</span>
                <span className="font-mono">{debugInfo.environment.VERCEL_URL}</span>
              </div>
              <div className="flex justify-between">
                <span>VERCEL_ENV:</span>
                <span className="font-mono">{debugInfo.environment.VERCEL_ENV}</span>
              </div>
            </div>
          </Card>

          {/* Other Variables */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">⚙️ Other Variables</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>DATABASE_URL:</span>
                <span className="font-mono">{debugInfo.other.databaseUrl}</span>
              </div>
              <div className="flex justify-between">
                <span>RESEND_API_KEY:</span>
                <span className="font-mono">{debugInfo.other.resendApiKey}</span>
              </div>
              <div className="flex justify-between">
                <span>EMAIL_FROM:</span>
                <span className="font-mono">{debugInfo.other.emailFrom}</span>
              </div>
              <div className="flex justify-between">
                <span>GOOGLE_MAPS_API_KEY:</span>
                <span className="font-mono">{debugInfo.other.googleMapsKey}</span>
              </div>
              <div className="flex justify-between">
                <span>NEXT_PUBLIC_SITE_URL:</span>
                <span className="font-mono">{debugInfo.other.siteUrl}</span>
              </div>
            </div>
          </Card>

          {/* Timestamp */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">⏰ Last Updated</h2>
            <div className="text-sm">
              <span className="font-mono">{new Date(debugInfo.timestamp).toLocaleString()}</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
} 