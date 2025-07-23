import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendMeetupConfirmationEmail } from '@/lib/email'
import { createClient } from '@supabase/supabase-js'

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params
    const { inviteeName, inviteeEmail, selectedDate, selectedTime, userId } = await request.json()

    // Validate required fields
    if (!inviteeName || !inviteeEmail) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Validate date and time selection
    if (!selectedDate || !selectedTime) {
      return NextResponse.json(
        { error: 'Date and time selection are required' },
        { status: 400 }
      )
    }

    // Find the invite
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

    // Check if invite is already confirmed
    if (invite.status === 'confirmed') {
      return NextResponse.json(
        { error: 'Invite already confirmed' },
        { status: 409 }
      )
    }

    // Update invite status
    const updatedInvite = await prisma.meetupInvite.update({
      where: { token },
      data: {
        status: 'confirmed',
        inviteeName,
        inviteeEmail,
        chosenDate: selectedDate,
        chosenTime: selectedTime,
        confirmedAt: new Date(),
        ...(userId && { inviteeUserId: userId }) // Store user ID if provided
      },
      include: {
        cafe: true
      }
    })

    // Send confirmation emails to both parties
    try {
      await sendMeetupConfirmationEmail({
        organizerName: invite.organizerName,
        organizerEmail: invite.organizerEmail,
        inviteeName,
        inviteeEmail,
        cafe: {
          name: invite.cafe.name,
          address: invite.cafe.address,
          ...(invite.cafe.description && { description: invite.cafe.description })
        },
        availableDates: invite.availableDates,
        availableTimes: invite.availableTimes,
        chosenDate: selectedDate,
        chosenTime: selectedTime
      })
    } catch (emailError) {
      console.error('Error sending confirmation emails:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Invite accepted successfully',
      invite: {
        token: updatedInvite.token,
        status: updatedInvite.status,
        confirmedAt: updatedInvite.confirmedAt
      }
    })
  } catch (error) {
    console.error('Error accepting invite:', error)
    return NextResponse.json(
      { error: 'Failed to accept invite' },
      { status: 500 }
    )
  }
} 