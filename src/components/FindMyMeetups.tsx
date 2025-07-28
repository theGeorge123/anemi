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
  const [inviteCode, setInviteCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [meetups, setMeetups] = useState<Meetup[]>([])
  const [error, setError] = useState<string | null>(null)
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inviteCode.trim()) return

    setIsLoading(true)
    setError(null)
    setMeetups([])

    try {
      const response = await fetch('/api/meetups/find-by-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inviteCode: inviteCode.trim() }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to find meetups')
      }

      const data = await response.json()
      setMeetups(data.meetups)
      
                    if (data.meetups.length === 0) {
        setError('Geen meetup gevonden met deze uitnodigingscode')
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

      <form onSubmit={handleSearch} className="space-y-4 px-4">
        <div className="space-y-3">
          <Label htmlFor="inviteCode" className="text-sm sm:text-base font-medium text-gray-700">
            🔑 Vind je meetup met invite token
          </Label>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
            <Input
              id="inviteCode"
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Voer de invite token in (bijv. abc123def)"
              className="flex-1 text-base"
              required
            />
            <Button 
              type="submit" 
              disabled={isLoading || !inviteCode.trim()}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 text-base sm:whitespace-nowrap touch-target"
            >
              {isLoading ? 'Zoeken...' : 'Zoeken'}
            </Button>
          </div>
          <div className="text-xs sm:text-sm text-gray-500 text-center space-y-1">
            <p>🔑 De invite token vind je in je uitnodiging (email of WhatsApp)</p>
            <p>💡 Geen account nodig - gewoon je token invoeren!</p>
          </div>
        </div>
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

          <div className="space-y-4">
            {meetups
              .sort((a, b) => {
                // Sort pending first, then by creation date (newest first)
                if (a.status === 'pending' && b.status !== 'pending') return -1
                if (a.status !== 'pending' && b.status === 'pending') return 1
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              })
              .map((meetup) => (
              <Card key={meetup.id} className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 mb-2 text-lg">
                        ☕ {meetup.cafe.name}
                      </h5>
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusBadge(meetup.status)}
                      </div>
                    </div>
                    <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
                       <Link href={`/invite/${meetup.token}`} className="flex-1 xs:flex-none">
                         <Button className="w-full xs:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white touch-target">
                           <ExternalLink className="w-4 h-4 mr-2" />
                           {meetup.status === 'pending' ? 'Reageren' : 'Bekijk Details'}
                         </Button>
                       </Link>
                       <Button
                         variant="outline"
                         onClick={() => copyToClipboard(`${typeof window !== 'undefined' ? window.location.origin : 'https://anemi-meets.vercel.app'}/invite/${meetup.token}`)}
                         className="border-blue-300 text-blue-700 hover:bg-blue-50 touch-target"
                       >
                         {copiedToken === meetup.token ? (
                           <>
                             <Check className="w-4 h-4 mr-2" />
                             Gekopieerd!
                           </>
                         ) : (
                           <>
                             <Copy className="w-4 h-4 mr-2" />
                             Deel Link
                           </>
                         )}
                       </Button>
                     </div>
                  </div>

                  <div className="space-y-3 mt-4 pt-4 border-t border-amber-200">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{meetup.cafe.address}, {meetup.cafe.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Georganiseerd door: {meetup.organizerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Uitgenodigd op: {formatDate(meetup.createdAt)}</span>
                    </div>
                    {meetup.chosenDate && meetup.chosenTime && (
                      <div className="flex items-center gap-2 text-green-600 font-medium bg-green-50 p-2 rounded-lg">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">✅ Bevestigd: {meetup.chosenDate} om {meetup.chosenTime}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center pt-6 border-t border-amber-200 mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Account aanmaken?</h4>
              <p className="text-sm text-blue-700 mb-3">
                Je kunt meetups bekijken en accepteren zonder account. Maar met een account kun je:
              </p>
              <ul className="text-sm text-blue-700 text-left space-y-1 mb-3">
                <li>• Al je meetups op één plek beheren</li>
                <li>• Meetup details aanpassen</li>
                <li>• Automatisch koppelen van nieuwe uitnodigingen</li>
              </ul>
              <div className="flex flex-col xs:flex-row gap-2 justify-center">
                <Link href="/auth/signup">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Account Aanmaken
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button variant="outline" className="border-blue-300 text-blue-700">
                    Inloggen
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 