"use client"

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Coffee, MapPin, Clock, Star, Shuffle, Send, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Cafe {
  id: string
  name: string
  address: string
  priceRange: string
  rating: number
  openHours: string
  isVerified: boolean
  description?: string
}

export default function ResultPage() {
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
        body: JSON.stringify({ priceRange: formData.priceRange })
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
          dates: formData.dates
        })
      })
      
      if (response.ok) {
        router.push('/confirmed')
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
      case 'cheap': return '$'
      case 'normal': return '$$'
      case 'expensive': return '$$$'
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
            <p className="text-gray-600">Here's your coffee shop for the meetup</p>
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
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{cafe.address}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{cafe.openHours}</span>
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

        {/* Selected Dates */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Selected Dates:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {formData.dates.map((date: string) => {
              const dateObj = new Date(date)
              return (
                <div
                  key={date}
                  className="p-3 bg-white border border-gray-200 rounded-md text-center"
                >
                  <div className="font-medium text-sm">
                    {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
} 