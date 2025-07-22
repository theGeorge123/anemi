"use client"

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/SupabaseProvider'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { EditMeetupModal } from '@/components/meetups/EditMeetupModal'
import { Home } from 'lucide-react'

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

      alert('🗑️ Meetup succesvol verwijderd!')
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

      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <span className="text-4xl mr-3">☕</span>
          <h1 className="text-4xl font-bold text-gray-900">Hé daar!</h1>
        </div>
        <p className="text-gray-600 text-lg">Klaar om geweldige koffie plekken te ontdekken? 🚀</p>
      </div>
      
      {isLoading ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <span className="text-3xl">☕</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Je koffie avonturen laden...</h2>
          <p className="text-gray-500">Iets speciaals voor je aan het zetten! ✨</p>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">😅</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">Oeps! Er ging iets mis</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {error}
          </p>
          <div className="space-y-4">
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-amber-600 hover:bg-amber-700 px-6 py-3"
            >
              🔄 Probeer Opnieuw
            </Button>
            <div className="text-sm text-gray-400">
              of <Link href="/debug-vercel" className="text-amber-600 hover:underline">kijk wat er aan de hand is</Link>
            </div>
          </div>
        </div>
      ) : meetups.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🌟</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">Je koffie reis begint hier!</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Nog geen meetups, maar dat is helemaal prima! Laten we je eerste koffie avontuur maken en geweldige plekken ontdekken met nieuwe vrienden.
          </p>
          <div className="space-y-4">
            <Link href="/create">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-8 py-4 text-lg font-semibold">
                ☕ Start Je Eerste Koffie Avontuur
              </Button>
            </Link>
            <div className="text-sm text-gray-400">
              or <Link href="/" className="text-amber-600 hover:underline">ontdek waar we voor staan</Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Je Koffie Avonturen ({meetups.length})</h2>
              <p className="text-gray-500">Al je meetups op één gezellige plek ☕</p>
            </div>
            <Link href="/create">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                ✨ Nieuw Avontuur
              </Button>
            </Link>
          </div>
          
          <div className="grid gap-6">
            {meetups.map((meetup) => (
              <Card key={meetup.id} className="hover:shadow-lg transition-all duration-300 border-amber-100">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">
                          ☕ Koffie bij {meetup.cafe.name}
                        </h3>
                        {getStatusBadge(meetup.status)}
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-2">
                        <p className="flex items-center gap-2">
                          <span className="text-amber-600">📍</span> 
                          {meetup.cafe.address}, {meetup.cafe.city}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="text-amber-600">👤</span> 
                          Georganiseerd door: {meetup.organizerName}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="text-amber-600">📅</span> 
                          {meetup.availableDates.length} data beschikbaar
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="text-amber-600">⏰</span> 
                          {meetup.availableTimes.length} tijdsloten
                        </p>
                        {meetup.chosenDate && (
                          <p className="flex items-center gap-2 text-green-600 font-medium">
                            <span>✅</span> 
                            Bevestigd voor: {formatDate(meetup.chosenDate)}
                          </p>
                        )}
                        {meetup.inviteeName && (
                          <p className="flex items-center gap-2">
                            <span className="text-amber-600">👥</span> 
                            Afspraak met: {meetup.inviteeName}
                          </p>
                        )}
                        <div className="flex gap-4 text-xs text-gray-400 mt-3">
                          <span>📅 Aangemaakt: {formatDate(meetup.createdAt)}</span>
                          <span>⏰ Verloopt: {formatDate(meetup.expiresAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    {meetup.status === 'pending' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-amber-200 text-amber-700 hover:bg-amber-50"
                          onClick={() => {
                            const link = getInviteLink(meetup.token)
                            navigator.clipboard.writeText(link)
                            alert('Uitnodigingslink gekopieerd! Deel het met je koffie maatje ☕')
                          }}
                        >
                          📋 Kopieer Uitnodigingslink
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-amber-200 text-amber-700 hover:bg-amber-50"
                          onClick={() => {
                            const link = getInviteLink(meetup.token)
                            window.open(link, '_blank')
                          }}
                        >
                          👁️ Bekijk Uitnodiging
                        </Button>
                      </>
                    )}
                    {meetup.status === 'confirmed' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-green-200 text-green-700 hover:bg-green-50"
                        onClick={() => {
                          alert('Kalender integratie komt binnenkort! 📅')
                        }}
                      >
                        📅 Toevoegen aan Kalender
                      </Button>
                    )}
                    
                    {/* Edit Button */}
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                      onClick={() => handleEditMeetup(meetup)}
                    >
                      ✏️ Bewerken
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

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