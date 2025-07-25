"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabase-browser'

interface SupabaseContextType {
  supabase: ReturnType<typeof getSupabaseClient>
  session: Session | null
  user: User | null
  loading: boolean
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase, setSupabase] = useState<ReturnType<typeof getSupabaseClient> | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let subscription: any = null
    
    try {
      // Initialize client immediately
      const client = getSupabaseClient()
      setSupabase(client)

      // Get initial session with timeout
      const getInitialSession = async () => {
        try {
          const result = await Promise.race([
            client.auth.getSession(),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('Session timeout')), 2000)
            )
          ])
          
          const { data: { session: initialSession } } = result
          setSession(initialSession)
          setUser(initialSession?.user ?? null)
        } catch (error) {
          // If session check fails, continue without session
          console.warn('Session check failed, continuing without session')
        } finally {
          setLoading(false)
        }
      }

      getInitialSession()

      // Listen for auth changes
      const { data: { subscription: authSubscription } } = client.auth.onAuthStateChange(
        async (event, session) => {
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
        }
      )

      subscription = authSubscription
    } catch (error) {
      console.error('Error initializing Supabase provider:', error)
      setLoading(false)
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  const value = {
    supabase: supabase!,
    session,
    user,
    loading
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