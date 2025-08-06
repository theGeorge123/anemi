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

    // Find meetups where the user is the invitee (by email) - include ALL statuses
    const meetups = await prisma.meetupInvite.findMany({
      where: {
        inviteeEmail: email.toLowerCase().trim(),
        deletedAt: null,
        // Include ALL statuses: pending, confirmed, declined, expired
        status: {
          in: ['pending', 'confirmed', 'declined', 'expired']
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
      meetups: meetups.map(meetup => {
        const { createdAt, expiresAt, ...rest } = meetup;
        return {
          ...rest,
          createdAt: createdAt.toISOString(),
          expiresAt: expiresAt.toISOString(),
        };
      }),
    })
  } catch (error) {
    console.error('❌ Error finding meetups by email:', error)
    return NextResponse.json(
      { error: 'Failed to find meetups' },
      { status: 500 }
    )
  }
} 