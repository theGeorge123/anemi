'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Coffee, Users, Calendar, TrendingUp, MapPin } from 'lucide-react'
import Link from 'next/link'

interface MeetupStats {
  city: string
  month: string
  meetupsThisMonth: number
  totalMeetups: number
  upcomingMeetups: number
  period: {
    start: string
    end: string
  }
}

interface MeetupStatsProps {
  city: string
  month?: string
}

export default function MeetupStats({ city, month }: MeetupStatsProps) {
  const [stats, setStats] = useState<MeetupStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMeetupStats = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          city: city
        })
        
        if (month) {
          params.append('month', month)
        }
        
        const response = await fetch(`/api/meetups/stats?${params}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch meetup statistics')
        }
        
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching meetup stats:', error)
        setError('Failed to load meetup statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchMeetupStats()
  }, [city, month])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coffee className="w-5 h-5" />
            Meetup statistieken laden...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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

  if (!stats) {
    return null
  }

  // Format month for display
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-')
    if (!year || !month) return monthStr
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })
  }

  // Get month name in Dutch
  const monthNames: { [key: string]: string } = {
    '01': 'januari', '02': 'februari', '03': 'maart', '04': 'april',
    '05': 'mei', '06': 'juni', '07': 'juli', '08': 'augustus',
    '09': 'september', '10': 'oktober', '11': 'november', '12': 'december'
  }

  const currentMonth = monthNames[new Date().getMonth() + 1] || 'deze maand'

  return (
    <Card className="w-full bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <Coffee className="w-6 h-6" />
          Herverbindingen in {city}
        </CardTitle>
        <p className="text-sm text-amber-700">
          Zie hoeveel mensen al bezig zijn met het herverbinden
        </p>
      </CardHeader>
      
      <CardContent>
        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* This Month */}
          <div className="text-center p-4 bg-white rounded-lg border border-amber-200">
            <div className="text-3xl font-bold text-amber-600 mb-2">
              {stats.meetupsThisMonth}
            </div>
            <div className="text-sm text-amber-700 font-medium">
              Herverbindingen {currentMonth}
            </div>
            <div className="text-xs text-amber-600 mt-1">
              in {city}
            </div>
          </div>

          {/* Total */}
          <div className="text-center p-4 bg-white rounded-lg border border-amber-200">
            <div className="text-3xl font-bold text-amber-600 mb-2">
              {stats.totalMeetups}
            </div>
            <div className="text-sm text-amber-700 font-medium">
              Totaal herverbindingen
            </div>
            <div className="text-xs text-amber-600 mt-1">
              ooit gepland
            </div>
          </div>

          {/* Upcoming */}
          <div className="text-center p-4 bg-white rounded-lg border border-amber-200">
            <div className="text-3xl font-bold text-amber-600 mb-2">
              {stats.upcomingMeetups}
            </div>
            <div className="text-sm text-amber-700 font-medium">
              Komende herverbindingen
            </div>
            <div className="text-xs text-amber-600 mt-1">
              volgende 30 dagen
            </div>
          </div>
        </div>

        {/* Highlight Message */}
        {stats.meetupsThisMonth > 0 && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>
                <strong>{stats.meetupsThisMonth} herverbindingen {currentMonth} in {city}!</strong>
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-amber-600 hover:bg-amber-700">
            <Link href="/create">
              <Coffee className="w-4 h-4 mr-2" />
              Plan je eigen herverbinding
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <Users className="w-4 h-4 mr-2" />
              Bekijk mijn herverbindingen
            </Link>
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-xs text-amber-600">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>Populaire locaties</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Flexibele planning</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>Grote community</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
