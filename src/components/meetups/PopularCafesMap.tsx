'use client'

import { useState, useEffect, Suspense } from 'react'
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

export default function PopularCafesMap({ city, limit = 6 }: PopularCafesMapProps) {
  const [cafes, setCafes] = useState<PopularCafe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    fetchPopularCafes()
  }, [city, limit])

  const fetchPopularCafes = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/cafes/popular?city=${encodeURIComponent(city)}&limit=${limit}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch popular cafes')
      }
      
      const data = await response.json()
      setCafes(data.cafes || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 text-orange-500 animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-lg xs:text-xl sm:text-2xl lg:text-3xl text-amber-800">
            Populaire cafés laden...
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-amber-200 rounded mx-auto w-3/4"></div>
            <div className="h-4 bg-amber-200 rounded mx-auto w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !cafes.length) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="text-center">
          <CardTitle className="text-lg xs:text-xl sm:text-2xl text-red-800">
            Geen cafés gevonden
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm xs:text-base text-red-600">
            {error || `Geen populaire cafés gevonden in ${city}`}
          </p>
          <Button 
            onClick={fetchPopularCafes} 
            variant="outline" 
            size="sm"
            className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
          >
            Opnieuw proberen
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="text-center pb-4 sm:pb-6">
        <CardTitle className="flex items-center justify-center gap-2 text-amber-800 text-lg xs:text-xl sm:text-2xl lg:text-3xl xl:text-4xl mb-2 sm:mb-3">
          <TrendingUp className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-orange-500" />
          Betekenisvolle Locaties in {city}
        </CardTitle>
        <p className="text-sm text-gray-600 mb-4">
          Ontdek waar je je meetups kunt plannen - cafés waar anderen al betekenisvolle momenten hebben gedeeld
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="sm" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <Link href="/map">
              <MapPin className="w-4 h-4 mr-2" />
              Bekijk Kaart
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300">
            <Link href="/create">
              <Coffee className="w-4 h-4 mr-2" />
              Plan een Meetup
            </Link>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Map Toggle */}
        <div className="flex justify-center">
          <Button
            onClick={() => setShowMap(!showMap)}
            variant="outline"
            size="sm"
            className="border-amber-300 text-amber-700 hover:bg-amber-50 text-sm xs:text-base px-4 sm:px-6 py-2 sm:py-3"
          >
            {showMap ? 'Verberg Kaart' : 'Toon Kaart'}
          </Button>
        </div>

        {/* Map View */}
        {showMap && (
          <div className="h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] rounded-lg overflow-hidden border border-amber-200 shadow-md">
            <Suspense fallback={
              <div className="w-full h-full bg-amber-100 flex items-center justify-center">
                <div className="text-amber-600 text-sm xs:text-base">Kaart laden...</div>
              </div>
            }>
              <AnemiMap />
            </Suspense>
          </div>
        )}

        {/* Cafes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {cafes.slice(0, limit).map((cafe) => (
            <div key={cafe.id} className="bg-white rounded-lg border border-amber-200 p-3 sm:p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <h3 className="font-semibold text-sm xs:text-base sm:text-lg lg:text-xl text-gray-900 flex-1 mr-2">
                  {cafe.name}
                </h3>
                {cafe.trending && (
                  <Badge variant="secondary" className="text-xs xs:text-sm bg-orange-100 text-orange-700 border-orange-200">
                    Trending 🔥
                  </Badge>
                )}
              </div>
              
              <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-2 sm:mb-3 line-clamp-2">
                {cafe.address}
              </p>
              
              <div className="flex items-center justify-between text-xs xs:text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 xs:w-4 xs:h-4 text-amber-500 fill-current" />
                  <span className="font-medium">{cafe.rating}</span>
                  <span className="text-gray-500">({cafe.reviewCount})</span>
                </div>
                
                <div className="text-gray-500">
                  {cafe.recentMeetups} recent
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Button asChild className="bg-amber-600 hover:bg-amber-700 text-sm xs:text-base sm:text-lg px-6 sm:px-8 lg:px-10 py-3 sm:py-4">
            <Link href="/create">
              <MapPin className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 mr-2" />
              Plan een Herverbinding
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
