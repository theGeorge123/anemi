"use client"

import { Button } from '@/components/ui/button';
import { LogIn, Calendar, LogOut, Eye, Settings, Coffee, Users, Home } from 'lucide-react';
import Link from 'next/link';
import { useSupabase } from '@/components/SupabaseProvider';

export function LoginStatus() {
  const { session, loading, supabase } = useSupabase();

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
        <Button asChild size="lg" className="text-base sm:text-lg px-8 py-6 sm:px-10 sm:py-8 w-full sm:w-auto bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <Link href="/create">
            <Coffee className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
            Start een Meetup
          </Link>
        </Button>
        
        <Button asChild variant="outline" size="lg" className="text-base sm:text-lg px-8 py-6 sm:px-10 sm:py-8 w-full sm:w-auto border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300">
          <Link href="/auth/signin">
            <LogIn className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
            Inloggen
          </Link>
        </Button>
        
        <Button asChild variant="outline" size="lg" className="text-base sm:text-lg px-8 py-6 sm:px-10 sm:py-8 w-full sm:w-auto border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300">
          <Link href="/auth/signup">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
            Lid worden
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12 px-4">
      {/* Main Actions - Primary buttons */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
        <Button asChild size="lg" className="text-base sm:text-lg px-8 py-6 sm:px-10 sm:py-8 w-full sm:w-auto bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <Link href="/create">
            <Coffee className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
            Start een Meetup
          </Link>
        </Button>
        
        <Button asChild variant="outline" size="lg" className="text-base sm:text-lg px-8 py-6 sm:px-10 sm:py-8 w-full sm:w-auto border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300">
          <Link href="/dashboard">
            <Eye className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
            Mijn Meetups
          </Link>
        </Button>
      </div>
      
      {/* Secondary Actions - Settings and Logout */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
        <Button 
          variant="ghost" 
          size="lg" 
          asChild
          className="text-sm sm:text-base text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200 px-6 py-3 sm:py-4 border border-gray-200 hover:border-gray-300 rounded-lg"
        >
          <Link href="/settings">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span>Instellingen</span>
          </Link>
        </Button>
        
        <Button 
          variant="ghost" 
          size="lg" 
          onClick={async () => {
            await supabase.auth.signOut()
          }}
          className="text-sm sm:text-base text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200 px-6 py-3 sm:py-4 border border-gray-200 hover:border-gray-300 rounded-lg"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          <span>Uitloggen</span>
        </Button>
      </div>
    </div>
  );
} 