import { Suspense, lazy } from 'react'
import { Coffee, Search } from 'lucide-react'

// Lazy load the FindMyMeetups component
const FindMyMeetups = lazy(() => import('@/components/FindMyMeetups').then(module => ({ default: module.FindMyMeetups })))

export default function FindMeetupsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-cream-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Search className="w-10 h-10 text-amber-700" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4 leading-tight">
            Vind je{' '}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Meetups
            </span>
            {' '}☕
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-6 leading-relaxed max-w-2xl mx-auto">
            Heb je een meetup uitnodiging ontvangen? Voer je invite token in om je meetup te bekijken en te beheren.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
            <h2 className="font-semibold text-blue-800 mb-2">💡 Geen account nodig!</h2>
            <p className="text-sm text-blue-700">
              Je kunt meetups bekijken en accepteren zonder account. De invite token vind je in je uitnodiging (email of WhatsApp).
            </p>
          </div>
        </div>

        {/* App Uitleg Sectie */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border-2 border-amber-200 shadow-lg">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coffee className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                ☕ Echte Connecties Beginnen met een Kopje Koffie
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                In een wereld vol digitale interacties verlangen we naar <strong>echte verbindingen</strong>. 
                Anemi Meets maakt het eenvoudig om betekenisvolle ontmoetingen te organiseren.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-white rounded-xl border border-amber-200 shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Echte Connecties</h3>
                <p className="text-sm text-gray-600">
                  Ga voorbij de oppervlakkige likes en shares. Bouw echte vriendschappen en professionele netwerken.
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl border border-amber-200 shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">☕</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Koffie als Katalysator</h3>
                <p className="text-sm text-gray-600">
                  Een kopje koffie is de perfecte setting voor open gesprekken en spontane ontmoetingen.
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl border border-amber-200 shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Eenvoudig Organiseren</h3>
                <p className="text-sm text-gray-600">
                  Geen gedoe met groepsapps of eindeloze discussies. Gewoon een link delen en klaar.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-6 border border-amber-300">
              <h3 className="text-xl font-bold text-amber-800 mb-3 text-center">
                🌟 Waarom Anemi Meets?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Vergroot je netwerk met betekenisvolle ontmoetingen</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Ontdek nieuwe cafes en plekken in je stad</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Geen gedoe met account aanmaken of inloggen</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Perfect voor zowel vrienden als zakelijke connecties</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Automatische herinneringen en updates</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Veilig en privacy-vriendelijk</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Find My Meetups Component */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-amber-200 p-6 sm:p-8">
          <Suspense fallback={
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
              <p className="text-lg text-muted-foreground">Laden...</p>
            </div>
          }>
            <FindMyMeetups />
          </Suspense>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Waar vind je je invite token?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">📧 Email uitnodiging</h4>
                <p className="text-sm text-gray-600">
                  Kijk in je email naar de uitnodiging van Anemi Meets. De invite token staat in de link of als aparte code.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">💬 WhatsApp bericht</h4>
                <p className="text-sm text-gray-600">
                  Als je een WhatsApp bericht hebt ontvangen, staat de invite token meestal in de link of als code.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Klaar om je eigen meetups te maken?</h3>
            <p className="text-gray-600 mb-4">
              Maak een account aan om je eigen koffie meetups te organiseren en vrienden uit te nodigen!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/create" 
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <Coffee className="w-5 h-5 mr-2" />
                Start een Meetup
              </a>
              <a 
                href="/auth/signup" 
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-amber-300 text-amber-700 font-medium rounded-lg hover:bg-amber-50 transition-all duration-300"
              >
                Account Aanmaken
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 