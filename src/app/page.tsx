import { Button } from '@/components/ui/button';
import { Coffee, Users, LogIn, Calendar, LogOut, Heart, MapPin, Search, Info, Star, MessageCircle, Clock, Globe, Shield, Share2 } from 'lucide-react';
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
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16">
        <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto text-center">
          <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-16">
            {/* Hero Icon */}
            <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 md:mb-8 lg:mb-10 shadow-lg">
              <Coffee className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-amber-700" />
            </div>
            
            {/* Main Heading */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-display font-bold text-foreground mb-3 sm:mb-4 md:mb-6 lg:mb-8 leading-tight px-2 sm:px-4">
              Herverbind Over{' '}
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Koffie
              </span>
              {' '}☕
            </h1>
            
            {/* Subtitle */}
            <p className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-muted-foreground mb-6 sm:mb-8 md:mb-10 lg:mb-12 leading-relaxed max-w-2xl sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto px-2 sm:px-4">
              In deze digitale wereld, herverbind met de mensen die je al kent. Plan echte ontmoetingen, deel momenten, en bouw betekenisvolle relaties op - één kopje koffie tegelijk.
            </p>
          </div>

          {/* Login status and appropriate buttons */}
          <Suspense fallback={
            <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 justify-center items-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 px-2 sm:px-4">
              <Button asChild size="lg" className="text-sm xs:text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 lg:px-12 py-4 sm:py-6 md:py-8 w-full sm:w-auto bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Link href="/create">
                  <Users className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mr-2 sm:mr-3" />
                  Start een Herverbinding
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="text-sm xs:text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 lg:px-12 py-4 sm:py-6 md:py-8 w-full sm:w-auto border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300">
                <Link href="/auth/signin">
                  <LogIn className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mr-2 sm:mr-3" />
                  Inloggen
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="text-sm xs:text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 lg:px-12 py-4 sm:py-6 md:py-8 w-full sm:w-auto border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300">
                <Link href="/auth/signup">
                  <Calendar className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mr-2 sm:mr-3" />
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
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16">
        <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
          <div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl md:rounded-3xl border-2 border-amber-200 shadow-lg">
            <div className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-10">
              <div className="w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-amber-300 to-orange-300 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6 lg:mb-8 shadow-md">
                <span className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl">📖</span>
              </div>
              <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground mb-2 sm:mb-3 md:mb-4 lg:mb-6 px-2 sm:px-4">
                Verhalen van Meetups
              </h3>
              <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-3 sm:mb-4 md:mb-6 lg:mb-8 leading-relaxed px-2 sm:px-4">
                Ontdek inspirerende verhalen van mensen die elkaar weer hebben ontmoet
              </p>
              <p className="text-amber-700 font-medium text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl px-2 sm:px-4">
                Lees ervaringen van meetups en deel je eigen verhaal →
              </p>
            </div>
            
            <div className="text-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-sm xs:text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 md:py-6 lg:py-8">
                <Link href="/stories">
                  <Coffee className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 mr-2" />
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
              Verbind met je Netwerk
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Zie hoeveel mensen al bezig zijn met het plannen van meetups en ontdek waar je je eigen ontmoetingen kunt organiseren
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
                Vind je Meetup
              </h3>
              <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6 leading-relaxed px-4">
                Heb je een uitnodiging ontvangen voor een meetup? 
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
              <Coffee className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-amber-700" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Waarom Echte Ontmoetingen?
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              In een wereld vol AI en digitale communicatie, zijn echte menselijke connecties waardevoller dan ooit. Plan meetups met de mensen die je al kent.
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
                Verbind met Vrienden
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
                Ontmoet mensen die je al kent in openbare, vertrouwde locaties. Geen zorgen over veiligheid - alleen focus op verbinding en kwaliteitstijd.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Share2 className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Eenvoudig Delen
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Nodig mensen uit die je al kent via WhatsApp, email of directe links. Geen ongemakkelijke eerste ontmoetingen - alleen meetups.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Veilige Ontmoetingen
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Ontmoet mensen die je al kent in openbare, vertrouwde locaties. Geen zorgen over veiligheid - alleen focus op verbinding en kwaliteitstijd.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Lokale Gemeenschap
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Ontdek nieuwe plekken in je eigen stad en steun lokale cafés. Bouw een sterke lokale gemeenschap op door regelmatige ontmoetingen.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Betekenisvolle Momenten
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Creëer herinneringen die je leven verrijken. Echte ontmoetingen leiden tot diepere vriendschappen en waardevolle ervaringen.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 sm:p-12 border-2 border-amber-200 shadow-lg">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Klaar om te Beginnen?
              </h3>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
                Plan je eerste meetup en ervaar het verschil dat echte ontmoetingen maken in je leven.
              </p>
              <Button asChild size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-6 text-lg">
                <Link href="/create">
                  <Coffee className="w-6 h-6 mr-3" />
                  Start een Meetup
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 