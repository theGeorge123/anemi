'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/SupabaseProvider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  Home, Users, Calendar, Clock, MapPin, Edit, Trash2, 
  Heart, MessageCircle, Plus, Share2, Copy, QrCode,
  CheckCircle, XCircle, Clock as ClockIcon, Filter, Eye, Coffee
} from 'lucide-react'

interface MeetupInvite {
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
  inviteeUserId?: string
  createdBy?: string
  responses?: {
    accepted: number
    declined: number
    pending: number
  }
  participants?: {
    name: string
    email: string
    status: string
    responseDate?: string
    chosenDate?: string
    chosenTime?: string
  }[]
  confirmedDate?: string
  confirmedTime?: string
  invitees?: {
    name: string
    email: string
    status: string
    responseDate?: string
  }[]
  title?: string
}

export default function ImprovedDashboard() {
  const { user, supabase } = useSupabase()
  const [meetups, setMeetups] = useState<MeetupInvite[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    if (user) {
      fetchMeetups()
    }
  }, [user])

  const fetchMeetups = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/meetups', {
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setMeetups(data.meetups || [])
      }
    } catch (error) {
      console.error('Error fetching meetups:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { label: 'Bevestigd', variant: 'default', className: 'bg-green-100 text-green-800 border-green-200' },
      pending: { label: 'In afwachting', variant: 'secondary', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      declined: { label: 'Afgewezen', variant: 'destructive', className: 'bg-red-100 text-red-800 border-red-200' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <Badge variant={config.variant as any} className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getInviteLink = (meetup: MeetupInvite) => {
    return `${window.location.origin}/invite/${meetup.token}`
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const shareInvite = async (meetup: MeetupInvite) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Uitnodiging voor ${meetup.title}`,
          text: `Je bent uitgenodigd voor een koffie meetup!`,
          url: getInviteLink(meetup)
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      copyToClipboard(getInviteLink(meetup))
    }
  }

  const getFilteredMeetups = () => {
    if (statusFilter === 'all') return meetups
    return meetups.filter(meetup => meetup.status === statusFilter)
  }

  const filteredMeetups = getFilteredMeetups()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-amber-200 rounded w-1/3"></div>
            <div className="h-4 bg-amber-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-amber-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 border border-amber-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-800 mb-2 sm:mb-3">Welkom terug! 👋</h1>
            <p className="text-sm xs:text-base sm:text-lg text-amber-700">Beheer je koffie meetups en uitnodigingen</p>
          </div>
          <Button asChild className="bg-amber-600 hover:bg-amber-700 text-sm xs:text-base sm:text-lg px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 w-full sm:w-auto">
            <Link href="/create"><Plus className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 mr-2" />Nieuwe Meetup</Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg border border-amber-200 shadow-sm">
          <div className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-600 mb-1 sm:mb-2">{meetups.length}</div>
          <div className="text-xs xs:text-sm sm:text-base text-amber-700">Totaal Meetups</div>
        </div>
        <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg border border-amber-200 shadow-sm">
          <div className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-green-600 mb-1 sm:mb-2">{meetups.filter(m => m.status === 'confirmed').length}</div>
          <div className="text-xs xs:text-sm sm:text-base text-green-700">Bevestigd</div>
        </div>
        <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg border border-amber-200 shadow-sm">
          <div className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-600 mb-1 sm:mb-2">{meetups.filter(m => m.status === 'pending').length}</div>
          <div className="text-xs xs:text-sm sm:text-base text-yellow-700">In Afwachting</div>
        </div>
        <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg border border-amber-200 shadow-sm">
          <div className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-red-600 mb-1 sm:mb-2">{meetups.filter(m => m.status === 'declined').length}</div>
          <div className="text-xs xs:text-sm sm:text-base text-red-700">Afgewezen</div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
            className="text-xs xs:text-sm px-3 sm:px-4 py-2"
          >
            Alle ({meetups.length})
          </Button>
          <Button
            variant={statusFilter === 'confirmed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('confirmed')}
            className="text-xs xs:text-sm px-3 sm:px-4 py-2"
          >
            Bevestigd ({meetups.filter(m => m.status === 'confirmed').length})
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('pending')}
            className="text-xs xs:text-sm px-3 sm:px-4 py-2"
          >
            In Afwachting ({meetups.filter(m => m.status === 'pending').length})
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="text-xs xs:text-sm px-3 sm:px-4 py-2"
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="text-xs xs:text-sm px-3 sm:px-4 py-2"
          >
            Lijst
          </Button>
        </div>
      </div>

      {/* Meetups Grid/List */}
      {filteredMeetups.length > 0 ? (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8" : "space-y-4 sm:space-y-6"}>
          {filteredMeetups.map((meetup) => (
            <Card key={meetup.id} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-amber-100">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm xs:text-base sm:text-lg text-gray-900 flex-1 line-clamp-2">{meetup.title}</h3>
                  {getStatusBadge(meetup.status)}
                </div>
                <p className="text-xs xs:text-sm text-gray-600">{meetup.cafe?.name || 'Onbekend café'}</p>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-3 sm:space-y-4">
                {/* Key Info */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs xs:text-sm">
                  <div>
                    <span className="text-gray-500">Datum:</span>
                    <div className="font-medium">{meetup.chosenDate ? formatDate(meetup.chosenDate) : 'Niet gekozen'}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Tijd:</span>
                    <div className="font-medium">{meetup.chosenTime || 'Niet gekozen'}</div>
                  </div>
                </div>

                {/* Confirmed Date/Time */}
                {meetup.confirmedDate && meetup.confirmedTime && (
                  <div className="bg-green-50 p-2 sm:p-3 rounded-lg border border-green-200">
                    <div className="text-xs xs:text-sm text-green-800 font-medium">Bevestigde Details:</div>
                    <div className="text-xs xs:text-sm text-green-700">
                      {formatDate(meetup.confirmedDate)} om {meetup.confirmedTime}
                    </div>
                  </div>
                )}

                {/* Response Stats */}
                <div className="flex items-center justify-between text-xs xs:text-sm text-gray-600">
                  <span>Uitgenodigd: {meetup.invitees?.length || 0}</span>
                  <span>Bevestigd: {meetup.invitees?.filter(i => i.status === 'confirmed').length || 0}</span>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => shareInvite(meetup)} className="text-xs xs:text-sm border-blue-300 text-blue-700 hover:bg-blue-50 px-2 sm:px-3 py-1 sm:py-2">
                    <Share2 className="w-3 h-3 xs:w-4 xs:h-4 mr-1" />Delen
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(getInviteLink(meetup))} className="text-xs xs:text-sm border-purple-300 text-purple-700 hover:bg-purple-50 px-2 sm:px-3 py-1 sm:py-2">
                    <Copy className="w-3 h-3 xs:w-4 xs:h-4 mr-1" />Link
                  </Button>
                  <Button variant="outline" size="sm" asChild className="text-xs xs:text-sm px-2 sm:px-3 py-1 sm:py-2">
                    <Link href={`/invite/${meetup.token}`}><Eye className="w-3 h-3 xs:w-4 xs:h-4 mr-1" />Bekijk</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16 lg:py-20">
          <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Coffee className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 text-amber-700" />
          </div>
          <h3 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-2 sm:mb-3">
            {statusFilter === 'all' ? 'Nog geen meetups' : `Geen ${statusFilter} meetups`}
          </h3>
          <p className="text-sm xs:text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">
            {statusFilter === 'all' 
              ? 'Start je eerste koffie meetup en begin met herverbinden!'
              : `Je hebt nog geen ${statusFilter} meetups.`
            }
          </p>
          <Button asChild className="bg-amber-600 hover:bg-amber-700 text-sm xs:text-base sm:text-lg px-6 sm:px-8 lg:px-10 py-3 sm:py-4">
            <Link href="/create">
              <Plus className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 mr-2" />
              Start je Eerste Meetup
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
