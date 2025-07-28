"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Clock, Users, ExternalLink, Copy, Check, Plus, AlertTriangle, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react'
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
  const [email, setEmail] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [searchType, setSearchType] = useState<'email' | 'code'>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [meetups, setMeetups] = useState<Meetup[]>([])
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  
  // Use ErrorService
  const { error, handleError, clearError } = useErrorService()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (searchType === 'email' && !email.trim()) return
    if (searchType === 'code' && !inviteCode.trim()) return

    setIsLoading(true)
    clearError()
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
        const noResultsError = new Error(searchType === 'email' 
          ? 'Geen meetups gevonden voor dit email adres'
          : 'Geen meetup gevonden voor deze uitnodigingscode'
        )
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
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">⏳ In afwachting</Badge>
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
            {meetup.chosenDate && meetup.chosenTime && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => addToCalendar(meetup)}
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                <Plus className="w-3 h-3 mr-1" />
                Kalender
              </Button>
            )}
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
      {/* Search Type Toggle */}
      <div className="flex justify-center">
        <div className="bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setSearchType('email')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              searchType === 'email'
                ? 'bg-white text-amber-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📧 Email Zoeken
          </button>
          <button
            type="button"
            onClick={() => setSearchType('code')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              searchType === 'code'
                ? 'bg-white text-amber-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🔍 Code Zoeken
          </button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        {searchType === 'email' ? (
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email adres
            </Label>
            <div className="mt-1 flex gap-2">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jouw@email.com"
                className="flex-1"
                required
              />
              <Button 
                type="submit" 
                disabled={isLoading || !email.trim()}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              >
                {isLoading ? 'Zoeken...' : 'Zoeken'}
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <Label htmlFor="inviteCode" className="text-sm font-medium text-gray-700">
              Uitnodigingscode
            </Label>
            <div className="mt-1 flex gap-2">
              <Input
                id="inviteCode"
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Voer de uitnodigingscode in"
                className="flex-1"
                required
              />
              <Button 
                type="submit" 
                disabled={isLoading || !inviteCode.trim()}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              >
                {isLoading ? 'Zoeken...' : 'Zoeken'}
              </Button>
            </div>
          </div>
        )}
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
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              {meetups.length} meetup{meetups.length !== 1 ? 's' : ''} gevonden! ☕
            </h4>
            <p className="text-gray-600 text-sm">
              Je meetups zijn gegroepeerd per status
            </p>
          </div>

          {/* Status Groups */}
          {getStatusGroups(meetups).map((group, index) => (
            <div key={index} className={`${group.bgColor || 'bg-white'} border ${group.borderColor} rounded-lg p-4`}>
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