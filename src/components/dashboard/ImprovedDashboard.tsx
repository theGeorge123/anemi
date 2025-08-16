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
  CheckCircle, XCircle, Clock as ClockIcon, Filter, Eye
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
      'confirmed': { label: 'Bevestigd', color: 'bg-green-100 text-green-800' },
      'pending': { label: 'In Afwachting', color: 'bg-yellow-100 text-yellow-800' },
      'declined': { label: 'Afgewezen', color: 'bg-red-100 text-red-800' },
      'expired': { label: 'Verlopen', color: 'bg-gray-100 text-gray-800' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getInviteLink = (token: string) => {
    return `${window.location.origin}/invite/${token}`
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const shareInvite = async (meetup: MeetupInvite) => {
    const inviteData = {
      title: `☕ Koffie Meetup bij ${meetup.cafe.name}`,
      text: `${meetup.organizerName} nodigt je uit voor een koffie meetup in ${meetup.cafe.city}!`,
      url: getInviteLink(meetup.token)
    }

    if (navigator.share) {
      try {
        await navigator.share(inviteData)
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      copyToClipboard(inviteData.url)
    }
  }

  const getFilteredMeetups = () => {
    if (statusFilter === 'all') return meetups
    
    return meetups.filter(meetup => {
      if (statusFilter === 'confirmed') return meetup.status === 'confirmed'
      if (statusFilter === 'pending') return meetup.status === 'pending'
      if (statusFilter === 'declined') return meetup.status === 'declined'
      return true
    })
  }

  const filteredMeetups = getFilteredMeetups()

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Laden van je meetups... ☕</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-amber-800 mb-2">
              Welkom terug! 👋
            </h1>
            <p className="text-amber-700">
              Beheer je koffie meetups en uitnodigingen
            </p>
          </div>
          <Button asChild className="bg-amber-600 hover:bg-amber-700">
            <Link href="/create">
              <Plus className="w-4 h-4 mr-2" />
              Nieuwe Meetup
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{meetups.length}</div>
            <div className="text-sm text-gray-600">Totaal Meetups</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {meetups.filter(m => m.status === 'confirmed').length}
            </div>
            <div className="text-sm text-gray-600">Bevestigd</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {meetups.filter(m => m.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">In Afwachting</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {meetups.filter(m => m.status === 'declined').length}
            </div>
            <div className="text-sm text-gray-600">Afgewezen</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
            className="text-xs"
          >
            Alle ({meetups.length})
          </Button>
          <Button
            variant={statusFilter === 'confirmed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('confirmed')}
            className="text-xs"
          >
            Bevestigd ({meetups.filter(m => m.status === 'confirmed').length})
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('pending')}
            className="text-xs"
          >
            In Afwachting ({meetups.filter(m => m.status === 'pending').length})
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="text-xs"
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="text-xs"
          >
            Lijst
          </Button>
        </div>
      </div>

      {/* Meetups Grid/List */}
      {filteredMeetups.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {filteredMeetups.map((meetup) => (
            <Card key={meetup.id} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-amber-100">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate mb-2">
                      ☕ {meetup.cafe.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {meetup.cafe.city}
                      </span>
                    </div>
                    {getStatusBadge(meetup.status)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {/* Key Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">
                      Door: <span className="font-medium">{meetup.organizerName}</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">
                      Gemaakt: <span className="font-medium">{formatDate(meetup.createdAt)}</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-gray-600">
                      Vervalt: <span className="font-medium">{formatDate(meetup.expiresAt)}</span>
                    </span>
                  </div>
                </div>

                {/* Confirmed Date/Time */}
                {meetup.chosenDate && meetup.chosenTime && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Bevestigd: {formatDate(meetup.chosenDate)} om {meetup.chosenTime}
                      </span>
                    </div>
                  </div>
                )}

                {/* Response Stats */}
                {meetup.responses && (
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-3 h-3" />
                      <span>{meetup.responses.accepted || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-600">
                      <ClockIcon className="w-3 h-3" />
                      <span>{meetup.responses.pending || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 text-red-600">
                      <XCircle className="w-3 h-3" />
                      <span>{meetup.responses.declined || 0}</span>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareInvite(meetup)}
                    className="text-xs border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    <Share2 className="w-3 h-3 mr-1" />
                    Delen
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(getInviteLink(meetup.token))}
                    className="text-xs border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Link
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="text-xs"
                  >
                    <Link href={`/invite/${meetup.token}`}>
                      <Eye className="w-3 h-3 mr-1" />
                      Bekijk
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">☕</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {meetups.length === 0 ? 'Nog geen meetups' : 'Geen meetups gevonden'}
          </h3>
          <p className="text-gray-600 mb-6">
            {meetups.length === 0 
              ? 'Start je eerste koffie meetup en nodig vrienden uit!'
              : 'Probeer andere filters of maak een nieuwe meetup aan.'
            }
          </p>
          <Button asChild className="bg-amber-600 hover:bg-amber-700">
            <Link href="/create">
              <Plus className="w-4 h-4 mr-2" />
              Start een Meetup
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
