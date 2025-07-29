"use client"

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/SupabaseProvider'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { EditMeetupModal } from '@/components/meetups/EditMeetupModal'
import { BackgroundAgentStatus } from '@/components/BackgroundAgentStatus'
import { Home, Users, Calendar, Clock, Eye, Filter, SortAsc, SortDesc } from 'lucide-react'
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl sm:max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              📊 Reacties voor Meetup
            </h2>
            <Button onClick={onClose} variant="outline" size="sm" className="text-xs sm:text-sm">
              ✕ Sluiten
            </Button>
          </div>

          {/* Meetup Summary */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-amber-800 mb-2">
              ☕ {meetup.cafe?.name || 'Cafe'}
            </h3>
            <p className="text-sm text-amber-700">
              📅 {formatDate(meetup.createdAt)} • 🎫 {meetup.totalInvites || 0} uitnodigingen
            </p>
          </div>

          {/* Response Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">✅ Geaccepteerd</p>
                    <p className="text-2xl font-bold text-green-600">
                      {meetup.responses?.accepted || 0}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">❌ Afgewezen</p>
                    <p className="text-2xl font-bold text-red-600">
                      {meetup.responses?.declined || 0}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">⏳ In afwachting</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {meetup.responses?.pending || 0}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Participants List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              👥 Deelnemers ({meetup.participants?.length || 0})
            </h3>

            {meetup.participants && meetup.participants.length > 0 ? (
              <div className="space-y-3">
                {meetup.participants.map((participant, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-gray-900">
                              {participant.name || 'Anoniem'}
                            </h4>
                            <Badge className={getStatusColor(participant.status)}>
                              {participant.status === 'accepted' ? '✅ Geaccepteerd' :
                               participant.status === 'declined' ? '❌ Afgewezen' :
                               '⏳ In afwachting'}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            📧 {participant.email}
                          </p>

                          {participant.responseDate && (
                            <p className="text-xs text-gray-500">
                              📅 Reactie op: {formatDate(participant.responseDate)}
                            </p>
                          )}

                          {participant.chosenDate && participant.chosenTime && (
                            <div className="mt-2 p-2 bg-blue-50 rounded-md">
                              <p className="text-sm text-blue-800">
                                🗓️ Voorkeur: {formatDate(participant.chosenDate)} om {formatTime(participant.chosenTime)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Nog geen deelnemers</p>
              </div>
            )}
          </div>

          {/* Date/Time Preferences */}
          {meetup.preferences && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                📊 Datum/Tijd Voorkeuren
              </h3>

              {/* Date Preferences */}
              {meetup.preferences.preferredDates && Object.keys(meetup.preferences.preferredDates).length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">📅 Datum Voorkeuren</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(meetup.preferences.preferredDates)
                      .sort(([,a], [,b]) => b - a)
                      .map(([date, count]) => (
                        <div key={date} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm">{formatDate(date)}</span>
                          <Badge variant="secondary">{count} stemmen</Badge>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Time Preferences */}
              {meetup.preferences.preferredTimes && Object.keys(meetup.preferences.preferredTimes).length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">⏰ Tijd Voorkeuren</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(meetup.preferences.preferredTimes)
                      .sort(([,a], [,b]) => b - a)
                      .map(([time, count]) => (
                        <div key={time} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm">{time}</span>
                          <Badge variant="secondary">{count} stemmen</Badge>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DashboardClient() {
  const { supabase, session } = useSupabase()
  const [meetups, setMeetups] = useState<MeetupInvite[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingMeetup, setEditingMeetup] = useState<MeetupInvite | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [viewResponsesModalOpen, setViewResponsesModalOpen] = useState(false)
  
  // Sorting and filtering state
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'responses'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showUrgentOnly, setShowUrgentOnly] = useState(false)

  useEffect(() => {
    if (!session) {
      console.log('❌ No session available')
      setError('🔐 Please sign in to view your meetups')
      setIsLoading(false)
      return
    }

    const fetchMeetups = async () => {
      setIsLoading(true)
      setError(null)

      try {
        console.log('🔍 Fetching meetups for user:', session.user.email)

        const { data: { session: currentSession } } = await supabase.auth.getSession()
        const accessToken = currentSession?.access_token

        if (!accessToken) {
          throw new Error('🔐 No access token available. Please sign in again.')
        }

        console.log('🔑 Access token length:', accessToken.length)

        const response = await fetch('/api/meetups', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch meetups')
        }

        const data = await response.json()
        console.log('📊 Fetched meetups:', data.meetups.length)
        setMeetups(data.meetups)
        
        // Clear any previous errors if successful
        setError(null)
      } catch (error) {
        console.error('❌ Error fetching meetups:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch meetups'
        
        // Only set error if it's a real error, not just no meetups
        if (!errorMessage.includes('No meetups found') && !errorMessage.includes('empty')) {
          setError(errorMessage)
        } else {
          // If it's just no meetups, don't show an error
          setMeetups([])
          setError(null)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchMeetups()
  }, [session, supabase])

  const handleEditMeetup = (meetup: MeetupInvite) => {
    setEditingMeetup(meetup)
    setIsEditModalOpen(true)
  }

  const handleSaveMeetup = async (meetupId: string, updates: any) => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      const accessToken = currentSession?.access_token

      if (!accessToken) {
        throw new Error('No access token available')
      }

      const response = await fetch(`/api/meetups/${meetupId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update meetup')
      }

      const result = await response.json()

      // Refresh meetups list
      const updatedMeetups = meetups.map(meetup => 
        meetup.id === meetupId 
          ? { ...meetup, ...updates }
          : meetup
      )
      setMeetups(updatedMeetups)
      setIsEditModalOpen(false)
      setEditingMeetup(null)
    } catch (error) {
      console.error('Error updating meetup:', error)
      // Handle error - could show a toast
    }
  }

  const handleDeleteMeetup = async (meetupId: string) => {
    if (!confirm('Weet je zeker dat je deze meetup wilt verwijderen?')) {
      return
    }

    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      const accessToken = currentSession?.access_token

      if (!accessToken) {
        throw new Error('No access token available')
      }

      const response = await fetch(`/api/meetups/${meetupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete meetup')
      }

      // Remove meetup from list
      setMeetups(meetups.filter(meetup => meetup.id !== meetupId))
    } catch (error) {
      console.error('Error deleting meetup:', error)
      // Handle error - could show a toast
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">⏳ Wachtend</Badge>
      case 'accepted':
        return <Badge variant="default">✅ Geaccepteerd</Badge>
      case 'confirmed':
        return <Badge variant="default">📅 Bevestigd</Badge>
      case 'declined':
        return <Badge variant="destructive">❌ Afgewezen</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getInviteLink = (token: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    return `${baseUrl}/invite/${token}`
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      console.log('✅ Link copied to clipboard')
    } catch (err) {
      console.error('❌ Failed to copy link:', err)
    }
  }

  // Sorting and filtering functions
  const getSortedAndFilteredMeetups = () => {
    let filteredMeetups = [...meetups]

    // Apply status filter
    if (statusFilter !== 'all') {
      filteredMeetups = filteredMeetups.filter(meetup => meetup.status === statusFilter)
    }

    // Apply urgent filter (meetups with pending responses or expiring soon)
    if (showUrgentOnly) {
      const now = new Date()
      const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      
      filteredMeetups = filteredMeetups.filter(meetup => {
        const hasPendingResponses = (meetup.responses?.pending || 0) > 0
        const isExpiringSoon = new Date(meetup.expiresAt) < oneWeekFromNow
        return hasPendingResponses || isExpiringSoon
      })
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

  const getUrgentCount = () => {
    const now = new Date()
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    return meetups.filter(meetup => {
      const hasPendingResponses = (meetup.responses?.pending || 0) > 0
      const isExpiringSoon = new Date(meetup.expiresAt) < oneWeekFromNow
      return hasPendingResponses || isExpiringSoon
    }).length
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
      <div className="max-w-4xl mx-auto p-3 sm:p-4">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <Link href="/">
            <Button 
              variant="ghost" 
              className="flex items-center gap-1 sm:gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 text-sm sm:text-base px-2 sm:px-4"
            >
              <Home className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">← Terug naar Home</span>
              <span className="sm:hidden">← Home</span>
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3 sm:mt-4">📊 Mijn Meetups</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Beheer je koffie meetups en uitnodigingen</p>
        </div>

        {/* Background Agent Status */}
        <div className="mb-6">
          <BackgroundAgentStatus />
        </div>

        {/* Statistics Section */}
        {meetups.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-3 sm:p-4">
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

            {/* Popular Preferences */}
            {meetups.some(m => m.preferences) && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Populaire Voorkeuren</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Popular Dates */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">📅 Meest Gekozen Datums</h4>
                      <div className="space-y-2">
                        {Object.entries(
                          meetups.reduce((acc, meetup) => {
                            if (meetup.preferences?.preferredDates) {
                              Object.entries(meetup.preferences.preferredDates).forEach(([date, count]) => {
                                acc[date] = (acc[date] || 0) + count
                              })
                            }
                            return acc
                          }, {} as { [date: string]: number })
                        )
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 3)
                          .map(([date, count]) => (
                            <div key={date} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                              <span className="text-sm text-gray-600">{date}</span>
                              <Badge variant="secondary">{count} stemmen</Badge>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Popular Times */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">🕐 Meest Gekozen Tijden</h4>
                      <div className="space-y-2">
                        {Object.entries(
                          meetups.reduce((acc, meetup) => {
                            if (meetup.preferences?.preferredTimes) {
                              Object.entries(meetup.preferences.preferredTimes).forEach(([time, count]) => {
                                acc[time] = (acc[time] || 0) + count
                              })
                            }
                            return acc
                          }, {} as { [time: string]: number })
                        )
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 3)
                          .map(([time, count]) => (
                            <div key={time} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                              <span className="text-sm text-gray-600">{time}</span>
                              <Badge variant="secondary">{count} stemmen</Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Insights */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Extra Inzichten</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Response Rate */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600 font-medium">📊 Response Rate</p>
                        <p className="text-2xl font-bold text-blue-700">
                          {meetups.length > 0 
                            ? Math.round(((meetups.reduce((sum, m) => sum + (m.responses?.accepted || 0) + (m.responses?.declined || 0), 0) / meetups.length) * 100))
                            : 0}%
                        </p>
                      </div>
                      <div className="text-2xl">📊</div>
                    </div>
                  </div>

                  {/* Average Response Time */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-600 font-medium">⏱️ Gem. Response Tijd</p>
                        <p className="text-2xl font-bold text-purple-700">
                          {meetups.length > 0 ? '24u' : 'N/A'}
                        </p>
                      </div>
                      <div className="text-2xl">⏱️</div>
                    </div>
                  </div>

                  {/* Total Participants */}
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-indigo-600 font-medium">👥 Totaal Deelnemers</p>
                        <p className="text-2xl font-bold text-indigo-700">
                          {meetups.reduce((sum, m) => sum + (m.participants?.length || 0), 0)}
                        </p>
                      </div>
                      <div className="text-2xl">👥</div>
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
                <Button
                  variant={showUrgentOnly ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowUrgentOnly(!showUrgentOnly)}
                  className="text-xs sm:text-sm"
                >
                  🚨 Urgent ({getUrgentCount()})
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

        {/* Meetups List */}
        <div className="space-y-3 sm:space-y-4">
          {getSortedAndFilteredMeetups().map((meetup) => (
            <Card key={meetup.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  {/* Meetup Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2 sm:mb-3">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                        ☕ {meetup.cafe.name}
                      </h3>
                      {getStatusBadge(meetup.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Organisator: {meetup.organizerName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Gemaakt: {formatDate(meetup.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Vervalt: {formatDate(meetup.expiresAt)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 sm:mt-3 flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        ✅ {meetup.responses?.accepted || 0} Geaccepteerd
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        ⏳ {meetup.responses?.pending || 0} In Afwachting
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        ❌ {meetup.responses?.declined || 0} Afgewezen
                      </Badge>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingMeetup(meetup)}
                      className="text-xs sm:text-sm"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="hidden sm:inline">Bekijk Reacties</span>
                      <span className="sm:hidden">Reacties</span>
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {getSortedAndFilteredMeetups().length === 0 && (
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