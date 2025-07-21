"use client"

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { type City } from '@/constants/cities'

interface Cafe {
  id: string
  name: string
  description: string
  rating: number
  priceRange: string
  address: string
  features: string[]
}

interface CafeChoiceStepProps {
  selectedCity: City
  onCafeSelect: (cafeId: string) => void
  onChooseOwn: () => void
}

export function CafeChoiceStep({ selectedCity, onCafeSelect, onChooseOwn }: CafeChoiceStepProps) {
  const [randomCafe, setRandomCafe] = useState<Cafe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [shuffling, setShuffling] = useState(false)

    const fetchRandomCafe = useCallback(async (isShuffle = false) => {
    try {
      if (isShuffle) {
        setShuffling(true)
      } else {
        setLoading(true)
      }
      console.log('Fetching random cafe for city:', selectedCity)
      const response = await fetch(`/api/cafes?city=${selectedCity}&random=true`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch random cafe')
      }

      const data = await response.json()
      console.log('Random cafe response:', data)
      
      if (data.cafes && data.cafes.length > 0) {
        setRandomCafe(data.cafes[0])
      } else {
        setError('Geen cafes gevonden in deze stad')
      }
    } catch (err) {
      setError('Failed to load random cafe')
      console.error('Error fetching random cafe:', err)
    } finally {
      setLoading(false)
      setShuffling(false)
    }
  }, [selectedCity])

  useEffect(() => {
    fetchRandomCafe()
  }, [fetchRandomCafe])

  if (loading) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">🎲 Een random cafe voor je!</h3>
          <p className="text-gray-600">We zoeken een perfecte plek in {selectedCity}...</p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">🎲 Een random cafe voor je!</h3>
          <p className="text-gray-600">Er ging iets mis bij het laden van een cafe</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={onChooseOwn}
            className="flex-1 bg-amber-500 hover:bg-amber-600"
          >
            Zelf een cafe kiezen
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">🎲 Een random cafe voor je!</h3>
        <p className="text-gray-600">We hebben een perfecte plek gevonden in {selectedCity}</p>
      </div>

      {randomCafe && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{randomCafe.name}</h4>
                <p className="text-gray-600 text-sm mb-2">{randomCafe.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>⭐ {randomCafe.rating}/5</span>
                  <span>{randomCafe.priceRange}</span>
                </div>
              </div>
              <div className="text-2xl">☕</div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>📍 Adres:</strong> {randomCafe.address}
              </p>
              {randomCafe.features.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {randomCafe.features.map((feature, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              )}
            </div>


          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <Button 
          onClick={() => onCafeSelect(randomCafe?.id || '')}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white"
        >
          ✅ Ja, deze cafe is perfect!
        </Button>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => fetchRandomCafe(true)}
            variant="outline"
            disabled={shuffling}
            className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            {shuffling ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Shufflen...
              </>
            ) : (
              '🔄 Shuffle cafe'
            )}
          </Button>
          
          <Button 
            onClick={onChooseOwn}
            variant="outline"
            className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            🔍 Zelf kiezen
          </Button>
        </div>
      </div>


    </div>
  )
} 