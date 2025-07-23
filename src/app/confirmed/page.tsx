"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Coffee, Heart } from 'lucide-react'

function ConfirmedPageContent() {
  const searchParams = useSearchParams()
  const status = searchParams.get('status')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (status === 'accepted') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Geweldig! 🎉
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              Je hebt de uitnodiging geaccepteerd! 
              <br />
              <strong>Check je email</strong> voor de bevestiging met alle details.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <Coffee className="w-5 h-5 text-green-600" />
                <p className="text-green-800">
                  <strong>Tip:</strong> Voeg de afspraak toe aan je agenda en 
                  neem contact op met je meetup partner!
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/dashboard'
                  }
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                Bekijk mijn meetups
              </Button>
              
              <Button 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/'
                  }
                }}
                variant="outline"
                className="w-full"
              >
                Terug naar home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'declined') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-orange-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Geen probleem! 😊
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              Je hebt de uitnodiging afgewezen. 
              <br />
              Misschien een andere keer?
            </p>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-orange-600" />
                <p className="text-orange-800">
                  <strong>Bedankt</strong> voor het laten weten! 
                  Dit helpt de organizer om toekomstige meetups beter te plannen.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/'
                  }
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                Terug naar home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Default case - no status or invalid status
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Coffee className="w-12 h-12 text-amber-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welkom bij Anemi Meets! ☕
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Je bent succesvol geregistreerd en klaar om coffee meetups te ontdekken!
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-amber-600" />
              <p className="text-amber-800">
                <strong>Start je coffee adventure</strong> door je eerste meetup te maken!
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/create'
                }
              }}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white"
            >
              Maak je eerste meetup
            </Button>
            
            <Button 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/'
                }
              }}
              variant="outline"
              className="w-full"
            >
              Verken de app
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ConfirmedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Coffee className="w-12 h-12 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Laden...</h1>
        </div>
      </div>
    }>
      <ConfirmedPageContent />
    </Suspense>
  )
} 