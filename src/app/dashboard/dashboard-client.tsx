"use client"

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/SupabaseProvider'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { EditMeetupModal } from '@/components/meetups/EditMeetupModal'
import { BackgroundAgentStatus } from '@/components/BackgroundAgentStatus'
import { Home } from 'lucide-react'
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

export default function DashboardClient() {
  const { supabase, session } = useSupabase()
  const [meetups, setMeetups] = useState<MeetupInvite[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingMeetup, setEditingMeetup] = useState<MeetupInvite | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

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
      } catch (error) {
        console.error('❌ Error fetching meetups:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch meetups')
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
      // Could show a toast here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-background to-orange-50 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">❌ Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button asChild className="bg-amber-600 hover:bg-amber-700">
              <Link href="/auth/signin">
                🔐 Inloggen
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-background to-orange-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <Link href="/">
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
            >
              <Home className="w-4 h-4" />
              ← Terug naar Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">📊 Mijn Meetups</h1>
          <p className="text-gray-600 mt-2">Beheer je koffie meetups en uitnodigingen</p>
        </div>

        {/* Background Agent Status */}
        <div className="mb-6">
          <BackgroundAgentStatus />
        </div>

        {/* Statistics Section */}
        {meetups.length > 0 && (
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">📧 Uitnodigingen Verzonden</p>
                      <p className="text-2xl font-bold text-blue-700">
                        {meetups.reduce((sum, meetup) => sum + (meetup.totalInvites || 0), 0)}
                      </p>
                    </div>
                    <div className="text-3xl">📧</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">✅ Geaccepteerd</p>
                      <p className="text-2xl font-bold text-green-700">
                        {meetups.reduce((sum, meetup) => sum + (meetup.responses?.accepted || 0), 0)}
                      </p>
                    </div>
                    <div className="text-3xl">✅</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-red-50 to-rose-50 border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-600 font-medium">❌ Afgewezen</p>
                      <p className="text-2xl font-bold text-red-700">
                        {meetups.reduce((sum, meetup) => sum + (meetup.responses?.declined || 0), 0)}
                      </p>
                    </div>
                    <div className="text-3xl">❌</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-amber-600 font-medium">⏳ In Afwachting</p>
                      <p className="text-2xl font-bold text-amber-700">
                        {meetups.reduce((sum, meetup) => sum + (meetup.responses?.pending || 0), 0)}
                      </p>
                    </div>
                    <div className="text-3xl">⏳</div>
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

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Laden van je meetups... ☕</p>
          </div>
        )}

        {/* Meetups List */}
        {!isLoading && meetups.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-amber-200 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">☕ Nog geen meetups</h3>
              <p className="text-gray-600 mb-6">
                Je hebt nog geen meetups gemaakt. Start je eerste koffie avontuur!
              </p>
              <Button asChild className="bg-amber-600 hover:bg-amber-700">
                <Link href="/create">
                  🚀 Maak je eerste Meetup
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Meetups Grid */}
        {!isLoading && meetups.length > 0 && (
          <div className="grid gap-6">
            {meetups.map((meetup) => (
              <Card key={meetup.id} className="bg-white/80 backdrop-blur-sm border-amber-200">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusBadge(meetup.status)}
                        {meetup.createdBy === session?.user?.email && (
                          <Badge variant="outline">👤 Organisator</Badge>
                        )}
                        {meetup.inviteeEmail === session?.user?.email && (
                          <Badge variant="outline">👥 Deelnemer</Badge>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        ☕ {meetup.cafe.name}
                      </h3>
                      
                      <p className="text-gray-600 mb-2">
                        📍 {meetup.cafe.address}
                      </p>
                      
                      <p className="text-sm text-gray-500 mb-3">
                        🗓️ {formatDate(meetup.createdAt)}
                      </p>

                      {meetup.chosenDate && (
                        <p className="text-sm text-green-600 font-medium">
                          ✅ Gekozen: {formatDate(meetup.chosenDate)}
                        </p>
                      )}

                      {/* Quick Stats */}
                      {meetup.totalInvites && (
                        <div className="flex gap-4 mt-3 text-sm">
                          <span className="text-blue-600">📧 {meetup.totalInvites} uitnodigingen</span>
                          {meetup.responses && (
                            <>
                              <span className="text-green-600">✅ {meetup.responses.accepted} geaccepteerd</span>
                              <span className="text-red-600">❌ {meetup.responses.declined} afgewezen</span>
                              <span className="text-amber-600">⏳ {meetup.responses.pending} in afwachting</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(getInviteLink(meetup.token))}
                      >
                        📋 Kopieer Link
                      </Button>
                      
                      {meetup.createdBy === session?.user?.email && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditMeetup(meetup)}
                          >
                            ✏️ Bewerken
                          </Button>
                          
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteMeetup(meetup.id)}
                          >
                            🗑️ Verwijderen
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Participants List */}
                  {meetup.participants && meetup.participants.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">👥 Deelnemers ({meetup.participants.length})</h4>
                      <div className="grid gap-2">
                        {meetup.participants.map((participant, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">{participant.name}</span>
                                <span className="text-sm text-gray-500">({participant.email})</span>
                                {participant.status === 'accepted' && (
                                  <Badge className="bg-green-100 text-green-800 border-green-200">✅ Geaccepteerd</Badge>
                                )}
                                {participant.status === 'declined' && (
                                  <Badge className="bg-red-100 text-red-800 border-red-200">❌ Afgewezen</Badge>
                                )}
                                {participant.status === 'pending' && (
                                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">⏳ Wachten</Badge>
                                )}
                              </div>
                              {participant.chosenDate && participant.chosenTime && (
                                <p className="text-sm text-green-600 mt-1">
                                  📅 Gekozen: {formatDate(participant.chosenDate)} om {participant.chosenTime}
                                </p>
                              )}
                              {participant.responseDate && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Reageerde op: {formatDate(participant.responseDate)}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
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
      </div>
    </div>
  )
} 