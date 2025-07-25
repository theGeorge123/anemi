"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordStrength } from '@/components/ui/password-strength'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
import Link from 'next/link'

export default function TestPasswordStrengthPage() {
  const [password, setPassword] = useState('')
  const [testPasswords] = useState([
    { name: 'Zwak', password: '123456', description: 'Alleen cijfers' },
    { name: 'Redelijk', password: 'password123', description: 'Gemeenschappelijk woord + cijfers' },
    { name: 'Goed', password: 'MyPassword123!', description: 'Hoofdletters, cijfers, symbolen' },
    { name: 'Uitstekend', password: 'K0ff!3M33tup2024!', description: 'Complex en uniek' },
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-background to-orange-50 flex items-center justify-center p-4">
      {/* Back to Home Button */}
      <div className="absolute top-4 left-4">
        <Link href="/">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
          >
            <Home className="w-4 h-4" />
            ← Terug naar Home
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-amber-700">🔐 Wachtwoord Sterkte Test</CardTitle>
            <CardDescription className="text-lg">
              Test onze leuke wachtwoord sterkte indicator!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Live Test */}
            <div className="space-y-4">
              <Label htmlFor="test-password">Test je eigen wachtwoord:</Label>
              <Input
                id="test-password"
                type="password"
                placeholder="Type hier je wachtwoord..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-lg"
              />
              <PasswordStrength password={password} />
            </div>

            {/* Example Passwords */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Voorbeelden:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testPasswords.map((test, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{test.name}</h4>
                        <p className="text-sm text-gray-600">{test.description}</p>
                      </div>
                      <Input
                        type="text"
                        value={test.password}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <PasswordStrength password={test.password} />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Tips */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-blue-900 mb-2">💡 Tips voor een sterk wachtwoord:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Gebruik minimaal 8 karakters</li>
                  <li>• Combineer hoofdletters en kleine letters</li>
                  <li>• Voeg cijfers toe</li>
                  <li>• Gebruik speciale tekens (!@#$%^&*)</li>
                  <li>• Vermijd veelgebruikte woorden</li>
                  <li>• Maak het uniek voor elke site</li>
                </ul>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 