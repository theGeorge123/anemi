import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    
    // Force dynamic rendering
    const url = request.url

    if (!city) {
      return NextResponse.json(
        { error: 'City parameter is required' },
        { status: 400 }
      )
    }

    const cafes = await prisma.coffeeShop.findMany({
      where: {
        city: city,
        isVerified: true
      },
      orderBy: [
        { rating: 'desc' },
        { reviewCount: 'desc' }
      ],
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
        isVerified: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      cafes,
      count: cafes.length
    })
  } catch (error) {
    console.error('Error fetching cafes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cafes' },
      { status: 500 }
    )
  }
} 