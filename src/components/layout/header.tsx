"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { useSupabase } from '@/components/SupabaseProvider'
import { Home, Coffee, Settings, Menu, X, Search } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const { session, supabase, user } = useSupabase()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-amber-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6">
        {/* Logo and Home Button */}
        <div className="flex items-center space-x-2 sm:space-x-6">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <Logo size="sm" showText={false} className="sm:hidden" />
            <Logo size="lg" showText className="hidden sm:flex" />
          </Link>
          
          {/* Back to Home Button - responsive */}
          <Link href="/">
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-1 sm:gap-3 text-amber-700 hover:text-amber-800 hover:bg-amber-50 rounded-full px-2 sm:px-6 py-2 sm:py-3 transition-all duration-200 text-xs sm:text-sm"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline font-medium">Terug naar Home</span>
            </Button>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8">
          {/* Find Meetups Link - Always visible */}
          <Link href="/find-meetups" className="text-sm xl:text-base font-medium transition-colors hover:text-primary hover:scale-105 flex items-center gap-1">
            <Search className="w-4 h-4" />
            <span>Vind Meetups</span>
          </Link>
          
          {supabase && session && (
            <Link href="/dashboard" className="text-sm xl:text-base font-medium transition-colors hover:text-primary hover:scale-105">
              Mijn Meetups
            </Link>
          )}
          
          {/* Create New Meetup Button - Desktop */}
          {supabase && session && (
            <Link href="/create">
              <Button 
                size="sm"
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm"
              >
                <Coffee className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                <span className="hidden xl:inline">Nieuw Avontuur</span>
                <span className="xl:hidden">Nieuw</span>
              </Button>
            </Link>
          )}
        </nav>

        {/* Desktop User Menu */}
        <div className="hidden lg:flex items-center gap-2 sm:gap-4">
          {supabase && session && user ? (
            <>
              <div className="text-xs sm:text-sm text-gray-600 hidden xl:block">
                Welkom
              </div>
              <Link href="/settings">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-amber-300 hover:bg-amber-50 hover:border-amber-400 text-xs sm:text-sm px-3 sm:px-4 py-2"
                  title="Instellingen"
                >
                  <Settings className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Instellingen</span>
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm"
                onClick={async () => {
                  await supabase.auth.signOut()
                }}
                className="border-amber-300 hover:bg-amber-50 hover:border-amber-400 text-xs sm:text-sm px-3 sm:px-4 py-2"
              >
                Uitloggen
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/auth/signin">
                <Button variant="outline" size="sm" className="border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-200 px-3 sm:px-6 py-2 rounded-full text-xs sm:text-sm">
                  Inloggen
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white transition-all duration-200 px-3 sm:px-6 py-2 rounded-full text-xs sm:text-sm">
                  Registreren
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-amber-700 hover:text-amber-800 hover:bg-amber-50"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-amber-200 bg-white/95 backdrop-blur">
          <div className="container px-4 py-4 space-y-4">
            {/* Mobile Navigation Links */}
            <nav className="space-y-3">
              {/* Find Meetups Link - Always visible */}
              <Link href="/find-meetups" className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors flex items-center gap-2">
                <Search className="w-4 h-4" />
                Vind Meetups
              </Link>
              
              {supabase && session && (
                <Link href="/dashboard" className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors">
                  Mijn Meetups
                </Link>
              )}
              
              {/* Create New Meetup Button - Mobile */}
              {supabase && session && (
                <Link href="/create">
                  <Button 
                    size="lg"
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-lg text-base"
                  >
                    <Coffee className="w-5 h-5 mr-3" />
                    Nieuw Avontuur
                  </Button>
                </Link>
              )}
            </nav>

            {/* Mobile User Menu */}
            {supabase && session && user ? (
              <div className="space-y-3 pt-4 border-t border-amber-200">
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm text-gray-600">Welkom</span>
                </div>
                <div className="flex gap-3">
                  <Link href="/settings" className="flex-1">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="w-full border-amber-300 hover:bg-amber-50 hover:border-amber-400 text-base"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Instellingen
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={async () => {
                      await supabase.auth.signOut()
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex-1 border-amber-300 hover:bg-amber-50 hover:border-amber-400 text-base"
                  >
                    Uitloggen
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-4 border-t border-amber-200">
                <Link href="/auth/signin">
                  <Button variant="outline" size="lg" className="w-full border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-200 rounded-lg text-base">
                    Inloggen
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="lg" className="w-full bg-amber-600 hover:bg-amber-700 text-white transition-all duration-200 rounded-lg text-base">
                    Registreren
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
} 