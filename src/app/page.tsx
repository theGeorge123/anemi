import { Button } from '@/components/ui/button';
import { Coffee, Users, LogIn, Calendar, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { LoginStatus } from '@/components/LoginStatus';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-background to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Coffee className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Anemi - Herverbind Over Koffie
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Herverbind met vrienden en ontdek geweldige lokale spots in je stad.
          </p>
        </div>

        {/* Login status and appropriate buttons */}
        <Suspense fallback={
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
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
        }>
          <LoginStatus />
        </Suspense>
        
        {/* Simple static section for non-logged in users */}
        <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Vind je Meetups</h3>
            <p className="text-gray-600 mb-4">
              Heb je een meetup geaccepteerd maar geen account? 
            </p>
            <p className="text-amber-600 font-medium">
              Gebruik de zoekfunctie hieronder om je meetups te vinden →
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 