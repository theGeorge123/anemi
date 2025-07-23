'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

export default function DebugEnvPage() {
  const [envStatus, setEnvStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkEnvironment = async () => {
      try {
        const response = await fetch('/api/debug-env')
        const data = await response.json()
        setEnvStatus(data)
      } catch (error) {
        setEnvStatus({ error: 'Failed to check environment' })
      } finally {
        setLoading(false)
      }
    }

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

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">🔍 Environment Debug</h1>
      
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