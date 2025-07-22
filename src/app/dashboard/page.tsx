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
  const { session, supabase } = useSupabase()
  const [meetups, setMeetups] = useState<MeetupInvite[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        
        // Get the access token
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
        console.log('📊 Response status:', response.status)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ API Error:', errorText)
          
          // Provide specific error messages
          if (response.status === 401) {
            throw new Error('🔐 Not authorized. Please sign in again.')
          } else if (response.status === 500) {
            throw new Error('🔧 Server error. Please try again in a moment.')
          } else {
            throw new Error(`Failed to load meetups: ${response.status} ${errorText}`)
          }
        }
        
        const data = await response.json()
        console.log('✅ Meetups data:', data)
        
        setMeetups(data.meetups || [])
      } catch (error) {
        console.error('❌ Error fetching meetups:', error)
        setError(error instanceof Error ? error.message : 'Failed to load meetups')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchMeetups()
  }, [session])

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
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <span className="text-4xl mr-3">☕</span>
          <h1 className="text-4xl font-bold text-gray-900">Hey there!</h1>
        </div>
        <p className="text-gray-600 text-lg">Ready to discover some amazing coffee spots? 🚀</p>
      </div>
      
      {isLoading ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <span className="text-3xl">☕</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading your coffee adventures...</h2>
          <p className="text-gray-500">Brewing up something special for you! ✨</p>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">😅</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">Oops! Something went wrong</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {error}
          </p>
          <div className="space-y-4">
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-amber-600 hover:bg-amber-700 px-6 py-3"
            >
              🔄 Try Again
            </Button>
            <div className="text-sm text-gray-400">
              or <Link href="/debug-vercel" className="text-amber-600 hover:underline">check what&apos;s up</Link>
            </div>
          </div>
        </div>
      ) : meetups.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🌟</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">Your coffee journey starts here!</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            No meetups yet, but that&apos;s totally fine! Let&apos;s create your first coffee adventure and discover amazing spots with new friends.
          </p>
          <div className="space-y-4">
            <Link href="/create">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-8 py-4 text-lg font-semibold">
                ☕ Start Your First Coffee Adventure
              </Button>
            </Link>
            <div className="text-sm text-gray-400">
              or <Link href="/" className="text-amber-600 hover:underline">explore what we&apos;re all about</Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Your Coffee Adventures ({meetups.length})</h2>
              <p className="text-gray-500">All your meetups in one cozy place ☕</p>
            </div>
            <Link href="/create">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                ✨ New Adventure
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
                          ☕ Coffee at {meetup.cafe.name}
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
                          Organized by: {meetup.organizerName}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="text-amber-600">📅</span> 
                          {meetup.availableDates.length} dates available
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="text-amber-600">⏰</span> 
                          {meetup.availableTimes.length} time slots
                        </p>
                        {meetup.chosenDate && (
                          <p className="flex items-center gap-2 text-green-600 font-medium">
                            <span>✅</span> 
                            Confirmed for: {formatDate(meetup.chosenDate)}
                          </p>
                        )}
                        {meetup.inviteeName && (
                          <p className="flex items-center gap-2">
                            <span className="text-amber-600">👥</span> 
                            Meeting with: {meetup.inviteeName}
                          </p>
                        )}
                        <div className="flex gap-4 text-xs text-gray-400 mt-3">
                          <span>📅 Created: {formatDate(meetup.createdAt)}</span>
                          <span>⏰ Expires: {formatDate(meetup.expiresAt)}</span>
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
                            alert('Invite link copied! Share it with your coffee buddy ☕')
                          }}
                        >
                          📋 Copy Invite Link
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
                          👁️ View Invite
                        </Button>
                      </>
                    )}
                    {meetup.status === 'confirmed' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-green-200 text-green-700 hover:bg-green-50"
                        onClick={() => {
                          alert('Calendar integration coming soon! 📅')
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