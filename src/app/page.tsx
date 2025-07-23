"use client"

import { Button } from '@/components/ui/button';
import { Coffee, Users, LogIn, Calendar, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useSupabase } from '@/components/SupabaseProvider';
import { useEffect, useState } from 'react';
import { FindMyMeetups } from '@/components/FindMyMeetups';

export default function HomePage() {
  const { session, supabase } = useSupabase();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Give a moment for session to load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-background to-orange-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Laden... ☕</p>
        </div>
      </div>
    );
  }

  // Logged in user view - show simple welcome
  if (session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-background to-orange-50 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Coffee className="w-10 h-10 text-amber-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Welkom terug! ☕
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Klaar voor je volgende koffie avontuur?
            </p>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-amber-200 max-w-md mx-auto mb-8">
              <p className="text-sm text-gray-500">Ingelogd als</p>
              <p className="font-semibold text-gray-900">{session.user.email}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Button asChild size="lg" className="text-lg px-8 py-6 bg-amber-600 hover:bg-amber-700">
              <Link href="/create">
                <Users className="w-5 h-5 mr-2" />
                Start een Meetup
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link href="/dashboard">
                <LogIn className="w-5 h-5 mr-2" />
                Mijn Meetups
              </Link>
            </Button>
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={async () => {
              if (supabase) {
                await supabase.auth.signOut();
              }
            }}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Uitloggen
          </Button>
        </div>
      </div>
    );
  }

  // Not logged in user view - original simple version
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-background to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Coffee className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Anemi - Connect Over Coffee
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Maak koffie meetups en ontdek geweldige lokale plekken met vrienden.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="text-lg px-8 py-6 bg-amber-600 hover:bg-amber-700">
            <Link href="/create">
              <Users className="w-5 h-5 mr-2" />
              Start een Meetup
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
            <Link href="/auth/signin">
              <LogIn className="w-5 h-5 mr-2" />
              Inloggen
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
            <Link href="/auth/signup">
              <Calendar className="w-5 h-5 mr-2" />
              Lid worden
            </Link>
          </Button>
        </div>
        
        <p className="mt-6 text-sm text-muted-foreground">
          Heb je al meetups? <Link href="/auth/signin" className="text-amber-600 hover:underline">Log in om ze te bekijken</Link>
        </p>

        {/* Find My Meetups Section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Vind je Meetups</h3>
            <p className="text-gray-600">
              Heb je een meetup geaccepteerd maar geen account? Vind ze hier terug!
            </p>
          </div>
          
          <FindMyMeetups />
        </div>
      </div>
    </div>
  );
} 