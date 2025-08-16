'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Coffee, MapPin, Star, TrendingUp, Users, Calendar } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Dynamically import the map to avoid SSR issues
const AnemiMap = dynamic(() => import('@/components/AnemiMap'), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg border-2 border-dashed border-amber-300 flex items-center justify-center">
      <div className="text-center">
        <Coffee className="w-12 h-12 text-amber-600 mx-auto mb-2" />
        <p className="text-amber-700 font-medium">Kaart laden...</p>
      </div>
    </div>
  )
})

interface PopularCafe {
  id: string
  name: string
  description?: string
  city: string
  address: string
  latitude: number
  longitude: number
  rating: number
  reviewCount: number
  priceRange: string
  features: string[]
  photos: string[]
  recentMeetups: number
  popularityScore: number
  trending: boolean
}

interface PopularCafesMapProps {
  city: string
  limit?: number
}

export default function PopularCafesMap({ city, limit = 10 }: PopularCafesMapProps) {
  const [cafes, setCafes] = useState<PopularCafe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    const fetchPopularCafes = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/cafes/popular?city=${encodeURIComponent(city)}&limit=${limit}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch popular cafes')
        }
        
        const data = await response.json()
        setCafes(data.cafes || [])
      } catch (error) {
        console.error('Error fetching popular cafes:', error)
        setError('Failed to load popular cafes')
      } finally {
        setLoading(false)
      }
    }

    fetchPopularCafes()
  }, [city, limit])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coffee className="w-5 h-5" />
            Populaire cafés laden...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Coffee className="w-5 h-5" />
            Fout bij laden
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (cafes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coffee className="w-5 h-5" />
            Geen populaire cafés gevonden
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Er zijn nog geen populaire cafés in {city}. Wees de eerste om een café te beoordelen!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            Betekenisvolle Locaties in {city}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMap(!showMap)}
          >
            {showMap ? 'Verberg kaart' : 'Toon kaart'}
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          Ontdek waar je je herverbindingen kunt plannen - cafés waar anderen al betekenisvolle momenten hebben gedeeld
        </p>
      </CardHeader>
      
      <CardContent>
        {showMap && (
          <div className="mb-6">
            <div className="text-center text-gray-600 mb-4">
              <MapPin className="w-6 h-6 mx-auto mb-2" />
              <p>Interactieve kaart met populaire cafés</p>
              <p className="text-sm">Klik op markers om café details te zien</p>
            </div>
            <AnemiMap />
          </div>
        )}

        <div className="space-y-4">
          {cafes.map((cafe) => (
            <div
              key={cafe.id}
              className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              {/* Cafe Image */}
              <div className="flex-shrink-0">
                {cafe.photos && cafe.photos.length > 0 ? (
                  <img
                    src={cafe.photos[0]}
                    alt={cafe.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-200 to-orange-200 rounded-lg flex items-center justify-center">
                    <Coffee className="w-8 h-8 text-amber-600" />
                  </div>
                )}
              </div>

              {/* Cafe Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {cafe.name}
                  </h3>
                  {cafe.trending && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {cafe.description || cafe.address}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span>{cafe.rating.toFixed(1)}</span>
                    <span>({cafe.reviewCount})</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{cafe.recentMeetups} meetups deze maand</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{cafe.features.slice(0, 2).join(', ')}</span>
                  </div>
                </div>

                {/* Price Range */}
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
                    {cafe.priceRange === 'BUDGET' && '€'}
                    {cafe.priceRange === 'MODERATE' && '€€'}
                    {cafe.priceRange === 'PREMIUM' && '€€€'}
                    {cafe.priceRange === 'LUXURY' && '€€€€'}
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link href={`/create?cafe=${cafe.id}`}>
                    Plan Meetup
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button variant="outline" asChild>
            <Link href="/create">
              Bekijk alle cafés in {city}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
