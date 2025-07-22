"use client"

import { usePathname } from 'next/navigation'
import { Footer } from '@/components/layout/footer'
import { CookieConsent } from '@/components/CookieConsent'

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const isMeetupCreation = pathname.includes('/create')

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {children}
      </main>
      {!isHomePage && !isMeetupCreation && <Footer />}
      <CookieConsent />
    </div>
  )
} 