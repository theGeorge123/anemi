"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabase-browser'
import { logger } from '@/lib/logger'

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
      logger.info('Initializing Supabase provider', {}, 'SUPABASE')
      
      const client = getSupabaseClient()
      setSupabase(client)
      
      logger.info('Supabase client set in provider', {}, 'SUPABASE')

      // Get initial session
      const getInitialSession = async () => {
        try {
          const { data: { session: initialSession } } = await client.auth.getSession()
          setSession(initialSession)
          setUser(initialSession?.user ?? null)
          
          logger.info('Initial session retrieved', { 
            hasSession: !!initialSession,
            userId: initialSession?.user?.id 
          }, 'SUPABASE')
        } catch (error) {
          logger.error('Error getting initial session', error as Error, {}, 'SUPABASE')
        } finally {
          setLoading(false)
        }
      }

      getInitialSession()

      // Listen for auth changes
      const { data: { subscription: authSubscription } } = client.auth.onAuthStateChange(
        async (event, session) => {
          logger.info('Auth state changed', { 
            event, 
            hasSession: !!session,
            userId: session?.user?.id 
          }, 'SUPABASE')
          
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
        }
      )

      subscription = authSubscription
    } catch (error) {
      logger.error('Error initializing Supabase provider', error as Error, {}, 'SUPABASE')
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