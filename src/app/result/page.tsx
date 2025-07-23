"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Send, Shuffle, Star, Home } from 'lucide-react'

interface Cafe {
  id: string
  name: string
  description: string
  address: string
  city: string
  rating: number
  reviewCount: number
  priceRange: string
  features: string[]
}

interface MeetupData {
  token: string
  organizerName: string
  organizerEmail: string
  availableDates: string[]
  availableTimes: string[]
}

function ResultPageContent() {
  const searchParams = useSearchParams()
  const [cafe, setCafe] = useState<Cafe | null>(null)
  const [meetupData, setMeetupData] = useState<MeetupData | null>(null)
  const [shuffleLoading, setShuffleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cafeId = searchParams.get('cafeId')
    const meetupToken = searchParams.get('token')

    if (!cafeId || !meetupToken) {
      setError('Ongeldige aanvraag')
      return
    }

    // Fetch cafe and meetup data
    const fetchData = async () => {
      try {
        const [cafeResponse, meetupResponse] = await Promise.all([
          fetch(`/api/cafes/${cafeId}`),
          fetch(`/api/meetups/${meetupToken}`)
        ])

        if (!cafeResponse.ok || !meetupResponse.ok) {
          throw new Error('Failed to fetch data')
        }

        const cafeData = await cafeResponse.json()
        const meetupData = await meetupResponse.json()

        setCafe(cafeData.cafe)
        setMeetupData(meetupData.meetup)
      } catch (err) {
        setError('Failed to load data')
      }
    }

    fetchData()
  }, [searchParams])

  const handleShuffle = async () => {
    if (!meetupData) return

    setShuffleLoading(true)
    try {
      const response = await fetch('/api/shuffle-cafe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: meetupData.token,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to shuffle')
      }

      const data = await response.json()
      setCafe(data.cafe)
    } catch (err) {
      setError('Failed to shuffle cafe')
    } finally {
      setShuffleLoading(false)
    }
  }

  const handleSendInvite = async () => {
    if (!meetupData) return

    try {
      const response = await fetch('/api/send-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: meetupData.token,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send invite')
      }

      alert('Uitnodiging succesvol verstuurd! 📧')
    } catch (err) {
      setError('Failed to send invite')
    }
  }

  if (error) {
    return (
      <main className="max-w-4xl mx-auto p-4">
        {/* Back to Home Button */}
        <div className="mb-6">
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

        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-foreground mb-4">Ongeldige Aanvraag</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/create">
            <Button className="bg-amber-500 hover:bg-amber-600">
              Nieuwe Meetup Maken
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  if (!cafe || !meetupData) {
    return (
      <main className="max-w-4xl mx-auto p-4">
        {/* Back to Home Button */}
        <div className="mb-6">
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

        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Je perfecte match laden...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto p-4">
      {/* Back to Home Button */}
      <div className="mb-6">
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

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Perfecte Match!</h1>
        <p className="text-gray-600">Hier is je koffie shop voor de meetup</p>
      </div>

      <div className="grid gap-6">
        {/* Cafe Card */}
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{cafe.name}</h2>
                <p className="text-gray-600 mb-3">
                  {cafe.description || 'Een geweldige plek voor je meetup'}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{cafe.rating.toFixed(1)}</span>
                    <span className="text-gray-500">({cafe.reviewCount} reviews)</span>
                  </div>
                  <span className="text-lg">{getPriceEmoji(cafe.priceRange)}</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <Star className="w-3 h-3 mr-1" />
                    Geverifieerd
                  </Badge>
                </div>

                <p className="text-sm text-gray-600">
                  📍 {cafe.address}, {cafe.city}
                </p>

                {cafe.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {cafe.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meetup Details */}
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">📋 Meetup Details</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-blue-600">👤</span>
                <span><strong>Organisator:</strong> {meetupData.organizerName}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-blue-600">📅</span>
                <span><strong>Beschikbare data:</strong> {meetupData.availableDates.length} opties</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-blue-600">⏰</span>
                <span><strong>Beschikbare tijden:</strong> {meetupData.availableTimes.length} opties</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={handleSendInvite}
            className="bg-green-500 hover:bg-green-600"
            size="lg"
          >
            <Send className="w-4 h-4 mr-2" />
            Uitnodiging Versturen
          </Button>
          
          <Button
            onClick={handleShuffle}
            disabled={shuffleLoading}
            variant="outline"
            size="lg"
            className="border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            {shuffleLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600 mr-2"></div>
                Schudden...
              </>
            ) : (
              <>
                <Shuffle className="w-4 h-4 mr-2" />
                Opnieuw Schudden
              </>
            )}
          </Button>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <Link href="/create" className="flex items-center gap-2 justify-center text-amber-600 hover:text-amber-700">
            <ArrowLeft className="w-4 h-4" />
            Terug naar Maken
          </Link>
        </div>
      </div>
    </main>
  )
}

function getPriceEmoji(priceRange: string) {
  switch (priceRange) {
    case 'BUDGET': return '💰'
    case 'MODERATE': return '☕'
    case 'EXPENSIVE': return '✨'
    case 'LUXURY': return '💎'
    default: return '☕'
  }
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    }>
      <ResultPageContent />
    </Suspense>
  )
} 