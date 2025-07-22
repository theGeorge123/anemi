"use client"

import { useState, useEffect } from 'react'
import { type City } from '@/constants/cities'
import { type CoffeeShop } from '@prisma/client'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Star, Coffee, Sparkles, Heart, Clock, Users } from 'lucide-react'

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

interface MapViewProps {
  selectedCity: City
  selectedCafeId?: string | undefined
  onCafeSelect: (cafeId: string) => void
  onSkip: () => void
}

interface CafeWithDetails extends CoffeeShop {
  imageUrl?: string
}

// Custom marker icon for cafes
const createCustomIcon = (isSelected: boolean) => {
  return {
    iconUrl: isSelected ? '/coffee-marker-selected.png' : '/coffee-marker.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  }
}

export function MapView({ selectedCity, selectedCafeId, onCafeSelect, onSkip }: MapViewProps) {
  const [cafes, setCafes] = useState<CafeWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mapKey, setMapKey] = useState(0) // Force re-render when city changes
  const [isClient, setIsClient] = useState(false)
  const [hoveredCafe, setHoveredCafe] = useState<string | null>(null)

  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        setLoading(true)
        console.log('🗺️ Fetching cafes for city:', selectedCity)
        const response = await fetch(`/api/cafes?city=${selectedCity}`)
        if (!response.ok) {
          throw new Error('Failed to fetch cafes')
        }
        const data = await response.json()
        console.log('📊 Cafe API response:', data)
        setCafes(data.cafes)
        setMapKey(prev => prev + 1) // Force map re-render
      } catch (err) {
        console.error('❌ Error fetching cafes:', err)
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

  const getPriceText = (priceRange: string) => {
    switch (priceRange) {
      case 'BUDGET': return 'Budget'
      case 'MODERATE': return 'Gemiddeld'
      case 'EXPENSIVE': return 'Duur'
      case 'LUXURY': return 'Luxe'
      default: return 'Gemiddeld'
    }
  }

  const getRatingStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating))
  }

  // Calculate center of cafes for map
  const getMapCenter = () => {
    if (cafes.length === 0) {
      // Default centers for cities
      const cityCenters: Record<string, [number, number]> = {
        'Rotterdam': [51.9225, 4.4792],
        'Amsterdam': [52.3676, 4.9041],
        'Den Haag': [52.0705, 4.3007],
        'Utrecht': [52.0907, 5.1214]
      }
      return cityCenters[selectedCity] || [52.3676, 4.9041]
    }

    const lats = cafes.map(cafe => cafe.latitude).filter(lat => lat !== null)
    const lngs = cafes.map(cafe => cafe.longitude).filter(lng => lng !== null)
    
    if (lats.length === 0 || lngs.length === 0) {
      return [52.3676, 4.9041] // Default to Amsterdam
    }

    const avgLat = lats.reduce((sum, lat) => sum + lat, 0) / lats.length
    const avgLng = lngs.reduce((sum, lng) => sum + lng, 0) / lngs.length
    
    return [avgLat, avgLng]
  }

  // Calculate optimal zoom level based on cafe distribution
  const getOptimalZoom = () => {
    if (cafes.length <= 1) return 13
    
    const lats = cafes.map(cafe => cafe.latitude).filter(lat => lat !== null)
    const lngs = cafes.map(cafe => cafe.longitude).filter(lng => lng !== null)
    
    if (lats.length < 2) return 13
    
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)
    
    const latDiff = maxLat - minLat
    const lngDiff = maxLng - minLng
    const maxDiff = Math.max(latDiff, lngDiff)
    
    // Adjust zoom based on cafe distribution
    if (maxDiff < 0.01) return 15 // Very close cafes
    if (maxDiff < 0.05) return 14 // Close cafes
    if (maxDiff < 0.1) return 13 // Medium distance
    return 12 // Far apart cafes
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Coffee className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">🗺️ Cafes laden...</h3>
          <p className="text-gray-600">We zoeken de beste plekken in {selectedCity}</p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-200 h-96 rounded-2xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-24 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">😕</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Oeps! Er ging iets mis</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button
          onClick={onSkip}
          className="bg-amber-500 hover:bg-amber-600"
        >
          Voor nu overslaan
        </Button>
      </div>
    )
  }

  if (cafes.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">☕</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Geen cafes gevonden</h3>
        <p className="text-gray-600 mb-6">We konden geen cafes vinden in {selectedCity}</p>
        <Button
          onClick={onSkip}
          className="bg-amber-500 hover:bg-amber-600"
        >
          Voor nu overslaan
        </Button>
      </div>
    )
  }

  const mapCenter = getMapCenter()
  const optimalZoom = getOptimalZoom()

  // Don't render map on server side
  if (!isClient) {
    return (
      <div className="h-96 w-full rounded-2xl overflow-hidden border-2 border-gray-200 shadow-xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Coffee className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 font-medium">Kaart wordt geladen...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          🗺️ Cafes in {selectedCity}
        </h3>
        <p className="text-gray-600">
          Klik op een marker om cafe details te zien en te selecteren
        </p>
      </div>

      {/* Interactive Map */}
      <div className="relative">
        <div className="h-96 w-full rounded-2xl overflow-hidden border-2 border-amber-200 shadow-xl">
          <MapContainer
            key={mapKey}
            center={mapCenter as [number, number]}
            zoom={optimalZoom}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {cafes.map((cafe) => {
              if (!cafe.latitude || !cafe.longitude) return null
              
              const isSelected = selectedCafeId === cafe.id
              const isHovered = hoveredCafe === cafe.id
              
              return (
                <Marker
                  key={cafe.id}
                  position={[cafe.latitude, cafe.longitude]}
                  eventHandlers={{
                    click: () => onCafeSelect(cafe.id),
                    mouseover: () => setHoveredCafe(cafe.id),
                    mouseout: () => setHoveredCafe(null)
                  }}
                >
                  <Popup className="custom-popup">
                    <div className="p-4 min-w-64">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                          <Coffee className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg">{cafe.name}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-400 text-sm">{getRatingStars(cafe.rating)}</span>
                            <span className="text-gray-600 text-sm">({cafe.rating.toFixed(1)})</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{cafe.address}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600">
                          <Sparkles className="w-4 h-4" />
                          <span>{getPriceText(cafe.priceRange)} {getPriceEmoji(cafe.priceRange)}</span>
                        </div>
                        
                        {cafe.description && (
                          <p className="text-gray-700 text-xs italic">"{cafe.description}"</p>
                        )}
                        
                        <div className="flex gap-2 mt-4">
                          <Button
                            onClick={() => onCafeSelect(cafe.id)}
                            size="sm"
                            className={`flex-1 ${
                              isSelected
                                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <Heart className="w-4 h-4 mr-1" />
                                Geselecteerd
                              </>
                            ) : (
                              <>
                                <Coffee className="w-4 h-4 mr-1" />
                                Selecteer
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
        </div>
        
        {/* Map Overlay Info */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-amber-200">
          <div className="flex items-center gap-2 text-sm">
            <Coffee className="w-4 h-4 text-amber-600" />
            <span className="font-medium text-gray-900">{cafes.length} cafes gevonden</span>
          </div>
        </div>
      </div>

      {/* Selected Cafe Info */}
      {selectedCafeId && (
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">✅ Geselecteerde Cafe</h4>
                <p className="text-gray-600">Perfecte keuze! ☕</p>
              </div>
            </div>
            
            {(() => {
              const selectedCafe = cafes.find(cafe => cafe.id === selectedCafeId)
              if (!selectedCafe) return null
              
              return (
                <div className="space-y-3">
                  <div className="bg-white/80 rounded-lg p-4 border border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-bold text-gray-900 text-lg">{selectedCafe.name}</h5>
                      <span className="text-2xl">{getPriceEmoji(selectedCafe.priceRange)}</span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedCafe.address}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-700">
                          {getRatingStars(selectedCafe.rating)} {selectedCafe.rating.toFixed(1)} 
                          <span className="text-gray-500 ml-1">({selectedCafe.reviewCount} reviews)</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600">
                        <Sparkles className="w-4 h-4" />
                        <span>{getPriceText(selectedCafe.priceRange)}</span>
                      </div>
                      
                      {selectedCafe.description && (
                        <div className="flex items-start gap-2 text-gray-700">
                          <span className="text-lg">💭</span>
                          <p className="text-sm italic">"{selectedCafe.description}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}

      {/* Cafe List for Mobile */}
      <div className="block md:hidden">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-gray-600" />
          <h5 className="font-semibold text-gray-900">📱 Cafe Lijst (voor mobiel)</h5>
        </div>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {cafes.map((cafe) => (
            <button
              key={cafe.id}
              onClick={() => onCafeSelect(cafe.id)}
              onMouseEnter={() => setHoveredCafe(cafe.id)}
              onMouseLeave={() => setHoveredCafe(null)}
              className={`w-full p-4 text-left border rounded-xl transition-all duration-200 ${
                selectedCafeId === cafe.id
                  ? 'bg-gradient-to-r from-amber-100 to-orange-100 border-amber-500 text-amber-700 shadow-lg'
                  : hoveredCafe === cafe.id
                  ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 shadow-md'
                  : 'bg-white border-gray-200 hover:border-amber-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedCafeId === cafe.id 
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500' 
                    : 'bg-gray-100'
                }`}>
                  <Coffee className={`w-5 h-5 ${
                    selectedCafeId === cafe.id ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{cafe.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{cafe.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-xs">{getRatingStars(cafe.rating)}</span>
                  <span className="text-lg">{getPriceEmoji(cafe.priceRange)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Skip Button */}
      <div className="text-center pt-4">
        <Button
          onClick={onSkip}
          variant="ghost"
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        >
          <Clock className="w-4 h-4 mr-2" />
          Skip - laat jullie kiezen voor mij
        </Button>
      </div>
    </div>
  )
} 