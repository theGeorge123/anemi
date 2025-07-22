"use client"

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/SupabaseProvider'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { EditMeetupModal } from '@/components/meetups/EditMeetupModal'
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
}

export default function Dashboard() {
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

      // Show success message with notification info
      if (result.changesNotified) {
        alert('✅ Meetup succesvol bijgewerkt! 📧 Een email is verstuurd naar je koffie maatje met de nieuwe details!')
      } else {
        alert('✅ Meetup succesvol bijgewerkt!')
      }
    } catch (error) {
      console.error('Error updating meetup:', error)
      throw error
    }
  }

  const handleDeleteMeetup = async (meetupId: string) => {
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

      // Remove from local state
      setMeetups(meetups.filter(meetup => meetup.id !== meetupId))
      alert('✅ Meetup succesvol verwijderd!')
    } catch (error) {
      console.error('Error deleting meetup:', error)
      throw error
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full font-medium">⏳ Wachten op reactie</span>
      case 'confirmed':
        return <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">✅ Bevestigd!</span>
      case 'declined':
        return <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full font-medium">❌ Afgewezen</span>
      case 'expired':
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full font-medium">⏰ Verlopen</span>
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full font-medium">{status}</span>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getInviteLink = (token: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3007'
    return `${baseUrl}/invite/${token}`
  }

  return (
    <main className="max-w-4xl mx-auto p-4">
      {/* Back to Home Button */}
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
      </div>

      {/* Fun Header Section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <span className="text-6xl mr-4">☕</span>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Hé daar!
            </h1>
            <p className="text-gray-600 text-lg mt-2">Klaar om geweldige koffie plekken te ontdekken? 🚀</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {meetups.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-2xl font-bold text-green-700">{meetups.length}</div>
            <div className="text-sm text-green-600">Totaal Avonturen</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">✅</div>
            <div className="text-2xl font-bold text-blue-700">
              {meetups.filter(m => m.status === 'confirmed').length}
            </div>
            <div className="text-sm text-blue-600">Bevestigd</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">⏳</div>
            <div className="text-2xl font-bold text-amber-700">
              {meetups.filter(m => m.status === 'pending').length}
            </div>
            <div className="text-sm text-amber-600">Wachtend</div>
          </div>
        </div>
      )}

      {/* Meetups Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center">
              <span className="text-xl">☕</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Je Koffie Avonturen ({meetups.length})
              </h2>
              <p className="text-gray-600">Al je meetups op één gezellige plek ☕</p>
            </div>
          </div>
          
          <Link href="/create">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg"
            >
              <span className="mr-2">✨</span>
              <span className="mr-2">✨</span>
              Nieuw Avontuur
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
              <span className="text-gray-600">Je avonturen laden... 🚀</span>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-2xl">😅</span>
              <h3 className="text-lg font-semibold text-red-800">Oeps! Er ging iets mis</h3>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              🔄 Opnieuw proberen
            </Button>
          </div>
        ) : meetups.length === 0 ? (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">☕</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nog geen avonturen!</h3>
            <p className="text-gray-600 mb-6">
              Tijd om je eerste koffie meetup te maken en geweldige plekken te ontdekken! 🚀
            </p>
            <Link href="/create">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
              >
                <span className="mr-2">✨</span>
                Je Eerste Avontuur Maken
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {meetups.map((meetup) => (
              <Card 
                key={meetup.id} 
                className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                          <span className="text-sm">☕</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Koffie bij {meetup.cafe.name}
                        </h3>
                        <Badge 
                          variant={meetup.status === 'confirmed' ? 'default' : 'secondary'}
                          className={`${
                            meetup.status === 'confirmed' 
                              ? 'bg-green-100 text-green-700 border-green-200' 
                              : 'bg-amber-100 text-amber-700 border-amber-200'
                          }`}
                        >
                          {meetup.status === 'confirmed' ? '✅ Bevestigd!' : '⏳ Wachtend'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="text-red-500">📍</span>
                            <span>{meetup.cafe.address}, {meetup.cafe.city}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="text-blue-500">👤</span>
                            <span>Georganiseerd door: {meetup.organizerName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="text-green-500">📅</span>
                            <span>{meetup.availableDates.length} data beschikbaar</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="text-red-500">⏰</span>
                            <span>{meetup.availableTimes.length} tijdsloten</span>
                          </div>
                          {meetup.inviteeName && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <span className="text-blue-500">👥</span>
                              <span>Afspraak met: {meetup.inviteeName}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="text-purple-500">📅</span>
                            <span>Aangemaakt: {new Date(meetup.createdAt).toLocaleDateString('nl-NL', { 
                              weekday: 'short', 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}</span>
                          </div>
                        </div>
                      </div>

                      {meetup.expiresAt && (
                        <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <div className="flex items-center gap-2 text-orange-700">
                            <span className="text-red-500">⏰</span>
                            <span className="text-sm font-medium">
                              Verloopt: {new Date(meetup.expiresAt).toLocaleDateString('nl-NL', { 
                                weekday: 'short', 
                                day: 'numeric', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-amber-200">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-300 text-green-700 hover:bg-green-50"
                      onClick={() => {
                        const eventUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Koffie bij ${meetup.cafe.name}&dates=${encodeURIComponent(
                          new Date(meetup.availableDates[0] || new Date()).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
                        )}/${encodeURIComponent(
                          new Date(meetup.availableDates[0] || new Date()).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
                        )}&details=Koffie meetup bij ${meetup.cafe.name} - ${meetup.cafe.address}&location=${encodeURIComponent(meetup.cafe.address)}`
                        window.open(eventUrl, '_blank')
                      }}
                    >
                      <span className="mr-2">📅</span>
                      Toevoegen aan Kalender
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                      onClick={() => handleEditMeetup(meetup)}
                    >
                      <span className="mr-2">✏️</span>
                      Bewerken
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <EditMeetupModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingMeetup(null)
        }}
        meetup={editingMeetup}
        onSave={handleSaveMeetup}
        onDelete={handleDeleteMeetup}
      />
    </main>
  )
} 