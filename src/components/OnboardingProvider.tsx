"use client"

import { useOnboarding } from '@/lib/hooks/useOnboarding'
import { OnboardingModal } from './OnboardingModal'

interface OnboardingProviderProps {
  children: React.ReactNode
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const { shouldShowOnboarding, completeOnboarding } = useOnboarding()

  const handleOnboardingComplete = async () => {
    await completeOnboarding()
  }

  return (
    <>
      {children}
      <OnboardingModal
        isOpen={shouldShowOnboarding}
        onClose={handleOnboardingComplete}
      />
    </>
  )
}