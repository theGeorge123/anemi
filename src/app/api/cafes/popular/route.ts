import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    if (!city) {
      return NextResponse.json(
        { error: 'City parameter is required' },
        { status: 400 }
      )
    }

    // Get popular cafes based on rating, review count, and meetup activity
    const popularCafes = await prisma.coffeeShop.findMany({
      where: {
        city: city,
        isVerified: true
      },
      select: {
        id: true,
        name: true,
        description: true,
        city: true,
        address: true,
        latitude: true,
        longitude: true,
        phone: true,
        website: true,
        rating: true,
        reviewCount: true,
        priceRange: true,
        features: true,
        hours: true,
        photos: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            meetups: true,
            meetupInvites: true,
            reviews: true,
            favorites: true
          }
        }
      },
      orderBy: [
        { rating: 'desc' },
        { reviewCount: 'desc' }
      ],
      take: limit
    })

    // Calculate popularity score and add meetup activity
    const cafesWithPopularity = await Promise.all(
      popularCafes.map(async (cafe) => {
        // Get recent meetup activity (last 30 days)
        const recentMeetups = await prisma.meetupInvite.count({
          where: {
            cafeId: cafe.id,
            status: {
              in: ['confirmed', 'pending']
            },
            deletedAt: null,
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        })

        // Calculate popularity score (rating * review count + recent activity)
        const popularityScore = (cafe.rating * cafe.reviewCount) + (recentMeetups * 10)

        return {
          ...cafe,
          recentMeetups,
          popularityScore,
          trending: recentMeetups > 0
        }
      })
    )

    // Sort by popularity score
    cafesWithPopularity.sort((a, b) => b.popularityScore - a.popularityScore)

    return NextResponse.json({
      cafes: cafesWithPopularity,
      count: cafesWithPopularity.length,
      city: city,
      trending: cafesWithPopularity.filter(cafe => cafe.trending).length
    })
  } catch (error) {
    console.error('❌ Error fetching popular cafes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch popular cafes', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
