"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { clearStaleTokens } from '@/lib/supabase-browser'

export default function FixTokensPage() {
  const [isCleared, setIsCleared] = useState(false)
  const [tokenCount, setTokenCount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Count existing tokens
    if (typeof window !== 'undefined') {
      const tokens = Object.keys(localStorage).filter(key => 
        key.includes('sb-') || key.includes('supabase')
      )
      setTokenCount(tokens.length)
    }
  }, [])

  const handleClearTokens = () => {
    setLoading(true)
    
    try {
      // Clear tokens
      clearStaleTokens()
      
      // Update count
      const tokens = Object.keys(localStorage).filter(key => 
        key.includes('sb-') || key.includes('supabase')
      )
      setTokenCount(tokens.length)
      setIsCleared(true)
      
      // Auto redirect after 3 seconds
      setTimeout(() => {
        window.location.href = '/auth/signin'
      }, 3000)
      
    } catch (error) {
      console.error('Error clearing tokens:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">🔧 Fix Authentication Tokens</h1>
      
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">🚨 Probleem</h2>
        <p className="mb-4">
          Je hebt waarschijnlijk oude Supabase auth tokens van localhost in je browser die 
          niet meer werken op de Vercel domain. Dit veroorzaakt de "Invalid login credentials" error.
        </p>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
          <p className="text-yellow-800">
            <strong>Gevonden tokens:</strong> {tokenCount} Supabase tokens in localStorage
          </p>
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">🛠️ Oplossing</h2>
        <p className="mb-4">
          Klik op de knop hieronder om alle oude tokens te verwijderen. Dit zal:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>Alle Supabase localStorage items verwijderen</li>
          <li>Alle Supabase cookies verwijderen</li>
          <li>Je automatisch doorsturen naar de login pagina</li>
        </ul>
        
        <Button 
          onClick={handleClearTokens} 
          disabled={loading}
          className="w-full"
        >
          {loading ? '🔄 Clearing tokens...' : '🧹 Clear All Stale Tokens'}
        </Button>
      </Card>

      {isCleared && (
        <Card className="p-6 bg-green-50 border-green-200">
          <h2 className="text-xl font-semibold text-green-800 mb-2">✅ Tokens Cleared!</h2>
          <p className="text-green-700 mb-4">
            Alle oude tokens zijn verwijderd. Je wordt over 3 seconden doorgestuurd naar de login pagina.
          </p>
          <p className="text-green-700">
            <strong>Nieuwe token count:</strong> {tokenCount}
          </p>
        </Card>
      )}

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">📋 Manual Steps (Als automatisch niet werkt)</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Open DevTools (F12)</li>
          <li>Ga naar Application tab</li>
          <li>Ga naar Storage &gt; Local Storage</li>
          <li>Zoek en verwijder alle items die beginnen met &quot;sb-&quot;</li>
          <li>Ga naar Storage &gt; Cookies</li>
          <li>Zoek en verwijder alle cookies die beginnen met &quot;sb-&quot;</li>
          <li>Hard refresh (Ctrl/Cmd + Shift + R)</li>
        </ol>
      </Card>
    </div>
  )
} 