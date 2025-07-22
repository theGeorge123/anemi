"use client"

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Coffee, MapPin, Clock, Star, Shuffle, Send, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getOrSetCsrfToken } from '@/lib/csrf'
import { useAsyncOperation } from '@/lib/use-async-operation'
import { ErrorService } from '@/lib/error-service'
import { useSupabase } from '@/components/SupabaseProvider'

interface Cafe {
  id: string
  name: string
  address: string
  priceRange: string
  rating: number
  hours: string
  isVerified: boolean
  description?: string
  photos?: string[]
}

function ResultPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { session } = useSupabase();

  // Always parse params, even if invalid, to keep hooks order stable
  const cafeParam = searchParams.get('cafe')
  const formParam = searchParams.get('form')
  let cafe: Cafe | null = null
  let formData: any = null
  try {
    if (cafeParam) cafe = JSON.parse(decodeURIComponent(cafeParam))
    if (formParam) formData = JSON.parse(decodeURIComponent(formParam))
  } catch {}

  // Always call hooks unconditionally
  const {
    execute: shuffleAgainAsync,
    isLoading: shuffleLoading,
    error: shuffleError,
  } = useAsyncOperation(async () => {
    const response = await fetch('/api/shuffle-cafe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': getOrSetCsrfToken(),
      },
      body: JSON.stringify({
        priceRange: formData?.priceRange,
        city: formData?.city
      })
    });
    if (!response.ok) {
      throw new Error('Failed to find another cafe.');
    }
    return response.json();
  }, {
    onSuccess: (newCafe) => {
      router.push(`/result?cafe=${encodeURIComponent(JSON.stringify(newCafe))}&form=${encodeURIComponent(JSON.stringify(formData))}`);
    },
    onError: (err) => {
      ErrorService.showToast(ErrorService.handleError(err), 'error');
    },
  });

  const {
    execute: sendInviteAsync,
    isLoading: inviteLoading,
    error: inviteError,
  } = useAsyncOperation(async () => {
    const response = await fetch('/api/send-invite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': getOrSetCsrfToken(),
      },
      body: JSON.stringify({
        cafe,
        formData,
        dates: formData?.dates,
        times: formData?.times,
        userId: session?.user.id,
      })
    });
    if (!response.ok) {
      throw new Error('Failed to send invite.');
    }
    return response.json();
  }, {
    onSuccess: (result) => {
      router.push(`/confirmed?inviteLink=${encodeURIComponent(result.inviteLink)}`);
    },
    onError: (err) => {
      ErrorService.showToast(ErrorService.handleError(err), 'error');
    },
  });

  if (!cafe || !formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Ongeldige Aanvraag</h1>
          <p className="text-muted-foreground mb-6">Begin opnieuw en maak een nieuwe meetup.</p>
          <Button asChild>
            <Link href="/create">Nieuwe Meetup Maken</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleShuffleAgain = () => {
    shuffleAgainAsync();
  };

  const handleSendInvite = () => {
    sendInviteAsync();
  };

  const getPriceDisplay = (priceRange: string) => {
    switch (priceRange) {
      case 'BUDGET': return '$'
      case 'MODERATE': return '$$'
      case 'EXPENSIVE': return '$$$'
      case 'LUXURY': return '$$$$'
      default: return '$$'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/create" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Terug naar Maken
            </Link>
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Perfecte Match!</h1>
            <p className="text-gray-600">Hier is je koffie shop voor de meetup</p>
          </div>
        </div>

        {/* Cafe Card */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Coffee className="w-5 h-5 text-amber-600" />
                  {cafe.name}
                </CardTitle>
                <CardDescription className="mt-2">
                  {cafe.description || 'Een geweldige plek voor je meetup'}
                </CardDescription>
              </div>
              {cafe.isVerified && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <Star className="w-3 h-3 mr-1" />
                  Geverifieerd
                </Badge>
              )}
            </div>
          </CardHeader>
          
          {/* Cafe Photos */}
          {cafe.photos && cafe.photos.length > 0 && (
            <div className="px-6 pb-4">
              <div className="grid grid-cols-2 gap-3">
                {cafe.photos.slice(0, 2).map((photo, index) => (
                  <div key={index} className="relative aspect-video overflow-hidden rounded-lg">
                    <Image
                      src={photo}
                      alt={`${cafe.name} - Photo ${index + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{cafe.address}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{cafe.hours}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-gray-600">{cafe.rating}/5</span>
              <Badge variant="outline" className="ml-auto">
                {getPriceDisplay(cafe.priceRange)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={handleSendInvite}
            disabled={shuffleLoading || inviteLoading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3"
          >
            {shuffleLoading || inviteLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {shuffleLoading ? 'Schudden...' : 'Uitnodiging Versturen...'}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Uitnodiging Versturen
              </div>
            )}
          </Button>
          
          <Button
            onClick={handleShuffleAgain}
            disabled={shuffleLoading}
            variant="outline"
            className="w-full py-3"
          >
            <div className="flex items-center gap-2">
              <Shuffle className="w-4 h-4" />
              Opnieuw Schudden
            </div>
          </Button>
        </div>

        {/* Meetup Details */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Meetup Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Organisator:</span>
              <span className="font-medium">{formData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Prijsbereik:</span>
              <span className="font-medium">{getPriceDisplay(formData.priceRange)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Stad:</span>
              <span className="font-medium">{formData.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Beschikbare Data:</span>
              <span className="font-medium">{formData.dates.length} data geselecteerd</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Je perfecte match laden...</p>
        </div>
      </div>
    }>
      <ResultPageContent />
    </Suspense>
  )
} 