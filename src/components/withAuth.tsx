"use client"
import React, { useState, useEffect } from 'react'
import { useSupabase } from './SupabaseProvider'
import { useRouter, usePathname } from 'next/navigation'

export function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { session, supabase, loading } = useSupabase()
    const router = useRouter()
    const pathname = usePathname()

    // Always render loading on first mount (SSR and first client render)
    if (loading) return <div>Loading...</div>

    if (!supabase) return <div>Loading...</div>

    if (!session) {
      // Redirect to signin with current path as redirect URL
      const redirectUrl = encodeURIComponent(pathname)
      router.push(`/auth/signin?redirect=${redirectUrl}`)
      return <div>Doorverwijzen naar inloggen...</div>
    }

    return <Component {...props} />
  }
} 