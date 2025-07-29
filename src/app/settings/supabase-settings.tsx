"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Database, 
  Shield, 
  Globe, 
  Mail, 
  Key, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react'

interface SupabaseConfig {
  url: string
  anonKey: string
  serviceRoleKey: string
  siteUrl: string
  databaseUrl: string
}

interface ConnectionTest {
  success: boolean
  error?: string
  details?: any
}

export default function SupabaseSettings() {
  const [config, setConfig] = useState<SupabaseConfig | null>(null)
  const [connectionTest, setConnectionTest] = useState<ConnectionTest | null>(null)
  const [loading, setLoading] = useState(false)
  const [showKeys, setShowKeys] = useState(false)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/debug-env')
      const data = await response.json()
      
      setConfig({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set',
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'Not set',
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'Not set',
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'Not set',
        databaseUrl: process.env.DATABASE_URL || 'Not set'
      })
    } catch (error) {
      console.error('Error loading config:', error)
    }
  }

  const testConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug-vercel')
      const data = await response.json()
      
      setConnectionTest({
        success: data.success || false,
        error: data.error,
        details: data
      })
    } catch (error) {
      setConnectionTest({
        success: false,
        error: 'Failed to test connection'
      })
    } finally {
      setLoading(false)
    }
  }

  const getKeyDisplay = (key: string) => {
    if (!key || key === 'Not set') return 'Not set'
    if (showKeys) return key
    return `${key.substring(0, 20)}...${key.substring(key.length - 10)}`
  }

  const getStatusBadge = (value: string) => {
    if (!value || value === 'Not set') {
      return <Badge variant="destructive">Missing</Badge>
    }
    return <Badge variant="default">Set</Badge>
  }

  if (!config) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Supabase Configuratie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
            <p className="text-gray-600">Configuratie laden...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Configuration Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Supabase Configuratie
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* URL Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                Project URL
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-gray-100 rounded text-sm">
                  {config.url}
                </code>
                {getStatusBadge(config.url)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                Site URL
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-gray-100 rounded text-sm">
                  {config.siteUrl}
                </code>
                {getStatusBadge(config.siteUrl)}
              </div>
            </div>
          </div>

          {/* API Keys */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">
                <Key className="w-4 h-4 inline mr-1" />
                API Keys
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowKeys(!showKeys)}
              >
                {showKeys ? 'Verberg' : 'Toon'} Keys
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anon Key
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-gray-100 rounded text-sm font-mono">
                    {getKeyDisplay(config.anonKey)}
                  </code>
                  {getStatusBadge(config.anonKey)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Role Key
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-gray-100 rounded text-sm font-mono">
                    {getKeyDisplay(config.serviceRoleKey)}
                  </code>
                  {getStatusBadge(config.serviceRoleKey)}
                </div>
              </div>
            </div>
          </div>

          {/* Database URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Database className="w-4 h-4 inline mr-1" />
              Database URL
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-gray-100 rounded text-sm font-mono">
                {config.databaseUrl === 'Not set' ? 'Not set' : 'Set (hidden for security)'}
              </code>
              {getStatusBadge(config.databaseUrl)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connection Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Verbinding Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Test de verbinding met Supabase om te controleren of alles correct is geconfigureerd.
              </p>
              <Button
                onClick={testConnection}
                disabled={loading}
                className="bg-amber-600 hover:bg-amber-700"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testen...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Test Verbinding
                  </>
                )}
              </Button>
            </div>

            {connectionTest && (
              <div className={`p-4 rounded-lg border ${
                connectionTest.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {connectionTest.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`font-medium ${
                    connectionTest.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {connectionTest.success ? 'Verbinding Succesvol' : 'Verbinding Mislukt'}
                  </span>
                </div>
                {connectionTest.error && (
                  <p className="text-sm text-red-700">{connectionTest.error}</p>
                )}
                {connectionTest.details && (
                  <details className="mt-2">
                    <summary className="text-sm text-gray-600 cursor-pointer">
                      Details bekijken
                    </summary>
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                      {JSON.stringify(connectionTest.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Helpful Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Hulpmiddelen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <a
              href="/debug-env"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Environment Variables Debug
            </a>
            <a
              href="/debug-vercel"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Vercel Debug Page
            </a>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Supabase Dashboard
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Probleemoplossing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Als de verbinding faalt, controleer je environment variables in Vercel</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Zorg dat je Supabase project actief is en niet gepauzeerd</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Controleer of je API keys correct zijn gekopieerd</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Verifieer dat je Site URL correct is ingesteld in Supabase</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 