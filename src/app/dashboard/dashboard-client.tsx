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