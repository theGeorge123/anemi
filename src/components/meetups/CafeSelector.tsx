"use client"

import { useState, useEffect } from 'react'
import { type City } from '@/constants/cities'
import { type CoffeeShop } from '@prisma/client'

interface CafeSelectorProps {
  selectedCity: City
  selectedCafeId?: string | undefined
  onCafeSelect: (cafeId: string) => void
  onSkip: () => void
}

interface CafeWithDetails extends CoffeeShop {
  imageUrl?: string
}

export function CafeSelector({ selectedCity, selectedCafeId, onCafeSelect, onSkip }: CafeSelectorProps) {
  const [cafes, setCafes] = useState<CafeWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/cafes?city=${selectedCity}`)
        if (!response.ok) {
          throw new Error('Failed to fetch cafes')
        }
        const data = await response.json()
        setCafes(data.cafes)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load cafes')
      } finally {
        setLoading(false)
      }
    }

    fetchCafes()
  }, [selectedCity])

  const getPriceEmoji = (priceRange: string) => {
    switch (priceRange) {
      case 'BUDGET': return '💰'
      case 'MODERATE': return '☕'
      case 'EXPENSIVE': return '✨'
      case 'LUXURY': return '💎'
      default: return '☕'
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 4.0) return 'text-yellow-600'
    if (rating >= 3.5) return 'text-orange-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-red-600 mb-4">😕 {error}</p>
        <button
          onClick={onSkip}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          Skip for now
        </button>
      </div>
    )
  }

  if (cafes.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-600 mb-4">No cafes found in {selectedCity}</p>
        <button
          onClick={onSkip}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          Skip for now
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">
          🏪 Pick your favorite cafe in {selectedCity}
        </h4>
        <p className="text-sm text-gray-600">
          Choose a cafe or skip to let us pick for you
        </p>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {cafes.map((cafe) => (
          <button
            key={cafe.id}
            onClick={() => onCafeSelect(cafe.id)}
            className={`w-full p-4 text-left border rounded-lg transition-all hover:scale-105 ${
              selectedCafeId === cafe.id
                ? 'bg-amber-100 border-amber-500 text-amber-700 shadow-md'
                : 'bg-white border-gray-200 hover:border-amber-300 hover:shadow-sm'
            }`}
          >
            <div className="flex gap-4">
              {/* Cafe Image */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">☕</span>
                </div>
              </div>

              {/* Cafe Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 truncate">{cafe.name}</h3>
                  <span className="text-lg">{getPriceEmoji(cafe.priceRange)}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${i < Math.floor(cafe.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className={`text-sm font-medium ${getRatingColor(cafe.rating)}`}>
                    {cafe.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-500">({cafe.reviewCount} reviews)</span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {cafe.description || 'A cozy coffee shop with great atmosphere'}
                </p>

                {/* Address */}
                <p className="text-xs text-gray-500 truncate">
                  📍 {cafe.address}
                </p>

                {/* Features */}
                {cafe.features.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {cafe.features.slice(0, 3).map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="text-center pt-4">
        <button
          onClick={onSkip}
          className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Skip - let you pick for me
        </button>
      </div>
    </div>
  )
} 