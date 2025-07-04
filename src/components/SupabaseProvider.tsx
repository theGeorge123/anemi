"use client"
import React, { createContext, useContext, useMemo, useState, useEffect, ReactNode } from 'react'
import { Session, SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase-browser'

type SupabaseContextType = { session: Session | null, client: SupabaseClient }
const SupabaseContext = createContext<SupabaseContextType | null>(null)

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session)
    })
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => setSession(data.session))
    return () => { listener?.subscription.unsubscribe() }
  }, [])

  const value = useMemo(() => ({ session, client: supabase }), [session])
  return (
    <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const ctx = useContext(SupabaseContext)
  if (!ctx) throw new Error('useSupabase must be used within SupabaseProvider')
  return ctx
} 