import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { shuffleCafeSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting (10 requests per 10 seconds)
    const rateLimitResult = await rateLimit(request, 10, 10000)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validationResult = shuffleCafeSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { prisma } = await import('@/lib/prisma')
    const { priceRange, city } = validationResult.data

    // Build where clause
    const whereClause: any = {
      isVerified: true
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
        { error: `No coffee shops found in ${city || 'this area'} for your criteria`, debug: { whereClause } },
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
        { error: 'Failed to find a coffee shop', debug: { whereClause, randomSkip, count } },
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
      hours: formatHours(cafe.hours)
    }

    return NextResponse.json(responseCafe)
  } catch (error) {
    // Enhanced error logging for Vercel
    console.error('Error in shuffle-cafe:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : error, stack: error instanceof Error ? error.stack : undefined },
      { status: 500 }
    )
  }
} 