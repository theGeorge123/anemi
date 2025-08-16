'use client'

import { Button } from '@/components/ui/button'
import { Coffee, Users, Heart, Clock, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function ReconnectionHero() {
  return (
    <div className="bg-gradient-to-br from-amber-50 via-cream-50 to-orange-50 py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        {/* Main Message */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
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
          
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Herverbind met de mensen die je al kent. Plan betekenisvolle ontmoetingen, deel momenten, 
            en bouw bestaande relaties sterker op - één kopje koffie tegelijk.
          </p>
        </div>

        {/* Why Reconnect Section */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
            Waarom herverbinden?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-amber-100">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Bestaande Relaties
              </h3>
              <p className="text-gray-600 text-sm">
                Versterk de banden met mensen die je al kent maar te weinig ziet
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-amber-100">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Kwaliteitstijd
              </h3>
              <p className="text-gray-600 text-sm">
                Maak tijd vrij voor face-to-face contact in plaats van alleen digitale communicatie
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-amber-100">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Echte Gesprekken
              </h3>
              <p className="text-gray-600 text-sm">
                Geniet van diepe, betekenisvolle gesprekken die je niet online kunt hebben
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-8 border-2 border-amber-200">
          <h3 className="text-2xl sm:text-3xl font-bold text-amber-800 mb-4">
            Klaar om te herverbinden?
          </h3>
          <p className="text-lg text-amber-700 mb-6 max-w-2xl mx-auto">
            Start vandaag nog met het plannen van ontmoetingen met mensen die je al kent. 
            Het is tijd om echte connecties te maken in plaats van alleen digitale.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 text-lg px-8 py-4">
              <Link href="/create">
                <Coffee className="w-5 h-5 mr-2" />
                Start een Herverbinding
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="border-amber-300 text-amber-700 hover:bg-amber-50 text-lg px-8 py-4">
              <Link href="/stories">
                <Users className="w-5 h-5 mr-2" />
                Lees Verhalen
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">100+</div>
            <div className="text-gray-600">Herverbindingen gepland</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">50+</div>
            <div className="text-gray-600">Betekenisvolle locaties</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">1000+</div>
            <div className="text-gray-600">Momenten gedeeld</div>
          </div>
        </div>
      </div>
    </div>
  )
}
