"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Clock, Users, ExternalLink, Copy, Check, Plus } from 'lucide-react'
import Link from 'next/link'

interface Meetup {
  id: string
  token: string
  organizerName: string
  organizerEmail: string
  status: string
  createdAt: string
  expiresAt: string
  cafe: {
    id: string
    name: string
    address: string
    city: string
  }
  availableDates: string[]
  availableTimes: string[]
  chosenDate?: string
  chosenTime?: string
  inviteeName?: string
  inviteeEmail?: string
}

export function FindMyMeetups() {
  const [email, setEmail] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [searchType, setSearchType] = useState<'email' | 'code'>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [meetups, setMeetups] = useState<Meetup[]>([])
  const [error, setError] = useState<string | null>(null)
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (searchType === 'email' && !email.trim()) return
    if (searchType === 'code' && !inviteCode.trim()) return

    setIsLoading(true)
    setError(null)
    setMeetups([])

    try {
      let response
      if (searchType === 'email') {
        response = await fetch('/api/meetups/find-by-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email.trim() }),
        })
      } else {
        response = await fetch('/api/meetups/find-by-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inviteCode: inviteCode.trim() }),
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to find meetups')
      }

      const data = await response.json()
      setMeetups(data.meetups)
      
      if (data.meetups.length === 0) {
        setError(searchType === 'email' 
          ? 'Geen meetups gevonden voor dit email adres'
          : 'Geen meetup gevonden voor deze uitnodigingscode'
        )
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Er ging iets mis')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedToken(text)
      setTimeout(() => setCopiedToken(null), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const addToCalendar = (meetup: Meetup) => {
    // Use chosen date and time if available, otherwise use first available
    const dateToUse = meetup.chosenDate || meetup.availableDates[0]
    const timeToUse = meetup.chosenTime || meetup.availableTimes[0]
    
    if (!dateToUse || !timeToUse) {
      alert('Geen datum en tijd beschikbaar voor deze meetup')
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
      title: `☕ Koffie meetup met ${meetup.organizerName}`,
      description: `Koffie meetup bij ${meetup.cafe.name}\n\nAdres: ${meetup.cafe.address}\n\nGekozen datum: ${dateToUse}\nGekozen tijd: ${timeToUse}`,
      location: meetup.cafe.address,
      startDateTime,
      endDateTime
    }

    // Create Google Calendar URL
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&dates=${event.startDateTime}/${event.endDateTime}`

    // Open in new tab
    window.open(googleCalendarUrl, '_blank')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">⏳ Wachten op reactie</Badge>
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">✅ Bevestigd!</Badge>
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800 border-green-200">✅ Geaccepteerd!</Badge>
      case 'declined':
        return <Badge className="bg-red-100 text-red-800 border-red-200">❌ Afgewezen</Badge>
      case 'expired':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">⏰ Verlopen</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Type Toggle */}
      <div className="flex justify-center px-4">
        <div className="bg-gray-100 rounded-lg p-1 w-full max-w-sm">
          <button
            type="button"
            onClick={() => setSearchType('email')}
            className={`w-1/2 px-3 py-2 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              searchType === 'email'
                ? 'bg-white text-amber-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📧 <span className="hidden xs:inline">Email </span>Zoeken
          </button>
          <button
            type="button"
            onClick={() => setSearchType('code')}
            className={`w-1/2 px-3 py-2 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              searchType === 'code'
                ? 'bg-white text-amber-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🔍 <span className="hidden xs:inline">Code </span>Zoeken
          </button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="space-y-4 px-4">
        {searchType === 'email' ? (
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email adres
            </Label>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jouw@email.com"
                className="flex-1 text-base"
                required
              />
              <Button 
                type="submit" 
                disabled={isLoading || !email.trim()}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2 text-base sm:whitespace-nowrap"
              >
                {isLoading ? 'Zoeken...' : 'Zoeken'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Label htmlFor="inviteCode" className="text-sm font-medium text-gray-700">
              Uitnodigingscode
            </Label>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
              <Input
                id="inviteCode"
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Voer de uitnodigingscode in"
                className="flex-1 text-base"
                required
              />
              <Button 
                type="submit" 
                disabled={isLoading || !inviteCode.trim()}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2 text-base sm:whitespace-nowrap"
              >
                {isLoading ? 'Zoeken...' : 'Zoeken'}
              </Button>
            </div>
          </div>
        )}
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {meetups.length > 0 && (
        <div className="space-y-4">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              {meetups.length} meetup{meetups.length !== 1 ? 's' : ''} gevonden! ☕
            </h4>
            <p className="text-gray-600 text-sm">
              Klik op een meetup om de details te bekijken
            </p>
          </div>

          {/* Show pending meetups first */}
          {meetups.filter(m => m.status === 'pending').length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h5 className="font-semibold text-yellow-800 mb-2">
                ⏳ {meetups.filter(m => m.status === 'pending').length} Uitnodiging{meetups.filter(m => m.status === 'pending').length !== 1 ? 'en' : ''} in Afwachting
              </h5>
              <p className="text-yellow-700 text-sm">
                Je hebt nog uitnodigingen die wachten op je reactie. Klik op &quot;Bekijk&quot; om te reageren!
              </p>
            </div>
          )}

          <div className="grid gap-4">
            {meetups
              .sort((a, b) => {
                // Sort pending first, then by creation date (newest first)
                if (a.status === 'pending' && b.status !== 'pending') return -1
                if (a.status !== 'pending' && b.status === 'pending') return 1
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              })
              .map((meetup) => (
              <Card key={meetup.id} className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 mb-1">
                        Koffie bij {meetup.cafe.name}
                      </h5>
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusBadge(meetup.status)}
                      </div>
                    </div>
                                         <div className="flex gap-2">
                       <Button
                         size="sm"
                         variant="outline"
                         onClick={() => copyToClipboard(`https://anemi-meets.vercel.app/invite/${meetup.token}`)}
                         className="border-amber-300 text-amber-700 hover:bg-amber-50"
                       >
                         {copiedToken === meetup.token ? (
                           <>
                             <Check className="w-3 h-3 mr-1" />
                             Gekopieerd!
                           </>
                         ) : (
                           <>
                             <Copy className="w-3 h-3 mr-1" />
                             Link
                           </>
                         )}
                       </Button>
                       <Button
                         size="sm"
                         variant="outline"
                         onClick={() => addToCalendar(meetup)}
                         className="border-green-300 text-green-700 hover:bg-green-50"
                       >
                         <Plus className="w-3 h-3 mr-1" />
                         Kalender
                       </Button>
                       <Link href={`/invite/${meetup.token}`}>
                         <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                           <ExternalLink className="w-3 h-3 mr-1" />
                           Bekijk
                         </Button>
                       </Link>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span>{meetup.cafe.address}, {meetup.cafe.city}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-3 h-3" />
                        <span>Door: {meetup.organizerName}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(meetup.createdAt)}</span>
                      </div>
                      {meetup.chosenDate && meetup.chosenTime && (
                        <div className="flex items-center gap-2 text-green-600 font-medium">
                          <Clock className="w-3 h-3" />
                          <span>Gekozen: {meetup.chosenDate} om {meetup.chosenTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center pt-4 border-t border-amber-200">
            <p className="text-sm text-gray-600 mb-3">
              💡 Tip: Maak een account om al je meetups op één plek te beheren!
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 