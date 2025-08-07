"use client"

import { useState, useEffect, useCallback } from 'react'
import { useSupabase } from '@/components/SupabaseProvider'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { EditMeetupModal } from '@/components/meetups/EditMeetupModal'
import { Home, Users, Calendar, Clock, Eye, Filter, SortAsc, SortDesc, MapPin, Edit, Trash2, Eye as EyeIcon, Heart, MessageCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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
  preferences?: {
    preferredDates: { [date: string]: number }
    preferredTimes: { [time: string]: number }
  }
  // New fields for enhanced metrics
  totalInvites?: number
  participants?: {
    name: string
    email: string
    status: string
    responseDate?: string
    chosenDate?: string
    chosenTime?: string
  }[]
}

interface ViewResponsesModalProps {
  meetup: MeetupInvite | null
  isOpen: boolean
  onClose: () => void
}

function ViewResponsesModal({ meetup, isOpen, onClose }: ViewResponsesModalProps) {
  if (!isOpen || !meetup) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'declined':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const addToCalendar = () => {
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
      `&text=Koffie bij ${meetup.cafe?.name || 'Cafe'}`,
      `&details=Meetup georganiseerd door ${meetup.organizerName}%0A%0ALocatie: ${meetup.cafe?.name}%0AAdres: ${meetup.cafe?.address}, ${meetup.cafe?.city}%0A%0ABekijk details: ${process.env.NEXT_PUBLIC_SITE_URL}/invite/${meetup.token}`,
      `&location=${meetup.cafe?.address}, ${meetup.cafe?.city}`,
      `&dates=${formatDate(startDate)}/${formatDate(endDate)}`
    ].join('')

    window.open(calendarUrl, '_blank')
  }

  const openGoogleMaps = () => {
    if (meetup.cafe?.address && meetup.cafe?.city) {
      const address = encodeURIComponent(`${meetup.cafe.address}, ${meetup.cafe.city}`)
      window.open(`https://maps.google.com/?q=${address}`, '_blank')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                📊 Reacties voor {meetup.cafe?.name}
              </h2>
              <p className="text-sm text-gray-600">
                Bekijk alle reacties en details van je meetup
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="shrink-0"
            >
              ✕ Sluiten
            </Button>
          </div>

          {/* Meetup Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">📋 Meetup Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Cafe:</span> {meetup.cafe?.name}
              </div>
              <div>
                <span className="font-medium">Adres:</span> {meetup.cafe?.address}, {meetup.cafe?.city}
              </div>
              <div>
                <span className="font-medium">Organisator:</span> {meetup.organizerName}
              </div>
              <div>
                <span className="font-medium">Status:</span> {meetup.status}
              </div>
              {meetup.chosenDate && meetup.chosenTime && (
                <div className="sm:col-span-2">
                  <span className="font-medium">Gekozen datum:</span> {formatDate(meetup.chosenDate)} om {formatTime(meetup.chosenTime)}
                </div>
              )}
            </div>
          </div>

          {/* Confirmed Date and Time Section */}
          {meetup.chosenDate && meetup.chosenTime && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                ✅ Bevestigde Datum & Tijd
              </h3>
              <div className="text-green-700">
                <div className="text-lg font-medium">
                  {formatDate(meetup.chosenDate)} om {formatTime(meetup.chosenTime)}
                </div>
                <div className="text-sm mt-1">
                  Locatie: {meetup.cafe?.name} - {meetup.cafe?.address}, {meetup.cafe?.city}
                </div>
              </div>
            </div>
          )}

          {/* Response Statistics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">✅ {meetup.responses?.accepted || 0}</div>
              <div className="text-sm text-green-700">Geaccepteerd</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">⏳ {meetup.responses?.pending || 0}</div>
              <div className="text-sm text-yellow-700">In Afwachting</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">❌ {meetup.responses?.declined || 0}</div>
              <div className="text-sm text-red-700">Afgewezen</div>
            </div>
          </div>

          {/* Participants List */}
          {meetup.participants && meetup.participants.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">👥 Deelnemers</h3>
              <div className="space-y-3">
                {meetup.participants.map((participant, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    participant.status === 'accepted' ? 'bg-green-50 border-green-200' :
                    participant.status === 'declined' ? 'bg-red-50 border-red-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${
                            participant.status === 'accepted' ? 'bg-green-500' :
                            participant.status === 'declined' ? 'bg-red-500' :
                            'bg-yellow-500'
                          }`}></div>
                          <span className="font-medium text-gray-900">{participant.name}</span>
                          <span className="text-sm text-gray-600">({participant.email})</span>
                          <Badge className={`text-xs ${
                            participant.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            participant.status === 'declined' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {participant.status === 'accepted' ? '✅ Geaccepteerd' :
                             participant.status === 'declined' ? '❌ Afgewezen' :
                             '⏳ In Afwachting'}
                          </Badge>
                        </div>
                        
                        {/* Gekozen datum en tijd voor geaccepteerde participants */}
                        {participant.status === 'accepted' && participant.chosenDate && participant.chosenTime && (
                          <div className="ml-5 mb-2">
                            <div className="flex items-center gap-2 text-green-700">
                              <Calendar className="w-4 h-4" />
                              <span className="font-medium">Gekozen:</span>
                              <span>{formatDate(participant.chosenDate)} om {participant.chosenTime}</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Response datum */}
                        {participant.responseDate && (
                          <div className="ml-5 text-xs text-gray-500">
                            {participant.status === 'accepted' ? 'Geaccepteerd' : 
                             participant.status === 'declined' ? 'Afgewezen' : 'Gereageerd'} op: {formatDate(participant.responseDate)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            {meetup.chosenDate && meetup.chosenTime && (
              <Button
                variant="outline"
                size="sm"
                onClick={addToCalendar}
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                📅 Toevoegen aan Kalender
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={openGoogleMaps}
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              🗺️ Route
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface Story {
  id: string
  title: string
  name?: string
  excerpt?: string
  content: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  featured: boolean
  viewCount: number
  likeCount: number
  images: string[]
  tags: string[]
  publishedAt?: string
  createdAt: string
  author: {
    id: string
    name: string
    nickname?: string
    image?: string
  }
  _count: {
    likes: number
    comments: number
  }
}

function StoriesSection() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/api/stories?authorId=me&limit=10', {
          cache: 'no-store'
        })
        
        if (!response.ok) {
          setError('Failed to fetch stories')
          return
        }
        
        const data = await response.json()
        setStories(data.stories || [])
      } catch (error) {
        console.error('Error fetching stories:', error)
        setError('Failed to fetch stories')
      } finally {
        setLoading(false)
      }
    }

    fetchStories()
  }, [])

  const handleDelete = async (storyId: string) => {
    if (!confirm('Weet je zeker dat je dit verhaal wilt verwijderen?')) {
      return
    }

    try {
      const response = await fetch(`/api/stories/${storyId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setStories(prev => prev.filter(story => story.id !== storyId))
        alert('Verhaal succesvol verwijderd!')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Fout bij het verwijderen van het verhaal')
      }
    } catch (error) {
      console.error('Error deleting story:', error)
      alert('Er is een fout opgetreden bij het verwijderen van het verhaal')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Verhalen laden...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Er is een fout opgetreden bij het laden van je verhalen.</p>
        <Button onClick={() => window.location.reload()}>
          Opnieuw proberen
        </Button>
      </div>
    )
  }

  if (stories.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">📝</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Nog geen verhalen</h3>
        <p className="text-gray-600 mb-6">
          Deel je eerste coffee meeting verhaal en inspireer anderen!
        </p>
        <Button asChild>
          <Link href="/stories/create">
            Schrijf je eerste verhaal
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stories.map((story) => (
        <Card key={story.id} className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  <Link 
                    href={`/stories/${story.id}`}
                    className="hover:text-amber-600 transition-colors"
                  >
                    {story.title}
                  </Link>
                </h3>
                {story.excerpt && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {story.excerpt}
                  </p>
                )}
              </div>
              <div className="flex gap-1 ml-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link href={`/stories/${story.id}`}>
                    <EyeIcon className="w-3 h-3" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link href={`/stories/${story.id}`}>
                    <Edit className="w-3 h-3" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(story.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <EyeIcon className="w-3 h-3" />
                <span>{story.viewCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <span>{story._count.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                <span>{story._count.comments}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Badge 
                variant={story.status === 'PUBLISHED' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {story.status === 'PUBLISHED' ? 'Gepubliceerd' : 'Concept'}
              </Badge>
              
              {story.tags.length > 0 && (
                <div className="flex gap-1">
                  {story.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {story.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{story.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function DashboardClient() {
  const { supabase } = useSupabase()
  const [meetups, setMeetups] = useState<MeetupInvite[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingMeetup, setEditingMeetup] = useState<MeetupInvite | null>(null)
  const [viewResponsesModalOpen, setViewResponsesModalOpen] = useState(false)
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'responses'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const fetchMeetups = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Je moet ingelogd zijn om je meetups te bekijken')
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/meetups', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to fetch meetups')
      }

      const data = await response.json()
      setMeetups(data.meetups || [])
    } catch (error) {
      console.error('Error fetching meetups:', error)
      setError('Er ging iets mis bij het laden van je meetups')
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchMeetups()
  }, [fetchMeetups])

  const handleEditMeetup = (meetup: MeetupInvite) => {
    setEditingMeetup(meetup)
    setIsEditModalOpen(true)
  }

  const handleSaveMeetup = async (meetupId: string, updates: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('No session available')
      }

      const response = await fetch(`/api/meetups/${meetupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to update meetup')
      }

      // Refresh meetups
      await fetchMeetups()
      setIsEditModalOpen(false)
      setEditingMeetup(null)
    } catch (error) {
      console.error('Error updating meetup:', error)
      alert('Er ging iets mis bij het bijwerken van de meetup')
    }
  }

  const handleDeleteMeetup = async (meetupId: string) => {
    if (!confirm('Weet je zeker dat je deze meetup wilt verwijderen?')) {
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('No session available')
      }

      const response = await fetch(`/api/meetups/${meetupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to delete meetup')
      }

      // Refresh meetups
      await fetchMeetups()
      setIsEditModalOpen(false)
      setEditingMeetup(null)
    } catch (error) {
      console.error('Error deleting meetup:', error)
      alert('Er ging iets mis bij het verwijderen van de meetup')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Actief', className: 'bg-green-100 text-green-800' },
      pending: { label: 'In Afwachting', className: 'bg-yellow-100 text-yellow-800' },
      completed: { label: 'Voltooid', className: 'bg-blue-100 text-blue-800' },
      cancelled: { label: 'Geannuleerd', className: 'bg-red-100 text-red-800' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, className: 'bg-gray-100 text-gray-800' }

    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getInviteLink = (token: string) => {
    return `${window.location.origin}/invite/${token}`
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Link gekopieerd naar klembord!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const getSortedAndFilteredMeetups = () => {
    let filteredMeetups = [...meetups]

    // Apply status filter
    if (statusFilter !== 'all') {
      filteredMeetups = filteredMeetups.filter(meetup => meetup.status === statusFilter)
    }

    // Apply sorting
    filteredMeetups.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        case 'responses':
          aValue = (a.responses?.accepted || 0) + (a.responses?.declined || 0)
          bValue = (b.responses?.accepted || 0) + (b.responses?.declined || 0)
          break
        default:
          return 0
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filteredMeetups
  }

  const handleSort = (newSortBy: 'date' | 'status' | 'responses') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortOrder('desc')
    }
  }

  if (error) {
    const isAuthError = error.includes('token') || error.includes('authorization') || error.includes('Invalid') || error.includes('expired')
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-background to-orange-50 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200">
            {isAuthError ? (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">🔐 Inloggen Vereist</h2>
                <p className="text-gray-600 mb-6">
                  Je moet ingelogd zijn om je meetups te bekijken. Log in om door te gaan.
                </p>
                <Button asChild className="bg-amber-600 hover:bg-amber-700 w-full mb-3">
                  <Link href="/auth/signin">
                    🔐 Inloggen
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/">
                    ← Terug naar Home
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">⚠️ Er ging iets mis</h2>
                <p className="text-gray-600 mb-6">
                  We konden je meetups niet laden. Probeer het later opnieuw.
                </p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="bg-amber-600 hover:bg-amber-700 w-full mb-3"
                >
                  🔄 Opnieuw Proberen
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/">
                    ← Terug naar Home
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-background to-orange-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/">
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 text-base sm:text-lg px-3 sm:px-4 py-2 sm:py-3"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">← Terug naar Home</span>
              <span className="sm:hidden">← Home</span>
            </Button>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 sm:mt-6">📊 Mijn Meetups</h1>
          <p className="text-gray-600 mt-2 sm:mt-3 text-base sm:text-lg">Beheer je koffie meetups en uitnodigingen</p>
        </div>

        {/* Statistics Section */}
        {meetups.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-blue-600 font-medium">📧 Uitnodigingen</p>
                      <p className="text-lg sm:text-2xl font-bold text-blue-700">
                        {meetups.reduce((sum, meetup) => sum + (meetup.totalInvites || 0), 0)}
                      </p>
                    </div>
                    <div className="text-2xl sm:text-3xl">📧</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-green-600 font-medium">✅ Geaccepteerd</p>
                      <p className="text-lg sm:text-2xl font-bold text-green-700">
                        {meetups.reduce((sum, meetup) => sum + (meetup.responses?.accepted || 0), 0)}
                      </p>
                    </div>
                    <div className="text-2xl sm:text-3xl">✅</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-yellow-600 font-medium">⏳ In Afwachting</p>
                      <p className="text-lg sm:text-2xl font-bold text-yellow-700">
                        {meetups.reduce((sum, meetup) => sum + (meetup.responses?.pending || 0), 0)}
                      </p>
                    </div>
                    <div className="text-2xl sm:text-3xl">⏳</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-red-50 to-rose-50 border-red-200">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-red-600 font-medium">❌ Afgewezen</p>
                      <p className="text-lg sm:text-2xl font-bold text-red-700">
                        {meetups.reduce((sum, meetup) => sum + (meetup.responses?.declined || 0), 0)}
                      </p>
                    </div>
                    <div className="text-2xl sm:text-3xl">❌</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Insights */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Extra Inzichten</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Aantal Coffee Meetings */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-amber-600 font-medium">☕ Aantal Coffee Meetings</p>
                        <p className="text-2xl font-bold text-amber-700">
                          {meetups.length}
                        </p>
                      </div>
                      <div className="text-2xl">☕</div>
                    </div>
                  </div>

                  {/* Most Popular City */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600 font-medium">🌍 Populairste Stad</p>
                        <p className="text-2xl font-bold text-green-700">
                          {meetups.length > 0 
                            ? Object.entries(
                                meetups.reduce((acc, m) => {
                                  const city = m.cafe?.city || 'Onbekend'
                                  acc[city] = (acc[city] || 0) + 1
                                  return acc
                                }, {} as { [city: string]: number })
                              ).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'
                            : 'N/A'
                          }
                        </p>
                      </div>
                      <div className="text-2xl">🌍</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm sm:text-base font-medium text-gray-700">Filter:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                  className="text-xs sm:text-sm"
                >
                  Alle ({meetups.length})
                </Button>
                <Button
                  variant={statusFilter === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('pending')}
                  className="text-xs sm:text-sm"
                >
                  In Afwachting ({meetups.filter(m => (m.responses?.pending || 0) > 0).length})
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-medium text-gray-700">Sorteer:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort(sortBy === 'date' ? 'date' : 'date')}
                className="text-xs sm:text-sm"
              >
                {sortBy === 'date' ? <SortDesc className="w-3 h-3 sm:w-4 sm:h-4" /> : <SortAsc className="w-3 h-3 sm:w-4 sm:h-4" />}
                Datum
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort('responses')}
                className="text-xs sm:text-sm"
              >
                Reacties
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Laden van je meetups... ☕</p>
          </div>
        )}

        {/* Meetups List - Only show when not loading */}
        {!isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {getSortedAndFilteredMeetups().map((meetup) => (
              <Card key={meetup.id} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate mb-1">
                        ☕ {meetup.cafe.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {meetup.cafe.address}, {meetup.cafe.city}
                      </p>
                      {getStatusBadge(meetup.status)}
                    </div>
                  </div>
                  
                  {/* Main Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-500">Organisator</p>
                          <p className="text-sm font-medium text-gray-900">{meetup.organizerName}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-xs text-gray-500">Gemaakt</p>
                          <p className="text-sm font-medium text-gray-900">{formatDate(meetup.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <div>
                          <p className="text-xs text-gray-500">Vervalt</p>
                          <p className="text-sm font-medium text-gray-900">{formatDate(meetup.expiresAt)}</p>
                        </div>
                      </div>
                      
                      {meetup.chosenDate && meetup.chosenTime && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-600" />
                          <div>
                            <p className="text-xs text-gray-500">Bevestigd</p>
                            <p className="text-sm font-medium text-green-700">
                              {formatDate(meetup.chosenDate)} om {meetup.chosenTime}
                            </p>
                            {/* Toon wie de datum heeft gekozen */}
                            {meetup.participants && meetup.participants.find(p => 
                              p.status === 'accepted' && 
                              p.chosenDate === meetup.chosenDate && 
                              p.chosenTime === meetup.chosenTime
                            ) && (
                              <p className="text-xs text-gray-500 mt-1">
                                Gekozen door: {meetup.participants.find(p => 
                                  p.status === 'accepted' && 
                                  p.chosenDate === meetup.chosenDate && 
                                  p.chosenTime === meetup.chosenTime
                                )?.name}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Response Stats */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">📊 Reacties Overzicht</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">✅ {meetup.responses?.accepted || 0}</div>
                        <div className="text-xs text-gray-600">Geaccepteerd</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-600">⏳ {meetup.responses?.pending || 0}</div>
                        <div className="text-xs text-gray-600">In Afwachting</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600">❌ {meetup.responses?.declined || 0}</div>
                        <div className="text-xs text-gray-600">Afgewezen</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Accepted Participants */}
                  {meetup.participants && meetup.participants.filter(p => p.status === 'accepted').length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">✅ Geaccepteerd door:</h4>
                      <div className="space-y-2">
                        {meetup.participants
                          .filter(p => p.status === 'accepted')
                          .map((participant, index) => (
                            <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="font-medium text-gray-900">{participant.name}</span>
                                <span className="text-gray-500 text-sm">({participant.email})</span>
                              </div>
                              
                              {/* Gekozen datum en tijd */}
                              {participant.chosenDate && participant.chosenTime && (
                                <div className="ml-4 text-sm">
                                  <div className="flex items-center gap-1 text-green-700">
                                    <Calendar className="w-3 h-3" />
                                    <span className="font-medium">Gekozen:</span>
                                    <span>{formatDate(participant.chosenDate)} om {participant.chosenTime}</span>
                                  </div>
                                </div>
                              )}
                              
                              {/* Response datum */}
                              {participant.responseDate && (
                                <div className="ml-4 text-xs text-gray-500 mt-1">
                                  Geaccepteerd op: {formatDate(participant.responseDate)}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingMeetup(meetup)
                        setViewResponsesModalOpen(true)
                      }}
                      className="text-xs sm:text-sm"
                    >
                      <span className="hidden sm:inline">Bekijk Reacties</span>
                      <span className="sm:hidden">Reacties</span>
                    </Button>
                    
                    {meetup.chosenDate && meetup.chosenTime && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const formatDate = (d: Date) => {
                            return d.toISOString().replace(/-|:|\.\d+/g, '')
                          }
                          const startDate = new Date(`${meetup.chosenDate}T${meetup.chosenTime}`)
                          const endDate = new Date(startDate.getTime() + 60 * 60 * 1000)
                          const calendarUrl = [
                            'https://calendar.google.com/calendar/render',
                            '?action=TEMPLATE',
                            `&text=Koffie bij ${meetup.cafe.name}`,
                            `&details=Meetup georganiseerd door ${meetup.organizerName}%0A%0ALocatie: ${meetup.cafe.name}%0AAdres: ${meetup.cafe.address}, ${meetup.cafe.city}%0A%0ABekijk details: ${process.env.NEXT_PUBLIC_SITE_URL}/invite/${meetup.token}`,
                            `&location=${meetup.cafe.address}, ${meetup.cafe.city}`,
                            `&dates=${formatDate(startDate)}/${formatDate(endDate)}`
                          ].join('')
                          window.open(calendarUrl, '_blank')
                        }}
                        className="text-xs sm:text-sm border-green-300 text-green-700 hover:bg-green-50"
                      >
                        📅 Kalender
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const address = encodeURIComponent(`${meetup.cafe.address}, ${meetup.cafe.city}`)
                        window.open(`https://maps.google.com/?q=${address}`, '_blank')
                      }}
                      className="text-xs sm:text-sm border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      🗺️ Route
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditMeetup(meetup)}
                      className="text-xs sm:text-sm"
                    >
                      <span className="hidden sm:inline">Bewerken</span>
                      <span className="sm:hidden">Edit</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(getInviteLink(meetup.token))}
                      className="text-xs sm:text-sm"
                    >
                      <span className="hidden sm:inline">Kopieer Link</span>
                      <span className="sm:hidden">Link</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State - Only show when not loading and no meetups */}
        {!isLoading && getSortedAndFilteredMeetups().length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="text-6xl sm:text-8xl mb-4">☕</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              {meetups.length === 0 ? 'Nog geen meetups' : 'Geen meetups gevonden'}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              {meetups.length === 0 
                ? 'Start je eerste koffie meetup en nodig vrienden uit!'
                : 'Probeer andere filters of maak een nieuwe meetup aan.'
              }
            </p>
            <Button asChild className="bg-amber-600 hover:bg-amber-700">
              <Link href="/create">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Start een Meetup
              </Link>
            </Button>
          </div>
        )}

        {/* Stories Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">📝 Mijn Verhalen</h2>
              <p className="text-gray-600 mt-1">Beheer je coffee meeting verhalen</p>
            </div>
            <Button asChild className="bg-amber-600 hover:bg-amber-700">
              <Link href="/stories/create">
                ✍️ Nieuw Verhaal
              </Link>
            </Button>
          </div>
          
          <StoriesSection />
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && editingMeetup && (
          <EditMeetupModal
            meetup={editingMeetup}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false)
              setEditingMeetup(null)
            }}
            onSave={handleSaveMeetup}
            onDelete={handleDeleteMeetup}
          />
        )}

        {/* View Responses Modal */}
        {viewResponsesModalOpen && (
          <ViewResponsesModal
            meetup={editingMeetup || null}
            isOpen={viewResponsesModalOpen}
            onClose={() => setViewResponsesModalOpen(false)}
          />
        )}
      </div>
    </div>
  )
} 