import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Check if we have the required environment variables
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'DATABASE_URL environment variable not set'
        },
        { status: 500 }
      )
    }

    const { prisma } = await import('@/lib/prisma')
    
    // Test basic database connection
    const count = await prisma.coffeeShop.count()
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      coffeeShopCount: count
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 