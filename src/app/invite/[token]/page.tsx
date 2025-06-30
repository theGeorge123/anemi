"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Coffee, MapPin, Clock, Star, Calendar, CheckCircle } from 'lucide-react'

interface InviteData {
  id: string
  token: string
  cafe: {
    id: string
    name: string
    address: string
    priceRange: string
    rating: number
    openHours: string
    isVerified: boolean
    description?: string
  }
  formData: {
    name: string
    email: string
    dates: string[]
    priceRange: string
  }
  status: 'pending' | 'confirmed' | 'expired'
  chosenDate?: string
}

export default function InvitePage() {
  const params = useParams()
  const router = useRouter()
  const [inviteData, setInviteData] = useState<InviteData | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isConfirming, setIsConfirming] = useState(false)
  const [error, setError] = useState<string>('')

  const token = params.token as string

  useEffect(() => {
    const loadInvite = async () => {
      try {
        const response = await fetch(`/api/invite/${token}`)
        if (response.ok) {
          const data = await response.json()
          setInviteData(data)
        } else {
          setError('Invite not found or has expired')
        }
      } catch (error) {
        console.error('Error loading invite:', error)
        setError('Failed to load invite')
      } finally {
        setIsLoading(false)
      }
    }

    if (token) {
      loadInvite()
    }
  }, [token])

  const handleConfirm = async () => {
    if (!selectedDate) {
      alert('Please select a date')
      return
    }

    setIsConfirming(true)
    try {
      const response = await fetch(`/api/invite/${token}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chosenDate: selectedDate })
      })
      
      if (response.ok) {
        router.push('/confirmed')
      } else {
        alert('Failed to confirm meetup. Please try again.')
      }
    } catch (error) {
      console.error('Error confirming:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsConfirming(false)
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your invite...</p>
        </div>
      </div>
    )
  }

  if (error || !inviteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invite Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'This invite link is invalid or has expired.'}</p>
          <Button onClick={() => router.push('/')}>
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  if (inviteData.status === 'confirmed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Meetup Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            You've already confirmed this meetup for {inviteData.chosenDate && new Date(inviteData.chosenDate).toLocaleDateString()}.
          </p>
          <Button onClick={() => router.push('/confirmed')}>
            View Details
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Coffee Meetup Invite</h1>
          <p className="text-gray-600">
            {inviteData.formData.name} invited you for coffee at this great spot!
          </p>
        </div>

        {/* Cafe Card */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Coffee className="w-5 h-5 text-amber-600" />
                  {inviteData.cafe.name}
                </CardTitle>
                <CardDescription className="mt-2">
                  {inviteData.cafe.description || 'A great place for your meetup'}
                </CardDescription>
              </div>
              {inviteData.cafe.isVerified && (
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
              <span>{inviteData.cafe.address}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{inviteData.cafe.openHours}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-gray-600">{inviteData.cafe.rating}/5</span>
              <Badge variant="outline" className="ml-auto">
                {getPriceDisplay(inviteData.cafe.priceRange)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Date Selection */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Choose a Date
            </CardTitle>
            <CardDescription>
              Select one of the available dates for your meetup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {inviteData.formData.dates.map((date) => {
                const dateObj = new Date(date)
                const isSelected = selectedDate === date
                return (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`p-4 text-center border rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-amber-100 border-amber-500 text-amber-700'
                        : 'bg-white border-gray-300 hover:border-amber-300'
                    }`}
                  >
                    <div className="font-medium">
                      {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="text-sm text-gray-500">
                      {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Confirm Button */}
        <Button
          onClick={handleConfirm}
          disabled={!selectedDate || isConfirming}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3"
        >
          {isConfirming ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Confirming...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Confirm Meetup
            </div>
          )}
        </Button>
      </div>
    </div>
  )
} 