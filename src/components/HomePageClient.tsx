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

  // Logged in user view - show feature highlights only
  if (session) {
    return (
      <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coffee className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Klaar voor je volgende avontuur! ☕</h3>
          <p className="text-gray-600 mb-4">
            Plan je volgende meetup of bekijk je bestaande afspraken.
          </p>
        </div>

        {/* Feature highlights for logged-in users */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>
    );
  }

  // Not logged in user view - show FindMyMeetups
  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
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