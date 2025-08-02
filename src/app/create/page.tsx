"use client"

import { useSupabase } from '@/components/SupabaseProvider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import CreateClientPage from './client-page'

export default function CreatePage() {
  const { session, loading } = useSupabase()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!session) {
        // Redirect to signin with current page as redirect parameter
        router.push('/auth/signin?redirect=' + encodeURIComponent(window.location.pathname))
      } else {
        setIsChecking(false)
        // Log performance metric
        if (typeof window !== 'undefined' && window.performance) {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
          if (navigation) {
            console.log('🚀 Create page loaded in:', navigation.loadEventEnd - navigation.loadEventStart, 'ms')
          }
        }
      }
    }
  }, [session, loading, router])

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Even geduld...</p>
        </div>
      </div>
    )
  }

  // If not logged in, redirect
  if (!session) {
    return null // Will redirect in useEffect
  }

  // If logged in, show create page
  return <CreateClientPage />
} 