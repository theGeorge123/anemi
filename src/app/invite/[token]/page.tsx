"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DeclineModal } from '@/components/meetups/DeclineModal'
import { Calendar, MapPin, Star, Clock, Users, Home } from 'lucide-react'
import Link from 'next/link'

interface InviteData {
  token: string
  organizerName: string
  organizerEmail: string
  cafeId: string
  availableDates: string[]
  availableTimes: string[]
  status: string
  expiresAt: string
  cafe: {
    id: string
    name: string
    description: string
    address: string
    rating: number
    reviewCount: number
    priceRange: string
    features: string[]
    latitude: number
    longitude: number
  }
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
  const [declining, setDeclining] = useState(false)
  const [showDeclineModal, setShowDeclineModal] = useState(false)
  const [declineReason, setDeclineReason] = useState('')
  const [showCafeDetails, setShowCafeDetails] = useState(false)

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
      setError('Vul je naam en email in')
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

      // Redirect to success page
      window.location.href = '/confirmed?status=accepted'
    } catch (error) {
      setError('Kon invite niet accepteren. Probeer het opnieuw.')
    } finally {
      setAccepting(false)
    }
  }

  const handleDecline = async (reason: string) => {
    if (!inviteeName.trim() || !inviteeEmail.trim()) {
      setError('Vul je naam en email in')
      return
    }

    try {
      setDeclining(true)
      const response = await fetch(`/api/invite/${token}/decline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inviteeName,
          inviteeEmail,
          reason,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to decline invite')
      }

      // Redirect to decline page
      window.location.href = '/confirmed?status=declined'
    } catch (error) {
      setError('Kon invite niet afwijzen. Probeer het opnieuw.')
    } finally {
      setDeclining(false)
      setShowDeclineModal(false)
    }
  }

  const addToCalendar = () => {
    if (!invite) return

    // Get first available date and time
    const firstDate = invite.availableDates[0]
    const firstTime = invite.availableTimes[0]
    
    if (!firstDate || !firstTime) {
      alert('Geen beschikbare data of tijden gevonden')
      return
    }

    // Parse date and time
    const date = new Date(firstDate)
    const timeParts = firstTime.split(':').map(Number)
    const hours = timeParts[0] || 0
    const minutes = timeParts[1] || 0
    date.setHours(hours, minutes, 0, 0)
    
    // End time (1 hour later)
    const endDate = new Date(date)
    endDate.setHours(endDate.getHours() + 1)

    // Format for Google Calendar (YYYYMMDDTHHMMSSZ)
    const formatDate = (d: Date) => {
      return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    const startDateTime = formatDate(date)
    const endDateTime = formatDate(endDate)

    // Create calendar event data
    const event = {
      title: `☕ Koffie meetup met ${invite.organizerName}`,
      description: `Koffie meetup bij ${invite.cafe.name}\n\nAdres: ${invite.cafe.address}\n\nBeschikbare data: ${invite.availableDates.join(', ')}\nBeschikbare tijden: ${invite.availableTimes.join(', ')}`,
      location: invite.cafe.address,
      startDateTime,
      endDateTime
    }

    // Create Google Calendar URL
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&dates=${event.startDateTime}/${event.endDateTime}`

    // Open in new tab
    window.open(googleCalendarUrl, '_blank')
  }

  const openInMaps = () => {
    if (!invite?.cafe) return
    
    const { latitude, longitude } = invite.cafe
    const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`
    window.open(mapsUrl, '_blank')
  }

  const getPriceEmoji = (priceRange: string) => {
    switch (priceRange) {
      case 'BUDGET': return '💰'
      case 'MODERATE': return '☕'
      case 'EXPENSIVE': return '✨'
      case 'LUXURY': return '💎'
      default: return '☕'
    }
  }

  const getRatingStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">☕</span>
              </div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Even geduld, we laden je invite...</p>
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
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">😕</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Oeps! Invite niet gevonden</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.href = '/'}>
                Terug naar home
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
      {/* Back to Home Button */}
      <div className="absolute top-4 left-4">
        <Link href="/">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
          >
            <Home className="w-4 h-4" />
            ← Terug naar Home
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">☕</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Je bent uitgenodigd voor een koffie! 🎉
            </h1>
            <p className="text-gray-600 text-lg">
              <strong>{invite.organizerName}</strong> heeft een meetup gepland en nodigt je uit
            </p>
          </div>

          <div className="space-y-6">
            {/* Organizer Info */}
            <div className="bg-amber-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Uitnodiging van:</h3>
              <p className="text-gray-700">{invite.organizerName}</p>
            </div>

            {/* Cafe Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    ☕ {invite.cafe.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {invite.cafe.description || 'Een gezellige koffie shop met geweldige sfeer'}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>{getRatingStars(invite.cafe.rating)} {invite.cafe.rating.toFixed(1)}</span>
                      <span className="text-gray-500">({invite.cafe.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-lg">{getPriceEmoji(invite.cafe.priceRange)}</span>
                      <span>{invite.cafe.priceRange}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{invite.cafe.address}</span>
                  </div>
                </div>
              </div>

              {/* Cafe Features */}
              {invite.cafe.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {invite.cafe.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons for Cafe */}
              <div className="flex gap-3">
                <Button
                  onClick={openInMaps}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Open in Maps
                </Button>
                
                <Button
                  onClick={addToCalendar}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Toevoegen aan Kalender
                </Button>
              </div>
            </div>

            {/* Available Dates */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Beschikbare data:
              </h3>
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
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Beschikbare tijden:
              </h3>
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
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Jouw gegevens:
              </h3>
              
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
                disabled={accepting || declining || !inviteeName.trim() || !inviteeEmail.trim()}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              >
                {accepting ? 'Accepteren...' : '✅ Ja, ik ga mee!'}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowDeclineModal(true)}
                disabled={accepting || declining || !inviteeName.trim() || !inviteeEmail.trim()}
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
              >
                {declining ? 'Afwijzen...' : '❌ Nee, helaas'}
              </Button>
            </div>

            <div className="text-center text-xs text-gray-500 mt-4">
              <p>Deze invite verloopt op {new Date(invite.expiresAt).toLocaleDateString('nl-NL')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <DeclineModal
        isOpen={showDeclineModal}
        onClose={() => setShowDeclineModal(false)}
        onConfirm={handleDecline}
        isDeclining={declining}
      />
    </div>
  )
} 