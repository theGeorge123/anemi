"use client"

import { useAccountLinking } from '@/lib/hooks/useAccountLinking'

interface AccountLinkingProviderProps {
  children: React.ReactNode
}

export function AccountLinkingProvider({ children }: AccountLinkingProviderProps) {
  useAccountLinking()
  return <>{children}</>
}