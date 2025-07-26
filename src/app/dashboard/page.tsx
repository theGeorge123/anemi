"use client"

import { useSupabase } from '@/components/SupabaseProvider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardClient from './dashboard-client'

export default function Dashboard() {
  const { session, loading } = useSupabase()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!loading) {
    if (!session) {
        // Redirect to signin with current page as redirect parameter
        router.push('/auth/signin?redirect=' + encodeURIComponent('/dashboard'))
      } else {
        setIsChecking(false)
      }
    }
  }, [session, loading, router])

  // Show loading while checking authentication
  if (loading || isChecking) {
  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Even geduld...</p>
        </div>
      </div>
    )
  }

  // If logged in, show dashboard
  return <DashboardClient />
} 