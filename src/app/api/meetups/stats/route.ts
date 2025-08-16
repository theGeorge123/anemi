import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const month = searchParams.get('month') // Format: YYYY-MM
    
    if (!city) {
      return NextResponse.json(
        { error: 'City parameter is required' },
        { status: 400 }
      )
    }

    // Get current month if not specified
    const currentDate = new Date()
    const currentMonth = month || `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
    
    // Parse month to get start and end dates
    const [year, monthNum] = currentMonth.split('-').map(Number)
    if (!year || !monthNum) {
      return NextResponse.json(
        { error: 'Invalid month format' },
        { status: 400 }
      )
    }
    const startDate = new Date(year, monthNum - 1, 1)
    const endDate = new Date(year, monthNum, 0, 23, 59, 59)

    // Get meetups count for the specified city and month
    const meetupsCount = await prisma.meetupInvite.count({
      where: {
        cafe: {
          city: city
        },
        status: {
          in: ['confirmed', 'pending']
        },
        deletedAt: null,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    })

    // Get total meetups for the city (all time)
    const totalMeetups = await prisma.meetupInvite.count({
      where: {
        cafe: {
          city: city
        },
        status: {
          in: ['confirmed', 'pending']
        },
        deletedAt: null
      }
    })

    // Get upcoming meetups (next 30 days)
    const today = new Date().toISOString().split('T')[0] || ''
    
    // First get all meetups with chosen dates, then filter in JavaScript
    const meetupsWithDates = await prisma.meetupInvite.findMany({
      where: {
        cafe: {
          city: city
        },
        status: {
          in: ['confirmed', 'pending']
        },
        deletedAt: null,
        chosenDate: {
          not: null
        }
      },
      select: {
        chosenDate: true
      }
    })
    
    // Filter for upcoming meetups (chosenDate >= today)
    const upcomingMeetups = meetupsWithDates.filter(meetup => 
      meetup.chosenDate && meetup.chosenDate >= today
    ).length

    return NextResponse.json({
      city,
      month: currentMonth,
      meetupsThisMonth: meetupsCount,
      totalMeetups,
      upcomingMeetups,
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    })
  } catch (error) {
    console.error('❌ Error fetching meetup stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch meetup statistics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
