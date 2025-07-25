"use client"

import { Button } from '@/components/ui/button';
import { Coffee, Users, LogIn, LogOut, Heart, MapPin, Plus, Eye } from 'lucide-react';
import Link from 'next/link';
import { useSupabase } from '@/components/SupabaseProvider';
import { Suspense, lazy } from 'react';

// Lazy load the FindMyMeetups component
const FindMyMeetups = lazy(() => import('@/components/FindMyMeetups').then(module => ({ default: module.FindMyMeetups })));

export function HomePageClient() {
  const { session, loading } = useSupabase();

  // Show loading only if Supabase is still initializing
  if (loading) {
    return (
      <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Laden...</p>
        </div>
      </div>
    );
  }

  // Logged in user view - show welcome and quick actions
  if (session) {
    return (
      <>
        {/* Welcome section for logged-in users */}
        <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Coffee className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Welkom terug! ☕</h3>
            <p className="text-gray-600 mb-4">
              Klaar om opnieuw te verbinden en nieuwe spots te ontdekken?
            </p>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-green-200 max-w-md mx-auto mb-4">
              <p className="text-sm text-gray-500">Ingelogd als</p>
              <p className="font-semibold text-gray-900">{session.user.email}</p>
            </div>
          </div>

          {/* Quick action buttons for logged-in users */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
              <Link href="/create">
                <Plus className="w-5 h-5 mr-2" />
                Nieuwe Meetup
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard">
                <Eye className="w-5 h-5 mr-2" />
                Mijn Meetups
              </Link>
            </Button>
          </div>

          {/* Feature highlights for logged-in users */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-green-200">
              <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 text-sm mb-1">Herverbind</h4>
              <p className="text-xs text-gray-600">Plan meetups met vrienden</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-green-200">
              <MapPin className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 text-sm mb-1">Ontdek</h4>
              <p className="text-xs text-gray-600">Vind nieuwe lokale spots</p>
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={async () => {
              const { supabase } = await import('@/components/SupabaseProvider').then(module => module.useSupabase());
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
      </>
    );
  }

  // Not logged in user view - show FindMyMeetups
  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🔍</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Vind je Meetups</h3>
        <p className="text-gray-600 mb-4">
          Heb je een meetup geaccepteerd maar geen account? 
        </p>
        <Link href="/auth/signin" className="text-amber-600 hover:underline font-medium">
          Log in om je meetups te bekijken →
        </Link>
      </div>
      
      <Suspense fallback={
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Laden...</p>
        </div>
      }>
        <FindMyMeetups />
      </Suspense>
    </div>
  );
} 