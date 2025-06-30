"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Users, Coffee, Shuffle } from 'lucide-react'

export default function CreatePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dates: [] as string[],
    priceRange: 'normal'
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleDateToggle = (date: string) => {
    setFormData(prev => ({
      ...prev,
      dates: prev.dates.includes(date) 
        ? prev.dates.filter(d => d !== date)
        : [...prev.dates, date]
    }))
  }

  const handleShuffle = async () => {
    if (!formData.name || !formData.email || formData.dates.length === 0) {
      alert('Please fill in all fields and select at least one date')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/shuffle-cafe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceRange: formData.priceRange })
      })
      
      if (response.ok) {
        const cafe = await response.json()
        router.push(`/result?cafe=${encodeURIComponent(JSON.stringify(cafe))}&form=${encodeURIComponent(JSON.stringify(formData))}`)
      } else {
        alert('Failed to find a cafe. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Generate next 7 days
  const nextDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i + 1)
    return date.toISOString().split('T')[0]
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a Meetup</h1>
          <p className="text-gray-600">Fill in the details and we'll find you the perfect coffee shop</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Meetup Details
            </CardTitle>
            <CardDescription>
              Tell us about your meetup and we'll match you with a great coffee shop
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter your email"
              />
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <select
                value={formData.priceRange}
                onChange={(e) => setFormData(prev => ({ ...prev, priceRange: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="cheap">$ - Budget friendly</option>
                <option value="normal">$$ - Standard</option>
                <option value="expensive">$$$ - Premium</option>
              </select>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Dates (Select 2-3)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {nextDays.map((date) => {
                  const dateObj = new Date(date)
                  const isSelected = formData.dates.includes(date)
                  return (
                    <button
                      key={date}
                      type="button"
                      onClick={() => handleDateToggle(date)}
                      className={`p-3 text-sm border rounded-md transition-colors ${
                        isSelected
                          ? 'bg-amber-100 border-amber-500 text-amber-700'
                          : 'bg-white border-gray-300 hover:border-amber-300'
                      }`}
                    >
                      <div className="font-medium">
                        {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Shuffle Button */}
            <Button
              onClick={handleShuffle}
              disabled={isLoading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Finding Coffee Shop...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Shuffle className="w-4 h-4" />
                  Shuffle Coffee Shop
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 