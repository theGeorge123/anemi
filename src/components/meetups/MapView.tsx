"use client"

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { logger } from '@/lib/logger'

// Dynamically import react-leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

interface Cafe {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  rating?: number
  price_range?: string
}

interface MapViewProps {
  selectedCity: string
  onCafeSelect?: (cafe: Cafe) => void
  selectedCafe?: Cafe | null
}

export default function MapView({ selectedCity, onCafeSelect, selectedCafe }: MapViewProps) {
  const [cafes, setCafes] = useState<Cafe[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!selectedCity) return

    const fetchCafes = async () => {
      setLoading(true)
      setError(null)
      
      logger.info('Fetching cafes for city', { city: selectedCity }, 'MAP')
      
      try {
        const response = await fetch(`/api/cafes?city=${encodeURIComponent(selectedCity)}`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        logger.info('Cafe API response received', {
          city: selectedCity,
          cafeCount: data.cafes?.length || 0
        }, 'MAP')
        
        setCafes(data.cafes || [])
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        logger.error('Error fetching cafes', err as Error, { city: selectedCity }, 'MAP')
        setError(`Fout bij het laden van cafés: ${errorMessage}`)
      } finally {
        setLoading(false)
      }
    }

    fetchCafes()
  }, [selectedCity])

  // Don't render map on server-side
  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Kaart laden...</p>
        </div>
      </div>
    )
  }

  // Show loading state while fetching cafes
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Cafes laden...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (cafes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-gray-400 mb-2">☕</div>
          <p className="text-gray-600">Geen cafés gevonden in {selectedCity}</p>
        </div>
      </div>
    )
  }

  const center = cafes.length > 0 && cafes[0]
    ? [cafes[0].latitude, cafes[0].longitude] 
    : [52.3676, 4.9041] // Amsterdam default

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-200">
      <MapContainer
        center={center as [number, number]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {cafes.map((cafe) => (
          <Marker
            key={cafe.id}
            position={[cafe.latitude, cafe.longitude]}
            eventHandlers={{
              click: () => onCafeSelect?.(cafe)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm mb-1">{cafe.name}</h3>
                <p className="text-xs text-gray-600 mb-1">{cafe.address}</p>
                {cafe.rating && (
                  <p className="text-xs text-gray-500">⭐ {cafe.rating}/5</p>
                )}
                {cafe.price_range && (
                  <p className="text-xs text-gray-500">💰 {cafe.price_range}</p>
                )}
                {onCafeSelect && (
                  <button
                    onClick={() => onCafeSelect(cafe)}
                    className="mt-2 px-2 py-1 bg-amber-500 text-white text-xs rounded hover:bg-amber-600"
                  >
                    Selecteren
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
} 