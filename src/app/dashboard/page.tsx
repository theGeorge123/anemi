"use client"
import React, { useEffect, useState } from 'react'
import { withAuth } from '@/components/withAuth'
import { useSupabase } from '@/components/SupabaseProvider'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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

const Dashboard = withAuth(() => {
  const { session } = useSupabase()
  const [meetups, setMeetups] = useState<MeetupInvite[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session) return
    
    const fetchMeetups = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/meetups')
        if (!response.ok) {
          throw new Error('Failed to fetch meetups')
        }
        const data = await response.json()
        setMeetups(data.meetups || [])
      } catch (error) {
        console.error('Error fetching meetups:', error)
        setError('Failed to load meetups')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchMeetups()
  }, [session])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">⏳ Pending</span>
      case 'confirmed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">✅ Confirmed</span>
      case 'declined':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">❌ Declined</span>
      case 'expired':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">⏰ Expired</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">{status}</span>
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
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3005'
    return `${baseUrl}/invite/${token}`
  }

  return (
    <main className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">☕ My Meetups</h1>
        <p className="text-gray-600">Manage your coffee meetups and invitations</p>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">☕</span>
          </div>
          <p className="text-gray-500">Loading your meetups...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Error loading meetups</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      ) : meetups.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">☕</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No meetups yet!</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Ready to start your coffee adventure? Create your first meetup and discover amazing coffee spots with new friends.
          </p>
          <div className="space-y-3">
            <Link href="/create">
              <Button className="bg-amber-600 hover:bg-amber-700">
                ☕ Create Your First Meetup
              </Button>
            </Link>
            <div className="text-sm text-gray-400">
              or <Link href="/" className="text-amber-600 hover:underline">explore the app</Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Your Meetups ({meetups.length})</h2>
            <Link href="/create">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                + New Meetup
              </Button>
            </Link>
          </div>
          
          <div className="grid gap-4">
            {meetups.map((meetup) => (
              <Card key={meetup.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Coffee at {meetup.cafe.name}
                        </h3>
                        {getStatusBadge(meetup.status)}
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>📍 {meetup.cafe.address}, {meetup.cafe.city}</p>
                        <p>👤 Organized by: {meetup.organizerName}</p>
                        <p>📅 Available dates: {meetup.availableDates.length} selected</p>
                        <p>⏰ Available times: {meetup.availableTimes.length} selected</p>
                        {meetup.chosenDate && (
                          <p className="text-green-600 font-medium">
                            ✅ Confirmed for: {formatDate(meetup.chosenDate)}
                          </p>
                        )}
                        {meetup.inviteeName && (
                          <p>👥 Meeting with: {meetup.inviteeName}</p>
                        )}
                        <p>📅 Created: {formatDate(meetup.createdAt)}</p>
                        <p>⏰ Expires: {formatDate(meetup.expiresAt)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {meetup.status === 'pending' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const link = getInviteLink(meetup.token)
                            navigator.clipboard.writeText(link)
                            alert('Invite link copied to clipboard!')
                          }}
                        >
                          📋 Copy Invite Link
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const link = getInviteLink(meetup.token)
                            window.open(link, '_blank')
                          }}
                        >
                          👁️ View Invite
                        </Button>
                      </>
                    )}
                    {meetup.status === 'confirmed' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // TODO: Add calendar integration
                          alert('Calendar integration coming soon!')
                        }}
                      >
                        📅 Add to Calendar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </main>
  )
})

export default Dashboard 