"use client"

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/SupabaseProvider'

export function useOnboarding() {
  const { session, supabase } = useSupabase()
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!session?.user?.id) {
        setIsLoading(false)
        return
      }

      try {
        // Check if user has completed onboarding using auth.users table
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          console.error('Error fetching user:', userError)
          setIsLoading(false)
          return
        }

        // Check onboarding status from user metadata or assume false for new users
        const onboardingCompleted = user.user_metadata?.onboarding_completed || false
        
        // Show onboarding if user hasn't completed it yet
        setShouldShowOnboarding(!onboardingCompleted)
      } catch (error) {
        console.error('Error checking onboarding status:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkOnboardingStatus()
  }, [session?.user?.id, supabase])

  const completeOnboarding = async () => {
    if (!session?.user?.id) return

    try {
      // Update user metadata to mark onboarding as completed
      const { error } = await supabase.auth.updateUser({
        data: { 
          onboarding_completed: true 
        }
      })

      if (error) {
        console.error('Error updating onboarding status:', error)
        return false
      }

      setShouldShowOnboarding(false)
      return true
    } catch (error) {
      console.error('Error completing onboarding:', error)
      return false
    }
  }

  return {
    shouldShowOnboarding,
    isLoading,
    completeOnboarding
  }
}