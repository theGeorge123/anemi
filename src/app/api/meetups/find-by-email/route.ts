import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find meetups where the user is the invitee (by email) - include all statuses
    const meetups = await prisma.meetupInvite.findMany({
      where: {
        inviteeEmail: email.toLowerCase().trim(),
        deletedAt: null,
        // Include all statuses: pending, accepted, declined
        status: {
          in: ['pending', 'accepted', 'declined']
        }
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
        chosenTime: meetup.chosenTime,
        inviteeName: meetup.inviteeName,
        inviteeEmail: meetup.inviteeEmail
      }))
    })
  } catch (error) {
    console.error('❌ Error finding meetups by email:', error)
    return NextResponse.json(
      { error: 'Failed to find meetups' },
      { status: 500 }
    )
  }
} 