import { Button } from '@/components/ui/button';
import { Coffee, Users, LogIn, Calendar, LogOut, Heart, MapPin, Search, Info, Star, MessageCircle, Clock, Globe } from 'lucide-react';
import Link from 'next/link';
import { Suspense, lazy } from 'react';
import { LoginStatus } from '@/components/LoginStatus';

// Lazy load the FindMyMeetups component
const FindMyMeetups = lazy(() => import('@/components/FindMyMeetups').then(module => ({ default: module.FindMyMeetups })));

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-cream-50 to-orange-50">
      {/* Hero Section */}
      <div className="flex items-center justify-center px-4 py-8">
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
            
            {/* Link to dedicated page */}
            <div className="mt-6 text-center">
              <Link href="/find-meetups">
                <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-50 flex items-center gap-2 mx-auto">
                  <Search className="w-4 h-4" />
                  Bekijk Volledige Pagina
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Meer Informatie Sectie */}
      <div className="px-4 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-amber-300 to-orange-300 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg">
              <Info className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-display font-bold text-foreground mb-4 sm:mb-6 leading-tight">
              Meer Informatie Over{' '}
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Anemi Meets
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Ontdek hoe wij de behoefte aan echte connecties vergroten, beginnend met een kopje koffie
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-12 sm:mb-16 lg:mb-20">
            {/* Feature 1 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                Echte Connecties
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                In een digitale wereld vergeten we soms de waarde van face-to-face ontmoetingen. 
                Anemi Meets maakt het eenvoudig om echte connecties te maken over een kopje koffie.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                Lokale Ontdekkingen
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                Ontdek geweldige cafés in je stad die je misschien nog niet kende. 
                Van verborgen pareltjes tot populaire hotspots - wij helpen je de perfecte plek te vinden.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                Flexibele Planning
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                Kies uit meerdere data en tijden die voor iedereen werken. 
                Geen gedoe meer met eindeloze WhatsApp berichten om een tijd af te spreken.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                Eenvoudige Communicatie
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                Stuur één uitnodiging en laat iedereen direct reageren. 
                Geen groepsapps meer nodig - alles gebeurt op één plek.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                Persoonlijke Ervaring
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                Elke meetup is uniek en persoonlijk. Van de cafe keuze tot de timing - 
                alles wordt aangepast aan jouw voorkeuren en die van je vrienden.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                Nederlandse Steden
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                Momenteel actief in Amsterdam, Rotterdam, Utrecht, Den Haag en Rhoon. 
                Meer steden komen eraan! Suggesties zijn altijd welkom.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl p-8 sm:p-12 lg:p-16 border-2 border-amber-200 shadow-lg">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6">
                Klaar om te Herverbinden? ☕
              </h3>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto">
                Start vandaag nog met het plannen van je eerste koffie meetup en ervaar het verschil van echte connecties.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                <Button asChild size="lg" className="text-base sm:text-lg px-8 py-6 sm:px-10 sm:py-8 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <Link href="/create">
                    <Coffee className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                    Start een Meetup
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base sm:text-lg px-8 py-6 sm:px-10 sm:py-8 border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300">
                  <Link href="/contact">
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                    Contact
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 