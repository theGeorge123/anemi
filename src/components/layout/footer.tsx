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
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Anemi Meets</h3>
            <p className="text-sm text-muted-foreground">
              Verbind met je community over koffie. Ontdek lokale meetups en koffie shops.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/create" className="text-muted-foreground hover:text-foreground">
                  Meetup Maken
                </Link>
              </li>
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Home
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Ondersteuning</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:team@anemimeets.com" className="text-muted-foreground hover:text-foreground">
                  Contact
                </a>
              </li>
              <li>
                <a href="/api/health" className="text-muted-foreground hover:text-foreground">
                  Systeem Status
                </a>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Rechtelijk</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/legal/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacybeleid
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-muted-foreground hover:text-foreground">
                  Gebruiksvoorwaarden
                </Link>
              </li>
              {session && (
                <li>
                  <button
                    onClick={() => setShowConfirmation(true)}
                    className="text-red-600 hover:text-red-700 text-left w-full flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Account Verwijderen
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            © 2024 Anemi Meets. Alle rechten voorbehouden.
          </p>
        </div>
      </div>

      {/* Account Deletion Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">Account Verwijderen</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-3">
                Weet je zeker dat je je account wilt verwijderen? Deze actie is <strong>onomkeerbaar</strong>.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Al je meetups worden verwijderd</li>
                <li>• Je profiel en instellingen gaan verloren</li>
                <li>• Je kunt niet meer inloggen met dit account</li>
                <li>• Alle data wordt permanent verwijderd</li>
              </ul>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                variant="destructive"
                className="flex-1"
              >
                {isDeleting ? 'Verwijderen...' : 'Ja, Verwijder Account'}
              </Button>
              <Button
                onClick={() => {
                  setShowConfirmation(false)
                  setError(null)
                }}
                variant="outline"
                className="flex-1"
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