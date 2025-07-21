import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    
    const body = await request.json()
    const {
      organizerName,
      organizerEmail,
      city,
      dates,
      times,
      dateTimePreferences,
      priceRange,
      viewType,
      cafeId
    } = body
    
    // Get user email from request body if not authenticated
    let userEmail = user?.email || organizerEmail
    
    if (!userEmail) {
      return NextResponse.json(
        { error: 'Unauthorized - No user email found' },
        { status: 401 }
      )
    }

    // Validate required fields
    if (!organizerName || !organizerEmail || !city || !dates || !times) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate unique token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    
    // Set expiration to 7 days from now
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    // Create invite in database
    const invite = await prisma.meetupInvite.create({
      data: {
        token,
        organizerName,
        organizerEmail,
        cafeId: cafeId || '', // Use empty string if no cafe selected
        availableDates: dates,
        availableTimes: times,
        status: 'pending',
        expiresAt,
        createdBy: userEmail
      }
    })

    return NextResponse.json({
      success: true,
      invite: {
        token: invite.token,
        expiresAt: invite.expiresAt,
        inviteUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3003'}/invite/${token}`
      }
    })
  } catch (error) {
    console.error('Error generating invite:', error)
    return NextResponse.json(
      { error: 'Failed to generate invite' },
      { status: 500 }
    )
  }
} 