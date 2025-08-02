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
  const [error, setError] = useState<string | null>(null)

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
          console.warn('Session check failed, continuing without session:', error)
        } finally {
          setLoading(false)
        }
      }

      getInitialSession()

      // Listen for auth changes
      const { data: { subscription: authSubscription } } = client.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state change:', event, session?.user?.email)
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
        }
      )

      subscription = authSubscription
    } catch (error) {
      console.error('Error initializing Supabase provider:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
      setLoading(false)
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  // Show error state if there's an error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-800 mb-2">Supabase Connection Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Show loading state
  if (loading || !supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800">Initializing...</p>
        </div>
      </div>
    )
  }

  const value = {
    supabase,
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