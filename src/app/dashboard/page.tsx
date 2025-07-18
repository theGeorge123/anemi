"use client"
import React, { useEffect, useState } from 'react'
import { withAuth } from '@/components/withAuth'
import { useSupabase } from '@/components/SupabaseProvider'

const Dashboard = withAuth(() => {
  const { session, client } = useSupabase()
  const [meetups, setMeetups] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!session || !client) return
    
    const fetchMeetups = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await client
          .from('Meetup')
          .select('id,title,date')
          .eq('createdBy', session.user.id)
        
        if (error) {
          console.error('Error fetching meetups:', error)
        }
        setMeetups(data ?? [])
      } catch (error) {
        console.error('Error fetching meetups:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchMeetups()
  }, [session, client])

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Meetups</h1>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">☕</span>
          </div>
          <p className="text-gray-500">Loading your meetups...</p>
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
            <a 
              href="/create" 
              className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              ☕ Create Your First Meetup
            </a>
            <div className="text-sm text-gray-400">
              or <a href="/" className="text-amber-600 hover:underline">explore the app</a>
            </div>
          </div>
        </div>
      ) : (
        <ul className="space-y-3">
          {meetups.map(m => (
            <li key={m.id} className="border p-3 rounded-md">
              <strong>{m.title}</strong> – {m.date ? new Date(m.date).toLocaleDateString() : ''}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
})

export default Dashboard 