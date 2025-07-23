"use client"

import { MeetupWizard } from '@/components/meetups/MeetupWizard'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CreateClientPage() {
  return (
    <main className="max-w-4xl mx-auto p-4">
      {/* Back to Home Button */}
      <div className="mb-6">
        <Link href="/">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
          >
            <Home className="w-4 h-4" />
            ← Terug naar Home
          </Button>
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">☕ Maak een Meetup</h1>
        <p className="text-muted-foreground">Laten we de perfecte koffie plek voor je vinden!</p>
      </div>
      
      <MeetupWizard />
    </main>
  )
} 