"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface InviteData {
  token: string
  organizerName: string
  organizerEmail: string
  cafeId: string
  availableDates: string[]
  availableTimes: string[]
  status: string
  expiresAt: string
}

export default function InvitePage() {
  const params = useParams()
  const token = params.token as string
  
  const [invite, setInvite] = useState<InviteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inviteeName, setInviteeName] = useState('')
  const [inviteeEmail, setInviteeEmail] = useState('')
  const [accepting, setAccepting] = useState(false)

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/invite/${token}`)
        if (!response.ok) {
          throw new Error('Invite not found or expired')
        }
        const data = await response.json()
        setInvite(data.invite)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load invite')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchInvite()
    }
  }, [token])

  const handleAccept = async () => {
    if (!inviteeName.trim() || !inviteeEmail.trim()) {
      setError('Please fill in your name and email')
      return
    }

    try {
      setAccepting(true)
      const response = await fetch(`/api/invite/${token}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inviteeName,
          inviteeEmail,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to accept invite')
      }

      // Redirect to success page or dashboard
      window.location.href = '/dashboard?invite=accepted'
    } catch (error) {
      setError('Failed to accept invite. Please try again.')
    } finally {
      setAccepting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading invite...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">😕</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Invite Not Found</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.href = '/'}>
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!invite) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">☕</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Je bent uitgenodigd voor een koffie!
            </h1>
            <p className="text-gray-600">
              {invite.organizerName} heeft een meetup gepland en nodigt je uit
            </p>
          </div>

          <div className="space-y-6">
            {/* Organizer Info */}
            <div className="bg-amber-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Uitnodiging van:</h3>
              <p className="text-gray-700">{invite.organizerName}</p>
            </div>

            {/* Available Dates */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Beschikbare data:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {invite.availableDates.map((date) => (
                  <div key={date} className="bg-gray-100 p-2 rounded text-sm text-center">
                    {new Date(date).toLocaleDateString('nl-NL', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Available Times */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Beschikbare tijden:</h3>
              <div className="flex flex-wrap gap-2">
                {invite.availableTimes.map((time) => (
                  <span key={time} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {time}
                  </span>
                ))}
              </div>
            </div>

            {/* Your Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Jouw gegevens:</h3>
              
              <div>
                <Label htmlFor="name">Naam</Label>
                <Input
                  id="name"
                  value={inviteeName}
                  onChange={(e) => setInviteeName(e.target.value)}
                  placeholder="Jouw naam"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={inviteeEmail}
                  onChange={(e) => setInviteeEmail(e.target.value)}
                  placeholder="jouw@email.com"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleAccept}
                disabled={accepting || !inviteeName.trim() || !inviteeEmail.trim()}
                className="flex-1 bg-amber-500 hover:bg-amber-600"
              >
                {accepting ? 'Accepteren...' : '✅ Accepteren'}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="flex-1"
              >
                ❌ Afwijzen
              </Button>
            </div>

            <div className="text-center text-xs text-gray-500 mt-4">
              <p>Deze invite verloopt op {new Date(invite.expiresAt).toLocaleDateString('nl-NL')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 