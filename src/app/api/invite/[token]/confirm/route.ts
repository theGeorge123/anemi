import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const { sendCalendarInvite } = await import('@/lib/email')
    const { token } = params
    const { chosenDate, chosenTime, inviteeName, inviteeEmail } = await request.json()

    // Validate the invite exists and is not expired
    const invite = await prisma.meetupInvite.findFirst({
      where: {
        token: token,
        expiresAt: {
          gt: new Date()
        },
        deletedAt: null
      },
      include: {
        cafe: true
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

    // Update the invite with the chosen date (only field that exists in current schema)
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

    // Create the event date by combining chosen date and time
    const eventDateTime = new Date(chosenDate)
    if (chosenTime) {
      const [hours, minutes] = chosenTime.split(':').map(Number)
      eventDateTime.setHours(hours, minutes, 0, 0)
    } else {
      // Default to 2 PM if no time specified
      eventDateTime.setHours(14, 0, 0, 0)
    }

    const eventEndTime = new Date(eventDateTime)
    eventEndTime.setHours(eventEndTime.getHours() + 2) // 2 hour duration

    // Send calendar invites to both parties
    try {
      // Send to organizer
      await sendCalendarInvite({
        to: invite.organizerEmail,
        eventTitle: `Coffee Meetup with ${inviteeName}`,
        eventDescription: `Meeting for coffee at ${invite.cafe.name}`,
        eventLocation: invite.cafe.address,
        eventStartTime: eventDateTime.toISOString(),
        eventEndTime: eventEndTime.toISOString(),
        attendeeName: invite.organizerName
      })

      // Send to invitee
      await sendCalendarInvite({
        to: inviteeEmail,
        eventTitle: `Coffee Meetup with ${invite.organizerName}`,
        eventDescription: `Meeting for coffee at ${invite.cafe.name}`,
        eventLocation: invite.cafe.address,
        eventStartTime: eventDateTime.toISOString(),
        eventEndTime: eventEndTime.toISOString(),
        attendeeName: inviteeName
      })
    } catch (emailError) {
      console.error('Failed to send calendar invites:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ 
      success: true,
      chosenDate: chosenDate,
      chosenTime: chosenTime,
      eventDateTime: eventDateTime.toISOString()
    })
  } catch (error) {
    console.error('Error in invite confirm:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 