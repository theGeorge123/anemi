'use client'

import { Button } from '@/components/ui/button'
import { Coffee, Users, Heart, Clock, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function ReconnectionHero() {
  return (
    <div className="bg-gradient-to-br from-amber-50 via-cream-50 to-orange-50 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto text-center">
        {/* Main Message */}
        <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 leading-tight px-2 sm:px-4">
            In deze{' '}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              AI-wereld
            </span>
            , zijn{' '}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              echte connecties
            </span>{' '}
            waardevoller dan ooit
          </h1>
          
          <p className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-gray-600 mb-6 sm:mb-8 md:mb-10 max-w-3xl sm:max-w-4xl lg:max-w-5xl mx-auto leading-relaxed px-2 sm:px-4">
            Herverbind met de mensen die je al kent. Plan betekenisvolle ontmoetingen, deel momenten, 
            en bouw bestaande relaties sterker op - één kopje koffie tegelijk.
          </p>
        </div>

        {/* Why Reconnect Section */}
        <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 sm:mb-8 md:mb-10">
            Waarom herverbinden?
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl lg:rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-amber-600" />
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Bestaande Relaties
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed">
                Versterk de banden met mensen die je al kent maar te weinig ziet
              </p>
            </div>
            
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl lg:rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-amber-600" />
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Kwaliteitstijd
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed">
                Maak tijd vrij voor face-to-face contact in plaats van alleen digitale communicatie
              </p>
            </div>
            
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl lg:rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl transition-shadow duration-300 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6">
                <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-amber-600" />
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Echte Gesprekken
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed">
                Geniet van diepe, betekenisvolle gesprekken die je niet online kunt hebben
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl lg:rounded-2xl xl:rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 border-2 border-amber-200">
          <h3 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-amber-800 mb-3 sm:mb-4 lg:mb-6">
            Klaar om te herverbinden?
          </h3>
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-amber-700 mb-4 sm:mb-6 lg:mb-8 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed">
            Start vandaag nog met het plannen van ontmoetingen met mensen die je al kent. 
            Het is tijd om echte connecties te maken in plaats van alleen digitale.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center">
            <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 w-full sm:w-auto">
              <Link href="/create">
                <Coffee className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2" />
                Start een Herverbinding
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="border-amber-300 text-amber-700 hover:bg-amber-50 text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 w-full sm:w-auto">
              <Link href="/stories">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2" />
                Lees Verhalen
              </Link>
            </Button>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Start je Eerste Meetup
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Plan een ontmoeting met iemand die je al kent en bouw betekenisvolle connecties op
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">100+</div>
            <div className="text-gray-600">Meetups gepland</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">50+</div>
            <div className="text-gray-600">Cafés beschikbaar</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">95%</div>
            <div className="text-gray-600">Tevreden gebruikers</div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-6 text-lg">
            <Link href="/create">
              <Coffee className="w-6 h-6 mr-3" />
              Start een Meetup
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
