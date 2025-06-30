import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params
    const { chosenDate } = await request.json()

    // Validate the invite exists and is not expired
    const invite = await prisma.meetupInvite.findFirst({
      where: {
        token: token,
        expiresAt: {
          gt: new Date()
        },
        deletedAt: null
      }
    })

    if (!invite) {
      return NextResponse.json(
        { error: 'Invite not found or has expired' },
        { status: 404 }
      )
    }

    if (invite.status === 'confirmed') {
      return NextResponse.json(
        { error: 'Invite has already been confirmed' },
        { status: 400 }
      )
    }

    // Validate that the chosen date is in the available dates
    if (!invite.availableDates.includes(chosenDate)) {
      return NextResponse.json(
        { error: 'Invalid date selected' },
        { status: 400 }
      )
    }

    // Update the invite with the chosen date
    await prisma.meetupInvite.update({
      where: {
        id: invite.id
      },
      data: {
        chosenDate: chosenDate,
        status: 'confirmed',
        confirmedAt: new Date()
      }
    })

    return NextResponse.json({ 
      success: true,
      chosenDate: chosenDate
    })
  } catch (error) {
    console.error('Error in invite confirm:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 