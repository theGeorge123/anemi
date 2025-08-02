"use client"

import { Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Lazy load the MeetupWizard component
const MeetupWizard = dynamic(() => import('@/components/meetups/MeetupWizard').then(mod => ({ default: mod.MeetupWizard })), {
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Wizard laden...</p>
      </div>
    </div>
  ),
  ssr: false
})

export default function CreateClientPage() {
  return (
    <main className="max-w-4xl mx-auto p-2 sm:p-4">
      {/* Back to Home Button */}
      <div className="mb-4 sm:mb-6">
        <Link href="/">
          <Button 
            variant="ghost" 
            className="flex items-center gap-1 sm:gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 text-sm sm:text-base px-2 sm:px-4"
          >
            <Home className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">← Terug naar Home</span>
            <span className="sm:hidden">← Home</span>
          </Button>
        </Link>
      </div>

      <div className="text-center mb-6 sm:mb-8 px-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">☕ Maak een Meetup</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Laten we de perfecte koffie plek voor je vinden!</p>
      </div>
      
      <MeetupWizard />
    </main>
  )
} 