"use client"

import { Button } from '@/components/ui/button';
import { LogIn, Calendar, LogOut, Eye, Settings, Coffee, Users, Home, MapPin, Search, Plus, User, Bell } from 'lucide-react';
import Link from 'next/link';
import { useSupabase } from '@/components/SupabaseProvider';

export function LoginStatus() {
  const { session, loading, supabase, user } = useSupabase();

  if (loading) {
    return (
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 justify-center items-center mb-8 sm:mb-12 px-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
        <p className="text-sm text-gray-600">Laden...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 justify-center items-center mb-8 sm:mb-12 px-4">
        <Button asChild size="lg" className="group text-base sm:text-lg px-8 py-6 sm:px-10 sm:py-8 w-full sm:w-auto bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <Link href="/create">
            <Coffee className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            Start een Meetup
          </Link>
        </Button>
        
        <Button asChild variant="outline" size="lg" className="group text-base sm:text-lg px-8 py-6 sm:px-10 sm:py-8 w-full sm:w-auto border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300 hover:shadow-md transform hover:scale-105">
          <Link href="/auth/signin">
            <LogIn className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 transition-transform duration-300 group-hover:scale-110" />
            Inloggen
          </Link>
        </Button>
        
        <Button asChild variant="outline" size="lg" className="group text-base sm:text-lg px-8 py-6 sm:px-10 sm:py-8 w-full sm:w-auto border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300 hover:shadow-md transform hover:scale-105">
          <Link href="/auth/signup">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 transition-transform duration-300 group-hover:scale-110" />
            Lid worden
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-12 px-4">
      {/* Welcome Section */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-full border border-amber-200 shadow-sm">
          <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="text-sm sm:text-base">
            <div className="font-semibold text-amber-800">Welkom terug!</div>
            <div className="text-amber-600">{user?.email?.split('@')[0] || 'Gebruiker'}</div>
          </div>
        </div>
      </div>

      {/* Primary Actions - Main buttons */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
        <Button asChild size="lg" className="group text-base sm:text-lg px-8 py-6 sm:px-10 sm:py-8 w-full sm:w-auto bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <Link href="/create">
            <Plus className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 transition-transform duration-300 group-hover:scale-110" />
            Start een Meetup
          </Link>
        </Button>
        
        <Button asChild variant="outline" size="lg" className="group text-base sm:text-lg px-8 py-6 sm:px-10 sm:py-8 w-full sm:w-auto border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300 hover:shadow-md transform hover:scale-105">
          <Link href="/dashboard">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 transition-transform duration-300 group-hover:scale-110" />
            Mijn Meetups
          </Link>
        </Button>
      </div>
      
      {/* Quick Access Actions - Secondary buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
        <Button 
          variant="outline" 
          size="lg" 
          asChild
          className="group text-sm sm:text-base text-amber-700 hover:text-amber-800 hover:bg-amber-50 transition-all duration-300 px-6 py-3 sm:py-4 border-2 border-amber-200 hover:border-amber-300 rounded-lg hover:shadow-md transform hover:scale-105"
        >
          <Link href="/map">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform duration-300 group-hover:scale-110" />
            <span>Bekijk Kaart</span>
          </Link>
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          asChild
          className="group text-sm sm:text-base text-amber-700 hover:text-amber-800 hover:bg-amber-50 transition-all duration-300 px-6 py-3 sm:py-4 border-2 border-amber-200 hover:border-amber-300 rounded-lg hover:shadow-md transform hover:scale-105"
        >
          <Link href="/find-meetups">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform duration-300 group-hover:scale-110" />
            <span>Zoek Meetups</span>
          </Link>
        </Button>
      </div>
      
      {/* User Management Actions - Settings and Logout */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-2">
        <Button 
          variant="ghost" 
          size="lg" 
          asChild
          className="group text-sm sm:text-base text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-300 px-6 py-3 sm:py-4 border border-gray-200 hover:border-gray-300 rounded-lg hover:shadow-md transform hover:scale-105"
        >
          <Link href="/settings">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform duration-300 group-hover:rotate-90" />
            <span>Instellingen</span>
          </Link>
        </Button>
        
        <Button 
          variant="ghost" 
          size="lg" 
          onClick={async () => {
            await supabase.auth.signOut()
          }}
          className="group text-sm sm:text-base text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300 px-6 py-3 sm:py-4 border border-red-200 hover:border-red-300 rounded-lg hover:shadow-md transform hover:scale-105"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform duration-300 group-hover:scale-110" />
          <span>Uitloggen</span>
        </Button>
      </div>
    </div>
  );
} 