"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, Mail, MessageCircle, HelpCircle, Clock, Globe } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <div className="border-b-2 border-amber-200 bg-white/80 backdrop-blur">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="flex items-center gap-2 text-amber-600 hover:text-amber-700">
                <Home className="w-4 h-4" />
                ← Terug naar Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-amber-700">Contact & Ondersteuning</h1>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <Mail className="w-5 h-5" />
                Neem Contact Op
              </CardTitle>
              <CardDescription>
                We helpen je graag met je vragen over Anemi Meets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Email Support</h4>
                    <a 
                      href="mailto:team@anemimeets.com" 
                      className="text-amber-600 hover:text-amber-700"
                    >
                      team@anemimeets.com
                    </a>
                    <p className="text-sm text-gray-600 mt-1">
                      Reactietijd: binnen 24 uur op werkdagen
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Beschikbaarheid</h4>
                    <p className="text-gray-700">Maandag - Vrijdag: 9:00 - 17:00 CET</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Weekends: beperkte ondersteuning
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Taal</h4>
                    <p className="text-gray-700">Nederlands & Engels</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-amber-200">
                <Link href="/system-status">
                  <Button variant="outline" className="w-full border-amber-300 text-amber-700 hover:bg-amber-50">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Bekijk Systeem Status
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <HelpCircle className="w-5 h-5" />
                Veelgestelde Vragen
              </CardTitle>
              <CardDescription>
                Snelle antwoorden op de meest voorkomende vragen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">❓ Hoe maak ik een meetup?</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Ga naar de <Link href="/create" className="text-amber-600 hover:underline">Meetup Maken</Link> pagina en volg de stappen. Je hebt een account nodig om te beginnen.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">🔐 Problemen met inloggen?</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Controleer je email en wachtwoord. Als je je wachtwoord bent vergeten, gebruik de "Wachtwoord vergeten" link op de inlogpagina.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">📧 Verificatie email niet ontvangen?</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Controleer je spam folder. Als je nog steeds geen email hebt ontvangen, neem contact met ons op.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">☕ Kan ik cafés toevoegen?</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Momenteel beheren we de café database centraal. Stuur ons een email met suggesties voor nieuwe cafés!
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">🔒 Privacy en gegevensbescherming</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Lees ons <Link href="/legal/privacy" className="text-amber-600 hover:underline">Privacybeleid</Link> voor meer informatie over hoe we je gegevens beschermen.
                </p>
              </div>

              <div className="pt-4 border-t border-amber-200">
                <p className="text-xs text-gray-500">
                  Geen antwoord gevonden? <a href="mailto:team@anemimeets.com" className="text-amber-600 hover:underline">Stuur ons een email</a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Help Section */}
        <Card className="mt-8 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-amber-700 mb-2">💡 Tip voor betere ondersteuning</h3>
              <p className="text-gray-600 mb-4">
                Wanneer je contact met ons opneemt, vermeld dan:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white p-3 rounded-lg border border-amber-200">
                  <span className="font-semibold">🔍 Het probleem</span>
                  <p className="text-gray-600 mt-1">Beschrijf wat er gebeurt</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-amber-200">
                  <span className="font-semibold">📱 Je apparaat</span>
                  <p className="text-gray-600 mt-1">Computer, telefoon, browser</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-amber-200">
                  <span className="font-semibold">🕐 Wanneer</span>
                  <p className="text-gray-600 mt-1">Tijd en datum van het probleem</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}