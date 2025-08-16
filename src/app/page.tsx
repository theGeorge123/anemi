import { Button } from '@/components/ui/button';
import { Coffee, Users, LogIn, Calendar, LogOut, Heart, MapPin, Search, Info, Star, MessageCircle, Clock, Globe, Shield } from 'lucide-react';
import Link from 'next/link';
import { Suspense, lazy } from 'react';
import { LoginStatus } from '@/components/LoginStatus';
import MeetupStats from '@/components/meetups/MeetupStats';
import PopularCafesMap from '@/components/meetups/PopularCafesMap';
import ReconnectionHero from '@/components/ReconnectionHero';

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
              In deze digitale wereld, herverbind met de mensen die je al kent. Plan echte ontmoetingen, deel momenten, en bouw betekenisvolle relaties op - één kopje koffie tegelijk.
            </p>
          </div>

          {/* Login status and appropriate buttons */}
          <Suspense fallback={
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 justify-center items-center mb-8 sm:mb-12 px-4">
              <Button asChild size="lg" className="text-base sm:text-lg px-8 py-6 sm:px-10 sm:py-8 w-full sm:w-auto bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Link href="/create">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  Start een Herverbinding
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
        </div>
      </div>

      {/* Bekijk Verhalen Sectie */}
      <div className="px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="p-4 sm:p-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl sm:rounded-3xl border-2 border-amber-200 shadow-lg">
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-300 to-orange-300 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-md">
                <span className="text-2xl sm:text-3xl">📖</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-3 sm:mb-4 px-2">
                Verhalen van Herverbinding
              </h3>
              <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6 leading-relaxed px-4">
                Ontdek inspirerende verhalen van mensen die elkaar weer hebben ontmoet
              </p>
              <p className="text-amber-700 font-medium text-base sm:text-lg px-4">
                Lees ervaringen van herverbinding en deel je eigen verhaal →
              </p>
            </div>
            
            <div className="text-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                <Link href="/stories">
                  <Coffee className="w-5 h-5 mr-2" />
                  Bekijk Verhalen
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Meetup Statistics and Popular Cafes */}
      <div className="px-4 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Herverbind met je Netwerk
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Zie hoeveel mensen al bezig zijn met het herverbinden en ontdek waar je je eigen ontmoetingen kunt plannen
            </p>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-2">
            <MeetupStats city="Amsterdam" />
            <PopularCafesMap city="Amsterdam" limit={4} />
          </div>
        </div>
      </div>

      {/* Find My Meetups section for non-logged in users */}
      <div className="px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="p-4 sm:p-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl sm:rounded-3xl border-2 border-amber-200 shadow-lg">
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-300 to-orange-300 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-md">
                <span className="text-2xl sm:text-3xl">🔍</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-3 sm:mb-4 px-2">
                Vind je Herverbinding
              </h3>
              <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6 leading-relaxed px-4">
                Heb je een uitnodiging ontvangen om iemand weer te ontmoeten? 
              </p>
              <p className="text-amber-700 font-medium text-base sm:text-lg px-4">
                Voer je <strong>invite token</strong> hieronder in om je herverbinding te bekijken →
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
              <Coffee className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-amber-700" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Waarom Echte Ontmoetingen?
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              In een wereld vol AI en digitale communicatie, zijn echte menselijke connecties waardevoller dan ooit. Herverbind met de mensen die je al kent.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid gap-6 sm:gap-8 lg:gap-10 sm:grid-cols-2 lg:grid-cols-3 mb-12 sm:mb-16 lg:mb-20">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Herverbind met Vrienden
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Plan ontmoetingen met mensen die je al kent maar te weinig ziet. Bouw bestaande relaties sterker op door regelmatige face-to-face contacten.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Betekenisvolle Locaties
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Kies voor ontmoetingen op plekken die betekenis hebben - niet zomaar een café, maar een plek waar je samen herinneringen kunt maken.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Flexibele Planning
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Plan ontmoetingen die voor iedereen werken. Omdat je elkaar al kent, is het makkelijker om een tijd te vinden die voor iedereen past.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Eenvoudige Uitnodigingen
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Nodig mensen uit die je al kent via WhatsApp, email of directe links. Geen ongemakkelijke eerste ontmoetingen - alleen herverbinding.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Gedeelde Herinneringen
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Deel verhalen van je ontmoetingen en inspireer anderen om ook hun bestaande relaties te versterken. Bouw samen aan betekenisvolle momenten.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Vertrouwde Ontmoetingen
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Ontmoet mensen die je al kent in openbare, vertrouwde locaties. Geen zorgen over veiligheid - alleen focus op herverbinding en kwaliteitstijd.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 sm:p-12 border-2 border-amber-200 shadow-lg">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Klaar om te herverbinden?
              </h3>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
                Start je eerste coffee meeting en herverbind met de mensen die je al kent
              </p>
              <div className="flex justify-center">
                <Button asChild size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                  <Link href="/create">
                    <Users className="w-5 h-5 mr-2" />
                    Start een Herverbinding
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