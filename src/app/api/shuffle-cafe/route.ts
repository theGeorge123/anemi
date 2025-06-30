import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { priceRange, city } = await request.json()

    // Build where clause
    const whereClause: any = {
      isVerified: true,
      deletedAt: null
    }

    // Add price range filter if provided
    if (priceRange) {
      whereClause.priceRange = priceRange
    }

    // Add city filter if provided
    if (city) {
      whereClause.city = city
    }

    // Get count of cafes with the specified criteria
    const count = await prisma.coffeeShop.count({
      where: whereClause
    })

    if (count === 0) {
      return NextResponse.json(
        { error: `No coffee shops found in ${city || 'this area'} for your criteria` },
        { status: 404 }
      )
    }

    // Get a random cafe
    const randomSkip = Math.floor(Math.random() * count)
    
    const cafe = await prisma.coffeeShop.findFirst({
      where: whereClause,
      skip: randomSkip,
      select: {
        id: true,
        name: true,
        city: true,
        address: true,
        priceRange: true,
        rating: true,
        hours: true,
        isVerified: true,
        description: true
      }
    })

    if (!cafe) {
      return NextResponse.json(
        { error: 'Failed to find a coffee shop' },
        { status: 404 }
      )
    }

    // Format hours for display
    const formatHours = (hours: any) => {
      if (!hours) return 'Hours not available'
      if (typeof hours === 'string') return hours
      if (typeof hours === 'object') {
        // Simple format for now - could be enhanced
        return 'Open daily'
      }
      return 'Hours not available'
    }

    const responseCafe = {
      ...cafe,
      openHours: formatHours(cafe.hours)
    }

    return NextResponse.json(responseCafe)
  } catch (error) {
    console.error('Error in shuffle-cafe:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 