"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DebugLocalPage() {
  const [showKeys, setShowKeys] = useState(false)

  const correctEnvVars = {
    NEXT_PUBLIC_SUPABASE_URL: "https://cceqmxxtjbuxbznatskj.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZXFteHh0amJ1eGJ6bmF0c2tqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNzE1MDYsImV4cCI6MjA2Njg0NzUwNn0.ZWAOpEoirnszXj0Pw91SGnA03HxW0eBvU8GIoH4OEXI",
    NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
    SUPABASE_SERVICE_ROLE_KEY: "Je-service-role-key-hier (vraag aan mij)",
    RESEND_API_KEY: "Je-resend-api-key-hier",
    EMAIL_FROM: "noreply@anemi-meets.com"
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">🔧 Localhost Development Setup</h1>
      
      <div className="mb-6">
        <Button onClick={() => setShowKeys(!showKeys)}>
          {showKeys ? '🔒 Hide Keys' : '🔓 Show Keys'}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Problem */}
        <Card className="p-6 bg-red-50 border-red-200">
          <h2 className="text-xl font-semibold text-red-800 mb-4">❌ Het Probleem</h2>
          <div className="space-y-2 text-sm text-red-700">
            <p>• Je bent op localhost (development)</p>
            <p>• NEXT_PUBLIC_SITE_URL is missing</p>
            <p>• Supabase connectie faalt door CORS/network issues</p>
            <p>• Environment variables zijn niet correct ingesteld</p>
          </div>
        </Card>

        {/* Solution */}
        <Card className="p-6 bg-green-50 border-green-200">
          <h2 className="text-xl font-semibold text-green-800 mb-4">✅ De Oplossing</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Maak een .env.local file in je project root:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`# Database
DATABASE_URL="postgresql://username:password@localhost:5432/anemi_meets"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="${correctEnvVars.NEXT_PUBLIC_SUPABASE_URL}"
NEXT_PUBLIC_SUPABASE_ANON_KEY="${correctEnvVars.NEXT_PUBLIC_SUPABASE_ANON_KEY}"
SUPABASE_SERVICE_ROLE_KEY="${showKeys ? correctEnvVars.SUPABASE_SERVICE_ROLE_KEY : 'your-service-role-key'}"
${showKeys ? `# Email (Resend)
RESEND_API_KEY="${correctEnvVars.RESEND_API_KEY}"
EMAIL_FROM="${correctEnvVars.EMAIL_FROM}"` : ''}

# Site URL voor localhost
NEXT_PUBLIC_SITE_URL="${correctEnvVars.NEXT_PUBLIC_SITE_URL}"

# Development
NODE_ENV="development"
DEBUG="anemi-meets:*"`}
              </pre>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">2. Restart je development server:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm">
{`npm run dev
# of
yarn dev`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. Test de connectie:</h3>
              <p className="text-sm">Ga naar: <a href="/debug-vercel" className="text-blue-600 underline">http://localhost:3000/debug-vercel</a></p>
            </div>
          </div>
        </Card>

        {/* Current Status */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">📊 Huidige Status</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Environment:</span>
              <span className="font-mono">localhost (development)</span>
            </div>
            <div className="flex justify-between">
              <span>NODE_ENV:</span>
              <span className="font-mono">development</span>
            </div>
            <div className="flex justify-between">
              <span>Domain:</span>
              <span className="font-mono">localhost:3000</span>
            </div>
            <div className="flex justify-between">
              <span>Supabase URL:</span>
              <span className="font-mono">{correctEnvVars.NEXT_PUBLIC_SUPABASE_URL}</span>
            </div>
          </div>
        </Card>

        {/* Troubleshooting */}
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <h2 className="text-xl font-semibold text-yellow-800 mb-4">🔧 Troubleshooting</h2>
          <div className="space-y-2 text-sm text-yellow-700">
            <p>• <strong>File niet gevonden?</strong> Maak .env.local aan in je project root</p>
            <p>• <strong>Keys niet correct?</strong> Vraag de juiste keys aan mij</p>
            <p>• <strong>Server restart nodig?</strong> Stop en start je dev server opnieuw</p>
            <p>• <strong>CORS errors?</strong> Check of je Supabase project online is</p>
            <p>• <strong>Network errors?</strong> Check je internet connectie</p>
          </div>
        </Card>
      </div>
    </div>
  )
} 