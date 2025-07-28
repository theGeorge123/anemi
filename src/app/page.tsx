import { Button } from '@/components/ui/button';
import { Coffee, Users, LogIn, Calendar, LogOut, Heart, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Suspense, lazy } from 'react';
import { LoginStatus } from '@/components/LoginStatus';

// Lazy load the FindMyMeetups component
const FindMyMeetups = lazy(() => import('@/components/FindMyMeetups').then(module => ({ default: module.FindMyMeetups })));

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-cream-50 to-orange-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8 sm:mb-12">
          {/* Hero Icon */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg">
            <Coffee className="w-10 h-10 sm:w-12 sm:h-12 text-amber-700" />
          </div>
          
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4 sm:mb-6 leading-tight px-2">
            Herverbind Over{' '}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Koffie
            </span>
            {' '}☕
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto px-4">
            Herverbind met vrienden en ontdek geweldige lokale spots in je stad.
          </p>
        </div>

        {/* Login status and appropriate buttons */}
        <Suspense fallback={
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 justify-center items-center mb-8 sm:mb-12 px-4">
            <Button asChild size="lg" className="text-base sm:text-lg px-8 py-6 sm:px-10 sm:py-8 w-full sm:w-auto bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Link href="/create">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
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
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                Lid worden
              </Link>
            </Button>
          </div>
        }>
          <LoginStatus />
        </Suspense>
        
        {/* Find My Meetups section for non-logged in users */}
        <div className="mt-12 sm:mt-16 p-4 sm:p-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl sm:rounded-3xl border-2 border-amber-200 shadow-lg mx-2 sm:mx-0">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-300 to-orange-300 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-md">
              <span className="text-2xl sm:text-3xl">🔍</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-3 sm:mb-4 px-2">
              Vind je Meetups
            </h3>
            <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6 leading-relaxed px-4">
              Heb je een meetup uitnodiging ontvangen? 
            </p>
            <p className="text-amber-700 font-medium text-base sm:text-lg px-4">
              Voer je <strong>invite token</strong> hieronder in om je meetup te bekijken →
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
      </div>
    </div>
  );
} 