import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const random = searchParams.get('random') === 'true'
    
    console.log('🔍 Cafe API called with:', { city, random })
    
    if (!city) {
      console.log('❌ No city parameter provided')
      return NextResponse.json(
        { error: 'City parameter is required' },
        { status: 400 }
      )
    }

    let cafes
    if (random) {
      // Get a random cafe
      console.log('🎲 Fetching random cafe for city:', city)
      const allCafes = await prisma.coffeeShop.findMany({
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
          isVerified: true,
          createdAt: true,
          updatedAt: true
        }
      })
      
      console.log('📊 Found', allCafes.length, 'cafes for random selection')
      
      // Select a random cafe
      const randomIndex = Math.floor(Math.random() * allCafes.length)
      cafes = allCafes.length > 0 ? [allCafes[randomIndex]] : []
      
      console.log('🎯 Selected random cafe:', cafes[0]?.name || 'None')
    } else {
      // Get all cafes ordered by rating
      console.log('📋 Fetching all cafes for city:', city)
      cafes = await prisma.coffeeShop.findMany({
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
      
      console.log('📊 Found', cafes.length, 'cafes for city:', city)
      
      // Log cafe details for debugging
      cafes.forEach((cafe, index) => {
        console.log(`☕ ${index + 1}. ${cafe.name} - ${cafe.address} (${cafe.latitude}, ${cafe.longitude})`)
      })
    }

    return NextResponse.json({
      cafes,
      count: cafes.length,
      city: city,
      debug: {
        totalFound: cafes.length,
        withCoordinates: cafes.filter(c => c && c.latitude && c.longitude).length,
        averageRating: cafes.length > 0 ? cafes.reduce((sum, c) => sum + (c?.rating || 0), 0) / cafes.length : 0
      }
    })
  } catch (error) {
    console.error('❌ Error fetching cafes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cafes', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 