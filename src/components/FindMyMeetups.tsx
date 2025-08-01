"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Clock, Users, ExternalLink, Copy, Check, Plus, AlertTriangle, CheckCircle, XCircle, Clock as ClockIcon, Home, Search, Sparkles, Coffee, Heart, Share2, CalendarDays } from 'lucide-react'
import Link from 'next/link'
import { errorService, useErrorService } from '@/lib/error-service'
import { ErrorDisplay } from '@/components/ErrorDisplay'

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

interface StatusGroup {
  title: string
  description: string
  icon: React.ReactNode
  bgColor: string
  borderColor: string
  textColor: string
  meetups: Meetup[]
}

export function FindMyMeetups() {
  const [inviteCode, setInviteCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [meetups, setMeetups] = useState<Meetup[]>([])
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  
  // Use ErrorService
  const { error, handleError, clearError } = useErrorService()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inviteCode.trim()) return

    setIsLoading(true)
    clearError()
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
        const noResultsError = new Error('Geen meetup gevonden met deze uitnodigingscode')
        handleError(noResultsError)
      }
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Er ging iets mis'))
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedToken(text)
      setTimeout(() => setCopiedToken(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const addToCalendar = (meetup: Meetup) => {
    if (!meetup.chosenDate || !meetup.chosenTime) {
      alert('Geen datum en tijd gekozen voor deze meetup')
      return
    }

    const formatDate = (d: Date) => {
      return d.toISOString().replace(/-|:|\.\d+/g, '')
    }

    const startDate = new Date(`${meetup.chosenDate}T${meetup.chosenTime}`)
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000) // 1 hour later

    const calendarUrl = [
      'https://calendar.google.com/calendar/render',
      '?action=TEMPLATE',
      `&text=Koffie bij ${meetup.cafe.name}`,
      `&details=Meetup georganiseerd door ${meetup.organizerName}%0A%0ALocatie: ${meetup.cafe.name}%0AAdres: ${meetup.cafe.address}, ${meetup.cafe.city}%0A%0ABekijk details: https://anemi-meets.vercel.app/invite/${meetup.token}`,
      `&location=${meetup.cafe.address}, ${meetup.cafe.city}`,
      `&dates=${formatDate(startDate)}/${formatDate(endDate)}`
    ].join('')

    window.open(calendarUrl, '_blank')
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
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse">⏳ In afwachting</Badge>
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

  const getStatusGroups = (meetups: Meetup[]): StatusGroup[] => {
    const groups: { [key: string]: Meetup[] } = {
      pending: [],
      confirmed: [],
      accepted: [],
      declined: [],
      expired: []
    }

    // Group meetups by status
    meetups.forEach(meetup => {
      const status = meetup.status as keyof typeof groups
      if (groups[status]) {
        groups[status].push(meetup)
      }
    })

    // Create status group objects
    const statusGroups: StatusGroup[] = []

    if (groups.pending && groups.pending.length > 0) {
      statusGroups.push({
        title: '⏳ In Afwachting',
        description: `${groups.pending.length} uitnodiging${groups.pending.length !== 1 ? 'en' : ''} wachten op je reactie`,
        icon: <AlertTriangle className="w-5 h-5" />,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800',
        meetups: groups.pending
      })
    }

    if ((groups.confirmed && groups.confirmed.length > 0) || (groups.accepted && groups.accepted.length > 0)) {
      const confirmedMeetups = [
        ...(groups.confirmed || []),
        ...(groups.accepted || [])
      ]
      statusGroups.push({
        title: '✅ Bevestigd',
        description: `${confirmedMeetups.length} meetup${confirmedMeetups.length !== 1 ? 's' : ''} zijn bevestigd`,
        icon: <CheckCircle className="w-5 h-5" />,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        meetups: confirmedMeetups
      })
    }

    if (groups.declined && groups.declined.length > 0) {
      statusGroups.push({
        title: '❌ Afgewezen',
        description: `${groups.declined.length} uitnodiging${groups.declined.length !== 1 ? 'en' : ''} zijn afgewezen`,
        icon: <XCircle className="w-5 h-5" />,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        meetups: groups.declined
      })
    }

    if (groups.expired && groups.expired.length > 0) {
      statusGroups.push({
        title: '⏰ Verlopen',
        description: `${groups.expired.length} uitnodiging${groups.expired.length !== 1 ? 'en' : ''} zijn verlopen`,
        icon: <ClockIcon className="w-5 h-5" />,
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        textColor: 'text-gray-800',
        meetups: groups.expired
      })
    }

    return statusGroups
  }

  const renderMeetupCard = (meetup: Meetup) => (
    <Card key={meetup.id} className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-xl hover:scale-105 transition-all duration-300 transform">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
          <div className="flex-1">
            <h5 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg flex items-center gap-2">
              <Coffee className="w-4 h-4 text-amber-600" />
              Koffie bij {meetup.cafe.name}
            </h5>
            <div className="flex items-center gap-2 mb-3">
              {getStatusBadge(meetup.status)}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(`https://anemi-meets.vercel.app/invite/${meetup.token}`)}
              className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 text-xs sm:text-sm px-3 py-2 transition-all duration-200 transform hover:scale-105"
            >
              {copiedToken === meetup.token ? (
                <>
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 animate-bounce" />
                  <span className="hidden sm:inline">Gekopieerd!</span>
                  <span className="sm:hidden">✓</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Delen</span>
                  <span className="sm:hidden">📋</span>
                </>
              )}
            </Button>
            {meetup.chosenDate && meetup.chosenTime && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => addToCalendar(meetup)}
                className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 text-xs sm:text-sm px-3 py-2 transition-all duration-200 transform hover:scale-105"
              >
                <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Kalender</span>
                <span className="sm:hidden">📅</span>
              </Button>
            )}
            <Link href={`/invite/${meetup.token}`}>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm px-3 py-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Bekijk</span>
                <span className="sm:hidden">👁️</span>
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
            {meetup.status === 'pending' && (
              <div className="flex items-center gap-2 text-yellow-600 font-medium">
                <Clock className="w-3 h-3" />
                <span>Verloopt: {formatDate(meetup.expiresAt)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Back to Home Button */}
      <div className="text-center mb-6">
        <Link href="/">
          <Button 
            variant="outline" 
            className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Terug naar Home
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSearch} className="space-y-6 px-4">
        <div className="space-y-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-300 to-orange-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Search className="w-8 h-8 text-white" />
            </div>
            <Label htmlFor="inviteCode" className="text-xl sm:text-2xl font-bold text-gray-800">
              🔍 Vind je Meetups
            </Label>
            <p className="text-gray-600 mt-2">
              Voer je invite token in om je meetups te bekijken
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-3">
            <Input
              id="inviteCode"
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Voer de invite token in (bijv. abc123def)"
              className="flex-1 text-base sm:text-lg px-4 py-3 sm:py-4 border-2 border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
              required
            />
            <Button 
              type="submit" 
              disabled={isLoading || !inviteCode.trim()}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 sm:py-4 text-base sm:text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Zoeken...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Zoeken
                </>
              )}
            </Button>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-pink-500" />
              <span className="text-sm font-medium text-blue-800">💡 Handige Tips</span>
              <Heart className="w-4 h-4 text-pink-500" />
            </div>
            <div className="text-sm text-blue-700 space-y-1">
              <p>🔑 De invite token vind je in je uitnodiging (email of WhatsApp)</p>
              <p>✨ Geen account nodig - gewoon je token invoeren!</p>
              <p>🎉 Alle meetups worden automatisch gevonden en gegroepeerd</p>
            </div>
          </div>
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <ErrorDisplay 
          error={error} 
          onDismiss={clearError}
          onRetry={error.retryable ? () => handleSearch(new Event('submit') as any) : undefined}
        />
      )}

      {meetups.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-300 to-emerald-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Coffee className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              🎉 {meetups.length} meetup{meetups.length !== 1 ? 's' : ''} gevonden!
            </h4>
            <p className="text-gray-600 text-sm">
              Je meetups zijn gegroepeerd per status voor overzicht
            </p>
          </div>

          {/* Status Groups */}
          {getStatusGroups(meetups).map((group, index) => (
            <div key={index} className={`${group.bgColor || 'bg-white'} border ${group.borderColor} rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200`}>
              <div className="flex items-center gap-2 mb-3">
                {group.icon}
                <h5 className={`font-semibold ${group.textColor}`}>
                  {group.title}
                </h5>
              </div>
              <p className={`text-sm ${group.textColor} mb-4`}>
                {group.description}
              </p>
              
              <div className="grid gap-4">
                {group.meetups.map(renderMeetupCard)}
              </div>
            </div>
          ))}

          <div className="text-center pt-6 border-t border-amber-200 mt-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-4 shadow-md">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-blue-800 mb-2 text-lg">🚀 Account aanmaken?</h4>
              <p className="text-sm text-blue-700 mb-4">
                Je kunt meetups bekijken en accepteren zonder account. Maar met een account kun je:
              </p>
              <ul className="text-sm text-blue-700 text-left space-y-2 mb-4 max-w-md mx-auto">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Al je meetups op één plek beheren
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Meetup details aanpassen
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Automatisch koppelen van nieuwe uitnodigingen
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/auth/signup">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Account Aanmaken
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 transform hover:scale-105">
                    <Heart className="w-4 h-4 mr-2" />
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