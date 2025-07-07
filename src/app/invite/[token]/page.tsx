"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Coffee, MapPin, Clock, Star, Calendar, CheckCircle, User, Mail } from 'lucide-react'
import Image from 'next/image'
import { getOrSetCsrfToken } from '@/lib/csrf'
import { useAsyncOperation } from '@/lib/use-async-operation'
import { ErrorService } from '@/lib/error-service'

interface InviteData {
  id: string
  token: string
  cafe: {
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
  organizerName: string
  organizerEmail: string
  availableDates: string[]
  availableTimes: string[]
  status: 'pending' | 'confirmed' | 'expired'
  chosenDate?: string
  chosenTime?: string
}

export default function InvitePage() {
  const params = useParams()
  const router = useRouter()
  const [inviteData, setInviteData] = useState<InviteData | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [inviteeName, setInviteeName] = useState<string>('')
  const [inviteeEmail, setInviteeEmail] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isConfirming, setIsConfirming] = useState(false)
  const [error, setError] = useState<string>('')

  const token = params.token as string

  const {
    execute: loadInviteAsync,
    isLoading: inviteLoading,
    error: inviteError,
  } = useAsyncOperation(async () => {
    const response = await fetch(`/api/invite/${token}`)
    if (!response.ok) {
      throw new Error('Invite not found or has expired')
    }
    return response.json()
  }, {
    onSuccess: (data) => {
      setInviteData(data)
    },
    onError: (err) => {
      setError(ErrorService.handleError(err))
      ErrorService.showToast(ErrorService.handleError(err), 'error')
    },
  })

  useEffect(() => {
    if (token) {
      loadInviteAsync()
    }
  }, [token])

  const {
    execute: confirmAsync,
    isLoading: confirmLoading,
    error: confirmError,
  } = useAsyncOperation(async () => {
    const response = await fetch(`/api/invite/${token}/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': getOrSetCsrfToken(),
      },
      body: JSON.stringify({ 
        chosenDate: selectedDate,
        chosenTime: selectedTime,
        inviteeName: inviteeName,
        inviteeEmail: inviteeEmail
      })
    })
    if (!response.ok) {
      throw new Error('Failed to confirm meetup.')
    }
    return response.json()
  }, {
    onSuccess: () => {
      router.push('/confirmed')
    },
    onError: (err) => {
      ErrorService.showToast(ErrorService.handleError(err), 'error')
    },
  })

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime || !inviteeName || !inviteeEmail) {
      ErrorService.showToast('Please fill in all fields', 'error')
      return
    }
    confirmAsync()
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

  if (inviteLoading) {
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
            You&apos;ve already confirmed this meetup for {inviteData.chosenDate && new Date(inviteData.chosenDate).toLocaleDateString()}.
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
            {inviteData.organizerName} invited you for coffee at this great spot!
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
          
          {/* Cafe Photos */}
          {inviteData.cafe.photos && inviteData.cafe.photos.length > 0 && (
            <div className="px-6 pb-4">
              <div className="grid grid-cols-2 gap-3">
                {inviteData.cafe.photos.slice(0, 2).map((photo, index) => (
                  <div key={index} className="relative aspect-video overflow-hidden rounded-lg">
                    <Image
                      src={photo}
                      alt={`${inviteData.cafe.name} - Photo ${index + 1}`}
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
              <span>{inviteData.cafe.address}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{inviteData.cafe.hours}</span>
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

        {/* Invitee Information */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Your Information
            </CardTitle>
            <CardDescription>
              Please provide your details so we can send you the confirmation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={inviteeName}
                onChange={(e) => setInviteeName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={inviteeEmail}
                onChange={(e) => setInviteeEmail(e.target.value)}
                className="mt-1"
              />
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
              {inviteData.availableDates.map((date: string) => {
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

        {/* Time Selection */}
        {selectedDate && inviteData.availableTimes.length > 0 && (
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Choose a Time
              </CardTitle>
              <CardDescription>
                Select your preferred time for the meetup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {inviteData.availableTimes.map((time: string) => {
                  const isSelected = selectedTime === time
                  return (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-4 text-center border rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-amber-100 border-amber-500 text-amber-700'
                          : 'bg-white border-gray-300 hover:border-amber-300'
                      }`}
                    >
                      <div className="font-medium">{time}</div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Confirm Button */}
        <Button
          onClick={handleConfirm}
          disabled={!selectedDate || !selectedTime || !inviteeName || !inviteeEmail || isConfirming}
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