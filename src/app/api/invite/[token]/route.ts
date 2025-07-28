import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params

    const invite = await prisma.meetupInvite.findUnique({
      where: { token },
      include: {
        cafe: true
      }
    })

    if (!invite) {
      return NextResponse.json(
        { error: 'Invite not found' },
        { status: 404 }
      )
    }

    // Check if invite is expired
    if (new Date() > invite.expiresAt) {
      return NextResponse.json(
        { error: 'Invite has expired' },
        { status: 410 }
      )
    }

    return NextResponse.json({
      invite: {
        token: invite.token,
        organizerName: invite.organizerName,
        organizerEmail: invite.organizerEmail,
        cafeId: invite.cafeId,
        availableDates: invite.availableDates,
        availableTimes: invite.availableTimes,
        dateTimePreferences: invite.dateTimePreferences as Record<string, string[]> | null,
        status: invite.status,
        expiresAt: invite.expiresAt,
        cafe: invite.cafe
      }
    })
  } catch (error) {
    console.error('Error fetching invite:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invite' },
      { status: 500 }
    )
  }
} 