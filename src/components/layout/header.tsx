"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { useSupabase } from '@/components/SupabaseProvider'
import { Home, Coffee } from 'lucide-react'

export function Header() {
  const { session, supabase } = useSupabase()
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Logo size="lg" showText />
          </Link>
          
          {/* Back to Home Button - always visible */}
          <Link href="/">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Terug naar Home</span>
            </Button>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          {supabase && session && (
            <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
              Mijn Meetups
            </Link>
          )}
          
          {/* Create New Meetup Button */}
          {supabase && session && (
            <Link href="/create">
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              >
                <Coffee className="w-4 h-4 mr-2" />
                Nieuw Avontuur
              </Button>
            </Link>
          )}
        </nav>

        {/* Only show login button for non-logged in users */}
        {!supabase || !session ? (
          <Link href="/auth/signin">
            <Button variant="outline" size="sm">
              Inloggen
            </Button>
          </Link>
        ) : null}
      </div>
    </header>
  )
} 