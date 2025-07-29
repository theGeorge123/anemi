'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react'
import { clearStaleTokens, getTokenCount } from '@/lib/supabase-browser'

export default function DebugEnvPage() {
  const [envStatus, setEnvStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tokenCount, setTokenCount] = useState(0)
  const [clearingTokens, setClearingTokens] = useState(false)

  const checkEnvironment = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug-env')
      const data = await response.json()
      setEnvStatus(data)
      
      // Update token count
      setTokenCount(getTokenCount())
    } catch (error) {
      setEnvStatus({ error: 'Failed to check environment' })
    } finally {
      setLoading(false)
    }
  }

  const handleClearTokens = () => {
    setClearingTokens(true)
    try {
      clearStaleTokens()
      setTokenCount(getTokenCount())
      
      // Refresh environment check after clearing tokens
      setTimeout(() => {
        checkEnvironment()
      }, 1000)
    } catch (error) {
      console.error('Error clearing tokens:', error)
    } finally {
      setClearingTokens(false)
    }
  }

  useEffect(() => {
    checkEnvironment()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">🔍 Environment Debug</h1>
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  const getCriticalIssues = () => {
    if (!envStatus?.variables) return []
    
    const issues = []
    
    // Check critical variables
    if (!envStatus.variables.NEXT_PUBLIC_SUPABASE_URL?.set) {
      issues.push('❌ NEXT_PUBLIC_SUPABASE_URL is missing - Critical for authentication')
    }
    if (!envStatus.variables.NEXT_PUBLIC_SUPABASE_ANON_KEY?.set) {
      issues.push('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing - Critical for authentication')
    }
    if (!envStatus.variables.NEXT_PUBLIC_SITE_URL?.set) {
      issues.push('❌ NEXT_PUBLIC_SITE_URL is missing - Critical for email verification')
    }
    if (!envStatus.variables.DATABASE_URL?.set) {
      issues.push('❌ DATABASE_URL is missing - Critical for database operations')
    }
    
    // Check token count
    if (tokenCount > 0) {
      issues.push(`⚠️ Found ${tokenCount} stale tokens - May cause auth issues`)
    }
    
    return issues
  }

  const getRecommendations = () => {
    const recommendations = []
    
    if (tokenCount > 0) {
      recommendations.push('🧹 Clear stale tokens using the button below')
    }
    
    if (!envStatus?.variables?.NEXT_PUBLIC_SITE_URL?.set) {
      recommendations.push('🌐 Set NEXT_PUBLIC_SITE_URL to your Vercel domain (e.g., https://www.anemimeets.com)')
    }
    
    if (!envStatus?.variables?.EMAIL_FROM?.set) {
      recommendations.push('📧 Set EMAIL_FROM for custom email sender')
    }
    
    return recommendations
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🔍 Environment Debug</h1>
        <Button onClick={checkEnvironment} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {/* Critical Issues */}
      {getCriticalIssues().length > 0 && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Critical Issues Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {getCriticalIssues().map((issue, index) => (
                <li key={index} className="text-red-700 text-sm">• {issue}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Token Cleanup */}
      {tokenCount > 0 && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">🧹 Token Cleanup</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-yellow-700">
              Found {tokenCount} stale authentication tokens. These may cause login issues.
            </p>
            <Button 
              onClick={handleClearTokens} 
              disabled={clearingTokens}
              variant="outline"
            >
              {clearingTokens ? 'Clearing...' : 'Clear All Stale Tokens'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Environment Variables Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Environment Variables Status</CardTitle>
        </CardHeader>
        <CardContent>
          {envStatus?.variables && (
            <div className="space-y-4">
              {Object.entries(envStatus.variables).map(([key, value]: [string, any]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-mono text-sm">{key}</span>
                  <div className="flex items-center gap-2">
                    {value.set ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm">
                      {value.set ? '✅ Set' : '❌ Missing'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation Results */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Validation Results</CardTitle>
        </CardHeader>
        <CardContent>
          {envStatus?.validation && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {envStatus.validation.valid ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="font-semibold">
                  {envStatus.validation.valid ? '✅ Valid' : '❌ Invalid'}
                </span>
              </div>
              
              {envStatus.validation.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <h4 className="font-semibold text-red-800 mb-2">Errors:</h4>
                  <ul className="space-y-1">
                    {envStatus.validation.errors.map((error: string, index: number) => (
                      <li key={index} className="text-red-700 text-sm">• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {envStatus.validation.warnings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Warnings:</h4>
                  <ul className="space-y-1">
                    {envStatus.validation.warnings.map((warning: string, index: number) => (
                      <li key={index} className="text-yellow-700 text-sm">• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendations */}
      {getRecommendations().length > 0 && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">💡 Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {getRecommendations().map((rec, index) => (
                <li key={index} className="text-blue-700 text-sm">• {rec}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Raw Environment Data */}
      <Card>
        <CardHeader>
          <CardTitle>Raw Environment Data</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
            {JSON.stringify(envStatus, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
} 