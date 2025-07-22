"use client"

import { useState, useEffect } from 'react'
import { type City } from '@/constants/cities'
import { type CoffeeShop } from '@prisma/client'
import dynamic from 'next/dynamic'

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

  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

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
        setMapKey(prev => prev + 1) // Force map re-render
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

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-16 rounded"></div>
            ))}
          </div>
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
          Voor nu overslaan
        </button>
      </div>
    )
  }

  if (cafes.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-600 mb-4">Geen cafes gevonden in {selectedCity}</p>
        <button
          onClick={onSkip}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          Voor nu overslaan
        </button>
      </div>
    )
  }

  const mapCenter = getMapCenter()

  // Don't render map on server side
  if (!isClient) {
    return (
      <div className="h-96 w-full rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">🗺️</div>
          <p className="text-gray-600">Kaart wordt geladen...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">
          🗺️ Cafes in {selectedCity}
        </h4>
        <p className="text-sm text-gray-600">
          Klik op een marker om cafe details te zien en te selecteren
        </p>
      </div>

      {/* Interactive Map */}
      <div className="h-96 w-full rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg">
        <MapContainer
          key={mapKey}
          center={mapCenter as [number, number]}
          zoom={13}
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
            
            return (
              <Marker
                key={cafe.id}
                position={[cafe.latitude, cafe.longitude]}
                eventHandlers={{
                  click: () => onCafeSelect(cafe.id)
                }}
              >
                <Popup>
                  <div className="p-2 min-w-48">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">☕</span>
                      <h3 className="font-semibold text-gray-900">{cafe.name}</h3>
                      <span className="text-lg">{getPriceEmoji(cafe.priceRange)}</span>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">{getRatingStars(cafe.rating)}</span>
                        <span className="text-gray-600">({cafe.rating.toFixed(1)})</span>
                      </div>
                      
                      <p className="text-gray-600">📍 {cafe.address}</p>
                      
                      {cafe.description && (
                        <p className="text-gray-700 text-xs">{cafe.description}</p>
                      )}
                      
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => onCafeSelect(cafe.id)}
                          className={`px-3 py-1 text-xs rounded-full transition-colors ${
                            isSelected
                              ? 'bg-amber-500 text-white'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                        >
                          {isSelected ? '✓ Geselecteerd' : 'Selecteer'}
                        </button>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>

      {/* Selected Cafe Info */}
      {selectedCafeId && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h5 className="font-semibold text-gray-900 mb-2">✅ Geselecteerde Cafe:</h5>
          {(() => {
            const selectedCafe = cafes.find(cafe => cafe.id === selectedCafeId)
            if (!selectedCafe) return null
            
            return (
              <div className="space-y-2 text-sm">
                <p><strong>Naam:</strong> {selectedCafe.name}</p>
                <p><strong>Adres:</strong> {selectedCafe.address}</p>
                <p><strong>Rating:</strong> {getRatingStars(selectedCafe.rating)} {selectedCafe.rating.toFixed(1)} ({selectedCafe.reviewCount} reviews)</p>
                <p><strong>Prijs:</strong> {getPriceEmoji(selectedCafe.priceRange)} {selectedCafe.priceRange}</p>
                {selectedCafe.description && (
                  <p><strong>Beschrijving:</strong> {selectedCafe.description}</p>
                )}
              </div>
            )
          })()}
        </div>
      )}

      {/* Cafe List for Mobile */}
      <div className="block md:hidden">
        <h5 className="font-semibold text-gray-900 mb-3">📱 Cafe Lijst (voor mobiel)</h5>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {cafes.map((cafe) => (
            <button
              key={cafe.id}
              onClick={() => onCafeSelect(cafe.id)}
              className={`w-full p-3 text-left border rounded-lg transition-all ${
                selectedCafeId === cafe.id
                  ? 'bg-amber-100 border-amber-500 text-amber-700'
                  : 'bg-white border-gray-200 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">☕</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{cafe.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{cafe.address}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-xs">{getRatingStars(cafe.rating)}</span>
                  <span className="text-lg">{getPriceEmoji(cafe.priceRange)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={onSkip}
          className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Skip - laat jullie kiezen voor mij
        </button>
      </div>
    </div>
  )
} 