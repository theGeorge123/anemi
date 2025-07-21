"use client"
import { createContext, useContext, useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase-browser'
import type { User, Session } from '@supabase/supabase-js'

interface SupabaseContextType {
  session: Session | null
  user: User | null
  loading: boolean
  supabase: any
}

const SupabaseContext = createContext<SupabaseContextType>({
  session: null,
  user: null,
  loading: true,
  supabase: null,
})

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    let subscription: any = null

    const initializeSupabase = async () => {
      try {
        console.log('🔧 Initializing Supabase provider...')
        const client = getSupabaseClient()
        
        if (!client) {
          console.error('❌ Failed to create Supabase client')
          setLoading(false)
          return
        }

        setSupabase(client)
        console.log('✅ Supabase client set in provider')

        // Get initial session
        const { data: { session: initialSession }, error } = await client.auth.getSession()
        
        if (error) {
          console.error('❌ Error getting initial session:', error)
        } else {
          console.log('✅ Initial session retrieved:', !!initialSession)
          setSession(initialSession)
          setUser(initialSession?.user ?? null)
        }

        // Listen for auth changes
        const { data: { subscription: authSubscription } } = client.auth.onAuthStateChange(
          async (event: string, session: Session | null) => {
            console.log('🔔 Auth state changed:', event, !!session)
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
          }
        )

        subscription = authSubscription
        setLoading(false)
      } catch (error) {
        console.error('❌ Error initializing Supabase provider:', error)
        setLoading(false)
      }
    }

    initializeSupabase()

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  const value = {
    session,
    user,
    loading,
    supabase,
  }

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
} 