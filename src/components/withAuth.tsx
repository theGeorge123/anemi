"use client"
import React from 'react'
import { useSupabase } from './SupabaseProvider'
import { useRouter } from 'next/navigation'

export function withAuth(Page: React.ComponentType) {
  return function Protected(props: any) {
    const { session, client } = useSupabase()
    const router = useRouter()
    
    React.useEffect(() => {
      // Only redirect if we have a client and no session
      if (client && !session) {
        router.replace('/login')
      }
    }, [session, client, router])
    
    // Show loading state if client is not available yet
    if (!client) return <div>Loading...</div>
    if (!session) return null
    
    return <Page {...props} />
  }
} 