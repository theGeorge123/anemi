'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
        <CardTitle className="text-lg sm:text-xl font-bold text-amber-800 mb-2">
          Meetups in {city}
        </CardTitle>
        <CardDescription className="text-sm text-amber-600 mb-4">
          Bekijk de statistieken van meetups in {city}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-2xl font-bold text-amber-800">{stats.meetupsThisMonth}</div>
            <div className="text-xs text-amber-600">Meetups {currentMonth}</div>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-2xl font-bold text-amber-800">{stats.totalMeetups}</div>
            <div className="text-xs text-amber-600">Totaal meetups</div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <Button asChild size="sm" className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <Link href="/create">
              <Coffee className="w-4 h-4 mr-2" />
              Plan je eigen meetup
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="sm" className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300">
            <Link href="/dashboard">
              <Calendar className="w-4 h-4 mr-2" />
              Bekijk mijn meetups
            </Link>
          </Button>
        </div>
        
        {/* Encouragement */}
        <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200 text-center">
          <p className="text-sm text-amber-800 font-medium">
            <strong>{stats.meetupsThisMonth} meetups {currentMonth} in {city}!</strong>
          </p>
          <p className="text-xs text-amber-600 mt-1">
            Doe mee en plan je eigen ontmoeting
          </p>
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
