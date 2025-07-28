"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { useSupabase } from '@/components/SupabaseProvider'
import { Home, Coffee } from 'lucide-react'

export function Header() {
  const { session, supabase, user } = useSupabase()
  
  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-amber-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-3">
            <Logo size="lg" showText />
          </Link>
          
          {/* Back to Home Button - always visible */}
          <Link href="/">
            <Button 
              variant="ghost" 
              size="lg" 
              className="flex items-center gap-3 text-amber-700 hover:text-amber-800 hover:bg-amber-50 rounded-full px-6 py-3 transition-all duration-200"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Terug naar Home</span>
            </Button>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          {supabase && session && (
            <Link href="/dashboard" className="text-base font-medium transition-colors hover:text-primary hover:scale-105">
              Mijn Meetups
            </Link>
          )}
          
          {/* Create New Meetup Button */}
          {supabase && session && (
            <Link href="/create">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-6 py-3 rounded-full"
              >
                <Coffee className="w-5 h-5 mr-2" />
                Nieuw Avontuur
              </Button>
            </Link>
          )}
        </nav>

        {/* User menu for logged in users */}
        {supabase && session && user ? (
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Welkom, <span className="font-medium text-amber-700">{user.email}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={async () => {
                await supabase.auth.signOut()
              }}
              className="border-amber-300 hover:bg-amber-50 hover:border-amber-400"
            >
              Uitloggen
            </Button>
          </div>
        ) : (
          /* Login button for non-logged in users */
          <Link href="/auth/signin">
            <Button variant="outline" size="lg" className="border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-200 px-6 py-3 rounded-full">
              Inloggen
            </Button>
          </Link>
        )}
      </div>
    </header>
  )
} 