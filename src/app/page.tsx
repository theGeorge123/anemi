"use client"

import { Button } from '@/components/ui/button';
import { Coffee, Users, LogIn, Calendar, ArrowRight, Coffee as CoffeeIcon, MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import { useSupabase } from '@/components/SupabaseProvider';
import { useEffect, useState } from 'react';

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

  // Logged in user view
  if (session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-background to-orange-50 px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <span className="text-6xl mr-4">☕</span>
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Welkom terug!
                </h1>
                <p className="text-xl text-gray-600 mt-2">
                  Klaar voor je volgende koffie avontuur? 🚀
                </p>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200 max-w-md mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center">
                  <span className="text-lg">👤</span>
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-500">Ingelogd als</p>
                  <p className="font-semibold text-gray-900">{session.user.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <CoffeeIcon className="w-8 h-8 text-amber-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">☕ Nieuw Avontuur</h3>
              <p className="text-gray-600 mb-6">
                Maak een nieuwe koffie meetup en ontdek geweldige plekken!
              </p>
              <Link href="/create">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
                >
                  <span className="mr-2">✨</span>
                  Start Avontuur
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">📋 Mijn Meetups</h3>
              <p className="text-gray-600 mb-6">
                Bekijk al je koffie avonturen en beheer je meetups!
              </p>
              <Link href="/dashboard">
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 font-semibold"
                >
                  <span className="mr-2">📊</span>
                  Bekijk Avonturen
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-amber-200">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Waarom Anemi Meets? 🌟
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">☕</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Geweldige Cafes</h3>
                <p className="text-gray-600">Ontdek de beste koffie plekken in je stad</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Eenvoudig Delen</h3>
                <p className="text-gray-600">Deel je meetups met vrienden via email</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Flexibele Planning</h3>
                <p className="text-gray-600">Kies uit meerdere data en tijden</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in user view
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
      </div>
    </div>
  );
} 