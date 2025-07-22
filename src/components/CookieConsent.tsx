"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem('cookie-consent')
    if (!hasAccepted) {
      setShowBanner(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShowBanner(false)
  }

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🍪</span>
            <h3 className="font-semibold text-gray-900">Cookie Instellingen</h3>
          </div>
          <p className="text-sm text-gray-600">
            We gebruiken cookies om je ervaring te verbeteren en onze service te analyseren. 
            Door onze website te gebruiken, ga je akkoord met ons{' '}
            <a href="/legal/privacy" className="text-amber-600 hover:underline">
              privacybeleid
            </a>.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={declineCookies}
            className="text-gray-600 hover:text-gray-800"
          >
            Weigeren
          </Button>
          <Button
            size="sm"
            onClick={acceptCookies}
            className="bg-amber-600 hover:bg-amber-700"
          >
            Accepteren
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBanner(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 