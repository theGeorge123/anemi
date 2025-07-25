import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params
    const { inviteeName, inviteeEmail, reason } = await request.json()

    // Validate required fields
    if (!inviteeName || !inviteeEmail) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Find the invite
    const invite = await prisma.meetupInvite.findUnique({
      where: { token }
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

    // Check if invite is already declined
    if (invite.status === 'declined') {
      return NextResponse.json(
        { error: 'Invite already declined' },
        { status: 409 }
      )
    }

    // Update invite status to declined
    const updatedInvite = await prisma.meetupInvite.update({
      where: { token },
      data: {
        status: 'declined',
        inviteeName,
        inviteeEmail,
        declineReason: reason || null,
        declinedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Invite declined successfully',
      invite: {
        token: updatedInvite.token,
        status: updatedInvite.status,
        declinedAt: updatedInvite.declinedAt
      }
    })
  } catch (error) {
    console.error('Error declining invite:', error)
    return NextResponse.json(
      { error: 'Failed to decline invite' },
      { status: 500 }
    )
  }
} 