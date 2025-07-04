"use client"
import React, { useEffect, useState } from 'react'
import { withAuth } from '@/components/withAuth'
import { useSupabase } from '@/components/SupabaseProvider'

const Dashboard = withAuth(() => {
  const { session, client } = useSupabase()
  const [meetups, setMeetups] = useState<any[]>([])

  useEffect(() => {
    if (!session) return
    client
      .from('Meetup')
      .select('id,title,date')
      .eq('createdBy', session.user.id)
      .then(({ data }) => setMeetups(data ?? []))
  }, [session, client])

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Meetups</h1>
      <ul className="space-y-3">
        {meetups.map(m => (
          <li key={m.id} className="border p-3 rounded-md">
            <strong>{m.title}</strong> – {m.date ? new Date(m.date).toLocaleDateString() : ''}
          </li>
        ))}
      </ul>
    </main>
  )
})

export default Dashboard 