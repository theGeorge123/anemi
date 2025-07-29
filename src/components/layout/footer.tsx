"use client"

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useSupabase } from '@/components/SupabaseProvider'
import { Trash2, AlertTriangle } from 'lucide-react'

export function Footer() {
  const { session, supabase } = useSupabase()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDeleteAccount = async () => {
    if (!session || !supabase) {
      setError('Je moet ingelogd zijn om je account te verwijderen.')
      return
    }

    setIsDeleting(true)
    setError(null)

    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      const accessToken = currentSession?.access_token

      if (!accessToken) {
        throw new Error('Geen toegangstoken beschikbaar. Log opnieuw in.')
      }

      const response = await fetch('/api/user/data-deletion', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Fout bij het verwijderen van account')
      }

      // Account succesvol verwijderd, redirect naar home
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Error deleting account:', error)
      setError(error instanceof Error ? error.message : 'Er is een fout opgetreden')
    } finally {
      setIsDeleting(false)
      setShowConfirmation(false)
    }
  }

  return (
    <footer className="border-t-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
      <div className="container py-8 sm:py-12 md:py-16 px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {/* Company Info */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-display font-bold text-foreground">Anemi Meets</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Verbind met je community over koffie. Ontdek lokale meetups en koffie shops.
            </p>
          </div>
          
          {/* Platform Links */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-display font-semibold text-foreground">Platform</h4>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <li>
                <Link href="/create" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Meetup Maken
                </Link>
              </li>
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Home
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support Links */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-display font-semibold text-foreground">Ondersteuning</h4>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/system-status" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Systeem Status
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal Links */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-display font-semibold text-foreground">Rechtelijk</h4>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <li>
                <Link href="/legal/privacy" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Privacybeleid
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Gebruiksvoorwaarden
                </Link>
              </li>
              {session && (
                <li>
                  <button
                    onClick={() => setShowConfirmation(true)}
                    className="text-red-600 hover:text-red-700 text-left w-full flex items-center gap-2 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm sm:text-base">Account Verwijderen</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t-2 border-amber-200">
          <p className="text-center text-sm sm:text-base text-muted-foreground">
            © 2024 Anemi Meets. Alle rechten voorbehouden.
          </p>
        </div>
      </div>

      {/* Account Deletion Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Account Verwijderen</h3>
            </div>
            
            <div className="mb-4 sm:mb-6">
              <p className="text-sm sm:text-base text-gray-600 mb-3">
                Weet je zeker dat je je account wilt verwijderen? Deze actie is <strong>onomkeerbaar</strong>.
              </p>
              <ul className="text-xs sm:text-sm text-gray-500 space-y-1">
                <li>• Al je meetups worden verwijderd</li>
                <li>• Je profiel en instellingen gaan verloren</li>
                <li>• Je kunt niet meer inloggen met dit account</li>
                <li>• Alle data wordt permanent verwijderd</li>
              </ul>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-xs sm:text-sm">{error}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                variant="destructive"
                className="flex-1 text-sm sm:text-base"
              >
                {isDeleting ? 'Verwijderen...' : 'Ja, Verwijder Account'}
              </Button>
              <Button
                onClick={() => {
                  setShowConfirmation(false)
                  setError(null)
                }}
                variant="outline"
                className="flex-1 text-sm sm:text-base"
                disabled={isDeleting}
              >
                Annuleren
              </Button>
            </div>
          </div>
        </div>
      )}
    </footer>
  )
} 