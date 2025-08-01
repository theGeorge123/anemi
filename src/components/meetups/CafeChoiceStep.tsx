"use client"

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { type City } from '@/constants/cities'
import { Shuffle, Coffee, MapPin, Star, DollarSign, ArrowLeft, AlertCircle } from 'lucide-react'

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
  onBackToCitySelection: () => void
}

export function CafeChoiceStep({ selectedCity, onCafeSelect, onChooseOwn, onBackToCitySelection }: CafeChoiceStepProps) {
  const [randomCafe, setRandomCafe] = useState<Cafe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [noCafesFound, setNoCafesFound] = useState(false)
  const [shuffling, setShuffling] = useState(false)

  const fetchRandomCafe = useCallback(async (isShuffle = false) => {
    try {
      if (isShuffle) {
        setShuffling(true)
      } else {
        setLoading(true)
      }
      setError(null) // Clear previous errors
      setNoCafesFound(false) // Clear previous no cafes found state
      console.log('Fetching random cafe for city:', selectedCity)
      const response = await fetch(`/api/cafes?city=${selectedCity}&random=true`)
      
      if (!response.ok) {
        throw new Error('Kon geen cafe ophalen')
      }

      const data = await response.json()
      console.log('Random cafe response:', data)
      
      if (data.cafes && data.cafes.length > 0) {
        setRandomCafe(data.cafes[0])
      } else {
        setNoCafesFound(true)
        setError('Geen cafes gevonden in deze stad')
      }
    } catch (err) {
      setError('Kon geen random cafe laden')
      console.error('Error fetching random cafe:', err)
    } finally {
      setLoading(false)
      setShuffling(false)
    }
  }, [selectedCity])

  useEffect(() => {
    fetchRandomCafe()
  }, [fetchRandomCafe])

  const handleShuffle = () => {
    fetchRandomCafe(true)
  }

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

  if (noCafesFound) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">😔 Geen cafes gevonden</h3>
          <p className="text-gray-600">Er zijn helaas geen cafes beschikbaar in {selectedCity}</p>
        </div>
        
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-orange-800 mb-2">Geen cafes in {selectedCity}</h4>
                <p className="text-sm text-orange-700 mb-4">
                  We hebben momenteel geen cafes geregistreerd in {selectedCity}. 
                  Kies een andere stad om door te gaan met je meetup.
                </p>
                <div className="bg-orange-100 border border-orange-200 rounded-lg p-3">
                  <p className="text-xs text-orange-800">
                    <strong>Beschikbare steden:</strong> Amsterdam, Rotterdam
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button 
            onClick={onBackToCitySelection}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            ← Terug naar stad kiezen
          </Button>
          
          <Button 
            onClick={onChooseOwn}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
          >
            🔍 Zelf een cafe kiezen
          </Button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">💡 Tips</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Kies een andere stad om meer cafe opties te zien</li>
            <li>• Amsterdam en Rotterdam hebben de meeste cafes</li>
            <li>• Je kunt ook zelf een cafe toevoegen via &quot;Zelf kiezen&quot;</li>
          </ul>
        </div>
      </div>
    )
  }

  if (error && !noCafesFound) {
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
          <Button 
            onClick={() => fetchRandomCafe(true)}
            variant="outline"
            className="flex-1"
          >
            🔄 Opnieuw proberen
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
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-900 mb-2">{randomCafe.name}</h4>
                <p className="text-gray-600 text-sm mb-3">{randomCafe.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{randomCafe.rating}/5</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span>{randomCafe.priceRange}</span>
                  </div>
                </div>
              </div>
              <div className="text-3xl ml-4">☕</div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-start gap-2 mb-3">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  {randomCafe.address}
                </p>
              </div>
              
              {randomCafe.features && randomCafe.features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {randomCafe.features.map((feature, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full font-medium"
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
          onClick={() => randomCafe && onCafeSelect(randomCafe.id)}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3"
          disabled={!randomCafe}
        >
          ✅ Kies dit cafe
        </Button>
        
        <Button 
          onClick={handleShuffle}
          disabled={shuffling}
          variant="outline"
          className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 py-3"
        >
          {shuffling ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
              Shufflen...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Shuffle className="w-4 h-4" />
              🔄 Shuffle naar ander cafe
            </div>
          )}
        </Button>
        
        <Button 
          onClick={onChooseOwn}
          variant="outline"
          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
        >
          🔍 Zelf een cafe kiezen
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">💡 Handige Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Gebruik de shuffle knop om andere cafes te ontdekken</li>
          <li>• Klik op "Zelf kiezen" om een specifiek cafe te selecteren</li>
          <li>• Alle cafes hebben wifi en zijn geschikt voor meetups</li>
        </ul>
      </div>
    </div>
  )
} 