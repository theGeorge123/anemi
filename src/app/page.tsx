import { Button } from '@/components/ui/button';
import { Coffee, Users, LogIn, Calendar, LogOut, Heart, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Suspense, lazy } from 'react';
import { LoginStatus } from '@/components/LoginStatus';
import { PublicMeetupExamples } from '@/components/PublicMeetupExamples';

// Lazy load the FindMyMeetups component
const FindMyMeetups = lazy(() => import('@/components/FindMyMeetups').then(module => ({ default: module.FindMyMeetups })));

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-cream-50 to-orange-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-12">
          {/* Hero Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <Coffee className="w-12 h-12 text-amber-700" />
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
            Herverbind Over{' '}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Koffie
            </span>
            {' '}☕
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
            Herverbind met vrienden en ontdek geweldige lokale spots in je stad.
          </p>
        </div>

        {/* Login status and appropriate buttons */}
        <Suspense fallback={
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <Button asChild size="lg" className="text-lg px-10 py-8 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <Link href="/create">
              <Users className="w-6 h-6 mr-3" />
              Start een Meetup
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="text-lg px-10 py-8 border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300">
            <Link href="/auth/signin">
              <LogIn className="w-6 h-6 mr-3" />
              Inloggen
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="text-lg px-10 py-8 border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300">
            <Link href="/auth/signup">
              <Calendar className="w-6 h-6 mr-3" />
              Lid worden
            </Link>
          </Button>
        </div>
        }>
          <LoginStatus />
        </Suspense>
        
        {/* Find My Meetups section for non-logged in users */}
        <div className="mt-16 p-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl border-2 border-amber-200 shadow-lg">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-300 to-orange-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-foreground mb-4">
              Vind je Meetups
            </h3>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Heb je een meetup geaccepteerd maar geen account? 
            </p>
            <p className="text-amber-700 font-medium text-lg">
              Gebruik de zoekfunctie hieronder om je meetups te vinden →
            </p>
          </div>
          
          <Suspense fallback={
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
              <p className="text-lg text-muted-foreground">Laden...</p>
            </div>
          }>
            <FindMyMeetups />
          </Suspense>
        </div>

        {/* Public Meetup Examples */}
        <div className="mt-16">
          <PublicMeetupExamples />
        </div>
      </div>
    </div>
  );
} 