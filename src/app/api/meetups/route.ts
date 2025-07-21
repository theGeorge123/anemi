import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get meetups created by the user
    const meetups = await prisma.meetupInvite.findMany({
      where: {
        createdBy: user.email,
        deletedAt: null
      },
      include: {
        cafe: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      meetups: meetups.map(meetup => ({
        id: meetup.id,
        token: meetup.token,
        organizerName: meetup.organizerName,
        organizerEmail: meetup.organizerEmail,
        status: meetup.status,
        createdAt: meetup.createdAt,
        expiresAt: meetup.expiresAt,
        cafe: meetup.cafe,
        availableDates: meetup.availableDates,
        availableTimes: meetup.availableTimes,
        chosenDate: meetup.chosenDate,
        inviteeName: meetup.inviteeName,
        inviteeEmail: meetup.inviteeEmail
      }))
    })
  } catch (error) {
    console.error('Error fetching meetups:', error)
    return NextResponse.json(
      { error: 'Failed to fetch meetups' },
      { status: 500 }
    )
  }
} 