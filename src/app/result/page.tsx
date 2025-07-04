"use client"

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Coffee, MapPin, Clock, Star, Shuffle, Send, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

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
  
  const cafeParam = searchParams.get('cafe')
  const formParam = searchParams.get('form')
  
  if (!cafeParam || !formParam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Request</h1>
          <p className="text-gray-600 mb-6">Please start over and create a new meetup.</p>
          <Button asChild>
            <Link href="/create">Create New Meetup</Link>
          </Button>
        </div>
      </div>
    )
  }

  const cafe: Cafe = JSON.parse(decodeURIComponent(cafeParam))
  const formData = JSON.parse(decodeURIComponent(formParam))

  const handleShuffleAgain = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/shuffle-cafe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceRange: formData.priceRange,
          city: formData.city 
        })
      })
      
      if (response.ok) {
        const newCafe = await response.json()
        router.push(`/result?cafe=${encodeURIComponent(JSON.stringify(newCafe))}&form=${encodeURIComponent(JSON.stringify(formData))}`)
      } else {
        alert('Failed to find another cafe. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendInvite = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/send-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cafe,
          formData,
          dates: formData.dates,
          times: formData.times
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        router.push(`/confirmed?inviteLink=${encodeURIComponent(result.inviteLink)}`)
      } else {
        alert('Failed to send invite. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

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
              Back to Create
            </Link>
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Perfect Match!</h1>
            <p className="text-gray-600">Here&apos;s your coffee shop for the meetup</p>
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
                  {cafe.description || 'A great place for your meetup'}
                </CardDescription>
              </div>
              {cafe.isVerified && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <Star className="w-3 h-3 mr-1" />
                  Verified
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
            disabled={isLoading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending Invite...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Send Invite
              </div>
            )}
          </Button>
          
          <Button
            onClick={handleShuffleAgain}
            disabled={isLoading}
            variant="outline"
            className="w-full py-3"
          >
            <div className="flex items-center gap-2">
              <Shuffle className="w-4 h-4" />
              Shuffle Again
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
              <span className="text-gray-600">Organizer:</span>
              <span className="font-medium">{formData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price Range:</span>
              <span className="font-medium">{getPriceDisplay(formData.priceRange)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">City:</span>
              <span className="font-medium">{formData.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Available Dates:</span>
              <span className="font-medium">{formData.dates.length} dates selected</span>
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
          <p className="text-gray-600">Loading your perfect match...</p>
        </div>
      </div>
    }>
      <ResultPageContent />
    </Suspense>
  )
} 