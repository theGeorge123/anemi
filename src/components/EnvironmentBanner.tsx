"use client"

import { useState, useEffect } from 'react'
import { AlertTriangle, X, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EnvironmentCheck {
  name: string
  value: string | undefined
  required: boolean
  description: string
}

export function EnvironmentBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [environmentIssues, setEnvironmentIssues] = useState<EnvironmentCheck[]>([])

  useEffect(() => {
    const checks: EnvironmentCheck[] = [
      {
        name: 'NEXT_PUBLIC_SITE_URL',
        value: process.env.NEXT_PUBLIC_SITE_URL,
        required: true,
        description: 'Site URL for email links and invites'
      },
      {
        name: 'NEXT_PUBLIC_SUPABASE_URL',
        value: process.env.NEXT_PUBLIC_SUPABASE_URL,
        required: true,
        description: 'Supabase project URL'
      },
      {
        name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        required: true,
        description: 'Supabase anonymous key'
      },
      {
        name: 'RESEND_API_KEY',
        value: process.env.RESEND_API_KEY,
        required: true,
        description: 'Resend API key for email sending'
      },
      {
        name: 'EMAIL_FROM',
        value: process.env.EMAIL_FROM,
        required: false,
        description: 'Default sender email (optional)'
      }
    ]

    const issues = checks.filter(check => {
      if (check.required) {
        return !check.value || check.value === 'undefined' || check.value === ''
      }
      return false
    })

    setEnvironmentIssues(issues)
    setShowBanner(issues.length > 0 && process.env.NODE_ENV === 'development')
  }, [])

  if (!showBanner) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-4 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">
                ⚠️ Environment Variables Misconfigured
              </h3>
              <p className="text-sm mb-3">
                The following required environment variables are missing or invalid:
              </p>
              <div className="space-y-2">
                {environmentIssues.map((issue) => (
                  <div key={issue.name} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-300 rounded-full"></div>
                    <span className="font-mono text-sm">{issue.name}</span>
                    <span className="text-xs opacity-75">- {issue.description}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs opacity-75">
                <p>Please check your <code>.env.local</code> file and Vercel environment variables.</p>
                <p>Refer to <code>env.example</code> for the required variables.</p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBanner(false)}
            className="text-white hover:bg-red-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Component to show environment status in development
export function EnvironmentStatus() {
  const [status, setStatus] = useState<{
    valid: boolean
    checks: EnvironmentCheck[]
  }>({ valid: false, checks: [] })

  useEffect(() => {
    const checks: EnvironmentCheck[] = [
      {
        name: 'NEXT_PUBLIC_SITE_URL',
        value: process.env.NEXT_PUBLIC_SITE_URL,
        required: true,
        description: 'Site URL'
      },
      {
        name: 'NEXT_PUBLIC_SUPABASE_URL',
        value: process.env.NEXT_PUBLIC_SUPABASE_URL,
        required: true,
        description: 'Supabase URL'
      },
      {
        name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        required: true,
        description: 'Supabase Key'
      },
      {
        name: 'RESEND_API_KEY',
        value: process.env.RESEND_API_KEY,
        required: true,
        description: 'Email API Key'
      }
    ]

    const valid = checks.every(check => 
      check.value && check.value !== 'undefined' && check.value !== ''
    )

    setStatus({ valid, checks })
  }, [])

  if (process.env.NODE_ENV !== 'development') return null

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-center space-x-2 mb-3">
          {status.valid ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-500" />
          )}
          <span className="text-sm font-medium">
            Environment Status
          </span>
        </div>
        
        <div className="space-y-1">
          {status.checks.map((check) => (
            <div key={check.name} className="flex items-center space-x-2">
              {check.value && check.value !== 'undefined' && check.value !== '' ? (
                <CheckCircle className="w-3 h-3 text-green-500" />
              ) : (
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              )}
              <span className="text-xs font-mono">{check.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 