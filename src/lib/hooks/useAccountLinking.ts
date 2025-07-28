"use client"

import { useEffect } from 'react'
import { useSupabase } from '@/components/SupabaseProvider'

export function useAccountLinking() {
  const { session, supabase } = useSupabase()

  useEffect(() => {
    const linkMeetups = async () => {
      if (!session?.user?.email || !session?.user?.id) return

      try {
        const response = await fetch('/api/account/link-meetups', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: session.user.email,
            userId: session.user.id
          }),
        })

        if (response.ok) {
          const data = await response.json()
          if (data.linkedCount > 0) {
            console.log(`✅ Successfully linked ${data.linkedCount} meetups to account`)
            // You could show a toast notification here if desired
          }
        } else {
          console.warn('Failed to link meetups to account:', await response.text())
        }
      } catch (error) {
        console.error('Error linking meetups to account:', error)
      }
    }

    // Only run once when user first logs in
    if (session?.user?.id) {
      const hasLinked = sessionStorage.getItem(`meetups-linked-${session.user.id}`)
      if (!hasLinked) {
        linkMeetups()
        sessionStorage.setItem(`meetups-linked-${session.user.id}`, 'true')
      }
    }
  }, [session?.user?.id, session?.user?.email])

  return null // This hook doesn't return anything, just performs side effects
}