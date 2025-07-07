"use client"
import React, { createContext, useContext, useMemo, useState, useEffect, ReactNode } from 'react'
import { Session, SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabase-browser'

type SupabaseContextType = { session: Session | null, client: SupabaseClient | null }
const SupabaseContext = createContext<SupabaseContextType | null>(null)

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [client] = useState(() => getSupabaseClient())

  useEffect(() => {
    if (!client) return

    const { data: listener } = client.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session)
    })
    client.auth.getSession().then(({ data }: { data: { session: Session | null } }) => setSession(data.session))
    return () => { listener?.subscription.unsubscribe() }
  }, [client])

  const value = useMemo(() => ({ session, client }), [session, client])
  return (
    <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const ctx = useContext(SupabaseContext)
  if (!ctx) throw new Error('useSupabase must be used within SupabaseProvider')
  return ctx
} 