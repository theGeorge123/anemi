import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { priceRange } = await request.json()

    // Map frontend price range to Prisma enum values
    const mapPriceRange = (range: string) => {
      switch (range) {
        case 'cheap': return 'BUDGET'
        case 'normal': return 'MODERATE'
        case 'expensive': return 'EXPENSIVE'
        default: return 'MODERATE'
      }
    }

    const mappedPriceRange = mapPriceRange(priceRange)

    // Get count of cafes with the specified price range
    const count = await prisma.coffeeShop.count({
      where: {
        priceRange: mappedPriceRange,
        isVerified: true,
        deletedAt: null
      }
    })

    if (count === 0) {
      return NextResponse.json(
        { error: 'No coffee shops found for this price range' },
        { status: 404 }
      )
    }

    // Get a random cafe
    const randomSkip = Math.floor(Math.random() * count)
    
    const cafe = await prisma.coffeeShop.findFirst({
      where: {
        priceRange: mappedPriceRange,
        isVerified: true,
        deletedAt: null
      },
      skip: randomSkip,
      select: {
        id: true,
        name: true,
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

    // Map the price range back to frontend format
    const mapPriceRangeBack = (range: string) => {
      switch (range) {
        case 'BUDGET': return 'cheap'
        case 'MODERATE': return 'normal'
        case 'EXPENSIVE': return 'expensive'
        case 'LUXURY': return 'expensive'
        default: return 'normal'
      }
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
      priceRange: mapPriceRangeBack(cafe.priceRange),
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