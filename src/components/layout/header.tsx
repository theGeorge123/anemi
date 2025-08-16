"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { useSupabase } from '@/components/SupabaseProvider'
import { Home, Coffee, Settings, Menu, X, Search, MapPin, User, Bell, Calendar } from 'lucide-react'
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
          
          {/* Enhanced Back to Home Button */}
          <Link href="/">
            <Button 
              variant="ghost" 
              size="sm"
              className="group flex items-center gap-2 sm:gap-3 text-amber-700 hover:text-amber-800 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 rounded-full px-3 sm:px-6 py-2 sm:py-3 transition-all duration-300 text-xs sm:text-sm font-medium border border-amber-200 hover:border-amber-300 hover:shadow-md transform hover:scale-105"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5" />
              <span className="hidden sm:inline font-semibold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
                Terug naar Home
              </span>
              <span className="sm:hidden font-semibold text-amber-700">Home</span>
            </Button>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8">
          {/* Find Meetups Link - Always visible */}
          <Link href="/find-meetups" className="group text-sm xl:text-base font-medium transition-all duration-300 hover:text-amber-700 hover:scale-105 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-amber-50">
            <Search className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
            <span>Vind Meetups</span>
          </Link>
          
          {/* Map Link - Always visible */}
          <Link href="/map" className="group text-sm xl:text-base font-medium transition-all duration-300 hover:text-amber-700 hover:scale-105 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-amber-50">
            <MapPin className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
            <span>Kaart</span>
          </Link>
          
          {/* Enhanced Dashboard Link for logged in users */}
          {supabase && session && (
            <Link href="/dashboard" className="group text-sm xl:text-base font-medium transition-all duration-300 hover:text-amber-700 hover:scale-105 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-amber-50">
              <Calendar className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
              <span>Mijn Meetups</span>
            </Link>
          )}
          
          {/* Enhanced Create New Meetup Button - Desktop */}
          {supabase && session && (
            <Link href="/create">
              <Button 
                size="sm"
                className="group bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold"
              >
                <Coffee className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <span className="hidden xl:inline">Nieuw Avontuur</span>
                <span className="xl:hidden">Nieuw</span>
              </Button>
            </Link>
          )}
        </nav>

        {/* Enhanced Desktop User Menu */}
        <div className="hidden lg:flex items-center gap-2 sm:gap-4">
          {supabase && session && user ? (
            <>
              {/* Welcome Message with User Info */}
              <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-full border border-amber-200">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-xs sm:text-sm">
                  <div className="font-semibold text-amber-800">Welkom terug!</div>
                  <div className="text-amber-600">{user.email?.split('@')[0] || 'Gebruiker'}</div>
                </div>
              </div>
              
              {/* Enhanced Settings Button */}
              <Link href="/settings">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="group border-amber-300 hover:bg-amber-50 hover:border-amber-400 text-xs sm:text-sm px-3 sm:px-4 py-2 transition-all duration-300 hover:shadow-md transform hover:scale-105"
                  title="Instellingen"
                >
                  <Settings className="w-4 h-4 mr-1 sm:mr-2 transition-transform duration-300 group-hover:rotate-90" />
                  <span className="hidden sm:inline">Instellingen</span>
                </Button>
              </Link>
              
              {/* Enhanced Logout Button */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={async () => {
                  await supabase.auth.signOut()
                }}
                className="group border-red-300 hover:bg-red-50 hover:border-red-400 text-xs sm:text-sm px-3 sm:px-4 py-2 transition-all duration-300 hover:shadow-md transform hover:scale-105 text-red-600 hover:text-red-700"
              >
                <span className="hidden sm:inline">Uitloggen</span>
                <span className="sm:hidden">Uit</span>
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/auth/signin">
                <Button variant="outline" size="sm" className="group border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300 px-3 sm:px-6 py-2 rounded-full text-xs sm:text-sm hover:shadow-md transform hover:scale-105">
                  <span>Inloggen</span>
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="group bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white transition-all duration-300 px-3 sm:px-6 py-2 rounded-full text-xs sm:text-sm hover:shadow-lg transform hover:scale-105">
                  <span>Registreren</span>
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
            className="p-2 text-amber-700 hover:text-amber-800 hover:bg-amber-50 transition-all duration-200"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-amber-200 bg-white/95 backdrop-blur">
          <div className="container px-4 py-4 space-y-4">
            {/* Enhanced Mobile Navigation Links */}
            <nav className="space-y-3">
              {/* Find Meetups Link - Always visible */}
              <Link href="/find-meetups" className="group block px-4 py-3 text-base font-medium text-gray-700 hover:text-amber-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 rounded-lg transition-all duration-300 flex items-center gap-3">
                <Search className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <span>Vind Meetups</span>
              </Link>
              
              {/* Map Link - Always visible */}
              <Link href="/map" className="group block px-4 py-3 text-base font-medium text-gray-700 hover:text-amber-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 rounded-lg transition-all duration-300 flex items-center gap-3">
                <MapPin className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <span>Kaart</span>
              </Link>
              
              {/* Enhanced Dashboard Link for logged in users */}
              {supabase && session && (
                <Link href="/dashboard" className="group block px-4 py-3 text-base font-medium text-gray-700 hover:text-amber-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 rounded-lg transition-all duration-300 flex items-center gap-3">
                  <Calendar className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  <span>Mijn Meetups</span>
                </Link>
              )}
              
              {/* Enhanced Create New Meetup Button - Mobile */}
              {supabase && session && (
                <Link href="/create">
                  <Button 
                    size="lg"
                    className="group w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-lg text-base font-semibold"
                  >
                    <Coffee className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                    Nieuw Avontuur
                  </Button>
                </Link>
              )}
            </nav>

            {/* Enhanced Mobile User Menu */}
            {supabase && session && user ? (
              <div className="space-y-3 pt-4 border-t border-amber-200">
                {/* Enhanced Welcome Section */}
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-amber-800">Welkom terug!</div>
                    <div className="text-sm text-amber-600">{user.email?.split('@')[0] || 'Gebruiker'}</div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Link href="/settings" className="flex-1">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="group w-full border-amber-300 hover:bg-amber-50 hover:border-amber-400 text-base transition-all duration-300 hover:shadow-md"
                    >
                      <Settings className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
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
                    className="flex-1 border-red-300 hover:bg-red-50 hover:border-red-400 text-base transition-all duration-300 hover:shadow-md text-red-600 hover:text-red-700"
                  >
                    Uitloggen
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-4 border-t border-amber-200">
                <Link href="/auth/signin">
                  <Button variant="outline" size="lg" className="group w-full border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300 rounded-lg text-base hover:shadow-md">
                    Inloggen
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="lg" className="group w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white transition-all duration-300 rounded-lg text-base hover:shadow-lg">
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