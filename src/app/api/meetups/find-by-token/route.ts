import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Find meetup by token
    const meetup = await prisma.meetupInvite.findUnique({
      where: {
        token: token.trim(),
        deletedAt: null
      },
      include: {
        cafe: true
      }
    })

    if (!meetup) {
      return NextResponse.json(
        { error: 'Geen meetup gevonden met deze uitnodigingscode' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      meetups: [{
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
      }]
    })
  } catch (error) {
    console.error('❌ Error finding meetup by token:', error)
    return NextResponse.json(
      { error: 'Failed to find meetup' },
      { status: 500 }
    )
  }
}