"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Home, Search, Coffee, Users, Calendar, MapPin } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">😅</span>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">404 - Pagina Niet Gevonden</CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Oeps! De pagina die je zoekt bestaat niet. Maar geen zorgen, we helpen je verder!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Search className="w-5 h-5" />
              Zoek naar wat je nodig hebt
            </h3>
            <div className="flex gap-2">
              <Input 
                placeholder="Zoek naar meetups, cafes, etc..."
                className="flex-1"
              />
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Popular Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">📋 Populaire Pagina&apos;s</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link href="/">
                <Button variant="outline" className="w-full justify-start">
                  <Home className="w-4 h-4 mr-2" />
                  Homepage
                </Button>
              </Link>
              <Link href="/create">
                <Button variant="outline" className="w-full justify-start">
                  <Coffee className="w-4 h-4 mr-2" />
                  Meetup Maken
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Inloggen
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">⚡ Snelle Acties</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="flex-1">
                <Button className="w-full bg-amber-600 hover:bg-amber-700">
                  <Home className="w-4 h-4 mr-2" />
                  Terug naar Home
                </Button>
              </Link>
              <Link href="/contact" className="flex-1">
                <Button variant="outline" className="w-full">
                  <MapPin className="w-4 h-4 mr-2" />
                  Hulp Nodig?
                </Button>
              </Link>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-800 mb-2">💡 Tips</h3>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Controleer of je de juiste URL hebt ingevoerd</li>
              <li>• Gebruik de navigatie links hierboven</li>
              <li>• Neem contact op als je hulp nodig hebt</li>
              <li>• Probeer de zoekfunctie om te vinden wat je zoekt</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 