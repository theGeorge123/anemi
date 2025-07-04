"use client"
import React from 'react'
import { useSupabase } from './SupabaseProvider'
import { useRouter } from 'next/navigation'

export function withAuth(Page: React.ComponentType) {
  return function Protected(props: any) {
    const { session } = useSupabase()
    const router = useRouter()
    React.useEffect(() => {
      if (!session) router.replace('/login')
    }, [session, router])
    if (!session) return null
    return <Page {...props} />
  }
} 