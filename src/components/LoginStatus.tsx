"use client"

import { Button } from '@/components/ui/button';
import { LogIn, Calendar, LogOut, Eye } from 'lucide-react';
import Link from 'next/link';
import { useSupabase } from '@/components/SupabaseProvider';

export function LoginStatus() {
  const { session, loading, supabase } = useSupabase();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <div className="w-full max-w-sm sm:max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-700 mb-3 sm:mb-4">☕ Anemi Meets</h1>
            <p className="text-sm sm:text-base lg:text-xl text-gray-600 mb-6 sm:mb-8">
              Welkom bij Anemi Meets! De plek waar koffie en connecties samenkomen.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="text-center">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                Start je koffie avontuur
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-4 sm:mb-6">
                Log in om je meetups te beheren en nieuwe connecties te maken
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button asChild size="lg" className="text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Link href="/auth/signin">
                  <LogIn className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3" />
                  Inloggen
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300">
                <Link href="/auth/signup">
                  Registreren
                </Link>
              </Button>
            </div>

            <div className="text-center text-xs sm:text-sm text-gray-500">
              <p>Nog geen account? Registreer gratis en start je eerste meetup!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-2xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-700 mb-3 sm:mb-4">☕ Anemi Meets</h1>
          <p className="text-sm sm:text-base lg:text-xl text-gray-600">
            Welkom terug bij je koffie community!
          </p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border-2 border-amber-200 p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-700 mb-2">
              Welkom terug!
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600">
              Klaar voor je volgende koffie avontuur?
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button asChild size="lg" className="text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Link href="/create">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3" />
                  Start een Meetup
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300">
                <Link href="/dashboard">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3" />
                  Mijn Meetups
                </Link>
              </Button>
            </div>

            <div className="flex justify-center">
              <Button 
                variant="ghost" 
                size="lg" 
                onClick={async () => {
                  await supabase.auth.signOut()
                }}
                className="text-sm sm:text-base lg:text-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200 px-4 sm:px-6 py-2 sm:py-3"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Uitloggen
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 