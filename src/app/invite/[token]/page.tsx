"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DeclineModal } from '@/components/meetups/DeclineModal'
import { Calendar, MapPin, Star, Clock, Users, Home, LogIn, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useSupabase } from '@/components/SupabaseProvider'

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
  const { session, supabase } = useSupabase()
  
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
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [showAuthOptions, setShowAuthOptions] = useState(false)

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        setLoading(true)
        console.log('Fetching invite for token:', token)
        const response = await fetch(`/api/invite/${token}`)
        console.log('Response status:', response.status)
        
        if (response.status === 404) {
          throw new Error('❌ Deze uitnodiging bestaat niet of is verlopen')
        } else if (response.status === 410) {
          throw new Error('⏰ Deze uitnodiging is verlopen')
        } else if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || '❌ Er ging iets mis bij het laden van de uitnodiging')
        }
        
        const data = await response.json()
        console.log('Invite data:', data)
        setInvite(data.invite)
      } catch (err) {
        console.error('Error fetching invite:', err)
        setError(err instanceof Error ? err.message : '❌ Er ging iets mis bij het laden van de uitnodiging')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchInvite()
    }
  }, [token])

  const handleAccept = async () => {
    console.log('handleAccept called')
    console.log('inviteeName:', inviteeName)
    console.log('inviteeEmail:', inviteeEmail)
    console.log('selectedDate:', selectedDate)
    console.log('selectedTime:', selectedTime)
    
    if (!inviteeName.trim() || !inviteeEmail.trim()) {
      setError('Vul je naam en email in')
      return
    }

    if (!selectedDate || !selectedTime) {
      setError('Kies een datum en tijd')
      return
    }

    try {
      setAccepting(true)
      console.log('Sending accept request...')
      const response = await fetch(`/api/invite/${token}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inviteeName,
          inviteeEmail,
          selectedDate,
          selectedTime,
          userId: session?.user?.id || null,
        }),
      })

      console.log('Accept response status:', response.status)
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Accept error:', errorData)
        throw new Error('Failed to accept invite')
      }

      const result = await response.json()
      console.log('Accept success:', result)

      // Redirect to confirmed page
      if (typeof window !== 'undefined') {
        window.location.href = '/confirmed?status=accepted'
      }
    } catch (error) {
      console.error('Error in handleAccept:', error)
      setError('Kon invite niet accepteren. Probeer het opnieuw.')
    } finally {
      setAccepting(false)
    }
  }

  const handleDecline = async (reason: string) => {
    console.log('handleDecline called with reason:', reason)
    console.log('inviteeName:', inviteeName)
    console.log('inviteeEmail:', inviteeEmail)
    
    if (!inviteeName.trim() || !inviteeEmail.trim()) {
      setError('Vul je naam en email in')
      return
    }

    try {
      setDeclining(true)
      console.log('Sending decline request...')
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

      console.log('Decline response status:', response.status)
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Decline error:', errorData)
        throw new Error('Failed to decline invite')
      }

      const result = await response.json()
      console.log('Decline success:', result)

      // Redirect to confirmed page
      if (typeof window !== 'undefined') {
        window.location.href = '/confirmed?status=declined'
      }
    } catch (error) {
      console.error('Error in handleDecline:', error)
      setError('Kon invite niet afwijzen. Probeer het opnieuw.')
    } finally {
      setDeclining(false)
      setShowDeclineModal(false)
    }
  }

  const addToCalendar = () => {
    if (!invite) return

    // Use selected date and time if available, otherwise use first available
    const dateToUse = selectedDate || invite.availableDates[0]
    const timeToUse = selectedTime || invite.availableTimes[0]
    
    if (!dateToUse || !timeToUse) {
      alert('Kies eerst een datum en tijd')
      return
    }

    // Parse date and time
    const date = new Date(dateToUse)
    const timeParts = timeToUse.split(':').map(Number)
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
      description: `Koffie meetup bij ${invite.cafe.name}\n\nAdres: ${invite.cafe.address}\n\nGekozen datum: ${dateToUse}\nGekozen tijd: ${timeToUse}`,
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-2 sm:p-4">
        <Card className="w-full max-w-md mx-2 sm:mx-4">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">☕</span>
              </div>
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-amber-500 mx-auto mb-3 sm:mb-4"></div>
              <p className="text-sm sm:text-base text-gray-600">Even geduld, we laden je invite...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="text-center">
              {/* Error Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                {error.includes('verlopen') ? (
                  <span className="text-4xl">⏰</span>
                ) : error.includes('niet gevonden') ? (
                  <span className="text-4xl">🔍</span>
                ) : (
                  <span className="text-4xl">😕</span>
                )}
              </div>

              {/* Error Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {error.includes('verlopen') ? '⏰ Uitnodiging Verlopen' : 
                 error.includes('niet gevonden') ? '🔍 Uitnodiging Niet Gevonden' :
                 '❌ Oeps! Er ging iets mis'}
              </h2>

              {/* Error Message */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {error.includes('verlopen') ? 
                  'Deze uitnodiging is verlopen. Uitnodigingen zijn geldig voor een beperkte tijd om de planning soepel te houden.' :
                 error.includes('niet gevonden') ?
                  'We kunnen deze uitnodiging niet vinden. Controleer of je de juiste link hebt gebruikt.' :
                  'Er is een probleem opgetreden bij het laden van de uitnodiging. Probeer het later opnieuw.'}
              </p>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <Button 
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = '/'
                    }
                  }}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white h-12 font-semibold shadow-lg"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Terug naar Home
                </Button>
                
                <Link href="/create">
                  <Button variant="outline" className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 h-12 font-medium">
                    <span className="text-lg mr-2">☕</span>
                    Nieuwe Meetup Maken
                  </Button>
                </Link>
              </div>

              {/* Help Section */}
              <div className="space-y-4">
                {/* What to do next */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <span className="text-lg">💡</span>
                    Wat kun je doen?
                  </h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {error.includes('verlopen') ? (
                      <>
                        <li>• Vraag de organisator om een nieuwe uitnodiging</li>
                        <li>• Maak zelf een nieuwe meetup aan</li>
                        <li>• Bekijk andere beschikbare meetups</li>
                      </>
                    ) : (
                      <>
                        <li>• Controleer of je de juiste link hebt gekregen</li>
                        <li>• Neem contact op met de organisator</li>
                        <li>• Maak je eigen meetup aan</li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Contact section */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                    <span className="text-lg">📞</span>
                    Hulp nodig?
                  </h3>
                  <p className="text-sm text-amber-700 mb-3">
                    Neem contact op als je vragen hebt over je uitnodiging
                  </p>
                  <div className="flex gap-2">
                    <Link href="/contact">
                      <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                        Contact
                      </Button>
                    </Link>
                    <Link href="/system-status">
                      <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                        Systeem Status
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Technical details for debugging */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <details className="text-xs">
                      <summary className="cursor-pointer text-gray-600 font-medium">
                        🔧 Technische Details (Development)
                      </summary>
                      <div className="mt-2 p-2 bg-white rounded border">
                        <p className="text-gray-700 font-mono break-all">
                          Token: {token}
                        </p>
                        <p className="text-gray-700 font-mono break-all">
                          Error: {error}
                        </p>
                      </div>
                    </details>
                  </div>
                )}
              </div>
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-2 sm:p-4">
      {/* Back to Home Button */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
        <Link href="/">
          <Button 
            variant="ghost" 
            className="flex items-center gap-1 sm:gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 text-xs sm:text-sm backdrop-blur-sm bg-white/80"
          >
            <Home className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">← Terug naar Home</span>
            <span className="sm:hidden">← Home</span>
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-2xl mx-2 sm:mx-4 shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg animate-pulse">
              <span className="text-3xl sm:text-4xl">☕</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Je bent uitgenodigd voor een koffie! 🎉
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600">
              <strong className="text-amber-700">{invite.organizerName}</strong> heeft een meetup gepland en nodigt je uit
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Organizer Info */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 sm:p-4 rounded-lg border border-amber-200">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                Uitnodiging van:
              </h3>
              <p className="text-gray-700 text-sm sm:text-base font-medium">{invite.organizerName}</p>
            </div>

            {/* Cafe Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    ☕ {invite.cafe.name}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3">
                    {invite.cafe.description || 'Een gezellige koffie shop met geweldige sfeer'}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                      <span>{getRatingStars(invite.cafe.rating)} {invite.cafe.rating.toFixed(1)}</span>
                      <span className="text-gray-500">({invite.cafe.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-base sm:text-lg">{getPriceEmoji(invite.cafe.priceRange)}</span>
                      <span>{invite.cafe.priceRange}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="break-words">{invite.cafe.address}</span>
                  </div>
                </div>
              </div>

              {/* Cafe Features */}
              {invite.cafe.features.length > 0 && (
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
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
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  onClick={openInMaps}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 h-8 sm:h-auto"
                >
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Open in Maps</span>
                  <span className="sm:hidden">Maps</span>
                </Button>
                
                <Button
                  onClick={addToCalendar}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 h-8 sm:h-auto"
                >
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Toevoegen aan Kalender</span>
                  <span className="sm:hidden">Kalender</span>
                </Button>
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                Kies een datum:
              </h3>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3">
                {invite.availableDates.map((date) => {
                  const isSelected = selectedDate === date
                  const formattedDate = new Date(date).toLocaleDateString('nl-NL', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                  })
                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-sm font-medium min-h-[60px] flex items-center justify-center ${
                        isSelected 
                          ? 'bg-amber-500 text-white border-amber-500 shadow-md transform scale-105' 
                          : 'bg-white text-gray-700 border-gray-200 hover:border-amber-300 hover:bg-amber-50'
                      }`}
                    >
                      {formattedDate}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                Kies een tijd:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {invite.availableTimes.map((time) => {
                  const isSelected = selectedTime === time
                  return (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium min-h-[50px] flex items-center justify-center ${
                        isSelected 
                          ? 'bg-amber-500 text-white border-amber-500 shadow-md transform scale-105' 
                          : 'bg-white text-gray-700 border-gray-200 hover:border-amber-300 hover:bg-amber-50'
                      }`}
                    >
                    {time}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Account Requirements Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4">
              <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">ℹ️ Account vereisten</h4>
              <div className="text-xs sm:text-sm text-blue-700 space-y-1">
                <p>• ✅ <strong>Bekijken en accepteren:</strong> Geen account nodig</p>
                <p>• 🔐 <strong>Wijzigen van details:</strong> Account vereist</p>
                <p>• 📱 <strong>Alle meetups beheren:</strong> Account vereist</p>
              </div>
            </div>

            {/* Account Status & Info */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                Jouw gegevens:
              </h3>

              {session ? (
                // User is logged in
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-green-700 font-medium text-sm sm:text-base">✅ Ingelogd als {session.user.email}</span>
                  </div>
                  <p className="text-green-600 text-xs sm:text-sm">
                    Je meetup zal verschijnen in je dashboard na acceptatie!
                  </p>
                  
                  <div className="mt-3">
                    <Label htmlFor="name" className="text-sm sm:text-base font-medium">Naam</Label>
                    <Input
                      id="name"
                      value={inviteeName}
                      onChange={(e) => setInviteeName(e.target.value)}
                      placeholder="Jouw naam"
                      className="mt-2"
                    />
                  </div>
                </div>
              ) : (
                // User is not logged in
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                      <span className="text-amber-700 font-medium text-sm sm:text-base">💡 Maak een account om je meetups te beheren</span>
                    </div>
                    <p className="text-amber-600 text-xs sm:text-sm mb-3">
                      Met een account kun je al je meetups zien, beheren en nieuwe avonturen maken!
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={() => setShowAuthOptions(true)}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white h-10 sm:h-auto"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Account maken
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowAuthOptions(true)}
                        className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50 h-10 sm:h-auto"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Inloggen
                      </Button>
                    </div>
                  </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="guestName" className="text-sm sm:text-base font-medium">Naam</Label>
                  <Input
                    id="guestName"
                    value={inviteeName}
                    onChange={(e) => setInviteeName(e.target.value)}
                    placeholder="Jouw naam"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="guestEmail" className="text-sm sm:text-base font-medium">Email</Label>
                  <Input
                    id="guestEmail"
                    type="email"
                    value={inviteeEmail}
                    onChange={(e) => setInviteeEmail(e.target.value)}
                    placeholder="jouw@email.com"
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Je email wordt alleen gebruikt voor bevestiging en updates
                  </p>
                </div>
              </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-xs sm:text-sm">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <Button
                onClick={handleAccept}
                disabled={accepting || declining || !inviteeName.trim() || !inviteeEmail.trim() || !selectedDate || !selectedTime}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white h-12 sm:h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                {accepting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Accepteren...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✅</span>
                    Ja, ik ga mee!
                  </div>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowDeclineModal(true)}
                disabled={accepting || declining || !inviteeName.trim() || !inviteeEmail.trim()}
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50 h-12 sm:h-auto font-semibold transition-all duration-200"
              >
                {declining ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    Afwijzen...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">❌</span>
                    Nee, helaas
                  </div>
                )}
              </Button>
            </div>

            {/* Selection Summary */}
            {(selectedDate || selectedTime) && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 sm:p-4 animate-in slide-in-from-bottom-2 duration-300">
                <h4 className="font-semibold text-green-800 mb-2 text-sm sm:text-base flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Jouw keuze:
                </h4>
                <div className="space-y-2 text-xs sm:text-sm">
                  {selectedDate && (
                    <div className="flex items-center gap-2 bg-white/50 p-2 rounded">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                      <span className="text-green-700 font-medium">
                        {new Date(selectedDate).toLocaleDateString('nl-NL', { 
                          weekday: 'long', 
                          year: 'numeric',
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  )}
                  {selectedTime && (
                    <div className="flex items-center gap-2 bg-white/50 p-2 rounded">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                      <span className="text-green-700 font-medium">{selectedTime}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

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

      {/* Auth Options Modal */}
      {showAuthOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md shadow-2xl">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">☕</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Word lid van Anemi Meets!</h3>
                <p className="text-gray-600 text-sm">
                  Maak een account om je meetups te beheren en nieuwe avonturen te ontdekken
                </p>
              </div>

              <div className="space-y-3">
                <Link href={`/auth/signup?redirect=${encodeURIComponent(`/invite/${token}`)}`}>
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white h-12">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Account maken
                  </Button>
                </Link>
                
                <Link href={`/auth/signin?redirect=${encodeURIComponent(`/invite/${token}`)}`}>
                  <Button variant="outline" className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 h-12">
                    <LogIn className="w-4 h-4 mr-2" />
                    Inloggen
                  </Button>
                </Link>
                
                <div className="text-center">
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowAuthOptions(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Later doen
                  </Button>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Je kunt ook zonder account deelnemen, maar dan zie je je meetups niet in je dashboard
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 